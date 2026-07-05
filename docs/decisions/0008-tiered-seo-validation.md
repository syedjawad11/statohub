---
number: 0008
title: Three-tier SEO validation (hard / warn / advisory), not flat-blocking
type: process
status: accepted
date: 2026-06-18
---

**Context:** The article publishing pipeline (writer agent -> reviewer agent
-> QA gate -> build gate) originally treated every SEO/quality rule as an
equal, blocking "must" -- e.g. external-link count, keyword position, exact
title length were all pass/fail alongside genuine indexing breakers like a
missing meta description or a broken external link.

**Options considered:**
(1) Keep one flat list of hard requirements; anything not met blocks
publish.
(2) Split rules into three tiers: HARD (blocks publish -- objective
indexing/accessibility/build breakers), WARN (logged, never blocks --
stylistic/soft-SEO guidance), ADVISORY (report only).

**Decision:** Option 2. HARD covers: exactly one H1, primary keyword in
`<title>` (tolerant token match), title present and not truncated, meta
description present, slug contains the primary keyword (tolerant match),
no broken external link (curl-checked, 4xx/5xx fails; unreachable-from-sandbox
is a WARN not a HARD fail), >=1 authoritative link, >=2000 words, no raw
LaTeX (breaks MDX build), typed internal links only, no fabrication/
cannibalization. WARN covers link-count softness, keyword-position softness,
generic anchors, heading-level skips/stuffing, title/description length
outside the ideal range. ADVISORY is report-only style suggestions.

**Reasoning:** A flat "everything blocks" model produces two failure modes:
either the bar is set low enough that real defects (a 404 citation, a
duplicate H1) slip through, or it's set high enough that reasonable natural
variation (a title phrased slightly differently than the exact keyword
string) wrongly blocks otherwise-good content. Separating "this will actually
break indexing/accessibility/the build" from "this would be nicer" lets
automation (cloud routines) publish safely without a human in the loop for
every soft judgment call.

**Consequences:** The reviewer agent flips to CHANGES_REQUESTED only on hard
fails; WARN/ADVISORY are logged as non-blocking notes. This is what makes
unsupervised scheduled publishing ([[0006-github-actions-deploy]]) safe.

**Revisit when:** a WARN-tier issue causes a real ranking/UX problem in
practice, at which point promote that specific check to HARD rather than
re-flattening the whole system.

**Related:** [[0004-codex-builds-claude-reviews]], [[0006-github-actions-deploy]]
