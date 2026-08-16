Status: CLOSED
<!-- TODO | IN_PROGRESS | DONE | CHANGES_REQUESTED | CLOSED -->

# TASK-029B -- SVG infographics, part 2 of 2 (3 diagrams)

- **Owner of this stage:** Codex
- **Repo:** `Desktop/statohub/` (where the work happens)
- **Created:** 2026-08-16 by Claude

<!-- Authoring note (Claude): keep this file plain ASCII. Use `--` not an em
dash, `->` not an arrow, `...` not an ellipsis. Codex reads these files through
a Windows codepage; non-ASCII punctuation renders as mojibake and breaks its
apply_patch matching. -->

---

## Brief  *(Claude writes -- what Codex needs to execute)*

**Goal:** Build the last 3 of 6 author-facing SVG infographics, completing the
Applied Statistics component system.

**Context / inputs:**
- **TASK-029A (CLOSED) built** `src/components/applied/infographics/` with
  `_SvgFrame.astro`, `ProcessFlow.astro`, `TaxonomyTree.astro`, and
  `ComparisonMatrix.astro`. **Read `_SvgFrame.astro` and `ComparisonMatrix.astro`
  first** -- they establish the per-instance unique-id mechanism, the scoped
  token-only CSS class idiom, and the computed-`viewBox` approach. Follow them
  exactly rather than inventing a parallel style.
- **Every diagram must render through `_SvgFrame.astro`.** No infographic may
  emit its own bare `<svg>` -- that wrapper is the single place accessibility
  wiring lives, and bypassing it is the one structural mistake available here.
- TASK-028B's `src/components/applied/Figure.astro` is the numbered caption
  wrapper these get placed inside on the preview page.
- `docs/ideas/statohub-applied-content-style-plan.md` section 3 (lines 178-194)
  holds the original prop signatures; the versions below supersede it.
- `src/styles/global.css` -- the four `--status-*` tokens exist in both themes
  and `Scorecard` is their second consumer after `DataTable`.
- Current build baseline is **116 pages**, 4296 internal links, 0 link
  violations, 0 meta-description violations, **21** passing contrast checks,
  35 test files / 121 tests, `astro check` at 33 files.

**Deliverables:**

- [ ] **1. `src/components/applied/infographics/DecisionTree.astro`**
      ```ts
      type DecisionNode = { label: string; yes?: DecisionNode; no?: DecisionNode };
      { title: string; desc: string; root: DecisionNode; maxDepth?: number }
      ```
      A branching yes/no decision diagram. Default `maxDepth` to `3`.
      **Nodes deeper than `maxDepth` are not rendered** -- truncate the branch
      rather than throwing, since a deep tree is a legitimate authoring choice
      that simply should not blow up the canvas. Label the yes/no edges.
      Compute the `viewBox` from the actual rendered depth and breadth, not from
      `maxDepth`, so a shallow tree does not get a canvas full of empty space.

- [ ] **2. `src/components/applied/infographics/Scorecard.astro`**
      ```ts
      { title: string; desc: string;
        metrics: { label: string; value: number; max: number;
                   threshold?: number; status: 'pass'|'warn'|'fail'|'critical';
                   unit?: string }[] }
      ```
      A horizontal bar per metric, filled to `value / max`, coloured by
      `status` through the `--status-*` tokens. When `threshold` is given, draw
      a marker line at `threshold / max`.
      **Every bar must render its value as `<text>`** (with `unit` appended when
      present) and its status must be conveyed by more than colour -- render the
      status word as text too. This is the same colour-only-encoding rule
      `DataTable` badges and `ComparisonMatrix` cells follow.
      Throw on an empty `metrics` array, and throw if any `max` is `0` (it would
      divide by zero and render a silently broken bar).

- [ ] **3. `src/components/applied/infographics/AnnotatedChart.astro`**
      ```ts
      { title: string; desc: string; type?: 'bar' | 'line';
        points: { label: string; value: number; annotation?: string }[];
        xLabel?: string; yLabel?: string }
      ```
      Default `type` to `'bar'`. Renders a simple axis-labelled chart with
      optional per-point annotations (a small marker plus annotation text).
      Handle negative values correctly, or -- if you choose not to support them
      -- throw with a clear message rather than rendering a bar growing the
      wrong way. State which you chose in the Work Log.
      Throw on an empty `points` array.
      **This is static SSG SVG, not `uPlot`.** The uPlot path is the interactive
      calculator-output renderer and is unrelated; do not import it.

- [ ] **4. Append the 3 infographics to `src/pages/dev/preview/index.astro`.**
      Three new labelled `<section>` blocks following the established pattern;
      do not restructure the existing ones. Wrap each in `Figure.astro` with a
      caption and a `number`, continuing the existing figure numbering.
      Use realistic sample data. Render `AnnotatedChart` in **both** `bar` and
      `line` modes, and give `Scorecard` at least one metric of each of the four
      statuses so all four tokens are exercised on one page.

