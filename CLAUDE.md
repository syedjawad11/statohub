# statohub.com

Statistics education + calculators website. Astro (SSG) + Tailwind + MDX ->
Cloudflare Pages. This file is a **router, not a knowledge dump** -- it holds
permanent rules plus pointers to where everything else actually lives. Keep it
under ~150 lines; put detail in the linked doc, not here.

**If two documents disagree:** a decision record (`docs/decisions/`) wins over
prose docs, and a newer decision wins over an older one. Report the conflict
in your session note rather than silently picking a side.

## What to read before which task

- **Starting any session** -> `docs/status/NOW.md` (current state, active
  work, blockers) -- read this first, always.
- **Writing or editing content** -> `docs/standards/content.md` first, then the
  playbook for the section you are in -- they are not interchangeable:
  **Learn** -> `.claude/seo-playbook.md`; **Applied** ->
  `.claude/applied-playbook.md`.
- **Outsourced (babylovegrowth) content** -> `outsource-content/README.md` and
  the `/publish-outsource-article` skill. Never route it through
  `content_db.py`; it has its own board and CLI (`outsource_db.py`).
- **Templates, CSS, components, the theme** -> `docs/DESIGN-SYSTEM.md`.
- **Anything architectural** (stack, URL scheme, build pipeline, content
  model) -> `docs/ARCHITECTURE.md`.
- **"Why did we decide X?" / before reversing a past call** ->
  `docs/decisions/README.md` first; open only the cited ADR file.
- **"Where does X live in the repo?"** -> `docs/REPO-MAP.md`.
- **What actually happened and when** -> `docs/status/sessions/` (dated,
  historical -- not auto-loaded, open only when archaeology is needed).
- **The full original build spec** (superseded by `docs/ARCHITECTURE.md` for
  current facts, kept for historical depth) -> `docs/legacy/BUILD-PLAN.md`.

Read nothing else by default. Never load `research/` or `docs/ideas/` raw
prose (e.g. `docs/ideas/statohub-strategy-review.md`,
`docs/ideas/statohub-action-plan.md`) unless the task explicitly concerns
strategy planning -- their durable conclusions are already promoted into
`docs/PROJECT.md` and the ADRs.

## What this site is

- 88 published teaching articles + ~29 standalone calculator pages across the
  ten category hubs. Full thesis: `docs/PROJECT.md`.
- Wedge: deep calculator **+** teaching on the same page -- see
  [[0001-wedge-model]] (`docs/decisions/0001-wedge-model.md`).

## Non-negotiable rules (full detail in `docs/ARCHITECTURE.md` + the cited ADRs)

- **Flat trailing-slash URLs.** `/{slug}/` for articles (no category in path),
  `/{category}/` hubs, `/calculators/{tool}/`. Every URL ends in `/`. See
  [[0002-flat-url-structure]].
- **Zero internal redirects / 404s**, enforced at build time via
  `src/lib/links.ts` (typed route registry) + `scripts/check-links.mjs`
  (build gate). Never hand-write a raw internal `<a href>`.
- **No odds calculators.** `/calculators/betting-odds/` and
  `/calculators/odds/` are removed entirely and must 404. See
  [[0003-no-odds-calculators]].
- **Stack lock:** Wrangler v3 (Node 20.8.0 breaks v4); `src/calc/**` stays
  pure (no DOM/astro/network); MDX; no raw LaTeX in content. See
  [[0005-wrangler-v3-lock]].
- **No accounts, backend, database, or community features** on the current
  roadmap. See [[0013-no-accounts-backend-community-yet]].
- **Two content sections, ten category hubs -- don't mix them up.** *Applied*
  (`section: applied` in the category YAML) is exactly four: `data-analysis`,
  `experiments-causality`, `time-series-forecasting`,
  `machine-learning-statistics`. *Learn* is the other six: `foundations`,
  `descriptive-statistics`, `inferential-statistics`,
  `probability-distributions`, `regression-correlation`, `combinatorics`. A
  section is inferred from the hub -- article frontmatter never states it.
- **Every babylovegrowth / outsourced article is Applied.** Its `category`
  must be one of the four Applied hubs, never a Learn hub -- pick the closest
  Applied fit rather than the best topical fit across all ten. Enforced by
  `ALLOWED_CATEGORIES` in `outsource-content/check_sanitized.py`. See
  [[0020-outsource-is-applied-only]].
