---
number: 0023
title: Outsourced articles keep every non-vendor external link; only babylovegrowth's own links are stripped
type: content
status: accepted
date: 2026-09-13
---

**Context:** the outsource pipeline strips babylovegrowth's own citations,
bylines and backlinks before an article is published
(`outsource-content-processor` Step 2, backstopped by
`check_sanitized.py`). On 2026-09-13 a processor extended that pass on its own
judgement: it found a donation-page link hyperlinked on the anchor text "95%"
in a vendor draft, judged it spam, and removed it. The owner stopped the run
and stated the actual arrangement: **the vendor places outbound links in the
articles deliberately as backlinks for partner websites.** Those links are part
of what we are paid for hosting; removing one is a contract breach, not
sanitisation.

**Options considered:**
(1) Let the processor keep judging link quality and strip anything that
looks commercial, off-topic or oddly anchored.
(2) Keep every external link verbatim except babylovegrowth's own, and treat
raw-vs-MDX href parity as a review gate.
(3) Add `rel="nofollow"` / `rel="sponsored"` to partner links instead of
removing them.

**Decision:** Option 2. **A non-babylovegrowth external link in a vendor
article is never removed, rewritten, re-anchored, or nofollowed.** The only
hrefs the pipeline may strip are `babylovegrowth.ai` / `babylovegrowth.com`;
the only hrefs it may *rewrite* are internal `statohub.com/...` links, which
become `<Link to={routes.*}>` components. Vendor prose (including
"Statohub's Take" and the closing CTA) stays; the `> *— Statohub*` sign-off
line is the one prose element that is stripped. Reviewers verify parity: every
non-vendor href in the raw JSON must appear in the MDX with its anchor text.

**Reasoning:** Option 1 puts an editorial judgement on top of a commercial
agreement the agent cannot see, and a "spam" call that is wrong once costs a
partner relationship. Option 3 was not asked for and changes the value of the
backlink unilaterally — if the owner ever wants `sponsored` attributes, that is
a separate decision. Option 2 is mechanical, checkable by diffing hrefs, and
keeps the pipeline honest: sanitisation means "remove the vendor's fingerprints",
nothing more.

**Consequences:** some published articles carry links whose relevance looks
thin (a donation page, a niche commercial site). Accept it. The reviewer's
link-rot pass still runs against the `## Sources` list only; partner links in
body prose are not curl-checked and not judged.

**Revisit when:** the vendor contract changes, the owner asks for
`rel="sponsored"`, or a partner link is found to point at something actively
harmful (malware, phishing) — that is a report-to-owner case, still not a
silent removal.

**Related:** [[0019-outsource-word-floor]], [[0020-outsource-is-applied-only]],
[[0021-boards-split-by-source]]
