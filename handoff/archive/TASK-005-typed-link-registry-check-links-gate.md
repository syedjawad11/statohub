Status: CLOSED
<!-- TODO | IN_PROGRESS | DONE | CHANGES_REQUESTED | CLOSED -->

# TASK-005 -- Typed link registry + Link.astro + check-links build gate

- **Owner of this stage:** Codex
- **Repo:** `Desktop/statohub/` (where the work happens)
- **Created:** 2026-06-14 by Claude

<!-- Authoring note (Claude): keep this file plain ASCII. Use `--` not an em
dash, `->` not an arrow, `...` not an ellipsis. Codex reads these files through
a Windows codepage; non-ASCII punctuation renders as mojibake and breaks its
apply_patch matching. -->

---

## Brief  *(Claude writes -- what Codex needs to execute)*

**Goal:** Make broken/non-canonical internal links a **build-time failure**, in
two layers: (1) a single typed module that is the ONLY way to build an internal
href, so a link to a nonexistent route fails `astro check`; (2) a post-build
gate that crawls `dist/**/*.html` and fails the build if any internal page link
is non-slash-terminated, points at a missing route, or points at a redirect
source. This is the mechanical enforcement of the BUILD-PLAN non-negotiable:
**zero internal redirects / zero internal 404s**.

**Context / inputs:**
- [`../BUILD-PLAN.md`](../BUILD-PLAN.md) **Plan B -> B2** is the spec (3 layers):
  1. `src/lib/links.ts` -- single source of truth: a stable route id ->
     canonical slash-terminated path; one emitter is the only way to produce an
     internal link; derived from the content collections so it can't drift.
  2. `Link.astro` takes a **typed** route reference -> a typo'd / nonexistent
     target **fails TypeScript at build**.
  3. `scripts/check-links.mjs` build gate: after `astro build`, crawl
     `dist/**/*.html`; assert every internal href ends in `/` AND resolves to a
     real `index.html`; flag any href that matches a `_redirects` source. Any
     failure -> `exit 1` -> deploy blocked.
- **Also B1 / B3:** every URL ends in `/`; `_redirects` (if/when present) holds
  only one-hop re-slugs to canonical targets. This task does NOT author any
  `_redirects` entries -- but the gate must handle the file being present or
  absent gracefully.
- **Existing routes today** (what the registry must cover now; built by
  TASK-001/004): `/` (home), `/{category}/` category hubs (only
  `descriptive-statistics` exists as data so far -- no hub *page* route yet, see
  scope note), flat articles `/{slug}/` (e.g. `/normal-distribution/`),
  `/calculators/` (hub), `/calculators/{slug}/` (standalone calculators, e.g.
  `/calculators/standard-deviation/`).
- **Collections** (`src/content/config.ts`, TASK-002): `categories`, `articles`
  (`type:'content'`, MDX), `calculators` (`type:'data'`). Astro auto-generates
  literal-union id/slug types for these on `astro sync` -- **use those generated
  types** to type the registry (see below); do NOT hand-maintain a parallel list
  of slugs.
- **Existing internal links to retrofit:** at least the `/calculators/` hub list
  (`src/pages/calculators/index.astro` currently emits `href={`/calculators/${entry.id}/`}`),
  plus any internal nav/footer links in `src/layouts/BaseLayout.astro` and any
  internal links on `src/pages/index.astro` / `src/pages/normal-distribution/index.astro`.
  Grep for internal `<a ... href="/...">` and route them all through the registry.

**Design (pin these decisions -- they resolve the type-safety vs. drift tension):**

The compile-time guarantee and the drift-free guarantee come from **Astro's own
generated content types**, not from custom codegen. `links.ts` stays a small,
synchronous, type-only-dependent module:

- Derive the per-collection id types from `astro:content` (e.g.
  `CollectionEntry<'articles'>['slug']`, `CollectionEntry<'calculators'>['id']`,
  `CollectionEntry<'categories'>['id']`). **Verify in this Astro version which
  key carries the literal-union** (`slug` for `type:'content'`, `id` for
  `type:'data'`) and use whichever is the real string-literal union; the test is
  that a bogus id fails `astro check`. Type-only imports only -- no runtime
  `getCollection` call in `links.ts` (keeps it sync and import-safe from
  `.astro`, `.ts`, and the future JSON-LD components).
- Define a discriminated `RouteRef` union, one variant per route kind:
  - `{ kind: 'home' }`
  - `{ kind: 'categoryHub'; id: CategoryId }`
  - `{ kind: 'article'; id: ArticleId }`
  - `{ kind: 'calculatorsHub' }`
  - `{ kind: 'calculator'; id: CalculatorId }`
