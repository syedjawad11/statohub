# Now

> Current state, active work, and blockers. This file wins over any session
> handoff if they disagree -- fix the conflict immediately when found. Updated
> at the end of any session that changes priorities; kept under ~60 lines.

**Last updated:** 2026-08-16 (Applied batch 1 live).

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

**Done, committed, pushed, and live:**
- **TASK-025** applied-section schema field, 4 status tokens x 2 themes,
  `faqPageSchema()`.
- **Four applied hubs** + **TASK-026** `/learn/` + `/applied/` landings, two new
  route kinds, section-aware breadcrumbs, `RESERVED_SLUGS` guard.
- **TASK-027** 3-item section nav (Learn / Applied / Calculators) + 4-column
  footer whose Learn/Applied lists derive from the `categories` collection.
  This is what gave the applied hubs sitewide inbound links.
- **TASK-028A/B** all 8 module components in `src/components/applied/`
  (`KeyTakeaways`, `Callout`, `Checklist`, `DataTable`, `Sources`, `FAQ`,
  `Figure`, `TableOfContents`) + the noindex preview page (now
  `/dev/applied-preview/`, moved by TASK-033).
- **TASK-029A/B** all 6 SVG infographics + the shared `_SvgFrame` accessibility
  wrapper. Contrast guard extended 13 -> 21 checks.

- **TASK-030/031/032/033** applied article layout + section dispatch, three-section
  homepage rebuild, content-ops `section` support, and the `/dev/applied-preview/`
  living style guide. All four reviewed and **CLOSED** 2026-08-16.
- **Applied batch 1: 4 articles published and live** (one per hub) --
  `data-drift-detection`, `how-to-design-an-ab-test`, `exploratory-data-analysis`,
  `forecast-accuracy-metrics`. Drafted by four parallel sonnet subagents against
  `.claude/applied-playbook.md`, reviewed, and published in one gated commit.
  This is the first content ever rendered by `AppliedArticleLayout`; the layout,
  the H2+H3 TOC, FAQPage JSON-LD, and the module/infographic system are now all
  verified on real public pages rather than only in the preview route.

**Current baseline (on `origin/main`, deployed 2026-08-16):** 120 pages, 4,489
internal links, 0 link violations, 0 meta-description violations, 35 test files
/ 121 tests, `astro check` 37 files / 0 errors, 21/21 contrast checks.

**Next: Applied batch 2 -- the remaining 4 articles**, planned for 2026-08-17.
One per hub again, so each hub reaches 2 articles. Topics not yet chosen.

### Two defects found during the TASK-030..033 review (both fixed)

1. **`content.db` was never migrated.** TASK-032 shipped the category `section`
   migration but only ever ran it against temporary databases, so the tracked
   `content-ops/content.db` had no `section` column and `content_db.py show` /
   `brief` **crashed** (`no such column: section`). Every gate passed while the
   committed tool was broken. Fixed by running `init` + `seed`. **Lesson: a
   migration is not done until it has run against the artifact that is committed.**
2. **`brief` crashed on any flagged article** with `UnicodeEncodeError` -- the
   `⚠ FLAGGED` marker is U+26A0 and the Windows console is cp1252. Pre-existing
   latent bug, never fired because no flagged article had been briefed. Fixed by
   forcing UTF-8 on stdout/stderr.

Also written this session: **`.claude/applied-playbook.md`** (275 lines), which
`content_db.py` already pointed every Applied brief at but which did not exist.

### Carried forward: homepage visual QA never ran

TASK-031's DoD required a desktop/mobile visual check against
`docs/ideas/homepage-redesign-mock-2026-08-16.png`; the browser runtime exposed
zero instances, so it was verified through built artifacts only. The homepage is
live now -- a manual eyeball pass is still owed.

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

- **79 rows in `content.db`** (77 published after Applied batch 1). The two
  non-published are **`validity-in-statistics`** (`research_pending`, **flagged**,
  KD 6-11, ~16,500 combined volume -- needs keyword research first) and one
  `changes_requested` row.
- **On disk: 78 article files**, all `draft: false`. Build produces **120 pages**.
- **Decision taken 2026-08-16:** leave the routine idle through the Applied
  restructure. No cloud routine committing to `origin/main` while the restructure
  lands means no contention with the one-agent-on-the-repo gate.
- **Applied rows are deliberately `flagged`.** The four batch-1 articles were
  seeded as phase 70 with `flagged: 1` so `next` skips them and the nightly
  routine could not auto-publish a half-written draft; they were published
  manually instead. **Do the same for batch 2.** `next` currently returns
  "No unflagged 'planned' articles left", so the 03:00 run stays a no-op.
- Trigger `trig_01DhQoEV3sRaKynzFC88xTzh` ("statohub publish 03:00 Malta", cron
  `0 1 * * *` UTC) is still the sole daily publisher and remains enabled -- it is
  simply a no-op each night while the queue is empty.

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
