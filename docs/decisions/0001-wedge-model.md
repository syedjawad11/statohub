---
number: 0001
title: Calculator + teaching on the same page (the wedge)
type: product
status: accepted
date: 2026-06-13
---

**Context:** Deciding statohub's core differentiation before any code was written.
The stats-education space splits into two camps: pure calculator sites (compute,
no teaching) and pure teaching sites (articles/textbooks, no interactive tool).
No incumbent combines both on the same URL.

**Options considered:**
(1) Calculator-only site (fast to build, weak content moat, no SEO depth).
(2) Article-only teaching site (strong SEO, no interactive differentiator).
(3) Deep calculator AND plain-English teaching fused on the same page.

**Decision:** Option 3 -- the "wedge." Every standalone calculator page carries
a short teaching block below the tool; every teaching article that has a
matching calculator embeds the real, live `<StatCalc>` inline (not a link out
to it). One config + one engine drives both the standalone page and the
embedded instance -- no duplicated logic.

**Reasoning:** Calculator traffic and teaching-content traffic are different
search intents that usually live on different sites; owning both on one URL
compounds dwell time, internal linking, and topical authority in a way
neither alone achieves. This became the site's stated identity: "~50 teaching
articles + ~23 standalone calculator pages ... Wedge: deep calculator + teaching
on the same page (no incumbent does both)."

**Consequences:** The `calculators` content collection needs both
`standalone` (page-worthy) and embed-only configs from day one (see
[[0002-flat-url-structure]] for the resulting URL split). Article authoring
must treat "does this topic have a calculator" as a first-class question, not
an afterthought -- confirmed by the 2026-07 strategy review, which found
combinatorics/inferential silos have calculators outnumbering articles
("backwards; the articles are the missing half of the wedge there").
Homepage treatment of the wedge was later narrowed (no live calculator in the
hero) -- see [[0011-no-homepage-live-calculator]], which does not reverse this
decision, only where the fused card appears.

**Revisit when:** never, absent a full repositioning of the site -- this is
the founding thesis, not a tactical call.

**Related:** [[0002-flat-url-structure]], [[0011-no-homepage-live-calculator]]
