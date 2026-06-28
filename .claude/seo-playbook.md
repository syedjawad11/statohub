# statohub.com SEO Playbook

The single rule book for every statohub article. The **stats-article-writer**
writes to it; the **stats-article-reviewer** scores against it. If a rule here
conflicts with anything else, this file wins — except the build contracts in §7,
which are hard (a violation breaks the build).

The site's wedge (from the SEO study): **teach the concept AND give the
calculator on the same page.** Calculator giants have tools with no teaching;
educators teach with no tools. Every article does both.

### How rules are enforced — three tiers

Not every rule is equal. The pipeline (the mechanical QA gate in
`content-ops/cloud-routine/publish-next-article.md` and the reviewer) sorts every
SEO check into one of three tiers. Each rule below is tagged with its tier.

- **[HARD]** — objective indexing / accessibility / build breakers. **Blocks
  publish** (non-zero exit; reviewer returns CHANGES_REQUESTED). Examples: exactly
  one H1, primary keyword in `<title>`, title present and not truncated, meta
  description present, slug contains the primary keyword, no broken external link,
  plus the §7 build contracts.
- **[WARN]** — soft ranking signals. **Logged and annotated, never blocks.** Fix
  when reasonable. Examples: too few external links, primary keyword missing from
  the first 100 words, generic/bare-URL anchor text, a skipped heading level,
  keyword stuffing in headings, title length outside the ideal range.
- **[ADVISORY]** — stylistic nudges. **Reported only.** Examples: a shorter `h1`
  variation vs the SEO title, exact-match keyword in the H1, link distribution
  beyond the minimum, semantic/related-keyword coverage.

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
- The **primary keyword** appears in the **`<title>`** **[HARD]** — exact phrase or
  all of its significant words, so natural variation is fine ("What Is an Average?"
  satisfies the keyword "what is the average"). It should also appear in the **first
  ~100 words** of the body **[WARN]**, then naturally thereafter.
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
- **Exactly one H1 [HARD].** The page title (from frontmatter) is the only H1 —
  `ArticleLayout` renders it automatically above the body. **Never write an H1 in
  the MDX body** (no `# Heading` and no `<h1>`). A body H1 duplicates the title and
  trips duplicate-H1 SEO audits (Ahrefs flags it). **Start the body at H2** and nest
  H3 below it.
- **No skipped heading levels [WARN].** Go H2 → H3 → H4 in order; never jump H2 → H4.
  No decorative headings, and don't cram the primary keyword into many headings
  (keyword stuffing in headings is a **[WARN]**).
- **Optional shorter `h1` [ADVISORY].** The SEO `title` doubles as the visible H1 by
  default. If the `title` is long (~60+ chars) or keyword-front-loaded for the SERP,
  you MAY add an `h1: "<cleaner headline>"` frontmatter field — the layout renders it
  as the visible H1 while `title` still drives the `<title>` tag and metadata. Omit
  it to keep `title` as the H1 (backward-compatible).
- Lead with a short answer / definition so a reader (and an AI overview) gets the
  gist in the first paragraph.
- Include **at least one fully worked example** with real numbers.
- Add an **FAQ block** (H2 "Frequently Asked Questions" + H3 questions) where the
  keyword set contains question-phrased queries — it maps cleanly to those
  keywords and earns FAQ rich results.
- Embed the **`<StatCalc>`** component where the brief assigns a calculator,
  placed right after the formula/worked-example section ("try it yourself").

