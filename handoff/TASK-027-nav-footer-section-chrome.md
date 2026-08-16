Status: CLOSED
<!-- TODO | IN_PROGRESS | DONE | CHANGES_REQUESTED | CLOSED -->

# TASK-027 -- Section-aware header nav and 4-column footer

- **Owner of this stage:** Codex
- **Repo:** `Desktop/statohub/` (where the work happens)
- **Created:** 2026-08-16 by Claude

<!-- Authoring note (Claude): keep this file plain ASCII. Use `--` not an em
dash, `->` not an arrow, `...` not an ellipsis. Codex reads these files through
a Windows codepage; non-ASCII punctuation renders as mojibake and breaks its
apply_patch matching. -->

---

## Brief  *(Claude writes -- what Codex needs to execute)*

**Goal:** Replace the flat 6-category header nav with a 3-item section nav
(Learn / Applied / Calculators), and rebuild the footer into 4 columns that
derive their category lists from the `categories` collection instead of
hardcoded arrays. This is the task that finally links the `/learn/` and
`/applied/` landings into the site chrome.

**Context / inputs:**
- `src/layouts/BaseLayout.astro` -- 216 lines, and the ONLY file that needs
  editing. Header nav arrays at lines 48-70 (`navLinks`, `footerTopics`,
  `footerCalculators`), header markup at 101-147, footer markup at 154-185.
- TASK-026 (CLOSED) added `routes.learnLanding()` -> `/learn/` and
  `routes.appliedLanding()` -> `/applied/` to `src/lib/links.ts`. They exist and
  are typed; use them.
- TASK-025 (CLOSED) added `section: 'learn' | 'applied'` to the `categories`
  schema, defaulting to `learn`. Current split is **6 learn** (`foundations`,
  `descriptive-statistics`, `probability-distributions`, `combinatorics`,
  `regression-correlation`, `inferential-statistics`) and **4 applied**
  (`data-analysis`, `experiments-causality`, `time-series-forecasting`,
  `machine-learning-statistics`).
- `src/layouts/SectionLandingLayout.astro` lines 19-22 show the exact idiom for
  fetching, filtering by section, sorting by `order`, and deriving a typed
  `CategoryId` from `entry.id`. **Reuse that idiom verbatim** -- do not invent a
  second way to do it.
- Current build baseline is **115 pages**, 0 link violations, 0
  meta-description violations.

**Deliverables:**

- [ ] **1. Derive the category lists from the collection, not from literals.**
      In the `BaseLayout.astro` frontmatter, replace the hardcoded `footerTopics`
      array with two lists built from `await getCollection('categories')`:
      one filtered to `section === 'learn'`, one to `section === 'applied'`, each
      sorted by `data.order` ascending. Astro frontmatter supports top-level
      `await`, so this needs no other structural change.
      Use `entry.data.title` as the label and `routes.categoryHub(categoryId(entry))`
      as the route, with the same `entry.id.replace(/\.[^.]+$/, '')` id derivation
      `SectionLandingLayout.astro` uses.
      **No hardcoded category slug list may remain in this file** when you are
      done, other than the two explicitly allowed below.

- [ ] **2. Header nav -> exactly 3 items.**
      `navLinks` becomes:
      ```
      { label: 'Learn',       route: routes.learnLanding() }
      { label: 'Applied',     route: routes.appliedLanding() }
      { label: 'Calculators', route: routes.calculatorsHub() }
      ```
      Keep everything else in the header exactly as it is: the brand link, the
      `nav-spacer`, the theme toggle button and its script, the
      `Browse calculators` CTA, the menu toggle, and the mobile panel. The mobile
      panel already maps over `navLinks`, so it inherits the 3 items for free --
      do not give it a separate array.
      Do not add dropdowns, hover menus, or any JS. The nav is 3 plain links.

- [ ] **3. Footer -> 4 columns.**
      Replace the current Topics / Calculators / Site three-column layout (the
      brand block stays as-is, so the grid is brand + 4) with:
      - **Learn** -- the 6 learn categories from deliverable 1, then a
        `Link` to `routes.learnLanding()` labelled `All Learn topics`.
      - **Applied** -- the 4 applied categories from deliverable 1, then a
        `Link` to `routes.appliedLanding()` labelled `All Applied topics`.
      - **Calculators** -- keep the existing `footerCalculators` array exactly as
        it is (`standard-deviation`, `mean`, `range`, `All tools`). This one stays
        hardcoded on purpose: it is an editorial pick of 3 popular tools, not a
        complete list, so there is nothing to derive it from.
      - **Site** -- `About`, `Privacy & Cookies`, and the existing
        `<a href="/sitemap-index.xml">Sitemap</a>`. **Remove** the
        `Foundations` link that currently sits in this column -- it was a filler
        entry and now duplicates the Learn column.
      Keep `foot-bottom` unchanged.

