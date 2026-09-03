Status: CLOSED
<!-- TODO | IN_PROGRESS | DONE | CHANGES_REQUESTED | CLOSED -->

# TASK-033 -- Applied living preview route

- **Owner of this stage:** Codex
- **Repo:** `Desktop/statohub/` (where the work happens)
- **Created:** 2026-08-16 from the approved Claude restructure plan

---

## Brief  *(approved plan translated into the handoff queue)*

**Goal:** Finish the permanent noindex living style guide at the planned `/dev/applied-preview/` URL, exercising all eight Applied modules and all six infographic types without publishing article prose.

**Context / inputs:**
- Tasks 028 and 029 built the full catalog at the interim `/dev/preview/` path.
- `astro.config.mjs` already excludes `/dev/` from the sitemap and `robots.txt` already disallows `/dev/`.

**Deliverables:**
- [x] Move the existing preview page from `src/pages/dev/preview/index.astro` to `src/pages/dev/applied-preview/index.astro` with imports corrected.
- [x] Keep every existing module and infographic sample, `noindex`, light/dark compatibility, numbered figures, and responsive table behavior.
- [x] Remove the obsolete interim `/dev/preview/` source route so there is one living style guide, not duplicate pages.

**Constraints:**
- Do not modify module or infographic components, layouts, global CSS, sitemap config, robots, content, homepage, or content-ops.
- Do not write an article. The page is a component catalog only.
- Use `apply_patch` for the move and do not disturb other agents' edits.

**Definition of done / how to verify:**
- Build produces `dist/dev/applied-preview/index.html`, not `dist/dev/preview/index.html`.
- The preview remains noindex, absent from the sitemap, and contains all 8 framed infographic instances with unique accessible ids.

---

## Work Log  *(Codex writes -- what was actually done)*

- **Started:** 2026-08-16
- **Finished:** 2026-08-16

**What changed (files + where):**
- Moved the complete living component catalog from
  `src/pages/dev/preview/index.astro` to
  `src/pages/dev/applied-preview/index.astro`; the destination has the same
  directory depth, so all existing relative imports remain correct.
- Retained all eight Applied module examples, all six infographic types, the
  eight framed infographic instances, numbered figures, responsive table
  samples, scoped token-based styling, and `noindex`. Updated the document
  title to "Applied component preview" for a more specific internal label.
- Removed the obsolete source route by the move, leaving a single living style
  guide at `/dev/applied-preview/`.

**How to verify:**
- `npx astro check` -- 36 files, 0 errors, 0 warnings, 0 hints.
- `npm run build` -- 116 pages; 4,296 internal links checked with 0
  violations; 0 meta-description violations.
- Built-artifact audit -- `dist/dev/applied-preview/index.html` exists,
  `dist/dev/preview/index.html` does not, and neither dev route occurs in the
  sitemap.
- Accessibility/id audit of the built preview -- 8 labelled infographic SVG
  frames, 35 total ids / 35 unique ids, 0 duplicate ids, and 0 unresolved
  `aria-labelledby` references. The built page includes
  `<meta name="robots" content="noindex,follow">`.

**Blocked / couldn't do / decisions made:**
- No blockers. No component, layout, global CSS, sitemap, robots, content,
  homepage, or content-ops files were modified.

---

## Review  *(Claude writes -- accept or send back)*

- **Reviewed:** 2026-08-16 (Claude)
- **Verdict:** PASS

**Notes / what to improve:**
- Verified by the reviewer: `git ls-files src/pages/dev/` returns only
  `applied-preview/index.astro`, and the build emits
  `dist/dev/applied-preview/index.html`. The move landed as a true rename in the
  commit, so there is exactly one living style guide.
- Cosmetic leftover: an **empty** `src/pages/dev/preview/` directory remains on
  disk. It is untracked (git does not track empty directories), generates no route,
  and does not appear in the build. Removed during review.
