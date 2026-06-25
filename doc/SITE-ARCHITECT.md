# SITE-ARCHITECT.md -- statohub.com

The single orientation file for **statohub.com**: what the site is, how it is
built, the commands and tools that operate it, and who does what. Read this
first when picking up work in this repo. Authoritative deep specs live in
[`BUILD-PLAN.md`](BUILD-PLAN.md) (build contract) and
[`AGENTS.md`](AGENTS.md) (Codex entry point); this file is the map that points
at them.

<!-- Plain ASCII only (Codex reads repo files through a Windows codepage):
use `--` not an em dash, `->` not an arrow, `...` not an ellipsis. -->

---

## 1. Core information

- **Product:** statistics education + calculators site. The wedge is a deep
  calculator **and** teaching on the same page -- no incumbent does both.
- **Domain:** https://statohub.com (apex canonical; `www -> apex` single 301).
- **Status:** LIVE. Skeleton (home + calculators hub + standalone calculators)
  is deployed; articles are now unblocked (see TASK-008 -- article layout +
  flat routes landed 2026-06-14).
- **Repo:** `syedjawad11/statohub` (GitHub, public). Local: `Desktop/statohub/`.
- **Hosting:** Cloudflare Pages project `statohub` (production branch `main`,
  Direct Upload via Wrangler v3). Deploy alias: `statohub.pages.dev`.
- **Scope guardrail:** ~50 teaching articles + ~23 standalone calculators across
  7 categories, built bottom-up (KD 0-5 first, pillars later). Research and the
  full content map live in `../Claude_OS/project ideas/statistics-calculator-seo-study/`.

## 2. Tech stack (locked)

- **Astro 4.16 (SSG)** + **Tailwind 3** (PostCSS, class-based dark mode) +
  **MDX** for articles -> **Cloudflare Pages**.
- Calculators are **client-side only** (vanilla `<script>` island, no UI
  framework). Charts (uPlot) are lazy-loaded; the import seam exists but no
  chart is wired yet.
- **Wrangler v3** is pinned (`"wrangler": "^3"`) -- Node 20.8.0 is incompatible
  with Wrangler v4. Do not upgrade.
- Prose styling: hand-rolled `.article-prose` in `src/styles/global.css` (no
  `@tailwindcss/typography` dependency).

## 3. Repository structure (the parts that matter)

```
statohub/
  astro.config.mjs            trailing-slash + directory build + mdx + sitemap
  tailwind.config.cjs         darkMode: 'class'
  wrangler.toml               Pages deploy config (name = statohub, dist output)
  package.json                scripts (see section 5)
  .github/workflows/deploy.yml  push-to-main -> gates -> wrangler deploy

  src/
    content/
      config.ts               Zod schemas: categories | articles | calculators
      categories/*.yaml        7 category configs
      calculators/*.yaml       calculator data configs (engine + form spec)
      articles/*.mdx           article content (filename = flat slug)
    calc/
      *.ts                     pure, framework-free engines (mean, sd, zscore...)
      registry.ts              engines keyed by name; getEngine()
      __tests__/*.test.ts      Vitest unit tests
    components/
      StatCalc.astro           dual-deploy calculator (variant: page | embed)
      Link.astro               typed internal link (compile-time route check)
      Breadcrumbs.astro
      seo/                     Meta, Canonical, JsonLd
      statcalc/                client.ts + format.ts (island logic)
    layouts/
      BaseLayout.astro         page chrome, theme toggle, canonical/OG, JSON-LD
      ArticleLayout.astro      wraps BaseLayout for /{slug}/ article pages
    pages/
      index.astro              home
      [slug]/index.astro       FLAT root article route (drafts excluded)
      calculators/index.astro            calculators hub
      calculators/[slug]/index.astro     standalone calculator pages
      404.astro                noindex 404 (makes unmatched paths real 404s)
    lib/
      links.ts                 url(RouteRef) + routes.* -- single source of truth
      content-route-ids.ts     GENERATED literal-union route ids (do not hand-edit)
      schema.ts                pure JSON-LD builders (Article, Breadcrumb, SoftwareApp)
    styles/global.css          base + .article-prose

  scripts/
    gen-route-ids.mjs          regenerates content-route-ids.ts from src/content/**
    check-links.mjs            post-build link-integrity gate

  content-ops/                 editorial board (SQLite) -- writing pipeline, never ships
    schema.sql, seed.json, content_db.py, content.db

  handoff/                     Codex task drop-box (one file per task)
  .claude/                     Claude Code writing agents + skill + playbook
  BUILD-PLAN.md  AGENTS.md  CLAUDE.md  CONTENT-WORKFLOW.md  SITE-ARCHITECT.md
```

## 4. URL + link contract (non-negotiable, enforced at build time)

