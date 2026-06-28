# statohub.com

Statistics education + calculators website. Astro (SSG) + Tailwind + MDX →
Cloudflare Pages. Built from the completed SEO study + content-architecture in
`../Claude_OS/project ideas/statistics-calculator-seo-study/`.

**Authoritative build spec:** [`doc/BUILD-PLAN.md`](doc/BUILD-PLAN.md) — read it first.

---

## What this site is

- ~50 teaching articles + ~23 standalone calculator pages across 7 categories.
- Wedge: deep calculator **+** teaching on the same page (no incumbent does both).
- Built bottom-up: KD 0–5 content first, pillars (KD 22–56) later.

## Non-negotiable rules (full detail in BUILD-PLAN.md)

- **Flat trailing-slash URLs.** `/{slug}/` for articles (no category in path),
  `/{category}/` hubs, `/calculators/{tool}/`. Every URL ends in `/`.
- **Zero internal redirects / 404s**, enforced at build time via `src/lib/links.ts`
  (typed route registry) + `scripts/check-links.mjs` (build gate).
- **No odds calculators.** `/calculators/betting-odds/` and `/calculators/odds/`
  are removed entirely. Educational `/calculators/probability/` stays.
- **Stack lock:** Wrangler v3 (Node 20.8.0 breaks v4); uPlot lazy-loaded; MDX.

## Working model

- **Codex builds to spec; Claude writes content + sets SEO rules + reviews.**
  Tasks flow through [`handoff/`](handoff/) (5-state loop). One agent on the repo
  at a time. This `CLAUDE.md` log has one writer: Claude. See
  `../Claude_OS/CODEX-WORKFLOW.md`.

## Internal linking & related-link standard (every page, now + future)

Established 2026-06-26; implemented via `handoff/TASK-017`. All future calculator
pages and articles MUST follow this:

- **Related-calculators sidebar.** Every standalone `/calculators/{slug}/` page
  carries an auto-derived "Related calculators" sidebar (same-category calculators
  first, then filled to N) built from the `calculators` collection via
  `src/lib/related-calculators.ts`. It is data-driven, so existing pages get it
  automatically and **future calculators inherit it with no per-page work** — never
  hand-maintain related lists.
- **Contextual internal links in prose.** Teaching blocks and articles should weave
  contextual internal links where naturally relevant — always through the typed
  `routes` / `url()` / `<Link>` registry (`src/lib/links.ts`), never a raw `<a>` to
  an internal page (the `check-links` gate fails those).
- **Related-link callout (`<RelatedLink>`).** Use `src/components/RelatedLink.astro`
  for the inline "related link" line (the blue accent-bar callout). The intro phrase
  **must vary** — pull from the approved pool: "Worth reading next", "On a related
  note", "You may also find this useful", "For a related calculation", "Another
  helpful calculator is", "See also". Never repeat the same phrase twice on one page.
- **Retrofit ownership.** Codex builds the components + sidebar + one demo usage.
  **Claude** retrofits the contextual links + varied `<RelatedLink>` callouts into the
  existing teaching-block MDX during content sessions (editorial: right target +
  natural phrasing).
- **Combined legal page** lives at `/privacy-cookie-policy/` (Cookie + Privacy in one
  page), linked from the footer "Site" column.

## ✅ LIVE — build pipeline complete (2026-06-14)

The full build plan (TASK-001 → TASK-007) is **done** and the skeleton site is
**live on the custom domain https://statohub.com** (home + calculators; articles
follow). Cloudflare Pages project `statohub` is registered (production branch
`main`); `statohub.pages.dev` remains the deploy alias.

**Custom domain — DONE (2026-06-14):** `statohub.com` + `www` attached to the
Pages project via the Cloudflare dashboard (auto-created proxied CNAMEs →
`statohub.pages.dev`, SSL active). Apex is canonical; a zone Redirect Rule does a
single `www → https://statohub.com/` **301** (preserves path + query). Verified
live: apex trailing-slash 200s, odds/betting-odds/unmatched → 404, sitemap
slash-only on the apex host.

**CI/CD — DONE (2026-06-14):** push-to-deploy via GitHub Actions
([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)), **not** native
Cloudflare Git integration (that would force recreating the Direct Upload project
and re-attaching the domain). Every push to `main` runs the full gate suite
(`astro check` → `vitest` → `npm run build`, which includes the link gate) and
only then `wrangler@3 pages deploy dist --project-name statohub`. A push that
fails any gate cannot ship. Auth = repo secret `CLOUDFLARE_API_TOKEN` (scoped
**Account · Cloudflare Pages · Edit**, `cfut_…` token); account id hardcoded in
the workflow (not a credential). First fully-green run verified live.

**Remaining follow-ups (not blocking, their own tasks):**
1. **SEO baselines.** Capture the `seo-drift` baseline + `seo-technical`
   mobile/CWV pass against the now-live URL.
2. **Category hubs `/{category}/`** — must fold into the existing root
   `src/pages/[slug]/index.astro` route (Astro allows only one root `[slug]`).
   Then write + ship the 4–5 launch articles. (A5 `ArticleLayout` + flat
   `/{slug}/` article routes shipped via TASK-008, 2026-06-14.)

## Maintenance convention

At the end of each session, append a dated entry to the Session log below.

## Session log

