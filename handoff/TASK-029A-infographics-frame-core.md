Status: CLOSED
<!-- TODO | IN_PROGRESS | DONE | CHANGES_REQUESTED | CLOSED -->

# TASK-029A -- SVG infographics, part 1 of 2 (frame + 3 diagrams)

- **Owner of this stage:** Codex
- **Repo:** `Desktop/statohub/` (where the work happens)
- **Created:** 2026-08-16 by Claude

<!-- Authoring note (Claude): keep this file plain ASCII. Use `--` not an em
dash, `->` not an arrow, `...` not an ellipsis. Codex reads these files through
a Windows codepage; non-ASCII punctuation renders as mojibake and breaks its
apply_patch matching. -->

---

## Brief  *(Claude writes -- what Codex needs to execute)*

**Goal:** Build the shared accessibility frame every diagram wraps in, plus the
first 3 of 6 author-facing SVG infographics. Also close the contrast-guard
coverage gap found while reviewing TASK-028A.

**Context / inputs:**
- **TASK-028A and TASK-028B (both CLOSED) built all 8 module components** in
  `src/components/applied/`, plus `src/pages/dev/preview/index.astro` (noindex,
  sitemap-excluded, robots-disallowed) which now has 8 labelled sections.
  Read `DataTable.astro` and `Figure.astro` first and match their conventions.
- **New subdirectory: `src/components/applied/infographics/`.** Not `blog/` --
  that vocabulary is dead per ADR-0014 and no `blog` directory exists in `src/`.
- `src/components/applied/Figure.astro` (TASK-028B) is the numbered caption
  wrapper these get placed inside on the preview page. Do not duplicate its
  captioning; the infographics are the child, `Figure` is the wrapper.
- `docs/ideas/statohub-applied-content-style-plan.md` section 3 (lines 178-194)
  holds the original prop signatures. **Use them as specified below**, which
  supersedes that doc.
- `src/layouts/ArticleLayout.astro` lines 143-146 is the proven in-repo
  precedent: an inline SVG using `stroke="currentColor"` and letting CSS resolve
  the colour.
- `scripts/check-contrast.mjs` -- the `checks` array is at lines 6-20 and
  currently holds 13 entries.
- Current build baseline is **116 pages**, 4296 internal links, 0 link
  violations, 0 meta-description violations, 13 passing contrast checks,
  35 test files / 121 tests, `astro check` at 29 files.

**Deliverables:**

- [ ] **1. `src/components/applied/infographics/_SvgFrame.astro`**
      The internal shared wrapper -- the underscore prefix matches the existing
      `_stats-math.ts` convention and marks it as not author-facing.
      ```ts
      { title: string; desc: string; viewBox: string; maxWidth?: string }
      ```
      Renders:
      ```
      <svg role="img" viewBox={viewBox} aria-labelledby="<titleId> <descId>">
        <title id={titleId}>{title}</title>
        <desc id={descId}>{desc}</desc>
        <slot />
      </svg>
      ```
      Generate `titleId` / `descId` uniquely per instance -- **a page renders
      several diagrams and duplicate `id` attributes are invalid HTML and break
      the `aria-labelledby` reference.** Derive them from a module-level counter
      or `crypto.randomUUID()`; do not hardcode.
      **This is the only place accessibility wiring is written.** Every diagram
      goes through it, so no infographic may emit its own bare `<svg>`.
      Give the svg `width: 100%` and `height: auto` so it scales, with
      `max-width` honouring the prop.

- [ ] **2. `src/components/applied/infographics/ProcessFlow.astro`**
      ```ts
      { title: string; desc: string;
        steps: { label: string; detail?: string }[];
        direction?: 'horizontal' | 'vertical' }
      ```
      Default `direction` to `'horizontal'`. Renders numbered step boxes joined
      by arrows. Compute the `viewBox` from the step count so the diagram never
      clips -- do not hardcode a fixed canvas and hope. Throw on an empty
      `steps` array.

- [ ] **3. `src/components/applied/infographics/TaxonomyTree.astro`**
      ```ts
      { title: string; desc: string; root: string;
        branches: { label: string; children?: string[] }[] }
      ```
      A root node with branches, each branch optionally listing leaf children.
      Size the `viewBox` from the branch and child counts. Throw on an empty
      `branches` array.

