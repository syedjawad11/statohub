# Phase A — Long-form blog content style system

> Planning document. Written 2026-08-09 in plan mode; nothing in this document has
> been implemented. Mirror of `~/.claude/plans/hi-so-we-have-abundant-eich.md`.

## Context

statohub publishes 39 statistics **teaching articles** (2,000-word floor, 3 MDX
components, one calculator per page). The user is restructuring the site to add a
**blog section with 4-5 categories** covering applied statistics in data analysis,
data science, ML, and AI — and wants the new content written in the style of three
reference articles at glitchive.com (`/blog/ai-incident-response/`,
`/blog/ml-failure-analysis/`, `/blog/ai-quality-assurance/`).

**Can we hit that style? Yes.** All three articles were reverse-engineered. They are
not "long blog posts" — they are **practitioner playbooks** assembled from ~8 repeating
module types. The gap is concrete and buildable:

| Reference template needs | statohub has today |
|---|---|
| 3,800–5,200 words | 2,000-word floor |
| Key Takeaways table above the fold | — |
| 3–5 copy-paste tables (scorecard, taxonomy, method matrix, ownership matrix) | plain markdown tables |
| 3–5 Pro Tip callouts + pulled quote | — |
| 1–2 numbered runbook checklists | — |
| 1–2 diagrams | — (and we want SVG, not their JPEGs) |
| Dedicated `## Sources` section, 6–15 refs | 1 external link (HARD floor) |
| FAQ block + FAQPage schema | FAQ prose only, no schema |
| Question-form H2s, definition-first opening | narrative H2s |
| TOC with H2 **+ H3** | `ArticleLayout` filters `depth === 2` only |

**Scope (user-decided):** Phase A builds the **writing-style layer only** — standards,
playbook, components, agents, brief format, one gold-standard article. **No routing, no
collections, no hubs, no layouts** — those are Phase B, once the category structure and
new visual design arrive. Components are therefore **design-token-driven** so the new
theme reskins them with zero component edits.

**Also decided:** posts at `/blog/{slug}/` + hubs at `/blog/{category}/` (recorded as an
ADR now, built in Phase B) · 3,000–4,500 words with 3,000 as a HARD floor · infographics
as ~6 reusable prop-driven inline-SVG components.

---

## Verified constraints (checked against the files, not assumed)

- **Draft articles render nowhere.** `src/pages/[slug]/index.astro:16`
  filters `!entry.data.draft` *before* `getStaticPaths()` returns. A `draft: true` entry
  produces **zero** static paths. So the demo article cannot be validated by parking it in
  the `articles` collection — it needs a preview route.
- **`ArticleLayout` TOC is H2-only** (`src/layouts/ArticleLayout.astro:58` —
  `headings.filter(h => h.depth === 2)`). The new format needs H2+H3 → interim
  `<TableOfContents>` component in Phase A, auto-derived in Phase B.
- **Design tokens confirmed** in `src/styles/global.css:20-61`:
  `--paper --paper-2 --card --ink --ink-2 --ink-3 --line --line-2 --pine --pine-soft
  --clay --clay-soft --brass --focus --shadow --r --serif --sans --mono`, flipped
  wholesale under `html.dark`. **No status/severity tokens exist** — scorecards need them.
- **`check-contrast.mjs` guards a hardcoded 5-pair list** (`scripts/check-contrast.mjs:6-11`)
  and its regex only matches 6-digit hex. New tokens get zero protection unless added there.
- **`Link.astro` is internal-only by design** — its own comment: *"Use a plain `<a>` for
  external, anchor, or asset links."* So `<Sources>` correctly uses plain `<a>`.
- **`sitemap()` has no filter** (`astro.config.mjs`) — a preview route
  would enter the sitemap unless excluded.
- **`public/llms.txt` is a curated, hand-maintained GEO file** listing every calculator and
  article. It is a real ranking asset for AI search and **must gain a `## Blog` section** —
  Phase B, noted here so it isn't forgotten.
- Next handoff task number is **TASK-025** (existing run to TASK-024).

---

## Deliverables

### Claude writes directly (prose, rules, content — per ADR-0004)