- Export a single resolver `url(ref: RouteRef): string` that returns the
  canonical **slash-terminated** path:
  - home -> `/`
  - categoryHub -> `/${id}/`
  - article -> `/${id}/`
  - calculatorsHub -> `/calculators/`
  - calculator -> `/calculators/${id}/`
  `url()` is the ONLY internal-href emitter (satisfies B2 layer 1). Optionally
  add thin convenience builders (`routes.article(id)` etc.) that just call
  `url()` -- keep it lean, no logic beyond delegating.
- Because the `id` fields are typed to the generated literal unions, a typo
  (`{ kind:'article', id:'normaldist' }`) is a **TypeScript error** -> caught by
  `astro check`. That is layer 2's guarantee; demonstrate it once (below).

**Deliverables:**

- [ ] **`src/lib/links.ts`** -- the typed registry exactly as designed above:
      `RouteRef` discriminated union (ids typed from the generated `astro:content`
      types), `url(ref): string` single slash-terminated emitter, optional thin
      `routes.*` convenience wrappers. No async, no runtime collection reads, no
      new dependency. Add a short comment block stating it is the single source of
      truth for internal links (B2) and that all hrefs and all JSON-LD URL fields
      (TASK-006) must route through `url()`.

- [ ] **`src/components/Link.astro`** -- a thin typed anchor. Props: `to: RouteRef`
      (typed -- the type-safety lives here), plus optional `class` and a
      `...rest` passthrough for normal anchor attrs (e.g. `aria-current`). Renders
      `<a href={url(to)} class={...} {...rest}><slot /></a>`. It must NOT accept a
      raw string href for internal links -- internal links go through `to`. (An
      author who needs an external link uses a plain `<a>`; Link.astro is for
      internal routes only -- note this in a comment.)

- [ ] **Retrofit existing internal links** to use `Link`/`url()`:
      - `src/pages/calculators/index.astro`: the standalone-calculator list links
        (`/calculators/${entry.id}/`) -> `<Link to={{ kind:'calculator', id: entry.id }}>`.
        (`entry.id` from `getCollection('calculators')` is already the typed id, so
        this type-checks.)
      - Any internal nav/footer/home links in `BaseLayout.astro`,
        `src/pages/index.astro`, `src/pages/normal-distribution/index.astro`.
      - Leave external links (`http(s)://`, `//`, `mailto:`, `tel:`), in-page
        anchors (`#...`), and asset links (`.js/.css/.xml/.svg/.png/...`) as plain
        `<a>` -- the registry is for internal **page** routes only.

- [ ] **`scripts/check-links.mjs`** -- ESM Node script, **Node built-ins only**
      (`node:fs`, `node:path`; `fs.readdirSync(dir,{recursive:true})` is available
      on Node 20.8.0 -- no `glob`/`globby`/`cheerio` dependency). After
      `astro build`:
      - Recursively collect `dist/**/*.html`.
      - From each file extract `<a>` `href` values (a regex over
        `href="..."` within anchor tags is fine -- this is built, well-formed
        Astro output, not arbitrary HTML).
      - **Classify and skip non-page links:** external (`http://`, `https://`,
        `//`, `mailto:`, `tel:`), pure in-page anchors (`#...`), and asset paths
        whose final segment has a file extension (allowlist e.g.
        `.js .mjs .css .xml .txt .json .svg .png .jpg .jpeg .webp .avif .ico
        .gif .woff .woff2 .map .pdf`). Strip `?query` and `#hash` before
        classifying.
      - **For every remaining internal page link** (starts with `/`, not `//`):
        1. **Trailing-slash assert:** must end with `/`. If not -> record a
           violation (B1).
        2. **Existence assert:** map the path to a built file -- `/` ->
           `dist/index.html`, `/foo/bar/` -> `dist/foo/bar/index.html`. If the
           file does not exist -> record a violation (internal 404 guard).
        3. **Redirect-source guard:** if `dist/_redirects` exists, parse its
           source paths (first token per non-comment, non-empty line); if the
           link equals a redirect source -> record a violation (never link at a
           hop). If `dist/_redirects` is absent, skip this check cleanly.
      - Print a summary: pages scanned, internal links checked, violations found.
        On **0 violations** print an OK line and `process.exit(0)`. On any
        violation, print each as `file -> offending-href -- reason` and
        `process.exit(1)`.

- [ ] **Wire the gate into the build.** In `package.json`, make the `build`
      script run the gate after the Astro build: `astro build && node
      scripts/check-links.mjs` (matches BUILD-PLAN A6 -- the gate runs on every
      `npm run build`). Keep `astro check` and `test` scripts as they are. If a
      raw Astro-only build is still useful, you may add a separate `build:astro`
      script, but `npm run build` MUST include the gate.

