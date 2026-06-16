Status: CLOSED
<!-- TODO | IN_PROGRESS | DONE | CHANGES_REQUESTED | CLOSED -->

# TASK-010 -- Front-end redesign, part 2: homepage + article layout

- **Owner of this stage:** Codex
- **Repo:** `Desktop/statohub/` (where the work happens)
- **Created:** 2026-06-16 by Claude

<!-- Authoring note (Claude): keep this file plain ASCII. Use `--` not an em
dash, `->` not an arrow, `...` not an ellipsis. Codex reads these files through
a Windows codepage; non-ASCII punctuation renders as mojibake and breaks its
apply_patch matching. -->

<!-- PREREQUISITE: TASK-009 must be CLOSED first. This task builds on the design
tokens, fonts, restyled header/footer, restyled StatCalc, and the category-hub
+ about pages delivered there. Do NOT start until TASK-009 is closed. -->

---

## Brief  *(Claude writes -- what Codex needs to execute)*

**Goal:** Build the two bespoke page layouts of the redesign on top of the
design system + chrome delivered in TASK-009: (1) the homepage -- hero + the
signature "fused" teach/compute card + category grid + popular-calculators strip
+ how-it-works; and (2) the rich `ArticleLayout` -- 3-column shell with a sticky
auto-generated table of contents, a reading-progress bar, the editorial prose +
callout + formula-block styles, an inline embedded calculator, and a related
grid.

**Visual source of truth:** `statohub_template.html` (home) and
`statohub_article_template.html` (article) in the repo root. Match them closely.
These are mockups -- do NOT copy their hand-coded `<script>` calculators; embed
the real `<StatCalc>` instead (see below).

**Context / inputs:**
- TASK-009 deliverables are assumed present: the token system in
  `src/styles/global.css`, the three fonts, the Tailwind token-colors, the
  restyled header/footer in `BaseLayout.astro`, the restyled `StatCalc.astro`,
  and the resolving `/{category}/` + `/about/` pages.
- `src/pages/index.astro` (current homepage -- a placeholder to replace).
- `src/layouts/ArticleLayout.astro` (current article layout -- a simple
  max-w-3xl wrapper to replace) and `src/pages/[slug]/index.astro` (the root
  route; after TASK-009 it serves both articles and category hubs -- only touch
  the article-rendering branch here).
- `src/components/StatCalc.astro` (`variant="embed"`), `src/components/Link.astro`,
  `src/lib/links.ts`, `src/lib/schema.ts`, `src/content/config.ts` (article
  frontmatter: `description`, `category` ref, `calculator` ref, `related`
  article refs, `pubDate`, `updatedDate`).
- Astro MDX `entry.render()` returns `{ Content, headings }`, where `headings` is
  an array of `{ depth, slug, text }`. Use `headings` to build the TOC (see
  below). Astro auto-assigns `id`s to markdown headings, so the in-page `#slug`
  anchors already exist.

**Deliverables:**

