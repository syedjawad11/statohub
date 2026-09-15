# Session: Applied rollout review + batch 1 content — 2026-08-16

**Objective:** Review, verify and close Codex's TASK-030..033, push the held
commits, then write and publish the first 4 Applied Statistics articles.

**Completed:**
- Re-ran every gate independently and closed **TASK-030/031/032/033**. Pushed
  the 13 held commits (`19fb8f5..4d440df`); deploy green.
- **Found TASK-032 shipped a migration that was never applied.** The tracked
  `content-ops/content.db` had no `section` column, so `content_db.py show` /
  `brief` crashed (`no such column: section`). Verification had run only against
  temporary databases. Fixed with `init` + `seed` (backup first): 75 articles
  intact, statuses preserved, categories 7 → 11 with exactly 4 `applied`.
- **Found a second, pre-existing bug:** `brief` raised `UnicodeEncodeError` on
  *any* flagged article — the `⚠ FLAGGED` marker is U+26A0 and the Windows
  console is cp1252. Never fired before because no flagged article had been
  briefed. Fixed by forcing UTF-8 on stdout/stderr.
- **Wrote `.claude/applied-playbook.md`** (275 lines), which `content_db.py`
  already pointed every Applied brief at but which did not exist.
- **Published Applied batch 1** — 4 articles, one per hub, drafted by 4 parallel
  sonnet subagents, reviewed, published in one gated commit. Site 116 → 120 pages.

**Files changed:**
`.claude/applied-playbook.md`, `content-ops/content_db.py`,
`content-ops/seed.json`, `content-ops/content.db`,
`src/content/articles/{data-drift-detection,how-to-design-an-ab-test,exploratory-data-analysis,forecast-accuracy-metrics}.mdx`,
`src/lib/content-route-ids.ts`, `handoff/TASK-03{0,1,2,3}-*.md`,
`docs/status/NOW.md`, `src/pages/dev/preview/` (empty dir removed).

**Decisions made:**
- Push before content rather than holding — user's call; each hub got an article
  within the hour, so no hub was ever indexable-but-empty for long.
- Seed Applied rows `flagged` so the 03:00 routine cannot auto-publish a
  half-written draft. Chosen over disabling the trigger. **Repeat for batch 2.**
- No new ADR: every decision executed ADR-0014/0015 rather than changing them.

**Assumptions:**
- The 403/500 responses from ACM, Wiley and Cambridge are bot-blocking, not dead
  links — verified by identifier, not by fetching. Worth a manual click someday.
- `astro check` does **not** validate draft MDX (drafts produce no routes). The
  only real gate on article MDX is a build with `draft: false`.

**Tests/verification:**
`astro check` 37 files / 0 errors · 35 test files / 121 tests · contrast 21/21 ·
`npm run build` 120 pages / 4,489 links / 0 link + 0 meta violations. On the
rendered HTML: applied-layout dispatch, H2+H3 TOC, FAQPage JSON-LD, 28/28 unique
ids, hubs listing their articles. All 4 URLs curl-checked live (200). Every
external source URL curl-checked — **one 404 found and replaced** (a UCLA
missing-data seminar → van Buuren, *Flexible Imputation of Missing Data*).

**Open issues / risks:**
1. **Homepage visual QA has still never run** (TASK-031 DoD). No browser instance
   was available to Codex or to this session.
2. Learn queue remains exhausted; `validity-in-statistics` still needs keyword
   research before it can be written.
3. July session files are >30 days old and still outside `sessions/archive/`.

**Next actions:**
1. Choose 4 topics for Applied batch 2 (one per hub, so each reaches 2).
2. Seed them phase 71 **flagged**, draft via 4 sonnet subagents, review, publish.
3. Eyeball the live homepage against the mock.

**Context for next session:** `docs/status/NOW.md`,
`.claude/applied-playbook.md`, `content-ops/seed.json`,
`docs/ideas/homepage-redesign-mock-2026-08-16.png`.