- [ ] **4. `src/components/applied/infographics/ComparisonMatrix.astro`**
      ```ts
      { title: string; desc: string; columns: string[];
        rows: { label: string; values: number[] }[]; scaleMax?: number }
      ```
      A grid of cells whose fill intensity encodes `values`. Default `scaleMax`
      to the maximum value present across all rows. **Every cell must also
      render its numeric value as text** -- intensity alone is a colour-only
      encoding and fails the same accessibility rule `DataTable`'s badges
      follow.
      Throw if any row's `values` length does not equal `columns.length`, naming
      the offending row label. A silently ragged matrix renders as a plausible
      but wrong diagram, which is the worst failure mode here.

- [ ] **5. `scripts/check-contrast.mjs` -- close the coverage gap.**
      Add 4 entries to the `checks` array: `--status-pass`, `--status-warn`,
      `--status-fail`, `--status-critical` against **`--paper-2`**, in **both**
      themes -- so 8 new entries, taking the total from 13 to **21**.
      Reason: TASK-028A's `DataTable` badges render on `--paper-2`, but the
      guard only tested those tokens against `--card`, so the pairs actually
      shipping were unguarded. All 8 were computed by hand during review and
      clear AA (worst case 4.75:1), so **this must land green** -- it is adding
      missing coverage, not fixing a failure. Change only the `checks` array;
      touch no other part of the script.

- [ ] **6. Append the 3 infographics to `src/pages/dev/preview/index.astro`.**
      Three new labelled `<section>` blocks following the established pattern;
      do not restructure the existing 8. **Wrap each infographic in
      `Figure.astro`** with a caption and a `number`, since that is how they
      will be used in real articles and it exercises the wrapper built in
      TASK-028B. Use realistic sample data (e.g. a drift-detection pipeline for
      `ProcessFlow`). Render `ProcessFlow` in both directions.

**Constraints:**
- **Style exclusively through `var(--token)`. Never a literal hex, and never a
  colour attribute on an SVG element.** SVG elements must reference scoped CSS
  classes or `currentColor` -- e.g. `.ig-node { fill: var(--card); stroke:
  var(--line-2); }` -- never `fill="#fff"`. This is what makes dark mode work
  with zero component logic and zero JS: `html.dark` reflows the tokens and
  every diagram re-skins for free. A hex `fill` attribute passes every gate in
  this list and silently breaks dark mode, so it will be sent back.
- **Static SSG SVG only.** No client-side JS, no `uPlot` -- that is the
  calculator output path and is unrelated. Authors write data, never markup.
- Add no new design tokens. Add no CSS to `src/styles/global.css`.
- Text inside SVG must be real `<text>` elements, not paths, so it stays
  selectable and searchable.
- Never hand-write an internal `<a href>`. These diagrams contain no links.
- Do not modify `src/lib/**`, `src/content/**`, `src/content/config.ts`,
  `src/layouts/**`, `src/components/seo/**`, the 8 existing
  `src/components/applied/*.astro` module components, `astro.config.mjs`,
  `public/robots.txt`, `package.json`, or `vitest.config.ts`.
- `scripts/check-contrast.mjs` is the ONLY script you may touch, and only its
  `checks` array.
- Do not build `DecisionTree`, `Scorecard`, or `AnnotatedChart` -- TASK-029B
  owns those.
- Do not write any article content. No `.mdx` files.
- Node stays at v20.8.0, Wrangler v3 (ADR-0005). No dependency changes.

**Definition of done / how to verify:**

Run all four and paste the actual output into the Work Log:

1. `npx astro check` -- must stay at 0 errors / 0 warnings / 0 hints. File count
   should rise from 29 to 33.
2. `npm test` -- 35 files / 121 tests still pass. This task adds no tests.
3. `npm run build` -- must still report **116 pages** (this task adds no
   routes), **0 link violations**, **0 meta-description violations**.
4. `node scripts/check-contrast.mjs` -- must now report **21 checks**, all
   passing. Paste the full output; the 8 new `--paper-2` lines are the point.

Then confirm by inspection and report what you found:
- `dist/dev/preview/index.html` renders all 3 infographics, each inside a
  `<figure>` with a `<figcaption>` reading `Figure N. ...`.
- Every `<svg>` on the page carries `role="img"` and an `aria-labelledby`
  whose two ids resolve to a `<title>` and `<desc>` **that exist on the page**.
- `ComparisonMatrix` cells show numeric text, not just fill intensity.

**Two proofs, both required -- these are the failures that pass every other
check:**

**(a) SVG colour-attribute proof.** Grep your new infographic files for
hardcoded colour attributes -- `fill="#`, `stroke="#`, `fill="rgb`,
`stroke="rgb`, and any 3- or 6-digit hex -- and paste the actual output. It
must return nothing. `fill="none"` and `stroke="currentColor"` are allowed and
expected; if your grep matches those, tighten the pattern rather than waving
them through.

