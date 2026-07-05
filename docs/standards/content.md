# Content Standards

> Article + calculator-embedding standards. The **mechanical, enforced** rule
> set lives in `.claude/seo-playbook.md` (loaded automatically by the
> `stats-article-writer` and `stats-article-reviewer` agents) -- this file is
> the human-readable summary plus the standards that playbook doesn't own
> (the internal-linking model). If the two disagree, `seo-playbook.md` wins
> for anything the build/QA gate actually checks.

## Two distinct content types -- do not conflate them

1. **Articles** (`src/content/articles/*.mdx`, route `/{slug}/`) -- full
   teaching pieces, >=2000 words, one per unique keyword (DB-enforced, no
   cannibalization). Written via `content-ops/cloud-routine/publish-next-article.md`
   or the `/write-article` skill.
2. **Calculator teaching blocks** (`src/content/calculator-content/*.mdx`,
   rendered under `/calculators/{slug}/`) -- short (~300-700 words): lead +
   how-to + worked example + FAQ. A **lighter, separate validation tier** (no
   2000-word floor) via `content-ops/cloud-routine/publish-next-calc-prose.md`
   / `content-ops/calc-prose/SESSION-PLAN.md`. These complement the full
   article on the same topic, they never duplicate it.

Both types share the underlying voice/accuracy/build-contract rules below;
only length and QA-gate strictness differ.

## Voice and accuracy (both content types)

- Active voice, educational tone, plain language first then the technical
  term. Short paragraphs.
- **Verify before writing (YMYL).** Every formula, distribution, test, or
  probability claim must be checked against an authoritative source (NIST
  e-Handbook, a university stats department, a peer-reviewed text) before it's
  written. Never fabricate a statistic, citation, or study result -- that is a
  hard fail, not a style note.
- At least one authoritative external link (`.gov`/`.edu`/NIST/OpenStax-tier),
  descriptive anchor text, no bare URLs, no "click here". Every outbound link
  must resolve (curl-checked in the gate; a 4xx/5xx blocks publish).
- Formulas as fenced Unicode blocks (σ, μ, x̄, Σ, √, ²) -- **never raw LaTeX**.
  MDX parses `{` as JavaScript, so `$$\dfrac{}$$` breaks the build.

## Structure (both content types)

- **Exactly one H1** -- the frontmatter `title`, rendered by the layout. The
  MDX body starts at H2. A body H1 duplicates the title and trips duplicate-H1
  SEO audits.
- No skipped heading levels (H2 -> H3, never H2 -> H4).
- An optional `h1` frontmatter field may hold a shorter/cleaner visible
  headline when `title` is long or keyword-front-loaded for the SERP.
- `draft: true` until reviewed and a human (or the routine's own gate)
  flips it -- unfinished content never ships.

## Internal linking & related-link standard (every page, current + future)

Established via [[0009-combined-legal-page]] / [[0010-woven-related-link-callouts]]
(TASK-017/018). Applies to every calculator page and article, now and in any
future content:

- **Related-calculators sidebar.** Every standalone `/calculators/{slug}/`
  page carries an auto-derived sidebar (same-category calculators first, then
  filled to N) built from `src/lib/related-calculators.ts`. Data-driven --
  never hand-maintain this list; new calculators inherit it automatically.
- **Contextual internal links in prose.** Weave links where naturally
  relevant, always through the typed `routes` / `url()` / `<Link>` registry
  (`src/lib/links.ts`) -- never a raw `<a>` to an internal page (the
  `check-links` build gate fails those).
- **Woven `<RelatedLink>` callouts, not end-dumped.** Every article carries
  3-4 callouts distributed roughly one per 2-3 H2 sections; every calculator
  teaching block carries 1-2. Use `src/components/RelatedLink.astro`. The
  intro phrase must vary -- pull from the approved pool: "Worth reading
  next", "On a related note", "You may also find this useful", "For a
  related calculation", "Another helpful calculator is", "See also" -- never
  repeat the same phrase twice on one page (the component auto-rotates one if
  `intro` is omitted). The target must be a route that exists **now**
  (published sibling, standalone calculator, or the calculators hub) --
  never a draft.
- **Ownership:** Codex builds the components/sidebar/one demo usage; Claude
  retrofits contextual links and callouts into content during writing
  sessions -- this is an editorial judgment call (right target, natural
  phrasing), not a mechanical insertion.
- **Status note (2026-07-05):** the article-publishing cloud routines are
  currently paused pending a planned automation that generates callouts from
  `related:`/`category` frontmatter instead of requiring hand-authoring per
  page (see `docs/status/NOW.md` for the live status). Until that ships, any
  manually-written article must still carry the woven callouts by hand.

## Full mechanical rule set

See `.claude/seo-playbook.md` for: keyword placement rules, the three-tier
HARD/WARN/ADVISORY validation model ([[0008-tiered-seo-validation]]), the
reviewer's pass/fail checklist, and the exact frontmatter contract from
`src/content/config.ts`. That file is loaded automatically by both content
agents and by the cloud-routine publishing scripts -- it is the operative
source of truth for anything the build or QA gate checks mechanically.
