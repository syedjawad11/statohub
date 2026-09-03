Status: CLOSED
<!-- TODO | IN_PROGRESS | DONE | CHANGES_REQUESTED | CLOSED -->

# TASK-016 -- Inferential calculators (t / chi-square distributions) + proportion solver

- **Owner of this stage:** Codex
- **Repo:** `Desktop/statohub/` (where the work happens)
- **Created:** 2026-06-17 by Claude

<!-- Authoring note (Claude): keep this file plain ASCII. Use `--` not an em
dash, `->` not an arrow, `...` not an ellipsis. -->

---

## Brief  *(Claude writes -- what Codex needs to execute)*

**Goal:** Build the final 5 standalone calculators (p-value, t-test, chi-square,
t-table, proportion) and add the remaining numerical foundation they need: the
Student-t and chi-square distribution functions in the existing `src/calc/_stats-math.ts`.
This is the last calculator batch -- after it the full standalone set is shipped.

**Context / inputs:**
- Engine contract `src/calc/types.ts` (`CalcResult`). Structured-output fields
  (`text`, `list`, `table`) exist from TASK-012; the `select` input type exists from
  TASK-013; the normal CDF / inverse-normal helpers (`normalCdf`, `inverseNormalCdf`,
  `zCritical`, `erf`) live in `src/calc/_stats-math.ts` from TASK-014 -- REUSE all of
  these, do NOT re-introduce them.
- Pattern reference for select-driven multi-mode engines: `src/calc/normal-distribution.ts`
  + `binomial.ts`. Pattern for two parallel `numberList` inputs (no new input type):
  `src/calc/correlation.ts` + `_regression-core.ts`.
- Render layer `src/components/statcalc/client.ts`, `src/components/StatCalc.astro`.
  Schema `src/content/config.ts` (already supports number / numberList / select).
- Planned set: `content-ops/seed.json` -- `p-value` (engine `p-value`), `t-test`
  (engine `t-test`), `chi-square` (engine `chi-square`), `t-table` (engine `t-table`),
  `proportion` (engine `proportion`).
- **Category note (important):** the seed lists proportion under category slug
  `statistics-basics`, but NO such category file exists in the repo. The repo's
  foundations category id is `foundations` (`src/content/categories/foundations.yaml`).
  Use `category: foundations` for proportion. The other four use
  `category: inferential-statistics` (that file exists). Verify both before wiring.

**Foundation to add FIRST (extend `src/calc/_stats-math.ts`, fully unit-tested before
any calculator depends on it):**
- Keep the module pure -- no DOM / window / document / fetch / astro: imports anywhere
  under `src/calc/**` (grep must stay clean). No new runtime dependency -- write the
  approximations yourself. Add:
  - `logGamma(x: number): number` -- log-gamma (Lanczos approximation; document source).
  - `lowerRegularizedGamma(s: number, x: number): number` -- regularized lower incomplete
    gamma P(s, x), via the series expansion for x < s + 1 and the continued fraction
    (Lentz) otherwise (Numerical Recipes `gammp`). Used for the chi-square CDF.
  - `chiSquareCdf(x: number, df: number): number` -- `= lowerRegularizedGamma(df / 2, x / 2)`;
    return 0 for x <= 0, guard df < 1 / non-finite.
  - `regularizedIncompleteBeta(x: number, a: number, b: number): number` -- I_x(a, b)
    via the continued fraction (Numerical Recipes `betai` / `betacf`). Used for the
    Student-t CDF.
  - `studentTCdf(t: number, df: number): number` -- two-tailed-symmetric Student-t CDF
    built from `regularizedIncompleteBeta`; `studentTCdf(0, df) === 0.5`; guard df < 1 /
    non-finite.
  - `inverseStudentTCdf(p: number, df: number): number` -- quantile via bisection on
    `studentTCdf` (accuracy ~1e-6; guard p outside (0,1)).
  - `tCritical(confidenceLevel: number, df: number, tails: 1 | 2): number` -- critical t;
    for two-tailed use `inverseStudentTCdf(1 - (1 - level) / 2, df)`, for one-tailed
    `inverseStudentTCdf(level, df)`.
