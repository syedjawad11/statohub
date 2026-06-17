Status: CLOSED
<!-- TODO | IN_PROGRESS | DONE | CHANGES_REQUESTED | CLOSED -->

# TASK-014 -- Normal-family calculators + shared stats-math (normal CDF) module

- **Owner of this stage:** Codex
- **Repo:** `Desktop/statohub/` (where the work happens)
- **Created:** 2026-06-17 by Claude

<!-- Authoring note (Claude): keep this file plain ASCII. Use `--` not an em
dash, `->` not an arrow, `...` not an ellipsis. -->

---

## Brief  *(Claude writes -- what Codex needs to execute)*

**Goal:** Build 4 standalone calculators that all rest on the normal distribution, and
introduce the one shared piece of foundation they need: a pure numerical-math module
(`src/calc/_stats-math.ts`) exposing the normal CDF and its inverse. Every later
distribution/inferential task (TASK-016) reuses this module, so get the approximations
right and tested here.

**Context / inputs:**
- Engine contract `src/calc/types.ts` (`CalcResult`, `CalcEngine`). Structured-output
  fields (`text`, `outputs`) were added in TASK-012; the `select` input type was added in
  TASK-013 -- reuse both, do NOT re-introduce them.
- Render layer `src/components/statcalc/client.ts`, `src/components/StatCalc.astro`.
  Schema `src/content/config.ts` (already supports `number` / `numberList` / `select`).
- Pattern reference for a select-driven, multi-mode engine: `src/calc/binomial.ts` +
  `src/content/calculators/binomial-distribution.yaml` (mode dropdown -> different output).
- Pattern reference for a shared pure helper module: `src/calc/combinatorics-core.ts`.
- Planned set: `content-ops/seed.json` -- `normal-distribution`, `z-table`,
  `confidence-interval`, `sample-size`.

**Foundation to add (do this FIRST, fully unit-tested before wiring any calculator):**
- New file `src/calc/_stats-math.ts`. Pure math only -- NO DOM, no `window`/`document`,
  no `fetch`, no `astro:` imports (same purity rule as every `src/calc/**` file). No new
  runtime dependency. Export at least:
  - `erf(x: number): number` -- error function (Abramowitz-Stegun 7.1.26 rational
    approximation is fine; document the source in a comment).
  - `normalCdf(x: number, mean = 0, sd = 1): number` -- cumulative P(X <= x) via `erf`.
  - `normalPdf(x: number, mean = 0, sd = 1): number` -- density (used for display only;
    optional but cheap).
  - `inverseNormalCdf(p: number, mean = 0, sd = 1): number` -- quantile / probit. Use a
    well-known rational approximation (Acklam or Beasley-Springer-Moro); accuracy to ~1e-6
    is plenty. Guard p outside (0,1).
  - `zCritical(confidenceLevel: number): number` -- two-sided critical z for a confidence
    level given as a proportion (e.g. 0.95 -> ~1.95996); implement as
    `inverseNormalCdf(1 - (1 - level) / 2)`.
- Unit-test this module directly (`src/calc/__tests__/_stats-math.test.ts`) against known
  values BEFORE the calculators depend on it: `normalCdf(0) = 0.5`,
  `normalCdf(1.96) approx 0.975` (toBeCloseTo, 4 dp), `normalCdf(-1) approx 0.1587`,
  `inverseNormalCdf(0.975) approx 1.95996`, `zCritical(0.95) approx 1.95996`,
  `zCritical(0.99) approx 2.57583`. Round-trip: `inverseNormalCdf(normalCdf(0.7))` approx 0.7.

**Deliverables (4 calculators):**
- [ ] Engine `src/calc/normal-distribution.ts` (export `normalDistribution`) + test.
      Inputs: `mean` (number), `sd` (number), `x` (number), `upper` (number, used only in
      the between mode), and a `mode` select with options:
      `lessThan` = P(X < x), `greaterThan` = P(X > x), `between` = P(x < X < upper).
      Output `value` = the probability; include the z-score(s) in `outputs`
      (e.g. `z` for the single-bound modes; `zLower`/`zUpper` for between). Guard sd <= 0,
      non-finite inputs, and (between mode) upper <= x -> clean null + error. Register as
      `normal-distribution`. Config `normal-distribution.yaml` (standalone,
      category `probability-distributions`, keyword "normal distribution calculator").
