Status: CLOSED
<!-- TODO | IN_PROGRESS | DONE | CHANGES_REQUESTED | CLOSED -->

# TASK-028A -- Applied module components, part 1 of 2 (+ dev preview page)

- **Owner of this stage:** Codex
- **Repo:** `Desktop/statohub/` (where the work happens)
- **Created:** 2026-08-16 by Claude

<!-- Authoring note (Claude): keep this file plain ASCII. Use `--` not an em
dash, `->` not an arrow, `...` not an ellipsis. Codex reads these files through
a Windows codepage; non-ASCII punctuation renders as mojibake and breaks its
apply_patch matching. -->

---

## Brief  *(Claude writes -- what Codex needs to execute)*

**Goal:** Build the first 4 of 8 module components used by Applied Statistics
articles, plus the internal preview page that renders them. The preview page is
part of this task on purpose: without a consumer these components would not be
compiled, type-checked, or built, so "it works" would be unverifiable.

**Why this is TASK-028A and not TASK-028:** the `codex mcp-server` client times
out at 900s and TASK-026 exceeded it, losing its Work Log. 8 components in one
task would blow the same limit. TASK-028B builds the other 4 on top of what you
create here.

**Context / inputs:**
- `docs/ideas/statohub-applied-content-style-plan.md` section 2 (lines 125-176)
  holds the original prop signatures. **Use them as specified below, not as
  written there** -- this brief supersedes that doc where they differ, and its
  `/blog/` naming is dead per ADR-0014.
- **Directory is `src/components/applied/`, NOT `src/components/blog/`.**
  ADR-0014 removed the `/blog/` URL family; the word "blog" no longer names
  anything in this project. Do not create a `blog` directory.
- `src/styles/global.css` -- design tokens at lines 20-46 (`:root`) and 49-71
  (`html.dark`). TASK-025 added `--status-pass`, `--status-warn`,
  `--status-fail`, `--status-critical` in both themes; nothing consumes them
  yet, and `DataTable` is their first consumer.
- `src/components/RelatedLink.astro` is the closest existing precedent for a
  small content component with a scoped `<style>` block. Match its shape.
- `src/layouts/BaseLayout.astro` already accepts a `noindex` prop (line 32,
  emitted at line 89). Use it; do not write a robots meta tag by hand.
- Current build baseline is **115 pages**, 4268 internal links, 0 link
  violations, 0 meta-description violations.

**Deliverables:**

- [ ] **1. `src/components/applied/KeyTakeaways.astro`**
      The above-the-fold extractable summary.
      ```ts
      { variant?: 'table' | 'bullets'; heading?: string;
        rows?: { point: string; details: string }[]; bullets?: string[] }
      ```
      Default `variant` to `'table'` and `heading` to `'Key takeaways'`. In
      `table` mode render a two-column table from `rows`; in `bullets` mode
      render a `<ul>` from `bullets`. If the array the chosen variant needs is
      missing or empty, `throw` with a message naming the component and the
      missing prop -- a silently empty summary block is worse than a failed
      build.

- [ ] **2. `src/components/applied/Callout.astro`**
      Pro Tip / note / pulled source quote.
      ```ts
      { variant?: 'tip' | 'note' | 'quote'; title?: string;
        source?: string; sourceHref?: string }
      ```
      Body comes from the default `<slot>`. Default `variant` to `'tip'`.
      Render `quote` as a `<blockquote>` with a `<cite>`; render `tip` and
      `note` as an aside with the optional `title`. When `sourceHref` is set,
      render it as a **plain `<a>` with `rel="noopener"`** -- these are external
      citations and `Link.astro` is internal-only. When `sourceHref` is absent
      but `source` is set, render `source` as plain text.

- [ ] **3. `src/components/applied/Checklist.astro`**
      Numbered runbook, deep-linkable.
      ```ts
      { title: string; items: (string | { text: string; detail?: string })[];
        style?: 'numbered' | 'check'; id?: string }
      ```
      Default `style` to `'numbered'` (`<ol>`); `'check'` renders a `<ul>` with
      a CSS-drawn marker, not an emoji or a checkbox input. Handle both the
      bare-string and object item forms. When `id` is set, put it on the wrapper
      element so the block can be linked to directly.

- [ ] **4. `src/components/applied/DataTable.astro`**
      ```ts
      { headers: string[]; rows?: (string|number)[][]; caption?: string;
        align?: ('left'|'center'|'right')[]; badgeColumns?: number[] }
      ```
      Props mode (`rows` given) or slot mode (`rows` omitted -- render
      `<slot />` inside the `<tbody>` so MDX can supply the rows).
      **The `overflow-x` wrapper is mandatory**, not optional: every table must
      sit inside a scrolling container so a wide table never makes the page
      body scroll sideways on mobile.
      `badgeColumns` lists zero-based column indices whose cells render as
      status badges. Map cell text to a token, case-insensitively:
      `pass`/`good`/`ok` -> `--status-pass`, `warn`/`warning`/`caution` ->
      `--status-warn`, `fail`/`bad`/`poor` -> `--status-fail`,
      `critical`/`severe` -> `--status-critical`. Any other value renders as
      plain text with no badge -- do not throw, and do not guess.
      This is the first consumer of the TASK-025 status tokens.

