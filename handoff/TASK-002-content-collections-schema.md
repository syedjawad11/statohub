Status: CLOSED
<!-- TODO | IN_PROGRESS | DONE | CHANGES_REQUESTED | CLOSED -->

# TASK-002 — Content Collections schema (categories / articles / calculators)

- **Owner of this stage:** Codex
- **Repo:** `Desktop/statohub/` (where the work happens)
- **Created:** 2026-06-13 by Claude

---

## Brief  *(Claude writes — what Codex needs to execute)*

**Goal:** Define the typed content model for the whole site — three Astro Content
Collections (`categories`, `articles`, `calculators`) with Zod schemas in
`src/content/config.ts` — plus one internally-consistent, deletable sample entry
per collection that proves the schemas validate and cross-collection references
resolve. **Schema only.** No pages consume the collections yet; no calculator
form-config, no `<StatCalc>`, no `links.ts`, no engines, no layouts.

**Context / inputs:**
- [`../BUILD-PLAN.md`](../BUILD-PLAN.md) — **§ Plan A → A2** (this task) and **B1**
  (URL SOP) and **B2** (`links.ts` will be *generated from these collections* in
  TASK-005, so the schema must carry enough to derive every route).
- Routing rules these collections must support (from B1):
  - Article URL = `/{filename}/` — **flat, no category in path.** The article's
    filename **is** its slug. Do not add a `slug` field.
  - Category hub URL = `/{filename}/` for the category data file.
  - Calculator URL = `/calculators/{filename}/`. The calculator data file's id
    **is** its tool slug. Do not add a `slug` field.
- The 7 categories (for context, not all need sample files): Descriptive
  Statistics, Probability & Distributions, Regression & Correlation, Combinatorics,
  Foundations Hub, Inferential & Hypothesis Testing, Calculators.
- Calculator engines (`engine` field) are just **string keys** for now — the actual
  `src/calc/registry.ts` they point into is built in **TASK-003**. Don't create it
  here; a string is fine and stays decoupled.

**Pinned schema contract (`src/content/config.ts` — build to this; deviate only with
a logged reason):**
```ts
import { defineCollection, reference, z } from 'astro:content';

const categories = defineCollection({
  type: 'data', // YAML/JSON, no prose body
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().int().default(0),       // nav ordering
    pillar: reference('articles').optional(), // the hub's flagship article
  }),
});

const articles = defineCollection({
  type: 'content', // MDX — filename = flat slug
  schema: z.object({
    title: z.string(),
    description: z.string(),                    // meta description
    category: reference('categories'),
    primaryKeyword: z.string(),
    keywords: z.array(z.string()).min(1),       // the mapped 6–12 keywords
    phase: z.union([z.literal(1), z.literal(2), z.literal(3)]).default(1),
    calculator: reference('calculators').optional(), // embedded <StatCalc>
    related: z.array(reference('articles')).default([]),
    draft: z.boolean().default(true),           // unfinished articles never ship
    pubDate: z.coerce.date().optional(),
    updatedDate: z.coerce.date().optional(),
    ogImage: z.string().optional(),
  }),
});

const calculators = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    engine: z.string(),                         // key into src/calc/registry.ts (TASK-003)
    category: reference('categories').optional(),
    standalone: z.boolean().default(true),      // false = embed-only (no /calculators/{slug}/ route)
    chart: z.boolean().default(false),          // true = lazy-load uPlot later
    keywords: z.array(z.string()).default([]),
  }),
});

export const collections = { categories, articles, calculators };
```

