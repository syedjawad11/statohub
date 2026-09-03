Status: CLOSED
<!-- TODO | IN_PROGRESS | DONE | CHANGES_REQUESTED | CLOSED -->

# TASK-003 — Calculator engine layer + registry + unit tests (descriptive batch)

- **Owner of this stage:** Codex
- **Repo:** `Desktop/statohub/` (where the work happens)
- **Created:** 2026-06-14 by Claude

---

## Brief  *(Claude writes — what Codex needs to execute)*

**Goal:** Build the pure, framework-free **calculator engine layer** under `src/calc/`
— the math that lives *once* and feeds both the embedded and standalone deployments of
`<StatCalc>` (TASK-004). Implement the **Descriptive Statistics batch** of engines, wire
a **`registry.ts` keyed by engine name** (the same string the `calculators` collection's
`engine` field holds), and **unit-test every engine in isolation with Vitest** against
known reference values. **Engines + registry + tests ONLY** — no UI, no `<StatCalc>`, no
page wiring, no calculator-config field specs.

**Context / inputs:**
- [`../BUILD-PLAN.md`](../BUILD-PLAN.md) — **§ Plan A → A3** (this task: "pure
  framework-free functions (`mean`, `sd`, `zscore`, …) + a `registry.ts` keyed by engine
  name. Unit-tested in isolation.") and **A4** (why the math must be decoupled: the same
  engine feeds both `variant="embed"` and `variant="page"` — *math lives once in
  `src/calc`*).
- TASK-002 already shipped the `calculators` collection. The sample
  `src/content/calculators/standard-deviation.yaml` declares **`engine: standardDeviation`**
  — so the registry **must** expose that exact key. Engine keys are **camelCase** and are
  the contract between a calculator data file and this layer.
- The full standalone-calculator list is in BUILD-PLAN A4. **This task implements only the
  descriptive subset** (see Deliverables). The registry must be trivially extensible so
  later batches (combinatorics, distributions, inferential) drop in without refactor.

**Pinned engine contract (build to this; deviate only with a logged reason):**

```ts
// src/calc/types.ts
export interface CalcResult {
  /** Primary numeric output; null when input is invalid/insufficient. */
  value: number | null;
  /** Optional secondary named outputs, e.g. { sample: 2.138, population: 2 }. */
  outputs?: Record<string, number>;
  /** Optional human-readable validation message when value is null. */
  error?: string;
}

/** Every engine is a pure function: structured input -> CalcResult. No I/O, no DOM. */
export type CalcEngine = (input: any) => CalcResult;
```

- **Each engine** lives in its own file `src/calc/<name>.ts`, is a **named export**, is
  **pure** (no DOM, no globals, deterministic), takes a **typed input object** (define and
  export that input interface per engine), and returns a `CalcResult`.
- **`src/calc/registry.ts`** exports `export const registry: Record<string, CalcEngine>`
  mapping each **camelCase engine key → its function** (wrap the typed engine so it matches
  `CalcEngine`). Also export a helper `getEngine(key: string): CalcEngine | undefined`.
- **Validation is the engine's job, not a throw:** empty array, non-numeric, n<2 where the
  formula needs it (e.g. sample variance) → return `{ value: null, error: '…' }`, never
  throw. Tests assert this.
- Keep number outputs **unrounded** (full float precision); rounding/formatting is a
  display concern for `<StatCalc>` (TASK-004), not the engine.

**Deliverables — engines (Descriptive batch, 10):**
Implement these with the listed camelCase registry key. Where an engine has both a sample
and population form, return **both** via `outputs` (and put the most-common one in `value`
— note which below).

| key | file | input | `value` | `outputs` |
|---|---|---|---|---|
| `mean` | `mean.ts` | `{ values:number[] }` | arithmetic mean | — *(also the `average` calc's engine — reuse this key, don't duplicate)* |
| `median` | `median.ts` | `{ values:number[] }` | median | — |
| `mode` | `mode.ts` | `{ values:number[] }` | first mode (lowest if multimodal) | `{ count }` (modal frequency); handle "no mode"/multimodal sensibly |
| `range` | `range.ts` | `{ values:number[] }` | max − min | `{ min, max }` |
| `variance` | `variance.ts` | `{ values:number[] }` | **sample** variance | `{ sample, population }` |
| `standardDeviation` | `standard-deviation.ts` | `{ values:number[] }` | **sample** SD | `{ sample, population }` |
| `meanAbsoluteDeviation` | `mean-absolute-deviation.ts` | `{ values:number[] }` | MAD about the mean | — |
| `percentile` | `percentile.ts` | `{ values:number[], p:number }` (p in 0–100) | the p-th percentile | `{ q1, q2, q3, iqr }` |
| `weightedMean` | `weighted-mean.ts` | `{ values:number[], weights:number[] }` | weighted mean | — |
| `zScore` | `z-score.ts` | `{ x:number, mean:number, sd:number }` | (x − mean) / sd | — |

