# Content Standards

> This file owns exactly one thing: the **two content types** and what
> distinguishes them. Every mechanical rule — voice, YMYL accuracy, structure,
> keywords, formulas, internal linking, the HARD/WARN/ADVISORY tiers — lives in
> `.claude/seo-playbook.md` (Learn) and `.claude/applied-playbook.md` (Applied),
> which the content agents load automatically. Where this file and a playbook
> disagree, the playbook wins.

## Two distinct content types -- do not conflate them

1. **Articles** (`src/content/articles/*.mdx`, route `/{slug}/`) -- full
   teaching pieces, >=2000 words (Learn) / >=3000 (Applied), one per unique
   keyword, cannibalization prevented by a DB uniqueness constraint. Written via
   the `/write-article` skill (internal) or `/publish-outsource-article`
   (vendor).
2. **Calculator teaching blocks** (`src/content/calculator-content/*.mdx`,
   rendered under `/calculators/{slug}/`) -- short (~300-700 words): lead +
   how-to + worked example + FAQ. A **lighter, separate validation tier** with
   no 2000-word floor; procedure in `content-ops/calc-prose/SESSION-PLAN.md`.
   They complement the full article on the same topic, never duplicate it.

Both share the same voice, accuracy and build contracts. Only **length and
QA-gate strictness** differ — that difference is the reason this file exists.

## Where the rules actually live

| Rule set | Home |
|---|---|
| Voice, YMYL verification, external-link quality | `.claude/seo-playbook.md` §3, §5 |
| Formulas as Unicode blocks, no raw LaTeX | `.claude/seo-playbook.md` §7 |
| One H1, heading levels, `draft: true` gate | `.claude/seo-playbook.md` §4, §7 |
| Keyword placement + the HARD/WARN/ADVISORY tiers | `.claude/seo-playbook.md` §2, §8 ([[0008-tiered-seo-validation]]) |
| Woven `<RelatedLink>` callouts + the approved intro-phrase pool | `.claude/seo-playbook.md` §6 |
| Applied deltas (calculator exemption, components, sources floor) | `.claude/applied-playbook.md` |

## Internal linking model

The one standard that is neither playbook's: established by
[[0009-combined-legal-page]] / [[0010-woven-related-link-callouts]].

- **Related-calculators sidebar** — every standalone `/calculators/{slug}/` page
  carries an auto-derived sidebar from `src/lib/related-calculators.ts`
  (same-category first, then filled to N). Data-driven; never hand-maintained,
  and new calculators inherit it automatically.
- **Contextual prose links** go through the typed `routes` / `url()` /
  `<Link>` registry only — a raw internal `<a>` fails the `check-links` gate.
- **Callout density:** 3-4 woven `<RelatedLink>` per article (roughly one per
  2-3 H2 sections), 1-2 per calculator teaching block. Targets must be routes
  that exist **now** — never a draft. Phrasing rules: `seo-playbook.md` §6.
- **Ownership:** Codex builds the components and sidebar; Claude retrofits
  contextual links and callouts during writing sessions. This is editorial
  judgment (right target, natural phrasing), not mechanical insertion.