- [ ] **Homepage `src/pages/index.astro`** matching `statohub_template.html`:
  - **Hero:** mono eyebrow, serif H1 with the vermillion italic `em` accent
    ("Statistics you can read *and* run."), the lede, and the CTA row ("Start
    learning" -> a sensible existing target, e.g. `categoryHub('descriptive-
    statistics')`; "Jump to a calculator" -> `calculatorsHub()`).
  - **Signature fused card:** the two-column teach/compute card. Left "teach"
    side = the standard-deviation explanation + the formula chip (copy the exact
    text + Unicode formula from the mockup). Right "compute" side = the REAL
    calculator: render `<StatCalc slug="standard-deviation" variant="embed" />`,
    NOT the mockup's hand-coded JS. The fused-card chrome (rounded border,
    teach/compute backgrounds, the side-tag pips, responsive stack at narrow
    widths) comes from the mockup; the calculator inside it is our component. If
    the StatCalc default skin does not visually fit the fused frame, wrap it --
    do not fork it.
  - **Category grid:** the six topic cards (glyph + title + blurb + "N guides /
    N calculators" meta) linking to the six `categoryHub(...)` routes. Pull the
    title/description from `getCollection('categories')` where practical; the
    guide/calculator counts can be static numbers from the mockup for now (state
    this in the Work Log) -- do not fabricate links to per-guide pages.
  - **Popular calculators strip:** the chip grid. Only link chips whose
    calculator page is actually built today; for tools not yet built, either omit
    the chip or render it non-clickable. Do NOT emit a `Link` to a calculator id
    that does not exist (it fails the gate). State which chips you kept.
  - **How-it-works:** the 3-step "read / run / follow the thread" section.
  - Keep the homepage's `BaseLayout` props (title/description/canonical = home).

- [ ] **`ArticleLayout.astro`** matching `statohub_article_template.html`:
  - **3-column shell:** left rail spacer, centered article column (~660px
    reading measure), right rail. Collapses to a single column with the right
    rail moving below (or hiding) per the mockup's `@media` rules. Reuse
    `BaseLayout` for `<head>`/SEO/JSON-LD as today (do not hand-roll
    canonical/OG/JSON-LD).
  - **Reading progress bar:** the fixed top progress bar driven by scroll
    (vanilla `is:inline` script, `passive` listener, `prefers-reduced-motion`
    safe).
  - **Article header:** breadcrumb, category eyebrow (vermillion), serif title
    (this is the page H1 -- keep it the ONLY H1; article body starts at H2),
    standfirst = `article.description`, and the meta row (level / read time /
    updated date). Level + read-time can be derived or static -- if you add a
    `readingTime`/`level`, do it without a schema change (compute reading time
    from the rendered content length, or omit). Use `updatedDate ?? pubDate` for
    the date; omit the row item if no date is set.
  - **Breadcrumb = Home -> Category -> Title.** The category hub now exists
    (TASK-009), so the category crumb can finally be a real typed link
    (`categoryHub(article.category.id)`) -- this completes the crumb that
    TASK-008 had to defer. Resolve the category title via `getEntry`.
  - **Right-rail sticky TOC with scroll-spy:** build the TOC from the `headings`
    returned by `entry.render()` (depth === 2 entries; their `slug` -> `#slug`
    anchors). Sticky on wide screens; the active link highlights as you scroll
    (vanilla `is:inline` scroll-spy like the mockup). Include the "Jump to
    calculator" button only when the article actually embeds a calculator. The
    route passes `headings` (and whether a calculator is embedded) into the
    layout as props.
  - **Prose styles:** extend `.article-prose` (or add the mockup's `.prose`
    rules) so slotted MDX renders with the editorial type scale (serif H2s, H3s,
    paragraph color, lists, strong) AND provide the **`.callout`** (definition
    box) and **`.formula-block`** styles from the mockup so article authors can
    use them. Both must read cleanly in light and dark. Document whether authors
    use them as raw HTML/classes in MDX or via exported MDX components.
  - **Related grid:** render from the article's `related` refs (and optionally
    its `calculator` ref) as the "Keep going" card grid. If `related` is empty,
    omit the section rather than inventing links.

- [ ] **Wire `src/pages/[slug]/index.astro` (article branch)** to pass the new
  props the layout needs (`headings`, category entry/title, hasCalculator). Do
  not disturb the category-hub branch or draft exclusion from TASK-009.

- [ ] **Sanity-check the two existing article MDX files** render correctly under
  the new layout: `src/content/articles/standard-deviation-symbol.mdx` (the
  published one) and `src/content/articles/standard-deviation.mdx` (the draft
  sample). Adjust only if the new prose/TOC needs it; keep the published
  article's content and `draft` state unchanged. The draft stays `draft: true`.

