# Daily template-rewrite routine (cloud)

Cold-start instructions for the two claude.ai cloud routines that each rewrite
**one** live internal article per run into the content-plan template, in
place. Governed by [[0030-template-rewrite-routines]]. Everything here runs from
a fresh clone of `statohub` with no memory of earlier runs — this file plus the
repo is the whole context.

The trigger prompt names a **LANE** (`A` or `B`); each lane works its own rows
of `content-ops/rewrite/queue.csv`:

| Lane | Malta time | Cron (UTC) until 2026-10-25 | Cron (UTC) from 2026-10-25 |
|------|-----------|-----------------------------|----------------------------|
| A    | 02:30     | `30 0 * * *`                | `30 1 * * *`               |
| B    | 12:00     | `0 10 * * *`                | `0 11 * * *`               |

Trigger IDs are in `docs/status/NOW.md`. No LANE in the prompt →
`PUBLISH_FAILED [0]: no lane` and stop.

**No fabricated success.** Every claim in the final `PUBLISH_RESULT` (file
written, gate green, commit SHA, URL) must come from command output you saw in
this run. If a gate fails, take the failure path; never push a failing build.

**Exactly one article per run.** Never loop to a second article.

**Run every subagent in the foreground** (`run_in_background: false`) and wait
for its report. Never end your turn while a writer or reviewer is still
running: a cloud run can stop when your turn ends, leaving a half-written file.

**The page is live.** Never set it to `draft: true`; a failed rewrite is undone
with `git checkout -- src/content/articles/<slug>.mdx`.

---

## Step 0 — Repo, sync, pause check

```bash
cd "$(git rev-parse --show-toplevel)"
git checkout main && git pull --ff-only origin main
```

If `content-ops/rewrite/PAUSED` exists: print `PUBLISH_RESULT: paused` with the
file's contents and stop. It pauses both lanes. (Do not touch
`content-ops/routine/PAUSED`, `content-ops/cloud-routine/PAUSED` or
`outsource-content/routine/PAUSED`; they belong to other routines.)

## Step 1 — Environment

```bash
npm ci
python3 scripts/db_sync.py rebuild          # boards are gitignored .db files; rebuild from .sql
npm run build                               # preflight: main itself must be green
```

Failure → `PUBLISH_FAILED [1]: <reason, first error line>` and stop. Touch no
queue or board rows and commit nothing.

## Step 2 — Pick

```bash
python3 content-ops/rewrite/queue.py next <LANE>
```

Empty output → `PUBLISH_RESULT: nothing_to_do` and stop (success: the lane is
finished).

## Step 3 — Run the pipeline for that slug

Execute `.claude/skills/rewrite-article/SKILL.md` **steps 1–6** exactly: (resume
parked draft if offered) → `plan-article-writer` in rewrite mode →
`plan-article-reviewer` in rewrite mode → loop (max 2 rounds) → failure path or
wrap-up. The reviewer commits and pushes on PASS; you do not re-implement its
gates. Do the orchestrator check in SKILL.md step 2 yourself before review.

Another routine may have pushed meanwhile (the outsource routine runs at 09:00
UTC). If a push is rejected: `git pull --rebase origin main`, re-run
`npm run build`, push once more. Still rejected → failure path.

## Step 4 — Final checks and result

```bash
python3 scripts/db_sync.py check
git status --porcelain            # must be empty
git log -1 --format='%H %s'
```

Print exactly one block:

```
PUBLISH_RESULT: published | changes_requested | blocked | nothing_to_do | paused
lane: <A|B>
slug: <slug>
url: https://statohub.com/<slug>/
commit: <sha>
notes: <one line: word count before → after, review score, review rounds>
```

Or `PUBLISH_FAILED [<step>]: <reason>` for an environment/tooling failure.
