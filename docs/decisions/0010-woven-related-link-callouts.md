---
number: 0010
title: Related-link callouts woven + data-driven, never hand-dumped at the end
type: content
status: accepted
date: 2026-06-26
---

**Context:** The first internal-linking pass (TASK-017) put a single
`<RelatedLink>` callout at the end of each page. The user found this weak:
they wanted 3-4 callouts woven through articles (after every 2-3 paragraphs)
and 1-2 per calculator teaching block, styled as a distinct blue callout, with
the intro phrasing varied so it doesn't read as templated.

**Options considered:**
(1) Keep manual, one-off placement per page (what TASK-017 shipped).
(2) One-time manual retrofit of existing pages (TASK-018) PLUS make callout
placement for all FUTURE content an automated, data-driven layout behavior
(like the existing "Related calculators" sidebar) rather than a hand-authored
step that doesn't scale.
(3) Fully automatic placement derived purely from `category`/`related`
frontmatter with zero authoring judgment (a sub-option considered for the
automation layer specifically).

**Decision:** Option 2, with the automation shaped as the "hybrid" variant
under it: the writer agent fills a `related:` slug list in frontmatter at
draft time (it already exercises this judgment for inline links), and the
layout auto-distributes `<RelatedLink>` callouts across H2 section
boundaries with rotating intro phrases pulled from an approved pool ("Worth
reading next", "On a related note", "You may also find this useful", "For a
related calculation", "Another helpful calculator is", "See also" -- never
repeated on one page). The fully-automatic option (3) was explicitly not
chosen because it drops the ability to hand-pick a genuinely better target.

**Reasoning:** Manual insertion does not scale to the site's publishing
volume (multiple articles/day via cloud routines); a data-fed layout
behavior, mirroring the already-proven `related-calculators.ts` sidebar
pattern, keeps quality without adding a human review gate that would block
auto-publishing.

**Consequences:** The two article auto-publish cloud routines were paused
(reversibly, via `enabled:false`) until the automation shipped, so no new
page would publish without woven callouts in the interim. Every internal
callout link still routes through the typed `routes`/`url()` registry
([[0002-flat-url-structure]]), so the `check-links` gate still catches a bad
target.

**Revisit when:** if the rotating-intro pool starts feeling repetitive at
higher page-per-topic density, expand the pool rather than reverting to
hand-placement.

**Related:** [[0002-flat-url-structure]], [[0004-codex-builds-claude-reviews]]