- Unit-test the new math directly in `src/calc/__tests__/_stats-math.test.ts` (extend the
  existing file) against known values BEFORE the calculators use them:
  `studentTCdf(0, 10)` = 0.5; `chiSquareCdf(3.84146, 1)` approx 0.95 (so upper tail
  approx 0.05); `chiSquareCdf(2, 1)` approx 0.8427; `tCritical(0.95, 10, 2)` approx 2.228;
  `tCritical(0.95, 1, 2)` approx 12.706; large-df sanity `tCritical(0.95, 100000, 2)`
  approx 1.96 (toBeCloseTo, 2 dp).

**Deliverables (5 calculators):**
- [ ] Engine `src/calc/p-value.ts` (export `pValue`) + test. Inputs: `statistic`
      (number), `df` (number, used only for the t distribution), a `distribution` select
      (`z` standard normal / `t` Student-t), and a `tail` select (`left` P(<=stat),
      `right` P(>=stat), `two` two-sided). For z use `normalCdf`; for t use `studentTCdf`
      (requires df >= 1). Output `value` = the p-value; `outputs` echo the `statistic`
      and (for t) `df`. Guard: non-finite statistic, t-distribution with df < 1 ->
      clean null + error. Register as `p-value`. Config `p-value.yaml` (standalone,
      category `inferential-statistics`, keyword "p value calculator").
- [ ] Engine `src/calc/t-test.ts` (export `tTest`) + test. One-sample t-test. Inputs:
      `sampleMean` (number), `populationMean` (number, the hypothesized mu0), `sampleSd`
      (number), `n` (number). Compute `t = (sampleMean - populationMean) / (sampleSd /
      sqrt(n))`, `df = n - 1`, two-tailed `pValue = 2 * (1 - studentTCdf(abs(t), df))`.
      Output `value` = `t`; `outputs` = `t`, `df`, `pValue`, `standardError`. Guard
      sampleSd <= 0, n < 2 (or non-integer), non-finite -> clean null + error. Register
      as `t-test`. Config `t-test.yaml` (standalone, category `inferential-statistics`,
      keyword "t-test calculator").
- [ ] Engine `src/calc/chi-square.ts` (export `chiSquare`) + test. Goodness-of-fit.
      Inputs: `observed` (numberList) and `expected` (numberList) -- two parallel lists
      (same no-new-input-type pattern as correlation). Compute
      `statistic = sum((O - E)^2 / E)`, `df = k - 1` (k = number of categories), upper-tail
      `pValue = 1 - chiSquareCdf(statistic, df)`. Output `value` = `statistic`; `outputs`
      = `statistic`, `df`, `pValue`. Guard: lists absent / unequal length / length < 2,
      any expected <= 0, non-finite -> clean null + error. Register as `chi-square`.
      Config `chi-square.yaml` (standalone, category `inferential-statistics`, keyword
      "chi square calculator"; two numberList inputs `observed` and `expected` with
      distinct labels/placeholders).
- [ ] Engine `src/calc/t-table.ts` (export `tTable`) + test. Critical-t lookup. Inputs:
      `df` (number), a `level` select (confidence 0.90 / 0.95 / 0.99; values
      "0.9"/"0.95"/"0.99" -- parse with Number, select values arrive as strings), and a
      `tails` select (`2` two-tailed / `1` one-tailed). Output `value` = critical t via
      `tCritical(level, df, tails)`; `outputs` echo `df` and the `alpha` (1 - level).
      Guard df < 1 (or non-integer), bad level -> clean null + error. Register as
      `t-table`. Config `t-table.yaml` (standalone, category `inferential-statistics`;
      seed has no tool_keyword -- omit a primary tool keyword, use descriptive `keywords`
      such as "t table", "t distribution table", "critical t value calculator").
