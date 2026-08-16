// Build gate for the generated llms.txt URL inventory and committed copy.
//
// Why this exists: gen-llms-txt.mjs rewrites both copies from the built site,
// so this gate verifies the result -- that llms.txt and the sitemap agree in
// both directions, that URLs are unique and trailing-slashed, and that the
// dist and public copies are byte-identical. It deliberately does NOT fail on
// public/llms.txt having been out of date before generation: that is the
// normal state of every content publish, and the same build has already
// repaired it. Node built-ins only.

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const distFile = path.resolve('dist', 'llms.txt');
const publicFile = path.resolve('public', 'llms.txt');
const sitemapFile = path.resolve('dist', 'sitemap-0.xml');
const sitemapIndexUrl = 'https://statohub.com/sitemap-index.xml';
const violations = [];

function xmlUrls(text) {
  return [...text.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)].map((match) =>
    match[1].trim().replace(/&amp;/g, '&'),
  );
}

function llmsUrls(text) {
  return [...text.matchAll(/^- \[[^\]]+\]\(([^)]+)\):/gm)].map((match) => match[1]);
}

for (const file of [sitemapFile, distFile, publicFile]) {
  if (!existsSync(file)) violations.push(`${path.relative('.', file)} -- required file is missing`);
}

let sitemapUrls = [];
let generatedUrls = [];
let distBytes;
let publicBytes;

if (existsSync(sitemapFile)) sitemapUrls = xmlUrls(readFileSync(sitemapFile, 'utf8'));
if (existsSync(distFile)) {
  distBytes = readFileSync(distFile);
  generatedUrls = llmsUrls(distBytes.toString('utf8'));
}
if (existsSync(publicFile)) publicBytes = readFileSync(publicFile);

const sitemapSet = new Set(sitemapUrls);
const generatedSet = new Set(generatedUrls);

for (const url of generatedUrls) {
  if (url !== sitemapIndexUrl && !url.endsWith('/')) {
    violations.push(`dist/llms.txt -> ${url} -- internal page URL must end with /`);
  }
  if (url !== sitemapIndexUrl && !sitemapSet.has(url)) {
    violations.push(`dist/llms.txt -> ${url} -- URL is absent from dist/sitemap-0.xml`);
  }
}

for (const url of sitemapUrls) {
  if (!generatedSet.has(url)) {
    violations.push(`dist/sitemap-0.xml -> ${url} -- URL is absent from dist/llms.txt`);
  }
}

for (const url of new Set(generatedUrls)) {
  if (generatedUrls.filter((entry) => entry === url).length > 1) {
    violations.push(`dist/llms.txt -> ${url} -- URL appears more than once`);
  }
}

if (distBytes && publicBytes && !distBytes.equals(publicBytes)) {
  violations.push('dist/llms.txt -> public/llms.txt -- files are not byte-identical');
}

console.log(
  `check-llms-txt: checked ${sitemapUrls.length} sitemap URLs and ${generatedUrls.length} llms.txt URLs, found ${violations.length} violations.`,
);

if (violations.length === 0) {
  console.log('check-llms-txt: OK - URL inventories match and both llms.txt copies are identical.');
  process.exit(0);
}

for (const violation of violations) console.error(violation);
process.exit(1);
