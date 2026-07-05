# Statohub Action Plan
*July 2026 — supersedes the roadmap sections of the strategy review. Quizzes are dropped by decision; guided no-code projects are the first product expansion. Work top to bottom; nothing in a later phase starts before the earlier phase is done.*

---

## Phase A — Audit Fixes (this week, ~3 short Claude Code sessions)

### Session A1 — Trivial-fix batch (~30 min)
Tell Claude Code:
> Fix the following from docs/audit/2026-07-workspace-audit.md, nothing else:
> 1. `src/styles/global.css:1791` — the `.article-body h2::before` rule renders a broken � glyph on every article H2. Remove the pseudo-element (or replace with a clean intentional glyph).
> 2. `astro.config.mjs:5` — delete the dead `normal-distribution` noindex entry (the set is unused).
> 3. In `global.css`, resolve the duplicate `.section-head` (lines ~825 and ~1431) and `.article-standfirst` (~1069 and ~1714) definitions — keep the generation `ArticleLayout.astro` actually uses, delete the other, and while there delete the superseded TOC/article-shell class generation if confirmed unreferenced.
> Run the full build + tests before committing.

**Done when:** build green, no � on any article, one definition per class.

### Session A2 — Contrast fix + CI guard (~45 min)
Tell Claude Code:
> Per the audit: `--ink-3` fails WCAG AA in both themes (light 3.24:1, dark 3.84:1) and `--brass` on light paper is 3.76:1. Adjust these tokens in `src/styles/global.css` to reach ≥4.5:1 against their actual backgrounds while staying as close as possible to the current look (check docs/DESIGN-SYSTEM.md if present). Then add an automated contrast check on the token pairs to CI so this can't regress.

**Done when:** all text tokens pass AA, CI fails if a future token change breaks it. Eyeball both themes after — if the adjusted shades feel off, iterate on the values, not the check.

### Session A3 — Calculator canonical regression suite (~half day)
This is the P0 from the strategy review; the audit confirmed current tests are happy-path only.
Tell Claude Code:
> Create a canonical-value regression suite layered on the existing 89 tests. For each of the 26 engines in `src/calc/`, add a test-data file of input→output pairs verified against an external authority (R, scipy, or a standard textbook table — record the source of each expected value in a comment). Cover: typical case, edge case (n=1 or 2, ties, zeros), and one larger realistic dataset per engine. Do not modify any engine; if an engine disagrees with the canonical value, report it — do not "fix" silently.

**Done when:** every engine has sourced canonical cases; any mismatch is surfaced to you as a finding, not auto-patched. Review mismatches personally — this is the one place your own judgment is non-delegable.

### Session A4 — Combinatorics decision (5 minutes, yours)
The combinatorics hub is live and indexable with 0 articles. Pick one now:
- **Option 1 (recommended):** queue 2–3 combinatorics articles at the front of the publishing schedule (the silo already has 2 calculators waiting to be wedged).
- **Option 2:** noindex the hub until articles exist.
Leaving it as-is is the only wrong choice.

---

## Phase B — Memory Optimization (one focused session, after Phase A)

The audit changed this task: your `CLAUDE.md` already contains the knowledge — as a long append-only session log. This is a **migration**, not a creation. Give the session the memory-system report + the audit report, then:

