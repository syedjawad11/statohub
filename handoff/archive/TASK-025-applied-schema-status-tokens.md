Status: CLOSED
<!-- TODO | IN_PROGRESS | DONE | CHANGES_REQUESTED | CLOSED -->

# TASK-025 -- Applied section schema field, status tokens, FAQPage schema

- **Owner of this stage:** Codex
- **Repo:** `Desktop/statohub/` (where the work happens)
- **Created:** 2026-08-16 by Claude

<!-- Authoring note (Claude): keep this file plain ASCII. Use `--` not an em
dash, `->` not an arrow, `...` not an ellipsis. Codex reads these files through
a Windows codepage; non-ASCII punctuation renders as mojibake and breaks its
apply_patch matching. -->

---

## Brief  *(Claude writes -- what Codex needs to execute)*

**Goal:** Lay the three independent foundations the Applied Statistics section
needs before any routing, layout, or content work can start: a `section` field
on the `categories` collection, four `--status-*` colour tokens with contrast
coverage, and a reusable `faqPageSchema()` helper. This task adds capability
only -- it must change zero existing URLs and zero rendered output.

**Context / inputs:**
- `docs/decisions/0014-applied-section-url-family.md` -- records that sections
  are modelled as a field on `categories`, NOT as parallel collections and NOT
  as a field on `articles`. Read this before touching the schema.
- `docs/decisions/0015-wedge-scoped-to-learn.md` -- Applied articles are exempt
  from the required `<StatCalc>` embed. Nothing to implement here; context only.
- `src/content/config.ts` -- the `categories` collection is at lines 7-15.
- `src/styles/global.css` -- token blocks are `:root` (line 19) and `html.dark`
  (line 45), both nested inside `@layer base`.
- `scripts/check-contrast.mjs` -- the `checks` array is at lines 6-12.
- `src/lib/schema.ts` -- 145 lines, existing exported builders to match.

**Deliverables:**

- [ ] **1. `src/content/config.ts` -- `section` on `categories` only.**
      Add to the `categories` schema object:
      `section: z.enum(['learn', 'applied']).default('learn'),`
      The `.default('learn')` is load-bearing: all 6 existing category YAML
      files must keep validating with no edits. Do NOT add a `section`,
      `format`, or `content_type` field to `articles` -- every article
      references exactly one category and every category sits in exactly one
      section, so a second field could only ever disagree with itself. Do not
      touch the `articles`, `calculators`, or `calculator-content` collections.

- [ ] **2. `src/styles/global.css` -- four status tokens, both themes.**
      Add to the `:root` block (light), keeping the existing indentation and
      placing them after `--brass` and before `--focus`:
      ```
      --status-pass: #1F7A4D;
      --status-warn: #8A6100;
      --status-fail: #B3261E;
      --status-critical: #8B1A3A;
      ```
      Add to the `html.dark` block, in the same relative position:
      ```
      --status-pass: #5FC98E;
      --status-warn: #E0B341;
      --status-fail: #F2867A;
      --status-critical: #F07AA0;
      ```
      These exact values are already contrast-verified (see below) -- use them
      as written, do not substitute your own. They must stay **6-digit hex**:
      `check-contrast.mjs` parses tokens with `/#[0-9a-fA-F]{6}/` and will
      silently skip 3-digit hex, `rgb()`, or `color-mix()` values.
      Add no rules that consume these tokens yet -- TASK-028/029 do that.

- [ ] **3. `scripts/check-contrast.mjs` -- eight new checks.**
      Extend the `checks` array with all four tokens against `--card` in both
      themes:
      ```
      { theme: 'light', text: '--status-pass', background: '--card' },
      { theme: 'light', text: '--status-warn', background: '--card' },
      { theme: 'light', text: '--status-fail', background: '--card' },
      { theme: 'light', text: '--status-critical', background: '--card' },
      { theme: 'dark', text: '--status-pass', background: '--card' },
      { theme: 'dark', text: '--status-warn', background: '--card' },
      { theme: 'dark', text: '--status-fail', background: '--card' },
      { theme: 'dark', text: '--status-critical', background: '--card' },
      ```
      Change nothing else in this file -- not the 5 existing checks, not
      `MIN_CONTRAST`, not the parsing logic.

