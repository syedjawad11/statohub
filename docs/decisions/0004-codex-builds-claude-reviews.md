---
number: 0004
title: Codex builds to spec, Claude writes content + reviews
type: process
status: accepted
date: 2026-06-13
---

**Context:** Two AI coding agents are available for this project (Codex and
Claude Code). Needed a division of labor before the first scaffold task was
written, to avoid both agents editing the same files without coordination.

**Options considered:**
(1) Either agent picks up any task ad hoc.
(2) Fixed split: one agent builds to spec, the other writes content + sets
rules + reviews the build output; tasks flow through a shared handoff
mechanism; only one agent touches the repo at a time.

**Decision:** Option 2. Codex builds to spec (scaffolding, engines,
components, CI/CD) from briefs Claude writes in `handoff/`, following a
5-state loop (TODO -> IN_PROGRESS -> DONE -> CLOSED, or CHANGES_REQUESTED
sent back). Claude writes content, sets SEO/content rules, and reviews every
Codex deliverable against its Definition of Done before closing the task.
`CLAUDE.md` has exactly one writer: Claude.

**Reasoning:** A brief-and-review loop gives each agent a narrow, verifiable
scope and a paper trail (the handoff file itself), which matters because
neither agent has memory of the other's session. Reviewing against artifacts
(re-running the actual gates), not just trusting the Work Log, is the
practice that has repeatedly caught real issues (stale route references,
unverified citations, mismatched scope).

**Consequences:** Every Codex task needs a written brief with an explicit
Definition of Done before it starts. Claude must re-run the verification
commands itself before marking a task `CLOSED`, not just read the Work Log.
Handoff files must stay plain-ASCII (Codex reads them through a Windows
codepage; non-ASCII punctuation like em-dashes/arrows has broken
`apply_patch` matching in the past).

**Revisit when:** if a third agent joins the workflow, or if the two-agent
split itself becomes the bottleneck (not observed as of this writing).

**Related:** [[0008-tiered-seo-validation]]
