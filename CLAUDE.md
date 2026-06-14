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

## ✅ LIVE — build pipeline complete (2026-06-14)

The full build plan (TASK-001 → TASK-007) is **done** and the skeleton site is
**live on the custom domain https://statohub.com** (home + calculators; articles
follow). Cloudflare Pages project `statohub` is registered (production branch
`main`); `statohub.pages.dev` remains the deploy alias.

**Custom domain — DONE (2026-06-14):** `statohub.com` + `www` attached to the
Pages project via the Cloudflare dashboard (auto-created proxied CNAMEs →
`statohub.pages.dev`, SSL active). Apex is canonical; a zone Redirect Rule does a
single `www → https://statohub.com/` **301** (preserves path + query). Verified
live: apex trailing-slash 200s, odds/betting-odds/unmatched → 404, sitemap
slash-only on the apex host.

**CI/CD — DONE (2026-06-14):** push-to-deploy via GitHub Actions
([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)), **not** native
Cloudflare Git integration (that would force recreating the Direct Upload project
and re-attaching the domain). Every push to `main` runs the full gate suite
(`astro check` → `vitest` → `npm run build`, which includes the link gate) and
only then `wrangler@3 pages deploy dist --project-name statohub`. A push that
fails any gate cannot ship. Auth = repo secret `CLOUDFLARE_API_TOKEN` (scoped
**Account · Cloudflare Pages · Edit**, `cfut_…` token); account id hardcoded in
the workflow (not a credential). First fully-green run verified live.

**Remaining follow-ups (not blocking, their own tasks):**
1. **SEO baselines.** Capture the `seo-drift` baseline + `seo-technical`
   mobile/CWV pass against the now-live URL.
2. **A5 article layout (unnumbered).** `ArticleLayout` + flat `/{slug}/` article
   routes + category hubs, then write + ship the 4–5 launch articles.

## Maintenance convention

At the end of each session, append a dated entry to the Session log below.

## Session log

- **2026-06-14** — **Set up push-to-deploy CI/CD (GitHub Actions → Cloudflare
  Pages).** User asked whether to connect the repo to Cloudflare for auto-deploy.
  Chose **GitHub Actions over native CF Git integration**: a Pages project can't
  be converted between Direct Upload and Git-connected, so native integration
  would mean deleting/recreating `statohub` and re-attaching the domain we just
  set up; native builds also only run the build command, skipping our test/link
  gates. Added [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) —
  on push to `main`: `npm ci` → `astro check` → `vitest` → `npm run build`
  (route-id gen + astro build + link gate) → `cloudflare/wrangler-action@v3`
  `pages deploy dist --project-name statohub` (pinned `wranglerVersion: 3`,
  `node-version: 20`, `concurrency` guard, account id hardcoded since it's not a
  credential). Committed `89995d4`, pushed `385874f..89995d4`. **Token saga:**
  first run passed all gates, failed only at deploy (no secret) — proving the
  gate-then-deploy design. User's 1st token was truncated (37 chars) → `9106`
  auth fail (verified via direct curl); 2nd token (`cfut_…`, Account · Cloudflare
  Pages · Edit) verified good against the Pages API. Set repo secret
  `CLOUDFLARE_API_TOKEN` via `gh secret set`, re-ran → **fully green** (deploy in
  39s). Live re-verified: apex/hub/SD-calc 200, odds 404, www→apex 301. Told user
  to revoke the earlier zone-scoped + truncated tokens shared in chat. Note: GH
  flagged Node-20 JS-action deprecation (auto-moves to Node 24 on 2026-06-16,
  runner-side, harmless — separate from our `node-version: 20` build step).

