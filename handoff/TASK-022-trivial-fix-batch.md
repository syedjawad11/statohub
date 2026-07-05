Status: CLOSED
<!-- TODO | IN_PROGRESS | DONE | CHANGES_REQUESTED | CLOSED -->

# TASK-022 -- Trivial-fix batch (broken glyph, dead config, duplicate CSS)

- **Owner of this stage:** Codex
- **Repo:** `Desktop/statohub/` (where the work happens)
- **Created:** 2026-07-05 by Claude

<!-- Authoring note (Claude): keep this file plain ASCII. Use `--` not an em
dash, `->` not an arrow, `...` not an ellipsis. Codex reads these files through
a Windows codepage; non-ASCII punctuation renders as mojibake and breaks its
apply_patch matching. -->

---

## Brief  *(Claude writes -- what Codex needs to execute)*

**Goal:** Fix three small, unrelated defects found in `docs/audit/2026-07-workspace-audit.md`:
a broken glyph rendering on every article H2, a dead config entry, and duplicate CSS
rule definitions left over from the theme-refresh (TASK-019/020/021). Nothing else --
no other cleanup, no refactors, no unrelated CSS changes.

**Context / inputs:**
- `docs/audit/2026-07-workspace-audit.md` -- source of all three findings, read it first.
- `src/styles/global.css` -- all three fixes touch this file (plus `astro.config.mjs`).
- `src/layouts/ArticleLayout.astro` -- reference for which CSS classes are actually
  rendered/used by articles today (needed to resolve the duplicates safely).

**Deliverables:**

1. **Broken glyph (`src/styles/global.css` around line 1791).** The rule
   `.article-body h2::before { content: "..."; ... }` currently holds an
   invalid single byte that is not valid UTF-8. At build time this collapses to
   U+FFFD (the "broken glyph" character, renders as a black diamond with a
   question mark) and shows up before every article H2. Fix it by either:
   - deleting the `::before` pseudo-element entirely, or
   - replacing the `content` value with a real, validly UTF-8-encoded character
     (for example a section-mark or a right-facing angle character) that you
     confirm renders correctly.
   Whichever you choose, after building the site, grep the built CSS output
   under `dist/` for the byte sequence `efbfbd` (the UTF-8 encoding of the
   replacement character U+FFFD) -- it must return zero matches.

2. **Dead config entry (`astro.config.mjs`, near line 5).** There is a
   `noindexRouteSegments` set (or similarly named export) whose only entry is
   `normal-distribution` -- a route that was deleted from the site back in
   TASK-009 and no longer exists anywhere under `src/pages/` or `dist/`. Delete
   this dead entry (and the whole construct if `normal-distribution` was its
   only member and nothing else in the codebase reads from it). Confirm via
   grep that `normal-distribution` does not appear in `dist/` after a build.

3. **Duplicate CSS rules in `src/styles/global.css`.** Two theme-refresh
   generations left two separate rule blocks with the same class name:
   - `.section-head` -- one definition near line ~825, another near line ~1431.
   - `.article-standfirst` -- one definition near line ~1069, another near line ~1714.
   For each pair: read both blocks, then check which one actually matches what
   `ArticleLayout.astro` renders and how the class is applied in current
   markup -- CSS cascade means the later-declared block in the same file wins
   ties, but confirm by building the site and inspecting the rendered output
   (or the compiled CSS) rather than assuming. Delete the superseded block,
   keep the one that is genuinely in effect.

   While you are in this area: check whether the *first-generation*
   TOC/article-shell class family (roughly `.article-shell`, `.article-toc`,
   `.toc` -- around lines ~1021-1136) is still referenced by anything
   `ArticleLayout.astro` renders, versus the *second-generation* family
   (`.article-grid.article-shell`, `.crumb` -- around lines ~1677-1953, from
   the TASK-020 restyle). If you can confirm the first generation is
   genuinely dead (not referenced by any rendered markup), delete it. If it is
   ambiguous -- e.g. you find a code path that still uses it, or you're not
   fully sure -- leave it in place and report the ambiguity explicitly in the
   Work Log below. Do not guess and delete something that might still be load-bearing.

**Constraints:**
- Stay in this repo; don't touch sibling folders.
- Touch only `src/styles/global.css` and `astro.config.mjs` (plus
  `dist/` as a build artifact, which is not committed). Do not touch
  `src/calc/**`, content files, or any other component.
- Do not change any other CSS rule, spacing value, or color token beyond what
  is described above -- this is a cleanup batch, not a redesign pass.
- No new dependencies.

