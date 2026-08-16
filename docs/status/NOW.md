# Now

> Current state, active work, and blockers. This file wins over any session
> handoff if they disagree -- fix the conflict immediately when found. Updated
> at the end of any session that changes priorities; kept under ~60 lines.

**Last updated:** 2026-08-16.

## Active: Applied Statistics restructure -- scaffolding COMPLETE, content next

The site is being restructured from one section into three: **Learn**,
**Calculators**, and a new **Applied Statistics** section (4 new category hubs
at flat root URLs, `/applied/` landing, 8 first articles), plus a homepage
rebuild to a supplied mock. ADRs 0014 (applied URL family) and 0015 (wedge
scoped to Learn) are written and committed. Source material:
`docs/ideas/statohub-applied-content-style-plan.md` (the 2026-08-09
applied-format spec -- its `/blog/` URL and directory naming are **superseded**;
`src/components/applied/` is the real path) and
`docs/ideas/homepage-redesign-mock-2026-08-16.png`.

**Stage 0 DONE.** Codex runs through `codex mcp-server` as native tool calls;
no more manual relay.

**Done and committed (local, NOT pushed -- see below):**
- **TASK-025** applied-section schema field, 4 status tokens x 2 themes,
  `faqPageSchema()`.
- **Four applied hubs** + **TASK-026** `/learn/` + `/applied/` landings, two new
  route kinds, section-aware breadcrumbs, `RESERVED_SLUGS` guard.
- **TASK-027** 3-item section nav (Learn / Applied / Calculators) + 4-column
  footer whose Learn/Applied lists derive from the `categories` collection.
  This is what gave the applied hubs sitewide inbound links.
- **TASK-028A/B** all 8 module components in `src/components/applied/`
  (`KeyTakeaways`, `Callout`, `Checklist`, `DataTable`, `Sources`, `FAQ`,
  `Figure`, `TableOfContents`) + the noindex `/dev/preview/` page.
- **TASK-029A/B** all 6 SVG infographics + the shared `_SvgFrame` accessibility
  wrapper. Contrast guard extended 13 -> 21 checks.

**Current baseline:** 116 pages, 4296 internal links, 0 link violations,
0 meta-description violations, 35 test files / 121 tests, `astro check` 36 files
/ 0 errors, 21/21 contrast checks.

**Next: TASK-030+ (applied article layout) and the 8 first applied articles.**
The component system is complete and unused -- nothing renders these modules on
a public page yet.

### Blocker: 10 local commits are unpushed, deliberately

Pushing to `main` triggers the Actions deploy (ADR-0006), which would put 4
article-less hubs and 2 landings live. They render a proper "guides are being
added" empty state (combinatorics has shipped that way for months), so nothing
is broken -- but they would be indexable thin pages until the applied articles
exist. **Decision pending with the user:** push now, or hold until content
lands.

### Operational finding: the 900s MCP timeout is real

2 of 5 dispatches this session (TASK-028A, TASK-029B) hit the ceiling. In both
cases **the implementation was complete** -- the timeout truncated the reply and
sometimes the final bookkeeping, never the code. The correct response to a
timeout is to diff the tree and re-run the gates, **never to re-dispatch**.
Keep tasks at roughly 4-6 files; that is why TASK-028 and TASK-029 were each
split in two before dispatch.

## Content pipeline: QUEUE EXHAUSTED -- routine idle since 2026-08-14

**The daily publisher is not broken; it has run out of work.** `content-ops/routine-runs.log`
shows clean daily successes 2026-08-09 through **2026-08-14** (`simpsons-paradox`,
commit `73ba4cd`), then nothing. `content_db.py next` returns *"No unflagged
'planned' articles left"*, and `list --status planned` returns **0** with or
without `--flagged`.

- **75 rows in `content.db`**; the only non-published one is
  **`validity-in-statistics`** -- status `research_pending`, **flagged**,
  KD 6-11, ~16,500 combined volume. It needs keyword research before it can be
  written.
