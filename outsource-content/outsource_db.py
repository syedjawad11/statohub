#!/usr/bin/env python3
"""statohub.com outsourced content pipeline CLI (Python 3 stdlib only).

The board (outsource_content.db) tracks the separate babylovegrowth ingestion
queue from calendar import through fetch, processing, review, and publication.

Usage:
    python outsource-content/outsource_db.py init
    python outsource-content/outsource_db.py import-calendar <path-to-json>
    python outsource-content/outsource_db.py list [--status S] [--category C]
    python outsource-content/outsource_db.py show <slug>
    python outsource-content/outsource_db.py map <slug> <babylovegrowth_id> [--force]
    python outsource-content/outsource_db.py fetch <slug>
    python outsource-content/outsource_db.py processed <slug> --mdx-path P
        --images-removed N --images-converted N --citations-stripped N
        --source-count N
    python outsource-content/outsource_db.py set-status <slug> <status>
    python outsource-content/outsource_db.py log-review <slug> <pass|fail> "notes"
    python outsource-content/outsource_db.py stats

Statuses: queued -> fetched -> processing -> in_review -> changes_requested
          -> approved -> published, plus terminal blocked.
"""
import argparse
import json
import re
import sqlite3
import sys
from pathlib import Path

# `brief` emits non-ASCII (e.g. the FLAGGED marker), which raises
# UnicodeEncodeError on a Windows console defaulting to cp1252. Force UTF-8 on
# our own streams rather than stripping the characters.
for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding="utf-8")
    except (AttributeError, ValueError):  # already-wrapped or redirected stream
        pass

from babylovegrowth_client import APIClientError, get_article


HERE = Path(__file__).resolve().parent
REPO_ROOT = HERE.parent
DB_PATH = HERE / "outsource_content.db"
SCHEMA_PATH = HERE / "schema.sql"
RAW_DIR = HERE / "raw"

STATUSES = [
    "queued", "fetched", "processing", "in_review",
    "changes_requested", "approved", "published", "blocked",
]


def connect():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def _require_article(cur, slug):
    row = cur.execute(
        "SELECT * FROM outsource_articles WHERE slug=?", (slug,)
    ).fetchone()
    if not row:
        sys.exit(f"No outsourced article '{slug}'")
    return row


def _repo_relative(path):
    try:
        return path.resolve().relative_to(REPO_ROOT).as_posix()
    except ValueError:
        return str(path)


# ---------------------------------------------------------------------- init
def cmd_init(args):
    conn = connect()
    try:
        conn.executescript(SCHEMA_PATH.read_text(encoding="utf-8"))
        conn.commit()
    finally:
        conn.close()
    print(f"Schema applied to {DB_PATH.name}")


