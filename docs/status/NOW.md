# Now

> Current state, active work, and blockers. This file wins over any session
> handoff if they disagree -- fix the conflict immediately when found. Updated
> at the end of any session that changes priorities; kept under ~60 lines.

**Last updated:** 2026-07-11 (updated same day).

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

**3. Meta-description length fix + build gate: CLOSED 2026-07-05.**
Ahrefs flagged 32 URLs (calculators, category hubs, static pages) with meta
descriptions at 39-92 chars, well under the ~110-160 char recommendation.
Root cause: no length validation existed for this page class at all. Fixed
all 29 calculator + 6 category + 3 static-page descriptions plus 4
pre-existing articles that fell outside range once the schema went
sitewide, and added a HARD build-time gate (Zod `.min(110).max(160)` in
`src/content/config.ts` + new `scripts/check-meta-description.mjs` scanning
`dist/**/*.html`, wired into `npm run build`). `.claude/seo-playbook.md`
updated to reflect the new HARD tier. Full verification re-run: `npm run
build` (70 pages, 0 violations), `astro check` (0/0/0), `npm test`
(118/118). See `docs/status/sessions/2026-07-05-meta-description-length-fix.md`.

## Parked / paused (do not silently resume)

- **Article schema `image` field (next session):** all 36 articles ship
  Article JSON-LD with no `image` property -- `ogImage` is optional in
  `src/content/config.ts` and unset on every article. Google effectively
  requires `image` for Article rich-result eligibility. Fix is either (a) set
  `ogImage` per article, or (b) fall back to `/og-default.png` inside
  `articleSchema()` in `src/lib/schema.ts` the way `Meta.astro` already does
  for OG tags. Deferred from the 2026-07-06 schema audit/fix session (author,
  publisher, and entity-graph linking were fixed same session).
- **Article-publishing cloud routine: RESUMED 2026-07-11.** Was hard-paused
  2026-07-08 (marker file `content-ops/cloud-routine/PAUSED`) because all 7
  `planned` articles were flagged for human review, so the routine was a
  no-op. Resolved by queueing a new Phase 2 batch: 30 articles merged into
  `content-ops/seed.json`/`content.db` from `21-phase2-content-briefs-full30.md`
  (15 keyword-validated, phase 40-54, locked write order; 15
  topical-authority/structural, phase 55-69), commit `6e04220`. The old
  `non-parametric-tests` stub was retired (superseded by the new
  `mann-whitney-u-test` + `kruskal-wallis-test` split per the brief's own
  guard) and two keywords moved off the existing `t-test` article onto the
  new `paired-vs-independent-t-test`. PAUSED marker deleted; `content_db.py
  next` now resolves `types-of-variables` first. The original 6 remaining
  flagged articles (how-to-find-frequency, proportions-in-statistics,
  statistics-symbols, range-of-a-function, regression-to-the-mean,
  confidence-interval) are still `flagged=1` and excluded from the queue --
  still awaiting a decision, unaffected by this batch.
  - Also consolidated from 2 daily cron routines to 1: disabled `statohub
    publish 23:45 Malta` (`trig_011bnYzdcX76mXawduUgnHnP`), kept `statohub
    publish 03:00 Malta` (`trig_01DhQoEV3sRaKynzFC88xTzh`, cron `0 1 * * *`
    UTC) as the sole daily publisher -- one article/day going forward.
- **6 previously-flagged articles: unblocked 2026-07-11.** 4 had genuine
  keyword/intent problems (physics or algebra terms, not statistics) and were
  re-scoped rather than dropped:
  - `how-to-find-frequency` -> **`how-to-find-frequency-statistics`**: 11
    wave/wavelength-physics keyword phrasings dropped, primary keyword
    extended to "how to find frequency in statistics".
  - `range-of-a-function` -> **`range-of-a-function-statistics`**: 2
    algebra-only phrasings dropped, primary keyword extended to "range of a
    function in statistics".
  - `statistics-symbols` -> **`statistics-symbols-cheatsheet`**: rebranded as
    a cheat-sheet reference page (title/slug only; underlying keywords were
    already statistics-scoped).
  - `proportions-in-statistics` (slug unchanged, already statistics-scoped):
    2 pure-algebra phrasings dropped, remaining keywords extended with "in
    statistics".
  - All 4 had kd_min/kd_max/combined_volume nulled where keywords were
    dropped (old figures were driven by the removed off-topic keywords and
    no longer apply -- needs fresh keyword research before trusting a
    KD-based priority for these).
  - `regression-to-the-mean` and `confidence-interval` had no intent problem
    -- unflagged as-is, no other changes.
  - All 6 are now `flagged=0` (phase 1-2, below the Phase 2 batch's phase
    40-69), so they resolve ahead of the 30-article batch in `content_db.py
    next` -- confirmed via `next` (resolves `proportions-in-statistics`) and
    `list --status planned`.
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
