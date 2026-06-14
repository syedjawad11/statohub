#!/usr/bin/env python3
"""statohub.com content editorial board CLI (Python 3 stdlib only).

The board (content.db) tracks every planned article idea -> draft -> review ->
publish, holds the study's keyword map, and enforces the "one keyword -> one
article" cannibalization rule via a global UNIQUE index.

Usage:
    python content_db.py init
    python content_db.py seed
    python content_db.py list [--status S] [--phase N] [--category C] [--flagged]
    python content_db.py show <slug>
    python content_db.py brief <slug>
    python content_db.py next
    python content_db.py set-status <slug> <status>
    python content_db.py log-review <slug> <score> <pass|fail> "notes"
    python content_db.py stats

Statuses: planned -> briefed -> drafting -> in_review -> changes_requested
          -> approved -> published   (research_pending = stub, not writable yet)
"""
import argparse
import json
import sqlite3
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
DB_PATH = HERE / "content.db"
SCHEMA_PATH = HERE / "schema.sql"
SEED_PATH = HERE / "seed.json"
PLAYBOOK = ".claude/seo-playbook.md"  # repo-root relative

STATUSES = [
    "planned", "briefed", "drafting", "in_review",
    "changes_requested", "approved", "published", "research_pending",
]


def connect():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def norm(kw):
    return " ".join(kw.strip().lower().split())


# ---------------------------------------------------------------- init / seed
def cmd_init(args):
    conn = connect()
    conn.executescript(SCHEMA_PATH.read_text(encoding="utf-8"))
    conn.commit()
    conn.close()
    print(f"Schema applied to {DB_PATH.name}")


def cmd_seed(args):
    data = json.loads(SEED_PATH.read_text(encoding="utf-8"))
    conn = connect()
    cur = conn.cursor()
    try:
        for c in data["categories"]:
            cur.execute(
                "INSERT INTO categories(slug,title,description,nav_order) VALUES(?,?,?,?) "
                "ON CONFLICT(slug) DO UPDATE SET title=excluded.title,"
                "description=excluded.description,nav_order=excluded.nav_order",
                (c["slug"], c["title"], c.get("description", ""), c.get("nav_order", 0)),
            )
        for k in data["calculators"]:
            cur.execute(
                "INSERT INTO calculators(slug,title,engine,standalone,category_slug,"
                "tool_keyword,kd,volume,phase) VALUES(?,?,?,?,?,?,?,?,?) "
                "ON CONFLICT(slug) DO UPDATE SET title=excluded.title,engine=excluded.engine,"
                "standalone=excluded.standalone,category_slug=excluded.category_slug,"
                "tool_keyword=excluded.tool_keyword,kd=excluded.kd,volume=excluded.volume,"
                "phase=excluded.phase",
                (k["slug"], k["title"], k.get("engine", ""), 1 if k.get("standalone") else 0,
                 k.get("category_slug"), k.get("tool_keyword"), k.get("kd"),
                 k.get("volume"), k.get("phase")),
            )
        for a in data["articles"]:
            status = "research_pending" if a.get("phase") is None else "planned"
            # preserve a manually-advanced status across re-seeds
            row = cur.execute("SELECT status FROM articles WHERE slug=?", (a["slug"],)).fetchone()
            if row and row["status"] not in ("planned", "research_pending"):
                status = row["status"]
            cur.execute(
                "INSERT INTO articles(slug,title,category_slug,primary_keyword,phase,kd_min,"
                "kd_max,combined_volume,embed_calculator,standalone_calc,status,flagged,notes) "
                "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?) "
                "ON CONFLICT(slug) DO UPDATE SET title=excluded.title,"
                "category_slug=excluded.category_slug,primary_keyword=excluded.primary_keyword,"
                "phase=excluded.phase,kd_min=excluded.kd_min,kd_max=excluded.kd_max,"
                "combined_volume=excluded.combined_volume,embed_calculator=excluded.embed_calculator,"
                "standalone_calc=excluded.standalone_calc,status=excluded.status,"
                "flagged=excluded.flagged,notes=excluded.notes",
                (a["slug"], a["title"], a["category_slug"], a["primary_keyword"], a.get("phase"),
                 a.get("kd_min"), a.get("kd_max"), a.get("combined_volume"),
                 a.get("embed_calculator"), 1 if a.get("standalone_calc") else 0, status,
                 1 if a.get("flagged") else 0, a.get("notes", "")),
            )
            # rewrite this article's keywords (idempotent); global UNIQUE index guards cannibalization
            cur.execute("DELETE FROM keywords WHERE article_slug=?", (a["slug"],))
            primary = norm(a["primary_keyword"])
            seen = set()
            for kw in a.get("keywords", []):
                nk = norm(kw)
                if nk in seen:
                    continue
                seen.add(nk)
                try:
                    cur.execute(
                        "INSERT INTO keywords(article_slug,keyword,is_primary) VALUES(?,?,?)",
                        (a["slug"], nk, 1 if nk == primary else 0),
                    )
                except sqlite3.IntegrityError:
                    owner = cur.execute(
                        "SELECT article_slug FROM keywords WHERE keyword=?", (nk,)
                    ).fetchone()
                    conn.rollback()
                    sys.exit(
                        f"CANNIBALIZATION CONFLICT: keyword '{nk}' is mapped to both "
                        f"'{a['slug']}' and '{owner['article_slug'] if owner else '?'}'. "
                        f"Resolve in seed.json (one keyword -> one article)."
                    )
        conn.commit()
    finally:
        conn.close()
    print("Seed applied (0 cannibalization conflicts).")
    cmd_stats(args)


