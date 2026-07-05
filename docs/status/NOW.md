# Now

> Current state, active work, and blockers. This file wins over any session
> handoff if they disagree -- fix the conflict immediately when found. Updated
> at the end of any session that changes priorities; kept under ~60 lines.

**Last updated:** 2026-07-05.

## Active: repo-hygiene cleanup (doc/docs consolidation), pending commit

Phase A and Phase B (below) are both closed. The only thing left uncommitted
right now is the doc/docs folder consolidation + root scratch-file moves
described under Phase B's "Follow-up cleanup" -- awaiting the user's go-ahead
to commit.

**1. Phase A -- workspace audit fixes: CLOSED 2026-07-05.**
`handoff/TASK-022-trivial-fix-batch.md`, `TASK-023-contrast-fix-ci-guard.md`,
`TASK-024-calc-canonical-regression-suite.md` all reviewed and closed by
Claude. Verification independently re-run (not just trusted from the Work
Log): `npx astro check` (0/0/0), `npm test` (118/118), `npm run build` (56
pages, 0 link violations), `check-contrast.mjs` (5/5 pairs pass), and
TASK-024's required spot-check of 7 cited canonical values across categories
(all reproduced by hand/known math, no discrepancies). See each task file's
Review section for details.

**2. Phase B -- memory-system migration (`docs/MEMORY-SYSTEM.md`): CLOSED 2026-07-05.**
- Done: `docs/PROJECT.md`, `docs/ARCHITECTURE.md`, `docs/REPO-MAP.md`, all 13
  ADRs in `docs/decisions/`, full `docs/status/sessions/*.md` migration
  (2026-06-13 through 2026-06-28), this file, `docs/DESIGN-SYSTEM.md`,
  `docs/standards/content.md`, the new slim `CLAUDE.md`, `AGENTS.md` docs
  pointer, `stats-article-writer.md`/`stats-article-reviewer.md` updated to
  read the new docs paths instead of duplicating rules.
- Committed as `e7bf3a1` ("docs: restructure CLAUDE.md into a router +
  docs/ knowledge base") and already pushed to `origin/main` -- this was
  stale in a prior version of this file, which claimed it was still
  uncommitted after the fact.
- Follow-up cleanup done same day: merged the legacy `doc/` (singular) folder
  into `docs/legacy/`, moved the one-off strategy artifacts
  (`statohub-action-plan.md`, `statohub-strategy-review.md`) into
  `docs/ideas/`, moved `statohub-memory-system.md` to `docs/MEMORY-SYSTEM.md`,
  and deleted the now-superseded `WORKSPACE-OVERVIEW.md` (fully absorbed into
  `docs/PROJECT.md` + `docs/REPO-MAP.md` + `docs/ARCHITECTURE.md`). All
  cross-references updated. Not committed yet -- shown to the user first per
  the hard gate below.

## Parked / paused (do not silently resume)

- **Article-publishing cloud routines** (2/day) have been `enabled:false`
  since 2026-06-26, pending the woven-callout automation described in
  [[0010-woven-related-link-callouts]] -- that automation was never finished
  before the July strategy pivot took over. Re-enable only after it ships, or
  after explicit user sign-off to resume manually.
- **Calc-prose teaching-block backlog:** CLOSED 2026-07-05. 25 of 25 done
  (`content-ops/calc-prose/QUEUE.md`) -- Session 6 (`p-value`, `chi-square`,
  `proportion`) published, build green (70 pages, 0 link violations). Queue
  complete; procedure retained in `content-ops/calc-prose/SESSION-PLAN.md` for
  reference only.
- **Phase C (content publishing at scale) and Phase D (guided no-code
  projects, see [[0012-quizzes-dropped]])** per `docs/ideas/statohub-action-plan.md`:
  not started, blocked behind Phase A/B closing out first.

## Standing hard gates

- One agent on the repo at a time (Codex builds via `handoff/`, Claude
  reviews/closes and writes content).
- Never commit doc-restructuring or ADR work without showing the user first.
- Always count "done/pending" against `origin/main` after `git fetch`, never
  the local tree (see [[monitor-cloud-routine-publishing]]).
