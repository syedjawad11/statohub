# Now

> Current state, active work, blockers. Wins over any session handoff. Capped at
> 60 lines by `scripts/check-docs.mjs`. Durable rules go in
> `docs/ARCHITECTURE.md` + ADRs; operational detail in the skill or agent.

**Last updated:** 2026-10-04 (content-plan pipeline). **Baseline:** 150
pages, 128 tests, 0 violations, 5 redirects in `public/_redirects`.
**Board quirks:** `db_sync.py check` always recommends `dump` even when the `.db`
is stale (if the `.sql` looks newer, `rebuild --force`). `seed.json` is stale vs
the board (`statistics-basics`/`calculators` categories) -- **never `seed`**; edit
via SQL then `dump`. Routers are maps ([[0022-routers-are-maps-not-rulebooks]]).
Internal cloud routines RETIRED to `docs/legacy/cloud-routine/`; their last
enabled claude.ai schedule was disabled 2026-09-27.

## Owed: homepage visual QA vs the mock (batch 2 superseded by the plan)

## Content plan: 335 rows on content.db, daily routine 03:00 Malta (2026-10-04)

`content-ops/new-content-plan/`; babylovegrowth template, no calc embeds, 1,500
floor, auto-publish, 1/day to 2026-11-04 ([[0028-content-plan-daily-routine]]);
routine `trig_01CLrB4kqGE4P5NijmgrKbtn` cron 01:00 UTC, **set 02:00 on 10-25**;
run 1 (10-05) failed link gate, fixed 7cd6fb9 + agents hardened 51a1bc0.
Overlap gate: `content-ops/overlap_check.py`.
**Owed: one dedicated session** to enrich 3 live articles instead of new pages:
binomial-distribution (+geometric), binomial-theorem (+Pascal's triangle),
linear-regression (+logistic). `sessions/2026-10-04-keyword-overlap-rewrites.md`.

## Outsource pipeline: 35 published, 2 queued, daily routine

Batch 6 (2026-09-27): intention-to-treat, multiple-comparisons-problem,
normality-tests. **Daily cloud routine** publishes one article at 09:00 UTC and
auto-queues new vendor drafts ([[0026-outsource-daily-cloud-routine]];
`outsource-content/routine/publish-daily.md`, pause via `routine/PAUSED`).
**Partner backlinks are never stripped** -- replacing an unreachable Sources
entry keeps the vendor's inline href ([[0023-outsource-keeps-partner-backlinks]]).
Rows left `changes_requested`/`blocked` by the routine need a local session.

## Blocked / waiting

- **Rotate the GitHub PAT.** The classic `ghp_` token in `~/.claude.json` is
  plaintext (printed in a 2026-09-01 transcript); only the MCP server needs it.
- **AdSense rejected ("low value content") -- phases 1-3 done, 4-5 parked by
  owner.** Handoff `sessions/2026-09-20-adsense-phases-1-3.md` (baseline
  `-phase0-inventory.md`; [[0024-team-byline-and-trust-pages]]). Phase 4 =
  calc template variety + 337 RelatedLink intros + thin-calc enrich-vs-noindex;
  Phase 5 = resubmit. **Adsterra banners run meanwhile ([[0025]]) -- re-tighten the CSP first.**

## Parked (do not silently resume)

- Sanitizer gaps: processors drop "Statohub's Take"/CTA, leave bare `{` in
  prose (MDX ReferenceError), and leave the vendor `— Statohub` sign-off (still
  live in confusion-matrix-explained, f1-score-explained, granger-causality).
  None is a `check_sanitized.py` check yet.
- Meta title lengths -- ~50 Learn at 61-70 chars, 22 calculators at 26-43
  still open; `sessions/2026-09-10-meta-title-lengths.md`.
- Article schema `image` missing (`articleSchema()`); `how-to-find-the-range`
  refresh -- 5 range keywords in DB, unused in copy.
- `relative frequency` / `cumulative frequency` -- uncovered Learn candidates
  (now partly inside `/frequency-table/`); Phase C / D not started.
