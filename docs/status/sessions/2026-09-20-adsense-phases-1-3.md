# Session: AdSense remediation -- Phases 1-3 -- 2026-09-20

**Objective:** Execute the AdSense "low value content" remediation plan
(baseline: `2026-09-20-adsense-phase0-inventory.md`), one commit per phase.

**Completed:**
- Phase 1 -- FAQ dedupe on 35 pages, 752 -> 670 FAQ entries; rule locked in
  `.claude/seo-playbook.md` §4 + reviewer agent (`b6f31f9`..`ce36780`).
- Phase 2 -- 5 near-duplicates merged with 301s in `public/_redirects`
  (average->mean calc, mean-vs-average, how-to-find-frequency-statistics,
  pearson-correlation-coefficient, sample-variance-formula); 2 pages
  differentiated; board rows `merged` (`da19ca4`). 153 -> 148 pages.
- Phase 3 -- team byline + real git dates on all 130 guide/calculator pages,
  `/editorial-policy/`, `/contact/`, `#terms` on the legal page, Organization
  schema contact/publishingPrinciples, ADR 0024 (`f1020d3`). 150 pages.

**Files changed:** see the three commit ranges above; key: `public/_redirects`,
`src/lib/schema.ts`, `src/lib/dates.ts`, `scripts/backfill-dates.mjs`,
`src/pages/{editorial-policy,contact}/index.astro`, `src/content/config.ts`.

**Decisions made:** [[0024-team-byline-and-trust-pages]] (team byline only,
git-derived dates, no Person schema, no governing-law clause, one address
`admin@statohub.com`, AI = research + proofreading only). Owner-supplied facts
are recorded there; nothing was invented.

**Assumptions:** "no need to reference anything on policy page" was read as
"list no reference textbooks"; the AI sentence *is* on `/editorial-policy/`
as well as `/about/` -- remove it there if the owner meant otherwise.
`seed.json` is stale vs the board -- never run `content_db.py seed`.

**Tests/verification:** `npx astro check` 0/0/0; `npm test` 128; `npm run build`
150 pages, 6,484 links / 0 violations, meta 0, docs 0, boards in sync. Redirects
not yet verified live (`curl -I` each source after deploy -> single 301 to 200).

**Open issues / risks:** Phases 4-5 **deferred by the owner to a later
session** ("we will think about it"): (4) vary the 24 calculator-content
section shapes; replace the 337 rotated RelatedLink intros
(`src/lib/related-intros.ts`) with contextual sentences, articles in ~15-page
batches; decide enrich-vs-noindex for `/calculators/factorial/` (577 words),
`/z-score/` (619), `/proportion/` (627); optional hub intros. (5) verify,
`scripts/check-content-quality.mjs`, before/after note vs Phase 0. AdSense
resubmission has NOT been done; Consent Mode v2 still missing (09-06 audit).

**Next actions:** 1. Confirm the deploy served the 5 redirects and the two new
pages. 2. When resumed, start Phase 4 with the 24 calculator pages + the
thin-page recommendation, then articles in batches. 3. Resubmit to AdSense
only after Phase 5's before/after check.

**Context for next session:** `docs/status/NOW.md`;
`/home/shah20/.claude/plans/task-fix-adsense-encapsulated-honey.md` (Phases 4-5
spec); `2026-09-20-adsense-phase0-inventory.md` (baseline); ADR 0024.
