# CONTENT-WORKFLOW.md — statohub.com article pipeline

How the ~50 teaching articles get written, reviewed, and shipped. This is the
**content** counterpart to the Codex build loop in `AGENTS.md` /
`../Claude_OS/CODEX-WORKFLOW.md`.

> **Boundary:** `handoff/` = Codex **build** tasks (Astro, `<StatCalc>`,
> calculator engines, link plumbing). This pipeline = Claude **writing** the
> articles. They don't overlap. `CLAUDE.md`'s log stays single-writer (Claude).

## The pieces

| Piece | What it is |
|-------|-----------|
| `content-ops/content.db` | SQLite editorial board — every article, its keywords, category, calculator, phase, and pipeline status. The single source of truth. |
| `content-ops/schema.sql` + `seed.json` | The board's structure + its data (transcribed from the SEO study maps 08–13). Rebuild with `init` then `seed`. |
| `content-ops/content_db.py` | CLI: `init`, `seed`, `list`, `show`, `brief`, `next`, `set-status`, `log-review`, `stats`. |
| `.claude/seo-playbook.md` | THE rule book — every article obeys it; the reviewer scores against it. |
| `.claude/agents/stats-article-writer.md` | Drafts the MDX from a brief. |
| `.claude/agents/stats-article-reviewer.md` | Checks the draft (does not rewrite); PASS / CHANGES_REQUESTED. |
| `.claude/skills/write-article/SKILL.md` | `/write-article [slug]` runs the whole loop. |

## The status loop (`articles.status`)

```
planned ──brief──▶ briefed/drafting ──draft──▶ in_review ──review──▶ approved ──human──▶ published
                          ▲                                   │
                          └─────── changes_requested ◀────────┘  (reviewer fails it; cap 2 rounds)

research_pending = stub that needs a keyword pass first (don't write blind)
```

- `draft: true` in the MDX until a human flips it at **published**. Reviewer
  PASS only sets **approved** — never auto-publish.
- The board enforces the study's **one keyword → one article** rule with a global
  `UNIQUE` index on keywords. Re-seeding fails loudly on any overlap.

## Daily use

```bash
# what to write next (unflagged, lowest phase, highest volume)
python content-ops/content_db.py next

# write one article end-to-end (brief → writer → reviewer → status)
/write-article <slug>          # or just /write-article for the next pick

# see the board
python content-ops/content_db.py list --status planned
python content-ops/content_db.py stats
```

After the reviewer passes an article and you've eyeballed it: flip `draft: false`,
run `npm run build` (the link gate must stay green), then
`python content-ops/content_db.py set-status <slug> published`.

## Flagged & stub articles

Articles marked `*` in `list` carry an intent/thin flag from the study (e.g.
`range-of-a-function` = algebra intent; `how-to-find-frequency` = physics intent;
`null-hypothesis` = ambiguous "null" variants). Review the note before writing.
The two `research_pending` stubs (`permutations-and-combinations`,
`validity-in-statistics`) wait on dedicated keyword-research passes — don't draft
them yet.
