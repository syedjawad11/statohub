---
number: 0017
title: Pushes go back to local git over SSH; GitHub MCP is a fallback
type: process
status: accepted
date: 2026-09-01
---

**Context:** [[0016-github-mcp-for-pushes]] routed every push through the
GitHub MCP server because the Windows->Linux move left no local git
credentials. That held for a week, then hit a wall the ADR had already
anticipated. `mcp__github__push_files` takes its `content` parameter as a
plain string, so it UTF-8-encodes whatever it is handed. Any file whose real
bytes are not valid UTF-8 therefore cannot transit byte-exact: both SQLite
boards fail UTF-8 decode at byte 98 (`0x8a`), and a lossy round-trip inflated
`content-ops/content.db` from 184,320 to 191,222 bytes. The tool also cannot
delete files (removals need a separate `delete_file` commit) and always
replaces a whole file rather than diffing -- the mechanism that silently
truncated `docs/ARCHITECTURE.md` on 2026-08-27, pushed at 4,234 bytes and
restored at 6,569 forty-four seconds later.

The one apparent precedent for a working binary push (`bc5a15c`, 2026-08-20)
was checked and predates ADR 0016 by seven days: it went out via a real
`git push` on the old Windows machine, so MCP binary transfer had never
actually worked.

**Options considered:**
(1) Keep MCP-only and hand-transcribe large/binary files into `push_files`
calls.
(2) Provision local git credentials (SSH key) and use `git push` again,
keeping MCP for convenience reads and small edits.

**Decision:** Option 2. An ed25519 key (`~/.ssh/id_ed25519`) is registered on
the `syedjawad11` account and `origin` is now
`git@github.com:syedjawad11/statohub.git`.

**Reasoning:** Option 1 is the same "reconstruct content instead of
transferring bytes" pattern that already corrupted a tracked file once; doing
it deliberately for an 87KB generated dump, where one wrong character silently
corrupts a board of 79 articles and 392 keywords, is not an acceptable
mechanism. ADR 0016 explicitly reserved this escape hatch: "if a workflow ever
needs a git operation MCP tools don't cover, provision local credentials
deliberately at that point." Binary files, deletions, and large transfers are
exactly that case.

**Consequences:** Ordinary git workflow is restored -- commit, fetch, rebase if
`origin/main` moved, push. Local and remote SHAs now match, so the old
"push via MCP then `git reset --hard origin/main` to realign" step is gone.
The GitHub MCP server stays connected and is still fine for reads and small
text edits, but is no longer the write path, and its limits are documented
above so they are not rediscovered. Note its read tools HTML-mangle text
(`list_commits` returns `"` as `&#34;` and strips tag-shaped substrings) --
verify commit messages with `curl https://api.github.com/...`, not MCP.
A private key now exists on this machine and is a credential to protect.

**Revisit when:** the SSH key is lost or rotated, the repo moves, or a second
machine needs write access (provision a separate key rather than copying this
one).

**Related:** [[0016-github-mcp-for-pushes]], [[0018-sqlite-boards-as-sql-dumps]],
[[0004-codex-builds-claude-reviews]]
