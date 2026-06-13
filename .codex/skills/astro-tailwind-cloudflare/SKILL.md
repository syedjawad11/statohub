---
name: astro-tailwind-cloudflare
description: Build, modify, verify, and deploy Astro websites that use Tailwind CSS and target Cloudflare Pages or Cloudflare Workers. Use when Codex is asked to create an Astro + Tailwind site, migrate an Astro site to Cloudflare, configure Cloudflare adapters, add Tailwind styling to Astro components, prepare static or server-rendered Astro output for Cloudflare, or debug Astro/Tailwind/Cloudflare deployment issues.
---

# Astro Tailwind Cloudflare

## Overview

Use this skill to create production-ready Astro + Tailwind CSS websites that deploy cleanly to Cloudflare. Prefer small, inspectable changes, verify the local build, and choose the Cloudflare deployment mode based on whether the site is static or needs server behavior.

## Workflow

1. Inspect the existing project before changing it: package manager, Astro version, Tailwind version, `astro.config.*`, `package.json`, routes, components, and current deployment files.
2. If starting from scratch, create an Astro project and add Tailwind with the repo's package manager. Prefer official Astro integrations over custom PostCSS wiring.
3. Decide the Cloudflare target:
   - Use `output: "static"` for static marketing sites, blogs, docs, portfolios, and mostly content-driven pages.
   - Use `@astrojs/cloudflare` with `output: "server"` or `output: "hybrid"` when the site needs SSR, endpoints, middleware, environment bindings, or dynamic route rendering.
4. Build real UI, not a placeholder landing shell. Follow the user's content, brand, and product goals; keep components accessible, responsive, and easy to scan.
5. Configure deployment scripts and Cloudflare metadata only when needed. Do not introduce a new deployment tool if the repo already has a working convention.
6. Run formatting, linting, type checks, and `astro check` when available. Always run a production build before finishing.
7. For local visual verification, start the dev server and inspect the site in a browser when frontend changes affect layout or interactions.

## Project Setup

For a new project:

```bash
npm create astro@latest
npx astro add tailwind
```

Use `pnpm`, `yarn`, or `bun` equivalents when the repository already uses them. After setup, check these files:

- `astro.config.mjs` or `astro.config.ts`
- `src/styles/global.css` or equivalent stylesheet
- `src/layouts/*`
- `src/pages/*`
- `package.json`

For Tailwind, prefer a single global stylesheet imported by the main layout. Use Tailwind utility classes in `.astro` components, and use scoped CSS only for component-specific behavior that is awkward as utilities.

## Cloudflare Configuration

For static Cloudflare Pages deployments, keep the config simple:

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
```

For SSR or hybrid Cloudflare deployments, use the Astro Cloudflare adapter:

```bash
npx astro add cloudflare
```

Then verify `astro.config.*` includes the Cloudflare adapter and an appropriate output mode:

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  output: "server",
  adapter: cloudflare(),
  vite: {
    plugins: [tailwindcss()],
  },
});
```

Use `wrangler.toml` only when the project needs Workers-style deployment configuration, bindings, compatibility flags, or non-default build output. For simple Pages static sites, Cloudflare dashboard settings or Pages project configuration may be enough.

## Website Quality

Build the actual experience requested by the user:

- Use semantic Astro components and accessible HTML.
- Keep navigation, calls to action, forms, cards, and content sections complete enough for real use.
- Make layouts responsive with Tailwind breakpoints and stable spacing.
- Avoid generic placeholder copy unless the user explicitly asks for scaffolding.
- Use real assets, user-provided assets, or generated/search-derived assets when a website needs visual identity.
- Keep Cloudflare environment variables out of source. Document expected names in comments or example files only when necessary.

## Verification

Prefer repo scripts when present. Typical checks:

```bash
npm run build
npm run astro check
npm run lint
```

If using Cloudflare SSR or Workers features, also verify with Wrangler when configured:

```bash
npx wrangler pages dev dist
```

Before finishing, summarize the deployment mode, files changed, commands run, and any checks that could not be run.

## References

Read `references/cloudflare-astro-tailwind.md` when configuring deployment details, choosing between static/server/hybrid output, or debugging Cloudflare-specific behavior.
