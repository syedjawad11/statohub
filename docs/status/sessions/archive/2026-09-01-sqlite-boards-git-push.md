# Session: SQLite boards as SQL dumps + git push restored — 2026-09-01

**Objective:** Find out why pushing via the GitHub MCP server kept failing, fix
the cause properly, and leave the next session with a normal push workflow.

**Completed:**
- Diagnosed the MCP push problem: `push_files` takes `content` as a plain
  string and UTF-8-encodes it, so binary files can never transit byte-exact
  (both boards fail UTF-8 decode at byte `0x8a`; a lossy round-trip inflated
  `content.db` 184,320 -> 191,222 bytes). It also cannot delete, and always
  replaces whole files. The apparent binary-push precedent `bc5a15c` predates
  ADR 0016 by 7 days and went via real `git push` on Windows.
- Found and fixed a live bug: the outsource board read `queued` for
  `bonferroni-correction`, `mediation-analysis` and
  `randomized-controlled-trial` while all three were live with `draft:false`
  — every 08-31 publish push had silently dropped the `.db`. The next
  `publish-outsource-article` run could have re-published a live article.
- Migrated both boards to committed `.sql` dumps + `scripts/db_sync.py`
  (`dump` / `rebuild` / `check`); no binary `.db` is tracked any more.
- Provisioned an ed25519 SSH key and switched `origin` to SSH, restoring
  ordinary `git push`. Local and remote SHAs now match.
- Fixed two bugs in `db_sync.py` that only a real fresh clone exposed:
  `rebuild` aborted on the first board without a dump, and an empty `.db`
  left behind by `sqlite3.connect()` shadowed the committed dump.

**Files changed:** `scripts/db_sync.py`, `content-ops/content.sql`,
`outsource-content/outsource_content.sql`, `outsource-content/README.md`,
`.gitignore`, `docs/decisions/0016-github-mcp-for-pushes.md` (status),
`docs/decisions/0017-git-push-over-ssh.md`,
`docs/decisions/0018-sqlite-boards-as-sql-dumps.md`,
`docs/decisions/README.md`, `docs/status/NOW.md`, `docs/REPO-MAP.md`.
Deleted: `content-ops/content.db`, `outsource-content/outsource_content.db`.

**Decisions made:** [[0017-git-push-over-ssh]] (supersedes
[[0016-github-mcp-for-pushes]]), [[0018-sqlite-boards-as-sql-dumps]].

**Assumptions:** The board correction assumed those three articles are
genuinely published — verified against `draft: false` in each `.mdx` and their
presence on `origin/main`, not assumed from the board.

**Tests/verification:** `astro check` 0 errors; 121/121 tests; `npm run build`
124 pages, 0 link / llms / meta violations. Every MCP push made before SSH was
verified byte-exact by comparing `git hash-object` against
`git rev-parse origin/main:<path>`. Migration verified by a fresh `git clone`
of `origin/main` with the empty-`.db` footgun deliberately triggered first:
both boards rebuild, both CLIs report correct state, `db_sync.py check`
exits 0. Dump determinism confirmed across runs 30+ minutes apart.

**Open issues / risks:**
1. The classic `ghp_` PAT in `~/.claude.json` is plaintext and was printed
   into this session's transcript — **rotate it**. Git no longer needs it, but
   the GitHub MCP server still does.
2. `docs/ARCHITECTURE.md` still describes the MCP-only push workflow; it now
   contradicts ADR 0017 and needs a prose pass.
3. Session files from July/August are still outside
   `docs/status/sessions/archive/` (month-end housekeeping, not done here).

**Next actions:**
1. Rotate the GitHub PAT to a fine-grained token scoped to this repo.
2. Update `docs/ARCHITECTURE.md`'s push/workflow prose to match ADR 0017.
3. Resume the real backlog: Applied Statistics batch 2 (topics never chosen).

**Context for next session:** `docs/status/NOW.md`,
`docs/decisions/0017-git-push-over-ssh.md`,
`docs/decisions/0018-sqlite-boards-as-sql-dumps.md`, `scripts/db_sync.py`.