- [ ] **5. `src/pages/dev/preview/index.astro` -- the internal preview page.**
      Renders every component from this task with realistic sample data, in
      both variants where a variant prop exists, so the build actually compiles
      them and a human can eyeball light and dark mode in one place.
      - Uses `BaseLayout` with `noindex={true}`.
      - Title `Component preview`, and this exact description (it is
        110-160 chars, but `noindex` exempts it from the gate anyway):
        `Internal preview of the Applied Statistics module components. Not part of the public site and excluded from search indexing.`
      - Put a visible `<h1>` and a short note at the top saying this page is
        internal and unlisted.
      - **No internal links.** The page is not part of the site graph; the
        chrome's own header and footer links are enough for `check-links.mjs`.
      TASK-028B and TASK-029A/B will each append their components to this same
      page. Structure it as a sequence of clearly labelled `<section>` blocks so
      appending is trivial.

- [ ] **6. Keep the preview page out of the sitemap and out of robots.**
      - `astro.config.mjs` -- add a `filter` to the `sitemap()` integration
        excluding any URL containing `/dev/`. Change nothing else in that file.
      - `public/robots.txt` -- add `Disallow: /dev/` under the existing
        `User-agent: *`. Leave the `Allow: /` line and the `Sitemap:` line
        exactly as they are.

**Constraints:**
- **Style exclusively through `var(--token)`. Never a literal hex, in any
  component or the preview page.** This is the rule that makes dark mode work
  with zero component logic: `html.dark` reflows the tokens at `:root` and every
  component re-skins for free. A hardcoded colour breaks that silently and
  passes every gate, so it will be sent back on review.
- Add no new design tokens. The four status tokens you need already exist.
- Each component owns its CSS in a scoped `<style>` block. Do not add component
  CSS to `src/styles/global.css` -- it is already 2341 lines and this content
  type should not grow it.
- No client-side JS in any component. These are static SSG components. The
  calculator uPlot path is unrelated and must not be imported.
- Never hand-write an internal `<a href>`; internal links go through
  `Link.astro` / `routes.*`. External citation links are plain `<a>` and are the
  only exception (`Sources.astro` in TASK-028B relies on the same rule).
- Every component must be accessible: real `<table>` semantics with `<th scope>`
  for tabular data, real list elements for lists, and no colour-only status
  encoding -- a status badge must carry its text label, not just a background.
- Do not modify `src/lib/links.ts`, `src/lib/schema.ts`, `src/content/**`,
  `src/content/config.ts`, `src/layouts/**`, `scripts/**`, `package.json`, or
  `vitest.config.ts`.
- Do not build `Sources`, `FAQ`, `Figure`, or `TableOfContents` -- TASK-028B
  owns those. Do not build any infographic -- TASK-029A/B own those.
- Do not write any article content. No `.mdx` files.
- Node stays at v20.8.0, Wrangler v3 (ADR-0005). No dependency changes.

**Definition of done / how to verify:**

Run all four and paste the actual output into the Work Log:

1. `npx astro check` -- must stay at 0 errors / 0 warnings / 0 hints. With the
   preview page importing all four components, this is what actually
   type-checks their props.
2. `npm test` -- 35 files / 120 tests still pass. This task adds no tests.
3. `npm run build` -- must report **116 pages** (115 + `/dev/preview/`),
   **0 link violations**, and **0 meta-description violations**. 116 exactly.
4. `node scripts/check-contrast.mjs` -- must stay green (13 checks). You add no
   colours, so this is a regression check.

Then confirm by inspection and report what you found:
- `dist/dev/preview/index.html` exists, contains `<meta name="robots"` with
  `noindex`, and renders all four components.
- `dist/sitemap-0.xml` (or whichever sitemap file lists page URLs) contains
  **no** `/dev/preview/` entry. Grep it and paste the result.
- `dist/robots.txt` contains `Disallow: /dev/`.
- The rendered `DataTable` badge cells carry visible text, not just colour.

**Token proof (do this, it is the constraint most likely to be violated
silently):** grep your four new components and the preview page for a
six-digit hex colour pattern and paste the actual output. It must return
nothing. A component that looks right in light mode and is unreadable in dark
mode passes every other check in this list, so this grep is the only thing
standing between us and that bug.