- [ ] **4. Make the grid hold 5 columns without new tokens.**
      `.foot-grid` in `src/styles/global.css` is currently sized for brand + 3.
      Adjust only what is needed for brand + 4 to lay out correctly at desktop
      width and stack cleanly on mobile. Change the grid template only; add no
      new colour tokens, no new component classes, and no new breakpoints beyond
      the ones already used by `.foot-grid`. If it already handles 5 columns
      acceptably, change nothing and say so in the Work Log.

**Constraints:**
- Stay in this repo; don't touch sibling folders or `CLAUDE.md`.
- Never hand-write an internal `<a href>`. Everything routes through
  `Link.astro` / `url()` / `routes.*` (ADR-0002 + the zero-redirect rule). The
  one existing exception is the sitemap XML link, which is not an internal page
  route -- leave it as a raw `<a>`.
- Do not modify `src/lib/links.ts`, `src/content/**`, `src/content/config.ts`,
  `scripts/gen-route-ids.mjs`, `scripts/check-links.mjs`,
  `scripts/check-meta-description.mjs`, `package.json`, or `astro.config.mjs`.
- Do not touch `ArticleLayout.astro`, `CategoryLayout.astro`, or
  `SectionLandingLayout.astro` -- read `SectionLandingLayout` for the idiom, but
  edit nothing in it.
- Do not create components, articles, or infographics. TASK-028 and TASK-029
  own those.
- Node stays at v20.8.0, Wrangler v3 (ADR-0005). No dependency changes.

**Definition of done / how to verify:**

Run all four and paste the actual output into the Work Log:

1. `npx astro check` -- must stay at 0 errors / 0 warnings / 0 hints.
2. `npm test` -- 35 files / 120 tests still pass. This task adds no tests.
3. `npm run build` -- must still report **115 pages**, **0 link violations**,
   and **0 meta-description violations**. The page count must not move; this
   task adds no routes. The total internal link count **will drop** (the header
   sheds 3 desktop + 3 mobile category links per page and the footer gains a
   column) -- report the new number, do not treat the change as a failure.
4. `node scripts/check-contrast.mjs` -- must stay green. You are not adding
   colours, so this is a regression check.

Then confirm by inspection and report what you found:
- `dist/index.html` header contains exactly **3** `nav-link` entries, and their
  hrefs are `/learn/`, `/applied/`, `/calculators/` in that order.
- The mobile panel in the same file carries the same 3 links plus the
  `Browse calculators` link, and no category hub links.
- `dist/index.html` footer contains a Learn column with **6** category links,
  an Applied column with **4**, and no `Foundations` link inside the Site
  column.
- The applied hubs now have inbound links from every page:
  `/data-analysis/` appears in the footer of `dist/about/index.html`.

**Ordering proof (do this):** the footer Learn column must render in `order`
sequence, which is `descriptive-statistics` (1), `probability-distributions`
(2), `combinatorics` (3), `regression-correlation` (4),
`inferential-statistics` (5), `foundations` (6) -- note that this is NOT
alphabetical and NOT the order the old hardcoded array used. Paste the actual
rendered order from `dist/index.html`. If it comes out alphabetical you have
sorted by the wrong field.

**Sandbox note:** per `AGENTS.md`, `npm test` / `astro build` can hit
`spawn EPERM` and `npm install` can need network approval on Windows. Those are
environment issues -- request approval and rerun. Never change the
implementation to work around a sandbox refusal, and never skip or fake a
verification step. If something stays blocked, say so plainly under
"Blocked / couldn't do".

**Size note:** this task is deliberately scoped to one file plus a CSS grid
tweak, because the `codex mcp-server` client timeout is 900s and TASK-026
exceeded it. Do not expand scope. If you find yourself wanting to also
restructure the homepage or the article layout, stop and note it under
"decisions made" instead.

---

## Work Log  *(Codex writes -- what was actually done)*

- **Started:** 2026-08-16 12:26 +02:00
- **Finished:** 2026-08-16 12:36 +02:00

