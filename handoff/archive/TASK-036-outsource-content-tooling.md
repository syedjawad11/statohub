Status: CLOSED
<!-- TODO | IN_PROGRESS | DONE | CHANGES_REQUESTED | CLOSED -->

# TASK-036 -- outsource-content pipeline tooling (babylovegrowth ingestion)

- **Owner of this stage:** Codex
- **Repo:** `Desktop/statohub/` (where the work happens)
- **Created:** 2026-08-20 by Claude

<!-- Authoring note (Claude): keep this file plain ASCII. Use `--` not an em
dash, `->` not an arrow, `...` not an ellipsis. Codex reads these files through
a Windows codepage; non-ASCII punctuation renders as mojibake and breaks its
apply_patch matching. -->

---

## Brief  *(Claude writes -- what Codex needs to execute)*

**Goal:** Build the engineering scaffold for a brand-new, fully separate
content pipeline that ingests articles from the babylovegrowth API, so a
later Claude pass can sanitize (strip images/citations, convert
tables/infographics to house components) and publish them through the
existing Applied Statistics build gates. This task is pure infrastructure --
a SQLite tracking DB, a CLI, an API client, and a mechanical
sanitization-and-structure gate script. No article content is written in
this task, and nothing in `src/content/articles/` is touched.

**Context / inputs:**
- New directory `outsource-content/`, a sibling to `content-ops/` (the
  existing internal editorial board), deliberately kept separate. Do not
  touch `content-ops/` or `content.db` in this task.
- `content-ops/schema.sql` and `content-ops/content_db.py` are the pattern
  to mirror in structure and style (Python-3-stdlib-only, argparse
  subparsers, `sqlite3.connect` with `conn.row_factory = sqlite3.Row`,
  `PRAGMA foreign_keys = ON`, a UTF-8 stream-reconfigure guard at the top
  for Windows consoles). Read them for the style bar; do not import from
  them or add a dependency on them. The one place `outsource-content/` code
  may read `content-ops/content.db` is the read-only cannibalization
  cross-check described under `check_sanitized.py` below -- never write to
  `content.db` from anything in this task.
- `outsource-content/calendar.json` already exists (Claude wrote it, real
  20-row queue) -- use it as the real input to test `import-calendar`
  against; do not edit it.
- `outsource-content/README.md` already exists (Claude wrote it) -- states
  the boundary with `content-ops/`. Read it for context; do not need to
  change it.
- The real babylovegrowth API spec (confirmed from their own integration
  docs):
  - Base URL: `https://api.babylovegrowth.ai/api/integrations` (constant in
    `babylovegrowth_client.py`; overridable via an optional
    `BABYLOVEGROWTH_API_BASE_URL` env var).
  - Every request needs header `X-API-Key: <value of BABYLOVEGROWTH_API_KEY
    env var>` and header `Content-Type: application/json`. Never hardcode
    the key; never log or print its value anywhere, including error
    messages and cache files.
  - `GET /v1/articles?limit=N&offset=M` -- list, newest first, returns
    summaries. Max `limit` is 500. Paginate by incrementing `offset` by
    `limit` until a page returns fewer than `limit` items.
  - `GET /v1/articles/{id}` -- one full article. Returns (at least) these
    fields: `title`, `content_html`, `content_markdown`, `slug`,
    `meta_description`, `hero_image_url`, `jsonLd`, `faqJsonLd`,
    `languageCode`, `publishedAt`.
  - The API is rate-limited -- babylovegrowth's own docs say to sync into
    your own storage and never call the API on a page view. This client is
    only ever invoked from the CLI (`map` lookups, `fetch`), never from any
    site/build code.

**Deliverables:**
- [ ] `outsource-content/schema.sql` -- new tables `outsource_articles` and
      `outsource_reviews` (exact DDL below). Idempotent (`CREATE TABLE IF
      NOT EXISTS`), applied by `outsource_db.py init`.
- [ ] `outsource-content/outsource_db.py` -- CLI, Python 3 stdlib only (no
      pip installs), argparse subcommands (exact command surface below).
- [ ] `outsource-content/babylovegrowth_client.py` -- API adapter (exact
      function contract below).
- [ ] `outsource-content/check_sanitized.py` -- mechanical gate script
      (exact check list below), runnable standalone:
      `python outsource-content/check_sanitized.py <path-to-mdx-file>`.
