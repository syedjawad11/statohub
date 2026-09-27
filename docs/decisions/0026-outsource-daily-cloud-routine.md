---
number: 0026
title: A daily claude.ai cloud routine publishes one outsourced article per run and auto-queues new vendor drafts
type: process
status: accepted
date: 2026-09-27
---

**Context:** babylovegrowth writes one Applied article a day, but publishing
them needed a local session running `/publish-outsource-article` by hand. The
cloud routines were retired on 2026-09-06 (they drove the *internal*
`content_db.py` pipeline, where Claude writes the prose). After today's batch
(intention-to-treat, multiple-comparisons-problem, normality-tests) only two
rows remained queued, while the vendor keeps producing topics that were never
put on our board.

**Options considered:**
(1) Keep publishing by hand in local sessions.
(2) A daily cloud routine that only publishes rows already on the board, and
stops with `nothing_to_do` when the queue is empty.
(3) A daily cloud routine that also auto-queues the oldest unhandled vendor
article (choosing slug and Applied hub, with a read-only collision check)
when no queued row exists upstream.

**Decision:** Option 3 (owner's call), one article per run, 09:00 UTC daily.
The instructions live in `outsource-content/routine/publish-daily.md`, which
runs the unchanged `/publish-outsource-article` steps 2-7 and the same
processor and reviewer agents, so every existing gate still applies
([[0020-outsource-is-applied-only]], [[0021-boards-split-by-source]],
[[0023-outsource-keeps-partner-backlinks]], [[0018-sqlite-boards-as-sql-dumps]]).
Its pause switch is `outsource-content/routine/PAUSED`, which is separate from
`content-ops/cloud-routine/PAUSED` (that file keeps the retired internal
routines stopped and stays in place). The internal pipeline stays manual.

**Reasoning:** this pipeline already publishes without a human checkpoint on a
clean mechanical gate, so running it on a schedule adds no new trust. The only
new judgement is choosing a slug and hub for vendor topics, and the collision
check plus the reviewer's cannibalization gate bound that.

**Consequences:** the cloud environment needs `BABYLOVEGROWTH_API_KEY` as an
environment variable, network access to `api.babylovegrowth.ai`, npm and PyPI,
and push access to `main`. A run that fails review commits only the board
status, so the next run skips that article instead of retrying it forever.
Rows left `changes_requested` or `blocked` need a local session. When a vendor
Sources link is replaced because curl cannot reach it, the vendor's inline
href stays (raw-vs-MDX href parity). On 2026-09-27 a processor fix dropped one
such link from intention-to-treat; it was restored in `f866fbc`.
