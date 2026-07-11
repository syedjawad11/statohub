# Session: internal-linking standard (TASK-017/018) + calc-prose Session 3 -- 2026-06-26

**Objective:** Build the site-wide internal-linking layer (related-calculators sidebar + varied callout component + combined legal page), decide how future callouts get inserted, and keep draining the calc-prose backlog.

**Completed:**
- TASK-017 written & delivered: combined `/privacy-cookie-policy/` page, an auto-derived "Related calculators" sidebar (`src/lib/related-calculators.ts`, same-category-first, data-driven so future calculators inherit it free), and a `<RelatedLink>` callout component with a varied-intro picker from an approved phrase pool.
- Realized the first pass put a single `<RelatedLink>` at the END of each page -- not the desired "3-4 woven through the article" pattern. Wrote TASK-018 (a pure-insertion brief: Claude authored the exact link map, Codex only inserted the JSX) to retrofit ~70 callouts across 40 existing files.
- **Decided the future-facing fix:** hand-inserting callouts doesn't scale, so callout placement becomes a data-driven layout behavior going forward (see [[0010-woven-related-link-callouts]]), not a per-page manual task. Documented the standard in `CLAUDE.md`'s "Internal linking & related-link standard" section.
- **Paused the two article-publishing cloud routines** (reversible, `enabled:false`) so no new page ships without woven callouts while the automation is designed. The calc-prose routine was already disabled from the prior session.
- Calc-prose Session 3 published: `binomial-distribution`, `combination`, `factorial`.

**Files changed:** `src/pages/privacy-cookie-policy/index.astro`, `src/lib/related-calculators.ts`, `src/components/RelatedLink.astro`, `CLAUDE.md`, 21 article MDX + 19 calculator-content MDX (TASK-018 retrofit), 3 new calc-prose MDX files.

**Decisions made:** [[0009-combined-legal-page]], [[0010-woven-related-link-callouts]]. Article routines paused pending the callout-automation design (a decision that was never fully executed -- see the Phase-B migration note in `docs/status/NOW.md`).

**Verification:** astro check 0/0/0; build green with 0 link violations; calc-prose S3 pages verified live.

**Next actions noted at the time:** Wire the callout automation into `ArticleLayout` + the writer agent before re-enabling the article routines; calc-prose Session 4 (`correlation-coefficient`, `linear-regression`, `confidence-interval`).
