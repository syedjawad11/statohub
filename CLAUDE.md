# statohub.com

Statistics education + calculators website. Astro (SSG) + Tailwind + MDX →
Cloudflare Pages. Built from the completed SEO study + content-architecture in
`../Claude_OS/project ideas/statistics-calculator-seo-study/`.

**Authoritative build spec:** [`BUILD-PLAN.md`](BUILD-PLAN.md) — read it first.

---

## What this site is

- ~50 teaching articles + ~23 standalone calculator pages across 7 categories.
- Wedge: deep calculator **+** teaching on the same page (no incumbent does both).
- Built bottom-up: KD 0–5 content first, pillars (KD 22–56) later.

## Non-negotiable rules (full detail in BUILD-PLAN.md)

- **Flat trailing-slash URLs.** `/{slug}/` for articles (no category in path),
  `/{category}/` hubs, `/calculators/{tool}/`. Every URL ends in `/`.
- **Zero internal redirects / 404s**, enforced at build time via `src/lib/links.ts`
  (typed route registry) + `scripts/check-links.mjs` (build gate).
- **No odds calculators.** `/calculators/betting-odds/` and `/calculators/odds/`
  are removed entirely. Educational `/calculators/probability/` stays.
- **Stack lock:** Wrangler v3 (Node 20.8.0 breaks v4); uPlot lazy-loaded; MDX.

## Working model

- **Codex builds to spec; Claude writes content + sets SEO rules + reviews.**
  Tasks flow through [`handoff/`](handoff/) (5-state loop). One agent on the repo
  at a time. This `CLAUDE.md` log has one writer: Claude. See
  `../Claude_OS/CODEX-WORKFLOW.md`.

## ⏳ Waiting on you (before the build can start)

These are gated on your review + the few things only you can do. Once done, tell
Claude and the Codex build begins (TASK-001 onward).

1. **Review the plan.** Read [`BUILD-PLAN.md`](BUILD-PLAN.md) end-to-end and flag
   anything you want changed (scope, URL SOP, calculator list, content order).