# ---------------------------------------------------------------- queries
def _kw_list(cur, slug):
    rows = cur.execute(
        "SELECT keyword,is_primary FROM keywords WHERE article_slug=? ORDER BY is_primary DESC,keyword",
        (slug,),
    ).fetchall()
    return rows


def cmd_list(args):
    conn = connect()
    cur = conn.cursor()
    q = ("SELECT slug,title,category_slug,phase,kd_min,kd_max,combined_volume,status,flagged "
         "FROM articles WHERE 1=1")
    p = []
    if args.status:
        q += " AND status=?"; p.append(args.status)
    if args.phase:
        q += " AND phase=?"; p.append(args.phase)
    if args.category:
        q += " AND category_slug=?"; p.append(args.category)
    if args.flagged:
        q += " AND flagged=1"
    q += " ORDER BY (phase IS NULL),phase,combined_volume DESC"
    rows = cur.execute(q, p).fetchall()
    print(f"{'STATUS':<18}{'PH':<4}{'KD':<8}{'VOL':>9}  SLUG")
    print("-" * 78)
    for r in rows:
        flag = " *" if r["flagged"] else ""
        kd = f"{r['kd_min']}-{r['kd_max']}" if r["kd_min"] is not None else "-"
        ph = r["phase"] if r["phase"] is not None else "-"
        vol = r["combined_volume"] or 0
        print(f"{r['status']:<18}{str(ph):<4}{kd:<8}{vol:>9}  {r['slug']}{flag}")
    print(f"\n{len(rows)} article(s). * = flagged (intent/thin - review before writing).")
    conn.close()


def cmd_show(args):
    conn = connect()
    cur = conn.cursor()
    a = cur.execute("SELECT * FROM articles WHERE slug=?", (args.slug,)).fetchone()
    if not a:
        sys.exit(f"No article '{args.slug}'")
    print(f"# {a['title']}")
    print(f"slug:            {a['slug']}  (URL: /{a['slug']}/)")
    print(f"category:        {a['category_slug']}")
    print(f"primary keyword: {a['primary_keyword']}")
    print(f"phase:           {a['phase']}   KD {a['kd_min']}-{a['kd_max']}   "
          f"combined US vol ~{a['combined_volume']}/mo")
    print(f"status:          {a['status']}   flagged: {bool(a['flagged'])}")
    print(f"embed calc:      {a['embed_calculator']}   standalone calc page: {bool(a['standalone_calc'])}")
    if a["review_score"] is not None:
        print(f"review score:    {a['review_score']}   word count: {a['word_count']}")
    if a["notes"]:
        print(f"notes:           {a['notes']}")
    kws = _kw_list(cur, args.slug)
    print(f"\nkeywords ({len(kws)}):")
    for k in kws:
        print(f"  - {k['keyword']}{'  (PRIMARY)' if k['is_primary'] else ''}")
    revs = cur.execute(
        "SELECT score,passed,notes,created_at FROM reviews WHERE article_slug=? ORDER BY id",
        (args.slug,),
    ).fetchall()
    if revs:
        print(f"\nreview history ({len(revs)}):")
        for r in revs:
            print(f"  [{r['created_at']}] {'PASS' if r['passed'] else 'CHANGES'} "
                  f"score={r['score']} - {r['notes']}")
    conn.close()