- [ ] Engine `src/calc/z-table.ts` (export `zTable`) + test. Input: `z` (number). Output
      `value` = P(Z < z) (left-tail / cumulative); `outputs` also give `rightTail`
      (P(Z > z) = 1 - cdf) and `betweenZeroAndZ` (cdf - 0.5). Register as `z-table`. Config
      `z-table.yaml` (standalone, category `probability-distributions`; seed has no
      `tool_keyword` -- omit a primary tool keyword and use descriptive `keywords` such as
      "z table", "z score table", "standard normal table").
- [ ] Engine `src/calc/confidence-interval.ts` (export `confidenceInterval`) + test.
      z-based interval for a mean (large-sample / known-sigma intro form). Inputs: `mean`
      (sample mean, number), `sd` (number), `n` (sample size, number), and a `level` select
      with options 0.90 / 0.95 / 0.99 (values "0.9","0.95","0.99"; remember select values
      arrive as strings -- parse with Number in the engine). Compute
      `z = zCritical(level)`, standard error `se = sd / sqrt(n)`, margin `E = z * se`.
      Output `value` = `E` (margin of error); `outputs` = `lower` (mean - E),
      `upper` (mean + E), `standardError`, `z`. Guard n < 1 (or non-integer), sd < 0,
      non-finite -> clean null + error. Register as `confidence-interval`. Config
      `confidence-interval.yaml` (standalone, category `inferential-statistics`; seed has no
      `tool_keyword` -- descriptive `keywords` like "confidence interval calculator").
- [ ] Engine `src/calc/sample-size.ts` (export `sampleSize`) + test. Sample size to
      estimate a population proportion. Inputs: a `level` select (0.90 / 0.95 / 0.99),
      `margin` (margin of error E as a proportion, e.g. 0.05, number), and `p` (estimated
      proportion, number, default "0.5"). Compute `z = zCritical(level)`,
      `n = z^2 * p * (1 - p) / E^2`, then round UP (`Math.ceil`). Output `value` = required
      `n`; `outputs` may include the unrounded `nRaw` and `z`. Guard E <= 0, p outside
      [0,1], non-finite -> clean null + error. Register as `sample-size`. Config
      `sample-size.yaml` (standalone, category `inferential-statistics`, keyword
      "sample size calculator").
- [ ] Updated `src/calc/registry.ts` (4 new keys) and the 4 YAML configs.

**Constraints:**
- Stay in this repo; do not touch sibling folders. Do NOT edit `CLAUDE.md`.
- Engines + `_stats-math.ts` stay pure: no DOM / window / document / fetch / astro: imports
  anywhere under `src/calc/**` (a grep for those tokens over `src/calc/**` must stay clean).
- No new runtime dependencies (write the approximations yourself).
- Reuse the existing `select` input type and structured-output fields -- do not add new
  schema fields or input types in this task.
- `category:` ids must match existing files under `src/content/categories/` (verify first:
  `probability-distributions` and `inferential-statistics` both exist).
- Select values are STRINGS in the engine input (the client passes them raw). Parse the
  `level` select with `Number(...)` inside the confidence-interval and sample-size engines.

**Definition of done / how to verify:**
- `npx astro check` 0/0/0; `npm test` green incl. the `_stats-math` test and the 4 new
  engine tests with known values. Suggested anchors:
  `normalDistribution({mean:0,sd:1,x:1.96,mode:'lessThan'}).value` approx 0.975;
  `zTable({z:0}).value` = 0.5; `confidenceInterval({mean:100,sd:15,n:100,level:'0.95'})` ->
  E approx 2.94 (z*15/10), lower approx 97.06, upper approx 102.94;
  `sampleSize({level:'0.95',margin:0.05,p:0.5}).value` = 385.
- `npm run build` succeeds, 0 link violations; the 4 new standalone pages exist in
  `dist/calculators/{normal-distribution,z-table,confidence-interval,sample-size}/`.
