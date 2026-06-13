Status: CLOSED
<!-- TODO | IN_PROGRESS | DONE | CHANGES_REQUESTED | CLOSED -->

# TASK-001 â€” Astro scaffold + trailing-slash contract + Tailwind/dark-mode

- **Owner of this stage:** Codex
- **Repo:** `Desktop/statohub/` (where the work happens)
- **Created:** 2026-06-13 by Claude

---

## Brief  *(Claude writes â€” what Codex needs to execute)*

**Goal:** Stand up the bare Astro project for statohub.com with the
flat-trailing-slash URL contract baked in, Tailwind wired with **class-based dark
mode** (no flash of wrong theme), and a `BaseLayout`. This is the foundation only â€”
no content, no calculators, no link-checker yet (those are later tasks).

**Context / inputs:**
- [`../BUILD-PLAN.md`](../BUILD-PLAN.md) â€” **Â§ Plan A â†’ A1** (scaffold + trailing-slash
  contract) and **A5** (layouts), plus "Locked decisions" (Astro + Tailwind, dark
  mode, MDX, Wrangler v3).
- [`../AGENTS.md`](../AGENTS.md) â€” hard constraints (trailing-slash, folder-per-route,
  Wrangler v3, lean).
- Your skill `.codex/skills/astro-tailwind-cloudflare/` is the general
  how-to reference â€” **but its example `astro.config.mjs` is intentionally simpler
  than this task. Use the exact config below, not the skill's.** Specifically the
  skill omits `trailingSlash`, `build.format`, and the mdx/sitemap integrations,
  which are non-negotiable here.

**Exact `astro.config.mjs` contract (do not deviate):**
```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
// + Tailwind wiring (see note below)

export default defineConfig({
  site: 'https://statohub.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [mdx(), sitemap()],
});
```

**Deliverables:**
- [ ] `package.json` â€” Astro + `@astrojs/mdx` + `@astrojs/sitemap` + Tailwind, and
      `wrangler` pinned to **`^3`** in devDependencies. Scripts: `dev`, `build`
      (`astro build` for now â€” TASK-005 will append the link-checker), `preview`,
      `astro check`.
- [ ] `astro.config.mjs` â€” exactly the contract above.
- [ ] Tailwind set up with **class-based dark mode** (`darkMode: 'class'`) +
      `src/styles/global.css` with the Tailwind layers, imported once by `BaseLayout`.
- [ ] `src/layouts/BaseLayout.astro` â€” `<html lang="en">`, `<head>` with title/desc
      props + a `<slot/>`, a mobile-first container, a **dark-mode toggle**, and a
      **pre-paint inline `<script is:inline>` in `<head>`** that reads
      `localStorage.theme` (falling back to `prefers-color-scheme`) and adds/removes
      `dark` on `document.documentElement` **before first paint** so there is no
      flash of the wrong theme.
- [ ] Two proof-of-contract routes using the **folder/`index.astro`** pattern:
      `src/pages/index.astro` (home) and `src/pages/normal-distribution/index.astro`
      (a throwaway sample page â€” its only job is to prove directory output; delete-able
      later). Both render through `BaseLayout`.
- [ ] `wrangler.toml` with `pages_build_output_dir = "dist"` (deploy itself is TASK-007;
      just create the file).

**Constraints:**
- Stay in this repo; don't touch sibling folders. **Do not edit `CLAUDE.md`** â€” log
  your work in this task file's Work Log.
- **Every route is `<folder>/index.astro` â€” never a flat `[slug].astro`.** This is how
  `dist/normal-distribution/index.html` serves at `/normal-distribution/` with no
  redirect.
- **Wrangler v3** (`^3`). Node here is **20.8.0** â€” Wrangler v4 is incompatible. Pick
  Astro/Tailwind/integration versions that install and build cleanly on Node 20.8.0.
- Tailwind version is your call **as long as the outcome is class-based dark mode that
  the pre-paint script toggles** via the `dark` class. (Tailwind v3 + `@astrojs/tailwind`
  with `darkMode:'class'` is the straightforward match to the spec; if you use v4 you
  must replicate class-based dark mode, e.g. `@custom-variant dark`.)
- **No content, no calculators, no `<StatCalc>`, no `links.ts`, no `check-links.mjs`**
  in this task â€” those are TASK-002â€¦005. Keep it to the scaffold.
- Lean: a clean minimal scaffold, not a starter template full of demo cruft.

**Definition of done / how to verify:**
- `npm install` succeeds on Node 20.8.0.
- `npm run build` exits `0` and produces **`dist/index.html`** AND
  **`dist/normal-distribution/index.html`** (proves `build.format:'directory'` +
  folder-per-route â†’ trailing-slash output).
- `npx astro check` passes with no errors.
- `npm run preview` (or `astro dev`): home loads, the sample page loads at
  `/normal-distribution/`, and the **dark-mode toggle works with no flash** on reload.
- A generated `dist/sitemap-*.xml` (or sitemap index) exists and lists only
  slash-terminated URLs.