**Constraints:**
- **Style exclusively through `var(--token)`. Never a literal hex, and never a
  colour attribute on an SVG element** (`fill="#..."`, `stroke="#..."`).
  Use scoped CSS classes referencing tokens, or `currentColor`. TASK-029A
  passed this cleanly across 4 files; keep the streak. A hex fill silently
  breaks dark mode while passing every gate in this list.
- **No client-side JS.** No `uPlot`, no hydration, no `<script>`.
- Add no new design tokens. Add no CSS to `src/styles/global.css`.
- Text inside SVG must be real `<text>` elements, not paths.
- Do not modify `_SvgFrame.astro` or the three TASK-029A infographics. If you
  genuinely need a change in `_SvgFrame` to build these, stop and say so under
  "Blocked / couldn't do" rather than editing it -- that would retroactively
  affect three already-reviewed diagrams.
- Do not modify `src/lib/**`, `src/content/**`, `src/content/config.ts`,
  `src/layouts/**`, `src/components/seo/**`, the 8 module components,
  `astro.config.mjs`, `public/robots.txt`, `scripts/**`, `package.json`, or
  `vitest.config.ts`.
- Do not write any article content. No `.mdx` files.
- Node stays at v20.8.0, Wrangler v3 (ADR-0005). No dependency changes.

**Definition of done / how to verify:**

Run all four and paste the actual output into the Work Log:

1. `npx astro check` -- must stay at 0 errors / 0 warnings / 0 hints. File count
   should rise from 33 to 36.
2. `npm test` -- 35 files / 121 tests still pass. This task adds no tests.
3. `npm run build` -- must still report **116 pages**, **0 link violations**,
   **0 meta-description violations**.
4. `node scripts/check-contrast.mjs` -- must stay at **21 checks**, all passing.
   You are adding no colours, so this is a regression check.

Then confirm by inspection and report what you found:
- `dist/dev/preview/index.html` renders all 3 new infographics, each inside a
  `<figure>` with a `Figure N.` caption.
- `Scorecard` shows all four status tones on one page, each with its status
  word rendered as text, not colour alone.
- `AnnotatedChart` appears twice, once as bars and once as a line.

**The three proofs, all required:**

**(a) SVG colour-attribute proof.** Grep the three new files for `fill="#`,
`stroke="#`, `fill="rgb`, `stroke="rgb`, and any 3- or 6-digit hex. Must return
nothing. `fill="none"` / `stroke="currentColor"` are allowed.

**(b) Duplicate-id proof.** Extract every `id=` from
`dist/dev/preview/index.html`, count total vs unique. They must be equal. The
page now carries **7** diagrams, so this is a stronger test of `_SvgFrame`'s
per-instance ids than TASK-029A's 4 were -- it is the reason this proof is
repeated rather than assumed settled.

**(c) Frame-usage proof.** Confirm every `<svg class="svg-frame">` on the page
carries `role="img"` and an `aria-labelledby` whose ids resolve to a real
`<title>` and `<desc>`. Expect **7** such SVGs. Note for your own sanity: the
page also contains 3 *other* `<svg>` elements -- the header's sun, moon, and
hamburger icons -- which are correctly `aria-hidden="true"` decorative icons
with no accessible name. Do not "fix" them; they are not yours and they are
already right.

**Sandbox note:** per `AGENTS.md`, `npm test` / `astro build` can hit
`spawn EPERM` and `npm install` can need network approval on Windows. Those are
environment issues -- request approval and rerun. Never change the
implementation to work around a sandbox refusal, and never skip or fake a
verification step. If something stays blocked, say so plainly under
"Blocked / couldn't do".

**Size note:** 3 diagrams and 3 preview sections, against a 900s ceiling.
`DecisionTree` is the most geometry-heavy of the six -- keep it simple and
correct rather than elaborate. Write the Work Log as soon as the gates pass.

---

## Work Log  *(Codex writes -- what was actually done)*

- **Started:** 2026-08-16
- **Finished:** 2026-08-16

**Provenance note (written by Claude, not Codex).** Codex implemented all four
deliverables, but the `codex mcp-server` MCP call hit the client-side
`MCP_TOOL_TIMEOUT` (900s) before it wrote this log, updated `AGENTS.md`, or
reported any verification output. The code below is Codex's; every verification
result below was produced by the Orchestrator re-running the gates and proofs
from scratch. Nothing here is copied from a Codex claim, because Codex made
none. This is the same failure mode as TASK-026.

**What changed (files + where):**
- `src/components/applied/infographics/DecisionTree.astro` -- new. Yes/no
  branching diagram rendering through `_SvgFrame`. Truncates branches deeper
  than `maxDepth` (default 3) rather than throwing, as specified; separately
  throws if `maxDepth` is not a non-negative integer. `viewBox` computed from
  actual rendered depth and breadth.
- `src/components/applied/infographics/Scorecard.astro` -- new. Horizontal bar
  per metric, coloured via the `--status-*` tokens (their second consumer after
  `DataTable`). Throws on an empty `metrics` array and on any zero `max`.