- [ ] `.env.example` (repo root) -- add these two lines (do not remove or
      reorder any existing lines in the file):
      `BABYLOVEGROWTH_API_KEY=`
      `BABYLOVEGROWTH_API_BASE_URL=`
      with a one-line comment above each explaining it's the outsource
      pipeline's key/base-url and that the base URL defaults in code when
      left blank. Confirm `.gitignore` already ignores `.env` (it does --
      do not change the existing `.env`/`.env.*`/`!.env.example` block).
- [ ] `outsource-content/raw/` -- created by `fetch` at runtime; commit an
      `outsource-content/raw/.gitkeep` so the directory exists in git. Add
      **only** `outsource-content/raw/_article-list-cache.json` to
      `.gitignore` (it's a regeneratable cache, not an audit artifact). Do
      **not** gitignore the whole `raw/` directory -- the per-article
      `outsource-content/raw/<slug>.json` files are meant to be committed
      later as an audit trail.

### `schema.sql` -- exact DDL

```sql
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS outsource_articles (
  slug                TEXT PRIMARY KEY,
  title               TEXT NOT NULL,
  category_slug       TEXT NOT NULL,
  queue_position      INTEGER NOT NULL,
  day_label           TEXT NOT NULL DEFAULT '',
  babylovegrowth_id   TEXT,
  status              TEXT NOT NULL DEFAULT 'queued',
  raw_path            TEXT,
  mdx_path            TEXT,
  images_removed      INTEGER NOT NULL DEFAULT 0,
  images_converted    INTEGER NOT NULL DEFAULT 0,
  citations_stripped  INTEGER NOT NULL DEFAULT 0,
  source_count        INTEGER,
  notes               TEXT NOT NULL DEFAULT '',
  created_at          TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

-- status values: queued -> fetched -> processing -> in_review ->
-- changes_requested -> approved -> published, plus a terminal 'blocked'
-- (needs a human; nothing auto-retries out of it).

CREATE TABLE IF NOT EXISTS outsource_reviews (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  article_slug   TEXT NOT NULL REFERENCES outsource_articles(slug) ON DELETE CASCADE,
  passed         INTEGER NOT NULL DEFAULT 0,
  notes          TEXT NOT NULL DEFAULT '',
  created_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_outsource_status ON outsource_articles(status);
CREATE INDEX IF NOT EXISTS idx_outsource_queue ON outsource_articles(queue_position);
```

### `outsource_db.py` -- exact command surface

```
python outsource-content/outsource_db.py init
python outsource-content/outsource_db.py import-calendar <path-to-json>
python outsource-content/outsource_db.py list [--status S] [--category C]
python outsource-content/outsource_db.py show <slug>
python outsource-content/outsource_db.py map <slug> <babylovegrowth_id> [--force]
python outsource-content/outsource_db.py fetch <slug>
python outsource-content/outsource_db.py processed <slug> --mdx-path P
    --images-removed N --images-converted N --citations-stripped N
    --source-count N
python outsource-content/outsource_db.py set-status <slug> <status>
python outsource-content/outsource_db.py log-review <slug> <pass|fail> "notes"
python outsource-content/outsource_db.py stats
```

Behavior per command:
- **init:** `conn.executescript(SCHEMA_PATH.read_text())`, like
  `content_db.py`'s `cmd_init` (skip the categories/section migration block
  -- that's `content_db.py`-specific and doesn't apply here).
- **import-calendar \<path\>:** reads a JSON file shaped
  `{"articles": [{"queue_position": int, "day_label": str, "title": str,
  "slug": str, "category_slug": str}, ...]}`. Upserts each row into
  `outsource_articles` by `slug` -- same idempotent-reseed pattern as
  `content_db.py`'s `cmd_seed`, but on conflict only overwrite the
  calendar-sourced columns (`title`, `category_slug`, `queue_position`,
  `day_label`); preserve the existing `status` / `babylovegrowth_id` /
  `mdx_path` / etc. so re-running the import never resets progress. Print
  one summary line: `Imported N articles (M new, K updated).`
- **list:** prints a table (status / queue_position / category_slug / slug)
  sorted by `queue_position`, same tabular style as `content_db.py`'s
  `cmd_list`. Supports `--status` and `--category` filters.
- **show \<slug\>:** prints the full row plus `outsource_reviews` history
  for that slug, mirroring `content_db.py`'s `cmd_show` shape.
