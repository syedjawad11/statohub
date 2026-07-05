---
number: 0003
title: No odds / betting-odds calculators
type: product
status: accepted
date: 2026-06-13
---

**Context:** The original tool inventory (from the pre-statohub SEO study)
included odds/betting-odds calculators alongside standard statistics tools.
Decided at repo bootstrap, before any calculator engine existed.

**Options considered:**
(1) Keep both `/calculators/odds/` and `/calculators/betting-odds/` as
planned tools.
(2) Remove both entirely; keep the educational `/calculators/probability/`
page (which teaches probability concepts, not betting odds conversion).

**Decision:** Option 2. Both odds calculators are removed entirely -- not
built, not routed, not indexed. `/calculators/probability/` stays as it is
educational probability content, not a betting tool.

**Reasoning:** Betting-odds tools sit outside the site's stats-education
positioning and invite a different (gambling-adjacent) audience and SEO
neighborhood than the rest of the wedge. This was a clean scope cut made
before build started, not a retrofit.

**Consequences:** This is enforced as a build-time expectation, not just a
missing feature -- the go-live verification for every deploy explicitly
checks that `/calculators/odds/` and `/calculators/betting-odds/` 404 (see
the TASK-007 go-live entry and the 404-by-design fix that came with it).
Any future task that touches the calculators content collection must not
re-add these slugs.

**Revisit when:** never, absent a full repositioning away from stats
education.

**Related:** [[0001-wedge-model]]
