Status: CLOSED
<!-- TODO | IN_PROGRESS | DONE | CHANGES_REQUESTED | CLOSED -->

# TASK-020 -- Theme refresh: home + article views

- **Owner of this stage:** Codex
- **Repo:** `Desktop/statohub/` (where the work happens)
- **Created:** 2026-06-27 by Claude

<!-- Authoring note (Claude): keep this file plain ASCII. Use `--` not an em
dash, `->` not an arrow, `...` not an ellipsis. Copy any special glyphs (drop
cap, section marker, divider SVG, hero figure SVG) STRAIGHT FROM the mockup
file so encoding stays correct. -->

---

## Brief  *(Claude writes -- what Codex needs to execute)*

**Goal:** Restyle the HOME page and the ARTICLE layout to match the new theme in
`statohub-theme-preview.html`. Prerequisite: TASK-019 (tokens + fonts + chrome)
is CLOSED. Port the mockup's "HOME" view and "ARTICLE" view faithfully,
including the flourishes (hero distribution figure, SVG divider, drop cap,
section markers on H2, note callouts, styled data tables, the fused in-post
calculator, and the sticky TOC).

This is a RESTYLE + markup-port. Keep all routes, content, typed links,
headings/TOC data flow, and the StatCalc DOM contract intact.

**Context / inputs:**
- **Visual spec (authoritative):** `statohub-theme-preview.html` (repo root):
  - HOME view = `<section id="view-home">` (mockup lines ~281-389): `.hero`
    (text column + `.hero-fig` SVG normal-distribution figure + `.wedge-chips`),
    `.section-head`, `.catalog` of `.cat` cards (6 categories with icon, title,
    blurb, `<b>` counts), the `.band` calculators feature (with `.tool-grid` of
    `.tool` chips), and `.pub-list` "Recently published" of `.pub` cards.
  - ARTICLE view = `<section id="view-article">` (mockup lines ~391-486):
    `.crumb` breadcrumb, `.article-grid` (article column + `.aside` TOC),
    `.article-head` (`.eyebrow` with `.pill` + `.sep` dots, `.article-title`,
    `.meta-row` with inline SVG icons), the `.divider` SVG, `.article-body`
    with `.lead`+`.drop` drop cap, `h2` carrying the `::before` section marker,
    `.note` callout, `table.dt` data table, the `.fuse` fused teach->compute
    card, and `.related` grid; the `.aside` holds `.toc` (sticky, scroll-spy)
    + `.aside-tool`. The mockup's CSS for all these classes is in its `<style>`
    block -- copy values from there.
- **Files you will touch:**
  - `src/pages/index.astro` -- home markup.
  - `src/layouts/ArticleLayout.astro` -- article shell, header, TOC, related,
    reading-progress (already present -- keep it; restyle).
  - `src/styles/global.css` -- add/replace the home + article component classes
    to match the mockup. You may rename the existing classes to the mockup's
    names (`.hero`, `.cat`, `.band`, `.tool`, `.pub`, `.article-grid`, `.lead`,
    `.note`, `.fuse`, `.toc`, etc.) as long as every consumer is updated.
  - Possibly `src/layouts/CategoryLayout.astro` -- if it reuses the old
    `.related-card` look, align its cards to the new `.cat` / card style so
    category hubs stay coherent (light touch; do not change its data/logic).

**Critical contracts to PRESERVE (do not break):**
1. **The fused in-post calculator must embed the REAL StatCalc**, exactly as the
   home/article do today -- NOT the mockup's hand-written `compute()` JS. The
   mockup's `.fuse-compute` shows a demo frequency-table engine; replace that
   demo with `<StatCalc slug="..." variant="embed" />` styled to sit inside the
   `.fuse` card. Do NOT copy the mockup's `<script>` calculator engine or its
   `data-calc`/`data-clear` wiring. Keep StatCalc's byte-stable hooks untouched
   (the component renders them; you only wrap/skin around it).
2. **TOC + scroll-spy + reading-progress** stay driven by the real
   `entry.render().headings` (depth === 2) that ArticleLayout already receives
   -- do NOT hardcode the mockup's static `#a1..#a4` list. Restyle the existing
   sticky TOC + IntersectionObserver scroll-spy + progress bar to the mockup
   `.toc` / `.reading-progress` look. Keep them vanilla, passive, and
   `prefers-reduced-motion`-safe.
3. **Breadcrumb** stays Home -> Category -> Title with the category crumb a real
   typed `categoryHub(...)` link (as today). Restyle to the `.crumb` look.
4. All internal links remain typed `<Link>` / `routes` / `url()`. Never emit a
   raw `<a>` to an internal page (the `check-links` gate fails those). The
   mockup's `data-go` view-router anchors are mockup-only -- do not port them;
   use real links.
5. Single `<h1>` per page (the article title; home hero H1). The mockup's H2s
   carry a decorative `::before` section marker via CSS `content` -- that is
   presentational only and does not add a heading.

**Home-specific decisions (locked):**
- The mockup HOME hero uses the static `.hero-fig` SVG distribution figure and
  does NOT embed a live calculator (unlike the current homepage, which embeds a
  real StandardDeviation StatCalc). Per the faithful-port decision, adopt the
  mockup: hero = text column + `.hero-fig` SVG + `.wedge-chips`. The live
  "calculator on the same page" wedge is demonstrated in the ARTICLE view's
  `.fuse` card and on the calculator pages, so it is not lost. (If Claude's
  review flags that the homepage should retain one live embed, that is a small
  follow-up -- build the mockup home as specified first.)