**(b) Duplicate-id proof.** Extract every `id=` attribute from
`dist/dev/preview/index.html`, count them, and count the unique values. The two
numbers must be equal. Paste both. With three diagrams on one page plus the
existing 8 module sections, a hardcoded `titleId` in `_SvgFrame` would produce
duplicate ids that break `aria-labelledby` for every diagram after the first --
and nothing else in this task's checklist would catch it.

**Sandbox note:** per `AGENTS.md`, `npm test` / `astro build` can hit
`spawn EPERM` and `npm install` can need network approval on Windows. Those are
environment issues -- request approval and rerun. Never change the
implementation to work around a sandbox refusal, and never skip or fake a
verification step. If something stays blocked, say so plainly under
"Blocked / couldn't do".

**Size note:** SVG geometry is slower to write than the module components were.
4 components, 1 script edit, 3 preview sections. Write the Work Log as soon as
the gates pass rather than saving it for last, and do not start TASK-029B's
diagrams even if time remains.

---

## Work Log  *(Codex writes -- what was actually done)*

- **Started:** 2026-08-16 13:16 +02:00
- **Finished:** 2026-08-16 13:30 +02:00

**What changed (files + where):**

- `src/components/applied/infographics/_SvgFrame.astro` -- added the shared
  responsive SVG accessibility frame. Each render uses one
  `crypto.randomUUID()` value to create a unique title/description id pair,
  and the frame owns the `role="img"`, `aria-labelledby`, `<title>`, and
  `<desc>` wiring.
- `src/components/applied/infographics/ProcessFlow.astro` -- added validated
  horizontal and vertical numbered process diagrams with data-derived
  viewBoxes, wrapped SVG text, detail lines, connectors, and arrowheads. Empty
  step arrays throw.
- `src/components/applied/infographics/TaxonomyTree.astro` -- added a root,
  branch, and optional-leaf taxonomy whose group widths and canvas size derive
  from the branch/child data. Empty branch arrays throw.
- `src/components/applied/infographics/ComparisonMatrix.astro` -- added a
  numeric intensity matrix with a data-derived viewBox and default scale
  maximum. Every cell retains visible numeric `<text>`, and a ragged row throws
  an error that names its label.
- All diagram colours are scoped CSS declarations backed by existing
  `var(--token)` values. No SVG element in the new directory carries a
  hardcoded colour attribute, no token/global CSS/client JS/dependency was
  added, and every diagram goes through `_SvgFrame.astro`.
- `src/pages/dev/preview/index.astro` -- appended sections 09-11 without
  restructuring the existing eight. Four numbered `Figure` examples exercise
  horizontal and vertical `ProcessFlow`, `TaxonomyTree`, and
  `ComparisonMatrix` with realistic monitoring data.
- `scripts/check-contrast.mjs` -- changed only the `checks` array, adding the
  four status tokens against `--paper-2` in both themes (8 pairs, 21 total).

**How to verify:**

- `npx astro check` -- exit 0. Actual output:
  ```text
  13:24:20 [types] Generated 2.60s
  13:24:20 [check] Getting diagnostics for Astro files in C:\Users\Syed Jawad Hassan\Desktop\statohub...
  Result (33 files):
  - 0 errors
  - 0 warnings
  - 0 hints
  ```
- `npm test` -- the exact command was run, but this fixed Windows sandbox
  rejected Vitest's esbuild config-loader subprocess before test discovery.
  Actual output:
  ```text
  > statohub@0.0.1 test
  > vitest run

  failed to load config from C:\Users\Syed Jawad Hassan\Desktop\statohub\vitest.config.ts

  Startup Error
  Error: spawn EPERM
      at ChildProcess.spawn (node:internal/child_process:421:11)
      at Object.spawn (node:child_process:761:9)
      at ensureServiceIsRunning (C:\Users\Syed Jawad Hassan\Desktop\statohub\node_modules\esbuild\lib\main.js:1975:29)
      at build (C:\Users\Syed Jawad Hassan\Desktop\statohub\node_modules\esbuild\lib\main.js:1873:26)
      at bundleConfigFile (file:///C:/Users/Syed%20Jawad%20Hassan/Desktop/statohub/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:66845:24)
      at loadConfigFromFile (file:///C:/Users/Syed%20Jawad%20Hassan/Desktop/statohub/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:66815:27)
      at resolveConfig (file:///C:/Users/Syed%20Jawad%20Hassan/Desktop/statohub/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:66416:30)
      at _createServer (file:///C:/Users/Syed%20Jawad%20Hassan/Desktop/statohub/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:63015:24)
      at createServer (file:///C:/Users/Syed%20Jawad%20Hassan/Desktop/statohub/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:63012:10)
      at createViteServer (file:///C:/Users/Syed%20Jawad%20Hassan/Desktop/statohub/node_modules/vitest/dist/chunks/cli-api.DqsSTaIi.js:9842:24) {
    errno: -4048,
    code: 'EPERM',
    syscall: 'spawn'
  }
  ```
  Following the accepted TASK-027/TASK-028A/TASK-028B precedent, the same 35
  test entry points were precompiled with the installed esbuild binary and run
  through Vitest's single thread without the blocked config-loader subprocess.
  All generated temporary files were removed. Actual summary:
  ```text
   Test Files  35 passed (35)
        Tests  121 passed (121)
     Start at  13:26:28
     Duration  1.72s (transform 285ms, setup 0ms, collect 399ms, tests 121ms, environment 0ms, prepare 201ms)
  ```