| Path | Op | Purpose |
|---|---|---|
| `.claude/blog-playbook.md` | CREATE | The new tier's HARD/WARN/ADVISORY rules. **Extends** `seo-playbook.md` as a delta doc; never restates inherited rules. |
| `.claude/agents/blog-article-writer.md` | CREATE | Tier-2 (`model: sonnet`) writer for the blog format. |
| `.claude/agents/blog-article-reviewer.md` | CREATE | Tier-2 (`model: sonnet`) reviewer; scores against `blog-playbook.md`. Never rewrites. |
| `docs/decisions/0014-blog-url-family.md` | CREATE | Records `/blog/{slug}/` + `/blog/{category}/`. |
| `docs/decisions/0015-wedge-scoped-to-stats-vertical.md` | CREATE | Scopes ADR-0001's calculator wedge to the stats vertical; exempts the blog. |
| `content-ops/blog/README.md` | CREATE | Explains the staging folder (mirrors `content-ops/calc-prose/`). |
| `content-ops/blog/data-drift-detection.mdx` | CREATE | The gold-standard demo article. |
| `docs/standards/content.md` | MODIFY | Add the **third** content type; point to `blog-playbook.md`. |
| `docs/decisions/README.md` | MODIFY | Index rows for 0014, 0015. |
| `docs/status/NOW.md` | MODIFY | Session-end state. |

### Codex builds to spec via `handoff/` (app code)

| Task | Produces |
|---|---|
| `TASK-025-blog-schema-and-tokens.md` | `src/lib/schema.ts` (+`faqPageSchema()`), `src/lib/schema.test.ts`, `src/styles/global.css` (status tokens), `scripts/check-contrast.mjs` (+4 pairs) |
| `TASK-026-blog-module-components.md` | `src/components/blog/{KeyTakeaways,Callout,Checklist,DataTable,Sources,FAQ,Figure,TableOfContents}.astro` |
| `TASK-027-blog-svg-infographics.md` | `src/components/blog/infographics/{_SvgFrame,ProcessFlow,TaxonomyTree,ComparisonMatrix,DecisionTree,Scorecard,AnnotatedChart}.astro` |
| `TASK-028-blog-content-ops-schema.md` | `content-ops/{schema.sql,content_db.py,seed.json}` |
| `TASK-029-blog-preview-page.md` | `src/pages/dev/blog-preview/index.astro`, `src/layouts/BlogPreviewLayout.astro`, `astro.config.mjs` (sitemap filter), `public/robots.txt` |

**Order:** 025 → 026 (FAQ imports `faqPageSchema`); 027 and 028 are independent; 029 last.

---

## 1. Design-token strategy (the thing that makes the new theme drop in cleanly)

Every component styles **exclusively** through `var(--token)` — never a literal hex. The
proven in-repo precedent is `src/layouts/ArticleLayout.astro:143-146`,
where an inline SVG uses `stroke="currentColor"` and lets CSS resolve the color. Every
infographic follows that: scoped `<style>` blocks define `.ig-node { fill: var(--card);
stroke: var(--line-2) }`, SVG elements reference classes or `currentColor`, never hex
attributes. Because `html.dark` flips tokens at `:root`, **dark mode works with zero
component logic and zero JS** — the existing theme toggle re-skins every diagram for free.

Add one commented, additive block to both `:root` and `html.dark` (nothing renamed):

```css
/* Blog module status tokens (Phase A) — placeholder values, theme-swappable */
--status-pass:     #2E7D4F;  /* dark: #6FCB9D */
--status-warn:     #B8860B;  /* dark: #D9AF52 */
--status-fail:     #B3261E;  /* dark: #E5766D */
--status-critical: #7A1F1A;  /* dark: #C24A42 */
```

Six-digit hex so `check-contrast.mjs`'s regex picks them up; add 4 new pairs
(`--status-*` on `--card`, both themes) to its `checks` array so CI enforces WCAG AA
from day one.

## 2. Module components — `src/components/blog/`

```ts
// KeyTakeaways.astro — the above-the-fold extractable summary (both reference variants)
{ variant?: 'table' | 'bullets'; heading?: string;
  rows?: { point: string; details: string }[]; bullets?: string[] }

// Callout.astro — Pro Tip / note / pulled source quote
{ variant?: 'tip' | 'note' | 'quote'; title?: string; source?: string; sourceHref?: string }

// Checklist.astro — numbered runbook, deep-linkable
{ title: string; items: (string | { text: string; detail?: string })[];
  style?: 'numbered' | 'check'; id?: string }

// DataTable.astro — props mode OR slot mode; mandatory overflow-x wrapper
{ headers: string[]; rows?: (string|number)[][]; caption?: string;
  align?: ('left'|'center'|'right')[]; badgeColumns?: number[] }

// Sources.astro — plain <a> (external links; Link.astro is internal-only)
{ items: { text: string; href: string; org?: string }[] }

// FAQ.astro — renders Q&A AND emits FAQPage JSON-LD from the SAME array
{ items: { question: string; answer: string }[] }

// Figure.astro — numbered caption wrapper around any infographic
{ caption: string; number?: number; id?: string }

// TableOfContents.astro — INTERIM (hand-authored H2+H3); Phase B auto-derives it
{ items: { text: string; href: string; depth?: 2 | 3 }[]; heading?: string }
```

