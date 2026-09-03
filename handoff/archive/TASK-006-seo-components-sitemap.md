Status: CLOSED
<!-- TODO | IN_PROGRESS | DONE | CHANGES_REQUESTED | CLOSED -->

# TASK-006 -- SEO components + JSON-LD + sitemap + robots

- **Owner of this stage:** Codex
- **Repo:** `Desktop/statohub/` (where the work happens)
- **Created:** 2026-06-14 by Claude

<!-- Authoring note (Claude): keep this file plain ASCII. Use `--` not an em
dash, `->` not an arrow, `...` not an ellipsis. Codex reads these files through
a Windows codepage; non-ASCII punctuation renders as mojibake and breaks its
apply_patch matching. -->

---

## Brief  *(Claude writes -- what Codex needs to execute)*

**Goal:** Build the reusable SEO plumbing from BUILD-PLAN **B4** -- canonical
tags, meta/OG, breadcrumbs, and JSON-LD (BreadcrumbList + Article +
SoftwareApplication) -- plus a `robots.txt` and a verified sitemap. Wire it into
the pages that exist today (home, calculators hub, standalone calculator pages,
the throwaway `/normal-distribution/`). Every URL a component emits MUST route
through `url()` from `src/lib/links.ts` so the TASK-005 link gate still passes.

**Context / inputs:**
- BUILD-PLAN.md sections **B4** (SEO plumbing) and **B2** (link integrity -- the
  rule that all internal hrefs AND all JSON-LD URL fields go through `url(id)`).
- `src/lib/links.ts` -- the `url(ref: RouteRef)` emitter and `routes` helpers.
  This is the ONLY way to produce an internal path. Do not hand-write paths.
- `src/layouts/BaseLayout.astro` -- currently hardcodes a minimal `<head>`
  (title + description + theme script). It is the single place every page renders
  through, so SEO head tags belong here, driven by new optional props.
- `astro.config.mjs` -- already sets `site: 'https://statohub.com'`,
  `trailingSlash: 'always'`, and `integrations: [mdx(), sitemap()]`. Use
  `Astro.site` for absolute URLs; do not hardcode the origin.
- `src/pages/calculators/[slug]/index.astro` -- the standalone calculator page;
  it is the proof surface for SoftwareApplication schema + breadcrumbs.
- `src/content/config.ts` -- the `calculators` / `articles` / `categories`
  schemas (for the shape of data the Article/SoftwareApplication helpers read).

**Deliverables:**
- [ ] `src/components/seo/Meta.astro` -- renders `<title>`, `<meta name=description>`,
      and Open Graph + Twitter Card tags (`og:title`, `og:description`, `og:type`,
      `og:url`, `og:image` when an image is provided, `twitter:card`,
      `twitter:title`, `twitter:description`, `twitter:image`). Props:
      `title`, `description`, `canonicalUrl` (absolute), `ogType`
      (default `'website'`), `ogImage?` (absolute or root-relative -> resolved
      absolute against `Astro.site`).
- [ ] `src/components/seo/Canonical.astro` -- emits a single
      `<link rel="canonical">` with an absolute, slash-terminated URL built from
      `Astro.url.pathname` (or an explicit override prop) resolved against
      `Astro.site`. Must end in `/`.
- [ ] `src/components/seo/JsonLd.astro` -- generic emitter: takes a `schema`
      object prop and renders one `<script type="application/ld+json">` with
      `JSON.stringify(schema)`. Used by BaseLayout for each schema object passed.
- [ ] `src/components/Breadcrumbs.astro` -- visible breadcrumb nav. Takes
      `items: BreadcrumbItem[]` where `BreadcrumbItem = { label: string; route?: RouteRef }`.
      Renders every item except the last as a typed `<Link to={route}>`; the last
      (current page) is plain text with `aria-current="page"`. Wrap in
      `<nav aria-label="Breadcrumb">`.
