# 2026-10-04 — Owed: one session to enrich 3 live articles (keyword overlaps)

**Decision (owner, 2026-10-04):** three content-plan rows were removed instead of
being written as new pages, because their primary keyword already belongs to a
live article. Each live article targets that keyword in its headings (and, for
binomial-theorem, its title, H1 and meta description), so a second page would
compete with it. Instead, one dedicated session rewrites the three live
articles to cover these topics in more depth. Record:
[[0028-content-plan-daily-routine]] (amended consequence line).

| Removed row | Keyword | Live owner to enrich | What the plan row wanted covered |
|---|---|---|---|
| S077 | geometric distribution | `/binomial-distribution/` | Two definitions (trials vs failures); PMF and CDF; mean and variance; memoryless property; worked examples; Excel and TI-84 |
| S105 | pascal's triangle | `/binomial-theorem/` | Building it; link to C(n,k); row sums; Fibonacci, hockey stick and Sierpinski patterns; binomial expansions; probability uses |
| S135 | logistic regression | `/linear-regression/` | Why linear regression fails for yes/no; the logit; odds ratios from coefficients; predicted probabilities; model fit; worked example |

## Rules for that session
- Learn articles: `docs/standards/content.md` + `.claude/seo-playbook.md`
  (not the plan template). Keep each page's primary keyword and URL; the added
  topic is a deeper section, not a second H1 topic.
- Keep title, description and schema consistent; `updatedDate` bumps.
- Check Search Console (Ahrefs `gsc-*`) for each page's impressions on the
  added keyword before and ~4 weeks after.
- Then decide the **four parked logistic rows** (flagged on content.db):
  S136 logistic-regression-python-r, S137 logistic-regression-spss,
  S156 linear-vs-logistic-regression (overlaps linear-regression's
  "Linear vs Logistic" section directly), S157 multinomial-logistic-regression.
  Options: drop, or unflag and point `links_up_to` at linear-regression.
- S123 binomial-coefficient-identities was repointed to binomial-theorem and
  stays in the routine.