- The select-driven `normal-distribution` page switches output when the mode dropdown
  changes (lessThan vs greaterThan must differ; verify via preview or the built DOM).
- Confirm existing calculators (mean, standard-deviation, binomial, frequency-table) are
  unchanged by the render/build.

---

## Work Log  *(Codex writes -- what was actually done)*

- **Started:** 2026-06-17
- **Finished:** 2026-06-17

**What changed (files + where):**
- Added `src/calc/_stats-math.ts` with pure `erf`, `normalCdf`, `normalPdf`, `inverseNormalCdf`, and `zCritical` helpers using Abramowitz-Stegun and Acklam approximations.
- Added standalone normal-family engines in `src/calc/normal-distribution.ts`, `src/calc/z-table.ts`, `src/calc/confidence-interval.ts`, and `src/calc/sample-size.ts`.
- Registered the new engines in `src/calc/registry.ts`.
- Added direct unit tests for the shared math module and all four engines under `src/calc/__tests__/`.
- Added standalone calculator configs in `src/content/calculators/normal-distribution.yaml`, `z-table.yaml`, `confidence-interval.yaml`, and `sample-size.yaml`.

**How to verify:**
- `npm test -- --run src/calc/__tests__/_stats-math.test.ts src/calc/__tests__/normal-distribution.test.ts src/calc/__tests__/z-table.test.ts src/calc/__tests__/confidence-interval.test.ts src/calc/__tests__/sample-size.test.ts` initially hit expected Windows `spawn EPERM`, then passed with approval: 5 files, 12 tests.
- `npx astro check` passed: 0 errors, 0 warnings, 0 hints.
- `npm test` initially hit expected Windows `spawn EPERM`, then passed with approval: 25 files, 69 tests.
- `npm run build` passed: 30 pages built, 0 link violations.
- Verified generated pages exist under `dist/calculators/{normal-distribution,z-table,confidence-interval,sample-size}/`.
- Verified `normal-distribution` built DOM includes the `lessThan`, `greaterThan`, and `between` select options; engine tests confirm less-than and greater-than modes differ.
- Verified category ids exist for `probability-distributions` and `inferential-statistics`.
- Verified purity grep over `src/calc` for `window`, `document`, `fetch`, and `astro:` returned no matches.

**Blocked / couldn't do / decisions made:**
- No blockers. The expected sandbox spawn approval was needed for Vitest.

---

## Review  *(Claude writes -- accept or send back)*

- **Reviewed:** 2026-06-17
- **Verdict:** CLOSED

**Notes / what to improve:**
- Verified against artifacts, not just the Work Log. `_stats-math.ts` is pure (no
  DOM / window / fetch / astro: anywhere in `src/calc/**`, grep clean) and exposes
  `erf` (Abramowitz-Stegun 7.1.26), `normalCdf`, `normalPdf`, `inverseNormalCdf`
  (Acklam rational approximation, guards p outside (0,1)), and `zCritical`. The
  direct module test asserts the anchors: normalCdf(0)=0.5, normalCdf(1.96) approx
  0.975, normalCdf(-1) approx 0.1587, inverseNormalCdf(0.975) approx 1.95996,
  zCritical(0.95) approx 1.95996, zCritical(0.99) approx 2.57583, plus a round-trip.
- All 4 engines reuse the shared module and guard correctly: normal-distribution
  handles the lessThan/greaterThan/between select modes (between rejects upper<=x,
  emits zLower/zUpper); z-table returns cumulative + rightTail + betweenZeroAndZ;
  confidence-interval and sample-size parse the string `level` select with Number()
  and round sample size up with Math.ceil. Calculator anchors assert
  sampleSize(0.95,0.05,0.5)=385 (nRaw approx 384.1459) and CI z approx 1.95996. The
  select-driven configs are well-formed; categories `probability-distributions` and
  `inferential-statistics` exist.
- Gates re-run clean: `astro check` 0/0/0; `npm test` 28 files / 77 tests;
  `npm run build` 32 pages / 908 links / 0 violations; all 4 new standalone pages
  exist in `dist/`. Solid foundation for the TASK-016 inferential work.
