# Meta title lengths -- audit finding, decision deferred

**Date:** 2026-09-10. **Status:** noted, not actioned. The user asked for this
to be recorded and left open ("we will think about it if we need to change").

## What was done this session

A babylovegrowth technical-SEO report flagged 16 pages for meta title length.
Fixed in `9af4547` (15 pages; `/about/` was already compliant) and `c41c975`
(the 6 remaining hubs + `/learn/`). All 12 category hubs and section landings
now render a 53-60 char `<title>`.

Mechanism: `categories` and `SectionLandingLayout` gained an optional
`seoTitle`. A hub's `title` is its H1, breadcrumb, footer-nav label and
`llms.txt` heading, so retitling in place would have pushed a 60-char string
into the footer of all 140 pages. Documented in `docs/ARCHITECTURE.md`
(SEO plumbing). Articles already had the mirror-image `h1` field.

## The open finding

The report sampled the site rather than crawling it. A full sweep of the built
output found **91 of 138 indexable pages outside the 45-60 char range** --
67 over, 24 under. Three distinct groups, each wanting a different fix:

1. **19 published outsourced articles -- 18 are 63-81 chars.** The worst on the
   site, and the report flagged none of them. Two problems, not one: too long,
   *and* the topic sits behind a hook ("$3,050 Example Shows...", "See a 6x
   Worked Example:...") or an audience tag. Some form of "for Students &
   Analysts" appears on 9 of 19 -- unsearched boilerplate that eats the budget
   and gets truncated anyway. `| Statohub` is cut off on all 18.
2. **~50 internal Learn articles at 61-70 chars.** A mild overshoot; topic is
   already front-loaded. Low priority.
3. **22 calculator pages at 26-43 chars.** All one template
   (`"{Thing} Calculator | Statohub"`), so a single systematic pass over the
   calculator YAML `title` fields would fix the set.

## Options, if resumed

- Rewrite group 1's titles (highest impact, ~19 editorial rewrites).
- Systematic pass over group 3 (cheap, mechanical).
- **Add a title-length check to `outsource-content/check_sanitized.py`.**
  Group 1 is the vendor's house style, so every future outsourced article
  arrives in this shape unless something gates it. Same argument as the
  trailing-slash gate: enforce structurally, don't clean up later.

Nothing here is broken -- pages are indexed and correct. This is lost CTR, not
a defect, which is why it was parked rather than fixed.
