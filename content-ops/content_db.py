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
    python content_db.py import-plan content-ops/new-content-plan/plan.csv
    python content_db.py plan-next
    python content_db.py set-status <slug> <status>
    python content_db.py log-review <slug> <score> <pass|fail> "notes"
    python content_db.py stats

Statuses: planned -> briefed -> drafting -> in_review -> changes_requested
          -> approved -> published   (research_pending = stub, not writable yet)
"""
import argparse
import csv
import json
import sqlite3
import sys
from pathlib import Path

import overlap_check  # sibling module; Python puts the script's folder on sys.path

# `brief` emits non-ASCII (e.g. the FLAGGED marker), which raises
# UnicodeEncodeError on a Windows console defaulting to cp1252. Force UTF-8 on
# our own streams rather than stripping the characters.
for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding="utf-8")
    except (AttributeError, ValueError):  # already-wrapped or redirected stream
        pass

HERE = Path(__file__).resolve().parent
DB_PATH = HERE / "content.db"
SCHEMA_PATH = HERE / "schema.sql"
SEED_PATH = HERE / "seed.json"
PLAYBOOK = ".claude/seo-playbook.md"  # repo-root relative
APPLIED_PLAYBOOK = ".claude/applied-playbook.md"  # repo-root relative
PLAN_TEMPLATE = "content-ops/new-content-plan/TEMPLATE.md"  # repo-root relative
ARTICLES_DIR = HERE.parent / "src" / "content" / "articles"
DRAFTS_DIR = HERE / "drafts"  # failed plan drafts parked between runs, revised not rewritten
PARKED_MAX_FAILS = 6  # failed reviews before a parked draft is left for a human
PLAN_WORD_FLOOR = 1500  # [[0028-content-plan-daily-routine]]
PLAN_HUBS = {
    "Foundations": "foundations",
    "Descriptive Statistics": "descriptive-statistics",
    "Inferential Statistics": "inferential-statistics",
    "Probability & Distributions": "probability-distributions",
    "Regression & Correlation": "regression-correlation",
    "Combinatorics": "combinatorics",
    "Data Analysis": "data-analysis",
    "Experiments & Causality": "experiments-causality",
    "Forecasting & Time Series": "time-series-forecasting",
    "Machine Learning Statistics": "machine-learning-statistics",
}

STATUSES = [
    "planned", "briefed", "drafting", "in_review",
    "changes_requested", "approved", "published", "research_pending",
    "merged",  # URL retired with a 301 into another brief; keywords moved there
]
SECTIONS = ["learn", "applied"]


def connect():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def norm(kw):
    return " ".join(kw.strip().lower().split())


def validate_section(section, context):
    if section not in SECTIONS:
        sys.exit(
            f"Invalid section '{section}' for {context}. "
            f"One of: {', '.join(SECTIONS)}"
        )
    return section


# ---------------------------------------------------------------- init / seed
def cmd_init(args):
    conn = connect()
    try:
        conn.executescript(SCHEMA_PATH.read_text(encoding="utf-8"))
        columns = {
            row["name"] for row in conn.execute("PRAGMA table_info(categories)").fetchall()
        }
        if "section" not in columns:
            conn.execute(
                "ALTER TABLE categories "
                "ADD COLUMN section TEXT NOT NULL DEFAULT 'learn'"
            )
        for row in conn.execute("SELECT slug,section FROM categories"):
            validate_section(row["section"], f"category '{row['slug']}'")
        conn.commit()
    finally:
        conn.close()
    print(f"Schema applied to {DB_PATH.name}")


def cmd_seed(args):
    data = json.loads(SEED_PATH.read_text(encoding="utf-8"))
    for c in data["categories"]:
        validate_section(c.get("section", "learn"), f"category '{c['slug']}'")
    conn = connect()
    cur = conn.cursor()
    try:
        for c in data["categories"]:
            cur.execute(
                "INSERT INTO categories(slug,title,description,section,nav_order) "
                "VALUES(?,?,?,?,?) "
                "ON CONFLICT(slug) DO UPDATE SET title=excluded.title,"
                "description=excluded.description,section=excluded.section,"
                "nav_order=excluded.nav_order",
                (c["slug"], c["title"], c.get("description", ""),
                 c.get("section", "learn"), c.get("nav_order", 0)),
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
    cat = cur.execute(
        "SELECT title,section FROM categories WHERE slug=?", (a["category_slug"],)
    ).fetchone()
    print(f"# {a['title']}")
    print(f"slug:            {a['slug']}  (URL: /{a['slug']}/)")
    print(f"category:        {a['category_slug']}")
    print(f"section:         {cat['section'] if cat else '?'}")
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
    cat = cur.execute(
        "SELECT title,section FROM categories WHERE slug=?", (a["category_slug"],)
    ).fetchone()
    section = validate_section(
        cat["section"] if cat else "learn", f"category '{a['category_slug']}'"
    )
    kws = _kw_list(cur, args.slug)
    plan = cur.execute("SELECT * FROM plan_rows WHERE slug=?", (args.slug,)).fetchone()
    calc = None
    if a["embed_calculator"]:
        calc = cur.execute("SELECT * FROM calculators WHERE slug=?",
                           (a["embed_calculator"],)).fetchone()
    related = cur.execute(
        "SELECT slug,title FROM articles WHERE category_slug=? AND slug!=? AND status='published' "
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
    if plan is not None:
        target = max(plan["est_words"] or PLAN_WORD_FLOOR, PLAN_WORD_FLOOR)
        out.append(f"## Content plan row {plan['plan_id']} ({plan['priority']}, {plan['section']})")
        out.append(f"- **What the article covers:** {plan['covers']}")
        out.append(f"- **Page type:** {plan['page_type'] or '-'}")
        out.append(f"- **Software covered:** {plan['software_covered'] or 'none'}")
        out.append(f"- **Target length:** ~{target} words of body prose "
                   f"(floor {PLAN_WORD_FLOOR}; never pad)")
        if plan["links_up_to"]:
            out.append(f"- **Parent (link up to it, list first in `related`):** "
                       f"`{plan['links_up_to']}`")
        if plan["overlap_watch"]:
            out.append(f"- **Overlap watch:** {plan['overlap_watch']}")
        out.append("")
        out.append("## Rules")
        out.append(f"- Follow **`{PLAN_TEMPLATE}`** exactly (the babylovegrowth-style "
                   "template), with sourcing and link rules from "
                   f"`{APPLIED_PLAYBOOK}`. This overrides the playbook's word count.")
        out.append("- **No calculator embed** (`<StatCalc>`) and no `calculator` frontmatter, "
                   "in either section. Link calculator pages instead.")
        out.append("- Frontmatter must satisfy `src/content/config.ts`. Write with `draft: true`.")
        out.append("- Internal links ONLY via `Link` + `routes.*` - never hand-typed hrefs.")
        print("\n".join(out))
        conn.close()
        return
    out.append("## Rules")
    if section == "applied":
        out.append(
            f"- Follow **`{APPLIED_PLAYBOOK}`** in full (3,000-4,500 words, "
            "practitioner-focused, evidence-backed, and no fabricated claims)."
        )
        out.append("- **Required modules checklist:**")
        out.append("  - [ ] `<KeyTakeaways>` before the first H2")
        out.append("  - [ ] At least one `<DataTable>`")
        out.append("  - [ ] At least one `<Checklist>`")
        out.append("  - [ ] At least one `<Figure>`-wrapped infographic")
        out.append("  - [ ] Literal `## Sources` with at least 6 resolving external links")
        out.append("  - [ ] Literal `## FAQ` with at least 3 `<FAQ>` entries")
    else:
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
        "AND slug NOT IN (SELECT slug FROM plan_rows) "  # plan rows: use plan-next
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


# ---------------------------------------------------------------- content plan
def _is_published(slug):
    """True when src/content/articles/<slug>.mdx exists and is not a draft."""
    path = ARTICLES_DIR / f"{slug}.mdx"
    if not path.exists():
        return False
    head = path.read_text(encoding="utf-8").split("---", 2)[1]
    return not any(line.strip() == "draft: true" for line in head.splitlines())


def cmd_import_plan(args):
    rows = list(csv.DictReader(open(args.csv, encoding="utf-8", newline="")))
    conn = connect()
    cur = conn.cursor()
    sections = {r["slug"]: r["section"] for r in cur.execute("SELECT slug,section FROM categories")}
    added = skipped = 0
    flagged = []
    try:
        for r in rows:
            slug = r["proposed_slug"].strip()
            category = PLAN_HUBS.get(r["subcategory"].strip())
            if not slug or not category:
                sys.exit(f"{r['id']}: bad slug or unknown subcategory '{r['subcategory']}'")
            section = r["hub"].strip().lower()
            if sections.get(category) != section:
                sys.exit(f"{r['id']}: hub '{r['hub']}' does not match category "
                         f"'{category}' (section {sections.get(category)})")
            if cur.execute("SELECT 1 FROM articles WHERE slug=?", (slug,)).fetchone():
                skipped += 1
                continue
            primary = norm(r["primary_keyword"])
            owner = cur.execute("SELECT article_slug FROM keywords WHERE keyword=?",
                                (primary,)).fetchone()
            note = ""
            if owner:
                note = (f"content plan {r['id']}: primary keyword '{primary}' is owned by "
                        f"'{owner['article_slug']}' - pick a new angle/keyword before writing")
                flagged.append(f"{r['id']} {slug} -> {owner['article_slug']}")
            cur.execute(
                "INSERT INTO articles(slug,title,category_slug,primary_keyword,phase,"
                "status,flagged,notes) VALUES(?,?,?,?,1,'planned',?,?)",
                (slug, r["article_title"].strip(), category, primary, 1 if owner else 0, note),
            )
            est = r["est_words"].strip()
            cur.execute(
                "INSERT INTO plan_rows(slug,plan_id,section,page_type,software_covered,covers,"
                "est_words,priority,links_up_to,overlap_watch) VALUES(?,?,?,?,?,?,?,?,?,?)",
                (slug, r["id"].strip(), section, r["page_type"].strip(),
                 "" if r["software_covered"].strip() in ("", "—") else r["software_covered"].strip(),
                 r["what_the_article_covers"].strip(), int(float(est)) if est else None,
                 r["my_priority"].strip() or "P2", r["links_up_to"].strip(),
                 r["overlap_watch"].strip()),
            )
            kws = [(primary, 1)] if not owner else []
            kws += [(norm(k), 0) for k in r["secondary_keywords"].split(";") if k.strip()]
            for kw, is_primary in kws:
                if cur.execute("SELECT 1 FROM keywords WHERE keyword=?", (kw,)).fetchone():
                    continue  # owned elsewhere: never attach a keyword twice
                cur.execute("INSERT INTO keywords(article_slug,keyword,is_primary) VALUES(?,?,?)",
                            (slug, kw, is_primary))
            added += 1
        conn.commit()
    finally:
        conn.close()
    print(f"Imported {added} plan row(s); {skipped} already on the board.")
    for f in flagged:
        print(f"  FLAGGED (primary keyword owned): {f}")


def cmd_plan_next(args):
    conn = connect()
    # A parked draft (failed review, saved by the failure path) is resumed before
    # anything new is started: it is usually one fix from passing, and plan rows
    # downstream of it stay blocked until it is live.
    parked = conn.execute(
        "SELECT a.slug,a.title,p.plan_id,p.priority,a.category_slug,"
        "(SELECT COUNT(*) FROM reviews r WHERE r.article_slug=a.slug AND r.passed=0) AS fails "
        "FROM articles a JOIN plan_rows p ON p.slug=a.slug "
        "WHERE a.status='changes_requested' AND a.flagged=0 "
        "ORDER BY p.priority,p.plan_id"
    ).fetchall()
    for r in parked:
        if not (DRAFTS_DIR / f"{r['slug']}.mdx").exists():
            continue
        if (ARTICLES_DIR / f"{r['slug']}.mdx").exists():
            continue  # a file already sits at this URL; needs a human
        if r["fails"] >= PARKED_MAX_FAILS:
            print(f"Skipped parked {r['slug']}: {r['fails']} failed reviews - needs a human")
            continue
        conn.close()
        print(f"Next up (resume parked draft): {r['slug']}  "
              f"({r['plan_id']}, {r['priority']}, {r['category_slug']})")
        print(f"  {r['title']}")
        print(f"\nRevise, don't rewrite: content-ops/drafts/{r['slug']}.mdx + the last fix list "
              f"(python3 content-ops/content_db.py show {r['slug']})")
        return
    rows = conn.execute(
        "SELECT a.slug,a.title,a.category_slug,a.primary_keyword,p.plan_id,p.priority,"
        "p.links_up_to FROM articles a JOIN plan_rows p ON p.slug=a.slug "
        "WHERE a.status='planned' AND a.flagged=0 "
        "ORDER BY p.priority,p.plan_id"
    ).fetchall()
    conn.close()
    live = overlap_check.load_articles()
    for r in rows:
        if (ARTICLES_DIR / f"{r['slug']}.mdx").exists():
            continue  # a file already sits at this URL; needs a human
        if r["links_up_to"] and not _is_published(r["links_up_to"]):
            continue  # parent not live yet
        clash = [c for c in overlap_check.title_conflicts(r["slug"], r["primary_keyword"], live)
                 if c[2] == "FAIL"]
        if clash:
            print(f"Skipped {r['slug']}: its keyword is the topic of "
                  f"{clash[0][0]}'s {clash[0][1]} - needs a human (overlap_check.py titles)")
            continue
        print(f"Next up: {r['slug']}  ({r['plan_id']}, {r['priority']}, {r['category_slug']})")
        print(f"  {r['title']}")
        print(f"\nRun: python3 content-ops/content_db.py brief {r['slug']}")
        return
    print("No writable plan rows left (all done, flagged, or waiting on a parent).")


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
    ip = sub.add_parser("import-plan"); ip.add_argument("csv"); ip.set_defaults(func=cmd_import_plan)
    sub.add_parser("plan-next").set_defaults(func=cmd_plan_next)
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