Tell Claude Code:
> Restructure project memory per docs/statohub-memory-system.md, migrating — not rewriting — existing content:
> 1. Split the current CLAUDE.md: extract permanent rules + a "what to read before which task" router into a new CLAUDE.md under 150 lines; move all dated session entries into `docs/status/sessions/` as archive files.
> 2. Extract the decisions embedded in the old log into `docs/decisions/` ADR files with an index (at minimum: wedge model, flat URLs, no course scaffolding, silo boundaries, and any decisions recorded in the log I've missed — list candidates for my approval before writing them).
> 3. Create `docs/status/NOW.md` from the most recent log entries.
> 4. Create `docs/REPO-MAP.md` (annotated tree, ~60 lines) and a script to regenerate it.
> 5. Point `AGENTS.md` at the same docs so Codex and Claude Code share one source of truth.
> 6. Update the two existing subagents (`.claude/agents/stats-article-writer.md`, `stats-article-reviewer.md`) to read their context from the new docs paths instead of duplicating instructions.
> Show me the new CLAUDE.md and the ADR list before committing.

**Done when:** a fresh Claude Code session can start any task reading only CLAUDE.md + NOW.md + one or two routed docs — test this literally by opening a new session and asking it to summarize current state.

---

## Phase C — Content Publishing (ongoing, resumes immediately after B)

No new systems here — your pipeline (writer + reviewer agents, write-article skill, scheduled routines) already works. Just direction:

1. **Silo depth targets** (from real audit counts): combinatorics 0→3 first if Option 1 chosen; then lift probability-distributions (4), inferential-statistics (2), and foundations (2) toward ~6–8 articles each before deepening descriptive-statistics (already 10) further. Regression-correlation (3) fills in behind.
2. **Every article wedges a calculator** where one exists in the silo — combinatorics and inferential have calculators outnumbering articles, which is backwards; the articles are the missing half of the wedge there.
3. **Weekly 10-minute check:** articles shipped vs. plan, link gate still green, nothing stuck.

Run this for the "few days" you mentioned — realistically 2–3 weeks — before starting Phase D, so projects launch into silos with real depth.

---

## Phase D — Guided No-Code Statistics Projects (first product expansion)

### D1 — Design before build (one chat session, with me)
Decide together, recorded as a short ADR each:
- **Schema:** the 12-part structure (problem → dataset → objectives → concepts → steps → hints → solution → interpretation → common mistakes → extensions → assessment → completion criteria) as a new Zod content collection, consistent with how articles/calculators are modeled.
- **URL + IA:** `/projects/` hub + `/projects/{slug}`, added to nav parallel to Calculators.
- **Format details:** hints and solutions as click-to-reveal (no JS framework needed — `<details>` works statically); each project ships a small CSV dataset from the repo; each embeds the relevant calculator via the existing `StatCalc` embed variant — the wedge, applied to projects.

### D2 — First batch (Claude Code)
Build the collection schema, `ProjectLayout.astro` (component-scoped styles per the audit's CSS guidance — don't grow global.css), the hub page, and **3 launch projects**, no-code only, each anchored to a deep silo, e.g.:
1. *Analyze a class survey* — mean/median/mode/spread with the descriptive calculators (descriptive-statistics)
2. *Is this die fair?* — proportions and expected counts (probability-distributions)
3. *Do these two groups differ?* — a guided t-test walk-through with the t-test calculator (inferential-statistics)

Every dataset hand-checked, every solution verified against your own calculators (which, post-A3, are canonically validated — the sequencing is deliberate).

### D3 — Validate before scaling
Ship 3, watch GSC for 4–6 weeks (queries like "statistics project ideas," "[topic] project for beginners"), watch dataset downloads and time-on-page. Impressions trending + engagement real → scale to 2–3 projects per silo through the writer pipeline. Flat → diagnose with me before producing more.

---

## Parked (decided, not forgotten)
- **Quizzes:** dropped by your decision. If you ever revisit, the static design in the strategy review still applies.
- **Embeddable-calculator program:** the audit found the embed variant already exists — the remaining work (public embed route + copy-paste snippet + attribution link) is small and high-value. Natural slot: right after D2, as a one-session task. Flagged here so it isn't lost.
- **Accounts, backend, community, games:** all "no" per the strategy review; ADRs with trigger conditions get written during Phase B step 2.

## The whole plan in one line each
A: fix the visible bug, the contrast, the dead config → canonical calculator tests → combinatorics call.
B: turn the CLAUDE.md log into structured memory (migrate, don't rewrite).
C: publish, prioritizing thin silos, calculators wedged into every article.
D: design projects with me → ship 3 → measure → scale.
