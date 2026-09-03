# AGENTS.md — statohub.com (Codex entry point)

This is the **statohub.com** build repo. If you are Codex (or any build agent),
read this, then your task in [`handoff/`](handoff/).

Like `CLAUDE.md`, this file is a **router, not a knowledge dump**. Durable
knowledge lives in `docs/`; per-task history lives in `handoff/` and `git log`.
Keep this file under ~80 lines.

## Where things live (docs/ router)

Read the one relevant to your task, skip the rest:

- **`docs/ARCHITECTURE.md`** — stack, URL scheme, build/CI pipeline, content
  model, the link-safety system. Read this before any structural change.
- **`docs/REPO-MAP.md`** — annotated directory map (where a calculator's math,
  config, or a route file actually lives).
- **`docs/decisions/README.md`** — why past decisions were made, including
  rejected alternatives. Check this before reversing or relitigating anything
  that looks like an odd constraint (e.g. "why is there no homepage
  calculator?") — it's probably a deliberate, documented decision, not an
  oversight.
- **`docs/DESIGN-SYSTEM.md`** — tokens, fonts, component patterns; read before
  any styling task.
- **`docs/status/NOW.md`** — current state, active work, blockers.
- `docs/legacy/BUILD-PLAN.md` is the original full build spec, kept for depth;
  where it and `docs/ARCHITECTURE.md` disagree, `docs/ARCHITECTURE.md` (newer)
  wins — flag the conflict in your Work Log rather than silently picking one.

## Division of labor & handoff

- **Claude** researches, decides SEO rules, writes and reviews content, and
  closes tasks. It runs two content pipelines — internal (`content-ops/`) and
  outsourced (`outsource-content/`) — which Codex does not touch.
- **Codex** builds to spec: the Astro scaffold, the `<StatCalc>` component, the
  calculator engines, and the SEO/link-integrity plumbing.
- Work passes through [`handoff/`](handoff/) as one file per task, moving
  `TODO → IN_PROGRESS → DONE → CLOSED` (or `CHANGES_REQUESTED`). Pick the
  lowest-numbered `TODO`, set `IN_PROGRESS`, build, fill the **Work Log**, set
  `DONE`. Full protocol: [`handoff/README.md`](handoff/README.md). Closed tasks
  are archived to `handoff/archive/`.
- **One agent on the repo at a time** — see
  [[0004-codex-builds-claude-reviews]].

## Hard constraints (full detail in `docs/ARCHITECTURE.md` + the cited ADRs)

- **Stack:** Astro SSG + Tailwind + MDX → Cloudflare Pages. Calculators are
  client-side only. **Wrangler v3** (Node 20.8.0 is incompatible with v4). See
  [[0005-wrangler-v3-lock]].
- **Flat trailing-slash URLs.** Every route is `<folder>/index.astro` (never a
  flat `[slug].astro`); `astro.config.mjs` sets `trailingSlash:'always'` +
  `build.format:'directory'`. Every URL ends in `/`. See
  [[0002-flat-url-structure]].
- **Internal links never hand-typed.** Use the typed registry in
  `src/lib/links.ts` via `url(id)` / `Link.astro`. `scripts/check-links.mjs`
  must pass or the build fails.
- **No odds calculators.** Do not build `/calculators/betting-odds/` or
  `/calculators/odds/`. See [[0003-no-odds-calculators]].
- **Never commit a board `.db`.** Both SQLite boards are gitignored and tracked
  as `.sql` dumps; if a task touches one, run `python3 scripts/db_sync.py dump`
  and commit the `.sql`. See [[0018-sqlite-boards-as-sql-dumps]].
- **Lean, no over-engineering.** A small reproducible script beats a framework.
  Don't touch sibling folders. Don't edit `CLAUDE.md` — it is Claude's router,
  maintained by the orchestrator.

## Gates before handing off

Run all of these; a task is not `DONE` until they pass:

```
npx astro check      # expect 0 errors
npm test             # Vitest
npm run build        # gen-route-ids + astro build + link/meta/docs/board gates
```

- For route work, inspect `dist/` to confirm generated paths, canonical URLs,
  JSON-LD, sitemap entries, and the absence of unwanted pages.
- Preserve `StatCalc` byte-stable hooks when styling: `data-statcalc`,
  per-instance JSON config, form fields, `aria-live` result region, and the
  client island import.
- This workspace is Linux (migrated from Windows 2026-08). If you hit
  `spawn EPERM` on `npm test` / `astro build`, or an `npm install`
  "cached-only" failure, that is a sandbox approval prompt — approve and re-run
  rather than changing the implementation.

Per-task history is in `handoff/archive/` and `git log`, not in this file.
