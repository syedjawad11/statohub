Status: CLOSED
<!-- TODO | IN_PROGRESS | DONE | CHANGES_REQUESTED | CLOSED -->

# TASK-021 -- Theme refresh: calculator view + StatCalc panel restyle

- **Owner of this stage:** Codex
- **Repo:** `Desktop/statohub/` (where the work happens)
- **Created:** 2026-06-27 by Claude

<!-- Authoring note (Claude): keep this file plain ASCII. Use `--` not an em
dash, `->` not an arrow, `...` not an ellipsis. Copy any special glyphs straight
from the mockup file so encoding stays correct. -->

---

## Brief  *(Claude writes -- what Codex needs to execute)*

**Goal:** Restyle the standalone calculator page and the StatCalc component to
the new theme's "instrument" look from `statohub-theme-preview.html` -- a
bordered `.panel` with a "Live calculator" top bar (pulse dot), a two-column
in/out split (inputs left, results right as stat cards + table), plus the
`.calc-hero`, `.howto` section, and `.side-card` related list. Prerequisite:
TASK-019 CLOSED (TASK-020 may run in parallel or before -- no hard dependency on
it).

This is the highest-care task because it restyles `StatCalc.astro` (and the
calculator page) WITHOUT changing the byte-stable DOM hooks the client engine
depends on.

**Context / inputs:**
- **Visual spec (authoritative):** `statohub-theme-preview.html`, the CALCULATOR
  view = `<section id="view-calc">` (mockup lines ~488-535) and its CSS block
  (mockup lines ~199-223): `.calc-hero` (pill + serif H1 + `.desc`), `.panel`
  with `.panel-top` ("Live calculator" + `.live` pulse), `.panel-grid` split
  into `.panel-in` (inputs, `.opt-row` options) and `.panel-out`
  (`.stat-cards` of `.scard` + the results `.calc-out`), then `.howto`
  (explanation + `.read-cta`) beside a `.side-card` "Related calculators" list
  of `.tool` rows. Copy CSS values from the mockup `<style>`.
- **Files you will touch:**
  - `src/components/StatCalc.astro` -- restyle/re-wrap the `variant="page"`
    rendering into the panel look (and keep `variant="embed"` looking good
    inside the article `.fuse` from TASK-020). DO NOT change the byte-stable
    hooks (see below).
  - `src/pages/calculators/[slug]/index.astro` -- page header `.calc-hero`,
    the panel placement, the `.howto` section, and the related-calculators
    `.side-card` (the existing `getRelatedCalculators(slug)` sidebar -- restyle,
    keep the data logic).
  - `src/styles/global.css` -- add the calculator `.panel*`, `.scard`,
    `.calc-hero`, `.howto`, `.side-card` classes; restyle the existing
    `.statcalc-*` / `.calc-teaching` classes to the new look.

**BYTE-STABLE STatCalc HOOKS -- MUST NOT CHANGE (the client engine depends on
exact selectors/attributes):**
- The section root attributes: `data-statcalc`, `data-config-id`, the instance
  `id`, `aria-labelledby`.
- `data-statcalc-form` on the form.
- `data-statcalc-results` on the results container, with `aria-live="polite"`.
- `data-statcalc-chart` on the (hidden) chart seam.
- The `<script type="application/json" id={configId}>` config block -- contents
  and id unchanged.
- The client import `import './statcalc/client.ts';`.
You may add wrapper elements/classes and reorder the VISUAL grouping (e.g. wrap
the form in `.panel-in` and the results in `.panel-out` to get the two-column
split), and add presentational chrome (`.panel-top` live bar), but every hook
above must remain present with the same attribute names and the same
parent/child relationship the client script queries. After your change,
`statcalc/client.ts` must run UNCHANGED -- do not edit it. Verify by computing
on a real page (see DoD).

**How to map the generic StatCalc onto the panel (important):**
- The mockup's calculator view is illustrated with a frequency-table-specific
  layout (checkboxes, a specific table). Do NOT hardcode frequency-table.
  StatCalc is CONFIG-DRIVEN: its inputs come from each calculator's config and
  its results render generically as value / text / list / table. Your job is to
  make the GENERIC component adopt the panel look so every calculator inherits
  it:
  - Inputs (whatever the config defines) live in `.panel-in`.
  - Results render in `.panel-out`. Where a calculator emits multiple scalar
    outputs, present them as `.stat-cards` / `.scard` (label + value); where it
    emits a table or list, render it in `.calc-out` styled like `table.dt`.
    StatCalc/client.ts already distinguishes output kinds -- skin those existing
    output shapes; do not change what the engine returns.
  - The `.panel-top` "Live calculator" bar is static chrome (it reflects that
    StatCalc computes live on input -- which it already does).
- For `variant="embed"` (used in the article `.fuse`), keep it compact -- it
  does not need the full two-column panel; it should look at home inside the
  fused card from TASK-020.

