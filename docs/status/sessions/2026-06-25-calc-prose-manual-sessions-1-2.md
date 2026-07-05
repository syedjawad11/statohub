# Session: calc-prose switched to manual sessions, S1 + S2 published -- 2026-06-25

**Objective:** Speed up the calculator-prose backlog beyond 1/day by switching to manual active-session writing (3 pages/session), and publish the first two sessions.

**Completed:**
- Disabled the daily calc-prose cloud routine (reversible -- `enabled:false`, not deleted) and wrote `content-ops/calc-prose/SESSION-PLAN.md` with the cadence and per-session procedure. Corrected a stale-tree counting bug: the local tree was 26 commits behind `origin/main` (the routine pushes straight to origin), so the real baseline was 7/25 done, not 3/25 -- lesson baked into [[monitor-cloud-routine-publishing]]: always count against `origin/main` after `git fetch`, never the local tree.
- **Session 1:** published `mean-absolute-deviation`, `frequency-table`, `z-score` via 3 parallel subagents, each grounded in a worked example computed from the real engine.
- **Session 2:** published `z-table`, `normal-distribution`, `probability`, same procedure.

**Files changed:** `content-ops/calc-prose/SESSION-PLAN.md`, `content-ops/calc-prose/QUEUE.md`, 6 new `src/content/calculator-content/*.mdx` files.

**Decisions made:** Manual 3-per-session writing replaces the 1/day routine while the backlog is being actively drained; the routine trigger stays disabled (not deleted) for easy revert.

**Verification:** Each session: light QA gate PASS, external links curl-verified 200, astro check 0/0/0, build green, all pages verified live post-deploy.

**Next actions noted at the time:** Session 3 -- `binomial-distribution`, `combination`, `factorial`.
