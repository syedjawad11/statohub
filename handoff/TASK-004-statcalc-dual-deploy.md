Status: CLOSED
<!-- TODO | IN_PROGRESS | DONE | CHANGES_REQUESTED | CLOSED -->

# TASK-004 -- StatCalc: one config-driven, dual-deployed calculator component

- **Owner of this stage:** Codex
- **Repo:** `Desktop/statohub/` (where the work happens)
- **Created:** 2026-06-14 by Claude

<!-- Authoring note (Claude): keep this file plain ASCII. Use `--` not an em
dash, `->` not an arrow, `...` not an ellipsis. Codex reads these files through
a Windows codepage; non-ASCII punctuation renders as mojibake and breaks its
apply_patch matching. -->

---

## Brief  *(Claude writes -- what Codex needs to execute)*

**Goal:** Build `<StatCalc>` -- the single, config-driven calculator component
that deploys in **two** places from the **same** config and the **same** engine,
with zero logic duplication: `variant="page"` (the standalone `/calculators/{slug}/`
tool page) and `variant="embed"` (rendered inline, e.g. inside an article). It is
the first *consumer* of the TASK-003 engine layer -- it proves the
engine -> registry -> UI chain end to end.

**Context / inputs:**
- [`../BUILD-PLAN.md`](../BUILD-PLAN.md) **section Plan A -> A4** is the spec:
  "Math lives once in `src/calc`; config lives once per calculator; UI lives once
  in `StatCalc.astro`. Embed (`variant="embed"`) and standalone
  (`/calculators/{slug}/`, `variant="page"`) feed the same component the same
  config -- zero logic duplication. Server-renders the form (SEO + no-JS
  fallback); a client island wires input -> compute -> output and lazy-`import()`s
  uPlot only if `chart` is set. `standalone:false` configs render embed-only -- no
  invented page/keyword."
- **TASK-003 (CLOSED)** shipped the pure engines + `src/calc/registry.ts` with
  `getEngine(key)`. StatCalc gets its math ONLY by calling `getEngine(config.engine)`
  -- never reimplement formulas in the component.
- **TASK-002 (CLOSED)** shipped the `calculators` collection
  (`src/content/config.ts`) and `src/content/calculators/standard-deviation.yaml`
  (`engine: standardDeviation`, `standalone: true`, multi-output sample/population).
  Reuse it as the canonical dual-deploy proof -- do NOT invent a new calculator.
- Existing conventions to match: `src/layouts/BaseLayout.astro` (slate/teal
  palette, dark mode, Tailwind utility style), folder-based routes
  (`src/pages/<folder>/index.astro`), `astro.config.mjs` trailing-slash contract.

**The proof case (exactly these two configs -- enough to exercise every path):**
1. **`standard-deviation` (already exists)** -- `standalone: true`, `outputs`
   `{ sample, population }`. Proves: `variant="page"` standalone route + multi-output
   render. Also embed it inline (below) to prove the SAME config drives both variants.
2. **`median` (you create `src/content/calculators/median.yaml`)** --
   `standalone: false`, single `value`, no outputs. Proves: embed-only render with
   **NO** `/calculators/median/` route generated.

**Deliverables:**

- [ ] **Extend the `calculators` schema** in `src/content/config.ts` with the
      display/form fields StatCalc needs. **All new fields MUST be optional or
      defaulted** so the existing `standard-deviation.yaml` stays valid without
      edits. Add:
      - `inputs`: array describing the form fields, each
        `{ name: string, label: string, type: 'numberList' | 'number', placeholder?: string, default?: string }`.
        **Default** the whole array to a single
        `[{ name: 'values', label: 'Values', type: 'numberList' }]` (covers both
        proof calcs). `name` MUST equal the engine's input key (e.g. `values`).
      - `precision`: int, default `4` (decimal places for display rounding).
      - `resultLabel`: string, optional (label for the primary `value`; default "Result").
      - `outputLabels`: `record(string)` optional (maps an `outputs` key -> display label).
      The enum stays `'numberList' | 'number'` for now -- that covers every
      descriptive engine (lists for values/weights, single numbers for
      percentile `p` and zScore `x/mean/sd`). Note in a comment that more input
      types get added when distribution/inferential calcs land.