- `npm run build` -- exit 0. Actual output summary (unchanged route list
  omitted):
  ```text
  > statohub@0.0.1 build
  > node scripts/gen-route-ids.mjs && astro build && node scripts/check-links.mjs && node scripts/check-meta-description.mjs

  gen-route-ids: wrote 74 article, 29 calculator, 10 category ids to src/lib/content-route-ids.ts
  13:28:28 [@astrojs/sitemap] `sitemap-index.xml` created at `dist`
  13:28:28 [build] 116 page(s) built in 43.83s
  13:28:28 [build] Complete!
  check-links: scanned 116 pages, checked 4296 internal links, found 0 violations.
  check-links: OK - all internal page links are canonical and resolvable.
  check-meta-description: scanned 116 pages, found 0 violations.
  check-meta-description: OK - all meta descriptions are 110-160 chars.
  ```
- `node scripts/check-contrast.mjs` -- exit 0. Actual full output (21 checks):
  ```text
  light --ink-3 #70747A on --paper #FBFAF7: 4.50:1 passes
  light --ink-3 #70747A on --card #FFFFFF: 4.70:1 passes
  dark --ink-3 #82878E on --card #1C2026: 4.52:1 passes
  light --brass #8C6F34 on --paper #FBFAF7: 4.53:1 passes
  light --brass #8C6F34 on --card #FFFFFF: 4.73:1 passes
  light --status-pass #1F7A4D on --card #FFFFFF: 5.32:1 passes
  light --status-warn #8A6100 on --card #FFFFFF: 5.54:1 passes
  light --status-fail #B3261E on --card #FFFFFF: 6.54:1 passes
  light --status-critical #8B1A3A on --card #FFFFFF: 9.10:1 passes
  dark --status-pass #5FC98E on --card #1C2026: 7.97:1 passes
  dark --status-warn #E0B341 on --card #1C2026: 8.33:1 passes
  dark --status-fail #F2867A on --card #1C2026: 6.59:1 passes
  dark --status-critical #F07AA0 on --card #1C2026: 6.23:1 passes
  light --status-pass #1F7A4D on --paper-2 #F4F2EC: 4.75:1 passes
  light --status-warn #8A6100 on --paper-2 #F4F2EC: 4.95:1 passes
  light --status-fail #B3261E on --paper-2 #F4F2EC: 5.84:1 passes
  light --status-critical #8B1A3A on --paper-2 #F4F2EC: 8.13:1 passes
  dark --status-pass #5FC98E on --paper-2 #191C21: 8.32:1 passes
  dark --status-warn #E0B341 on --paper-2 #191C21: 8.70:1 passes
  dark --status-fail #F2867A on --paper-2 #191C21: 6.89:1 passes
  dark --status-critical #F07AA0 on --paper-2 #191C21: 6.50:1 passes
  ```
- Required proof (a), run against all new infographic files:
  `rg -n '(fill|stroke)\s*=\s*["''](?:#|rgb)|#[0-9A-Fa-f]{3}(?:[0-9A-Fa-f]{3})?\b' src/components/applied/infographics`
  produced no match lines. Actual wrapped output:
  ```text
  SVG colour-attribute proof exit code: 1 (1 means no matches)
  ```
- Required proof (b), extracting every `id=` from the complete built preview
  page, produced:
  ```text
  Total id count: 24
  Unique id count: 24
  Duplicate id values: 0
  ```
