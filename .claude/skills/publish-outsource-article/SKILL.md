---
name: publish-outsource-article
description: Run the outsource-content pipeline for one queued babylovegrowth article end-to-end — map → fetch → process → review → auto-publish — driving the outsource-content-processor and outsource-content-reviewer agents and the outsource_db.py board. Use when the user says "/publish-outsource-article", "publish the next outsourced article", or names an outsource-content queue slug.
---

# /publish-outsource-article [slug]

Take one babylovegrowth-sourced topic from `outsource-content/calendar.json`
through the full pipeline to a **live, published** article, with no human
approval step at the end (this pipeline auto-publishes on a clean gate —
unlike `/write-article`, there is no "human flips draft:false" pause). With
no slug, pick the lowest queued slug that **exists upstream** (see step 1).

## Steps

1. **Pick the article.**
   - If a slug was given, use it.
   - Else run `python outsource-content/outsource_db.py list --status queued`,
     then cross-check against `babylovegrowth_client.list_articles()` and take
     the **lowest queued slug that actually exists upstream**.
   - **Never take work by `queue_position` alone.** The board and upstream do
     not line up: several queued slots were never written by the vendor, so
     the lowest `queue_position` is routinely a topic that does not exist.
     Ordering by position and fetching blindly wastes a full pass. Position
     orders the queue; upstream presence decides what is workable.

2. **Map, if not already mapped.**
   - `python outsource-content/outsource_db.py show <slug>` — if
     `babylovegrowth_id` is already set, skip to step 3.
   - Otherwise call `babylovegrowth_client.list_articles()` (via
     `outsource_db.py`'s underlying client, or a small one-off script), find
     the entry whose title matches this queue slot's topic, and run
     `python outsource-content/outsource_db.py map <slug> <babylovegrowth_id>`.
     If nothing in the list plausibly matches the topic yet (babylovegrowth
     hasn't written it), stop and report that — don't guess a mapping.

3. **Fetch.**
   ```
   python outsource-content/outsource_db.py fetch <slug>
   ```
   Relay the summary (title, approx word count, naive image count) so a
   mismatch is obvious before spending a processing pass on the wrong
   article.

4. **Process.** Spawn the **outsource-content-processor** agent on
   `outsource-content/raw/<slug>.json`. It writes
   `src/content/articles/<slug>.mdx` (`draft: true`) per
   `.claude/applied-playbook.md`, and calls `outsource_db.py processed`
   itself. Relay its report (path, word count, what was removed/converted,
   final source count, any blockers).
   - If it reports `blocked` instead of writing a file: stop here and
     summarize why for the user. Do not proceed to review.

5. **Review.** Spawn the **outsource-content-reviewer** agent on the draft.
   It runs `check_sanitized.py`, spot-checks fidelity, cross-checks
   cannibalization, and — on a full pass — flips `draft: false`, re-runs the
   real build gate against that published state, then commits and pushes
   itself. No human checkpoint on PASS; that's the defined behavior for this
   pipeline.

6. **Loop or finish.**
   - **CHANGES_REQUESTED:** hand the reviewer's fix list back to the
     processor, re-run review. Cap at **2 rounds**; if still failing, stop,
     set the article to `blocked` if it isn't already, and summarize for the
     user — don't grind.
   - **blocked:** stop immediately and summarize why (can't reach 6 sources,
     no convertible table/infographic, keyword collision, or a title
     mismatch from a bad `map`). This needs a human decision, not a retry.
   - **PASS:** the article is now live. Report the URL (`/<slug>/`), what
     was stripped/converted, and the final source count.

7. **Wrap up.** Run `python outsource-content/outsource_db.py stats` and
   report the new queue state. Then confirm the board reached git:
   ```
   python3 scripts/db_sync.py check
   ```
   If it reports drift, run `python3 scripts/db_sync.py dump` and commit
   `outsource-content/outsource_content.sql`. The `.db` is gitignored, so an
   undumped board change exists only on this machine.

   Then confirm the reviewer left nothing behind:
   ```
   git status --porcelain
   ```
   Empty is the only acceptable result. If `src/lib/content-route-ids.ts` or
   `public/llms.txt` show up dirty, the reviewer skipped its own staging step
   — commit them, and say so in your summary so the gap gets fixed rather
   than papered over each run.

## Notes
- All commands run from the repo root (`Desktop/statohub/`).
- The processor transforms structure and does not judge prose; the reviewer
  gates and does not rewrite — keep the roles separate.
- This pipeline is completely separate from `content-ops/` (the internal
  engine) and `/write-article` — see `outsource-content/README.md` for the
  boundary. Never mix the two: an outsourced article never goes through
  `content_db.py`, and an internal article never goes through
  `outsource_db.py`.
- `BABYLOVEGROWTH_API_KEY` must be set in `.env` locally (see
  `.env.example`) before step 2/3 will work.
