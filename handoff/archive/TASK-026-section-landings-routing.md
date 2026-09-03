Status: CLOSED
<!-- TODO | IN_PROGRESS | DONE | CHANGES_REQUESTED | CLOSED -->

# TASK-026 -- Section landings, route kinds, reserved-slug guard

- **Owner of this stage:** Codex
- **Repo:** `Desktop/statohub/` (where the work happens)
- **Created:** 2026-08-16 by Claude

<!-- Authoring note (Claude): keep this file plain ASCII. Use `--` not an em
dash, `->` not an arrow, `...` not an ellipsis. Codex reads these files through
a Windows codepage; non-ASCII punctuation renders as mojibake and breaks its
apply_patch matching. -->

---

## Brief  *(Claude writes -- what Codex needs to execute)*

**Goal:** Give the two verticals a landing page each (`/learn/` and
`/applied/`), teach the typed route registry about them, make category
breadcrumbs section-aware, and close a pre-existing hole in the root-route
collision guard that these two new static segments would otherwise widen.

**Context / inputs:**
- `docs/decisions/0014-applied-section-url-family.md` -- the URL family and the
  reason the collision guard needs extending. Read this first.
- TASK-025 (CLOSED) added `section: 'learn' | 'applied'` to the `categories`
  schema, defaulted to `learn`.
- The four applied category hubs already exist and are live in the build:
  `data-analysis`, `experiments-causality`, `time-series-forecasting`,
  `machine-learning-statistics`. The other six categories are `learn` by
  default. Current build baseline is **113 pages**.
- `src/lib/links.ts` -- 57 lines. `RouteRef` union at lines 19-26, `url()`
  switch at 30-47, `routes` object at 49-57.
- `src/pages/[slug]/index.astro` -- collision guard at lines 19-26.
- `src/layouts/CategoryLayout.astro` -- 77 lines; breadcrumbs built at lines
  23-26.
- `src/pages/calculators/index.astro` (55 lines) is the existing landing-page
  precedent -- follow its structure and conventions rather than inventing a new
  shape.

**Deliverables:**

- [ ] **1. `src/lib/links.ts` -- two new route kinds.**
      Add `| { kind: 'learnLanding' }` and `| { kind: 'appliedLanding' }` to
      the `RouteRef` union, the matching `case` arms returning `'/learn/'` and
      `'/applied/'` in `url()`, and `learnLanding` / `appliedLanding` factories
      on the `routes` object. Follow the existing `calculatorsHub` entry exactly
      -- it is the same shape (a static segment with no id).
      Do NOT add a section discriminator to `categoryHub` or `article`: both
      already resolve to `/${id}/` regardless of section, and that is the whole
      point of ADR-0014.

- [ ] **2. `src/pages/[slug]/index.astro` -- reserved-slug guard.**
      The existing guard compares articles against categories but never against
      the site's *static* route segments, so a category or article slugged
      `learn` would be silently shadowed by the new landing page and the build
      would still go green. Close it:
      ```
      const RESERVED_SLUGS = ['about', 'calculators', 'privacy-cookie-policy', 'learn', 'applied'];
      ```
      Check both collections' ids against it and `throw` with a clear message,
      alongside the existing collision error. Keep the existing
      article-vs-category check exactly as it is -- this is an addition, not a
      replacement. No current id collides, so this must land green.

- [ ] **3. `src/layouts/SectionLandingLayout.astro` -- new layout.**
      One layout serving both landings, driven by props -- do not write two
      near-identical pages. It should take the section (`'learn' | 'applied'`),
      a title, a description, and the route for its own canonical path, then
      render the categories belonging to that section.
      Fetch categories with `getCollection('categories')`, filter on
      `entry.data.section`, and sort by `entry.data.order` ascending. Reuse the
      existing `.cat` card class and the `Link` component; do not introduce new
      CSS in this task beyond what is unavoidable for layout, and add no new
      colour tokens.
      Breadcrumbs: `Home / <Section>`.

- [ ] **4. `src/pages/learn/index.astro` and `src/pages/applied/index.astro`.**
      Thin pages that pass props into `SectionLandingLayout`. Use this exact
      copy -- it is meta-description-gated at 110-160 chars and already
      verified, so do not reword it:
      - `/learn/` title: `Learn Statistics`
        description: `Learn statistics from the ground up: clear explanations of the core concepts, each paired with a working calculator you can try as you read.`
      - `/applied/` title: `Applied Statistics`
        description: `How statistics gets used in practice: data analysis workflows, experiment design, forecasting, and the statistical thinking behind machine learning.`
      `/learn/` must list the 6 learn categories and `/applied/` the 4 applied
      ones, with no hardcoded category lists anywhere -- both come from the
      collection.