- [ ] **`src/components/StatCalc.astro`** -- the component. Props:
      `slug: string` (calculator collection id), `variant: 'page' | 'embed'`
      (default `'embed'`). It:
      - Loads the calculator entry from the `calculators` collection by `slug`
        (server-side, via `getEntry`/`getCollection`), reads its `engine`,
        `inputs`, `precision`, `resultLabel`, `outputLabels`.
      - **Server-renders the form** as real HTML: one labeled control per `inputs`
        entry (`numberList` -> `<textarea>`; `number` -> `<input type="number">`),
        a Compute button, and an empty results region. This is the SEO / no-JS
        fallback -- it must be present in the built HTML.
      - Supports **multiple instances per page** (the hub renders two). Give each
        instance root a unique id and a `data-statcalc` marker; emit the per-instance
        config (engine key, inputs spec, precision, labels) as a small
        `<script type="application/json">` block scoped to that instance. Do NOT rely
        on a single global id.
      - `variant="page"` vs `variant="embed"` differ ONLY in wrapper/styling
        (e.g. page = full card with heading; embed = compact inline card). Same
        form, same compute, same engine. No duplicated logic.
      - Leaves a clearly-commented **seam** for `chart` (the future lazy
        `import()` of uPlot) but does NOT implement charts -- no calc in scope sets
        `chart: true`. Do not add uPlot or any chart dep now.

- [ ] **Client island (vanilla TS, no UI framework).** A single bundled
      `<script>` (inline in StatCalc.astro, or `src/components/statcalc/client.ts`
      imported by it). On load it `querySelectorAll('[data-statcalc]')` and inits
      each instance: read that instance's JSON config, import `getEngine` from
      `../../calc/registry`, then on input/submit -> **parse** the raw form values
      into the engine's typed input object (keyed by each `inputs[].name`;
      `numberList` -> `number[]` by splitting on commas/whitespace/newlines and
      `Number()`-ing; `number` -> single float) -> call the engine -> **render**
      the `CalcResult`. **Do NOT reimplement any math in the client** -- it only
      parses, calls the engine, and formats.
      - **Result rendering rule (pin this):** if `result.outputs` is present and
        non-empty, render each output entry labeled by `outputLabels[key]` or a
        humanized key (this is why SD shows sample + population and does NOT
        duplicate the primary). Otherwise render `result.value` labeled by
        `resultLabel`/"Result". If `result.value === null`, show `result.error`
        in the results region (no crash).
      - Round displayed numbers to `precision` decimals; keep raw engine output
        unrounded internally.
      - Put any pure parse/format helpers in `src/components/statcalc/format.ts`
        (pure, no DOM) so they are unit-testable; add a small Vitest file for them.

- [ ] **`src/pages/calculators/[slug]/index.astro`** -- the standalone route.
      `getStaticPaths()` loads the `calculators` collection and emits a path ONLY
      for entries where `standalone !== false`. Each page renders `BaseLayout`
      (title `"{calc.title} | Statohub"`, `calc.description`) with an `<h1>`, the
      `description` as intro copy (so the page is not thin), and
      `<StatCalc slug={slug} variant="page" />`. Folder-based route
      (`[slug]/index.astro`) so it honors the trailing-slash + directory contract.

- [ ] **`src/pages/calculators/index.astro`** -- a minimal `/calculators/` hub.
      Lists every `standalone:true` calculator with a trailing-slash link to its
      page, AND renders **two live embed demos** to prove `variant="embed"`:
      `<StatCalc slug="standard-deviation" variant="embed" />` (same config as the
      standalone SD page -> proves dual-deploy) and
      `<StatCalc slug="median" variant="embed" />` (the embed-only calc -> proves it
      renders inline despite having no standalone route). Keep it lean; the polished
      hub/`CalculatorLayout` is a later `ui-designer` task.

- [ ] **`src/content/calculators/median.yaml`** -- `engine: median`,
      `standalone: false`, `chart: false`, `category: descriptive-statistics`,
      sensible title/description, `keywords: []` (no invented keyword -- it is
      embed-only).

**Constraints:**
- Stay in this repo; don't touch sibling folders. **Do not edit `CLAUDE.md`** --
  log in this task file's Work Log.
- **No UI framework.** Vanilla `<script>` island only -- do NOT add React/Preact/
  Vue/Svelte or any new runtime dependency. Keeps deps at astro/mdx/sitemap and
  safe on **Node 20.8.0 / Wrangler v3** (both stay pinned -- don't bump anything
  that breaks on Node 20.8.0).
