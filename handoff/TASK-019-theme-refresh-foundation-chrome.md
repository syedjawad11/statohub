Status: CLOSED
<!-- TODO | IN_PROGRESS | DONE | CHANGES_REQUESTED | CLOSED -->

# TASK-019 -- Theme refresh: design tokens, Newsreader font, global chrome

- **Owner of this stage:** Codex
- **Repo:** `Desktop/statohub/` (where the work happens)
- **Created:** 2026-06-27 by Claude

<!-- Authoring note (Claude): keep this file plain ASCII. Use `--` not an em
dash, `->` not an arrow, `...` not an ellipsis. Codex reads these files through
a Windows codepage; non-ASCII punctuation renders as mojibake and breaks its
apply_patch matching. -->

---

## Brief  *(Claude writes -- what Codex needs to execute)*

**Goal:** Re-skin the site to the new theme defined in the mockup
`statohub-theme-preview.html` (repo root). This task does the FOUNDATION ONLY:
the design-token palette, the serif font swap (Fraunces -> Newsreader), the
Tailwind color wiring, and the global chrome (top bar + footer + shared buttons
and utilities). The per-page views (home, article, calculator) are restyled in
TASK-020 and TASK-021. After this task the site must still build and look
coherent end to end -- every existing page picks up the new palette through the
shared `global.css` tokens.

This is a RESTYLE, not a rebuild. Do NOT change routes, content, the typed-link
system, the StatCalc DOM contract, or the dark-mode MECHANISM. Only colors,
fonts, and chrome styling change.

**Context / inputs:**
- **Visual spec (authoritative):** `statohub-theme-preview.html` at the repo
  root. Open it and port from it directly -- it contains the exact token block
  (its `<style>` `:root` and `html[data-theme="dark"]` rules), the top bar
  markup/CSS (`.topbar`, `.brand`, `.nav`, `.toggle`), the footer
  (`.foot`, `.foot-inner`), and the shared utilities (`.btn`, `.btn-pine`,
  `.btn-ghost`, `.eyebrow`, `.pill`, `.divider`). Treat its `<style>` block as
  the source of truth for values; copy glyphs (e.g. the brand dot, sun/moon
  SVGs) straight from the file so encoding stays correct.
- **Files you will touch:**
  - `package.json` -- swap the font dependency.
  - `src/styles/global.css` -- font @imports (lines ~1-11) + token block
    (lines ~17-54) + the global chrome / button / utility classes.
  - `tailwind.config.cjs` -- the `theme.extend.colors` keys (lines ~12-25) and
    `fontFamily` (already correct: serif/sans/mono via CSS vars).
  - `src/layouts/BaseLayout.astro` -- header (lines ~101-147) + footer
    (lines ~154-185). Leave the no-flash theme script (lines ~91-98) and the
    theme-toggle + mobile-menu handlers (lines ~186-214) FUNCTIONALLY intact.
  - Any `src/**/*.astro` / `*.mdx` that uses a renamed Tailwind color utility
    (see token-rename step) -- mechanical find/replace.

**Decisions already locked (do these exactly):**
1. **Keep the `.dark` class mechanism.** The mockup uses a `data-theme="light|dark"`
   attribute; we do NOT adopt that. Keep the existing `html.dark` selector,
   `localStorage` key `'theme'`, the no-flash inline script, and
   `darkMode: 'class'` in Tailwind. Translate the mockup's
   `html[data-theme="dark"]{...}` token overrides into an `html.dark{...}` block.
   For the sun/moon icon swap in the toggle, drive visibility from the `.dark`
   class (e.g. `html.dark .sun{display:none}` and
   `html:not(.dark) .moon{display:none}`), NOT from `data-theme`.
2. **Self-host Newsreader via @fontsource** (do NOT add the Google Fonts CDN
   `<link>` from the mockup head). Add the dependency `@fontsource/newsreader`
   and REMOVE `@fontsource/fraunces`. Mirror the existing @fontsource import
   pattern in `global.css`. Newsreader weights/styles needed (from the mockup
   font URL): 400, 500, 600, plus italic 400 and italic 500. Use the matching
   `@fontsource/newsreader/<weight>.css` and `/<weight>-italic.css` imports.
   Set `--serif: "Newsreader", Georgia, serif;`. Hanken Grotesk and JetBrains
   Mono are unchanged.
