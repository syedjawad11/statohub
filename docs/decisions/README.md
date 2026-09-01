# Decisions Index

> One entry per architecture/product decision, including rejected alternatives.
> Read this table first; open individual files only when a cited decision is
> relevant to the current task. If two documents disagree, this index and its
> linked decision files win over prose docs, and a newer decision wins over an
> older one -- report the conflict rather than silently picking a side.

| # | Title | Type | Status | Date |
|---|---|---|---|---|
| [0001](0001-wedge-model.md) | Calculator + teaching on the same page (the wedge) | product | accepted | 2026-06-13 |
| [0002](0002-flat-url-structure.md) | Flat trailing-slash URLs, no category in article paths | architecture | accepted | 2026-06-13 |
| [0003](0003-no-odds-calculators.md) | No odds / betting-odds calculators | product | accepted | 2026-06-13 |
| [0004](0004-codex-builds-claude-reviews.md) | Codex builds to spec, Claude writes + reviews | process | accepted | 2026-06-13 |
| [0005](0005-wrangler-v3-lock.md) | Wrangler v3 lock (Node 20.8.0 breaks v4) | architecture | accepted | 2026-06-13 |
| [0006](0006-github-actions-deploy.md) | GitHub Actions deploy, not native Cloudflare Git integration | architecture | accepted | 2026-06-14 |
| [0007](0007-calculators-before-articles.md) | Build all calculators before resuming article writing | process | superseded | 2026-06-16 |
| [0008](0008-tiered-seo-validation.md) | Three-tier SEO validation (hard / warn / advisory), not flat-blocking | process | accepted | 2026-06-18 |
| [0009](0009-combined-legal-page.md) | One combined Cookie + Privacy page, not two | product | accepted | 2026-06-26 |
| [0010](0010-woven-related-link-callouts.md) | Related-link callouts woven + data-driven, never hand-dumped at the end | content | accepted | 2026-06-26 |
| [0011](0011-no-homepage-live-calculator.md) | Homepage hero uses a static SVG figure, no live embedded calculator | product | accepted | 2026-06-27 |
| [0012](0012-quizzes-dropped.md) | Quizzes dropped as a feature | product | rejected | 2026-07-05 |
| [0013](0013-no-accounts-backend-community-yet.md) | No accounts, backend, community, or games for now | product | accepted | 2026-07-05 |
| [0014](0014-applied-section-url-family.md) | Applied Statistics lives at flat root URLs, not under /blog/ | architecture | accepted | 2026-08-16 |
| [0015](0015-wedge-scoped-to-learn.md) | The wedge is scoped to Learn; Applied articles need no calculator | product | accepted | 2026-08-16 |
| [0016](0016-github-mcp-for-pushes.md) | GitHub pushes go through the GitHub MCP server, not local git credentials | process | superseded-by-0017 | 2026-08-27 |
| [0017](0017-git-push-over-ssh.md) | Pushes go back to local git over SSH; GitHub MCP is a fallback | process | accepted | 2026-09-01 |
| [0018](0018-sqlite-boards-as-sql-dumps.md) | SQLite boards are tracked as SQL dumps, not binary blobs | architecture | accepted | 2026-09-01 |

Naming: `NNNN-kebab-title.md`. New decisions get the next number; never renumber or
delete a file, only change its `status` (e.g. to `superseded-by-NNNN`) and add a new
entry for what replaced it.
