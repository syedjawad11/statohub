---
number: 0021
title: The two content boards split by source (internal vs. vendor), not by section (Learn vs. Applied)
type: process
status: accepted
date: 2026-09-03
---

**Context:** the repo keeps two SQLite boards
([[0018-sqlite-boards-as-sql-dumps]]):

- `content-ops/content.db` -- driven by `content_db.py`, the `/write-article`
  skill, and the `stats-article-writer` / `stats-article-reviewer` agents.
- `outsource-content/outsource_content.db` -- driven by `outsource_db.py`, the
  `/publish-outsource-article` skill, and the `outsource-content-processor` /
  `outsource-content-reviewer` agents.

It is natural to read this as "Learn board" and "Applied board", especially
since every outsourced article is Applied ([[0020-outsource-is-applied-only]]).
That reading is wrong, and acting on it would corrupt both boards.

The actual split is **who wrote the article**. `content.db` holds all Learn
articles *and* the internally written Applied ones — Applied batch 1 (four
articles, one per Applied hub, 2026-08-16, [[0014-applied-section-url-family]])
came through `content_db.py`, and internal Applied batch 2 is still planned
work. `outsource_content.db` holds only vendor-written articles.

As verified on 2026-09-03: `content.db` = 75 Learn + 4 Applied (78 published,
1 `research_pending`); `outsource_content.db` = 20 rows (10 published, 10
queued); zero slug overlap; 78 + 10 = the 88 MDX files on disk; Applied on
disk = 4 internal + 10 vendor = 14.

**Options considered:**
(1) Re-split the boards by section — migrate the 4 internal Applied articles
into the outsource board so board #1 is purely Learn and board #2 purely
Applied.
(2) Merge into a single board with a `source` column.
(3) Keep the source split and document the axis explicitly.

**Decision:** (3). The boards stay split by source. No rows migrate between
them.

**Reasoning:** the boards are not two halves of one taxonomy — they are two
different *workflows* with genuinely different schemas and gates. The internal
board carries `keywords`, `reviews`, briefs and SEO scoring; the vendor board
carries `babylovegrowth_id`, queue positions and fetch/sanitize state. A
section-based split would put two incompatible workflows in one table and
orphan the internal Applied articles from the `keywords` and `reviews` rows
that drive their briefs. Option (2) reverses [[0018-sqlite-boards-as-sql-dumps]]
for no gain. The confusion was never a schema problem; it was that nothing
wrote the axis down.

**Consequences:**
- Neither board alone answers "what is published on the site" — that is
  `content.db` published + `outsource_content.db` published, and the MDX files
  in `src/content/articles/` remain the only real source of truth.
- The one sanctioned cross-board reach stays read-only: the outsource reviewer
  `SELECT`s `content.db.keywords` for cannibalization checks
  (`outsource-content/README.md`).
- An internally written Applied article goes through `content_db.py` and
  `.claude/applied-playbook.md` — never through `outsource_db.py`.
- `content.db.categories` is the site's category list and must match
  `src/content/categories/*.yaml`. It had drifted (a renamed `foundations` hub
  still stored as `statistics-basics`, plus a phantom `calculators` row);
  corrected 2026-09-03 to exactly ten rows.

**Revisit when:** the internal Applied pipeline is retired and every Applied
article comes from a vendor — at which point source and section coincide and
the distinction stops costing anything.

**Related:** [[0018-sqlite-boards-as-sql-dumps]],
[[0020-outsource-is-applied-only]], [[0014-applied-section-url-family]],
[[0015-wedge-scoped-to-learn]], [[0004-codex-builds-claude-reviews]].
