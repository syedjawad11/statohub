---
number: 0022
title: Router files are maps, not rulebooks; delegation is a judgment call, not a protocol
type: process
status: accepted
date: 2026-09-06
---

**Context:** the instruction layer was written for an older model generation and
compensated for weaker models with ceremony. `CLAUDE.md` carried a
`## Operating Model — Delegation First (BINDING)` block that made the
orchestrator delegate any read of more than ~3 files, pinned a fixed
`haiku`/`sonnet` tier table, cited a `claude-seo` plugin absent from this
checkout, and required every subagent to write its output to disk and return
<=250 words.

Measured before the change: 884 lines of instruction files; ~40% of `CLAUDE.md`
was process ceremony and ~45% of `AGENTS.md` duplicated it verbatim. The same
~6 constraints were restated across 5+ files, "no raw LaTeX" appeared in 4, the
`<RelatedLink>` intro-phrase pool verbatim in 2, and ~90 lines of
`applied-playbook.md` hand-copied Astro prop interfaces that had already drifted
from `src/components/applied/`. `docs/PROJECT.md` named `CLAUDE.md` as
authoritative while `CLAUDE.md` pointed at `docs/ARCHITECTURE.md` — a pointer
cycle.

Direct evidence the contract was unenforceable: three read-only `Explore`
subagents run during this session's audit could not honour the write-to-disk
half of it at all, having no `Write` tool.

**Options considered:**
(1) Keep the protocol and fix only the stale references.
(2) Delete the delegation block wholesale, ceremony and safeguards together.
(3) Convert the routers to maps, keep the safeguards that are structural rather
than model-era, and give every rule exactly one canonical home.

**Decision:** (3). `CLAUDE.md` and `AGENTS.md` are **maps**: where to look, what
is invariant (one line plus an ADR link, never the rule text), and how work
moves. Rules live once — in `docs/ARCHITECTURE.md` and the ADRs — and every
other file points at them. Delegation is a judgment call: delegate when it
genuinely helps, pick the cheapest model that can do the job, no fixed tier
table, and summarize to disk only when the output is actually large.

**Reasoning:** on a current-generation model, forcing a 3-file read through a
subagent costs more and loses more context than reading the files directly, so
the protocol had become a tax rather than a safety net. Three things survived
because they are structural, not compensatory: **review is never delegated**
(`stats-article-reviewer` has no `Write` tool by design and
`outsource-content-reviewer` publishes to production with no human checkpoint,
so the orchestrator's spot-check is the last line of defence); **one agent on
the repo at a time** ([[0004-codex-builds-claude-reviews]]); and preferring the
cheapest sufficient model, kept as a hint rather than a table. Duplication was
cut because a rule restated in five places is five things to keep in sync, and
the drifted component interfaces proved the failure mode was already live.

**Consequences:**
- `CLAUDE.md` 148 -> 89 lines, `AGENTS.md` 86 -> 68; caps in
  `scripts/check-docs.mjs` tightened to 90 and 70 to hold the shape.
- `docs/ARCHITECTURE.md` is the single authority for the URL scheme, link
  safety, the stack lock and the content model. `docs/PROJECT.md` and
  `docs/REPO-MAP.md` stopped restating rules, breaking the pointer cycle.
- Playbook HARD/WARN/ADVISORY tiers and every numeric threshold are unchanged
  (seo 12/11/5, applied 15/7/5) — they make the reviewer verdict deterministic
  and have nothing to do with model era.
- `applied-playbook.md` §5/§6 cite `src/components/applied/` and
  `src/pages/dev/applied-preview/index.astro` instead of transcribing props, so
  the playbook can no longer drift from the components.
- The outsource engine's mechanisms are untouched ([[0020-outsource-is-applied-only]],
  [[0019-outsource-word-floor]]) — the four block-don't-force conditions,
  `check_sanitized.py` as an independent backstop, the flip-`draft`-before-build
  ordering, and the title-match citation check all stand.
- `scripts/check-docs.mjs` now scans `handoff/` and `.claude/` too; the dangling
  `handoff/README.md` link it had been missing is exactly the defect class it
  exists to catch.
- The cloud routines moved to `docs/legacy/cloud-routine/`; the `PAUSED` marker
  stays at `content-ops/cloud-routine/` because the claude.ai schedules still
  wake nightly and gate on that path.

**Revisit when:** a future model generation changes the economics again — either
subagent context becomes cheap enough that broad delegation pays, or the
orchestrator's own context stops being the binding constraint.

**Related:** [[0004-codex-builds-claude-reviews]],
[[0008-tiered-seo-validation]], [[0018-sqlite-boards-as-sql-dumps]],
[[0021-boards-split-by-source]].
