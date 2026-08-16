Status: CLOSED
<!-- TODO | IN_PROGRESS | DONE | CHANGES_REQUESTED | CLOSED -->

# TASK-035 -- CSP allowances + AdSense loader

- **Owner of this stage:** Codex
- **Repo:** `Desktop/statohub/` (where the work happens)
- **Created:** 2026-08-16 by Claude
- **Blocked by:** TASK-034. Do not start this until TASK-034 is `CLOSED`.
  One agent on the repo at a time.

<!-- Authoring note (Claude): keep this file plain ASCII. Use `--` not an em
dash, `->` not an arrow, `...` not an ellipsis. Codex reads these files through
a Windows codepage; non-ASCII punctuation renders as mojibake and breaks its
apply_patch matching. -->

---

## Brief  *(Claude writes -- what Codex needs to execute)*

**Goal:** Make Google AdSense able to actually load and render on statohub.com
by (1) widening the Content-Security-Policy to the specific Google ad origins
and (2) adding the AdSense loader script to every indexable page.

**Why this exists:** `public/ads.txt` shipped in commit `63ade6b` and AdSense
site verification is in progress. Verification itself is unaffected by the
CSP -- ads.txt is a static text file fetched by Google's crawler, not by the
browser. But the current policy in `public/_headers` line 10 is:

```
default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; img-src 'self' data:; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self'; upgrade-insecure-requests
```

`script-src 'self'` blocks `adsbygoogle.js` outright, and `default-src 'self'`
blocks the ad iframes, beacons, and creative images. The failure mode is
silent: the page renders fine, the ad slot stays empty, and nothing in the
page itself says why. Only the devtools console shows the CSP violations. So
this has to be fixed before, not after, the ad code goes live.

This is a deliberate loosening of the security-header posture set in the
2026-06-20 Medium-SEO-fixes session (see
`docs/status/sessions/archive/2026-06-20-medium-seo-fixes-calc-prose-pipeline-launch.md`).
That is why it is a gated handoff task and not a quiet patch. Keep the
loosening as narrow as the ads actually require.

**Context / inputs:**
- `public/_headers` -- the only place security headers are set. Cloudflare
  Pages Direct Upload cannot set them any other way. Read the comment header.
- `src/layouts/BaseLayout.astro` -- owns `<head>` for every page on the site.
  The theme-toggle `<script is:inline>` near the end of `<head>` is the
  precedent for how an inline script is placed here. This layout also already
  has a `noindex` prop, which you will reuse (see below).
- Publisher ID: `pub-4667906964697238`. Note the AdSense **script** parameter
  uses the `ca-` prefixed form, `ca-pub-4667906964697238`, while `ads.txt`
  uses the bare `pub-` form. Both are correct in their own place; do not
  "fix" either to match the other.
- `public/ads.txt` -- already shipped, do not modify.

**Approach (decided -- build to this, do not substitute another):**

*Part 1 -- CSP.*

Extend the existing single `/*` rule. Do not add a second path rule, do not
introduce wildcards like `https:` or `*.google.com`, and do not add
`'unsafe-eval'`. Keep `default-src 'self'`, `base-uri 'self'`,
`object-src 'none'`, and `frame-ancestors 'self'` exactly as they are.

Use this as the starting policy:

```
Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; img-src 'self' data: https://pagead2.googlesyndication.com https://tpc.googlesyndication.com https://googleads.g.doubleclick.net https://www.google.com https://www.gstatic.com; font-src 'self' https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://tpc.googlesyndication.com https://googleads.g.doubleclick.net https://partner.googleadservices.com https://adservice.google.com https://fundingchoicesmessages.google.com https://www.googletagservices.com; connect-src 'self' https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google https://csi.gstatic.com; frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com https://ep2.adtrafficquality.google; upgrade-insecure-requests
```

Three things to understand about that string rather than pasting it blindly:

- **`frame-src` is new.** Ad iframes were previously covered by
  `default-src 'self'`. Adding an explicit `frame-src` overrides the default
  for frames, which is why `'self'` has to be repeated inside it.
- **It is a starting point, not a verified allowlist.** Google does not
  publish a stable, exhaustive CSP domain list for AdSense, and the set moves
  (the `adtrafficquality.google` origins are recent additions). The real
  source of truth is the browser console. See the DoD.
- **`fundingchoicesmessages.google.com`** is Google's Privacy and messaging /
  consent CMP host. It is included because the site serves EEA traffic and
  AdSense requires a certified CMP there. Configuring that CMP is done in the
  AdSense UI, not in this repo -- but if the origin is missing from the CSP
  the consent message is blocked and EEA ad serving stops.

