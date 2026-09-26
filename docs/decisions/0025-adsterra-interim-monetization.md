---
number: 0025
title: Adsterra banners and popunder as interim monetization while AdSense is unapproved; AdSense code stays in place
type: architecture
status: accepted
date: 2026-09-27
---

**Context:** Google AdSense rejected the site ("low value content"); phases 4-5
of the remediation are parked, so AdSense serves nothing. The owner wants the
site earning now and supplied Adsterra codes: six iframe banners (728x90,
468x60, 320x50, 300x250, 160x600, 160x300) and one popunder script.

**Options considered:**
(1) Wait for AdSense approval before running any ads.
(2) Replace AdSense with Adsterra, removing the AdSense loader, Funding
Choices CMP and `ads.txt` line.
(3) Run Adsterra now and leave the AdSense code untouched for resubmission.

**Decision:** Option 3 (owner's call). Specifically:
- Keys and the popunder URL live in one registry, `src/lib/ads.ts`. Slots are
  `src/components/ads/AdSlot.astro` with named size ladders (leaderboard,
  rectangle, skyscraper, halfSkyscraper); a slot renders on PROD builds only.
- Adsterra banner snippets share a global `atOptions`, so several on one page
  overwrite each other. BaseLayout's inline loader renders every banner inside
  its **own `srcdoc` iframe**, lazily (IntersectionObserver), picking the
  largest size that fits the slot's width (and, for the Learn rail, the
  viewport height left over under the sticky TOC).
- Placements: Learn and Applied articles (top leaderboard, end rectangle;
  Learn also the desktop rail), calculator pages (rectangle after the teaching,
  half-skyscraper under related calculators -- never beside the inputs), home,
  category hubs and the calculators index (one leaderboard each).
- Gate: `PROD && !noindex && ads`. BaseLayout's `ads` prop is `false` on
  about, contact, editorial-policy and privacy/terms; 404 and `/dev/` are
  noindex. The popunder loads once per eligible page from BaseLayout.
- One Adsterra **native banner** (`src/components/ads/AdNative.astro`, script +
  fixed container id, so at most once per page) sits after the end rectangle
  on Learn and Applied articles.
- The privacy page discloses Adsterra (including popunders) alongside AdSense.
- The CSP in `public/_headers` must admit Adsterra's rotating domains for
  scripts, frames, images and connections, or nothing serves.

**Reasoning:** Adsterra approves low-traffic sites with no content review, so
it earns immediately; keeping the AdSense code costs nothing and keeps the
resubmission path open. Isolating each banner in its own frame is the only
reliable way to run more than one Adsterra banner per page.

**Consequences:** **Before any AdSense resubmission, remove the popunder** (it
violates AdSense policy) and re-tighten the CSP; the banners may stay.
Popunder frequency is capped in the Adsterra dashboard, not in code. Adding a
new banner size means one key in `ads.ts` plus a ladder entry.

**Revisit when:** AdSense approves the site, or Adsterra revenue / user
complaints make the popunder not worth it.

**Related:** [[0024-team-byline-and-trust-pages]], [[0013-no-accounts-backend-community-yet]]