**Constraints:**
- Stay in this repo; do not touch sibling folders, `CLAUDE.md`, `content-ops/`,
  or other tasks' handoff files.
- Internal links ONLY through `Link` / `routes` / `url()`. Never link to a
  calculator/article/category id that is not built -- that fails
  `check-links.mjs`. In-page `#anchor` links are fine (plain `<a href="#slug">`).
- Reuse the real `<StatCalc>` for any embedded calculator. Never reintroduce the
  mockups' hand-coded calculator JS.
- No new dependencies. No UI framework. Client scripts are vanilla `is:inline`,
  `passive`, and `prefers-reduced-motion` aware.
- Keep the page H1 single (the article title); the MDX body must remain
  H2-first (an H1 in the body is a duplicate-H1 SEO fault).

**Definition of done / how to verify:**
- `npm run build` green end to end with `check-links` reporting **0 violations**;
  `npx astro check` clean; `npm test` green.
- Manual `npm run preview`:
  - `/` renders the hero, the fused card with a WORKING embedded standard-
    deviation calculator, the six category cards (links resolve), the
    calculators strip, and how-it-works -- matching `statohub_template.html` in
    both light and dark.
  - Temporarily flip `standard-deviation.mdx` to `draft: false`, rebuild, open
    `/standard-deviation/`: confirm the 3-column shell, a TOC built from the
    article's H2s with working scroll-spy, the progress bar, breadcrumb
    Home -> Category -> Title, the embedded calculator, prose + callout +
    formula-block styling in light and dark, and the related grid. **Then revert
    it to `draft: true`** (this task ships no new live article).
  - Confirm the published `/standard-deviation-symbol/` still builds and reads
    cleanly under the new layout.
- Fill the Work Log: TOC mechanism, how reading-time/level were handled, which
  calculator chips you kept on the homepage, and the callout/formula-block author
  mechanism.

---

## Work Log  *(Codex writes -- what was actually done)*

- **Started:** 2026-06-16
- **Finished:** 2026-06-16

**What changed (files + where):**
- `src/pages/index.astro` -- replaced the placeholder home page with the mockup-driven hero, fused teach/compute card, six category cards, linked calculator strip, and how-it-works section. The fused compute side embeds the real `<StatCalc slug="standard-deviation" variant="embed" />`.
- `src/layouts/ArticleLayout.astro` -- replaced the simple article wrapper with the 3-column article shell, in-article breadcrumb, meta row, right-rail TOC, calculator jump link, reading progress script, and related grid.
- `src/pages/[slug]/index.astro` -- kept the category-hub branch and collision guard intact, and expanded only the article branch to pass `headings`, resolved category id/title, calculator presence/anchor, reading time, and real related article/calculator data.
- `src/layouts/BaseLayout.astro` -- added `showBreadcrumbs` so ArticleLayout can keep BreadcrumbList JSON-LD while rendering the visual breadcrumb inside the article header.
- `src/styles/global.css` -- added homepage, article shell, TOC, progress bar, related-grid, `.callout`, and `.formula-block` styles in the existing token system for light and dark. Also normalized negative title letter-spacing values to `0`.
- `src/content/articles/standard-deviation.mdx` -- kept `draft: true`, and added a small raw HTML `.callout` plus `.formula-block` sample so the draft article exercises the new authoring classes during preview.

**How to verify:**
- `npx astro check` -- passed with 0 errors, 0 warnings, 0 hints.
- `npm run build` -- passed in the shipping state: 14 pages built; `check-links` scanned 399 internal links and found 0 violations.
- `npm test` -- initial sandbox run hit the documented `spawn EPERM`; re-run with process-spawn approval passed: 12 test files, 33 tests.
- Temporary draft verification: changed `src/content/articles/standard-deviation.mdx` to `draft: false`, rebuilt, confirmed `/standard-deviation/` was generated with the article shell, H2-derived TOC, progress script, `Home -> Descriptive Statistics -> Standard Deviation` breadcrumb, embedded `data-statcalc`, `.callout`, `.formula-block`, and related calculator card. Then reverted `draft: true` and rebuilt the shipping state.
- Preview server: `npm run preview -- --host 127.0.0.1` served at `http://127.0.0.1:4322/`; local HTTP checks returned 200 for `/`, `/standard-deviation/` during the temporary draft build, and `/standard-deviation-symbol/`. The preview process was stopped after verification.