- **2026-06-28 (calc-prose SESSION 5)** — **Published 3 more calculator teaching
  blocks — `sample-size`, `t-test`, `t-table` — via the SESSION-PLAN manual procedure.
  22 of 25 done, 3 remaining.** First reconciled state: `git fetch` then counted against
  `origin/main` (local == origin, 0/0) — confirmed **Session 4 (correlation-coefficient/
  linear-regression/confidence-interval) was already published** (19 MDX files on origin,
  QUEUE rows 17–19 `done`), even though the CLAUDE.md main log only recorded through S3;
  the SESSION-PLAN progress log carried the S4 detail. So the true next batch was **Session
  5 = rows 20–22**. Wrote each block **inline** (short ~430-word teaching blocks), each from
  a worked example **computed from the real engine** via a throwaway vitest harness (deleted
  after): **sample-size** level 0.95 / margin 0.05 / p 0.5 → z ≈ 1.95996, nRaw ≈ 384.15 →
  required n = **385** (`sample-size.ts` + `zCritical`); **t-test** mean 105 / μ0 100 / sd 15
  / n 25 → SE 3, t ≈ **1.667**, df 24, two-tailed p ≈ **0.109** (`t-test.ts` + `studentTCdf`);
  **t-table** df 10 / 95% / two-tailed → critical t ≈ **2.228**, alpha 0.05 (`t-table.ts` +
  `tCritical`). External links curl-verified 200: NIST prc222 (*sample sizes required*) for
  sample-size; OpenStax Intro Stats 2e §8.2 (*single mean, Student t*) for t-test; NIST
  eda3672 (*critical values of the Student's t distribution*) for t-table. Each `<RelatedLink>`
  callout uses a distinct intro from the approved pool (no repeats on a page) and links only
  through typed `routes.calculator(...)`. Build gate green: **astro check 0/0/0, 56 pages,
  0 link violations** (page count unchanged — these render on existing `/calculators/<slug>/`
  pages; the link gate checked 2062 internal links). Flipped all 3 to `draft:false`, marked
  QUEUE rows 20–22 `done`, logged S5 in SESSION-PLAN. Staged ONLY the 3 new MDX + QUEUE.md +
  SESSION-PLAN.md (left the untracked root `statohub_27-jun-2026_…broken…csv` untouched),
  committed `20b8c7f`, pushed → Actions run `28332811351` **success** incl. Cloudflare deploy
  → all 3 pages verified live (HTTP 200, teaching block rendered). **STATE: 22 of 25 calc
  teaching blocks done, 3 remaining.** **>> NEXT = SESSION 6 (final calc-prose batch) <<**
  `p-value`, `chi-square`, `proportion` (QUEUE rows 23–25); same procedure in
  [`content-ops/calc-prose/SESSION-PLAN.md`](content-ops/calc-prose/SESSION-PLAN.md). (Article
  routines remain PAUSED from TASK-018; the theme refresh TASK-019→021 is shipped live.)

- **2026-06-27 (THEME REFRESH reviewed -> all 3 tasks CLOSED + shipped live)** —
  **Codex returned TASK-019/020/021 all `DONE`; reviewed each against the real
  artifacts (not just Work Logs), set all three `CLOSED` with Reviews, then committed
  the whole redesign as one commit and pushed to `main` -> Actions gate suite ->
  Cloudflare deploy.** Independent verification re-ran the three gates from a clean
  tree: **astro check 0/0/0, npm test 89/89, npm run build 56 pages / 0 link
  violations.** **TASK-019 (foundation):** `package.json` shows `@fontsource/newsreader`
  + no `@fontsource/fraunces`; `global.css` imports Newsreader 400/500/600/400i/500i and
  sets `--serif`; the **token-rename grep gate returns NOTHING** under `src/` (no orphaned
  `--verm`/`--teal`/`--ink-soft`/`--muted` or old Tailwind utilities); dark mode still
  `html.dark` + localStorage `'theme'` + no-flash inline script (no `data-theme` leakage in
  built HTML). **TASK-020 (home+article):** built `dist/index.html` has the new
  hero/catalog/band/recent layout and -- per the locked decision -- **NO live StatCalc**
  (data-statcalc count 0; static `.hero-fig` SVG instead); the article `.fuse` card embeds
  the **REAL** StatCalc (`dist/frequency-table/index.html` carries data-statcalc /
  data-config-id / data-statcalc-results / the application/json config block, not the
  mockup demo JS); no `data-go` router anchors; all links typed. **TASK-021 (calculator,
  highest-care):** every byte-stable StatCalc hook survives in `StatCalc.astro` (root
  id/data-statcalc/data-config-id/aria-labelledby, data-statcalc-form,
  data-statcalc-results w/ aria-live="polite", data-statcalc-chart, the
  `<script type="application/json" id={configId}>` block, `import './statcalc/client.ts'`)
  with the `.panel`/`.panel-top`/`.panel-grid` chrome wrapping AROUND them; **`git diff` over
  `client.ts`, `format.ts`, and `src/calc/` is EMPTY** -- pure restyle. Accepted the
  Codex `AGENTS.md` work-history append (its standing convention). **Archived the mockup**
  `statohub-theme-preview.html` (untracked root) -> `doc/statohub-theme-preview.html` per
  the plan. **Committed + pushed the full redesign (TASK-019->021 together).** Routines
  remain PAUSED (unchanged from TASK-018). **>> NEXT SESSION <<** verify the Actions run
  went green + Cloudflare deploy live, then spot-check `/`, an article, and a calculator
  page on production for the new theme (Newsreader serif, clay/pine palette, dark toggle
  no-flash, StatCalc still computes); then resume the paused work (callout automation /
  re-enabling article routines per the TASK-018 plan).

- **2026-06-27 (THEME REFRESH planned + 3 Codex briefs queued; Codex executing)** —
  **Reviewed the user's new theme mockup, then planned + wrote three sequenced Codex
  briefs (TASK-019/020/021) to re-skin the whole site to it. Did NOT touch any source
  files this session -- this was review + brief authoring only. Codex is now executing
  TASK-019; the user is ending this session and will return in a NEW chat once Codex
  confirms DONE, for Claude to review + commit.** Input: the user saved a new full-page
  design mockup at repo root `statohub-theme-preview.html` (628 lines; `:root` light
  tokens + `html[data-theme="dark"]` dark tokens; three views -- `#view-home`,
  `#view-article`, `#view-calc` -- plus `.topbar` + `.foot`). New palette renames the
  brand colors: verm->**clay** `#A6492F`, teal->**pine** `#0E6E64`, ink-soft->**ink-2**,
  muted->**ink-3**, adds **brass** `#9C7C3A` + **focus**; serif font Fraunces ->
  **Newsreader**; maxw 1140->1240; flourishes = hero `.hero-fig` SVG normal-distribution
  figure, `h2::before` "section-marker", drop cap `.drop`, `.note` callout, `table.dt`,
  `.fuse` fused teach->compute card, sticky `.toc` scroll-spy, calc `.panel` two-col
  in/out + `.scard` stat cards. **Established this is a RESTYLE, not a rebuild** --
  routes, content collections, the typed-link gate, the StatCalc byte-stable DOM hooks,
  and the dark-mode mechanism all SURVIVE; only tokens/fonts/component CSS + markup
  enrichments change. **3 product decisions locked with the user (all via
  AskUserQuestion, all "Recommended"):** (1) full faithful port across all 3 page types;
  (2) adopt Newsreader (visible brand change, accepted); (3) keep the proven internals --
  **`.dark` class** (NOT the mockup's `data-theme`), self-hosted **@fontsource** (NOT the
  Google Fonts CDN link), and **rename tokens to the mockup's semantic names** in code so
  spec + code stay aligned. **(4) Homepage live calculator REMOVED (user-confirmed):** the
  current home embeds a real StandardDeviation `<StatCalc>`; the mockup home uses a static
  `.hero-fig` SVG figure with NO live calculator -- user explicitly confirmed "keep static
  SVG distribution figure, does not embed a live calculator." The live wedge is still shown
  in the ARTICLE `.fuse` card + on calculator pages, so it is not lost. **Split into 3
  tasks (mirroring the proven TASK-009/010 split), one foundation first:**
  **`handoff/TASK-019-theme-refresh-foundation-chrome.md`** (FOUNDATION: swap font dep
  add `@fontsource/newsreader` 400/500/600 + 400i/500i, remove `@fontsource/fraunces`,
  `npm install`; replace the `global.css` token block per a full rename table; translate
  mockup `html[data-theme="dark"]` -> `html.dark`; drive sun/moon swap from `.dark`;
  update `tailwind.config.cjs` color keys; **repo-wide mechanical rename of every old-token
  Tailwind utility** with an exhaustive grep gate -- because a Tailwind class referencing a
  removed color silently produces NO style, not a build error; restyle top bar [OMIT the
  decorative search box -- no search endpoint] + footer + `.btn-pine`/`.btn-ghost` +
  `.eyebrow`/`.pill`/`.divider`; KEEP all existing page-component classes intact so the
  site stays coherent between tasks. Grep DoD must return nothing:
  `grep -rEn "(--verm|--teal|--ink-soft|--muted|\b(text|bg|border|fill|stroke|ring|from|to|via)-(verm|teal|ink-soft|muted)\b)" src/`).
  **`handoff/TASK-020-theme-home-article-views.md`** (HOME + ARTICLE restyle: home hero =
  static `.hero-fig` SVG + `.wedge-chips` [NO live calc]; catalog/band/pub link only to
  real existing pages via typed links; ARTICLE drop cap + section markers + note + `table.dt`
  + the `.fuse` card embedding the **REAL** `<StatCalc variant="embed">` [NOT the mockup's
  demo `compute()` JS]; TOC driven by the real `entry.render().headings` depth===2 [NOT the
  mockup's static list]; breadcrumb stays a typed `categoryHub()` link; do NOT port the
  mockup's `data-go` view-router anchors). **`handoff/TASK-021-theme-calculator-view.md`**
  (highest-care: restyle `StatCalc.astro` `variant="page"` into the `.panel` two-col in/out
  + `.scard` look + `.calc-hero`/`.howto`/`.side-card` related sidebar, WITHOUT changing the
  **byte-stable hooks** [`data-statcalc`, `data-config-id`, instance `id`/`aria-labelledby`,
  `data-statcalc-form`, `data-statcalc-results` w/ `aria-live="polite"`, `data-statcalc-chart`,
  the `<script type="application/json" id={configId}>` block, `import './statcalc/client.ts'`];
  do NOT edit `client.ts`/`format.ts` or any engine/config; map the generic config-driven
  outputs onto stat cards/table -- do NOT hardcode the mockup's frequency-table layout; keep
  `getRelatedCalculators` logic, restyle only). All three are plain-ASCII from the template,
  status TODO except **TASK-019 now IN_PROGRESS (Codex picked it up)**. DoD on each = `astro
  check` 0/0/0 + `npm test` green + `npm run build` `check-links` 0 violations + manual
  preview + (019) the grep gate + (020/021) confirm the real StatCalc hooks survive.
  **>> NEXT SESSION (new chat, after Codex confirms) <<** Review each DONE task against its
  DoD on the REAL artifacts (re-run the three gates; for 019 run the grep gate; for 020/021
  inspect the rendered StatCalc DOM for the byte-stable hooks + JSON config block + confirm
  `client.ts` untouched; confirm dark-mode no-flash still works + Newsreader renders), set
  each `CLOSED` + write its Review, then **commit the whole redesign (TASK-019->021 together)
  and push to `main`** -> Actions gate suite -> Cloudflare deploy. Leave
  `statohub-theme-preview.html` (untracked at root) in place until the redesign is closed;
  archive it to `doc/` afterward. (Routines remain PAUSED from TASK-018 -- unrelated to this;
  do not re-enable here.)

- **2026-06-26 (TASK-018 woven callouts + AUTOMATION decided + ROUTINES PAUSED)** —
  **Authored the editorial link-map brief that fixes the "one link dumped at the end"
  problem, decided to make callouts automatic for all FUTURE content, and PAUSED the two
  statohub cloud routines until that automation lands.** Context: the user disliked that
  the earlier internal-linking pass (TASK-017) put a single `<RelatedLink>` at the END of
  each page (e.g. `/frequency-table/`); they want **3-4 callouts woven through articles
  (after every 2-3 paragraphs) and 1-2 per calc block**, styled like the blue callout in
  their reference images. **(1) ONE-TIME RETROFIT — `handoff/TASK-018-weave-related-link-callouts.md`
  (status TODO, Codex executing now):** a pure-INSERTION brief — Claude authored the exact
  deterministic link-map (every target a real built page, intros varied per page via the
  approved pool, anchors confirmed pure-ASCII + unique so Codex's apply_patch can't break),
  Codex only inserts the `<RelatedLink>` JSX + idempotent imports; ~70 callouts across 40
  files (21 articles x 3-4, 19 calc blocks x 2 above `## Worked example` + `## Frequently
  asked questions`; standard-deviation calc block: remove the trailing demo first). DoD =
  astro check 0/0/0 + npm test + build `check-links` "0 violations" + spot-checks; no
  commit/push; don't edit CLAUDE.md. **(2) FUTURE = AUTOMATED (the real decision this
  session):** manual insertion does NOT scale, so going forward callouts become a **layout
  behavior fed by data**, exactly like the existing data-driven "Related calculators"
  sidebar (`related-calculators.ts`) — NOT hand-inserted per page, and NOT a human review
  gate (nothing waits on the user; articles still auto-publish). Two viable shapes, decided
  to implement next session: **(A) hybrid (preferred)** — the `stats-article-writer` agent
  fills a `related:` slug list in frontmatter at draft time (judgment it already does for
  inline links), and `ArticleLayout` auto-distributes `<RelatedLink>` callouts across the
  H2 section boundaries with rotating intros; **(B) fully automatic** — layout derives
  targets purely from `category`/`related` data with zero authoring (drops hand-pick
  ability). **>> NEXT SESSION (do this BEFORE re-enabling routines) <<** wire the automation:
  add a layout/remark-level callout distributor that reads `related:`/`category` and renders
  woven `<RelatedLink>`s (reuse the approved intro pool + typed `routes`/`url()` so the
  `check-links` gate still bites); update the WRITE step so new content ships callouts as
  part of authoring — `content-ops/cloud-routine/publish-next-article.md`,
  `.claude/agents/stats-article-writer.md`, `.claude/seo-playbook.md` (article tier), and
  the calc `content-ops/calc-prose/SESSION-PLAN.md`; optionally extend the QA gate to
  WARN when a page has < N internal callouts. Then add the one-line CLAUDE.md "Internal
  linking & related-link standard" update (callouts woven 3-4/article, 1-2/calc block,
  never dumped at the end, generated from data not hand-inserted). **(3) ROUTINES PAUSED
  (reversible) so no new page publishes WITHOUT the woven callouts in the interim:** set
  `enabled:false` on BOTH statohub article routines via RemoteTrigger — `trig_01DhQoEV3sRaKynzFC88xTzh`
  ("statohub publish 03:00 Malta", `0 1 * * *`) and `trig_011bnYzdcX76mXawduUgnHnP`
  ("statohub publish 23:45 Malta", `45 21 * * *`). The calc-prose routine
  (`trig_01M1XqCSGchNEjJsKjJG3hix`) was already disabled. **Re-enable all of these only
  AFTER the callout automation ships** (flip the two article triggers back to
  `enabled:true`; calc-prose stays manual per the existing SESSION-PLAN). The devnook
  routines are SEPARATE and were left untouched. **Codex is meanwhile executing TASK-018.**

- **2026-06-26 (TASK-017 brief — internal linking + legal page)** — **Planned +
  delegated the internal-linking layer and a combined legal page to Codex; documented
  the new standard in CLAUDE.md. Did NOT write any calculator pages this session (that
  is the NEXT session).** The user wants three implementation features built before the
  next calc-prose writing session: (1) a single combined **Cookie + Privacy Policy**
  page (one page, not two); (2) **internal linking on calculator pages** — a "Related
  calculators" sidebar on every `/calculators/{slug}/` page that existing pages get and
  future pages inherit automatically; (3) a reusable **related-link callout** (the blue
  "Worth reading next: ..." box from the user's reference images) whose intro phrase
  **varies naturally** (no repeated wording). Reviewed the repo to ground the brief:
  calculator route `src/pages/calculators/[slug]/index.astro` (BaseLayout + max-w-3xl, no
  sidebar today), the typed link registry `src/lib/links.ts` (all internal hrefs via
  `routes`/`url()`/`<Link>`; new page = new `RouteRef` kind), the `check-links.mjs` gate,
  the `.article-shell`/`.article-rail`/`.related-card` pattern in `ArticleLayout.astro`
  (reuse for the sidebar), the per-calc `category:` field (29 calcs across 6 categories),
  and the footer "Site" column in `BaseLayout.astro`. **Wrote
  [`handoff/TASK-017-internal-linking-legal-page.md`](handoff/TASK-017-internal-linking-legal-page.md)
  (status TODO)** — one brief, three scoped parts: **A** combined legal page
  (`src/pages/privacy-cookie-policy/index.astro` modeled on About + new
  `privacyCookiePolicy` route + footer link; Codex drafts the copy from a supplied
  outline; contact left as a greppable placeholder for Claude); **B** auto-derived
  "Related calculators" sidebar via a pure `src/lib/related-calculators.ts`
  (same-category-first, N=5, never self) + a 2-col restructure of the calc page reusing
  the article-rail CSS; **C** a `<RelatedLink>` callout component + deterministic
  varied-intro picker (approved phrase pool) + ONE demo usage on standard-deviation,
  Claude retrofits the rest. **Three decisions locked with the user:** Codex drafts the
  legal copy itself; sidebar auto-derives from `category`; Claude (not Codex) retrofits
  contextual links + callouts into existing teaching MDX in content sessions. **Updated
  CLAUDE.md:** added the standing "Internal linking & related-link standard" section
  (above) so all future pages comply. **Wrote the Codex kickoff prompt** (handed to the
  user; points Codex at `handoff/TASK-017-...md`). **Follow-up owed by Claude:** mirror
  the related-link standard into the calc-prose `SESSION-PLAN.md` /
  `publish-next-calc-prose.md` so the writing procedure enforces it. **>> NEXT SESSION
  <<** Codex executes TASK-017 in parallel; Claude writes calc-prose **SESSION 4**
  (`correlation-coefficient`, `linear-regression`, `confidence-interval`, QUEUE rows
  17–19) per [`content-ops/calc-prose/SESSION-PLAN.md`](content-ops/calc-prose/SESSION-PLAN.md),
  then reviews TASK-017 against its DoD (re-run the three gates; confirm legal page +
  sidebar + callout) and CLOSEs it.

- **2026-06-26 (calc-prose SESSION 3)** — **Published 3 more calculator teaching
  blocks — `binomial-distribution`, `combination`, `factorial` — via the SESSION-PLAN
  manual procedure. 16 of 25 done, 9 remaining.** Ran the documented per-session
  procedure: `git fetch` then `git pull --rebase` (local was 4 commits behind
  `origin/main` — two `[cloud-routine]` ARTICLE publishes, `test-statistic` +
  `probability-formula`; those are the SEPARATE still-active article routines, not
  calc-prose); rebased clean to `09a956f` = true baseline 13/25. Wrote each block
  **inline** (not via subagents this session — these are short ~280–400-word blocks and
  I had all inputs; faster + full control), each from a worked example pre-computed from
  the real engine in `src/calc/<slug>.ts`: **binomial-distribution** n=10/p=0.5/k=5 mode
  *exactly* → C(10,5)=252, 252×0.5¹⁰ = 252/1024 = **0.2461** (via `binomial.ts` +
  `combinatorics-core.ts`); **combination** n=10/r=3 *nCr* → **120** (formula
  10!/(3!·7!) = 720/6; nPr=720, 6× larger); **factorial** n=5 → 5! = **120**. Confirmed
  all 3 YAMLs `standalone: true`. External links curl-verified 200: NIST eda366
  (binomial distribution) for binomial; OpenStax College Algebra 2e §9.5 *Counting
  Principles* for combination + factorial (NIST DADS dictionary pages 403'd → avoided;
  OpenStax 9.5 covers permutations/combinations/factorial). Ran the light QA gate (all 3
  **PASS** — 0 hard fails / 0 warnings; 402/380/283 words), flipped `draft:false`, marked
  QUEUE rows 14–16 `done` + logged SESSION-PLAN Session 3, build gate green (**astro check
  0/0/0, 55 pages, 0 link violations** — page count 53→55 reflects the 2 new cloud-routine
  articles, not calc blocks, which render on existing `/calculators/<slug>/` pages). Staged
  ONLY the 3 new MDX + QUEUE.md + SESSION-PLAN.md (left the regenerated CRLF-only
  `content-route-ids.ts` + the user's in-progress doc restructure untouched), committed
  `3db7f9d`, pushed → Actions run `28219513115` fully green incl. Cloudflare deploy → all
  3 pages verified live (HTTP 200, FAQ block present). **STATE: 16 of 25 calc teaching
  blocks done, 9 remaining.** **>> NEXT = SESSION 4 <<** `correlation-coefficient`,
  `linear-regression`, `confidence-interval` (QUEUE rows 17–19); same procedure in
  [`content-ops/calc-prose/SESSION-PLAN.md`](content-ops/calc-prose/SESSION-PLAN.md).
  **Remaining session map:** S5 sample-size/t-test/t-table, S6 p-value/chi-square/proportion.

- **2026-06-25 (calc-prose SESSION 2)** — **Published 3 more calculator teaching
  blocks — `z-table`, `normal-distribution`, `probability` — via the SESSION-PLAN
  manual procedure. 13 of 25 done, 12 remaining.** Ran the documented per-session
  procedure exactly: `git fetch` + confirmed local == `origin/main` @ `baf2d54` (true
  baseline 10/25 — counted against origin, not the local tree, per the SESSION 1
  lesson). Wrote each block via 3 parallel `general-purpose` subagents (NOT
  `stats-article-writer`; these are short ~300–700-word blocks), each handed a worked
  example pre-computed from the real engine in `src/calc/<slug>.ts` so the prose matches
  the live tool: **z-table** z=1.96 → cumulative 0.9750 / right-tail 0.0250 / between-0-
  and-z 0.4750 (via `normalCdf`); **normal-distribution** mean=100, sd=15, x=130, mode
  P(X<x) → z=2, P=0.9772; **probability** 3 favorable / 10 total → 0.30, complement 0.70.
  Reviewed all 3, ran the light QA gate (all PASS — 0 hard fails / 0 warnings; 444/500/399
  words), curl-verified both distinct NIST links 200 (eda3661 normal dist + eda36
  probability distributions), flipped `draft:false`, marked QUEUE rows 11–13 `done`,
  build gate green (**astro check 0/0/0, 53 pages, 0 link violations** — page count
  unchanged since these render on existing `/calculators/<slug>/` pages). Staged ONLY the
  3 new MDX + QUEUE.md (left the user's in-progress doc restructure untouched), committed
  `1ab0a76`, pushed → Actions run `28188634889` fully green incl. Cloudflare deploy → all
  3 pages verified live (HTTP 200, FAQ block present). Logged progress in SESSION-PLAN
  (commit `a82903b`). **STATE: 13 of 25 calc teaching blocks done, 12 remaining.**
  **>> NEXT = SESSION 3 <<** `binomial-distribution`, `combination`, `factorial`
  (QUEUE rows 14–16); same procedure in
  [`content-ops/calc-prose/SESSION-PLAN.md`](content-ops/calc-prose/SESSION-PLAN.md).
  **Remaining session map:** S4 correlation-coefficient/linear-regression/confidence-
  interval, S5 sample-size/t-test/t-table, S6 p-value/chi-square/proportion.

- **2026-06-25 (calc-prose → manual sessions)** — **Switched the calculator
  teaching-block backlog from the 1/day cloud routine to manual active-session writing
  (3 pages/session); disabled the routine; SESSION 1 PUBLISHED LIVE.** The user wanted
  to finish faster than 1/day, so we stopped draining the queue via the cloud routine
  and now write **3 calc teaching blocks per active session** by hand.
  **Routine DISABLED (reversible):** `trig_01M1XqCSGchNEjJsKjJG3hix` ("statohub
  calc-prose 06:00 Malta", cron `0 4 * * *`) set `enabled: false` via RemoteTrigger —
  **not deleted**; re-enable it if ever reverting to hands-off draining. Keep it OFF
  while manual sessions run so the two don't pick the same slug. **(The article
  publishing routines are SEPARATE and STILL ACTIVE — untouched.)**
  **Plan saved:** [`content-ops/calc-prose/SESSION-PLAN.md`](content-ops/calc-prose/SESSION-PLAN.md)
  has the full cadence, per-session procedure, and hard rules. **CORRECTED A STALE-TREE
  COUNTING BUG:** the local working tree was **26 commits behind `origin/main`** (the
  cloud routine pushes straight to origin from its sandbox), so my first read of "3 of
  25 done" was wrong — the routine had ALREADY shipped variance/range/percentile/
  weighted-average. True baseline was **7 of 25**. My first subagent batch
  (variance/range/percentile) were duplicates → discarded; synced to origin without
  disturbing the user's unrelated in-progress doc restructure. **LESSON (now in
  [[monitor-cloud-routine-publishing]] + SESSION-PLAN): always count done/pending against
  `origin/main` after `git fetch`, never the local tree.**
  **SESSION 1 DONE (this session):** wrote teaching blocks for **`mean-absolute-deviation`,
  `frequency-table`, `z-score`** via 3 parallel `general-purpose` subagents (NOT
  `stats-article-writer` — that targets 2000-word articles; these are short ~300–700-word
  blocks). Each subagent got a worked example pre-computed from the real engine in
  `src/calc/<slug>.ts` so the prose matches the live tool: MAD `2,4,6,8`→mean 5→MAD 2;
  frequency-table `1,2,2,3,3,3,3,4,4,5` (n=10, relative 0.1/0.2/0.4/0.2/0.1) rendered as
  a Markdown table; z-score x=72,mean=68,sd=5→0.8. Reviewed all 3, ran the light QA gate
  (all PASS, 0 hard fails), curl-verified the 3 NIST links 200, flipped `draft:false`,
  build gate green (**astro check 0/0/0, 53 pages, 0 link violations**), marked QUEUE
  rows 8–10 `done`, staged ONLY the 5 feature files, committed `baf2d54`, pushed →
  Actions run `28188047475` fully green (incl. Cloudflare deploy) → all 3 pages verified
  live (HTTP 200, FAQ block present). **STATE: 10 of 25 calc teaching blocks done, 15
  remaining.**
  **>> NEXT SESSION = SESSION 2 <<** Just run the SESSION-PLAN procedure for the next 3
  pending slugs: **`z-table`, `normal-distribution`, `probability`** (queue rows 11–13;
  keywords in [`content-ops/calc-prose/QUEUE.md`](content-ops/calc-prose/QUEUE.md)).
  Procedure is fully documented in SESSION-PLAN.md §"Per-session procedure": `git fetch`
  + confirm against `origin/main` → 3 parallel `general-purpose` subagents writing
  `src/content/calculator-content/<slug>.mdx` as `draft:true` (each following
  [`content-ops/cloud-routine/publish-next-calc-prose.md`](content-ops/cloud-routine/publish-next-calc-prose.md)
  Steps 2–3 + the gold-standard pilot `src/content/calculator-content/standard-deviation.mdx`,
  each handed a worked example pre-computed from `src/calc/<slug>.ts`) → review → light
  QA gate + broken-link curl → flip `draft:false` → `npx astro check` + `npm run build`
  → mark QUEUE rows `done` → stage only the new MDX + QUEUE.md → one commit → push →
  confirm Actions green + one page live. **Remaining session map:** S2 z-table/
  normal-distribution/probability, S3 binomial-distribution/combination/factorial, S4
  correlation-coefficient/linear-regression/confidence-interval, S5 sample-size/t-test/
  t-table, S6 p-value/chi-square/proportion.

- **2026-06-20 (calculator prose)** — **Stood up the calculator teaching-block pipeline
  + published the first two blocks (standard-deviation pilot + mean); a daily 06:00-Malta
  cloud routine now drains the rest one calc/day.** This executes the deferred
  calculator-page prose SEO pass (the "only major SEO item left" from this morning's
  entry) per the user's 3-step plan. **Content model settled:** each standalone
  `/calculators/{slug}/` page gets its OWN short teaching block (lead + `## How to use`
  + `## Worked example` + `## Frequently asked questions`) rendered BELOW the tool — NOT
  a pointer to the article — kept short (~300-700 words) so it complements rather than
  duplicates the full `/{slug}/` articles. **Infra (committed `5869c0c`):** new
  `calculator-content` MDX collection in [`src/content/config.ts`](src/content/config.ts)
  (one file per calc slug; `draft:true` until gated; page title stays the only H1 so the
  body starts at H2), [`calculators/[slug]/index.astro`](src/pages/calculators/[slug]/index.astro)
  renders the matching published block in `.article-prose` with a `.calc-teaching`
  separator, plus the human-authored gold-standard pilot
  [`standard-deviation.mdx`](src/content/calculator-content/standard-deviation.mdx).
  **Lighter validation TIER (no 2000-word floor):** a self-contained cloud routine
  [`content-ops/cloud-routine/publish-next-calc-prose.md`](content-ops/cloud-routine/publish-next-calc-prose.md)
  whose hard gate is only — no body H1, ≥2 H2 sections, primary keyword present, ~≥200
  words, no LaTeX, ≥1 authoritative external link with a descriptive anchor (curl-checked,
  4xx/5xx = hard fail), internal links only `/calculators/` or `/` — then the REAL build
  gate (`astro check` + `npm run build` incl. link gate). It picks the next pending slug
  from [`content-ops/calc-prose/QUEUE.md`](content-ops/calc-prose/QUEUE.md) (all **25
  standalone** calcs in publish order with primary + supporting keywords), defers safely
  (keeps `draft:true`) on failure. **Scheduling:** ONE recurring `RemoteTrigger`
  (`trig_01M1XqCSGchNEjJsKjJG3hix`, cron `0 4 * * *` = **06:00 Malta**, next run
  2026-06-21T04:01:56Z) drains the queue 1/day and no-ops when empty (~25 days out, before
  the Oct DST change so fixed UTC is safe). **Test run fired now → it correctly DEFERRED
  `mean`** because the cloud writer cited a Penn State deep URL
  (`online.stat.psu.edu/stat500/lesson/2/2.2`) that **404s** — the broken-link gate caught
  it and refused to ship a dead link (gate working as designed, not a bug). **Fixed both
  halves (commit `4e9bf8e`, live + verified):** (1) replaced the dead link with the
  verified NIST e-Handbook *measures of location* page (`eda351.htm`, 200), flipped
  `mean.mdx` to published, marked the queue done; (2) **hardened the routine** with a
  curated, all-HTTP-200-verified authoritative link **allowlist** (NIST e-Handbook
  sections for mean/sd/histogram/normal/CI/correlation/regression/hypothesis-tests +
  OpenStax measures-of-center) so the writer stops guessing fragile deep URLs. Local gates
  green (astro check 0/0/0, build 42 pages / **0 link violations**), pushed (rebased over
  two interleaved `[cloud-routine]` log commits), Actions run 27869304497 green →
  Cloudflare; **verified live:** `https://statohub.com/calculators/mean/` 200 with the
  teaching block, How-to, FAQ, and working NIST link. **Next:** tomorrow's 06:00 run picks
  `average` (mean now done); spot-check it published green. **Note:** the working tree
  carries an unrelated in-progress doc restructure (deleted BUILD-PLAN/SITE-ARCHITECT/
  CONTENT-WORKFLOW + templates, new `doc/`) — left untouched; I staged only my feature
  files each commit. This session-log append is left uncommitted to avoid entangling it.

- **2026-06-20** — **All 3 Medium technical-SEO fixes shipped to production (commit
  `bc7e8f3`, live + verified); only the calculator-page prose pass remains open.** This
  closes the Medium tier deferred from 2026-06-19. **(a) Security headers** via a new
  Cloudflare Pages [`public/_headers`](public/_headers) file applied edge-wide to `/*`:
  HSTS `max-age=31536000; includeSubDomains; preload`, `X-Frame-Options: SAMEORIGIN`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
  `Cross-Origin-Opener-Policy: same-origin`, and a baseline CSP (`default-src 'self'`;
  `script-src`/`style-src 'self' 'unsafe-inline'` — the site uses `is:inline` theme
  scripts, so a stricter nonce-based CSP is a documented future option, **not** done) →
  lifts Lighthouse Best Practices 77 → ~100. Chose the `_headers` file over the
  dashboard/CLI deliberately: Wrangler can't set these, the OAuth token is `zone (read)`
  only, and CSP/XFO need the file regardless. **(b) Homepage JSON-LD** — added
  `webSiteSchema` + `organizationSchema` helpers to [`src/lib/schema.ts`](src/lib/schema.ts)
  (`WebSite` brand entity + `Organization`, linked via `@id` `#website`/`#organization`;
  Org `logo` = `/apple-touch-icon.png`) and wired them through BaseLayout's `jsonLd` prop
  from [`src/pages/index.astro`](src/pages/index.astro). `sameAs`/social + the WebSite
  `SearchAction` are left empty by design — no on-site search endpoint exists and brand
  social URLs aren't provided yet. **(c) Render-blocking resources — skipped by design**
  (Perf already 100; not worth the churn). Committed `bc7e8f3` + pushed to `main` →
  Actions gate suite green → Cloudflare deploy; verified live on prod. **Backlog still
  open (documented, none urgent):** IndexNow, re-pull CrUX field CWV once GSC shows
  impressions, per-page dynamic OG images, an optional stricter nonce-based CSP, an
  optional brand `sameAs` once social profiles exist. **>> ONLY MAJOR SEO ITEM LEFT <<**
  the **calculator-page prose SEO pass** (the deferred *other half* of the SEO baseline —
  see [[next-session-seo-followups]]): the ~24 standalone `/calculators/{slug}/` pages
  carry the tool but **no teaching prose**, so they're thin for ranking. Plan (3 steps):
  **(1) settle the content model** — does each calc page get its *own* short teaching block
  (intro + how-to + worked example + small FAQ) or lean on the embedded-article-same-page
  wedge (point at the full `/{slug}/` article)? Decide first to avoid thin/duplicate
  overlap with the articles. **(2) build a SEPARATE lighter validation tier** — NO
  2000-word floor (the article gate's thresholds do NOT apply to short calc prose); just
  one H1, primary keyword in `<title>`, a meta description, and ≥1 authoritative external
  link with a descriptive anchor. **(3) write + pilot on `standard-deviation` first**,
  confirm the model + lighter gate feel right, then roll out to all ~24 standalone
  calculators. Purely backlog/optional — nothing is broken, not urgent. **Next session:**
  start at step 1 (settle + recommend the content model), then build the lighter tier,
  then pilot SD.

- **2026-06-19** — **Technical SEO baseline captured on the live URL + all 3 High-priority
  fixes shipped to production.** This closes the carried-over "live-URL technical SEO
  baseline" follow-up (the 2026-06-18 work was the *content/pipeline* baseline; this is
  the *technical* layer). **Baseline:** ran the `seo-technical` audit against
  https://statohub.com via live curl probes + DataForSEO `on_page_instant_pages` (mobile)
  + `on_page_lighthouse` (desktop, JS rendering on); wrote the report to the new
  [`SEO-Audit/technical-seo-baseline-2026-06-19.md`](SEO-Audit/technical-seo-baseline-2026-06-19.md)
  (**score 88/100**; no critical/indexing issues — deductions are off-page polish). Lab
  CWV excellent (LCP 343ms, CLS 0.015, INP-proxy 18ms; Perf 100 / SEO 100 / A11y 94 /
  **BP 77** — the 77 is purely missing security headers). Report carries a category
  breakdown, prioritized findings, and a **drift-baseline snapshot table** for future
  diffing. **Per the user, fixed ONLY the 3 High-priority items this session** (Medium
  deferred to tomorrow): **(1) homepage `<title>`** was bare "Statohub" (8 chars, zero
  keywords) → now `Statohub — Statistics Calculators & Plain-English Lessons` in
  [`src/pages/index.astro`](src/pages/index.astro) (propagates to og:title/twitter:title
  via `Meta.astro`); **(2) favicon** (was 404) → created `public/favicon.svg` (vermillion
  bar-chart glyph), `public/favicon.ico` (multi-size), `public/apple-touch-icon.png`
  (180×180), and added the 3 `<link rel="icon">`/apple-touch tags in
  [`BaseLayout.astro`](src/layouts/BaseLayout.astro) `<head>`; **(3) og:image** (was
  absent, twitter:card was `summary`) → created `public/og-default.png` (1200×630 branded)
  + set `ogImage = '/og-default.png'` as a BaseLayout prop default so it propagates
  site-wide, and `Meta.astro` already auto-switches `twitter:card` →
  `summary_large_image` when an ogImage resolves (no edit needed there). **Committed
  `5e92ac8`** ("seo: fix homepage title, add favicon + default og:image; capture technical
  SEO baseline", 7 files, +163/-2) — deliberately excluded the regenerated
  `src/lib/content-route-ids.ts` (CRLF-only, content-neutral). **Pushed to `main`**
  (`6ae2765..5e92ac8`) → **Actions run 27847196274 green in 47s** (type check → 89 tests →
  build+link gate → Cloudflare deploy; only the harmless Node 20→24 runner-deprecation
  annotation). **Verified live on production:** `/favicon.ico` `/favicon.svg`
  `/apple-touch-icon.png` `/og-default.png` all 200 w/ correct content-types; homepage
  `<title>` updated; `og:image` = `https://statohub.com/og-default.png`; `twitter:card` =
  `summary_large_image`; both favicon `<link>` tags present. **Deferred to tomorrow
  (user's explicit call — Medium fixes):** (a) **security headers** via a Cloudflare Pages
  `_headers` file (HSTS `max-age=31536000; includeSubDomains; preload` + baseline CSP +
  `X-Frame-Options: SAMEORIGIN`) → lifts Best Practices 77 → ~100; (b) **homepage JSON-LD**
  (`WebSite` for sitelinks search box + `Organization` brand entity) via the existing
  `schema.ts` helpers + `JsonLd.astro`; (c) render-blocking resources (cosmetic, Perf
  already 100). **Backlog (documented, not requested):** IndexNow, re-pull CrUX field CWV
  once Search Console shows impressions, per-page dynamic OG images. **Next session:**
  execute the 3 Medium fixes.

- **2026-06-18** — **SEO baseline shipped: tiered article-validation spec wired into
  the whole publishing pipeline + the 4 published articles retrofitted.** Scope was
  **articles only** (calculator-page prose optimization explicitly deferred). Replaced
  the old flat "everything is a hard must" QA model with a **three-tier spec**: **HARD**
  (blocks publish / non-zero exit — objective indexing/accessibility/build breakers:
  exactly one H1, primary keyword in `<title>`, title present + not truncated, meta
  description present, slug contains the primary keyword, **no broken external link**
  via curl, ≥1 authoritative link, ≥2000 words, no LaTeX, typed internal links, no
  fabrication/cannibalization); **WARN** (logged, never blocks — <2 external links,
  primary kw not in first 100 words, generic/bare-URL anchors, heading-level skips,
  heading keyword-stuffing, title/desc length out of ideal range); **ADVISORY** (report
  only — shorter `h1` variation, exact-match kw in H1, link distribution). Plus a YMYL
  **accuracy directive**: verify formulas/distributions/tests/regression/probability
  against authoritative sources *before* writing. **Part A (pipeline) — re-tiered 4
  files:** [`content-ops/cloud-routine/publish-next-article.md`](content-ops/cloud-routine/publish-next-article.md)
  (rewrote Step 4's Python QA gate to collect `hard_fails`/`warnings`/`advisories` and
  exit non-zero only on hard fails, added a curl broken-link check where 4xx/5xx =
  hard fail but unreachable-from-sandbox = warning, demoted external-link-min + kw-in-100w
  to warnings, added bare/generic-anchor + heading-skip + heading-stuffing warnings,
  added kw-in-title/title-len/slug-contains-kw hard checks, and updated Step 3 prose
  rules: descriptive anchors, distribute links, verify-before-writing, optional `h1`),
  [`.claude/seo-playbook.md`](.claude/seo-playbook.md) (new "three tiers" section; §2/§4/§5/§7/§8
  re-tagged `[HARD]`/`[WARN]`/`[ADVISORY]`), and both agents
  ([`stats-article-writer.md`](.claude/agents/stats-article-writer.md) +
  [`stats-article-reviewer.md`](.claude/agents/stats-article-reviewer.md) — reviewer now
  flips CHANGES_REQUESTED **only** on hard fails; WARN/ADVISORY are non-blocking notes).
  **Key matching nuance baked in:** primary-keyword-in-title and slug-contains-keyword
  use **tolerant token matching** (exact phrase OR all significant words), so natural
  variation passes — e.g. title "What Is an Average?" satisfies primary keyword "what
  is the average". Verified the new gate against all 4 published articles: the **only**
  hard fail is the (expected) `draft:true` check; every new hard check passes. **Part B
  — optional H1:** added `h1: z.string().optional()` to the articles schema in
  [`src/content/config.ts`](src/content/config.ts) and wired
  [`ArticleLayout.astro`](src/layouts/ArticleLayout.astro) line 127 to render
  `{article.h1 ?? article.title}` (visible H1 only; `<title>`, breadcrumb, and
  `articleSchema` still use `title`) — fully backward-compatible (built
  correlation page H1 still falls back to the title). **Part C — retrofitted the 4
  published articles** (`git pull --rebase` first; local tree was 4 commits behind —
  the 2 cloud-published articles `correlation-vs-causation` + `what-is-an-average`
  weren't local). **Corrected the user's premise:** all 4 already had ≥1 external link
  (not "missing" as thought) — but **3 of 4 used bare-URL anchors**
  (`[https://…](https://…)`), and **correlation-vs-causation cited the wrong NIST page**
  (`eda333` is actually titled "1.3.3.3. Block Plot" — an off-topic citation the cloud
  routine grabbed by accident, with a fabricated description). So the retrofit was a
  quality pass: fixed all 3 bare anchors to descriptive text, **replaced** the wrong
  Block Plot link with the canonical [ABS — Correlation and causation] gov source,
  relocated `what-is-an-average`'s end-only link into context, and brought **each
  article to the soft target of 2 authoritative links** (added OpenStax open-access
  textbook sections + Penn State STAT 800), **all 8 links curl-verified 200**. Re-ran
  the tiered gate: all 4 now `WARN: NONE`. **Part D — gates green:** `astro check`
  0/0/0, `npm test` **33 files / 89 tests**, `npm run build` **39 pages / 1112 internal
  links / 0 violations**; committed + pushed to `main` (triggers Actions → Cloudflare
  deploy). **Effect:** future auto-published articles are validated by the tiered gate
  (cloud routines read `publish-next-article.md` at run time — no trigger reconfig
  needed); the 4 live articles now have clean, descriptive, dual-source citations.
  **Still owed (carried over):** the `seo-technical` + `seo-drift` baseline capture on
  the live URL (separate from this content/pipeline baseline); a future
  calculator-page-prose SEO pass. **Next session:** verify this push deployed green +
  spot-check a retrofitted article live (e.g. `/correlation-vs-causation/` shows the
  ABS + PSU links); optionally run the live-URL technical SEO baseline.

- **2026-06-17 (evening)** — **Article-publishing engine SCHEDULED: two recurring
  claude.ai cloud routines now drain the queue at 2 articles/day, hands-off.** This
  resumes the paused article backlog via automation rather than manual writing. Built
  on the proven path (the 2026-06-15 one-time TEST routine that published
  `how-to-find-the-range` end-to-end: write → QA gate → build gate → push to `main` →
  Actions → Cloudflare). Created **two recurring `RemoteTrigger` cloud routines** (NOT
  `CronCreate`, which is session-only and dies with the REPL), each running the
  self-contained `content-ops/cloud-routine/publish-next-article.md` against the
  connected `syedjawad11/statohub` repo, model `claude-sonnet-4-6`, tools
  Bash/Read/Write/Edit/Glob/Grep, with the "no fabricated success" prompt (only report
  success after the push SHA is confirmed). **Times set in Malta time** (user is on
  CEST = UTC+2 in June): **23:00 Malta → `0 21 * * *` UTC** (`trig_011bnYzdcX76mXawduUgnHnP`,
  next_run 2026-06-17T21:02:47Z) and **03:00 Malta → `0 1 * * *` UTC**
  (`trig_01DhQoEV3sRaKynzFC88xTzh`, next_run 2026-06-18T01:01:37Z). Both `enabled:true`;
  verified each `next_run_at` lands on the correct UTC hour (21 / 01) — the ~1–2 min
  offset is backend jitter, harmless. **(later, same session) Routine A moved 23:00 →
  23:45 Malta per user** — `update` to `45 21 * * *` (`trig_011bnYzdcX76mXawduUgnHnP`,
  next_run 2026-06-17T21:45:00Z); Routine B unchanged. The routine no-ops cleanly
  (`PUBLISH_RESULT: nothing_to_do`) once the **44 planned** articles drain. Publish
  order (DB: phase → kd_min → volume DESC): **correlation-vs-causation →
  what-is-an-average → linear-regression → …** (already published:
  `standard-deviation-symbol`, `how-to-find-the-range`). **DST caveat (future, not
  blocking):** a fixed-UTC cron drifts when Malta falls back to CET (UTC+1) in late
  Oct 2026 — `45 21`/`0 1` UTC would then be 22:45/02:00 Malta; one-line `update` to
  `45 22`/`0 2` at that point. **Cloudflare token cleanup: DROPPED per user** (tokens
  already rotated/dead — explicitly told to ignore). **SEO baseline: DEFERRED to
  tomorrow** (user low on session usage; better done whole than started + abandoned) —
  still owed: `seo-technical` + `seo-drift` baseline on the live URL. Dormant leftover
  test triggers (`trig_01HuCPCJrcTmtwJzM6gfDqq1` statohub#1, `trig_01632qYF7JLCL7zqPGktmogx`
  devnook — both empty-cron, never fire) left as-is. **Next session:** capture the SEO
  baseline; then verify the first auto-published article (`correlation-vs-causation`)
  went live — confirm the cloud-routine commit on `main`, a green Actions run, and
  `https://statohub.com/correlation-vs-causation/` 200.

- **2026-06-17 (later)** — **Calculator build-out COMPLETE: TASK-012 → TASK-016 all
  reviewed → CLOSED; the entire standalone set committed + pushed in one go (now
  deploying).** This closes the 2026-06-16 strategy pivot — every planned calculator
  is now built. Across this and the prior session, reviewed all five remaining batches
  against artifacts (engines/core modules/configs/tests/gates), not just the Work Logs,
  and set each to `CLOSED`: **TASK-012** (descriptive engines + structured-output
  table/list/text on `CalcResult`), **TASK-013** (combinatorics/probability + the
  `select` input type), **TASK-014** (normal-family calcs + shared pure
  `src/calc/_stats-math.ts` — erf/normalCdf/inverseNormalCdf/zCritical, anchors
  sampleSize=385, zCritical(0.95)≈1.95996), **TASK-015** (correlation + linear
  regression on paired x/y `numberList` inputs via `_regression-core.ts`; corrected
  anchors slope 0.6 / intercept 2.2 / text "y = 2.2 + 0.6x"), **TASK-016** (the final
  inferential batch: p-value, t-test, chi-square, t-table, proportion + the Student-t
  & chi-square distribution math added to `_stats-math.ts` — logGamma/Lanczos,
  regularized incomplete gamma & beta, studentTCdf, chiSquareCdf, tCritical;
  bisection inverse-t). **Caught + steered around the proportion category trap** in
  TASK-016's brief: the seed files proportion under `statistics-basics`, which has NO
  category file (the link gate would fail) → directed Codex to use `foundations`;
  verified the four others use `inferential-statistics`. **TASK-016 verification (this
  session):** purity grep over `src/calc/**` clean; `astro check` 0/0/0; `npm test`
  **33 files / 89 tests**; `npm run build` **37 pages / 1048 internal links / 0
  violations**; all 5 new pages built to `dist/calculators/{p-value,t-test,chi-square,
  t-table,proportion}/`; registry now exposes **26 engines**. **Committed the whole
  TASK-012 → TASK-016 build-out as one commit `70dec83` (75 files, +2994/-25) and
  pushed `29caf40..70dec83` to `main`** (per the standing "commit everything in one go
  once all tasks finish" instruction) → GitHub Actions gate suite → Cloudflare deploy
  in flight. **Calculators: full standalone set now live/deploying (~26 engines, 24+
  standalone pages).** **>> NEXT PHASE <<** the calculator-before-articles pivot is
  satisfied, so the **paused article backlog resumes** (publish order:
  correlation-vs-causation → what-is-an-average → linear-regression). **Still-owed
  follow-ups carried over:** SEO baselines on the live URL; rotate the `cfut_…`
  Cloudflare token; consider a `ui-designer` polish pass on StatCalc now that the
  full set exists. **Next session:** verify the deploy went green + spot-check a few
  new calculator pages live, then resume article writing.

- **2026-06-17** — **Calculator build-out kicked off: authored TASK-011 → TASK-016
  briefs; TASK-011 reviewed → CLOSED + committed/pushed (6 new calculator pages
  live).** This is the execution of the 2026-06-16 strategy pivot (build all
  calculators before resuming articles). Inventoried the planned set in
  `content-ops/seed.json` (**28 calculators: 24 standalone + 4 embed-only**) vs. the
  10 engines + 4 live pages already shipped, confirmed **standalone calc == article
  embed** (one YAML drives both `<StatCalc variant="page">` and `variant="embed">`),
  and split the ~25 remaining calculators into **6 handoff tasks by math/infra
  affinity**, sequenced so each introduces ONE new piece of foundation the later
  tasks reuse: **TASK-011** (6 config-only reuse calcs, zero engine work),
  **TASK-012** (4 new descriptive engines + structured-output foundation —
  table/list/text on `CalcResult`), **TASK-013** (4 combinatorics/probability +
  `select` input type), **TASK-014** (4 normal-family + shared `_stats-math.ts` CDF
  module), **TASK-015** (2 regression/correlation, paired x/y lists), **TASK-016** (5
  inferential, +chi-square CDF). All 6 briefs written plain-ASCII from the template.
  **Resolved the `range` vs `range-iqr` discrepancy** (repo shipped an off-seed
  standalone `range`; seed plans embed-only `range-iqr`) → keep both, baked into
  TASK-012. **TASK-011 reviewed against artifacts** (not just the Work Log): re-ran
  all three gates clean — `astro check` 0/0/0, `npm test` 33/33, `npm run build` 21
  pages / 600 links / **0 violations**; verified each config's `engine:` is a real
  camelCase registry key matching the engine's input contract (the seed-kebab trap),
  categories exist. Accepted two out-of-fence edits: a type-only `CategoryLayout.astro`
  annotation (clears pre-existing astro-check hints) and an `AGENTS.md` work-history
  append (AGENTS.md's own standing note had instructed it). Set TASK-011 `CLOSED` +
  wrote its Review. **Committed + pushed** the 6 configs + task briefs + session log →
  GitHub Actions → Cloudflare; 6 new pages now live
  (`/calculators/{average,weighted-average,variance,mean-absolute-deviation,percentile,z-score}/`).
  **Calculators live: 9; ~19 remain.** **Next:** Codex does **TASK-012 + TASK-013
  together** (per user) — kickoff prompt handed off. **Still-owed follow-ups carried
  over:** SEO baselines on the live URL; rotate the `cfut_…` Cloudflare token; paused
  article backlog resumes only after all calculators ship.

- **2026-06-16 (later)** — **TASK-010 reviewed → CLOSED + front-end redesign
  deployed live; NEXT PHASE LOCKED: build all calculators before any more
  articles.** Reviewed Codex's TASK-010 (bespoke homepage + rich `ArticleLayout`)
  against artifacts: all three gates green, **StatCalc byte-stable hooks confirmed
  in `dist/index.html`** (the fused home card embeds the REAL `<StatCalc
  slug="standard-deviation" variant="embed" />`, not the mockup's JS), root
  `[slug]` discriminated-union collision guard + draft exclusion intact, breadcrumb
  category crumb now a real typed `categoryHub()` link, TOC built from
  `entry.render().headings` (depth===2) with passive/reduced-motion-safe scroll-spy
  + progress bar, and `standard-deviation.mdx` shipped `draft:true` (no new live
  article). Set TASK-010 `Status: CLOSED` + wrote its Review. **Committed + pushed
  the whole redesign (TASK-009 + TASK-010 together).** Hit a non-fast-forward on
  push — the cloud routine had fired mid-session and pushed `how-to-find-the-range`
  + a run log to `origin/main`; resolved by **`git rebase origin/main`** (clean, no
  conflicts), re-ran `npm run build` to confirm the new article renders through the
  new ArticleLayout (**15 pages, 431 links, 0 violations**), then pushed `feec87d`.
  GitHub Actions run `27640517520` triggered → gate suite → Cloudflare deploy; the
  redesign is live on https://statohub.com.
  **>> STRATEGY PIVOT (user decision, this session) <<** Starting **tomorrow
  (2026-06-17)** the focus shifts to **building calculators, not writing articles.**
  The plan: **build + publish all the calculator engines + standalone calculator
  pages first — especially the full set of 23 standalone calculators** — and only
  **once every calculator is live do we resume article writing.** Rationale: the
  founding wedge of statohub is *calculator embedded in the teaching article on the
  same page*; articles are meant to consume real `<StatCalc>` embeds, so the tools
  must exist before the articles that depend on them. **What this means
  concretely:** article publishing (incl. the cloud-routine auto-publish backlog —
  correlation-vs-causation → what-is-an-average → linear-regression) is **PAUSED**
  until the calculator set is complete; new Codex `handoff/` tasks shift to
  calculator engines (extending `src/calc/` past the 10 Descriptive engines:
  correlation, regression, normal/binomial/Poisson CDF, p-value, t-test,
  chi-square, combinatorics, etc.) + their `standalone:true` config + `/calculators/
  {slug}/` pages, all behind the existing engine→registry→StatCalc→typed-link gates.
  **Next session:** scope the calculator build — inventory the 23 standalone tools
  (cross-ref `content-ops` seed: 28 calculators total, odds excluded) vs. the 10
  engines already shipped, then write the first calculator-batch `handoff/` task.
  **Still-owed follow-ups carried over (unchanged):** SEO baselines on the live
  URL; rotate the `cfut_…` Cloudflare token pasted in chat during CI setup; the
  paused article backlog resumes only after calculators are done.

- **2026-06-16** — **TASK-009 reviewed → CLOSED; TASK-010 brief finalized + Codex
  kickoff prompt handed off.** This is part 2 of the two-task **front-end redesign**
  to match the two new root-level mockups (`statohub_template.html` = home,
  `statohub_article_template.html` = article). Earlier in this session I split the
  redesign into TASK-009 (design system + shared chrome + resolve all nav targets)
  and TASK-010 (bespoke homepage + rich article layout). **TASK-009 verified against
  artifacts (not just the Work Log):** `npm run build` green (**14 pages, 387 internal
  links, 0 violations**), `npx astro check` 0/0/0 (15 files), `npm test` 33 tests/12
  files. Confirmed the two high-risk contracts held: (1) **StatCalc byte-stable hooks**
  intact (`data-statcalc`, `data-config-id`, `data-statcalc-form/-results/-chart`, the
  `<script type="application/json">` config block, `aria-live`, `import './statcalc/
  client.ts'`) — TASK-009 was styling-only on the calculator; (2) **root `[slug]`
  discriminated union** (articles + category hubs share `/{slug}/`; Astro allows one
  root `[slug]` dir) with a **collision guard that throws** + draft exclusion. **Theme
  mechanism preserved:** tokens on `:root` + `html.dark` (warm editorial palette —
  paper/ink/vermillion/teal), NOT the mockups' `data-theme`; `.dark` class +
  localStorage no-flash toggle unchanged. **`routes.about()` → `/about/`** added to
  the typed registry. New untracked files from Codex: 5 `src/content/categories/*.yaml`,
  `src/layouts/CategoryLayout.astro`, `src/pages/about/index.astro`. Accepted Codex
  decisions: self-hosted fonts via `@fontsource` (Fraunces/Hanken Grotesk/JetBrains
  Mono), Tailwind token-colors backed by CSS vars. Set TASK-009 `Status: CLOSED` +
  wrote its Review. **TASK-010 (`handoff/TASK-010-redesign-home-article-layouts.md`,
  Status: TODO)** is the next brief, prerequisite now satisfied. Scope: (a) bespoke
  **homepage** — hero (mono eyebrow, serif H1 w/ vermillion italic em, CTA row), the
  signature **fused teach/compute card embedding the REAL `<StatCalc
  slug="standard-deviation" variant="embed" />`** (NOT the mockup's hand-coded JS),
  six-category grid (`categoryHub(...)` links, counts static for now), popular-
  calculators strip (link only built tools), how-it-works; (b) rich
  **`ArticleLayout.astro`** — 3-col shell (~660px measure), reading-progress bar,
  article header (breadcrumb **Home → Category → Title** with the category crumb finally
  a real `categoryHub(article.category.id)` link — completes what TASK-008 deferred),
  right-rail **sticky TOC w/ scroll-spy built from `entry.render()` headings**
  (depth===2), `.article-prose` + `.callout` + `.formula-block` styles, related grid
  from `related` refs; (c) wire the **article branch** of `src/pages/[slug]/index.astro`
  to pass `headings`/category title/`hasCalculator` (don't disturb the category-hub
  branch or draft exclusion). **Hard rules in the brief:** internal links only via
  typed `Link`/`routes`/`url()` (never link an unbuilt id → `check-links` fails);
  single H1; reuse `BaseLayout` for head/SEO/JSON-LD; no new deps; vanilla `is:inline`
  + passive + `prefers-reduced-motion`-aware scripts; DoD = build/astro-check/test
  green + manual preview of `/` and a temporarily un-drafted `/standard-deviation/`
  (revert to `draft:true` after — ships no new live article). **Handed the user the
  copy-paste Codex kickoff prompt for TASK-010 in chat.** **Next session (TASK-010
  review):** when Codex returns TASK-010 `DONE`, verify against artifacts — re-run all
  three gates; confirm the fused card embeds the real StatCalc (not mockup JS) and the
  byte-stable hooks survived; confirm TOC/scroll-spy + progress bar are vanilla/passive/
  reduced-motion-safe; confirm breadcrumb category crumb is a typed link; confirm
  `standard-deviation.mdx` was reverted to `draft:true`; then set `Status: CLOSED` +
  write the Review, and (per workflow) commit + push the redesign so it deploys.
  **Still-owed follow-ups carried over:** SEO baselines on the live URL; rotate the
  `cfut_…` Cloudflare token pasted in chat during CI setup; the launch-article
  auto-publish routines (publish order: correlation-vs-causation → what-is-an-average
  → linear-regression; how-to-find-the-range done).

- **2026-06-15 (evening)** — **First cloud-routine TEST FIRED → article published
  live. GitHub write access proven end-to-end through the routine itself.** This
  was the conclusive test owed from this morning's entry: that the claude.ai cloud
  routine actually *uses* the Claude GitHub App's repo-write grant (the one thing
  unprovable from this machine). **Setup:** created a single one-time cloud routine
  via the `/schedule` skill (`RemoteTrigger` API) — name *"statohub publish-next-
  article (TEST)"*, id `trig_01JJTcpvqW5tpQpSvUKwY8bW`, model `claude-sonnet-4-6`,
  repo `syedjawad11/statohub`, tools Bash/Read/Write/Edit/Glob/Grep, **one-time
  `run_once_at` 2026-06-15T18:51:00Z** (auto-disables after firing). Prompt = the
  README routine prompt (read + execute `content-ops/cloud-routine/publish-next-
  article.md` exactly, publish one article, print PUBLISH_RESULT). The user's two
  connected connectors (Google Drive, Ahrefs) were auto-attached by the API but go
  unused (routine makes no MCP/network calls by design — harmless). **Result
  (reported by user): the article published correctly** — the routine wrote the
  next queued article (`how-to-find-the-range`), passed the QA + build gates,
  **pushed to `main`** (the step that 403'd before the App grant), and the push
  triggered GH Actions → Cloudflare deploy. **This closes the open question:** the
  cloud routine has working push access; the supervised pilot is green, so the
  remaining launch articles can now be auto-published via scheduled routines.
  **Session ended here at the user's request (personal commitment)** — did NOT yet
  create the 4 recurring/launch routines. **Next session:** (1) set up the
  scheduled routines for the rest of the launch backlog — remaining publish order
  is **correlation-vs-causation → what-is-an-average → linear-regression**
  (`how-to-find-the-range` is now done), same routine prompt, staggered times (or
  one daily recurring routine that no-ops when the queue empties); (2) verify the
  new article live at `https://statohub.com/how-to-find-the-range/` + green Actions
  run; (3) still-owed follow-ups carried over: category hubs `/{category}/` (fold
  into root `[slug]`), SEO baselines on the live URL, rotate the `cfut_…`
  Cloudflare token pasted in chat during CI setup.

- **2026-06-15** — **GitHub + Claude write access CONFIRMED for the cloud
  routine.** Root-caused why yesterday's cloud routine (`how-to-find-the-range`)
  couldn't publish: the routine wrote + QA-passed + build-gate-passed the article
  but every push 403'd — write access was missing. That article only ever existed
  in the now-dead cloud session (NOT on `origin`, NOT in the local tree — verified
  404 on remote); it will be **re-generated** by a routine run, nothing to recover.
  **Fix applied by user:** installed the **Claude GitHub App** and granted it
  **Read+write to `code`** (repo contents) on **`syedjawad11/statohub`** (verified
  in the App's Permissions + Repository-access pages, saved). **Verified this
  session:** local Claude Code push works (`gh` token has `repo` scope, admin on
  repo, `git push --dry-run` clean); GitHub MCP here is a *separate read-only PAT*
  (a write test 403'd with "not accessible by personal access token") — unrelated
  to the App, so not a blocker for the cloud routine which uses the App. Checked
  for pending work to push: **none** — working tree clean, `main` == `origin/main`
  @ `d9c20fa`; yesterday's 4 backlog commits were all already pushed. The only
  push this session is this log note. **Still unprovable from this machine:** that
  the cloud routine actually *uses* this App grant — the one conclusive test is a
  live routine run (it writes + pushes one article by design; no dry-run mode).
  **Plan:** this evening, run **one** supervised cloud routine as the real test
  (success = push + green GitHub Actions → Cloudflare deploy); if green, **schedule
  the remaining launch articles** to auto-publish via Claude cloud routines (publish
  order per `content-ops/cloud-routine/README.md`: how-to-find-the-range ->
  correlation-vs-causation -> what-is-an-average -> linear-regression). If it 403s
  again, re-check the App's saved repo grant.

- **2026-06-14** — **First article LIVE-READY + built the cloud-routine content
  engine; pushed the whole launch backlog.** Ran the manual "test routine" end to
  end for the first launch article via subagents (to spare context):
  `stats-article-writer` drafted **`standard-deviation-symbol`** (2863 words, all
  9 keywords), `stats-article-reviewer` returned **PASS 96/100**, applied 2 polish
  fixes, flipped `draft:false`, DB status `published`. **Two fixes baked into the
  pipeline from what the test surfaced:** (1) **H1 change (user request)** — the
  frontmatter `title` IS the page's only H1 (ArticleLayout renders it), so the body
  must start at **H2**; a body H1 trips duplicate-H1 audits (Ahrefs). Applied to
  `seo-playbook.md` (§2/§4/§8), `stats-article-writer.md`, `stats-article-reviewer.md`
  (reviewer now greps for a body H1 as an auto-fail). (2) **No raw LaTeX** — MDX
  parses `{` as JS so `$$…$$`/`\dfrac{}` **breaks the build** (hit it live); rule
  added to playbook §7 + writer agent; formulas are fenced **Unicode** blocks.
  **Built the cloud-routine system (the user's "cloud routines", à la their DevNook
  pattern — NOT GitHub Actions, NOT session cron):**
  [`content-ops/cloud-routine/publish-next-article.md`](content-ops/cloud-routine/publish-next-article.md)
  is a self-contained, cold-start routine a **claude.ai Routine** runs against the
  connected repo: locate repo -> `content_db.py next` (the queue) -> write a
  >=2000-word MDX article to the playbook -> **mechanical QA gate** (word count,
  body-H1, LaTeX, keywords, external link, internal-link format) -> **real build
  gate** (`astro check` + `vitest` + `npm run build` incl. link gate) -> flip
  `draft:false` -> update `content.db` -> `git commit && push origin main` (triggers
  the existing GH Actions -> Cloudflare deploy). Defensive: `draft:true` until BOTH
  gates pass; on failure it leaves the article as a build-safe **draft** + marks
  `changes_requested` + still advances the queue (never forces broken content live).
  Plus [`content-ops/cloud-routine/README.md`](content-ops/cloud-routine/README.md):
  prereqs (connect repo to Claude; everything on `main`), the 4× one-time-routine
  setup (same prompt, ~3.5h apart -> 4 articles in ~24h), and the publish order
  (`next` = phase -> lowest KD -> volume: how-to-find-the-range,
  correlation-vs-causation, what-is-an-average, linear-regression). **Pushed the
  whole uncommitted backlog** in 4 clean commits: (A) TASK-008 ArticleLayout + flat
  `/{slug}/` routes + `.article-prose` + removed the `/normal-distribution/` proof
  route; (B) mean+range calculator entries + range engine output fix; (C) the
  content pipeline (`content-ops/` DB+CLI, `.claude/` agents+playbook+skill, cloud
  routine, SITE-ARCHITECT + CONTENT-WORKFLOW docs, the first published article); (D)
  this log. Gate green before push: astro check 0/0/0, **33 tests**, build **7
  pages / 0 link violations**. Push to `main` triggers the live deploy, so the first
  article ships. **Next:** user creates the 4 cloud routines in claude.ai (paste the
  routine prompt, set the 4 UTC times), connects the repo with push access; then the
  remaining launch articles publish themselves. Still owed: category hubs
  `/{category}/` (fold into root `[slug]`), SEO baselines on the live URL, and
  rotate the `cfut_…` Cloudflare token pasted in chat during setup.

- **2026-06-14** — **TASK-008 reviewed -> CLOSED + created `SITE-ARCHITECT.md`.**
  Verified Codex's TASK-008 (ArticleLayout + flat `/{slug}/` article routes)
  independently, not just the Work Log: `npm run build` green (4 pages, link gate
  **0 violations**; draft `standard-deviation.mdx` correctly produced NO page,
  proving draft exclusion); `npx astro check` 0/0/0; `src/pages/normal-distribution/`
  confirmed deleted (no second root `[slug]` route). `ArticleLayout.astro` reuses
  BaseLayout + `articleSchema()` (no hand-rolled canonical/OG/JSON-LD), Home->article
  breadcrumbs only, category as a non-linked eyebrow (gate-safe as briefed); the
  root `[slug]` route mirrors the calculator route, filters drafts, and carries the
  forward-compat comment about the future category-hub root-route collision; sample
  MDX uses in-frontmatter imports (StatCalc + Link + routes). Accepted both Codex
  decisions (hand-styled `.article-prose` over `@tailwindcss/typography`; MDX
  self-imports over a `components=` prop). **Caught one latent issue (logged, not
  fixed):** `astro.config.mjs` `noindexRouteSegments` still lists
  `normal-distribution` (the deleted proof route) -- harmless now but would silently
  exclude the real PD3 article from the sitemap when it ships; flagged in
  SITE-ARCHITECT.md §11 to remove with that article.
  **Then created [`SITE-ARCHITECT.md`](SITE-ARCHITECT.md)** (per user request): the
  single orientation map -- core info, tech stack, repo structure, URL/link
  contract, key commands, available tools (gh, Wrangler v3, DataForSEO REST,
  content-ops CLI), deploy pipeline, content workflow, **workspace model**
  (statohub = primary hub for build + content execution incl. Claude Code; Claude_OS
  = research/planning/future-strategy only), and a **Codex current-scope section**
  (handoff loop, what Codex owns, done through TASK-008, likely next briefs, hard
  rules). Baked in the **content-generation flexibility note**: Claude writes
  articles now, but the pipeline is author-agnostic so generation may pivot to Codex
  in the coming weeks (same briefs/playbook/draft gate, only the "who drafts" step
  moves). File is plain ASCII (Codex reads it too). **Next:** category-hub task +
  remaining calculator engines + launch articles.

- **2026-06-14** — **Stood up the content-writing workflow (the article pipeline)
  before article writing starts.** New self-contained system inside the repo, kept
  separate from the Codex `handoff/` build loop (handoff = build; this = writing).
  See [`CONTENT-WORKFLOW.md`](CONTENT-WORKFLOW.md). **Decisions (with user):**
  2 agents (writer + reviewer); DB = **Python 3.14 stdlib `sqlite3`** (zero
  installs, never ships). **Built:** (1) **`content-ops/` SQLite editorial board** —
  `schema.sql` + `seed.json` (transcribed from the SEO-study maps `08`–`13` in
  Claude_OS, **no new API calls**) + `content_db.py` CLI
  (`init`/`seed`/`list`/`show`/`brief`/`next`/`set-status`/`log-review`/`stats`) →
  generated `content.db`. Seeded clean: **48 articles · 7 categories · 28
  calculators · 354 keywords · 0 cannibalization conflicts.** The study's "one
  keyword → one article" rule is enforced *mechanically* by a global
  `UNIQUE INDEX` on keywords — seeding aborts loudly on any overlap. Caught + fixed
  one real source overlap (`distribution mean` was on both A2 and PD2 → assigned to
  PD2). Odds/betting-odds calcs excluded per the non-negotiable. Two stubs
  (`permutations-and-combinations`, `validity-in-statistics`) seeded
  `research_pending` (keyword passes still owed); 8 flagged articles surface with
  their study notes. (2) **`.claude/` project folder** — `agents/stats-article-writer.md`
  (drafts ≥2000-word MDX from a brief; distills `seo-content-writer` +
  `seo-content-planner`) + `agents/stats-article-reviewer.md` (scores against the
  playbook, PASS/CHANGES_REQUESTED, never rewrites; distills
  `seo-content-auditor` + `seo-authority-builder` + `seo-cannibalization-detector`
  + `content-quality-editor`) + `skills/write-article/SKILL.md`
  (`/write-article [slug]` runs brief→write→review→status, 2-round cap). (3)
  **`.claude/seo-playbook.md`** — the one rule book both agents load: ≥2000 words,
  ≥1 authoritative external link, all keywords used naturally/semantically, active
  voice, educational tone, grade ~8–10 (soft guide-rail — stats terms inflate the
  score), + the statohub build contracts (flat slugs, typed `Link` only,
  frontmatter per `src/content/config.ts`, `draft:true` until human-published).
  Status loop: `planned → briefed → drafting → in_review → changes_requested →
  approved → published`; reviewer PASS sets `approved` only — a human flips
  `draft:false` + `published` after a green `npm run build`. **Verified:** init +
  seed exit clean; `next` correctly picks `standard-deviation-symbol` (phase 1,
  KD 0–13, ~187.5k/mo); `brief` renders a complete writing brief. **Nothing built
  yet ships** — this is infrastructure; writing the 4–5 launch articles + the ~50
  backlog is the next session(s). **Note:** the A5 `ArticleLayout` + flat
  `/{slug}/` routes (a Codex `handoff/` task) still don't exist — articles can't
  *ship* until those routes land, though drafts can be written now.

- **2026-06-14** — **Set up push-to-deploy CI/CD (GitHub Actions → Cloudflare
  Pages).** User asked whether to connect the repo to Cloudflare for auto-deploy.
  Chose **GitHub Actions over native CF Git integration**: a Pages project can't
  be converted between Direct Upload and Git-connected, so native integration
  would mean deleting/recreating `statohub` and re-attaching the domain we just
  set up; native builds also only run the build command, skipping our test/link
  gates. Added [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) —
  on push to `main`: `npm ci` → `astro check` → `vitest` → `npm run build`
  (route-id gen + astro build + link gate) → `cloudflare/wrangler-action@v3`
  `pages deploy dist --project-name statohub` (pinned `wranglerVersion: 3`,
  `node-version: 20`, `concurrency` guard, account id hardcoded since it's not a
  credential). Committed `89995d4`, pushed `385874f..89995d4`. **Token saga:**
  first run passed all gates, failed only at deploy (no secret) — proving the
  gate-then-deploy design. User's 1st token was truncated (37 chars) → `9106`
  auth fail (verified via direct curl); 2nd token (`cfut_…`, Account · Cloudflare
  Pages · Edit) verified good against the Pages API. Set repo secret
  `CLOUDFLARE_API_TOKEN` via `gh secret set`, re-ran → **fully green** (deploy in
  39s). Live re-verified: apex/hub/SD-calc 200, odds 404, www→apex 301. **Confirmed
  the on-push trigger end-to-end:** the doc-sync push (`6333ceb`) — a normal push,
  not a manual re-run — auto-fired workflow run `27498690290`, which completed
  **success**, proving push → gates → deploy works on a plain push. Told user to
  revoke the earlier zone-scoped + truncated tokens shared in chat (the working
  `cfut_…` token is narrowly scoped but was pasted in chat — roll + re-set the
  secret later, no rush). Note: GH flagged Node-20 JS-action deprecation (auto-moves
  to Node 24 on 2026-06-16, runner-side, harmless — separate from our
  `node-version: 20` build step).

- **2026-06-14** — **Pushed the build-pipeline work to GitHub + attached the
  custom domain `statohub.com`.** First synced the repo: the working tree held
  two tasks' uncommitted work (Codex left TASK-006's SEO layer uncommitted, plus
  Claude's TASK-007 deploy fixes). Sliced into three clean per-task commits on
  `syedjawad11/statohub` `main` — `33a9b23` (TASK-006: SEO components +
  `schema.ts` + Breadcrumbs + `public/robots.txt` + sitemap config),
  `c892348` (TASK-007: `wrangler.toml` name + `src/pages/404.astro` + handoff),
  `b7837c7` (docs sync) — pushed `3963aca..b7837c7`. **Then the custom domain
  (was a deferred follow-up):** user gave a Cloudflare API token; `verify`
  endpoint quirked but the authenticated zone call proved it valid. Token was
  **zone-scoped** (DNS + zone + rulesets edit) but **lacked account Pages:Edit**,
  so it could not attach the custom domain to the Pages project. Per user choice,
  user did the dashboard step (Pages → statohub → Custom domains → add
  `statohub.com` + `www.statohub.com`); Cloudflare auto-created two **proxied
  CNAMEs → `statohub.pages.dev`** + provisioned SSL (both served 200 within
  ~1 min). Claude then added the **`www → apex` 301** via API — a zone Redirect
  Rule in the `http_request_dynamic_redirect` phase, expression
  `(http.host eq "www.statohub.com")`, target
  `concat("https://statohub.com", http.request.uri.path)`, `preserve_query_string`.
  **Live verification (curl) all pass:** apex `/`, `/calculators/`,
  `/calculators/standard-deviation/` → 200; `www` → 301 to apex (preserves path,
  worst case `www`+no-slash = 2 hops 301→308 landing on canonical 200);
  odds/betting-odds/unmatched → 404; sitemap slash-only on the apex host.
  **Site is now live at https://statohub.com.** Zone id `50e47547…`, account
  `027007f4…`. **Remaining follow-ups:** SEO baselines (`seo-drift` +
  `seo-technical` on the live URL); A5 article layout → launch articles.

- **2026-06-14** — **TASK-006 reviewed → CLOSED, then TASK-007 (final go-live)
  executed by Claude → site is LIVE.** First closed TASK-006: re-ran all gates
  from clean state (`npm run build` 0 link violations / `astro check` 0-0-0 /
  33 tests green) and verified the built SD calculator page carries one absolute
  slash-terminated canonical + two ld+json blocks (BreadcrumbList +
  SoftwareApplication), the sitemap lists only the 3 indexable slash-terminated
  URLs, robots is allow-all, and `/normal-distribution/` is `noindex`. Then ran
  **TASK-007** personally (the interactive Cloudflare stage). **User decisions
  this session:** deploy the skeleton now (home + calculators; A5 article routes
  don't exist yet); Claude runs project-create + deploy; custom domain deferred.
  **Steps:** confirmed `wrangler@3 whoami` (still logged in, `pages (write)`) →
  `pages project create statohub --production-branch main` → `pages deploy dist`.
  **Hit + fixed two go-live defects:** (1) deploy failed — `wrangler.toml` lacked
  a top-level `name`; added `name = "statohub"`. (2) **No `404.html` was being
  built** (the scaffold never had a `src/pages/404.astro`), so Cloudflare Pages
  served the homepage with a **200 for every unmatched path** — soft-404s, and
  `/calculators/odds/` was reachable, a direct violation of the "no odds calcs /
  404 by design" non-negotiable. Fixed at source: created a permanent
  `src/pages/404.astro` (`noindex`, no self-canonical, BaseLayout + typed
  `Link`), rebuilt (5 pages, link gate still 0 violations), redeployed.
  **Live verification (curl) all pass:** `/`, `/calculators/`,
  `/calculators/standard-deviation/` → 200; non-slash → single 308 hop to slash;
  `/calculators/odds/` + `/calculators/betting-odds/` + any typo → 404; sitemap
  slash-only. **Site is live at https://statohub.pages.dev.** Wrote
  `handoff/TASK-007-cloudflare-pages-deploy.md` (CLOSED, full Work Log + Review).
  **Build pipeline TASK-001 → TASK-007 is complete.** **Follow-ups (own tasks,
  not blocking):** custom-domain attach (`statohub.com` + `www`, apex canonical +
  single `www→apex` 301); `seo-drift` baseline + `seo-technical` CWV/mobile pass
  on the live URL; the unnumbered A5 article-layout task → then the launch
  articles. **Uncommitted at session end:** `404.astro`, `wrangler.toml` name,
  regenerated `content-route-ids.ts`, TASK-006/007 handoff files, this log entry
  — commit/push pending the user's go.

- **2026-06-13** — Repo bootstrapped. Created `Desktop/statohub/` as the dedicated
  build folder (separate from Claude_OS per the research/build separation SOP).
  Saved the approved big plan as `BUILD-PLAN.md` (Phase 0 tools inventory + Plan A
  site buildup / Plan B SEO rules / Plan C content + Codex handoff division).
  Stood up the `handoff/` task box (`README.md` + `TEMPLATE.md`), this `CLAUDE.md`
  session log, `AGENTS.md` (Codex entry point), and `.gitignore`. **No code/scaffold
  built yet** — that begins when the first task briefs (`TASK-001`…`007`) are dropped
  into `handoff/` for Codex. Locked decisions this session: both odds calculators
  removed; Astro + Tailwind; new Desktop/statohub repo; Codex builds / Claude
  writes + reviews. **Next:** write `TASK-001` (Astro scaffold + trailing-slash
  contract + Tailwind/dark-mode) and the one-time Cloudflare steps
  (`wrangler@3 login`, `pages project create statohub`).

- **2026-06-13** — Added a **"⏳ Waiting on you"** section near the top of this file
  capturing the user's pending action items before the build can start: (1) review
  `BUILD-PLAN.md`, (2) one-time Cloudflare `wrangler@3 login` + `pages project
  create statohub` (interactive — only the user can do it), (3) give the go-ahead
  for `git init` + GitHub `statohub` repo, (4) attach the custom domain after first
  deploy. **Paused here per user request** — will continue (write TASK-001 + init
  git) once the user has reviewed the plan and given the go.

- **2026-06-13** — Plan approved; **TASK-001 written + Cloudflare login done**.
  Wrote `handoff/TASK-001-scaffold-trailing-slash-tailwind.md` (status `TODO`):
  Astro scaffold + flat-trailing-slash contract (`trailingSlash:'always'` +
  `build.format:'directory'`, every route is `<folder>/index.astro`) + Tailwind
  class-based dark mode w/ pre-paint no-flash script + `BaseLayout` + two
  proof-of-contract routes (`/` and a throwaway `/normal-distribution/`) +
  `wrangler.toml`. Brief pins the **exact** `astro.config.mjs` and explicitly
  overrides the simpler config in the `.codex/skills/astro-tailwind-cloudflare`
  skill (which omits trailingSlash/build.format/mdx/sitemap). DoD: `npm install`
  + `npm run build` → both `dist/index.html` AND `dist/normal-distribution/index.html`,
  `astro check` clean, dark toggle no-flash, sitemap all slash-terminated.
  **Cloudflare auth cleared:** `wrangler@3 login` succeeded (first attempt's OAuth
  callback timed out → relaunched → exit 0); `whoami` confirms logged in as
  `syedjawadhassan11@gmail.com`, account `027007f4d056b885d434f48b4f136a07`, token
  scope includes `pages (write)`. `pages project create` intentionally deferred to
  TASK-007 (needs a `dist/` first). Wrote the copy-paste **Codex kickoff prompt**
  (orient to repo → read AGENTS.md → BUILD-PLAN.md → pick lowest `TODO` → run the
  5-state handoff loop → scaffold only, don't edit CLAUDE.md, don't touch siblings).
  **Git boundary locked per user:** the `statohub` repo will contain ONLY
  `Desktop/statohub/` files — nothing from the `Claude_OS` workspace (structurally
  guaranteed since they're separate sibling folders). Git still NOT initialized
  locally — recommend `git init` + GitHub push **after** Codex returns TASK-001
  `DONE`. **Next (Claude):** review Codex's TASK-001 Work Log when status flips to
  `DONE`, then init git + push, then write TASK-002. **Next (user):** hand the
  Codex prompt to Codex in the statohub workspace.

- **2026-06-13** — **TASK-001 reviewed → CLOSED.** Codex returned it `DONE`;
  Claude verified against the actual artifacts (not just the Work Log):
  `astro.config.mjs` matches the pinned contract exactly; `dist/index.html` +
  `dist/normal-distribution/index.html` both built (directory output + folder-
  per-route confirmed); `dist/sitemap-0.xml` lists only the two slash-terminated
  URLs; `tailwind.config.cjs` has `darkMode:'class'`; `BaseLayout.astro` has the
  pre-paint no-flash `<head>` script + working persisted toggle; `wrangler.toml`
  present. Accepted Codex's deviation (Tailwind v3 via PostCSS instead of
  `@astrojs/tailwind`) — it keeps `integrations:[mdx(), sitemap()]` exactly as
  required. Verdict + notes written into the task file's Review section.
  **Next (Claude):** git init + GitHub `statohub` repo push (gated on user's
  go-ahead + public/private call), then write `TASK-002` (content collections
  schema: `categories`/`articles`/`calculators` Zod collections per BUILD-PLAN A2).

- **2026-06-13** — Scaffold pushed to GitHub + **TASK-002 written & queued**.
  `git init` → committed the TASK-001 scaffold (21 files; `node_modules`/`dist`
  excluded) → pushed to the existing public repo `syedjawad11/statohub` `main`.
  Wrote `handoff/TASK-002-content-collections-schema.md` (status `TODO`) with the
  **pinned Zod contract** for `src/content/config.ts` (3 collections —
  `categories`/`articles`/`calculators`, all cross-links via `reference()`) plus
  3 deletable sample entries (descriptive-statistics category, standard-deviation
  calculator `engine:'standardDeviation'`, standard-deviation MDX article). Scope
  fenced tight: **schema + sample data ONLY** — no page-wiring, no `<StatCalc>`, no
  `src/calc/**`, no `links.ts`/`check-links.mjs`, no SEO components, no calculator
  form-config (that extends the schema in TASK-004). DoD: `astro sync` + `astro
  check` exit 0, `npm run build` still builds the existing routes. Also logged the
  **revised launch scope** in BUILD-PLAN Plan C: ship 4–5 seed articles, then
  ~2–3 posts/day; article writing deferred to full sessions. **User is taking
  TASK-002 to Codex now.** **Next (Claude, tomorrow):** review Codex's TASK-002
  Work Log when it flips to `DONE`; then plan + write the 4–5 launch articles
  (likely G1 Fundamental Statistics, parameter-vs-statistic, z-table, + 1–2
  descriptive spokes — all Phase-1 KD 0–7).

- **2026-06-14** — **TASK-002 reviewed → CLOSED; TASK-003 written & queued.**
  Codex returned TASK-002 `DONE`; Claude verified against artifacts (not just the
  Work Log): `src/content/config.ts` matches the pinned Zod contract verbatim (all
  3 collections, all `reference()` fields, defaults, `phase` literal-union); the 3
  sample entries are internally consistent + deletable (article references the
  sample category + calculator; the `standard-deviation` slug/id collision across
  two URL spaces correctly demonstrates the dual-deploy design); scope respected
  (no routes, no `<StatCalc>`, no `src/calc/**`, calculator schema left
  un-extended for TASK-004). Independently re-ran `npx astro check` → **3 files,
  0 errors/0 warnings/0 hints.** Verdict + notes in the task file's Review section.
  Then wrote `handoff/TASK-003-calc-engines-registry-tests.md` (status `TODO`):
  the pure **calculator engine layer** (`src/calc/`) + `registry.ts` keyed by
  engine name + **Vitest** unit tests. Scoped to the **Descriptive batch (10
  engines)** — `mean`, `median`, `mode`, `range`, `variance`, `standardDeviation`
  (the key the TASK-002 sample calc already references), `meanAbsoluteDeviation`,
  `percentile`, `weightedMean`, `zScore` — all deterministic + fully testable.
  Pinned a `CalcResult`/`CalcEngine` contract, a canonical reference dataset
  `[2,4,4,4,5,5,7,9]` with exact expected values, and the validation-returns-null
  (no-throw) rule. Heavier engines that need numerical approximations
  (normal/binomial CDF, correlation, regression, p-value, t-test, chi-square,
  combinatorics) explicitly **deferred** to later batches; registry built to grow.
  Scope fenced: engines + registry + tests ONLY — no `<StatCalc>`, no schema
  field-specs, no page wiring, no `links.ts`/`check-links.mjs`. **User is taking
  TASK-003 to Codex.** **Next (Claude):** review Codex's TASK-003 when it flips to
  `DONE`; then TASK-004 (`<StatCalc>` dual-deploy — first consumer of these
  engines). Article-writing still deferred to a dedicated full session.

- **2026-06-14** — **TASK-003 reviewed → CLOSED + fixed the Codex friction at its
  source.** Codex returned TASK-003 `DONE`; Claude verified against artifacts (not
  just the Work Log): re-ran `npm test` → **11 files / 24 tests pass** incl. the
  invalid-input null/error paths; purity grep `astro:|\.astro|window|document|
  fetch\(` over `src/calc/**` → no matches (the dual-deploy guarantee TASK-004
  relies on holds); `registry.ts` exposes all 10 camelCase keys incl.
  `standardDeviation` + `getEngine()`, no stub throws; `percentile` documents
  Hyndman-Fan Type 7 and reuses it for q1/q2/q3/iqr; `mode` tie/no-mode behavior
  deterministic + tested. Contract followed verbatim. Verdict + notes in the task
  file's Review section. **Addressed the 3 issues Codex logged:** (1) **mojibake**
  (`â€"`/`â†'`/`â€¦` broke an `apply_patch`) — root cause = our handoff `.md` files
  used UTF-8 em-dash/arrow/ellipsis, which Codex reads through a Windows codepage;
  **fixed at the source** by converting `handoff/TEMPLATE.md` to plain ASCII (every
  future task spawns from it clean) + added an ASCII-only authoring rule to
  `handoff/README.md` conventions; (2) Vitest **`spawn EPERM`** + (3) **`npm
  install` cached-only** — both are Windows-sandbox approval prompts (project is
  already `trusted`), not bugs; documented them as expected (approve + re-run) in a
  new **"Sandbox heads-up"** section in `AGENTS.md` so Codex stops treating them as
  blockers. **Next (Claude):** write TASK-004 (`<StatCalc>` dual-deploy — first
  consumer of these engines). Article-writing still deferred to a full session.

- **2026-06-14** — **TASK-004 brief written + dropped as `TODO`** for Codex
  (`handoff/TASK-004-statcalc-dual-deploy.md`, ASCII-clean from the new template).
  Spec = BUILD-PLAN **A4**: one config-driven `<StatCalc>` that dual-deploys from
  the same config + same TASK-003 engine — `variant="page"` (standalone
  `/calculators/{slug}/`) and `variant="embed"` (inline) — zero logic duplication.
  **Decisions baked into the brief** (the two open specifics, resolved): (1)
  **proof case = reuse the existing `standard-deviation.yaml`** (`standalone:true`,
  multi-output sample/population) as the canonical dual-deploy case + add one
  **`median.yaml` (`standalone:false`)** to prove the embed-only path renders inline
  but generates **no** route — two configs cover the whole matrix (value-only,
  multi-output, page, embed, route-generated, route-suppressed); (2) **styling =
  functional + accessible Tailwind now** matching BaseLayout conventions, with the
  polished design-token system / `CalculatorLayout` deferred to a later
  `ui-designer` pass — don't block the engine→UI proof on design. Also pinned:
  **no UI framework** (vanilla `<script>` island importing `getEngine` from
  `src/calc/registry`, so deps stay astro/mdx/sitemap and safe on Node 20.8.0),
  **no charts/uPlot** (leave only the lazy-import seam), engines/`src/calc/**` stay
  untouched + pure, and the `calculators` schema gets **only optional/defaulted**
  new fields (`inputs`/`precision`/`resultLabel`/`outputLabels`) so the existing SD
  config still validates. DoD verifies the build emits the SD page + `/calculators/`
  hub but **not** a median route, the embed computes the same numbers, and
  `npm test`/`astro check` stay green. **Out of scope** (their own tasks): article
  routes/`ArticleLayout`, `links.ts`+`check-links` (TASK-005), SEO+sitemap
  (TASK-006), deploy (TASK-007). **Next:** Codex picks up TASK-004; Claude reviews
  on `DONE`.

- **2026-06-14** — **TASK-004 reviewed -> CLOSED.** Codex returned it `DONE`;
  Claude verified independently (not just the Work Log) by re-running all three
  gates from a clean state: `npm run build` exits 0 and emits exactly the four
  expected routes (`/calculators/standard-deviation/`, `/calculators/`, `/`,
  `/normal-distribution/`) with **no** `/calculators/median/` (the
  `standalone:false` embed-only proof holds); `npx astro check` = 0 errors / 0
  warnings / 0 hints; `npm test` = **33 tests / 12 files** (24 engine tests
  intact + 9 new `format.ts` tests). Dual-deploy proven at source: the standalone
  SD route and the hub both render `<StatCalc>` from the SAME
  `standard-deviation.yaml` via the SAME `getEngine('standardDeviation')` — built
  hub HTML confirmed to carry two distinct server-rendered `data-statcalc`
  instances with per-instance `application/json` config blocks
  (`engine:"standardDeviation"` + `engine:"median"`), real labeled controls, and
  `aria-live` results regions; instances isolated by unique root id +
  `data-config-id`. Result rule correct (SD shows Sample+Population from
  `outputs`, no primary duplication; null -> error, no crash). Schema
  back-compat held (new `inputs`/`precision`/`resultLabel`/`outputLabels` all
  optional/defaulted; existing SD yaml unedited); `src/calc/**` untouched + pure;
  no new runtime dep; chart seam left commented-only. **One non-blocking note:**
  Codex's functional check used a production-bundle DOM harness instead of a live
  `npm run preview` browser pass (in-app `iab` browser was unavailable) — same
  numbers reproduced (Sample ~= 2.1381, Population = 2; median 5), fine for now,
  but worth a real browser pass when StatCalc gets its visual polish in the later
  `ui-designer` task. Verdict + full notes in the task file's Review section.
  **Session paused here per user (short break).** **>> NEXT UP: TASK-005 <<** —
  the typed link registry: `src/lib/links.ts` (typed route registry) +
  `Link.astro` + `scripts/check-links.mjs` build gate enforcing zero internal
  redirects/404s (the BUILD-PLAN non-negotiable). Claude writes the brief, drops
  it as `TODO`, hand to Codex. Article-writing still deferred to a full session.

- **2026-06-14** — **TASK-006 written & queued (`TODO`); deploy ordering locked
  with the user.** Per the user's call this session: do **TASK-006 (SEO) next,
  then TASK-007 (deploy) as the final go-live stage** -- article writing planned
  for the evening as its own session. Wrote
  `handoff/TASK-006-seo-components-sitemap.md` (ASCII-clean from the template):
  the SEO plumbing layer (BUILD-PLAN **B4**) wired into the pages that exist today
  (home, calculators hub, standalone calculator pages, throwaway
  `/normal-distribution/`). Deliverables pinned: `src/components/seo/Meta.astro`
  (title/desc + OG + Twitter), `Canonical.astro` (absolute, slash-terminated),
  `JsonLd.astro` (generic ld+json emitter), `Breadcrumbs.astro` (visible nav via
  the typed `Link`), and `src/lib/schema.ts` pure helpers building
  **BreadcrumbList** + **Article** + **SoftwareApplication** -- **every URL field
  routed through `url()`** so the TASK-005 `check-links.mjs` gate stays the
  enforcement mechanism (the B2 non-negotiable). BaseLayout extended with optional
  SEO props (auto-prepends BreadcrumbList from the breadcrumb trail = single
  source); SoftwareApplication + breadcrumbs wired into the calculator page,
  breadcrumbs into the hub, canonical/OG confirmed on home. `public/robots.txt` +
  verified slash-terminated sitemap. **Two scope fences baked in:** (1)
  `articleSchema` is **built + exported but not consumed yet** -- it's ready for
  the upcoming **A5 article-layout task** (ArticleLayout + flat `/{slug}/` article
  routes + category hubs), which is still unnumbered and does NOT exist; no article
  routes are built in TASK-006; (2) **no `wrangler`/deploy** -- that's TASK-007.
  No new deps; `src/calc/**` stays pure. DoD headline gate = `npm run build` with
  **0 link violations** + `astro check` clean + 33 tests green + the built SD
  calculator page carrying a real canonical + BreadcrumbList + SoftwareApplication.
  **Flagged to user (deliberate, accepted):** at TASK-007 the site goes live with
  **calculators + home only** -- the A5 article routes won't exist yet; first
  deploy is a skeleton by design, articles follow. **Next (user):** hand the Codex
  kickoff prompt (written this session) to Codex in the statohub workspace.
  **Next (Claude):** review TASK-006 on `DONE` -> CLOSE -> then **personally do
  TASK-007** (the final go-live: `pages project create statohub` + `wrangler@3
  pages deploy` + domain attach).

- **2026-06-14** — **TASK-005 reviewed -> CLOSED, then the whole backlog
  committed + pushed.** The typed link safety layer is in and verified: 3 layers
  working together — `src/lib/links.ts` (`url(RouteRef)` emitter, single source of
  truth for internal hrefs) + typed `Link.astro` (a bogus route id fails `astro
  check`) + `scripts/check-links.mjs` (post-build gate crawling `dist/**/*.html`
  for non-canonical / unresolvable internal links). Route ids are a real literal-
  union **generated** from `src/content/**` by `scripts/gen-route-ids.mjs`
  (regenerated on `predev` + `build`) into `src/lib/content-route-ids.ts` — works
  around this Astro version collapsing `CollectionEntry['id']` to `string`, so the
  registry has compile-time bite AND can't drift from content; **no new
  dependency**. `index.astro`, `normal-distribution/index.astro`, and
  `BaseLayout.astro` all converted from raw `<a href>` to typed `<Link to>`.
  **Decided:** keep `content-route-ids.ts` committed (not gitignored). Final
  `npm run build` = green end-to-end (4 pages, gate scanned 7 internal links, **0
  violations**). **Git:** the working tree held FOUR tasks' worth of uncommitted
  work (TASK-002→005 + doc-sync), not just TASK-005 — surfaced it and, per user
  choice, sliced it into **5 clean per-task commits** (`d8a132f` TASK-002 content
  collections, `d9a48e6` TASK-003 calc engines + Vitest, `69c4ee1` TASK-004
  StatCalc + calculator pages, `ad1fb38` TASK-005 typed links + gate, `3963aca`
  chore doc-sync), splitting `package.json`/`package-lock.json` across the 003 and
  005 commits via an intermediate on-disk state (no interactive `add -p` in this
  shell). **Pushed to `syedjawad11/statohub` `main`** (`daa6f31..3963aca`); branch
  in sync with origin. **Build pipeline through TASK-005 is complete and live in
  the repo.** **Next:** TASK-006 (SEO + JSON-LD + sitemap — JSON-LD URL fields
  must route through `url()`), then TASK-007 (Cloudflare Pages deploy wiring +
  `pages project create statohub`). Article-writing still deferred to a dedicated
  full session.