- **Flat trailing-slash URLs.** Every route is `<folder>/index.astro`, never a
  flat `[slug].astro`. Every URL ends in `/`.
  - `/` home
  - `/{slug}/` articles (flat root, **no category in path**)
  - `/{category}/` category hubs (planned -- do not yet exist)
  - `/calculators/` and `/calculators/{tool}/`
- **Articles and category hubs both live at the root `[slug]`.** Astro cannot
  have two dynamic `[slug]` directories at the root, so the future category-hub
  task must fold category paths into `src/pages/[slug]/index.astro` (union both
  collections, branch the layout) -- a code comment in that file flags this.
- **No odds calculators.** `/calculators/odds/` and `/calculators/betting-odds/`
  are never built (they 404 by design). `/calculators/probability/` is allowed.
- **Internal links are never hand-typed.** Build them only through
  `routes.*` + `url()` (`src/lib/links.ts`) or `<Link to={...}>`
  (`src/components/Link.astro`). A bogus route id fails `astro check`;
  `scripts/check-links.mjs` then fails the build on any non-slash or
  unresolvable internal link. This is the anti-404/anti-redirect guarantee.
- **Drafts never ship.** `draft: true` articles generate no page
  (`getStaticPaths` filters them out). A human flips `draft: false` to publish.

## 5. Key commands

Run from `Desktop/statohub/`.

| Command | What it does |
|---|---|
| `npm run dev` | Dev server (regenerates route ids first via `predev`). |
| `npm run build` | `gen-route-ids -> astro build -> check-links`. Green build = 0 link violations. The full gate. |
| `npm run gen:routes` | Regenerate `src/lib/content-route-ids.ts` from `src/content/**`. |
| `npm run preview` | Serve the built `dist/` locally. |
| `npm test` | Vitest run (calc engines + format). |
| `npx astro check` | Type + content checks (route-id typing, frontmatter). |

**Verify a green pipeline:** `npm run build` (0 violations) + `npx astro check`
(0 errors) + `npm test` (all pass). CI runs exactly this on every push to `main`.

## 6. Available tools (CLI + data)

- **GitHub CLI (`gh`)** -- repo/PR/secret operations on `syedjawad11/statohub`
  (e.g. `gh secret set`, `gh run list`). The MCP GitHub PAT is read-only, so
  write operations go through `gh`.
- **Wrangler v3 (`npx wrangler@3`)** -- Cloudflare Pages.
  - One-time (user/interactive): `wrangler@3 login`,
    `wrangler@3 pages project create statohub --production-branch main`.
  - Scriptable: `npm run build` then
    `npx wrangler@3 pages deploy dist --project-name statohub`.
  - In normal operation deploys happen via CI, not by hand (section 7).
- **DataForSEO (REST via curl)** -- keyword data for the deferred research
  passes only (stub articles + new batches). Creds in `~/.claude.json`; call the
  REST API directly (MCP tools do not register in-session). US location 2840.
- **content-ops CLI (`python content-ops/content_db.py ...`)** -- the editorial
  board (Python 3 stdlib sqlite3, zero installs): `list`, `show`, `brief`,
  `next`, `set-status`, `log-review`, `stats`. Drives the writing pipeline; the
  DB never ships.
- **claude-seo plugin skills + built-in SEO agents** -- per BUILD-PLAN Phase 0
  (technical/schema/sitemap/drift/geo, content-brief, etc.) for pre/post-publish
  checks.

## 7. Deploy pipeline

- **Push-to-deploy via GitHub Actions** ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)),
  not native Cloudflare Git integration.
- Every push to `main` runs the full gate suite -- `npm ci` -> `astro check` ->
  `vitest` -> `npm run build` (route-id gen + astro build + link gate) -- and
  only then `wrangler@3 pages deploy dist --project-name statohub`. A push that
  fails any gate cannot ship.
- Auth: repo secret `CLOUDFLARE_API_TOKEN` (scoped Account -> Cloudflare Pages
  -> Edit). Account id is hardcoded in the workflow (not a credential).
- **Custom domain:** `statohub.com` + `www` attached in the Pages dashboard
  (proxied CNAMEs -> `statohub.pages.dev`, SSL active). Apex is canonical; a zone
  Redirect Rule does the single `www -> https://statohub.com/` 301.

## 8. Content workflow (article writing)

Self-contained and kept separate from the Codex build loop. Full detail in
[`CONTENT-WORKFLOW.md`](CONTENT-WORKFLOW.md).

- **Editorial board:** `content-ops/` SQLite DB (48 articles, 7 categories, 28
  calculators, 354 keywords; "one keyword -> one article" enforced by a UNIQUE
  index). Source of briefs and status.
- **Agents (Claude Code, active in this repo):**
  `.claude/agents/stats-article-writer.md` (drafts >=2000-word MDX from a brief)
  and `.claude/agents/stats-article-reviewer.md` (scores against the playbook,
  PASS / CHANGES_REQUESTED, never rewrites).
