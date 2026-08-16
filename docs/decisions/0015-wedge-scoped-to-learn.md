---
number: 0015
title: The wedge is scoped to the Learn vertical; Applied articles need no calculator
type: product
status: accepted
date: 2026-08-16
---

**Context:** [[0001-wedge-model]] states that "every teaching article that has a
matching calculator embeds the real, live `<StatCalc>` inline (not a link out to
it)." The new Applied Statistics section ([[0014-applied-section-url-family]])
introduces articles that are not teaching articles: practitioner playbooks of
~3,000-4,500 words about applying a method in context (experiment design, model
diagnostics, forecasting workflows). Many have no single calculator that
corresponds to them, and forcing one would be a worse page.

ADR-0001 is marked "revisit: never, absent a full repositioning." This is not a
repositioning, so the conflict needs to be recorded rather than resolved
silently in either direction.

**Options considered:**
(1) Apply the wedge unchanged -- every applied article must embed a calculator.
Would force contrived embeds ("here's a mean calculator" on an article about
A/B-test design) purely to satisfy a rule.
(2) Silently exempt applied articles and say nothing. Leaves a documented hard
rule contradicted by shipped content, which is how build agents end up
"correcting" the content back.
(3) Scope the wedge explicitly: it governs the Learn vertical and the
calculator pages. Applied articles may embed a `<StatCalc>` where one genuinely
fits, but are not required to.

**Decision:** Option 3. The wedge remains the site's founding thesis and is
unchanged for Learn articles and calculator pages: every standalone calculator
page still carries a teaching block, and every *teaching* article with a
matching calculator still embeds the live component. Applied articles are
**exempt from the required embed**. `calculator` stays optional in the
`articles` schema, which already permits this -- no schema change is needed to
allow it, only this record to make it legitimate.

**Reasoning:** The wedge's actual mechanism is fusing two *search intents* that
normally live on separate sites -- "compute this" and "explain this." Applied
articles serve a third intent: "how do I do this in my situation." That intent
does not have a calculator counterpart to fuse with, so mandating one adds
friction without adding the compounding effect the wedge was built for. The
narrowing is the same shape as [[0011-no-homepage-live-calculator]], which
constrained *where* the fused card appears without reversing the thesis.

Applied articles still reinforce the wedge indirectly, and this is the point of
the restructure: they link **into** Learn articles and calculator pages for the
underlying method. The internal-link equity flows toward the wedge pages rather
than being duplicated across them -- which is why
[[0014-applied-section-url-family]] kept both sections in one `articles`
collection so `related` can reference across the boundary.

**Consequences:** "Does this topic have a calculator?" remains a first-class
authoring question for Learn articles and stops being one for Applied. Any SEO
or content check that treats a missing `<StatCalc>` as a defect must read the
article's category `section` before firing -- this applies to
`.claude/seo-playbook.md` and any reviewer agent, and the forthcoming
`.claude/applied-playbook.md` must state the exemption explicitly rather than
inheriting the rule. A reviewer that flags an applied article for a missing
calculator is wrong and should be pointed here.

The site's public self-description ("~50 teaching articles + ~29 calculators,
wedge = both on one page") now describes the Learn vertical specifically, not
the whole site.

**Revisit when:** applied articles start routinely wanting embedded
calculators, which would suggest the format has drifted back toward teaching
and the two article types should re-merge.

**Related:** [[0001-wedge-model]], [[0011-no-homepage-live-calculator]],
[[0014-applied-section-url-family]]
