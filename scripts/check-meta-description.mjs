import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const MIN_LENGTH = 110;
const MAX_LENGTH = 160;

function collectHtmlFiles() {
  if (!existsSync(distDir)) {
    return [];
  }

  return readdirSync(distDir, { recursive: true })
    .filter((entry) => entry.endsWith('.html'))
    .map((entry) => path.join(distDir, entry));
}

function decodeHtmlEntities(str) {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function metaDescriptionFromHtml(html) {
  const match = html.match(
    /<meta\s+name=(["'])description\1\s+content=(["'])(.*?)\2\s*\/?>/i,
  );
  return match ? decodeHtmlEntities(match[3]) : null;
}

function isNoindex(html) {
  return /<meta\s+name=(["'])robots\1\s+content=(["'])[^"']*noindex[^"']*\2\s*\/?>/i.test(html);
}

const htmlFiles = collectHtmlFiles();
const violations = [];

for (const filePath of htmlFiles) {
  const html = readFileSync(filePath, 'utf8');
  const displayPath = path.relative(distDir, filePath).split(path.sep).join('/');

  if (isNoindex(html)) {
    continue;
  }

  const description = metaDescriptionFromHtml(html);

  if (description === null) {
    violations.push({ file: displayPath, reason: 'missing <meta name="description">' });
    continue;
  }

  const length = description.length;
  if (length < MIN_LENGTH || length > MAX_LENGTH) {
    violations.push({
      file: displayPath,
      reason: `meta description is ${length} chars (must be ${MIN_LENGTH}-${MAX_LENGTH})`,
    });
  }
}

console.log(
  `check-meta-description: scanned ${htmlFiles.length} pages, found ${violations.length} violations.`,
);

if (violations.length === 0) {
  console.log(`check-meta-description: OK - all meta descriptions are ${MIN_LENGTH}-${MAX_LENGTH} chars.`);
  process.exit(0);
}

for (const violation of violations) {
  console.error(`${violation.file} -- ${violation.reason}`);
}

process.exit(1);
