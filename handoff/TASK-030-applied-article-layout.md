Status: DONE
<!-- TODO | IN_PROGRESS | DONE | CHANGES_REQUESTED | CLOSED -->

# TASK-030 -- Applied article layout and section dispatch

- **Owner of this stage:** Codex
- **Repo:** `Desktop/statohub/` (where the work happens)
- **Created:** 2026-08-16 from the approved Claude restructure plan

---

## Brief  *(approved plan translated into the handoff queue)*

**Goal:** Add the production Applied Statistics article shell and make the flat root route select it from the referenced category's `section`, while leaving every Learn article on the existing layout.

**Context / inputs:**
- `docs/ideas/statohub-applied-content-style-plan.md` defines the practitioner-playbook format.
- `docs/decisions/0014-applied-section-url-family.md` locks flat root URLs.
- `docs/decisions/0015-wedge-scoped-to-learn.md` exempts Applied articles from a required calculator.
- `src/layouts/ArticleLayout.astro` is the Learn reference, not a file to modify.
- `src/components/applied/` contains the completed module and infographic system.

**Deliverables:**
- [x] Create `src/layouts/AppliedArticleLayout.astro` with Applied breadcrumbs, article metadata, a responsive reading shell, related content, and an automatic TOC derived from real render headings at depth 2 and 3.
- [x] Modify only `src/pages/[slug]/index.astro` so article dispatch reads the referenced category's `section` and selects `AppliedArticleLayout` for `applied`, otherwise `ArticleLayout`.
- [x] Preserve the current category-hub dispatch, reserved-slug guard, reading-time calculation, calculator lookup, and related-article lookup.

**Constraints:**
- Stay in this repo and do not touch sibling folders.
- Do not edit `ArticleLayout.astro`, the Applied module components, content files, homepage, global CSS, or content-ops.
- Use existing design tokens only. No literal color values, no dependencies, and no client framework.
- All internal links must use `Link.astro` and `routes.*`.
- Do not write article prose or create an Applied article.

**Definition of done / how to verify:**
- `npx astro check` is clean.
- `npm run build` succeeds with 0 link and meta-description violations.
- Source inspection proves the Applied TOC includes H2 and H3 and Learn articles still dispatch to `ArticleLayout`.

---

## Work Log  *(Codex writes -- what was actually done)*

- **Started:** 2026-08-16
- **Finished:** 2026-08-16

**What changed (files + where):**
- Added `src/layouts/AppliedArticleLayout.astro`: Applied-specific breadcrumb and
  JSON-LD path, practitioner metadata, responsive article/rail shell, automatic
  H2+H3 TOC from rendered headings, optional calculator jump, and typed related
  guide/calculator cards. Scoped styling uses only the existing design tokens.
- Updated `src/pages/[slug]/index.astro` to read the referenced category's
  `section` and select `AppliedArticleLayout` only for `applied`; the default and
  explicit alternate remain the existing `ArticleLayout`. All existing route,
  collision, reading-time, calculator, and related-content logic is preserved.

**How to verify:**
- `npx astro check` -- 37 files, 0 errors, 0 warnings, 0 hints.
- `npm run build` -- 116 pages; 4,309 internal links checked with 0 violations;
  0 meta-description violations.
- `git diff --check -- src/layouts/AppliedArticleLayout.astro src/pages/[slug]/index.astro`
- `rg -n "heading.depth === 2 \|\| heading.depth === 3|articleSection === 'applied' \? AppliedArticleLayout : ArticleLayout" src/layouts/AppliedArticleLayout.astro src/pages/[slug]/index.astro`

**Blocked / couldn't do / decisions made:**
- No blocker. No Applied article was created, per task scope, so there is no
  production Applied article URL to exercise visually yet. The layout is
  type-checked and build-validated; browser QA can exercise it once Claude adds
  the first Applied article.

---

## Review  *(Claude writes -- accept or send back)*

- **Reviewed:**
- **Verdict:**

**Notes / what to improve:**
- pending