- **map \<slug\> \<babylovegrowth_id\>:** sets `babylovegrowth_id` on the
  row. Refuse (exit non-zero, clear message) if the row already has a
  *different* `babylovegrowth_id` set, unless `--force` is passed. This
  exists because babylovegrowth's API has no topic filter -- only a
  newest-first list and get-by-id -- so linking "which of their articles is
  our topic N" is a manual one-time lookup per article, not something any
  command re-derives automatically.
- **fetch \<slug\>:** exits with a clear error if `babylovegrowth_id` isn't
  set yet ("run map first"). Otherwise calls
  `babylovegrowth_client.get_article(babylovegrowth_id)`, writes the FULL
  raw API response (not the normalized dict) to
  `outsource-content/raw/<slug>.json`, sets `raw_path` to that path and
  `status` to `'fetched'`, and prints a short summary: title, an approx
  word count of `content_markdown`, and a naive count of image references
  in the body (matches of `<img` or `![` in `content_markdown` /
  `content_html`) -- for a human's sanity check before the processor runs.
- **processed \<slug\> --mdx-path P --images-removed N --images-converted N
  --citations-stripped N --source-count N:** sets those columns plus
  `status='in_review'`. This is called by a separate processor agent
  (not part of this task) after it writes the MDX file -- you're only
  building the command that records the result.
- **set-status \<slug\> \<status\>:** validates against
  `queued, fetched, processing, in_review, changes_requested, approved,
  published, blocked`, same shape as `content_db.py`'s `cmd_set_status`.
- **log-review \<slug\> \<pass|fail\> "notes":** inserts into
  `outsource_reviews`, sets `status` to `approved` (pass) or
  `changes_requested` (fail) -- mirrors `content_db.py`'s `cmd_log_review`
  minus the numeric score (this pipeline's gate is pass/fail, not a 0-100
  score).
- **stats:** counts by status, same shape as `content_db.py`'s `cmd_stats`.

Match `content_db.py`'s conventions exactly where not specified above: the
UTF-8 stream-reconfigure block at the top (copy it verbatim -- it exists
because `content_db.py` learned the hard way that a Windows console
defaulting to cp1252 raises `UnicodeEncodeError` on non-ASCII output),
`DB_PATH`/`SCHEMA_PATH` resolved relative to `__file__`, `sqlite3.Row` row
factory, a docstring usage block at the top of the file.

### `babylovegrowth_client.py` -- exact function contract

```python
def list_articles(limit=50, max_pages=10):
    """
    Paginate GET /v1/articles?limit=&offset=, stopping when a page returns
    fewer than `limit` items OR max_pages is reached (defensive cap -- our
    20 commissioned topics should appear well within the first few hundred
    newest articles). Cache the combined result to
    outsource-content/raw/_article-list-cache.json (overwrite each call --
    it's a point-in-time cache, not an append log). Returns a list of
    whatever summary dicts the API gives back. Do not assume specific
    summary fields beyond what the response actually contains -- the
    summary shape isn't fully documented in the API docs we have; log a
    warning and continue if an expected field like 'id' or 'title' is
    missing from one item, rather than crashing the whole page.
    """

def get_article(article_id):
    """
    GET /v1/articles/{id}. Returns a tuple (normalized_dict, raw_response):

    normalized_dict = {
      "babylovegrowth_id": <the id>,
      "title": ...,
      "body_markdown": <content_markdown if non-empty, else content_html
          converted to Markdown -- check requirements.txt / package.json
          first for an existing HTML-to-Markdown or Markdown library
          before adding one; if none exists, a reasonable stdlib-only
          fallback is to strip tags with html.parser and preserve just
          the text, but flag this specific fallback in the Work Log since
          it will lose formatting content_markdown wouldn't lose>,
      "slug_source": <the API's own `slug` field -- reference metadata
          only, never used to name our MDX file or URL>,
      "meta_description": ...,
      "language_code": ...,
      "published_at": ...,
    }

    normalized_dict deliberately DROPS hero_image_url, jsonLd, and
    faqJsonLd -- they must not be present in the dict at all, not just
    unused downstream. raw_response is the full, untouched API response
    (the caller -- outsource_db.py's `fetch` -- writes THAT to
    raw/<slug>.json; get_article itself doesn't write files).
    """
```