**Constraints:**
- Stay in this repo; don't touch sibling folders. Do not edit `CLAUDE.md`.
- Do NOT edit `src/components/statcalc/client.ts` or `format.ts`. Do NOT change
  any calculator config, engine, or `src/calc/**`.
- Do NOT change routes, the typed-link system, or the related-calculators data
  logic (`src/lib/related-calculators.ts`). Restyle the sidebar only.
- The calc-teaching MDX block (the short per-calculator prose rendered below the
  tool) keeps rendering; restyle its container to fit the new look. The
  `RelatedLink` callouts inside teaching MDX must keep working (they already use
  `--pine`/typed links after TASK-019's token rename).
- No new dependencies. Honor `prefers-reduced-motion` (the `.live` pulse must be
  reduced-motion safe).

**Definition of done / how to verify:**
- `npx astro check` -> 0/0/0; `npm test` green (client/format tests unchanged
  and passing); `npm run build` -> `check-links` **0 violations**.
- `npm run preview` and test SEVERAL different calculators (different output
  kinds), e.g. `/calculators/standard-deviation/` (multi-scalar -> stat cards),
  `/calculators/frequency-table/` (table output), and one single-value calc:
  each renders the new panel (top bar + two-column in/out), COMPUTES correctly
  on input (live), shows results as stat cards / styled table, and the `.howto`
  + related `.side-card` render. Dark mode flips cleanly.
- Inspect the rendered StatCalc DOM: confirm `data-statcalc`,
  `data-config-id`, `data-statcalc-form`, `data-statcalc-results`
  (`aria-live="polite"`), `data-statcalc-chart`, and the
  `<script type="application/json">` config block are all still present and
  intact, and `client.ts` was not modified.

---

## Work Log  *(Codex writes -- what was actually done)*

- **Started:** 2026-06-27
- **Finished:** 2026-06-27

**What changed (files + where):**
- `src/components/StatCalc.astro` -- rewrapped the page variant as a generic `.panel` instrument with `.panel-top`, `.panel-grid`, `.panel-in`, and `.panel-out`. The root `data-statcalc`/`data-config-id`/`id`/`aria-labelledby`, `data-statcalc-form`, `data-statcalc-results aria-live="polite"`, `data-statcalc-chart`, JSON config script, and client import remain present; embed mode stays compact.
- `src/pages/calculators/[slug]/index.astro` -- replaced the old article-shell calculator page with `.calc-hero`, standalone `<StatCalc variant="page" />`, `.howto` teaching area, and `.side-card` related calculator list while preserving `getRelatedCalculators(slug)` data logic and typed links.
- `src/styles/global.css` -- added calculator panel, result-card/table, `.calc-hero`, `.howto`, `.side-card`, related tool-row, and reduced-motion-safe live-dot styles.

**How to verify:**
- `npx astro check` -- 0 errors / 0 warnings / 0 hints.
- `npm test` -- 33 test files passed, 89 tests passed.
- `npm run build` -- succeeded; `check-links` scanned 56 pages / 2056 internal links / 0 violations.
- `git diff -- src/components/statcalc/client.ts src/components/statcalc/format.ts src/calc` -- no output; client, format, and calculator engines were not modified.
- Built HTML checks confirmed `/calculators/standard-deviation/`, `/calculators/frequency-table/`, and `/calculators/mean/` include `.calc-hero`, `.statcalc-card.statcalc-page.panel`, `.panel-top`, `.panel-grid`, `.panel-in`, `.panel-out`, `.howto`, `.side-card`, and the required StatCalc hooks/config script.
- Local preview returned 200 for `/calculators/standard-deviation/`, `/calculators/frequency-table/`, and `/calculators/mean/`.

**Blocked / couldn't do / decisions made:**
- The in-app browser was unavailable (`agent.browsers.list()` returned `[]`), so live click/type computation and screenshot visual QA could not be performed in this session. Verification used unit tests, build/link gates, local preview HTTP checks, unchanged client/engine diffs, and built DOM hook inspection.
---

## Review  *(Claude writes -- accept or send back)*

- **Reviewed:** 2026-06-27
- **Verdict:** CLOSED

**Notes / what to improve:**
- Highest-care task verified carefully. All byte-stable StatCalc hooks survive in
  `StatCalc.astro`: root `id`/`data-statcalc`/`data-config-id`/`aria-labelledby`,
  `data-statcalc-form`, `data-statcalc-results` w/ `aria-live="polite"`,
  `data-statcalc-chart`, the `<script type="application/json" id={configId}>`
  block, and `import './statcalc/client.ts'`. The panel chrome wraps AROUND them
  (`.panel`/`.panel-top`/`.panel-grid`/`.panel-in`/`.panel-out`).
- `git diff` over `src/components/statcalc/client.ts`, `format.ts`, and
  `src/calc/` is EMPTY -- engine/client untouched, so the panel is pure restyle.
- Generic config-driven outputs are skinned, not hardcoded to the mockup's
  frequency-table layout.
- Gates green: astro check 0/0/0, npm test 89/89, build 56 pages / 0 link
  violations.
