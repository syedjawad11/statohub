# cloud-routine — retired

The two scheduled-publish routine specs moved to
[`../../docs/legacy/cloud-routine/`](../../docs/legacy/cloud-routine/) on
2026-09-06. Nothing here runs.

**`PAUSED` stays at this path on purpose.** The claude.ai-side schedules were
never deleted and still wake nightly; both routine specs check for
`content-ops/cloud-routine/PAUSED` in their Step 0 and exit `0`. Removing this
file would un-pause them. To stop the runs themselves, disable the routines in
claude.ai -> Routines.
