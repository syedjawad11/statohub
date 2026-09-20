// Backfill pubDate / updatedDate / reviewedDate in article and calculator-content
// frontmatter from git history, so every guide carries real dates instead of
// none. Rules, per file:
//   - pubDate      := date of the commit that added the file, when missing or
//                     earlier than that commit (a page cannot predate its file).
//   - updatedDate  := date of the last commit touching the file, when missing.
//   - reviewedDate := date of the last commit touching the file, when missing.
// Fields that are already set and plausible are left alone, so re-running is a
// no-op. Run from the repo root: `node scripts/backfill-dates.mjs [--dry-run]`.
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const DRY_RUN = process.argv.includes('--dry-run');
const DIRS = ['src/content/articles', 'src/content/calculator-content'];
const DATE_KEYS = ['pubDate', 'updatedDate', 'reviewedDate'];

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

function firstCommitDate(file) {
  const log = git(['log', '--diff-filter=A', '--follow', '--format=%as', '--', file]);
  const lines = log.split('\n').filter(Boolean);
  return lines[lines.length - 1];
}

function lastCommitDate(file) {
  return git(['log', '-1', '--format=%as', '--', file]);
}

function splitFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) throw new Error('no frontmatter block');
  return { frontmatter: match[1], body: source.slice(match[0].length) };
}

function readDate(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(\\S+)\\s*$`, 'm'));
  return match ? match[1] : undefined;
}

function setDate(frontmatter, key, value) {
  const pattern = new RegExp(`^${key}:.*$`, 'm');
  if (pattern.test(frontmatter)) return frontmatter.replace(pattern, `${key}: ${value}`);
  // Keep the three date keys together, after whichever of them already exists,
  // otherwise at the end of the block.
  const lines = frontmatter.split('\n');
  let insertAt = lines.length;
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    if (DATE_KEYS.some((k) => lines[i].startsWith(`${k}:`))) {
      insertAt = i + 1;
      break;
    }
  }
  lines.splice(insertAt, 0, `${key}: ${value}`);
  return lines.join('\n');
}

let changedFiles = 0;
const changes = [];

for (const dir of DIRS) {
  for (const name of readdirSync(dir).filter((entry) => entry.endsWith('.mdx')).sort()) {
    const file = path.join(dir, name);
    const source = readFileSync(file, 'utf8');
    const { frontmatter, body } = splitFrontmatter(source);
    const added = firstCommitDate(file);
    const last = lastCommitDate(file);
    if (!added || !last) throw new Error(`${file}: not in git history`);

    let next = frontmatter;
    const pub = readDate(frontmatter, 'pubDate');
    if (!pub) {
      next = setDate(next, 'pubDate', added);
      changes.push(`${file}: pubDate -> ${added}`);
    } else if (pub < added) {
      next = setDate(next, 'pubDate', added);
      changes.push(`${file}: pubDate ${pub} predates the file (added ${added}) -> ${added}`);
    }
    if (!readDate(frontmatter, 'updatedDate')) {
      next = setDate(next, 'updatedDate', last);
      changes.push(`${file}: updatedDate -> ${last}`);
    }
    if (!readDate(frontmatter, 'reviewedDate')) {
      next = setDate(next, 'reviewedDate', last);
      changes.push(`${file}: reviewedDate -> ${last}`);
    }

    if (next !== frontmatter) {
      changedFiles += 1;
      if (!DRY_RUN) writeFileSync(file, `---\n${next}\n---\n${body}`, 'utf8');
    }
  }
}

for (const line of changes) console.log(line);
console.log(
  `backfill-dates: ${DRY_RUN ? 'would change' : 'changed'} ${changedFiles} file(s), ${changes.length} field(s).`,
);
