---
number: 0030
title: Live internal articles are rewritten in place into the content-plan template by two daily cloud routines
type: content
status: accepted
date: 2026-10-10
---

**Context:** the owner paused the content-plan routine
([[0028-content-plan-daily-routine]]) on 2026-10-10 to fix the articles already
live first, and listed 47 URLs (`URLS-LIST.csv`). 25 are our own articles in the
older Learn layout; 14 are vendor articles already in the template; 8 are
calculator pages, two hubs and the editorial policy.

**Options considered:**
(1) Rewrite each as a new draft and swap it in.
(2) Rewrite in place behind the normal review and build gates, keeping slug,
hub, `pubDate`, keywords and calculator embed.
(3) Strict template: also drop the calculator embed and link out.

**Decision:** Option 2 (owner's call on scope and the embed). Only the 25 own
articles are in `content-ops/rewrite/queue.csv`; vendor articles, calculator
pages, hubs and the policy page are out. The writer and reviewer are the
content-plan agents in a "rewrite mode" (`check_sanitized.py --rewrite`,
`overlap_check.py` without a plan row). Two claude.ai routines run
`content-ops/rewrite/publish-daily.md`, one article each per run: lane A at
02:30 and lane B at 12:00 Malta, splitting the queue alternately in list order.

**Reasoning:** the page stays live the whole time — a failed rewrite is undone
with `git checkout` and parked in `content-ops/rewrite/drafts/`, never by
flipping `draft: true`, which would break inbound links. Keeping the embed
holds [[0001-wedge-model]] for these Learn pages; the template supplies the
structure around it.

**Consequences:** the template's "no calculator embed" rule is waived for
rewrites of pages that already embed one (never added to a page that didn't).
Board rows stay `published`; reviews are still logged. The queue is a committed
CSV, not a third board, since no row moves between boards
([[0021-boards-split-by-source]]). Lane B runs an hour after the outsource
routine, so pushes rebase and retry once.