Raise a clear exception (never silently return partial data) on a
non-2xx response, a timeout, or a missing `BABYLOVEGROWTH_API_KEY`. Use
`urllib.request` from the stdlib (matching the Python-3-stdlib-only
convention already established in `content-ops/`) unless `requests` is
already a dependency for some other Python tool in this repo -- check
first, and note which you used in the Work Log.

### `check_sanitized.py` -- exact check list

Usage: `python outsource-content/check_sanitized.py <path-to-mdx-file>`.
Exit `0` only if every check below passes; otherwise exit `1` and print
every failing check (one line per failure, prefixed `FAIL:`, with the
line number or matched text where practical) plus a final summary line.
A `--verbose` flag additionally prints `PASS:` lines for checks that
succeeded.

**Structural / build-contract checks** (mirrors `.claude/applied-playbook.md`
section 9's HARD tier -- every outsourced article must clear the same bar
as a hand-written Applied article):
1. Frontmatter parses as valid YAML with required keys: `title`,
   `description`, `category`, `primaryKeyword`, `keywords` (non-empty
   list), `phase`, `draft`. `category` must be one of: `data-analysis`,
   `experiments-causality`, `time-series-forecasting`,
   `machine-learning-statistics`.
2. `description` length is 110-160 characters.
3. `draft: true` is set.
4. Exactly one H1: zero body lines starting with `# ` and zero `<h1`
   occurrences -- the frontmatter `title` is the only H1, so the body must
   have none.
5. A `<KeyTakeaways` occurrence appears before the first `## ` heading in
   the body.
6. At least one each of `<DataTable`, `<Checklist`, `<Figure` appear
   somewhere in the body.
7. A literal `## Sources` heading exists, and the entries beneath it
   (before the next `## ` heading or end of file) total at least 6 --
   count occurrences of `href:` in that span as a reasonable proxy for
   entry count.
8. A literal `## FAQ` heading exists, and the entries beneath it (before
   the next `## ` heading or end of file) total at least 3 -- count
   occurrences of `question:` in that span.
9. No raw LaTeX: zero occurrences of `$$` or a backslash-command pattern
   like `\dfrac{`, `\frac{`, `\sum` in the body.
10. No hand-typed internal href: zero markdown links of the form `](/...`
    (a literal slash right after the opening paren) and zero `href="/`
    attributes -- internal links must go through the `Link` component /
    routes registry, never a raw path.
