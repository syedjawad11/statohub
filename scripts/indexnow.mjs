// Submits changed URLs to IndexNow (Bing, Yandex, Seznam, Naver) after a deploy.
//
// Runs in CI after `wrangler pages deploy`, so the key file is already live when
// the search engine fetches it to verify ownership. Only URLs whose content
// actually changed are sent: each page's content-bearing HTML (<title>, meta
// description, canonical, <main>) is hashed and diffed against the manifest from
// the previous deploy, which CI persists in the Actions cache. Head asset links
// are excluded on purpose, so a CSS/JS bundle hash change does not re-ping every
// page. With no previous manifest (first run, evicted cache) every sitemap URL is
// submitted once.
//
// On success the new manifest is written; on any HTTP failure the script exits 1
// without writing it, so CI skips the cache save and the next run retries the
// same diff. CI marks the step continue-on-error: a failed ping never fails a
// deploy.
//
// Usage: node scripts/indexnow.mjs [--dry-run]   (dry run prints, never POSTs)
// Plain Node, no dependencies -- same idiom as scripts/check-links.mjs.

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const HOST = 'statohub.com';
// Public by design: served from public/<KEY>.txt so the engine can verify it.
const KEY = 'eb2b7065b4d37eedb8bd7db3b601034b';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const BATCH_SIZE = 10000; // IndexNow per-request cap

const distDir = path.resolve('dist');
const manifestDir = path.resolve('.indexnow');
const manifestFile = path.join(manifestDir, 'manifest.json');
const dryRun = process.argv.includes('--dry-run');

function locs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

// Follow sitemap-index.xml to every shard so this keeps working past 45k URLs.
function sitemapUrls() {
  const indexFile = path.join(distDir, 'sitemap-index.xml');
  if (!existsSync(indexFile)) {
    throw new Error('dist/sitemap-index.xml not found -- run `npm run build` first');
  }
  const urls = [];
  for (const shardUrl of locs(readFileSync(indexFile, 'utf8'))) {
    const shardFile = path.join(distDir, new URL(shardUrl).pathname);
    urls.push(...locs(readFileSync(shardFile, 'utf8')));
  }
  return urls;
}

function pick(html, re) {
  return html.match(re)?.[0] ?? '';
}

function pageHash(url) {
  const file = path.join(distDir, new URL(url).pathname, 'index.html');
  if (!existsSync(file)) throw new Error(`sitemap URL has no built page: ${url}`);
  const html = readFileSync(file, 'utf8');
  const parts = [
    pick(html, /<title>[\s\S]*?<\/title>/),
    pick(html, /<meta name="description"[^>]*>/),
    pick(html, /<link rel="canonical"[^>]*>/),
    pick(html, /<main[\s\S]*<\/main>/),
  ];
  // Components (infographics, StatCalc embeds) mint random element ids per
  // build. Blank every id-reference attribute and stray UUID, or those pages
  // look changed on every deploy. Ids carry nothing a search engine indexes.
  const stable = parts
    .join('\n')
    .replace(/\s(id|for|aria-[a-z]+|data-[a-z-]*id)="[^"]*"/g, ' $1=""')
    .replace(/\shref="#[^"]*"/g, ' href="#"')
    .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g, '');
  return createHash('sha256').update(stable).digest('hex');
}

async function submit(urlList) {
  for (let i = 0; i < urlList.length; i += BATCH_SIZE) {
    const batch = urlList.slice(i, i + BATCH_SIZE);
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: batch }),
    });
    if (res.status !== 200 && res.status !== 202) {
      throw new Error(`IndexNow HTTP ${res.status}: ${await res.text()}`);
    }
    console.log(`indexnow: batch of ${batch.length} accepted (HTTP ${res.status})`);
  }
}

const current = Object.fromEntries(sitemapUrls().map((url) => [url, pageHash(url)]));
const previous = existsSync(manifestFile) ? JSON.parse(readFileSync(manifestFile, 'utf8')) : null;

let changed;
if (previous === null) {
  console.log('indexnow: no previous manifest -- submitting every sitemap URL');
  changed = Object.keys(current);
} else {
  const updated = Object.keys(current).filter((url) => previous[url] !== current[url]);
  // Removed URLs are submitted too, so the engine re-fetches the 404/301.
  const removed = Object.keys(previous).filter((url) => !(url in current));
  changed = [...updated, ...removed];
}

console.log(`indexnow: ${changed.length} URL(s) to submit`);
for (const url of changed) console.log(`  ${url}`);

if (dryRun) {
  console.log('indexnow: --dry-run, nothing submitted');
} else {
  try {
    if (changed.length > 0) await submit(changed);
  } catch (err) {
    console.error(`indexnow: ${err.message}`);
    process.exit(1);
  }
  mkdirSync(manifestDir, { recursive: true });
  writeFileSync(manifestFile, JSON.stringify(current, null, 2) + '\n', 'utf8');
  console.log(`indexnow: manifest written (${Object.keys(current).length} URLs)`);
}
