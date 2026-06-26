Status: CLOSED
<!-- TODO | IN_PROGRESS | DONE | CHANGES_REQUESTED | CLOSED -->

# TASK-018 -- Weave 3-4 in-content related-link callouts into every article + calc block

- **Owner of this stage:** Codex
- **Repo:** `Desktop/statohub/` (where the work happens)
- **Created:** 2026-06-26 by Claude

<!-- Authoring note (Claude): keep this file plain ASCII. Use `--` not an em
dash, `->` not an arrow, `...` not an ellipsis. Codex reads these files through
a Windows codepage; non-ASCII punctuation renders as mojibake and breaks its
apply_patch matching. -->

---

## Brief  *(Claude writes -- what Codex needs to execute)*

**Background / why this task exists.** TASK-017 shipped the `<RelatedLink>`
callout component (the soft blue, left-accent-bar box with an arrow glyph, an
italic intro phrase, and an underlined internal link) but only added ONE demo
usage at the END of one page. The user wants these callouts WOVEN THROUGH the
body of every content page -- roughly one every 2-3 sections, 3-4 per long
article and 1-2 per short calculator teaching block -- exactly like the
reference images (which show callouts sitting between paragraphs mid-article,
not dumped at the end).

**This is a pure INSERTION task. You are NOT choosing targets or phrasing.**
Claude has already authored the complete editorial link-map below: every
callout's file, exact insertion anchor, target route, visible label, and intro
phrase is specified. Your job is to insert each callout verbatim at the named
anchor and add the required imports. Do not invent, add, remove, or relocate any
callout beyond what the map lists. Do not restyle anything.

**What is already built (do NOT rebuild or touch):**
- `src/components/RelatedLink.astro` -- the callout component. Props:
  `to: RouteRef` (required), `label: string` (required), `intro?: string`
  (optional; when passed it is used verbatim). All values in the map use an
  explicit `intro` so phrasing is deterministic.
- `src/lib/related-intros.ts` -- the approved intro-phrase pool.
- `.related-link-callout` styles in `src/styles/global.css` -- already correct,
  dark-mode safe, and confirmed rendering on both article pages and calculator
  teaching-block pages. NO CSS changes in this task.
- The typed link registry `src/lib/links.ts` (`routes.article(id)`,
  `routes.calculator(id)`). Every target in the map is a real built page; the
  `check-links.mjs` gate will confirm.

**Note on the reference images:** they are a STYLE + PLACEMENT reference only
(they happen to show phrases like "Related deep-dive:"). statohub uses its own
approved phrase pool. Use the EXACT `intro` strings given in the map -- do not
copy phrases from the images.

### Global insertion rules (apply to every callout)

1. **Anchor = a heading line.** Each callout in the map is anchored to a
   `## Heading` line that should appear AFTER the callout (so the callout closes
   the preceding section -- the end-of-section placement seen in the images).
2. **Placement relative to the anchor:** locate the anchor `## Heading` line. If
   the nearest non-blank line directly above it is a `---` thematic break,
   insert the callout block ABOVE that `---`. Otherwise insert it directly ABOVE
   the `## Heading` line. Always leave exactly one blank line above and one blank
   line below the inserted callout block. (Net effect: section text, blank,
   callout, blank, then the `---`/heading -- never callout-immediately-under-a-
   divider, never callout glued to the section text.)
3. **Headings are unique within each file**, so each anchor matches exactly once.
4. **One callout per anchor.** Never stack two callouts at the same anchor.
5. **Imports.** Each file that gains a callout must import the component and the
   route registry at the top of the MDX body (right after the closing frontmatter
   `---`). Add whichever of these two lines is MISSING (idempotent -- do not
   duplicate a line that already exists):
   ```
   import RelatedLink from '../../components/RelatedLink.astro';
   import { routes } from '../../lib/links';
   ```
   - Both article files (`src/content/articles/*.mdx`) and calc-block files
     (`src/content/calculator-content/*.mdx`) sit two levels under `src/`, so the
     `../../` paths above are correct for BOTH.
   - Most articles already import `{ routes }` and `Link`; they still need the
     `RelatedLink` import added. Most calc blocks import nothing yet; they need
     BOTH lines.
