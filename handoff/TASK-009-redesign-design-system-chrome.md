Status: CLOSED
<!-- TODO | IN_PROGRESS | DONE | CHANGES_REQUESTED | CLOSED -->

# TASK-009 -- Front-end redesign, part 1: design system + shared chrome + resolve all nav targets

- **Owner of this stage:** Codex
- **Repo:** `Desktop/statohub/` (where the work happens)
- **Created:** 2026-06-16 by Claude

<!-- Authoring note (Claude): keep this file plain ASCII. Use `--` not an em
dash, `->` not an arrow, `...` not an ellipsis. Codex reads these files through
a Windows codepage; non-ASCII punctuation renders as mojibake and breaks its
apply_patch matching. -->

---

## Brief  *(Claude writes -- what Codex needs to execute)*

**Goal:** Replace the current plain slate/Inter Tailwind look with the warm
editorial design in the two reference templates, starting with the global design
system and the shared page chrome (header, footer, theme, StatCalc skin,
calculator pages). Also make every link the new header/footer points at actually
resolve, so the build's link gate stays green. The bespoke homepage and article
layouts come next, in TASK-010.

**Visual source of truth (READ THESE FIRST):** two complete static mockups now
sit in the repo root:
- `statohub_template.html` -- the home page design (header, hero, fused
  teach/compute card, category grid, calculators strip, how-it-works, footer).
- `statohub_article_template.html` -- the article design (3-column shell, sticky
  TOC, reading progress, prose + callout + formula-block styles, embedded
  calculator, related grid, condensed footer).

These define the exact palette, fonts, spacing, border-radii, shadows, and
component shapes. Match them closely. In TASK-009 you implement the header,
footer, and theme/token system from them (the home/article body sections are
TASK-010). The two files are mockups only -- do NOT serve them, link them, or
copy their hand-coded `<script>` calculators (we already have a real engine).

**Context / inputs:**
- `CLAUDE.md` (project rules) and `BUILD-PLAN.md`. Non-negotiables that still
  apply: flat trailing-slash URLs, internal links ONLY through the typed
  `Link`/`routes`/`url()` registry, zero internal redirects/404s enforced by
  `scripts/check-links.mjs` at build time.
- Current chrome to replace: `src/layouts/BaseLayout.astro` (header + theme
  toggle + main, no footer yet), `src/styles/global.css`, `tailwind.config.cjs`.
- Theme mechanism that EXISTS and must be preserved: the site toggles dark mode
  with a **`.dark` class on `<html>`** (`darkMode: 'class'` in Tailwind), set by a
  no-flash inline script in `BaseLayout.astro` head and a localStorage-persisted
  toggle button. The mockups use `data-theme="dark"` on `<html>` instead -- do
  NOT adopt that attribute. Keep the `.dark` class as the single switch and port
  the mockups' dark values onto `html.dark`.
- `src/components/StatCalc.astro` -- the real, data-driven calculator. Its logic
  lives in the JSON config block + `src/components/statcalc/client.ts`. The
  contract that MUST stay byte-stable: the `data-statcalc`, `data-config-id`,
  `data-statcalc-form`, `data-statcalc-results`, `data-statcalc-chart`
  attributes, the `<script type="application/json">` config block, the
  `aria-live` results region, and the `import './statcalc/client.ts'`. You may
  ONLY change classes/markup wrappers for styling.
- `src/components/Link.astro`, `src/components/Breadcrumbs.astro`,
  `src/lib/links.ts` (typed route registry; `routes.categoryHub(id)` already
  exists and maps to `/{id}/`), `src/content/config.ts` (the `categories`
  collection schema: `title`, `description`, `order`, optional `pillar`).
- Route ids are codegen'd from `src/content/**` by `scripts/gen-route-ids.mjs` on
  every build. Adding category YAML files makes new `CategoryContentId`s appear,
  so `routes.categoryHub('probability-distributions')` will type-check only after
  the YAML exists.

**The nav-target problem (this is why this task is bigger than just CSS):** the
new header links to 5 nav items + a CTA, the footer links to ~12 targets, and
they point at category hub pages (`/descriptive-statistics/`,
`/probability-distributions/`, `/regression-correlation/`,
`/inferential-statistics/`, plus `/combinatorics/` and `/foundations/` used by
the TASK-010 grid) and an `/about/` page. **None of these exist today** -- only
`/`, `/calculators/`, calculator pages, and published articles resolve, and only
the `descriptive-statistics` category is seeded. The `check-links.mjs` gate FAILS
the build on any internal link to a page that is not generated. The agreed fix is
**stub placeholder pages** so every link resolves now, with real hub content
filled in later.

**Deliverables:**