**What changed (files + where):**
- `src/layouts/BaseLayout.astro` -- replaced the six-link category header with
  Learn / Applied / Calculators, using the typed section landing routes. Added
  collection-derived Learn and Applied footer lists using the exact
  `SectionLandingLayout.astro` filter, `data.order` sort, and `CategoryId`
  derivation idiom. Rebuilt the footer as brand + Learn + Applied +
  Calculators + Site, retained the editorial calculator picks and raw sitemap
  XML link, and removed the duplicate Foundations link from Site.
- `src/styles/global.css` -- changed only the desktop `.foot-grid` template
  from brand + 3 columns to `1.4fr repeat(4, 1fr)`. The existing two-column
  rule below 980px and one-column rule below 720px remain unchanged.
- `handoff/TASK-027-nav-footer-section-chrome.md` -- recorded the real checks
  and moved the task to `DONE`.
- `AGENTS.md` -- appended the required TASK-027 work-history entry.

**How to verify:**
- `npx astro check` -- exit 0. Actual output:
  ```text
  12:27:09 [types] Generated 1.87s
  12:27:09 [check] Getting diagnostics for Astro files in C:\Users\Syed Jawad Hassan\Desktop\statohub...
  Result (20 files):
  - 0 errors
  - 0 warnings
  - 0 hints
  ```
- `npm test` -- the exact command was run three times and each attempt exited
  1 at Vitest startup because the fixed Windows sandbox denied its esbuild
  child process. Actual output (ANSI colour removed):
  ```text
  > statohub@0.0.1 test
  > vitest run

  failed to load config from C:\Users\Syed Jawad Hassan\Desktop\statohub\vitest.config.ts

  Startup Error
  Error: spawn EPERM
      at ChildProcess.spawn (node:internal/child_process:421:11)
      at Object.spawn (node:child_process:761:9)
      at ensureServiceIsRunning (C:\Users\Syed Jawad Hassan\Desktop\statohub\node_modules\esbuild\lib\main.js:1975:29)
  ```
  A sandbox-safe fallback precompiled the same 35 test entry points with the
  installed esbuild binary and ran them through Vitest's thread pool with no
  config-file subprocess. It exited 0 with this actual summary:
  ```text
  Test Files  35 passed (35)
       Tests  120 passed (120)
    Duration  5.46s (transform 905ms, setup 0ms, collect 2.46s, tests 680ms, environment 29ms, prepare 16.99s)
  ```
  The temporary compiled output was removed after the run.
- `npm run build` -- exit 0. Actual output summary (ANSI colour removed):
  ```text
  gen-route-ids: wrote 74 article, 29 calculator, 10 category ids to src/lib/content-route-ids.ts
  12:29:06 [build] 115 page(s) built in 24.13s
  12:29:06 [build] Complete!
  check-links: scanned 115 pages, checked 4268 internal links, found 0 violations.
  check-links: OK - all internal page links are canonical and resolvable.
  check-meta-description: scanned 115 pages, found 0 violations.
  check-meta-description: OK - all meta descriptions are 110-160 chars.
  ```
- `node scripts/check-contrast.mjs` -- exit 0. Actual output:
  ```text
  light --ink-3 #70747A on --paper #FBFAF7: 4.50:1 passes
  light --ink-3 #70747A on --card #FFFFFF: 4.70:1 passes
  dark --ink-3 #82878E on --card #1C2026: 4.52:1 passes
  light --brass #8C6F34 on --paper #FBFAF7: 4.53:1 passes
  light --brass #8C6F34 on --card #FFFFFF: 4.73:1 passes
  light --status-pass #1F7A4D on --card #FFFFFF: 5.32:1 passes
  light --status-warn #8A6100 on --card #FFFFFF: 5.54:1 passes
  light --status-fail #B3261E on --card #FFFFFF: 6.54:1 passes
  light --status-critical #8B1A3A on --card #FFFFFF: 9.10:1 passes
  dark --status-pass #5FC98E on --card #1C2026: 7.97:1 passes
  dark --status-warn #E0B341 on --card #1C2026: 8.33:1 passes
  dark --status-fail #F2867A on --card #1C2026: 6.59:1 passes
  dark --status-critical #F07AA0 on --card #1C2026: 6.23:1 passes
  ```
