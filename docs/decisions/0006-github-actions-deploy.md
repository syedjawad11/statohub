---
number: 0006
title: GitHub Actions deploy, not native Cloudflare Git integration
type: architecture
status: accepted
date: 2026-06-14
---

**Context:** After the first manual Cloudflare Pages deploy (TASK-007), needed
a push-to-deploy pipeline. Cloudflare Pages offers two connection modes:
native Git integration, or externally-triggered deploys (e.g. via GitHub
Actions + Wrangler).

**Options considered:**
(1) Native Cloudflare Pages Git integration -- connect the repo directly in
the dashboard; Cloudflare runs the build itself.
(2) GitHub Actions workflow that runs the full gate suite
(`astro check` -> `vitest` -> `npm run build`, which includes the link gate)
and only then calls `wrangler pages deploy`.

**Decision:** Option 2.

**Reasoning:** A Cloudflare Pages project cannot be converted between
"Direct Upload" and "Git-connected" modes after creation -- switching would
mean deleting and recreating the `statohub` project and re-attaching the
custom domain that was already configured. Native Git integration also only
runs the build command, silently skipping the test suite and the internal
link-safety gate ([[0002-flat-url-structure]]'s enforcement mechanism) --
unacceptable given those gates are what makes the "zero redirects/404s" rule
real rather than aspirational.

**Consequences:** Deploy auth is a repo secret (`CLOUDFLARE_API_TOKEN`,
scoped to Account / Cloudflare Pages / Edit) rather than a dashboard-managed
connection. A push that fails any gate cannot reach production -- this is the
property that lets scheduled cloud-routine content publishing (see the
calc-prose and article auto-publish routines) run unsupervised without risk
of shipping broken content.

**Revisit when:** Cloudflare adds a way to run custom pre-build gates inside
native Git integration, or the project is recreated for an unrelated reason
that would also require re-attaching the domain anyway.

**Related:** [[0005-wrangler-v3-lock]], [[0008-tiered-seo-validation]]
