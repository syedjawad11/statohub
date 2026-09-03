# Session: workspace restructure — delegation-first model — 2026-07-11

**Objective:** Align statohub's workspace with the Claude_OS delegation-first
structure per `STATOHUB-restructure-implementation-prompt.md`, as a delta (add
only the gaps; don't rebuild what the July-5 memory migration already did).

**Completed:**
- Added `## Operating Model — Delegation First (BINDING)` to `CLAUDE.md`
  (orchestrator role, when-to-delegate, haiku/sonnet tiering, summarization
  contract, review-never-delegated, and the repo-write-gate reconciliation with
  ADR 0004). File now 127 lines (cap 150).
- Built the `/session-close` skill (`.claude/skills/session-close/SKILL.md`) and
  pointed `CLAUDE.md`'s "Session-end convention" at it (prose kept as fallback).
- Phase 3 Option A: created `docs/status/sessions/archive/` and `git mv`'d the 15
  `2026-06-*` session logs into it; 2 July files stay top-level.
- Phase 4 was already satisfied — both stats agents already carry `model: sonnet`.

**Files changed:** `CLAUDE.md`, `.claude/skills/session-close/SKILL.md`,
`docs/status/NOW.md`, 15 renames under `docs/status/sessions/archive/`, this file.

**Decisions made:** Phase 3 Option A (archive folder, immutable snapshots) —
matches `MEMORY-SYSTEM.md` §7; chosen by the user. No new ADR created (the
operating model lives as a `CLAUDE.md` section by the brief's design).

**Assumptions:** The delegation-first model governs Claude's own read-only
research/drafting subagents only; the "one agent on the repo" gate (ADR 0004) is
unchanged. `stats-article-reviewer` stays `sonnet` because its review is
judgment-heavy (E-E-A-T, formula accuracy, tone), not mechanical.

**Tests/verification:** `wc -l CLAUDE.md` = 127; no `## Current State` block; skill
frontmatter valid, body 96 lines; `git status` scoped to `CLAUDE.md`/`.claude/`/
`docs/` only; 15 archived + 2 top-level = 17 (no session content lost).

**Open issues / risks:**
- `NOW.md` is ~160 lines, over its ~60 cap — a future trim pass is warranted
  (left alone here to avoid dropping live parked-work context).
- `docs/REPO-MAP.md` not regenerated for the new archive folder + skill.
- Optional (Phase 1.2): codify the cloud-routine + calc-prose flows as skills —
  deferred until article publishing stabilizes.
- Pre-existing uncommitted `docs/legacy/SITE-ARCHITECT.md` and untracked
  `scripts/gen-repo-map.mjs` were left as-is (not part of this work).

**Next actions:** (1) optionally trim `NOW.md` to ~60 lines; (2) regen REPO-MAP
if desired; (3) resume monitoring the article-publishing routine (RESUMED
2026-07-11).

**Context for next session:** `docs/status/NOW.md`, `CLAUDE.md`,
`.claude/skills/session-close/SKILL.md`.
