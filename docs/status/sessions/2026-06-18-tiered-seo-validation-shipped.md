# Session: three-tier SEO validation spec shipped + 4 articles retrofitted -- 2026-06-18

**Objective:** Replace the flat "everything blocks publish" QA model with a tiered spec, and bring the 4 live articles up to the new standard.

**Completed:**
- Defined and wired the HARD / WARN / ADVISORY tier system into the whole publishing pipeline (`publish-next-article.md`, `.claude/seo-playbook.md`, both content agents) -- see [[0008-tiered-seo-validation]] for the full rationale and rule set.
- Added an optional `h1` frontmatter field (`src/content/config.ts` + `ArticleLayout.astro`) so a long/keyword-front-loaded SEO title can differ from the visible headline, fully backward-compatible.
- Retrofitted the 4 published articles: corrected the premise that they were missing external links (they weren't) -- the real issues were 3 bare-URL anchors and one wrong NIST citation (`correlation-vs-causation` cited an off-topic "Block Plot" page). Fixed all anchors to descriptive text, replaced the wrong citation, brought each article to 2 authoritative links, all 8 curl-verified 200.

**Files changed:** `content-ops/cloud-routine/publish-next-article.md`, `.claude/seo-playbook.md`, `.claude/agents/stats-article-writer.md`, `.claude/agents/stats-article-reviewer.md`, `src/content/config.ts`, `src/layouts/ArticleLayout.astro`, the 4 published article MDX files.

**Decisions made:** [[0008-tiered-seo-validation]] -- only HARD failures block publish; WARN/ADVISORY are non-blocking notes. Primary-keyword-in-title and slug-contains-keyword use tolerant token matching (exact phrase OR all significant words).

**Verification:** Re-ran the tiered gate against all 4 articles: WARN: NONE on all. astro check 0/0/0, 33 files/89 tests, build 39 pages/1112 links/0 violations.

**Next actions noted at the time:** `seo-technical` + `seo-drift` baseline capture on the live URL; a future calculator-page-prose SEO pass.
