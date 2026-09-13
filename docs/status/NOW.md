# Now

> Current state, active work, blockers. Wins over any session handoff. Capped at
> 60 lines by `scripts/check-docs.mjs`. Durable rules go in
> `docs/ARCHITECTURE.md` + ADRs; operational detail in the skill or agent.

**Last updated:** 2026-09-13 (outsource batch 4: 8 published; ADR 0023).

**Known quirk:** `db_sync.py check` always recommends `dump` even when the `.db`
is stale -- if the `.sql` looks newer, `rm` the `.db` and `rebuild`.

## Workflow layer restructured 2026-09-06

Routers are maps now, one canonical home per rule, delegation ceremony dropped;
playbooks and outsource engine untouched. [[0022-routers-are-maps-not-rulebooks]].

**Cloud routines: RETIRED** to `docs/legacy/cloud-routine/`; the `PAUSED`
marker stays put. **claude.ai schedules still wake nightly** -- disable them in
claude.ai -> Routines.

**Baseline** (2026-09-13): 147 pages, 5,909 links, 121 tests, 0 violations.

## Active: Applied Statistics -- *internal* batch 2 not started

Internal Applied content via `content_db.py` ([[0021-boards-split-by-source]]).
Batch 1 (4 articles) is live; **batch 2 (4 more, one per hub) has never been
started -- topics were never chosen.** Governed by
[[0014-applied-section-url-family]] / [[0015-wedge-scoped-to-learn]]; recipe in
`docs/status/sessions/2026-08-16-applied-batch-1.md`. Still owed: visual QA vs
`docs/ideas/homepage-redesign-mock-2026-08-16.png`. `time-series-forecasting`
and `machine-learning-statistics` hold 1 article each.

## Outsource pipeline: 27 published, 10 queued

Batch 4 detail: `docs/status/sessions/2026-09-13-outsource-batch-4.md`.
**Partner backlinks are never stripped** -- [[0023-outsource-keeps-partner-backlinks]].

**Only publish rows whose vendor dashboard status is DRAFT.** At close,
`histogram-vs-boxplot` and `multiple-regression-diagnostics` were still
GENERATING upstream -- re-`fetch` before processing; the other 8 queued rows do
not exist upstream yet. Batches of 2-3, one reviewer at a time, report between.

## Blocked / waiting

- **Rotate the GitHub PAT.** The classic `ghp_` token in `~/.claude.json` is
  plaintext and was printed into a 2026-09-01 transcript. Git no longer needs it;
  the MCP server does. Replace with a fine-grained, repo-scoped token.
- **AdSense review: no technical blocker** (2026-09-06 audit; 5 fixes deferred)
  -- `docs/status/sessions/2026-09-06-adsense-audit.md`.

## Parked (do not silently resume)

- Sanitizer gaps: processors drop "Statohub's Take"/CTA and leave bare `{` in
  prose (MDX ReferenceError); neither is a `check_sanitized.py` check yet.
- Meta title lengths -- outsourced fixed + gated 2026-09-12; still open: ~50
  Learn at 61-70 chars, 22 calculators at 26-43; `sessions/2026-09-10-meta-title-lengths.md`.
- Article schema `image` missing -- `articleSchema()` in `src/lib/schema.ts`.
- `how-to-find-the-range` refresh -- 5 range keywords in DB, unused in copy.
- `relative frequency` / `cumulative frequency` -- uncovered Learn candidates;
  Phase C / D per `docs/ideas/statohub-action-plan.md` not started.
