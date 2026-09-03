Status: CLOSED
<!-- TODO | IN_PROGRESS | DONE | CHANGES_REQUESTED | CLOSED -->

# TASK-024 -- Calculator canonical regression suite

- **Owner of this stage:** Codex
- **Repo:** `Desktop/statohub/` (where the work happens)
- **Created:** 2026-07-05 by Claude

<!-- Authoring note (Claude): keep this file plain ASCII. Use `--` not an em
dash, `->` not an arrow, `...` not an ellipsis. Codex reads these files through
a Windows codepage; non-ASCII punctuation renders as mojibake and breaks its
apply_patch matching. -->

---

## Brief  *(Claude writes -- what Codex needs to execute)*

**Goal:** The existing 89 tests over `src/calc/**` are happy-path unit tests only --
none of them are checked against an independent, authoritative ground truth. Add a
canonical-value regression layer: for each of the 26 engines, a small set of
input -> expected-output pairs whose expected value is traceable to a real, verifiable
source (an external statistical library, a textbook, or hand-computable arithmetic
shown in the comment) -- not just "this is what the engine currently returns."

**This is the highest-care task of the three in this batch. Read this whole brief,
especially the "sourcing rules" section, before writing anything.**

**Context / inputs:**
- `docs/audit/2026-07-workspace-audit.md` -- flags that current calculator tests are
  happy-path only, not verified against ground truth.
- `src/calc/*.ts` -- the 26 engine files (excluding `_stats-math.ts`,
  `_regression-core.ts`, `_combinatorics-core.ts`, `registry.ts`, `types.ts`, and the
  `__tests__` folder, which are support/infra, not engines to test here).
- Existing tests under `src/calc/__tests__/` (or co-located `*.test.ts` files) -- read
  a few to see the existing test style/conventions before adding new files.

**Step 0 -- environment probe (do this first, before writing any test data):**

Check whether this sandbox has a working statistical library available:
```
python3 -c "import scipy; print(scipy.__version__)"
```
(or `python --version` then try the import; or check for `Rscript --version` if you
want to try R instead). **Record the exact result of this check in the Work Log**
(available + version, or "not available: <error>") before doing anything else. This
determines which of the two sourcing paths below you follow.

**Sourcing rules for expected values (read carefully -- this is the point of the task):**

- **If a statistical library is available:** compute the expected value directly by
  running the library (e.g. `scipy.stats.binom.pmf(5, 10, 0.5)`,
  `scipy.stats.t.cdf(...)`). Each test case's comment must cite the *exact* function
  call, arguments, and library version used to produce the number -- not a vague
  "verified via scipy." Show your work so it's independently re-runnable.

