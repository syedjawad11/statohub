# Session: content pipeline stood up + TASK-008 + first article published -- 2026-06-14

**Objective:** Build the article-writing pipeline (separate from the Codex `handoff/` build loop), ship the flat article-route task, and publish the first launch article.

**Completed:**
- Stood up `content-ops/` -- a self-contained SQLite editorial board (`content_db.py` CLI: init/seed/list/show/brief/next/set-status/log-review) seeded from the SEO study (48 articles, 7 categories, 28 calculators, 354 keywords, 0 cannibalization conflicts -- enforced by a `UNIQUE INDEX` on keywords). Built `.claude/agents/stats-article-writer.md` + `stats-article-reviewer.md` + `.claude/seo-playbook.md` (the shared rule book: >=2000 words, >=1 authoritative link, all brief keywords used naturally, active voice, `draft:true` until a human publishes).
- TASK-008 (ArticleLayout + flat `/{slug}/` article routes) reviewed -> CLOSED: build green (4 pages, 0 link violations, draft article correctly produced no page); root `[slug]` route mirrors the calculator route pattern. Created `SITE-ARCHITECT.md` as the single orientation map for the workspace.
- Ran the manual pilot end to end: `stats-article-writer` drafted `standard-deviation-symbol` (2863 words), `stats-article-reviewer` returned PASS 96/100, flipped `draft:false`. Two fixes baked into the pipeline from what the pilot surfaced: (1) the frontmatter `title` is the only H1 -- body must start at H2 (duplicate-H1 trips SEO audits); (2) no raw LaTeX/KaTeX -- MDX parses `{` as JS, so formulas must be fenced Unicode blocks.
- Built the cloud-routine content engine: `content-ops/cloud-routine/publish-next-article.md` (self-contained routine a claude.ai Routine runs cold-start: pick next queued article -> write -> mechanical QA gate -> real build gate -> flip draft:false -> commit+push to `main`, which triggers the existing Actions deploy) + README with the publish order.
- Pushed the whole uncommitted backlog (TASK-008, calculator entries, the content pipeline, this log) in 4 clean commits.

**Files changed:** `content-ops/**`, `.claude/agents/stats-article-writer.md`, `.claude/agents/stats-article-reviewer.md`, `.claude/seo-playbook.md`, `.claude/skills/write-article/SKILL.md`, `src/layouts/ArticleLayout.astro`, `src/pages/[slug]/index.astro`, `SITE-ARCHITECT.md`, `src/content/articles/standard-deviation-symbol.mdx`.

**Decisions made:** Body must start at H2, never H1. No raw LaTeX -- Unicode-only formula blocks. `content_db.py`'s keyword-uniqueness constraint is the mechanical anti-cannibalization enforcement, not just a convention.

**Verification:** Gate green before push: astro check 0/0/0, 33 tests, build 7 pages / 0 link violations.

**Next actions noted at the time:** User creates the cloud routines in claude.ai and connects the repo with push access; remaining launch articles then publish themselves.
