# Daily outsource publish routine (cloud)

Cold-start instructions for the claude.ai cloud routine that publishes **one**
babylovegrowth article per day to the Applied Statistics section. Governed by
[[0026-outsource-daily-cloud-routine]]. Everything here runs from a fresh clone
of `statohub` with no memory of earlier runs — this file plus the repo is the
whole context.

**No fabricated success.** Every claim in the final `PUBLISH_RESULT` (file
written, gate green, commit SHA, URL) must come from command output you saw in
this run. If a gate fails, take the failure path; never push a failing build.

**Exactly one article per run.** Never loop to a second article, even if the
first one finishes early or blocks.

---

## Step 0 — Repo, sync, pause check

```bash
cd "$(git rev-parse --show-toplevel)"      # repo root: holds outsource-content/ and src/
git checkout main && git pull --ff-only origin main
```

If `outsource-content/routine/PAUSED` exists: print `PUBLISH_RESULT: paused`
with the file's contents and stop. It is the only pause switch for this routine.
(Do **not** touch `content-ops/cloud-routine/PAUSED` — that keeps the retired
internal routines stopped.)

## Step 1 — Environment

```bash
npm ci
python3 scripts/db_sync.py rebuild          # boards are gitignored .db files; rebuild from .sql
test -n "$BABYLOVEGROWTH_API_KEY" || echo "MISSING_KEY"
```

Missing key, failed `npm ci`, or failed rebuild → `PUBLISH_FAILED [1]: <reason>`
and stop. The key comes from the cloud environment's variables, never from a
committed file; never print it.

**Preflight build.** Before picking or writing anything, prove `main` itself is
green:

```bash
npm run build
```

Failure → `PUBLISH_FAILED [1]: preflight build red on main — <failing check and
first error line>` and stop. Touch no board rows and commit nothing: the repo,
not an article, is broken, and a human must fix it. This costs one build instead
of a full write-and-review that would fail at the final gate anyway (2026-10-06).

## Step 2 — Pick one article

Read `docs/status/NOW.md` (Outsource pipeline section) and
`outsource-content/README.md` first.

List upstream (the client reads `BABYLOVEGROWTH_API_KEY` from the environment):

```bash
cd outsource-content && python3 -c "
import babylovegrowth_client as c
for a in sorted(c.list_articles(), key=lambda a: a['created_at']):
    print(a['id'], a['slug'], a['created_at'][:10], a['title'], sep=' | ')
" ; cd ..
python3 outsource-content/outsource_db.py list
```

A vendor article is **already handled** if its id is mapped on the board
(`babylovegrowth_id`), its slug is a board row in any status other than
`queued`, or `src/content/articles/<slug>.mdx` exists. Skip those.

Choose in this order:

1. **Queued rows first.** The lowest-`queue_position` row with status `queued`
   whose topic exists upstream (vendor slug or title matches). Upstream
   presence decides workability, never position alone. Run the collision
   check below on it too (retire an unwritten internal owner; skip only for a
   live owner).
2. **Otherwise auto-queue** the **oldest** unhandled upstream article:
   - **Slug:** reuse the vendor's slug when it is a clean keyword slug
     (lowercase, hyphenated, no hook words); otherwise derive a short
     keyword-led slug. It must not already exist in `src/content/articles/`.
   - **Hub** — Applied only ([[0020-outsource-is-applied-only]]):
     `data-analysis`, `experiments-causality`, `time-series-forecasting`,
     `machine-learning-statistics`. Pick by topic; when torn, match the hub of
     the closest existing outsourced article.
   - **Collision check — vendor wins over our plan**
     ([[0029-vendor-articles-win-topic-collisions]]). Look up the likely
     primary keyword (and obvious variants, e.g. word order) in
     `content-ops/content.db` (`SELECT a.slug, a.status FROM keywords k JOIN
     articles a ON a.slug = k.article_slug WHERE k.keyword = ?`, plus a
     `primary_keyword LIKE` scan of `articles`), and `grep -ril` the topic in
     titles/primaryKeyword of `src/content/articles/`.
     - Owner is an **unwritten** internal row (any status except `published`,
       `merged`, `retired`, and no live MDX): retire it and keep this vendor
       article — `python3 content-ops/content_db.py retire <owner-slug> --by
       <vendor-slug>`. Retire every such owner the topic hits. Note each
       retirement for the result.
     - Owner is a **live** page (published internal or outsourced article):
       skip that candidate (note it for the result) and try the next oldest.
       Retiring a live page needs a 301 and a human.
   - Append an entry to `outsource-content/calendar.json` `articles`:
     `queue_position` = max existing + 1, `day_label` = the vendor
     `created_at` date (`YYYY-MM-DD`), `title` = a plain topic title,
     `slug`, `category_slug`. Then
     `python3 outsource-content/outsource_db.py import-calendar outsource-content/calendar.json`.

No candidate left → `PUBLISH_RESULT: nothing_to_do` and stop (success, not failure).

## Step 3 — Run the pipeline for that slug

Execute `.claude/skills/publish-outsource-article/SKILL.md` **steps 2–7**
exactly, for the chosen slug: map → fetch → `outsource-content-processor` →
`outsource-content-reviewer` → loop (max 2 rounds) → wrap-up. The reviewer
publishes, commits, and pushes on PASS; you do not re-implement its gates.

When briefing the processor, add the known sanitizer gaps (NOW.md "Parked"):
keep "Statohub's Take"/CTA content, no bare `{`/`}` in prose, drop the vendor
`— Statohub` sign-off, keep every non-babylovegrowth external link
([[0023-outsource-keeps-partner-backlinks]]), and pre-verify every `## Sources`
href returns 200 to plain `curl -sL` with a title matching the citation (the
reviewer fails closed on both link rot and mis-citation). **Replacing an
unreachable Sources entry never deletes the vendor's href:** if the vendor
linked it in prose, that inline link stays verbatim; only the `## Sources` entry
changes. Before the reviewer runs, check raw-vs-MDX parity yourself — every
non-babylovegrowth, non-image, non-`statohub.com` href in
`outsource-content/raw/<slug>.json` must appear in the MDX. Tell the reviewer
that inline-only vendor links may return 403 to curl (Cloudflare) and are
gated by parity, not by status.

If a `calendar.json` change or a `content_db.py retire` from Step 2 was not
included in the reviewer's commit, run `python3 scripts/db_sync.py dump` and
commit `outsource-content/` and `content-ops/` yourself (the reviewer stages
both; confirm `content-ops/content.sql` is in the commit).

**Failure paths** (still one article; do not pick another):
- Blocked / CHANGES_REQUESTED after round 2: the board row is set
  `changes_requested` or `blocked` by the reviewer. Make sure the draft MDX is
  **not** committed with `draft: false`. Commit only the board
  (`python3 scripts/db_sync.py dump`, then `git add outsource-content/ content-ops/`,
  commit `outsource: <slug> <status> (daily routine)`) and push, so tomorrow's
  run skips it. Delete the untracked draft MDX (`git clean` that one path only).

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
notes: <one line: auto-queued? collisions skipped? sources replaced?>
```

Or `PUBLISH_FAILED [<step>]: <reason>` for an environment/tooling failure.
