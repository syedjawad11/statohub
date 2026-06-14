Status: CLOSED
<!-- TODO | IN_PROGRESS | DONE | CHANGES_REQUESTED | CLOSED -->

# TASK-008 -- ArticleLayout + flat /{slug}/ article routes

- **Owner of this stage:** Codex
- **Repo:** `Desktop/statohub/` (where the work happens)
- **Created:** 2026-06-14 by Claude

<!-- Authoring note (Claude): keep this file plain ASCII. Use `--` not an em
dash, `->` not an arrow, `...` not an ellipsis. Codex reads these files through
a Windows codepage; non-ASCII punctuation renders as mojibake and breaks its
apply_patch matching. -->

---

## Brief  *(Claude writes -- what Codex needs to execute)*

**Goal:** Make MDX articles in the `articles` content collection render as real,
indexable pages at flat root URLs `/{slug}/`, through a dedicated `ArticleLayout`.
This is the last missing build piece before the content pipeline can publish
articles -- right now `src/content/articles/standard-deviation.mdx` exists but has
no route, so it produces no page.

**Context / inputs:**
- BUILD-PLAN.md (the A5 "article layout + routes" item) and AGENTS.md.
- The content schema is already defined: `src/content/config.ts` (the `articles`
  collection -- title, description, category ref, primaryKeyword, keywords, phase,
  calculator ref, related, draft, pubDate, updatedDate, ogImage).
- **Mirror this existing pattern exactly:** the calculator dynamic route
  `src/pages/calculators/[slug]/index.astro` already does getStaticPaths over a
  collection, builds breadcrumbs, emits JSON-LD, and renders through `BaseLayout`.
  The article route is the same shape, one directory level up (root, not under
  `/calculators/`).
- Helpers that ALREADY EXIST and must be reused (do not re-implement):
  - `src/layouts/BaseLayout.astro` -- props: `title`, `description`,
    `canonicalPath` (a RouteRef), `ogType` ('website' | 'article'), `ogImage`,
    `breadcrumbs` (BreadcrumbItem[]), `jsonLd` (object[]), `noindex`. It already
    handles canonical URL, Meta/OG tags, breadcrumb JSON-LD, theme toggle, and
    renders the page chrome + a `<slot />`.
  - `src/lib/schema.ts` -> `articleSchema({ id, headline, description,
    datePublished?, dateModified?, image? }, site)` -- returns the Article JSON-LD.
    Use it; it is built for exactly this.
  - `src/lib/links.ts` -> `routes.article(id)` already maps an ArticleId to
    `/{id}/`. The typed registry and `url()` are the only allowed way to build
    internal hrefs (BUILD-PLAN B2). Route ids are codegen'd by
    `scripts/gen-route-ids.mjs` on every build.
  - `src/components/StatCalc.astro` -- the embed component (TASK-004). The
    calculator page uses `variant="page"`; inside an article use the embed variant.

**Deliverables:**
- [ ] **`src/layouts/ArticleLayout.astro`** -- wraps `BaseLayout` for article pages.
  - Accepts the article's frontmatter data + its slug (typed as `ArticleId`).
  - Passes to BaseLayout: `title` = `${article.title} | Statohub`,
    `description` = article.description, `canonicalPath` = `routes.article(slug)`,
    `ogType="article"`, `ogImage` = article.ogImage (when set), `breadcrumbs`,
    and `jsonLd={[articleSchema(...)]}` built from the article fields (headline =
    title, datePublished = pubDate, dateModified = updatedDate ?? pubDate).
  - **Breadcrumbs for now: `Home -> <article title>` only.** Do NOT add a category
    crumb yet -- the category-hub pages `/{category}/` do not exist, and a
    breadcrumb link to one would fail the `check-links.mjs` build gate (and
    `breadcrumbList()` throws on a route-less crumb). The category crumb gets
    inserted by the future category-hub task. You MAY render the category title as
    a non-linked eyebrow/kicker above the H1 (resolve it with `getEntry`) -- that is
    plain text, not a link, so it is gate-safe.
  - Renders the article body via a `<slot />` (the route passes `<Content />`).
  - Long-form prose must be legible (headings, lists, code, tables, links) in both
    light and dark mode. Recommended: add `@tailwindcss/typography` (devDependency)
    and wrap the body slot in `prose dark:prose-invert max-w-none` (register the
    plugin in `tailwind.config.cjs`). Hand-styled prose utilities are acceptable if
    you would rather not add the dep -- your call, but the rendered article must
    read cleanly. State which you chose in the Work Log.
