# Now

> Current state, active work, and blockers. This file wins over any session
> handoff if they disagree -- fix the conflict immediately when found. Updated
> at the end of any session that changes priorities; kept under ~60 lines.

**Last updated:** 2026-08-23 (AdSense CSP `font-src` bug fixed + deployed;
consent banner still not confirmed rendering, likely blocked on AdSense site
review, not code).

## Active: Applied Statistics -- batch 2 still not started

Batch 1 (4 articles) is live. **Batch 2 (remaining 4, one per hub), planned for
2026-08-17, has not been started** -- topics never chosen. Governed by
[[0014-applied-section-url-family]] / [[0015-wedge-scoped-to-learn]]. Recipe:
`docs/status/sessions/2026-08-16-applied-batch-1.md`. Still owed: full
desktop+mobile visual QA vs `docs/ideas/homepage-redesign-mock-2026-08-16.png`.

**Baseline on `origin/main`:** 121 pages, 4,530 internal links, 0 link/meta
violations, 121 tests, `astro check` 0 errors.

**Learn content pipeline:** queue exhausted since 2026-08-14, nightly publisher
idle (not broken, just out of work). Applied batch-1/2 seed rows stay
`flagged` so it can't auto-publish a half-written draft.

## AdSense: CSP font-src bug fixed and deployed; banner rendering still unconfirmed

Loader, CSP allowlist, `ads.txt`, privacy-policy disclosure, and the Funding
Choices CMP tag are all live in code (TASK-035; commits `8387b15`, `e7b9cca`).
**No ad units placed yet** -- loader only, deliberately.

**Done 2026-08-23:** AdSense UI ad-tech partners list was never confirmed
(message preview showed "0 partners") -- confirmed the recommended 198 incl.
Google and published. Reject option was missing (only "Manage options" +
"Consent") -- enabled "Do not consent" and published. **Real bug found via
live devtools** (not caught by TASK-035's local-only checks): `font-src` in
`public/_headers` allowed `'self'`/`fonts.gstatic.com` but not `data:`; the
consent banner's icon font loads via a `data:` URI and Chrome silently blocked
it. Fixed by adding `data:` to `font-src` (commit `c45dafc`), deployed,
reverified live -- Issues panel now clean, all consent/ad requests 200.

**Still open:** banner does not visibly render even with 0 CSP issues and all
requests succeeding. Two account-side theories, neither fixable in this repo:
(1) AdSense site still "Getting ready" (Google may suppress messaging until
approved), (2) geo-detection not resolving the browser to an EEA location.
**Decision 2026-08-23:** stop debugging, wait for AdSense review to complete.

**Resume once the site shows "Ready":**
1. Re-test the banner in incognito from an EEA location; if still blank, use
   the message editor's test-link feature (bypasses geo-targeting) to isolate
   message config from review-status gating.
2. Set up `privacy@statohub.com` via Cloudflare Email Routing -- published on
   the privacy policy now but likely not a real inbox yet.
3. Place the first ad units in the article rail (left short in the TOC
   redesign for this). New Codex handoff task, not a quiet edit.
4. Optional, not blocking: a US states (CCPA/CPRA) message.

## Parked / paused (do not silently resume)

- Article schema `image` field missing -- fix in `articleSchema()`
  (`src/lib/schema.ts`) with an `/og-default.png` fallback.
- `how-to-find-the-range` refresh -- 5 range keywords in DB, unused in copy.
- `relative frequency` / `cumulative frequency` -- uncovered Learn candidates.
- No `.gitattributes` with `core.autocrlf=true` -- phantom CRLF-only diffs.
- `docs/REPO-MAP.md` annotation pass -- drift checker still flags
  `SEO-Audit/`, `docs/audit/`, `docs/ideas/`, config + lockfiles.
- Phase C / Phase D per `docs/ideas/statohub-action-plan.md`: not started.

## Standing hard gates

- One agent on the repo at a time (Codex builds via `handoff/`, Claude
  reviews/closes and writes content).
- Never commit doc-restructuring or ADR work without showing the user first.
- Always count "done/pending" against `origin/main` after `git fetch`.
- A migration is not done until it has run against the artifact that is
  committed -- TASK-032 passed every gate with a broken `content.db`.
- Keep Codex tasks to ~4-6 files. The 900s MCP timeout truncates the reply,
  never the code: on timeout, diff the tree and re-run gates, never re-dispatch.