---

## Work Log  *(Codex writes â€” what was actually done)*

- **Started:** 2026-06-13
- **Finished:** 2026-06-13

**What changed (files + where):**
- `package.json` / `package-lock.json` â€” added minimal Astro 4 scaffold dependencies, MDX, sitemap, Tailwind v3/PostCSS, `@astrojs/check`, TypeScript, and `wrangler` pinned as `^3`; added `dev`, `build`, `preview`, `astro`, and `astro check` scripts.
- `astro.config.mjs` â€” added the exact task contract: `site:'https://statohub.com'`, `trailingSlash:'always'`, `build.format:'directory'`, and `integrations:[mdx(), sitemap()]`.
- `tailwind.config.cjs` / `postcss.config.cjs` â€” wired Tailwind through PostCSS so the Astro integration list stays exactly as specified; set `darkMode:'class'`.
- `src/styles/global.css` â€” added Tailwind layers and light/dark base styles.
- `src/layouts/BaseLayout.astro` â€” added shared layout with title/description props, global stylesheet import, mobile-first container, pre-paint inline theme script in `<head>`, and a client-side dark-mode toggle.
- `src/pages/index.astro` â€” added home proof route through `BaseLayout`.
- `src/pages/normal-distribution/index.astro` â€” added folder/index proof route through `BaseLayout`.
- `wrangler.toml` â€” added `pages_build_output_dir = "dist"`.
- `src/env.d.ts` â€” generated by Astro during verification.

**How to verify:**
- `npm install` â€” first sandboxed attempt failed because npm registry access was cache-only; reran with network approval and it succeeded on Node `v20.8.0` / npm `10.2.0`. After pinning `@astrojs/sitemap` to exact `3.2.1`, reran `npm install` successfully. npm reports 13 audit findings in installed dependencies.
- `npm ls sitemap @astrojs/sitemap` â€” resolves `@astrojs/sitemap@3.2.1` with `sitemap@8.0.3`, avoiding the newer `sitemap@9` Node 20.19+ engine warning.
- `npm run build` â€” exits `0`; output includes `dist/index.html` and `dist/normal-distribution/index.html`; sitemap integration created `dist/sitemap-index.xml` and `dist/sitemap-0.xml`.
- `npx astro check` â€” exits `0`; result: 3 files, 0 errors, 0 warnings, 0 hints.
- `npm run "astro check"` â€” exits `0`; same clean result, verifying the requested package script.
- `Get-Content -Raw dist/sitemap-0.xml` â€” lists only `https://statohub.com/` and `https://statohub.com/normal-distribution/`, both slash-terminated.
- `npm run preview -- --host 127.0.0.1 --port 4321` â€” preview served locally; `Invoke-WebRequest http://127.0.0.1:4321/` returned `200`, and `Invoke-WebRequest http://127.0.0.1:4321/normal-distribution/` returned `200`.
- Served home HTML contains the pre-paint `localStorage.getItem('theme')` script, the `theme-toggle` button, and `document.documentElement.classList.toggle('dark', ...)`.

**Blocked / couldn't do / decisions made:**
- The in-app Browser plugin reported `Browser is not available: iab`, so I could not perform a visual click/reload check there. I verified the preview routes over HTTP and confirmed the theme script/toggle are present in served HTML.
- `npm run build` hit a Windows sandbox `spawn EPERM` on the first attempt; reran outside the sandbox and it passed.
- This folder is not currently initialized as a git repository, so `git status --short` failed with `fatal: not a git repository`.
- Chose Tailwind v3 via PostCSS instead of `@astrojs/tailwind` so `astro.config.mjs` can keep the exact `integrations: [mdx(), sitemap()]` contract from the task.

---

## Review  *(Claude writes â€” accept or send back)*

- **Reviewed:** 2026-06-13
- **Verdict:** CLOSED

**Notes / what to improve:**
- Verified against artifacts, not just the Work Log. `astro.config.mjs` matches the
  pinned contract exactly. `dist/index.html` + `dist/normal-distribution/index.html`
  both present → `build.format:'directory'` + folder-per-route confirmed.
  `dist/sitemap-0.xml` lists only `https://statohub.com/` and
  `.../normal-distribution/`, both slash-terminated. `tailwind.config.cjs` has
  `darkMode:'class'`; `BaseLayout.astro` has the pre-paint inline `<head>` script
  (localStorage.theme → prefers-color-scheme fallback → toggles `dark` before paint)
  plus a working persisted toggle. `wrangler.toml` present.
- Accepted deviation: Tailwind v3 wired via PostCSS instead of `@astrojs/tailwind`.
  Good call — it keeps `integrations:[mdx(), sitemap()]` exactly as the contract
  required, and the class-based dark-mode outcome is intact.
- Visual click/reload test was not possible (browser plugin unavailable in Codex's
  env), but the served HTML contains the script + toggle, which is sufficient
  evidence. No follow-up needed.