Usage shape in MDX:

```mdx
<KeyTakeaways rows={[
  { point: 'What it is',    details: 'Data drift is a measurable shift in the statistical properties of production inputs versus training data.' },
  { point: 'Why it matters', details: 'Undetected drift degrades accuracy silently, with no code change and no error.' },
  { point: 'How to detect',  details: 'PSI, the KS test, and chi-square compare live feature distributions against a reference window.' },
  { point: 'When to act',    details: 'PSI above 0.25, or a KS p-value under 0.05 on a business-critical feature.' },
]} />

<Callout variant="tip">Compute PSI on a rolling 7-day window. A single day's noise
produces false alarms on low-volume features.</Callout>
```

**`faqPageSchema()`** goes in `src/lib/schema.ts` as a pure builder
matching the existing `articleSchema`/`webSiteSchema` style, rendered through the existing
`src/components/seo/JsonLd.astro` (unmodified). Deriving the visible answers and the
structured data from one array is deliberate — they can never drift apart.

The writer types the literal `## Sources` / `## FAQ` H2 in markdown so remark's heading
extraction still sees them; the component renders the body beneath.

## 3. SVG infographics — `src/components/blog/infographics/`

`_SvgFrame.astro` (internal, underscore prefix matches `_stats-math.ts` convention) wraps
every diagram: `<svg role="img" viewBox aria-labelledby><title/><desc/><slot/></svg>` —
one place guarantees accessibility wiring. Then six author-facing components:

```ts
ProcessFlow      { title; desc; steps: {label, detail?}[]; direction?: 'horizontal'|'vertical' }
TaxonomyTree     { title; desc; root: string; branches: {label, children?: string[]}[] }
ComparisonMatrix { title; desc; columns: string[]; rows: {label, values}[]; scaleMax? }
DecisionTree     { title; desc; root: DecisionNode; maxDepth?: number /* default 3 */ }
Scorecard        { title; desc; metrics: {label,value,max,threshold?,status,unit?}[] }
AnnotatedChart   { title; desc; type?: 'bar'|'line'; points: {label,value,annotation?}[]; xLabel?; yLabel? }
```

Static SSG SVG only — **not** the client-side uPlot used for calculator output. Authors
write data, never markup.

## 4. `.claude/blog-playbook.md` — the new tier

Opens by declaring itself a **delta**: *"Extends `.claude/seo-playbook.md`'s three-tier
model (ADR-0008) for the applied-stats/ML/AI blog format. Any rule not restated here —
voice, YMYL accuracy verification, no raw LaTeX, internal-links-via-registry-only, the
110–160 char meta description, `draft: true` gating — is inherited unchanged."*

**HARD (blocks publish)**
1. ≥ **3,000 words** (this tier's floor; the stats tier's 2,000 floor is untouched).
2. First sentence is an extractable definition — literally "*X is / are / refers to…*".
   Reviewer-graded, like the existing no-fabrication check.
3. A `<KeyTakeaways>` block before the first H2.
4. Literal `## Sources` H2 with **≥ 6** resolving external links (curl-checked, existing gate).
5. Literal `## FAQ` H2 with **≥ 3** `<FAQ>` entries.
6. ≥ 1 `<DataTable>`, ≥ 1 `<Checklist>`, ≥ 1 `<Figure>`-wrapped infographic.
7. Inherited: one H1 (body starts at H2) · meta description 110–160 · no LaTeX · typed
   internal links only · valid frontmatter · `draft: true` · no fabrication · no cannibalization.

**WARN (logged, never blocks)**
- Words < 3,200 or > 4,800 · fewer than half of H2s question-phrased (contains `?` or opens
  What/How/Why/When/Which/Should/Can/Does) · < 10 external refs (6 is the floor, 10 the aim)
  · < 3 tables · < 2 tip callouts · < ~25 bold spans (target ~40) · no named standards entity
  (NIST, ISO, OWASP, IEEE, arXiv, ACL, NeurIPS, GDPR, EU AI Act, MITRE ATLAS — maintained list)
  · < 8 internal links · any FAQ answer < 40 or > 140 words · H2 count outside 8–14.

