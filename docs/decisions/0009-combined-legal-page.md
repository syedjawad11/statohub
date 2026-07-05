---
number: 0009
title: One combined Cookie + Privacy page, not two
type: product
status: accepted
date: 2026-06-26
---

**Context:** Planning the site's required legal pages (TASK-017). The
conventional pattern is a separate Cookie Policy and Privacy Policy page.

**Options considered:**
(1) Two separate pages: `/privacy-policy/` and `/cookie-policy/`.
(2) One combined page covering both, at a single URL.

**Decision:** Option 2 -- a single page at `/privacy-cookie-policy/`, modeled
on the existing About page pattern, linked from the footer "Site" column.
Codex drafted the legal copy itself from a supplied outline; contact details
were left as a greppable placeholder for Claude to fill in.

**Reasoning:** For a solo-founder static content site with no accounts and
no user data collection beyond basic analytics/cookies, splitting the two
policies into separate pages adds a second thin page and a second internal
link for content that's short enough to read as one. One page reduces link
surface and maintenance without losing any legal coverage.

**Consequences:** Any future legal requirement (e.g. a terms-of-service page,
should accounts ever ship -- see [[0013-no-accounts-backend-community-yet]])
should default to this same "one page unless genuinely long" pattern rather
than always splitting by convention.

**Revisit when:** the combined page's word count or topical breadth grows
large enough that search intent for "cookie policy" and "privacy policy"
would be better served by separate, deeper pages -- not expected at this
site's scale.

**Related:** [[0002-flat-url-structure]]
