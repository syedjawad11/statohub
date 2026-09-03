# Technical SEO Baseline — statohub.com

- **Captured:** 2026-06-19
- **Live URL:** https://statohub.com
- **Host:** Cloudflare Pages (Astro SSG)
- **Method:** Live curl probes + DataForSEO `on_page_instant_pages` (mobile) + `on_page_lighthouse` (desktop, JS rendering on)
- **Purpose:** First technical SEO baseline against the live site (carried-over task from the 2026-06-18 session). Content/pipeline baseline was done separately on 2026-06-18; this is the **technical** layer.

---

## Technical Score: 88 / 100

Healthy launch baseline. No critical/indexing-breaking issues. The deductions are almost entirely **off-page-element polish** (homepage title, favicon, social image, security headers) rather than anything blocking indexation or ranking.

### Category Breakdown

| Category | Status | Score | Note |
|----------|--------|-------|------|
| Crawlability | pass | 95/100 | robots.txt valid, sitemap referenced, 39 URLs, SSG content in raw HTML |
| Indexability | pass | 95/100 | Self-canonical everywhere, www→apex 301, trailing-slash 308, no dup/noindex leaks |
| Security | warn | 65/100 | HTTPS solid, but no HSTS / CSP / X-Frame-Options |
| URL Structure | pass | 100/100 | Flat slugs, consistent trailing slash, single-hop redirects, short URLs |
| Mobile | pass | 95/100 | Viewport set, responsive, mobile-first ready |
| Core Web Vitals | pass (lab) | 90/100 | LCP 343ms, CLS 0.015 — lab only, no field data yet |
| Structured Data | warn | 80/100 | Article/Breadcrumb/SoftwareApplication on inner pages; homepage has none |
| JS Rendering | pass | 100/100 | Astro SSG; canonical/meta/JSON-LD all in initial HTML |
| IndexNow | n/a | — | Not implemented (low priority) |

---

## Core Web Vitals (lab — Lighthouse 13.3.0, desktop)

Measured on `/correlation-vs-causation/` (representative article page):

| Metric | Value | Target | Result |
|--------|-------|--------|--------|
| LCP (Largest Contentful Paint) | **343 ms** | <2.5 s | ✅ excellent |
| CLS (Cumulative Layout Shift) | **0.015** | <0.1 | ✅ excellent |
| INP proxy (max-potential-FID) | **18 ms** | <200 ms | ✅ excellent |
| First Contentful Paint | 343 ms | <1.8 s | ✅ |
| Speed Index | 409 ms | — | ✅ |
| Server response time | 104 ms | <600 ms | ✅ |
| Total byte weight | ~208 KB | — | ✅ lean |

Homepage CLS measured separately = **0** (DataForSEO instant pages).

**Lighthouse category scores (article page):**
- Performance: **100**
- SEO: **100**
- Accessibility: **94**
- Best Practices: **77** ← dragged down by missing security headers
- Agentic Browsing: **100**

> ⚠️ **No CrUX field data yet.** These are lab numbers. The 75th-percentile real-user CWV (what Google actually ranks on) won't populate until the site has enough traffic. Re-check CrUX once Search Console shows impressions.

---

## What's working well (keep)

- **URL contract is airtight.** Every URL is flat + trailing-slash. Non-slash → single **308** to slash; `www` → **301** to apex (path preserved). `/this-does-not-exist/` and `/calculators/odds/` both correctly **404**.
- **robots.txt** is clean and allow-all, with the sitemap declared:
  ```
  User-agent: *
  Allow: /
  Sitemap: https://statohub.com/sitemap-index.xml
  ```
- **Sitemap** is valid (`sitemap-index.xml` → `sitemap-0.xml`), lists **39 indexable, slash-terminated URLs** (home, about, 6 category hubs, 28 calculators, ~6 articles).
- **SSG = perfect render story.** Title, meta description, canonical, OG, and JSON-LD are all in the **initial server HTML** — no JS dependency, no canonical/noindex injection risk.
- **Single H1 per page**, self-referencing absolute canonicals, correct OG types (`article` on articles, `website` elsewhere).
- **Inner-page structured data is strong:** articles emit `BreadcrumbList` + `Article`; calculators emit `BreadcrumbList` + `SoftwareApplication` + `Offer`.
- DataForSEO on-page score: **98.17 / 100** on the homepage.