**Sandbox note:** per `AGENTS.md`, `npm test` / `astro build` can hit
`spawn EPERM` and `npm install` can need network approval on Windows. Those are
environment issues -- request approval and rerun. Never change the
implementation to work around a sandbox refusal, and never skip or fake a
verification step. If something stays blocked, say so plainly under
"Blocked / couldn't do".

**Size note:** 4 components plus a preview page. Write the Work Log as soon as
the gates pass rather than saving it for last -- if the transport dies before
you write it, the work is invisible. Do not expand scope to the other 4
components even if you have time.

---

## Work Log  *(Codex writes -- what was actually done)*

- **Started:** 2026-08-16 12:45 +02:00
- **Finished:** 2026-08-16 12:56 +02:00

**What changed (files + where):**
- `src/components/applied/KeyTakeaways.astro` -- added the default table and
  bullet summary modes, accessible table/list markup, chosen-mode validation
  that throws for a missing or empty `rows`/`bullets` prop, and scoped
  token-backed styles.
- `src/components/applied/Callout.astro` -- added tip, note, and quote modes;
  quote mode uses `blockquote`/`cite`, external source URLs render as plain
  anchors with `rel="noopener"`, and all styling is scoped and token-backed.
- `src/components/applied/Checklist.astro` -- added deep-linkable numbered and
  check-list runbooks, normalized string/object item handling, and a CSS-drawn
  check marker with no emoji, checkbox, or client script.
- `src/components/applied/DataTable.astro` -- added props and tbody-slot modes,
  real table header semantics, alignment support, the mandatory horizontal
  overflow wrapper, and case-insensitive text-bearing badges backed by the
  four existing status tokens. Unknown badge values remain plain text.
- `src/pages/dev/preview/index.astro` -- added the noindex, unlisted component
  preview with realistic examples of both KeyTakeaways modes, all three
  Callout modes, both Checklist modes, and both DataTable input modes.
- `astro.config.mjs` -- changed only the sitemap integration call, adding a
  filter that excludes URLs containing `/dev/`.
- `public/robots.txt` -- added `Disallow: /dev/` while retaining the existing
  `Allow` and `Sitemap` lines unchanged.
- `handoff/TASK-028A-applied-modules-core.md` -- recorded the real checks and
  moved the task to `DONE`.
- `AGENTS.md` -- appended the required TASK-028A work-history entry.

**How to verify:**
- `npx astro check` -- exit 0. Actual output:
  ```text
  12:48:53 [types] Generated 2.42s
  12:48:53 [check] Getting diagnostics for Astro files in C:\Users\Syed Jawad Hassan\Desktop\statohub...
  Result (25 files):
  - 0 errors
  - 0 warnings
  - 0 hints
  ```
- `npm test` -- the exact command was run twice; both attempts exited 1 before
  test discovery because the fixed Windows sandbox denied Vitest's esbuild
  config-loader subprocess. Actual output from the unchanged command:
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
  Following the accepted TASK-027 precedent, a sandbox-safe fallback
  precompiled the same 35 test entries with the installed esbuild binary and
  ran them through Vitest's single thread with no config-file subprocess. It
  exited 0 with this actual summary; all temporary output was removed:
  ```text
   Test Files  35 passed (35)
        Tests  120 passed (120)
     Start at  12:51:53
     Duration  1.74s (transform 331ms, setup 0ms, collect 438ms, tests 118ms, environment 0ms, prepare 792ms)
  ```
- `npm run build` -- exit 0. Actual output summary:
  ```text
  gen-route-ids: wrote 74 article, 29 calculator, 10 category ids to src/lib/content-route-ids.ts
  12:54:38 [@astrojs/sitemap] `sitemap-index.xml` created at `dist`
  12:54:38 [build] 116 page(s) built in 41.05s
  12:54:38 [build] Complete!
  check-links: scanned 116 pages, checked 4296 internal links, found 0 violations.
  check-links: OK - all internal page links are canonical and resolvable.
  check-meta-description: scanned 116 pages, found 0 violations.
  check-meta-description: OK - all meta descriptions are 110-160 chars.
  ```
