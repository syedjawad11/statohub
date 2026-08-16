#!/usr/bin/env node
// Drift checker for docs/REPO-MAP.md.
//
// The map's value is its hand-written annotations (what each dir/file is FOR),
// which can't be auto-derived -- so this script does not regenerate the map from
// scratch. Instead it walks the directories the map documents and warns when a
// new top-level entry appears that the map doesn't mention yet, so a human knows
// to update the annotation by hand. Run after adding a new top-level src/ or repo
// subsystem; wire into a pre-commit hook or CI step if this starts getting missed.

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Must go through fileURLToPath, not URL.pathname: pathname stays
// percent-encoded, so a repo path containing spaces resolves to a directory
// that does not exist. Same approach as scripts/gen-route-ids.mjs.
const ROOT = fileURLToPath(new URL('..', import.meta.url));

const WATCHED_DIRS = [
  '.',
  'src',
  'src/pages',
  'src/calc',
  'src/components',
  'src/layouts',
  'src/content',
  'src/lib',
  'scripts',
  'content-ops',
  'docs',
  'handoff',
];

const IGNORE = new Set([
  'node_modules', 'dist', '.git', '.astro', '__tests__', '.DS_Store',
]);

function listEntries(relDir) {
  const abs = join(ROOT, relDir);
  try {
    return readdirSync(abs, { withFileTypes: true })
      .filter((e) => !IGNORE.has(e.name) && !e.name.startsWith('.'));
  } catch {
    return null;
  }
}

// Report only what the map actually tracks entry-by-entry: new DIRECTORIES
// (i.e. new subsystems) anywhere in the watched set, plus files sitting at the
// repo root. Individual files nested inside a watched directory are deliberately
// NOT reported -- the map summarises those in prose ("(26 engine files)",
// "TASK-001...TASK-024+"), so listing each one produces pure noise and trains
// readers to ignore the warning.
function isTracked(dir, dirent) {
  return dirent.isDirectory() || dir === '.';
}

const mapPath = join(ROOT, 'docs', 'REPO-MAP.md');
let mapText;
try {
  mapText = readFileSync(mapPath, 'utf8');
} catch {
  console.error('docs/REPO-MAP.md not found -- nothing to check against.');
  process.exit(1);
}

let unmentioned = [];

for (const dir of WATCHED_DIRS) {
  const entries = listEntries(dir);
  if (!entries) continue;
  for (const dirent of entries) {
    if (!isTracked(dir, dirent)) continue;
    if (!mapText.includes(dirent.name)) {
      unmentioned.push(`${dir}/${dirent.name}`);
    }
  }
}

if (unmentioned.length === 0) {
  console.log('docs/REPO-MAP.md looks up to date -- no unmentioned top-level entries found.');
  process.exit(0);
}

console.log('docs/REPO-MAP.md may be stale. Entries not mentioned in the map:');
for (const entry of unmentioned) {
  console.log(`  - ${entry}`);
}
console.log('\nIf any of these are real new subsystems, add a one-line annotation to docs/REPO-MAP.md.');
