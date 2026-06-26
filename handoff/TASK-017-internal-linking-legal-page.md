Status: CLOSED
<!-- TODO | IN_PROGRESS | DONE | CHANGES_REQUESTED | CLOSED -->

# TASK-017 -- Internal linking (calc sidebar + related-link callout) + combined legal page

- **Owner of this stage:** Codex
- **Repo:** `Desktop/statohub/` (where the work happens)
- **Created:** 2026-06-26 by Claude

<!-- Authoring note (Claude): keep this file plain ASCII. Use `--` not an em
dash, `->` not an arrow, `...` not an ellipsis. Codex reads these files through
a Windows codepage; non-ASCII punctuation renders as mojibake and breaks its
apply_patch matching. -->

---

## Brief  *(Claude writes -- what Codex needs to execute)*

**Goal:** Add the site's internal-linking layer and a single combined legal page.
Concretely: (A) one combined Cookie + Privacy Policy page, (B) a "Related
calculators" sidebar that every standalone calculator page gets automatically, and
(C) a reusable, on-brand "related link" callout component whose intro phrase varies.
Existing calculator pages must benefit immediately; future calculator pages must
inherit the same structure with no per-page work.

**Context / inputs:**
- Build spec: `doc/BUILD-PLAN.md`. Handoff conventions: `handoff/README.md`.
- The flat trailing-slash URL contract and the "zero internal redirects / 404s"
  rule are NON-NEGOTIABLE (see `CLAUDE.md` and BUILD-PLAN). Every internal link
  must end in `/` and resolve to a built page, enforced by
  `scripts/check-links.mjs` during `npm run build`.
- Typed link registry: `src/lib/links.ts` -- ALL internal hrefs route through
  `routes.*` / `url(RouteRef)` and are rendered with `src/components/Link.astro`.
  Adding a new internal page means adding a new `RouteRef` kind here.
- Static-page pattern to copy: `src/pages/about/index.astro` (a real
  `src/pages/<slug>/index.astro` directory takes precedence over the root
  `src/pages/[slug]/index.astro` catch-all, so there is no slug collision).
- Existing sidebar + related-card pattern to reuse: `src/layouts/ArticleLayout.astro`
  (the `.article-shell` grid, `.article-rail` aside, `.related-card` styles in
  `src/styles/global.css`). Prefer reusing these classes over inventing new ones.
- Calculator page to restructure: `src/pages/calculators/[slug]/index.astro`. It
  currently renders `BaseLayout` + `<article class="max-w-3xl">` + `<StatCalc>` +
  an optional teaching block (from the `calculator-content` MDX collection). There
  is NO sidebar today.
- Each calculator YAML carries a `category:` reference, e.g.
  `src/content/calculators/z-score.yaml` -> `inferential-statistics`. Category ids
  are: `combinatorics`, `descriptive-statistics`, `foundations`,
  `inferential-statistics`, `probability-distributions`, `regression-correlation`.
  There are 29 calculators; the standalone ones (`standalone !== false`) get pages.
- Footer lives in `src/layouts/BaseLayout.astro` (the "Site" column near the
  `About` / `Sitemap` links).
- Reference images (provided by the user) show the related-link callout: a soft
  blue box with a left accent bar, a right-arrow glyph, an italic intro phrase
  ("Worth reading next:", "On a related note:"), then an underlined internal link.

**Deliverables:**

Part A -- Combined Cookie + Privacy Policy page
- [ ] New `src/pages/privacy-cookie-policy/index.astro`, modeled on
      `src/pages/about/index.astro`: rendered through `BaseLayout` with
      `breadcrumbs` (Home -> Privacy & Cookies), a `canonicalPath`, page title as
      the single H1, and the policy body in a `.article-prose` container
      (`max-w-3xl`). Body sections start at H2 (the page title is the only H1).
