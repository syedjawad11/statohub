---
name: write-article
description: Run the statohub content pipeline for one article end-to-end — brief → write → review → status — driving the stats-article-writer and stats-article-reviewer agents and the content-ops board. Use when the user says "/write-article", "write the next article", or names a stats article slug to draft.
---

# /write-article [slug]

Produce one statohub.com article through the write→review loop. With no slug,
pick the recommended next one.

## Steps

1. **Pick the article.**
   - If a slug was given, use it.
   - Else run `python content-ops/content_db.py next` and use its pick.
   - Refuse `research_pending`/flagged stubs (e.g. `permutations-and-combinations`,
     `validity-in-statistics`) — they need a keyword pass first. Surface that and stop.

2. **Brief + mark drafting.**
   ```
   python content-ops/content_db.py set-status <slug> drafting
   python content-ops/content_db.py brief <slug>
   ```

3. **Draft.** Spawn the **stats-article-writer** agent with the full brief text.
   It writes `src/content/articles/<slug>.mdx` (`draft: true`) per
   `.claude/seo-playbook.md`. Relay its report (path, word count, keyword
   coverage, sources, blockers).
   Then: `python content-ops/content_db.py set-status <slug> in_review`.

4. **Review.** Spawn the **stats-article-reviewer** agent on the draft. It scores
   against the playbook, logs the result itself via `log-review` (which sets
   status `approved` on PASS or `changes_requested` on fail).

5. **Loop or finish.**
   - **CHANGES_REQUESTED:** hand the reviewer's fix list back to the writer,
     re-review. Cap at **2 rounds**; if still failing, stop and summarize for the
     user — don't grind.
   - **PASS (approved):** report the score and remind that a human flips
     `draft: false` and runs `set-status <slug> published` after a final look and
     a green `npm run build` (the link gate). Approval is not auto-publish.

6. **Wrap up.** Run `python content-ops/content_db.py stats` and report the new
   board state.

## Notes
- All commands run from the repo root (`Desktop/statohub/`).
- The writer drafts and the reviewer checks — keep the roles separate (the
  reviewer never rewrites).
- This pipeline is for **content**. Site/calculator **build** work goes through
  the Codex `handoff/` loop, not here (see `CONTENT-WORKFLOW.md`).
