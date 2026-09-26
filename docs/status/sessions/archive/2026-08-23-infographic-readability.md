# Session: applied-statistics infographic readability fix -- 2026-08-23

**Objective:** User flagged the `TaxonomyTree` diagram on
`/nonparametric-tests/` as unreadable (text scaled down to near-illegible
size) and asked for a scoped fix on that one article first, to become the
standard for fixing the rest of the applied-statistics infographics
afterward. This session is the follow-up: apply that standard sitewide.

**Root cause (established in the first pass, applies to every infographic):**
all infographics render as an SVG `viewBox` inside `_SvgFrame.astro`, wrapped
by `Figure.astro` (`overflow: hidden`, no horizontal-scroll fallback). SVG
text lives in the same coordinate space as the shapes, so whenever a
component's natural canvas width exceeds the article column (~736px), the
browser downscales the whole diagram -- including the embedded text -- to
fit. A wide-enough overshoot (the original `TaxonomyTree` case was ~2.5x)
makes the labels effectively unreadable.

**Completed:**
- Audited every infographic component (`src/components/applied/infographics/`)
  against its actual props across all 5 articles that use them, computing
  real rendered canvas widths instead of guessing:
  - `ProcessFlow` (horizontal): 4 steps (drift-detection) = 936px, 5 steps
    (forecast-accuracy, EDA) = 1168px, 7 steps (ab-test) = 1632px -- all badly
    over budget, the 7-step case as severe as the original TaxonomyTree bug.
  - `DecisionTree`: 3-leaf trees (EDA, forecast-accuracy) = 628px, fine;
    4-leaf tree (drift-detection) = 830px, ~11% over -- mild but real.
  - `ComparisonMatrix` (582px @ 4 cols) and `Scorecard` (700px, fixed-width
    design) were already within budget for current content.
  - `AnnotatedChart` is unused in any published article (only referenced by
    `/dev/applied-preview/`) -- left untouched.
- Fixed `ProcessFlow.astro`: horizontal-direction steps now wrap into rows of
  up to 3 (`columns = n<=3 ? n : n===4 ? 2 : 3`, the same rule `TaxonomyTree`
  uses), connected by elbow paths between rows instead of one continuous
  horizontal chain. Vertical-direction mode (already width-safe) is
  unchanged.
- Fixed `DecisionTree.astro`: node width and horizontal gap now scale down
  (floor 132px node / 16px gap) as leaf count grows, targeting a 720px
  canvas budget, with the `wrapText` character budget scaled to match so
  labels still fit inside the narrower boxes. Font sizes are never touched.
- Documented the rule and both techniques in `docs/DESIGN-SYSTEM.md` under a
  new "Applied-statistics infographics" subsection, so future infographic
  components (and future content passed into existing ones) follow the same
  constraint without rediscovering the bug.

**Files changed:**
- `src/components/applied/infographics/ProcessFlow.astro`
- `src/components/applied/infographics/DecisionTree.astro`
- `docs/DESIGN-SYSTEM.md` (new standards subsection)

**Verification:** Rebuilt and re-served `dist/`, fetched the 4 affected
articles and confirmed every infographic's rendered `viewBox` width now sits
at 472-719px (previously up to 1632px), all under the ~736px column budget.
Screenshot-verified the two most affected diagrams (the 7-step `ProcessFlow`
on `/how-to-design-an-ab-test/` and the 4-leaf `DecisionTree` on
`/data-drift-detection/`) at desktop and mobile viewports, light and dark
theme, via Playwright -- all render at full, legible size. `npx astro check`
(0 errors/warnings), `npm run build` (121 pages, 0 link violations, 0
meta-description violations) both clean.

**Assumptions:** `ComparisonMatrix` and `Scorecard` were deliberately left
unchanged since current content doesn't threaten their width budget --
`DESIGN-SYSTEM.md` flags that they'd need the same treatment if a future
article pushes column/label count high enough. `AnnotatedChart` carries the
same latent risk and should get the same treatment before its first real
use, not after.

**Next actions:** None pending from this session. If a future article uses
`ComparisonMatrix` with many columns, `Scorecard` with long labels, or
`AnnotatedChart` at all, check the new width-budget rule in
`docs/DESIGN-SYSTEM.md` before publishing.

**Context for next session:** `docs/DESIGN-SYSTEM.md` ("Applied-statistics
infographics" section) for the durable rule; this file for the specific
numbers; `src/components/applied/infographics/_SvgFrame.astro` and
`Figure.astro` for the underlying scaling mechanism (still unmodified by
design -- every fix works within the existing shared wrapper, not around
it).