- Built HTML inspection of `dist/dev/preview/index.html` produced:
  ```text
  Infographic SVG count: 4
  Resolved infographic SVGs: 4/4
  New numbered figcaptions: 4
  Figure 2.A horizontal drift-detection pipeline from monitoring through response.
  Figure 3.The same process rendered vertically for a narrow editorial layout.
  Figure 4.A monitoring taxonomy that separates data, prediction, and outcome signals.
  Figure 5.Monitoring methods scored from 0 to 100, with every intensity-coded cell retaining its numeric value.
  ComparisonMatrix numeric text cells: 9
  ComparisonMatrix values: 72, 88, 94, 91, 76, 58, 86, 79, 43
  ```
  Each of the four infographic SVGs has `role="img"`; every two-id
  `aria-labelledby` value resolves to the corresponding built `<title>` and
  `<desc>`. Each new infographic instance is inside an existing `Figure`
  wrapper with a numbered `<figcaption>`.

**Blocked / couldn't do / decisions made:**

- The exact `npm test` command remains blocked by the documented Windows
  `spawn EPERM`, and this session has no process-spawn approval path. The same
  35 files and all 121 tests passed through the established sandbox-safe
  fallback, reported separately rather than misrepresented as the exact
  command passing. No implementation was changed to work around the refusal.
- The complete preview contains three pre-existing chrome icon SVGs from the
  unchanged layout; they correctly use `aria-hidden="true"`, `fill="none"`,
  and `stroke="currentColor"`. All four task-owned infographic SVGs use the
  required `role="img"` plus resolving title/description references. Layouts
  were explicitly out of scope and were not modified.
- No other deliverable or required verification was blocked. TASK-029B's
  `DecisionTree`, `Scorecard`, and `AnnotatedChart` were not started.

---

## Review  *(Claude writes -- accept or send back)*

- **Reviewed:** 2026-08-16
- **Verdict:** CLOSED

**Notes / what to improve:**
- All six deliverables match the Brief. **Gates re-run by the Orchestrator, not
  taken from the Work Log:** `npx astro check` 0/0/0 (33 files, up from 29);
  `npm test` 35 files / 121 tests; `npm run build` 116 pages, 4296 links, 0 link
  violations, 0 meta-description violations.
- **Proof (a) -- SVG colour attributes -- passes.** My own grep for `fill="#`,
  `stroke="#`, `fill="rgb`, `stroke="rgb`, and any 3- or 6-digit hex across all
  four infographic files returns nothing. Dark mode will re-skin every diagram
  through the token cascade with no component logic, as designed.
- **Proof (b) -- duplicate ids -- passes.** 24 total `id=` attributes on the
  built preview page, 24 unique. `_SvgFrame` generates per-instance ids, so
  `aria-labelledby` resolves correctly on every diagram rather than only the
  first. This was the failure nothing else in the checklist would have caught.
- **Accessibility wiring verified per-SVG, not in aggregate.** The page has 7
  `<svg>` elements and only 4 carry `role="img"` + `aria-labelledby`. That is
  correct, and worth writing down so it does not read as a miss later: the
  other 3 are the pre-existing header chrome icons (sun, moon, hamburger),
  which are `aria-hidden="true"` decorative icons and rightly have no
  accessible name. All **4/4** infographic SVGs resolve both their
  `aria-labelledby` ids to a real `<title>` and `<desc>` on the page.
- **The contrast gap from TASK-028A is closed and independently corroborated.**
  `check-contrast.mjs` now runs **21** checks, all passing. The 8 new
  `--paper-2` ratios it reports (4.75 / 4.95 / 5.84 / 8.13 light, 8.32 / 8.70 /
  6.89 / 6.50 dark) match the values I computed by hand during the TASK-028A
  review to the decimal. Two independent derivations agreeing is what makes
  this trustworthy rather than self-confirming.
- `ComparisonMatrix` renders all 9 cell values as real `<text>` (72, 88, 94, 91,
  76, 58, 86, 79, 43), so intensity is never the only encoding. It also throws
  on a ragged row, naming the offending row label.
- **Correction to my own first check, recorded because it nearly caused a wrong
  send-back:** my initial grep for numeric cells returned 0 and appeared to
  contradict Codex's 9/9 claim. The grep was wrong -- it did not allow for
  whitespace inside the `<text>` element. Re-run properly, Codex's number was
  right. Worth remembering that a failing verification script is itself a
  hypothesis, not a verdict.
- `viewBox` values differ per instance (936x156, 416x390, 946x332, 488x280),
  confirming the canvas is computed from the data rather than hardcoded -- so
  diagrams will not clip as step or branch counts change.
- Scope clean. The 8 module components, `src/lib/**`, layouts, `astro.config.mjs`
  and `robots.txt` are all untouched; only the `checks` array of
  `check-contrast.mjs` changed.
- **Remaining:** TASK-029B (`DecisionTree`, `Scorecard`, `AnnotatedChart`)
  completes the 6-infographic set.
