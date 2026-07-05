# Session: meta description length fix + build-time gate — 2026-07-05

**Objective:** Fix an Ahrefs "meta description too short" report (32 URLs
flagged, 39-92 chars vs. the ~110-160 char recommendation) and add a
build-time gate so this class of issue can't recur.

**Completed:**
- Traced root cause: `description` in `src/content/config.ts` had no length
  constraint on any collection, and the only place length was even checked
  (`stats-article-reviewer`) is WARN-tier and only ever runs on articles —
  never on calculators, categories, or static pages. So this page class had
  zero validation.
- Rewrote all 29 calculator descriptions (`src/content/calculators/*.yaml`),
  all 6 category descriptions (`src/content/categories/*.yaml`), 3 inline
  static-page descriptions (`about`, `privacy-cookie-policy`,
  `calculators` hub index), and 4 pre-existing articles that fell outside
  the new range once the schema constraint went sitewide
  (`probability-distribution.mdx`, `standard-deviation.mdx`, `variance.mdx`,
  `what-is-an-average.mdx`) — all now 110-160 chars.
- Added `metaDescription = z.string().min(110).max(160)` shared schema in
  `src/content/config.ts`, applied to `articles`, `categories`, `calculators`.
- Added `scripts/check-meta-description.mjs` (modeled on `check-links.mjs`):
  scans built `dist/**/*.html`, fails on any `<meta name="description">`
  outside 110-160 chars, **skips noindex pages** (e.g. `/404.html`) since
  their description doesn't affect SEO. Wired into `npm run build`.
- Updated `.claude/seo-playbook.md`: meta-description length moved from
  WARN to HARD (§0 tier explainer, §7 build contracts, §8 checklist item 4),
  with an explicit note that it's enforced sitewide, not just for articles.

**Files changed:**
`src/content/config.ts`, `scripts/check-meta-description.mjs` (new),
`package.json`, `.claude/seo-playbook.md`,
`src/content/calculators/*.yaml` (29 files),
`src/content/categories/*.yaml` (6 files),
`src/pages/about/index.astro`, `src/pages/privacy-cookie-policy/index.astro`,
`src/pages/calculators/index.astro`,
`src/content/articles/{probability-distribution,standard-deviation,variance,what-is-an-average}.mdx`.

**Decisions made:** Meta-description length (110-160) is now a HARD build
contract sitewide, enforced two ways (Zod schema for content-collection
pages, dist-HTML scan for hand-typed static-page strings). Not written up
as a separate ADR — it's a straightforward bug-fix + gate addition, not an
architectural choice with real alternatives.

**Assumptions:** The 110-160 char range follows Ahrefs' default thresholds;
no site-specific A/B data exists to justify a different range.

**Tests/verification:** `npm run build` (70 pages, 0 link violations, 0
meta-description violations), `npx astro check` (0/0/0), `npm test`
(118/118, unaffected). One YAML syntax bug caught mid-fix (unquoted colon in
a description broke YAML parsing in 3 category files) and fixed.

**Open issues / risks:** None outstanding. The two rewrite passes were done
by subagents in parallel — spot-check a handful of calculator descriptions
against their actual formulas if precision matters for a specific launch
(the subagent cross-checked each against `title`/`engine`/`inputs`/
`outputLabels` and flagged nothing as ambiguous).

**Next actions:** None required; this thread is closed. Re-run
`npm run build` after any future edit to a description field — the gate
will catch regressions automatically.

**Context for next session:** `.claude/seo-playbook.md` §7 (build contracts)
and `scripts/check-meta-description.mjs` if this area needs touching again.