6. **Do not edit:** the frontmatter, any existing prose, any existing inline
   `<Link>`, `<StatCalc>`, CSS, or `CLAUDE.md`.

### Part 1 -- Long-form articles  (`src/content/articles/<slug>.mdx`)

For each slug, insert the listed callouts. Format of each row:
`ABOVE <anchor heading line>  ->  <exact callout markup to insert>`

**correlation-vs-causation**
- ABOVE `## What Is Causation?`
  `<RelatedLink to={routes.article('what-is-correlation')} label="What Is Correlation" intro="Worth reading next" />`
- ABOVE `## Which Correlation Is Most Likely a Causation?`
  `<RelatedLink to={routes.calculator('correlation-coefficient')} label="correlation coefficient calculator" intro="For a related calculation" />`
- ABOVE `## How Researchers Establish Causation`
  `<RelatedLink to={routes.article('linear-regression')} label="Linear Regression Explained" intro="On a related note" />`

**frequency-table**
- ABOVE `## Cumulative Frequency: Tracking Running Totals`
  `<RelatedLink to={routes.calculator('percentile')} label="percentile calculator" intro="For a related calculation" />`
- ABOVE `## Frequency Polygon in Statistics`
  `<RelatedLink to={routes.article('skewed-distribution')} label="Skewed Distributions Explained" intro="On a related note" />`
- ABOVE `## Common Mistakes When Building Frequency Tables`
  `<RelatedLink to={routes.article('median-vs-average')} label="Median vs Average" intro="You may also find this useful" />`

**fundamental-statistics**
- ABOVE `## Statistics Math: The Core Operations`
  `<RelatedLink to={routes.article('parameter-vs-statistic')} label="Parameter vs Statistic" intro="Worth reading next" />`
- ABOVE `## Why Statistics Matter in Everyday Life`
  `<RelatedLink to={routes.article('what-is-an-average')} label="What Is an Average" intro="On a related note" />`
- ABOVE `## Common Mistakes When Learning Fundamental Statistics`
  `<RelatedLink to={routes.calculator('standard-deviation')} label="standard deviation calculator" intro="For a related calculation" />`

**how-to-find-the-range**
- ABOVE `## How to Find the Range: Step-by-Step`
  `<RelatedLink to={routes.calculator('percentile')} label="percentile calculator" intro="For a related calculation" />`
- ABOVE `## Range vs. Other Measures of Spread`
  `<RelatedLink to={routes.article('mean-absolute-deviation')} label="Mean Absolute Deviation Explained" intro="On a related note" />`
- ABOVE `## Common Mistakes When Calculating Range`
  `<RelatedLink to={routes.calculator('standard-deviation')} label="standard deviation calculator" intro="Another helpful calculator is" />`

**linear-regression**
- ABOVE `## The Linear Regression Formula: Slope and Intercept`
  `<RelatedLink to={routes.article('what-is-correlation')} label="What Is Correlation" intro="Worth reading next" />`
- ABOVE `## Interpreting a Regression Analysis`
  `<RelatedLink to={routes.calculator('correlation-coefficient')} label="correlation coefficient calculator" intro="For a related calculation" />`
- ABOVE `## Assumptions of Linear Regression Analysis`
  `<RelatedLink to={routes.article('correlation-vs-causation')} label="Correlation vs Causation" intro="On a related note" />`

**mean-absolute-deviation**
- ABOVE `## How to Calculate Mean Absolute Deviation: Step-by-Step`
  `<RelatedLink to={routes.calculator('mean')} label="mean calculator" intro="For a related calculation" />`
- ABOVE `## Using Mean and Mean Absolute Deviation to Compare Data`
  `<RelatedLink to={routes.article('how-to-find-the-range')} label="How to Find the Range" intro="On a related note" />`
