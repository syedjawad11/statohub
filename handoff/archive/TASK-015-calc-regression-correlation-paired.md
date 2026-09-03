Status: CLOSED
<!-- TODO | IN_PROGRESS | DONE | CHANGES_REQUESTED | CLOSED -->

# TASK-015 -- Regression + correlation calculators (paired x/y lists)

- **Owner of this stage:** Codex
- **Repo:** `Desktop/statohub/` (where the work happens)
- **Created:** 2026-06-17 by Claude

<!-- Authoring note (Claude): keep this file plain ASCII. Use `--` not an em
dash, `->` not an arrow, `...` not an ellipsis. -->

---

## Brief  *(Claude writes -- what Codex needs to execute)*

**Goal:** Build 2 standalone calculators (correlation coefficient, linear regression) that
operate on TWO parallel numeric lists (x and y). The foundation here is "paired list" input
handling and a small shared sums helper -- no new input TYPE is required (two `numberList`
inputs do the job); the new work is validating that the two lists pair up and factoring the
shared cross-product sums.

**Context / inputs:**
- Engine contract `src/calc/types.ts` (`CalcResult`). Structured-output `text` field was
  added in TASK-012 -- use it for the regression equation string.
- The schema already supports multiple `numberList` inputs; `client.ts` parses each
  `numberList` field with `parseNumberList`, so an engine receiving `{ x: number[],
  y: number[] }` works with zero schema/client changes. Confirm this before adding anything.
- Pattern reference for a shared pure helper module: `src/calc/combinatorics-core.ts`.
- Planned set: `content-ops/seed.json` -- `correlation-coefficient` (engine `correlation`),
  `linear-regression` (engine `linear-regression`). Both standalone, category
  `regression-correlation`.

**Foundation to add (do this FIRST):**
- New file `src/calc/_regression-core.ts`. Pure math only (same purity rule as all
  `src/calc/**`). No new dependency. Given two `number[]` arrays it should:
  - Validate: both arrays present, all entries finite, equal length, length >= 2; return a
    typed sentinel (e.g. `null`) on failure so callers can emit a clean error.
  - Compute and return the shared sums in one pass: `n`, `sumX`, `sumY`, `sumXY`, `sumX2`,
    `sumY2`, plus derived `meanX`, `meanY`, `Sxx`, `Syy`, `Sxy` (the centered sums of
    squares / cross-products). Both engines below consume this.
- Unit-test the helper directly with a known dataset (see DoD).

**Deliverables (2 calculators):**
- [ ] Engine `src/calc/correlation.ts` (export `correlation`) + test. Inputs `x`
      (numberList) and `y` (numberList). Compute Pearson r = `Sxy / sqrt(Sxx * Syy)`.
      Output `value` = `r`; `outputs` = `rSquared` (r^2, coefficient of determination) and
      `n`. Guard: unequal lengths, n < 2, or zero variance in x or y (Sxx==0 or Syy==0) ->
      clean null + descriptive error. Register as `correlation`. Config
      `correlation-coefficient.yaml` (standalone, category `regression-correlation`,
      keyword "correlation coefficient calculator").
- [ ] Engine `src/calc/linear-regression.ts` (export `linearRegression`) + test. Inputs `x`
      (numberList) and `y` (numberList). Ordinary least squares: slope `b = Sxy / Sxx`,
      intercept `a = meanY - b * meanX`. Output `value` = `b` (slope); `outputs` =
      `slope` (b), `intercept` (a), `r`, `rSquared`, `n`; and set `text` to the fitted
      equation as a readable string, e.g. "y = 2.5 + 0.8x" (format the coefficients to a
      few decimals). Guard: unequal lengths, n < 2, Sxx == 0 (vertical line / no x spread)
      -> clean null + error. Register as `linear-regression`. Config
      `linear-regression.yaml` (standalone, category `regression-correlation`, keyword
      "linear regression calculator").
- [ ] Updated `src/calc/registry.ts` (2 new keys) and the 2 YAML configs. Each config has
      two `numberList` inputs named `x` and `y` with distinct labels and `placeholder`s
      (e.g. x placeholder "1, 2, 3, 4, 5"; y placeholder "2, 4, 5, 4, 6") so the two
      textareas are clearly differentiated.

**Constraints:**
- Stay in this repo; do not touch sibling folders. Do NOT edit `CLAUDE.md`.
- Engines + `_regression-core.ts` stay pure: no DOM / window / document / fetch / astro:
  imports under `src/calc/**` (grep must stay clean).