- **2026-06-14** — **Pushed the build-pipeline work to GitHub + attached the
  custom domain `statohub.com`.** First synced the repo: the working tree held
  two tasks' uncommitted work (Codex left TASK-006's SEO layer uncommitted, plus
  Claude's TASK-007 deploy fixes). Sliced into three clean per-task commits on
  `syedjawad11/statohub` `main` — `33a9b23` (TASK-006: SEO components +
  `schema.ts` + Breadcrumbs + `public/robots.txt` + sitemap config),
  `c892348` (TASK-007: `wrangler.toml` name + `src/pages/404.astro` + handoff),
  `b7837c7` (docs sync) — pushed `3963aca..b7837c7`. **Then the custom domain
  (was a deferred follow-up):** user gave a Cloudflare API token; `verify`
  endpoint quirked but the authenticated zone call proved it valid. Token was
  **zone-scoped** (DNS + zone + rulesets edit) but **lacked account Pages:Edit**,
  so it could not attach the custom domain to the Pages project. Per user choice,
  user did the dashboard step (Pages → statohub → Custom domains → add
  `statohub.com` + `www.statohub.com`); Cloudflare auto-created two **proxied
  CNAMEs → `statohub.pages.dev`** + provisioned SSL (both served 200 within
  ~1 min). Claude then added the **`www → apex` 301** via API — a zone Redirect
  Rule in the `http_request_dynamic_redirect` phase, expression
  `(http.host eq "www.statohub.com")`, target
  `concat("https://statohub.com", http.request.uri.path)`, `preserve_query_string`.
  **Live verification (curl) all pass:** apex `/`, `/calculators/`,
  `/calculators/standard-deviation/` → 200; `www` → 301 to apex (preserves path,
  worst case `www`+no-slash = 2 hops 301→308 landing on canonical 200);
  odds/betting-odds/unmatched → 404; sitemap slash-only on the apex host.
  **Site is now live at https://statohub.com.** Zone id `50e47547…`, account
  `027007f4…`. **Remaining follow-ups:** SEO baselines (`seo-drift` +
  `seo-technical` on the live URL); A5 article layout → launch articles.

