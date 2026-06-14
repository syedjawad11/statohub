# AGENTS.md — statohub.com (Codex entry point)

This is the **statohub.com** build repo. If you are Codex (or any build agent),
read this, then [`BUILD-PLAN.md`](BUILD-PLAN.md), then your task in
[`handoff/`](handoff/).

## Division of labor & handoff

- **Claude** researches, decides SEO rules, writes the 50 articles, and reviews.
- **Codex** builds to spec: the Astro scaffold, the `<StatCalc>` component, the
  calculator engines, and the SEO/link-integrity plumbing.
- Work passes through [`handoff/`](handoff/) as one file per task, moving
  `TODO → IN_PROGRESS → DONE → CLOSED` (or `CHANGES_REQUESTED`). Pick the
  lowest-numbered `TODO`, set `IN_PROGRESS`, build, fill the **Work Log**, set
  `DONE`. Full protocol: `../Claude_OS/CODEX-WORKFLOW.md`.

## Hard constraints (do not violate — see BUILD-PLAN.md for full detail)

- **Stack:** Astro SSG + Tailwind + MDX → Cloudflare Pages. Calculators are
  client-side only. **Wrangler v3** (Node 20.8.0 is incompatible with v4).
- **Flat trailing-slash URLs.** Every route is `<folder>/index.astro` (never a
  flat `[slug].astro`); `astro.config.mjs` sets `trailingSlash:'always'` +
  `build.format:'directory'`. Every URL ends in `/`.
- **Internal links never hand-typed.** Use the typed registry in `src/lib/links.ts`
  via `url(id)` / `Link.astro`. `scripts/check-links.mjs` must pass (no broken,
  no non-slash internal links) or the build fails.
- **No odds calculators.** Do not build `/calculators/betting-odds/` or
  `/calculators/odds/`.
- **Lean, no over-engineering.** A small reproducible script beats a framework.
  Don't touch sibling folders. Don't edit `CLAUDE.md` (Claude's log).

## Sandbox heads-up (expected, not blockers)

These are normal approval prompts in this project (it is `trusted`); approve and
re-run, don't work around them:

- **`spawn EPERM` on `npm test` / `astro build`.** The Windows sandbox blocks
  worker-process spawn (Vitest/esbuild/astro) until approved. Re-run with
  process-spawn approval -- it passes.
- **`npm install` fails "cached-only".** Installing an uncached package needs
  network approval. Re-run `npm install` with network access.
- **Mojibake when reading `.md` files** (`â€"`, `â†'`, `â€¦`): codepage artifact,
  not corruption. Task files are authored in plain ASCII to avoid this; if you
  still hit a patch mismatch, replace the bounded section rather than the exact
  glyph, then re-read to verify.
