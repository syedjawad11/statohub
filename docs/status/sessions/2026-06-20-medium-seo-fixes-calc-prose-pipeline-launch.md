# Session: Medium SEO fixes shipped + calculator-prose pipeline stood up -- 2026-06-20

**Objective:** Ship the 2 remaining Medium technical-SEO fixes, then settle and build the calculator-page teaching-prose content model.

**Completed:**
- Security headers: added `public/_headers` (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, COOP, baseline CSP) since Wrangler/Cloudflare Pages can't set these any other way for a Direct Upload project. Lifts Lighthouse Best Practices 77 -> ~100.
- Homepage JSON-LD: added `webSiteSchema`/`organizationSchema` helpers to `src/lib/schema.ts`, wired via BaseLayout's `jsonLd` prop.
- Settled the calculator-prose content model: each standalone `/calculators/{slug}/` page gets its OWN short teaching block (~300-700 words: lead + how-to + worked example + FAQ) in a new `calculator-content` MDX collection, rendered below the tool -- not a pointer to the full article. Built a lighter validation tier (no 2000-word floor) for this content type, and a daily cloud routine (`publish-next-calc-prose.md`) draining a 25-calculator queue (`content-ops/calc-prose/QUEUE.md`) one per day.
- Published the pilot (`standard-deviation`) and `mean`; the `mean` pilot correctly got deferred once by the broken-link gate (a 404'd Penn State URL) -- fixed by curating an allowlist of pre-verified authoritative links so the routine stops guessing fragile deep URLs.

**Files changed:** `public/_headers`, `src/lib/schema.ts`, `src/pages/index.astro`, `src/content/config.ts` (new `calculator-content` collection), `src/pages/calculators/[slug]/index.astro`, `content-ops/cloud-routine/publish-next-calc-prose.md`, `content-ops/calc-prose/QUEUE.md`, `src/content/calculator-content/standard-deviation.mdx`, `src/content/calculator-content/mean.mdx`.

**Decisions made:** Calculator teaching blocks are a distinct, lighter content type from full articles -- no 2000-word floor, just structural + link-quality gates.

**Verification:** astro check 0/0/0, build 42 pages / 0 link violations; verified `/calculators/mean/` live 200 with working NIST link after the fix.

**Next actions noted at the time:** Daily routine drains the 25-calculator queue automatically; spot-check the next day's publish.