- **If no library is available, you may NOT invent or claim an external verification
  that didn't happen.** Do not write a comment claiming "verified against R" or
  "verified against scipy" unless you actually ran it. Instead, use only:
  (a) the pre-anchored cases listed below, which are already vetted and cited in this
  repo's own published content, or (b) closed-form cases you verify by showing the
  arithmetic directly in the test comment (factorials, combinations, and basic
  descriptive stats on small integer datasets are all hand-checkable this way).

  **Pre-anchored cases to reuse (already vetted in this repo's history -- cite the
  repo's own `CLAUDE.md` session log or the calc-prose MDX content as the source in
  your comment):**
  - `binomial`: n=10, p=0.5, k=5 -> P(X=5) = 0.2461 (C(10,5)=252, 252 * 0.5^10 = 252/1024)
  - `combination`: n=10, r=3 -> 120 (10! / (3! * 7!) = 720/6)
  - `factorial`: 5! -> 120
  - `z-table` / `normal-distribution`: z=1.96 -> cumulative 0.9750, right-tail 0.0250,
    between-0-and-z 0.4750; mean=100, sd=15, x=130 -> z=2, P(X<x)=0.9772
  - `t-test`: mean=105, mu0=100, sd=15, n=25 -> SE=3, t=1.667, df=24, two-tailed p=0.109
  - `t-table`: df=10, 95% confidence, two-tailed -> critical t = 2.228
  - `sample-size`: confidence level 0.95, margin 0.05, p=0.5 -> z=1.95996, required n=385
  - `linear-regression` / `correlation`: slope=0.6, intercept=2.2 ("y = 2.2 + 0.6x") --
    reuse the exact paired x/y dataset already used in the TASK-015 tests for this pair
  - Descriptive engines (`mean`, `median`, `mode`, `range`, `variance`,
    `standard-deviation`): the canonical dataset `[2,4,4,4,5,5,7,9]` already used as the
    TASK-003 reference dataset, with its already-established expected values (reuse
    from the existing tests -- do not recompute independently, this dataset's values are
    already established project-wide).

  For any of the 26 engines not covered by an anchor above (e.g. `mmmr`, `outlier`,
  `frequency-table`, `weighted-mean`, `percentile`, `mean-absolute-deviation`,
  `range-iqr`, `p-value`, `chi-square`, `proportion`, `confidence-interval`,
  `probability`, `z-score`), construct your own small-integer, hand-verifiable case:
  choose simple inputs, show the arithmetic step by step in the test comment, and
  confirm the engine's output matches your hand computation. If the formula involves a
  standard distribution (chi-square, proportion CI, confidence-interval) that genuinely
  cannot be hand-verified without a library, use a well-known textbook example instead
  and cite the specific textbook/table (e.g. the NIST e-Handbook or OpenStax sections
  already cited elsewhere in this repo's content) -- do not fabricate a citation to a
  source you have not actually checked.

**Coverage per engine (26 engines total):**
- One typical/normal case.
- One edge case (n=1 or n=2, all-tied values, a zero, or another boundary relevant to
  that specific engine).
- One larger, more realistic dataset (more than the ~8-value canonical dataset).

**Handling mismatches:** Do not modify any engine in `src/calc/` to make a test pass. If
an engine's actual output disagrees with your canonical expected value, do not "fix" the
engine and do not silently adjust the expected value to match -- add a comment directly
above that test case starting with `// MISMATCH:` explaining the discrepancy (expected
vs actual, and why you believe your expected value is the correct one), and describe
every such mismatch explicitly in the Work Log. This is a reporting task for
disagreements, not a bug-fixing task.

**Deliverables:**
- [ ] One canonical-value test data file per engine (or a shared file organized by
      engine, whichever fits this codebase's existing test file conventions -- check
      how `src/calc/__tests__/` is currently organized before choosing) covering all 26
      engines with the 3-case coverage described above.
- [ ] Every test case's expected value has an explicit sourcing comment per the rules
      above (library citation with version, OR hand-shown arithmetic, OR cited
      textbook/table reference -- never a bare unsupported claim).
- [ ] Any mismatch between engine output and canonical expected value is flagged with
      `// MISMATCH:` and reported in the Work Log, engine left untouched.

**Constraints:**
- Stay in this repo; don't touch sibling folders.
- Do not modify any file under `src/calc/*.ts` (the engines themselves) or
  `src/calc/_stats-math.ts` / `_regression-core.ts` / `_combinatorics-core.ts` --
  this task only adds test data files.
- No new dependency (the test runner is already Vitest).

**Definition of done / how to verify:**
- `npm test` -- all existing tests still pass; new canonical tests for engines that
  match their canonical value also pass.
- Every one of the 26 engines has at least 3 canonical test cases (typical, edge,
  larger dataset) with a real sourcing comment.
- Any mismatch is visible in the Work Log, not hidden or silently patched.
- The Work Log states clearly, up front, whether Step 0's library probe found scipy/R
  available or not, since that determines which sourcing path was used throughout.

---

## Work Log  *(Codex writes -- what was actually done)*

- **Started:** 2026-07-05
- **Finished:** 2026-07-05

**What changed (files + where):**
- `src/calc/__tests__/canonical-regression.test.ts` -- added one shared canonical regression suite, organized by engine. It covers every live registry engine with three sourced cases each: typical/normal, edge/boundary, and larger/more realistic data.
- Coverage note: the brief says 26 engines, but current `src/calc/registry.ts` exposes 29 engines. The suite covers all 29 live registry entries (`mean`, `median`, `mode`, `range`, `variance`, `standardDeviation`, `meanAbsoluteDeviation`, `percentile`, `weightedMean`, `zScore`, `mmmr`, `range-iqr`, `outlier`, `frequency-table`, `factorial`, `combination`, `probability`, `binomial`, `normal-distribution`, `z-table`, `confidence-interval`, `sample-size`, `correlation`, `linear-regression`, `p-value`, `t-test`, `chi-square`, `t-table`, `proportion`).
- No files under `src/calc/*.ts`, `_stats-math.ts`, `_regression-core.ts`, or `_combinatorics-core.ts` were modified.

**How to verify:**
- Mandatory Step 0 probe before writing test data: `python3 -c "import scipy; print(scipy.__version__)"` returned `1.17.1`. Distribution-backed expected values in comments cite exact `scipy.stats` calls run with SciPy 1.17.1.
- SciPy value generation command used during authoring included exact calls such as `scipy.stats.binom.pmf(5, 10, 0.5)`, `scipy.stats.norm.cdf(130, 100, 15)`, `scipy.stats.t.ppf(1-(1-.95)/2, 10)`, `scipy.stats.chi2.sf(...)`, and `scipy.stats.t.sf(...)`; the resulting numbers are copied into test comments next to their assertions.
- `npx vitest run src/calc/__tests__/canonical-regression.test.ts` -- passed: 1 test file, 29 tests passed.
- `npm test` -- passed with process-spawn approval: 34 test files passed, 118 tests passed.
- `npx astro check` -- passed: Result (17 files), 0 errors, 0 warnings, 0 hints.
- `npm run build` -- passed: generated route ids, Astro built 56 pages, `check-links` scanned 56 pages / 2062 internal links and found 0 violations.
- `rg -n "MISMATCH" src/calc/__tests__/canonical-regression.test.ts` -- no matches, so no canonical mismatches were flagged.
- `git diff --name-only -- src/calc` showed no tracked engine/support-file modifications; the only `src/calc` work is the new untracked test file.

**Blocked / couldn't do / decisions made:**
- No engine mismatches remained after correcting my own arithmetic/tolerance mistakes in the new test data. Therefore no `// MISMATCH:` cases were needed.
- Used a shared test file instead of one file per engine because the existing test convention already keeps calculator tests together under `src/calc/__tests__/`, and the shared file keeps canonical sourcing comments in one audit-friendly place.
- For normal/CDF-derived values, assertions use practical precision where the engine's in-repo numerical approximations differ from SciPy in the last few decimal places. The canonical expected values and comments still cite the SciPy 1.17.1 calls actually run.

---

## Review  *(Claude writes -- accept or send back)*

**Claude's review process for this task must go beyond re-running `npm test`:**
independently re-derive at least 5 cited values by hand or via a throwaway
calculation, spread across different engine categories (not all descriptive, not all
combinatorics) -- spot-check that the comment's claimed source/method genuinely
produces the number used in the test. Only close this task after that spot-check
passes; if a cited value can't be reproduced, send the task back with
CHANGES_REQUESTED rather than closing it.

- **Reviewed:** 2026-07-05
- **Verdict:** CLOSED

**Notes / what to improve:**
- Performed the required independent spot-check (re-derived by hand / known
  math, not just re-running the suite) on 7 cited values spread across
  different engine categories:
  - `binomial`: C(10,5)/2^10 = 252/1024 = 0.24609375 -- matches.
  - `chiSquare` typical: sum((O-E)^2/E) = 0+1+1 = 2; sf(2, df=2) has the
    closed form e^-1 = 0.367879441 -- matches.
  - `correlation`: Sxy=6, Sxx=10, Syy=6 -> r = 6/sqrt(60) = 0.774596669 --
    matches.
  - `tTest` larger case: SE=4.2/8=0.525, t=1.8/0.525=3.428571... -- matches.
  - `sampleSize`: z=1.959963984540054, n=ceil(z^2*0.25/0.05^2)=385 (the
    well-known textbook figure) -- matches.
  - `frequencyTable` larger case (self-derived, not pre-anchored): hand-count
    of [-1,-1,0,0,0,2,2,2,2,5] matches the asserted table exactly.
  - `outlier` typical case: Type-7 quartiles give fences 13.5/17.5, only 100
    flagged -- matches.
  - All 7 reproduced exactly; no discrepancies found.
- Confirmed via `rg -n "MISMATCH"` that zero mismatches are flagged, and via
  `git diff --name-only -- src/calc` that no engine files were touched.
- Re-ran `npm test`: 118/118 tests pass including the 29 new canonical cases.
- No issues found. Spot-check passed -- closing per the brief's requirement.
