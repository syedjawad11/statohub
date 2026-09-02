# Session: Outsource batch 3 + Applied/Learn category boundary — 2026-09-02

**Objective:** Answer "how many babylovegrowth articles are pending?", then
publish every queued article that is actually available upstream.

**Completed:**
- **Reconciled the outsource board against the live vendor API** — the two had
  drifted badly. Board said 13 queued; only 6 existed upstream. 7 queue slots
  (positions 5-8, 11, 19, 20) are topics babylovegrowth has never written, and
  5 live upstream articles have no board row at all. Mapped all 20 board rows
  to their babylovegrowth ids by exact `slug` (the payload carries `slug`
  directly — earlier runs had been title-matching).
- **Published outsource batch 3** — 3 articles, processed by 3 parallel sonnet
  subagents, each gated by a reviewer that commits and pushes itself:
  `confidence-level-vs-significance-level` (`8f04bb4`), `sequential-testing`
  (`18ec497`), `heteroscedasticity-test` (`8469875`). Site 128 → 131 pages,
  4,967 internal links, 121 tests, 0 violations.
- **Caught a stale `content-ops/content.db` that was one command from
  committing a regression.** The local `.db` predated `05d02bb` and would have
  reverted `r-squared-adjusted-r-squared` from `published` to
  `changes_requested`, dropping review #75. `db_sync.py check` reported `DRIFT`
  and recommended `dump` — the wrong direction. Diffed both ways, confirmed the
  committed `.sql` was strictly newer with nothing unique in the `.db`, then
  `rm` + `rebuild`. Both boards now `ok`.
- **Wrote [[0020-outsource-is-applied-only]]** after getting the category call
  wrong (below).

**Files changed:**
`src/content/articles/{confidence-level-vs-significance-level,sequential-testing,heteroscedasticity-test}.mdx`,
`outsource-content/raw/*.json` (3), `outsource-content/outsource_content.sql`,
`public/llms.txt`, `content-ops/content.db` (rebuilt),
`docs/decisions/0020-outsource-is-applied-only.md`,
`docs/decisions/README.md`, `CLAUDE.md`, `docs/status/NOW.md`.

**Decisions made:**
- **[[0020-outsource-is-applied-only]]** — outsourced content is Applied-only;
  Applied is exactly four category hubs. Recorded because the orchestrator got
  it wrong: it reassigned `heteroscedasticity-test` to `regression-correlation`
  and `confidence-level-vs-significance-level` to `inferential-statistics`,
  reasoning across all ten hubs for best *topical* fit. Both are Learn hubs.
  Both processors wrote the file as instructed but flagged the conflict rather
  than silently overriding, and `check_sanitized.py` check 1 failed on both —
  the gate and the subagents caught an orchestrator error, which is the system
  working. Reverted to `data-analysis` for both.
- **House style:** keep a `## Statohub's Take` section, drop the
  `> *— Statohub*` sign-off line. The sign-off appeared in both batch-3 drafts
  and in none of the 7 previously published outsourced articles — vendor
  template drift, now stripped repo-wide.

**Traps found (all reviewer-only — the sanitizer checks none of them):**
1. **Link rot, not just mis-citation.** Batch 2's known failure was citation
   text naming a different paper than the URL. Batch 3 added a worse case:
   Penn State's entire Drupal `/book/export/html/` path is retired site-wide
   and 302s to the course homepage, so a once-correct citation silently
   stopped resolving. A plain `curl -sL` returns `000` (cert failure); only
   `-k` reveals the redirect. Replaced with the CRAN `gsDesign` vignette.
2. **`db_sync.py check` recommends the wrong fix** when the `.db` is the stale
   side — see above. Worth teaching it to report which side is newer.
3. **Queue position is meaningless** as a work order on the outsource board.

**Still open:**
- 3 articles are publishable right now and already mapped:
  `data-visualization-best-practices`, `confusion-matrix-explained`,
  `f1-score-explained`. The two ML ones need a hard cannibalization check
  against each other (F1 is derived from the confusion matrix).
- The user plans to revise the upstream topic list rather than import the 5
  board-less upstream articles as-is.
- A housekeeping pass, deferred to the next session; scope not specified.
- The `.sql` for the outsource board is committed and in sync; `NOW.md` and
  `CLAUDE.md` updates from this session were **not** committed — the standing
  gate requires showing doc/ADR work to the user first.