- ABOVE `## Mean Absolute Deviation vs. Standard Deviation`
  `<RelatedLink to={routes.calculator('standard-deviation')} label="standard deviation calculator" intro="Another helpful calculator is" />`

**mean-vs-average**
- ABOVE `## What Does "Average" Mean in Statistics?`
  `<RelatedLink to={routes.article('what-is-an-average')} label="What Is an Average" intro="Worth reading next" />`
- ABOVE `## When "Average" and "Mean" Can Differ`
  `<RelatedLink to={routes.article('median-vs-average')} label="Median vs Average" intro="On a related note" />`
- ABOVE `## Common Mistakes When Calculating or Interpreting the Mean`
  `<RelatedLink to={routes.calculator('weighted-average')} label="weighted average calculator" intro="Another helpful calculator is" />`

**median-vs-average**
- ABOVE `## Median vs Average: The Core Difference`
  `<RelatedLink to={routes.article('what-is-an-average')} label="What Is an Average" intro="Worth reading next" />`
- ABOVE `## What the Gap Between Mean and Median Tells You`
  `<RelatedLink to={routes.article('skewed-distribution')} label="Skewed Distributions Explained" intro="On a related note" />`
- ABOVE `## Step-by-Step: Finding the Median of Any Dataset`
  `<RelatedLink to={routes.calculator('percentile')} label="percentile calculator" intro="For a related calculation" />`

**parameter-vs-statistic**
- ABOVE `## What Is a Statistic?`
  `<RelatedLink to={routes.article('fundamental-statistics')} label="Fundamental Statistics" intro="Worth reading next" />`
- ABOVE `## Why the Distinction Matters in Inferential Statistics`
  `<RelatedLink to={routes.calculator('sample-size')} label="sample size calculator" intro="For a related calculation" />`
- ABOVE `## Real-World Examples`
  `<RelatedLink to={routes.article('what-is-an-average')} label="What Is an Average" intro="On a related note" />`

**probability-distribution**  (4 callouts -- long article)
- ABOVE `## Discrete Probability Distributions`
  `<RelatedLink to={routes.calculator('binomial-distribution')} label="binomial distribution calculator" intro="For a related calculation" />`
- ABOVE `## Continuous Probability Distributions`
  `<RelatedLink to={routes.calculator('normal-distribution')} label="normal distribution calculator" intro="Another helpful calculator is" />`
- ABOVE `## Shape Characteristics of a Probability Distribution`
  `<RelatedLink to={routes.article('skewed-distribution')} label="Skewed Distributions Explained" intro="On a related note" />`
- ABOVE `## How to Choose the Right Probability Distribution`
  `<RelatedLink to={routes.article('probability-formula')} label="Probability Formula Explained" intro="Worth reading next" />`

**probability-formula**
- ABOVE `## How to Find Probability: Addition and Multiplication Rules`
  `<RelatedLink to={routes.article('probability-distribution')} label="Probability Distributions Explained" intro="Worth reading next" />`
- ABOVE `## The Binomial Probability Formula`
  `<RelatedLink to={routes.calculator('binomial-distribution')} label="binomial distribution calculator" intro="For a related calculation" />`
- ABOVE `## Probability Rules: A Quick Summary`
  `<RelatedLink to={routes.calculator('combination')} label="combination calculator" intro="Another helpful calculator is" />`

**skewed-distribution**
- ABOVE `## Left-Skewed Distribution (Negative Skew)`
  `<RelatedLink to={routes.article('probability-distribution')} label="Probability Distributions Explained" intro="Worth reading next" />`
- ABOVE `## Measuring Skewness: The Formula`
  `<RelatedLink to={routes.article('median-vs-average')} label="Median vs Average" intro="On a related note" />`
- ABOVE `## How to Identify a Skewed Distribution`
  `<RelatedLink to={routes.calculator('standard-deviation')} label="standard deviation calculator" intro="For a related calculation" />`