- [ ] In `src/lib/links.ts`: add `{ kind: 'privacyCookiePolicy' }` to the
      `RouteRef` union, a matching `case 'privacyCookiePolicy': return
      '/privacy-cookie-policy/';` in `url()`, and a
      `privacyCookiePolicy: (): RouteRef => ({ kind: 'privacyCookiePolicy' })`
      entry in `routes`.
- [ ] In `src/layouts/BaseLayout.astro`: add a "Privacy & Cookies"
      `<Link to={routes.privacyCookiePolicy()}>` to the footer "Site" column.
- [ ] Draft the policy copy yourself -- professional, clear, plain-English, and
      ACCURATE to what this site actually is (a static, statically-hosted
      statistics education + calculator site with no user accounts). Follow this
      outline as one page with two clearly headed halves:
      - Lead paragraph + a "Last updated" line.
      - Privacy Policy (H2), with H3 subsections roughly covering: what we collect
        and do not collect (no accounts, no sign-in, no sale of personal data);
        hosting and server logs (the site is served via Cloudflare Pages, whose
        edge keeps standard request logs); analytics -- phrase CONDITIONALLY (e.g.
        "If we use privacy-respecting analytics, ...") since none is wired up yet;
        third-party links disclaimer; children's privacy; changes to this policy;
        how to contact us.
      - Cookie Policy (H2), with H3 subsections roughly covering: what cookies are;
        that the site itself sets no tracking or advertising cookies; that the
        dark-mode theme preference is stored in the browser via `localStorage`
        (which is NOT a cookie and never leaves the device); any cookies a CDN /
        host may set for security or performance; how to view and control cookies
        in the browser.
      - For the contact method: check the repo for an existing contact email or
        page. If none exists (it does not today), use the literal placeholder
        `[CONTACT EMAIL -- to be filled by Claude]` so it is obvious and greppable;
        do NOT invent an address.

Part B -- "Related calculators" sidebar on every calculator page
- [ ] New pure helper `src/lib/related-calculators.ts`: export a function that,
      given the current calculator slug, reads the `calculators` collection and
      returns up to N (use N = 5) OTHER standalone calculators -- same-category
      ones first, then fill from other categories to reach N. Must be
      deterministic (stable, e.g. alphabetical-by-slug within each group), must
      never include the current slug, must only include `standalone !== false`
      calculators, and must be typed (return ids as `CalculatorId`, plus title +
      description for display). Keep it pure (no Astro/DOM imports beyond
      `astro:content` `getCollection`).
- [ ] Restructure `src/pages/calculators/[slug]/index.astro` into a two-column
      shell, reusing the existing `.article-shell` / `.article-rail` CSS from
      `global.css` (or add a small parallel `.calc-shell` if the article grid does
      not fit -- but prefer reuse): main column = the existing kicker/title/lede +
      `<StatCalc variant="page">` + the optional teaching block (unchanged); right
      aside = a sticky "Related calculators" panel listing the helper's results as
      typed `<Link to={routes.calculator(id)}>` items (title + short description,
      same visual language as `.related-card` or the article rail).
- [ ] Confirm the sidebar is data-driven from the collection so EXISTING pages get
      it automatically and FUTURE calculators inherit it with zero per-page edits.

Part C -- Reusable related-link callout (varied intro phrase)
- [ ] New `src/components/RelatedLink.astro` matching the reference images: a soft
      blue, left-accent-bar callout with a right-arrow glyph, an italic intro
      phrase, then the link. Props: `to: RouteRef` (required), `label: string`
      (required, the visible link text), `intro?: string` (optional override).
      Render the link with the typed `Link.astro` so it stays gate-safe. Add the
      callout's CSS to `global.css`; respect dark mode and existing design tokens.
