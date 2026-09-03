# Now

> Current state, active work, blockers. Wins over any session handoff. Capped at
> ~60 lines by `scripts/check-docs.mjs`. Durable rules go in `CLAUDE.md`;
> operational detail goes in the skill or agent that runs it.

**Last updated:** 2026-09-03 (housekeeping: docs realigned, guardrails built,
boards verified -- `docs/status/sessions/2026-09-03-housekeeping.md`).

**Known quirk:** `db_sync.py check` always recommends `dump`, even when the
`.db` is the stale side. If the `.sql` looks newer, `rm` the `.db` and
`rebuild`.

## Active: Applied Statistics -- *internal* batch 2 not started

Internally written Applied content via `content_db.py` (distinct from the vendor
pipeline; boards split by source, [[0021-boards-split-by-source]]). Batch 1
(4 articles) is live. **Batch 2 (4 more, one per hub) has never been started --
topics were never chosen.** Governed by [[0014-applied-section-url-family]] /
[[0015-wedge-scoped-to-learn]]; recipe in
`docs/status/sessions/2026-08-16-applied-batch-1.md`. Still owed: desktop+mobile
visual QA vs `docs/ideas/homepage-redesign-mock-2026-08-16.png`. Applied hubs
are thin -- `time-series-forecasting` and `machine-learning-statistics` hold
**1 article each**.

**Learn pipeline:** queue exhausted since 2026-08-14; nightly cloud routine idle
(out of work, not broken). Applied seed rows stay `flagged` so it cannot
auto-publish a half-written draft.

**Baseline on `origin/main`** (`94803cc`): 131 pages, 4,967 internal links, 0
link/meta violations, 121 tests, 88 published articles (74 Learn / 14 Applied).

## Outsource pipeline: 10 published, 10 queued

Detail: `docs/status/sessions/2026-09-02-outsource-batch-3.md`. The three
reviewer-only traps and the "never pick by `queue_position`" rule now live in
the reviewer agent and the skill respectively.

**Board and upstream do not line up.** Only **3 of the 10 queued exist
upstream**: `data-visualization-best-practices`, `confusion-matrix-explained`,
`f1-score-explained` (the two ML ones need a cannibalization check against *each
other*). A further 5 live upstream articles have no board row; the user plans to
revise the upstream topic list rather than import them as-is.

## Blocked / waiting

- **Rotate the GitHub PAT.** The classic `ghp_` token in `~/.claude.json` is
  plaintext and was printed into a 2026-09-01 transcript. Git no longer needs
  it; the MCP server does. Replace with a fine-grained, repo-scoped token.
- **AdSense paused pending Google's review** -- loader, CSP, `ads.txt`, privacy
  disclosure and CMP tag live; no ad units placed. Decision 2026-08-23: stop
  debugging, wait. `docs/status/sessions/2026-08-23-adsense-consent-csp-fix.md`.

## Parked (do not silently resume)

- Article schema `image` missing -- `articleSchema()` in `src/lib/schema.ts`,
  with an `/og-default.png` fallback.
- `how-to-find-the-range` refresh -- 5 range keywords in DB, unused in copy.
- `relative frequency` / `cumulative frequency` -- uncovered Learn candidates.
- Phase C / Phase D per `docs/ideas/statohub-action-plan.md`: not started.
