# Session: theme refresh (TASK-019/020/021) planned then shipped live -- 2026-06-27

**Objective:** Re-skin the whole site to the user's new design mockup as a pure restyle (no route/content/engine changes), then ship it.

**Completed:**
- Reviewed the user's mockup (`statohub-theme-preview.html`) and planned 3 sequenced Codex briefs: TASK-019 (foundation -- font swap Fraunces->Newsreader, token rename verm/teal/ink-soft/muted -> clay/pine/ink-2/ink-3 + brass/focus, `.dark` class kept over the mockup's `data-theme`, mechanical Tailwind-utility rename with an exhaustive grep gate), TASK-020 (home + article views -- static `.hero-fig` SVG hero with no live calculator, real StatCalc embed in the article `.fuse` card, real TOC from headings), TASK-021 (calculator panel restyle without touching `client.ts`/`format.ts`/`src/calc/**` or any byte-stable StatCalc hook).
- Locked 3 decisions with the user: full faithful port across all 3 page types; adopt Newsreader (visible brand change, accepted); keep the proven internals (`.dark` class, self-hosted `@fontsource`, semantic token renames) over the mockup's raw approach. Confirmed explicitly: homepage hero stays a static SVG figure, no live calculator (see [[0011-no-homepage-live-calculator]]).
- All 3 tasks returned DONE, reviewed against real artifacts, and CLOSED: token-rename grep gate returns nothing; the article `.fuse` card embeds the REAL StatCalc (not mockup JS); every StatCalc byte-stable hook (`data-statcalc`, `data-config-id`, `aria-live`, the JSON config script, `client.ts` import) survived TASK-021 untouched, confirmed via an empty `git diff` on `client.ts`/`format.ts`/`src/calc/**`.
- Committed the full redesign as one commit and pushed -> Actions gate suite -> Cloudflare deploy.

**Files changed:** `package.json` (font swap), `src/styles/global.css` (full token rename), `tailwind.config.cjs`, `src/layouts/BaseLayout.astro` (top bar/footer), `src/pages/index.astro`, `src/layouts/ArticleLayout.astro`, `src/components/StatCalc.astro` (styling only).

**Decisions made:** [[0011-no-homepage-live-calculator]]. Newsreader over Fraunces; `.dark` class mechanism kept over the mockup's `data-theme`.

**Verification:** astro check 0/0/0, npm test 89/89, build 56 pages / 0 link violations; re-verified live post-deploy (Newsreader renders, dark-mode no-flash, StatCalc still computes).

**Next actions noted at the time:** Resume the paused callout automation / re-enable article routines per the TASK-018 plan (this was never fully executed before the July strategy pivot took priority -- see `docs/status/NOW.md`).