- [ ] Intro variation: add a small pure helper (either inside the component or a
      new `src/lib/related-intros.ts`) holding the approved phrase pool and a
      DETERMINISTIC picker keyed by a seed string (so the same seed always yields
      the same phrase, but different seeds spread across the pool and do not all
      collapse to one phrase). Approved phrase pool, exactly:
      "Worth reading next", "On a related note", "You may also find this useful",
      "For a related calculation", "Another helpful calculator is", "See also".
      Precedence: if `intro` prop is passed, use it verbatim; otherwise pick from
      the pool via the seed (seed can default to the `to` ref's id/kind).
- [ ] Add EXACTLY ONE demo usage to prove it renders end-to-end -- e.g. drop a
      `<RelatedLink>` into `src/content/calculator-content/standard-deviation.mdx`
      (import it in the MDX frontmatter the same way `StatCalc`/`Link` are imported
      elsewhere), pointing at a sensible related page (e.g. the variance
      calculator). Do NOT mass-edit the other teaching-block MDX files -- Claude
      retrofits the rest during content sessions.

**Constraints:**
- Stay in this repo; don't touch sibling folders.
- Do NOT edit `CLAUDE.md` (that is Claude's log -- record everything in this file's
  Work Log instead).
- No new runtime dependencies. `src/calc/**` stays pure and untouched.
- Every internal href goes through `routes` / `url()` / `Link.astro` -- never a raw
  `<a href="/...">` to an internal page (the link gate will fail it). External
  links and `mailto:` are fine as raw `<a>`.
- One H1 per page (the page title). Reuse existing design tokens / CSS; this is not
  a redesign.
- Keep the existing `<StatCalc>` embed and teaching-block rendering working exactly
  as before -- the sidebar is additive.

**Definition of done / how to verify:**
- `npx astro check` -> 0 errors / 0 warnings / 0 hints.
- `npm test` -> all green.
- `npm run build` -> succeeds AND `scripts/check-links.mjs` reports
  "0 violations" (no broken or non-trailing-slash internal links).
- Manually confirm in `dist/`:
  - `dist/privacy-cookie-policy/index.html` exists; the footer "Privacy & Cookies"
    link resolves to it; it has exactly one `<h1>`.
  - Every standalone `/calculators/{slug}/` page renders a non-empty "Related
    calculators" sidebar, none of which links to itself, and same-category items
    appear first.
  - The `<RelatedLink>` demo renders the styled callout on the standard-deviation
    calculator page.
- Do NOT commit or push unless explicitly told; just leave the working tree ready
  and set this task to `DONE` with a filled Work Log.

---

## Work Log  *(Codex writes -- what was actually done)*

- **Started:** 2026-06-26
- **Finished:** 2026-06-26

**What changed (files + where):**
- `src/lib/links.ts` -- added the typed `privacyCookiePolicy` route kind, `url()` mapping, and `routes.privacyCookiePolicy()` helper.
- `src/pages/privacy-cookie-policy/index.astro` -- added the combined Privacy Policy + Cookie Policy page with BaseLayout breadcrumbs, canonical route, one H1, H2 section halves, and the requested contact placeholder.
- `src/layouts/BaseLayout.astro` -- added the footer "Privacy & Cookies" link through `<Link>` and the typed route registry.
- `src/lib/related-calculators.ts` -- added a collection-driven helper returning up to 5 other standalone calculators, same-category first and deterministic by slug.
- `src/pages/calculators/[slug]/index.astro` -- reused the article shell/rail layout and added a sticky "Related calculators" sidebar populated from the helper with typed calculator links.
- `src/components/RelatedLink.astro` and `src/lib/related-intros.ts` -- added the reusable related-link callout and deterministic approved intro-phrase picker.
- `src/styles/global.css` -- added scoped styles for the calculator related list/card sizing and the blue accent related-link callout.
- `src/content/calculator-content/standard-deviation.mdx` -- added exactly one `<RelatedLink>` demo pointing to the variance calculator.
- `AGENTS.md` -- added the TASK-017 concise completion note to Codex work history.

**How to verify:**
- `npx astro check` -> passed: 0 errors, 0 warnings, 0 hints.
- `npm test` -> first sandboxed run hit expected `spawn EPERM`; approved rerun passed: 33 test files, 89 tests.
- `npm run build` -> passed; generated 56 pages; `check-links` scanned 56 pages / 1949 internal links and found 0 violations.
- Built HTML checks -> `dist/privacy-cookie-policy/index.html` exists, has exactly one `<h1>`, and the homepage footer includes `href="/privacy-cookie-policy/"` with "Privacy & Cookies".
- Built calculator checks -> all 25 standalone calculator pages have a non-empty related sidebar, no sidebar self-link, and same-category links appear before other-category fill links.
- Built callout check -> `dist/calculators/standard-deviation/index.html` contains `.related-link-callout`, "Try the variance calculator", and `href="/calculators/variance/"`.
- Local preview HTTP checks -> `/privacy-cookie-policy/` returned 200; `/calculators/standard-deviation/` included the related sidebar and callout markup. In-app browser connection was unavailable, so no screenshot pass was performed.

**Blocked / couldn't do / decisions made:**
- `apply_patch` could not initialize the Windows sandbox wrapper in this session, so bounded PowerShell file writes were used instead and inspected afterward.
- The in-app browser plugin failed before navigation; preview verification was done with local HTTP and built HTML inspection.
- `CLAUDE.md` and `src/lib/content-route-ids.ts` were already modified when this task began. `CLAUDE.md` was not edited. `content-route-ids.ts` has no content diff after build and was not reverted.
---

## Review  *(Claude writes -- accept or send back)*

- **Reviewed:** 2026-06-26
- **Verdict:** CLOSED

**Notes / what to improve:**
- Verified against artifacts, not just the Work Log. Re-ran all three gates clean
  from the current tree: `npx astro check` 0/0/0 (17 files), `npm test` 33 files /
  89 tests, `npm run build` 56 pages with `check-links` scanning 1949 internal
  links and reporting **0 violations**.
- **Part A (legal page):** `src/pages/privacy-cookie-policy/index.astro` built to
  `dist/privacy-cookie-policy/index.html` with exactly one `<h1>`, H2 halves
  (Privacy Policy / Cookie Policy) and H3 subsections per the outline; copy is
  accurate to the site (no accounts, Cloudflare edge logs, conditional analytics
  wording, localStorage `theme` correctly described as NOT a cookie). Contact left
  as the greppable `[CONTACT EMAIL -- to be filled by Claude]` placeholder (owed to
  Claude). Typed route added correctly in `links.ts` (`privacyCookiePolicy` kind +
  `url()` case + `routes` helper); footer "Privacy & Cookies" link confirmed in
  built `dist/index.html`.
- **Part B (related sidebar):** `related-calculators.ts` is pure, typed
  (`CalculatorId`), deterministic (alphabetical-by-id within group),
  same-category-first then fill to N=5, excludes self and `standalone === false`.
  Confirmed data-driven from the collection -> existing pages get it automatically,
  future calcs inherit it with no per-page work. Spot-checked the built SD page:
  rail lists 5 descriptive-statistics siblings (average, frequency-table, mean,
  mean-absolute-deviation, percentile), no self-link. Reuses the existing
  `.article-shell`/`.article-rail-right` grid; `<StatCalc>` + teaching block render
  unchanged.
- **Part C (RelatedLink callout):** component renders through the typed `Link.astro`
  (gate-safe), props `to`/`label`/`intro?` with `intro` precedence, deterministic
  seed-keyed picker over the exact approved phrase pool. CSS uses existing tokens
  (`--teal`, `--teal-soft`, `--ink`, `--serif`, `--mono`, `--verm`), dark-mode safe.
  Exactly one demo in `standard-deviation.mdx` pointing at the variance calculator;
  confirmed `.related-link-callout` + "For a related calculation" + the variance
  href in the built HTML.
- Accepted Codex's two sandbox notes (apply_patch wrapper / in-app browser
  unavailable) as environment quirks, not defects. `content-route-ids.ts` is a
  CRLF-only regen with no content diff (left as-is); `CLAUDE.md` untouched by Codex
  as instructed. Committed + pushed the whole TASK-017 changeset.
