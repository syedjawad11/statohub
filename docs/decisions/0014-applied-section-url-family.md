---
number: 0014
title: Applied Statistics lives at flat root URLs, not under /blog/
type: architecture
status: accepted
date: 2026-08-16
---

**Context:** statohub is being restructured from one section into three --
Learn, Calculators, and a new **Applied Statistics** section covering how
statistics is used in practice (4 category hubs: Data Analysis, Experiments &
Causality, Forecasting & Time Series, Machine Learning Statistics). Applied
articles are a genuinely different format from teaching articles: ~3,000-4,500
words, practitioner-playbook modules, no required calculator.

A prior planning doc (`docs/ideas/statohub-applied-content-style-plan.md`,
2026-08-09, **never implemented**) had specced this content under a `/blog/`
URL family: `/blog/{slug}/` articles and `/blog/{category}/` hubs. That doc
still holds the format/component spec, which survives; only its URL decision is
overturned here.

**Options considered:**
(1) `/blog/{slug}/` + `/blog/{category}/` -- the 2026-08-09 proposal. Visually
separates the two content types and needs no collision handling, but adds a
second URL grammar to a site whose entire link-safety system is built on one.
(2) `/applied/{slug}/` -- nests applied articles under the section landing.
Same objection as (1), plus it buries the keyword in a path segment.
(3) Flat root, joining the existing namespace: `/applied/` landing,
`/{category}/` hubs, `/{slug}/` articles -- identical in shape to Learn.

**Decision:** Option 3. Applied content joins the existing flat root namespace.
`/applied/` and `/learn/` are section landing pages; applied category hubs
(`/data-analysis/`, `/experiments-causality/`, `/time-series-forecasting/`,
`/machine-learning-statistics/`) and applied articles
(e.g. `/bayes-theorem-ab-testing/`) sit at the root exactly as Learn's do.
Sections are modelled as a `section: 'learn' | 'applied'` field on the
`categories` collection -- **not** as parallel collections, and **not** as a
field on `articles`.

Hub slugs are keyword-ordered rather than mirroring the nav label: the nav says
"Forecasting & Time Series" while the slug is `/time-series-forecasting/`,
because that is the phrase people actually search.

**Reasoning:** [[0002-flat-url-structure]] chose flat slugs precisely so a URL
survives recategorisation. Introducing `/blog/` would mean an applied article
promoted into the Learn curriculum -- or a Learn article that turns out to be
applied -- could not move without a redirect, which is exactly the debt the
whole link system exists to prevent. One grammar also means
`scripts/check-links.mjs` and `scripts/gen-route-ids.mjs` need no new cases.

Modelling sections as a field on `categories` keeps the root route a two-way
union (articles + categories) rather than a four-way one with a six-way
collision matrix, and -- decisively -- keeps
`related: z.array(reference('articles'))` working **across** sections. Applied
-> Learn cross-linking is the main internal-linking gain the restructure exists
to create; parallel collections would have broken it. Putting `section` on
`categories` rather than a duplicate `format` on `articles` means the two can
never disagree, since every article has exactly one category.

**Consequences:** Applied and Learn content share one root namespace, so the
collision guard in `src/pages/[slug]/index.astro` now protects four page types
through two collections. That guard has a pre-existing gap -- it compares
articles against categories but never against *static* route segments -- which
adding `/learn/` and `/applied/` makes concrete: a category slugged `learn`
would be silently shadowed with a green build. A `RESERVED_SLUGS` check closes
it.

**Authoring rule (load-bearing):** applied content files must sit **flat** in
`src/content/articles/` and `src/content/categories/`, never in a subfolder.
`scripts/gen-route-ids.mjs` reads the content dirs with `{ recursive: true }`
and keeps the relative path, so `articles/applied/foo.mdx` would silently
generate the id `applied/foo` and the URL `/applied/foo/` -- breaking the flat
URL contract with no compile error.

No existing URL changes; the restructure is purely additive.

**Revisit when:** a third content section arrives whose articles genuinely
cannot share a namespace, or if root-namespace collisions become frequent
enough that the reserved-slug list stops being maintainable.

**Related:** [[0002-flat-url-structure]], [[0015-wedge-scoped-to-learn]]