- [ ] **`src/pages/[slug]/index.astro`** -- the flat root-level dynamic route.
  - `getStaticPaths()` over `getCollection('articles')`, **excluding drafts**
    (`!entry.data.draft`), mapping `params: { slug: entry.id }`,
    `props: { entry }`. (Drafts must never generate a page -- this is the
    `draft:true`-until-published rule.)
  - In the component: `const { Content } = await entry.render();` then render
    `ArticleLayout` with the entry data + slug, placing `<Content />` in its slot.
  - Resolve the category entry (`getEntry(entry.data.category)`) only if you use the
    eyebrow label.
- [ ] **MDX component access** -- the writer agent will use `<StatCalc ... />` and
  internal `<Link to={routes.article('...')}>` inside article MDX. Decide and
  document the mechanism. Recommended (lean, standard Astro): article `.mdx` files
  `import` the components they need in their own frontmatter. Demonstrate the
  pattern by fleshing `src/content/articles/standard-deviation.mdx` into a SHORT but
  real rendering example: import StatCalc + Link + routes, a couple of headings,
  one embedded `<StatCalc slug="standard-deviation" variant="embed" />`, and one
  internal `<Link>`. Keep it `draft: true`. (A `components={{ StatCalc, Link }}`
  prop on `<Content />` is an acceptable alternative -- if you go that way, document
  it so the writer agent knows it does not need imports.)
- [ ] **Delete the throwaway proof route `src/pages/normal-distribution/`.** It is a
  `noindex` routing proof from TASK-001. `normal-distribution` is also a REAL future
  article slug (PD3); leaving this static page would silently SHADOW the dynamic
  `[slug]` route when that article is written, so it must go now.

**Constraints:**
- Stay in this repo; do not touch sibling folders, `CLAUDE.md`, or `content-ops/`.
- Internal links ONLY through `Link` / `routes` / `url()` -- never hand-type an
  internal href. The `check-links.mjs` gate enforces flat trailing-slash URLs.
- Do not hand-roll canonical/OG/JSON-LD in the layout -- reuse BaseLayout + the
  `schema.ts` helpers. Do not invent calculator engines (that is separate build
  work); only embed calculators whose collection entry already exists.
- Lean: no new dependency beyond (optionally) `@tailwindcss/typography`.
- **Forward-compat note (important):** category hubs will also live at root as
  `/{category}/`. Astro cannot have two dynamic `[slug]` directories at the repo
  root. So the future category-hub task will need to either fold category paths into
  THIS same `src/pages/[slug]/index.astro` (union both collections in getStaticPaths
  and branch the layout) or replace it. Keep this route article-only and simple now,
  but leave a short code comment flagging that constraint so the next task does not
  create a conflicting second root `[slug]` route.

**Definition of done / how to verify:**
- `npm run build` is green end to end: `gen-route-ids` -> `astro build` ->
  `check-links` reports **0 violations**.
- `npx astro check` passes (the `slug` typing as `ArticleId` resolves; no type
  errors).
- Draft exclusion proven BOTH ways:
  - With `standard-deviation.mdx` at `draft: true` (its normal state), `npm run
    build` produces **no** `dist/standard-deviation/index.html`.
  - Temporarily flip it to `draft: false`, rebuild, and confirm
    `dist/standard-deviation/index.html` exists and contains: the `<h1>`, the meta
    description, a `<link rel="canonical" href=".../standard-deviation/">`, the
    Article JSON-LD block, the Home breadcrumb, and the embedded StatCalc markup.
    Open it / preview to confirm prose + dark mode read cleanly. **Then revert it to
    `draft: true`** (this task ships no live article -- the content pipeline does
    that later).
- `src/pages/normal-distribution/` is gone and the build still passes.
- Fill the Work Log: which prose approach you chose, the MDX component mechanism you
  chose, and the dist verification output.

---

## Work Log  *(Codex writes -- what was actually done)*

- **Started:** 2026-06-14
- **Finished:** 2026-06-14

**What changed (files + where):**
- `src/layouts/ArticleLayout.astro` -- added the article wrapper around
  `BaseLayout`, passing title/description/canonical/OG Article type, Home ->
  article breadcrumbs only, and `articleSchema()` JSON-LD. It also renders the
  category as a plain-text eyebrow and wraps the MDX slot in `.article-prose`.
