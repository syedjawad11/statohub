# statohub.com SEO Playbook

The single rule book for every statohub article. The **stats-article-writer**
writes to it; the **stats-article-reviewer** scores against it. If a rule here
conflicts with anything else, this file wins — except the build contracts in §7,
which are hard (a violation breaks the build).

The site's wedge (from the SEO study): **teach the concept AND give the
calculator on the same page.** Calculator giants have tools with no teaching;
educators teach with no tools. Every article does both.

---

## 1. Length & depth
- **Minimum 2000 words** of substantive teaching. Not filler — every section
  earns its place.
- Cover the concept end to end: definition → why it matters → formula (where one
  applies) → a fully worked numeric example → common mistakes / FAQs.
- Depth beats padding. If a topic genuinely can't sustain 2000 words, it was
  mis-scoped — flag it back, don't pad.

## 2. Keywords (semantic, natural, no cannibalization)
- Use **every keyword in the brief**, worked in **naturally**. No stuffing, no
  awkward verbatim repetition. Aim for semantic coverage — synonyms, related
  sub-topics, the questions a learner actually asks.
- The **primary keyword** appears in the **title (which the layout renders as the
  page's only H1) and the first 100 words** of the body, then naturally
  thereafter.
- **One keyword → one article.** Never target a keyword the brief didn't assign —
  it belongs to another article (the DB enforces this; respect it in prose too).
- Tool-intent keywords (e.g. "… calculator") live on the standalone calculator
  page, **not** the article. The article carries the *embedded* widget instead.

## 3. Voice & tone
- **Active voice.** "Subtract the mean from each value," not "the mean is
  subtracted from each value."
- **Educational and informational.** You are a patient teacher, not a marketer.
  No hype, no hard sell, no "in today's fast-paced world" filler.
- **Easy to read.** Short paragraphs (2–4 sentences). Plain language first, then
  the technical term. Define jargon on first use.
- **Readability target ~grade 8–10** as a *soft guide-rail*, not a hard gate.
  Statistics terms and formulas inflate automated grade scores, so a clear stats
  article may score grade 11–12 by the raw number — that's fine. The reviewer
  flags genuinely tangled prose, not every formula.

## 4. Structure (semantic MDX)
- The page title (from frontmatter) is the **only H1** — `ArticleLayout` renders
  it automatically above the body. **Never write an H1 in the MDX body** (no
  `# Heading` and no `<h1>`). A body H1 duplicates the title and trips
  duplicate-H1 SEO audits (Ahrefs flags it). **Start the body at H2** and nest H3
  below it — no skipped levels, no decorative headings.
- Lead with a short answer / definition so a reader (and an AI overview) gets the
  gist in the first paragraph.
- Include **at least one fully worked example** with real numbers.
- Add an **FAQ block** (H2 "Frequently Asked Questions" + H3 questions) where the
  keyword set contains question-phrased queries — it maps cleanly to those
  keywords and earns FAQ rich results.
- Embed the **`<StatCalc>`** component where the brief assigns a calculator,
  placed right after the formula/worked-example section ("try it yourself").

## 5. External links & evidence (E-E-A-T)
- **At least one external link** to a reliable, authoritative source — prefer
  `.gov`, `.edu`, NIST/SEMATECH, peer-reviewed or a recognised standards body
  (e.g. the NIST/SEMATECH e-Handbook of Statistical Methods). Open-access
  textbooks and official documentation are acceptable.
- **Never fabricate** statistics, study results, citations, or quotes. If you
  state a figure, it must be either a worked example you computed or sourced from
  a real, linkable reference.
- Show formulas and make examples reproducible (a reader can follow the numbers).
- Definitions should be precise and consistent with standard usage.

## 6. Internal linking
- Link to related statohub articles using the brief's suggestions and your
  judgment — spokes link to their category pillar; pair each article with its
  calculator ("Learn how it works" ⇄ "Try the calculator").
- **All internal links go through the typed registry** — use the `Link`
  component / `url(id)` helper. **Never hand-type an internal href.** This is a
  build contract (§7).

## 7. statohub build contracts (HARD — a violation breaks the build)
- **Frontmatter must satisfy `src/content/config.ts`:** `title`, `description`
  (meta description), `category` (a real category slug), `primaryKeyword`,
  `keywords` (array, all from the brief), `phase` (1|2|3), `calculator` (the
  embed slug, when assigned), optional `related`, and `draft: true`.
- **`draft: true`** until the reviewer passes it and a human flips it. Unfinished
  articles never ship.
- **Flat trailing-slash URLs**, primary-keyword-only slug, no category in the
  path (`/parameter-vs-statistic/`).
- **Internal links only via `Link` / `url(id)`.** `scripts/check-links.mjs` fails
  the build on any broken or non-slash internal link.
- Do **not** hand-roll canonical/OG/schema tags — the TASK-006 SEO components
  emit them automatically from frontmatter.
- **No raw LaTeX / KaTeX math.** The site has no math renderer configured, and
  MDX parses `{` as a JavaScript expression — so `$$\dfrac{...}$$` or any `\cmd{}`
  **breaks the build** (`Could not parse expression with acorn`). Write formulas
  as **fenced code blocks** using plain Unicode math symbols (σ, μ, x̄, Σ, √, ²,
  ≈, ±, ≤, ÷, subscripts like xᵢ). Example:
  ````
  ```
  s = √( Σ(xᵢ − x̄)² / (n − 1) )
  ```
  ````
  Inside a fenced block, braces and backslashes are literal and safe. Inline math
  uses backticks (`` `n − 1` ``). (KaTeX support is a possible future enhancement;
  until it ships, formulas must be MDX-safe.)

## 8. Reviewer pass/fail checklist (score /100)
A draft **passes** only if all hard items hold; soft items inform the score.

Hard (any failure → CHANGES_REQUESTED):
1. ≥ 2000 words of real teaching.
2. Every brief keyword present and used naturally (no stuffing).
3. Primary keyword in title (= page H1) + first 100 words of the body. **No H1
   in the MDX body** — body starts at H2.
4. ≥ 1 authoritative external link that actually resolves.
5. No fabricated statistics/citations.
6. Frontmatter valid per `src/content/config.ts`; `draft: true`.
7. Internal links use `Link`/`url()`; no hand-typed or non-slash hrefs.
8. No keyword owned by another article (cannibalization).

Soft (shape the score, flag for improvement):
- Active-voice ratio, readability, tone.
- Worked example quality; FAQ where warranted.
- E-E-A-T signals (sourced definitions, reproducible math).
- Absence of AI-writing tells (see the `content-quality-editor` agent for the
  optional final polish pass).
