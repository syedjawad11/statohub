# Session: agentic-workflow restructure — 2026-09-06

**Objective:** convert the workspace instruction layer from a model-era rulebook
into a map, dedupe every rule to one canonical home, and clear dead weight —
without touching the outsource content engine.

**Completed:**
- `CLAUDE.md` 148 -> 89 lines and `AGENTS.md` 86 -> 68, both now maps. The
  `BINDING` delegation block, the `haiku`/`sonnet` tier table, the dead
  `claude-seo` plugin reference and the stale 88/~29 counts are gone.
- Full dedupe: `docs/ARCHITECTURE.md` + the ADRs are the single authority;
  `docs/PROJECT.md` and `docs/REPO-MAP.md` point instead of restating, breaking
  the PROJECT -> CLAUDE -> ARCHITECTURE pointer cycle.
- `docs/standards/content.md` 93 -> 53 (keeps only the two-content-types
  distinction and the internal-linking model); `applied-playbook.md` 284 -> 247
  (~90 lines of hand-copied component props replaced by pointers to the real
  `.astro` files); `seo-playbook.md` 218 -> 208.
- Fixed: `.mcp.json` `codex.cmd` -> `codex` (had ENOENTed every session since
  the Windows -> Linux migration); `handoff/README.md` dangling `BUILD-PLAN.md`
  link and "CLAUDE.md session log" wording; two stale skill references.
- `handoff/TASK-014/015/016` archived as `CLOSED` — superseded, all 11 engines
  already shipped in `src/calc/`.
- Cloud routines retired to `docs/legacy/cloud-routine/`; `PAUSED` deliberately
  left at `content-ops/cloud-routine/` with a stub README.
- `scripts/check-docs.mjs` now scans `handoff/` + `.claude/`, freezes
  `handoff/archive`, strips code spans before link-scanning, and caps
  `CLAUDE.md` at 90 / `AGENTS.md` at 70.

**Files changed:** `CLAUDE.md`, `AGENTS.md`, `.mcp.json`,
`scripts/check-docs.mjs`, `.claude/{seo,applied}-playbook.md`,
`.claude/skills/{write-article,session-close}/SKILL.md`,
`docs/{PROJECT,REPO-MAP,MEMORY-SYSTEM}.md`, `docs/standards/content.md`,
`docs/status/NOW.md`, `docs/decisions/{0022-*,README}.md`,
`handoff/{README,TEMPLATE}.md`, `handoff/archive/TASK-01{4,5,6}-*.md`,
`docs/legacy/cloud-routine/*`, `content-ops/cloud-routine/README.md`,
`content-ops/calc-prose/{QUEUE,SESSION-PLAN}.md`, `outsource-content/README.md`.

**Decisions made:** [[0022-routers-are-maps-not-rulebooks]]. Four user calls
made in-session: keep the two-agent Codex model (clean, don't retire); trim
playbooks by cutting exposition + duplicated component APIs; retire the cloud
routines to `docs/legacy/`; dedupe fully.

**Assumptions:** the `codex` MCP server is fixed but **not yet proven** — it
resolves on `$PATH`, and a session restart is needed to confirm it connects.

**Tests/verification:** `npx astro check` 0 errors; `npm test` 121/121;
`npm run build` 132 pages, 5,011 internal links, 0 link/meta/docs violations,
board dumps clean. Tier labels held at baseline (seo 12/11/5, applied 15/7/5)
and every threshold verified intact (110–160 meta, 2000 Learn, 3000/4500
Applied, 1500 outsource, >=6 sources). The extended doc gate was sanity-tested
with a deliberate bad link and caught it. No `src/` file was touched.

**Open issues / risks:**
1. The claude.ai-side routine schedules still wake nightly — only the user can
   delete them in claude.ai -> Routines.
2. Rotate the GitHub PAT (unchanged, out of scope here).
3. 7 of the 10 "queued" outsource board rows have no upstream article.

**Next actions:** restart the session to confirm the `codex` MCP server
connects; then internal Applied batch 2 topic selection.

**Context for next session:** `docs/status/NOW.md`,
`docs/decisions/0022-routers-are-maps-not-rulebooks.md`.
