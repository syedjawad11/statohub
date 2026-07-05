---
number: 0012
title: Quizzes dropped as a feature
type: product
status: rejected
date: 2026-07-05
---

**Context:** The 2026-07 strategy review (`docs/ideas/statohub-strategy-review.md`)
evaluated three product-expansion paths beyond calculators + articles:
quizzes, guided no-code projects, and games. It recommended a static,
no-login quiz system (question banks as versioned JSON, client-side scoring,
localStorage history) as the first expansion, run as a two-silo 60-day
validation experiment, on the reasoning that quizzes compound SEO ("[topic]
quiz" queries) and deepen the wedge with minimal build cost.

**Options considered:**
(1) Build the quiz system as recommended -- two-silo validation experiment
first, scale if metrics hit thresholds (>10% quiz-start rate, >50%
completion after 60 days).
(2) Skip quizzes; make guided no-code projects the first product expansion
instead.
(3) Build both roughly in parallel.

**Decision:** Option 2. Quizzes are dropped by explicit user decision,
recorded in `docs/ideas/statohub-action-plan.md` ("Quizzes are dropped by decision;
guided no-code projects are the first product expansion"). Projects move to
the front of the roadmap (Phase D in the action plan) in place of the
strategy review's recommended quiz-first sequencing.

**Reasoning:** Not documented in detail beyond the user's direct call in the
action plan; the strategy review's own comparison shows projects have
comparable-or-higher user/SEO value with lower build cost (pure content,
reuses the existing writer pipeline) than quizzes (needs a new static
question-bank system, schema, and scoring UI). The decision explicitly
overrides the strategy review's Section 8 recommendation.

**Consequences:** No quiz content collection, schema, or UI should be built
without a fresh decision reopening this. `/quizzes/` does not appear in the
site's near-term roadmap; the action plan's "Parked" section notes the
static-quiz design from the strategy review still applies if this is ever
revisited.

**Revisit when:** the user explicitly reopens it -- e.g. if projects
underperform their own validation criteria (Phase D3 in the action plan) and
quizzes are reconsidered as an alternative expansion.

**Related:** [[0013-no-accounts-backend-community-yet]]
