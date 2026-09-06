# AGENTS.md — statohub.com (Codex entry point)

This is the **statohub.com** build repo. If you are Codex (or any build agent),
read this, then your task in [`handoff/`](handoff/).

Like `CLAUDE.md`, this file is a **map, not a knowledge dump**. Durable
knowledge lives in `docs/`; per-task history lives in `handoff/` and `git log`.
Keep it under ~70 lines.

## Where things live

Read the one relevant to your task, skip the rest:

- **`docs/ARCHITECTURE.md`** — stack, URL scheme, build/CI pipeline, content
  model, the link-safety system. **This is the authority on every hard
  constraint**; read it before any structural change.
- **`docs/decisions/README.md`** — why past decisions were made, and what was
  rejected. Check here before reversing anything that looks like an odd
  constraint; it is probably deliberate and documented, not an oversight.
- **`docs/REPO-MAP.md`** — annotated directory map (where a calculator's math,
  config, or route file actually lives).
- **`docs/DESIGN-SYSTEM.md`** — tokens, fonts, component patterns; read before
  any styling task.
- **`docs/status/NOW.md`** — current state, active work, blockers.
- `docs/legacy/BUILD-PLAN.md` is the original full spec, kept for depth; where
  it and `docs/ARCHITECTURE.md` disagree the latter wins — flag the conflict in
  your Work Log rather than silently picking one.

## Division of labor & handoff

- **Codex** builds to spec: the Astro scaffold, `<StatCalc>`, the calculator
  engines, the SEO/link-integrity plumbing. **Claude** decides SEO rules, writes
  and reviews content, closes tasks, and runs both content pipelines
  (`content-ops/`, `outsource-content/`) — which Codex does not touch.
- Work passes through [`handoff/`](handoff/), one file per task, moving
  `TODO → IN_PROGRESS → DONE → CLOSED` (or `CHANGES_REQUESTED`). Pick the
  lowest-numbered `TODO`, set `IN_PROGRESS`, build, fill the **Work Log**, set
  `DONE`. Full protocol: [`handoff/README.md`](handoff/README.md).
- **One agent on the repo at a time** — [[0004-codex-builds-claude-reviews]].
- Don't edit `CLAUDE.md` — it is Claude's map, maintained by the orchestrator.

## Build-side details you won't find in the docs router

- **Every route is `<folder>/index.astro`**, never a bare `[slug].astro`;
  `astro.config.mjs` sets `trailingSlash:'always'` + `build.format:'directory'`.
- **Preserve `StatCalc`'s byte-stable hooks when styling:** `data-statcalc`, the
  per-instance JSON config, the form fields, the `aria-live` result region, and
  the client island import.
- **Internal links are never hand-typed** — use `url(id)` / `Link.astro` off the
  typed registry in `src/lib/links.ts`.
- **Lean, no over-engineering.** A small reproducible script beats a framework;
  don't touch sibling folders.
- This workspace is Linux (migrated from Windows 2026-08). A `spawn EPERM` on
  `npm test` / `astro build`, or an `npm install` "cached-only" failure, is a
  sandbox approval prompt — approve and re-run rather than changing the code.

## Gates before handing off

A task is not `DONE` until all three pass:

```
npx astro check      # expect 0 errors
npm test             # Vitest
npm run build        # gen-route-ids + astro build + link/meta/docs/board gates
```

For route work, also inspect `dist/` to confirm generated paths, canonical URLs,
JSON-LD, sitemap entries, and the absence of unwanted pages.
