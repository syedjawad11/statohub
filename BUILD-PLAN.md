# statohub.com — Build Plan (statistics site)

## Context

The 6-stage SEO study + 7-stage content-architecture for a statistics
education-and-calculators site are **complete** (in `Claude_OS/project ideas/statistics-calculator-seo-study/`).
The domain **statohub.com** is now registered on Cloudflare. This plan turns the
research into a buildable site.

Verdict from the study: **BUILD (conditional GO)** — real low-difficulty demand
(185 KD≤10 keywords, 2.47M/mo US), a defensible wedge (deep calculator **+**
teaching on the same page, which no incumbent does), ~$0 hosting (static +
client-side). Intended outcome: a fast, mobile-first Astro site on Cloudflare
Pages with flat trailing-slash URLs, zero internal redirects/404s, ~50 teaching
articles each pairing an embedded calculator, and ~23 standalone calculator
pages — built bottom-up (KD 0–5 first) so authority compounds toward the
pillars.

**Locked decisions (this session):**
- Repo lives at a **new `Desktop/statohub/`** folder — own git, own `CLAUDE.md`
  log, own `handoff/` box. Claude_OS stays research/planning-only (standing SOP).
- **Astro + Tailwind**, dark mode, mobile-first. MDX for articles (lets `<StatCalc>`
  embed inline). uPlot for charts (lazy-loaded). Cloudflare Pages via **Wrangler v3**
  (Node v20.8.0 is incompatible with Wrangler v4 — confirmed earlier).
- **Both odds calculators REMOVED** — `/calculators/betting-odds/` and
  `/calculators/odds/` are dropped entirely (no gambling association). The
  educational **Probability calculator** (`/calculators/probability/`, KD0) stays.
  No article keyword lists reference the odds calcs, so no content changes — just
  don't build those two pages. The §12 monetisable "odds/finance" expansion vector
  is dropped from build scope.
- **Codex split:** Codex builds to spec (scaffold, `<StatCalc>`, calculator
  engines, SEO plumbing); Claude writes the 50 articles, sets SEO rules, reviews
  every Codex task — via the existing `handoff/` 5-state loop.

---

## Phase 0 — Tools we need (agents, skills, MCPs, CLI)

**No new installs required for the core build** — the workspace already has what
we need. Inventory:

### Agents (already installed, user scope)
| Agent | Use in this build |
|---|---|
| `ui-designer` (sonnet) | Design the visual system, layout, calculator-form UI, responsive + dark mode. Tuned for static Astro tool sites. |
| `content-quality-editor` (haiku) | Pre-publish AI-writing cleanup pass on each article. |
| `seo-content-writer` / `seo-content-planner` / `seo-content-auditor` (built-in) | Draft + plan + score article content against the keyword map. |
| `seo-authority-builder` (built-in) | E-E-A-T pass (statistics ≈ educational/YMYL-adjacent). |
| `seo-cannibalization-detector` (built-in) | Guard the "one keyword → one article" rule when articles are similar. |

