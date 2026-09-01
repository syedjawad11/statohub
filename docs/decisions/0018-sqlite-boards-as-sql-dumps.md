---
number: 0018
title: SQLite boards are tracked as SQL dumps, not binary blobs
type: architecture
status: accepted
date: 2026-09-01
---

**Context:** `content-ops/content.db` and
`outsource-content/outsource_content.db` were committed as binary SQLite
files. That made them unpushable through the GitHub MCP server (see
[[0017-git-push-over-ssh]]), and it silently broke the outsource pipeline:
the three articles published on 2026-08-31 (`bonferroni-correction`,
`mediation-analysis`, `randomized-controlled-trial`) went live with
`draft: false` while the board still read `queued`, because each publish push
carried the `.mdx`, `llms.txt` and `calendar.json` and dropped the `.db`.
`publish-outsource-article` selects the first `queued` slug, so the next run
could have re-published a live article. Beyond that, a binary blob cannot be
reviewed -- a board change shows up in a diff as `Bin 184320 bytes`.

Nothing in the Astro build reads either database (verified by grep over
`src/`, `astro.config.*`, `scripts/`); they are dev-time authoring tools only,
so there was never a reason for them to be binary in git.

**Options considered:**
(1) Keep the binary `.db` tracked and rely on remembering to include it in
every push.
(2) Gitignore the `.db` and commit a deterministic `.sql` dump alongside it,
rebuilding the database locally.
(3) Move the boards out of git entirely into external storage.

**Decision:** Option 2. Both `.db` files are gitignored; `content-ops/
content.sql` and `outsource-content/outsource_content.sql` are the tracked
artifacts. `scripts/db_sync.py` provides `dump` (.db -> .sql), `rebuild`
(.sql -> .db) and `check`.

**Reasoning:** The dump is plain UTF-8, roughly half the size, diffs cleanly
in review, and rebuilds to logically identical rows -- verified by dropping
both `.db` files and rebuilding from the dumps. It is also deterministic:
independent runs 30+ minutes apart produce identical blob SHAs, so a diff
means the board genuinely changed. Option 3 would put project state outside
version control for no gain.

**Consequences:** A fresh clone must run `python3 scripts/db_sync.py rebuild`
before either board CLI works, and any board change must be followed by
`python3 scripts/db_sync.py dump` before committing -- forgetting this is the
same desync failure in a new costume, so `check` exists to catch it. Because
`sqlite3.connect()` creates an empty file as a side effect, running a board
CLI before `rebuild` leaves a 0-table `.db`; `rebuild` treats an empty
database as absent and overwrites it, so this self-heals.

**Revisit when:** a board grows large enough that a text dump becomes
unwieldy in review, or something in the build starts reading a board at build
time (at which point the rebuild step becomes a build dependency, not a
developer step).

**Related:** [[0017-git-push-over-ssh]], [[0016-github-mcp-for-pushes]]
