# Statohub Memory-Management System
### Verdict, architecture, and implementation plan
*July 2026*

---

## 1. Executive summary and headline verdicts

**Do we genuinely need Obsidian for this project? No — not as a separate system.** The decisive fact is that your entire workflow runs through Claude Code and Claude chat. Claude Code reads plain Markdown files in a repository natively, with grep and file navigation built in. It gets zero benefit from Obsidian's graph view, plugins, or backlink pane — those are human-browsing features. An Obsidian vault is, underneath, just a folder of Markdown files, which means the "hybrid repository + Obsidian" option collapses into something much simpler: **keep all knowledge as plain Markdown in the repo, and if you ever want Obsidian's reading experience, point Obsidian at the `docs/` folder as a viewer.** That costs nothing, requires no migration, and creates no second system to maintain.

**Should the vault be inside or outside the repository?** Inside. One clone gives every Claude Code session and every future subagent the full knowledge base. The only content excluded from the *main* repo is bulk research data (raw DataForSEO exports), which goes in the repo but under a path that agents are instructed never to auto-load — or in a sibling `statohub-research` repo if it grows past a few tens of MB.

**Vector database / embeddings? Not justified now.** Even at your most aggressive publishing pace (90 articles/month), a year of operation produces roughly 1,000 content files and perhaps 100–200 knowledge documents. Grep plus disciplined naming and a routing index outperforms a vector store at this scale, with zero infrastructure. Section 12 defines the concrete trigger for revisiting.

**The simplest system that can work now:** six files and two folders, created this week. Section 14 lists them.

---

## 2. Comparison of the ten memory approaches

**Repository Markdown documentation.** The backbone. Version-controlled, diffable, greppable, readable by every AI tool you use. Weakness: rots silently unless a maintenance ritual exists (Section 11). Verdict: primary system.

**Obsidian knowledge vault.** Strong for a human doing heavy manual research linking across hundreds of notes. For Statohub, your research synthesis already happens *in Claude chat*, and its outputs are documents Claude Code needs to read — which argues for the repo, not a desktop app. Verdict: optional viewer over `docs/`, never a separate store.

**Claude Code project memory files.** Claude Code's auto-memory is convenient but opaque, per-machine, and not shared with chat sessions or future agents. Verdict: fine for trivia; anything that matters gets promoted into a repo file.

**`CLAUDE.md` and directory-specific instruction files.** The highest-leverage file in the system, because it's the only thing loaded automatically every session. Its job is *routing, not storage*: keep it under ~150 lines of rules plus pointers ("before touching templates, read `docs/DESIGN-SYSTEM.md`"). Directory-level `CLAUDE.md` files earn their keep once the codebase has distinct zones (e.g., `calculators/`, `content/`). Verdict: adopt, aggressively kept short.

**Architecture Decision Records.** The single best defense against the failure mode you've already experienced — an agent re-adding course scaffolding that was explicitly rejected. Decisions like "no lesson/module framing yet," "flat URLs," "Distributions is its own silo" belong here *including the rejected alternatives*. Verdict: adopt immediately; template in Section 9.

**Session summaries / handoffs.** Essential for continuity between Claude Code sessions and between Code and chat. Danger is accumulation — 40 stale handoffs are worse than none. Verdict: adopt with a hard lifecycle: one live `NOW.md`, handoffs archived after their content is absorbed, deleted after ~30 days.

**Structured task/implementation logs.** Mostly redundant with git history plus decision records plus handoffs. Verdict: skip as a distinct artifact; a short "Completed" section in `NOW.md` covers it.

**GitHub Issues / Projects.** Good for multi-person teams and public roadmaps. For a solo founder, it's a second inbox that drifts out of sync with the repo docs, and Claude Code reads a `NOW.md` more cheaply than it calls the GitHub API. Verdict: skip for now; revisit if collaborators join.

**Lightweight database / vector memory.** Infrastructure cost, sync burden, and hallucination-adjacent retrieval failures, in exchange for solving a scale problem you don't have. Verdict: no (Section 12).

**Hybrid repo + Obsidian.** As argued above, this reduces to "repo Markdown, optionally viewed in Obsidian." Verdict: yes in that degenerate, zero-cost form only.

---

## 3. Source-of-truth rules

One authoritative home per information type. Everything else links; nothing copies.