def cmd_brief(args):
    conn = connect()
    cur = conn.cursor()
    a = cur.execute("SELECT * FROM articles WHERE slug=?", (args.slug,)).fetchone()
    if not a:
        sys.exit(f"No article '{args.slug}'")
    cat = cur.execute("SELECT title FROM categories WHERE slug=?", (a["category_slug"],)).fetchone()
    kws = _kw_list(cur, args.slug)
    calc = None
    if a["embed_calculator"]:
        calc = cur.execute("SELECT * FROM calculators WHERE slug=?",
                           (a["embed_calculator"],)).fetchone()
    related = cur.execute(
        "SELECT slug,title FROM articles WHERE category_slug=? AND slug!=? "
        "ORDER BY combined_volume DESC LIMIT 5",
        (a["category_slug"], args.slug),
    ).fetchall()

    out = []
    out.append(f"# Writing brief: {a['title']}\n")
    if a["flagged"]:
        out.append(f"> ⚠ FLAGGED: {a['notes']}\n")
    out.append("## Frontmatter targets")
    out.append(f"- **slug / URL:** `{a['slug']}` -> `/{a['slug']}/` (flat, trailing slash)")
    out.append(f"- **title:** {a['title']}")
    out.append(f"- **category:** {a['category_slug']} ({cat['title'] if cat else '?'})")
    out.append(f"- **primaryKeyword:** {a['primary_keyword']}")
    out.append(f"- **phase:** {a['phase']}")
    if calc is not None:
        out.append(f"- **calculator (embed `<StatCalc>`):** {calc['slug']} "
                   f"(engine: {calc['engine']})")
    else:
        out.append("- **calculator:** none (concept-only article)")
    out.append("")
    out.append(f"## Keywords to cover ({len(kws)}) - use ALL, naturally")
    for k in kws:
        out.append(f"- {k['keyword']}{'  **(PRIMARY - title, H1, first 100 words)**' if k['is_primary'] else ''}")
    if not kws:
        out.append("- (none yet - keyword research pending; do not write blind)")
    out.append("")
    out.append("## Metrics")
    out.append(f"- KD range: {a['kd_min']}-{a['kd_max']}  ·  combined US volume ceiling: "
               f"~{a['combined_volume']}/mo  ·  phase {a['phase']}")
    out.append("")
    if related:
        out.append("## Suggested internal links (same category - use the typed `Link` registry)")
        for r in related:
            out.append(f"- [{r['title']}](/{r['slug']}/)")
        out.append("")
    out.append("## Rules")
    out.append(f"- Follow **`{PLAYBOOK}`** in full (>=2000 words, >=1 authoritative external "
               "link, active voice, educational tone, all keywords natural, semantic headings).")
    out.append("- Frontmatter must satisfy `src/content/config.ts`. Write with `draft: true`.")
    out.append("- Internal links ONLY via the typed `Link`/`url(id)` registry - never hand-typed hrefs.")
    print("\n".join(out))
    conn.close()


def cmd_next(args):
    conn = connect()
    cur = conn.cursor()
    r = cur.execute(
        "SELECT slug,title,phase,kd_min,kd_max,combined_volume FROM articles "
        "WHERE status='planned' AND flagged=0 AND phase IS NOT NULL "
        "ORDER BY phase,kd_min,combined_volume DESC LIMIT 1"
    ).fetchone()
    if not r:
        print("No unflagged 'planned' articles left. Check `list --status planned --flagged`.")
        conn.close()
        return
    print(f"Next up: {r['slug']}  (phase {r['phase']}, KD {r['kd_min']}-{r['kd_max']}, "
          f"~{r['combined_volume']}/mo)")
    print(f"  {r['title']}")
    print(f"\nRun: python content-ops/content_db.py brief {r['slug']}")
    conn.close()