- [ ] **Design tokens in `src/styles/global.css`.** Define the mockups' CSS custom
  properties on `:root` (light) and override them under `html.dark` (NOT
  `[data-theme="dark"]`). Copy the exact values from the mockup files:
  - Light: `--paper:#FBF8F2; --paper-2:#F4EEE2; --card:#FFFFFF; --ink:#211C17;
    --ink-soft:#5C5349; --muted:#8B8174; --line:#E8DFCF; --line-2:#DDD2BE;
    --verm:#D24326; --verm-soft:#FBEADF; --teal:#145A63; --teal-soft:#E0EEEE;`
    plus `--shadow`, `--max:1140px`, and the three font-family vars.
  - Dark (`html.dark`): `--paper:#1A1714; --paper-2:#211D18; --card:#252017;
    --ink:#F3ECDF; --ink-soft:#BBB1A1; --muted:#8B8174; --line:#352F26;
    --line-2:#403930; --verm:#F0613F; --verm-soft:#3A2118; --teal:#4FB3BE;
    --teal-soft:#142A2C;` plus the dark `--shadow`.
  - Set `body` background/color/font from the tokens; keep `color-scheme` in sync
    with light/dark.

- [ ] **Fonts: Fraunces (serif), Hanken Grotesk (sans), JetBrains Mono (mono).**
  Recommended (lean + good Core Web Vitals, no render-blocking, no third-party
  request): self-host via the `@fontsource` packages as devDependencies and
  `import` them where the mockups load them. The Google Fonts `<link>` approach
  used in the mockups is an acceptable fallback if you prefer no new dep -- your
  call; state which you chose in the Work Log. Wire the three families into
  `tailwind.config.cjs` `theme.extend.fontFamily` as `serif`, `sans`, `mono` so
  `font-serif` / `font-sans` / `font-mono` utilities work.

- [ ] **`tailwind.config.cjs` -- map the palette to the CSS vars.** Add
  `theme.extend.colors` entries (`paper`, `paper-2`, `card`, `ink`, `ink-soft`,
  `muted`, `line`, `line-2`, `verm`, `verm-soft`, `teal`, `teal-soft`) whose
  values are `var(--paper)` etc. Keep `darkMode: 'class'`. Net effect: utilities
  like `bg-paper text-ink border-line font-serif` render the warm design, and
  dark mode flips automatically because the CSS var changes under `html.dark` --
  so you generally will NOT need `dark:` color variants anymore. (You may instead
  style chrome with small component-scoped classes that read the vars directly,
  mirroring the mockups. Either approach is fine; pick one and be consistent.)

- [ ] **Header in `BaseLayout.astro`** matching `statohub_template.html`:
  brand (serif wordmark + vermillion dot), primary nav links (Descriptive ->
  `categoryHub('descriptive-statistics')`, Probability ->
  `categoryHub('probability-distributions')`, Regression ->
  `categoryHub('regression-correlation')`, Inferential ->
  `categoryHub('inferential-statistics')`, Calculators -> `calculatorsHub()`),
  spacer, theme-toggle icon button (reuse the EXISTING toggle + no-flash script
  logic, just restyle and swap in the sun/moon SVG; do not change the `.dark`
  +localStorage behavior), a primary CTA "Browse calculators" ->
  `calculatorsHub()`, and the mobile menu toggle with the responsive
  collapse/`@media` behavior from the mockup. ALL internal links via typed
  `Link`/`routes`. Sticky, blurred, bottom border per the mockup.

- [ ] **Footer in `BaseLayout.astro`** matching `statohub_template.html` (the full
  4-column footer: brand blurb + Topics + Calculators + Site columns + the
  bottom bar). Internal links via typed `Link`/`routes`. `/sitemap.xml` is a
  built asset, not a route -- link it with a plain `<a href="/sitemap.xml">`, not
  `Link`. Currently there is no footer at all, so add one.

- [ ] **Restyle `StatCalc.astro`** to the embedded-calculator look in
  `statohub_article_template.html` (the `.embed` block: teal header bar with a
  pip + "Calculator" label + title, padded body, results grid). Apply to both
  `variant="page"` and `variant="embed"`. **Do not touch `client.ts` or any
  `data-*` hook, the JSON config block, or the `aria-live` region** -- styling
  only. Verify the calculator still computes after restyling.

- [ ] **Restyle the calculator pages** to the new chrome/tokens: the standalone
  page `src/pages/calculators/[slug]/index.astro` and the hub
  `src/pages/calculators/index.astro`. Replace the slate/`dark:` utility soup
  with the token utilities; keep the typed links, breadcrumbs, JSON-LD, and the
  `<StatCalc>` usage exactly as they are functionally.

