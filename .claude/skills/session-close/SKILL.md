---
name: session-close
description: Close out a statohub work session the right way — update NOW.md, write a dated session handoff if the work warrants one, promote durable decisions to ADRs, and print a summary. Use at the end of a session, or when the user says "wrap up", "close session", "save progress", "we're done", "let's stop here", says goodbye, or the session is clearly ending.
---

# /session-close

Execute statohub's session-end ritual so it stops depending on memory. This
skill **enforces the memory model**:

- `CLAUDE.md` = permanent rules + router (do **not** put current state here).
- `docs/status/NOW.md` = the single hot-state surface, **rewritten** each time.
- `docs/status/sessions/` = **immutable** dated history (append new; never edit old).
- `docs/decisions/` = **append-only** ADRs (new number; never rewrite a body).

Do the steps in order. Steps 2–4 are conditional — skip them when they don't
apply and say so in the summary.

## 1. Update `docs/status/NOW.md` (always)

Rewrite it to reflect reality at session end: current state, the active task,
blockers, and a short recently-done list. Keep it **under ~60 lines** — it is a
hot-state file, not a log. If it has drifted well over that, trim stale lines
while you're here. This is the only "current state" file; never open a competing
state block in `CLAUDE.md`.

## 2. Write a dated session handoff (only if warranted)

Write `docs/status/sessions/YYYY-MM-DD-<topic>.md` **only if** the session left
work unfinished or made a non-trivial decision. A session that only published
already-queued content, or ran an existing plan with no new decision, does
**not** need one — update the relevant tracker/queue instead and note that.

Use the `MEMORY-SYSTEM.md` §7 template (target: under 40 lines):

```markdown
# Session: <topic> — <date>
**Objective:** one sentence.
**Completed:** 3–6 bullets, outcome-focused.
**Files changed:** paths only.
**Decisions made:** link to ADR if formal; one line if minor.
**Assumptions:** anything the next session might wrongly take as verified.
**Tests/verification:** what was checked and how.
**Open issues / risks:** unresolved items, in priority order.
**Next actions:** the first 1–3 things the next session should do.
**Context for next session:** exact files to read (paths), nothing more.
```

Handoffs are **immutable** — never edit a past one; corrections go in the next
one. Name the file `YYYY-MM-DD-<short-topic>.md` (kebab topic).

## 3. Promote durable decisions to an ADR (only if one was made)

If the session made a decision that future sessions must not relitigate, add a
new ADR in `docs/decisions/` rather than only noting it in the session file:

- Next number in sequence (never renumber or rewrite an existing ADR body).
- Use the `MEMORY-SYSTEM.md` §8 format (`number`, `title`, `type`, `status`,
  `date`, then Context / Options / Decision / Reasoning / Consequences /
  Revisit-when / Related).
- Add a row to `docs/decisions/README.md`'s index table.
- Record rejected ideas as first-class `status: rejected` entries too.

## 4. Regenerate `docs/REPO-MAP.md` (only on a structural change)

If files/folders were added, moved, or removed this session, refresh the map:

```
node scripts/gen-repo-map.mjs
```

Skip it for content-only or edit-only sessions.

## 5. Respect the hard gates

- **Never commit doc-restructuring, ADR, or session-close work without showing
  the user the diff first.** Leave the tree staged/uncommitted and hand back.
- **Count done/pending against `origin/main`, not the local tree:** run
  `git fetch` first, then compare — local files may be ahead of or behind what's
  actually published.
- One agent on the repo at a time (ADR `0004`) still holds — you are performing
  the single gated write here.

## 6. Monthly archive note (housekeeping)

Session snapshots live under `docs/status/sessions/`; at month-end, files older
than ~30 days move to `docs/status/sessions/archive/` (immutable snapshots,
per `MEMORY-SYSTEM.md` §7). If you notice top-level session files from a prior
month still sitting outside `archive/`, flag it in the summary — don't silently
reorganize history mid-session unless the user asks.

## 7. Print a one-screen summary

End with a compact recap: what changed (paths), whether a handoff and/or ADR was
written (or why skipped), NOW.md updated (yes), REPO-MAP regenerated (yes/no),
and the exact next actions. Then stop — do not commit.