**standard-deviation**  (SHORT stub article -- 1 callout only, by design)
- ABOVE `## How to read the result`
  `<RelatedLink to={routes.article('standard-deviation-symbol')} label="The Standard Deviation Symbol" intro="Worth reading next" />`

**standard-deviation-excel**
- ABOVE `## Excel's Standard Deviation Functions Explained`
  `<RelatedLink to={routes.article('standard-deviation-symbol')} label="The Standard Deviation Symbol" intro="Worth reading next" />`
- ABOVE `## Understanding Sample vs. Population Standard Deviation in Excel`
  `<RelatedLink to={routes.calculator('variance')} label="variance calculator" intro="For a related calculation" />`
- ABOVE `## Standard Deviation in Excel: Additional Techniques`
  `<RelatedLink to={routes.article('mean-absolute-deviation')} label="Mean Absolute Deviation Explained" intro="On a related note" />`

**standard-deviation-symbol**
- ABOVE `## Additional Symbols for Standard Deviation You May Encounter`
  `<RelatedLink to={routes.calculator('variance')} label="variance calculator" intro="For a related calculation" />`
- ABOVE `## Which Symbol Identifies the Population Standard Deviation?`
  `<RelatedLink to={routes.article('standard-deviation-excel')} label="Standard Deviation in Excel" intro="On a related note" />`
- ABOVE `## How Standard Deviation Symbols Appear in Formulas`
  `<RelatedLink to={routes.article('z-score')} label="Z-Score Explained" intro="Worth reading next" />`

**test-statistic**
- ABOVE `## Degrees of Freedom: What They Are and How to Find Them`
  `<RelatedLink to={routes.calculator('t-test')} label="t-test calculator" intro="For a related calculation" />`
- ABOVE `## The t-Distribution Table`
  `<RelatedLink to={routes.calculator('t-table')} label="t-table calculator" intro="Another helpful calculator is" />`
- ABOVE `## One-Tailed vs Two-Tailed Tests`
  `<RelatedLink to={routes.article('z-score')} label="Z-Score Explained" intro="On a related note" />`

**weighted-average**
- ABOVE `## Step-by-Step Calculation`
  `<RelatedLink to={routes.article('what-is-an-average')} label="What Is an Average" intro="Worth reading next" />`
- ABOVE `## Mean and Weighted Mean: Key Differences`
  `<RelatedLink to={routes.calculator('mean')} label="mean calculator" intro="For a related calculation" />`
- ABOVE `## Real-World Applications`
  `<RelatedLink to={routes.article('mean-vs-average')} label="Mean vs Average" intro="On a related note" />`

**what-is-an-average**  (4 callouts -- long article)
- ABOVE `## The Arithmetic Mean: The Core Average Definition`
  `<RelatedLink to={routes.article('mean-vs-average')} label="Mean vs Average" intro="Worth reading next" />`
- ABOVE `## Median: The Middle-Value Average`
  `<RelatedLink to={routes.article('median-vs-average')} label="Median vs Average" intro="On a related note" />`
- ABOVE `## Weighted Average: When Values Have Different Importance`
  `<RelatedLink to={routes.calculator('weighted-average')} label="weighted average calculator" intro="For a related calculation" />`
- ABOVE `## When to Use Each Type of Average`
  `<RelatedLink to={routes.calculator('average')} label="average calculator" intro="Another helpful calculator is" />`

**what-is-correlation**
- ABOVE `## A Fully Worked Example`
  `<RelatedLink to={routes.calculator('correlation-coefficient')} label="correlation coefficient calculator" intro="For a related calculation" />`
- ABOVE `## Correlation Meaning: Interpreting the Number`
  `<RelatedLink to={routes.article('correlation-vs-causation')} label="Correlation vs Causation" intro="Worth reading next" />`
- ABOVE `## How to Read a Correlation Table`
  `<RelatedLink to={routes.article('linear-regression')} label="Linear Regression Explained" intro="On a related note" />`