- [ ] **Make every nav/footer target resolve (stub pages).**
  - Seed the 5 missing categories as `src/content/categories/*.yaml` (schema:
    `title`, `description`, `order`): `probability-distributions`,
    `combinatorics`, `regression-correlation`, `inferential-statistics`,
    `foundations`. (Use sensible titles/descriptions; "Probability &
    Distributions", "Combinatorics", "Regression & Correlation", "Inferential
    Statistics", "Foundations".) `descriptive-statistics` already exists.
  - Build a **`src/layouts/CategoryLayout.astro`** (a thin styled placeholder: new
    chrome, the category title as H1, its description, a short "guides and tools
    for this topic are being added" note, breadcrumb Home -> Category). Reuse
    `BaseLayout`, `breadcrumbList`, and typed links. No fake article lists.
  - **Resolve the root-route collision (the BUILD-PLAN forward-compat note):**
    category hubs live at `/{category}/`, but `src/pages/[slug]/index.astro` is
    currently the article-only root route, and Astro allows only one root
    `[slug]` directory. Fold both collections into that one route:
    `getStaticPaths()` unions `getCollection('articles')` (drafts excluded, as
    now) and `getCollection('categories')`, tags each path with a discriminator
    (e.g. `props: { kind: 'article' | 'category', entry }`), and the page renders
    `ArticleLayout` or `CategoryLayout` accordingly. Guard against an article and
    a category sharing a slug (fail the build loudly if they ever collide). Keep
    the existing draft-exclusion and the `routes.article(id)` / `.categoryHub(id)`
    URL shapes. Remove the now-obsolete "do not create a second root [slug]"
    comment and replace it with a short note describing this union.
  - Build **`src/pages/about/index.astro`** -- a styled placeholder About page
    (new chrome, H1, a short paragraph, breadcrumb Home -> About, canonical
    `/about/`). Add an `about` route to the registry if needed, or treat it as a
    static page with its own canonical; whichever keeps the link gate happy.
    State your choice in the Work Log.

**Constraints:**
- Stay in this repo; do not touch sibling folders, `CLAUDE.md`, `content-ops/`,
  or the `handoff/` files of other tasks.
- Internal links ONLY through `Link` / `routes` / `url()`. Never hand-type an
  internal href. `/sitemap.xml` and any future asset are plain `<a>`.
- Do NOT change calculator math, the `src/calc/**` engines, `client.ts`, the
  content schemas' existing fields, or any JSON-LD/canonical logic in
  `BaseLayout` / `schema.ts` (you may pass different props, not rewrite the
  helpers).
- Keep it lean: the only new dependencies acceptable are the `@fontsource` font
  packages (and only if you self-host). No UI framework, no CSS-in-JS, no uPlot.
- Preserve the no-flash theme behavior (no light/dark flash on load) and
  `prefers-reduced-motion` / `:focus-visible` handling shown in the mockups.

**Definition of done / how to verify:**
- `npm run build` is green end to end: `gen-route-ids` -> `astro build` ->
  `check-links` reports **0 violations**, and pages now exist for `/about/` and
  all six `/{category}/` hubs (so every header/footer link resolves).
- `npx astro check` passes (the unioned root route and new category ids type
  cleanly).
- `npm test` (vitest) still green -- you changed no engine logic.
- Manual: run `npm run preview`, load `/`, a calculator page, and a category hub.
  Confirm the warm palette + fonts render, the header/footer match the mockup,
  the theme toggle flips with NO flash on reload and persists, and the restyled
  StatCalc still computes a result.
- Fill the Work Log: font approach chosen, the color mechanism chosen (Tailwind
  token-colors vs component-scoped classes), how you resolved the root-route
  union, and the about-route decision.

---

## Work Log  *(Codex writes -- what was actually done)*

- **Started:** 2026-06-16
- **Finished:** 2026-06-16

**What changed (files + where):**
- `package.json`, `package-lock.json` -- added only the approved self-hosted
  font packages: `@fontsource/fraunces`, `@fontsource/hanken-grotesk`, and
  `@fontsource/jetbrains-mono`.
- `src/styles/global.css` -- replaced the slate base with the mockup token
  system on `:root` and `html.dark`, imported Fontsource CSS, and added shared
  classes for chrome, breadcrumbs, page headings, article prose, cards, and the
  StatCalc skin.
- `tailwind.config.cjs` -- mapped `font-serif`, `font-sans`, `font-mono`, and
  the warm palette utilities to CSS variables while keeping `darkMode: 'class'`.
- `src/layouts/BaseLayout.astro` -- rebuilt the sticky mockup-style header,
  mobile menu, no-flash `.dark` theme toggle, 4-column footer, and all internal
  chrome links through `Link`/`routes`. `/sitemap.xml` remains a plain asset
  link.
- `src/lib/links.ts` -- added a typed `about` route so `/about/` links and
  breadcrumbs stay inside the registry.
- `src/content/categories/*.yaml`, `src/lib/content-route-ids.ts` -- seeded the
  five missing category hubs and regenerated route-id types.
- `src/layouts/CategoryLayout.astro`, `src/pages/about/index.astro` -- added the
  placeholder category hub layout and About page with typed breadcrumbs and
  canonical paths.
- `src/pages/[slug]/index.astro` -- changed the root route to union published
  articles and categories, with draft exclusion preserved and a build-time slug
  collision guard.
- `src/components/StatCalc.astro` -- restyled only markup/classes into the
  teal-header embedded calculator card. The JSON config block, `data-*` hooks,
  `aria-live` region, and `client.ts` import were preserved.
- `src/pages/calculators/index.astro`, `src/pages/calculators/[slug]/index.astro`
  -- rethemed calculator pages to the new tokens while preserving functional
  data loading, typed links, breadcrumbs, schema, and `<StatCalc>` usage.
- `src/components/Breadcrumbs.astro`, `src/layouts/ArticleLayout.astro`,
  `src/pages/index.astro`, `src/pages/404.astro` -- small token pass so shared
  pages match the new chrome without implementing TASK-010's homepage/article
  body redesign.

**How to verify:**
- `npx astro check` -- passed with 0 errors, 0 warnings, 0 hints.
- `npm run build` -- passed. Generated `/about/` plus all six category hubs;
  `check-links` scanned 14 pages, checked 387 internal links, and found 0
  violations.
- `npm test` -- initial sandbox run hit expected `spawn EPERM`; approved rerun
  passed 12 test files / 33 tests.
- `npm run preview` -- preview server started at `http://127.0.0.1:4321/`.
  Headless Chrome CDP smoke check verified `/`, `/descriptive-statistics/`,
  `/probability-distributions/`, `/about/`, and
  `/calculators/standard-deviation/`; confirmed Hanken Grotesk rendering, theme
  toggle persistence from stored light to dark, mobile menu open state, and
  StatCalc computation output for sample data.

**Blocked / couldn't do / decisions made:**
- Font approach: self-hosted Fontsource packages, per the preferred TASK-009
  path. `npm install` required the expected network approval.
- Color mechanism: Tailwind token utilities backed by CSS variables, plus small
  component classes that read the same vars. Dark mode remains `html.dark` with
  the existing localStorage/no-flash behavior; no `data-theme` switch was added.
- Root route union: one `src/pages/[slug]/index.astro` now owns both published
  articles and category hubs and throws on any article/category slug collision.
- About route: added a first-class typed `routes.about()` ref so header/footer
  and breadcrumbs remain inside the internal-link registry.
- The in-app Browser surface was unavailable in this session, so preview
  verification used the running `npm run preview` server plus local headless
  Chrome through DevTools Protocol. No project dependency was added for that.
- Existing npm audit output reports vulnerabilities in the dependency tree; left
  unchanged because remediation is outside TASK-009.

---

## Review  *(Claude writes -- accept or send back)*

- **Reviewed:** 2026-06-16
- **Verdict:** CLOSED

**Notes / what to improve:**
- Verified against artifacts, not just the Work Log. All three gates re-run from
  clean: `npm run build` green -- 14 pages built (incl. `/about/` + all six
  `/{category}/` hubs), `check-links` scanned 387 internal links, **0
  violations**; `npx astro check` 0 errors / 0 warnings / 0 hints; `npm test` 33
  tests / 12 files pass.
- Both high-risk contracts hold: (1) `StatCalc.astro` preserves every byte-stable
  hook -- `data-statcalc`, `data-config-id`, `data-statcalc-form`,
  `data-statcalc-results`, `data-statcalc-chart`, the
  `<script type="application/json">` config block, the `aria-live` region, and the
  `import './statcalc/client.ts'` (styling-only change confirmed); (2) the root
  `[slug]` route correctly unions articles (drafts excluded) + categories with a
  discriminated `props.kind`, a build-time slug-collision guard, and the
  forward-compat comment replaced.
- Theme mechanism preserved exactly as required: tokens on `:root` + `html.dark`
  (no `data-theme` adopted), toggle still flips the `.dark` class + persists to
  localStorage via the no-flash script. Tokens match the mockup values verbatim.
- `about` added as a first-class typed `routes.about()` ref -- header/footer/
  breadcrumb links stay inside the registry, gate stays the enforcement mechanism.
- Accepted decisions: self-hosted `@fontsource` packages (only new deps, as the
  brief preferred); Tailwind token-colors backed by CSS vars + small
  component-scoped classes. Pre-existing `npm audit` advisories left untouched
  (out of scope, correct call).
- Non-blocking note for TASK-010: the homepage + ArticleLayout still carry only a
  light token pass (chrome matches, bodies do not) -- exactly the seam left for
  TASK-010, which is now unblocked.
