import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const assetExtensions = new Set([
  '.js',
  '.mjs',
  '.css',
  '.xml',
  '.txt',
  '.json',
  '.svg',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.avif',
  '.ico',
  '.gif',
  '.woff',
  '.woff2',
  '.map',
  '.pdf',
]);

function stripQueryAndHash(href) {
  return href.split(/[?#]/, 1)[0];
}

function isSkippedHref(href) {
  if (
    href.startsWith('#') ||
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('//') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:')
  ) {
    return true;
  }

  const pathname = stripQueryAndHash(href);
  const finalSegment = pathname.split('/').filter(Boolean).at(-1) ?? '';
  return assetExtensions.has(path.extname(finalSegment).toLowerCase());
}

function collectHtmlFiles() {
  if (!existsSync(distDir)) {
    return [];
  }

  return readdirSync(distDir, { recursive: true })
    .filter((entry) => entry.endsWith('.html'))
    .map((entry) => path.join(distDir, entry));
}

function hrefsFromHtml(html) {
  return [...html.matchAll(/<a\b[^>]*\bhref=(["'])(.*?)\1/gi)].map((match) => match[2]);
}

function pathForInternalPage(pathname) {
  if (pathname === '/') {
    return path.join(distDir, 'index.html');
  }

  return path.join(distDir, ...pathname.split('/').filter(Boolean), 'index.html');
}

function redirectSources() {
  const redirectsPath = path.join(distDir, '_redirects');
  if (!existsSync(redirectsPath)) {
    return new Set();
  }

  return new Set(
    readFileSync(redirectsPath, 'utf8')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => line.split(/\s+/)[0])
      .filter(Boolean),
  );
}

const htmlFiles = collectHtmlFiles();
const redirects = redirectSources();
const violations = [];
let checkedLinks = 0;

for (const filePath of htmlFiles) {
  const html = readFileSync(filePath, 'utf8');
  const displayPath = path.relative(distDir, filePath).split(path.sep).join('/');

  for (const href of hrefsFromHtml(html)) {
    if (isSkippedHref(href)) {
      continue;
    }

    const pathname = stripQueryAndHash(href);
    if (!pathname.startsWith('/')) {
      continue;
    }

    checkedLinks += 1;

    if (!pathname.endsWith('/')) {
      violations.push({
        file: displayPath,
        href,
        reason: 'internal page link must end with /',
      });
      continue;
    }

    const expectedFile = pathForInternalPage(pathname);
    if (!existsSync(expectedFile)) {
      violations.push({
        file: displayPath,
        href,
        reason: 'missing matching index.html',
      });
      continue;
    }

    if (redirects.has(pathname)) {
      violations.push({
        file: displayPath,
        href,
        reason: 'links must not target a _redirects source',
      });
    }
  }
}

console.log(
  `check-links: scanned ${htmlFiles.length} pages, checked ${checkedLinks} internal links, found ${violations.length} violations.`,
);

if (violations.length === 0) {
  console.log('check-links: OK - all internal page links are canonical and resolvable.');
  process.exit(0);
}

for (const violation of violations) {
  console.error(`${violation.file} -> ${violation.href} -- ${violation.reason}`);
}

process.exit(1);