- [ ] Engine `src/calc/proportion.ts` (export `proportion`) + test. Proportion (ratio)
      solver in the algebra sense a/b = c/d: inputs `a`, `b`, `c` (numbers); solve for the
      missing fourth term `d = (b * c) / a`. Output `value` = `d`; `outputs` = `d` and the
      decimal ratio `ratio` (= c / d, equivalently a / b); set `text` to the solved
      proportion string, e.g. "2 / 3 = 4 / 6". Guard a == 0 (division by zero), non-finite
      -> clean null + error. Register as `proportion`. Config `proportion.yaml`
      (standalone, category `foundations`, keyword "proportion calculator").
- [ ] Updated `src/calc/_stats-math.ts`, `src/calc/registry.ts` (5 new keys), and the 5
      YAML configs.

**Constraints:**
- Stay in this repo; do not touch sibling folders. Do NOT edit `CLAUDE.md`.
- Engines + `_stats-math.ts` stay pure: no DOM / window / document / fetch / astro:
  imports anywhere under `src/calc/**` (a grep for those tokens must stay clean).
- No new runtime dependencies.
- Reuse the existing `select` input type, the structured-output fields, and the existing
  `_stats-math.ts` helpers -- do not add new schema fields or input types in this task.
- `category:` ids must match existing files under `src/content/categories/` -- use
  `inferential-statistics` for four and `foundations` for proportion (NOT the seed's
  `statistics-basics`, which has no category file). Verify both first.
- Select values are STRINGS in the engine input (the client passes them raw). Parse the
  `level` select in t-table with `Number(...)`; compare the `distribution`/`tail`/`tails`
  selects as strings.

**Definition of done / how to verify:**
- `npx astro check` 0/0/0; `npm test` green incl. the extended `_stats-math` test and the
  5 new engine tests with known values. Suggested calculator anchors:
  `pValue({statistic:1.96, distribution:'z', tail:'two'}).value` approx 0.05;
  `pValue({statistic:1.645, distribution:'z', tail:'right'}).value` approx 0.05;
  `chiSquare({observed:[20,30], expected:[25,25]})` -> statistic = 2, df = 1, pValue
  approx 0.1573; `tTable({df:10, level:'0.95', tails:'2'}).value` approx 2.228;
  `proportion({a:2, b:3, c:4}).value` = 6 (text "2 / 3 = 4 / 6"); a one-sample
  `tTest` on a known dataset (e.g. sampleMean 105, populationMean 100, sampleSd 15,
  n 25 -> t approx 1.667, df 24).
- `npm run build` succeeds, 0 link violations; the 5 new standalone pages exist in
  `dist/calculators/{p-value,t-test,chi-square,t-table,proportion}/`.
- A select-driven page switches output when the dropdown changes (p-value z vs t, or
  tail left vs two; verify via preview or the built DOM).
- Confirm existing calculators (mean, standard-deviation, normal-distribution,
  correlation) are unchanged by the render/build.

---

## Work Log  *(Codex writes -- what was actually done)*

- **Started:** 2026-06-17
- **Finished:** 2026-06-17

**What changed (files + where):**
- Extended `src/calc/_stats-math.ts` with pure log-gamma, regularized gamma,
  chi-square CDF, regularized incomplete beta, Student-t CDF/quantile, and
  critical-t helpers. Added direct anchors to `src/calc/__tests__/_stats-math.test.ts`
  before wiring calculators to the helpers.
- Added five pure calculator engines plus tests:
  `src/calc/p-value.ts`, `t-test.ts`, `chi-square.ts`, `t-table.ts`, and
  `proportion.ts`, with tests under `src/calc/__tests__/`.