- [ ] **4. `src/lib/schema.ts` -- `faqPageSchema()`.**
      Add an exported builder for FAQPage JSON-LD, matching the file's existing
      conventions (exported function, `Record<string, unknown>` or plain object
      literal return, interface declared near its function):
      ```
      export interface FaqItem {
        question: string;
        answer: string;
      }

      export function faqPageSchema(items: FaqItem[]) { ... }
      ```
      Returns `@context` `https://schema.org`, `@type` `FAQPage`, and
      `mainEntity`: an array of `{ '@type': 'Question', name, acceptedAnswer:
      { '@type': 'Answer', text } }`. It takes **no `site` argument** -- FAQPage
      needs no absolute URLs, so do not invent one. Throw on an empty `items`
      array, matching how `breadcrumbList()` throws on an invalid item -- an
      empty FAQPage is invalid structured data and should fail loudly at build
      time rather than emit a broken blob.
      Do not wire this into any page yet; TASK-028 consumes it.

- [ ] **5. `src/lib/__tests__/schema.test.ts` -- test for `faqPageSchema()`.**
      New directory. Vitest has no `include` override in `vitest.config.ts`, so
      the default glob picks this path up with no config change -- do not edit
      `vitest.config.ts`. Cover at minimum: correct `@type` values and nesting,
      question/answer text mapped in input order, and that an empty array
      throws. Import from `../schema`.

**Constraints:**
- Stay in this repo; don't touch sibling folders or `CLAUDE.md`.
- Additive only. No existing URL, page, or rendered byte may change.
- Do not create category YAML files, landing pages, route kinds, or components
  -- those are TASK-026 and later. This task ends at capability.
- Do not modify `src/lib/links.ts`, `scripts/gen-route-ids.mjs`,
  `scripts/check-links.mjs`, or `src/pages/**`.
- Node stays at v20.8.0 and Wrangler at v3 (ADR-0005). Do not upgrade, add, or
  remove any dependency; `package.json` must be untouched.
- Match surrounding code style: this repo uses 2-space indent, single quotes,
  and trailing commas in multi-line literals.

**Definition of done / how to verify:**

Run all four, in this order, and paste the actual output into the Work Log:

1. `npx astro check` -- must report the same error/warning count as before your
   change (expected: clean). This is what proves the new Zod field and the new
   exported types type-check.
2. `npm test` -- all existing suites still pass, plus the new
   `src/lib/__tests__/schema.test.ts`.
3. `node scripts/check-contrast.mjs` -- must exit 0 and print **13** passing
   lines (5 existing + 8 new). This script is NOT in the build chain, so
   running it by hand is the only proof.
4. `npm run build` -- the real gate. Must finish with **109 pages**, **0 link
   violations**, and **0 meta-description violations**. Any deviation from 109
   means something non-additive happened; stop and report rather than
   "fixing" it.

**Contrast values are pre-verified.** Every one of the 8 token/`--card` pairs
above was computed against the same WCAG formula the script uses and clears the
4.5:1 minimum (lowest is `--status-pass` light at 5.32:1). All 8 also clear
against `--paper` (lowest 5.09:1), so a later move off cards is safe. If
`check-contrast.mjs` reports a failure, the token values were mistyped -- fix
the typo, do not pick new colours.

**Sandbox note:** per `AGENTS.md`, `npm test` / `astro build` can hit
`spawn EPERM` and `npm install` can need network approval on Windows. Those are
environment issues -- request approval and rerun. Never change the
implementation to work around a sandbox refusal, and never skip a verification
step because it was blocked. If a step stays blocked, say so explicitly in
"Blocked / couldn't do" rather than reporting it as passed.

---

## Work Log  *(Codex writes -- what was actually done)*

- **Started:** 2026-08-16
- **Finished:** 2026-08-16

**What changed (files + where):**
- `src/content/config.ts` -- added the `section` enum with the load-bearing
  `learn` default to the `categories` schema only, so all existing category
  data continues to validate without edits.
- `src/styles/global.css` -- added the four exact `--status-*` tokens between
  `--brass` and `--focus` in both the light and dark token blocks; added no
  consuming rules.
- `scripts/check-contrast.mjs` -- appended the eight requested status-token on
  `--card` checks while leaving the five existing checks and all checking logic
  unchanged.