- The `.catalog` cards link to real `categoryHub(id)` routes; the Calculators
  card links to `calculatorsHub()`. Counts (guides/tools `<b>` numbers) may stay
  static for now (match the current homepage's approach).
- The `.band` "tool" chips and `.pub-list` "Recently published" cards must link
  only to pages that actually exist (typed links). Use real published calculators
  / articles -- do not invent slugs. If unsure which to feature, reuse the set
  the current homepage already features.

**Constraints:**
- Stay in this repo; don't touch sibling folders. Do not edit `CLAUDE.md`.
- No new dependencies. Vanilla `is:inline` / module scripts only; passive
  listeners; honor `prefers-reduced-motion`.
- Do not touch `src/components/StatCalc.astro`, `statcalc/client.ts`, routes,
  content collections, or `src/lib/links.ts`.
- Reuse `BaseLayout` for head/SEO/JSON-LD (do not hand-roll meta).

**Definition of done / how to verify:**
- `npx astro check` -> 0/0/0; `npm test` green; `npm run build` ->
  `check-links` **0 violations**.
- `npm run preview`:
  - `/` renders the new hero (with the `.hero-fig` figure + wedge chips), the
    6-card catalog, the calculators band, and recently-published -- all links
    resolve to real pages; dark mode flips cleanly.
  - A built article (e.g. `/frequency-table/`) renders the new article view:
    breadcrumb, eyebrow+pill, drop-cap lead, section-marked H2s, a note callout
    and a data table where the content has them, the fused card embedding the
    REAL StatCalc (it computes), the sticky TOC built from the article's own H2s
    with working scroll-spy, the reading-progress bar, and the related grid.
- Confirm the fused card's calculator is the real `<StatCalc>` (inspect for the
  `data-statcalc` / `data-config-id` hooks + the JSON config block), not the
  mockup demo JS.

---

## Work Log  *(Codex writes -- what was actually done)*

- **Started:** 2026-06-27
- **Finished:** 2026-06-27

**What changed (files + where):**
- `src/pages/index.astro` -- replaced the old homepage with the mockup-style hero, distribution SVG figure, wedge chips, six-card catalog, calculator band, and recently published list. All internal links use typed `Link`/`routes`; the old homepage live StatCalc embed was removed per the TASK-020 brief.
- `src/layouts/ArticleLayout.astro` -- restyled the dynamic article shell to the mockup structure: breadcrumb `.crumb`, article grid, eyebrow/pill header, meta row with inline icons, SVG divider, sticky TOC list, aside calculator jump card, and related grid. The TOC and reading progress remain driven by real rendered headings and the existing vanilla script.
- `src/styles/global.css` -- added/overrode home and article component classes for `.hero`, `.hero-fig`, `.catalog`, `.cat`, `.band`, `.tool`, `.pub-list`, `.crumb`, `.article-grid`, `.article-body`, section-marker H2s, drop-cap first paragraph, table/callout styling, StatCalc-in-article card styling, `.toc`, `.aside-tool`, and responsive behavior.

**How to verify:**
- `npx astro check` -- 0 errors / 0 warnings / 0 hints.
- `npm test` -- 33 test files passed, 89 tests passed.
- `npm run build` -- succeeded; `check-links` scanned 56 pages / 2056 internal links / 0 violations.
- Built HTML checks confirmed `/` includes `hero`, `hero-fig`, `catalog`, `band`, `pub-list`, and typed slash links to real pages.
- Built HTML checks confirmed `/frequency-table/` includes `crumb`, `article-grid article-shell`, `divider article-divider`, `article-toc`, the real `data-statcalc` / `data-config-id` / `data-statcalc-results` embed, and the related section.
- Local preview responded 200 at `/frequency-table/`.
- `rg -n "data-go" src/pages/index.astro src/layouts/ArticleLayout.astro` -- no matches.

**Blocked / couldn't do / decisions made:**
- The in-app browser was unavailable (`agent.browsers.list()` returned `[]`), so visual verification used build output and local preview HTTP checks rather than screenshots.
- The article fused calculator uses the existing real MDX `<StatCalc>` embed and skins it in-place; no mockup calculator JS was copied.
---

## Review  *(Claude writes -- accept or send back)*

- **Reviewed:** 2026-06-27
- **Verdict:** CLOSED

**Notes / what to improve:**
- Verified against built HTML. Homepage carries the new hero/catalog/band/recent
  layout and -- per the locked decision -- NO live StatCalc (`data-statcalc`
  count = 0 in `dist/index.html`); the static hero figure replaces it.
- Article `.fuse` card embeds the REAL StatCalc: `dist/frequency-table/index.html`
  contains `data-statcalc`, `data-config-id`, `data-statcalc-results`, and the
  `application/json` config block -- not the mockup's demo `compute()` JS.
- No `data-go` mockup router anchors in `index.astro`/`ArticleLayout.astro`; all
  internal links typed. No `data-theme` leakage.
- Gates green: astro check 0/0/0, npm test 89/89, build 56 pages / 0 link
  violations.