- **Styling: functional + accessible now, not the final visual system.** Match the
  existing BaseLayout Tailwind conventions (slate/teal, dark mode). Accessibility is
  required: every control has an associated `<label>`; the results region is an
  `aria-live="polite"` region; the component is fully keyboard usable; contrast meets
  WCAG AA. The polished design-token system / `CalculatorLayout` is deferred to a
  later `ui-designer` task -- do not build it here.
- **No charts.** Leave the `chart` lazy-import seam only; install nothing.
- **Engines are the only source of math.** `src/calc/**` must stay untouched and
  pure -- the component imports and calls it, never duplicates a formula.
- **Schema back-compat:** existing `standard-deviation.yaml` must still validate
  with zero edits (all new schema fields optional/defaulted).
- **Out of scope (other tasks -- do NOT build):** `ArticleLayout` / article render
  routes, `src/lib/links.ts` + `Link.astro` + `scripts/check-links.mjs` (TASK-005),
  SEO components + sitemap config (TASK-006), deploy pipeline (TASK-007), and any
  calculator engine not already shipped in TASK-003. For now hrefs may be written
  as plain trailing-slash strings; the typed link registry comes in TASK-005.
- Lean: small focused files, no helper sprawl, no unused config fields beyond the
  ones specified.

**Sandbox heads-up:** see [`../AGENTS.md`](../AGENTS.md) -> "Sandbox heads-up".
`astro build` / `vitest` may hit Windows `spawn EPERM` until you approve
process-spawn, and an uncached `npm install` needs network approval -- both are
expected approval prompts in this trusted project, not bugs. Re-run after approving.

**Definition of done / how to verify:**
- `npm run build` exits `0` and produces:
  - `dist/calculators/standard-deviation/index.html` (standalone SD page), and
  - `dist/calculators/index.html` (hub), and
  - **does NOT** produce `dist/calculators/median/index.html` (embed-only proof:
    `standalone:false` generates no route).
  - existing `/` and `/normal-distribution/` still build.
- `npx astro check` exits `0`.
- `npm test` (`vitest run`) stays green, including the new `format.ts` helper tests
  and all 24 existing engine tests (engines untouched).
- **Functional check** (`npm run preview`, then in a browser):
  - `/calculators/standard-deviation/`: enter `2, 4, 4, 4, 5, 5, 7, 9` -> results
    show **Sample SD ~= 2.1380899** and **Population SD = 2** (rounded to `precision`),
    not a duplicated primary; clearing/garbage input shows the engine's error message,
    no crash.
  - `/calculators/`: the embedded SD calc computes the same numbers inline (same
    config, `variant="embed"`), and the embedded **median** calc computes the median
    of a list -- proving both variants render from one component with no standalone
    median route.
- Confirm in the Work Log: no new runtime dependency was added, `src/calc/**` is
  unchanged, and how multiple StatCalc instances are isolated on the hub page.

---

## Work Log  *(Codex writes -- what was actually done)*

- **Started:** 2026-06-14
- **Finished:** 2026-06-14

**What changed (files + where):**
- `src/content/config.ts` -- extended the calculators schema with defaulted
  `inputs`, `precision`, optional `resultLabel`, and optional `outputLabels`.
  Existing `standard-deviation.yaml` remains valid with zero edits.
- `src/components/StatCalc.astro` -- added the shared server-rendered calculator
  component. It loads calculator config by slug, renders labeled controls,
  per-instance JSON config, an `aria-live` results region, variant-only wrapper
  styling, and a commented chart seam.
- `src/components/statcalc/client.ts` -- added the vanilla TS island. It
  initializes every `[data-statcalc]` instance, reads that instance's JSON config,
  calls `getEngine(config.engine)`, parses form input, and renders outputs per
  the pinned rule.
- `src/components/statcalc/format.ts` -- added pure parse/format helpers for
  number lists, single numbers, and precision-based display formatting.
- `src/components/statcalc/format.test.ts` -- added Vitest coverage for the pure
  parse/format helpers.
- `src/pages/calculators/[slug]/index.astro` -- added folder-based standalone
  calculator route generation for entries where `standalone !== false`.
- `src/pages/calculators/index.astro` -- added the minimal calculator hub with
  trailing-slash standalone links and two embeds: standard deviation and median.
