# Session: AdSense remediation -- Phase 0 inventory -- 2026-09-20

**Objective:** Baseline for the AdSense "low value content" remediation. Measured
against `dist/` built 2026-09-19 (HEAD `1f1a9cc`). Nothing on the site changed in
this phase. Phase 5 compares against this file.

**Stale audit claims:** the external audit said About is ~50 words and guides have
no byline. Both were fixed on 2026-09-09 (`1aee7cc`): About is 1,108 words and every
guide carries the "Statohub Editorial Team" byline. Everything else in the audit holds.

**Data access:** Ahrefs MCP returns `Insufficient plan` on every endpoint (GSC,
top-pages, projects, subscription). No search-performance data exists in the repo.
Phase 2 survivors are chosen by term breadth.

**User decisions (2026-09-20):** Phase 1 deletes duplicates only (distinct questions
stay even if 6-8 remain); Phase 3 keeps the team byline (no named person, no Person
schema); Terms becomes a section of `/privacy-cookie-policy/` per ADR 0009, not a new URL.

## Findings

### Stack / routing / redirects
- Astro 4.16 SSG + MDX + Tailwind → Cloudflare Pages (`wrangler.toml`, `dist/`). `trailingSlash: 'always'`, `build.format: 'directory'`.
- Collections (`src/content/config.ts`): `articles` (110 live MDX, flat slug = URL), `categories` (10 YAML hubs, `section: learn|applied`), `calculators` (29 YAML; 25 `standalone`), `calculator-content` (25 MDX teaching blocks, one per standalone calc).
- Routes: `src/pages/[slug]/index.astro` (articles + category hubs), `src/pages/calculators/[slug]/index.astro`, static `about/`, `privacy-cookie-policy/`, `learn/`, `applied/`, `calculators/`, `dev/applied-preview/` (noindex, excluded from sitemap).
- Internal links only via `src/lib/links.ts` (`routes`, `url()`); ids generated into `src/lib/content-route-ids.ts` by `scripts/gen-route-ids.mjs` at build. `Link.astro` is the only `<a>`.
- **Redirects:** none exist today. The mechanism is a Cloudflare Pages `public/_redirects` file (copied to `dist/`). `scripts/check-links.mjs` already reads `dist/_redirects` and fails the build if any internal link targets a redirect source — so a 301 + stale link cannot ship. Sitemap (`@astrojs/sitemap`) is derived from built pages, so removed routes drop out automatically.
- Build gates (`npm run build`): gen-route-ids → astro build → gen/check llms.txt → check-links → check-meta-description → check-docs (NOW.md ≤ 60 lines) → `db_sync.py check`.
- FAQ rendering: Learn guides use plain markdown (`## Frequently Asked Questions` + `###`), **no FAQPage schema**. Applied guides use `<FAQ items=[...]>` (`src/components/applied/FAQ.astro`) which emits FAQPage JSON-LD via `faqPageSchema()` in `src/lib/schema.ts`. Calculator pages use markdown FAQ, no schema.
- Byline/date: `ArticleLayout.astro` / `AppliedArticleLayout.astro` render "By Statohub Editorial Team" and "Updated <Mon YYYY>" only when `pubDate`/`updatedDate` exist. **99 of 110 articles have no date in frontmatter → no visible date.** Calculator pages render neither byline nor date (all 25 `calculator-content` files do carry `updatedDate`).
- Schema: `articleSchema()` author = `editorialTeamRef()` (Organization, `#editorial-team`, → `/about/`); `organizationSchema()` has name/url/logo only; calculators emit `WebPage`.

### Page counts (152 built routes + 404; 151 indexable)
| Type | Count | Words (main) | Byline | Visible date |
|---|---|---|---|---|
| Learn guides | 74 | 2.5k–4.1k | 74/74 | 11/74 |
| Applied guides | 36 | 2.4k–5.1k | 36/36 | 0/36 |
| Calculator pages | 25 | 577–784 | 0/25 | 0/25 |
| Hubs (2 section, 10 category, 1 calculators) | 13 | 156–844 | — | — |
| Home / About / Privacy | 3 | 937 / 1108 / 1281 | — | — |
| `/dev/applied-preview/` | 1 | noindex | — | — |

Full per-URL table: Appendix A.

