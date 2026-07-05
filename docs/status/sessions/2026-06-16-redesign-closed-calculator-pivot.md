# Session: TASK-009/010 redesign closed + strategy pivot to calculators-first -- 2026-06-16

**Objective:** Close the two-task front-end redesign (design system + homepage/article layouts) and decide what to build next.

**Completed:**
- TASK-009 (design system + shared chrome) reviewed -> CLOSED: warm editorial palette (paper/ink/vermillion/teal at the time, later renamed clay/pine in the 2026-06-27 theme refresh) on `:root` + `html.dark`; StatCalc byte-stable hooks confirmed untouched (styling-only); root `[slug]` discriminated union (articles + category hubs share one root route) with a collision guard.
- TASK-010 (bespoke homepage + rich `ArticleLayout`) reviewed -> CLOSED: fused teach/compute card embeds the REAL `<StatCalc slug="standard-deviation" variant="embed">` (not mockup JS); 3-column article shell with sticky TOC built from `entry.render().headings`; breadcrumb category crumb is a real typed `categoryHub()` link. Hit a non-fast-forward push (a cloud routine had fired mid-session) -- resolved with `git rebase origin/main`, clean. Redesign committed and deployed live.
- **Strategy pivot locked with the user:** starting the next day, build out every calculator engine + standalone page (especially the full set of ~23-29 standalone calculators) BEFORE resuming article writing, since articles are meant to embed real `<StatCalc>` tools and the founding wedge depends on the tools existing first. Article publishing (incl. the cloud-routine backlog) explicitly paused until the calculator set is complete.

**Files changed:** `src/layouts/ArticleLayout.astro`, `src/pages/index.astro`, `src/styles/global.css` (early token system), `src/pages/[slug]/index.astro`, `src/content/categories/*.yaml`, `src/pages/about/index.astro`.

**Decisions made:** Calculators-before-articles sequencing (see [[0007-calculators-before-articles]], later superseded once the calculator set shipped).

**Verification:** Re-ran all three gates from clean state after rebase: 15 pages, 431 links, 0 violations.

**Next actions noted at the time:** Scope the calculator build -- inventory the ~23-29 standalone tools against the 10 engines already shipped, write the first calculator-batch handoff task.
