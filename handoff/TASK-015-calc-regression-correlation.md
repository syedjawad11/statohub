Status: TODO
<!-- TODO | IN_PROGRESS | DONE | CHANGES_REQUESTED | CLOSED -->

# TASK-015 -- Regression and correlation (paired x/y inputs)

- **Owner of this stage:** Codex
- **Repo:** `Desktop/statohub/` (where the work happens)
- **Created:** 2026-06-17 by Claude

<!-- Authoring note (Claude): keep this file plain ASCII. Use `--` not an em
dash, `->` not an arrow, `...` not an ellipsis. -->

---

## Brief  *(Claude writes -- what Codex needs to execute)*

**Goal:** Build 2 standalone calculators that operate on PAIRED data (two equal-length
number lists, x and y): the correlation coefficient and simple linear regression. Small,
focused batch; no new input infra is required (two `numberList` inputs already work).

**Context / inputs:**
- Engine contract `src/calc/types.ts`; the `text` output field (for an equation string) was
  added in TASK-012 -- reuse it. Render layer `src/components/statcalc/client.ts`.
- Schema `src/content/config.ts` (no change needed -- declare two `numberList` inputs).
- Planned set: `content-ops/seed.json` (`correlation-coefficient`, `linear-regression`).

**Paired-input note:** declare `inputs` as two `numberList` fields named `x` and `y`. The
engine receives `{ x: number[], y: number[] }`. The engine MUST validate that x and y are
non-empty, equal length, and finite; otherwise return `value: null` with a clear error
(e.g. "x and y must have the same number of values").

**Deliverables:**
- [ ] Engine `src/calc/correlation.ts` (export `correlation`) + test -- computes the Pearson
      correlation coefficient r, plus r-squared and covariance as numeric `outputs`.
      Register. Config `correlation-coefficient.yaml` (standalone, category
      `regression-correlation`, two numberList inputs x and y, keyword
      "correlation coefficient calculator").
- [ ] Engine `src/calc/linear-regression.ts` (export `linearRegression`) + test -- computes
      slope (b) and intercept (a) of the least-squares line y = a + b*x, plus r-squared as
      numeric `outputs`, and an equation string like "y = a + b x" in the `text` field.
      Register. Config `linear-regression.yaml` (standalone, category
      `regression-correlation`, two numberList inputs x and y, keyword
      "linear regression calculator").
- [ ] Updated `registry.ts`.

**Constraints:**
- Stay in this repo; do not touch sibling folders. Do NOT edit `CLAUDE.md`.
- Engines stay pure (no DOM / window / document / fetch / astro: imports in `src/calc/**`).
- No new runtime dependencies.
- Do not change the render layer unless the `text` output from TASK-012 is missing; if it
  is missing, STOP and note it (it should exist).

**Definition of done / how to verify:**
- `npx astro check` 0/0/0; `npm test` green incl. 2 new engine tests. Use a known fixture,
  e.g. x=[1,2,3,4,5], y=[2,4,5,4,5]: r approx 0.7746, slope = 0.6, intercept = 2.2.
- `npm run build` succeeds, 0 link violations; `dist/calculators/correlation-coefficient/`
  and `dist/calculators/linear-regression/` pages exist.
- Manual sanity: entering the fixture above yields the regression equation string and the r
  value in the results region; mismatched-length x/y shows the validation error, not a crash.

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
