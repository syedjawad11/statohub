# Cloudflare Astro Tailwind Reference

## Deployment Modes

- Static output: best for content sites, landing pages, portfolios, blogs, docs, and sites without runtime server logic. Cloudflare Pages serves the generated files from `dist`.
- Server output: use when Astro endpoints, SSR pages, middleware, or request-time personalization must run on Cloudflare.
- Hybrid output: use when most routes are static but selected routes need server rendering.

## Cloudflare Pages Settings

Common Pages settings for static Astro:

- Build command: `npm run build`
- Build output directory: `dist`
- Node version: configure through Cloudflare settings or environment when the project requires a specific version.

Use the package manager already committed in the repo:

- `package-lock.json` -> npm
- `pnpm-lock.yaml` -> pnpm
- `yarn.lock` -> yarn
- `bun.lockb` or `bun.lock` -> bun

## Wrangler Notes

Use Wrangler when the user asks for local Cloudflare emulation, bindings, Workers deployment, environment variables, KV, R2, D1, Durable Objects, or advanced Pages Functions behavior.

Do not commit real secrets. Use Cloudflare dashboard secrets, `wrangler secret`, or local untracked `.dev.vars` when the project needs runtime credentials.

## Tailwind Notes

Astro projects may use Tailwind through `@tailwindcss/vite` in newer Tailwind setups or through the Astro Tailwind integration in older setups. Preserve the existing style unless the user asks to upgrade Tailwind.

Keep a single global stylesheet for Tailwind imports. Prefer utility classes in Astro components, with component CSS only for special cases such as complex animation, masks, or third-party overrides.

## Common Fixes

- Missing styles in production: verify the global stylesheet is imported by the layout and the Tailwind/Vite plugin is configured.
- Cloudflare SSR build errors: verify `@astrojs/cloudflare` is installed, `adapter: cloudflare()` is set, and `output` is `server` or `hybrid`.
- Node-only API errors: Cloudflare runtime is not Node.js. Replace Node-only APIs with Web APIs or Cloudflare bindings.
- Environment variable confusion: client-exposed variables must follow Astro's public variable conventions; server-only values must stay server-side.
