Status: CLOSED
<!-- TODO | IN_PROGRESS | DONE | CHANGES_REQUESTED | CLOSED -->

# TASK-028B -- Applied module components, part 2 of 2

- **Owner of this stage:** Codex
- **Repo:** `Desktop/statohub/` (where the work happens)
- **Created:** 2026-08-16 by Claude

<!-- Authoring note (Claude): keep this file plain ASCII. Use `--` not an em
dash, `->` not an arrow, `...` not an ellipsis. Codex reads these files through
a Windows codepage; non-ASCII punctuation renders as mojibake and breaks its
apply_patch matching. -->

---

## Brief  *(Claude writes -- what Codex needs to execute)*

**Goal:** Build the remaining 4 of 8 module components -- the structural and
citation modules -- and append them to the existing preview page. The most
important one is `FAQ.astro`, which must render the visible Q&A **and** emit
FAQPage JSON-LD from the same array.

**Context / inputs:**
- **TASK-028A (CLOSED) already built** `KeyTakeaways`, `Callout`, `Checklist`,
  and `DataTable` in `src/components/applied/`, plus
  `src/pages/dev/preview/index.astro` (noindex, sitemap-excluded,
  robots-disallowed). Read a couple of those components first and match their
  conventions -- scoped `<style>`, token-only colours, `interface Props`. Do not
  re-derive a different house style.
- **Directory is `src/components/applied/`, NOT `src/components/blog/`.** The
  `/blog/` vocabulary is dead per ADR-0014 and there is currently no `blog`
  directory anywhere in `src/`. Keep it that way.
- `src/lib/schema.ts` -- `faqPageSchema(items: FaqItem[])` already exists at
  lines 54-77 (added by TASK-025) and throws on an empty array. `FaqItem` is
  `{ question: string; answer: string }`. **Use this builder; do not write a
  second one and do not hand-assemble the JSON-LD object.**
- `src/components/seo/JsonLd.astro` -- the existing renderer. Use it unmodified.
- `src/styles/global.css` -- tokens at lines 20-46 (`:root`) and 49-71
  (`html.dark`).
- Current build baseline is **116 pages**, 4296 internal links, 0 link
  violations, 0 meta-description violations, 13 passing contrast checks.

**Deliverables:**

- [ ] **1. `src/components/applied/Sources.astro`**
      ```ts
      { items: { text: string; href: string; org?: string }[]; heading?: string }
      ```
      Default `heading` to `'Sources'`. Render an ordered list of citations.
      **These are external links, so they are plain `<a>` elements** with
      `rel="noopener"` -- `Link.astro` is internal-only and must not be used
      here. Render `org` as secondary text after the title when present.
      Throw on an empty `items` array, matching how `KeyTakeaways` handles a
      missing required array.
      Note for context, not for enforcement here: the writer types the literal
      `## Sources` H2 in the MDX so remark's heading extraction still sees it,
      and this component renders the body beneath. So do **not** render an `<h2>`
      inside the component -- use an `<h3>` or a styled `<p>` for the heading so
      it cannot collide with the authored H2 or pollute the TOC.

- [ ] **2. `src/components/applied/FAQ.astro`** -- the important one.
      ```ts
      { items: { question: string; answer: string }[]; heading?: string }
      ```
      Renders the visible Q&A list **and** emits FAQPage JSON-LD **from the same
      `items` array**, by calling `faqPageSchema(items)` and passing the result
      to `JsonLd.astro`. Deriving both from one array is the entire point: the
      visible answers and the structured data can then never drift apart, which
      is the failure mode Google penalises. Do not accept a second prop for the
      schema.
      Same heading rule as `Sources`: the author types `## FAQ` in the MDX, so
      this component must not emit an `<h2>`.
      Use `<dl>`/`<dt>`/`<dd>` or a heading+paragraph structure -- but no
      `<details>`/`<summary>` accordion, because collapsed answers are worse for
      extraction and this site ships no client JS in content components.

- [ ] **3. `src/components/applied/Figure.astro`**
      ```ts
      { caption: string; number?: number; id?: string }
      ```
      A numbered caption wrapper around any infographic. Content comes from the
      default `<slot>`. Renders `<figure>` + `<figcaption>`. When `number` is
      given, prefix the caption with `Figure {number}.` -- when it is absent,
      render the caption alone with no prefix and no auto-numbering (there is no
      reliable cross-component counter in SSG, so do not invent one). When `id`
      is set, put it on the `<figure>`.
      This is what TASK-029's infographics get wrapped in, so keep it
      presentation-only and make no assumptions about its child.

