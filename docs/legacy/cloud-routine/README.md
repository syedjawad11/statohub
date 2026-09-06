# statohub cloud routines

Self-contained routine definitions that a **Claude cloud Routine** (claude.ai ->
Routines) runs on a schedule against the connected `statohub` repo. Each run is a
cold start: the routine file is the complete instruction set.

## The routines

- **`publish-next-article.md`** -- writes + publishes ONE planned article per run.
  Flow: locate repo -> `content_db.py next` (the queue) -> write a >=2000-word MDX
  article to the playbook -> mechanical QA gate -> real build gate (`astro check`
  + `vitest` + `npm run build` incl. the link gate) -> flip `draft:false` ->
  update `content.db` -> `git commit && push origin main`. The push triggers the
  existing GitHub Actions -> Cloudflare Pages deploy, so the article goes live.
- **`publish-next-calc-prose.md`** -- the LIGHT counterpart: writes ONE short
  (~300-700 word) calculator teaching block per run from
  `content-ops/calc-prose/QUEUE.md` into `src/content/calculator-content/`.
  Last ran 2026-06-25; kept for when the calc-prose queue is picked back up.

Both are currently **paused** -- see below.

## Pausing (repo-side kill switch)

Create `content-ops/cloud-routine/PAUSED` (any content -- record the reason and
date) and push. Both routine files check for it in Step 0 and exit 0 with
`PUBLISH_RESULT: paused` before picking, writing, building, or pushing. Delete
the file and push to resume. The marker is the source of truth for pause state,
not this README's prose.

**It stops the work, not the schedule.** The schedule lives in claude.ai ->
Routines, which no repo file can reach: a paused run still wakes, pulls `main`,
prints `paused`, and exits. To stop the runs themselves, disable or delete the
routines in claude.ai -> Routines.

## Prerequisites (one-time)

1. **Everything is on `main`.** The routine reads `content-ops/content.db` (the
   queue), `content-ops/content_db.py`, `.claude/seo-playbook.md`, and
   `.claude/agents/*` from the checkout -- all must be committed + pushed. (Done
   in the launch commit.)
2. **Connect the `statohub` GitHub repo to Claude** (claude.ai settings) with
   push access, so the routine can `git push origin main`.
3. The cloud sandbox has Node + Python (used for the build gate and the CLI).

## Create the routines (claude.ai -> Routines -> + New routine)

Create **four one-time routines**, all with the **same** prompt, staggered ~3.5h
apart so four articles publish within ~24h. Each run independently pulls the next
queued article, so the same prompt is correct for all four.

**Routine prompt (paste this as the routine instruction):**

> Run the statohub publish-next-article routine. Read
> `content-ops/cloud-routine/publish-next-article.md` in the connected statohub
> repo and execute it exactly, step by step, start to finish. Publish exactly one
> article, then print the final PUBLISH_RESULT block.

**Schedule (UTC -- adjust if you set these up later than now):**

| # | UTC time            | what it does                          |
|---|---------------------|---------------------------------------|
| 1 | 2026-06-14 22:00    | publishes the next queued article     |
| 2 | 2026-06-15 01:30    | publishes the next queued article     |
| 3 | 2026-06-15 05:00    | publishes the next queued article     |
| 4 | 2026-06-15 08:30    | publishes the next queued article     |

After the launch batch you can keep ONE recurring daily routine (same prompt) as
a steady content engine -- it no-ops cleanly (`PUBLISH_RESULT: nothing_to_do`)
once the queue is empty.

## Publish order

The routine publishes by `content_db.py next` priority (phase -> lowest KD floor
-> highest volume). With the current board the next four runs will publish, in
order: **how-to-find-the-range, correlation-vs-causation, what-is-an-average,
linear-regression**. To force a different launch order, change the articles'
status/priority in `content.db` before scheduling (e.g. set the ones you want to
hold to a non-`planned` status), or run the routine manually for a specific slug.

## Safety

- `draft: true` until BOTH the QA gate and the build gate pass; a failing article
  is left as a draft (no page) and marked `changes_requested` for a human -- it is
  never forced live.
- The local build gate + the GitHub Actions gate both block a broken build from
  deploying. Worst case: an article stays unpublished and the queue advances.
- One article per run; no external LLM/network calls (Claude is the writer).