### Skills (claude-seo plugin + built-ins)
| Skill | Use |
|---|---|
| `claude-seo:seo-technical` | Crawlability, trailing-slash, mobile, CWV checks pre/post deploy. |
| `claude-seo:seo-schema` | Validate/generate BreadcrumbList, Article, SoftwareApplication JSON-LD. |
| `claude-seo:seo-sitemap` | Validate the generated sitemap. |
| `claude-seo:seo-content-brief` | Per-article brief (sections, word counts) from the keyword set. |
| `claude-seo:seo-drift` | **Baseline before each deploy** → catch SEO regressions (the user's redirect/404 worry). |
| `claude-seo:seo-programmatic` | Safeguard the ~70 template/reference pages (z-table, glossary) against thin content. |
| `claude-seo:seo-geo` | AI-Overview / ChatGPT citability (interactive calcs are AI-resistant assets). |
| `claude-seo:seo-image-gen` / `seo-images` | OG/social preview images per page; alt-text audit. |
| `verify` / `code-review` | Verify builds run + review Codex's component code. |

### MCPs
| MCP | Status / use |
|---|---|
| `github` | ✓ connected — create the `statohub` repo, push. |
| `dataforseo` (REST via curl) | For the **deferred keyword passes** only (stub articles: Combinatorics, Probability, Validity, permutation calc). Not needed for core build. |
| **Cloudflare** | No MCP installed; we use **Wrangler CLI** instead (below). Optional future add: a Cloudflare MCP for scripted DNS. |

### Cloudflare CLI access (the "agents configure the domain" requirement)
- Pin **Wrangler v3** in `package.json` (`"wrangler": "^3"`) — Node 20.8.0 breaks v4.
- **One-time interactive (user runs):** `npx wrangler@3 login` (browser OAuth —
  cannot be scripted), then `npx wrangler@3 pages project create statohub
  --production-branch main`.
- **Scriptable thereafter (agents run):** `npm run build` → `npx wrangler@3 pages
  deploy dist --project-name statohub`.
- **Custom domain** `statohub.com` (+ `www`): attach in Pages dashboard, or via a
  **Cloudflare API token** (Pages:Edit + DNS:Edit) stored locally if we want agents
  to script DNS. Recommend apex canonical with a single `www → apex` 301 (the only
  host redirect we keep).

---

## The Big Plan — how the three sub-plans interlock

```
Plan A (Site buildup)  ──┐
                         ├─► every article/calc page obeys ──►  Plan B (SEO rules)
Plan C (Content)       ──┘        (URL SOP + link integrity, enforced at build time)
```

Plan B is **not a phase** — it is a set of build-time-enforced rules that Plan A's
scaffold bakes in and Plan C's content must obey. Build order: **A scaffold → B
rules wired into A → C content flows through both.** Codex owns most of A + the
plumbing of B; Claude owns C + the SEO decisions in B + review of everything.

---

## Plan A — Site buildup (mostly Codex, to spec)

**Repo:** `Desktop/statohub/` — Astro SSG + Tailwind + MDX → Cloudflare Pages.
Stack and full technical design validated by the Plan agent.

**A1. Scaffold + trailing-slash contract.** `astro.config.mjs` with
`site:'https://statohub.com'`, `trailingSlash:'always'`, `build.format:'directory'`,
integrations `[mdx(), sitemap()]`. Tailwind (`darkMode:'class'`, pre-paint inline
theme script in `BaseLayout` to avoid flash). **Every route is `<folder>/index.astro`**
(never flat `[slug].astro`) so `dist/normal-distribution/index.html` serves at
`/normal-distribution/` with no redirect.

**A2. Content Collections** (`src/content/config.ts`): three collections —
`categories` (7), `articles` (~50 MDX), `calculators` (~23 data configs). Zod
schemas. Filename of an article = its flat slug.

**A3. Calculator engine layer** (`src/calc/*.ts`): pure framework-free functions
(`mean`, `sd`, `zscore`, …) + a `registry.ts` keyed by engine name. Unit-tested in
isolation.

**A4. `<StatCalc>` — one config-driven, dual-deployed component.** Math lives once
in `src/calc`; config lives once per calculator; UI lives once in `StatCalc.astro`.
Embed (inside an MDX article, `variant="embed"`) and standalone
(`/calculators/{slug}/`, `variant="page"`) feed the **same** component the same
config — zero logic duplication. Server-renders the form (SEO + no-JS fallback); a
`client:visible` island wires input→compute→output and lazy-`import()`s uPlot only
if `chart` is set. `standalone:false` configs (median, range/IQR, outlier, t-table,
CI, chi-square plot) render embed-only — no invented page/keyword.

**A5. Layouts + UI** (`ui-designer` drives the visual system): `BaseLayout` →
`ArticleLayout | CategoryLayout | CalculatorLayout`. Header = category nav +
Calculators; footer = category + top-tool links. Mobile-first; consistent
calculator-form component classes.

**A6. Deploy pipeline:** `npm run build` (= `astro build && node
scripts/check-links.mjs`) → `wrangler@3 pages deploy`. Custom domain attach
(one-time). `wrangler.toml` with `pages_build_output_dir = "dist"`.

**Standalone calculators to build (23 + hub — odds calcs removed):**
- Mean/Average: `average`, `mean`, `weighted-average`
- Dispersion: `standard-deviation`, `variance`, `percentile`
- MAD: `mean-absolute-deviation`
- Probability: `probability`  *(odds + betting-odds REMOVED)*
- Combinatorics: `factorial`, `combination`
- Distributions: `normal-distribution`, `binomial-distribution`, `z-table`
- Correlation/Reg: `correlation-coefficient`, `linear-regression`
- Inferential: `z-score`, `p-value`, `t-test`, `chi-square`, `sample-size`,
  `t-table`, `confidence-interval`
- Foundations: `proportion`
- Hub: `/calculators/`

---

## Plan B — SEO rules (Claude decides, baked into the build)

These are **enforced mechanically**, not by discipline — directly answering the
"no redirects / no 404s, especially internal links" requirement.

**B1. URL SOP (binding):**
- `/` · `/{category}/` (7 hubs) · `/{primary-keyword-slug}/` (flat articles, **no
  category in path**) · `/calculators/` · `/calculators/{tool-slug}/`.
- **Every URL ends in `/`.** Articles are root-level flat; category is shown only
  in breadcrumb/schema for UX, never in the path.

**B2. Internal-link integrity (3 layers — the core anti-404/redirect guarantee):**
1. **Single source of truth** `src/lib/links.ts`: `ROUTES` maps a stable ID →
   canonical slash-terminated path; `url(id)` is the only way to emit an internal
   link. Generated from the content collections at build so it can't drift.
2. **`Link.astro` takes a typed `RouteId`** → a typo'd/nonexistent target **fails
   TypeScript at build**. Breadcrumbs, "Try the calculator" ⇄ "Learn how it works",
   category hubs, and all JSON-LD URLs route through `url(id)`.
3. **`scripts/check-links.mjs` build gate:** after `astro build`, crawl
   `dist/**/*.html`; assert every internal href ends in `/` **and** has a matching
   `index.html`; flag any href that matches a `_redirects` source (chain guard).
   Any failure → `exit 1` → **deploy blocked.**

**B3. Redirects — minimal by design.** Do **not** add bulk non-slash→slash rules
(CF Pages auto-302s those, and our links never emit non-slash). `_redirects` holds
only real re-slugs/consolidations, **one hop only**, always targeting the
slash-terminated canonical. Plus the single `www → apex` 301.

**B4. SEO plumbing (reusable components):** `@astrojs/sitemap` (inherits
trailing-slash); `Canonical.astro` (absolute + slash); `Meta.astro` (title/desc/OG
from frontmatter); `Breadcrumbs.astro` + `JsonLd.astro` emitting **BreadcrumbList**
(all pages), **Article** (articles), **SoftwareApplication** (calculators). All
schema URL fields use `url(id)`. `robots.txt` → sitemap.

**B5. Programmatic-page safeguards** (`seo-programmatic`): reference tables +
~40-entry symbol glossary are substance-gated (tool/table **plus** ≥150 words
unique context + worked example + FAQs); missing data fails the build; index in
tranches after internal links exist.

**B6. Pre-deploy regression check:** run `seo-drift` baseline before each deploy +
`seo-technical` spot-check → catch any new redirect/404 before it ships.

---

## Plan C — Content planning & writing (Claude writes, Codex assists configs)

**Inventory from the study (betting/odds removed):** ~50 articles across 7
categories — 41 core buildable now + 9 flagged/stub. Each article = its mapped
6–12 keywords, 2,000+ words, an embedded `<StatCalc>` where applicable, and links
to its paired standalone calculator.

**C1. Resolve the 10 flags first** (cheap, no API): add disambiguation line to
**I3** (null hypothesis); build the symbol glossary for **G3**; embed calc +
worked examples for **G4**; keep **RC6** standalone; ship **I8/I9** now and expand
later. Exclude/relabel off-topic **D9** (algebra) and **F3** (physics) — decide
keep-with-disclaimer vs drop.

**C2. Defer the 2 stubs** (need a small DataForSEO pass before writing):
Combinatorics (`/permutations-and-combinations/`) and **G5** Validity — plus
dedicated passes for Probability and a permutation calc. Run these via DataForSEO
REST when the core is live.

**C3. Write in the study's phased order** (compound authority bottom-up):
- **Q1 / Phase 1 (KD 0–5):** the two rare low-KD pillars first — **G1 Fundamental
  Statistics** (301k/KD7, "second homepage") and **F1 Frequency Tables** (22k/KD1)
  — plus the **z-table** flagship reference, then ~20 KD-0 spokes (parameter-vs-
  statistic, AP formula sheet, "which r-value" family, mean/median cluster). Target
  45–60 pages live.
- **Q2 / Phase 2 (KD 6–10):** build out fundamental-statistics + mean-median-mode-
  range; remaining Phase-1 backlog → ~100 pages.
- **Q3 / Phase 3 (KD 22–56 pillars):** standard-deviation, normal-distribution,
  correlation-coefficient, z-score, how-to-find-the-mean → ~140 pages.

**C4. Each article pipeline:** `seo-content-brief` → draft (`seo-content-writer`)
→ E-E-A-T pass (`seo-authority-builder`) → cannibalization check
(`seo-cannibalization-detector`) → AI-writing cleanup (`content-quality-editor`) →
OG image (`seo-image-gen`).

---

## Codex utilization (handoff/ protocol)

Set up a **`Desktop/statohub/handoff/`** box (copy `README.md` + `TEMPLATE.md`
from Claude_OS; reference `CODEX-WORKFLOW.md`). The 5-state loop
(`TODO → IN_PROGRESS → DONE → CLOSED`, with `CHANGES_REQUESTED`) governs every
build task. **One folder, one agent at a time;** `CLAUDE.md` log has one writer
(Claude); handoffs go through files.

**Division for this build:**
- **Codex → builds to spec:** A1 scaffold, A2 collections, A3 engines, A4
  `<StatCalc>`, A6 deploy pipeline, and B2/B4 plumbing (`links.ts`,
  `check-links.mjs`, SEO components). One `TASK-NNN` brief per chunk.
- **Claude → decides + writes + reviews:** all of Plan B's SEO decisions, all of
  Plan C content, the `ui-designer` visual direction, and the **Review** step that
  closes each Codex task.

**First briefs to drop:** `TASK-001` scaffold + trailing-slash contract +
Tailwind/dark-mode; `TASK-002` content collections schema; `TASK-003` calc engines
+ registry + tests; `TASK-004` `<StatCalc>` dual-deploy; `TASK-005` `links.ts` +
`check-links.mjs` gate; `TASK-006` SEO components + sitemap; `TASK-007` deploy
pipeline + domain attach.

---

## Critical files (to be created in `Desktop/statohub/`)
- `astro.config.mjs` — trailing-slash + sitemap + mdx contract (B1)
- `src/content/config.ts` — categories/articles/calculators collections (A2)
- `src/calc/*.ts` + `registry.ts` — pure calculator engines (A3)
- `src/components/StatCalc.astro` (+ client island) — dual-deployed calculator (A4)
- `src/lib/links.ts` + `src/components/Link.astro` — internal-link source of truth (B2)
- `scripts/check-links.mjs` — build-time link-integrity gate (B2)
- `src/components/seo/*` + `Breadcrumbs.astro` — schema/canonical/meta (B4)
- `handoff/` — Codex task box; `CLAUDE.md` — this repo's own session log

---

## Verification (end-to-end)
1. **Build gate passes:** `npm run build` runs `astro build` **and**
   `check-links.mjs` with `exit 0` — proves zero broken/non-slash internal links.
2. **Trailing-slash, no redirect:** `curl -sI https://statohub.com/normal-distribution/`
   → `200` (no `301/302`); `curl -sI .../normal-distribution` → single `301` to the
   slash version (the only allowed hop).
3. **Calculators work both ways:** the SD widget computes inside its article **and**
   at `/calculators/standard-deviation/` from the same config; charts lazy-load.
4. **No odds calcs exist:** `/calculators/betting-odds/` and `/calculators/odds/`
   return 404 by design (never built); `/calculators/probability/` is 200.
5. **SEO valid:** sitemap lists only slash-terminated URLs; `seo-schema` validates
   BreadcrumbList/Article/SoftwareApplication; `seo-technical` mobile + CWV pass;
   `seo-drift` baseline shows no regression vs prior deploy.
6. **Responsive + dark mode:** verify desktop + mobile layouts and theme toggle
   (no flash-of-wrong-theme) via the `verify`/`run` skill on a preview build.