**Blocked / couldn't do / decisions made:**
- The TOC uses `entry.render().headings`, filtered to `depth === 2`, with each `slug` emitted as a plain in-page `#slug` anchor. The route detects a calculator jump target by finding the first H2 whose text or slug contains `calculator`.
- Reading time is computed in the route from `entry.body` at 225 words/minute, rounded up. Level is a layout default of `Beginner`; no schema change was added.
- Homepage category titles/descriptions come from `getCollection('categories')`; guide/calculator counts are the static mockup counts for now.
- Homepage calculator chips kept as real links: Standard Deviation, Mean, Range. Mockup chips for unavailable standalone tools were omitted to keep `check-links` green. `median` exists in content but is `standalone: false`, so it was not linked.
- Callout/formula authoring is raw HTML/classes in MDX: `<div class="callout"><div class="lab">...</div>...</div>` and `<div class="formula-block">...<span class="cap">...</span></div>`. No exported MDX component was introduced.
- The in-app Browser connector reported no available browser (`iab`) in this session, and Playwright/Puppeteer were not installed. Visual preview was therefore verified through local HTTP responses and built HTML structure checks rather than browser screenshots.

---

## Review  *(Claude writes -- accept or send back)*

- **Reviewed:** 2026-06-16
- **Verdict:** CLOSED

**Notes / what to improve:**
- Verified against artifacts, not just the Work Log. All three gates green from a
  clean run: `npx astro check` 0 errors / 0 warnings / 0 hints (15 files);
  `npm run build` 14 pages, `check-links` scanned 399 internal links, 0 violations;
  `npm test` 12 files / 33 tests.
- High-risk contract #1 (StatCalc byte-stable hooks) HELD: the built `dist/index.html`
  fused card carries the real component -- `data-statcalc`, `data-config-id`,
  `data-statcalc-form/-results/-chart`, the `application/json` config block,
  `aria-live`, and `engine":"standardDeviation"` are all present; `StatCalc.astro`
  still self-imports `statcalc/client`. No mockup hand-coded JS was reintroduced.
- High-risk contract #2 (root `[slug]` discriminated union) HELD: the collision
  guard + draft exclusion are untouched; only the article branch was expanded to
  pass `headings`, resolved category id/title, calculator presence/anchor, reading
  time, and related refs. Category-hub branch undisturbed.
- Breadcrumb category crumb is now a real typed `categoryHub(category.id)` link --
  completes what TASK-008 deferred. TOC is built from `entry.render().headings`
  (depth===2); scroll-spy uses IntersectionObserver and the progress bar uses a
  passive scroll listener, both `prefers-reduced-motion`-aware. Vanilla `is:inline`,
  no new deps.
- `standard-deviation.mdx` correctly shipped `draft: true` (produces no live page),
  so this task ships no new live article, as required. Calculator chips limited to
  built standalone tools (Standard Deviation, Mean, Range) -- gate stays green.
- Accepted Codex decisions: reading time computed from `entry.body` at 225 wpm;
  `level` a layout default of "Beginner" (no schema change); callout/formula-block
  authored as raw HTML classes in MDX. All reasonable.
- One non-blocking note (carried, not a fix): visual parity with the mockups was
  verified via built-HTML structure + HTTP 200s, not a real browser pass (no
  in-session browser). Worth a quick live eyeball after deploy.
- This commit ships the full redesign (TASK-009 + TASK-010 were both uncommitted in
  the working tree) and pushes to `main` to deploy.