- [ ] **5. `src/layouts/CategoryLayout.astro` -- section-aware breadcrumbs.**
      Currently `Home / <Category>`. Insert the section landing between them so
      an applied hub reads `Home / Applied Statistics / Data Analysis` and a
      learn hub reads `Home / Learn Statistics / Descriptive Statistics`.
      Read the section from the category's own `section` field -- do not infer
      it from the slug or from a hardcoded list. Route through
      `routes.learnLanding()` / `routes.appliedLanding()`; never hand-write the
      href.

**Constraints:**
- Stay in this repo; don't touch sibling folders or `CLAUDE.md`.
- **Out of scope, explicitly:** do NOT add article-layout dispatch by section.
  `AppliedArticleLayout` does not exist until TASK-030, so there is nothing to
  dispatch to and every article must keep rendering through `ArticleLayout`
  exactly as it does today. Do not touch `ArticleLayout.astro`.
- Do not restructure the header nav or footer -- that is TASK-027. The new
  landings will be unlinked from the header after this task, which is expected
  and correct; `check-links.mjs` validates outgoing links, not inbound ones.
- Never hand-write an internal `<a href>`. Everything routes through
  `Link.astro` / `url()` / `routes.*` (ADR-0002 + the zero-redirect rule).
- Do not create article files, components, or infographics.
- Do not modify `src/content/config.ts`, `src/content/**`, `package.json`,
  `vitest.config.ts`, `scripts/gen-route-ids.mjs`, or `scripts/check-links.mjs`.
- Node stays at v20.8.0, Wrangler v3 (ADR-0005). No dependency changes.

**Definition of done / how to verify:**

Run all three and paste the actual output into the Work Log:

1. `npx astro check` -- must stay at 0 errors / 0 warnings / 0 hints. This is
   what proves the two new `RouteRef` kinds are exhaustively handled in `url()`;
   a missing `case` arm is a type error, not a runtime surprise.
2. `npm test` -- 35 files / 120 tests still pass. This task adds no tests.
3. `npm run build` -- must report **115 pages** (113 + `/learn/` + `/applied/`),
   **0 link violations**, and **0 meta-description violations**.
   115 is the number to hit exactly. More means something extra got generated;
   fewer means a landing did not build.

Then confirm by inspection and report what you found:
- `dist/learn/index.html` links to all **6** learn hubs, `dist/applied/index.html`
  links to all **4** applied hubs, and neither lists the other section's.
- `dist/data-analysis/index.html` breadcrumbs read Home / Applied Statistics /
  Data Analysis, and its BreadcrumbList JSON-LD has **3** `ListItem` entries.
- A learn hub such as `dist/descriptive-statistics/index.html` reads
  Home / Learn Statistics / Descriptive Statistics.

**Guard proof (do this, it is the point of deliverable 2):** temporarily add a
throwaway category YAML at `src/content/categories/learn.yaml` (any valid
110-160 char description), confirm `npm run build` now **fails** with your
reserved-slug error, then delete the file and confirm the build returns to 115
pages. Report both outcomes. A guard that has never been seen to fire is not
evidence of anything.

**Sandbox note:** per `AGENTS.md`, `npm test` / `astro build` can hit
`spawn EPERM` and `npm install` can need network approval on Windows. Those are
environment issues -- request approval and rerun. Never change the
implementation to work around a sandbox refusal, and never skip or fake a
verification step. If something stays blocked, say so plainly under
"Blocked / couldn't do".

---

## Work Log  *(Codex writes -- what was actually done)*

- **Started:** 2026-08-16
- **Finished:** 2026-08-16

**Provenance note (written by Claude, not Codex).** Codex implemented all five
deliverables, but the `codex mcp-server` MCP call hit the client-side
`MCP_TOOL_TIMEOUT` (900s) before it wrote this log, updated `AGENTS.md`, or
reported any verification output. The code below is Codex's; every verification
result below was produced by the Orchestrator re-running the gates from scratch.
Nothing here is copied from a Codex claim, because Codex made none.

