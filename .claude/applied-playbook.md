# statohub.com Applied Statistics Playbook

The rule book for every article in the **Applied Statistics** section (category
`section: applied` — Data Analysis, Experiments & Causality, Forecasting &
Time Series, Machine Learning Statistics). This is a **delta doc** on top of
`.claude/seo-playbook.md`, which governs **Learn**. Any rule not restated here
— voice fundamentals, YMYL accuracy verification, no raw LaTeX,
internal-links-via-registry-only, the 110–160 char meta description, `draft:
true` gating, no fabrication, no keyword cannibalization, the build contracts
in seo-playbook §7 — is **inherited unchanged**. Where this file states a
number or rule that differs from seo-playbook, this file wins for Applied.

An article's section comes from its **category**, never its own frontmatter:
`src/pages/[slug]/index.astro` reads `categoryEntry.data.section` and swaps
`ArticleLayout` for `AppliedArticleLayout`. Assign one of the four Applied
categories and the layout, breadcrumb and TOC follow automatically.

### Three tiers (same model as seo-playbook)
- **[HARD]** — blocks publish; reviewer returns CHANGES_REQUESTED.
- **[WARN]** — logged and annotated, never blocks. Fix when reasonable.
- **[ADVISORY]** — stylistic nudges, reported only.

---

## 1. The calculator exemption (ADR-0015 — read this first)

**Applied articles are exempt from the wedge's required-calculator rule.**
[[0015-wedge-scoped-to-learn]] scopes [[0001-wedge-model]]'s embed requirement
to Learn and the standalone calculator pages — it does not govern Applied.
`calculator` stays optional in `src/content/config.ts` and most Applied
articles should leave it unset; never force a contrived embed (a mean
calculator on an A/B-test-design article) to satisfy it.

**A reviewer that flags an Applied article for "missing a calculator" is
wrong** — point it at [[0015-wedge-scoped-to-learn]]. Applied reinforces the
wedge *indirectly*, by linking out to the Learn article and calculator page
for the underlying method (§7). A genuine calculator match may still be
embedded when it adds real value; it just isn't mandatory.

## 2. Length & scope
- **3,000–4,500 words** [HARD floor at 3,000; WARN below 3,200 or above
  4,800]. Word count is body prose; components don't inflate it artificially,
  but the prose around them counts.
  - **Exception — the outsource pillar floor is 1,500**, not 3,000, applying
    *only* to articles coming through `outsource-content/`; internally written
    ones keep the 3,000 floor. Padding a short vendor draft would violate the
    no-fabrication rule below. Enforced by `OUTSOURCE_WORD_FLOOR` in
    `outsource-content/check_sanitized.py`; rationale and cost in
    [[0019-outsource-word-floor]].
- **Practitioner-focused**: the reader applies a method on the job (analyst,
  experimenter, forecaster, ML engineer), not a first-time learner. Assume
  they know what a p-value or confidence interval is; teach *how to use it in
  a real workflow*, and link to the Learn article for the ground-up
  definition (§7).
- **Evidence-backed, no fabrication [HARD].** Every claim, threshold, or
  worked figure is either computed with shown work or sourced from a real,
  linkable reference in `## Sources`. Never invent a statistic, case study,
  company name, dataset, or quote. Depth beats padding — if a topic can't
  sustain 3,000 words of real guidance, it was mis-scoped; flag it back.

