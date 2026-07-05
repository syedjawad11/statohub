# Statohub -- Project

## What this is

Statohub (statohub.com) is a statistics-education-and-calculators website. It
is a static site: Astro (SSG) + Tailwind CSS + MDX, deployed to Cloudflare
Pages, with push-to-deploy CI/CD (GitHub Actions) on every push to `main`.

Full build spec: `docs/legacy/BUILD-PLAN.md`. Repo map: `docs/REPO-MAP.md`.

## The wedge thesis

The site exists to fill one specific gap, identified in the original SEO
study: **calculator sites have tools with no teaching; educator sites teach
with no tools.** Statohub's wedge is that **every page offers a deep
calculator AND plain-English teaching on the same page.** No incumbent
competitor does both. Concretely:

- Every standalone `/calculators/{slug}/` page carries a real, working
  calculator (`<StatCalc variant="page">`) plus a short teaching block below
  it (definition, how-to, worked example, FAQ).
- Every teaching article (`/{slug}/`) that has an associated calculator embeds
  the SAME calculator inline (`<StatCalc variant="embed">`) right after the
  worked example -- "learn how it works" and "try the calculator" are never
  two different sites, or even two different pages.
- One config drives both deployments of a calculator: the math lives once in
  `src/calc/`, the config lives once per calculator, the UI lives once in
  `StatCalc.astro`. No duplicated logic between the standalone page and the
  embed.

This is a defensible wedge, not just a design choice: a competitor
(statstudyhub.com, launched/indexed Feb 2026) has already copied the
"tutorials + calculators" pattern, which validates the thesis but also means
the topical-authority land-grab window is open now, not indefinitely.

## Audience

Students (school/college statistics courses), self-learners, and anyone who
needs to both understand a stat concept AND compute a real answer from their
own numbers in one visit -- the person who searches "standard deviation
calculator" or "how to find the mean" and wants both the number and the
explanation of how it was produced, without leaving the page.

## Scale and scope

- **~50 teaching articles** (MDX, `src/content/articles/`), each pairing an
  embedded calculator where one applies. Flat, primary-keyword slugs, no
  category in the URL path.
- **~23-29 standalone calculator pages** (`src/content/calculators/`, each a
  YAML config against a pure `src/calc/*.ts` engine), reachable at
  `/calculators/{slug}/`, plus a `/calculators/` hub.
- **6-7 categories**: foundations, descriptive-statistics,
  probability-distributions, combinatorics, regression-correlation,
  inferential-statistics -- each with its own hub page at `/{category}/`.
- **Short calculator teaching blocks** (`src/content/calculator-content/`) --
  a separate, lighter content type: a ~300-700-word definition/how-to/worked-
  example/FAQ block rendered under each standalone calculator, distinct from
  the full-length articles.

## Build order

Bottom-up, by keyword difficulty (KD), not by pedagogical sequence: low-KD
content ships first so authority compounds toward the harder pillar pages
later (KD 22-56 pillars such as standard-deviation, normal-distribution,
correlation-coefficient). The calculator engines were deliberately built out
completely (all standalone calculators live) BEFORE the bulk of article
writing resumed, since articles are meant to consume real `<StatCalc>`
embeds -- the tools have to exist before the teaching that depends on them.

## Business model

**Currently: none.** The site is pre-traffic (not yet reliably indexed for
brand queries at time of writing), so distribution -- not features or
monetization -- is the binding constraint. Per the strategy review
(`docs/ideas/statohub-strategy-review.md`), the staged model, only entered as
each trigger is hit, is:

| Stage | Trigger | Model |
|---|---|---|
| 0 (now) | -- | None. Content + calculators only; no ads. |
| 1 | ~50k sessions/mo | Display ads via a premium network (Raptive/Mediavine-tier) |
| 2 | alongside 1 | Relevant affiliate links (stats software, textbooks, course platforms) |
| 3 | course layer + accounts | Premium: course, certificates, ad-free tier -- the real ceiling |

The first planned PRODUCT expansion beyond content+calculators is **guided,
no-code statistics projects** (`/projects/{slug}`, 12-part structure: problem
-> dataset -> objectives -> steps -> hints -> solution -> interpretation ->
mistakes -> extensions -> assessment), each wedging a real calculator, per
`docs/ideas/statohub-action-plan.md` Phase D. This is planned, not yet built.

## What we are explicitly NOT doing right now

These are parked decisions, not open questions -- do not relitigate them
without a new decision record superseding the parked one:

- **No odds/betting calculators.** `/calculators/betting-odds/` and
  `/calculators/odds/` are removed entirely, by design (no gambling
  association). The educational `/calculators/probability/` stays.
- **No quizzes.** Explicitly dropped by the user's decision (the earlier
  strategy review recommended a static quiz system as the first expansion;
  that plan was superseded -- guided no-code projects are the first
  expansion instead).
- **No games.** At most one, later, only if project/content metrics justify
  further interactive investment -- not scheduled.
- **No accounts, no backend, no database.** The site stays 100% static +
  client-side. Revisit only at ~10-20k organic sessions/month or when the
  course layer launches (progress/certificates genuinely need identity).
- **No community/discussion/UGC features** (comments, forums, leaderboards).
  Cold-start and moderation cost with no offsetting benefit at this traffic
  stage.
- **No course/lesson scaffolding yet** (module numbering, progress bars,
  "Lesson 3 of 12" framing). Articles stay articles; a course layer is a
  future horizon, not a current build target.

## Non-negotiable technical rules (see CLAUDE.md for the authoritative list)

- Flat trailing-slash URLs (`/{slug}/`, `/{category}/`, `/calculators/{tool}/`)
  -- every URL ends in `/`.
- Zero internal redirects/404s, enforced at build time
  (`src/lib/links.ts` + `scripts/check-links.mjs`).
- Wrangler v3 pinned (Node 20.8.0 breaks Wrangler v4); uPlot lazy-loaded; MDX.
- Calculator engines in `src/calc/**` stay pure (no DOM/network) so one
  config dual-deploys as both a standalone page and an in-article embed.
