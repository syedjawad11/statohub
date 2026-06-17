Status: TODO
<!-- TODO | IN_PROGRESS | DONE | CHANGES_REQUESTED | CLOSED -->

# TASK-014 -- Normal family + lookups + shared CDF math module

- **Owner of this stage:** Codex
- **Repo:** `Desktop/statohub/` (where the work happens)
- **Created:** 2026-06-17 by Claude

<!-- Authoring note (Claude): keep this file plain ASCII. Use `--` not an em
dash, `->` not an arrow, `...` not an ellipsis. -->

---

## Brief  *(Claude writes -- what Codex needs to execute)*

**Goal:** Build 4 standalone calculators around the normal and t distributions
(normal-distribution, z-table, t-table, p-value), and introduce the shared numerical-math
module that these and TASK-016 depend on.

**Context / inputs:**
- Engine contract `src/calc/types.ts`; `select` input type was added in TASK-013 -- reuse it.
- Schema `src/content/config.ts`; render layer `src/components/statcalc/client.ts`,
  `src/components/StatCalc.astro`.
- Planned set: `content-ops/seed.json` (`normal-distribution`, `z-table`, `t-table`,
  `p-value`).

**Foundation to add (do this FIRST):**
- Create `src/calc/_stats-math.ts` -- a pure helper module (NOT a registered engine) with:
  - `normalCdf(z)` (standard normal CDF; use a well-known approximation, e.g. an
    Abramowitz-Stegun erf approximation or the Zelen-Severo formula -- accuracy to ~1e-7).
  - `normalPdf(z)`, and `inverseNormalCdf(p)` (Acklam or Beasley-Springer-Moro algorithm).
  - `tCdf(t, df)` (Student t CDF via the regularized incomplete beta function) and a
    `tInverse`/critical-value helper for the t-table.
  - Implement the regularized incomplete beta `betacf`/`betai` (Numerical Recipes style) as
    a private helper -- it is reused for t and (in TASK-016) chi-square.
- Unit-test `_stats-math.ts` directly against textbook values (normalCdf(1.96) approx
  0.9750, normalCdf(0)=0.5, inverseNormalCdf(0.975) approx 1.96, t critical value
  df=10 two-tailed 95% approx 2.228).

**Deliverables:**
- [ ] Engine `src/calc/normal-distribution.ts` (export `normalDistribution`) + test --
      inputs: x (number), mean (number), sd (number), and a `mode` select:
      P(X<x), P(X>x), P(a<X<b) (for the between mode add a second bound input b). Returns the
      probability via `normalCdf`. Guard sd<=0. Register. Config `normal-distribution.yaml`
      (standalone, category `probability-distributions`, keyword
      "normal distribution calculator").
- [ ] Engine `src/calc/z-table.ts` (export `zTable`) + test -- input z (number); returns the
      cumulative left-tail area (and optionally right-tail / between-0-and-z as outputs) via
      `normalCdf`. Register. Config `z-table.yaml` (standalone, category
      `probability-distributions`; descriptive keywords, no `tool_keyword` in seed).
- [ ] Engine `src/calc/t-table.ts` (export `tTable`) + test -- inputs: degrees of freedom
      (number) and a tail/confidence `select`; returns the critical t value. Register.
      Config `t-table.yaml` (standalone, category `inferential-statistics`).
- [ ] Engine `src/calc/p-value.ts` (export `pValue`) + test -- inputs: a test statistic
      (number), a distribution `select` (z or t), df (number, used when t), and a tail
      `select` (left / right / two-tailed). Returns the p-value via `normalCdf`/`tCdf`.
      Register. Config `p-value.yaml` (standalone, category `inferential-statistics`,
      keyword "p value calculator").
- [ ] `src/calc/_stats-math.ts` (+ its test), updated `registry.ts`, and any minimal
      render tweak only if a new output shape is needed (prefer reusing existing numeric
      `outputs`).

**Constraints:**
- Stay in this repo; do not touch sibling folders. Do NOT edit `CLAUDE.md`.
- Engines and `_stats-math.ts` stay pure (no DOM / window / document / fetch / astro:
  imports in `src/calc/**`).
- No new runtime dependencies -- implement the approximations yourself.
- `_stats-math.ts` is a shared helper, not an engine: do NOT add it to the registry.
- Document the source/name of each numerical approximation in a short comment so the
  reviewer can verify the formula.

**Definition of done / how to verify:**
- `npx astro check` 0/0/0; `npm test` green incl. `_stats-math` and 4 engine tests with the
  textbook values above.
- `npm run build` succeeds, 0 link violations; the 4 new standalone pages exist in `dist/`.
- Manual sanity: normal-distribution with mean=0, sd=1, x=1.96, mode P(X<x) returns approx
  0.975; p-value for z=1.96 two-tailed returns approx 0.05.

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
