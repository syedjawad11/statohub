# new-content-plan/

The owner's content plan (2026-10-04): 338 articles across all ten hubs
(143 Applied, 195 Learn), written by Claude and published one a day by the
content-plan routine ([[0028-content-plan-daily-routine]]).

- `new-content-plan.numbers` — the owner's original sheet. Edit it here if you
  like, but the importer reads only the CSV.
- `plan.csv` — the sheet exported as CSV; the diffable source of truth for the
  import. Columns: `hub` (section), `id` (S001–S338), `subcategory` (hub name),
  `article_title`, `what_the_article_covers`, `primary_keyword`,
  `secondary_keywords` (`;`-separated), `page_type`, `software_covered`,
  `est_words`, `my_priority`, `proposed_slug`, `links_up_to`, … The
  `calculator` columns are ignored: these articles never embed one.
- `TEMPLATE.md` — the binding article structure (babylovegrowth-style).

## How it flows

```
python3 content-ops/content_db.py import-plan content-ops/new-content-plan/plan.csv  # idempotent
python3 content-ops/content_db.py plan-next     # P1 -> P3, then plan id; parent must be live
/publish-plan-article [slug]                    # local run; the cloud routine runs the same steps
```

Rows land on `content-ops/content.db` (internal board, [[0021-boards-split-by-source]])
as `articles` + `keywords` + a `plan_rows` entry. `plan_rows` is what keeps
them out of `/write-article`'s `next`. Adding rows: append to `plan.csv`,
re-run `import-plan`, then `python3 scripts/db_sync.py dump`.

A row is **flagged** when its primary keyword already belongs to another
article; `plan-next` skips it until a human re-angles it. S077
geometric-distribution, S105 pascals-triangle and S135 logistic-regression were
**removed** (2026-10-04, owner): their topics go into a rewrite of the live
owning articles instead (`docs/status/sessions/2026-10-04-keyword-overlap-rewrites.md`).
S123 now links up to binomial-theorem; S136/S137/S156/S157 (logistic children)
are flagged and parked until that session decides. `plan.csv` reflects this;
the `.numbers` sheet still has the original 338 rows.

Routine spec: `content-ops/routine/publish-daily.md`; pause by committing
`content-ops/routine/PAUSED`.
