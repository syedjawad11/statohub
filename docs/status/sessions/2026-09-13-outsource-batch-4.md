# Session: Outsource batch 4 (8 vendor drafts) + partner-backlink rule — 2026-09-13

**Objective:** Publish every babylovegrowth article finished upstream, assign
each an Applied hub, commit and push per article.

**Completed:**
- **Published 8 outsourced articles** in three small batches (3/3/2), one
  sequential reviewer per article, checkpoint report between batches:
  `one-tailed-vs-two-tailed` (`7666d02`), `false-discovery-rate` (`a002df5`),
  `misleading-graphs` (`b102fa1`), `cohens-d` (`8b4ace4`),
  `difference-in-differences` (`8bdd3a0`), `interrupted-time-series`
  (`e971fa7`), `communicating-uncertainty` (`4be58fa`),
  `conditional-probability-exercises` (`25df583`). Hubs: 6 `data-analysis`,
  2 `experiments-causality`. Site 140 → 147 pages, 5,909 internal links,
  121 tests, 0 violations. Board: 27 published / 10 queued, `.sql` in sync.
- **Scoped to upstream status DRAFT only.** An early pass processed 10 topics;
  the dashboard showed 2 still GENERATING (`histogram-vs-boxplot`,
  `multiple-regression-diagnostics`). Those drafts were discarded; the board
  rows stay `queued` and must be re-fetched once the vendor finishes them.
- **Wrote [[0023-outsource-keeps-partner-backlinks]]** after a processor
  removed a partner link it judged spam (below).
- Reviewers made no content edits on any of the 8 — only `draft: false`.
  Every citation fix had been done by the orchestrator pre-review by curling
  each Sources href and matching the live `<title>`.

**Files changed:** 8 × `src/content/articles/<slug>.mdx`,
`outsource-content/raw/*.json` (8), `outsource-content/outsource_content.sql`,
`public/llms.txt`, `.claude/agents/outsource-content-processor.md` (Step 2/3),
`docs/decisions/0023-outsource-keeps-partner-backlinks.md`,
`docs/decisions/README.md`, `docs/status/NOW.md`.

**Decisions made:**
- **[[0023-outsource-keeps-partner-backlinks]]** — never remove, re-anchor or
  nofollow any non-babylovegrowth external link; reviewers check raw-vs-MDX
  href parity. Owner's words: they are backlinks the vendor inserts for
  partner sites.
- Minor: publish in batches of 2–3 and stop for a report between batches
  (owner preference, also in Claude memory).

**Assumptions:** the 8 hub assignments were made by the orchestrator on
topical fit within the four Applied hubs; the owner asked for categories to be
assigned, not reviewed individually.

**Tests/verification:** per article — `check_sanitized.py` 17/17, table /
chart cell-for-cell vs raw JSON, href parity count, Sources curl (bot-wall
exceptions: JSTOR, Springer "Client Challenge", BMJ 403, PubMed 203, Khan
Academy "Client Challenge"), `npx astro check`, `npm test`, `npm run build`,
`db_sync.py check`. `git status --porcelain` empty at close; `origin/main`
at `25df583`.

**Open issues / risks:**
1. `histogram-vs-boxplot`, `multiple-regression-diagnostics` — GENERATING
   upstream at session end; re-run `outsource_db.py fetch` before processing.
2. 8 further queued rows do not exist upstream yet (see NOW.md).
3. Processors kept dropping "Statohub's Take" / CTA sections and using bare
   `{...}` in prose (MDX ReferenceError) — restored/escaped by hand each time;
   worth a sanitizer check.

**Next actions:**
1. Check the vendor dashboard; when the 2 GENERATING drafts flip to DRAFT,
   `fetch` + process + review them (same session rules as this handoff).
2. Consider adding "unescaped `{` in body" and "Statohub's Take present" to
   `check_sanitized.py`.

**Context for next session:** `docs/status/NOW.md`,
`docs/decisions/0023-outsource-keeps-partner-backlinks.md`,
`.claude/agents/outsource-content-processor.md`, `outsource-content/README.md`.