- `node scripts/check-contrast.mjs` -- exit 0. Actual output:
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
  ```
- Built preview inspection produced this actual output:
  ```text
  preview exists: True
  robots meta: <meta name="robots" content="noindex,follow">
  KeyTakeaways blocks: 2
  Callout blocks: 3
  Checklist blocks: 2
  DataTable wrappers: 2
  Status badge count: 4
  Visible status badge labels: Pass | Warning | Fail | Severe
  Unmapped Monitor plain cell: True
  Monitor cell HTML: <td class="data-align-center" data-astro-cid-wx4j2bdw> Monitor </td>
  ```
- Sitemap exclusion grep and built robots inspection produced this actual
  output:
  ```text
  Sitemap files: sitemap-0.xml, sitemap-index.xml
  sitemap grep exit code: 1 (1 means no matches)

  User-agent: *
  Allow: /
  Disallow: /dev/

  Sitemap: https://statohub.com/sitemap-index.xml
  ```
- Token proof command:
  `rg -n '#[0-9A-Fa-f]{6}' src/components/applied/KeyTakeaways.astro src/components/applied/Callout.astro src/components/applied/Checklist.astro src/components/applied/DataTable.astro src/pages/dev/preview/index.astro`
  produced no match lines. Actual wrapped output:
  ```text
  token-proof rg exit code: 1 (1 means no matches)
  ```
- Directory proof against `src` also produced no match lines:
  ```text
  source blog-directory rg exit code: 1 (1 means no matches)
  ```

**Blocked / couldn't do / decisions made:**
- The exact `npm test` command remains blocked by the documented Windows
  `spawn EPERM`; this session's fixed approval policy exposes no process-spawn
  approval path. The same 35 files / 120 tests passed through the documented
  sandbox-safe fallback, reported separately above rather than misrepresented
  as the exact command passing.
- No design tokens, dependencies, client scripts, internal links, article
  content, or out-of-scope TASK-028B/TASK-029 components were added. Styling
  stays local to each component/page and every colour reference uses an
  existing `var(--token)`.
- `DataTable` preserves the submitted cell label inside each status badge so
  status is never encoded by colour alone; unrecognized labels deliberately
  remain plain text.

---

## Review  *(Claude writes -- accept or send back)*

- **Reviewed:** 2026-08-16
- **Verdict:** CLOSED

**Notes / what to improve:**
- All six deliverables match the Brief. **Gates re-run by the Orchestrator, not
  taken from the Work Log:** `npx astro check` 0/0/0 (25 files, up from 20 --
  the 4 components and the preview page are genuinely being type-checked);
  `npm run build` 116 pages, 4296 links, 0 link violations, 0 meta-description
  violations; `npm test` 35 files / 120 tests green from the Orchestrator's
  shell; `check-contrast.mjs` 13/13.
- **The token proof passed independently.** My own grep for both 6-digit and
  3-digit hex across all five new files returns nothing. This was the constraint
  most likely to be violated invisibly, and it held.
- Directory naming is correct: `src/components/applied/`, no `blog/` directory
  anywhere. The `/blog/` vocabulary is now fully dead in the source tree, as
  ADR-0014 intended.
- **The preview page was the right call to bundle into this task.** It is what
  makes `astro check` climb from 20 to 25 files and gives the components a real
  consumer -- without it "the components work" would have been an unfalsifiable
  claim. Sitemap exclusion verified (0 matches in `dist/sitemap-0.xml`),
  `noindex,follow` present, `Disallow: /dev/` in `dist/robots.txt`.
- `DataTable` is the strongest piece: real `<th scope="col">` semantics, the
  mandatory `overflow-x` wrapper present with `role="region"` + `tabindex="0"`
  so the scroll container is keyboard-reachable (not asked for -- correct
  anyway), and all four badge tones verified to render **visible text labels**
  (`Pass` / `Warning` / `Fail` / `Severe`), so status is never colour-only.
  Unmapped values fall through to plain text as specified, confirmed against the
  rendered `Monitor` cell.
- **Contrast gap found and checked, not just noted.** Badges render on
  `--paper-2`, but `check-contrast.mjs` only tests the status tokens against
  `--card`, so the pairs actually shipping are unguarded. I computed all 8
  (4 tokens x 2 themes) against the real `--paper-2` value: the worst case is
  `--status-pass` on light at **4.75:1**, and every pair clears AA. So this is a
  coverage gap in the guard, not a defect in the component -- nothing to send
  back. **Follow-up:** add the 4 `--status-* on --paper-2` pairs to
  `check-contrast.mjs` so the pairs we actually ship are the pairs CI enforces.
  Folded into TASK-029A rather than reopening this task.
- Minor, deliberately not sent back: `.status-badge` carries the pass colours on
  the base rule and the three other tones override, so `status-badge--pass` is
  emitted with no matching rule. It renders correctly and costs nothing; it is
  slightly asymmetric to read. Not worth a round trip.
- **Timeout note: this one is a false alarm, and the distinction matters.** The
  MCP call hit the 900s client timeout, but unlike TASK-026 the work was
  genuinely finished first -- Codex wrote its own Work Log, set `DONE`, and
  appended the AGENTS.md entry before the transport died on the response return.
  So TASK-026's lesson holds and generalises: after a timeout, diff the tree
  before assuming anything, in either direction. The task file was honest here;
  only the reply was lost.
- Splitting TASK-028 was still correct. The task used ~11 of the 15 available
  minutes for half the component set -- all 8 in one dispatch would have timed
  out mid-write and lost the log for real.