- Registered the five new engine keys in `src/calc/registry.ts`.
- Added standalone calculator configs:
  `src/content/calculators/p-value.yaml`, `t-test.yaml`, `chi-square.yaml`,
  `t-table.yaml`, and `proportion.yaml`.
- Regenerated `src/lib/content-route-ids.ts` via the build so the five new
  calculator route ids are included.

**How to verify:**
- `npx vitest run src/calc/__tests__/_stats-math.test.ts` first hit the expected
  Windows sandbox `spawn EPERM`; reran with process-spawn approval and passed
  1 file / 6 tests.
- Focused TASK-016 suite:
  `npx vitest run src/calc/__tests__/_stats-math.test.ts src/calc/__tests__/p-value.test.ts src/calc/__tests__/t-test.test.ts src/calc/__tests__/chi-square.test.ts src/calc/__tests__/t-table.test.ts src/calc/__tests__/proportion.test.ts`
  passed 6 files / 16 tests.
- `npx astro check` passed with 0 errors, 0 warnings, 0 hints.
- `npm test` passed with 33 files / 89 tests.
- `npm run build` passed; generated 37 pages and `check-links` scanned 37 pages,
  checked 1048 internal links, and found 0 violations.
- Confirmed the new built pages exist at
  `dist/calculators/{p-value,t-test,chi-square,t-table,proportion}/index.html`.
- `rg -n "\b(window|document|fetch)\b|astro:" src\calc` returned no matches.

**Blocked / couldn't do / decisions made:**
- Used `category: inferential-statistics` for p-value, t-test, chi-square, and
  t-table; used `category: foundations` for proportion after verifying both
  category files exist and `statistics-basics` does not.
- No new runtime dependencies, schema fields, or input types were added. Select
  values remain string-parsed in engines where needed.
- Did not edit `CLAUDE.md`, commit, push, or touch sibling folders.

---

## Review  *(Claude writes -- accept or send back)*

- **Reviewed:** 2026-06-17
- **Verdict:** CLOSED

**Notes / what to improve:**
- Verified against artifacts, not just the Work Log. `_stats-math.ts` stays pure
  (purity grep over `src/calc/**` for window/document/fetch/astro:/require clean)
  and now exports the full inferential foundation: `logGamma` (Lanczos),
  `lowerRegularizedGamma`, `chiSquareCdf` (= lowerRegularizedGamma(df/2, x/2)),
  `regularizedIncompleteBeta`, `studentTCdf`, `inverseStudentTCdf` (bisection),
  and `tCritical`. The extended `_stats-math` test asserts the anchors
  (studentTCdf(0,df)=0.5, chiSquareCdf(3.84146,1) approx 0.95, tCritical(0.95,10,2)
  approx 2.228, tCritical(0.95,1,2) approx 12.706, large-df -> ~1.96).
- All 5 engines reuse the shared module and guard cleanly (null + error, never
  throw): p-value (z via normalCdf / t via studentTCdf, left/right/two tails),
  one-sample t-test (t, df=n-1, two-tailed p, standardError), chi-square
  goodness-of-fit (two parallel numberList inputs, stat = sum((O-E)^2/E), df=k-1,
  upper-tail p), t-table (Number-parsed level select + tails select -> tCritical),
  and proportion (a/b=c/d solver, value=d, text "a / b = c / d"). chi-square
  spot-checked: [20,30] vs [25,25] -> statistic 2, df 1, p approx 0.1573.
- Category trap avoided as briefed: proportion uses `foundations` (verified the
  seed's `statistics-basics` has no category file); the other four use
  `inferential-statistics`. Both category files exist.
- Gates re-run clean from a fresh state: purity grep clean; `astro check` 0/0/0
  (15 files); `npm test` 33 files / 89 tests; `npm run build` 37 pages,
  check-links scanned 1048 internal links, 0 violations. All 5 new standalone
  pages built to `dist/calculators/{p-value,t-test,chi-square,t-table,proportion}/`.
  This completes the full standalone calculator set (26 engines registered).