- Built HTML inspection of `dist/index.html` and `dist/about/index.html`
  produced this actual output:
  ```text
  nav-link class count: 3
  Desktop primary nav (3):
    Learn -> /learn/
    Applied -> /applied/
    Calculators -> /calculators/
  Mobile panel (4):
    Learn -> /learn/
    Applied -> /applied/
    Calculators -> /calculators/
    Browse calculators -> /calculators/
  Footer Learn (7):
    Descriptive Statistics -> /descriptive-statistics/
    Probability & Distributions -> /probability-distributions/
    Combinatorics -> /combinatorics/
    Regression & Correlation -> /regression-correlation/
    Inferential Statistics -> /inferential-statistics/
    Foundations -> /foundations/
    All Learn topics -> /learn/
  Footer Applied (5):
    Data Analysis -> /data-analysis/
    Experiments & Causality -> /experiments-causality/
    Forecasting & Time Series -> /time-series-forecasting/
    Machine Learning Statistics -> /machine-learning-statistics/
    All Applied topics -> /applied/
  Footer Site (3):
    About -> /about/
    Privacy & Cookies -> /privacy-cookie-policy/
    Sitemap -> /sitemap-index.xml
  about footer contains /data-analysis/: True
  mobile contains category-hub href: False
  ```
  The first six entries under Footer Learn are the required non-alphabetical
  `data.order` sequence; the seventh entry is the requested section landing.

**Blocked / couldn't do / decisions made:**
- The normal `npm test` config-loader subprocess remains blocked by the
  documented Windows `spawn EPERM`; this session's fixed approval policy did
  not expose a process-spawn approval path. The fallback run above verifies all
  35 files / 120 tests but is reported separately rather than presented as the
  exact command passing.
- The local preview started successfully, but the in-app browser backend
  reported `No browser is available`. Required DOM/link/order checks were done
  against the freshly built HTML instead.
- No implementation decision expanded scope. Existing header controls,
  scripts, mobile mapping, footer bottom, responsive breakpoints, tokens, and
  calculator editorial picks were left unchanged.

---

## Review  *(Claude writes -- accept or send back)*

- **Reviewed:** 2026-08-16
- **Verdict:** CLOSED

**Notes / what to improve:**
- All four deliverables match the Brief. Diff is 3 files / +38 -17 and contains
  nothing outside scope: no route registry change, no content change, no new
  tokens, no new components.
- **Gates re-run by the Orchestrator, not taken from the Work Log:**
  `npx astro check` 0/0/0 (20 files); `npm run build` 115 pages, 4268 links,
  0 link violations, 0 meta-description violations; `check-contrast.mjs` 13/13
  passing.
- **`npm test` passes as the exact command.** Codex hit the documented Windows
  `spawn EPERM` on the Vitest config loader and honestly reported its fallback
  separately rather than claiming the real command passed -- that was the right
  call. Re-run from the Orchestrator's shell it is green: **35 files / 120 tests
  passed** in 10.30s. So the blocker is environmental to the Codex sandbox, not
  a repo problem, and nothing here needs fixing.
- **The unchanged 4268 link count is correct, not a stale build.** It looks
  wrong at first glance for a task that rewrote the chrome, and the Brief
  predicted a drop. The arithmetic nets to zero per page: the header sheds 3
  desktop + 3 mobile category links (-6) while the footer gains exactly 6
  (Learn 5 -> 7, Applied 0 -> 5, Site 3 -> 2, i.e. +2 +5 -1). Verified by
  inspection of `dist/index.html`, not by trusting the number.
- **The ordering proof earned its place.** The footer Learn column renders
  descriptive / probability / combinatorics / regression / inferential /
  foundations -- the `data.order` sequence, which is neither alphabetical nor
  the order the old hardcoded array used. That is what confirms the list is
  genuinely collection-derived rather than a retyped literal.
- Deriving the footer from `getCollection` means the four applied hubs picked up
  sitewide inbound links automatically; confirmed `/data-analysis/` now appears
  in `dist/about/index.html`. Before this task the landings were reachable only
  by direct URL.
- Minor, deliberately not sent back: `getCollection('categories')` is awaited
  twice, once per section filter. It is a cached in-memory call in Astro and
  runs once per page render either way, so the cost is nil and the two-call form
  reads more clearly than a shared intermediate. Not worth a round trip.
- Scope clean. `ArticleLayout.astro`, `CategoryLayout.astro`,
  `SectionLandingLayout.astro`, and `src/lib/links.ts` all untouched.
- **Sizing note: the small-task discipline worked.** TASK-027 finished in ~10
  minutes of agent time, well inside the 900s MCP window, and wrote its own Work
  Log and AGENTS.md entry -- the two things TASK-026 lost to the timeout. This
  is the model for TASK-028 / TASK-029, which are being split before dispatch
  for the same reason.
