# Session: full calculator build-out (TASK-011 -> TASK-016) complete + article routines scheduled -- 2026-06-17

**Objective:** Execute the calculators-before-articles pivot: build every remaining calculator engine and standalone page, then resume article publishing via scheduled cloud routines.

**Completed:**
- Split the ~25 remaining calculators into 6 handoff tasks sequenced by shared math/infra: TASK-011 (6 config-only reuse calcs), TASK-012 (4 descriptive engines + structured-output foundation), TASK-013 (4 combinatorics/probability + `select` input type), TASK-014 (4 normal-family + shared `_stats-math.ts` CDF module), TASK-015 (2 regression/correlation), TASK-016 (5 inferential + chi-square/Student-t math).
- All 6 reviewed against real artifacts (gates re-run, not just Work Logs) and set CLOSED across this and the prior session. Registry ends at **26-29 engines**; every planned standalone calculator page is live. Caught and steered around a category-assignment trap in TASK-016 (proportion seeded under a category with no hub file).
- Committed the entire TASK-012 -> TASK-016 build-out as one commit and pushed -- **calculator build-out is complete.**
- **Article-publishing engine scheduled:** two recurring `RemoteTrigger` cloud routines set up (23:45 Malta and 03:00 Malta), each running `publish-next-article.md` against the connected repo, hands-off, 2 articles/day. Publish order: correlation-vs-causation -> what-is-an-average -> linear-regression (how-to-find-the-range already done).

**Files changed:** `src/calc/**` (16 new engines incl. `_stats-math.ts`, `_regression-core.ts`), `src/content/calculators/*.yaml` (19 new configs), `handoff/TASK-011` through `TASK-016`.

**Decisions made:** The calculators-before-articles pause ([[0007-calculators-before-articles]]) is satisfied and lifted -- article backlog resumes via the two new recurring routines, not manual writing.

**Verification:** Purity grep over `src/calc/**` clean; astro check 0/0/0; 33 test files / 89 tests; build 37 pages / 1048 internal links / 0 violations.

**Next actions noted at the time:** Verify the deploy went green + spot-check new calculator pages live; SEO baselines still owed; rotate the Cloudflare token pasted in chat.