- For `percentile`, **pick a standard, documented method** (e.g. linear-interpolation /
  "exclusive" or "inclusive", or nearest-rank) and **add a one-line comment naming the
  method**; quartiles in `outputs` must use the same method. Consistency + a documented
  choice matters more than which method.
- `mode`: define and comment your tie/no-mode behavior (e.g. all-unique → return the data's
  behavior you choose; just make it deterministic and tested).

**Deliverables — harness & registry:**
- [ ] `src/calc/types.ts` — exactly the `CalcResult` / `CalcEngine` contract above.
- [ ] The 10 engine files above, each with its exported typed input interface.
- [ ] `src/calc/registry.ts` — `registry` map (all 10 keys, incl. **`standardDeviation`**)
      + `getEngine()`. A key that isn't implemented must simply be absent (no stub throw).
- [ ] **Vitest** added to `devDependencies` (a version that installs cleanly on
      **Node 20.8.0** — same constraint as TASK-001; v2.x is the safe match for this stack).
      Add a `"test": "vitest run"` script (and optionally `"test:watch": "vitest"`).
      Config via `vitest.config.ts` **or** an Astro-compatible `vitest` field — your call,
      keep it minimal and don't disturb `astro build`.
- [ ] One test file per engine under `src/calc/__tests__/` (or `*.test.ts` beside each
      engine — your call, be consistent). Each asserts **known reference values** and the
      **invalid-input → `{ value:null, error }`** path.

**Pinned reference values (use this canonical dataset so tests are unambiguous):**
For `values = [2, 4, 4, 4, 5, 5, 7, 9]` (n = 8):
- `mean` → 5
- `median` → 4.5
- `mode` → 4 (count 3)
- `range` → 7 (min 2, max 9)
- population variance → 4 ; sample variance → 32/7 ≈ 4.5714286
- population SD → 2 ; sample SD → ≈ 2.1380899
- `meanAbsoluteDeviation` (about mean) → 1.5
- `zScore({ x:7, mean:5, sd:2 })` → 1
- `weightedMean({ values:[1,2,3,4], weights:[4,3,2,1] })` → 2
- `percentile`: assert against whatever your chosen method yields for this dataset (e.g.
  q2 must equal the median 4.5); document the expected numbers in the test.

Use a tolerance (e.g. `toBeCloseTo`, ~1e-6) for the irrational ones.

**Constraints:**
- Stay in this repo; don't touch sibling folders. **Do not edit `CLAUDE.md`** — log in this
  task file's Work Log.
