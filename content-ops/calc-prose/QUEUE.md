# Calculator teaching-block queue

Each standalone `/calculators/{slug}/` page gets a short teaching block (intro +
how-to + worked example + small FAQ) rendered below the tool, authored as an MDX
file at `src/content/calculator-content/{slug}.mdx`.

**The cloud routine** [`../cloud-routine/publish-next-calc-prose.md`](../cloud-routine/publish-next-calc-prose.md)
processes ONE calculator per run, in the order below. "Next" = the first row whose
teaching file does not yet exist as published (`draft: false`). The routine flips
the `status` here to `done` after a green build + push.

**Source of truth for `done`** = the MDX file exists with `draft: false`. The table
status is for human visibility and ordering; the keyword columns tell the writer
which terms to weave in naturally.

| #  | slug                    | primary keyword                  | supporting keywords | status  |
|----|-------------------------|----------------------------------|---------------------|---------|
| 1  | standard-deviation      | standard deviation calculator    | sample standard deviation; population standard deviation; how to calculate standard deviation | done (pilot, human-authored) |
| 2  | mean                    | mean calculator                  | average calculator; how to find the mean; arithmetic mean | done |
| 3  | average                 | average calculator               | how to find the average; calculate average; mean of numbers | done |
| 4  | variance                | variance calculator              | sample variance; population variance; how to calculate variance | done |
| 5  | range                   | range calculator                 | how to find the range; minimum and maximum; range in statistics | done |
| 6  | percentile              | percentile calculator            | how to calculate percentile; percentile rank; nth percentile | done |
| 7  | weighted-average        | weighted average calculator      | weighted mean; how to calculate weighted average; weighted grade | done |
| 8  | mean-absolute-deviation | mean absolute deviation calculator | how to find mean absolute deviation; MAD statistics; average absolute deviation | done |
| 9  | frequency-table         | frequency table calculator       | frequency distribution table; relative frequency table; cumulative frequency | done |
| 10 | z-score                 | z score calculator               | how to calculate z score; standard score; z score formula | done |
| 11 | z-table                 | z table                          | z score table; standard normal table; how to read a z table | done |
| 12 | normal-distribution     | normal distribution calculator   | bell curve; gaussian distribution; probability under the curve | done |
| 13 | probability             | probability calculator           | how to calculate probability; probability of an event; single event probability | done |
| 14 | binomial-distribution   | binomial distribution calculator | binomial probability; n choose k; binomial formula | done |
| 15 | combination             | combination calculator           | n choose r; how to calculate combinations; nCr | done |
| 16 | factorial               | factorial calculator             | how to calculate factorial; n factorial; factorial formula | done |
| 17 | correlation-coefficient | correlation coefficient calculator | pearson correlation; r value; how to calculate correlation | pending |
| 18 | linear-regression       | linear regression calculator     | line of best fit; least squares; slope and intercept | pending |
| 19 | confidence-interval     | confidence interval calculator   | margin of error; 95 percent confidence interval; how to calculate confidence interval | pending |
| 20 | sample-size             | sample size calculator           | how to calculate sample size; margin of error; survey sample size | pending |
| 21 | t-test                  | t-test calculator                | one sample t test; t statistic; how to calculate t test | pending |
| 22 | t-table                 | t table                          | t distribution table; critical t value; degrees of freedom | pending |
| 23 | p-value                 | p value calculator               | how to find p value; p value from test statistic; significance level | pending |
| 24 | chi-square              | chi square calculator            | chi square test; chi square statistic; goodness of fit | pending |
| 25 | proportion              | proportion calculator            | how to calculate proportion; sample proportion; ratio and proportion | pending |