`_headers` has no line-continuation syntax: the whole header must stay on one
physical line. Preserve the file's two-space indent under `/*`.

*Part 2 -- the loader.*

Add the standard AdSense loader to `<head>` in `src/layouts/BaseLayout.astro`:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4667906964697238" crossorigin="anonymous"></script>
```

Two conditions govern whether it is emitted:

- **Production builds only.** Gate on `import.meta.env.PROD` so `npm run dev`
  never loads it. Loading real ad code on localhost risks generating invalid
  traffic against the AdSense account, which is a real account-health problem,
  not a cosmetic one. (`astro build` sets `PROD` true, so a local
  `npm run build` + `npm run preview` will include it -- that is intended,
  because Part 1 cannot be verified without it. Do not click an ad in preview.)
- **Not on `noindex` pages.** `BaseLayout` already takes a `noindex` prop;
  suppress the loader whenever it is true. That covers `dist/404.html` and
  `/dev/applied-preview/` without inventing a second flag. AdSense policy
  prohibits ads on error pages and pages without publisher content, so this
  is a policy requirement, not just tidiness.

Put the `ca-pub-...` value in a single named module-scope const in the
component frontmatter with a short comment saying it is the public AdSense
publisher ID and must stay in sync with `public/ads.txt`. If you find yourself
needing that value in a second file, stop and report it in the Work Log
instead of duplicating it.

**Explicitly out of scope -- do not do these:**
- **Do not place any ad units.** No `<ins class="adsbygoogle">` blocks, no
  `AdSlot` component, no edits to `ArticleLayout.astro`,
  `AppliedArticleLayout.astro`, `SectionLandingLayout.astro`, or any page.
  The loader alone is enough for AdSense Auto ads and for account review.
  Where ads sit in the reading experience is a content and layout decision
  Claude owns, and it will be its own task after there is real data.
- **Do not edit the privacy policy.** AdSense requires disclosure of
  advertising cookies; that copy is Claude's to write.
- **Do not add a consent banner or CMP script.** That is configured in the
  AdSense UI.

**Constraints:**
- Stay in this repo; don't touch sibling folders.
- Only two files should change: `public/_headers` and
  `src/layouts/BaseLayout.astro`. If anything else needs to change, stop and
  report it in the Work Log first.
- No new dependency. Wrangler v3 lock and the rest of ADR 0005 unchanged.
- Do not touch `src/calc/**`, any content file, or any other layout.
- **If a CSP violation appears that can only be resolved by adding
  `'unsafe-eval'`, or by widening a directive to a wildcard, stop.** Record
  the exact violation text in the Work Log and leave it unfixed. That is a
  security-posture decision above this task's pay grade and needs an ADR.

**Definition of done / how to verify:**
- `npx astro check` reports 0 errors; `npm test` passes; `npm run build`
  succeeds end to end including the link gate and meta-description gate.
- `dist/404.html` and `dist/dev/applied-preview/index.html` contain **no**
  `adsbygoogle.js` reference. A normal article page (for example
  `dist/standard-deviation/index.html`) **does** contain exactly one.
- Run `npm run dev` and confirm the loader is absent from the served HTML.
- **The real check -- empirical CSP verification.** Run `npm run build` then
  `npm run preview`, open an article page in a browser with devtools open,
  and let it sit long enough for the ad code to run. The console must show
  **zero** `Refused to ...` / `Content Security Policy` violations. If any
  appear, add only the specific origin named in the violation to only the
  specific directive named in the violation, then re-run until clean. Paste
  the final list of origins you had to add beyond the starting policy into
  the Work Log -- that delta is the most useful thing this task produces.
- Watch for one specific non-CSP failure while you are in there: the existing
  `Cross-Origin-Opener-Policy: same-origin` header can interfere with ad
  frames that expect `window.opener`. If you see COOP warnings in the console,
  do not change the header -- report them.
- Confirm the header survives the edge, not just the file: after deploy,
  `curl -sI https://statohub.com/ | grep -i content-security-policy` returns
  the full policy on one line. A malformed `_headers` line fails silently on
  Cloudflare Pages -- the header simply does not appear -- so seeing it come
  back is the only proof the syntax is valid. If you cannot reach a deployed
  URL, say so in the Work Log rather than marking this verified.
- `git status` clean after the build.

---

## Work Log  *(Codex writes -- what was actually done)*

- **Started:** 2026-08-16
- **Finished:** 2026-08-16

**What changed (files + where):**
- `public/_headers` -- widened the existing single CSP rule to the exact
  starting allowlist, including explicit `frame-src`, while preserving the
  baseline default, base, object, and frame-ancestor controls.
- `src/layouts/BaseLayout.astro` -- added one named public publisher-ID
  constant and the standard async loader, emitted only for production builds
  when `noindex` is false. Explicit `is:inline` documents Astro's
  pass-through behavior and removes its automatic-inline hint.
- `handoff/TASK-035-csp-adsense-loader.md` and `AGENTS.md` -- updated the
  required task state/log and concise work-history metadata only.

**Origins added beyond the starting CSP (from console violations):**
- None added in code. Browser-console verification was unavailable, so this
  does not claim the starting policy is dynamically sufficient.

**How to verify:**
- `npx astro check` -- 38 files; 0 errors, warnings, or hints.
- `npm test` -- 35 files and 121 tests passed after the expected spawn
  approval.
- `npm run build` -- final run passed: 120 pages, 118 sitemap URLs, 4,489
  internal links, and 0 llms.txt, link, or meta-description violations.
- Artifact assertions across all 120 HTML pages -- all 118 indexable pages
  have exactly one loader, both noindex pages have zero, and the
  standard-deviation article has the exact async/crossorigin markup.
- `npm run dev -- --host 127.0.0.1 --port 4328` -- the article returned 200
  with zero loader/publisher references.
- `npm run preview -- --host 127.0.0.1 --port 4330` -- the article returned
  200 with exactly one loader and the exact standard markup.
- `npx wrangler pages dev dist --port 4331` -- returned the complete
  1,010-character CSP byte-for-byte from `public/_headers`, with no
  `unsafe-eval`.

**Blocked / couldn't do / decisions made:**
- The user explicitly authorized starting on TASK-034's unresolved dirty
  worktree. Those pre-existing edits were preserved. The first build hit
  TASK-034's known Windows stale-copy marker; the idempotent repeat passed
  without a TASK-035 workaround.
- The required in-app browser runtime was not exposed, so Google runtime CSP
  violations, extra origins, and COOP warnings could not be observed.
- The changes were not deployed, so the live-edge CSP curl is not verified.
- `git status` cannot be clean on the pre-existing dirty baseline while this
  uncommitted task is present. The build also reports `public/llms.txt`
  stat-dirty from line endings, but its normalized blob hash equals `HEAD`
  and `git diff` shows no content change.

---

## Review  *(Claude writes -- accept or send back)*

- **Reviewed:** 2026-08-16
- **Verdict:** CLOSED

**Notes:**

Both parts match the brief exactly and the diff is confined to the two allowed
files. Verified independently of the Work Log:

- `public/_headers` -- the policy is the specified string byte for byte, on one
  physical line, two-space indent preserved, still a single `/*` rule. No
  wildcards, no `'unsafe-eval'`; `default-src`, `base-uri`, `object-src`, and
  `frame-ancestors` unchanged, and `frame-src` correctly repeats `'self'`.
- `src/layouts/BaseLayout.astro` -- one module-scope `ADSENSE_PUBLISHER_ID`
  const with the sync comment pointing at `public/ads.txt`, gated on
  `import.meta.env.PROD && !noindex`, placed in `<head>` beside the existing
  theme script. Adding `is:inline` was the right call and worth noting: without
  it Astro would try to process the tag rather than emit it verbatim.
- Built artifacts, checked directly: `dist/404.html` 0 loaders,
  `dist/dev/applied-preview/index.html` 0, `dist/standard-deviation/index.html`
  exactly 1, `dist/index.html` exactly 1, and the emitted markup is the exact
  `async ... crossorigin="anonymous"` form with the `ca-pub-` prefix intact.
- `npx astro check` 0 errors, `npm test` 121 passed, `npm run build` green
  through all four gates.

Two DoD items were honestly reported as unverifiable rather than claimed, which
is the right behaviour and does not block closing:

- **Browser-console CSP verification did not happen.** No browser runtime was
  available. So the allowlist in `_headers` is still an unproven starting
  policy, not a confirmed one -- Google does not publish an exhaustive list and
  the set moves. This is the one open risk in the task and it now transfers to
  the post-deploy check below. Same for the COOP question.
- **Live-edge `curl` not run** (not deployed at review time). The local
  `wrangler pages dev` check returning the full 1,010-char policy byte for
  byte is good evidence the `_headers` syntax parses, which is the failure mode
  that actually matters -- a malformed line goes silently missing.

**Carried forward (Claude's, not a reopen of this task):** after deploy, load a
live article with devtools open and confirm zero `Refused to ...` violations;
add any named origin to only its named directive. Also still outstanding: the
privacy-policy advertising-cookie disclosure, and configuring a Google-certified
CMP in the AdSense UI for EEA traffic (UI work, not repo work).