- **Engines + registry + tests ONLY.** Do **NOT**: build `<StatCalc>` or any `.astro`
  component, add input/output **field specs** to the `calculators` schema (that's TASK-004),
  wire any `src/pages/**` route, create `src/lib/links.ts` or `scripts/check-links.mjs`
  (TASK-005), or touch existing pages/layouts/content.
- **Pure functions only** — no DOM, no `window`, no fetch, no Astro imports inside
  `src/calc/**`. This is what lets the same math serve embed + standalone (A4) and run
  under Vitest headless.
- **Defer (do NOT implement now)** — later batches will add these engine keys; just leave
  the registry ready for them: `weightedAverage`*, `normalDistribution`, `binomialDistribution`,
  `correlationCoefficient`, `linearRegression`, `pValue`, `tTest`, `chiSquare`, `sampleSize`,
  `confidenceInterval`, `proportion`, `probability`, `factorial`, `combination`. (*`average`
  and `weighted-average` calculators will reuse `mean`/`weightedMean` — no separate engine.)
- Node **20.8.0**, Wrangler **v3** stay pinned — don't bump them or anything that breaks on
  Node 20.8.0. Heads-up: TASK-002 hit Windows `spawn EPERM` in the sandbox on
  `astro sync`/`build`; Vitest spawns workers too, so run tests with approved process-spawn
  perms if you see EPERM.
- Lean: small focused files, no helper-library sprawl, no unused exports.

**Definition of done / how to verify:**
- `npm test` (`vitest run`) exits `0` with **all engine tests green**, including the
  invalid-input cases.
- `getEngine('standardDeviation')` resolves to a function and
  `registry.standardDeviation({ values:[2,4,4,4,5,5,7,9] })` returns
  `value ≈ 2.1380899`, `outputs.population === 2` — i.e. the TASK-002 sample calculator's
  engine key is satisfiable.
- `npx astro check` still exits `0` (engines are valid TS; the new dir doesn't break types).
- `npm run build` still exits `0` and the existing `/` + `/normal-distribution/` routes
  still build (the engine layer is decoupled — adding it changes no routes).
- Note in your Work Log: the `percentile` method you chose, the `mode` tie behavior, and
  confirm no `src/calc/**` file imports anything Astro/DOM (the purity guarantee TASK-004
  relies on for dual-deploy).

---

## Work Log  *(Codex writes - what was actually done)*

- **Started:** 2026-06-14
- **Finished:** 2026-06-14

**What changed (files + where):**
- Added the pure calculator contract in `src/calc/types.ts`.
- Added 10 descriptive-statistics engines under `src/calc/`: `mean`, `median`, `mode`,
  `range`, `variance`, `standardDeviation`, `meanAbsoluteDeviation`, `percentile`,
  `weightedMean`, and `zScore`.
- Added `src/calc/registry.ts` with all 10 camelCase keys and `getEngine(key)`.
- Added Vitest 2.1.9, `test` / `test:watch` scripts, and `vitest.config.ts`.
- Added one test file per engine under `src/calc/__tests__/`, plus a registry test for
  `standardDeviation`.

**How to verify:**
- `npm test` -> 11 files / 24 tests passed. The first sandboxed run hit Windows
  `spawn EPERM`; rerun with approved process-spawn permissions passed.
- `npx astro check` -> 0 errors, 0 warnings, 0 hints.
- `npm run build` -> passed; generated `/index.html` and `/normal-distribution/index.html`.
- `rg -n "astro:|\.astro|window|document|fetch\(" src\calc` returned no matches,
  confirming no Astro/DOM/fetch imports or references under `src/calc/**`.

**Blocked / couldn't do / decisions made:**
- Percentile method: Hyndman-Fan Type 7 linear interpolation. Quartiles use the same
  method; canonical dataset outputs are `q1=4`, `q2=4.5`, `q3=5.5`, `iqr=1.5`.
- Mode tie/no-mode behavior: multimodal ties return the lowest tied mode; all-unique
  data returns `{ value: null, outputs: { count: 1 }, error }`.
- No deferred engine stubs were added; unimplemented registry keys remain absent.

---

## Review  *(Claude writes — accept or send back)*

- **Reviewed:** 2026-06-14 by Claude
- **Verdict:** CLOSED

**Notes / what to improve:**
- Verified independently, not just trusting the Work Log:
  - `npm test` -> 11 files / 24 tests pass (re-ran here, all green incl. the
    invalid-input null/error paths).
  - Purity grep `astro:|\.astro|window|document|fetch\(` over `src/calc/**` ->
    no matches. The dual-deploy guarantee TASK-004 relies on holds.
  - `registry.ts` exposes all 10 camelCase keys incl. `standardDeviation`
    (the TASK-002 sample calc's contract); `getEngine()` present; no stub throws.
  - `percentile` documents Hyndman-Fan Type 7 and reuses it for q1/q2/q3/iqr;
    `mode` tie/no-mode behavior is deterministic and tested.
- Contract followed exactly (CalcResult/CalcEngine, per-engine typed input,
  validation-returns-null not throw, unrounded outputs). Lean, one file per
  engine, no deferred-key stubs. Nothing to send back.
- Good call flagging the encoding + sandbox snags in "Codex Issues" -- the
  mojibake one is now fixed at the source (see below); the EPERM/network ones
  are sandbox approval prompts, now documented in AGENTS.md so they're expected.

**Encoding fix applied (so the apply_patch mismatch does not recur):**
- `handoff/TEMPLATE.md` converted to plain ASCII punctuation (em dash -> `--`,
  arrow -> `->`, ellipsis -> `...`). Every future task file is spawned from it,
  so new briefs Codex must patch are ASCII-clean.
- Added an ASCII-only authoring rule to `handoff/README.md` conventions.

---

## Codex Issues Encountered  *(for Claude review)*

- Several existing Markdown files displayed mojibake in PowerShell output, e.g. `â€”`,
  `â†’`, and `â€¦` instead of em dashes, arrows, and ellipses. This made one `apply_patch`
  edit fail when replacing the Work Log placeholder because the visible text did not
  match the underlying byte/character sequence. I worked around it by replacing only the
  bounded `## Work Log` section programmatically, then re-read the tail of the file to
  verify the final content.
- Vitest initially failed in the sandbox with Windows `spawn EPERM` while loading
  esbuild/worker processes. Re-running `npm test` with approved process-spawn permissions
  passed.
- The `npm install` for Vitest initially failed because the sandbox used cached-only npm
  access and Vitest was not cached. Re-running `npm install` with approved network access
  updated `package-lock.json` successfully.