| Information type | Authoritative location | Notes |
|---|---|---|
| Permanent agent rules & standards | `CLAUDE.md` (+ directory `CLAUDE.md`) | Rules only; details live in linked docs |
| Coding / content / SEO standards | `docs/standards/` | Linked from `CLAUDE.md` |
| Architecture & how the site is built | `docs/ARCHITECTURE.md` | |
| Repo map | `docs/REPO-MAP.md` | Regenerated, not hand-edited (Section 11) |
| Product & architecture decisions | `docs/decisions/` | ADR/PDR files, one per decision |
| Design system (palette, type, components) | `docs/DESIGN-SYSTEM.md` | Extracted from the theme-preview work |
| Current task & priorities | `docs/status/NOW.md` | The only file describing "what's happening" |
| Session handoffs | `docs/status/sessions/` | Time-boxed lifecycle |
| SEO strategy & content plan | `docs/seo/STRATEGY.md`, `docs/seo/clusters/` | |
| Raw keyword data | `research/` (or sibling repo) | Never auto-loaded |
| Ideas / future features / monetization | `docs/ideas/` | Explicitly non-binding; agents ignore unless asked |
| Chat conversations | Claude chat history | Treated as *drafting space*, never as a source of truth — conclusions get promoted into a repo doc the same day or they're considered lost |

**Linking discipline:** when a document needs information owned elsewhere, it writes one sentence of context plus a relative link (`see docs/decisions/0003-flat-urls.md`), never a pasted copy. This is the single rule that prevents conflicting duplicates. When you catch a duplicate, the fix is always: keep the authoritative version, replace the other with a link.

---

## 4. Repository documentation structure

```
statohub/
├── CLAUDE.md                     # Router + hard rules (<150 lines)
├── docs/
│   ├── PROJECT.md                # Vision, wedge thesis, audience, business model
│   ├── ARCHITECTURE.md           # Stack, hosting, build, URL scheme
│   ├── REPO-MAP.md               # Annotated directory map (auto-refreshed)
│   ├── DESIGN-SYSTEM.md          # Palette, typography, components, dark mode
│   ├── standards/
│   │   ├── content.md            # Article structure, tone, calculator embedding
│   │   ├── seo.md                # Titles, metas, internal linking, schema
│   │   └── code.md               # HTML/CSS/JS conventions
│   ├── decisions/
│   │   ├── README.md             # Index table: number, title, status, date
│   │   ├── 0001-wedge-model.md
│   │   ├── 0002-no-course-scaffolding-yet.md
│   │   ├── 0003-flat-url-structure.md
│   │   └── 0004-silo-boundaries.md
│   ├── seo/
│   │   ├── STRATEGY.md           # Depth-first sequencing, KD-based prioritization
│   │   └── clusters/             # One file per cluster: pillar, spokes, status
│   ├── status/
│   │   ├── NOW.md                # Current priorities, active task, blockers
│   │   └── sessions/             # Dated handoffs, pruned monthly
│   └── ideas/                    # Parking lot; excluded from normal context
└── research/                     # Raw exports; agents never read without instruction
```

Naming conventions: decision files `NNNN-kebab-title.md`; session files `YYYY-MM-DD-topic.md`; cluster files match the pillar slug. Frontmatter is worth using in exactly two places — decisions (`status: accepted|superseded|rejected`, `date`) and clusters (`status: planning|writing|published`, `pillar`, `updated`). Everywhere else it's ceremony.

---

## 5. AI memory-layer design

**Layer 1 — Permanent rules** → `CLAUDE.md` + `docs/standards/`. Loaded: `CLAUDE.md` automatically every session; standards files only when the task touches their domain (the router says which). Changes require deliberate editing, ideally noting *why* in a decision record if the change reverses prior guidance.

**Layer 2 — Stable knowledge** → `PROJECT.md`, `ARCHITECTURE.md`, `REPO-MAP.md`, `DESIGN-SYSTEM.md`, decisions index. Loaded selectively: an agent writing an article reads `PROJECT.md` + `standards/content.md`; an agent building a template reads `ARCHITECTURE.md` + `DESIGN-SYSTEM.md`. The decisions *index* (a 30-line table) is cheap enough to load broadly; full decision files load only when relevant.

**Layer 3 — Active context** → `NOW.md` + the latest session handoff. Loaded at the start of essentially every working session. This is the layer that changes daily and the only one where staleness is fatal, hence the strict lifecycle.

**Layer 4 — Historical memory** → decision records (including rejected/superseded), archived handoffs, git history. Never auto-loaded. Retrieved by grepping the decisions index or `git log` when a question smells like "have we been here before?"

**Layer 5 — Research & ideas** → `docs/ideas/`, `docs/seo/clusters/`, `research/`. Explicitly excluded from normal sessions; loaded only when the task *is* research or content planning. `CLAUDE.md` should say so in one line: "Never read `research/` or `docs/ideas/` unless the task explicitly concerns them."