**Constraints:**
- Stay in this repo; don't touch sibling folders. **Do not edit `CLAUDE.md`** --
  log in this task file's Work Log.
- **No new runtime or dev dependency.** `links.ts` uses type-only `astro:content`
  imports; `check-links.mjs` uses Node built-ins only. Keep deps at the current
  astro/mdx/sitemap set; stay safe on **Node 20.8.0 / Wrangler v3** (don't bump
  anything).
- **Do not touch `src/calc/**`** (pure engines stay untouched) and do not change
  calculator/StatCalc behavior -- this task only adds the link layer and retrofits
  hrefs.
- `links.ts` must stay **synchronous and side-effect-free** (no `getCollection`
  at module load) so it is safe to import from components and from the future
  JSON-LD/canonical components (TASK-006).
- **Out of scope (other tasks -- do NOT build):** SEO components
  (`Canonical.astro`, `Meta.astro`, `Breadcrumbs.astro`, `JsonLd.astro`) +
  sitemap config (TASK-006); deploy pipeline + `wrangler pages deploy` + domain
  (TASK-007); article render routes / `ArticleLayout`; authoring any `_redirects`
  entries (none needed yet -- just make the gate tolerate presence/absence). Note
  in a comment that TASK-006 components will consume `url()`.
- **No category hub *page* yet:** there is category *data* but no
  `src/pages/[category]/index.astro` route. Include the `categoryHub` variant in
  `RouteRef` so the registry is ready, but do NOT create the hub page route here,
  and do NOT emit any `categoryHub` link from a page yet (an emitted link to a
  not-yet-built `/descriptive-statistics/` would correctly FAIL the gate). The
  variant exists for TASK-006/content tasks to use once the hub route is built.

**Sandbox heads-up:** see [`../AGENTS.md`](../AGENTS.md) -> "Sandbox heads-up".
`astro build` / `astro check` / `vitest` may hit Windows `spawn EPERM` until you
approve process-spawn; an uncached `npm install` (not expected here -- no new
deps) needs network approval. Both are expected approval prompts in this trusted
project, not bugs -- approve and re-run.

**Definition of done / how to verify:**
- `npm run build` exits `0`: it runs `astro build` THEN `check-links.mjs`, and the
  gate prints its OK summary (pages scanned, internal links checked, 0
  violations). The existing routes still build (`dist/index.html`,
  `dist/normal-distribution/index.html`, `dist/calculators/index.html`,
  `dist/calculators/standard-deviation/index.html`; still NO
  `dist/calculators/median/index.html`).
- `npx astro check` exits `0` (the typed `RouteRef` + retrofitted `Link` usages
  all type-check).
- `npm test` (`vitest run`) stays green -- 33 tests, engines untouched.
- **Prove layer 2 (types) bites, then revert:** temporarily change one retrofitted
  link to a bogus id (e.g. `to={{ kind:'article', id:'does-not-exist' }}`),
  confirm `npx astro check` now **fails** with a type error on that id, then
  revert. Record the observed error in the Work Log.
- **Prove layer 3 (gate) bites, then revert:** demonstrate BOTH failure modes and
  confirm each makes `npm run build` exit `1`, then revert:
  (a) a **non-slash** internal link (e.g. a hand-added `<a href="/calculators">`
  without the trailing slash) -> gate reports a trailing-slash violation;
  (b) a link to a **nonexistent** route (e.g. `<a href="/no-such-page/">`) ->
  gate reports a missing-`index.html` violation.
  Record both gate outputs (the `file -> href -- reason` lines + exit 1) in the
  Work Log, and confirm the clean build returns to exit `0` after reverting.
- In the Work Log, confirm: no new dependency added; `src/calc/**` unchanged;
  which generated key (`slug` vs `id`) you used per collection for the typed ids;
  and the list of files whose internal links you retrofitted.

---

## Work Log  *(Codex writes -- what was actually done)*

- **Started:** 2026-06-14
- **Finished:** Not finished -- paused for Claude review/fix of the type-source issue.

**What changed (files + where):**
- `src/lib/links.ts` -- added `RouteRef`, `url(ref)`, and thin `routes.*`
  helpers. The module is synchronous and has no runtime collection reads. It has
  the required route variants: `home`, `categoryHub`, `article`,
  `calculatorsHub`, and `calculator`.
