---
name: rewrite-article
description: Rewrite one live internal article in place into the content-plan (babylovegrowth-style) template — pick from content-ops/rewrite/queue.csv → write → review → publish — driving plan-article-writer and plan-article-reviewer in rewrite mode. The page stays live throughout and keeps its slug, hub and calculator embed. Use when the user says "/rewrite-article", "rewrite the next article", or names a slug from the rewrite queue.
---

# /rewrite-article [slug] [--lane A|B]

Rewrite **one** live article from `content-ops/rewrite/queue.csv` into
`content-ops/new-content-plan/TEMPLATE.md`, in place
([[0030-template-rewrite-routines]]). Never route these through
`/publish-plan-article`, `/write-article` or `outsource_db.py`.

**The live page is never unpublished.** The file stays at `draft: false`; a
failed rewrite is undone with `git checkout`, never by flipping `draft`.

## Steps

1. **Pick.** Use the given slug if any (`queue.py show <slug>`). Otherwise
   `python3 content-ops/rewrite/queue.py next <lane>` (lane A when not given).
   Empty output → nothing to do; report it and stop. If it says **resume
   parked draft**: `mv content-ops/rewrite/drafts/<slug>.mdx
   src/content/articles/<slug>.mdx`, and in step 2 tell the writer to revise
   it against the last fix list (`content_db.py show <slug>`).

2. **Write.** Spawn **plan-article-writer** with: "rewrite mode", the slug,
   the queue row (`queue.py show <slug>`) and `content_db.py brief <slug>`.
   Before review, open the result yourself and confirm: `draft: false`; the
   `calculator:`/`<StatCalc>` embed is present iff the committed version had
   one (`git show HEAD:src/content/articles/<slug>.mdx | grep -c StatCalc`);
   `pubDate`/`category`/`primaryKeyword` unchanged; no `{`/`}` in prose.

3. **Review + publish.** Spawn **plan-article-reviewer** in "rewrite mode" on
   the slug. On PASS it dates the file, runs the build gate, marks the queue
   row `published`, commits `content: rewrite <slug> (template rewrite)` and
   pushes.

4. **Loop.** On CHANGES_REQUESTED, hand the fix list to the writer (same agent
   via SendMessage if available, else a new one in rewrite mode with the fix
   list), then re-review. **Max 2 review rounds.**

5. **Failure path.** Still failing (or a gate/build error):
   ```
   mkdir -p content-ops/rewrite/drafts
   cp src/content/articles/<slug>.mdx content-ops/rewrite/drafts/<slug>.mdx
   git checkout -- src/content/articles/<slug>.mdx   # live version back
   python3 content-ops/rewrite/queue.py set <slug> changes_requested --note "<one-line reason>"
   python3 content-ops/content_db.py set-status <slug> published
   python3 scripts/db_sync.py dump
   git add content-ops/
   git commit -m "content-ops: rewrite <slug> changes_requested (parked)"
   git push origin main
   ```
   Use `blocked` instead of `changes_requested` when a human must decide (a
   keyword owned by another page, a topic that can't hold the template). The
   next run resumes the parked draft; after 3 failed runs `next` stops
   offering it.

6. **Wrap up.** `python3 scripts/db_sync.py check`; `git status --porcelain`
   must be empty; `git diff HEAD -- src/content/articles/` must be empty.

## Notes
- The board row stays `published`; reviews are still logged on content.db.
- Interactive runs: spot-check the live page after deploy yourself; review is
  never delegated in a local session.
- Scope (25 articles; vendor articles, calculator pages, hubs and the editorial
  policy are out) is fixed by the ADR. Adding a slug = add a queue row.