**z-score**
- ABOVE `## How to Calculate a Z-Score: Step-by-Step Example`
  `<RelatedLink to={routes.calculator('standard-deviation')} label="standard deviation calculator" intro="For a related calculation" />`
- ABOVE `## The Standard Normal Distribution`
  `<RelatedLink to={routes.calculator('normal-distribution')} label="normal distribution calculator" intro="Another helpful calculator is" />`
- ABOVE `## How to Use a Z-Score Chart`
  `<RelatedLink to={routes.article('z-table')} label="Z Score Table Explained" intro="Worth reading next" />`

**z-table**
- ABOVE `## How to Read the Z Score Table`
  `<RelatedLink to={routes.article('z-score')} label="Z-Score Explained" intro="Worth reading next" />`
- ABOVE `## Right-Tail and Two-Tail Probabilities`
  `<RelatedLink to={routes.calculator('normal-distribution')} label="normal distribution calculator" intro="For a related calculation" />`
- ABOVE `## Applying the Z Score Table to Any Normal Distribution`
  `<RelatedLink to={routes.article('probability-distribution')} label="Probability Distributions Explained" intro="On a related note" />`

### Part 2 -- Calculator teaching blocks  (`src/content/calculator-content/<slug>.mdx`)

Every block has the SAME structure (lead -> `## How to use this calculator` ->
`## Worked example` -> `## Frequently asked questions`). Insert TWO callouts per
block:
- Callout A: ABOVE `## Worked example` (closes the "How to use" section).
- Callout B: ABOVE `## Frequently asked questions` (closes the "Worked example"
  section).

(These blocks have no `---` separators, so the callout goes directly above the
heading per the global rule.) All 18 listed blocks need BOTH import lines added.

**average** -- A `<RelatedLink to={routes.article('what-is-an-average')} label="What Is an Average" intro="Worth reading next" />` | B `<RelatedLink to={routes.calculator('mean')} label="mean calculator" intro="Another helpful calculator is" />`

**binomial-distribution** -- A `<RelatedLink to={routes.article('probability-distribution')} label="Probability Distributions Explained" intro="Worth reading next" />` | B `<RelatedLink to={routes.calculator('probability')} label="probability calculator" intro="For a related calculation" />`

**combination** -- A `<RelatedLink to={routes.article('probability-formula')} label="Probability Formula Explained" intro="Worth reading next" />` | B `<RelatedLink to={routes.calculator('factorial')} label="factorial calculator" intro="For a related calculation" />`

**confidence-interval** -- A `<RelatedLink to={routes.article('z-score')} label="Z-Score Explained" intro="Worth reading next" />` | B `<RelatedLink to={routes.calculator('sample-size')} label="sample size calculator" intro="For a related calculation" />`

**correlation-coefficient** -- A `<RelatedLink to={routes.article('what-is-correlation')} label="What Is Correlation" intro="Worth reading next" />` | B `<RelatedLink to={routes.calculator('linear-regression')} label="linear regression calculator" intro="Another helpful calculator is" />`

**factorial** -- A `<RelatedLink to={routes.article('probability-formula')} label="Probability Formula Explained" intro="You may also find this useful" />` | B `<RelatedLink to={routes.calculator('combination')} label="combination calculator" intro="For a related calculation" />`

**frequency-table** -- A `<RelatedLink to={routes.article('frequency-table')} label="Frequency Tables Explained" intro="Worth reading next" />` | B `<RelatedLink to={routes.calculator('percentile')} label="percentile calculator" intro="For a related calculation" />`

**linear-regression** -- A `<RelatedLink to={routes.article('linear-regression')} label="Linear Regression Explained" intro="Worth reading next" />` | B `<RelatedLink to={routes.calculator('correlation-coefficient')} label="correlation coefficient calculator" intro="Another helpful calculator is" />`

**mean** -- A `<RelatedLink to={routes.article('mean-vs-average')} label="Mean vs Average" intro="Worth reading next" />` | B `<RelatedLink to={routes.calculator('average')} label="average calculator" intro="Another helpful calculator is" />`