- `src/lib/schema.ts` -- added the exported `FaqItem` interface and
  `faqPageSchema()` builder, including a build-time error for an empty item
  array; did not wire it into any page.
- `src/lib/__tests__/schema.test.ts` -- added Vitest coverage for FAQPage,
  Question, and Answer nesting, ordered question/answer mapping, and the empty
  array error.
- `handoff/TASK-025-applied-schema-status-tokens.md` -- tracked the task through
  `IN_PROGRESS` to `DONE` and recorded the implementation and actual checks.
- `AGENTS.md` -- appended the concise TASK-025 work-history entry required by
  the repository workflow.

**How to verify:**
- `npx astro check` -- exit 0. Actual output:
  ```text
  Result (17 files):
  - 0 errors
  - 0 warnings
  - 0 hints
  ```
- `npm test` -- the first attempt exited 1 with `Startup Error` / `Error: spawn
  EPERM`. After the required sandbox approval, the exact same command exited 0.
  Actual successful summary (ANSI colour removed):
  ```text
  ✓ src/lib/__tests__/schema.test.ts (2 tests) 15ms

  Test Files  35 passed (35)
       Tests  120 passed (120)
    Duration  9.17s (transform 2.72s, setup 0ms, collect 6.92s, tests 760ms, environment 45ms, prepare 22.69s)
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
- `npm run build` -- exit 0. Actual output summary (ANSI colour removed):
  ```text
  gen-route-ids: wrote 74 article, 29 calculator, 6 category ids to src/lib/content-route-ids.ts
  [build] 109 page(s) built in 35.07s
  [build] Complete!
  check-links: scanned 109 pages, checked 4066 internal links, found 0 violations.
  check-links: OK - all internal page links are canonical and resolvable.
  check-meta-description: scanned 109 pages, found 0 violations.
  check-meta-description: OK - all meta descriptions are 110-160 chars.
  ```

**Blocked / couldn't do / decisions made:**
- The first `npm test` attempt hit the documented Windows `spawn EPERM` block;
  sandbox approval was requested and the unchanged command then passed. Nothing
  remained blocked. The required build rewrote `src/lib/content-route-ids.ts`,
  but its working-tree and `HEAD` blob hashes are identical
  (`3825c167cf817c4901e7e0c2724bbc6638ec3a56`), so it has no content diff.

---

## Review  *(Claude writes -- accept or send back)*

- **Reviewed:** 2026-08-16
- **Verdict:** CLOSED

**Notes / what to improve:**
- All four gates re-run independently on the Orchestrator side rather than
  taken from the Work Log: contrast 13/13 exit 0, `npx astro check` 0/0/0,
  `npm test` 35 files / 120 tests, `npm run build` 109 pages / 4066 links /
  0 link violations / 0 meta-description violations. Exactly the 2026-08-16
  baseline, which is what proves the change was additive.
- Diff reviewed line by line against the Brief. All five deliverables match the
  spec as written: `section` landed on `categories` only with the load-bearing
  `.default('learn')`, the eight token values are byte-exact, the five existing
  contrast checks and all parsing logic are untouched, `faqPageSchema()` takes
  no `site` argument and throws on empty input, and the test asserts nesting,
  input order, and the throw.
- Scope check clean. No forbidden file was touched: `package.json`,
  `vitest.config.ts`, `src/lib/links.ts`, `scripts/gen-route-ids.mjs`,
  `scripts/check-links.mjs`, and `src/pages/**` are all unmodified. Nothing
  consumes the new tokens yet, which is correct -- TASK-028/029 own that.
- Good call reporting the `spawn EPERM` retry explicitly instead of silently
  passing; that is the behaviour the Sandbox note asked for.
- One small inaccuracy, recorded for the record and not a defect: the Work Log
  says the working-tree and HEAD blob hashes for `src/lib/content-route-ids.ts`
  are identical, but the file still shows as modified in `git status`. The
  substantive claim is right -- `git diff --ignore-all-space --numstat` returns
  empty, so the diff is EOL-only. This is the known missing-`.gitattributes`
  issue parked in `docs/status/NOW.md`, not anything this task caused.
- First task dispatched to Codex over the `codex mcp-server` MCP transport
  rather than hand-relayed. The dispatch/review/gate loop worked end to end.