---

## 6. Context-loading and retrieval strategy

The core mechanism is **`CLAUDE.md` as a router table**, not a knowledge dump. A section like:

```
## What to read before which task
- Writing/editing articles      → docs/standards/content.md, docs/standards/seo.md
- Templates, CSS, components    → docs/DESIGN-SYSTEM.md, docs/ARCHITECTURE.md
- Content planning / keywords   → docs/seo/STRATEGY.md + the relevant cluster file
- Anything architectural        → docs/decisions/README.md first; open only cited ADRs
- Starting any session          → docs/status/NOW.md
Read nothing else by default. Never load research/ or docs/ideas/ unprompted.
```

That one block replaces most of what people build vector databases for. Supporting practices:

**Context packs.** For recurring task types, keep a one-paragraph "pack" in the relevant standards file listing exactly which files to open and which to skip. An article-writing pack is maybe four files totaling a few thousand tokens.

**Repo map instead of exploration.** `REPO-MAP.md` (a commented tree, ~60 lines) is regenerated by a script so agents stop re-running `find` on every session. This alone kills the "repeated repository exploration" problem.

**Summaries as gatekeepers.** Long documents open with a five-line summary. Agents are instructed to read the summary and stop unless it indicates deeper relevance.

**Context-size rules of thumb.** `CLAUDE.md` <150 lines; `NOW.md` <60 lines; any standards file <250 lines (split when exceeded); decision records <80 lines. These caps are what keep "load the relevant docs" cheap forever.

**Search is grep.** With kebab-case filenames, frontmatter status fields, and a decisions index, `grep -ril "url structure" docs/` finds anything in under a second. Semantic search adds value only when queries stop matching vocabulary — see Section 12.

---

## 7. Session memory and handoffs

Template — `docs/status/sessions/YYYY-MM-DD-topic.md`:

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

Target length: under 40 lines. If it's longer, it's narrating instead of handing off.

