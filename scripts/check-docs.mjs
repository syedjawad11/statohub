/**
 * Documentation integrity gate.
 *
 * Implements the validation script specified in `docs/MEMORY-SYSTEM.md` (the
 * "Conflict and staleness detection" section) and never built until now. Stale
 * docs are worse than no docs: they actively mislead agents, and every defect
 * this checks for was found live in the repo during the 2026-09-03 housekeeping
 * audit.
 *
 * Checks:
 *   1. Every relative markdown link in docs/ (and CLAUDE.md / AGENTS.md) resolves.
 *   2. Every [[adr-slug]] wikilink resolves to a file in docs/decisions/.
 *   3. Every ADR file appears in the docs/decisions/README.md index.
 *   4. NOW.md and CLAUDE.md stay under their stated line caps.
 *   5. No session file older than 30 days sits outside sessions/archive/.
 *
 * Plain Node, no dependencies, exit 1 on violation -- same idiom as
 * scripts/check-links.mjs.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('.');
const violations = [];

const LINE_CAPS = [
  { file: 'docs/status/NOW.md', max: 60 },
  { file: 'CLAUDE.md', max: 150 },
];

const SESSION_MAX_AGE_DAYS = 30;

function report(file, message) {
  violations.push({ file, message });
}

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      walk(full, out);
    } else if (entry.name.endsWith('.md')) {
      out.push(full);
    }
  }
  return out;
}

// Archived sessions and docs/legacy/ are immutable history: they are expected
// to reference things that no longer exist, and rewriting them to satisfy a
// linter would falsify the record. They are excluded from link checks (but
// archived sessions are still subject to nothing -- see check 5, which only
// looks at the live sessions dir).
const FROZEN = ['docs/status/sessions/archive', 'docs/legacy'];

const isFrozen = (file) => {
  const rel = path.relative(ROOT, file).split(path.sep).join('/');
  return FROZEN.some((dir) => rel.startsWith(`${dir}/`));
};

const markdownFiles = [
  ...walk(path.join(ROOT, 'docs')),
  path.join(ROOT, 'CLAUDE.md'),
  path.join(ROOT, 'AGENTS.md'),
]
  .filter(existsSync)
  .filter((f) => !isFrozen(f));

// ---------------------------------------------------------------- 1 + 2

// Markdown links: [text](target). Skip external, anchors, and mailto.
const LINK_RE = /\[[^\]]*\]\(([^)]+)\)/g;
const WIKILINK_RE = /\[\[([^\]]+)\]\]/g;

const adrFiles = existsSync(path.join(ROOT, 'docs/decisions'))
  ? readdirSync(path.join(ROOT, 'docs/decisions')).filter(
      (f) => f.endsWith('.md') && f !== 'README.md',
    )
  : [];
const adrSlugs = new Set(adrFiles.map((f) => f.replace(/\.md$/, '')));

for (const file of markdownFiles) {
  const text = readFileSync(file, 'utf8');
  const rel = path.relative(ROOT, file);

  for (const match of text.matchAll(LINK_RE)) {
    const target = match[1].trim().split(/\s+/)[0];
    if (
      /^(https?:|mailto:|tel:|#)/.test(target) ||
      target.startsWith('<') ||
      target === ''
    ) {
      continue;
    }
    const cleaned = target.split('#')[0];
    if (!cleaned) continue;
    // Resolve relative to the file, then fall back to the repo root -- docs
    // routinely cite repo-root paths like `scripts/db_sync.py` inline.
    const resolved = path.resolve(path.dirname(file), cleaned);
    const fromRoot = path.resolve(ROOT, cleaned);
    if (!existsSync(resolved) && !existsSync(fromRoot)) {
      report(rel, `broken link -> ${target}`);
    }
  }

  for (const match of text.matchAll(WIKILINK_RE)) {
    const slug = match[1].trim();
    // Wikilinks point at ADRs, by full slug ([[0002-flat-url-structure]]) or
    // by number alone ([[0014]]) -- both forms appear in committed ADRs, and
    // ADR bodies are append-only, so both must be accepted.
    const matchesFull = adrSlugs.has(slug);
    const matchesNumber = /^\d{4}$/.test(slug) && adrFiles.some((f) => f.startsWith(`${slug}-`));
    if (!matchesFull && !matchesNumber) {
      report(rel, `wikilink [[${slug}]] has no matching file in docs/decisions/`);
    }
  }
}

// ---------------------------------------------------------------- 3

const indexPath = path.join(ROOT, 'docs/decisions/README.md');
if (adrFiles.length && existsSync(indexPath)) {
  const index = readFileSync(indexPath, 'utf8');
  for (const adr of adrFiles) {
    if (!index.includes(adr)) {
      report('docs/decisions/README.md', `ADR not listed in the index: ${adr}`);
    }
  }
}

// ---------------------------------------------------------------- 4

for (const { file, max } of LINE_CAPS) {
  const full = path.join(ROOT, file);
  if (!existsSync(full)) continue;
  // Match `wc -l`: a trailing newline does not start a new line.
  const lines = readFileSync(full, 'utf8').replace(/\n$/, '').split('\n').length;
  if (lines > max) {
    report(file, `${lines} lines exceeds its ${max}-line cap (trim it)`);
  }
}

// ---------------------------------------------------------------- 5

const sessionsDir = path.join(ROOT, 'docs/status/sessions');
if (existsSync(sessionsDir)) {
  const cutoff = Date.now() - SESSION_MAX_AGE_DAYS * 86_400_000;
  for (const entry of readdirSync(sessionsDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
    // Prefer the YYYY-MM-DD prefix over mtime -- git checkouts reset mtimes.
    const dateMatch = entry.name.match(/^(\d{4})-(\d{2})-(\d{2})/);
    const stamp = dateMatch
      ? Date.parse(`${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}T00:00:00Z`)
      : statSync(path.join(sessionsDir, entry.name)).mtimeMs;
    if (stamp < cutoff) {
      report(
        `docs/status/sessions/${entry.name}`,
        `older than ${SESSION_MAX_AGE_DAYS} days and still outside archive/`,
      );
    }
  }
}

// ----------------------------------------------------------------

console.log(
  `check-docs: scanned ${markdownFiles.length} markdown files, ${adrFiles.length} ADRs, found ${violations.length} violations.`,
);

if (violations.length === 0) {
  console.log('check-docs: OK - links resolve, ADR index complete, caps respected.');
  process.exit(0);
}

for (const v of violations) {
  console.error(`${v.file} -- ${v.message}`);
}

process.exit(1);
