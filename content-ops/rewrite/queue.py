#!/usr/bin/env python3
"""Queue for the template-rewrite routines ([[0030-template-rewrite-routines]]).

`queue.csv` lists the live internal articles being rewritten in place into the
content-plan template, split into lane A (02:30 Malta) and lane B (12:00 Malta).
It is a committed file, not a board: the articles stay `published` on
content.db throughout.

Usage:
    python3 content-ops/rewrite/queue.py next <A|B>     # print the slug to do next, or nothing
    python3 content-ops/rewrite/queue.py show <slug>    # print the row
    python3 content-ops/rewrite/queue.py set <slug> <status> [--score N] [--note TEXT]
    python3 content-ops/rewrite/queue.py list

`next` offers a lane's parked draft first (a `changes_requested` row whose
draft sits in content-ops/rewrite/drafts/<slug>.mdx and has fewer than
MAX_ATTEMPTS failed runs), then the lowest-order `pending` row. `blocked` rows
need a human and are never offered.
"""
import argparse
import csv
import datetime
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
QUEUE = HERE / "queue.csv"
DRAFTS = HERE / "drafts"
FIELDS = ["order", "slug", "lane", "status", "attempts", "score", "date", "notes"]
STATUSES = {"pending", "published", "changes_requested", "blocked"}
MAX_ATTEMPTS = 3


def load():
    with QUEUE.open(newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    for r in rows:
        r.setdefault("attempts", "")
    return rows


def save(rows):
    with QUEUE.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=FIELDS)
        w.writeheader()
        for r in rows:
            w.writerow({k: r.get(k, "") for k in FIELDS})


def find(rows, slug):
    for r in rows:
        if r["slug"] == slug:
            return r
    sys.exit(f"{slug}: not in {QUEUE.name}")


def cmd_next(args):
    lane = args.lane.upper()
    rows = sorted((r for r in load() if r["lane"] == lane), key=lambda r: int(r["order"]))
    for r in rows:
        if (r["status"] == "changes_requested" and (DRAFTS / f"{r['slug']}.mdx").exists()
                and int(r["attempts"] or 0) < MAX_ATTEMPTS):
            print(f"{r['slug']}  (resume parked draft content-ops/rewrite/drafts/{r['slug']}.mdx)")
            return 0
    for r in rows:
        if r["status"] == "pending":
            print(r["slug"])
            return 0
    return 0


def cmd_show(args):
    r = find(load(), args.slug)
    for k in FIELDS:
        print(f"{k}: {r.get(k, '')}")
    return 0


def cmd_set(args):
    if args.status not in STATUSES:
        sys.exit(f"status must be one of {sorted(STATUSES)}")
    rows = load()
    r = find(rows, args.slug)
    r["status"] = args.status
    if args.status in ("changes_requested", "blocked"):
        r["attempts"] = str(int(r["attempts"] or 0) + 1)
    if args.score is not None:
        r["score"] = str(args.score)
    if args.note:  # appended, so the scope notes the writer needs survive
        r["notes"] = f"{r['notes']} | {args.note}" if r["notes"] else args.note
    r["date"] = datetime.date.today().isoformat()
    save(rows)
    print(f"{args.slug} -> {args.status}")
    return 0


def cmd_list(args):
    for r in load():
        print(f"{r['order']:>2} {r['lane']} {r['status']:<17} {r['slug']}")
    return 0


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)
    n = sub.add_parser("next"); n.add_argument("lane", choices=["A", "B", "a", "b"])
    s = sub.add_parser("show"); s.add_argument("slug")
    st = sub.add_parser("set"); st.add_argument("slug"); st.add_argument("status")
    st.add_argument("--score", type=int); st.add_argument("--note")
    sub.add_parser("list")
    args = p.parse_args()
    return {"next": cmd_next, "show": cmd_show, "set": cmd_set, "list": cmd_list}[args.cmd](args)


if __name__ == "__main__":
    sys.exit(main())
