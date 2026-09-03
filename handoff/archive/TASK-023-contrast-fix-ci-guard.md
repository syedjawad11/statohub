Status: CLOSED
<!-- TODO | IN_PROGRESS | DONE | CHANGES_REQUESTED | CLOSED -->

# TASK-023 -- Contrast fix (WCAG AA) + CI guard

- **Owner of this stage:** Codex
- **Repo:** `Desktop/statohub/` (where the work happens)
- **Created:** 2026-07-05 by Claude

<!-- Authoring note (Claude): keep this file plain ASCII. Use `--` not an em
dash, `->` not an arrow, `...` not an ellipsis. Codex reads these files through
a Windows codepage; non-ASCII punctuation renders as mojibake and breaks its
apply_patch matching. -->

---

## Brief  *(Claude writes -- what Codex needs to execute)*

**Goal:** Fix the three text-color tokens that `docs/audit/2026-07-workspace-audit.md`
found failing WCAG AA contrast (4.5:1 for normal text) against their real backgrounds,
then add an automated CI check so a future token edit can't silently regress this again.

**Context / inputs:**
- `docs/audit/2026-07-workspace-audit.md` -- source of the three failing measurements.
- `src/styles/global.css` lines 19-63 (the `:root` and `html.dark` token blocks) --
  this is where the token values live.
- `.github/workflows/deploy.yml` -- existing CI gate sequence
  (`astro check` -> `vitest` -> `npm run build` -> deploy) to extend.

**Current failing values (confirmed against the live file):**

| Token | Theme | Value | Background | Background token | Measured contrast | Needed |
|---|---|---|---|---|---|---|
| `--ink-3` | light | `#878C93` | `--paper` (also used on `--card`) | `#FBFAF7` / `#FFFFFF` | 3.24:1 | >= 4.5:1 |
| `--ink-3` | dark | `#767B83` | `--card` | `#1C2026` | 3.84:1 | >= 4.5:1 |
| `--brass` | light | `#9C7C3A` | `--paper` | `#FBFAF7` | 3.76:1 | >= 4.5:1 |

`--ink-3` is used (at minimum) by `.eyebrow`, `.article-crumb`, `.foot-grid a`,
`.article-meta`, and `.cat .meta b` -- check the actual rendered background each of
these sits on (some may be on `--card` rather than `--paper`) and verify the fixed
value passes against the *worst-case* (lowest-contrast) real background it appears on,
not just one of them. `--brass` in dark theme (`#C7A35E` on `--card:#1C2026`) is NOT
flagged by the audit -- leave the dark `--brass` value alone unless your own
computation shows it also fails, in which case fix it too and note it in the Work Log.

**Deliverables:**

1. **Fix the token values** in `src/styles/global.css` (`:root` for light-theme tokens,
   `html.dark` for dark-theme tokens). Adjust `--ink-3` (both themes) and `--brass`
   (light theme) by darkening (light theme) or lightening (dark theme) in small steps,
   computing the real WCAG contrast ratio at each step, and stop at the first value
   that reaches >= 4.5:1 against the actual background(s) it is used on. Stay as close
   as possible to the current hue/character of the color -- this is a contrast fix, not
   a rebrand; do not pick an arbitrary safe gray if a closer-to-original value also
   passes.

   Use the real WCAG formulas, not a guess:
   ```
   relative luminance (per channel c in sRGB, 0-1 range):
     c_lin = c/12.92                         if c <= 0.03928
     c_lin = ((c + 0.055) / 1.055) ^ 2.4      otherwise
     L = 0.2126*R_lin + 0.7152*G_lin + 0.0722*B_lin

   contrast ratio (L1 = lighter of the two luminances, L2 = darker):
     ratio = (L1 + 0.05) / (L2 + 0.05)
   ```

