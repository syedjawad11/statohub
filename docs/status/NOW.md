# Now

> Current state, active work, and blockers. This file wins over any session
> handoff if they disagree -- fix the conflict immediately when found. Updated
> at the end of any session that changes priorities; kept under ~60 lines.

**Last updated:** 2026-08-16 (Applied batch 1 live + article rail/TOC redesign
+ AdSense privacy disclosure; AdSense setup paused mid-flight, resume 08-17).

## Active: Applied Statistics -- scaffolding COMPLETE, batch 1 LIVE

Three sections: **Learn**, **Calculators**, **Applied Statistics** (4 hubs at
flat root URLs + `/applied/` landing), plus the rebuilt three-path homepage.
Governed by [[0014-applied-section-url-family]] and [[0015-wedge-scoped-to-learn]].

**TASK-025 through TASK-033 are all CLOSED.**

**Applied batch 1 (4 articles, one per hub) published 2026-08-16:**
`data-drift-detection`, `how-to-design-an-ab-test`, `exploratory-data-analysis`,
`forecast-accuracy-metrics` -- the first real content through
`AppliedArticleLayout`, so that layout, its TOC, FAQPage JSON-LD and the module
system are verified on public pages, not just the preview route.

**Next: Applied batch 2 -- the remaining 4 articles** (2026-08-17), one per hub
so each reaches 2. Topics not chosen yet. Writer-dispatch recipe:
`docs/status/sessions/2026-08-16-applied-batch-1.md`.

**Baseline on `origin/main`:** 120 pages, 4,489 internal links, 0 link
violations, 0 meta-description violations, 35 test files / 121 tests,
`astro check` 0 errors, 21/21 contrast checks.

## Done 2026-08-16: article sidebar TOC is now compact

`RailToc.astro` replaces the always-open TOC in **both** article shells: it
shows only the section being read (+ `n/total`), swaps on scroll, and expands
on click. Deliberately short so the rail below stays free for ad slots. Also
fixed the homepage horizontal scrollbar (`overflow-x: clip` on `html`/`body`;
full-bleed `100vw` bands were overhanging by the scrollbar width). Details:
`docs/status/sessions/2026-08-16-compact-article-toc.md`.

**Still owed:** the rest of TASK-031's homepage/article visual QA against
`docs/ideas/homepage-redesign-mock-2026-08-16.png`. The scrollbar was caught by
the user's own eyeball pass; a full desktop + mobile check has never run.

## Content pipeline: Learn queue EXHAUSTED, routine idle since 2026-08-14

**The daily publisher is not broken; it ran out of work.** `content_db.py next`
returns *"No unflagged 'planned' articles left"*, so the 03:00 run is a no-op.

- **79 rows in `content.db`**, 77 published. Non-published:
  `validity-in-statistics` (`research_pending`, flagged, needs keyword research)
  + one `changes_requested`. **78 article files on disk**, all `draft: false`.
- **Decision 2026-08-16:** keep the routine idle through the restructure -- no
  cloud routine committing to `origin/main`, no contention with the one-agent gate.
- **Seed Applied rows `flagged`** (phase 70, `flagged: 1`) so `next` skips them
  and the nightly routine cannot auto-publish a half-written draft. **Same for
  batch 2.** Trigger `trig_01DhQoEV3sRaKynzFC88xTzh` (cron `0 1 * * *` UTC)
  remains the sole daily publisher and stays enabled.

## AdSense: consent banner (CMP) now wired into the code, resume ad units next

Code side is done. Loader is live (TASK-035), `ads.txt` is served, the CSP
allows Google's ad + consent origins, and `/privacy-cookie-policy/` carries the
advertising and cookie-consent disclosure (commit `8387b15`). **No ad units are
placed yet** -- only the `adsbygoogle.js` loader, deliberately.

**Done 2026-08-16:** the CMP exists in the AdSense UI. "European regulations
message - statohub.com" is **Published**, toggle on, English + 31 languages.

**Done 2026-08-19:** the Funding Choices messaging tag is now emitted directly
by `BaseLayout.astro` (same `PROD && !noindex` gate as the AdSense loader, and
loaded *before* it, per Google's manual-tag instructions) instead of relying
solely on the AdSense auto-integration. This means the banner no longer depends
on an ad slot actually firing a request to trigger it -- it shows on its own.
Also closed the CSP gap flagged below: `public/_headers` now allows
`fundingchoicesmessages.google.com` under `connect-src` and `frame-src` too
(previously `script-src` only), and `lh3.googleusercontent.com` under `img-src`
for consent-dialog logos. Verified: `astro check` 0 errors, 121/121 tests,
clean `npm run build` (120 pages, 0 link/meta violations), and
`wrangler pages dev` returns the new CSP byte-for-byte.

**Resume here, in this order:**

1. **Test the CMP on the live site after this deploys.** The user is in Malta,
   so an incognito visit to statohub.com is a real EEA test. Confirm the
   message appears and check devtools for any remaining CSP violations --
   widen only the specific origin/directive named in the console, same
   discipline as TASK-035.
2. **AdSense UI leftovers:** Privacy & messaging -> European regulations ->
   **Settings** tab, to pick ad technology providers (take Google's recommended
   set). Open the message and confirm its privacy-policy URL points at
   `https://statohub.com/privacy-cookie-policy/` (a `#consent` anchor exists if
   a deep link is wanted) and that a reject option sits at equal prominence.
3. **Set up `privacy@statohub.com`** -- the privacy page publishes it as the
   contact address *now*, so this is live-but-dead until done. Cloudflare Email
   Routing, forwarded to the personal inbox.
4. **Optional, not blocking:** a US states (CCPA/CPRA) message. Skip ad
   blocking recovery -- too aggressive for a site this young.

**Then:** place the first ad units. The article rail was left short in the TOC
redesign specifically to hold one.

## Parked / paused (do not silently resume)

- **Article schema `image` field** -- Article JSON-LD ships with no `image`.
  Fix in `articleSchema()` (`src/lib/schema.ts`) with an `/og-default.png`
  fallback, as `Meta.astro` already does.
- **`how-to-find-the-range` refresh** -- 5 range keywords sit in the DB but were
  never worked into the live page text. Light refresh, not a rewrite.
- **`relative frequency` / `cumulative frequency`** -- uncovered Learn candidates.
- **No `.gitattributes`** with `core.autocrlf=true`, so
  `src/lib/content-route-ids.ts` shows phantom CRLF-only diffs after a build.
- **`docs/REPO-MAP.md` annotation pass** -- drift checker still flags
  `SEO-Audit/`, `docs/audit/`, `docs/ideas/`, config + lockfiles.
- **Phase C / Phase D** per `docs/ideas/statohub-action-plan.md`: not started.

## Standing hard gates

- One agent on the repo at a time (Codex builds via `handoff/`, Claude
  reviews/closes and writes content).
- Never commit doc-restructuring or ADR work without showing the user first.
- Always count "done/pending" against `origin/main` after `git fetch`.
- **A migration is not done until it has run against the artifact that is
  committed** -- TASK-032 passed every gate with a broken `content.db`.
- Keep Codex tasks to ~4-6 files. The 900s MCP timeout truncates the reply, never
  the code: on timeout, diff the tree and re-run gates -- never re-dispatch.
