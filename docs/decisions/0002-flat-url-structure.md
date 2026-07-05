---
number: 0002
title: Flat trailing-slash URLs, no category in article paths
type: architecture
status: accepted
date: 2026-06-13
---

**Context:** Choosing the URL scheme before scaffolding the Astro site. Needed
one consistent contract that both Codex (build) and Claude (content) would
follow without drift, and that could be mechanically enforced.

**Options considered:**
(1) Category-prefixed article paths (`/category/slug/`) -- conventional, but
couples URL stability to category reassignment and duplicates the category
already stored in frontmatter.
(2) Flat article paths (`/slug/`) with separate `/category/` hubs and
`/calculators/tool/` -- no category segment in the article URL itself.
(3) Query-param or non-slash-terminated routes.

**Decision:** Option 2. Every URL ends in a trailing slash:
`/{slug}/` for articles, `/{category}/` for hubs, `/calculators/{tool}/` for
calculators. Enforced via `astro.config.mjs` (`trailingSlash: 'always'`,
`build.format: 'directory'`) plus a typed route registry
(`src/lib/links.ts`) and a build-time gate (`scripts/check-links.mjs`) that
fails the build on any internal redirect or 404.

**Reasoning:** A flat slug is stable even if an article's category changes
later (no URL break, no redirect debt). Trailing-slash-always avoids the
classic non-slash-to-slash redirect hop. Enforcing it mechanically (typed
links + build gate), rather than by convention, is what makes "zero internal
redirects/404s" actually hold as the codebase grows across many contributors
(Codex + Claude + future automation).

**Consequences:** Every internal href must go through `routes` / `url()` /
`<Link>` -- a raw `<a href="/foo">` fails the `check-links` gate. Astro's
content-collection root `[slug]` route must discriminate between articles and
category hubs sharing the same URL shape (documented collision guard in
`src/pages/[slug]/index.astro`). New page types (quizzes, projects -- see the
2026-07 strategy review's proposed sitemap) must decide their URL shape
before build, not after.

**Revisit when:** never for existing content -- changing this after launch
would mean a full redirect migration, which the whole system was built to
avoid.

**Related:** [[0001-wedge-model]]
