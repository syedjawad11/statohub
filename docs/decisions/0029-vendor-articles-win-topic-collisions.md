---
number: 0029
title: Vendor (babylovegrowth) articles win topic collisions; the unwritten internal plan row is retired
type: content
status: accepted
date: 2026-10-10
---

**Context:** the daily outsource routine ([[0026-outsource-daily-cloud-routine]])
skipped any vendor article whose keyword was already reserved on
`content-ops/content.db`, and the processor/reviewer blocked on the same check.
The content plan ([[0028-content-plan-daily-routine]]) reserves 338 topics, most
not yet written, so the vendor's drafts kept losing to placeholders: regression
discontinuity, class imbalance, instrumental variables, ARIMA, time series
stationarity (blocked 2026-10-09) and seasonal decomposition all sat unused.

**Options considered:**
(1) Keep the internal plan first; leave colliding vendor drafts unused.
(2) Re-angle one side by hand on each collision.
(3) Vendor first: the vendor article publishes and the unwritten internal row
is retired.

**Decision:** Option 3 (owner's call). On a collision with an **unwritten**
internal row (any status but `published`, `merged`, `retired`, with no live
MDX), the outsource pipeline runs
`content_db.py retire <owner> --by <vendor-slug>`: the row becomes `retired`,
its keywords are released, and plan rows that linked up to it now link up to
the vendor slug. A collision with a **live** page still blocks — removing a
live page needs a 301 and a human.

**Reasoning:** the vendor article already exists and is paid for; an unwritten
plan row costs nothing to give up. Retiring is a status change on the internal
board, not a row moving between boards, so [[0021-boards-split-by-source]]
holds.

**Consequences:** the outsource pipeline now writes to `content.db` (only via
`retire`) and commits `content-ops/` alongside `outsource-content/`. The
content-plan routine never picks a `retired` row, and its overlap gate already
fails a draft whose keyword is a live page's title, so it will not re-write a
topic the vendor published. Software-specific children (e.g. `arima-python`)
stay planned and now point at the vendor article as their parent.