- `src/lib/content-route-ids.ts` -- added a temporary type-only literal id source
  for current content ids (`standard-deviation`, `median`,
  `descriptive-statistics`) so the bogus-id proof can fail under `astro check`.
  This is the main item needing Claude review because the brief asked not to
  hand-maintain a parallel id list.
- `src/components/Link.astro` -- added a typed internal-only anchor component
  taking `to: RouteRef`, calling `url(to)`, and passing through common anchor
  attrs. It does not accept a raw `href`.
- `src/layouts/BaseLayout.astro` -- retrofitted the header home link through
  `Link` and a typed frontmatter route ref.
- `src/pages/index.astro` -- retrofitted the internal CTA through `Link`. Note:
  this now points to `/calculators/` instead of the temporary
  `/normal-distribution/` proof page because there is no article route yet and I
  did not want to emit an article/category route that the gate would correctly
  fail.
- `src/pages/normal-distribution/index.astro` -- retrofitted the home link
  through `Link`.
- `src/pages/calculators/index.astro` -- retrofitted standalone calculator list
  links through `Link` and typed route refs.
- `scripts/check-links.mjs` -- added the post-build internal link gate using
  Node built-ins only. It crawls `dist/**/*.html`, skips external/anchor/asset
  links, checks trailing slash, checks matching `index.html`, and checks
  `_redirects` sources if present.
- `package.json` -- changed `build` to `astro build && node
  scripts/check-links.mjs`. No package dependency changes were made.

**How to verify:**
- `npm run build` -- exited 0 before proof edits. Output included:
  `check-links: scanned 4 pages, checked 7 internal links, found 0 violations.`
  and `check-links: OK - all internal page links are canonical and resolvable.`
- `npx astro check` -- exited 0 before proof edits with `0 errors`, `0 warnings`,
  `0 hints`.
- `npm test` -- first hit expected Windows sandbox `spawn EPERM`; reran with
  process-spawn approval and it exited 0: 12 test files passed, 33 tests passed.
- Layer 2 proof attempt using only Astro generated `CollectionEntry` fields did
  NOT fail as required:
  - Tried `CollectionEntry<'articles'>['slug']`.
  - Tried deriving articles from generated content `id` (`standard-deviation.mdx`
    -> `standard-deviation`).
  - Tried `import.meta.glob()` type keys.
  - Tried module augmentation to expose generated internal content maps.
  In this repo/Astro 4 setup, those approaches were widened enough that
  `to={{ kind: 'article', id: 'does-not-exist' }}` or the equivalent typed
  frontmatter route still passed `npx astro check`.
- Layer 2 proof with the current temporary `src/lib/content-route-ids.ts` fallback
  DID fail as expected. Temporary edit:
  `const homeRoute = { kind: 'article', id: 'does-not-exist' } satisfies RouteRef;`
  Error observed:
  `Type '"does-not-exist"' is not assignable to type '"standard-deviation"'.`
  Also observed at the component use:
  `Type '{ kind: "article"; id: "does-not-exist"; }' is not assignable to type 'RouteRef'.`
  The temporary bogus route was reverted.
- Layer 3 proof, non-slash mode, DID fail as expected. Temporary link:
  `<a href="/calculators">Temporary bad link</a>`. `npm run build` exited 1 and
  printed:
  `index.html -> /calculators -- internal page link must end with /`
  The temporary link was reverted.
- Layer 3 proof, missing route mode, DID fail as expected. Temporary link:
  `<a href="/no-such-page/">Temporary dead link</a>`. `npm run build` exited 1
  and printed:
  `index.html -> /no-such-page/ -- missing matching index.html`
  The temporary link was reverted.

**Blocked / couldn't do / decisions made:**
- Current blocker: the strict no-drift type source requested by the brief is not
  solved. The brief wants route ids derived from Astro generated
  `astro:content` literal unions. In this repo, `CollectionEntry<'articles'>['slug']`,
  `CollectionEntry<'calculators'>['id']`, and `CollectionEntry<'categories'>['id']`
  did not behave as usable string-literal unions during `astro check`; bogus ids
  still passed when relying on those public generated fields.
- The current fallback (`src/lib/content-route-ids.ts`) gives the layer 2 proof a
  real compile-time bite, but it is a small manually maintained id list and may
  drift from content. Claude should either accept this with a follow-up codegen
  task, replace it with a better Astro-generated type source, or change the
  content setup so generated collection ids remain literal in `astro check`.
- Generated keys checked: articles are `slug` for content routes but the
  generated article `id` is `standard-deviation.mdx`; calculators use `id`;
  categories use `id`. The public `CollectionEntry` versions of those keys were
  not sufficient for the bogus-id proof in this environment.
