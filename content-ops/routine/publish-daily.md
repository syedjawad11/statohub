# Daily content-plan publish routine (cloud)

Cold-start instructions for the claude.ai cloud routine that writes and
publishes **one** article from the owner's content plan per run, in the
babylovegrowth-style template. Governed by
[[0028-content-plan-daily-routine]]. Everything here runs from a fresh clone of
`statohub` with no memory of earlier runs — this file plus the repo is the
whole context. Schedule: daily 03:00 Europe/Malta, as claude.ai routine
`trig_01CLrB4kqGE4P5NijmgrKbtn` (created 2026-10-04). Its cron is UTC:
`0 1 * * *` while Malta is on CEST; **change it to `0 2 * * *` on 2026-10-25**
(CET), and back to `0 1 * * *` on 2027-03-28.

**No fabricated success.** Every claim in the final `PUBLISH_RESULT` (file
written, gate green, commit SHA, URL) must come from command output you saw in
this run. If a gate fails, take the failure path; never push a failing build.

**Exactly one article per run.** Never loop to a second article.

---

## Step 0 — Repo, sync, pause check

```bash
cd "$(git rev-parse --show-toplevel)"
git checkout main && git pull --ff-only origin main
```

If `content-ops/routine/PAUSED` exists: print `PUBLISH_RESULT: paused` with the
file's contents and stop. It is the only pause switch for this routine. (Do
**not** touch `content-ops/cloud-routine/PAUSED` — it keeps the retired
routines stopped — or `outsource-content/routine/PAUSED`.)

## Step 1 — Environment

```bash
npm ci
python3 scripts/db_sync.py rebuild          # boards are gitignored .db files; rebuild from .sql
```

Failure → `PUBLISH_FAILED [1]: <reason>` and stop.

## Step 2 — Pick

Read `docs/status/NOW.md` and `content-ops/new-content-plan/README.md`, then:

```bash
python3 content-ops/content_db.py plan-next
```

No candidate → `PUBLISH_RESULT: nothing_to_do` and stop (success).

## Step 3 — Run the pipeline for that slug

Execute `.claude/skills/publish-plan-article/SKILL.md` **steps 2–6** exactly:
brief → `plan-article-writer` → `plan-article-reviewer` → loop (max 2 rounds)
→ wrap-up. The reviewer publishes, commits and pushes on PASS; you do not
re-implement its gates. Before the reviewer runs, open the draft yourself and
confirm it has no `<StatCalc>`, no `calculator:` and no `{`/`}` in prose.

**Failure path** (still one article; do not pick another): the row ends
`changes_requested` or `blocked`, the MDX is never committed at
`draft: false`, only the board is committed
(`content-plan: <slug> <status> (daily routine)`) and pushed, and the untracked
draft MDX is deleted (that one path only).

## Step 4 — Final checks and result

```bash
python3 scripts/db_sync.py check
git status --porcelain            # must be empty
git log -1 --format='%H %s'
```

Print exactly one block:

```
PUBLISH_RESULT: published | changes_requested | blocked | nothing_to_do | paused
slug: <slug>
url: https://statohub.com/<slug>/
commit: <sha>
notes: <one line: plan id, word count, review score, review rounds>
```

Or `PUBLISH_FAILED [<step>]: <reason>` for an environment/tooling failure.
