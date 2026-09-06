# statohub.com — workspace map

Statistics education + calculators site. Astro (SSG) + Tailwind + MDX ->
Cloudflare Pages. This file is a **map**: where things live and how work moves.
The rules themselves live in the linked docs — don't restate them here.

**If two documents disagree:** a decision record (`docs/decisions/`) beats prose,
and a newer decision beats an older one. Flag the conflict rather than silently
picking a side.

## Where to look

- **Starting a session** -> `docs/status/NOW.md` (current state, active work,
  blockers, live counts). Read this first, always.
- **Writing or editing content** -> `docs/standards/content.md`, then the
  playbook for the section: **Learn** -> `.claude/seo-playbook.md`, **Applied**
  -> `.claude/applied-playbook.md`. They are not interchangeable.
- **Outsourced (babylovegrowth) content** -> `outsource-content/README.md` and
  the `/publish-outsource-article` skill. It has its own board and CLI
  (`outsource_db.py`) — never route it through `content_db.py`.
- **Templates, CSS, components, the theme** -> `docs/DESIGN-SYSTEM.md`.
- **Anything architectural** (stack, URL scheme, build pipeline, content model,
  link safety, both content pipelines) -> `docs/ARCHITECTURE.md`.
- **"Why was X decided?" / before reversing a past call** ->
  `docs/decisions/README.md`, then only the ADR it cites.
- **"Where does X live?"** -> `docs/REPO-MAP.md`.
- **What happened and when** -> `docs/status/sessions/` (open for archaeology).
- **The original build spec** -> `docs/legacy/BUILD-PLAN.md` (superseded by
  `docs/ARCHITECTURE.md` for current facts).

Read nothing else by default. `research/` and `docs/ideas/` raw prose are not
for general loading — their conclusions are already in `docs/PROJECT.md` and
the ADRs.

## What this site is

Teaching articles + standalone calculators across ten category hubs. The wedge
is a deep calculator **and** teaching on the same page ([[0001-wedge-model]]).
Full thesis: `docs/PROJECT.md`; live counts: `docs/status/NOW.md`.

## Invariants — one line each; the cited doc or ADR is the authority

- Flat trailing-slash URLs, one folder per route — [[0002-flat-url-structure]].
- Zero internal redirects/404s; internal links only via `src/lib/links.ts` —
  `docs/ARCHITECTURE.md` §Zero internal redirects.
- No odds calculators — [[0003-no-odds-calculators]].
- Stack lock (Wrangler v3, pure `src/calc/**`, MDX, no raw LaTeX) —
  [[0005-wrangler-v3-lock]], `docs/ARCHITECTURE.md` §Stack.
- Two sections, ten hubs; a section is inferred from the hub, never from
  frontmatter — `docs/ARCHITECTURE.md` §Content model.
- Every outsourced article is Applied — [[0020-outsource-is-applied-only]].
- The two boards split by **source**, not section; never migrate rows —
  [[0021-boards-split-by-source]].
- Board `.db` files are gitignored: `db_sync.py dump` before commit, `rebuild`
  after clone — [[0018-sqlite-boards-as-sql-dumps]].
- No accounts, backend, database, or community features —
  [[0013-no-accounts-backend-community-yet]].

## How work flows

- **Codex builds to spec; Claude writes content, sets SEO rules, and reviews.**
  Tasks move through `handoff/` (`TODO -> IN_PROGRESS -> DONE -> CLOSED`, or
  `CHANGES_REQUESTED`). **One agent on the repo at a time** —
  [[0004-codex-builds-claude-reviews]]. A subagent drafting to scratch is not a
  second writer; the orchestrator still makes the single gated commit.
- **Closing means verifying against real artifacts**, not the Work Log: re-run
  `npx astro check`, `npm test`, `npm run build` (link, meta, docs and board
  gates) before setting anything `CLOSED`.
- **Review is never delegated.** `stats-article-reviewer` has no `Write` tool by
  design, and `outsource-content-reviewer` publishes to production with no human
  checkpoint — the orchestrator's spot-check is the last line of defence.
- **Delegate when it genuinely helps** — large parallel sweeps, drafting,
  audits, live data pulls — picking the cheapest model that can do the job. No
  fixed tier table. For big jobs have the subagent write detail to disk and
  return a summary; for small ones just take the answer.

## Content pipelines

Internal (`content-ops/content.db`, `content_db.py`, `/write-article`) covers
everything we write; outsourced (`outsource-content/outsource_content.db`,
`outsource_db.py`, `/publish-outsource-article`) covers vendor articles only.
Neither board alone answers "what is live". Mechanics: `docs/ARCHITECTURE.md`
§Editorial / content pipeline.

## Session end

Run **`/session-close`**: it updates `docs/status/NOW.md`, writes a dated
handoff to `docs/status/sessions/` when work was left unfinished or a decision
was made, and promotes durable decisions to a new ADR.
