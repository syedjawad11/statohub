---
number: 0028
title: Owner's content plan is written by Claude in the babylovegrowth template (both sections, no calculator embed, 1,500 floor) and auto-published daily by a cloud routine
type: content
status: accepted
date: 2026-10-04
---

**Context:** the owner supplied a 338-row content plan (195 Learn, 143
Applied; `content-ops/new-content-plan/`). They want it published by a second
daily routine alongside the outsource one ([[0026-outsource-daily-cloud-routine]]),
and want every article to follow the structure of the live babylovegrowth
Applied articles: answer paragraph, KeyTakeaways, quick checklist,
question-phrased H2s, worked example with infographic, Statohub's Take, tools
CTA, Sources, FAQ, Recommended. Their reason is that this structure carries
the site's SEO and GEO work. Three existing rules stand in the way:
[[0001-wedge-model]] / [[0015-wedge-scoped-to-learn]] (a Learn teaching
article with a matching calculator embeds it), the Applied playbook's 3,000
word floor for internally written Applied articles, and the internal
pipeline's human `draft: false` flip.

**Options considered:**
(1) Run the plan through `/write-article` unchanged: Learn playbook for Learn
rows, Applied playbook for Applied rows, human publish. Matches today's rules
but not the template, length or cadence the owner asked for.
(2) A separate content-plan pipeline on the internal board with its own
template, gate mode and auto-publish, scoped only to plan rows.

**Decision:** (2), on the owner's explicit calls (2026-10-04):
- **Template:** `content-ops/new-content-plan/TEMPLATE.md`, in both sections.
- **No calculator embeds** on any plan article, Learn included. Calculator
  pages are linked from the tools CTA and Recommended, not embedded. **This
  narrows [[0001-wedge-model]] further than [[0015-wedge-scoped-to-learn]]
  did** (0001 is marked "revisit: never"). It applies to plan rows only;
  existing Learn articles and `/write-article` keep the wedge.
- **Length:** the row's `est_words`, floor 1,500 (the [[0019-outsource-word-floor]]
  number), enforced by `check_sanitized.py --internal`.
- **Auto-publish** when `plan-article-reviewer` passes (mechanical gate,
  template, facts and arithmetic, curl-checked sources, cannibalization) and
  the real build passes at `draft: false`. Same trust model as the outsource
  reviewer; unlike that one, it also reviews prose and facts, because nobody
  upstream vouches for the text.
- **Board:** `content.db`, per [[0021-boards-split-by-source]] (Claude is the
  source). A `plan_rows` table marks the rows and keeps them out of
  `content_db.py next`.
- **Cadence:** one article per day at 03:00 Europe/Malta for the first month
  (to 2026-11-04), then revisit. Spec: `content-ops/routine/publish-daily.md`;
  pause switch `content-ops/routine/PAUSED` (separate from
  `content-ops/cloud-routine/PAUSED`, which stays).

**Reasoning:** the vendor template already passes every build and Applied
HARD gate, so reusing it (and its gate, in `--internal` mode) adds no new
mechanics. Keeping plan rows marked on the internal board lets the two internal
flows coexist without migrating rows or splitting boards again.

**Consequences:**
- Learn hubs gain articles in the applied template, rendered by
  `ArticleLayout` (H2-only TOC). The first one needs a visual check.
- The plan's keywords now sit in `content.db.keywords`, so the outsource
  routine's auto-queue collision check will skip vendor topics the plan
  already owns.
- Three rows (S077, S105, S135) were flagged at import because their primary
  keyword already belongs to another article. Amended 2026-10-04 (owner): they
  are removed from the plan, and their topics are added to the live owning
  articles in a dedicated rewrite session instead; their four logistic child
  rows are parked.
- AdSense was rejected for "low value content"; a daily AI-written article
  increases that risk unless the reviewer's accuracy and depth checks hold.
  Watch the first month's output.

**Revisit when:** the first month ends (2026-11-04), or plan articles start
needing calculator embeds to compete, which would argue for restoring the
wedge on Learn plan rows.

**Related:** [[0001-wedge-model]], [[0015-wedge-scoped-to-learn]],
[[0019-outsource-word-floor]], [[0021-boards-split-by-source]],
[[0026-outsource-daily-cloud-routine]]