### FAQ audit (752 questions across 135 pages)
- 39% of FAQ answers (240/621 markdown FAQs) open with a sentence that restates the question.
- Root cause is in the rules, not the writers: `.claude/seo-playbook.md` §2 "use every keyword in the brief" + §4 "FAQ block … maps cleanly to those keywords" produced one FAQ per keyword variant.
- **Pages with semantic-duplicate FAQ sets (35):**

| Page | Duplicate sets (keep one per set) |
|---|---|
| /mean-vs-average/ | {Is the mean the same as the average? / Is average and mean the same number every time? / Is the mean the average? / Does "average" ever mean something other than the mean?} — 4 of 5 are one question |
| /median-vs-average/ | {Is median an average? / Is median the average? / Is the median the average?}; {What does median mean in math? / What is median in math precisely?} |
| /what-is-correlation/ | {What is the correlation definition? / What does correlation mean in statistics? / What is mean correlation? / What are the correlation basics every student should know?} |
| /fundamental-statistics/ | {What does statistics mean? / What do statistics mean in a report? / What does "statistics means" refer to in research? / What is statistics math at its most basic level?} |
| /test-statistic/ | {What is a degree of freedom…? / What is df…? / What is d.f.…?} (also off-topic); {test statistic vs p-value / what does the test statistic tell you about the p-value} |
| /null-hypothesis/ | {What is a null hypothesis? / What does null mean in statistics? / What does "null null" mean? / What is null hypothesis meaning in research?}; {example of a null hypothesis / examples of hypothesis pairs} |
| /percentiles/ | {percentile meaning / define percentile in simple terms / standard percentile definition}; {calculate percentile step by step / calculate percentiles for a larger dataset} |
| /how-to-find-the-mean/ | {How do I find an average? / …average in a list of numbers? / …the mean in math class?}; {formula for average / equation for average} |
| /how-to-find-the-range/ | {How do you find the range? / How do you calculate the range?}; {range in a data set with many values / with repeated values} |
| /how-to-find-frequency-statistics/ | {What is frequency in statistics? / What is frequency statistics? / How do you find frequency in statistics?} |
| /frequency-table/ | {What is the relative frequency…? / How do you find relative frequency? / What is a relative frequency table?} |
| /how-to-find-outliers/ | {How do you find outliers…? / How do I calculate an outlier step by step?}; {formula for an outlier / …using the Z-score method} |
| /mean-median-mode-range/ | {What is mode in math? / What does mode mean in math? / How to find mode…repeated values?}; {How to find mean, median, and mode? / How to calculate mean, median, and mode?} |
| /correlation-vs-causation/ | {Does correlation imply causation? / What does "correlation does not imply causation" mean? / True or false: correlation implies causation?}; "correlation vs identity example" is a keyword artifact |
| /standard-deviation/ | {How do you find standard deviation? / …of a sample?}; {What does SD mean? / …mean in a normal distribution?} |
| /standard-deviation-symbol/ | {What is the SD symbol? / sign for SD in a formula? / symbol … on a calculator or software? / which symbol identifies population SD?} |
| /statistics-symbols-cheatsheet/ | {What is the … cheat sheet? / What are statistics and or symbols?} (artifacts); {difference between σ and s / can σ and s give the same value} |
| /t-test/ | {What is the t-test equation? / What is the student t-test formula?}; {What is a paired t-test? / t-test vs paired t-test} |
| /type-i-and-type-ii-errors/ | {type I vs type II errors / type 1 and type 2 errors in simple terms} (+ overlap with the two "What is…" entries) |
| /skewed-distribution/ | {What is a left skewed distribution? / What does it mean when a distribution is skewed left?} |
| /probability-distribution/ | {marginal probability distribution / marginal distribution definition}; "What is the distribution mean?" artifact |
| /interquartile-range/ | {How to find IQR step by step? / What is the IQR formula? / …for an even number of values?} |
| /independent-dependent-mutually-exclusive-events/ (9) | {Can two events be both independent and mutually exclusive? / Are mutually exclusive events independent?} (+ overlap with Q1) |
| /pearson-correlation-coefficient/ | {What does Pearson's r measure? / What is the Pearson product-moment correlation? / What is Pearson's correlation used for?} |
| /linear-regression/ | {linear regression formula / regression equation}; "Which regression equation best fits the data?" artifact |
| /parameter-vs-statistic/ | {actual difference parameter vs statistic / what does "statistics versus parameters" mean inside inferential statistics} |
| /what-is-an-average/ | {What is the average, in simple terms? / What's the difference between "what is average" and "what is the average"?} (pure artifact) |
| /empirical-rule/ | {What does the empirical rule state? / What is the empirical rule in statistics?} |
| /bayes-theorem/ | {Bayes' theorem vs conditional probability / How does Bayes' rule relate to conditional probability?} |
| /mean-absolute-deviation/ | {What is MAD? / What does the deviation mean represent?} (artifact); "iReady" question is a keyword artifact |
| /variance/ | {What is the formula for variance? / How do you find variance step by step?} (mild) |
| /permutations-and-combinations/ | {difference permutation vs combination / when to use permutations instead of combinations} (mild) |
| /p-value/ | {How to calculate p-value? / How to find p-value from a z-score?} (mild) |
| /misleading-graphs/ (Applied) | {examples … in the news? / examples … in sports?} |
| /weighted-average/ | FAQ headings are not questions ("Definition and Meaning", "Applying the Formula", …); "Why It Differs from the Simple Mean" ≈ "Mean vs. Weighted Mean" — malformed block |

- Cross-page identical FAQ: "Can r be greater than n?" on /permutations/ and /combinations/.
- In-body keyword-variant headings to remove (examples, confirmed per page during Phase 1): /what-is-correlation/ ("Correlation Meaning: …", "Correlation Basics: …", "Correlation Def: …", "Mean Correlation"), /mean-vs-average/ ("Common Mix-Ups Between Mean and Average"), /median-vs-average/ ("Is the Median an Average?" H2 duplicating the FAQ), /fundamental-statistics/ ("Statistics Math: …"), /null-hypothesis/ ("What Does 'Null' Mean in Statistics?").
- Calculator FAQs (3–4 each) and the remaining Applied FAQs are clean.

### Same-concept page pairs
| Pair / cluster | Verdict |
|---|---|
| **/calculators/average/ ↔ /calculators/mean/** | Same engine (`engine: mean`), same skeleton, same NIST citation. Merge (brief mandates). |
| **/what-is-an-average/ ↔ /mean-vs-average/** (↔ /how-to-find-the-mean/) | Both define the arithmetic mean vs other averages; FAQs overlap. Merge candidate. how-to-find-the-mean is procedural — keep. |
| **/frequency-table/ ↔ /how-to-find-frequency-statistics/** | Same concept (frequency distribution); FAQs overlap (relative/cumulative frequency, class count). Merge candidate. |
| **/correlation-coefficient/ ↔ /pearson-correlation-coefficient/** (↔ /what-is-correlation/) | r formula, interpretation and Spearman appear on all three. Merge the first two; refocus the third. |
| **/variance/ ↔ /sample-variance-formula/** | Same formula, same n−1 explanation, same examples. Merge candidate. |
| /median-vs-average/ ↔ /how-to-find-the-median/ (↔ /mean-median-mode-range/) | median-vs-average contains two "how to find the median" sections. Differentiate (cut the how-to, link) rather than merge. |
| /probability-distribution/ (article) ↔ /probability-distributions/ (hub) | URL near-collision, not a content duplicate. Flag only; no action. |
| /t-test/ ↔ /paired-vs-independent-t-test/; /permutations-and-combinations/ ↔ /permutations/ + /combinations/; /effect-size/ ↔ /cohens-d/; /standard-deviation/ ↔ /-symbol/ ↔ /-excel/; /regression-assumptions/ ↔ /multiple-regression-diagnostics/ ↔ /heteroscedasticity-test/; /histogram-vs-boxplot/ ↔ /box-plot-interpretation/ | Overlapping but distinct intent. Keep; no action. |

### Thin / near-empty routes
- No pagination, tag archives or search pages exist.
- Hubs are link lists: `/time-series-forecasting/` 161 words / 3 articles, `/machine-learning-statistics/` 197 / 4, `/combinatorics/` 225 / 5, `/applied/` 156, `/learn/` 204, `/foundations/` 315. `CategoryLayout.astro` renders description + card grid only. Not fatal for AdSense, but a reviewer landing on `/time-series-forecasting/` sees three cards. (Optional Phase 4 item: 100–150-word editorial intro per hub from the category YAML — user's call.)
- `/dev/applied-preview/` is noindex and sitemap-excluded — fine.
- Smallest calculator pages: /calculators/factorial/ 577 words, /z-score/ 619, /proportion/ 627.

### Other E-E-A-T gaps confirmed
- No contact page (footer `mailto:admin@statohub.com`; privacy policy says `privacy@statohub.com` — inconsistent, neither confirmed to deliver per `docs/status/sessions/2026-09-06-adsense-audit.md`).
- No editorial/methodology page; About covers process in prose but nothing states how formulas are verified against references or how AI is used.
- No terms text anywhere. Organization schema has no `contactPoint`/`email`/`description`.
- (Out of scope but noted: Google Consent Mode v2 still missing — deferred item #1 in the 09-06 audit.)



---

## Appendix A — Per-URL inventory (built 2026-09-19)
Columns: path | type | main-content words | FAQ entries | byline | date in frontmatter

| Path | Type | Words | FAQ | Byline | Date |
|---|---|---|---|---|---|
| / | home | 937 | 0 | no | no |
| /about/ | utility | 1108 | 0 | yes | no |
| /applied/ | hub | 156 | 0 | no | no |
| /bayes-theorem/ | guide-learn | 3265 | 7 | yes | no |
| /bias-variance-tradeoff/ | guide-applied | 4367 | 6 | yes | no |
| /binomial-distribution/ | guide-learn | 3327 | 8 | yes | no |
| /binomial-theorem/ | guide-learn | 3473 | 8 | yes | no |
| /bonferroni-correction/ | guide-applied | 4520 | 6 | yes | no |
| /box-cox-transformation/ | guide-applied | 3505 | 5 | yes | no |
| /box-plot-interpretation/ | guide-applied | 2353 | 4 | yes | no |
| /calculators/ | hub | 810 | 0 | no | no |
| /calculators/average/ | calculator | 685 | 4 | no | yes |
| /calculators/binomial-distribution/ | calculator | 699 | 3 | no | yes |
| /calculators/chi-square/ | calculator | 692 | 4 | no | yes |
| /calculators/combination/ | calculator | 684 | 3 | no | yes |
| /calculators/confidence-interval/ | calculator | 682 | 3 | no | yes |
| /calculators/correlation-coefficient/ | calculator | 725 | 3 | no | yes |
| /calculators/factorial/ | calculator | 577 | 3 | no | yes |
| /calculators/frequency-table/ | calculator | 768 | 3 | no | yes |
| /calculators/linear-regression/ | calculator | 707 | 3 | no | yes |
| /calculators/mean-absolute-deviation/ | calculator | 671 | 3 | no | yes |
| /calculators/mean/ | calculator | 723 | 4 | no | yes |
| /calculators/normal-distribution/ | calculator | 784 | 4 | no | yes |
| /calculators/p-value/ | calculator | 733 | 4 | no | yes |
| /calculators/percentile/ | calculator | 773 | 4 | no | yes |
| /calculators/probability/ | calculator | 685 | 4 | no | yes |
| /calculators/proportion/ | calculator | 627 | 3 | no | yes |
| /calculators/range/ | calculator | 703 | 4 | no | yes |
| /calculators/sample-size/ | calculator | 704 | 3 | no | yes |
| /calculators/standard-deviation/ | calculator | 730 | 3 | no | yes |
| /calculators/t-table/ | calculator | 693 | 3 | no | yes |
| /calculators/t-test/ | calculator | 686 | 3 | no | yes |
| /calculators/variance/ | calculator | 747 | 4 | no | yes |
| /calculators/weighted-average/ | calculator | 766 | 4 | no | yes |
| /calculators/z-score/ | calculator | 619 | 3 | no | yes |
| /calculators/z-table/ | calculator | 697 | 3 | no | yes |
| /central-limit-theorem/ | guide-learn | 3192 | 6 | yes | no |
| /chi-square-distribution/ | guide-learn | 2792 | 8 | yes | no |
| /chi-square-test/ | guide-learn | 3113 | 8 | yes | no |
| /cohens-d/ | guide-applied | 4197 | 6 | yes | no |
| /combinations/ | guide-learn | 3466 | 8 | yes | no |
| /combinatorics/ | hub | 225 | 0 | no | no |
| /communicating-uncertainty/ | guide-applied | 3896 | 4 | yes | no |
| /conditional-probability-exercises/ | guide-applied | 4514 | 5 | yes | no |
| /confidence-interval-vs-prediction-interval/ | guide-applied | 3532 | 4 | yes | no |
| /confidence-interval/ | guide-learn | 3129 | 8 | yes | no |
| /confidence-level-vs-significance-level/ | guide-applied | 2824 | 5 | yes | no |
| /confusion-matrix-explained/ | guide-applied | 2942 | 3 | yes | no |
| /correlation-coefficient/ | guide-learn | 2983 | 6 | yes | yes |
| /correlation-vs-causation/ | guide-learn | 3644 | 7 | yes | no |
| /data-analysis/ | hub | 768 | 0 | no | no |
| /data-drift-detection/ | guide-applied | 3928 | 5 | yes | no |
| /data-visualization-best-practices/ | guide-applied | 3807 | 5 | yes | no |
| /descriptive-statistics/ | hub | 844 | 0 | no | no |
| /dev/applied-preview/ | utility (noindex) | 930 | 0 | no | no |
| /difference-in-differences/ | guide-applied | 4513 | 5 | yes | no |
| /dual-axis-charts/ | guide-applied | 2908 | 5 | yes | no |
| /effect-size/ | guide-learn | 3527 | 7 | yes | no |
| /empirical-rule/ | guide-learn | 3429 | 8 | yes | no |
| /experiments-causality/ | hub | 365 | 0 | no | no |
| /exploratory-data-analysis/ | guide-applied | 4738 | 5 | yes | no |
| /exponential-distribution/ | guide-learn | 3148 | 7 | yes | yes |
| /f-test-f-distribution/ | guide-learn | 2926 | 7 | yes | no |
| /f1-score-explained/ | guide-applied | 3024 | 3 | yes | no |
| /false-discovery-rate/ | guide-applied | 4260 | 5 | yes | no |
| /forecast-accuracy-metrics/ | guide-applied | 4827 | 4 | yes | no |
| /foundations/ | hub | 315 | 0 | no | no |
| /frequency-table/ | guide-learn | 3255 | 6 | yes | no |
| /fundamental-counting-principle/ | guide-learn | 3037 | 7 | yes | no |
| /fundamental-statistics/ | guide-learn | 2523 | 6 | yes | no |
| /granger-causality/ | guide-applied | 4647 | 6 | yes | no |
| /heteroscedasticity-test/ | guide-applied | 3119 | 5 | yes | no |
| /histogram-vs-boxplot/ | guide-applied | 2689 | 4 | yes | no |
| /how-to-design-an-ab-test/ | guide-applied | 4318 | 6 | yes | no |
| /how-to-find-frequency-statistics/ | guide-learn | 2751 | 8 | yes | no |
| /how-to-find-outliers/ | guide-learn | 2617 | 7 | yes | no |
| /how-to-find-the-mean/ | guide-learn | 3456 | 8 | yes | yes |
| /how-to-find-the-median/ | guide-learn | 2859 | 8 | yes | no |
| /how-to-find-the-range/ | guide-learn | 2693 | 8 | yes | yes |
| /hypergeometric-distribution/ | guide-learn | 2960 | 8 | yes | no |
| /independent-dependent-mutually-exclusive-events/ | guide-learn | 2994 | 9 | yes | no |
| /inferential-statistics/ | hub | 754 | 0 | no | no |
| /interquartile-range/ | guide-learn | 2731 | 7 | yes | no |
| /interrupted-time-series/ | guide-applied | 4813 | 5 | yes | no |
| /kruskal-wallis-test/ | guide-learn | 3522 | 7 | yes | no |
| /learn/ | hub | 204 | 0 | no | no |
| /levels-of-measurement/ | guide-learn | 2960 | 7 | yes | no |
| /linear-regression/ | guide-learn | 3851 | 8 | yes | no |
| /log-transform-data/ | guide-applied | 2661 | 5 | yes | no |
| /machine-learning-statistics/ | hub | 197 | 0 | no | no |
| /mann-whitney-u-test/ | guide-learn | 3253 | 7 | yes | no |
| /mean-absolute-deviation/ | guide-learn | 3601 | 6 | yes | yes |
| /mean-median-mode-range/ | guide-learn | 2808 | 7 | yes | no |
| /mean-vs-average/ | guide-learn | 2778 | 5 | yes | yes |
| /median-vs-average/ | guide-learn | 3145 | 8 | yes | no |
| /mediation-analysis/ | guide-applied | 5076 | 5 | yes | no |
| /misleading-graphs/ | guide-applied | 2860 | 4 | yes | no |
| /missing-data-imputation/ | guide-applied | 4015 | 3 | yes | no |
| /multicollinearity-vif/ | guide-learn | 3119 | 8 | yes | no |
| /multiple-regression-diagnostics/ | guide-applied | 2845 | 5 | yes | no |
| /nonparametric-tests/ | guide-applied | 4035 | 5 | yes | no |
| /normal-distribution/ | guide-learn | 3420 | 7 | yes | no |
| /null-hypothesis/ | guide-learn | 2904 | 8 | yes | no |
| /odds-ratio-interpretation/ | guide-applied | 3447 | 4 | yes | no |
| /one-tailed-vs-two-tailed/ | guide-applied | 2848 | 4 | yes | no |
| /one-way-anova/ | guide-learn | 3288 | 8 | yes | no |
| /p-value/ | guide-learn | 2745 | 7 | yes | no |
| /paired-vs-independent-t-test/ | guide-learn | 3558 | 8 | yes | no |
| /parameter-vs-statistic/ | guide-learn | 3657 | 7 | yes | yes |
| /pearson-correlation-coefficient/ | guide-learn | 2999 | 8 | yes | no |
| /pearson-vs-spearman/ | guide-applied | 2689 | 6 | yes | no |
| /percentiles/ | guide-learn | 3003 | 8 | yes | no |
| /permutations-and-combinations/ | guide-learn | 3318 | 8 | yes | no |
| /permutations/ | guide-learn | 3484 | 8 | yes | yes |
| /poisson-distribution/ | guide-learn | 3083 | 7 | yes | no |
| /post-hoc-tests/ | guide-learn | 2713 | 5 | yes | no |
| /privacy-cookie-policy/ | utility | 1281 | 0 | no | no |
| /probability-distribution/ | guide-learn | 3593 | 8 | yes | no |
| /probability-distributions/ | hub | 550 | 0 | no | no |
| /probability-formula/ | guide-learn | 3137 | 7 | yes | no |
| /propensity-score-matching/ | guide-applied | 4593 | 5 | yes | no |
| /proportions-in-statistics/ | guide-learn | 3017 | 8 | yes | no |
| /r-squared-adjusted-r-squared/ | guide-learn | 3301 | 8 | yes | no |
| /randomized-controlled-trial/ | guide-applied | 4579 | 6 | yes | no |
| /regression-assumptions/ | guide-learn | 3540 | 7 | yes | no |
| /regression-correlation/ | hub | 426 | 0 | no | no |
| /regression-to-the-mean/ | guide-learn | 3234 | 5 | yes | no |
| /reliability-cronbachs-alpha-cohens-kappa/ | guide-learn | 3204 | 7 | yes | no |
| /sample-variance-formula/ | guide-learn | 3683 | 8 | yes | no |
| /sampling-distributions/ | guide-learn | 2881 | 7 | yes | no |
| /sarima-model/ | guide-applied | 4832 | 4 | yes | no |
| /sequential-testing/ | guide-applied | 3262 | 5 | yes | no |
| /simpsons-paradox/ | guide-learn | 2877 | 7 | yes | no |
| /skewed-distribution/ | guide-learn | 3332 | 7 | yes | no |
| /standard-deviation-excel/ | guide-learn | 3651 | 7 | yes | yes |
| /standard-deviation-symbol/ | guide-learn | 3033 | 7 | yes | no |
| /standard-deviation/ | guide-learn | 2911 | 7 | yes | no |
| /statistical-power/ | guide-learn | 3426 | 7 | yes | no |
| /statistics-symbols-cheatsheet/ | guide-learn | 4128 | 8 | yes | no |
| /t-test/ | guide-learn | 3188 | 7 | yes | no |
| /test-statistic/ | guide-learn | 3017 | 7 | yes | no |
| /time-series-forecasting/ | hub | 161 | 0 | no | no |
| /two-way-anova/ | guide-learn | 3620 | 8 | yes | no |
| /type-i-and-type-ii-errors/ | guide-learn | 3363 | 7 | yes | no |
| /types-of-variables/ | guide-learn | 3729 | 8 | yes | no |
| /variance/ | guide-learn | 3216 | 8 | yes | no |
| /weighted-average/ | guide-learn | 2761 | 7 | yes | no |
| /what-is-an-average/ | guide-learn | 3292 | 7 | yes | yes |
| /what-is-correlation/ | guide-learn | 3036 | 6 | yes | no |
| /which-statistical-test-should-i-use/ | guide-learn | 3985 | 7 | yes | no |
| /z-score/ | guide-learn | 3618 | 7 | yes | no |
| /z-table/ | guide-learn | 3463 | 5 | yes | yes |