- [ ] `src/lib/schema.ts` -- pure helper functions that BUILD the JSON-LD objects
      (no rendering). All URL fields go through `url(ref)` and are made absolute
      via `new URL(url(ref), site).href`. Export:
      - `breadcrumbList(items: BreadcrumbItem[], site: URL)` -> a `BreadcrumbList`
        object (`itemListElement` with `position`/`name`/`item` absolute URLs;
        the current page's `item` is its own absolute canonical URL).
      - `articleSchema(input, site)` -> an `Article` object (headline,
        description, `mainEntityOfPage` absolute URL via `url()`, optional
        `datePublished`/`dateModified`, optional `image`). Built now, CONSUMED by
        the article layout task (A5) later -- export it, no page wires it yet.
      - `softwareApplicationSchema(input, site)` -> a `SoftwareApplication` object
        for a calculator (name, description, `applicationCategory:'UtilityApplication'`,
        `url` absolute via `url({kind:'calculator', id})`, `offers` price 0 /
        `priceCurrency:'USD'`). Define a `BreadcrumbItem` type here or in
        `links.ts` and import it in `Breadcrumbs.astro` (one source).
- [ ] Extend `src/layouts/BaseLayout.astro` with optional props
      (`canonicalPath?`, `ogType?`, `ogImage?`, `breadcrumbs?: BreadcrumbItem[]`,
      `jsonLd?: object[]`, `noindex?: boolean`) and render, in `<head>`:
      `<Meta>`, `<Canonical>`, a `<meta name="robots" content="noindex,follow">`
      when `noindex` is true, and one `<JsonLd schema={...}>` per object in
      `jsonLd`. If `breadcrumbs` is passed, AUTO-prepend its BreadcrumbList to the
      emitted JSON-LD (single source for the trail) and render `<Breadcrumbs>` at
      the top of `<main>` (before the `<slot />`). Keep the existing theme
      no-flash script and toggle exactly as-is.
- [ ] Wire the existing pages:
      - `calculators/[slug]/index.astro`: pass `breadcrumbs` (Home -> Calculators
        -> this calc) and `jsonLd: [softwareApplicationSchema(...)]`.
      - `calculators/index.astro` (hub): `breadcrumbs` (Home -> Calculators).
      - `index.astro` (home): no breadcrumbs (it is the root); confirm canonical
        + OG render.
      - `normal-distribution/index.astro` (throwaway proof route): leave behavior
        equivalent; fine to add `noindex` since it is a placeholder, your call.
- [ ] `public/robots.txt` -- allow all, plus `Sitemap: https://statohub.com/sitemap-index.xml`.
- [ ] Confirm/adjust the `@astrojs/sitemap` integration so output stays
      slash-terminated (it inherits `trailingSlash:'always'`) and so any future
      `noindex`/`draft` page can be excluded -- add a `filter` hook that drops the
      throwaway `/normal-distribution/` if you mark it noindex. Do not add other
      routes by hand; the integration discovers built routes.

**Constraints:**
- Stay in this repo; do not touch sibling folders.
- **No new dependencies.** `@astrojs/sitemap` is already installed; everything
  else is Astro built-ins + plain TS. Node 20.8.0 / Wrangler v3 stack stays put.
- **Every internal URL goes through `url()`** -- in visible links AND in every
  JSON-LD `url`/`item`/`mainEntityOfPage` field. No hand-written `/foo/` strings.
  This is what keeps the TASK-005 `check-links.mjs` gate green.
- `src/calc/**` stays untouched and pure. Do NOT build article routes,
  `ArticleLayout`, or category-hub routes -- those are a separate upcoming task
  (A5). `articleSchema` is exported but intentionally not consumed yet.
- Do NOT deploy or run `wrangler` -- that is TASK-007.
- Keep BaseLayout's existing props (`title`, `description`) working; all new
  props are optional with sane defaults so the current pages still build.

**Definition of done / how to verify:**
- `npm run build` exits 0 AND `scripts/check-links.mjs` reports **0 violations**
  (the new canonical/breadcrumb/JSON-LD links must all be slash-terminated and
  resolvable). This is the headline gate.
- `npx astro check` -> 0 errors / 0 warnings / 0 hints (a bad `RouteRef` in a
  breadcrumb or schema helper must fail the type check).
- `npm test` -> still green (33 tests / 12 files; this task adds no engine logic).
- In the built output, `dist/calculators/standard-deviation/index.html` contains:
  exactly one `<link rel="canonical" href="https://statohub.com/calculators/standard-deviation/">`;
  OG tags; one `application/ld+json` block that parses to a `BreadcrumbList`; and
  one that parses to a `SoftwareApplication` whose `url` is the absolute
  slash-terminated calculator URL.
- `dist/robots.txt` exists and references the sitemap; `dist/sitemap-index.xml`
  (+ `sitemap-0.xml`) lists only slash-terminated `https://statohub.com/...` URLs
  and excludes any page you marked `noindex`.

---

## Work Log  *(Codex writes -- what was actually done)*

- **Started:** 2026-06-14
- **Finished:** 2026-06-14

**What changed (files + where):**
- `src/components/seo/Meta.astro` -- added reusable title, description, Open Graph, and Twitter Card tags. `ogImage` resolves against `Astro.site`.
- `src/components/seo/Canonical.astro` -- added one canonical link emitter that resolves against `Astro.site` and slash-terminates the pathname.
- `src/components/seo/JsonLd.astro` -- added generic inline JSON-LD script emitter.
- `src/components/Breadcrumbs.astro` -- added visible breadcrumb nav using typed `Link.astro` links for non-current items.
- `src/lib/schema.ts` -- added pure `breadcrumbList`, `articleSchema`, and `softwareApplicationSchema` helpers. Internal page URL fields are built with `url(ref)` and then made absolute from `Astro.site`.
- `src/layouts/BaseLayout.astro` -- added optional `canonicalPath`, `ogType`, `ogImage`, `breadcrumbs`, `jsonLd`, and `noindex` props. It now renders Meta, Canonical, robots noindex, JSON-LD, and visible breadcrumbs while preserving the existing theme no-flash script and toggle behavior.
- `src/pages/index.astro` -- passed the home canonical route via `routes.home()`.
- `src/pages/calculators/index.astro` -- added Home -> Calculators breadcrumbs and calculators hub canonical route.
- `src/pages/calculators/[slug]/index.astro` -- added Home -> Calculators -> current calculator breadcrumbs, calculator canonical route, and SoftwareApplication JSON-LD.
- `src/pages/normal-distribution/index.astro` -- marked the throwaway proof route `noindex`.
- `astro.config.mjs` -- kept sitemap integration and added a filter excluding the noindexed proof route from sitemap output.
- `public/robots.txt` -- added allow-all robots file with `Sitemap: https://statohub.com/sitemap-index.xml`.

**How to verify:**
- `npm run build`
  - Exit 0.
  - `gen-route-ids: wrote 1 article, 2 calculator, 1 category ids to src/lib/content-route-ids.ts`
  - `[@astrojs/sitemap] sitemap-index.xml created at dist`
  - `check-links: scanned 4 pages, checked 10 internal links, found 0 violations.`
  - `check-links: OK - all internal page links are canonical and resolvable.`
- `npx astro check`
  - Exit 0.
  - `Result (11 files):`
  - `- 0 errors`
  - `- 0 warnings`
  - `- 0 hints`
- `npm test`
  - First sandboxed run hit the documented Windows `spawn EPERM` from Vitest/esbuild.
  - Reran the same command with process-spawn approval.
  - Exit 0.
  - `Test Files 12 passed (12)`
  - `Tests 33 passed (33)`
- Built HTML inspection for `dist/calculators/standard-deviation/index.html`
  - `canonicalCount=1`
  - `og:title=True`
  - `og:description=True`
  - `og:type=True`
  - `og:url=True`
  - `schemaCount=2`
  - `schemaTypes=BreadcrumbList,SoftwareApplication`
  - `softwareUrl=https://statohub.com/calculators/standard-deviation/`
- Built robots and sitemap inspection
  - `robotsExists=True`
  - `User-agent: *`
  - `Allow: /`
  - `Sitemap: https://statohub.com/sitemap-index.xml`
  - `sitemapIndexLocs=https://statohub.com/sitemap-0.xml`
  - `pageUrls=https://statohub.com/,https://statohub.com/calculators/,https://statohub.com/calculators/standard-deviation/`
  - `badPageUrlCount=0`
  - `normalDistributionListed=0`

**Blocked / couldn't do / decisions made:**
- Marked `/normal-distribution/` noindex and excluded it from the sitemap because it is a throwaway proof route.
- `sitemap-index.xml` contains the normal sitemap document loc `https://statohub.com/sitemap-0.xml`; the page URLs inside `sitemap-0.xml` are all slash-terminated and the noindexed route is excluded.
- `CLAUDE.md` is modified in the worktree, but I did not edit it.

---

## Review  *(Claude writes -- accept or send back)*

- **Reviewed:** 2026-06-14
- **Verdict:** CLOSED

**Notes / what to improve:**
- Verified independently against built artifacts, not just the Work Log. Re-ran
  all gates from clean state: `npm run build` exit 0, `check-links: scanned 4
  pages, checked 10 internal links, found 0 violations`; `astro check` = 0
  errors / 0 warnings / 0 hints (11 files); `npm test` = 33 tests / 12 files
  green (no EPERM this run -- sandbox already approved).
- Built SD calculator page (`dist/calculators/standard-deviation/index.html`)
  carries exactly one absolute slash-terminated canonical
  (`https://statohub.com/calculators/standard-deviation/`) and TWO ld+json
  blocks -- `BreadcrumbList` (3 `ListItem`s) + `SoftwareApplication` (with
  `Offer`). OG title/desc/type/url all present.
- Sitemap (`dist/sitemap-0.xml`) lists only the 3 indexable slash-terminated
  URLs; `/normal-distribution/` correctly excluded and marked
  `robots: noindex,follow`. `robots.txt` allow-all + `Sitemap:` line present.
- All component URL fields route through `url()`/`routes.*`, so the TASK-005
  link gate remains the enforcement mechanism (B2 non-negotiable intact).
- `articleSchema` built + exported but intentionally not yet consumed -- ready
  for the future A5 article-layout task. No new deps; `src/calc/**` untouched.
- Build pipeline TASK-001 -> TASK-006 is now complete. Only TASK-007 (go-live
  deploy) remains.