- **2026-06-14** — **TASK-006 reviewed → CLOSED, then TASK-007 (final go-live)
  executed by Claude → site is LIVE.** First closed TASK-006: re-ran all gates
  from clean state (`npm run build` 0 link violations / `astro check` 0-0-0 /
  33 tests green) and verified the built SD calculator page carries one absolute
  slash-terminated canonical + two ld+json blocks (BreadcrumbList +
  SoftwareApplication), the sitemap lists only the 3 indexable slash-terminated
  URLs, robots is allow-all, and `/normal-distribution/` is `noindex`. Then ran
  **TASK-007** personally (the interactive Cloudflare stage). **User decisions
  this session:** deploy the skeleton now (home + calculators; A5 article routes
  don't exist yet); Claude runs project-create + deploy; custom domain deferred.
  **Steps:** confirmed `wrangler@3 whoami` (still logged in, `pages (write)`) →
  `pages project create statohub --production-branch main` → `pages deploy dist`.
  **Hit + fixed two go-live defects:** (1) deploy failed — `wrangler.toml` lacked
  a top-level `name`; added `name = "statohub"`. (2) **No `404.html` was being
  built** (the scaffold never had a `src/pages/404.astro`), so Cloudflare Pages
  served the homepage with a **200 for every unmatched path** — soft-404s, and
  `/calculators/odds/` was reachable, a direct violation of the "no odds calcs /
  404 by design" non-negotiable. Fixed at source: created a permanent
  `src/pages/404.astro` (`noindex`, no self-canonical, BaseLayout + typed
  `Link`), rebuilt (5 pages, link gate still 0 violations), redeployed.
  **Live verification (curl) all pass:** `/`, `/calculators/`,
  `/calculators/standard-deviation/` → 200; non-slash → single 308 hop to slash;
  `/calculators/odds/` + `/calculators/betting-odds/` + any typo → 404; sitemap
  slash-only. **Site is live at https://statohub.pages.dev.** Wrote
  `handoff/TASK-007-cloudflare-pages-deploy.md` (CLOSED, full Work Log + Review).
  **Build pipeline TASK-001 → TASK-007 is complete.** **Follow-ups (own tasks,
  not blocking):** custom-domain attach (`statohub.com` + `www`, apex canonical +
  single `www→apex` 301); `seo-drift` baseline + `seo-technical` CWV/mobile pass
  on the live URL; the unnumbered A5 article-layout task → then the launch
  articles. **Uncommitted at session end:** `404.astro`, `wrangler.toml` name,
  regenerated `content-route-ids.ts`, TASK-006/007 handoff files, this log entry
  — commit/push pending the user's go.

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

- **2026-06-13** — Scaffold pushed to GitHub + **TASK-002 written & queued**.
  `git init` → committed the TASK-001 scaffold (21 files; `node_modules`/`dist`
  excluded) → pushed to the existing public repo `syedjawad11/statohub` `main`.
  Wrote `handoff/TASK-002-content-collections-schema.md` (status `TODO`) with the
  **pinned Zod contract** for `src/content/config.ts` (3 collections —
  `categories`/`articles`/`calculators`, all cross-links via `reference()`) plus
  3 deletable sample entries (descriptive-statistics category, standard-deviation
  calculator `engine:'standardDeviation'`, standard-deviation MDX article). Scope
  fenced tight: **schema + sample data ONLY** — no page-wiring, no `<StatCalc>`, no
  `src/calc/**`, no `links.ts`/`check-links.mjs`, no SEO components, no calculator
  form-config (that extends the schema in TASK-004). DoD: `astro sync` + `astro
  check` exit 0, `npm run build` still builds the existing routes. Also logged the
  **revised launch scope** in BUILD-PLAN Plan C: ship 4–5 seed articles, then
  ~2–3 posts/day; article writing deferred to full sessions. **User is taking
  TASK-002 to Codex now.** **Next (Claude, tomorrow):** review Codex's TASK-002
  Work Log when it flips to `DONE`; then plan + write the 4–5 launch articles
  (likely G1 Fundamental Statistics, parameter-vs-statistic, z-table, + 1–2
  descriptive spokes — all Phase-1 KD 0–7).

- **2026-06-14** — **TASK-002 reviewed → CLOSED; TASK-003 written & queued.**
  Codex returned TASK-002 `DONE`; Claude verified against artifacts (not just the
  Work Log): `src/content/config.ts` matches the pinned Zod contract verbatim (all
  3 collections, all `reference()` fields, defaults, `phase` literal-union); the 3
  sample entries are internally consistent + deletable (article references the
  sample category + calculator; the `standard-deviation` slug/id collision across
  two URL spaces correctly demonstrates the dual-deploy design); scope respected
  (no routes, no `<StatCalc>`, no `src/calc/**`, calculator schema left
  un-extended for TASK-004). Independently re-ran `npx astro check` → **3 files,
  0 errors/0 warnings/0 hints.** Verdict + notes in the task file's Review section.
  Then wrote `handoff/TASK-003-calc-engines-registry-tests.md` (status `TODO`):
  the pure **calculator engine layer** (`src/calc/`) + `registry.ts` keyed by
  engine name + **Vitest** unit tests. Scoped to the **Descriptive batch (10
  engines)** — `mean`, `median`, `mode`, `range`, `variance`, `standardDeviation`
  (the key the TASK-002 sample calc already references), `meanAbsoluteDeviation`,
  `percentile`, `weightedMean`, `zScore` — all deterministic + fully testable.
  Pinned a `CalcResult`/`CalcEngine` contract, a canonical reference dataset
  `[2,4,4,4,5,5,7,9]` with exact expected values, and the validation-returns-null
  (no-throw) rule. Heavier engines that need numerical approximations
  (normal/binomial CDF, correlation, regression, p-value, t-test, chi-square,
  combinatorics) explicitly **deferred** to later batches; registry built to grow.
  Scope fenced: engines + registry + tests ONLY — no `<StatCalc>`, no schema
  field-specs, no page wiring, no `links.ts`/`check-links.mjs`. **User is taking
  TASK-003 to Codex.** **Next (Claude):** review Codex's TASK-003 when it flips to
  `DONE`; then TASK-004 (`<StatCalc>` dual-deploy — first consumer of these
  engines). Article-writing still deferred to a dedicated full session.

- **2026-06-14** — **TASK-003 reviewed → CLOSED + fixed the Codex friction at its
  source.** Codex returned TASK-003 `DONE`; Claude verified against artifacts (not
  just the Work Log): re-ran `npm test` → **11 files / 24 tests pass** incl. the
  invalid-input null/error paths; purity grep `astro:|\.astro|window|document|
  fetch\(` over `src/calc/**` → no matches (the dual-deploy guarantee TASK-004
  relies on holds); `registry.ts` exposes all 10 camelCase keys incl.
  `standardDeviation` + `getEngine()`, no stub throws; `percentile` documents
  Hyndman-Fan Type 7 and reuses it for q1/q2/q3/iqr; `mode` tie/no-mode behavior
  deterministic + tested. Contract followed verbatim. Verdict + notes in the task
  file's Review section. **Addressed the 3 issues Codex logged:** (1) **mojibake**
  (`â€"`/`â†'`/`â€¦` broke an `apply_patch`) — root cause = our handoff `.md` files
  used UTF-8 em-dash/arrow/ellipsis, which Codex reads through a Windows codepage;
  **fixed at the source** by converting `handoff/TEMPLATE.md` to plain ASCII (every
  future task spawns from it clean) + added an ASCII-only authoring rule to
  `handoff/README.md` conventions; (2) Vitest **`spawn EPERM`** + (3) **`npm
  install` cached-only** — both are Windows-sandbox approval prompts (project is
  already `trusted`), not bugs; documented them as expected (approve + re-run) in a
  new **"Sandbox heads-up"** section in `AGENTS.md` so Codex stops treating them as
  blockers. **Next (Claude):** write TASK-004 (`<StatCalc>` dual-deploy — first
  consumer of these engines). Article-writing still deferred to a full session.

- **2026-06-14** — **TASK-004 brief written + dropped as `TODO`** for Codex
  (`handoff/TASK-004-statcalc-dual-deploy.md`, ASCII-clean from the new template).
  Spec = BUILD-PLAN **A4**: one config-driven `<StatCalc>` that dual-deploys from
  the same config + same TASK-003 engine — `variant="page"` (standalone
  `/calculators/{slug}/`) and `variant="embed"` (inline) — zero logic duplication.
  **Decisions baked into the brief** (the two open specifics, resolved): (1)
  **proof case = reuse the existing `standard-deviation.yaml`** (`standalone:true`,
  multi-output sample/population) as the canonical dual-deploy case + add one
  **`median.yaml` (`standalone:false`)** to prove the embed-only path renders inline
  but generates **no** route — two configs cover the whole matrix (value-only,
  multi-output, page, embed, route-generated, route-suppressed); (2) **styling =
  functional + accessible Tailwind now** matching BaseLayout conventions, with the
  polished design-token system / `CalculatorLayout` deferred to a later
  `ui-designer` pass — don't block the engine→UI proof on design. Also pinned:
  **no UI framework** (vanilla `<script>` island importing `getEngine` from
  `src/calc/registry`, so deps stay astro/mdx/sitemap and safe on Node 20.8.0),
  **no charts/uPlot** (leave only the lazy-import seam), engines/`src/calc/**` stay
  untouched + pure, and the `calculators` schema gets **only optional/defaulted**
  new fields (`inputs`/`precision`/`resultLabel`/`outputLabels`) so the existing SD
  config still validates. DoD verifies the build emits the SD page + `/calculators/`
  hub but **not** a median route, the embed computes the same numbers, and
  `npm test`/`astro check` stay green. **Out of scope** (their own tasks): article
  routes/`ArticleLayout`, `links.ts`+`check-links` (TASK-005), SEO+sitemap
  (TASK-006), deploy (TASK-007). **Next:** Codex picks up TASK-004; Claude reviews
  on `DONE`.

- **2026-06-14** — **TASK-004 reviewed -> CLOSED.** Codex returned it `DONE`;
  Claude verified independently (not just the Work Log) by re-running all three
  gates from a clean state: `npm run build` exits 0 and emits exactly the four
  expected routes (`/calculators/standard-deviation/`, `/calculators/`, `/`,
  `/normal-distribution/`) with **no** `/calculators/median/` (the
  `standalone:false` embed-only proof holds); `npx astro check` = 0 errors / 0
  warnings / 0 hints; `npm test` = **33 tests / 12 files** (24 engine tests
  intact + 9 new `format.ts` tests). Dual-deploy proven at source: the standalone
  SD route and the hub both render `<StatCalc>` from the SAME
  `standard-deviation.yaml` via the SAME `getEngine('standardDeviation')` — built
  hub HTML confirmed to carry two distinct server-rendered `data-statcalc`
  instances with per-instance `application/json` config blocks
  (`engine:"standardDeviation"` + `engine:"median"`), real labeled controls, and
  `aria-live` results regions; instances isolated by unique root id +
  `data-config-id`. Result rule correct (SD shows Sample+Population from
  `outputs`, no primary duplication; null -> error, no crash). Schema
  back-compat held (new `inputs`/`precision`/`resultLabel`/`outputLabels` all
  optional/defaulted; existing SD yaml unedited); `src/calc/**` untouched + pure;
  no new runtime dep; chart seam left commented-only. **One non-blocking note:**
  Codex's functional check used a production-bundle DOM harness instead of a live
  `npm run preview` browser pass (in-app `iab` browser was unavailable) — same
  numbers reproduced (Sample ~= 2.1381, Population = 2; median 5), fine for now,
  but worth a real browser pass when StatCalc gets its visual polish in the later
  `ui-designer` task. Verdict + full notes in the task file's Review section.
  **Session paused here per user (short break).** **>> NEXT UP: TASK-005 <<** —
  the typed link registry: `src/lib/links.ts` (typed route registry) +
  `Link.astro` + `scripts/check-links.mjs` build gate enforcing zero internal
  redirects/404s (the BUILD-PLAN non-negotiable). Claude writes the brief, drops
  it as `TODO`, hand to Codex. Article-writing still deferred to a full session.

- **2026-06-14** — **TASK-006 written & queued (`TODO`); deploy ordering locked
  with the user.** Per the user's call this session: do **TASK-006 (SEO) next,
  then TASK-007 (deploy) as the final go-live stage** -- article writing planned
  for the evening as its own session. Wrote
  `handoff/TASK-006-seo-components-sitemap.md` (ASCII-clean from the template):
  the SEO plumbing layer (BUILD-PLAN **B4**) wired into the pages that exist today
  (home, calculators hub, standalone calculator pages, throwaway
  `/normal-distribution/`). Deliverables pinned: `src/components/seo/Meta.astro`
  (title/desc + OG + Twitter), `Canonical.astro` (absolute, slash-terminated),
  `JsonLd.astro` (generic ld+json emitter), `Breadcrumbs.astro` (visible nav via
  the typed `Link`), and `src/lib/schema.ts` pure helpers building
  **BreadcrumbList** + **Article** + **SoftwareApplication** -- **every URL field
  routed through `url()`** so the TASK-005 `check-links.mjs` gate stays the
  enforcement mechanism (the B2 non-negotiable). BaseLayout extended with optional
  SEO props (auto-prepends BreadcrumbList from the breadcrumb trail = single
  source); SoftwareApplication + breadcrumbs wired into the calculator page,
  breadcrumbs into the hub, canonical/OG confirmed on home. `public/robots.txt` +
  verified slash-terminated sitemap. **Two scope fences baked in:** (1)
  `articleSchema` is **built + exported but not consumed yet** -- it's ready for
  the upcoming **A5 article-layout task** (ArticleLayout + flat `/{slug}/` article
  routes + category hubs), which is still unnumbered and does NOT exist; no article
  routes are built in TASK-006; (2) **no `wrangler`/deploy** -- that's TASK-007.
  No new deps; `src/calc/**` stays pure. DoD headline gate = `npm run build` with
  **0 link violations** + `astro check` clean + 33 tests green + the built SD
  calculator page carrying a real canonical + BreadcrumbList + SoftwareApplication.
  **Flagged to user (deliberate, accepted):** at TASK-007 the site goes live with
  **calculators + home only** -- the A5 article routes won't exist yet; first
  deploy is a skeleton by design, articles follow. **Next (user):** hand the Codex
  kickoff prompt (written this session) to Codex in the statohub workspace.
  **Next (Claude):** review TASK-006 on `DONE` -> CLOSE -> then **personally do
  TASK-007** (the final go-live: `pages project create statohub` + `wrangler@3
  pages deploy` + domain attach).

- **2026-06-14** — **TASK-005 reviewed -> CLOSED, then the whole backlog
  committed + pushed.** The typed link safety layer is in and verified: 3 layers
  working together — `src/lib/links.ts` (`url(RouteRef)` emitter, single source of
  truth for internal hrefs) + typed `Link.astro` (a bogus route id fails `astro
  check`) + `scripts/check-links.mjs` (post-build gate crawling `dist/**/*.html`
  for non-canonical / unresolvable internal links). Route ids are a real literal-
  union **generated** from `src/content/**` by `scripts/gen-route-ids.mjs`
  (regenerated on `predev` + `build`) into `src/lib/content-route-ids.ts` — works
  around this Astro version collapsing `CollectionEntry['id']` to `string`, so the
  registry has compile-time bite AND can't drift from content; **no new
  dependency**. `index.astro`, `normal-distribution/index.astro`, and
  `BaseLayout.astro` all converted from raw `<a href>` to typed `<Link to>`.
  **Decided:** keep `content-route-ids.ts` committed (not gitignored). Final
  `npm run build` = green end-to-end (4 pages, gate scanned 7 internal links, **0
  violations**). **Git:** the working tree held FOUR tasks' worth of uncommitted
  work (TASK-002→005 + doc-sync), not just TASK-005 — surfaced it and, per user
  choice, sliced it into **5 clean per-task commits** (`d8a132f` TASK-002 content
  collections, `d9a48e6` TASK-003 calc engines + Vitest, `69c4ee1` TASK-004
  StatCalc + calculator pages, `ad1fb38` TASK-005 typed links + gate, `3963aca`
  chore doc-sync), splitting `package.json`/`package-lock.json` across the 003 and
  005 commits via an intermediate on-disk state (no interactive `add -p` in this
  shell). **Pushed to `syedjawad11/statohub` `main`** (`daa6f31..3963aca`); branch
  in sync with origin. **Build pipeline through TASK-005 is complete and live in
  the repo.** **Next:** TASK-006 (SEO + JSON-LD + sitemap — JSON-LD URL fields
  must route through `url()`), then TASK-007 (Cloudflare Pages deploy wiring +
  `pages project create statohub`). Article-writing still deferred to a dedicated
  full session.