## 3. Voice & tone
- **Practitioner playbook, not a lecture.** Second person, active voice,
  direct instructions ("compute PSI on a rolling 7-day window," not "PSI can
  be computed..."). More operational than Learn's "patient teacher" register.
- Definition-first opening: the first sentence/paragraph states plainly what
  the topic is, independently extractable for an AI overview or snippet.
- Short paragraphs (2–4 sentences), plain language before jargon, terms
  defined on first use despite the more advanced reader.
- No hype, no "in today's fast-paced world" filler, no manufactured urgency.

## 4. Structure
- **Exactly one H1 [HARD]**, same as Learn: frontmatter `title` (or `h1`
  override) is the only H1, rendered by `AppliedArticleLayout`. Never write
  an H1 in the MDX body — start the body at H2.
- **`<KeyTakeaways>` before the first H2 [HARD]** — the above-the-fold
  extractable summary; only a short lead-in paragraph may precede it.
- **No skipped heading levels [WARN]**, H2 → H3 in order. Unlike Learn
  (`ArticleLayout`'s TOC is H2-only), `AppliedArticleLayout`'s
  `<TableOfContents>` auto-derives from **both H2 and H3** via
  `rendered.headings` — genuinely nested H3s are visible in the rail nav.
- **Required modules, at least once each [HARD]:**
  1. `<KeyTakeaways>` before the first H2.
  2. At least one `<DataTable>`.
  3. At least one `<Checklist>`.
  4. At least one `<Figure>`-wrapped infographic (§6).
  5. Literal `## Sources` H2 with **≥ 6** resolving external links.
  6. Literal `## FAQ` H2 with **≥ 3** `<FAQ>` entries.
- Write `## Sources` / `## FAQ` as literal markdown H2s so remark's heading
  extraction sees them for the TOC — `Sources.astro`/`FAQ.astro` render the
  body beneath the heading you write.
- `<Callout>` (tip/note/quote) is available, not required — use it where a
  pull-quote or pro-tip earns its place [ADVISORY target: 2–4 per article].

## 5. Module components — `src/components/applied/`

Import from `src/content/articles/*.mdx` the same way Learn articles do:
`import X from '../../components/applied/X.astro';`.

Available: `KeyTakeaways`, `Callout`, `Checklist`, `DataTable`, `Sources`,
`FAQ`, `Figure`. **The prop interfaces are the `.astro` files themselves** —
read the component before using it rather than trusting a copy here, and never
invent a prop. Confirmed live usage of every module and infographic is in
`src/pages/dev/applied-preview/index.astro`.

`TableOfContents` is used internally by `AppliedArticleLayout` — never
hand-author one in article MDX.

Usage shape (KeyTakeaways before the first H2; `## Sources` / `## FAQ` under
their literal headings):

```mdx
<KeyTakeaways rows={[
  { point: 'What it is', details: 'One sentence, extractable on its own.' },
  { point: 'Why it matters', details: 'The practical cost of ignoring it.' },
  { point: 'How to check it', details: 'The concrete method or test.' },
  { point: 'When to act', details: 'The threshold that triggers action.' },
]} />

## Sources
<Sources items={[
  { text: 'NIST/SEMATECH e-Handbook of Statistical Methods', href: 'https://www.itl.nist.gov/div898/handbook/', org: 'NIST' },
  // ... at least 6 total
]} />

## FAQ
<FAQ items={[
  { question: 'What is X?', answer: 'A direct, self-contained answer.' },
  // ... at least 3 total
]} />
```

## 6. SVG infographics — `src/components/applied/infographics/`

Static SSG SVG, prop-driven, theme-aware via CSS custom properties — never
hand-write markup or hex colors. Available: `ProcessFlow`, `TaxonomyTree`,
`ComparisonMatrix`, `DecisionTree`, `Scorecard`, `AnnotatedChart`. Import each
directly (never `_SvgFrame`, which is internal); prop interfaces are the source
files.

Every component requires `title`/`desc` (the accessible SVG `<title>`/`<desc>`).
Always wrap in `<Figure>`, whose `caption` is a separate visible string:

```mdx
<Figure number={1} caption="Two-step pipeline from data collection to response.">
  <ProcessFlow title="Pipeline" desc="Two connected steps: collect data, then respond."
    steps={[{ label: 'Collect data', detail: 'Freeze reference and comparison windows.' }]} />
</Figure>
```

`Scorecard`'s `status` drives color via the `--status-pass/warn/fail/critical`
tokens — use it for genuine severity data, not decoration. One infographic
satisfies the HARD requirement; a normal article uses 1–2.

## 7. External links, evidence & internal linking
- **≥ 6 resolving external links in `## Sources` [HARD]**, same curl-check
  gate as Learn's broken-link check. Aim for 8–12 given the length [WARN
  below 8].
- Same sourcing bar as Learn (seo-playbook §5): `.gov`/`.edu`, NIST/SEMATECH,
  peer-reviewed work, recognised standards bodies (NIST, ISO, IEEE, arXiv,
  MITRE ATLAS), or official/vendor-neutral engineering docs when the topic is
  inherently applied (e.g. MLOps monitoring docs). Verify a claim against its
  source before writing it, never after.
- Descriptive anchor text [WARN] — never a bare URL or "click here."
- **Internal links ONLY via `Link` / `routes.*` / `url()` [HARD, build
  contract] — never a hand-typed `href`.** Same as Learn;
  `scripts/check-links.mjs` fails the build on any violation regardless of
  section.
- **Link into Learn for underlying concepts.** Since Applied skips the
  calculator embed (§1), the wedge is reinforced by linking prose terms
  ("chi-square test," "confidence interval") to their Learn article or
  calculator via `routes.article(id)` / `routes.calculator(id)`. This is the
  required mechanism — zero inbound links to Learn/calculators is under-linked.
- **No woven `<RelatedLink>` requirement (difference from Learn).**
  `AppliedArticleLayout` auto-renders a "Build on this guide" grid from
  `related` frontmatter (plus `calculator`, if set) — Applied's automatic
  equivalent of Learn's mandatory woven callouts. Inline `<RelatedLink>` is
  still fine where a mid-paragraph pointer helps [ADVISORY]. Populate
  `related: [...]` with real published article ids (Learn siblings for depth,
  Applied siblings for adjacent topics) — never reference a draft.

## 8. Frontmatter & build contracts (inherited, HARD)

Same `src/content/config.ts` `articles` schema as Learn — `title`,
`description` (110–160 char meta description), `category` (an Applied slug:
`data-analysis`, `experiments-causality`, `time-series-forecasting`,
`machine-learning-statistics`), `primaryKeyword`, `keywords`, `phase`,
optional `calculator` (leave unset per §1 unless a real match exists),
optional `h1`, `related`, and `draft: true` until reviewed. No `section`
field exists on the article — get the category right and the layout follows.

- **`draft: true`** until reviewed. Draft articles produce zero static paths
  (filtered before `getStaticPaths()`), so validate via
  `src/pages/dev/applied-preview/index.astro` or a temporary import, never by
  expecting a real URL to render.
- **Flat file placement [HARD, load-bearing].** The `.mdx` sits flat in
  `src/content/articles/`, never a subfolder — `articles/applied/foo.mdx`
  would silently produce `/applied/foo/` instead of `/foo/` with no compile
  error ([[0014-applied-section-url-family]]). Flat `/{slug}/` at the root,
  exactly like Learn — never `/blog/{slug}/` or `/applied/{slug}/` (an older,
  superseded proposal).
- **No raw LaTeX/KaTeX**; don't hand-roll canonical/OG/schema tags —
  `AppliedArticleLayout` and `<FAQ>`'s `faqPageSchema()` emit them from
  frontmatter and the FAQ array.

## 9. Reviewer pass/fail checklist (score /100)

Verdict is driven by the **HARD** tier only, same rule as seo-playbook §8: any
HARD failure → CHANGES_REQUESTED. WARN/ADVISORY shape the score, reported as
a fix-list, never flip the verdict alone.

**HARD (any failure → CHANGES_REQUESTED):**
1. 3,000–4,500 words of real practitioner prose (3,000 is a floor; the
   outsource pillar's floor is 1,500 instead — see §2 and
   [[0019-outsource-word-floor]]).
2. `<KeyTakeaways>` present before the first H2.
3. At least one each of `<DataTable>`, `<Checklist>`, `<Figure>`-wrapped
   infographic.
4. Literal `## Sources` H2 with ≥ 6 resolving external links (curl-checked).
5. Literal `## FAQ` H2 with ≥ 3 `<FAQ>` entries.
6. Exactly one H1 (frontmatter only; no H1 in the MDX body).
7. No fabricated statistics, studies, case studies, or citations.
8. Category resolves to one of the four Applied slugs; frontmatter valid per
   `src/content/config.ts`; file sits flat in `src/content/articles/`;
   `draft: true`.
9. No hand-typed internal hrefs — `Link`/`routes.*`/`url()` only.
10. No raw LaTeX; meta description 110–160 characters; no keyword owned by
    another article.
11. **Not flagged for a missing calculator.** A reviewer citing a missing
    `<StatCalc>` as a defect on an Applied article is itself wrong per
    [[0015-wedge-scoped-to-learn]] — never let that block publish.

**WARN (lower the score, list as a fix, never block):**
- Words < 3,200 or > 4,800.
- Fewer than 8 external links in Sources (6 is the HARD floor).
- < 8 internal links into Learn articles/calculators — the wedge-
  reinforcement mechanism for this section (§7).
- Any FAQ answer under 40 or over 140 words.
- H2 count outside roughly 8–14; a skipped heading level.
- `related` frontmatter empty or pointing at a draft.

**ADVISORY (note only):**
- Fewer than 2 `<Callout>` uses; only one infographic type used across a
  multi-infographic article.
- Self-contained-passage spot check: does each H2 read standalone without the
  rest of the page (the core GEO citability test)?
- AI-writing tells — folded into the reviewer's own scoring pass; there is no
  separate editor agent.