**ADVISORY** — table-archetype variety · self-contained-passage spot-check (does each
section read standalone? the core GEO citability test) · 1–2 diagrams is normal · voice
density · AI-writing tells.

**Calibration note, verbatim in the file:** until the blog corpus grows, most internal
links will point at the **existing 39 stats articles and 29 calculators** — that is
correct and desirable, it bootstraps topical authority. Never pad the count with
irrelevant targets.

## 5. Canonical article skeleton (~3,900 words)

| Section | Modules | Words |
|---|---|---|
| Opening (pre-H2) | definition paragraph + KeyTakeaways + TOC | 200 |
| H2 1 · "What is X?" | — | 280 |
| H2 2 · "Why does X matter?" | Tip 1 | 260 |
| H2 3 · "What types of X exist?" | TaxonomyTree + taxonomy table | 340 |
| H2 4 · "How do you measure/do X?" | method-comparison table + ProcessFlow | 420 |
| H2 5 · "Which approach when?" | DecisionTree, Tip 2 | 320 |
| H2 6 · "What thresholds signal a problem?" | severity table + Scorecard | 320 |
| H2 7 · "How do you make it repeatable?" | Checklist, Tip 3 | 380 |
| H2 8 · worked example | AnnotatedChart + pulled quote | 380 |
| H2 9 · "Who owns this on a team?" | ownership matrix, Tip 4 | 260 |
| H2 10 · common mistakes | — | 260 |
| `## Sources` | Sources | 130 |
| `## FAQ` | 5 × ~75 w | 380 |
| Recommended / Next in pillar | RelatedLink | 70 |

Compress H2 3–10 ~35% for a lean 3,000; expand for 4,500.

## 6. Agent pair