- **Skill:** `/write-article [slug]` (`.claude/skills/write-article/`) runs
  brief -> write -> review -> status, 2-round cap.
- **Rule book:** `.claude/seo-playbook.md` (>=2000 words, >=1 authoritative
  external link, keywords used naturally, active voice, the statohub build
  contracts: flat slugs, typed `Link` only, frontmatter per
  `src/content/config.ts`, `draft: true` until human-published).
- **Status loop:** `planned -> briefed -> drafting -> in_review ->
  changes_requested -> approved -> published`. Reviewer PASS sets `approved`
  only; a human flips `draft: false` + `published` after a green `npm run build`.

**Who writes (current):** Claude writes the articles. **Flexibility (planned):**
we may pivot article generation to **Codex** in the coming weeks. The pipeline is
built to allow that -- the editorial board, briefs, playbook, and `draft:true`
gate are all author-agnostic. If we pivot, Codex consumes the same brief
(`content_db.py brief <slug>`), writes MDX to the same contract, and the work
still flows through the reviewer + human-publish gate. No structural change
needed; only the "who drafts" step moves. Keep new tooling out of it -- reuse
the existing board and playbook.

## 9. Workspace model

- **`Desktop/statohub/` is the primary working hub** going forward -- all build
  and content execution happens here, including Claude Code work.
- **`Claude_OS/` is research, planning, and future strategy ONLY** (e.g.
  analyzing the next batch of 50 articles once the current batch is published).
  No build or content execution there. Its `CLAUDE.md` is its own session log.
- Logs stay local to each repo: statohub work is logged in **this** repo's
  `CLAUDE.md`, not Claude_OS's.

## 10. Codex -- current scope of work

Codex builds to spec; it does not decide SEO rules or write content (content may
change -- see section 8). Read [`AGENTS.md`](AGENTS.md) then
[`BUILD-PLAN.md`](BUILD-PLAN.md) then the task in [`handoff/`](handoff/).

- **Handoff loop:** one file per task in `handoff/`, status
  `TODO -> IN_PROGRESS -> DONE -> CLOSED` (or `CHANGES_REQUESTED`). Pick the
  lowest-numbered `TODO` (or any `CHANGES_REQUESTED`), set `IN_PROGRESS`, build
  strictly to the brief, fill the **Work Log**, set `DONE`. Claude reviews and
  closes.
- **What Codex owns:** the Astro scaffold, content-collection schema, calculator
  engines (`src/calc/**`) + registry + tests, `<StatCalc>`, the link-integrity
  plumbing (`links.ts`, `Link.astro`, `check-links.mjs`, `gen-route-ids.mjs`),
  SEO components + sitemap, layouts/routes, and the deploy pipeline wiring.
- **Done so far:** TASK-001 scaffold ... TASK-007 deploy, and **TASK-008**
  (ArticleLayout + flat `/{slug}/` article routes) -- all CLOSED.
- **Current state:** no open `TODO` in `handoff/`. The build skeleton + article
  rendering path are complete.
- **Likely next briefs (Claude writes them when needed):** category-hub pages at
  `/{category}/` (must fold into the existing root `[slug]` route -- see section
  4); the remaining calculator engines/configs (normal/binomial CDF,
  correlation, regression, p-value, t-test, chi-square, combinatorics); a
  `ui-designer` visual-polish pass on `StatCalc` + a `CalculatorLayout`.
- **Hard rules for Codex:** stay in this repo; never edit `CLAUDE.md` (Claude's
  log); never hand-type internal links; keep `src/calc/**` pure; no new
  dependency without a reason; plain ASCII in handoff files. Sandbox approval
  prompts (`spawn EPERM`, `npm install` cached-only) are expected -- approve and
  re-run, do not work around them.

## 11. Known issues / follow-ups (not blocking)

- **`astro.config.mjs` `noindexRouteSegments` still lists `normal-distribution`.**
  That was for the throwaway proof route TASK-008 deleted. Harmless now, but when
  the real PD3 `normal-distribution` article ships it would be silently excluded
  from the sitemap. Remove that segment (or scope the filter to `noindex`
  frontmatter) before/with that article. The `/normal-distribution/` route check
  in `BaseLayout`/elsewhere, if any, should be revisited at the same time.
- **SEO baselines not captured yet.** Run `seo-drift` baseline + `seo-technical`
  mobile/CWV pass against the live URL (their own task).
- **`CLOUDFLARE_API_TOKEN` rotation.** A working `cfut_...` token was pasted in
  chat during setup; roll it and re-set the repo secret when convenient.

---

_Maintenance: keep this file current when the stack, commands, deploy path, or
Codex scope change. Detailed per-session history stays in `CLAUDE.md`._