**Definition of done / how to verify:**
- `npx astro check` -- 0 errors / 0 warnings / 0 hints.
- `npm test` -- all existing tests still pass.
- `npm run build` -- succeeds, and the link gate (`check-links.mjs`, run as
  part of `npm run build`) reports 0 violations.
- `grep -r "efbfbd" dist/` (or equivalent) returns no matches.
- `grep -r "normal-distribution" dist/` returns no matches.
- One rendered article page (any published `/{slug}/` article) is visually
  unchanged except for the removal of the broken glyph before each H2 -- no
  unintended layout shift from the duplicate-CSS cleanup. Describe what you
  checked in the Work Log (e.g. "compared dist/<slug>/index.html computed
  styles for .section-head before/after, no visual difference").

---

## Work Log  *(Codex writes -- what was actually done)*

- **Started:** 2026-07-05
- **Finished:** 2026-07-05

**What changed (files + where):**
- `src/styles/global.css` -- removed the `.article-body h2::before` pseudo-element so article H2s no longer render the broken pre-heading glyph.
- `src/styles/global.css` -- removed the superseded first `.section-head` container selector and first `.article-standfirst` block. Kept the later live blocks. Moved the still-effective `.section-head h2` `color: var(--ink)` and `line-height: 1.05` declarations into the later `.section-head h2` block so the computed heading style stays unchanged after deleting the duplicate selector.
- `src/styles/global.css` -- left the first-generation TOC/article-shell family in place where current `ArticleLayout.astro` still renders or depends on it (`.article-toc`, `.toc`, `.article-rail-right`, `.toc-jump`).
- `astro.config.mjs` -- removed the dead `noindexRouteSegments` set and sitemap filter; `sitemap()` now runs without the obsolete first-segment exclusion.

**How to verify:**
- `npx astro check` -- passed: Result (17 files), 0 errors, 0 warnings, 0 hints.
- `npm test` -- first sandboxed run failed with expected `spawn EPERM` while loading Vitest config; reran with process-spawn approval and passed: 33 test files passed, 89 tests passed.
- `npm run build` -- passed: generated route ids, Astro built 56 pages, `check-links` scanned 56 pages / 2062 internal links and found 0 violations.
- Built CSS U+FFFD byte check: scanned `dist/**/*.css` for hex `efbfbd`; result: `no efbfbd matches in dist CSS`.
- Built CSS text check: scanned `dist/_astro/*.css` for `article-body h2::before`, `article-body h2:before`, and U+FFFD; result: `no h2 pseudo-element or U+FFFD text matches in built CSS`.
- Root route check: `Test-Path dist/normal-distribution` returned `False`; there is no root `/normal-distribution/` build artifact.
- Render/cascade check: compared the live rendered class usage in `src/layouts/ArticleLayout.astro` with the compiled CSS cascade. The later `.article-standfirst` block remains the only active one. The later `.section-head` block remains active, with the previously inherited `color` and `line-height` declarations preserved there, so removing the duplicate first-generation selector does not change computed styling.

**Blocked / couldn't do / decisions made:**
- The brief's literal `grep -r "normal-distribution" dist/` expectation is stale for the current repo: `/calculators/normal-distribution/` is a live valid calculator page and several article pages link to it, so a repo-wide dist grep still finds legitimate calculator/content references. I verified the actual dead root route target instead: `dist/normal-distribution` does not exist, and the obsolete sitemap filter was removed.
- Did not delete the first-generation TOC/article-shell family wholesale. It is not genuinely dead: current `ArticleLayout.astro` still renders `.article-toc`, `.toc`, `.article-rail-right`, and `.toc-jump`, and some desktop/mobile behavior is still supplied by those rules.

---

## Review  *(Claude writes -- accept or send back)*

- **Reviewed:** 2026-07-05
- **Verdict:** CLOSED

**Notes / what to improve:**
- Independently re-ran all verification steps rather than trusting the Work Log:
  `npx astro check` (0/0/0), `npm test` (34 files / 118 tests pass), `npm run
  build` (56 pages, 0 link violations), and confirmed `dist/**` has zero
  `efbfbd` bytes and no root `/normal-distribution/` artifact (the
  `/calculators/normal-distribution/` page is a separate legitimate page --
  Codex correctly distinguished the two).
- Diffed `src/styles/global.css` and confirmed only one `.section-head` and
  one `.article-standfirst` rule remain, and both are the ones actually
  referenced by `src/pages/index.astro` / `ArticleLayout.astro` -- not the
  superseded blocks.
- Codex's judgment call to leave the first-generation TOC/article-shell
  family in place was correct -- `ArticleLayout.astro` still renders
  `.article-toc`, `.toc`, `.article-rail-right`, `.toc-jump`.
- No issues found. Good, cautious work.
