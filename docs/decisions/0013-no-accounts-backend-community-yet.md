---
number: 0013
title: No accounts, backend, community, or games for now
type: product
status: accepted
date: 2026-07-05
---

**Context:** The 2026-07 strategy review evaluated the site's product
direction across three options: (A) stay calculator + content, (B) add
no-login content types (quizzes/projects/paths) as a "learning hub," (C) add
a community/social platform. It also scored a long feature list (accounts,
progress tracking, badges, leaderboards, community/UGC, personalized
dashboards, games) against user value, SEO value, build cost, and whether
each needs a backend or login.

**Options considered:**
(1) Build accounts + backend now to unlock progress tracking, saved results,
and community features ahead of demand.
(2) Defer all of it; stay backend-free and login-free; revisit only when
specific, pre-defined triggers are met.

**Decision:** Option 2, adopted into the action plan's "Parked" list:
"Accounts, backend, community, games: all 'no' per the strategy review."
Everything recommended in the near term (calculators, articles, guided
projects) must work anonymously, with at most localStorage for any
client-side state.

**Reasoning:** Distribution, not features, is the binding constraint at this
stage (no meaningful traffic yet) -- shipping accounts/backend/community
before an audience exists adds a permanent operational tax (auth provider,
database, session security, GDPR handling, moderation, spam/abuse
prevention) purchased before a single user has asked for it, and login
friction actively suppresses conversion on anonymous-friendly features like
quizzes or projects. Community/UGC specifically has a cold-start failure
mode (an empty forum reads as a dead site) and an ongoing moderation cost
this solo-founder project cannot absorb.

**Consequences:** No feature on the current roadmap may require sign-in or a
database. Progress tracking, saved results, and bookmarks stay
localStorage-only until a trigger is met. Games are deprioritized behind
projects and are, at most, a single validated link-asset later, not a
platform investment now.

**Revisit when:** ANY of -- sustained ~10-20k organic sessions/month; the
course/certificate layer launches (progress + certificates genuinely need
identity); or recurring, direct localStorage-limitation complaints from
real users. When triggered, the strategy review specifies managed auth
(Supabase or Clerk, never hand-rolled) with anonymous mode preserved, not a
full community platform -- that stays a separate, still-unjustified
decision even after the accounts trigger fires.

**Related:** [[0012-quizzes-dropped]]