**mean-absolute-deviation** -- A `<RelatedLink to={routes.article('mean-absolute-deviation')} label="Mean Absolute Deviation Explained" intro="Worth reading next" />` | B `<RelatedLink to={routes.calculator('standard-deviation')} label="standard deviation calculator" intro="For a related calculation" />`

**normal-distribution** -- A `<RelatedLink to={routes.article('z-table')} label="Z Score Table Explained" intro="Worth reading next" />` | B `<RelatedLink to={routes.calculator('z-score')} label="z-score calculator" intro="For a related calculation" />`

**percentile** -- A `<RelatedLink to={routes.article('frequency-table')} label="Frequency Tables Explained" intro="Worth reading next" />` | B `<RelatedLink to={routes.calculator('range')} label="range calculator" intro="For a related calculation" />`

**probability** -- A `<RelatedLink to={routes.article('probability-formula')} label="Probability Formula Explained" intro="Worth reading next" />` | B `<RelatedLink to={routes.calculator('binomial-distribution')} label="binomial distribution calculator" intro="For a related calculation" />`

**range** -- A `<RelatedLink to={routes.article('how-to-find-the-range')} label="How to Find the Range" intro="Worth reading next" />` | B `<RelatedLink to={routes.calculator('standard-deviation')} label="standard deviation calculator" intro="For a related calculation" />`

**standard-deviation** -- FIRST remove the existing demo callout line near the end
of the file (`<RelatedLink ... label="Try the variance calculator" ... />`), then
insert: A `<RelatedLink to={routes.article('standard-deviation-symbol')} label="The Standard Deviation Symbol" intro="Worth reading next" />` | B `<RelatedLink to={routes.calculator('variance')} label="variance calculator" intro="For a related calculation" />`
  <!-- standard-deviation.mdx already imports RelatedLink + routes -- keep those
  imports; only the trailing demo usage moves into the two woven positions. -->

**variance** -- A `<RelatedLink to={routes.article('standard-deviation-symbol')} label="The Standard Deviation Symbol" intro="Worth reading next" />` | B `<RelatedLink to={routes.calculator('standard-deviation')} label="standard deviation calculator" intro="Another helpful calculator is" />`

**weighted-average** -- A `<RelatedLink to={routes.article('weighted-average')} label="Weighted Average Explained" intro="Worth reading next" />` | B `<RelatedLink to={routes.calculator('average')} label="average calculator" intro="Another helpful calculator is" />`

**z-score** -- A `<RelatedLink to={routes.article('z-score')} label="Z-Score Explained" intro="Worth reading next" />` | B `<RelatedLink to={routes.calculator('z-table')} label="z-table calculator" intro="For a related calculation" />`

**z-table** -- A `<RelatedLink to={routes.article('z-table')} label="Z Score Table Explained" intro="Worth reading next" />` | B `<RelatedLink to={routes.calculator('normal-distribution')} label="normal distribution calculator" intro="For a related calculation" />`

