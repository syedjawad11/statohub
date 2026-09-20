---
number: 0024
title: Team byline only, with real git-derived dates and a trust layer (editorial policy, contact, terms) -- no Person schema
type: content
status: accepted
date: 2026-09-20
---

**Context:** Google AdSense rejected the site for "low value content"
(`docs/status/sessions/2026-09-06-adsense-audit.md`, phase 0 inventory in
`sessions/2026-09-20-adsense-phase0-inventory.md`). One named cause was
missing E-E-A-T signals: 99 of 110 articles showed no date, calculator pages
showed no byline or date, there was no editorial policy, contact page or
terms text, and the footer and privacy page gave different contact addresses.
The remediation brief forbade inventing credentials, author names or
qualifications.

**Options considered:**
(1) Named individual author(s) with `Person` schema, bios and credentials.
(2) A single team byline (`Statohub Editorial Team`, an `Organization` under
the publisher) on every guide and calculator page, plus the pages that make
that byline accountable: `/editorial-policy/`, `/contact/`, and a Terms
section on the existing legal page.
(3) Do nothing about authorship; fix only content duplication.

**Decision:** Option 2. Specifically:
- One `EDITORIAL_TEAM` object in `src/lib/schema.ts` (name, route, description,
  email, `sameAs`) feeds the JSON-LD (`editorialTeamRef`, `organizationSchema`
  `email` / `contactPoint` / `publishingPrinciples`), both article layouts, the
  calculator page byline, the footer and the trust pages. **No `Person` schema
  anywhere** -- the site has no named individual authors and none will be
  invented.
- Every article and calculator-content file carries `pubDate`, `updatedDate`
  and `reviewedDate`. The initial values are **real git history**
  (`scripts/backfill-dates.mjs`: first commit that added the file; last commit
  touching it). The ten hand-set `pubDate: 2026-02-14` values from 2026-09-09
  predated the repository itself and were replaced by the git-add date. Pages
  render "Published <Mon YYYY> · Reviewed <Mon YYYY>", where "Reviewed" is
  the later of `reviewedDate` and `updatedDate` (`src/lib/dates.ts`).
- The one contact address is `admin@statohub.com` (owner-confirmed; the old
  `privacy@` was removed). AI use is disclosed as **research and
  proofreading only** (owner-supplied wording). No reference textbooks are
  listed beyond the sources the guides already cite (NIST/SEMATECH, Penn
  State STAT 501, OpenStax).
- Terms live in a `#terms` section of `/privacy-cookie-policy/` (page retitled
  "Privacy, Cookies & Terms"), per [[0009-combined-legal-page]]'s "one page
  unless genuinely long" rule; the footer "Terms" link uses `Link.astro`'s new
  `hash` prop. **No governing-law clause** -- the owner declined to name a
  jurisdiction rather than have one invented.

**Reasoning:** The only honest E-E-A-T claim available is the process, not a
person: a written standard, real dates, a working contact address and a
disclosure of how AI is used. A `Person` entity with no real person behind it
would be exactly the kind of fabricated trust signal the brief ruled out.
Git dates are the one source of publication history the repo actually has.

**Consequences:** `reviewedDate` is bumped by hand on a review with no text
change; `updatedDate` on a content edit; `pubDate` never. `backfill-dates.mjs`
only fills missing fields, so re-running it is a no-op. New utility routes are
reserved in `src/pages/[slug]/index.astro` and required by
`scripts/gen-llms-txt.mjs`. If a named author ever joins, add a `Person` under
the team rather than replacing the team entity.

**Revisit when:** a real, willing named author exists; or AdSense / Search
Console indicates the team byline is insufficient on its own.

**Related:** [[0009-combined-legal-page]], [[0013-no-accounts-backend-community-yet]]