def cmd_set_status(args):
    if args.new_status not in STATUSES:
        sys.exit(f"Invalid status. One of: {', '.join(STATUSES)}")
    conn = connect()
    cur = conn.cursor()
    if not cur.execute("SELECT 1 FROM articles WHERE slug=?", (args.slug,)).fetchone():
        sys.exit(f"No article '{args.slug}'")
    cur.execute(
        "UPDATE articles SET status=?,updated_at=datetime('now') WHERE slug=?",
        (args.new_status, args.slug),
    )
    conn.commit()
    print(f"{args.slug} -> {args.new_status}")
    conn.close()


def cmd_log_review(args):
    passed = 1 if args.result.lower() in ("pass", "passed", "p") else 0
    conn = connect()
    cur = conn.cursor()
    if not cur.execute("SELECT 1 FROM articles WHERE slug=?", (args.slug,)).fetchone():
        sys.exit(f"No article '{args.slug}'")
    cur.execute(
        "INSERT INTO reviews(article_slug,score,passed,notes) VALUES(?,?,?,?)",
        (args.slug, args.score, passed, args.notes),
    )
    new_status = "approved" if passed else "changes_requested"
    cur.execute(
        "UPDATE articles SET review_score=?,status=?,updated_at=datetime('now') WHERE slug=?",
        (args.score, new_status, args.slug),
    )
    conn.commit()
    print(f"Logged review for {args.slug}: {'PASS' if passed else 'CHANGES_REQUESTED'} "
          f"(score {args.score}) -> status {new_status}")
    conn.close()


def cmd_stats(args):
    conn = connect()
    cur = conn.cursor()
    arts = cur.execute("SELECT COUNT(*) n FROM articles").fetchone()["n"]
    cats = cur.execute("SELECT COUNT(*) n FROM categories").fetchone()["n"]
    calcs = cur.execute("SELECT COUNT(*) n FROM calculators").fetchone()["n"]
    kws = cur.execute("SELECT COUNT(*) n FROM keywords").fetchone()["n"]
    print(f"\nBoard: {arts} articles · {cats} categories · {calcs} calculators · {kws} keywords")
    print("By status:")
    for r in cur.execute("SELECT status,COUNT(*) n FROM articles GROUP BY status ORDER BY n DESC"):
        print(f"  {r['status']:<20}{r['n']}")
    print("By phase:")
    for r in cur.execute(
        "SELECT phase,COUNT(*) n FROM articles GROUP BY phase ORDER BY (phase IS NULL),phase"
    ):
        ph = r["phase"] if r["phase"] is not None else "stub"
        print(f"  phase {str(ph):<14}{r['n']}")
    conn.close()


def main():
    p = argparse.ArgumentParser(description="statohub content editorial board")
    sub = p.add_subparsers(dest="cmd", required=True)
    sub.add_parser("init").set_defaults(func=cmd_init)
    sub.add_parser("seed").set_defaults(func=cmd_seed)
    lp = sub.add_parser("list"); lp.add_argument("--status"); lp.add_argument("--phase", type=int)
    lp.add_argument("--category"); lp.add_argument("--flagged", action="store_true")
    lp.set_defaults(func=cmd_list)
    sp = sub.add_parser("show"); sp.add_argument("slug"); sp.set_defaults(func=cmd_show)
    bp = sub.add_parser("brief"); bp.add_argument("slug"); bp.set_defaults(func=cmd_brief)
    sub.add_parser("next").set_defaults(func=cmd_next)
    ss = sub.add_parser("set-status"); ss.add_argument("slug"); ss.add_argument("new_status")
    ss.set_defaults(func=cmd_set_status)
    lr = sub.add_parser("log-review"); lr.add_argument("slug"); lr.add_argument("score", type=int)
    lr.add_argument("result"); lr.add_argument("notes", nargs="?", default="")
    lr.set_defaults(func=cmd_log_review)
    sub.add_parser("stats").set_defaults(func=cmd_stats)
    args = p.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
