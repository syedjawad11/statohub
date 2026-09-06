# Now

> Current state, active work, blockers. Wins over any session handoff. Capped at
> 60 lines by `scripts/check-docs.mjs`. Durable rules go in
> `docs/ARCHITECTURE.md` + ADRs; operational detail in the skill or agent.

**Last updated:** 2026-09-06 (agentic-workflow restructure; AdSense audit).

**Known quirk:** `db_sync.py check` always recommends `dump` even when the `.db`
is stale -- if the `.sql` looks newer, `rm` the `.db` and `rebuild`.

## Workflow layer restructured 2026-09-06 (uncommitted)

Routers are maps now: `CLAUDE.md` 148 -> 89, `AGENTS.md` 86 -> 68, one canonical
home per rule, delegation ceremony dropped. Playbook tiers/thresholds unchanged;
outsource engine untouched. [[0022-routers-are-maps-not-rulebooks]].

**Cloud routines: RETIRED** to `docs/legacy/cloud-routine/`. The
`content-ops/cloud-routine/PAUSED` marker stays at its old path on purpose (both
specs gate on it in Step 0). **The claude.ai schedules were never deleted and
still wake nightly** -- disable them in claude.ai -> Routines.

**Baseline** (2026-09-06): 132 pages, 5,011 links, 121 tests, 0 violations.

## Active: Applied Statistics -- *internal* batch 2 not started

Internal Applied content via `content_db.py` ([[0021-boards-split-by-source]]).
Batch 1 (4 articles) is live; **batch 2 (4 more, one per hub) has never been
started -- topics were never chosen.** Governed by
[[0014-applied-section-url-family]] / [[0015-wedge-scoped-to-learn]]; recipe in
`docs/status/sessions/2026-08-16-applied-batch-1.md`. Still owed: visual QA vs
`docs/ideas/homepage-redesign-mock-2026-08-16.png`. `time-series-forecasting`
and `machine-learning-statistics` hold 1 article each.

## Outsource pipeline: 10 published, 10 queued

Detail: `docs/status/sessions/2026-09-02-outsource-batch-3.md`; the reviewer-only
traps and the "never pick by `queue_position`" rule live in the agent and skill.

**Board and upstream do not line up.** Only **3 of the 10 queued exist upstream**:
`data-visualization-best-practices`, `confusion-matrix-explained`,
`f1-score-explained` (the two ML ones need a cannibalization check against *each
other*). 5 live upstream articles have no board row; the user plans to revise the
upstream topic list rather than import them.

## Blocked / waiting

- **Rotate the GitHub PAT.** The classic `ghp_` token in `~/.claude.json` is
  plaintext and was printed into a 2026-09-01 transcript. Git no longer needs it;
  the MCP server does. Replace with a fine-grained, repo-scoped token.
- **AdSense review: no technical blocker** (2026-09-06 audit -- loader, `ads.txt`,
  CSP, crawler access all verified clean; false privacy policy now fixed). **5
  fixes deferred** -- see `docs/status/sessions/2026-09-06-adsense-audit.md`.

## Parked (do not silently resume)

- Article schema `image` missing -- `articleSchema()` in `src/lib/schema.ts`.
- `how-to-find-the-range` refresh -- 5 range keywords in DB, unused in copy.
- `relative frequency` / `cumulative frequency` -- uncovered Learn candidates;
  Phase C / D per `docs/ideas/statohub-action-plan.md` not started.
