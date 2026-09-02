---
number: 0019
title: The outsource pillar gets its own word floor, well below the Applied 3,000
type: content
status: accepted
date: 2026-09-02
---

**Context:** `.claude/applied-playbook.md` §2 sets a HARD floor of 3,000 words
of body prose for every Applied Statistics article, and
`outsource-content/check_sanitized.py` check 11 enforces it. The four
outsourced articles published before this date clear it, but only just --
measured by the gate's own prose count (paired capitalized components and
their props excluded): `nonparametric-tests` 3,066, `bonferroni-correction`
3,183, `randomized-controlled-trial` 3,289, `mediation-analysis` 3,707.

The vendor's newer drafts are materially shorter. Every one of the 16 articles
still queued on the outsource board measures 1,992-2,925 **raw** words, and
raw word count overstates what the gate counts: `pearson-vs-spearman` is 2,022
raw but 1,646 by the gate, `log-transform-data` 1,992 raw but 1,515. Only
`propensity-score-matching` (3,743 raw / 3,339 gate) still clears the floor
unaided, and it was fetched from an older batch.

This is not a one-article problem. Reordering the queue does not avoid it,
because no remaining vendor article is long enough.

**Options considered:**
(1) Expand each short draft with sourced practitioner prose until it clears
3,000, as was done for `bonferroni-correction` (2,659 raw -> 3,183 gate).
(2) Give the outsource pillar its own, much lower floor and publish vendor
drafts at their natural length.
(3) Park every short article as `blocked` and stop the outsource pipeline.

**Decision:** Option 2. `check_sanitized.py` gets an `OUTSOURCE_WORD_FLOOR`
constant set to **1,500**, replacing the literal `3000` in check 11. The
Applied playbook's 3,000-word floor is unchanged for internally written
articles; only the outsource pillar is exempted.

**Reasoning:** Option 1 preserves the standard but requires ~1,400 words of
new sourced prose per article, on every one of the 15 remaining queue items --
which is writing the article, not outsourcing it, and puts a drafting agent
under pressure to pad, against a HARD no-fabrication rule. Option 3 stops the
pipeline outright. The user's call was to take the length hit and keep
throughput.

**Consequences -- this one is a real quality concession, recorded plainly:**
new outsourced pages may run roughly half the length of every Applied page now
live (1,500 vs. a 3,066 thinnest-live floor). Expect them to read as visibly
thinner, and expect a length gap between outsourced and internally written
articles in the same hubs. The floor no longer meaningfully gates depth for
this pillar; the remaining HARD checks (>= 6 resolving sources, required
components, no fabrication) are what stand between a vendor draft and publish.
If organic performance on the short pages lags the four long ones, this is the
first thing to look at.

**Revisit when:** the vendor's drafts get longer again, the short pages
underperform the long ones in Search Console, or the outsource pillar grows
large enough that its thinness affects sitewide quality signals.

**Related:** [[0014-applied-section-url-family]], [[0008-tiered-seo-validation]]