## 5. External links & evidence (E-E-A-T)
- **No broken external links [HARD].** Every outbound link must resolve (no 4xx/5xx).
  The gate curl-checks each one; a dead link blocks publish. (A link that's merely
  unreachable from the build sandbox — no response at all — is a warning, not a
  block, since that's a sandbox-egress issue, not a bad link.)
- **At least one authoritative external link [HARD floor]; aim for two [WARN].** One
  reliable source (`.gov`, `.edu`, NIST/SEMATECH, peer-reviewed, or a recognised
  standards body — the NIST/SEMATECH e-Handbook is a safe default; open-access
  textbooks and official docs are fine) is the minimum the build tolerates. The
  **target for a teaching article is two** (editorial/round-up pieces lean toward
  three) — e.g. NIST plus a university stats page. Fewer than the soft target is a
  **[WARN]**, not a block.
- **Descriptive anchor text [WARN].** Anchor text must describe the destination —
  `[NIST/SEMATECH e-Handbook, Measures of Scale](…)`, never a bare URL
  `[https://…](https://…)` and never "click here" / "source" / "read more" / "this".
- **Distribute links naturally [ADVISORY].** Place each link in the section it
  supports (a definition, a method, a formula); don't pile them all into the final
  line.
- **Verify before you write — accuracy first (YMYL) [HARD on fabrication].** When you
  explain a formula, distribution, hypothesis test, regression model, probability
  concept, or any technical claim, ground it in an authoritative academic /
  governmental / official source (NIST handbook, a university statistics department,
  a peer-reviewed text) and confirm your statement matches it **before** writing.
  **Never fabricate** statistics, study results, citations, or quotes — a fabricated
  figure or citation is a hard fail. Every figure is either a worked example you
  computed or one sourced from a real, linkable reference.
- Show formulas and make examples reproducible (a reader can follow the numbers).
- Definitions should be precise and consistent with standard usage.

## 6. Internal linking
- Link to related statohub articles using the brief's suggestions and your
  judgment — spokes link to their category pillar; pair each article with its
  calculator ("Learn how it works" ⇄ "Try the calculator").
- **All internal links go through the typed registry** — use the `Link`
  component / `url(id)` helper. **Never hand-type an internal href.** This is a
  build contract (§7).
- **Woven related-link callouts (REQUIRED, the site standard).** In addition to
  inline prose links, every article carries **3–4 `<RelatedLink>` callouts woven
  through the body — never dumped at the end.** Place roughly one after every 2–3
  H2 sections so they distribute across the page. Import
  `import RelatedLink from '../../components/RelatedLink.astro';` and write each as
  `<RelatedLink to={routes.calculator('percentile')} label="percentile calculator" intro="For a related calculation" />`.
  The `to=` target must be a typed route to a page that **exists now** (standalone
  calculator, calculators hub, or a **published** sibling article — never a draft).
  The `intro` must **vary across the page** and come only from the approved pool —
  "Worth reading next", "On a related note", "You may also find this useful", "For
  a related calculation", "Another helpful calculator is", "See also" — and never
  repeat on one page. You may omit `intro`; the component then auto-rotates a varied
  phrase from that same pool per route. This is separate from the auto-generated
  "related calculators" sidebar — do not skip it. (HARD: at least one woven callout;
  WARN: fewer than 3, or an off-pool / repeated intro.)

## 7. statohub build contracts (HARD — a violation breaks the build)
- **Frontmatter must satisfy `src/content/config.ts`:** `title`, `description`
  (meta description), `category` (a real category slug), `primaryKeyword`,
  `keywords` (array, all from the brief), `phase` (1|2|3), `calculator` (the
  embed slug, when assigned), optional `h1` (shorter visible headline), optional
  `related`, and `draft: true`.
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
The verdict is driven by the **HARD** tier only: a draft returns
**CHANGES_REQUESTED** if (and only if) any HARD item fails. WARN and ADVISORY items
shape the score and are reported as a fix-list, but they **never** flip the verdict
to CHANGES_REQUESTED on their own.

**HARD (any failure → CHANGES_REQUESTED):**
1. Exactly one H1 — the frontmatter title; **no H1 in the MDX body** (body starts at H2).
2. Primary keyword present in the `<title>` (exact phrase or all significant words).
3. `<title>` present and not truncated (≤ ~70 chars; ~50–60 ideal).
4. Meta `description` present.
5. Slug contains the primary keyword (a clean variant is fine).
6. No broken external link (every outbound URL resolves; no 4xx/5xx).
7. ≥ 1 authoritative external link present.
8. ≥ 2000 words of real teaching.
9. No raw LaTeX; no hand-typed/non-slash internal hrefs (`Link`/`url()` only); valid
   frontmatter per `src/content/config.ts`; `draft: true`.
10. No fabricated statistics/citations; no keyword owned by another article
    (cannibalization).

**WARN (lower the score, list as a fix — do not block):**
- Fewer than the soft external-link target (teaching ≥ 2, editorial ≥ 3).
- Primary keyword missing from the first ~100 words.
- Generic or bare-URL anchor text.
- Skipped heading level (e.g. H2 → H4); keyword stuffing in headings.
- Title or meta-description length outside the ideal range.
- Active-voice ratio, readability, tone; worked-example quality; FAQ where warranted.

**ADVISORY (note only):**
- A shorter `h1` variation vs the SEO title; exact-match keyword in the H1.
- Link distribution beyond the minimum; semantic/related-keyword coverage.
- AI-writing tells (see the `content-quality-editor` agent for the optional final
  polish pass).
