Status: TODO
<!-- TODO | IN_PROGRESS | DONE | CHANGES_REQUESTED | CLOSED -->

# TASK-013 -- Combinatorics + probability basics + select-input foundation

- **Owner of this stage:** Codex
- **Repo:** `Desktop/statohub/` (where the work happens)
- **Created:** 2026-06-17 by Claude

<!-- Authoring note (Claude): keep this file plain ASCII. Use `--` not an em
dash, `->` not an arrow, `...` not an ellipsis. -->

---

## Brief  *(Claude writes -- what Codex needs to execute)*

**Goal:** Build 4 standalone calculators (factorial, combination, probability, binomial
distribution) and introduce the foundation they need: a `select` (dropdown) input type so a
calculator can switch modes (nCr vs nPr; exactly / at most / at least).

**Context / inputs:**
- Engine contract `src/calc/types.ts`; structured-output fields (`text`, etc.) were added
  in TASK-012 -- reuse them. Render layer `src/components/statcalc/client.ts`,
  `src/components/StatCalc.astro`. Schema `src/content/config.ts`.
- Planned set: `content-ops/seed.json` (`factorial`, `combination`,
  `probability`, `binomial-distribution`).

**Foundation to add (do this FIRST):**
- Add a `select` input type. In `src/content/config.ts`, extend the `inputs[].type` union to
  include `'select'`, and add an optional `options: { value: string; label: string }[]`
  field on the input object (keep existing fields/defaults intact so current configs still
  validate).
- In `StatCalc.astro`, render a `<select>` with `<option>`s when `input.type === 'select'`
  (mirror the existing label + class conventions; give it `data-input-type="select"`).
- In `client.ts`, extend the `InputSpec` type and `buildInput` so a `select` value is passed
  through as its string `value` (NOT parsed as a number). Engines receive the raw string for
  select fields. Keep number/numberList parsing unchanged.

**Combinatorics math (overflow-safe):** factorials overflow JS `number` past 170!. Implement
counts using either BigInt or a log-gamma based approach, and return results that stay finite
and exact where feasible; for very large inputs return a clean error (value null + message)
rather than `Infinity`/`NaN`. Put any shared helper in the engine files (no new dep). nCr and
nPr should be computed without building the full factorial when avoidable.

**Deliverables:**
- [ ] Engine `src/calc/factorial.ts` (export `factorial`) + test -- single non-negative
      integer input `n`; reject negatives/non-integers with a clear error. Register. Config
      `factorial.yaml` (standalone, one `number` input `n`, keyword "factorial calculator").
- [ ] Engine `src/calc/combination.ts` (export `combination`) + test -- inputs `n`, `r`
      (numbers) and a `mode` select with options nCr (combinations) and nPr (permutations).
      Returns the count; guard r > n and negatives. Register. Config `combination.yaml`
      (standalone, keyword "combination calculator").
- [ ] Engine `src/calc/probability.ts` (export `probability`) + test -- educational
      probability: e.g. inputs favorable outcomes and total outcomes (numbers) returning
      P = favorable/total, plus complement (1 - P) as a secondary output; guard total <= 0
      and favorable > total. Register. Config `probability.yaml` (standalone, category
      `probability-distributions`, keyword "probability calculator").
- [ ] Engine `src/calc/binomial.ts` (export `binomial`) + test -- inputs n (trials), p
      (success prob 0..1), k (successes), and a `mode` select: exactly P(X=k),
      at most P(X<=k), at least P(X>=k). Uses nCr from the combination work (factor a shared
      helper if helpful). Guard p outside [0,1], k>n, negatives. Register. Config
      `binomial-distribution.yaml` (standalone, category `probability-distributions`,
      keyword "binomial distribution calculator").
- [ ] Updated `src/content/config.ts`, `StatCalc.astro`, `client.ts`, `registry.ts`.

**Constraints:**
- Stay in this repo; do not touch sibling folders. Do NOT edit `CLAUDE.md`.
- Engines stay pure (no DOM / window / document / fetch / astro: imports in `src/calc/**`).
- No new runtime dependencies.
- The `select` foundation must be additive: re-run the build and confirm existing
  number/numberList calculators (e.g. mean, standard-deviation, frequency-table) are
  unaffected.
- `category:` ids must match existing files under `src/content/categories/` (verify first).

**Definition of done / how to verify:**
- `npx astro check` 0/0/0; `npm test` green incl. 4 new engine tests with known values
  (e.g. 5! = 120; 10C3 = 120; 10P3 = 720; Binomial(n=10,p=0.5,k=5 exactly) approx 0.2461).
- `npm run build` succeeds, 0 link violations; the 4 new standalone pages exist in `dist/`.
- A `select`-driven page actually switches output when the dropdown changes (verify via
  preview or the DOM harness): combination nCr vs nPr, binomial exactly vs at-most differ.

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
