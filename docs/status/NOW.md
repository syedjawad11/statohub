# Now

> Current state, active work, and blockers. This file wins over any session
> handoff if they disagree -- fix the conflict immediately when found. Updated
> at the end of any session that changes priorities; kept under ~60 lines.

**Last updated:** 2026-09-02 (outsource batch 3 published, 3 articles;
outsourced content confirmed Applied-only -- see
[[0020-outsource-is-applied-only]]).

## Repo workflow changed -- read before your first commit

- **`git push` works again** (SSH). [[0016-github-mcp-for-pushes]] is
  superseded -- no more `push_files` + `git reset --hard` to realign SHAs.
- **No binary `.db` is tracked.** After a clone: `python3 scripts/db_sync.py
  rebuild`. After any board change: `dump`, then commit the `.sql`. Forgetting
  `dump` is what silently desynced the outsource board.
- **`db_sync.py check` always says `dump`, even when the `.db` is the stale
  side** -- then `dump` commits a regression (2026-09-02: nearly reverted
  `r-squared-adjusted-r-squared`). Diff both ways first; if the `.sql` is
  newer, `rm` the `.db` and `rebuild`.
- `docs/ARCHITECTURE.md` still describes the old MCP push flow -- prose pass owed.

## Active: Applied Statistics -- *internal* batch 2 still not started

(Distinct from the outsource batches below -- this is the internally written
Applied content via `content_db.py`.) Batch 1 (4 articles) is live. **Batch 2
(remaining 4, one per hub), planned for 2026-08-17, has not been started** --
topics never chosen. Governed by
[[0014-applied-section-url-family]] / [[0015-wedge-scoped-to-learn]]. Recipe:
`docs/status/sessions/2026-08-16-applied-batch-1.md`. Still owed: desktop+mobile
visual QA vs `docs/ideas/homepage-redesign-mock-2026-08-16.png`.

**Baseline on `origin/main`** (`8469875`): 131 pages, 4,967 internal links, 0
link/meta violations, 121 tests, `astro check` 0 errors.

**Learn content pipeline:** queue exhausted since 2026-08-14, nightly publisher
idle (not broken, just out of work). Applied batch-1/2 seed rows stay
`flagged` so it can't auto-publish a half-written draft.

**Outsource pipeline:** 10 published, 10 queued (batch 3 shipped 2026-09-02).
All 20 rows mapped. Full detail:
`docs/status/sessions/2026-09-02-outsource-batch-3.md`.

- **Board and upstream do not line up.** Only **3 of the 10 queued exist
  upstream** and are ready now: `data-visualization-best-practices`,
  `confusion-matrix-explained`, `f1-score-explained` (the two ML ones need a
  cannibalization check against *each other*). 7 queued slots -- positions
  5-8, 11, 19, 20 -- were never written upstream, so **never take work by
  `queue_position`**; take the lowest queued slug present in
  `list_articles()`. A further 5 live upstream articles have no board row; the
  user plans to revise the upstream topic list rather than import them as-is.
- **Reviewer-only traps, all three hit in batch 3** (the sanitizer checks none
  of them): (1) **sources** -- mis-cited URLs *and* link rot; fetch every one
  with a plain `curl -sL`, no `-k`, and match the live title to the citation
  text; (2) **category** -- Applied-only, see [[0020-outsource-is-applied-only]];
  (3) **vendor template drift** -- keep `## Statohub's Take`, drop any
  `> *— Statohub*` sign-off.
- Vendor drafts run ~2,100-2,900 raw words, hence
  [[0019-outsource-word-floor]] (3,000 -> 1,500).

## Security: rotate the GitHub PAT

The classic `ghp_` token in `~/.claude.json` is plaintext and was printed into a
2026-09-01 transcript. Git no longer needs it; the MCP server does. Replace with
a fine-grained token scoped to this repo.

## AdSense: paused pending Google's review

Loader, CSP, `ads.txt`, privacy disclosure and the CMP tag are live; **no ad
units placed yet**. Banner still doesn't render despite 0 CSP issues and all
requests 200 -- both remaining theories are account-side. **Decision
2026-08-23: stop debugging, wait for review.** Detail + resume checklist:
`docs/status/sessions/2026-08-23-adsense-consent-csp-fix.md`.

## Next session: housekeeping first

The user deferred a housekeeping pass to the next session -- scope not yet
specified. Ask before picking items off "Parked / paused" below.

## Parked / paused (do not silently resume)

- Article schema `image` field missing -- fix in `articleSchema()`
  (`src/lib/schema.ts`) with an `/og-default.png` fallback.
- `how-to-find-the-range` refresh -- 5 range keywords in DB, unused in copy.
- `relative frequency` / `cumulative frequency` -- uncovered Learn candidates.
- `docs/REPO-MAP.md` annotation pass -- drift checker still flags
  `SEO-Audit/`, `docs/audit/`, `docs/ideas/`, config + lockfiles.
- Phase C / Phase D per `docs/ideas/statohub-action-plan.md`: not started.
- Session files from July/August still outside `docs/status/sessions/archive/`.

## Standing hard gates

- One agent on the repo at a time (Codex builds via `handoff/`, Claude
  reviews/closes and writes content).
- Never commit doc-restructuring or ADR work without showing the user first.
- Always count "done/pending" against `origin/main` after `git fetch`.
- A migration is not done until it has run against the artifact that is
  committed -- TASK-032 passed every gate with a broken `content.db`.
- Keep Codex tasks to ~4-6 files. The 900s MCP timeout truncates the reply,
  never the code: on timeout, diff the tree and re-run gates, never re-dispatch.