- **On disk: 74 article files** (73 `draft: false`, 1 draft). Build produces
  **109 pages**.
- **Decision needed:** either queue a new Learn batch, or leave the routine idle
  through the Applied restructure. Leaving it idle has a real upside -- no cloud
  routine committing to `origin/main` while the restructure lands, so no
  contention with the one-agent-on-the-repo gate.
- Trigger `trig_01DhQoEV3sRaKynzFC88xTzh` ("statohub publish 03:00 Malta", cron
  `0 1 * * *` UTC) is still the sole daily publisher and remains enabled -- it is
  simply a no-op each night while the queue is empty.

## Baseline verified 2026-08-16

`npm run build` green on `origin/main` at session start: 109 pages, 4,066
internal links, **0 link violations**, **0 meta-description violations**. The
local tree is now at 116 pages / 4,296 links, still 0 violations -- see the
Active section for the full gate set.

## Recently closed

- **Local repo was 70 commits behind `origin/main`** (local `0b227e5` 2026-07-11
  vs origin `19fb8f5` 2026-08-14) -- fast-forwarded 2026-08-16. Article count went
  39 -> 74. No architecture files differed. This is exactly what the
  count-against-`origin/main` gate below exists to catch.
- **`scripts/gen-repo-map.mjs` fixed 2026-08-16.** Was untracked *and* broken
  while `.claude/skills/session-close/SKILL.md` and `docs/REPO-MAP.md` both
  referenced it -- it used `URL.pathname`, which stays percent-encoded, so a repo
  path containing spaces never resolved. Now uses `fileURLToPath` (matching
  `gen-route-ids.mjs`) and only reports directories + root files, cutting 75
  false positives to 11 real ones.
- **Phase A (workspace audit fixes) and Phase B (memory-system migration):**
  both CLOSED 2026-07-05, committed `e7bf3a1`. Meta-description length fix +
  build gate closed same day.
- **Delegation-first operating model + `/session-close` skill:** shipped
  2026-07-11, commit `0b227e5`. See
  `docs/status/sessions/2026-07-11-workspace-restructure-delegation-model.md`.

## Parked / paused (do not silently resume)

- **`docs/REPO-MAP.md` is stale.** The now-working drift checker flags 11 real
  undocumented entries: `SEO-Audit/`, `docs/audit/`, `docs/ideas/`,
  `vitest.config.ts`, `postcss.config.cjs`, `package-lock.json`, and the two
  root-level content-brief docs. Needs a hand-written annotation pass.
- **Article schema `image` field.** Every article ships Article JSON-LD with no
  `image` property (`ogImage` is optional in `src/content/config.ts` and unset
  everywhere). Google effectively requires it for Article rich-result
  eligibility. Fix: set `ogImage` per article, or fall back to
  `/og-default.png` inside `articleSchema()` in `src/lib/schema.ts`, as
  `Meta.astro` already does for OG tags.
- **`how-to-find-the-range` content refresh.** 5 range-in-statistics keywords
  were folded into this already-published article on 2026-07-11; they are in the
  DB but never worked into the live page text. Light refresh, not a rewrite.
- **`relative frequency` / `cumulative frequency`** are not covered by any
  article and are open candidates for new Learn pieces.
- **No `.gitattributes`** with `core.autocrlf=true`, so generated files
  (`src/lib/content-route-ids.ts`) show phantom CRLF-only diffs after a build.
  Cosmetic, but it makes `git status` lie.
- **Phase C / Phase D** per `docs/ideas/statohub-action-plan.md`: not started.

## Standing hard gates

- One agent on the repo at a time (Codex builds via `handoff/`, Claude
  reviews/closes and writes content).
- Never commit doc-restructuring or ADR work without showing the user first.
- Always count "done/pending" against `origin/main` after `git fetch`, never the
  local tree -- this failed on 2026-08-16 and cost a 70-commit surprise.
