Status: CLOSED
<!-- TODO | IN_PROGRESS | DONE | CHANGES_REQUESTED | CLOSED -->

# TASK-012 -- New descriptive engines + structured-output foundation

- **Owner of this stage:** Codex
- **Repo:** `Desktop/statohub/` (where the work happens)
- **Created:** 2026-06-17 by Claude

<!-- Authoring note (Claude): keep this file plain ASCII. Use `--` not an em
dash, `->` not an arrow, `...` not an ellipsis. -->

---

## Brief  *(Claude writes -- what Codex needs to execute)*

**Goal:** Build 4 descriptive calculators whose results are NOT a single scalar, and
introduce the one piece of foundation they need: structured (non-numeric) output rendering.
Three are embed-only (consumed inside articles); one is standalone.

**Context / inputs:**
- Engine contract: `src/calc/types.ts` (`CalcResult`, `CalcEngine`), pattern reference
  `src/calc/range.ts` and `src/calc/percentile.ts` (percentile already computes quartiles
  via Hyndman-Fan Type 7 -- reuse that approach, do not re-derive a different quantile rule).
- Render layer: `src/components/statcalc/client.ts` (`renderResults`) and
  `src/components/StatCalc.astro`.
- Schema: `src/content/config.ts`.
- Planned set: `content-ops/seed.json` (`mean-median-mode-range`, `range-iqr`, `outlier`,
  `frequency-table`).

**Foundation to add (do this FIRST, keep the existing numeric path byte-stable):**
- Extend `CalcResult` in `src/calc/types.ts` with OPTIONAL fields for non-scalar output.
  Suggested shape (you may refine, keep it minimal and typed):
  - `table?: { columns: string[]; rows: (string | number)[][] }`
  - `list?: number[]`
  - `text?: string`
  These are additive and optional; engines that only set `value`/`outputs` are unchanged.
- Extend `renderResults` in `client.ts` to render, when present: a `<table>` for `table`,
  a comma-joined readable line for `list`, and a `<p>` for `text`. The EXISTING numeric
  `value`/`outputs` rendering (the `<dl>` rows) MUST remain identical for current
  calculators -- verify by confirming the built `standard-deviation` page output is
  unchanged. Keep all DOM construction vanilla (no framework), reuse `formatNumber` for
  numbers, and keep the `aria-live` results region.
- No schema change is required for output; outputs are engine-driven. (Inputs for all 4
  here are numberList/number, already supported.)

**Deliverables:**
- [ ] Engine `src/calc/mmmr.ts` (export `mmmr`) + test -- returns mean, median, mode(s),
      range as numeric `outputs` (and a sensible `value`, e.g. mean). Reuse existing
      `mean`/`median`/`mode`/`range` engines internally rather than recomputing. Register
      in `registry.ts`. Config `mean-median-mode-range.yaml`, `standalone: false`.
- [ ] Engine `src/calc/range-iqr.ts` (export `rangeIqr`) + test -- returns min, max, range,
      Q1, Q2 (median), Q3, IQR as numeric `outputs`; reuse the percentile/quartile logic
      from `src/calc/percentile.ts`. Register. Config `range-iqr.yaml`, `standalone: false`,
      with `outputLabels` for each key.
- [ ] Engine `src/calc/outlier.ts` (export `outlier`) + test -- computes Q1, Q3, IQR, the
      1.5*IQR lower/upper fences (numeric `outputs`) AND the list of outlier values (use the
      new `list` field). Register. Config `outlier.yaml`, `standalone: false`.
- [ ] Engine `src/calc/frequency-table.ts` (export `frequencyTable`) + test -- from a
      numberList, produce a `table` with columns Value, Frequency, Relative Frequency,
      Cumulative Frequency (sorted ascending; relative as a proportion or percent -- pick
      one and label it). Register. Config `frequency-table.yaml`, `standalone: true`,
      keyword from seed (none -- omit `tool_keyword`; use descriptive `keywords`).
- [ ] Updated `src/calc/types.ts`, `client.ts` (+ optionally `format.ts` if a small helper
      helps), and `registry.ts`.

**Range vs range-iqr decision (apply exactly):** the existing standalone `range` calculator
(`src/content/calculators/range.yaml`, min/max/range) STAYS as-is. Build `range-iqr` as a
SEPARATE embed-only calculator that adds quartiles + IQR. Do not delete or repurpose
`range`.

