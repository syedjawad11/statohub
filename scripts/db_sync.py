#!/usr/bin/env python3
"""Keep the SQLite boards in git as text, not binary blobs.

The two boards (`content-ops/content.db`, `outsource-content/outsource_content.db`)
are authoring tools -- nothing in the Astro build reads them. They used to be
committed as binary, which is unpushable through the GitHub MCP server: its
`push_files` `content` parameter is a plain string, so any byte sequence that
isn't valid UTF-8 (a SQLite header starts `SQLite format 3\\x00`) cannot survive
the round-trip.

So the `.db` files are gitignored and a deterministic `.sql` dump is committed
alongside each one. The dump is plain UTF-8, diffs cleanly in review, and
rebuilds byte-for-byte-equivalent data.

    python3 scripts/db_sync.py dump      # .db -> .sql   (run before committing)
    python3 scripts/db_sync.py rebuild   # .sql -> .db   (run after cloning)
    python3 scripts/db_sync.py check     # verify .sql matches .db (exit 1 on drift)
"""

from __future__ import annotations

import sqlite3
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# (sqlite file, dump file) -- both relative to the repo root.
BOARDS = [
    (ROOT / "content-ops" / "content.db", ROOT / "content-ops" / "content.sql"),
    (
        ROOT / "outsource-content" / "outsource_content.db",
        ROOT / "outsource-content" / "outsource_content.sql",
    ),
]


def dump_text(db_path: Path) -> str:
    """Deterministic SQL dump of a board, newline-terminated."""
    conn = sqlite3.connect(db_path)
    try:
        return "\n".join(conn.iterdump()) + "\n"
    finally:
        conn.close()


def snapshot(conn: sqlite3.Connection) -> dict[str, list]:
    """Every user table's rows, for equivalence checks."""
    tables = [
        row[0]
        for row in conn.execute(
            "SELECT name FROM sqlite_master WHERE type='table' "
            "AND name NOT LIKE 'sqlite_%' ORDER BY name"
        )
    ]
    return {t: list(conn.execute(f"SELECT * FROM {t} ORDER BY rowid")) for t in tables}


def cmd_dump() -> int:
    for db_path, sql_path in BOARDS:
        if not db_path.exists():
            print(f"skip {db_path.name}: not present (run `rebuild` first)")
            continue
        sql_path.write_text(dump_text(db_path), encoding="utf-8")
        print(f"dumped {db_path.name} -> {sql_path.name} ({sql_path.stat().st_size} bytes)")
    return 0


def cmd_rebuild() -> int:
    force = "--force" in sys.argv
    for db_path, sql_path in BOARDS:
        if not sql_path.exists():
            sys.exit(f"missing dump: {sql_path}")
        if db_path.exists() and not force:
            print(f"skip {db_path.name}: already exists (use --force to overwrite)")
            continue
        if db_path.exists():
            db_path.unlink()
        conn = sqlite3.connect(db_path)
        try:
            conn.executescript(sql_path.read_text(encoding="utf-8"))
            conn.commit()
        finally:
            conn.close()
        print(f"rebuilt {sql_path.name} -> {db_path.name}")
    return 0


def cmd_check() -> int:
    drift = False
    for db_path, sql_path in BOARDS:
        if not db_path.exists():
            print(f"skip {db_path.name}: not present")
            continue
        if not sql_path.exists():
            print(f"DRIFT {db_path.name}: no committed dump")
            drift = True
            continue

        # Compare logical content, not dump text: rebuilding from the committed
        # dump must reproduce exactly the rows the live board holds.
        live = sqlite3.connect(db_path)
        rebuilt = sqlite3.connect(":memory:")
        try:
            rebuilt.executescript(sql_path.read_text(encoding="utf-8"))
            if snapshot(live) == snapshot(rebuilt):
                print(f"ok    {db_path.name} matches {sql_path.name}")
            else:
                print(f"DRIFT {db_path.name}: run `python3 scripts/db_sync.py dump`")
                drift = True
        finally:
            live.close()
            rebuilt.close()
    return 1 if drift else 0


COMMANDS = {"dump": cmd_dump, "rebuild": cmd_rebuild, "check": cmd_check}


def main() -> int:
    if len(sys.argv) < 2 or sys.argv[1] not in COMMANDS:
        sys.exit(f"usage: db_sync.py {{{'|'.join(COMMANDS)}}}")
    return COMMANDS[sys.argv[1]]()


if __name__ == "__main__":
    raise SystemExit(main())
