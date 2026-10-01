---
number: 0027
title: Workspace moves to macOS; pushes go over HTTPS via the gh credential helper
type: process
status: accepted
date: 2026-10-01
---

**Context:** The workspace moved again, Windows -> Linux (2026-08) -> macOS on
Apple Silicon (2026-10-01). The repo was re-cloned fresh to `~/statohub`
(not the Desktop). [[0017-git-push-over-ssh]] relied on an ed25519 key at
`~/.ssh/id_ed25519` on the Linux machine; the Mac has no `~/.ssh` at all, and
0017 itself says a new machine should provision its own credential rather
than copy the old key. The `gh` CLI is already authenticated as
`syedjawad11` on the Mac.

**Options considered:**
(1) Generate a new SSH key on the Mac, register it, switch `origin` to SSH.
(2) Keep `origin` on HTTPS and let `gh auth setup-git` register `gh` as git's
credential helper for github.com.

**Decision:** Option 2. `origin` is `https://github.com/syedjawad11/statohub.git`;
`git push` authenticates through `gh auth git-credential` (global git config).

**Reasoning:** Same outcome as 0017 -- real `git push`, byte-exact binary and
large files, deletes work -- with no new private key to manage; the credential
is the `gh` token already stored in the macOS keychain. `git push --dry-run`
was verified on setup.

**Consequences:** Mac toolchain, for anyone reproducing it: Homebrew
`node@20` (keg-only; `/opt/homebrew/opt/node@20/bin` is on `PATH` via
`~/.zprofile`), system `/usr/bin/python3` (3.9 -- all repo scripts run on it),
system `sqlite3`. After a fresh clone: `npm ci`, then
`python3 scripts/db_sync.py rebuild` (per [[0018-sqlite-boards-as-sql-dumps]]).
macOS's filesystem is case-insensitive; Linux CI is not, so a rename that only
changes case must go through `git mv`. The `codex` MCP server in `.mcp.json`
needs the Codex CLI installed on the Mac before it will start.

**Revisit when:** the workspace moves machines again, or `gh` is logged out.

**Related:** [[0017-git-push-over-ssh]], [[0016-github-mcp-for-pushes]],
[[0018-sqlite-boards-as-sql-dumps]]