def cmd_import_calendar(args):
    calendar_path = Path(args.path)
    try:
        data = json.loads(calendar_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        sys.exit(f"Could not read calendar '{calendar_path}': {exc}")

    articles = data.get("articles") if isinstance(data, dict) else None
    if not isinstance(articles, list):
        sys.exit("Calendar must be a JSON object with an 'articles' list.")

    required = ("queue_position", "day_label", "title", "slug", "category_slug")
    new_count = 0
    updated_count = 0
    conn = connect()
    cur = conn.cursor()
    try:
        for index, article in enumerate(articles, start=1):
            if not isinstance(article, dict):
                sys.exit(f"Calendar article {index} must be an object.")
            missing = [key for key in required if key not in article]
            if missing:
                sys.exit(
                    f"Calendar article {index} is missing: {', '.join(missing)}"
                )
            if isinstance(article["queue_position"], bool) or not isinstance(
                article["queue_position"], int
            ):
                sys.exit(f"Calendar article {index} has a non-integer queue_position.")
            if not isinstance(article["day_label"], str):
                sys.exit(f"Calendar article {index} has an invalid day_label.")
            for key in ("title", "slug", "category_slug"):
                if not isinstance(article[key], str) or not article[key].strip():
                    sys.exit(f"Calendar article {index} has an invalid {key}.")

            exists = cur.execute(
                "SELECT 1 FROM outsource_articles WHERE slug=?", (article["slug"],)
            ).fetchone()
            if exists:
                updated_count += 1
            else:
                new_count += 1
            cur.execute(
                "INSERT INTO outsource_articles("
                "slug,title,category_slug,queue_position,day_label) "
                "VALUES(?,?,?,?,?) "
                "ON CONFLICT(slug) DO UPDATE SET "
                "title=excluded.title,category_slug=excluded.category_slug,"
                "queue_position=excluded.queue_position,day_label=excluded.day_label",
                (
                    article["slug"], article["title"], article["category_slug"],
                    article["queue_position"], article["day_label"],
                ),
            )
        conn.commit()
    finally:
        conn.close()
    print(
        f"Imported {len(articles)} articles "
        f"({new_count} new, {updated_count} updated)."
    )


# -------------------------------------------------------------------- queries
def cmd_list(args):
    conn = connect()
    cur = conn.cursor()
    query = (
        "SELECT status,queue_position,category_slug,slug "
        "FROM outsource_articles WHERE 1=1"
    )
    params = []
    if args.status:
        query += " AND status=?"
        params.append(args.status)
    if args.category:
        query += " AND category_slug=?"
        params.append(args.category)
    query += " ORDER BY queue_position"
    rows = cur.execute(query, params).fetchall()
    print(f"{'STATUS':<20}{'QUEUE':<8}{'CATEGORY':<32}SLUG")
    print("-" * 88)
    for row in rows:
        print(
            f"{row['status']:<20}{row['queue_position']:<8}"
            f"{row['category_slug']:<32}{row['slug']}"
        )
    print(f"\n{len(rows)} article(s).")
    conn.close()


def cmd_show(args):
    conn = connect()
    cur = conn.cursor()
    article = _require_article(cur, args.slug)
    print(f"# {article['title']}")
    for key in article.keys():
        print(f"{key + ':':<22}{article[key]}")
    reviews = cur.execute(
        "SELECT passed,notes,created_at FROM outsource_reviews "
        "WHERE article_slug=? ORDER BY id",
        (args.slug,),
    ).fetchall()
    if reviews:
        print(f"\nreview history ({len(reviews)}):")
        for review in reviews:
            result = "PASS" if review["passed"] else "CHANGES"
            print(
                f"  [{review['created_at']}] {result} - {review['notes']}"
            )
    conn.close()


def cmd_map(args):
    conn = connect()
    cur = conn.cursor()
    article = _require_article(cur, args.slug)
    current_id = article["babylovegrowth_id"]
    if current_id and current_id != args.babylovegrowth_id and not args.force:
        conn.close()
        sys.exit(
            f"Article '{args.slug}' is already mapped to babylovegrowth ID "
            f"'{current_id}'. Use --force to replace it."
        )
    cur.execute(
        "UPDATE outsource_articles SET babylovegrowth_id=?,"
        "updated_at=datetime('now') WHERE slug=?",
        (args.babylovegrowth_id, args.slug),
    )
    conn.commit()
    conn.close()
    print(f"{args.slug} -> babylovegrowth ID {args.babylovegrowth_id}")


def cmd_fetch(args):
    conn = connect()
    cur = conn.cursor()
    article = _require_article(cur, args.slug)
    article_id = article["babylovegrowth_id"]
    conn.close()
    if not article_id:
        sys.exit(
            f"Article '{args.slug}' has no babylovegrowth_id; run map first."
        )

    try:
        normalized, raw_response = get_article(article_id)
    except APIClientError as exc:
        sys.exit(f"Fetch failed: {exc}")

    RAW_DIR.mkdir(parents=True, exist_ok=True)
    raw_path = RAW_DIR / f"{args.slug}.json"
    raw_path.write_text(
        json.dumps(raw_response, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    conn = connect()
    try:
        conn.execute(
            "UPDATE outsource_articles SET raw_path=?,status='fetched',"
            "updated_at=datetime('now') WHERE slug=?",
            (_repo_relative(raw_path), args.slug),
        )
        conn.commit()
    finally:
        conn.close()

    if isinstance(raw_response, dict):
        payload = raw_response
        for wrapper in ("article", "data"):
            if isinstance(payload.get(wrapper), dict):
                payload = payload[wrapper]
                break
    else:
        payload = {}
    markdown = payload.get("content_markdown") or ""
    body = markdown or payload.get("content_html") or normalized["body_markdown"] or ""
    word_count = len(re.findall(r"\S+", str(markdown or normalized["body_markdown"])))
    image_count = len(re.findall(r"<img|!\[", str(body), flags=re.IGNORECASE))
    print(f"Fetched: {normalized.get('title') or article['title']}")
    print(f"Approx body words: {word_count}")
    print(f"Image references: {image_count}")
    print(f"Raw response: {_repo_relative(raw_path)}")


def cmd_processed(args):
    counts = (
        args.images_removed, args.images_converted,
        args.citations_stripped, args.source_count,
    )
    if any(count < 0 for count in counts):
        sys.exit("Processing counts must be non-negative integers.")
    conn = connect()
    cur = conn.cursor()
    _require_article(cur, args.slug)
    cur.execute(
        "UPDATE outsource_articles SET mdx_path=?,images_removed=?,"
        "images_converted=?,citations_stripped=?,source_count=?,"
        "status='in_review',updated_at=datetime('now') WHERE slug=?",
        (
            args.mdx_path, args.images_removed, args.images_converted,
            args.citations_stripped, args.source_count, args.slug,
        ),
    )
    conn.commit()
    conn.close()
    print(f"{args.slug} processed -> in_review")


def cmd_set_status(args):
    if args.new_status not in STATUSES:
        sys.exit(f"Invalid status. One of: {', '.join(STATUSES)}")
    conn = connect()
    cur = conn.cursor()
    _require_article(cur, args.slug)
    cur.execute(
        "UPDATE outsource_articles SET status=?,updated_at=datetime('now') "
        "WHERE slug=?",
        (args.new_status, args.slug),
    )
    conn.commit()
    conn.close()
    print(f"{args.slug} -> {args.new_status}")


def cmd_log_review(args):
    passed = 1 if args.result == "pass" else 0
    conn = connect()
    cur = conn.cursor()
    _require_article(cur, args.slug)
    cur.execute(
        "INSERT INTO outsource_reviews(article_slug,passed,notes) VALUES(?,?,?)",
        (args.slug, passed, args.notes),
    )
    new_status = "approved" if passed else "changes_requested"
    cur.execute(
        "UPDATE outsource_articles SET status=?,updated_at=datetime('now') "
        "WHERE slug=?",
        (new_status, args.slug),
    )
    conn.commit()
    conn.close()
    result = "PASS" if passed else "CHANGES_REQUESTED"
    print(f"Logged review for {args.slug}: {result} -> status {new_status}")


def cmd_stats(args):
    conn = connect()
    cur = conn.cursor()
    total = cur.execute(
        "SELECT COUNT(*) AS n FROM outsource_articles"
    ).fetchone()["n"]
    print(f"\nOutsource board: {total} articles")
    print("By status:")
    for row in cur.execute(
        "SELECT status,COUNT(*) AS n FROM outsource_articles "
        "GROUP BY status ORDER BY n DESC,status"
    ):
        print(f"  {row['status']:<20}{row['n']}")
    conn.close()


def main():
    parser = argparse.ArgumentParser(
        description="statohub outsourced content pipeline"
    )
    sub = parser.add_subparsers(dest="cmd", required=True)
    sub.add_parser("init").set_defaults(func=cmd_init)

    import_parser = sub.add_parser("import-calendar")
    import_parser.add_argument("path")
    import_parser.set_defaults(func=cmd_import_calendar)

    list_parser = sub.add_parser("list")
    list_parser.add_argument("--status")
    list_parser.add_argument("--category")
    list_parser.set_defaults(func=cmd_list)

    show_parser = sub.add_parser("show")
    show_parser.add_argument("slug")
    show_parser.set_defaults(func=cmd_show)

    map_parser = sub.add_parser("map")
    map_parser.add_argument("slug")
    map_parser.add_argument("babylovegrowth_id")
    map_parser.add_argument("--force", action="store_true")
    map_parser.set_defaults(func=cmd_map)

    fetch_parser = sub.add_parser("fetch")
    fetch_parser.add_argument("slug")
    fetch_parser.set_defaults(func=cmd_fetch)

    processed_parser = sub.add_parser("processed")
    processed_parser.add_argument("slug")
    processed_parser.add_argument("--mdx-path", required=True)
    processed_parser.add_argument("--images-removed", type=int, required=True)
    processed_parser.add_argument("--images-converted", type=int, required=True)
    processed_parser.add_argument("--citations-stripped", type=int, required=True)
    processed_parser.add_argument("--source-count", type=int, required=True)
    processed_parser.set_defaults(func=cmd_processed)

    status_parser = sub.add_parser("set-status")
    status_parser.add_argument("slug")
    status_parser.add_argument("new_status")
    status_parser.set_defaults(func=cmd_set_status)

    review_parser = sub.add_parser("log-review")
    review_parser.add_argument("slug")
    review_parser.add_argument("result", choices=("pass", "fail"))
    review_parser.add_argument("notes", nargs="?", default="")
    review_parser.set_defaults(func=cmd_log_review)

    sub.add_parser("stats").set_defaults(func=cmd_stats)
    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
