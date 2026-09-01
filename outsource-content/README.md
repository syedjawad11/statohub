# outsource-content/

A second, deliberately separate content pipeline. It ingests articles written
by **babylovegrowth** (an outsourced writing vendor, via their API) for the
Applied Statistics pillar, sanitizes them, and publishes them through the
same build gates as every other article on the site.

## Boundary with `content-ops/`

This is **not** a mode of the internal editorial board — it's a different
system that happens to write to the same output location.

| | `content-ops/` (internal) | `outsource-content/` (this) |
|---|---|---|
| Source of the article | Claude writes it | babylovegrowth's API |
| Database | `content.db` | `outsource_content.db` (own file) |
| CLI | `content_db.py` | `outsource_db.py` |
| Text quality gate | Reviewed against the SEO playbook | **Not validated** — trusted as-is |
| Image/citation handling | N/A (no images to strip) | Strips every non-table/infographic image and every babylovegrowth citation/backlink |
| Publish approval | Human flips `draft: false` | Fully automatic once `check_sanitized.py` + the real build gate both pass |

Both pipelines write into the **same** `src/content/articles/` collection,
under the **same** `src/content/config.ts` schema, and both must clear the
**same** `.claude/applied-playbook.md` HARD gates before publish — an
outsourced article looks structurally identical to a hand-written one once
it's live. The only thing that differs is where the prose came from and how
it got sanitized on the way in.

`content-ops/content.db`'s `keywords` table (the sitewide cannibalization
guard) is read **read-only** from here, as a cross-check before an article
is marked `approved` — this pipeline never writes to `content.db`, and
`content_db.py` never touches `outsource_content.db`.

## Layout

- `schema.sql` / `outsource_content.db` — the tracking DB (own file, not
  `content-ops/content.db`). The `.db` itself is **gitignored**; what's
  committed is `outsource_content.sql`, a deterministic text dump. After a
  fresh clone run `python3 scripts/db_sync.py rebuild` to recreate the `.db`,
  and after any board change run `python3 scripts/db_sync.py dump` before
  committing. Rationale: a binary blob cannot be pushed through the GitHub
  MCP server (see that script's header).
- `outsource_db.py` — CLI: `init`, `import-calendar`, `list`, `show`, `map`,
  `fetch`, `processed`, `set-status`, `log-review`, `stats`.
- `calendar.json` — the 20-topic priority-ordered queue (not literal
  calendar dates — see `queue_position`).
- `babylovegrowth_client.py` — the only file that talks to the
  babylovegrowth API.
- `raw/<slug>.json` — the untouched fetched payload per article, kept as an
  audit trail (committed to git, unlike `raw/_article-list-cache.json`,
  which is a regeneratable point-in-time cache and is gitignored).
- `check_sanitized.py` — the deterministic, fail-closed gate that actually
  blocks a bad article before it can publish (see the script's own header
  for the full check list).
- `cloud-routine/` — the autonomous scheduled-publish routine spec, once the
  first article has been manually verified (see repo root `CLAUDE.md` /
  `docs/status/NOW.md` for whether it's active).

## Status flow

    queued -> fetched -> processing -> in_review -> changes_requested
           -> approved -> published

    blocked   (terminal; needs a human — e.g. can't reach 6 real sources
               after stripping citations, or the source article has no
               table/infographic to convert. Never forced through.)

## Why full auto

Once `check_sanitized.py` and the real build gate (`astro check` + `vitest`
+ `npm run build`) both pass, an article publishes with no per-article human
sign-off — the mechanical gate, not a human or an agent's self-report, is
what's actually trusted. The first real article was manually reviewed before
this was turned on for the rest of the queue.
