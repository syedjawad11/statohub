---
number: 0020
title: Outsourced (babylovegrowth) content is Applied-only; Applied has exactly four category hubs
type: content
status: accepted
date: 2026-09-02
---

**Context:** the `categories` collection holds **ten** hubs, split into two
sections by a `section` field on the category YAML
([[0014-applied-section-url-family]]):

- **Applied** (`section: applied`) -- `data-analysis`,
  `experiments-causality`, `time-series-forecasting`,
  `machine-learning-statistics`.
- **Learn** (no `section` field; defaults to `learn`) -- `foundations`,
  `descriptive-statistics`, `inferential-statistics`,
  `probability-distributions`, `regression-correlation`, `combinatorics`.

Because articles carry only a flat `category` slug and no section field, and
because URLs are flat (`/{slug}/`), nothing in the frontmatter of an article
makes its section visible. The section is inferred entirely from which hub the
category belongs to. That is easy to miss.

On 2026-09-02, while queueing outsource batch 3, the orchestrator reassigned
two vendor articles to what looked like a better *topical* home --
`heteroscedasticity-test` from `data-analysis` to `regression-correlation`,
and `confidence-level-vs-significance-level` from `data-analysis` to
`inferential-statistics` -- reasoning across all ten hubs. Both are Learn
hubs. Both processors wrote the file as instructed and flagged the conflict
rather than silently overriding; `outsource-content/check_sanitized.py`
check 1 failed on both.

**Options considered:**
(1) Widen `ALLOWED_CATEGORIES` in `check_sanitized.py` to all ten hubs and let
outsourced articles land in Learn hubs where they fit topically.
(2) Add `section: applied` to `regression-correlation` and
`inferential-statistics` so those hubs accept Applied content.
(3) Keep outsourced content inside the four Applied hubs, and record the
section split explicitly so the mistake is not repeated.

**Decision:** Option 3. **Every babylovegrowth / outsourced article is an
Applied Statistics article, and its `category` MUST be one of the four Applied
hubs.** When no Applied hub is a perfect topical fit, pick the closest one --
do not reach into a Learn hub. `ALLOWED_CATEGORIES` in
`outsource-content/check_sanitized.py` stays at exactly those four slugs and is
the enforcement point.

**Reasoning:** Option 1 breaks the section model that [[0014]] deliberately
built -- a vendor-written practitioner playbook would render under
`ArticleLayout` (Learn) instead of `AppliedArticleLayout`, losing the applied
TOC behaviour and the "Build on this guide" grid, and would sit in a hub whose
other articles are teaching articles governed by the wedge
([[0001-wedge-model]], [[0015-wedge-scoped-to-learn]]). Option 2 is worse: it
would move every *existing* Learn article in those hubs -- `regression-assumptions`,
`linear-regression`, `confidence-interval`, `p-value` and the rest -- into the
Applied section as a side effect. Option 3 costs only occasional imperfect
topical fit, which the flat URL scheme makes nearly free: the hub affects
navigation and layout, never the article's URL or its keyword targeting.

**Consequences:** some outsourced articles sit in a hub that is not their
sharpest topical match -- `heteroscedasticity-test` lives in `data-analysis`
rather than alongside `regression-assumptions`. Accept it. Cross-linking, not
recategorising, is how those articles reach their topical neighbours. Note also
that the Applied/Learn split means outsourced content can never thicken a Learn
hub: growth there has to come from the internal `content_db.py` pipeline.

**Revisit when:** the Applied section gains or loses a category hub, or if
`section` ever becomes a field on `articles` rather than on `categories`.

**Related:** [[0014-applied-section-url-family]], [[0015-wedge-scoped-to-learn]],
[[0019-outsource-word-floor]]
