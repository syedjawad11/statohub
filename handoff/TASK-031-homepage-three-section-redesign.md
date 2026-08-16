Status: DONE
<!-- TODO | IN_PROGRESS | DONE | CHANGES_REQUESTED | CLOSED -->

# TASK-031 -- Homepage three-section redesign

- **Owner of this stage:** Codex
- **Repo:** `Desktop/statohub/` (where the work happens)
- **Created:** 2026-08-16 from the approved Claude restructure plan

---

## Brief  *(approved plan translated into the handoff queue)*

**Goal:** Rebuild the homepage to the supplied mock so it routes visitors among Learn, Calculators, and Applied Statistics, using real collection data and no fabricated Applied articles.

**Context / inputs:**
- `docs/ideas/homepage-redesign-mock-2026-08-16.png` is the visual reference.
- The approved plan locks four Applied categories only. Finance and Economics is mock filler and must not appear.
- Applied articles are intentionally deferred; the four Applied category hubs exist but remain empty.

**Deliverables:**
- [x] Rebuild `src/pages/index.astro`: hero and intent router, Learn/Calculate/Apply trio, five Learn topic cards, four Applied category cards with progressively enhanced filter pills, and popular calculators.
- [x] Derive article and calculator counts from collections; remove all hardcoded inflated counts.
- [x] Update only the homepage-related rules in `src/styles/global.css` for faithful responsive light/dark presentation.
- [x] Cut the newsletter and the three-format concept section. The latter cannot ship truthfully until an Applied article exists.

**Constraints:**
- Four Applied categories only: Data Analysis, Experiments and Causality, Forecasting and Time Series, Machine Learning Statistics.
- No Finance and Economics card, no invented article cards, and no article writing.
- Use typed internal links only and existing tokens only. Keep `html.dark` and existing theme behavior.
- Preserve BaseLayout header/footer ownership from TASK-027.

**Definition of done / how to verify:**
- Desktop and mobile layouts are visually checked, filter buttons work, and JS-disabled output leaves all four Applied cards visible.
- `npx astro check`, `npm test`, `node scripts/check-contrast.mjs`, and `npm run build` pass.

---

## Work Log  *(Codex writes -- what was actually done)*

- **Started:** 2026-08-16
- **Finished:** 2026-08-16

**What changed (files + where):**
- Rebuilt `src/pages/index.astro` around the approved three-path hierarchy: the
  locked hero copy and route finder, Learn / Calculate / Apply pathway row,
  five Learn topic cards, four Applied category hubs, and eight popular
  calculators. Every internal destination uses `Link.astro` and `routes.*`.
- Loaded categories, published articles, and standalone calculators from Astro
  collections. Homepage totals and per-topic guide/tool counts now reflect the
  live content instead of hardcoded marketing numbers.
- Kept Applied limited to Data Analysis, Experiments & Causality, Forecasting &
  Time Series, and Machine Learning Statistics. The section links only to the
  four real empty hubs; it contains no Finance/Economics card or invented
  Applied article.
- Added progressively enhanced Applied filters. The controls are CSS-hidden by
  default, the inline script reveals them by adding `filters-active`, and all
  four cards remain visible and free of `hidden` attributes without JavaScript.
  The active state uses `aria-pressed` and changes are announced through the
  existing live status.
- Added scoped homepage rules in `src/styles/global.css` for responsive desktop
  and mobile grids, token-only light/dark presentation, and the approved path
  semantics: Learn/pine, Calculate/clay, Apply/brass. No design tokens or shared
  chrome rules changed.
- Removed the superseded handbook/recent layout and did not add a newsletter or
  three-format concept section.

**How to verify:**
- `npx astro check` -- 37 files, 0 errors, 0 warnings, 0 hints.
- `npm test` -- the first exact run hit the documented Windows `spawn EPERM`;
  the approved rerun passed 35 files / 121 tests.
- `node scripts/check-contrast.mjs` -- all 21 light/dark token pairs pass.
- `npm run build` -- 116 pages, 4,309 internal links / 0 violations, and 0
  meta-description violations.
- Built-homepage audit -- 5 Learn cards, 4 Applied cards with exactly the
  approved ids, 5 filter buttons, 0 Applied cards hidden in static HTML, 8
  popular calculators, no Finance/Economics, newsletter, or three-format copy,
  and 0 raw internal hrefs in the source. The rendered collection totals are
  73 published guides, 25 calculators, and 4 Applied hubs.
- `git diff --check -- src/pages/index.astro src/styles/global.css` -- clean.

**Blocked / couldn't do / decisions made:**
- Browser visual/click QA could not run: after loading the Browser skill and
  its troubleshooting guidance, the in-app runtime reported no available
  browser instances (`agent.browsers.list()` returned `[]`). No unrelated
  browser backend was substituted. Desktop/mobile breakpoints, light/dark
  colors, filter activation, and the no-JS fallback were verified through
  Astro diagnostics, production CSS/HTML, and source/artifact audits; a real
  screenshot pass remains for the next session with a connected browser.
- No BaseLayout, header/footer, content, component, or Applied-layout files were
  modified for this task. Parallel TASK-030/032/033 edits were preserved.

---

## Review  *(Claude writes -- accept or send back)*

- **Reviewed:**
- **Verdict:**

**Notes / what to improve:**
- pending
