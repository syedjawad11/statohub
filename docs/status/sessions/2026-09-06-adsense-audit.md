# Session: AdSense compatibility audit -- 2026-09-06

**Objective:** The AdSense application has sat ~3 weeks with no response. Audit
the site for a technical or policy fault that could be stalling the review,
rather than assuming it is normal queue latency.

## Finding: no technical blocker exists

Every mechanical thing AdSense can fail on was verified against the **live**
site, not the repo:

| Check | Result |
| --- | --- |
| Loader snippet | present on 138/139 built pages (only the `noindex` `/dev/` page excluded) |
| `public/ads.txt` | live, correct, matches publisher `pub-4667906964697238` |
| Crawler access via Cloudflare | `Mediapartners-Google`, `AdsBot-Google`, `Googlebot`, `Google-AdSense` all HTTP 200 |
| `robots.txt` | allows all; only `/dev/` disallowed, and that page is `noindex,follow` |
| CSP (`public/_headers`) | all Google ad/consent hosts allowlisted; no blocked directive |
| Sitemap | 138 URLs, valid, `/dev/` excluded |
| 404 / HTTPS / speed | real 404s, HSTS, ~200ms response |
| Content volume | 97 articles, 310,862 words, smallest article 2,444 words -- far above any thin-content threshold |

So the "the site has a technical fault" theory does not hold. The remaining
risk is **policy and E-E-A-T presentation**, not plumbing.

## Fixed this session

**`src/pages/privacy-cookie-policy/index.astro` contained false statements.**
This was the one citable AdSense program-policy violation on the site: the
policy denied collecting data the site actually collects.

- It claimed *"Statohub does not currently include an analytics script in this
  repo."* In fact **both** GA4 (`G-PVHDLYC7T4`) and Ahrefs Web Analytics
  (`analytics.ahrefs.com/analytics.js`) load on every production page, from
  `src/layouts/BaseLayout.astro`.
- It claimed *"Statohub does not set any cookies of its own."* GA4 sets
  first-party `_ga` / `_ga_*` cookies on this domain.
- The consent section claimed advertising **and measurement** cookies are gated
  on consent. Advertising is (via Funding Choices); analytics is not.

Rewritten so all three statements are accurate: a real Analytics section naming
both services and their cookies, an opt-out route, a scoped consent claim, and
an honest note that analytics is not yet behind the consent message. `Last
updated` moved to September 6, 2026.

## Deferred -- agreed to fix in a later session

Ordered by how much each is likely to matter to a human policy reviewer.

1. **Google Consent Mode v2 is missing.** `src/layouts/BaseLayout.astro` fires
   `gtag('js')` / `gtag('config')` with no `gtag('consent', 'default', ...)`
   ahead of it, so GA4 sets cookies before the CMP is answered. Google requires
   Consent Mode v2 from publishers serving EEA traffic. This may also explain
   the consent banner that "never visibly renders", open since
   `2026-08-23-adsense-consent-csp-fix.md`. **When this lands, delete the
   interim "not yet wired into that consent message" paragraph added to the
   privacy policy this session.**
2. **No authorship anywhere.** `articleSchema()` in `src/lib/schema.ts` sets
   `author: organizationRef`, so all 97 articles are written by a faceless org,
   and no byline appears in `ArticleLayout.astro` or
   `AppliedArticleLayout.astro`. For a site teaching statistical method this is
   the standard E-E-A-T gap. Blocked on the user deciding what name and
   credentials to attribute to.
3. **The About page is 40 words** (`src/pages/about/index.astro`) and names no
   human or organisation. Reviewers read this page to answer "who is behind
   this site".
4. **No contact page and no terms page.** Contact is a footer `mailto:` only,
   and the two published addresses disagree: `admin@statohub.com` in
   `BaseLayout.astro` vs `privacy@statohub.com` in the privacy policy.
   Cloudflare Email Routing MX records exist for the zone, but neither address
   was confirmed to actually deliver -- carried over unresolved from
   2026-08-23. Verify both in the Cloudflare dashboard before publishing a
   contact page.
5. **No ad units placed.** No `<ins class="adsbygoogle">` anywhere in `src/`, so
   unless Auto Ads is enabled in the AdSense UI there is nothing for a reviewer
   to watch render.

**Read together, items 2-4 are the likely story:** strong, deep articles
presented by an anonymous site with a two-sentence About page, no contact page,
and (until today) a self-contradicting privacy policy. That profile invites
manual review rather than auto-approval.

**Files changed:** `src/pages/privacy-cookie-policy/index.astro`,
`docs/status/NOW.md`, this file.

**Verification:** see the commit -- `npx astro check`, `npm test`,
`npm run build` all run before commit.
