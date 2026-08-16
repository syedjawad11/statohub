# Now

> Current state, active work, and blockers. This file wins over any session
> handoff if they disagree -- fix the conflict immediately when found. Updated
> at the end of any session that changes priorities; kept under ~60 lines.

**Last updated:** 2026-08-16.

## Active: Applied Statistics restructure -- planned and approved, Stage 0 pending

The site is being restructured from one section into three: **Learn**,
**Calculators**, and a new **Applied Statistics** section (4 new category hubs
at flat root URLs, `/applied/` landing, 8 first articles), plus a homepage
rebuild to a supplied mock. Full approved plan, including the 9 Codex handoff
tasks (TASK-025...033) and the two ADRs it requires (0014 applied URL family,
0015 wedge scoped to Learn), lives in the session's plan file; promote to ADRs
before building. Source material: `docs/ideas/statohub-applied-content-style-plan.md`
(the 2026-08-09 applied-format spec, never implemented -- its `/blog/` URL
decision is **superseded** by flat root URLs) and
`docs/ideas/homepage-redesign-mock-2026-08-16.png`.

**Stage 0 is a blocker and needs the user:** Codex is to be driven through
`codex mcp-server` rather than hand-relayed. Requires
`claude mcp add codex -s user -- cmd /c codex mcp-server`, a generous
`MCP_TOOL_TIMEOUT`, and a **Claude Code restart** before the `mcp__codex__*`
tools exist. Verified available: codex-cli 0.147.0, logged in, statohub already
`trust_level = "trusted"`. Nothing built yet.

## Content pipeline: QUEUE EXHAUSTED -- routine idle since 2026-08-14

**The daily publisher is not broken; it has run out of work.** `content-ops/routine-runs.log`
shows clean daily successes 2026-08-09 through **2026-08-14** (`simpsons-paradox`,
commit `73ba4cd`), then nothing. `content_db.py next` returns *"No unflagged
'planned' articles left"*, and `list --status planned` returns **0** with or
without `--flagged`.

- **75 rows in `content.db`**; the only non-published one is
  **`validity-in-statistics`** -- status `research_pending`, **flagged**,
  KD 6-11, ~16,500 combined volume. It needs keyword research before it can be
  written.
- **On disk: 74 article files** (73 `draft: false`, 1 draft). Build produces
  **109 pages**.
- **Decision needed:** either queue a new Learn batch, or leave the routine idle
  through the Applied restructure. Leaving it idle has a real upside -- no cloud
  routine committing to `origin/main` while the restructure lands, so no
  contention with the one-agent-on-the-repo gate.
- Trigger `trig_01DhQoEV3sRaKynzFC88xTzh` ("statohub publish 03:00 Malta", cron
  `0 1 * * *` UTC) is still the sole daily publisher and remains enabled -- it is
  simply a no-op each night while the queue is empty.

## Baseline verified 2026-08-16

`npm run build` green on the current `origin/main`: 109 pages, 4,066 internal
links checked, **0 link violations**, **0 meta-description violations**.

## Recently closed

- **Local repo was 70 commits behind `origin/main`** (local `0b227e5` 2026-07-11
  vs origin `19fb8f5` 2026-08-14) -- fast-forwarded 2026-08-16. Article count went
  39 -> 74. No architecture files differed. This is exactly what the
  count-against-`origin/main` gate below exists to catch.
- **`scripts/gen-repo-map.mjs` fixed 2026-08-16.** Was untracked *and* broken
  while `.claude/skills/session-close/SKILL.md` and `docs/REPO-MAP.md` both
  referenced it -- it used `URL.pathname`, which stays percent-encoded, so a repo
  path containing spaces never resolved. Now uses `fileURLToPath` (matching
  `gen-route-ids.mjs`) and only reports directories + root files, cutting 75
  false positives to 11 real ones.
- **Phase A (workspace audit fixes) and Phase B (memory-system migration):**
  both CLOSED 2026-07-05, committed `e7bf3a1`. Meta-description length fix +
  build gate closed same day.
- **Delegation-first operating model + `/session-close` skill:** shipped
  2026-07-11, commit `0b227e5`. See
  `docs/status/sessions/2026-07-11-workspace-restructure-delegation-model.md`.

## Parked / paused (do not silently resume)

- **`docs/REPO-MAP.md` is stale.** The now-working drift checker flags 11 real
  undocumented entries: `SEO-Audit/`, `docs/audit/`, `docs/ideas/`,
  `vitest.config.ts`, `postcss.config.cjs`, `package-lock.json`, and the two
  root-level content-brief docs. Needs a hand-written annotation pass.
- **Article schema `image` field.** Every article ships Article JSON-LD with no
  `image` property (`ogImage` is optional in `src/content/config.ts` and unset
  everywhere). Google effectively requires it for Article rich-result
  eligibility. Fix: set `ogImage` per article, or fall back to
  `/og-default.png` inside `articleSchema()` in `src/lib/schema.ts`, as
  `Meta.astro` already does for OG tags.
- **`how-to-find-the-range` content refresh.** 5 range-in-statistics keywords
  were folded into this already-published article on 2026-07-11; they are in the
  DB but never worked into the live page text. Light refresh, not a rewrite.
- **`relative frequency` / `cumulative frequency`** are not covered by any
  article and are open candidates for new Learn pieces.
- **No `.gitattributes`** with `core.autocrlf=true`, so generated files
  (`src/lib/content-route-ids.ts`) show phantom CRLF-only diffs after a build.
  Cosmetic, but it makes `git status` lie.
- **Phase C / Phase D** per `docs/ideas/statohub-action-plan.md`: not started.

## Standing hard gates

- One agent on the repo at a time (Codex builds via `handoff/`, Claude
  reviews/closes and writes content).
- Never commit doc-restructuring or ADR work without showing the user first.
- Always count "done/pending" against `origin/main` after `git fetch`, never the
  local tree -- this failed on 2026-08-16 and cost a 70-commit surprise.
