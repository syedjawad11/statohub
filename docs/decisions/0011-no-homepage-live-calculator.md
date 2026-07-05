---
number: 0011
title: Homepage hero uses a static SVG figure, no live embedded calculator
type: product
status: accepted
date: 2026-06-27
---

**Context:** The pre-refresh homepage embedded a real, live `StandardDeviation`
`<StatCalc>` in its hero. The 2026-06-27 theme-refresh mockup redesigned the
homepage hero around a static `.hero-fig` SVG normal-distribution figure with
no live calculator, and the user needed to confirm this was intentional
before Codex ported it.

**Options considered:**
(1) Keep a live calculator embedded in the homepage hero (as before).
(2) Static SVG distribution figure in the hero; the live-calculator wedge
still shown elsewhere (the article `.fuse` card, and every calculator page
itself).

**Decision:** Option 2, explicitly confirmed by the user during the
theme-refresh planning session ("keep static SVG distribution figure, does
not embed a live calculator").

**Reasoning:** The homepage's job is orientation and navigation (silo
catalog, calculator band, recent content), not computation; a live
calculator there added load weight and visual complexity without a clear
homepage-specific use case, while the wedge itself ([[0001-wedge-model]]) is
still fully demonstrated on every article and calculator page. This was also
paired with a copy fix later in the same content thread: softening
hero-adjacent copy that implied "compute on every page" when the homepage
itself no longer computes anything.

**Consequences:** New homepage redesigns must not silently re-add a live
`<StatCalc>` to the hero without a fresh decision -- the wedge is proven
elsewhere on the site, so this is a narrow, homepage-specific carve-out, not
a reversal of [[0001-wedge-model]].

**Revisit when:** homepage engagement data suggests visitors want to compute
before navigating anywhere else (not measured as of this decision).

**Related:** [[0001-wedge-model]]