**Deliverables:**
- [ ] `src/content/config.ts` — exactly the contract above.
- [ ] One **deletable, internally-consistent** sample entry per collection that
      validates (mirrors TASK-001's throwaway-route pattern):
  - `src/content/categories/descriptive-statistics.yaml`
  - `src/content/calculators/standard-deviation.yaml` (`engine:'standardDeviation'`,
    `standalone:true`, `chart:false`)
  - `src/content/articles/standard-deviation.mdx` — `category` → the sample
    category, `calculator` → the sample calculator, a `primaryKeyword`, a small
    `keywords` array, `phase:3`, `draft:true`, plus a one-line MDX body. (Article
    slug `standard-deviation` and calculator id `standard-deviation` intentionally
    coincide — they live in different URL spaces, `/standard-deviation/` vs
    `/calculators/standard-deviation/`, which is the real dual-deploy design.)
  - All references must resolve (the article's `category`/`calculator` point at the
    two files that exist; either omit `pillar`/`related` or point them at existing
    entries — Astro fails the build on a dangling `reference()`).

**Constraints:**
- Stay in this repo; don't touch sibling folders. **Do not edit `CLAUDE.md`** — log
  in this task file's Work Log.
- **Schema + sample data ONLY.** Do **not**: wire any `src/pages/**` route to a
  collection, build `<StatCalc>`, create `src/calc/**`, `src/lib/links.ts`,
  `scripts/check-links.mjs`, or any SEO component — all later tasks.
- **Do NOT add the calculator form-config** (the input/output field spec
  `<StatCalc>` consumes) to the `calculators` schema. That schema gets extended in
  **TASK-004**; defining it now is out of scope and would cause rework.
- Don't touch the existing `src/pages/index.astro`, `src/pages/normal-distribution/`,
  or `BaseLayout.astro`.
- Use Astro's built-in `reference()` for all cross-collection links (build-time
  integrity — supports Plan B).
- Lean: minimal sample entries, clearly deletable. No demo cruft.

**Definition of done / how to verify:**
- `npx astro sync` succeeds and generates types for all three collections (the
  collection names become typed in `.astro/`).
- `npx astro check` exits `0` — sample entries validate against the schemas and all
  `reference()`s resolve.
- `npm run build` still exits `0` and the existing `dist/index.html` +
  `dist/normal-distribution/index.html` still build (collections don't break the
  existing routes; no new routes are expected from this task).
- Note in your Work Log: confirm a dangling reference *would* fail (you can mention
  you reasoned about it / briefly tested) — this is the integrity guarantee TASK-005
  builds on.

---

## Work Log  *(Codex writes — what was actually done)*

- **Started:** 2026-06-13
- **Finished:** 2026-06-13

**What changed (files + where):**
- `src/content/config.ts` — added the three Astro Content Collections from the pinned contract: `categories`, `articles`, and `calculators`, with `reference()` fields for build-time cross-collection integrity.
- `src/content/categories/descriptive-statistics.yaml` — added a minimal deletable category sample.
- `src/content/calculators/standard-deviation.yaml` — added a minimal deletable calculator sample using `engine: standardDeviation`, `standalone: true`, and `chart: false`.
- `src/content/articles/standard-deviation.mdx` — added a minimal deletable draft article sample that references the sample category and sample calculator.

**How to verify:**
- `npx astro sync` — passed; generated content collection types.
- `npx astro check` — passed with 0 errors, 0 warnings, 0 hints.
- `npm run build` — passed; built the existing `/` and `/normal-distribution/` routes only, as expected for schema-only work.
- Dangling-reference guarantee: the sample entries use Astro `reference()` fields for `category` and `calculator`; `astro check` resolves those references, so a missing target ID would fail validation.

**Blocked / couldn't do / decisions made:**
- None. The first sandboxed `astro sync` / `astro build` attempts hit Windows `spawn EPERM`; rerunning with approved process-spawn permissions passed.

---

## Review  *(Claude writes — accept or send back)*

- **Reviewed:** 2026-06-14
- **Verdict:** CLOSED

**Notes / what to improve:**
- `src/content/config.ts` matches the pinned contract verbatim — all three collections, all
  `reference()` fields, defaults, and the `phase` literal-union intact. No deviations.
- Sample entries are internally consistent and clearly deletable: article `standard-deviation.mdx`
  references both the sample category and sample calculator; the article-slug / calculator-id
  collision (`standard-deviation` in two URL spaces) correctly demonstrates the dual-deploy design.
- Scope respected — no route wiring, no `<StatCalc>`, no `src/calc/**`, no `links.ts`, calculator
  schema left un-extended for TASK-004. `engine` kept as a decoupled string key.
- Independently re-ran `npx astro check` → **3 files, 0 errors / 0 warnings / 0 hints.** Confirmed.
- Good catch noting the Windows `spawn EPERM` sandbox issue and resolving it with approved
  process-spawn perms — worth remembering for TASK-003 (it runs Vitest, same spawn path).