11. Approximate body word count >= 3000. Compute by: strip the frontmatter
    block, strip all JSX/component tags and everything between a paired
    open/close tag for any capitalized-tag component (a regex-based strip
    is fine, doesn't need a full parser), then count remaining
    whitespace-separated words. Add a code comment noting this is
    intentionally approximate (component-internal prose like FAQ answers
    and Checklist detail text is excluded by design, matching the
    playbook's "components don't inflate it artificially" rule) and that a
    result close to the 3000 floor deserves a human glance, not blind
    trust.

**babylovegrowth-specific checks** (why this pipeline exists):
12. Zero occurrences, case-insensitive, of `<img`, `![`, or `<Image`
    anywhere in the file -- every image must already have been removed or
    converted to a `DataTable`/infographic component before this script
    runs; any surviving raster image is an automatic failure.
13. Zero occurrences, case-insensitive, of the literal string
    `babylovegrowth` anywhere in the file.
14. Zero markdown/HTML links whose href host is `babylovegrowth.ai` or
    `babylovegrowth.com` (case-insensitive, with or without a `www.`
    prefix) -- extract every `href="..."` and every markdown `[text](url)`
    target, parse the host with `urllib.parse`, and compare.

**Explicitly OUT OF SCOPE for this script** (do not add): verifying the
external Sources links actually resolve (that's a network-dependent curl
check a reviewing agent does separately, same as the existing
`stats-article-reviewer` agent does for internal articles -- keep this
script offline and fast), and any judgment of prose quality, factual
accuracy, or fabricated claims (explicitly out of scope for this whole
pipeline per the project owner's instruction -- content text is trusted
as-is; this script only checks structure and babylovegrowth-specific
cleanup, never rewrites or grades prose).

**Constraints:**
- Stay in `outsource-content/` and the two root-level touches listed above
  (`.env.example`, one `.gitignore` addition for the cache file only).
  Don't touch `content-ops/`, `src/`, or any `handoff/` file other than
  this one.
- Python 3 stdlib only across all four scripts -- no pip installs. If you
  hit a real need for a third-party package, stop and note it in the Work
  Log as a blocked decision rather than adding a dependency unilaterally.
- Plain ASCII in every file you author (same reason as this task file --
  avoid mojibake).
- Never print or log the actual `BABYLOVEGROWTH_API_KEY` value anywhere,
  including error messages and cache files.

**Definition of done / how to verify:**
- `python outsource-content/outsource_db.py init` creates
  `outsource-content/outsource_content.db` with no errors.
- `python outsource-content/outsource_db.py import-calendar
  outsource-content/calendar.json` then
  `python outsource-content/outsource_db.py list` shows all 20 rows,
  status `queued`, correct `category_slug` per row, sorted by
  `queue_position` 1-20.
- `python outsource-content/outsource_db.py stats` shows 20 total, all
  `queued`.
- `python outsource-content/check_sanitized.py
  src/content/articles/exploratory-data-analysis.mdx` -- an existing, real,
  published Applied article -- passes every check except `draft: true`
  (that file is published with `draft: false`; note that expected
  exception in the Work Log rather than treating it as a bug). This is the
  smoke test that the structural checks aren't over- or under-firing on a
  known-good file.
- `babylovegrowth_client.py` cannot be fully end-to-end tested without a
  live `BABYLOVEGROWTH_API_KEY` (Claude will do that after this task
  closes, using the real key). Instead, verify it imports cleanly and that
  `list_articles`/`get_article` raise a clear error (not a traceback) when
  `BABYLOVEGROWTH_API_KEY` is unset, and add a small `if __name__ ==
  '__main__':` smoke block that prints the exact request (method, URL,
  headers with the key value redacted) it would make -- your call on the
  exact mechanism, just make the request shape sanity-checkable without a
  real key.

---

## Work Log  *(Codex writes -- what was actually done)*

- **Started:** 2026-08-20
- **Finished:** 2026-08-20

**What changed (files + where):**
- `outsource-content/schema.sql` -- added the exact idempotent tracking schema
  for outsourced articles, reviews, statuses, queue ordering, and review
  cascading.
- `outsource-content/outsource_db.py` -- added the stdlib-only argparse CLI
  with `init`, `import-calendar`, `list`, `show`, `map`, `fetch`, `processed`,
  `set-status`, `log-review`, and `stats`; calendar re-imports preserve all
  progress fields.
- `outsource-content/babylovegrowth_client.py` -- added the `urllib.request`
  API adapter, capped pagination and cache, full-article normalization, safe
  errors, API-key redaction, and request-shape smoke output.
- `outsource-content/check_sanitized.py` -- added the 14-check offline MDX
  structural and babylovegrowth cleanup gate, including verbose PASS output
  and all-failure reporting.
- `outsource-content/raw/.gitkeep` -- committed-directory placeholder for raw
  per-article audit payloads.
- `outsource-content/outsource_content.db` -- created via `init` and populated
  from the real calendar with 20 queued rows and no reviews.
- `.env.example` -- created (it did not previously exist) with commented,
  blank key and optional base-URL variables.
- `.gitignore` -- added only
  `outsource-content/raw/_article-list-cache.json`; the existing `.env` block
  and per-article raw JSON tracking remain unchanged.
- `handoff/TASK-036-outsource-content-tooling.md` -- marked DONE and recorded
  this Work Log.

**How to verify:**
- `python outsource-content/outsource_db.py init` -- exit 0; printed
  `Schema applied to outsource_content.db`.
- `python outsource-content/outsource_db.py import-calendar
  outsource-content/calendar.json` -- exit 0; printed
  `Imported 20 articles (20 new, 0 updated).`
- `python outsource-content/outsource_db.py list` -- exit 0; printed 20 rows,
  all `queued`, in queue order 1 through 20, with each slug and category
  matching `calendar.json`; final line was `20 article(s).`
- `python outsource-content/outsource_db.py stats` -- exit 0; printed
  `Outsource board: 20 articles` and `queued              20`.
- `python outsource-content/check_sanitized.py
  src/content/articles/exploratory-data-analysis.mdx` -- exit 1 as expected
  for this published smoke fixture; exact output was
  `FAIL: [3] draft must be true (found False)` and
  `SUMMARY: 13 passed, 1 failed.` No other check failed.
- `python outsource-content/check_sanitized.py --verbose
  src/content/articles/exploratory-data-analysis.mdx` -- confirmed all 13
  other checks individually passed; notable real counts were description 146
  characters, 8 Sources, 5 FAQs, and approximately 3,280 body words.
- `python -c "import sys; sys.path.insert(0, r'outsource-content'); import
  babylovegrowth_client; print('Imported babylovegrowth_client cleanly.')"`
  -- exit 0; printed `Imported babylovegrowth_client cleanly.`
- With `BABYLOVEGROWTH_API_KEY` removed from the process environment, a
  Python stdin harness imported the client and called both functions. It
  exited 0 after catching `APIClientError`; the real messages were
  `list_articles: BABYLOVEGROWTH_API_KEY is not set; configure it before
  calling the API.` and the same message prefixed `get_article:`. There was
  no traceback and no key value.
- `python outsource-content/babylovegrowth_client.py` -- exit 0; printed the
  list URL with `limit=50&offset=0`, the full-article `{id}` URL, method GET,
  `Content-Type: application/json`, and `X-API-Key: <redacted>` for both.
- A workspace-local temporary Python harness exercised `map` refusal and
  `--force`, calendar progress preservation, mocked full-payload `fetch`,
  `processed`, and pass review behavior against an isolated DB; exit 0 with
  `OK: map/force, progress preservation, fetch, processed, and review
  behaviors`. The verified temporary files were then removed.
- A second isolated client harness exercised short-page pagination (offsets 0
  and 2), cache overwrite, exact normalized keys, raw-response identity,
  removal of `hero_image_url` / `jsonLd` / `faqJsonLd`, Markdown preference,
  and HTML fallback; exit 0 with `OK: pagination, caching, normalization,
  field dropping, and HTML fallback`.
- Read-only SQLite assertions compared the DB to all 20 calendar records and
  verified positions 1-20, categories, slugs, queued status, zero reviews,
  both required indexes, and the cascading review foreign key; all passed.
- A Python `ast.parse` plus ASCII-decode harness checked all three Python
  files, `schema.sql`, and `.env.example`; all parsed/decoded successfully.

**Blocked / couldn't do / decisions made:**
- No live API call was possible without `BABYLOVEGROWTH_API_KEY`, as expected;
  the request and mocked-contract checks above cover the offline verification.
- Used `urllib.request`, not `requests`: no Python requirements file or
  existing Python requests dependency exists in the repo, and all four tools
  are required to remain stdlib-only.
- No HTML-to-Markdown dependency exists. When `content_markdown` is empty,
  `get_article` uses the allowed `html.parser` text fallback. It preserves
  readable text and block boundaries but loses inline formatting; this is the
  specifically requested fallback caveat.
- The context mentions a read-only cannibalization cross-check "described
  below", but the exact numbered `check_sanitized.py` contract contains no
  such check. I did not invent an additional gate or access `content.db`.
  The implemented gate is exactly the specified 14 checks.

---

## Review  *(Claude writes -- accept or send back)*

- **Reviewed:** 2026-08-20
- **Verdict:** CLOSED

**Notes / what to improve:**
- Independently re-ran the key verification commands rather than trusting
  the Work Log alone (per this repo's close convention): `list`/`stats`
  show all 20 rows in correct queue order with correct category mapping;
  `check_sanitized.py --verbose` against the real published
  `exploratory-data-analysis.mdx` returns 13/14 PASS with only the expected
  `draft: true` failure (that file ships `draft: false`); the client's
  `__main__` smoke block prints the correct list/get URLs with the API key
  redacted; the `.gitignore` diff is exactly the one line specified, nothing
  else touched. All match the Work Log's claims.
- Read all four new Python files plus schema.sql end to end. Quality is
  good: the frontmatter parser is a sensibly-scoped hand-rolled YAML subset
  (no PyYAML available under the stdlib-only constraint, so writing one was
  the right call, not scope creep), the API client defensively handles
  multiple plausible response envelope shapes given the summary shape
  wasn't fully documented, and the API key is never exposed in URLs, logs,
  or error messages anywhere I checked.
- One real ambiguity in my own brief, correctly handled: the Context
  section referenced a cannibalization cross-check "described under
  check_sanitized.py below," but the numbered check list never actually
  included one — that check lives in the outsource-content-reviewer agent
  instead (a `content-ops/content.db` read-only query), which is where I'd
  actually intended it. Codex flagged the mismatch instead of inventing an
  extra check or silently guessing. No rework needed — the check exists in
  the right place, my brief's cross-reference was just imprecise.
- Not committed, as instructed. I'll handle the commit after confirming
  with the project owner.