3. **Rename the color tokens to the new theme's semantic names** (the mockup is
   the spec the team will keep referencing, so code should match it). Replace the
   current token set with the new one, values straight from the mockup:

   | Old token (current) | New token | Light value | Notes |
   |---|---|---|---|
   | `--paper`     | `--paper`     | `#FBFAF7` | |
   | `--paper-2`   | `--paper-2`   | `#F4F2EC` | |
   | `--card`      | `--card`      | `#FFFFFF` | |
   | `--ink`       | `--ink`       | `#1A1C1F` | |
   | `--ink-soft`  | `--ink-2`     | `#52565C` | RENAME |
   | `--muted`     | `--ink-3`     | `#878C93` | RENAME |
   | `--line`      | `--line`      | `#E7E4DB` | |
   | `--line-2`    | `--line-2`    | `#D8D4C8` | |
   | `--teal`      | `--pine`      | `#0E6E64` | RENAME |
   | `--teal-soft` | `--pine-soft` | `#E4F0ED` | RENAME |
   | `--verm`      | `--clay`      | `#A6492F` | RENAME |
   | `--verm-soft` | `--clay-soft` | `#F4E8E2` | RENAME |
   | (new)         | `--brass`     | `#9C7C3A` | NEW accent |
   | (new)         | `--focus`     | `#0E6E64` | NEW |

   Also add the mockup's `--shadow`, `--shadow-lift`, `--r: 14px`, and
   `--maxw: 1240px` (the current `--max: 1140px` becomes 1240px; if `--max` is
   referenced elsewhere either rename it to `--maxw` everywhere or keep `--max`
   as an alias set to the new width -- pick one and be consistent). Copy the
   full `html.dark` override values from the mockup's dark block.

4. **Update `tailwind.config.cjs` color keys to match the new token names** so
   utilities exist: `paper`, `paper-2`, `card`, `ink`, `ink-2`, `ink-3`, `line`,
   `line-2`, `pine`, `pine-soft`, `clay`, `clay-soft`, `brass`, `focus` -- each
   `'var(--<token>)'`. Then do a repo-wide mechanical rename of every Tailwind
   utility that used an old color name, across `src/**` (`.astro`, `.mdx`,
   `.ts`): `verm`->`clay`, `verm-soft`->`clay-soft`, `teal`->`pine`,
   `teal-soft`->`pine-soft`, `ink-soft`->`ink-2`, `muted`->`ink-3` (e.g.
   `text-verm` -> `text-clay`, `bg-teal-soft` -> `bg-pine-soft`,
   `text-ink-soft` -> `text-ink-2`, `text-muted` -> `text-ink-3`, `border-line-2`
   stays). Also rename any raw `var(--verm)` / `var(--teal)` / `var(--ink-soft)`
   / `var(--muted)` references inside `global.css` component classes. A Tailwind
   class that references a removed color silently produces no style (no build
   error), so this rename must be exhaustive -- see the grep gate in DoD.

5. **Top bar:** restyle the existing header to the mockup `.topbar` look (sticky,
   translucent blur, `--line` bottom border; serif `.brand` with the clay
   `.dot`; `.nav` link pills with `--pine` active color; the `.toggle` button).
   Keep the existing typed `<Link>` nav targets and the existing
   `#theme-toggle` button id + its handler. The mockup's search box
   (`.search` with the Cmd+K kbd) is DECORATIVE and there is no search endpoint
   -- do NOT add it. Keep the existing mobile menu / hamburger behavior; restyle
   only. Keep the existing "Browse calculators" CTA if present (style it as
   `.btn-pine`).
6. **Footer:** restyle the existing footer to the mockup `.foot` look (4-column
   grid: brand + tagline, Topics, Calculators, Site; `.foot-bottom` line). Keep
   the existing typed links and columns (including the Privacy & Cookies link to
   `/privacy-cookie-policy/`). Restyle only -- do not drop or re-point links.
7. **Shared utilities + buttons:** port `.btn` / `.btn-pine` / `.btn-ghost`,
   `.eyebrow`, `.pill`, `.divider` from the mockup into `global.css`. Map the
   site's existing PRIMARY button to the pine style. To avoid breaking the
   not-yet-restyled pages, KEEP all existing page-component class names that
   live in `global.css` (e.g. `.home-hero`, `.fused-card`, `.article-shell`,
   `.statcalc-*`, `.related-card`, `.reading-progress`, etc.) -- they will be
   reworked in TASK-020/021, and in the meantime they should keep rendering
   (just with the new token colors). If the existing primary button class is
   `.btn-primary`, you may either restyle it in place to the pine look or add
   `.btn-pine` and keep `.btn-primary` as an alias; do not remove classes the
   current pages depend on.

**Out of scope (later tasks -- do NOT do here):**
- Home view markup/figure, catalog cards, band, recently-published (TASK-020).
- Article drop cap, section markers, note callouts, data-table styling, fused
  in-post calculator, TOC restyle (TASK-020).
- Calculator panel layout + StatCalc internal restyle (TASK-021).
- Any change to `src/components/StatCalc.astro`, `statcalc/client.ts`, routes,
  content, or `src/lib/links.ts`.

**Constraints:**
- Stay in this repo; don't touch sibling folders. Do not edit `CLAUDE.md`.
- No new runtime dependency other than `@fontsource/newsreader`. Remove
  `@fontsource/fraunces`. Run `npm install` so the lockfile updates.