**Constraints:**
- Stay in this repo; do not touch sibling folders.
- Do NOT edit `CLAUDE.md` (record everything in this file's Work Log instead).
- No new runtime dependencies. `src/calc/**` stays pure and untouched. No CSS
  changes.
- Every internal href goes through `routes` / `Link` / `RelatedLink` -- no raw
  `<a href="/...">` to internal pages (the link gate fails those). The map only
  uses `routes.article(...)` / `routes.calculator(...)`; do not alter targets.
- Do not change frontmatter, existing prose, existing inline `<Link>`, or
  `<StatCalc>` embeds. Callouts are purely additive (except the one
  standard-deviation calc-block demo line that is relocated, per above).
- Insert callouts ONLY where the map names them. Total expected:
  21 articles (20 with 3-4 each + the standard-deviation stub with 1) and
  19 calc blocks with 2 each.

**Definition of done / how to verify:**
- `npx astro check` -> 0 errors / 0 warnings / 0 hints.
- `npm test` -> all green.
- `npm run build` -> succeeds AND `scripts/check-links.mjs` reports
  "0 violations".
- Spot-check the built HTML:
  - `dist/frequency-table/index.html` (an article) contains 3 separate
    `.related-link-callout` blocks at distinct positions in the body (not all at
    the end), with the 3 distinct intro phrases from the map.
  - `dist/calculators/standard-deviation/index.html` (a calc block) contains
    exactly 2 `.related-link-callout` blocks (one before the worked-example
    heading, one before the FAQ heading) and NO leftover "Try the variance
    calculator" demo line.
  - Confirm no page renders two callouts back-to-back with no prose between them.
- Do NOT commit or push unless explicitly told; leave the working tree ready and
  set this task to `DONE` with a filled Work Log.

---

## Work Log  *(Codex writes -- what was actually done)*

- **Started:** 2026-06-26 19:52 Europe/Malta
- **Finished:** 2026-06-26 19:56 Europe/Malta

**What changed (files + where):**

- Added the required `RelatedLink` / `routes` imports and inserted all 63 mapped article callouts across the 21 named `src/content/articles/*.mdx` files.
- Added the required imports and inserted all 38 mapped calculator teaching-block callouts across the 19 named `src/content/calculator-content/*.mdx` files.
- Removed the old trailing `Try the variance calculator` demo callout from `src/content/calculator-content/standard-deviation.mdx` and replaced it with the two woven placements specified in the brief.
- Added the TASK-018 completion note to `AGENTS.md` work history.

**How to verify:**

- `npx astro check` -> 0 errors / 0 warnings / 0 hints.
- `npm test` -> 33 test files passed, 89 tests passed. First sandboxed run hit expected `spawn EPERM`; reran with process-spawn approval.
- `npm run build` -> build succeeded; `check-links: scanned 56 pages, checked 2048 internal links, found 0 violations`.
- Structural audit -> exactly 101 `<RelatedLink />` callouts, exactly one `RelatedLink` import and one `routes` import in each touched file, no leftover `Try the variance calculator`, and no adjacent callouts.
- Built HTML spot checks -> `dist/frequency-table/index.html` has 3 related-link callouts with the mapped intro phrases at distinct body positions; `dist/calculators/standard-deviation/index.html` has exactly 2 callouts before the worked-example and FAQ headings and no demo line; no built page renders callouts back-to-back.

**Blocked / couldn't do / decisions made:**

- `BUILD-PLAN.md` was referenced by `AGENTS.md` but was not present at the repo root; proceeded from `AGENTS.md`, `../Claude_OS/CODEX-WORKFLOW.md`, and the complete TASK-018 brief.
- Used a deterministic insertion script for the exact map because the patch tool was blocked by the Windows sandbox wrapper. No targets, phrasing, CSS, prose, frontmatter, calculator code, or `CLAUDE.md` were changed.

---

## Review  *(Claude writes -- accept or send back)*

- **Reviewed:** 2026-06-26 (Claude), verified against artifacts not just the Work Log.
- **Verdict:** ACCEPTED -> CLOSED.

**Notes / what to improve:**
- Insertion-only as briefed: all 40 MDX files carry exactly 1 `RelatedLink` import + 1
  `routes` import (no duplicates); 21 articles (20 x 3-4 + the standard-deviation stub
  x 1, by design) and 19 calc blocks x 2; no duplicate intro phrase on any single page.
- standard-deviation calc block: trailing variance demo removed and replaced by the two
  woven placements, per the brief.
- Targets all route through `routes.article(...)` / `routes.calculator(...)`; no raw
  internal `<a>` introduced.
- Gates green from clean state: `astro check` 0/0/0, `npm test` 33 files / 89 tests,
  `npm run build` 56 pages / 2048 internal links / **0 link violations**.
- AGENTS.md work-history append accepted (AGENTS.md's own standing note instructs it).
- Excluded the CRLF-only regenerated `src/lib/content-route-ids.ts` from the commit
  (content-neutral churn).