Lifecycle: **created** at the end of any session that leaves work unfinished or made a non-trivial decision (a session that only published two articles per an existing plan doesn't need one — updating the cluster file suffices). **Updated** never — handoffs are immutable snapshots; corrections go in the next one. **Consolidated** when a piece of work finishes: durable learnings promote to standards or ADRs, the "Completed" facts merge into `NOW.md`'s done list, and the handoffs that fed it become deletable. **Archived** by moving to `sessions/archive/` at month end. **Deleted** after ~30 days in archive; git history retains them anyway.

`NOW.md` is the complement: a living file with current priorities, the active task, blockers, and a short recently-done list. Rule: at session start, `NOW.md` wins over any handoff if they conflict, and the conflict gets fixed immediately.

---

## 8. Decision management

Use one lightweight format for both architecture and product decisions (a `type:` field distinguishes them; two parallel systems is overengineering).

```markdown
---
number: 0002
title: No course scaffolding until traffic justifies it
type: product
status: accepted        # proposed | accepted | superseded-by-NNNN | rejected
date: 2026-06-XX
---
**Context:** Articles vs. lesson/module structure for content pages.
**Options considered:** (1) Lesson numbering + progress framing now;
(2) plain articles, course layer deferred.
**Decision:** Option 2. Articles stay articles.
**Reasoning:** Premature scaffolding adds build cost and locks in IA before
traffic reveals demand; course platform is a 6–12 month horizon.
**Consequences:** Article template has no lesson numbering; URL and template
design must not assume module hierarchy.
**Revisit when:** organic traffic sustains >X/mo, or course-intent queries
appear in Search Console.
**Related:** docs/DESIGN-SYSTEM.md, 0003-flat-url-structure.md
```

Record **rejected ideas as first-class entries** (`status: rejected`) — that's what stops a future agent, or future you, from relitigating the Probability/Distributions silo split. The `README.md` index table (number, title, type, status, date) is the cheap loadable surface; agents scan it and open only what's cited. You already have four or five decisions worth backfilling on day one: the wedge model, no-scaffolding, flat URLs, silo boundaries, and the KD-encodes-competition principle.

---

## 9. Memory maintenance

**Per session (agent-executed, ~2 minutes):** update `NOW.md`; write a handoff if warranted; if any instruction in `CLAUDE.md` or a standards file was contradicted or proved wrong during the session, flag it in the handoff rather than silently working around it.

**Weekly (~15 minutes, you):** read `NOW.md` and prune; skim open handoffs and consolidate finished threads; check whether any chat-session conclusions from the week were never promoted to a repo doc — promote or discard them.

**Monthly / per milestone (~30 minutes):** regenerate `REPO-MAP.md`; review the decisions index for anything superseded by reality; archive/delete sessions; run a conflict check (below).

**Conflict and staleness detection.** Two cheap mechanisms cover most of it. First, a validation script (runnable by Claude Code as a slash command) that checks: internal links in `docs/` resolve; every decision file appears in the index; `NOW.md` and `CLAUDE.md` are under their line caps; no session file older than 30 days sits outside archive. Second, a standing instruction in `CLAUDE.md`: *"If two documents disagree, the decision record wins over prose docs, and newer wins over older. Report the conflict in your handoff."* Agents are excellent at surfacing contradictions when told that surfacing them is part of the job.

**Automation split:** automate `REPO-MAP.md` generation, the link/format validation script, and (via a Claude Code hook or command) the end-of-session `NOW.md` update prompt. Do **not** automate consolidation or archiving decisions — judgment about what's still true is the one thing worth your fifteen weekly minutes. Ownership is trivially resolved: you own weekly/monthly reviews; agents own per-session updates.

---

## 10. Migration plan for existing knowledge

1. **Day 1 — skeleton:** create the structure in Section 4 with stub files.
2. **Day 1 — backfill decisions:** write the ~5 ADR/PDRs already made (listed in Section 8). This is the highest-value hour of the whole migration.
3. **Day 2 — extract the design system:** the theme-preview HTML encodes palette, typography, and component decisions; distill them into `DESIGN-SYSTEM.md` so the next template session doesn't reverse-engineer the file.
4. **Day 2 — write `PROJECT.md` and `CLAUDE.md`:** the wedge thesis, silo structure, and content strategy are well-articulated already; this is transcription, not thinking.
5. **Day 3 — SEO layer:** `STRATEGY.md` plus one cluster file per silo currently in play; move raw DataForSEO exports into `research/`.
6. **Ongoing:** as older chat conversations become relevant, promote their conclusions the day they're touched — no big-bang trawl of chat history, it isn't worth the hours.

---

## 11. Risks of overcomplicating

The failure mode to fear isn't missing features — it's a system whose maintenance cost exceeds its retrieval value, which then rots, which then actively misleads agents (stale docs are worse than no docs). Concrete traps: frontmatter on every file (use it in two places only); a tag taxonomy nobody queries; handoffs for trivial sessions; duplicating the roadmap across `NOW.md`, `PROJECT.md`, and an ideas file; and adopting Obsidian plugins (dataview, templater) that make the vault non-portable and invisible to Claude Code. Every element in this design earns its place by either being auto-loaded (`CLAUDE.md`, `NOW.md`) or being findable in one grep. Anything that is neither should be deleted.

---

## 12. When a vector/semantic system becomes justified

Structured Markdown breaks down when (a) the corpus is large enough that grep returns too many hits to skim, roughly 500+ knowledge documents, *and* (b) queries stop sharing vocabulary with the documents — "what did we learn about engagement?" needing to find a note phrased entirely around "calculator interaction rates." For Statohub, that plausibly arrives only with the SaaS phase: multi-agent workflows querying accumulated user feedback, support conversations, and experiment logs. Even then, the first step is embedding search *over the same Markdown files* (e.g., a local index rebuilt by a git hook), not a new database of record. The Markdown remains the source of truth forever; anything else is just an index on top of it.

---

## 13. How Claude Code, Claude chat, and subagents access this

Claude Code: clones the repo, gets `CLAUDE.md` free, follows the router. Subagents: spawned with an explicit context pack ("read `NOW.md`, `standards/content.md`, and cluster file X; do not explore") — the router section makes those packs one-liners. Claude chat (this interface): you paste or upload the two or three relevant files per the same router logic; conclusions flow back as edits Claude Code applies. The current asymmetry — DataForSEO only via Claude Code, synthesis in chat — fits naturally: Code writes exports into `research/`, chat produces cluster files, Code commits them.

---

## 14. Minimum viable memory system — build this first

Six files, two folders, roughly one focused day:

1. `CLAUDE.md` — rules + router (Section 6 block included)
2. `docs/PROJECT.md` — wedge thesis, silos, strategy
3. `docs/DESIGN-SYSTEM.md` — extracted from the theme preview
4. `docs/status/NOW.md` — current priorities
5. `docs/decisions/README.md` + the ~5 backfilled decision files
6. `docs/standards/content.md` — article + calculator-embedding standards

Everything else in this report is an extension you add when its absence bites, not before. If after two weeks the system is saving you re-explanation and re-exploration time — it will — layer in the session-handoff ritual and the validation script next.