Both `model: sonnet` (Tier 2 per CLAUDE.md's binding tiering). Descriptions **name the
sibling agent explicitly** so auto-delegation can't misroute:

> `blog-article-writer` — "Drafts a statohub **applied-statistics-for-ML/AI/data-science
> BLOG post** (MDX, 3,000–4,500 words) from a `content_db.py` brief with
> `content_type=applied_blog`. Distinct from `stats-article-writer`, which handles the
> ≥2,000-word core-statistics teaching tier."

Writer loads `blog-playbook.md` first, then `seo-playbook.md` for inherited rules,
`config.ts`, the gold-standard article as shape reference, and greps
`src/components/blog/**` for live component APIs. Outputs to `content-ops/blog/<slug>.mdx`
+ a report: word count, per-module usage counts, external refs, internal link count,
FAQ count, blockers.

Reviewer gets `Read, Bash, Grep, Glob` only (no Write — mirrors `stats-article-reviewer`),
scores /100 against §4, logs via `content_db.py log-review`.

## 7. content-ops — one column, no parallel table

Add `content_type TEXT NOT NULL DEFAULT 'stats_teaching'` to `articles`. The table already
carries every field a blog post needs, and the existing global-unique keyword index
(`idx_kw_global`) already gives the blog cannibalization protection for free. A parallel
`blog_posts` table would duplicate that plus the `keywords` and `reviews` relations.

- `schema.sql` — add the column for fresh `init`.
- `content_db.py::cmd_init` — **idempotent migration**: `PRAGMA table_info(articles)`, and
  if absent `ALTER TABLE articles ADD COLUMN …`. Required, because `init` is
  `CREATE TABLE IF NOT EXISTS` and will not touch the live 75-row `content.db`.
- Validate the two values in Python, matching how `status` is validated against `STATUSES`
  (not a SQL `CHECK`).
- `cmd_seed` — `a.get("content_type", "stats_teaching")`; existing 75 rows need no edit.
- `cmd_brief` — branch the rules footer for `applied_blog`: point at `blog-playbook.md`,
  state the 3,000–4,500 band, and emit a **required-modules checklist**.
- `cmd_show` — print `content_type`.
- `seed.json` — one placeholder category row (`blog-applied-ml`) to satisfy the existing
  `category_slug` FK. This is SQLite bookkeeping only — decoupled from
  `src/content/categories/*.yaml`, so it is **not** Phase B collections wiring.

*Flagged, not fixed:* `UNIQUE(keyword)` is global. A blog post wanting "chi-square test"
as a secondary keyword will collide with the stats article that owns it. Zero collisions
today — revisit with `UNIQUE(content_type, keyword)` when it actually bites.

## 8. Gold-standard demo article

**"Data Drift Detection: A Practical Guide for Production ML Systems"** →
`content-ops/blog/data-drift-detection.mdx`, future URL `/blog/data-drift-detection/`.

Best available statistics × ML intersection for *this* site: it reuses concepts statohub
already teaches (chi-square, normal distribution, p-values, confidence intervals) as
genuine internal-link targets, and it naturally generates every table and diagram
archetype — drift taxonomy, PSI/KS/chi-square/KL method comparison, severity bands,
test-selection decision tree, monitoring pipeline flow, alert-to-resolution runbook,
drift-over-time chart, ownership matrix.

Follows the §5 skeleton. Sources ≈ 10 (NIST AI RMF, Quiñonero-Candela *Dataset Shift*,
Google Cloud / AWS / Microsoft MLOps docs, an arXiv covariate-shift paper, evidently.ai).
"Recommended" links **3 real published stats pages** verified live via `content_db.py list`
— never a fabricated sibling. "Next in this pillar" is omitted (no hub exists yet).

**Note carried inside the file:** this article deliberately uses **all 6** infographics to
prove each renders and re-themes. A normal post uses 1–2. Do not treat 6 as the norm.

## 9. Verification

Draft articles produce no routes, so validation runs through a **preview page** —
`/dev/blog-preview/`, importing the MDX directly (Astro's `MDXInstance` gives
`frontmatter`, `headings`, `Content`):

```astro
import Demo, { frontmatter, headings } from '../../../../content-ops/blog/data-drift-detection.mdx';
```

**Recommendation: keep this page permanently** as a `noindex` living style guide rather
than deleting it — the redesign is imminent and a single URL showing every module in both
themes is exactly what that work needs. Cost is three lines: `noindex` (a prop
`BaseLayout` already supports), `sitemap({ filter: (p) => !p.includes('/dev/') })` in
`astro.config.mjs`, and a `Disallow: /dev/` in `public/robots.txt`.

*Risk:* importing `.mdx` from outside `src/` is a Vite path question I have not executed.
If it is rejected, move the article to `src/content-drafts/blog/` — a one-line change, and
it must stay out of `src/content/` either way so no collection globs it.

Gates, in order:

1. `npx astro check` — static scan; type-checks all 15 new components' Props **even before
   anything imports them**.
2. `npm test` — covers the new `schema.test.ts` for `faqPageSchema()`. *Honest limit:* this
   repo has no Astro-component test harness (the suite is pure `.ts` under `src/calc/**`),
   so component rendering is not unit-testable — the build is the render proof.
3. `node scripts/check-contrast.mjs` — after adding the 4 `--status-*` pairs.
4. `npm run build` — renders the preview page through every module and infographic with
   real content (**the actual proof**), then `check-links.mjs` validates every typed
   internal link in the demo article resolves, then `check-meta-description.mjs`.
5. Manual `npm run preview`: toggle dark mode; narrow the viewport to confirm
   `DataTable`'s overflow-x scroll.

## 10. ADR conflicts

- **ADR-0001 (wedge: calculator + teaching on every page).** Blog posts ship without
  `<StatCalc>`. Resolved by **ADR-0015**, scoping the wedge to the statistics vertical and
  exempting the applied blog — while still linking to calculators from prose where
  genuinely relevant. A recorded decision, not a silent deviation.
- **ADR-0002 (flat URLs).** No conflict. Its own text requires new page types to *"decide
  their URL shape before build, not after"* — **ADR-0014** does exactly that. Bonus: the
  `/blog/` prefix means blog content can never collide with the root `[slug]`
  article-vs-category-hub union, so its collision guard needs no third arm.
- **One-agent-on-the-repo gate (ADR-0004)** is unchanged: subagents draft to disk, the
  orchestrator makes the single gated commit.

## Phase B (not in this plan — recorded so it isn't lost)

`blogPosts` + `blogCategories` collections · `RouteRef` variants + `routes.blogPost()` /
`routes.blogCategoryHub()` · `src/pages/blog/**` · `BlogPostLayout` with **H2+H3** TOC ·
the 4–5 real categories · move the demo article into the collection · **add a `## Blog`
section to `public/llms.txt`** · Article schema `image` field (already open in `NOW.md`) ·
decide whether the blog joins the daily cloud-routine publishing queue.
