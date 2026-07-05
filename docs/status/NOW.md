# Now

> Current state, active work, and blockers. This file wins over any session
> handoff if they disagree -- fix the conflict immediately when found. Updated
> at the end of any session that changes priorities; kept under ~60 lines.

**Last updated:** 2026-07-05.

## Active: two open threads, sequencing conflict flagged

**1. Phase A -- workspace audit fixes (needs review, blocks nothing else):**
`handoff/TASK-022-trivial-fix-batch.md`, `TASK-023-contrast-fix-ci-guard.md`,
`TASK-024-calc-canonical-regression-suite.md` are all Codex `Status: DONE` but
**not yet reviewed/closed by Claude** (empty Review sections). Touches
`src/styles/global.css`, `astro.config.mjs`, `.github/workflows/deploy.yml`,
new `scripts/check-contrast.mjs`, new `src/calc/__tests__/canonical-regression.test.ts`.
Per `statohub-action-plan.md`, this was supposed to close before Phase B
started -- it didn't (Phase B ran ahead). TASK-024's review instructions
require independently re-deriving >=5 cited canonical values by hand, not just
re-running the test suite. **This is the next planned work (new session).**

**2. Phase B -- memory-system migration (`statohub-memory-system.md`), in progress:**
- Done: `docs/PROJECT.md`, `docs/ARCHITECTURE.md`, `docs/REPO-MAP.md`, all 13
  ADRs in `docs/decisions/`, full `docs/status/sessions/*.md` migration
  (2026-06-13 through 2026-06-28).
- Done this session: this file, `docs/DESIGN-SYSTEM.md`,
  `docs/standards/content.md`, the new slim `CLAUDE.md`, `AGENTS.md` docs
  pointer, `stats-article-writer.md`/`stats-article-reviewer.md` updated to
  read the new docs paths instead of duplicating rules.
- **Nothing in this migration is committed yet.** Hard gate: show the user the
  new `CLAUDE.md` + full ADR list before any `git commit`.

## Parked / paused (do not silently resume)

- **Article-publishing cloud routines** (2/day) have been `enabled:false`
  since 2026-06-26, pending the woven-callout automation described in
  [[0010-woven-related-link-callouts]] -- that automation was never finished
  before the July strategy pivot took over. Re-enable only after it ships, or
  after explicit user sign-off to resume manually.
- **Calc-prose teaching-block backlog:** 22 of 25 done (`content-ops/calc-prose/QUEUE.md`).
  Session 6 (`p-value`, `chi-square`, `proportion`) is still `pending` in the
  queue -- there is no evidence it ran. Procedure in
  `content-ops/calc-prose/SESSION-PLAN.md`.
- **Phase C (content publishing at scale) and Phase D (guided no-code
  projects, see [[0012-quizzes-dropped]])** per `statohub-action-plan.md`:
  not started, blocked behind Phase A/B closing out first.

## Standing hard gates

- One agent on the repo at a time (Codex builds via `handoff/`, Claude
  reviews/closes and writes content).
- Never commit doc-restructuring or ADR work without showing the user first.
- Always count "done/pending" against `origin/main` after `git fetch`, never
  the local tree (see [[monitor-cloud-routine-publishing]]).