**Constraints:**
- Stay in this repo; do not touch sibling folders. Do NOT edit `CLAUDE.md`.
- Engines stay pure: no DOM, no `window`/`document`, no `fetch`, no `astro:` imports inside
  `src/calc/**`. (This is the dual-deploy guarantee -- a grep for those tokens over
  `src/calc/**` must stay clean.)
- No new runtime dependencies.
- Every new engine has a Vitest unit test with a known dataset and exact expected values.
  Use the canonical dataset `[2, 4, 4, 4, 5, 5, 7, 9]` plus at least one edge case
  (empty / single value / all-identical / even-vs-odd count for medians).

**Definition of done / how to verify:**
- `npx astro check` 0/0/0; `npm test` green incl. the 4 new engine test files.
- `npm run build` succeeds, 0 link violations; `dist/calculators/frequency-table/index.html`
  exists; the 3 embed-only configs generate NO `/calculators/{slug}/` page.
- Confirm the existing `standard-deviation` standalone page still renders its numeric
  `<dl>` output unchanged (no regression from the render-layer change).
- Confirm frequency-table renders a real HTML table and outlier renders its list.

---

## Work Log  *(Codex writes -- what was actually done)*

- **Started:** 2026-06-17
- **Finished:** 2026-06-17

**What changed (files + where):**
- `src/calc/types.ts` -- added optional `table`, `list`, and `text` fields to `CalcResult` for structured non-scalar outputs.
- `src/components/statcalc/client.ts` -- appended structured output rendering for text, lists, and tables while leaving the existing numeric `value`/`outputs` `<dl>` path unchanged.
- `src/calc/percentile.ts` -- exported the existing Hyndman-Fan Type 7 percentile helper so quartile engines reuse the same rule.
- `src/calc/mmmr.ts`, `src/calc/range-iqr.ts`, `src/calc/outlier.ts`, `src/calc/frequency-table.ts` -- added the four descriptive engines.
- `src/calc/registry.ts` -- registered `mmmr`, `range-iqr`, `outlier`, and `frequency-table`.
- `src/calc/__tests__/mmmr.test.ts`, `range-iqr.test.ts`, `outlier.test.ts`, `frequency-table.test.ts` -- added known-value and edge-case coverage for the new engines.
- `src/content/calculators/mean-median-mode-range.yaml`, `range-iqr.yaml`, `outlier.yaml`, `frequency-table.yaml` -- added the three embed-only configs and one standalone frequency-table config.

**How to verify:**
- `npx astro check` -- passed with 0 errors, 0 warnings, 0 hints.
- `npm test` -- first sandbox run hit expected `spawn EPERM`; rerun with process-spawn approval passed, 16 test files and 45 tests.
- `npm run build` -- passed; generated route ids, built 22 pages, and `check-links` scanned 628 internal links with 0 violations.
- `Test-Path dist/calculators/frequency-table/index.html` returned `True`; `mean-median-mode-range`, `range-iqr`, and `outlier` calculator route paths returned `False`, confirming embed-only behavior.
- `Select-String` on `dist/calculators/standard-deviation/index.html` confirmed the existing static result region/config remains the same server-rendered numeric calculator shell.

**Blocked / couldn't do / decisions made:**
- Browser preview was not required for TASK-012 after build and route checks passed; no preview server was left running after an interrupted attempt.
- The outlier tests use Type 7 quartiles through the shared percentile helper; with that rule, the canonical `[2, 4, 4, 4, 5, 5, 7, 9]` dataset marks `9` as an outlier, so the no-outlier edge case uses all-identical values.

---

## Review  *(Claude writes -- accept or send back)*

- **Reviewed:** 2026-06-17
- **Verdict:** CLOSED

**Notes / what to improve:**
- Verified against artifacts, not just the Work Log. `CalcResult` gained optional
  `table`/`list`/`text` only; the numeric `value`/`outputs` `<dl>` path in
  `renderResults` is unchanged and the structured blocks render after it, reusing
  `formatNumber` and keeping the `aria-live` region. Engines are pure (no DOM /
  window / fetch / astro: in `src/calc/**`). `range-iqr` and `outlier` reuse the
  exported Hyndman-Fan Type 7 helper from `percentile.ts` rather than re-deriving a
  quantile rule; `range.yaml` left intact and `range-iqr` is a separate embed-only
  calc as instructed. Configs correct: `frequency-table` standalone, the other 3
  embed-only.
- Gates re-run clean from a fresh state: `astro check` 0/0/0; `npm test` 20 files /
  57 tests; `npm run build` 26 pages / 740 links / 0 violations.
  `dist/calculators/frequency-table/index.html` exists; mmmr / range-iqr / outlier
  generate no route. Good work.