---

## Findings (prioritized)

### Critical (fix immediately)
None. 🎉

### High Priority (fix within ~1 week)

1. **Homepage `<title>` is just "Statohub"** (8 chars — flagged `title_too_short`).
   It carries zero keywords. The visible H1 ("Statistics you can read and run.") and the meta description are good, but the title tag is the single biggest on-page ranking/branding element and is currently wasted.
   *Fix:* something like `Statohub — Statistics Calculators + Plain-English Lessons` (≈50–60 chars). Apply to `og:title` / `twitter:title` too.

2. **No favicon at all.**
   No `<link rel="icon">` in HTML; both `/favicon.ico` and `/favicon.svg` return **404**. DataForSEO flags `no_favicon`. Hurts brand recognition in tabs and SERPs.
   *Fix:* add a favicon (SVG + ICO fallback) and the `<link rel="icon">` tags in `BaseLayout`.

3. **No social preview image (`og:image`).**
   The homepage (and pages generally) emit OG tags but **no `og:image`**, and `twitter:card` is `summary` (small) rather than `summary_large_image`. Links shared to social/chat will render bare.
   *Fix:* add a default OG image (1200×630) + per-template overrides; switch Twitter card to `summary_large_image`.

### Medium Priority (fix within ~1 month)

4. **Missing security headers** (the reason Best Practices = 77):
   - No `Strict-Transport-Security` (HSTS)
   - No `Content-Security-Policy` (CSP)
   - No `X-Frame-Options`
   Present and good: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, HTTPS enforced.
   *Fix:* add a Cloudflare Pages `_headers` file (or Transform Rule) setting HSTS (`max-age=31536000; includeSubDomains; preload`), a baseline CSP, and `X-Frame-Options: SAMEORIGIN`.

5. **Homepage has no JSON-LD** (0 structured-data blocks).
   Inner pages are well covered, but the homepage is missing `WebSite` (enables sitelinks search box) and `Organization` (brand entity / knowledge panel) schema.
   *Fix:* emit `WebSite` + `Organization` on the homepage via the existing `schema.ts` helpers + `JsonLd.astro`.

6. **Render-blocking resources** (minor): 1 render-blocking script + 1 stylesheet on the homepage. Performance is already 100, so this is cosmetic — only worth touching if a CWV regression appears.

### Low Priority (backlog)

7. **IndexNow not implemented** — would speed up Bing/Yandex indexing. Optional; Google ignores it.
8. **CrUX field data not yet available** — not an action, just a reminder to re-pull real-user CWV once traffic builds.
9. **Homepage `low_content_rate` flag** — expected for a homepage (273 words, lots of UI chrome). Not a real issue; noted for completeness.

---

## Baseline snapshot (for future drift comparison)

Record of current state so later deploys can be diffed:

| Element | Value @ 2026-06-19 |
|---------|--------------------|
| Indexable URLs in sitemap | 39 |
| robots.txt | allow-all + sitemap declared |
| Homepage title | `Statohub` (8 chars) |
| Homepage meta description | 135 chars, present |
| Canonical strategy | self-referencing, absolute, slash-terminated |
| www → apex | 301 |
| non-slash → slash | 308 |
| Security headers present | `X-Content-Type-Options`, `Referrer-Policy` |
| Security headers missing | HSTS, CSP, X-Frame-Options |
| Favicon | absent (404) |
| og:image | absent |
| Homepage JSON-LD | none |
| Article JSON-LD | BreadcrumbList + Article |
| Calculator JSON-LD | BreadcrumbList + SoftwareApplication + Offer |
| Lighthouse (article) | Perf 100 / SEO 100 / A11y 94 / BP 77 |
| LCP / CLS (lab) | 343 ms / 0.015 |

---

## Suggested next actions (in order)

1. Fix homepage `<title>` (High, ~5 min).
2. Add favicon + `og:image` + `summary_large_image` (High).
3. Add `_headers` for HSTS/CSP/X-Frame-Options (Medium) → lifts Best Practices toward 100.
4. Add homepage `WebSite` + `Organization` JSON-LD (Medium).
5. Re-pull CrUX field CWV once Search Console shows impressions.

*All of the above are content/template/header changes — none require touching the calculator engines or the typed-link gate.*
