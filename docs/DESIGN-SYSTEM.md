# Design System

> Palette, typography, and component patterns as actually shipped in
> `src/styles/global.css` (verified against the live file 2026-07-05, post
> theme-refresh TASK-019/020/021). This describes what IS, not a spec to
> re-derive from scratch -- if this drifts from `global.css`, the CSS wins;
> fix this file.

## Fonts

Self-hosted via `@fontsource` (never a Google Fonts CDN link, so no
render-blocking external request):

| Role | Font | Weights loaded |
|---|---|---|
| `--serif` | Newsreader | 400, 500, 600, 400-italic, 500-italic |
| `--sans` | Hanken Grotesk | 400, 500, 600, 700 |
| `--mono` | JetBrains Mono | 400, 500, 600 |

Serif = headings/brand/eyebrow numerals; sans = body copy; mono = kickers,
labels, breadcrumbs, code, calculator inputs.

## Color tokens

CSS custom properties on `:root` (light) and `html.dark` (dark) --
**`html.dark` is the mechanism, never the mockup's `data-theme` attribute.**
Toggled by a persisted `localStorage('theme')` + a pre-paint inline script in
`BaseLayout.astro` to avoid a flash of the wrong theme.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--paper` | `#FBFAF7` | `#14161A` | Page background |
| `--paper-2` | `#F4F2EC` | `#191C21` | Alt section background |
| `--card` | `#FFFFFF` | `#1C2026` | Card/panel background |
| `--ink` | `#1A1C1F` | `#EDEAE2` | Primary text |
| `--ink-2` | `#52565C` | `#A9ADB4` | Secondary text |
| `--ink-3` | `#70747A` | `#82878E` | Tertiary text / meta (WCAG-AA-fixed, TASK-023) |
| `--line` / `--line-2` | `#E7E4DB` / `#D8D4C8` | `#2A2E35` / `#363B43` | Borders |
| `--pine` | `#0E6E64` | `#4FB7AB` | Primary brand accent -- "compute" side of the wedge, links, primary buttons |
| `--clay` | `#A6492F` | `#D98062` | Secondary brand accent -- "teach" side of the wedge, emphasis italics, callout bars |
| `--brass` | `#8C6F34` | `#C7A35E` | Tertiary accent -- hover borders, stat highlights (WCAG-AA-fixed on light, TASK-023) |
| `--focus` | = `--pine` | = `--pine` (dark value) | `:focus-visible` outline |

`--pine-soft` / `--clay-soft` are tinted backgrounds for badges/callouts paired
with their base color. `color-scheme` is set explicitly per mode so native
form controls theme correctly.

**The teach/compute duality is a deliberate color convention, not decoration:**
clay = teaching/explanation surfaces (callouts, the `.fused-teach` panel, drop
caps), pine = calculation/tool surfaces (`.statcalc-head`, buttons, the
`.fused-compute` panel, "live" pulse dot). Reusing this pairing correctly is
part of expressing [[0001-wedge-model]] visually.

## Layout

- `--maxw: 1240px` site-wide max width (`.site-wrap`).
- `--r: 14px` standard corner radius.
- Article body measure: ~760px column + a `220-280px` sticky right rail
  (`.article-shell` / `.article-grid.article-shell`), collapsing to a single
  660px column under 720px viewport width.
- Two shadow tokens: `--shadow` (resting cards) and `--shadow-lift` (hero
  figures, hover-lifted cards) -- both have light/dark variants.

## Key component patterns

- **`.statcalc-card` / `.panel`** -- the calculator chrome. `.panel-grid`
  splits into `.panel-in` (inputs) / `.panel-out` (results) on desktop,
  stacks under 980px. The pine "live" pulse dot (`@keyframes live-pulse`) is
  disabled under `prefers-reduced-motion: reduce`.
- **`.fused-card`** -- the homepage/article wedge demonstration: `.fused-teach`
  (clay-tinted, explanation) side-by-side with `.fused-compute` (card
  background, embeds the real `<StatCalc variant="embed">`).
- **`.related-link-callout`** -- the pine-left-border "related link" box
  (rendered by `RelatedLink.astro`); see [[0010-woven-related-link-callouts]]
  for the content rule (3-4 woven through a page, varied intro phrasing, never
  dumped at the end).
- **`.article-body h2::before` / drop cap (`::first-letter`)** -- editorial
  flourishes on the article view; the drop cap only applies to the body's
  first paragraph.
- **`.toc` / `.article-toc`** -- sticky scroll-spy table of contents, active
  link gets a pine left-border; built from real `entry.render().headings`
  (depth === 2), not a hand-maintained list.

## Accessibility

- All interactive elements get a 2px `--focus`-colored outline via
  `:focus-visible` (never removed, never `outline: none` without a
  replacement).
- `prefers-reduced-motion: reduce` disables `scroll-behavior: smooth`, CSS
  transitions, and the calculator's live-pulse animation.
- Contrast: `scripts/check-contrast.mjs` (added TASK-023) computes WCAG
  luminance/contrast ratios directly from the live CSS tokens and runs in CI
  before build/deploy -- if you change a color token, that gate is the source
  of truth on whether it still passes AA, not visual inspection.

## Dark mode mechanism (do not change without a decision)

`html.dark` class, toggled by a button, persisted to `localStorage('theme')`,
applied by an inline pre-paint `<script>` in the `<head>` of
`BaseLayout.astro` so there is no flash of the wrong theme on load. This
predates and survived the TASK-019 theme refresh unchanged -- the refresh only
changed which tokens live under `html.dark`, not the toggling mechanism
itself.
