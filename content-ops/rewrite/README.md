# Template rewrites

Live internal articles rewritten **in place** into the content-plan template
(`content-ops/new-content-plan/TEMPLATE.md`), keeping slug, hub, `pubDate`,
keywords and any calculator embed. Decision: [[0030-template-rewrite-routines]].

- `queue.csv` — 25 articles from the owner's list (`URLS-LIST.csv`, 2026-10-10),
  in list order, alternating lane A / lane B. Columns: `order, slug, lane,
  status (pending | published | changes_requested | blocked), attempts, score,
  date, notes`. `notes` are binding scope additions for the writer.
- `queue.py` — `next <lane>`, `show <slug>`, `set <slug> <status>`, `list`.
- `publish-daily.md` — cold-start prompt for the two cloud routines (lane A
  02:30 Malta, lane B 12:00 Malta). Trigger IDs: `docs/status/NOW.md`.
- `drafts/` — parked failed rewrites; the next run of that lane revises them.
- `PAUSED` — create it (any text) to pause both lanes; delete it to resume.

Locally: `/rewrite-article [slug]`.

Out of scope (owner, 2026-10-10): vendor articles (already in the template),
calculator pages, the `/calculators/` and `/probability-distributions/` hubs, and
`/editorial-policy/`.
