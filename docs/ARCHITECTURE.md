# Architecture

This file is a factual reference for how the site is actually built --
stack, URL scheme, content model, build pipeline. For **why** a choice was
made, see `docs/decisions/`. For current work-in-progress state, see
`docs/status/NOW.md`.

## Stack

- **Astro** (SSG) -- static output, zero client JS by default. Calculator
  interactivity uses Astro islands (`client:load` / `client:visible`) only
  where genuinely needed.
- **Tailwind CSS** for styling; see `docs/DESIGN-SYSTEM.md` for the design
  tokens, component patterns, and theme.
- **MDX** for article content (`src/content/articles/**/*.mdx`).
- **TypeScript** throughout; `src/calc/**` is pure, framework-free
  calculation logic (no DOM, no Astro, no network) so it's independently
  testable and reusable across calculator pages.
- **Cloudflare Pages** hosting, deployed via **Wrangler v3** (locked --
  Node 20.8.0 breaks Wrangler v4; see `docs/decisions/0005-wrangler-v3-lock.md`).
- **GitHub Actions** CI/CD (not Cloudflare's native Git integration -- see
  `docs/decisions/0006-github-actions-deploy.md`).

## URL scheme (non-negotiable)

Every URL is flat and ends in a trailing slash. No category segment in
article paths.

- Articles: `/{slug}/`
- Category hubs: `/{category}/`
- Calculators: `/calculators/{tool}/`

See `docs/decisions/0002-flat-url-structure.md` for the full reasoning
(SEO flexibility, avoids re-categorization churn, matches how people search).

`src/lib/links.ts` is the single typed route registry. Every internal link in
the codebase must be generated through it -- never hand-write a raw
`<a href="...">` to an internal page. This is what makes the zero-redirect
rule enforceable rather than aspirational.

## Zero internal redirects / 404s (the link-safety system)

Three layers, in order of when they catch a problem:

1. **`src/lib/links.ts`** -- typed functions (`articleUrl()`, `calculatorUrl()`,
   `categoryUrl()`, etc.) are the only sanctioned way to build an internal
   URL. A typo or renamed slug fails at compile time via TypeScript, not at
   runtime.
2. **`scripts/check-links.mjs`** -- a build-time gate that crawls every
   generated page's internal `<a href>` values and fails the build if any
   resolve to a 404 or would require a redirect (e.g. missing trailing
   slash, wrong casing).
3. **`npm run build`** wires the gate in -- a broken internal link cannot
   reach `main`, because CI runs the full build (see Build + CI/CD below).

When renaming or removing a page: update every reference via `links.ts`
first, then run `npm run build` locally to catch anything the gate flags
before pushing.

## Content model

Astro content collections, defined in `src/content/config.ts`:

- **`articles`** -- MDX teaching content, one file per slug under
  `src/content/articles/`. Frontmatter includes `title`, `description`,
  `category`, `relatedCalculators` (drives the woven related-link callouts --
  see `docs/decisions/0010-woven-related-link-callouts.md`), and SEO fields.
- **`categories`** -- YAML files under `src/content/categories/` define the
  6-7 category hubs (name, description, ordering).
- Calculators are **not** a content collection -- they're code
  (`src/calc/**` for pure logic, `src/pages/calculators/[slug]/index.astro`
  for the page shell, `src/components/statcalc/**` for the interactive
  UI). Calculator metadata (title, description, related articles) lives in
  a typed registry, not frontmatter, since calculators need real logic
  attached, not just prose.

## Build + CI/CD

`.github/workflows/deploy.yml` runs on every push to `main`:

```
npm ci -> astro check -> vitest -> npm run build (gen-route-ids + astro build + check-links gate) -> wrangler@3 pages deploy
```

A push that fails any gate does not deploy. Deploy uses GitHub Actions (not
Cloudflare's native Git integration -- see `docs/decisions/` for why), authenticated
via the repo secret `CLOUDFLARE_API_TOKEN`.

**Three gates to run before any push, always:** `npx astro check` (expect 0/0/0),
`npm test` (Vitest), `npm run build` (includes the link gate -- expect 0 violations).

Claude pushes to `main` via the GitHub MCP server, not local `git push` -- see
[[0016-github-mcp-for-pushes]].

## SEO plumbing
