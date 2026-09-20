# Now

> Current state, active work, blockers. Wins over any session handoff. Capped at
> 60 lines by `scripts/check-docs.mjs`. Durable rules go in
> `docs/ARCHITECTURE.md` + ADRs; operational detail in the skill or agent.

**Last updated:** 2026-09-20 (AdSense phase 3: trust layer). **Baseline:** 150
pages, 128 tests, 0 violations, 5 redirects in `public/_redirects`.
**Board quirks:** `db_sync.py check` always recommends `dump` even when the `.db`
is stale (if the `.sql` looks newer, `rebuild --force`). `seed.json` is stale vs
the board (`statistics-basics`/`calculators` categories) -- **never `seed`**; edit
via SQL then `dump`. Routers are maps ([[0022-routers-are-maps-not-rulebooks]]).
Cloud routines RETIRED to `docs/legacy/cloud-routine/`; **claude.ai schedules
still wake nightly** -- disable in claude.ai -> Routines.

## Active: Applied Statistics -- *internal* batch 2 not started

Internal Applied content via `content_db.py` ([[0021-boards-split-by-source]]).
Batch 1 (4 articles) is live; **batch 2 (4 more, one per hub) has never been
started -- topics were never chosen.** Governed by
[[0014-applied-section-url-family]] / [[0015-wedge-scoped-to-learn]]; recipe in
`docs/status/sessions/archive/2026-08-16-applied-batch-1.md`. Still owed: visual QA vs
`docs/ideas/homepage-redesign-mock-2026-08-16.png`. `time-series-forecasting`
and `machine-learning-statistics` hold 1 article each.

## Outsource pipeline: 32 published, 5 queued

Batch 5 (2026-09-18/19): histogram-vs-boxplot, multiple-regression-diagnostics,
missing-data-imputation, box-plot-interpretation, bias-variance-tradeoff (batch 4:
`sessions/2026-09-13-outsource-batch-4.md`). **Partner backlinks are never
stripped** -- [[0023-outsource-keeps-partner-backlinks]].

**Only publish rows whose vendor dashboard status is DRAFT.** The 5 queued rows
(intention-to-treat, multiple-comparisons-problem, normality-tests, holt-winters,
scatter-plot-interpretation) did not exist upstream at last check -- confirm on
the vendor board before `fetch`. Vendor badge stays DRAFT for our renamed slugs;
that is expected, not a publish failure. Batches of 2-3, one reviewer at a time.

## Blocked / waiting

- **Rotate the GitHub PAT.** The classic `ghp_` token in `~/.claude.json` is
  plaintext and was printed into a 2026-09-01 transcript. Git no longer needs
  it; the MCP server does. Replace with a fine-grained, repo-scoped token.
- **AdSense rejected ("low value content") -- remediation in progress**, plan in
  `sessions/2026-09-20-adsense-phase0-inventory.md`. Phases 1-3 done (FAQ dedupe;
  5 merges -> 301s; bylines + git dates, `/editorial-policy/`, `/contact/`,
  `#terms` -- [[0024-team-byline-and-trust-pages]]). Phase 4 (template variety) next.

## Parked (do not silently resume)

- Sanitizer gaps: processors drop "Statohub's Take"/CTA, leave bare `{` in
  prose (MDX ReferenceError), and leave the vendor `— Statohub` sign-off (still
  live in confusion-matrix-explained, f1-score-explained, granger-causality).
  None is a `check_sanitized.py` check yet.
- Meta title lengths -- outsourced fixed + gated 2026-09-12; still open: ~50
  Learn at 61-70 chars, 22 calculators at 26-43; `sessions/2026-09-10-meta-title-lengths.md`.
- Article schema `image` missing (`articleSchema()`); `how-to-find-the-range`
  refresh -- 5 range keywords in DB, unused in copy.
- `relative frequency` / `cumulative frequency` -- uncovered Learn candidates
  (now partly inside `/frequency-table/`); Phase C / D not started.