- No new runtime dependencies.
- Do NOT add a new input type or schema field -- two `numberList` inputs are sufficient.
  If you find a real reason the client/schema cannot pass two number lists to one engine,
  STOP and note it in the Work Log rather than inventing a new input type.
- `category:` id `regression-correlation` must match the existing file under
  `src/content/categories/` (verify first).

**Definition of done / how to verify:**
- `npx astro check` 0/0/0; `npm test` green incl. the helper test + 2 engine tests with a
  known dataset. Suggested anchor: x = [1,2,3,4,5], y = [2,4,5,4,5] ->
  `correlation` r approx 0.7746 (rSquared approx 0.6); `linear-regression` slope = 0.6,
  intercept = 2.2, equation text "y = 2.2 + 0.6x". Also test a perfect line
  (y = 2x + 1 -> r = 1, slope = 2, intercept = 1) and the error paths (unequal lengths,
  single point, all-identical x).
- `npm run build` succeeds, 0 link violations; the 2 new standalone pages exist in
  `dist/calculators/{correlation-coefficient,linear-regression}/`.
- The linear-regression result renders both the numeric `<dl>` outputs AND the equation
  line (the `text` field) -- confirm via preview or the built DOM.
- Confirm existing calculators are unchanged by the render/build.

---

## Work Log  *(Codex writes -- what was actually done)*

- **Started:** 2026-06-17
- **Finished:** 2026-06-17

**What changed (files + where):**
- Added pure paired-list helper `src/calc/_regression-core.ts` to validate x/y lists and compute shared regression sums.
- Added `src/calc/correlation.ts` for Pearson correlation with r-squared and paired count outputs.
- Added `src/calc/linear-regression.ts` for least-squares slope, intercept, r, r-squared, paired count, and readable equation text.
- Registered `correlation` and `linear-regression` in `src/calc/registry.ts`.
- Added helper and engine tests under `src/calc/__tests__/`.
- Added standalone calculator configs in `src/content/calculators/correlation-coefficient.yaml` and `linear-regression.yaml`, each with distinct x/y `numberList` inputs.

**How to verify:**
- `npm test -- --run src/calc/__tests__/_regression-core.test.ts src/calc/__tests__/correlation.test.ts src/calc/__tests__/linear-regression.test.ts` initially hit expected Windows `spawn EPERM`, then passed with approval: 3 files, 8 tests.
- `npx astro check` passed: 0 errors, 0 warnings, 0 hints.
- `npm test` initially hit expected Windows `spawn EPERM`, then passed with approval: 28 files, 77 tests.
- `npm run build` passed: 32 pages built, 0 link violations.
- Verified generated pages exist under `dist/calculators/{correlation-coefficient,linear-regression}/`.
- Verified the built linear-regression page includes two distinct `numberList` textareas and config entries for `x` and `y`; source client appends `result.text` after numeric outputs, and the engine test asserts `y = 2.2 + 0.6x`.
- Verified category id exists for `regression-correlation`.
- Verified purity grep over `src/calc` for `window`, `document`, `fetch`, and `astro:` returned no matches.

**Blocked / couldn't do / decisions made:**
- No blockers. No schema/client changes were needed because existing `numberList` handling already supports multiple fields.

---

## Review  *(Claude writes -- accept or send back)*

- **Reviewed:** 2026-06-17
- **Verdict:** CLOSED

**Notes / what to improve:**
- Verified against artifacts. `_regression-core.ts` is pure (grep clean) and does
  exactly the briefed job: validates both lists are present, finite, equal length,
  length >= 2 (returns null otherwise) and returns n / sums / means / Sxx / Syy / Sxy
  in one pass. No new input type was added -- two parallel `numberList` inputs (x, y)
  drive both engines, as intended.
- `correlation` returns Pearson r with rSquared + n and guards zero variance in
  either list; `linear-regression` returns slope/intercept/r/rSquared/n and sets
  `text` to the fitted equation, guarding Sxx==0. Tests assert the corrected anchors
  for x=[1,2,3,4,5], y=[2,4,5,4,5]: slope 0.6, intercept 2.2, r approx 0.7746,
  rSquared approx 0.6, and text exactly "y = 2.2 + 0.6x"; plus the perfect-line case
  (slope 2, intercept 1, r 1) and the error paths (unequal length, single point,
  constant x). Config category `regression-correlation` exists; the two textareas
  carry distinct labels/placeholders.
- Gates re-run clean: `astro check` 0/0/0; `npm test` 28 files / 77 tests;
  `npm run build` 32 pages / 908 links / 0 violations; both new standalone pages
  exist in `dist/`. The client appends `result.text` after the numeric `<dl>`, so the
  regression equation renders below the outputs as designed.