**What changed (files + where):**
- `src/lib/links.ts` -- added `learnLanding` and `appliedLanding` to the
  `RouteRef` union, `url()` switch, and `routes` factories. `categoryHub` and
  `article` were correctly left alone; both still resolve to `/${id}/`
  regardless of section, per ADR-0014.
- `src/pages/[slug]/index.astro` -- added `RESERVED_SLUGS` and a second guard
  checking both collections against it. The pre-existing article-vs-category
  check is untouched.
- `src/layouts/SectionLandingLayout.astro` -- new, props-driven, serving both
  landings. Filters `getCollection('categories')` on `data.section`, sorts by
  `data.order`, reuses the existing `.cat` / `.catalog` classes and `Link`.
  No new CSS and no new colour tokens.
- `src/pages/learn/index.astro`, `src/pages/applied/index.astro` -- thin prop
  wrappers. Title/description copy is byte-identical to the Brief.
- `src/layouts/CategoryLayout.astro` -- breadcrumbs now insert the section
  landing, read from `category.section` rather than inferred from the slug.
- `src/lib/content-route-ids.ts` -- regenerated; picks up the four applied
  category ids. Expected, and generated on every build.

**How to verify:**
- `npx astro check` -- 20 files, 0 errors / 0 warnings / 0 hints. This is what
  proves both new `RouteRef` kinds are exhaustively handled in `url()`.
- `npm test` -- 35 files / 120 tests passed. No test changes in this task.
- `npm run build` -- **115 pages**, 4268 internal links, 0 link violations,
  0 meta-description violations. Exactly 113 + 2 landings.
- Catalog isolation (`<ul class="catalog">` extracted, so header/footer chrome
  is excluded): `/learn/` lists exactly the 6 learn hubs; `/applied/` lists
  exactly the 4 applied hubs. No cross-section leakage.
  Note for the reviewer's own sanity: grepping the *whole* `/applied/` page
  returns 9 hub links, not 4. The extra 5 are the sitewide header and footer,
  which still carry learn category links until TASK-027 restructures them.
- Breadcrumb JSON-LD: `dist/data-analysis/index.html` has 3 `ListItem` entries
  reading Home / Applied Statistics / Data Analysis;
  `dist/descriptive-statistics/index.html` reads Home / Learn Statistics /
  Descriptive Statistics.
- **Guard proof, run in both directions.** With a throwaway
  `src/content/categories/learn.yaml` in place, `npm run build` failed with
  exit 1 and `Root route slug collision with reserved static segments: learn`.
  The file was deleted and the build returned to 115 pages with 0 violations.
  `git status` confirms no trace of the trap file remains.

**Blocked / couldn't do / decisions made:**
- The MCP transport timed out at 900s. The work itself was complete and
  correct; only the bookkeeping was lost. See the Review for the operational
  fix, which is a task-sizing change rather than a timeout increase.

---

## Review  *(Claude writes -- accept or send back)*

- **Reviewed:** 2026-08-16
- **Verdict:** CLOSED

**Notes / what to improve:**
- All five deliverables match the Brief. Diff reviewed line by line: two route
  kinds added in the right shape, the reserved-slug guard added *alongside*
  rather than replacing the existing collision check, one props-driven layout
  instead of two near-duplicate pages, section read from the category's own
  `section` field rather than a hardcoded slug list, and landing copy byte-exact.
- Scope clean. `ArticleLayout.astro` untouched, so every article still renders
  exactly as before -- section-aware article dispatch correctly deferred to
  TASK-030. Header and footer untouched, as TASK-027 owns those.
- The guard proof is the valuable part of this task and it earned its place: the
  hole was real, and the guard has now been observed both firing and not firing.
- **Operational finding: the 900s MCP timeout is a real constraint, not a
  fluke.** TASK-026 was roughly twice the size of TASK-025 and exceeded it. The
  fix is to keep dispatched tasks small enough to finish inside the window, not
  to raise the timeout -- a task that needs 15+ minutes of agent time is a task
  whose diff is too large to review carefully anyway. TASK-028 and TASK-029 (8
  components, 6 infographics) are the next candidates to blow this limit and
  should be split before dispatch.
- **Second finding, worth remembering:** when the transport dies mid-task, the
  repo is left in a valid state but the handoff file lies -- it sits at
  IN_PROGRESS with an empty Work Log while the code is actually complete. The
  working tree, not the task file, is the source of truth after a timeout.
  Always diff before assuming a timed-out task did nothing.
