Status: CLOSED
<!-- TODO | IN_PROGRESS | DONE | CHANGES_REQUESTED | CLOSED -->

# TASK-032 -- Applied section content-ops support

- **Owner of this stage:** Codex
- **Repo:** `Desktop/statohub/` (where the work happens)
- **Created:** 2026-08-16 from the approved Claude restructure plan

---

## Brief  *(approved plan translated into the handoff queue)*

**Goal:** Mirror the Astro category `section` model in the SQLite editorial board and make Applied briefs emit the Applied playbook requirements without creating article rows.

**Context / inputs:**
- The current plan supersedes the older proposal to add `content_type` on articles.
- `src/content/config.ts` models `section: 'learn' | 'applied'` on categories.
- Four Applied category YAML files already exist; article research and writing are deferred.

**Deliverables:**
- [x] Add `section TEXT NOT NULL DEFAULT 'learn'` to `content-ops/schema.sql` categories.
- [x] Add an idempotent existing-database migration in `content-ops/content_db.py::cmd_init` and validate `learn`/`applied` values.
- [x] Seed category section values with a default of `learn`; add the four real Applied categories to `content-ops/seed.json` and no fifth category.
- [x] Make `show` expose the category section and make `brief` branch: Learn keeps the existing rules; Applied points to `.claude/applied-playbook.md`, the 3,000-4,500 word band, and the required module checklist.
- [x] Do not add Applied article rows or change the global keyword uniqueness rule.

**Constraints:**
- Stay in `content-ops/{schema.sql,content_db.py,seed.json}` plus this Work Log.
- Stdlib-only Python, additive/idempotent migration, no dependency changes.
- Preserve manually advanced statuses across re-seeds.

**Definition of done / how to verify:**
- Fresh-schema and existing-database migration paths both produce a category `section` column.
- Seeding is idempotent with 0 cannibalization conflicts and exactly four Applied category rows.
- A temporary Applied fixture proves the Applied brief branch; no Applied article remains afterward.

---

## Work Log  *(Codex writes -- what was actually done)*

- **Started:** 2026-08-16
- **Finished:** 2026-08-16

**What changed (files + where):**
- `content-ops/schema.sql` -- added the category `section` column with the
  required non-null `learn` default for fresh databases.
- `content-ops/content_db.py` -- added an additive/idempotent `cmd_init`
  migration for existing databases, Python validation of the `learn` and
  `applied` values, default-aware category seeding, section output in `show`,
  and section-aware `brief` rules. Learn retains the existing SEO playbook
  guidance; Applied points to `.claude/applied-playbook.md`, states the
  3,000-4,500 word band, and emits the six required module/content checks.
- `content-ops/seed.json` -- added only the four real Applied category rows
  (`data-analysis`, `experiments-causality`, `time-series-forecasting`, and
  `machine-learning-statistics`). No Applied article rows were added.

**How to verify:**
- `python -m py_compile content-ops/content_db.py`
- `git diff --check -- content-ops/schema.sql content-ops/content_db.py content-ops/seed.json`
- Ran an isolated stdlib Python/SQLite verifier against temporary databases.
  It proved both fresh-schema and legacy-table migration paths, ran seeding
  twice with 0 cannibalization conflicts, confirmed exactly 4 Applied category
  rows / 75 total articles / 0 Applied articles, and verified that an advanced
  `published` status survived the re-seed.
- The same verifier inserted one temporary Applied fixture, asserted `show`
  exposed `section: applied` and `brief` emitted the Applied playbook, word
  band, and required checklist, then deleted the fixture and re-asserted 0
  Applied articles. A before/after hash and mtime check proved the real
  `content-ops/content.db` was not touched.

**Blocked / couldn't do / decisions made:**
- The migration deliberately uses Python validation rather than a SQL `CHECK`,
  matching the brief and keeping the existing-database change additive.
- The global unique keyword index and the existing status-preservation logic
  were left unchanged. The four Applied categories intentionally have no
  article rows until Claude supplies researched content.

---

## Review  *(Claude writes -- accept or send back)*

- **Reviewed:** 2026-08-16 (Claude)
- **Verdict:** CHANGES_REQUESTED at review -> fixed by the reviewer -> CLOSED

**Notes / what to improve:**
- **Defect found: the code was correct but was never applied to the real database.**
  `content-ops/content.db` is git-tracked and its `categories` table still had only
  `slug, title, description, nav_order`. Because `cmd_show` and `cmd_brief` now run
  `SELECT title,section FROM categories`, both commands **crashed on the live DB**:
  `sqlite3.OperationalError: no such column: section`.
- **Root cause worth remembering:** verification ran exclusively against temporary
  databases, and the real `content.db` was deliberately left untouched. That is why
  every gate passed while the shipped tool was broken in practice. A migration is
  not done until it has been run against the artifact that is actually committed.
- **Fix applied by the reviewer** (backup taken first): `content_db.py init` then
  `seed`. Result: `section` column present; categories 7 -> 11 with exactly 4
  `applied`; articles unchanged at 75 with statuses preserved (73 published,
  1 changes_requested, 1 research_pending). `show simpsons-paradox` now exits 0 and
  prints `section: learn`, and the Learn `brief` branch still emits the SEO playbook
  rules -- no regression from the branch.
- The `.claude/applied-playbook.md` that `brief` points at did not exist either;
  written separately as part of this session rather than as a change to this task.
