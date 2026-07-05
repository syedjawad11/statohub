---
number: 0007
title: Build all calculators before resuming article writing
type: process
status: superseded
date: 2026-06-16
---

**Context:** By 2026-06-16, ~10 of ~28 planned calculator engines existed and
a handful of launch articles were live/auto-publishing. The wedge model
([[0001-wedge-model]]) means articles are meant to embed real, live
calculators -- but most calculators didn't exist yet, so new articles risked
being written without their intended embed, or needing a rewrite later.

**Options considered:**
(1) Keep publishing articles on the existing backlog schedule while
calculator engines are built in parallel.
(2) Pause article publishing entirely; sequence all remaining calculator
engines + standalone pages first; resume articles only once the full
calculator set exists.

**Decision:** Option 2, adopted as a time-boxed sequencing choice, not a
permanent policy.

**Reasoning:** Since every article is supposed to consume a real `<StatCalc>`
embed where its topic has one, writing articles ahead of their calculators
inverts the wedge and risks either thin articles (no embed) or rework once
the calculator ships. Pausing article publishing while calculators are built
in a single focused push (TASK-011 through TASK-016) avoided that rework.

**Consequences:** The article auto-publish cloud routines were paused for
this window; all `handoff/` briefs during this period targeted `src/calc/**`
engines and their standalone pages. Once the full calculator set (~26-29
engines) shipped on 2026-06-17, article publishing resumed and this decision
was fully satisfied -- it is not in force today.

**Revisit when:** N/A -- superseded by completion. Marked superseded rather
than rejected because the sequencing call was correct for its narrow window;
it should not be reapplied wholesale if a similar gap reappears without
re-evaluating the specific tradeoff (a small number of missing calculators
does not justify re-pausing all content).

**Related:** [[0001-wedge-model]]
