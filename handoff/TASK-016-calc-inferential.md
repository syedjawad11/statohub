Status: TODO
<!-- TODO | IN_PROGRESS | DONE | CHANGES_REQUESTED | CLOSED -->

# TASK-016 -- Inferential calculators (t-test, chi-square, sample-size, CI, proportion)

- **Owner of this stage:** Codex
- **Repo:** `Desktop/statohub/` (where the work happens)
- **Created:** 2026-06-17 by Claude

<!-- Authoring note (Claude): keep this file plain ASCII. Use `--` not an em
dash, `->` not an arrow, `...` not an ellipsis. -->

---

## Brief  *(Claude writes -- what Codex needs to execute)*

**Goal:** Build the final 5 standalone inferential calculators: t-test, chi-square,
sample-size, confidence-interval, proportion. This batch reuses the shared math module from
TASK-014 and extends it with a chi-square CDF. After this task the full planned calculator
set is live.

**Context / inputs:**
- Shared math module `src/calc/_stats-math.ts` (from TASK-014: normalCdf, inverseNormalCdf,
  tCdf, regularized incomplete beta). Reuse it. The `select` input type (TASK-013), the
  `table`/`text` output fields (TASK-012), and the t-distribution CDF (TASK-014) all exist.
- Engine contract `src/calc/types.ts`; schema `src/content/config.ts`; render layer
  `src/components/statcalc/client.ts`, `src/components/StatCalc.astro`.
- Planned set: `content-ops/seed.json` (`t-test`, `chi-square`, `sample-size`,
  `confidence-interval`, `proportion`).

**Foundation to add:** extend `src/calc/_stats-math.ts` with `chiSquareCdf(x, df)` (via the
regularized lower incomplete gamma function `gammp`/`gammq`, Numerical Recipes style) and
unit-test it (e.g. chiSquareCdf(3.841, 1) approx 0.95). Keep it pure; not a registered
engine.

**Deliverables:**
- [ ] Engine `src/calc/t-test.ts` (export `tTest`) + test -- a `mode` select: one-sample,
      two-sample (independent), paired. Inputs adapt by mode using numberList sample(s)
      (and a hypothesized mean for one-sample). Returns the t statistic, degrees of freedom,
      and p-value (via `tCdf`) as numeric `outputs`. Register. Config `t-test.yaml`
      (standalone, category `inferential-statistics`, keyword "t-test calculator").
- [ ] Engine `src/calc/chi-square.ts` (export `chiSquare`) + test -- a `mode` select:
      goodness-of-fit (observed vs expected numberLists) and independence (a contingency
      table). Returns the chi-square statistic, df, and p-value (via `chiSquareCdf`); for
      independence also return the expected-counts `table`. Register. Config
      `chi-square.yaml` (standalone, category `inferential-statistics`, keyword
      "chi square calculator"). For the contingency-table input, define a pragmatic input
      shape (e.g. rows entered as numberLists, or a documented delimited textarea) and
      document it in the config + a comment.
- [ ] Engine `src/calc/sample-size.ts` (export `sampleSize`) + test -- inputs: confidence
      level (select: 90/95/99 percent), margin of error (number), population proportion
      (number, default 0.5), optional finite population (number). Returns required n (round
      up). Uses `inverseNormalCdf` for the z critical value. Register. Config
      `sample-size.yaml` (standalone, category `inferential-statistics`, keyword
      "sample size calculator").
- [ ] Engine `src/calc/confidence-interval.ts` (export `confidenceInterval`) + test --
      inputs: sample mean (number), sample sd (number), n (number), confidence level
      (select). Returns lower and upper bounds + margin of error as numeric `outputs`. Use
      t critical for small n (df=n-1) via the math module. Register. Config
      `confidence-interval.yaml` (standalone, category `inferential-statistics`).
- [ ] Engine `src/calc/proportion.ts` (export `proportion`) + test -- educational
      ratio/proportion solver: inputs a, b, c with one unknown (solve a/b = c/x for x), OR a
      simpler documented design -- pick one and document it. Returns the solved value.
      Register. Config `proportion.yaml` (standalone, category `statistics-basics`, keyword
      "proportion calculator").
- [ ] Updated `src/calc/_stats-math.ts` (+ test), `registry.ts`, and any minimal render
      tweak only if genuinely required.

**Constraints:**
- Stay in this repo; do not touch sibling folders. Do NOT edit `CLAUDE.md`.
- Engines and `_stats-math.ts` stay pure (no DOM / window / document / fetch / astro:
  imports in `src/calc/**`).
- No new runtime dependencies.
- Validate inputs and return `value: null` + a clear error for invalid cases (n<=1, sd<0,
  negative counts, margin<=0, etc.) -- never crash or emit NaN/Infinity to the UI.
- `category:` ids must match existing files under `src/content/categories/` (verify first).

**Definition of done / how to verify:**
- `npx astro check` 0/0/0; `npm test` green incl. the chiSquareCdf test and 5 new engine
  tests with known textbook values (e.g. one-sample t for a known dataset; chi-square
  goodness-of-fit on a documented example; 95% CI bounds for a known mean/sd/n;
  sample-size for 95%/ME 0.05/p 0.5 = 385).
- `npm run build` succeeds, 0 link violations; all 5 new standalone pages exist in `dist/`.
- After this task, confirm every `standalone:true` calculator in `content-ops/seed.json`
  has a corresponding `/calculators/{slug}/` page in `dist/` (the calculator set is
  complete). Note any intentional remaining gaps in the Work Log.

---

## Work Log  *(Codex writes -- what was actually done)*

- **Started:** <YYYY-MM-DD>
- **Finished:** <YYYY-MM-DD>

**What changed (files + where):**
- <path> -- <what + why>

**How to verify:**
- <exact command / steps you ran and the result>

**Blocked / couldn't do / decisions made:**
- <anything Claude should know -- or "none">

---

## Review  *(Claude writes -- accept or send back)*

- **Reviewed:** <YYYY-MM-DD>
- **Verdict:** <CLOSED | CHANGES_REQUESTED>

**Notes / what to improve:**
- <specifics if sending back; or what was good if closing>