- `src/content/calculators/median.yaml` -- added the embed-only median config
  with `standalone: false`, `chart: false`, and no invented keywords.

**How to verify:**
- `npm run build` -- PASS. Generated `dist/calculators/standard-deviation/index.html`,
  `dist/calculators/index.html`, `dist/index.html`, and
  `dist/normal-distribution/index.html`; did not generate
  `dist/calculators/median/index.html`.
- `npx astro check` -- PASS with 0 errors, 0 warnings, 0 hints.
- `npm test` -- PASS after the expected Windows process-spawn approval:
  12 test files, 33 tests.
- Production bundle functional harness -- PASS. Using the built client bundle and
  built JSON config, SD input `2, 4, 4, 4, 5, 5, 7, 9` rendered `Sample = 2.1381`
  and `Population = 2`, so outputs render instead of duplicating the primary.
  The same bundle rendered median input `1 9 3 7 5` as `Result = 5`.
- Static HTML inspection -- PASS. Built pages include real labeled form controls,
  `data-statcalc`, per-instance `application/json` config blocks, `aria-live`,
  and distinct SD/median instance ids on `/calculators/`.

**Blocked / couldn't do / decisions made:**
- The in-app browser surface was unavailable (`Browser is not available: iab`),
  so functional verification used the production bundle with a minimal DOM
  harness instead of an interactive browser tab.
- No new runtime dependency was added; `package.json` dependencies were not
  changed by this task.
- `src/calc/**` was not edited. StatCalc imports and calls the existing registry
  engine only.
- Multiple StatCalc instances are isolated by unique root ids plus a per-instance
  `data-config-id` pointing at that instance's JSON config script.

---

## Review  *(Claude writes -- accept or send back)*

- **Reviewed:** 2026-06-14
- **Verdict:** CLOSED

**Notes / what to improve:**
- Independently verified, not just trusted the Work Log. Re-ran all three gates
  from a clean state: `npm run build` exits 0 and generates exactly the four
  expected routes -- `/calculators/standard-deviation/`, `/calculators/`, `/`,
  `/normal-distribution/` -- and **no** `/calculators/median/` (embed-only proof
  holds). `npx astro check` = 0 errors / 0 warnings / 0 hints. `npm test` = 33
  passing across 12 files (24 engine tests intact + 9 new `format.ts` tests).
- Dual-deploy proven at the source level: both the standalone SD route and the
  hub render `<StatCalc>` from the SAME `standard-deviation.yaml` via the SAME
  `getEngine('standardDeviation')` -- zero logic duplication. Confirmed in the
  built hub HTML: two distinct server-rendered `data-statcalc` instances with
  per-instance `application/json` config blocks (`engine:"standardDeviation"`
  and `engine:"median"`), real labeled form controls, and `aria-live` results
  regions. Instance isolation is by unique root id + `data-config-id` -> scoped
  config script (no global id) -- correct for multiple instances per page.
- Result-rendering rule implemented as specified: SD shows Sample + Population
  (from `outputs`) without duplicating the primary; engines with only `value`
  fall back to `resultLabel`/"Result"; `value === null` shows `error` with no
  crash. Math stays entirely in `src/calc/**` (untouched, verified) -- the
  client only parses, calls the engine, and formats.
- Schema back-compat confirmed: all new fields (`inputs`, `precision`,
  `resultLabel`, `outputLabels`) are optional/defaulted, so the existing
  `standard-deviation.yaml` validates unedited.
- Constraints honored: no new runtime dependency (vanilla `<script>` island,
  no UI framework), chart seam left commented but unimplemented, lean file set.
- Note for next time: the browser functional check was substituted with a
  production-bundle DOM harness because the in-app browser (`iab`) was
  unavailable this session -- acceptable here since the same numbers
  (Sample ~= 2.1381, Population = 2; median 5) were reproduced against the real
  built bundle, but worth an actual `npm run preview` browser pass when the
  StatCalc UI gets its polish in the later ui-designer task.
- No changes requested. Solid, in-scope, end-to-end proof of the
  engine -> registry -> UI chain.

---

## Codex Issues Encountered  *(for Claude review)*

- `npm test` initially hit the expected Windows sandbox `spawn EPERM`; rerunning
  with process-spawn approval passed.
- The in-app browser plugin could not provide an `iab` browser in this session,
  so browser interaction was replaced by production-bundle functional verification.
