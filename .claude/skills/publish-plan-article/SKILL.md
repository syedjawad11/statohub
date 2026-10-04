---
name: publish-plan-article
description: Run the content-plan pipeline for one article end-to-end — pick → brief → write → review → auto-publish — driving the plan-article-writer and plan-article-reviewer agents on the content.db board, in the babylovegrowth-style template with no calculator embed. Use when the user says "/publish-plan-article", "publish the next plan article", or names a slug from content-ops/new-content-plan/plan.csv.
---

# /publish-plan-article [slug]

Write and publish **one** article from the owner's content plan
([[0028-content-plan-daily-routine]]). Board: `content-ops/content.db` (plan
rows are the ones with a `plan_rows` entry). Never route these through
`/write-article` or `outsource_db.py`.

## Steps

1. **Pick.** Use the given slug if any (it must have a plan row:
   `python3 content-ops/content_db.py brief <slug>` shows a "Content plan row"
   block). Otherwise `python3 content-ops/content_db.py plan-next`.
   It skips flagged rows (primary keyword owned elsewhere) and rows whose
   parent is not live yet. If nothing is left, report that and stop.

2. **Brief + mark drafting.**
   ```
   python3 content-ops/content_db.py set-status <slug> drafting
   python3 content-ops/content_db.py brief <slug>
   ```

3. **Write.** Spawn **plan-article-writer** with the full brief text. Relay its
   report. Then `python3 content-ops/content_db.py set-status <slug> in_review`.

4. **Review + publish.** Spawn **plan-article-reviewer** on the slug. On PASS
   it flips `draft`, runs the build gate, sets `published`, dumps the board,
   commits and pushes.

5. **Loop.** On CHANGES_REQUESTED, hand the fix list to the writer (same
   agent via SendMessage if available, else a new one with the brief + fix
   list), then re-review. **Max 2 review rounds.** Still failing →
   `set-status <slug> changes_requested` (or `blocked` if a human must decide,
   e.g. a keyword conflict), make sure the MDX is `draft: true`.

6. **Wrap up.** `python3 scripts/db_sync.py check`; `git status --porcelain`
   must be empty. On a failed run, commit only the board
   (`python3 scripts/db_sync.py dump`, `git add content-ops/content.sql`,
   commit `content-plan: <slug> <status>`), push, and delete the untracked
   draft MDX so the next run doesn't trip over it.

## Notes
- Spot-check the published page yourself when running locally (review is the
  orchestrator's last line of defence in an interactive session).
- Flagged rows (keyword owned elsewhere, or parked: S136/S137/S156/S157) need
  a human first; see `content-ops/new-content-plan/README.md`.