- `src/components/applied/infographics/AnnotatedChart.astro` -- new. Bar and
  line modes with axis labels and per-point annotations. Throws on empty
  `points`.
- `src/pages/dev/preview/index.astro` -- appended three sections wrapping the
  new diagrams in `Figure.astro` as Figures 6-9 (four figures, because
  `AnnotatedChart` is rendered in both modes).
- `AGENTS.md` -- TASK-029B entry added by the Orchestrator.

**How to verify:** (all re-run by the Orchestrator)
- `npx astro check` -- **36 files**, 0 errors / 0 warnings / 0 hints. Up from
  33, i.e. the three new components are genuinely type-checked.
- `npm test` -- **35 files / 121 tests passed**, as the exact command. No test
  changes in this task.
- `npm run build` -- **116 pages**, 4296 internal links, 0 link violations,
  0 meta-description violations.
- `node scripts/check-contrast.mjs` -- **21 checks**, all passing. No colours
  added, so this is the intended regression result.
- **Proof (a), SVG colour attributes:** grep for `fill="#`, `stroke="#`,
  `fill="rgb`, `stroke="rgb`, and any 3- or 6-digit hex across all three new
  files returns nothing.
- **Proof (b), duplicate ids:** `dist/dev/preview/index.html` carries **35**
  `id=` attributes, **35** unique. Equal, so `_SvgFrame`'s per-instance ids hold
  across a page with 8 diagrams.
- **Proof (c), frame usage:** **8/8** `<svg class="svg-frame">` elements carry
  `role="img"` and an `aria-labelledby` whose ids all resolve to a real
  `<title>` and `<desc>` on the page.
- `Scorecard` renders all four tones on one page, each with both its value and
  its status word as text: `Schema validity 99 % Pass`, `Segment coverage 82 %
  Warn`, `Calibration score 61 % Fail`, `Severe error rate 18 % Critical`.
- `AnnotatedChart` renders twice: the bar instance uses `<rect>`, the line
  instance uses `<polyline>`/`<path>`.

**Blocked / couldn't do / decisions made:**
- The MCP transport timed out at 900s. The work itself was complete and
  correct; only the bookkeeping was lost.
- **Negative-value decision (recovered from the code, since Codex could not
  report it):** `AnnotatedChart` **supports** negative values rather than
  throwing. It computes a zero axis (`zeroY`), anchors bars at it, and uses
  `Math.abs(zeroY - pointY)` for height, so a negative bar grows downward
  correctly. Figure 8's sample data includes a negative correction, so the path
  is actually exercised on the preview page rather than merely implemented.

---

## Review  *(Claude writes -- accept or send back)*

- **Reviewed:** 2026-08-16
- **Verdict:** CLOSED

**Notes / what to improve:**
- All four deliverables match the Brief, verified against the diff and the
  built HTML rather than against any claim -- Codex made none. All three proofs
  pass. The 6-infographic set and the 8-module set are both complete.
- **Scope discipline held even without a report.** `_SvgFrame.astro` and the
  three TASK-029A infographics are untouched, which was the one constraint most
  likely to be quietly violated (it would have been easy to "improve" the frame
  while building on it, retroactively changing three reviewed diagrams).
  `git status` shows only the three new files plus the preview page.
- Both interesting judgement calls went the right way: `DecisionTree` truncates
  past `maxDepth` instead of throwing (a deep tree is a legitimate authoring
  choice), while `Scorecard` throws on a zero `max` (that one is a real bug that
  would render a silently broken bar). Failing loudly on nonsense and degrading
  gracefully on legitimate-but-large input is exactly the right split.
- `AnnotatedChart` handling negatives properly, rather than taking the
  brief's permitted escape hatch of throwing, is the better outcome -- and the
  sample data exercises it, so it is not untested code.
- **Correction to my own brief:** it told Codex to expect **7** framed diagrams;
  the real number is **8**. I miscounted by forgetting `AnnotatedChart` renders
  in both modes on the preview page (029A's 4 + DecisionTree + Scorecard +
  AnnotatedChart x2). The proof still did its job -- 35 ids / 35 unique across 8
  diagrams is a stronger result than the 7 I asked for. My error, not Codex's,
  and worth recording so the next brief's expected counts are derived rather
  than guessed.
- **Timeout tally across this session: 2 of 5 dispatches (TASK-028A, TASK-029B)
  hit the 900s ceiling, and in both cases the code was complete.** The pattern
  is now clear enough to state as a rule: the timeout truncates the *reply*,
  and sometimes the final bookkeeping, but it has never yet truncated the
  implementation. So the correct response to a timeout is always to diff the
  tree and run the gates, never to re-dispatch -- re-dispatching would have
  duplicated finished work twice today.
- Splitting 028 and 029 was the right call and I would keep the sizing. Both
  halves of 029 came close to the ceiling; the unsplit 6-diagram task would
  almost certainly have died mid-file, which is the one failure that *would*
  leave a broken tree.
