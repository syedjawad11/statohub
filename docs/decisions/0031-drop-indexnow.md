---
number: 0031
title: Drop IndexNow; Bing indexing relies on normal crawling and the sitemap
type: architecture
status: accepted
date: 2026-11-02
---

**Context:** on 2026-10-04 CI started running `scripts/indexnow.mjs` after every
deploy to submit content-changed URLs to `api.indexnow.org`. Only the first run
was accepted (HTTP 202, 159 URLs). Every deploy since returned HTTP 403
`UserForbiddedToAccessSite`, even though the key file was live and returned 200
to Bingbot. Since the submit step was `continue-on-error`, the deploys stayed
green and nobody noticed.

**Options considered:**
(1) Debug the key verification in Bing Webmaster Tools and Cloudflare.
(2) Switch to the Bing Webmaster URL Submission API.
(3) Remove IndexNow entirely.

**Decision:** Option 3 (owner's call). The script, key file, the three CI steps,
the `.indexnow/` ignore and the docs paragraph are removed.

**Reasoning:** Bing crawled and indexed the site well before IndexNow, through the
sitemap. Faster pings were a nice-to-have, not worth an always-failing step plus
dashboard debugging.

**Consequences:** new pages reach Bing (and Yandex) through the sitemap and normal
crawling. Google was never affected. Revisit only if Bing indexing measurably lags;
if so, try option 2 before IndexNow.