2. **CI guard script** (`scripts/check-contrast.mjs`, plain Node, no new
   dependency needed -- implement the formula above directly, it's about 20 lines).
   Hardcode the table of token-pair-and-background checks (the same set from the table
   above, plus any additional pair you fixed per the note above), compute each
   contrast ratio with the same formula, and exit with a non-zero status code printing
   which pair(s) failed if any ratio is below 4.5:1. This script should read the actual
   hex values out of `src/styles/global.css` (parse the `:root` / `html.dark` blocks) or,
   if simpler and equally robust, maintain its own small hardcoded copy of the pairs it
   checks -- your choice, but if you hardcode values, the script's failure message must
   make it obvious which CSS variables need to be checked by a human, so this doesn't
   go stale silently.

3. **Wire the script into CI** -- add a step to `.github/workflows/deploy.yml` that runs
   `node scripts/check-contrast.mjs` after the existing `astro check` / `vitest` steps
   and before the build/deploy steps, so a failing contrast check blocks deploy the same
   way a failing test does today.

**Constraints:**
- Stay in this repo; don't touch sibling folders.
- Touch only `src/styles/global.css`, the new `scripts/check-contrast.mjs`, and
  `.github/workflows/deploy.yml`. Do not touch any other component styling.
- No new npm dependency -- implement the luminance/contrast math directly.
- Do not touch any token other than the ones identified as failing (per the note above,
  you may also fix `--brass` dark if your own computation shows it fails, but nothing else).

**Definition of done / how to verify:**
- `node scripts/check-contrast.mjs` exits 0 and prints all checked pairs passing >= 4.5:1.
- Manually break one token value temporarily and re-run the script to confirm it exits
  non-zero and clearly names the failing pair -- then revert that temporary break before
  finishing (this is just to prove the guard actually catches a regression; don't leave
  the broken value in place).
- `.github/workflows/deploy.yml` runs the script as a gate step (visually confirm the
  YAML diff places it before the deploy step).
- `npm run build` and `npm test` still pass with the new token values.
- **Do not attempt to visually judge whether the new colors "look right" in the
  browser** -- that is explicitly the user's job to do after this task closes. Just
  report the exact before/after hex values for each changed token in the Work Log so
  the user can eyeball both themes quickly.

---

## Work Log  *(Codex writes -- what was actually done)*

- **Started:** 2026-07-05
- **Finished:** 2026-07-05

**What changed (files + where):**
- `src/styles/global.css` -- updated the three failing color tokens only:
  - light `--ink-3`: `#878C93` -> `#70747A` (4.50:1 on `--paper:#FBFAF7`, 4.70:1 on `--card:#FFFFFF`).
  - dark `--ink-3`: `#767B83` -> `#82878E` (4.52:1 on `--card:#1C2026`).
  - light `--brass`: `#9C7C3A` -> `#8C6F34` (4.53:1 on `--paper:#FBFAF7`, 4.73:1 on `--card:#FFFFFF`).
  - dark `--brass:#C7A35E` was checked against `--card:#1C2026` and left unchanged because it passes at about 6.88:1.
- `scripts/check-contrast.mjs` -- added a no-dependency WCAG AA contrast guard. It reads live token values from `src/styles/global.css`, computes relative luminance/contrast directly, reports every checked pair, and exits non-zero on failures below 4.5:1.
- `.github/workflows/deploy.yml` -- added `node scripts/check-contrast.mjs` after unit tests and before `npm run build`, so contrast failures block deploy before build/deploy.

**How to verify:**
- `node scripts/check-contrast.mjs` -- passed all checked pairs:
  - light `--ink-3 #70747A` on `--paper #FBFAF7`: 4.50:1.
  - light `--ink-3 #70747A` on `--card #FFFFFF`: 4.70:1.
  - dark `--ink-3 #82878E` on `--card #1C2026`: 4.52:1.
  - light `--brass #8C6F34` on `--paper #FBFAF7`: 4.53:1.
  - light `--brass #8C6F34` on `--card #FFFFFF`: 4.73:1.
- Temporary regression proof: changed light `--ink-3` back to `#878C93`, reran `node scripts/check-contrast.mjs`, and it exited non-zero naming both failing pairs (`--paper` 3.24:1 and `--card` 3.39:1). Restored `#70747A` immediately afterward and reran the script successfully.
- `npx astro check` -- passed: Result (17 files), 0 errors, 0 warnings, 0 hints.
- `npm test` -- passed with process-spawn approval after the earlier expected sandbox `spawn EPERM`: 33 test files passed, 89 tests passed.
- `npm run build` -- passed: generated route ids, Astro built 56 pages, `check-links` scanned 56 pages / 2062 internal links and found 0 violations.
- Confirmed `.github/workflows/deploy.yml` places the contrast check after `Unit tests` and before `Build (runs route-id gen + astro build + link gate)`.

**Blocked / couldn't do / decisions made:**
- No visual judgment was made on the revised colors, per brief. The Work Log reports exact before/after hex values and computed ratios only.
- The chosen light `--ink-3` differs slightly from the read-only subagent suggestion (`#70747A` vs. `#6F747B`) because my stepwise darkening script preserved the original RGB proportions and stopped at the first passing value. Both pass; `#70747A` is the value committed and checked by `scripts/check-contrast.mjs`.

---

## Review  *(Claude writes -- accept or send back)*

- **Reviewed:** 2026-07-05
- **Verdict:** CLOSED

**Notes / what to improve:**
- Re-ran `node scripts/check-contrast.mjs` myself; all 5 pairs pass >=4.5:1,
  matching the reported ratios exactly.
- Diffed `src/styles/global.css` and confirmed the hex changes match the
  Work Log exactly (light/dark `--ink-3`, light `--brass`); dark `--brass`
  correctly left untouched.
- Diffed `.github/workflows/deploy.yml` and confirmed the contrast check
  step sits after "Unit tests" and before "Build".
- Script logic reviewed: implements the real WCAG relative-luminance formula
  directly (no shortcuts), reads live token values out of `global.css` so it
  can't go stale.
- No issues found.
