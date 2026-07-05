# Repo Map

> Annotated directory map. Regenerate with `node scripts/gen-repo-map.mjs` after any
> structural change (new top-level dir, new src/ subsystem) -- do not hand-edit the
> tree below without also updating the script's source comments if it drifts.
> Last generated: 2026-07-05.

```
statohub/
|-- CLAUDE.md               # Router + hard rules (<150 lines)
|-- AGENTS.md                # Codex entry point + sandbox notes
|-- astro.config.mjs         # trailingSlash:'always' + directory output + mdx + sitemap
|-- tailwind.config.cjs      # class-based dark mode + CSS-var-backed token colors
|-- wrangler.toml            # Cloudflare Pages project name
|-- package.json             # scripts + pinned deps (Astro 4, Wrangler v3)
|
|-- src/
|   |-- pages/               # Route files (all trailing-slash, folder-per-route)
|   |   |-- index.astro                 # Homepage
|   |   |-- 404.astro                   # noindex, prevents soft-404s
|   |   |-- [slug]/index.astro          # Root [slug]: articles + category hubs (discriminated union)
|   |   |-- about/index.astro
|   |   |-- privacy-cookie-policy/index.astro   # Combined legal page
|   |   `-- calculators/
|   |       |-- index.astro             # Calculators hub
|   |       `-- [slug]/index.astro      # Standalone /calculators/{slug}/ pages
|   |
|   |-- calc/                # PURE calculator engines (no DOM/astro/network -- dual-deploy safe)
|   |   |-- registry.ts                 # Engine registry keyed by camelCase name
|   |   |-- types.ts                    # CalcResult / CalcEngine contracts
|   |   |-- _stats-math.ts              # Shared math: erf, normalCdf, studentTCdf, chiSquareCdf...
|   |   |-- _regression-core.ts         # Shared regression/correlation math
|   |   |-- combinatorics-core.ts
|   |   |-- mean/median/mode/range/variance/standard-deviation/... (26 engine files)
|   |   `-- __tests__/                   # Vitest unit tests per engine
|   |
|   |-- components/
|   |   |-- StatCalc.astro               # Config-driven calculator (variant="page"|"embed")
|   |   |-- Link.astro                   # Typed internal link (compile-time route check)
|   |   |-- Breadcrumbs.astro
|   |   |-- RelatedLink.astro            # Blue accent-bar "related link" callout
|   |   |-- statcalc/                    # client.ts (island) + format.ts (+ test)
|   |   `-- seo/                         # Meta.astro, Canonical.astro, JsonLd.astro
|   |
|   |-- layouts/
|   |   |-- BaseLayout.astro             # head/SEO/JSON-LD/dark-mode chrome
|   |   |-- ArticleLayout.astro          # Article shell: TOC, scroll-spy, prose, related grid
|   |   `-- CategoryLayout.astro         # Category-hub shell
|   |
|   |-- content/             # Astro content collections (Zod-validated)
|   |   |-- config.ts                    # Schemas: categories, articles, calculators, calculator-content
|   |   |-- categories/    (6 yaml)
|   |   |-- calculators/   (29 yaml -- one config drives page + embed)
|   |   |-- articles/      (21+ mdx)
|   |   `-- calculator-content/ (22+ mdx -- short teaching blocks under each calc)
|   |
|   |-- lib/
|   |   |-- links.ts                     # Typed route registry: routes / url() -- single source of truth
|   |   |-- content-route-ids.ts         # GENERATED literal-union of route ids (gen-route-ids.mjs)
|   |   |-- schema.ts                    # Pure JSON-LD builders (BreadcrumbList/Article/SoftwareApplication/WebSite/Org)
|   |   |-- related-calculators.ts       # Auto-derives same-category "Related calculators" sidebar
|   |   `-- related-intros.ts            # Approved varied intro-phrase pool for RelatedLink
|   |
|   `-- styles/              # global.css (design tokens + component CSS)
|
|-- scripts/
|   |-- gen-route-ids.mjs    # Regenerates content-route-ids.ts from src/content/** (predev + build)
|   |-- gen-repo-map.mjs     # Regenerates this file
|   `-- check-links.mjs      # BUILD GATE: crawls dist/**, fails on any internal redirect/404
|
|-- public/                  # robots.txt, _headers (security headers), favicons, og-default.png
|
|-- content-ops/             # Editorial board + cloud-routine content pipeline
|   |-- content.db            # SQLite editorial DB (articles/keywords/status)
|   |-- content_db.py         # CLI: init/seed/list/brief/next/set-status/...
|   |-- schema.sql, seed.json
|   |-- cloud-routine/        # publish-next-article.md, publish-next-calc-prose.md, README.md
|   `-- calc-prose/           # QUEUE.md, SESSION-PLAN.md (calculator teaching-block backlog)
|
|-- handoff/                 # Codex task box (5-state loop) -- TASK-001...TASK-024+ + TEMPLATE.md + README.md
|
|-- docs/                    # THIS documentation tree -- see docs/ARCHITECTURE.md for the layout
|-- doc/                     # Legacy: BUILD-PLAN.md (still authoritative build spec), SITE-ARCHITECT.md, theme mockups
|
|-- .claude/                 # Project agents + skills + SEO playbook
|   |-- agents/               # stats-article-writer.md, stats-article-reviewer.md
|   |-- skills/               # write-article/SKILL.md
|   `-- seo-playbook.md
|
|-- .github/workflows/deploy.yml   # CI/CD: gates -> Cloudflare deploy on push to main
`-- .codex/                  # Codex skills/config
```

## Non-negotiable repo rules (see `CLAUDE.md` for the full list)

1. Flat trailing-slash URLs: `/{slug}/`, `/{category}/`, `/calculators/{tool}/`.
2. Zero internal redirects/404s -- enforced by `src/lib/links.ts` + `scripts/check-links.mjs`.
3. No odds/betting calculators.
4. Wrangler v3 lock (Node 20.8.0 breaks v4).
5. `src/calc/**` stays pure (no DOM/network) -- dual-deploy (standalone page + embed) depends on it.

## Where things live (quick index)

| Looking for... | Go to |
|---|---|
| A calculator's math | `src/calc/{engine}.ts` |
| A calculator's config (inputs/labels/category) | `src/content/calculators/{slug}.yaml` |
| An article's content | `src/content/articles/{slug}.mdx` |
| The SEO/content rules | `.claude/seo-playbook.md`, `docs/standards/content.md` |
| The typed link registry | `src/lib/links.ts` |
| Design tokens / palette / dark mode | `src/styles/global.css`, `docs/DESIGN-SYSTEM.md` |
| The build spec | `docs/legacy/BUILD-PLAN.md` |
| Codex's current task queue | `handoff/TASK-*.md` (lowest-numbered `TODO` first) |
| What happened recently | `docs/status/NOW.md`, `docs/status/sessions/` |
| Why a decision was made | `docs/decisions/README.md` |
