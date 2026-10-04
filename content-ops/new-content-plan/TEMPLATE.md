# Content-plan article template

The binding structure for every article the content-plan routine writes, in
**both** sections ([[0028-content-plan-daily-routine]]). It copies the shape of
the live babylovegrowth Applied articles, because that shape is what carries
the site's SEO and GEO (AI-answer) structure. Reference files, in order:
`src/content/articles/normality-tests.mdx`, `k-fold-cross-validation.mdx`,
`feature-scaling-explained.mdx`. Copy their imports and component syntax; read a
component's `.astro` file before using a prop you have not seen in them.

Rules not restated here (sourcing bar, no fabrication, no raw LaTeX, internal
links only via `Link` + `routes.*`, meta 110–160 chars, flat file placement)
come from `.claude/applied-playbook.md`. Where the playbook and this file
disagree, this file wins for content-plan articles: **length** and **no
calculator embed**.

## Length

Target the brief's `est_words` of body prose; the floor is **1,500**
(`check_sanitized.py`). Never pad to reach a number. If the topic cannot fill
the floor honestly, stop and report it as mis-scoped.

## Frontmatter

```yaml
title: "<primary keyword first>: <plain qualifier>"   # ≤ 49 chars (+ " | Statohub" ≤ 60)
h1: "<concrete hook headline>"                          # optional; omit if it adds nothing
description: "<110–160 chars, contains the primary keyword verbatim>"
category: <hub slug from the brief>
primaryKeyword: <primary keyword, lowercase>
keywords:
  - <primary keyword>
  - <every secondary keyword from the brief>
phase: 1
related:
  - <links_up_to parent, if published>
  - <up to 2 more PUBLISHED slugs, same hub first>
draft: true
```

No `calculator`, `ogImage`, `pubDate`, `updatedDate` or `reviewedDate` (the
reviewer sets the dates when it publishes). No dollar figures, sample counts or
audience tags ("for Students") in `title`.

## Body, in this order

1. **Imports**: the applied components used (`KeyTakeaways`, `Checklist`,
   `DataTable`, `Sources`, `FAQ`, `Figure`, `Callout`), each infographic used
   (`../../components/applied/infographics/X.astro`), `Link`, `routes`.
2. **Answer paragraph** (no heading, 3–5 sentences). The first sentence defines
   the topic and contains the primary keyword; the paragraph answers the main
   question on its own, so it can be lifted into a snippet or AI overview.
3. **`<KeyTakeaways>`**: 4–5 rows of `point` + one-sentence `details`.
4. **`## Quick Checklist: <task phrased for the reader>`** + `<Checklist>`
   (4–6 items, each with `detail`), then one or two sentences of framing.
5. **Core sections: 5–8 H2s, phrased as the questions people search** ("What
   Is…", "How Do You…", "When Should You…", "Why Does…"). Each one:
   - opens with a one- or two-sentence direct answer;
   - reads on its own, without the rest of the page (the GEO test);
   - uses H3s only for real sub-steps;
   - cites claims inline with a descriptive anchor to the external source.
   Across these sections, use **at least one `<DataTable>`** (comparisons,
   formulas side by side, thresholds) and **2–4 `<Callout>`s** (`tip` with
   "Pro tip", or `quote` with a real, sourced quote and `sourceHref`).
   Comparison page types lead with the comparison table; software walkthroughs
   give one H2 per tool.
6. **`## A Worked Example: <concrete scenario>`**: numbered steps with every
   number computed and shown (fenced code block with plain Unicode math for
   formulas), ending in a decision. Put the **`<Figure>`-wrapped infographic**
   here or in a core section (`ProcessFlow`, `TaxonomyTree`,
   `ComparisonMatrix`, `DecisionTree`, `Scorecard`, `AnnotatedChart`); its
   values must come from the text.
7. **Software section** when the brief lists software: real function names and
   short fenced code (Excel formulas, Python, R, SPSS menus) that you have
   checked against official docs.
8. **`## Common Mistakes …`** (or "What Analysts Often Get Wrong About …"):
   3–6 bolded-lead bullets, each with the fix.
9. **`## Statohub's Take on <topic>`**: 2–4 sentences of editorial position, as
   an opinion ("Statohub's position is…"). No invented experience, clients,
   projects or numbers.
10. **`## Put <topic> to Work With Statohub's Tools`**: one paragraph linking,
    via `Link` + `routes.*`, the hub (`routes.categoryHub(...)`, or
    `routes.appliedLanding()` for Applied), the parent article, and the
    matching calculator page (`routes.calculator(...)`), linked, never
    embedded, plus `routes.calculatorsHub()`.
11. **`## Sources`** + `<Sources>`: 8–12 entries (6 is the hard floor), each a
    page you fetched that says what you cite it for. Every Sources entry should
    also be cited inline somewhere above.
12. **`## FAQ`** + `<FAQ>`: 5–6 question-cased entries (40–140 words each)
    that target secondary keywords and People-Also-Ask phrasing and do not
    repeat a section verbatim.
13. **`## Recommended`**: 4 bullets of `<Link>`s to **published** articles or
    calculator pages, not already in `related`.

## Links

- Internal: 8+ links into published articles and calculator pages, woven
  through the prose. Never link a draft or a planned slug; check that
  `src/content/articles/<slug>.mdx` exists with `draft: false`, or that the
  calculator exists in `src/content/calculators/`.
- External: descriptive anchor text, never a bare URL or "click here". Sources
  are `.gov`/`.edu`, NIST/SEMATECH, peer-reviewed work, standards bodies, or
  official software docs.

## Never

- `<StatCalc>` or `calculator:` frontmatter, in either section.
- An H1 in the body, raw LaTeX, `{`/`}` in prose (MDX reads them as JS), images.
- A statistic, study, quote, dataset, company or case study you cannot cite.
