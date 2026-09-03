# Session: housekeeping — docs alignment, guardrails, cleanup — 2026-09-03

**Objective:** execute the housekeeping pass NOW.md had earmarked without a
scope: remove dead files, audit both content pipelines and the memory system,
verify the boards, and realign `CLAUDE.md` / `ARCHITECTURE.md` / `NOW.md` so
agentic sessions stop losing time to contradictions.

**Completed:**
- **Verified the boards need no split.** They are already separate by *source*:
  `content.db` (78 published internal) + `outsource_content.db` (10 published
  vendor) = the 88 MDX files on disk, zero slug overlap. Recorded the axis as
  ADR 0021 so the Learn/Applied-vs-internal/vendor confusion is not relitigated.
- **Closed the `dump` gap (P0).** No skill or agent ever ran
  `db_sync.py dump`, yet `outsource-content-reviewer` commits and pushes on its
  own — so it swept up a stale `.sql` (the desync NOW.md recorded). Added the
  dump to both skills and the reviewer, plus a "confirm the `.sql` is staged"
  check. Its instruction to commit `outsource_content.db` was also stale; the
  `.db` has been gitignored since ADR 0018.
- **Built `scripts/check-docs.mjs`**, the validation gate `MEMORY-SYSTEM.md`
  specified and nobody wrote: link/wikilink resolution, ADR-index completeness,
  `NOW.md`/`CLAUDE.md` line caps, session-archive age. Wired into
  `npm run build`. It found 11 real defects on first run.
- **Wired board verification into the build and CI.** `db_sync.py check` runs
  in `npm run build` (where the `.db` exists and drift is detectable); CI runs
  `rebuild && check`, which can only prove the dumps are valid SQL.
- **Fixed the doc contradictions:** CLAUDE.md contradicted itself ("6-7
  categories" vs "ten category hubs"); ARCHITECTURE.md had **zero** mentions of
  the Applied section or the outsource pipeline and still cited superseded ADR
  0016 as current; the outsource skill told sessions to pick by
  `queue_position` while NOW.md said never to. Applied-vs-Learn playbook
  routing was missing from CLAUDE.md entirely.
- **Fixed `content.db` category drift:** the renamed `foundations` hub was
  still stored as `statistics-basics` (8 articles + 1 calculator repointed) and
  a phantom `calculators` category row was deleted. 11 → 10 rows, now exactly
  matching `src/content/categories/*.yaml`.
- **Cleanup:** deleted 3 empty `.tmp-vitest-*` dirs and 15 June session files
  (>30d, per the repo's own policy); archived 3 July sessions and 38 CLOSED
  handoff tasks; moved 2 loose root `.md` files and `SEO-Audit/` under `docs/`.
  Root now holds only `CLAUDE.md` and `AGENTS.md`. Added `.tmp-*` to
  `.gitignore`.
- **Trimmed `AGENTS.md` 335 → 86 lines**, dropping a task changelog that
  stopped being maintained at TASK-035, and fixed the dead
  `../Claude_OS/CODEX-WORKFLOW.md` path (also referenced in `handoff/README.md`).
- **REPO-MAP drift is clean for the first time** — it had never mentioned
  `outsource-content/`.

**Files changed:** `CLAUDE.md`, `AGENTS.md`, `docs/ARCHITECTURE.md`,
`docs/PROJECT.md`, `docs/REPO-MAP.md`, `docs/status/NOW.md`,
`docs/decisions/0021-boards-split-by-source.md`, `docs/decisions/README.md`,
`handoff/README.md`, `scripts/check-docs.mjs` (new), `package.json`,
`.github/workflows/deploy.yml`, `.gitignore`, `content-ops/content.sql`,
`.claude/skills/{write-article,publish-outsource-article}/SKILL.md`,
`.claude/agents/outsource-content-reviewer.md`, plus file moves/deletions.

**Decisions made:** [[0021-boards-split-by-source]] — boards split by source,
not section; no rows migrate between them.

**Assumptions:** the 3 July session files were *moved* into `archive/` rather
than deleted; their 30-day deletion clock starts now. `docs/legacy/` and
`docs/status/sessions/archive/` are excluded from link checking as immutable
history — a future session should not "fix" links inside them.

**Tests/verification:** `check-docs.mjs` 0 violations; `db_sync.py check` both
boards ok; `gen-repo-map.mjs` no drift; `astro check`, `npm test`,
`npm run build` — see the results section below.

**Open issues / risks:**
1. `db_sync.py check` still recommends `dump` when the `.db` is the stale side
   — the tool bug is documented, not fixed.
2. The GitHub PAT rotation is still outstanding (security).
3. Applied hubs remain thin: 1 article each in `time-series-forecasting` and
   `machine-learning-statistics`.

**Next actions:**
1. Choose internal Applied batch 2 topics (4, one per hub) — the oldest open
   thread, and it would also thicken the two thin hubs.
2. Rotate the GitHub PAT.
3. Publish the 3 outsource articles that actually exist upstream.

**Context for next session:** `docs/status/NOW.md`, `CLAUDE.md`,
`docs/decisions/0021-boards-split-by-source.md`.
