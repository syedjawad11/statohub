# Phase 2 Content Briefs — Complete Set (30 Articles)

**Type:** Planning deliverable — content briefs only, no drafted prose.
**Generated:** 2026-07-09, from `18-phase2-final-content-map.md` (source of truth for
keywords, categories, and guards) and `08-site-architecture.md` (URL model, dual-calculator
rule). Assembled from two drafting passes (`19-phase2-content-briefs-batch1.md` and
`20-phase2-content-briefs-batch2.md`) into this single file for handoff.
**Scope:** All 30 articles from the locked Phase 2 content map — Articles 1–15 are the
keyword-validated set (8 solid + 7 thin) in locked write-priority order; Articles 16–30 are
the structural-only hub (1) and topical-authority-only articles (14), which carry no
confirmed keyword data by design (see each brief's Keywords section). Order for 1–15 is
binding; order for 16–30 follows file 18 §§1–4/§8 grouping, not a priority ranking.
**Site conventions applied:** articles at `src/content/articles/*.mdx`, target ≥2000 words
for keyword-validated articles (topical-authority/structural articles may run shorter — see
individual targets), flat URL `/{slug}/` (no category segment in path, category is metadata
only), no raw LaTeX, required frontmatter (`title`, `draft`, optional `h1`, `related`,
`category`).

**Legend:**
- "Internal links — required (guard)" = pulled directly from a binding guard in file 18. Do
  not drop these.
- "Internal links — recommended (non-binding)" = sensible links suggested by topical
  adjacency but not mandated by any file-18 guard; writer/editor discretion.
- All keyword figures are copied verbatim from file 18 — no figure in this document has been
  invented, rounded, or estimated differently from the source. Articles 16–30 have no
  confirmed keyword data at all; their briefs say so explicitly rather than inventing a
  number.

---

## Part 1: Keyword-Validated Articles (1–15)


## 1. B07 — Types of Variables: Qualitative vs. Quantitative

- **Slug:** `/types-of-variables/`
- **Category:** Foundations Hub (`/statistics-basics/`)
- **Target word count:** 2,200
- **Status:** Keyword-validated

### Frontmatter (suggested)
```
title: "Types of Variables: Qualitative vs. Quantitative"
h1: "Types of Variables"
draft: true
category: "Foundations Hub"
related: ["levels-of-measurement"]
```

### Keywords (source: file 16 B07 — highest single-keyword volume in the entire study batch)
- Primary: "qualitative vs quantitative" — 40,500 / KD 26
- Supporting: "quantitative vs qualitative" — 27,100 / KD 29
- Supporting: "qualitative vs quantitative research" — 5,400 / KD 26
- Supporting: "discrete vs continuous variables" — 5,400 / KD 5

### Search intent & reader question
Informational, comparison intent. Reader question: "What's the difference between
qualitative and quantitative data, and which type is my variable?" Likely a stats-101
student needing to classify a variable before choosing a test or chart type.

### Section-by-section outline
1. **Introduction** (~150 words) — hook with a relatable dataset (a class survey), state the
   two-way split up front, promise a classification framework by the end.
2. **What Is a Qualitative (Categorical) Variable?** (~350 words) — definition, nominal vs.
   ordinal subtypes, 4–5 quick examples.
3. **What Is a Quantitative (Numerical) Variable?** (~350 words) — definition, discrete vs.
   continuous subtypes, 4–5 quick examples.
4. **Discrete vs. Continuous Variables, In Depth** (~400 words) — targets the "discrete vs
   continuous variables" supporting keyword directly; countable vs. measurable distinction,
   common mix-ups (e.g., age).
5. **Qualitative vs. Quantitative Research (data collection framing)** (~300 words) —
   addresses the "…research" variant; briefly bridges from variable type to research design
   without turning into a methods article.
6. **Side-by-Side Comparison Table** (~200 words + table) — variable type, subtype, example,
   valid operations (can you average it?).
7. **Worked Example: Classify a Real Dataset** (~350 words) — see below.
8. **Why This Distinction Matters** (~150 words) — links classification to choice of chart/
   test, sets up the cross-link to Levels of Measurement.
9. **FAQ** (~150 words) — 3–4 short Q&As (e.g., "Is age qualitative or quantitative?", "Can a
   number be qualitative?").

### Worked example(s)
Use a 10-row student survey dataset: `eye_color` (brown, blue, green — nominal
qualitative), `letter_grade` (A–F — ordinal qualitative), `num_siblings` (0, 1, 2, 3 —
discrete quantitative), `exam_score_pct` (73.5, 88.2, … — continuous quantitative). Walk
through classifying all four columns explicitly, naming subtype for each.

### Internal links — required (guard)
None specified as binding in file 18 for B07 directly (B07 itself is the source of
keyword-leak reassignments *away* from it, not a link guard *for* it — see "Do not" below).

### Internal links — recommended (non-binding)
- `/levels-of-measurement/` (T13) — natural pairing, both are foundational classification
  topics; not a file-18 guard, editor discretion.

### Calculator embed
None. This is a conceptual classification article — no calculator suite (per
`08-site-architecture.md` §2) maps to variable-type classification. No embed.

### Do not
- Do not re-attach Mann-Whitney/Wilcoxon phrasings ("mann-whitney t-test," "wilcoxon rank
  sum test," etc.) or Kruskal-Wallis phrasings ("kruskal-wallis analysis of variance," etc.)
  to this page — file 18 notes these were *reassigned away* from B07 leaks onto T14 and T15
  respectively. Keep B07 scoped to its own four keywords only.
- Do not invent additional supporting keywords beyond the four listed.

---

## 2. T22 — Binomial Theorem & Binomial Coefficient Explained

- **Slug:** `/binomial-theorem/`
- **Category:** Combinatorics (`/combinatorics/`)
- **Target word count:** 2,400
- **Status:** Keyword-validated

### Frontmatter (suggested)
```
title: "Binomial Theorem & Binomial Coefficient Explained"
h1: "Binomial Theorem"
draft: true
category: "Combinatorics"
related: ["combinations", "permutations-and-combinations", "fundamental-counting-principle"]
```

### Keywords (source: file 16 T22, reassigned from the B03 pull)
- Primary: "binomial theorem" — 33,100 / KD 17
- Supporting (spoke): "pascal's triangle" — 74,000 / KD 22

### Search intent & reader question
Informational, mixed algebra/combinatorics intent. Reader question: "What is the binomial
theorem, how do I expand (x+y)^n, and how does Pascal's triangle relate to it?"

### Section-by-section outline
1. **Introduction** (~150 words) — state the formula upfront, promise worked expansions.
2. **Disambiguation callout (place immediately after intro)** (~120 words) — explicit note:
   "Binomial theorem" (this page) is the algebra/combinatorics identity for expanding
   `(x + y)^n`. It is **not** the same as the **binomial distribution** (probability of k
   successes in n trials) — see that article if you're looking for probability, not algebra.
3. **The Binomial Theorem Formula** (~300 words) — state formula with binomial coefficients,
   define each term.
4. **Binomial Coefficients = "n choose k"** (~300 words) — connects to combinations; explain
   `C(n,k)` notation and formula.
5. **Pascal's Triangle** (~400 words) — targets the "pascal's triangle" supporting keyword;
   build the triangle to row 6, show how each row gives the expansion coefficients.
6. **Worked Example 1: Expand (x + y)^4** (~300 words) — see below.
7. **Worked Example 2: Expand (2x + 3)^3** (~300 words) — see below.
8. **Common Applications** (~200 words) — probability (briefly, with a pointer to
   binomial-distribution), algebra simplification, combinatorics counting.
9. **FAQ** (~150 words).

### Worked example(s)
- Example 1: Expand `(x + y)^4` using row 4 of Pascal's triangle (1, 4, 6, 4, 1) →
  `x^4 + 4x^3y + 6x^2y^2 + 4xy^3 + y^4`. Show the `C(4,2) = 6` calculation explicitly.
- Example 2: Expand `(2x + 3)^3` → coefficients 1,3,3,1 →
  `8x^3 + 36x^2 + 54x + 27` (show each term's arithmetic: `C(3,1)(2x)^2(3)^1 = 3·4x^2·3 =
  36x^2`, etc.).

### Internal links — required (guard)
- Link to **T21 (Combinations)** at `/combinations/` — cluster guard: "T22 links to T21
  since the binomial coefficient *is* 'n choose k' — the clearest natural cross-link in the
  cluster." This link must carry the disambiguation note pointing away from
  `binomial-distribution`.
- Link to **H01 (hub)** at `/permutations-and-combinations/` — every combinatorics spoke
  links back up to the hub.
- Link to the **`/combinatorics/` category hub**.

### Internal links — recommended (non-binding)
- Link to the planned `binomial-distribution` article as the disambiguation target (not a
  file-18 cross-link guard per se, but required by the disambiguation instruction itself —
  treat as required in practice even though file 18 frames it as a "must disambiguate," not
  a "must link").

### Calculator embed
Yes — embed a binomial-coefficient ("n choose k") micro-calculator, drawn from the
Permutation/Combination/Factorial calculator suite (`08-site-architecture.md` §2, suite 5).
No standalone tool-intent keyword data exists in this batch for a dedicated binomial-theorem
tool page, so this is an educational-intent embed only per the dual-calculator model.

### Do not
- Do not merge or blend content with the existing planned `binomial-distribution` article —
  they are distinct concepts (file 15 #22). The disambiguation callout is mandatory, not
  optional.
- Do not invent search-volume/KD figures for "binomial coefficient" alone — it is not a
  confirmed keyword in file 18; use only the two listed terms.

---

## 3. T08 — Central Limit Theorem: Definition & Examples

- **Slug:** `/central-limit-theorem/`
- **Category:** Probability & Distributions (`/probability-distributions/`)
- **Target word count:** 2,400
- **Status:** Keyword-validated (thin)

### Frontmatter (suggested)
```
title: "Central Limit Theorem: Definition & Examples"
h1: "Central Limit Theorem"
draft: true
category: "Probability & Distributions"
related: []
```

### Keywords (source: file 16 T08, unchanged file 17)
- Primary: "central limit theorem" — 33,100 / KD 15
- No supporting long-tail confirmed after two independent research rounds — this is a
  single strong head term.

### Search intent & reader question
Informational, definitional/conceptual intent with high search volume. Reader question:
"What is the central limit theorem, and why does it matter?" Likely a stats-101 or
intro-research-methods student.

### Section-by-section outline
1. **Introduction** (~150 words) — hook with "why does everyone say sample means are
   normal?", state the theorem plainly.
2. **What the Central Limit Theorem Says** (~350 words) — formal statement: as sample size
   n grows, the distribution of the sample mean approaches normal regardless of the
   population's shape, with mean μ and standard error σ/√n.
3. **Why It Works (Intuition, Not Proof)** (~300 words) — averaging cancels out extremes;
   visual/verbal explanation of convergence, rule-of-thumb n ≥ 30.
4. **The Three Conditions** (~250 words) — random sampling, independence, sample size large
   enough (or population already normal).
5. **Worked Example: Sample Mean Probability** (~400 words) — see below.
6. **CLT vs. the Population Distribution (skewed population, normal sample-mean
   distribution)** (~300 words) — a simple skewed-population illustration (e.g., income data)
   to show CLT applies even when the population itself isn't normal.
7. **Why the Central Limit Theorem Matters in Practice** (~300 words) — why it underlies
   confidence intervals and hypothesis tests (z-tests, t-tests) built on sample means.
8. **Common Misconceptions** (~200 words) — CLT does not mean individual data become normal;
   n ≥ 30 is a rule of thumb, not a hard cutoff.
9. **FAQ** (~150 words).

### Worked example(s)
Population of exam scores with population mean μ = 70, population standard deviation
σ = 10. Take samples of size n = 36. Standard error = 10/√36 ≈ 1.667. Compute
P(sample mean > 72): z = (72 − 70)/1.667 ≈ 1.20 → P ≈ 0.115 (11.5%). Walk through the
z-score and normal-table lookup step by step.

### Internal links — required (guard)
None stated as binding for T08 specifically beyond the routing exclusion below (which is a
"do not," not a "link to").

### Internal links — recommended (non-binding)
- `/sampling-distributions/` (T09) — closely related topic in the same category; not a
  file-18 guard, editor discretion.

### Calculator embed
None identified. No calculator suite in `08-site-architecture.md` §2 covers a
sampling-distribution simulator. Flag as a content-only page; a future "sampling
distribution simulator" tool is a potential gap outside this batch's scope.

### Do not
- Do not use chi-square-distribution phrasings that leaked into T08's own re-seed pull
  ("chi-square probability distribution" 8,100/KD20, "chi squared probability density
  function" 8,100/KD19) as keywords on this page — these are **not** CLT keywords per file 17
  §2; they belong to the existing `chi-square-distribution` article.
- Do not invent supporting long-tail keywords for CLT beyond the single confirmed head term —
  two independent seeding rounds found none.

---

## 4. T20 — Permutations: Formula & Examples

- **Slug:** `/permutations/`
- **Category:** Combinatorics (`/combinatorics/`)
- **Target word count:** 2,100
- **Status:** Keyword-validated (thin)

### Frontmatter (suggested)
```
title: "Permutations: Formula & Examples"
h1: "Permutations"
draft: true
category: "Combinatorics"
related: ["combinations", "fundamental-counting-principle", "permutations-and-combinations"]
```

### Keywords (source: file 16 T20, unchanged file 17)
- Primary: "permutation" — 27,100 / KD 39
- Supporting: "permutation formula" — 12,100 / KD 25

### Search intent & reader question
Informational/how-to intent. Reader question: "What is a permutation, and how do I
calculate the number of ways to arrange or order a set of items?"

### Section-by-section outline
1. **Introduction** (~150 words) — define permutation as an *ordered* arrangement, contrast
   informally with combinations (order matters).
2. **The Permutation Formula** (~300 words) — `P(n,r) = n! / (n−r)!`, define each term,
   explain factorial notation briefly.
3. **Permutations of a Full Set (r = n)** (~250 words) — simple factorial case, e.g.
   arranging all n items.
4. **Permutations of a Subset (r < n)** (~250 words) — the more common real-world case.
5. **Worked Example 1: Full Set** (~300 words) — see below.
6. **Worked Example 2: Subset** (~300 words) — see below.
7. **Permutations vs. Combinations, Briefly** (~250 words) — short conceptual contrast with a
   pointer to H01 for the full comparison (don't duplicate H01's job).
8. **Where the Counting Principle Comes In** (~150 words) — links to T19 as prerequisite
   reading.
9. **FAQ** (~150 words).

### Worked example(s)
- Example 1 (full set): How many ways can 5 different books be arranged on a shelf?
  `P(5,5) = 5! = 120`.
- Example 2 (subset): In an 8-person race, how many ways can gold, silver, and bronze be
  awarded? `P(8,3) = 8!/(8−3)! = 8·7·6 = 336`.

### Internal links — required (guard)
- Link to **T19 (Fundamental Counting Principle)** at `/fundamental-counting-principle/` as
  foundational prerequisite reading — cluster guard: "T19 is the conceptual prerequisite —
  link it from T20 and T21."
- Cross-link directly to **T21 (Combinations)** at `/combinations/` — cluster guard: "T20 ↔
  T21 cross-link directly to each other."
- Link up to **H01 (hub)** at `/permutations-and-combinations/`.
- Link to the **`/combinatorics/` category hub**.

### Calculator embed
Yes — embed a Permutation calculator, from the Permutation/Combination/Factorial suite
(`08-site-architecture.md` §2, suite 5).

### Do not
- Do not split this article into separate "with repetition" / "without repetition" sections
  or pages, and do not make that distinction the primary organizing structure. This session's
  locked decision overrides file 15's original with/without-repetition split — file 17
  confirmed **zero** search volume for "with repetition," "without repetition," or
  "repetition" phrasing across both research rounds. Keep the article general.
- Do not let "permutation" / "permutation formula" leak into H01, T21, T19, or B03 content —
  file 17 confirmed these terms belong to T20 only, across six separate pull locations.

---

## 5. T21 — Combinations: Formula & Examples

- **Slug:** `/combinations/`
- **Category:** Combinatorics (`/combinatorics/`)
- **Target word count:** 2,100
- **Status:** Keyword-validated (thin)

### Frontmatter (suggested)
```
title: "Combinations: Formula & Examples"
h1: "Combinations"
draft: true
category: "Combinatorics"
related: ["permutations", "fundamental-counting-principle", "permutations-and-combinations", "binomial-theorem"]
```

### Keywords (source: file 17 T21 — improved on re-seed)
- Primary: "combination formula" — 18,100 / KD 15

### Search intent & reader question
Informational/how-to intent. Reader question: "What is a combination, and how do I
calculate the number of ways to choose a group of items when order doesn't matter?"

### Section-by-section outline
1. **Introduction** (~150 words) — define combination as an *unordered* selection, contrast
   informally with permutations.
2. **The Combination Formula** (~300 words) — `C(n,r) = n! / (r!(n−r)!)`, define each term,
   connect to "n choose k" notation.
3. **Why Order Doesn't Matter Here** (~250 words) — conceptual grounding with a simple
   committee/team-selection framing.
4. **Worked Example 1: Choosing a Small Group** (~300 words) — see below.
5. **Worked Example 2: Larger-Scale Combination (Lottery)** (~300 words) — see below.
6. **Combinations vs. Permutations, Briefly** (~250 words) — short conceptual contrast,
   pointer to H01 for the full comparison.
7. **Combinations and the Binomial Coefficient** (~200 words) — bridges to T22, notes `C(n,r)`
   is exactly the binomial coefficient.
8. **Where the Counting Principle Comes In** (~150 words) — links to T19 as prerequisite.
9. **FAQ** (~150 words).

### Worked example(s)
- Example 1: A pizza shop offers 8 toppings; how many different 3-topping pizzas are
  possible? `C(8,3) = 8!/(3!·5!) = 56`.
- Example 2: A lottery draws 6 numbers from 49; how many possible combinations exist?
  `C(49,6) = 13,983,816`.

### Internal links — required (guard)
- Link to **T19 (Fundamental Counting Principle)** at `/fundamental-counting-principle/` —
  cluster guard: "T19 is the conceptual prerequisite — link it from T20 and T21."
- Cross-link directly to **T20 (Permutations)** at `/permutations/` — cluster guard: "T20 ↔
  T21 cross-link directly to each other."
- Link up to **H01 (hub)** at `/permutations-and-combinations/`.
- Link to the **`/combinatorics/` category hub**.

### Internal links — recommended (non-binding)
- Reciprocal link to **T22 (Binomial Theorem)** at `/binomial-theorem/` — T22 is required to
  link to T21 (see brief 2); a reciprocal link back is good practice but not itself a
  separately stated file-18 guard for T21.

### Calculator embed
Yes — embed a Combination calculator, from the Permutation/Combination/Factorial suite
(`08-site-architecture.md` §2, suite 5). Likely the same widget/tool as T20's, with a mode
toggle.

### Do not
- Do not target or invent "with repetition" / "without repetition" keyword variants — zero
  confirmed volume across two research rounds (same locked decision as T20).
- Do not invent additional supporting keywords beyond "combination formula" — this is the
  only confirmed term for T21.

---

## 6. T04 — Type I and Type II Errors Explained

- **Slug:** `/type-i-and-type-ii-errors/`
- **Category:** Inferential & Hypothesis Testing (`/inferential-statistics/`)
- **Target word count:** 2,300
- **Status:** Keyword-validated

### Frontmatter (suggested)
```
title: "Type I and Type II Errors Explained"
h1: "Type I and Type II Errors"
draft: true
category: "Inferential & Hypothesis Testing"
related: []
```

### Keywords (source: file 16 T04)
- Primary: "type i and type ii errors" — 18,100 / KD 10
- Supporting: "type 1 and type 2 errors" — 12,100 / KD 6
- Supporting: "type i vs type ii errors" — 1,600 / KD 9
- Supporting: "types of statistical errors" — 2,900 / KD 6

### Search intent & reader question
Informational, comparison intent. Reader question: "What's the difference between a Type I
and a Type II error in hypothesis testing, and how do I remember which is which?"

### Section-by-section outline
1. **Introduction** (~150 words) — hook: both errors are "being wrong," but in opposite
   directions; promise a clear mnemonic.
2. **What Is a Type I Error (False Positive)?** (~350 words) — definition, relationship to
   significance level α, plain-language framing ("rejecting a true null hypothesis").
3. **What Is a Type II Error (False Negative)?** (~350 words) — definition, relationship to
   β and statistical power (1 − β), plain-language framing ("failing to reject a false null
   hypothesis").
4. **Type I vs. Type II: Side-by-Side** (~300 words + comparison table) — targets the "type i
   vs type ii errors" variant directly.
5. **The Trade-off Between the Two** (~250 words) — lowering α raises β and vice versa;
   sample size as the lever that improves both.
6. **Worked Example: Medical Testing Confusion Matrix** (~400 words) — see below.
7. **Other Types of Statistical Errors (brief)** (~200 words) — targets "types of statistical
   errors" without turning into a full power/error taxonomy article.
8. **Memory Tricks / Mnemonics** (~150 words) — practical retention aids for the two error
   types.
9. **FAQ** (~150 words).

### Worked example(s)
Medical test scenario: 1,000 patients tested for a disease. Null hypothesis: "patient does
not have the disease." Suppose 950 patients are truly healthy and 50 truly have the disease.
The test has a 5% false-positive rate (α = 0.05) and a 20% false-negative rate (β = 0.20,
power = 0.80). Compute: Type I errors ≈ 0.05 × 950 = 47.5 (≈48) healthy patients incorrectly
flagged positive; Type II errors ≈ 0.20 × 50 = 10 diseased patients incorrectly cleared.
Present as a 2×2 confusion-matrix table with all four cells filled in.

### Internal links — required (guard)
None specified as binding in file 18 for T04.

### Internal links — recommended (non-binding)
- `/statistical-power/` (T05) — power is 1 − β, directly related; not a file-18 guard.
- `/which-statistical-test-should-i-use/` (B08) — decision-hub page; not a file-18 guard.

### Calculator embed
None identified. No calculator suite in `08-site-architecture.md` §2 directly covers Type
I/II error rates. Content-only page.

### Do not
- Do not invent additional keyword volume/KD figures beyond the four listed — these are the
  complete confirmed set for T04.

---

## 7. T18 — Bayes' Theorem (Bayes' Rule): Formula & Examples

- **Slug:** `/bayes-theorem/`
- **Category:** Probability & Distributions (`/probability-distributions/`)
- **Target word count:** 2,400
- **Status:** Keyword-validated (thin)

### Frontmatter (suggested)
```
title: "Bayes' Theorem (Bayes' Rule): Formula & Examples"
h1: "Bayes' Theorem"
draft: true
category: "Probability & Distributions"
related: []
```

### Keywords (source: file 16 §3, unchanged file 17 — accepted as the ceiling, no third
re-seed recommended)
- Primary: "bayes rule" — 12,100 / KD 24
- Supporting (generic): "bayesian" — 14,800 / KD 23

### Search intent & reader question
Informational, formula/definitional intent. Reader question: "What is Bayes' theorem
(Bayes' rule), and how do I use it to update a probability with new evidence?"

### Section-by-section outline
1. **Introduction** (~150 words) — hook with the classic "should I update my belief" framing.
2. **The Bayes' Theorem Formula** (~300 words) — state `P(A|B) = P(B|A)P(A) / P(B)`, define
   prior, likelihood, evidence, posterior.
3. **Where Bayes' Theorem Comes From (brief derivation)** (~250 words) — from the definition
   of conditional probability, with a pointer to the `probability-formula` article for the
   underlying conditional-probability formula itself (not re-derived here).
4. **Worked Example: The Classic Medical-Test Problem** (~450 words) — see below.
5. **Bayesian vs. Frequentist Thinking (brief, supports "bayesian")** (~300 words) — plain-
   language contrast, not a full philosophy-of-statistics treatment.
6. **Common Mistakes When Applying Bayes' Theorem** (~250 words) — base-rate neglect,
   confusing P(A|B) with P(B|A).
7. **Where Bayes' Theorem Is Used** (~200 words) — spam filters, medical diagnostics, machine
   learning classifiers.
8. **FAQ** (~150 words).

### Worked example(s)
Classic diagnostic-test example: disease prevalence 1% (P(D) = 0.01), test sensitivity 99%
(P(+|D) = 0.99), test specificity 95% (P(−|no D) = 0.95, so P(+|no D) = 0.05). Compute
P(D|+) = (0.99 × 0.01) / (0.99 × 0.01 + 0.05 × 0.99) = 0.0099 / 0.0594 ≈ 0.1667 (≈16.7%).
Walk through why a positive result still means only a ~17% real chance of disease — the
base-rate-neglect teaching moment.

### Internal links — required (guard)
- Link to the existing published **`probability-distribution`** article — it owns the
  excluded "bayesian statistics" phrasing; route readers there per file 18's routing logic.
- Link to the existing published **`probability-formula`** article — it owns the excluded
  "conditional probability formula" phrasing, and Bayes' theorem is directly derived from
  conditional probability, so this link also serves the derivation section above.

### Calculator embed
Tentative — a Bayes'/conditional-probability calculator could sit under the generic
Probability suite (`08-site-architecture.md` §2, suite 4), but that suite is not explicitly
labeled as covering Bayes' theorem. Flag for confirmation before build; do not assume the
embed exists without checking the suite 4 tool spec.

### Do not
- Do not target "bayesian statistics" (8,100/KD18) as a keyword on this page — it is owned by
  the published `probability-distribution` article, confirmed as a leak across five separate
  re-seed pulls in file 17 §2 and correctly excluded every time.
- Do not target "conditional probability formula" as a keyword on this page — it is owned by
  the published `probability-formula` article.
- Keep only "bayes rule" and "bayesian" as this page's keyword targets — do not expand beyond
  file 18's ceiling; no third re-seed is recommended per file 17.

---

## 8. T13 — Levels of Measurement: Nominal, Ordinal, Interval & Ratio

- **Slug:** `/levels-of-measurement/`
- **Category:** Foundations Hub (`/statistics-basics/`)
- **Target word count:** 2,500
- **Status:** Keyword-validated

### Frontmatter (suggested)
```
title: "Levels of Measurement: Nominal, Ordinal, Interval & Ratio"
h1: "Levels of Measurement"
draft: true
category: "Foundations Hub"
related: ["types-of-variables"]
```

### Keywords (source: file 16 T13 — strongest topic in the batch by keyword count)
- Primary: "ordinal variable vs nominal" — 9,900 / KD 13
- Supporting: 13+ variants of "nominal ordinal interval ratio" clustered at ~6,600/KD19–34;
  example given in file 18: "nominal ordinal interval or ratio" — 6,600 / KD 19

### Search intent & reader question
Informational, classification intent. Reader question: "What are the four levels of
measurement (nominal, ordinal, interval, ratio), and how do I tell them apart?"

### Section-by-section outline
1. **Introduction** (~150 words) — state the four-level framework upfront (Stevens' typology).
2. **Nominal: Categories With No Order** (~300 words) — definition + examples.
3. **Ordinal: Categories With Order, No Fixed Distance** (~350 words) — definition, examples,
   targets the "ordinal variable vs nominal" primary keyword directly with an explicit
   nominal-vs-ordinal contrast subsection.
4. **Interval: Ordered, Equal Distances, No True Zero** (~300 words) — definition + classic
   temperature example.
5. **Ratio: Ordered, Equal Distances, True Zero** (~300 words) — definition + examples
   (height, weight, income).
6. **All Four Side-by-Side (comparison table)** (~250 words + table) — targets the
   "nominal ordinal interval ratio" keyword cluster directly; table columns: level, order?,
   equal intervals?, true zero?, valid statistics.
7. **Worked Example: Classify Four Real Variables** (~400 words) — see below.
8. **Why Level of Measurement Determines Which Statistics/Tests Are Valid** (~250 words) —
   e.g., you can't average nominal data; sets up value for readers heading to a test-selection
   page.
9. **FAQ** (~150 words).

### Worked example(s)
Classify four variables from a customer-satisfaction survey: `region` (Northeast, South,
Midwest, West — nominal); `satisfaction_rating` (1=Poor … 5=Excellent — ordinal);
`temperature_at_visit_F` (interval); `amount_spent_usd` (ratio). Walk through each,
explicitly testing "does it have order?", "are intervals equal?", "is there a true zero?"

### Internal links — required (guard)
None specified as binding in file 18 for T13.

### Internal links — recommended (non-binding)
- `/types-of-variables/` (B07) — same Foundations Hub category, closely related
  classification topic; not a file-18 guard, editor discretion.

### Calculator embed
None. Conceptual classification page — no calculator suite applies.

### Do not
- Do not enumerate a fabricated list of all "13+ variants" of the "nominal ordinal interval
  ratio" phrasing — file 18 gives only one example figure ("nominal ordinal interval or
  ratio" 6,600/KD19) and states the others cluster at ~6,600/KD19–34 without listing each one.
  Use the one confirmed example plus the general cluster description; do not invent exact
  wording or figures for the other 12+ variants.

---

## 9. T14 — Mann-Whitney U Test: Formula & When to Use It

- **Slug:** `/mann-whitney-u-test/`
- **Category:** Inferential & Hypothesis Testing (`/inferential-statistics/`)
- **Target word count:** 2,300
- **Status:** Keyword-validated

### Frontmatter (suggested)
```
title: "Mann-Whitney U Test: Formula & When to Use It"
h1: "Mann-Whitney U Test"
draft: true
category: "Inferential & Hypothesis Testing"
related: ["kruskal-wallis-test"]
```

### Keywords (source: file 16 T14, reassigned from T11/T17/B07 leaks)
- Primary: "mann-whitney t-test" — 9,900 / KD 14
- Supporting: "mann-whitney u test wilcoxon rank sum" — 9,900 / KD 11
- Supporting: "wilcoxon rank sum test" — 2,900 / KD 7
- Supporting: "wilcoxon sum rank test" — 2,900 / KD 7

### Search intent & reader question
Informational/how-to intent. Reader question: "What is the Mann-Whitney U test (Wilcoxon
rank-sum test), and when should I use it instead of a t-test?"

### Section-by-section outline
1. **Introduction** (~150 words) — position as the non-parametric alternative to the
   independent t-test.
2. **What the Mann-Whitney U Test Does** (~300 words) — compares two independent samples by
   rank rather than raw values; when to prefer it (non-normal data, ordinal data, outliers).
3. **Mann-Whitney U vs. Wilcoxon Rank-Sum: Same Test, Two Names** (~250 words) — directly
   addresses the "wilcoxon rank sum test" / "wilcoxon sum rank test" naming overlap so readers
   aren't confused by the dual terminology.
4. **The U Statistic Formula** (~300 words) — rank all combined values, sum ranks per group,
   compute U from rank sums.
5. **Assumptions** (~200 words) — independent samples, ordinal/continuous data, similar
   distribution shapes for the median-comparison interpretation.
6. **Worked Example: Ranking and Computing U** (~450 words) — see below.
7. **Interpreting the Result** (~200 words) — comparing U to a critical value / using the
   p-value.
8. **Mann-Whitney vs. Kruskal-Wallis (two vs. more groups)** (~250 words) — explicit hand-off
   to T15 for the >2-group case.
9. **FAQ** (~150 words).

### Worked example(s)
Two independent groups' scores: Group A (n=4): 12, 15, 18, 22; Group B (n=4): 14, 16, 20,
25. Combine and rank all 8 values (12=1, 14=2, 15=3, 16=4, 18=5, 20=6, 22=7, 25=8). Sum
ranks: R_A = 1+3+5+7 = 16, R_B = 2+4+6+8 = 20. Compute U_A = n_A·n_B + n_A(n_A+1)/2 − R_A =
16 + 10 − 16 = 10; U_B = 16 + 10 − 20 = 6. Take U = min(10, 6) = 6, walk through comparing
to a critical-value table.

### Internal links — required (guard)
- Cross-link to **T15 (Kruskal-Wallis Test)** at `/kruskal-wallis-test/` — file 18 frames
  T14 and T15 as a deliberate split (not addition) that jointly retires the planned
  `non-parametric-tests` umbrella article; the two should reference each other as sibling
  non-parametric tests.

### Calculator embed
None identified. No calculator suite in `08-site-architecture.md` §2 covers Mann-Whitney U.
Content-only page; flag as a potential future calculator gap.

### Do not
- Do not reference or link to a `non-parametric-tests` page — that planned umbrella article
  is being **retired** now that T14/T15 exist as its split replacement; it should not appear
  in the write queue or be linked as if it exists.
- Do not invent additional keyword phrasings — the four listed (reassigned from prior
  T11/T17/B07 leak pulls) are the complete confirmed set for T14.

---

## 10. B06 — R-Squared & Adjusted R-Squared Explained

- **Slug:** `/r-squared-adjusted-r-squared/`
- **Category:** Regression & Correlation (`/regression-correlation/`)
- **Target word count:** 2,200
- **Status:** Keyword-validated (thin)

### Frontmatter (suggested)
```
title: "R-Squared & Adjusted R-Squared Explained"
h1: "R-Squared & Adjusted R-Squared"
draft: true
category: "Regression & Correlation"
related: []
```

### Keywords (source: file 17 B06 — improved on re-seed; zero signal for bare
"r-squared"/"adjusted r-squared" in either round)
- Primary: "coefficient of determination" — 9,900 / KD 19

### Search intent & reader question
Informational, formula/interpretation intent. Reader question: "What does R-squared
(coefficient of determination) mean, and why do I need the adjusted version?"

### Section-by-section outline
1. **Introduction** (~150 words) — introduce "coefficient of determination" as the formal
   name early, note "R-squared" is the everyday shorthand used throughout.
2. **What R-Squared (the Coefficient of Determination) Measures** (~350 words) — proportion
   of variance in the dependent variable explained by the model; formula
   `R² = 1 − (SS_res / SS_tot)`.
3. **Interpreting R-Squared Values** (~250 words) — 0 to 1 scale, what counts as "good"
   varies by field, R² is not proof of causation or model correctness.
4. **Why Adjusted R-Squared Exists** (~350 words) — plain R² always increases with more
   predictors even if useless; adjusted R² penalizes for predictor count. Formula:
   `Adjusted R² = 1 − [(1 − R²)(n − 1) / (n − k − 1)]`.
5. **Worked Example: Computing R² and Adjusted R²** (~450 words) — see below.
6. **Limitations of R-Squared** (~250 words) — doesn't detect bias, doesn't imply a good fit
   alone, sensitive to outliers.
7. **R-Squared in Simple vs. Multiple Regression** (~200 words) — brief note on how
   interpretation shifts with more predictors.
8. **FAQ** (~150 words).

### Worked example(s)
Simple linear regression on 5 data points (e.g., hours studied vs. exam score) yielding
`SS_res = 32.5`, `SS_tot = 250`. Compute `R² = 1 − 32.5/250 = 0.87`. Then compute adjusted
R² with n=5, k=1 predictor: `Adjusted R² = 1 − [(1 − 0.87)(5 − 1)/(5 − 1 − 1)] = 1 −
[(0.13)(4)/3] = 1 − 0.173 ≈ 0.827`. Show the arithmetic for both formulas step by step.

### Internal links — required (guard)
None specified as binding in file 18 for B06.

### Internal links — recommended (non-binding)
- `/regression-assumptions/` (T11) and `/multicollinearity-vif/` (T12) — same category,
  closely related regression diagnostics topics; not file-18 guards.

### Calculator embed
Yes — embed a linear-regression calculator that outputs R² (and ideally adjusted R²), from
the Correlation(r)/Linear-regression suite (`08-site-architecture.md` §2, suite 7).

### Do not
- Do not anchor the primary keyword/heading emphasis on the bare phrase "r-squared" — DataForSEO
  returned **zero** signal for the bare term ("r-squared"/"adjusted r-squared") in both
  research rounds despite its common everyday usage. The locked title uses "R-Squared" for
  readability, but in-body SEO emphasis (H2s, first-paragraph framing) should prioritize
  "coefficient of determination."
- Do not invent volume/KD figures for bare "r-squared" or "adjusted r-squared" — confirmed
  zero, not simply low.

---

## 11. B05 — Reliability in Statistics: Cronbach's Alpha & Cohen's Kappa

- **Slug:** `/reliability-cronbachs-alpha-cohens-kappa/`
- **Category:** Foundations Hub (`/statistics-basics/`)
- **Target word count:** 2,400
- **Status:** Keyword-validated

### Frontmatter (suggested)
```
title: "Reliability in Statistics: Cronbach's Alpha & Cohen's Kappa"
h1: "Reliability: Cronbach's Alpha & Cohen's Kappa"
draft: true
category: "Foundations Hub"
related: ["validity-in-statistics"]
```

### Keywords (source: file 16 B05 — one of the cleanest pulls in the batch)
- Primary: "cronbach's alpha" — 8,100 / KD 20
- Supporting: "cronbach alpha" — 8,100 / KD 16
- Supporting: "cohen's kappa" — 2,900 / KD 10
- Supporting: "cohen kappa" — 2,900 / KD 11

### Search intent & reader question
Informational, formula/interpretation intent, two related but distinct sub-questions: "What
is Cronbach's alpha and how do I calculate/interpret it?" and "What is Cohen's kappa and how
do I calculate/interpret it?"

### Section-by-section outline
1. **Introduction** (~150 words) — frame both as "reliability" measures but for different
   purposes: internal consistency (alpha) vs. inter-rater agreement (kappa). Signal the article
   covers both as two clearly separated halves.
2. **Part 1: Cronbach's Alpha** (H2)
   - **What Cronbach's Alpha Measures** (~250 words) — internal consistency reliability of a
     multi-item scale/survey.
   - **The Cronbach's Alpha Formula** (~300 words) — `α = (k/(k−1))(1 − Σσ²_item/σ²_total)`.
   - **Interpreting Alpha Values** (~200 words) — common thresholds (≥0.7 acceptable, ≥0.8
     good), caveats about "too high" alpha (redundant items).
   - **Worked Example: Computing Cronbach's Alpha** (~350 words) — see below.
3. **Part 2: Cohen's Kappa** (H2)
   - **What Cohen's Kappa Measures** (~250 words) — inter-rater agreement beyond chance
     for categorical ratings.
   - **The Cohen's Kappa Formula** (~300 words) — `κ = (p_o − p_e)/(1 − p_e)`.
   - **Interpreting Kappa Values** (~200 words) — Landis & Koch-style benchmark scale.
   - **Worked Example: Computing Cohen's Kappa** (~300 words) — see below.
4. **Alpha vs. Kappa: When to Use Which** (~150 words) — quick decision guidance (survey
   scale = alpha; two raters classifying = kappa).
5. **FAQ** (~150 words).

### Worked example(s)
- Cronbach's alpha: a 4-item survey scale (k=4) with item variances summing to 8 and total
  scale variance of 25. `α = (4/3)(1 − 8/25) = (4/3)(0.68) ≈ 0.907` — interpret as excellent
  internal consistency.
- Cohen's kappa: two raters classify 100 items into categories; observed agreement
  `p_o = 0.85`, expected chance agreement `p_e = 0.60`. `κ = (0.85 − 0.60)/(1 − 0.60) =
  0.25/0.40 = 0.625` — interpret as substantial agreement.

### Internal links — required (guard)
- Link to the existing `validity-in-statistics` research-pending stub — file 18 names B05 as
  its companion piece; cross-link once both exist.

### Calculator embed
None identified. No calculator suite in `08-site-architecture.md` §2 covers Cronbach's alpha
or Cohen's kappa. Content-only page; flag as a potential future calculator gap.

### Do not
- Do not conflate Cronbach's alpha and Cohen's kappa into a single blended formula/
  explanation section — they measure different things (internal consistency vs. inter-rater
  agreement) and must stay as two clearly separated subtopics within the one combined-title
  article.
- Do not invent additional keyword figures beyond the four listed.

---

## 12. T06 — Effect Size: What It Means & How to Interpret It

- **Slug:** `/effect-size/`
- **Category:** Inferential & Hypothesis Testing (`/inferential-statistics/`)
- **Target word count:** 2,200
- **Status:** Keyword-validated

### Frontmatter (suggested)
```
title: "Effect Size: What It Means & How to Interpret It"
h1: "Effect Size"
draft: true
category: "Inferential & Hypothesis Testing"
related: []
```

### Keywords (source: file 17 T06 — fixed on re-seed)
- Primary: "effect size" — 8,100 / KD 18
- Supporting: "effect sizes" — 8,100 / KD 28
- Supporting: "effect size d" — 8,100 / KD 28

### Search intent & reader question
Informational, definitional/interpretation intent. Reader question: "What is effect size,
how is it different from a p-value, and how do I calculate and interpret Cohen's d?"

### Section-by-section outline
1. **Introduction** (~150 words) — hook: statistical significance tells you *if* there's an
   effect; effect size tells you *how big*.
2. **What Effect Size Measures (and Why P-Values Aren't Enough)** (~300 words) — practical
   vs. statistical significance distinction.
3. **Common Effect Size Measures, Overview** (~250 words) — brief survey: Cohen's d, r,
   eta-squared — sets up the deep-dive on d.
4. **Cohen's d: Formula and Calculation (targets "effect size d")** (~350 words) —
   `d = (M1 − M2) / SD_pooled`.
5. **Interpreting Cohen's d (small/medium/large benchmarks)** (~250 words) — standard
   0.2/0.5/0.8 thresholds with caveats about field-specific norms.
6. **Worked Example: Computing Cohen's d** (~350 words) — see below.
7. **Effect Size and Sample Size / Power (brief)** (~200 words) — larger effect sizes need
   smaller samples to detect; pointer to statistical-power article.
8. **Reporting Effect Size Alongside P-Values** (~200 words) — best-practice framing for
   research write-ups.
9. **FAQ** (~150 words).

### Worked example(s)
Two exam-score groups: Group 1 mean = 78, Group 2 mean = 85, pooled standard deviation = 10.
`d = (85 − 78)/10 = 0.7` — interpret as a medium-to-large effect using the standard
0.2/0.5/0.8 benchmark scale.

### Internal links — required (guard)
None specified as binding in file 18 for T06.

### Internal links — recommended (non-binding)
- `/paired-vs-independent-t-test/` (T16) and `/statistical-power/` (T05) — effect size is
  directly relevant to both t-tests and power calculations; not file-18 guards.

### Calculator embed
None identified among the current 8 calculator suites in `08-site-architecture.md` §2 (the
t-test suite exists but a dedicated Cohen's d calculator is not listed). Flag as a potential
future calculator gap; no embed for this batch.

### Do not
- Do not use any effect-size figures from before the file 17 re-seed fix — file 18 notes this
  keyword set was "fixed on re-seed," implying an earlier pull had an issue. Use only the
  three figures given here.
- Do not invent additional supporting keywords beyond the three listed.

---

## 13. T15 — Kruskal-Wallis Test: Formula & When to Use It

- **Slug:** `/kruskal-wallis-test/`
- **Category:** Inferential & Hypothesis Testing (`/inferential-statistics/`)
- **Target word count:** 2,200
- **Status:** Keyword-validated

### Frontmatter (suggested)
```
title: "Kruskal-Wallis Test: Formula & When to Use It"
h1: "Kruskal-Wallis Test"
draft: true
category: "Inferential & Hypothesis Testing"
related: ["mann-whitney-u-test", "one-way-anova"]
```

### Keywords (source: file 16 T15, reassigned from B07 leak)
- Primary: "kruskal-wallis analysis of variance" — 6,600 / KD 7
- Supporting: "kruskal wallis analysis of variance" — 6,600 / KD 8
- Supporting: "kruskal wallis one way analysis of variance" — 6,600 / KD 5

### Search intent & reader question
Informational/how-to intent. Reader question: "What is the Kruskal-Wallis test, and when
should I use it instead of a one-way ANOVA?"

### Section-by-section outline
1. **Introduction** (~150 words) — position as the non-parametric alternative to one-way
   ANOVA for comparing 3+ groups.
2. **What the Kruskal-Wallis Test Does** (~300 words) — compares 3+ independent groups by
   rank; when to prefer it (non-normal data, ordinal data, unequal variances).
3. **Kruskal-Wallis Is NOT the Same as One-Way ANOVA (important disambiguation)** (~300
   words) — despite the "analysis of variance" phrasing in its full name, this is a
   rank-based non-parametric test, distinct from parametric one-way ANOVA. Explicit note that
   readers searching "kruskal wallis analysis of variance" want *this* page, not the ANOVA
   page, even though the phrase contains "analysis of variance."
4. **The H Statistic Formula** (~300 words) — rank all combined values across groups, formula
   for H.
5. **Assumptions** (~200 words) — independent samples, ordinal/continuous data.
6. **Worked Example: Ranking and Computing H** (~450 words) — see below.
7. **Interpreting the Result** (~200 words) — comparing H to chi-square critical value /
   using the p-value.
8. **Kruskal-Wallis vs. Mann-Whitney (3+ groups vs. 2 groups)** (~200 words) — explicit
   hand-off to T14 for the 2-group case; also brief cross-reference to one-way ANOVA (T01) as
   the parametric analogue.
9. **FAQ** (~150 words).

### Worked example(s)
Three independent groups: Group A: 4, 6, 8; Group B: 5, 7, 9; Group C: 10, 12, 14. Rank all
9 values combined (4=1, 5=2, 6=3, 7=4, 8=5, 9=6, 10=7, 12=8, 14=9). Rank sums: R_A = 1+3+5=9,
R_B = 2+4+6=12, R_C = 7+8+9=24. Compute H using the standard formula
`H = [12/(N(N+1))] · Σ(R_i²/n_i) − 3(N+1)` with N=9, n_i=3 each: `H = [12/90]·(81/3 + 144/3 +
576/3) − 30 = 0.1333·(27+48+192) − 30 = 0.1333·267 − 30 = 35.6 − 30 = 5.6`. Walk through
comparing H to a chi-square critical value with df = 2.

### Internal links — required (guard)
- Cross-link to **T01 (One-Way ANOVA)** at `/one-way-anova/` — guard: "'kruskal wallis
  analysis of variance' phrasings must stay on T15, not T01... Kruskal-Wallis is the
  non-parametric analogue of one-way ANOVA; cross-link T15→T01 once both exist, don't merge
  keywords." (T01 is a topical-authority-only article with no confirmed keyword data —
  link to it anyway per this guard once it's written.)
- Cross-link to **T14 (Mann-Whitney U Test)** at `/mann-whitney-u-test/` — T14/T15 jointly
  retire the planned `non-parametric-tests` umbrella article as a deliberate split; the two
  should reference each other as sibling non-parametric tests.

### Calculator embed
None identified. No calculator suite in `08-site-architecture.md` §2 covers Kruskal-Wallis.
Content-only page; flag as a potential future calculator gap.

### Do not
- Do not let "kruskal wallis analysis of variance" phrasings (or any of the three keyword
  variants) be absorbed into T01's (One-Way ANOVA) content — confirmed twice (file 16 §2,
  file 17 §2) that these belong to T15 despite containing "analysis of variance." Keep them
  here; cross-link, don't merge.
- Do not reference or link to a `non-parametric-tests` page as if it exists — it is being
  retired now that T14/T15 are its split replacement.

---

## 14. T16 — Paired vs. Independent T-Test: Which One Do You Need?

- **Slug:** `/paired-vs-independent-t-test/`
- **Category:** Inferential & Hypothesis Testing (`/inferential-statistics/`)
- **Target word count:** 2,300
- **Status:** Keyword-validated (thin)

### Frontmatter (suggested)
```
title: "Paired vs. Independent T-Test: Which One Do You Need?"
h1: "Paired vs. Independent T-Test"
draft: true
category: "Inferential & Hypothesis Testing"
related: ["effect-size"]
```

### Keywords (source: file 16 T16, unchanged in file 17)
- Primary: "t-test and paired t-test" — 6,600 / KD 2
- Supporting: "t test and paired t test" — 6,600 / KD 9
- Supporting: "example of independent t-test" — 2,900 / KD 4
- Supporting: "example of paired t-test" — 2,400 / KD 0

### Search intent & reader question
Comparison/decision intent, example-heavy. Reader question: "Should I use a paired t-test or
an independent (two-sample) t-test for my data, and what does each look like in practice?"

### Section-by-section outline
1. **Introduction** (~150 words) — hook: the decision hinges on one question — are your two
   samples related (same subjects) or unrelated (different subjects)?
2. **The Core Decision: Are Your Samples Related?** (~300 words) — decision framework/
   flowchart description: same subjects measured twice = paired; different subjects = 
   independent.
3. **When to Use a Paired T-Test** (~300 words) — before/after designs, matched pairs.
4. **When to Use an Independent (Two-Sample) T-Test** (~300 words) — two separate groups
   compared once.
5. **Worked Example: Independent T-Test (targets "example of independent t-test")** (~400
   words) — see below.
6. **Worked Example: Paired T-Test (targets "example of paired t-test")** (~400 words) — see
   below.
7. **Side-by-Side Comparison Table** (~250 words + table) — targets "t-test and paired
   t-test" / "t test and paired t test" directly; columns: design, hypotheses, formula
   difference, example use case.
8. **Common Mistakes** (~150 words) — using independent t-test on paired data (loses power),
   and vice versa (invalid).
9. **FAQ** (~150 words).

### Worked example(s)
- Independent t-test: Class A (n=10) mean exam score 82, SD 6; Class B (n=10) mean exam
  score 76, SD 7 — two *different* groups of students, one test each. State the hypotheses
  and describe computing the independent-samples t-statistic (show the formula with these
  numbers plugged in).
- Paired t-test: 8 patients' weight measured before and after an 8-week program (e.g.,
  before: 210, 195, 180, ...; after: 202, 190, 176, ...) — the *same* 8 people measured
  twice. Compute the differences, mean difference, and SD of differences, then the paired
  t-statistic.

### Internal links — required (guard)
- Link to the existing planned `t-test` article ("Paired & Two-Sample T-Tests Explained") —
  it owns the excluded bare "paired t-test" keyword; route readers there for the general
  formula-level treatment while this page stays focused on the comparison/decision framing.

### Calculator embed
Yes — embed a t-test calculator with a paired/independent mode toggle, from the
Z-score/t-test/Chi-square/CI/p-value suite (`08-site-architecture.md` §2, suite 8). This
article's comparison framing makes a dual-mode embed a strong natural fit.

### Do not
- Do not target bare "paired t-test" (6,600/KD17) as a keyword, H2, or anchor text on this
  page — it is deliberately excluded and belongs to the existing planned `t-test` article.
  Only comparison/example phrasings are assigned to T16.
- Do not invent additional keyword volume figures beyond the four listed.

---

## 15. B01 — The Empirical Rule (68-95-99.7 Rule) Explained

- **Slug:** `/empirical-rule/`
- **Category:** Descriptive Statistics (`/descriptive-statistics/`)
- **Target word count:** 2,000
- **Status:** Keyword-validated (thin)

### Frontmatter (suggested)
```
title: "The Empirical Rule (68-95-99.7 Rule) Explained"
h1: "The Empirical Rule"
draft: true
category: "Descriptive Statistics"
related: ["normal-distribution"]
```

### Keywords (source: file 16 B01, unchanged file 17 — confirmed twice, no "68-95-99.7" or
"empirical rule calculator" phrasing surfaced)
- Primary: "empirical rule statistics" — 4,400 / KD 11 (single keyword, thinnest of the
  "usable" group in this batch)

### Search intent & reader question
Informational, definitional/applied intent. Reader question: "What is the empirical rule
(68-95-99.7 rule), and how do I use it to estimate what percentage of data falls within a
given range?"

### Section-by-section outline
1. **Introduction** (~150 words) — state the rule plainly upfront (68% within 1 SD, 95%
   within 2 SD, 99.7% within 3 SD).
2. **What the Empirical Rule Says** (~300 words) — formal statement, applies only to
   approximately normal distributions.
3. **Why It Works: The Empirical Rule and the Normal Distribution** (~300 words) — explicit
   bridge — the rule is a direct consequence of the normal distribution's shape.
4. **The Three Bands, Visualized in Words** (~300 words) — 68% (±1 SD), 95% (±2 SD), 99.7%
   (±3 SD), described with a mental image of the bell curve.
5. **Worked Example: IQ Scores** (~450 words) — see below.
6. **When the Empirical Rule Does NOT Apply** (~250 words) — skewed/non-normal data caveat.
7. **Empirical Rule vs. Chebyshev's Theorem (brief)** (~150 words) — one-line contrast for
   readers who land here looking for the non-normal-distribution version.
8. **FAQ** (~150 words).

### Worked example(s)
IQ scores are approximately normal with mean = 100, SD = 15. Show: 68% of scores fall
between 85 and 115 (100 ± 15); 95% fall between 70 and 130 (100 ± 30); 99.7% fall between 55
and 145 (100 ± 45). Then answer a specific applied question: "What percentage of people
score above 130?" — 130 is 2 SD above the mean, so 95% falls within ±2 SD, leaving 5%
outside (2.5% below 70, 2.5% above 130) → **2.5%** score above 130.

### Internal links — required (guard)
- Link to the existing published **`normal-distribution`** article — file 18 states this
  bridges into that article per the backfill note: "the empirical rule is a direct
  consequence of the normal distribution." Cross-link required.

### Calculator embed
Yes — embed a Normal Distribution calculator (with SD-band output), from the
Normal/Binomial/Poisson distribution + Z-table suite (`08-site-architecture.md` §2, suite
6). Natural fit since the empirical rule is a direct, calculator-friendly application of the
normal distribution.

### Do not
- Do not invent or target "68-95-99.7" or "empirical rule calculator" as keywords — zero
  confirmed search volume for either phrasing across two independent research rounds.
- Do not invent additional supporting keywords beyond the single confirmed term — this is
  the thinnest keyword-validated topic in the batch; do not pad the keyword list to make it
  look stronger than the data supports.

---

---

## Part 2: Structural & Topical-Authority Articles (16–30)

**No confirmed keyword data for any article in this part** — DataForSEO's `keyword_ideas`
endpoint returned zero genuine on-topic signal across two independent seeding rounds (file 16
+ file 17) for all 14 topical-authority-only articles, and the 1 structural-only hub (H01)
was never intended to carry a keyword target. These are written for competitive
topical-authority completeness — present on every benchmarked competitor site, or a Khan
Academy/Penn State near-mandatory curriculum topic per file 14's benchmarking — not on
search-volume grounds. Per file 17 §4's standing caveat: a zero result from this data source
is evidence of no Google-Ads-idea-generation signal, not proof of zero real-world search
demand.


## 16. H01 — Permutations vs. Combinations: What's the Difference?

- **Slug:** `/permutations-and-combinations/`
- **Category:** Combinatorics (`/combinatorics/`)
- **Target word count:** 1,600
- **Status:** Structural-only (no keyword target — navigation/decision hub)

### Frontmatter (suggested)
```
title: "Permutations vs. Combinations: What's the Difference?"
h1: "Permutations vs. Combinations"
draft: true
category: "Combinatorics"
related: ["permutations", "combinations", "fundamental-counting-principle", "binomial-theorem"]
```

### Keywords
No keyword target — structural/navigation page. File 18 §4: "permutations vs combinations,"
"difference between permutation and combination," and "when to use" phrasing all returned
**zero** across two independent seed rounds (file 17 §3(b)). This page is not expected to
rank on its own; do not invent or estimate a figure for it.

### Search intent & reader question
Navigational/decision intent. The reader has typically already met both terms (via search,
a spoke article, or the `/combinatorics/` category hub) and wants one fast answer: "Does my
problem care about order? If yes, permutation; if no, combination." Success for this page is
measured by whether it routes the reader efficiently to the four spokes, not by organic
sessions of its own.

### Section-by-section outline
1. **Introduction** (~100 words) — hook: same items, two different counts, depending on one
   question.
2. **The One Question That Decides It: Does Order Matter?** (~250 words) — the core decision
   framework stated plainly.
3. **Decision Flowchart (described)** (~200 words) — Are you arranging/ordering items? → Yes:
   Permutations (link `/permutations/`) / No: Combinations (link `/combinations/`). Are you
   counting sequential independent choices across categories instead? → Fundamental Counting
   Principle (link `/fundamental-counting-principle/`). Are you expanding an algebraic power or
   working with "n choose k" coefficients? → Binomial Theorem (link `/binomial-theorem/`).
4. **Permutations at a Glance** (~200 words) — short definition, formula, one-line example,
   defer full treatment to T20.
5. **Combinations at a Glance** (~200 words) — short definition, formula, one-line example,
   defer full treatment to T21.
6. **Side-by-Side Comparison Table** (~200 words + table) — order matters?, formula, example
   question, typical use case.
7. **Quick Worked Contrast** (~250 words) — see below.
8. **Where the Other Two Cluster Pieces Fit** (~150 words) — named links to the Fundamental
   Counting Principle (T19) and Binomial Theorem (T22) as the cluster's other two spokes.
9. **FAQ** (~150 words).

### Worked example(s)
Same 4 letters {A, B, C, D}, choose 2. Permutations: `P(4,2) = 12` (AB and BA both count,
order matters). Combinations: `C(4,2) = 6` (AB and BA are the same selection). Show both
computations side by side so the order-matters distinction is concrete, not just verbal.

### Internal links — required (guard)
- Must explicitly link down to **all 4 spokes by name/slug** — file 18 §4 internal-linking
  note: "H01 (hub) sits at the top of the cluster and links down to all 4 spokes: T19, T20,
  T21, T22." Link to `/fundamental-counting-principle/` (T19), `/permutations/` (T20),
  `/combinations/` (T21), and `/binomial-theorem/` (T22).
- Link to the **`/combinatorics/` category hub**.

### Calculator embed
Yes — embed the Permutation and Combination calculators side by side (or a single toggle
widget), from the Permutation/Combination/Factorial suite (`08-site-architecture.md` §2,
suite 5), framed as "try both and see the difference." This reinforces the page's
decision-hub job rather than functioning as a third, separate tool page.

### Do not
- Do not attempt to rank this page independently or assign it a primary keyword target —
  file 17 confirmed zero volume for "permutations vs combinations" and its variants across
  two rounds.
- Do not duplicate T20/T21's full formula derivations or worked examples at depth — keep this
  page a fast router and defer depth to the spokes.
- Do not brief T19/T20/T21/T22 content here — they are covered elsewhere and out of scope for
  this document; H01 only needs to *link* to them by name/slug.

---

## 17. T19 — The Fundamental Counting Principle Explained

- **Slug:** `/fundamental-counting-principle/`
- **Category:** Combinatorics (`/combinatorics/`)
- **Target word count:** 1,900
- **Status:** Topical-authority-only

### Frontmatter (suggested)
```
title: "The Fundamental Counting Principle Explained"
h1: "The Fundamental Counting Principle"
draft: true
category: "Combinatorics"
related: ["permutations", "combinations", "permutations-and-combinations"]
```

### Keywords
No confirmed keyword data — topical-authority write. Per file 18 §8: written for competitive
topical-authority completeness (present on every benchmarked competitor site / a Khan
Academy-style near-mandatory curriculum topic per file 14's benchmarking), and it is the
cluster's conceptual prerequisite — not written on search-volume grounds.

### Search intent & reader question
Informational/foundational intent. Reader question: "What is the fundamental counting
principle (multiplication rule), and how do I use it to count total outcomes across multiple
independent choices?"

### Section-by-section outline
1. **Introduction** (~120 words) — hook: how many outfits from 3 shirts × 4 pants × 2 pairs of
   shoes?
2. **What the Fundamental Counting Principle Says** (~300 words) — multiply the number of
   choices at each independent stage to get the total number of outcomes.
3. **The Multiplication Rule Formula** (~200 words) — if event 1 has m ways and event 2 has n
   ways, total = m × n; extends to any number of stages.
4. **Simple Worked Example: Outfits** (~300 words) — see below.
5. **Extending to More Than Two Choices** (~250 words) — PIN-code example with more stages.
6. **Counting Principle vs. Permutations vs. Combinations** (~300 words) — conceptual bridge:
   the counting principle handles independent sequential choices across categories;
   permutations/combinations handle selecting or arranging from one pool. Explicit pointer to
   H01 for the full comparison rather than re-litigating it here.
7. **Common Mistakes** (~200 words) — forgetting a stage, confusing "and" (multiply) with "or"
   (add).
8. **Where This Shows Up** (~150 words) — passwords/PINs, menu combinations, setting up more
   complex probability problems.
9. **FAQ** (~150 words).

### Worked example(s)
- Outfits: 3 shirts × 4 pants × 2 pairs of shoes = `3 × 4 × 2 = 24` possible outfits.
- PIN code: a 4-digit PIN using digits 0–9. With repetition allowed: `10 × 10 × 10 × 10 =
  10,000`. Without repetition: `10 × 9 × 8 × 7 = 5,040`. Show both side by side to make the
  repetition condition concrete.

### Internal links — required (guard)
- Link up to **H01 (hub)** at `/permutations-and-combinations/` and to the **`/combinatorics/`
  category hub** — file 18 §4: every spoke links back up to the hub and the category hub.
- Link forward to **T20 (Permutations)** and **T21 (Combinations)** as "where this leads
  next" — file 18 §4 states the reciprocal guard ("T19 is the conceptual prerequisite — link
  it from T20 and T21"); linking forward from T19 itself is the natural complement, though
  the binding direction of that specific guard is T20/T21 → T19 (out of scope here).

### Calculator embed
None identified. The Permutation/Combination/Factorial suite (`08-site-architecture.md` §2,
suite 5) does not include a generic multiplication-rule/counting calculator. Flag as a
possible future calculator gap; no embed for this batch.

### Do not
- Do not fold in permutation or combination formula derivations here — keep this scoped to
  the multiplication rule itself and defer "what happens next" to T20/T21 via links.
- Do not invent search-volume/KD figures — no confirmed keyword data per file 18 §8.

---

## 18. T01 — One-Way ANOVA: When and How to Use It

- **Slug:** `/one-way-anova/`
- **Category:** Inferential & Hypothesis Testing (`/inferential-statistics/`)
- **Target word count:** 2,300
- **Status:** Topical-authority-only

### Frontmatter (suggested)
```
title: "One-Way ANOVA: When and How to Use It"
h1: "One-Way ANOVA"
draft: true
category: "Inferential & Hypothesis Testing"
related: ["kruskal-wallis-test", "two-way-anova", "post-hoc-tests"]
```

### Keywords
No confirmed keyword data — topical-authority write. Per file 18 §1 guard: "T01/T02/T03/T05:
zero keyword signal across two independent seeding rounds (file 17 §4) — written per this
session's explicit topical-authority directive, not on search-volume grounds. Do not invent
volume/KD figures for these when briefing."

### Search intent & reader question
Informational/how-to intent. Reader question: "What is a one-way ANOVA, when should I use it
instead of running multiple t-tests, and how do I calculate the F-statistic?"

### Section-by-section outline
1. **Introduction** (~150 words) — hook: comparing 3+ group means, and why you can't just run
   multiple t-tests.
2. **What One-Way ANOVA Tests** (~300 words) — one categorical factor with 3+ levels, one
   continuous dependent variable; null hypothesis = all group means equal.
3. **Why Not Just Run Multiple T-Tests?** (~250 words) — family-wise error rate inflation as
   the motivating problem ANOVA solves.
4. **The F-Statistic: Between-Group vs. Within-Group Variance** (~350 words) — conceptual
   build-up to `F = MS_between / MS_within`.
5. **Assumptions** (~250 words) — independence, normality within each group, homogeneity of
   variance (Levene's test as the standard check).
6. **Worked Example: Computing the F-Ratio** (~500 words) — see below.
7. **Interpreting the Result** (~200 words) — comparing F to a critical value / using the
   p-value; a significant result says groups differ, not *which* ones.
8. **What Comes Next: Post-Hoc Tests** (~200 words) — explicit link to T03.
9. **One-Way ANOVA vs. Its Non-Parametric Analogue** (~200 words) — explicit cross-link to
   T15 (Kruskal-Wallis) — see guard below.
10. **FAQ** (~150 words).

### Worked example(s)
Three groups (n=3 each), plant growth in cm: Group 1: 5, 7, 9 (mean 7); Group 2: 8, 10, 12
(mean 10); Group 3: 11, 13, 15 (mean 13). Grand mean = 10.
`SS_between = 3·[(7−10)² + (10−10)² + (13−10)²] = 3·(9+0+9) = 54`, `df_between = 2`,
`MS_between = 27`.
`SS_within` (deviations from each group's own mean, squared and summed): Group 1 = 8, Group 2
= 8, Group 3 = 8 → `SS_within = 24`, `df_within = 6`, `MS_within = 4`.
`F = 27/4 = 6.75`. Compare to `F_critical(2,6) ≈ 5.14` at α = 0.05 → 6.75 > 5.14, reject the
null; the groups' means differ significantly. Walk through the full ANOVA-table layout (SS,
df, MS, F) with these numbers filled in.

### Internal links — required (guard)
- Cross-link to **T15 (Kruskal-Wallis Test)** at `/kruskal-wallis-test/` as the non-parametric
  analogue — file 18 §1 guard: "Kruskal-Wallis is the non-parametric analogue of one-way
  ANOVA; cross-link T15→T01 once both exist, don't merge keywords." Reference each other as
  sibling tests; do **not** blend content or keyword targeting.
- Do not let "kruskal wallis analysis of variance" phrasing (or its variants) appear on this
  page even though it contains "analysis of variance" — confirmed twice (file 16 §2, file 17
  §2) that this phrasing belongs to T15 exclusively.

### Internal links — recommended (non-binding)
- `/post-hoc-tests/` (T03) — natural next step after a significant ANOVA result.
- `/two-way-anova/` (T02) — the multi-factor extension of this test.

### Calculator embed
None identified. No calculator suite in `08-site-architecture.md` §2 covers ANOVA/F-ratio
computation (suite 8 tops out at chi-square/t-test/CI/p-value). Flag as a likely future
calculator gap — same pattern batch 1 flagged for the non-parametric tests (T14/T15).

### Do not
- Do not use "kruskal wallis analysis of variance" phrasing anywhere on this page — confirmed
  as belonging to T15 only.
- Do not invent volume/KD figures — no confirmed keyword data for this topic.

---

## 19. T02 — Two-Way ANOVA: Testing Multiple Factors

- **Slug:** `/two-way-anova/`
- **Category:** Inferential & Hypothesis Testing (`/inferential-statistics/`)
- **Target word count:** 2,100
- **Status:** Topical-authority-only

### Frontmatter (suggested)
```
title: "Two-Way ANOVA: Testing Multiple Factors"
h1: "Two-Way ANOVA"
draft: true
category: "Inferential & Hypothesis Testing"
related: ["one-way-anova", "post-hoc-tests"]
```

### Keywords
No confirmed keyword data — topical-authority write (same T01/T02/T03/T05 zero-signal group
guard, file 18 §1).

### Search intent & reader question
Informational/how-to intent. Reader question: "What is a two-way ANOVA, and how does it let
me test two factors — and whether they interact — at the same time?"

### Section-by-section outline
1. **Introduction** (~150 words) — hook: what if you have two categorical factors, not one
   (e.g., fertilizer type *and* watering frequency)?
2. **What Two-Way ANOVA Tests** (~300 words) — two independent factors, three hypotheses: main
   effect of A, main effect of B, and the A×B interaction effect.
3. **Main Effects vs. Interaction Effects** (~350 words) — the conceptual core of the topic;
   explain with a described interaction pattern.
4. **The Two-Way ANOVA Table Structure** (~300 words) — sources of variance (A, B, A×B,
   within/error), df for each, and how each F-ratio is formed.
5. **Assumptions** (~200 words) — same family as one-way ANOVA (independence, normality,
   homogeneity of variance), plus a note on balanced-design considerations.
6. **Worked Example: Two Factors, Interaction Check** (~450 words) — see below.
7. **Interpreting an Interaction Effect** (~250 words) — why a significant interaction changes
   how you read the main effects.
8. **Two-Way vs. One-Way ANOVA** (~150 words) — link back to T01.
9. **FAQ** (~150 words).

### Worked example(s)
A 2×2 design: Factor A = fertilizer (no/yes), Factor B = watering (low/high), DV = plant
growth (cm). Cell means: no-fert/low = 8, no-fert/high = 9, fert/low = 10, fert/high = 15.
Walk through the logic verbally/numerically: the fertilizer effect is +2 under low watering
(10−8) but +6 under high watering (15−9) — a much bigger jump, signaling an interaction
between the two factors. Note explicitly that this worked walkthrough is a conceptual
mean-table illustration of *how* an interaction shows up, not a full manual sum-of-squares
computation (see "Do not" below).

### Internal links — required (guard)
None specified as a named, binding guard in file 18 for T02 beyond the general T01/T02/T03/T05
zero-keyword-signal group note.

### Internal links — recommended (non-binding)
- `/one-way-anova/` (T01) — single-factor foundation this article extends.
- `/post-hoc-tests/` (T03) — post-hoc follow-up after a significant main or interaction
  effect.

### Calculator embed
None identified — same gap as T01; no calculator suite covers two-way ANOVA computation.

### Do not
- Do not invent volume/KD figures — no confirmed keyword data (file 18 §1/§8).
- Do not attempt a full manual two-way ANOVA sum-of-squares computation in the worked example
  — the three-way variance decomposition is better taught conceptually via a cell-mean table
  and interaction description at this word count than via full hand arithmetic; a fully
  computed worked table is better suited to a future, more advanced piece.

---

## 20. T03 — Post-Hoc Tests: Tukey, Bonferroni & When to Use Them

- **Slug:** `/post-hoc-tests/`
- **Category:** Inferential & Hypothesis Testing (`/inferential-statistics/`)
- **Target word count:** 2,000
- **Status:** Topical-authority-only

### Frontmatter (suggested)
```
title: "Post-Hoc Tests: Tukey, Bonferroni & When to Use Them"
h1: "Post-Hoc Tests"
draft: true
category: "Inferential & Hypothesis Testing"
related: ["one-way-anova", "which-statistical-test-should-i-use"]
```

### Keywords
No confirmed keyword data — topical-authority write (same T01/T02/T03/T05 zero-signal group
guard, file 18 §1).

### Search intent & reader question
Informational/how-to intent. Reader question: "My ANOVA came back significant — now which
specific groups actually differ? What's a post-hoc test, and should I use Tukey's HSD or
Bonferroni?"

### Section-by-section outline
1. **Introduction** (~150 words) — hook: ANOVA tells you *that* groups differ, not *which*
   ones; post-hoc tests answer "which."
2. **Why You Need a Post-Hoc Test After a Significant ANOVA** (~250 words) — the multiple
   comparisons problem and family-wise error rate.
3. **Tukey's HSD (Honestly Significant Difference)** (~350 words) — what it does, when it's
   preferred (equal-ish sample sizes, all pairwise comparisons).
4. **Bonferroni Correction** (~350 words) — simple and conservative; formula
   (adjusted α = α / number of comparisons); when it's preferred (a small number of planned
   comparisons).
5. **Other Common Post-Hoc Tests, Briefly** (~200 words) — Scheffé, Dunnett — one-line
   mentions, not full treatments.
6. **Tukey vs. Bonferroni: Which Should You Use?** (~250 words) — short decision guidance.
7. **Worked Example: Bonferroni-Corrected Pairwise Comparisons** (~400 words) — see below.
8. **Common Mistakes** (~150 words) — running post-hoc tests without a significant omnibus
   ANOVA first, selective/cherry-picked reporting.
9. **FAQ** (~150 words).

### Worked example(s)
Building on T01's three-group plant-growth data (means 7, 10, 13; significant F). Three
pairwise comparisons are possible (1v2, 1v3, 2v3). Bonferroni-adjusted α = 0.05 / 3 ≈ 0.0167.
Show that each pairwise t-test now needs p < 0.0167 (not p < 0.05) to be declared significant,
and note the 1-vs-3 comparison (largest mean gap, 7 vs. 13) is the one most likely to survive
the stricter threshold, while the smaller 1-vs-2 or 2-vs-3 gaps may not.

### Internal links — required (guard)
None specified as a named, binding guard in file 18 for T03.

### Internal links — recommended (non-binding)
- `/one-way-anova/` (T01) — the originating test post-hoc analysis follows.
- `/which-statistical-test-should-i-use/` (B08) — readers may arrive here from the decision
  hub.

### Calculator embed
None identified. No calculator suite in `08-site-architecture.md` §2 covers Tukey HSD or
Bonferroni correction. Content-only page.

### Do not
- Do not invent volume/KD figures — no confirmed keyword data.
- Do not present post-hoc testing as a standalone alternative to ANOVA — always frame it as
  the necessary follow-up step after a significant omnibus result.

---

## 21. T05 — Statistical Power: What It Means and How to Calculate It

- **Slug:** `/statistical-power/`
- **Category:** Inferential & Hypothesis Testing (`/inferential-statistics/`)
- **Target word count:** 2,000
- **Status:** Topical-authority-only

### Frontmatter (suggested)
```
title: "Statistical Power: What It Means and How to Calculate It"
h1: "Statistical Power"
draft: true
category: "Inferential & Hypothesis Testing"
related: ["type-i-and-type-ii-errors", "effect-size"]
```

### Keywords
No confirmed keyword data — topical-authority write (same T01/T02/T03/T05 zero-signal group
guard, file 18 §1).

### Search intent & reader question
Informational/how-to intent. Reader question: "What is statistical power, how do I estimate
it, and what factors increase it?"

### Section-by-section outline
1. **Introduction** (~150 words) — hook: power is the chance your test correctly detects a
   real effect when one exists.
2. **What Statistical Power Means** (~300 words) — `power = 1 − β`, formally tied to Type II
   error.
3. **The Four Factors That Affect Power** (~400 words) — sample size, effect size,
   significance level (α), and variability — each briefly.
4. **Why Power Matters** (~250 words) — underpowered studies risk false negatives and wasted
   resources; power analysis belongs *before* data collection.
5. **How Power Is Calculated (Conceptual, Not a Full Derivation)** (~300 words) — power depends
   on the non-central distribution of the test statistic; in practice researchers use software
   (G*Power, R's `pwr`), not hand calculation — set realistic expectations.
6. **Worked Example: Estimating Power for a Simple Case** (~400 words) — see below.
7. **A Priori vs. Post-Hoc Power Analysis** (~200 words) — planning power before a study vs.
   computing "achieved" power after, with a brief caution about the limits of post-hoc power.
8. **The Conventional 0.80 Target** (~150 words) — where the common rule-of-thumb power level
   comes from.
9. **FAQ** (~150 words).

### Worked example(s)
Two-sample z-test scenario: known σ = 10, n = 25 per group, true difference in means δ = 5,
α = 0.05 two-tailed (`z_crit = 1.96`). Standard error of the difference =
`10·√(2/25) = 2.83`. `z_effect = 5/2.83 ≈ 1.77`. Power `= P(Z > z_crit − z_effect) =
P(Z > 1.96 − 1.77) = P(Z > 0.19) ≈ 0.42` — a 42% chance of detecting the effect: underpowered.
Then show raising n to 100 per group: SE `= 10·√(2/100) = 1.41`, `z_effect = 5/1.41 ≈ 3.54`,
power `= P(Z > 1.96 − 3.54) = P(Z > −1.58) ≈ 0.94` — 94%, illustrating how power rises sharply
with sample size.

### Internal links — required (guard)
None specified as a named, binding guard in file 18 for T05 beyond the general
T01/T02/T03/T05 group note.

### Internal links — recommended (non-binding)
- `/type-i-and-type-ii-errors/` (T04, batch 1) — power is 1 − β, directly defined via Type II
  error.
- `/effect-size/` (T06, batch 1) — effect size is one of the four inputs to power.

### Calculator embed
None identified in the current 8 calculator suites (`08-site-architecture.md` §2) — power
analysis isn't covered by any listed suite. Flag as a likely future calculator gap;
content-only for this batch.

### Do not
- Do not invent volume/KD figures — zero keyword signal across two independent seeding
  rounds per file 18 §1/§8.
- Do not present the worked power calculation as a substitute for real statistical software —
  frame it explicitly as a simplified teaching illustration, not a production-grade power
  analysis.

---

## 22. B08 — Which Statistical Test Should You Use? A Decision Guide

- **Slug:** `/which-statistical-test-should-i-use/`
- **Category:** Inferential & Hypothesis Testing (`/inferential-statistics/`)
- **Target word count:** 1,700
- **Status:** Topical-authority-only (structural wayfinding page, no cannibalization risk per
  file 15)

### Frontmatter (suggested)
```
title: "Which Statistical Test Should You Use? A Decision Guide"
h1: "Which Statistical Test Should You Use?"
draft: true
category: "Inferential & Hypothesis Testing"
related: ["one-way-anova", "paired-vs-independent-t-test", "mann-whitney-u-test", "kruskal-wallis-test"]
```

### Keywords
No confirmed keyword data — topical-authority write (structural wayfinding page, no
cannibalization risk per file 15) — exact framing per file 18 §1.

### Search intent & reader question
Navigational/decision intent. Reader question: "I have a dataset and a question — which
statistical test should I actually run?" This is the category's front-door decision-tree
page, playing a similar structural role for Inferential & Hypothesis Testing that H01 plays
for Combinatorics.

### Section-by-section outline
1. **Introduction** (~120 words) — hook: "which test do I use" is the most common stats-101
   stumbling block; promise a decision framework, not an exhaustive textbook.
2. **The Three Questions That Narrow It Down** (~350 words) — (1) how many groups/variables?
   (2) is your data continuous or categorical? (3) are your groups independent or related
   (paired)?
3. **Decision Tree, Described** (~350 words) — walk the branches: 1 sample vs. 2 groups vs. 3+
   groups; parametric vs. non-parametric (normality); independent vs. paired.
4. **Quick-Reference Table: Test by Scenario** (~350 words + table) — scenario → recommended
   test → link. E.g. "2 independent groups, normal data" → independent t-test
   (`/paired-vs-independent-t-test/`); "2 independent groups, non-normal/ordinal" →
   Mann-Whitney U (`/mann-whitney-u-test/`); "3+ independent groups, normal data" → one-way
   ANOVA (`/one-way-anova/`); "3+ independent groups, non-normal" → Kruskal-Wallis
   (`/kruskal-wallis-test/`); "association between two categorical variables" → chi-square
   test (existing `chi-square-test` article); "relationship between two continuous variables"
   → correlation/regression.
5. **When Assumptions Aren't Met** (~200 words) — brief pointer to non-parametric alternatives
   and to `/regression-assumptions/` (T11).
6. **Worked Scenario Walk-Through** (~180 words) — see below.
7. **FAQ** (~150 words).

### Worked example(s)
A decision-hub page doesn't carry a numeric worked example; instead, walk one concrete
scenario through the three questions: "A researcher has exam scores from 3 teaching methods
(3 independent groups, continuous, roughly normal data)." Question 1: 3+ groups → not a
t-test. Question 2: continuous → not chi-square. Question 3: independent, normal → arrives at
One-Way ANOVA (link to T01). This is the article's "worked example" in decision-tree form,
matching the page's routing purpose.

### Internal links — required (guard)
None named as a binding, specific guard in file 18 for B08 (file 18 only flags B08 itself as
topical-authority/structural with no cannibalization risk). As a routing hub it should
nonetheless link to every test article it names — treat the list below as editorial judgment,
not a file-18 guard.

### Internal links — recommended (non-binding)
- `/one-way-anova/` (T01), `/two-way-anova/` (T02), `/mann-whitney-u-test/` (T14, batch 1),
  `/kruskal-wallis-test/` (T15, batch 1), `/paired-vs-independent-t-test/` (T16, batch 1), the
  existing `chi-square-test` article, and existing correlation/regression articles.

### Calculator embed
None. Pure wayfinding/decision content spanning many different test families — no single
calculator suite fits; the page's job is routing to the tests (and their own embeds), not
hosting a tool itself.

### Do not
- Do not turn this into a full test-by-test tutorial — each linked test already has (or will
  have) its own dedicated article; this page's job is routing, not teaching.
- Do not invent volume/KD figures.
- Do not present the decision tree as exhaustive or clinical-grade guidance — note briefly
  that edge cases and complex designs may need a statistician.

---

## 23. T07 — F-Test and F-Distribution Explained

- **Slug:** `/f-test-f-distribution/`
- **Category:** Probability & Distributions (`/probability-distributions/`)
- **Target word count:** 1,900
- **Status:** Topical-authority-only

### Frontmatter (suggested)
```
title: "F-Test and F-Distribution Explained"
h1: "F-Test and F-Distribution"
draft: true
category: "Probability & Distributions"
related: ["one-way-anova"]
```

### Keywords
No confirmed keyword data — topical-authority write.

### Search intent & reader question
Informational/definitional intent. Reader question: "What is the F-test / F-distribution, and
how is it used to compare variances or evaluate ANOVA results?"

### Section-by-section outline
1. **Introduction** (~150 words) — hook: the F-distribution is the "ratio of variances"
   distribution — readers may have already met it inside an ANOVA table.
2. **What the F-Distribution Is** (~300 words) — ratio of two (chi-square-scaled) variances,
   shape governed by two df parameters (numerator, denominator), always non-negative,
   right-skewed.
3. **The F-Test: Comparing Two Variances** (~350 words) — `F = s1² / s2²`, testing whether two
   population variances are equal.
4. **The F-Distribution's Role in ANOVA (brief)** (~250 words) — the ANOVA F-statistic
   (`MS_between / MS_within`) follows an F-distribution under the null; pointer to T01 rather
   than re-deriving it here.
5. **Degrees of Freedom: Numerator and Denominator** (~250 words) — how the two df values
   shape the curve, kept brief.
6. **Worked Example: F-Test for Equality of Variances** (~400 words) — see below.
7. **Reading an F-Table / Critical Values** (~200 words) — brief, practical.
8. **FAQ** (~150 words).

### Worked example(s)
Sample A: variance = 25, n = 10 (df = 9). Sample B: variance = 10, n = 13 (df = 12).
`F = 25/10 = 2.5`. Compare to `F_critical(9,12) ≈ 2.80` at α = 0.05. Since 2.5 < 2.80, fail to
reject the null — the two variances are not significantly different. Walk through why the
larger sample variance always goes in the numerator by convention.

### Internal links — required (guard)
- **Scope guard (file 18 §2):** "T07: scope is narrowed to F-test/F-distribution only. The
  chi-square-distribution and t-distribution portions of the original candidate are **not**
  part of T07 — those belong to the existing planned `chi-square-distribution` article and
  the published `test-statistic` article respectively. Do not fold those two back into T07."
  Link to those two existing articles as pointers for readers wanting the sibling
  distributions — do not absorb their content.
- Link to **T01 (One-Way ANOVA)** at `/one-way-anova/` since the F-distribution underlies the
  ANOVA F-ratio (recommended pairing consistent with the scope guard's "point elsewhere,
  don't absorb" logic).

### Calculator embed
None identified. Neither suite 6 (Normal/Binomial/Poisson + Z-table) nor suite 8
(Z-score/t-test/Chi-square/CI/p-value) includes an F-distribution/F-test calculator. Flag as
a calculator gap.

### Do not
- Do not fold in chi-square-distribution or t-distribution content — hard scope guard per
  file 18 §2.
- Do not invent volume/KD figures.

---

## 24. T09 — Sampling Distributions: What They Are and Why They Matter

- **Slug:** `/sampling-distributions/`
- **Category:** Probability & Distributions (`/probability-distributions/`)
- **Target word count:** 1,900
- **Status:** Topical-authority-only

### Frontmatter (suggested)
```
title: "Sampling Distributions: What They Are and Why They Matter"
h1: "Sampling Distributions"
draft: true
category: "Probability & Distributions"
related: ["central-limit-theorem"]
```

### Keywords
No confirmed keyword data — topical-authority write.

### Search intent & reader question
Informational/conceptual intent. Reader question: "What is a sampling distribution
(specifically of the mean or of a proportion), and why does it matter for statistical
inference?"

### Section-by-section outline
1. **Introduction** (~150 words) — hook: distinguish "the distribution of your data" from
   "the distribution of a statistic computed across repeated samples."
2. **What a Sampling Distribution Is** (~300 words) — explicitly scoped to the sampling
   distribution of the mean / of the proportion (see scope guard below).
3. **The Sampling Distribution of the Mean** (~350 words) — shape (approaches normal per
   CLT), center (= population mean), spread (standard error = `σ/√n`); pointer to
   `/central-limit-theorem/` rather than re-deriving CLT here.
4. **The Sampling Distribution of the Proportion** (~300 words) — shape conditions
   (`np ≥ 5`, `n(1−p) ≥ 5`), standard error formula `√(p(1−p)/n)`.
5. **Why Sampling Distributions Matter for Inference** (~250 words) — the theoretical basis
   for confidence intervals and hypothesis tests.
6. **Worked Example: Standard Error of the Mean and of a Proportion** (~400 words) — see
   below.
7. **Sampling Distribution vs. Population Distribution (brief disambiguation)** (~200 words).
8. **FAQ** (~150 words).

### Worked example(s)
Mean: population of delivery times with σ = 8 minutes, sample size n = 16 →
`SE_mean = 8/√16 = 2` minutes. Proportion: survey of n = 200 respondents, sample proportion
`p̂ = 0.35` → `SE_prop = √(0.35 × 0.65 / 200) = √0.0011375 ≈ 0.0337` (≈3.37%). Walk through
both calculations explicitly, then note how each SE would shrink with a larger sample.

### Internal links — required (guard)
- **Scope guard (file 18 §2):** "T09: scope explicitly to 'sampling distribution of the
  mean/proportion,' not general population distribution — the published
  `probability-distribution` article already owns 'distribution of population'/'distribution
  population' (file 15 #14 minor-watch note)." Link to the published `probability-distribution`
  article as the disambiguation pointer.
- **Same guard, second half:** chi-square-distribution terms leaked into T09's own research
  pull ("chi square distribution" 8,100/KD24, "chi-squared distribution" 8,100/KD23,
  "chi-square distribution" 8,100/KD25) belong to `chi-square-distribution`, not T09 (file 17
  §2) — link to that existing article as the correct destination for those terms, do not
  target them here.
- Link to `/central-limit-theorem/` (T08, batch 1) as the mechanism explaining why the
  sampling distribution of the mean is approximately normal.

### Calculator embed
None identified — no calculator suite covers a sampling-distribution simulator (same gap
batch 1 flagged for T08/Central Limit Theorem). Content-only.

### Do not
- Do not scope-creep into general population-distribution content — that is owned by the
  published `probability-distribution` article (hard guard).
- Do not use chi-square-distribution phrasings ("chi square distribution," "chi-squared
  distribution," etc.) as keywords or heavy heading emphasis on this page — confirmed leaks
  that belong to the existing `chi-square-distribution` article.
- Do not invent volume/KD figures.

---

## 25. T10 — Poisson Distribution: Formula & Examples

- **Slug:** `/poisson-distribution/`
- **Category:** Probability & Distributions (`/probability-distributions/`)
- **Target word count:** 2,100
- **Status:** Topical-authority-only

### Frontmatter (suggested)
```
title: "Poisson Distribution: Formula & Examples"
h1: "Poisson Distribution"
draft: true
category: "Probability & Distributions"
related: []
```

### Keywords
No confirmed keyword data — topical-authority write.

### Search intent & reader question
Informational/how-to intent. Reader question: "What is the Poisson distribution, when do I
use it, and how do I calculate a Poisson probability?"

### Section-by-section outline
1. **Introduction** (~150 words) — hook: modeling rare/random events over a fixed interval
   (calls per hour, typos per page).
2. **What the Poisson Distribution Models** (~300 words) — a discrete count of events in a
   fixed interval of time/space, events independent, known average rate λ.
3. **The Poisson Formula** (~300 words) — `P(X=k) = (e^−λ · λ^k) / k!`, define every term.
4. **Conditions for Using the Poisson Distribution** (~250 words) — independence, constant
   rate, events can't occur simultaneously, "rare event" framing.
5. **Worked Example: Computing a Poisson Probability** (~450 words) — see below.
6. **Poisson vs. Binomial (brief)** (~250 words) — when Poisson approximates binomial (large
   n, small p), and how the two differ conceptually.
7. **Mean and Variance of a Poisson Distribution** (~200 words) — both equal λ, a distinctive
   property worth calling out.
8. **FAQ** (~150 words).

### Worked example(s)
A call center receives an average of λ = 4 calls per 10-minute interval. Probability of
exactly 6 calls in a given interval: `P(X=6) = (e^−4 × 4^6) / 6! = (0.0183 × 4096) / 720 ≈
0.1042` (≈10.4%). Show the arithmetic step by step: `e^−4 ≈ 0.0183`, `4^6 = 4096`, `6! = 720`.

### Internal links — required (guard)
None named as a binding, specific guard in file 18 for T10 beyond the general
topical-authority note.

### Internal links — recommended (non-binding)
- `/combinations/` (T21, batch 1) or `/binomial-theorem/` (T22, batch 1) — the `k!` term
  connects to the combinatorics cluster.
- The existing `binomial-distribution` article — natural pairing for the Poisson-vs-binomial
  comparison section.

### Calculator embed
Yes — embed a Poisson-distribution calculator, from the Normal/Binomial/Poisson distribution
+ Z-table suite (`08-site-architecture.md` §2, suite 6). Poisson is explicitly named in the
suite, so this is a direct match, not a tentative one.

### Do not
- Do not invent volume/KD figures — no confirmed keyword data.
- Do not conflate Poisson with binomial in the main definition sections — keep the comparison
  confined to its own dedicated subsection.

---

## 26. B02 — Independent, Dependent & Mutually Exclusive Events

- **Slug:** `/independent-dependent-mutually-exclusive-events/`
- **Category:** Probability & Distributions (`/probability-distributions/`)
- **Target word count:** 2,000
- **Status:** Topical-authority-only

### Frontmatter (suggested)
```
title: "Independent, Dependent & Mutually Exclusive Events"
h1: "Independent, Dependent & Mutually Exclusive Events"
draft: true
category: "Probability & Distributions"
related: ["bayes-theorem"]
```

### Keywords
No confirmed keyword data — topical-authority write.

### Search intent & reader question
Informational, comparison intent. Reader question: "What's the difference between independent
events, dependent events, and mutually exclusive events in probability?"

### Section-by-section outline
1. **Introduction** (~150 words) — hook: three terms that get confused constantly — all
   describe *relationships between events*, not the events themselves.
2. **Independent Events** (~300 words) — `P(A∩B) = P(A) × P(B)`; occurrence of one doesn't
   affect the probability of the other; example: two coin flips.
3. **Dependent Events** (~300 words) — occurrence of one changes the probability of the
   other; example: drawing cards without replacement; pointer toward conditional probability.
4. **Mutually Exclusive Events** (~300 words) — cannot both occur, `P(A∩B) = 0`; example:
   rolling a 2 *and* a 5 on a single die roll.
5. **The Big Mix-Up: Mutually Exclusive Is NOT the Same as Independent** (~350 words) — the
   article's key teaching moment; mutually exclusive events are actually maximally *dependent*
   (if A occurs, B cannot) — worked contrast.
6. **Side-by-Side Comparison Table** (~250 words + table).
7. **Worked Example: Classify Three Event Pairs** (~400 words) — see below.
8. **FAQ** (~150 words).

### Worked example(s)
Classify three pairs: (1) Heads on coin 1 and heads on coin 2 → independent. (2) Drawing a
king first, then a queen from the same deck, without replacement → dependent. (3) Rolling a 3
and rolling a 4 on one die roll → mutually exclusive, and therefore **not** independent — show
the math: `P(3) = 1/6`, `P(4) = 1/6`, but `P(3∩4) = 0 ≠ 1/6 × 1/6`, proving mutual exclusivity
and independence cannot both hold here.

### Internal links — required (guard)
None specified as binding in file 18 for B02.

### Internal links — recommended (non-binding)
- The existing `probability-formula` article — "dependent events" naturally leads to
  conditional probability.
- `/bayes-theorem/` (T18, batch 1) — Bayes' theorem is built on dependent-event/conditional
  reasoning.

### Calculator embed
Tentative — a basic Probability calculator (suite 4) may cover simple joint/conditional
probability calculations relevant to this topic, but suite 4 is not explicitly documented as
supporting independence/mutual-exclusivity classification. Flag for confirmation before build
— same treatment file 19 gave the Bayes' theorem (T18) embed.

### Do not
- Do not present mutually exclusive and independent as similar/overlapping concepts — the
  "not the same" distinction is this article's core teaching point and must stay explicit.
- Do not invent volume/KD figures.

---

## 27. B03 — Hypergeometric Distribution: Formula & Examples

- **Slug:** `/hypergeometric-distribution/`
- **Category:** Probability & Distributions (`/probability-distributions/`)
- **Target word count:** 2,000
- **Status:** Topical-authority-only

### Frontmatter (suggested)
```
title: "Hypergeometric Distribution: Formula & Examples"
h1: "Hypergeometric Distribution"
draft: true
category: "Probability & Distributions"
related: ["combinations"]
```

### Keywords
No confirmed keyword data — topical-authority write.

### Search intent & reader question
Informational/how-to intent. Reader question: "What is the hypergeometric distribution, how
is it different from the binomial distribution, and how do I calculate a hypergeometric
probability?"

### Section-by-section outline
1. **Introduction** (~150 words) — hook: sampling *without replacement* from a finite
   population (cards, defective parts in a batch).
2. **What the Hypergeometric Distribution Models** (~300 words) — fixed population size N,
   K successes in the population, sample of size n drawn without replacement.
3. **The Hypergeometric Formula** (~350 words) — `P(X=k) = [C(K,k)·C(N−K,n−k)] / C(N,n)`,
   define each term; pointer to `/combinations/` for the `C(n,r)` notation itself.
4. **Hypergeometric vs. Binomial: The Key Difference** (~300 words) — without vs. with
   replacement (or an effectively infinite population); when binomial is a good
   approximation.
5. **Worked Example: Computing a Hypergeometric Probability** (~450 words) — see below.
6. **Mean and Variance** (~200 words) — brief formulas.
7. **FAQ** (~150 words).

### Worked example(s)
A batch of 20 parts contains 4 defective. Draw 5 parts without replacement. Probability
exactly 2 are defective: N=20, K=4, n=5, k=2.
`P = [C(4,2) × C(16,3)] / C(20,5) = [6 × 560] / 15,504 = 3,360 / 15,504 ≈ 0.2168` (≈21.7%).
Show each combination computed explicitly: `C(4,2)=6`, `C(16,3)=560`, `C(20,5)=15,504`.

### Internal links — required (guard)
None specified as binding in file 18 for B03 directly. (Note: B03 is the article that "binomial
theorem" and "pascal's triangle" keywords were *reassigned away from* onto T22 — file 18 §4:
"source: file 16 T22, reassigned from the B03 pull." This is a keyword-reassignment note, not
a link guard for B03 itself, parallel to how B07 in batch 1 was the source of leaks reassigned
to T14/T15 without B07 itself carrying a link guard.)

### Internal links — recommended (non-binding)
- `/combinations/` (T21, batch 1) — for the `C(n,r)` notation used throughout the formula.
- The existing `binomial-distribution` article — natural pairing for the
  with/without-replacement contrast.

### Calculator embed
None identified. The Normal/Binomial/Poisson distribution suite (`08-site-architecture.md`
§2, suite 6) does not include hypergeometric. Flag as a calculator gap.

### Do not
- Do not re-attach "binomial theorem" or "pascal's triangle" keyword targeting to this page —
  file 18 confirms those were reassigned away from B03's original pull onto T22. Keep B03
  scoped to hypergeometric-distribution content only.
- Do not invent volume/KD figures.

---

## 28. T11 — Linear Regression Assumptions Explained

- **Slug:** `/regression-assumptions/`
- **Category:** Regression & Correlation (`/regression-correlation/`)
- **Target word count:** 2,100
- **Status:** Topical-authority-only

### Frontmatter (suggested)
```
title: "Linear Regression Assumptions Explained"
h1: "Linear Regression Assumptions"
draft: true
category: "Regression & Correlation"
related: ["multicollinearity-vif", "r-squared-adjusted-r-squared"]
```

### Keywords
No confirmed keyword data — topical-authority write.

### Search intent & reader question
Informational/how-to intent. Reader question: "What assumptions does linear regression
require, and how do I check whether my data meets them?"

### Section-by-section outline
1. **Introduction** (~150 words) — hook: a regression will run on almost any data, but its
   p-values and confidence intervals are only trustworthy if certain assumptions hold.
2. **The Five Core Assumptions, Overview** (~250 words) — linearity, independence of errors,
   homoscedasticity, normality of residuals, low multicollinearity — listed upfront.
3. **Linearity** (~250 words) — relationship between predictors and outcome should be linear;
   check via scatterplot/residual plot.
4. **Independence of Errors** (~200 words) — residuals shouldn't be correlated (especially
   time-series autocorrelation).
5. **Homoscedasticity (Constant Variance of Residuals)** (~300 words) — residual spread
   shouldn't change across fitted values; check via residual-vs-fitted plot.
6. **Normality of Residuals** (~250 words) — residuals approximately normal, especially
   important for small samples; check via Q-Q plot.
7. **Low Multicollinearity** (~200 words) — predictors shouldn't be highly correlated with
   each other; explicit pointer to T12 for the full VIF treatment rather than duplicating it.
8. **Worked Example: Spotting a Violated Assumption** (~400 words) — see below.
9. **What to Do When an Assumption Is Violated** (~200 words) — transformations, robust
   standard errors, alternative models — brief, not exhaustive.
10. **FAQ** (~150 words).

### Worked example(s)
Describe a residual-vs-fitted plot showing a classic heteroscedasticity "funnel": residual
variance in the lowest fitted-value tertile ≈ 4, in the highest fitted-value tertile ≈ 36 — a
9× increase. Walk through why this pattern signals heteroscedasticity (the constant-variance
assumption is violated), and what it means for the trustworthiness of the regression's
standard errors.

### Internal links — required (guard)
None specified as binding in file 18 for T11.

### Internal links — recommended (non-binding)
- `/multicollinearity-vif/` (T12) — full treatment of the multicollinearity assumption.
- `/r-squared-adjusted-r-squared/` (B06, batch 1) — same-category regression-diagnostics
  pairing.

### Calculator embed
Yes — embed a linear-regression calculator (with residual output where available) from the
Correlation(r)/Linear-regression suite (`08-site-architecture.md` §2, suite 7), letting
readers test their own data and eyeball a residual pattern. Consistent with the embed
rationale batch 1 gave B06 for the same suite.

### Do not
- Do not invent volume/KD figures — no confirmed keyword data.
- Do not turn the multicollinearity subsection into a full VIF treatment — keep it to a short
  definition plus an explicit hand-off to T12, avoiding content duplication between the two
  articles.

---

## 29. T12 — Multicollinearity & Variance Inflation Factor (VIF) Explained

- **Slug:** `/multicollinearity-vif/`
- **Category:** Regression & Correlation (`/regression-correlation/`)
- **Target word count:** 2,000
- **Status:** Topical-authority-only

### Frontmatter (suggested)
```
title: "Multicollinearity & Variance Inflation Factor (VIF) Explained"
h1: "Multicollinearity & VIF"
draft: true
category: "Regression & Correlation"
related: ["regression-assumptions"]
```

### Keywords
No confirmed keyword data — topical-authority write.

### Search intent & reader question
Informational/how-to intent. Reader question: "What is multicollinearity, how does it distort
a regression, and how do I calculate and interpret the Variance Inflation Factor (VIF)?"

### Section-by-section outline
1. **Introduction** (~150 words) — hook: predictors that are correlated with *each other* can
   quietly wreck a regression's coefficient estimates.
2. **What Multicollinearity Is** (~300 words) — two or more predictors highly correlated with
   one another; distinguish from the predictor-outcome relationship.
3. **Why Multicollinearity Is a Problem** (~300 words) — inflated standard errors, unstable
   coefficient estimates; note it does *not* hurt overall prediction/R² but does hurt
   individual-coefficient interpretation.
4. **Detecting Multicollinearity: The Variance Inflation Factor (VIF)** (~350 words) —
   `VIF_i = 1 / (1 − R_i²)`, where `R_i²` comes from regressing predictor *i* on all other
   predictors.
5. **Interpreting VIF Values** (~250 words) — common thresholds (VIF < 5 fine, 5–10
   concerning, > 10 problematic), with a caveat about field-specific norms.
6. **Worked Example: Computing and Interpreting VIF** (~450 words) — see below.
7. **What to Do About High Multicollinearity** (~250 words) — remove/combine correlated
   predictors, center variables, brief mention of ridge regression, or accept it if prediction
   (not coefficient interpretation) is the goal.
8. **FAQ** (~150 words).

### Worked example(s)
Predictor "years of experience," regressed on the other predictors (age, education level),
yields `R_i² = 0.85` for that auxiliary regression: `VIF = 1/(1−0.85) = 1/0.15 ≈ 6.67` —
flagged as concerning (above the common VIF > 5 threshold), meaning this predictor is
substantially explainable by the others and its own coefficient estimate is unstable.
Contrast with a second predictor with `R_i² = 0.20` → `VIF = 1/0.8 = 1.25`, well within the
acceptable range.

### Internal links — required (guard)
None specified as binding in file 18 for T12.

### Internal links — recommended (non-binding)
- `/regression-assumptions/` (T11) — VIF is the practical detection tool for the "low
  multicollinearity" assumption listed there; bidirectional link recommended.

### Calculator embed
Flag as a likely gap. The Correlation(r)/Linear-regression suite (`08-site-architecture.md`
§2, suite 7) as documented covers simple/bivariate correlation and linear regression, not the
multiple-regression-with-auxiliary-regressions machinery VIF requires. Do not assume suite 7
supports VIF computation without confirming the tool spec; no embed assumed for this batch.

### Do not
- Do not invent volume/KD figures — no confirmed keyword data.
- Do not assume a VIF calculator exists in suite 7 without confirmation — this is a narrower
  computational need (multiple regression) than the suite's documented simple/bivariate
  correlation-regression scope.

---

## 30. B04 — Simpson's Paradox: What It Is and Why It Happens

- **Slug:** `/simpsons-paradox/`
- **Category:** Regression & Correlation (`/regression-correlation/`)
- **Target word count:** 1,800
- **Status:** Topical-authority-only

### Frontmatter (suggested)
```
title: "Simpson's Paradox: What It Is and Why It Happens"
h1: "Simpson's Paradox"
draft: true
category: "Regression & Correlation"
related: ["correlation-vs-causation"]
```

### Keywords
No confirmed keyword data — topical-authority write. Per file 18 §3: two independent seed
rounds both returned total noise (TV-show contamination in batch 1, generic stats noise in
the re-seed — file 17 T/B04); state "no confirmed keyword data" plainly, do not treat the
noise as a usable figure.

### Search intent & reader question
Informational/conceptual, "aha" intent. Reader question: "What is Simpson's paradox, and how
can a trend reverse direction when you combine data across groups versus looking within each
group separately?"

### Section-by-section outline
1. **Introduction** (~150 words) — hook: a trend true for every subgroup can reverse when the
   subgroups are combined — sounds impossible, isn't.
2. **What Simpson's Paradox Is** (~300 words) — formal definition: an association observed
   within subgroups can disappear or reverse when the subgroups are aggregated.
3. **Why It Happens** (~300 words) — unequal subgroup sizes acting as a confounding/lurking
   variable.
4. **Worked Example: The Classic Reversal** (~500 words) — see below.
5. **Simpson's Paradox and Correlation vs. Causation** (~300 words) — explicit bridge; this is
   a specific mechanism by which naive aggregate correlations mislead, directly extending the
   companion article's warning — see guard below.
6. **How to Avoid Being Fooled by It** (~200 words) — always check for a plausible
   confounding/grouping variable before trusting an aggregate trend.
7. **Real-World Examples Where It's Been Documented** (~150 words) — brief, general mentions
   (e.g., admissions-rate and medical-treatment cases) without over-claiming precise citation
   detail (see "Do not" below).
8. **FAQ** (~150 words).

### Worked example(s)
Two treatments for kidney stones, split by stone size. Treatment A: small stones 81/87
successful (93%); large stones 192/263 successful (73%); combined 273/350 (78%). Treatment B:
small stones 234/270 successful (87%); large stones 55/80 successful (69%); combined 289/350
(83%). Combined, Treatment B looks better (83% vs. 78%) — but Treatment A is actually better
for *both* small stones (93% vs. 87%) and large stones (73% vs. 69%). The reversal happens
because Treatment A was used disproportionately on the harder (large-stone) cases. Present all
four percentages explicitly and highlight the "which treatment looks better" flip.

### Internal links — required (guard)
- Companion piece to the published **`correlation-vs-causation`** article — file 18 §3 guard:
  "B04: companion piece to the published `correlation-vs-causation` article per file 15's
  backfill note — cross-link the two once B04 exists." Link to `/correlation-vs-causation/`.

### Calculator embed
None. Purely conceptual/illustrative topic — no calculator suite in `08-site-architecture.md`
§2 applies. Content-only.

### Do not
- Do not invent volume/KD figures — two independent seed rounds returned only noise (TV-show
  contamination plus generic stats noise), not real signal.
- Do not present the "real-world examples" section's well-known cases (e.g., admissions-rate
  reversals) with fabricated precise statistics — describe them in general, well-established
  terms rather than inventing exact figures not verified in this research.

---

## T17 Fold-In — Not a 31st Article (do not brief as standalone)

**T17 (chi-square goodness-of-fit vs. independence) is not part of the 30 articles above.**
Per file 18 §9 (locked decision): two independent seeding rounds found zero "goodness of fit"
phrasing in either dataset — there is no bilateral "vs" search demand to justify a comparison
page. Instead, fold the following surfaced keywords into the existing planned `chi-square-test`
article's keyword set as supplementary terms (no new URL/slug):

- **Independence-specific phrasings** (~3,600/KD20–21 each): "chi square test of
  independence," "chi-square test of independence," "chi square independence test," "chi
  squared test of independence" + sibling phrasings.
- **Generic chi-square-test phrasings:** "chi square test" 27,100/KD27, "chi square tests"
  27,100/KD27, "table for chi square test" 18,100/KD36, "chi-square test equation"
  12,100/KD29, "chi square test equation" 12,100/KD29, "formula for chi square test"
  12,100/KD27, "chi-square test distribution" 8,100/KD22.
- **Degrees-of-freedom-for-chi-square phrasings** (~2,900/KD15–24 each): 6 phrasings of
  "degrees of freedom [in/for] chi square test" — these route here rather than a new page,
  consistent with file 15's decision to drop a standalone Degrees of Freedom article (already
  owned by the published `test-statistic` page).

If a goodness-of-fit-vs-independence distinction is still wanted for topical-authority
reasons, add it as a short internal section *within* the existing `chi-square-test` article
rather than a standalone page — there is no keyword case for a separate URL either way.

---

## Cross-references

- Source of truth for all keyword data, categories, statuses, and guards:
  `18-phase2-final-content-map.md`
- URL model, category definitions, dual-calculator rule: `08-site-architecture.md`
- Underlying keyword research: `16-phase2-batch1-keyword-research.md`,
  `17-phase2-reseed-keyword-research.md`
- Competitor/topical-authority benchmarking behind the 14 no-keyword-data articles:
  `14-topical-authority-benchmarking.md`
- Original two-batch drafts (superseded by this consolidated file, kept for audit trail):
  `19-phase2-content-briefs-batch1.md`, `20-phase2-content-briefs-batch2.md`