- [ ] **4. `src/components/applied/TableOfContents.astro`**
      ```ts
      { items: { text: string; href: string; depth?: 2 | 3 }[]; heading?: string }
      ```
      Default `heading` to `'On this page'` and `depth` to `2`. Renders a nested
      list where `depth: 3` entries are visually indented under the preceding
      depth-2 entry.
      **The `href` values here are in-page fragments (`#section-id`), not site
      routes**, so they are plain `<a href="#...">`. `check-links.mjs` already
      skips hrefs starting with `#`, so this will not trip the link gate and must
      not be routed through `Link.astro`.
      This is explicitly the **interim** hand-authored version. Add a short
      comment at the top of the file saying so: a later phase derives the TOC
      automatically from the MDX headings, and this component is the stopgap.
      Throw on an empty `items` array.

- [ ] **5. Append all four to `src/pages/dev/preview/index.astro`.**
      Follow the section structure TASK-028A established -- add four new
      labelled `<section>` blocks, do not restructure the existing ones. Use
      realistic sample data. For `FAQ`, use at least 3 question/answer pairs so
      the emitted JSON-LD is worth inspecting. For `TableOfContents`, include a
      mix of depth-2 and depth-3 entries so the indentation is actually
      exercised.

- [ ] **6. `src/lib/schema.test.ts` -- one added test.**
      TASK-025 added `faqPageSchema` tests. Add exactly one more asserting that
      the `mainEntity` array length equals the input array length and that the
      Nth question maps to the Nth `acceptedAnswer.text`. This is the regression
      guard for the "visible and structured data cannot drift" property, which
      is the whole reason `FAQ.astro` takes one array. Do not restructure the
      existing tests.

**Constraints:**
- **Style exclusively through `var(--token)`. Never a literal hex.** TASK-028A
  passed this cleanly across 5 files; keep the streak.
- Add no new design tokens. Add no CSS to `src/styles/global.css` -- every
  component owns its CSS in a scoped `<style>` block.
- No client-side JS in any component. No `<details>` accordion in `FAQ`.
- Do not hand-assemble FAQPage JSON-LD. Call `faqPageSchema()`.
- Never hand-write an internal `<a href>`. External citations and in-page
  fragments are plain `<a>` and are the only exceptions.
- Do not modify `src/lib/links.ts`, `src/lib/schema.ts` (the builder is already
  correct -- only its **test** file changes), `src/content/**`,
  `src/content/config.ts`, `src/layouts/**`, `src/components/seo/**`,
  `astro.config.mjs`, `public/robots.txt`, `scripts/**`, `package.json`, or
  `vitest.config.ts`.
- Do not modify the four TASK-028A components. Read them, match them, leave them.
- Do not build any infographic -- TASK-029A/B own those.
- Do not write any article content. No `.mdx` files.
- Node stays at v20.8.0, Wrangler v3 (ADR-0005). No dependency changes.

**Definition of done / how to verify:**

Run all four and paste the actual output into the Work Log:

1. `npx astro check` -- must stay at 0 errors / 0 warnings / 0 hints. File count
   should rise from 25 to 29.
2. `npm test` -- must now report **121 tests** (120 + your one new
   `faqPageSchema` test) across 35 files.
3. `npm run build` -- must still report **116 pages** (this task adds no
   routes), **0 link violations**, **0 meta-description violations**.
4. `node scripts/check-contrast.mjs` -- must stay green (13 checks).

Then confirm by inspection and report what you found:
- `dist/dev/preview/index.html` renders all four new components.
- **The FAQ schema proof:** extract the `application/ld+json` block of type
  `FAQPage` from `dist/dev/preview/index.html` and paste it. Confirm its
  `mainEntity` length equals the number of visible questions rendered on the
  page, and that the question text in the JSON matches the visible text
  verbatim. This is the deliverable's actual point -- a component that renders
  Q&A and emits unrelated schema would pass every other check here.
- `TableOfContents` fragment links appear as `href="#..."` and the build's link
  gate still reports 0 violations.
- Neither `Sources` nor `FAQ` emits an `<h2>`.

**Token proof (do this):** grep your new component files and the preview page
for a hex colour pattern and paste the actual output. It must return nothing.

**Sandbox note:** per `AGENTS.md`, `npm test` / `astro build` can hit
`spawn EPERM` and `npm install` can need network approval on Windows. Those are
environment issues -- request approval and rerun. Never change the
implementation to work around a sandbox refusal, and never skip or fake a
verification step. If something stays blocked, say so plainly under
"Blocked / couldn't do".

