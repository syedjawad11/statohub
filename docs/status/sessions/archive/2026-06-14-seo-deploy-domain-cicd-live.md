# Session: SEO plumbing -> Cloudflare deploy -> custom domain -> CI/CD -- site LIVE -- 2026-06-14

**Objective:** Ship TASK-006 (SEO/JSON-LD/sitemap) and TASK-007 (Cloudflare Pages go-live), then attach the custom domain and wire push-to-deploy CI/CD.

**Completed:**
- TASK-006 written & queued: `Meta.astro`/`Canonical.astro`/`JsonLd.astro`/`Breadcrumbs.astro` + `src/lib/schema.ts` (BreadcrumbList/Article/SoftwareApplication), every URL field routed through `url()`. Deploy ordering locked with the user: SEO next, deploy last.
- TASK-006 reviewed -> CLOSED (build green, 0 link violations, astro check clean, built SD page carries canonical + BreadcrumbList + SoftwareApplication). Claude then personally executed TASK-007: `wrangler@3 pages project create statohub` + `pages deploy dist`. Hit and fixed two go-live defects: `wrangler.toml` needed a top-level `name`, and a missing `src/pages/404.astro` meant Cloudflare Pages served the homepage 200 for every unmatched path (a soft-404, and `/calculators/odds/` was reachable -- a direct non-negotiable violation). Fixed by creating a permanent `404.astro`. **Site live at `https://statohub.pages.dev`.**
- Pushed the whole build-pipeline backlog to GitHub (`syedjawad11/statohub`) and attached the custom domain: user added `statohub.com` + `www` via the Cloudflare dashboard (Pages Custom Domains, auto-CNAME + SSL); Claude added a zone Redirect Rule sending `www -> apex` with a single 301 (preserves path + query). **Site live at `https://statohub.com`.**
- Set up push-to-deploy CI/CD: `.github/workflows/deploy.yml` runs on push to `main` -- `npm ci -> astro check -> vitest -> npm run build (incl. check-links) -> wrangler@3 pages deploy`, authenticated via repo secret `CLOUDFLARE_API_TOKEN`. Chose GitHub Actions over native Cloudflare Git integration since the Pages project can't convert Direct-Upload<->Git-connected without recreating it and re-attaching the domain (see [[0006-github-actions-deploy]]).

**Files changed:** `src/components/seo/*`, `src/lib/schema.ts`, `wrangler.toml`, `src/pages/404.astro`, `.github/workflows/deploy.yml`, `handoff/TASK-006`, `handoff/TASK-007`.

**Decisions made:** Apex canonical, single `www->apex` 301. GitHub Actions is the deploy mechanism, not Cloudflare's native Git integration. See [[0002-flat-url-structure]], [[0005-wrangler-v3-lock]], [[0006-github-actions-deploy]].

**Verification:** Live curl checks -- apex/hub/SD-calc 200, odds/betting-odds/unmatched 404, sitemap slash-only, `www` 301 to apex. First plain push (not a manual re-run) confirmed to auto-trigger the Actions workflow end to end.

**Next actions noted at the time:** SEO baselines (`seo-technical`/`seo-drift`) on the live URL; A5 article layout task, then launch articles. Told user to revoke the earlier truncated/zone-scoped Cloudflare tokens pasted in chat.