- Do not break the trailing-slash / typed-link contract. All internal links stay
  typed `<Link>` / `routes` / `url()`.
- Preserve accessibility: keep `:focus-visible` outlines (the mockup defines one
  with `--focus`), `aria-*` on the toggle and menu, and color contrast.
- Respect `prefers-reduced-motion` (the mockup already gates animations).

**Definition of done / how to verify:**
- `npm install` clean; `package.json` shows `@fontsource/newsreader`, no
  `@fontsource/fraunces`.
- `npx astro check` -> 0 errors / 0 warnings / 0 hints.
- `npm test` -> all green (no behavior changed).
- `npm run build` -> succeeds, `check-links` reports **0 violations**.
- Token-rename completeness grep returns NOTHING under `src/`:
  `grep -rEn "(--verm|--teal|--ink-soft|--muted|\b(text|bg|border|fill|stroke|ring|from|to|via)-(verm|teal|ink-soft|muted)\b)" src/`
  (an empty result proves no orphaned old-token references remain).
- `npm run preview` and eyeball `/`, a built article (e.g.
  `/frequency-table/`), and `/calculators/standard-deviation/`: the new
  palette + Newsreader serif + the restyled top bar and footer render; the dark
  toggle still flips with no flash on reload and persists; the StatCalc on the
  calculator page still computes (unchanged).

---

## Work Log  *(Codex writes -- what was actually done)*

- **Started:** 2026-06-27
- **Finished:** 2026-06-27

**What changed (files + where):**
- `package.json` / `package-lock.json` -- replaced `@fontsource/fraunces` with `@fontsource/newsreader` and updated the lockfile via npm.
- `src/styles/global.css` -- swapped Newsreader imports, replaced the token block with the preview palette/dark overrides, added `--brass`, `--focus`, `--shadow-lift`, `--r`, `--maxw`, ported shared `.btn`, `.btn-pine`, `.btn-ghost`, `.eyebrow`, `.pill`, `.divider`, and restyled the shared top bar/footer while keeping existing page classes.
- `tailwind.config.cjs` -- renamed Tailwind color aliases to `ink-2`, `ink-3`, `pine`, `pine-soft`, `clay`, `clay-soft`, `brass`, and `focus`.
- `src/layouts/BaseLayout.astro` -- renamed the global chrome markup to the preview-style `topbar`, `topbar-inner`, `toggle`, `sun`/`moon`, `foot`, and `foot-inner` classes while preserving typed links, `#theme-toggle`, `#menu-toggle`, ARIA, localStorage theme behavior, and mobile menu wiring.
- `src/**` -- mechanically renamed old token utilities/references (`teal`, `verm`, `ink-soft`, `muted`) to the new semantic names.

**How to verify:**
- `npm install @fontsource/newsreader --save-dev` -- completed; npm reported existing audit findings only.
- `npm uninstall @fontsource/fraunces --save-dev` -- completed; npm reported existing audit findings only.
- `npx astro check` -- exit 0, 0 errors / 0 warnings / 0 hints.
- `npm test` -- 33 test files passed, 89 tests passed.
- `npm run build` -- succeeded; `check-links` scanned 56 pages / 2048 internal links / 0 violations.
- `rg -n "(--verm|--teal|--ink-soft|--muted|\b(text|bg|border|fill|stroke|ring|from|to|via)-(verm|teal|ink-soft|muted)\b)" src` -- no matches.
- Built HTML spot checks confirmed `topbar`, `btn-pine`, `foot`, `theme-toggle`, and StatCalc hooks on `/calculators/standard-deviation/`.
- `npm run preview -- --host 127.0.0.1 --port 4321` -- local preview responded 200 at `/`.

**Blocked / couldn't do / decisions made:**
- The in-app browser was unavailable in this session (`agent.browsers.list()` returned `[]`), so real visual eyeballing was limited to local preview HTTP and built HTML inspection for this task.
---

## Review  *(Claude writes -- accept or send back)*

- **Reviewed:** 2026-06-27
- **Verdict:** CLOSED

**Notes / what to improve:**
- Verified against artifacts, not just the Work Log. `package.json` shows
  `@fontsource/newsreader` and no `@fontsource/fraunces`; `global.css` imports
  Newsreader 400/500/600 + 400i/500i and sets `--serif: "Newsreader", ...`.
- Token-rename completeness grep over `src/` returns NOTHING -- no orphaned
  `--verm`/`--teal`/`--ink-soft`/`--muted` or old-token Tailwind utilities remain.
- Dark-mode mechanism preserved: still `html.dark` + localStorage `'theme'` +
  the no-flash inline script; no `data-theme` leakage in built HTML.
- Gates green: astro check 0/0/0, npm test 89/89, build 56 pages / 0 link
  violations. Good work.