- **The two content boards split by *source*, not by section.**
  `content-ops/content.db` holds everything **we** write (all Learn + the
  internally written Applied articles); `outsource-content/outsource_content.db`
  holds only **vendor** articles. So "Applied" spans both boards, and neither
  board alone answers "what is live". Never migrate rows between them. See
  [[0021-boards-split-by-source]].
- **Board changes only reach git through a dump.** Both `.db` files are
  gitignored: after any board write run `python3 scripts/db_sync.py dump` and
  commit the `.sql`; after a clone run `rebuild` or the CLIs fail. `npm run
  build` runs `check`, so a forgotten dump fails the build. See
  [[0018-sqlite-boards-as-sql-dumps]].

## Operating Model — Delegation First (BINDING)

The main Claude session is the **Orchestrator (Tier 0)**: it plans, routes,
reviews, gates, decides, and maintains `CLAUDE.md` + `NOW.md`. It does **not**
do bulk reading, bulk drafting, or long audits itself.

- **Default to delegation without being asked** for: reading more than ~3 files
  or any large file (e.g. `global.css`, a long brief, a batch of session logs);
  drafting or reviewing article / calculator-teaching content; any SEO /
  technical audit or on-page analysis; any live data pull (DataForSEO, SERP, web
  research); mechanical extraction, counting, cross-checking, or
  link/verification sweeps. Anything parallelizable -> fire independent
  subagents in parallel.
- **Do it yourself only for:** a single small read, a decision, a review or
  spot-check, a small targeted edit, or a `content_db.py` command.
- **Model tiering (BINDING):** Orchestrator = the session's own model; Tier 1
  (mechanical / read-only / verification) = `haiku`; Tier 2 (content drafting /
  SEO strategy / synthesis) = `sonnet`. Never spawn a subagent on the
  orchestrator's own model unless the user asks. Apply the same tiers to the
  `claude-seo` plugin agents via the Agent tool's per-spawn `model` override --
  never edit plugin files.
- **Summarization contract (BINDING):** every subagent writes its full output to
  disk (scratch or the relevant `docs/` / `content-ops/` path) and returns only
  `STATUS` * file path(s) * a <=250-word summary with headline numbers *
  decisions needed * flags. Raw file dumps and long tables never enter the
  orchestrator's context.
- **Review is never delegated.** Every subagent result gets a spot-check of key
  claims against the file on disk, a scope check, and a gate.
- **Repo-write gate interaction (important):** this model governs Claude's own
  read-only research / drafting subagents, which write to scratch or staging --
  it does **not** create a second writer on the repo. The "one agent on the repo
  at a time" hard gate (Codex vs. Claude, [[0004-codex-builds-claude-reviews]])
  is unchanged: a subagent may *draft* an article body to disk, but the
  Orchestrator still performs the single gated commit/close.

## Working model

- **Codex builds to spec; Claude writes content + sets SEO rules + reviews.**
  Tasks flow through [`handoff/`](handoff/) (5-state loop:
  `TODO -> IN_PROGRESS -> DONE -> CLOSED`, or `CHANGES_REQUESTED`). One agent
  on the repo at a time. See [[0004-codex-builds-claude-reviews]].
- **Close = verify against real artifacts**, not the Work Log alone: re-run
  `npx astro check`, `npm test`, `npm run build` (includes the link gate)
  before setting any task `CLOSED`.
- Content pipeline (articles + calculator teaching blocks) is described in
  `docs/ARCHITECTURE.md` "Editorial / content pipeline" and
  `docs/standards/content.md`. Current backlog status lives in
  `docs/status/NOW.md`, not here.

## Session-end convention

Run **`/session-close`**. It updates `docs/status/NOW.md`, writes a dated
handoff to `docs/status/sessions/` when the session left work unfinished or
made a decision, and promotes durable decisions to a new ADR. A session that
only executes an already-decided plan needs no handoff -- update the tracker.

## Memory system

This repo's documentation structure follows `docs/MEMORY-SYSTEM.md`
(the full rationale + migration plan). That migration is tracked as its own
project thread -- see `docs/status/NOW.md` for its current status before
assuming it's finished.