- No new dependency was added.
- `src/calc/**` was not edited.
- Files retrofitted for internal links: `src/layouts/BaseLayout.astro`,
  `src/pages/index.astro`, `src/pages/normal-distribution/index.astro`,
  `src/pages/calculators/index.astro`.
- I stopped before doing further clean reruns after the user's instruction to
  update this task file and let Claude inspect/fix the type-source issue.

---

## Review  *(Claude writes -- accept or send back)*

- **Reviewed:** 2026-06-14 by Claude
- **Verdict:** CLOSED (Claude finished the one open item directly rather than sending back)

**What was good (Codex's work):** The whole structure shipped and works -- `links.ts`
RouteRef union + single `url()` emitter, `Link.astro` typed-only anchor, the four
retrofitted pages, and `scripts/check-links.mjs` (trailing-slash + missing-route +
`_redirects`-source guards). Both layer-3 gate failure modes were correctly proven
(non-slash -> exit 1; missing route -> exit 1). Build/check/tests were all green. The
only gap was the no-drift type source.

**Root cause of the one blocker (now resolved):** Codex's read was correct -- in this
Astro 4.16 setup the public `astro:content` types do NOT give narrow ids. The
generated `.astro/astro/content.d.ts` entry maps *do* carry literals
(`slug: "standard-deviation"`, `id: "median"`), but `CollectionEntry<C>` runs them
through Astro's internal `Flatten` helper which collapses `['id']`/`['slug']` to
`string`, and the literal-bearing `ContentEntryMap`/`DataEntryMap` are not exported.
Verified empirically: `const x: ArticleId = 'totally-bogus'` (and the calc/category
equivalents) passed `astro check` when typed off `CollectionEntry` -- no bite. So the
brief's preferred "derive from generated types, no codegen" approach is infeasible
here; that wasn't a Codex mistake.

**Fix Claude applied (keeps both guarantees -- no drift AND real compile bite):**
- Added `scripts/gen-route-ids.mjs` (Node built-ins only, no new dep): reads
  `src/content/{articles,calculators,categories}/**`, strips extensions, and emits
  `src/lib/content-route-ids.ts` with `as const` arrays + literal-union types. Reading
  the collection dirs makes it drift-proof; `as const` gives the literal types Astro's
  public surface won't.
- Repointed `src/lib/links.ts` `ArticleId`/`CalculatorId`/`CategoryId` at those
  generated literal unions (replacing Codex's hand-maintained `content-route-ids.ts`,
  which was the drift risk the brief flagged). Added a comment recording WHY codegen
  was needed (the `Flatten`/non-export finding above).
- Wired it in: `package.json` `build` is now
  `node scripts/gen-route-ids.mjs && astro build && node scripts/check-links.mjs`, plus
  a standalone `gen:routes` script. Codegen runs before every build so the unions can
  never lag content.

**Re-verification (Claude, 2026-06-14):**
- `npx astro check` -> 0 errors / 0 warnings / 0 hints.
- Layer-2 bite re-proven (the thing that previously didn't bite): temporary
  `ArticleId/CalculatorId/CategoryId = 'totally-bogus'` now each throw `ts(2322)`,
  e.g. `Type '"totally-bogus"' is not assignable to type '"standard-deviation"'`,
  `... to type '"standard-deviation" | "median"'`, `... to type '"descriptive-statistics"'`.
  Reverted.
- `npm run build` -> exit 0; codegen logged
  `wrote 1 article, 2 calculator, 1 category ids`; gate logged
  `scanned 4 pages, checked 7 internal links, found 0 violations` + OK. All four
  expected routes built; `dist/calculators/median/index.html` still absent (correct).
- `npm test` -> 12 files / 33 tests pass. `src/calc/**` untouched; no new dependency.

**Generated keys used:** article route id = filename slug (extension stripped);
calculators + categories = filename id. All emitted by the codegen, not hand-listed.

**Follow-up -- RESOLVED (Claude, 2026-06-14):** Decided to **keep
`src/lib/content-route-ids.ts` committed** (not gitignored), and added a `predev`
script so dev refreshes it too (`build` already did). Rationale: (1) a committed file
means a fresh clone's `astro check` + IDE TypeScript work with no postinstall hook
ceremony; (2) staleness is safe + self-correcting -- a missing id makes a *valid* new
link FAIL the check (conservative), it can never let a *bogus* id PASS, and the next
`dev`/`build` regenerates it. Both `npm run dev` and `npm run build` now regenerate it
before running. Note: the file is currently UNTRACKED in git (Codex never `git add`ed
it) and there is no ignore rule -- it just needs to be staged when the TASK-005 changes
are committed.
