---
number: 0016
title: GitHub pushes go through the GitHub MCP server, not local git credentials
type: process
status: superseded-by-0017
date: 2026-08-27
---

**Context:** This workspace was migrated from Windows to Linux. The move
dropped every local git push credential -- no SSH key, no HTTPS credential
helper, nothing cached -- since Windows Credential Manager / Git Credential
Manager state doesn't carry over to a fresh Linux machine. `git push` failed
outright with "could not read Username for 'https://github.com'". Meanwhile a
GitHub MCP server was already connected, authenticated as the repo owner
(`syedjawad11`), with write access verified directly: two commits landed on
`origin/main` via its `push_files` tool with zero extra setup.

**Options considered:**
(1) Provision local git push credentials (SSH keypair added to GitHub, or a
personal access token wired into a credential helper) so `git push` works
directly from the terminal.
(2) Route all GitHub pushes through the GitHub MCP server's tools
(`push_files`, `create_or_update_file`, etc.) and leave local `git push`
unconfigured.

**Decision:** Option 2, per explicit user direction.

**Reasoning:** The MCP server already had verified, working write access with
no setup cost, and centralizes GitHub write auth in one place (the MCP
connection) rather than duplicating a credential across every machine this
repo might be worked from.

**Consequences:** Claude pushes commits via the GitHub MCP server, not
`git push`. Local commits should be finalized (and rebased onto the current
`origin/main` tip first, if it has moved -- e.g. from scheduled cloud
routines) before pushing via MCP, since `push_files` creates new commits
through GitHub's API rather than transmitting local commit objects verbatim:
the pushed SHA will differ from the local one even when tree content is
identical, so `git fetch && git reset --hard origin/main` afterward is the
normal way to resync local `main`. Plain `git fetch`/`git pull` for reading
remain unaffected -- `statohub` is a public repo, so read access needs no
credentials. If a workflow ever needs a git operation MCP tools don't cover
(force-push, tags, history rewrites), provision local credentials
deliberately at that point rather than assuming they're simply missing.

**Revisit when:** the GitHub MCP server becomes unavailable/disconnected, or
a task needs a git-native operation the MCP tools don't cover.

**Related:** [[0004-codex-builds-claude-reviews]], [[0006-github-actions-deploy]]