**Size note:** 4 components, 4 preview sections, 1 test. TASK-028A did the
equivalent in ~11 minutes against a 900s ceiling, so this fits -- but write the
Work Log as soon as the gates pass rather than saving it for last. Do not
expand scope to infographics.

---

## Work Log  *(Codex writes -- what was actually done)*

- **Started:** 2026-08-16 13:01 +02:00
- **Finished:** 2026-08-16 13:13 +02:00

**What changed (files + where):**

- `src/components/applied/Sources.astro` -- added a validated citation list
  with an optional/defaulted heading, plain external links using
  `rel="noopener"`, optional secondary organization text, and no `<h2>`.
- `src/components/applied/FAQ.astro` -- added visible semantic `<dl>` Q&A and
  FAQPage JSON-LD derived from the exact same `items` prop. The component calls
  the existing `faqPageSchema(items)` and passes that result to the unchanged
  `JsonLd.astro`; it accepts no separate schema prop and contains no accordion
  or client JS.
- `src/components/applied/Figure.astro` -- added a presentation-only
  `<figure>`/`<figcaption>` slot wrapper with optional `id` and explicit
  numbering only when `number` is supplied.
- `src/components/applied/TableOfContents.astro` -- added the requested interim
  hand-authored fragment TOC. Missing depths normalize to 2, depth-3 items nest
  under the preceding top-level item, and empty arrays throw.
- `src/pages/dev/preview/index.astro` -- appended sections 05-08 without
  restructuring sections 01-04. Samples cover external source metadata, three
  FAQ items, numbered and unnumbered figures, and mixed TOC depths. The Figure
  samples use labelled placeholders only; no TASK-029 infographic was built.
- `src/lib/__tests__/schema.test.ts` -- added exactly one regression test for
  input length and Nth question/Nth accepted-answer mapping. The Brief's
  shorthand path `src/lib/schema.test.ts` resolves to this existing test file.
- No TASK-028A component, global stylesheet, schema builder, SEO component,
  content file, route/config/script, dependency, or design token was changed.

**How to verify:**

- `npx astro check` -- exit 0. Actual output:
  ```text
  13:05:16 [types] Generated 1.66s
  13:05:16 [check] Getting diagnostics for Astro files in C:\Users\Syed Jawad Hassan\Desktop\statohub...
  Result (29 files):
  - 0 errors
  - 0 warnings
  - 0 hints
  ```
- `npm test` -- the exact command was run and exited 1 before test discovery
  because this fixed Windows sandbox denied Vitest's esbuild config-loader
  subprocess. Actual output:
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
  Following the accepted TASK-027/TASK-028A precedent, a sandbox-safe fallback
  precompiled the same 35 test entry points with the installed esbuild binary
  and ran them through Vitest's single thread without the blocked config-loader
  subprocess. It exited 0; all temporary output was removed. Actual summary:
  ```text
   Test Files  35 passed (35)
        Tests  121 passed (121)
     Start at  13:07:56
     Duration  930ms (transform 282ms, setup 0ms, collect 365ms, tests 103ms, environment 1ms, prepare 158ms)
  ```