2. ~~**Cloudflare login**~~ ✅ **DONE (2026-06-13)** — logged in via `wrangler@3`
   as `syedjawadhassan11@gmail.com` (account `027007f4d056b885d434f48b4f136a07`),
   token has `pages (write)`. **Still pending:** `npx wrangler@3 pages project
   create statohub --production-branch main` — deferred until after TASK-001
   produces a `dist/` (it's part of TASK-007 deploy wiring; no point before then).
3. **GitHub repo — give the go-ahead.** Claude will `git init` here + create the
   `statohub` repo and push (via the github MCP / `gh`). Just confirm the repo
   name (`statohub`) and public/private. Nothing for you to type unless you'd
   rather create it yourself.
4. **Custom domain (after first deploy).** Attach `statohub.com` (+ `www`) to the
   Pages project — in the Cloudflare Pages dashboard, or hand Claude a Cloudflare
   API token (Pages:Edit + DNS:Edit) to script it. Plan keeps apex as canonical
   with a single `www → apex` 301.

**Nothing is built yet** — no scaffold, no git, no Cloudflare *project* (the
account is now authenticated, but the Pages project isn't registered yet).
Items 1, 3, 4 still pending your review/go.

## Maintenance convention

At the end of each session, append a dated entry to the Session log below.

## Session log

- **2026-06-13** — Repo bootstrapped. Created `Desktop/statohub/` as the dedicated
  build folder (separate from Claude_OS per the research/build separation SOP).
  Saved the approved big plan as `BUILD-PLAN.md` (Phase 0 tools inventory + Plan A
  site buildup / Plan B SEO rules / Plan C content + Codex handoff division).
  Stood up the `handoff/` task box (`README.md` + `TEMPLATE.md`), this `CLAUDE.md`
  session log, `AGENTS.md` (Codex entry point), and `.gitignore`. **No code/scaffold
  built yet** — that begins when the first task briefs (`TASK-001`…`007`) are dropped
  into `handoff/` for Codex. Locked decisions this session: both odds calculators
  removed; Astro + Tailwind; new Desktop/statohub repo; Codex builds / Claude
  writes + reviews. **Next:** write `TASK-001` (Astro scaffold + trailing-slash
  contract + Tailwind/dark-mode) and the one-time Cloudflare steps
  (`wrangler@3 login`, `pages project create statohub`).

- **2026-06-13** — Added a **"⏳ Waiting on you"** section near the top of this file
  capturing the user's pending action items before the build can start: (1) review
  `BUILD-PLAN.md`, (2) one-time Cloudflare `wrangler@3 login` + `pages project
  create statohub` (interactive — only the user can do it), (3) give the go-ahead
  for `git init` + GitHub `statohub` repo, (4) attach the custom domain after first
  deploy. **Paused here per user request** — will continue (write TASK-001 + init
  git) once the user has reviewed the plan and given the go.

- **2026-06-13** — Plan approved; **TASK-001 written + Cloudflare login done**.
  Wrote `handoff/TASK-001-scaffold-trailing-slash-tailwind.md` (status `TODO`):
  Astro scaffold + flat-trailing-slash contract (`trailingSlash:'always'` +
  `build.format:'directory'`, every route is `<folder>/index.astro`) + Tailwind
  class-based dark mode w/ pre-paint no-flash script + `BaseLayout` + two
  proof-of-contract routes (`/` and a throwaway `/normal-distribution/`) +
  `wrangler.toml`. Brief pins the **exact** `astro.config.mjs` and explicitly
  overrides the simpler config in the `.codex/skills/astro-tailwind-cloudflare`
  skill (which omits trailingSlash/build.format/mdx/sitemap). DoD: `npm install`
  + `npm run build` → both `dist/index.html` AND `dist/normal-distribution/index.html`,
  `astro check` clean, dark toggle no-flash, sitemap all slash-terminated.
  **Cloudflare auth cleared:** `wrangler@3 login` succeeded (first attempt's OAuth
  callback timed out → relaunched → exit 0); `whoami` confirms logged in as
  `syedjawadhassan11@gmail.com`, account `027007f4d056b885d434f48b4f136a07`, token
  scope includes `pages (write)`. `pages project create` intentionally deferred to
  TASK-007 (needs a `dist/` first). Wrote the copy-paste **Codex kickoff prompt**
  (orient to repo → read AGENTS.md → BUILD-PLAN.md → pick lowest `TODO` → run the
  5-state handoff loop → scaffold only, don't edit CLAUDE.md, don't touch siblings).
  **Git boundary locked per user:** the `statohub` repo will contain ONLY
  `Desktop/statohub/` files — nothing from the `Claude_OS` workspace (structurally
  guaranteed since they're separate sibling folders). Git still NOT initialized
  locally — recommend `git init` + GitHub push **after** Codex returns TASK-001
  `DONE`. **Next (Claude):** review Codex's TASK-001 Work Log when status flips to
  `DONE`, then init git + push, then write TASK-002. **Next (user):** hand the
  Codex prompt to Codex in the statohub workspace.

- **2026-06-13** — **TASK-001 reviewed → CLOSED.** Codex returned it `DONE`;
  Claude verified against the actual artifacts (not just the Work Log):
  `astro.config.mjs` matches the pinned contract exactly; `dist/index.html` +
  `dist/normal-distribution/index.html` both built (directory output + folder-
  per-route confirmed); `dist/sitemap-0.xml` lists only the two slash-terminated
  URLs; `tailwind.config.cjs` has `darkMode:'class'`; `BaseLayout.astro` has the
  pre-paint no-flash `<head>` script + working persisted toggle; `wrangler.toml`
  present. Accepted Codex's deviation (Tailwind v3 via PostCSS instead of
  `@astrojs/tailwind`) — it keeps `integrations:[mdx(), sitemap()]` exactly as
  required. Verdict + notes written into the task file's Review section.
  **Next (Claude):** git init + GitHub `statohub` repo push (gated on user's
  go-ahead + public/private call), then write `TASK-002` (content collections
  schema: `categories`/`articles`/`calculators` Zod collections per BUILD-PLAN A2).