- `src/pages/[slug]/index.astro` -- added the flat root article dynamic route,
  filtering out `draft: true` entries in `getStaticPaths()`. It normalizes the MDX
  entry id by stripping the extension so `standard-deviation.mdx` builds at
  `/standard-deviation/`, matching `routes.article(id)`. Left a comment about the
  future category-hub root-route constraint.
- `src/content/articles/standard-deviation.mdx` -- fleshed the draft sample into a
  short real MDX rendering example with explicit imports for `StatCalc`, `Link`,
  and `routes`, one embedded `<StatCalc slug="standard-deviation" variant="embed" />`,
  and one internal typed `<Link>`.
- `src/styles/global.css` -- added hand-styled `.article-prose` rules for readable
  headings, paragraphs, lists, code, tables, links, and dark mode. Chose this over
  adding `@tailwindcss/typography` to avoid a new dependency.
- `src/pages/normal-distribution/` -- deleted the throwaway noindex proof route so
  it cannot shadow the future real `normal-distribution` article.

**How to verify:**
- `npm run build` with `standard-deviation.mdx` at `draft: true` -- passed:
  `check-links: scanned 4 pages, checked 11 internal links, found 0 violations`.
  `Test-Path dist/standard-deviation/index.html` returned `False`.
- `npx astro check` -- passed with `0 errors`, `0 warnings`, `0 hints`.
- Temporarily changed `standard-deviation.mdx` to `draft: false`, then ran
  `npm run build` -- passed: generated `/standard-deviation/index.html` and
  `check-links: scanned 5 pages, checked 14 internal links, found 0 violations`.
- Verified the temporary built article HTML contained the H1, meta description,
  canonical `https://statohub.com/standard-deviation/`, Article JSON-LD, Home
  breadcrumb, embedded `data-statcalc` markup, `.article-prose`, and dark-mode
  classes.
- Previewed the temporary page at `http://127.0.0.1:4321/standard-deviation/`
  with HTTP 200 and captured headless Chrome screenshots for rendered readability;
  prose, breadcrumb, embedded calculator, and dark mode were legible.
- Reverted `standard-deviation.mdx` to `draft: true`, reran `npm run build`, and
  reran `npx astro check`; both passed. `Test-Path dist/standard-deviation/index.html`
  and `Test-Path src/pages/normal-distribution` both returned `False`.

**Blocked / couldn't do / decisions made:**
- MDX component access decision: article MDX files import the components/helpers
  they use in their own MDX module scope. Writer agents should import `StatCalc`,
  `Link`, and `routes` when they need embedded calculators or typed internal links.
- Prose styling decision: hand-styled `.article-prose` in `global.css`; no
  `@tailwindcss/typography` dependency added.
- The in-app browser plugin was unavailable (`Browser is not available: iab`), so
  visual verification used local preview plus headless Chrome screenshots instead.

---

## Review  *(Claude writes -- accept or send back)*

- **Reviewed:** 2026-06-14
- **Verdict:** CLOSED

**Notes / what to improve:**
- Verified independently, all green:
  - `npm run build` -- 4 pages built, `check-links: 0 violations` (draft
    `standard-deviation.mdx` correctly produced NO `/standard-deviation/` page;
    the `[slug]` route emitted nothing, proving draft exclusion).
  - `npx astro check` -- 0 errors, 0 warnings, 0 hints (13 files).
  - `src/pages/normal-distribution/` confirmed gone; no second root `[slug]`
    route exists.
- `ArticleLayout.astro` is clean: reuses BaseLayout + `articleSchema()`, no
  hand-rolled canonical/OG/JSON-LD. Breadcrumbs are Home -> article only (no
  category crumb), category rendered as a non-linked eyebrow -- gate-safe as
  briefed.
- `src/pages/[slug]/index.astro` mirrors the calculator route, filters drafts,
  resolves category via `getEntry` for the eyebrow, and carries the required
  forward-compat comment about the future category-hub root-route collision.
- Sample MDX uses in-frontmatter imports (StatCalc + Link + routes) -- the
  documented, lean component-access mechanism for the writer agent.
- Decisions accepted: hand-styled `.article-prose` over `@tailwindcss/typography`
  (no new dep -- consistent with the lean preference); MDX self-imports over a
  `components=` prop. Both fine.
- Minor (non-blocking, no action needed): id-normalization via
  `entry.id.replace(/\.[^.]+$/, '')` in getStaticPaths is a touch defensive vs.
  the calculator route, but harmless and keeps slugs aligned with
  `routes.article(id)`.