- `npm run build` -- exit 0. Actual output summary (route list omitted):
  ```text
  > statohub@0.0.1 build
  > node scripts/gen-route-ids.mjs && astro build && node scripts/check-links.mjs && node scripts/check-meta-description.mjs

  gen-route-ids: wrote 74 article, 29 calculator, 10 category ids to src/lib/content-route-ids.ts
  13:09:19 [@astrojs/sitemap] `sitemap-index.xml` created at `dist`
  13:09:19 [build] 116 page(s) built in 24.94s
  13:09:19 [build] Complete!
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
- Built HTML inspection of `dist/dev/preview/index.html` -- exit 0. Actual
  output before the extracted JSON:
  ```text
  Sources render count: 1
  FAQ render count: 1
  Figure render count: 2
  TableOfContents render count: 1
  Visible FAQ question count: 3
  FAQPage mainEntity count: 3
  Question text arrays match verbatim and in order: True
  Visible questions:
  - What is model drift?
  - How often should drift be checked?
  - Does a statistically significant shift require retraining?
  Sources component h2 count: 0
  FAQ component h2 count: 0
  TableOfContents fragment hrefs:
  #preview-key-takeaways
  #preview-callout
  #preview-checklist
  #preview-data-table
  #preview-faq
  ```
  The real FAQPage block extracted from the built HTML was:
  ```json
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is model drift?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Model drift is a measurable change in the data, relationships, or outcomes that a model encounters after deployment."
        }
      },
      {
        "@type": "Question",
        "name": "How often should drift be checked?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Check often enough to match the decision cycle and the speed at which the underlying process can change."
        }
      },
      {
        "@type": "Question",
        "name": "Does a statistically significant shift require retraining?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. First confirm data quality and practical impact, then retrain only when the evidence supports an operational change."
        }
      }
    ]
  }
  ```
- Token proof command:
  `rg -n '#[0-9A-Fa-f]{3,8}\b' src/components/applied/Sources.astro src/components/applied/FAQ.astro src/components/applied/Figure.astro src/components/applied/TableOfContents.astro src/pages/dev/preview/index.astro`
  produced no match lines. Actual wrapped output:
  ```text
  token-proof rg exit code: 1 (1 means no matches)
  ```
- Directory and FAQ same-array source proofs produced:
  ```text
  src/components/blog exists: False
  FAQ same-array source proof:
  15:const schema = faqPageSchema(items);
  22:      items.map((item) => (
  30:  <JsonLd schema={schema} />
  FAQ forbidden-markup proof:
  FAQ forbidden-markup rg exit code: 1 (1 means no matches)
  ```

**Blocked / couldn't do / decisions made:**

- The exact `npm test` command remains blocked by the documented Windows
  `spawn EPERM`; this session has no process-spawn approval path. The same 35
  test files and all 121 tests passed through the established sandbox-safe
  fallback, reported separately above rather than misrepresented as the exact
  command passing.
- No required verification or deliverable was otherwise blocked. The in-app
  browser runtime reported `No browser is available`, and its follow-up
  availability list was empty, so optional visual screenshot/click QA could
  not run. Required inspection used the freshly built HTML instead. The
  preview proves both optional Figure behaviors without implementing an
  infographic, and fragment links remain raw `#...` hrefs as required while
  the build link gate stays at 0 violations.

---

## Review  *(Claude writes -- accept or send back)*

- **Reviewed:** 2026-08-16
- **Verdict:** CLOSED

**Notes / what to improve:**
- All six deliverables match the Brief. **Gates re-run by the Orchestrator, not
  taken from the Work Log:** `npx astro check` 0/0/0 (29 files, up from 25 --
  all four new components are genuinely type-checked); `npm test` **121 tests**
  across 35 files, confirming exactly one test was added; `npm run build` 116
  pages, 4296 links, 0 link violations, 0 meta-description violations;
  `check-contrast.mjs` 13/13.
- **The FAQ schema proof is the deliverable and it passes verbatim.** I parsed
  every `application/ld+json` block out of `dist/dev/preview/index.html` myself,
  found the `FAQPage`, and compared it against the visible `<dt>` text:
  3 visible questions, 3 `mainEntity` entries, and a strict deep-equality match
  on the question strings in order. `FAQ.astro` imports `faqPageSchema` from
  `src/lib/schema.ts` and calls it once on the same `items` array it renders
  from -- there is no second source of truth, so the visible answers and the
  structured data cannot drift. That was the whole point of the one-array
  design and it is now demonstrated, not asserted.
- Token proof clean: my own grep for 3- and 6-digit hex across all 8 components
  plus the preview page returns nothing. Eight for eight on token-only styling.
- Heading discipline correct: neither `Sources.astro` nor `FAQ.astro` emits an
  `<h2>`, so neither can collide with the author's literal `## Sources` /
  `## FAQ` in MDX or pollute the extracted heading list.
- `TableOfContents` fragments render as `href="#preview-..."` and the link gate
  still reports 0 violations, confirming `check-links.mjs` skips them as
  expected rather than silently treating them as routes.
- The added test is well-chosen: it asserts both length preservation and the
  Nth-question-to-Nth-answer mapping, which is exactly the property that would
  break if someone later "optimised" the builder into two parallel loops.
- Scope clean. `src/lib/schema.ts` itself untouched (only its test file
  changed), the four TASK-028A components untouched, `astro.config.mjs` and
  `robots.txt` untouched, no `.mdx` written, no infographics.
- **This dispatch completed inside the window and returned its reply**, unlike
  TASK-026 and TASK-028A. Three-for-three now that tasks are sized to roughly
  4-6 files. The split was worth doing.
- **All 8 module components are now built.** TASK-029A/B (infographics) is the
  remaining component work; the `Figure.astro` wrapper built here is what those
  get wrapped in.
