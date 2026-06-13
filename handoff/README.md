# Handoff Folder — statohub.com build

Task drop-box between Claude and Codex for building **statohub.com**. Full
working model is in [`../../Claude_OS/CODEX-WORKFLOW.md`](../../Claude_OS/CODEX-WORKFLOW.md).

## How it works

- **One file per task:** `TASK-NNN-short-slug.md`, created from
  [`TEMPLATE.md`](TEMPLATE.md). Everything about a task (brief, work log,
  review) lives in that one file.
- **Status** is the first line of each task file. Lifecycle:

  `TODO` → `IN_PROGRESS` → `DONE` → `CLOSED`
  (or `DONE` → `CHANGES_REQUESTED` → back to `IN_PROGRESS`)

## For Codex (picking up work)

1. Read [`../AGENTS.md`](../AGENTS.md) and [`../BUILD-PLAN.md`](../BUILD-PLAN.md) first.
2. Pick the lowest-numbered task with status `TODO` (or any
   `CHANGES_REQUESTED`). Set its status to `IN_PROGRESS`.
3. Do the work in **this** repo (`Desktop/statohub/`). Build strictly to the
   brief and the BUILD-PLAN spec. Stay in scope.
4. When done, fill the **Work Log** section (what changed + where + how to
   verify + anything blocked) and set status to `DONE`.
5. Do **not** edit `CLAUDE.md` — that's Claude's session log. Record everything
   in the task file instead.

## For Claude (writing + reviewing)

- Create tasks from `TEMPLATE.md`, fill the **Brief**, leave status `TODO`.
- Review `DONE` tasks: check the real files, fill **Review**, set `CLOSED` or
  `CHANGES_REQUESTED`.
- Once `CLOSED`, fold the outcome into this repo's `CLAUDE.md` session log.

## Conventions

- Number tasks sequentially: `TASK-001-...`, `TASK-002-...`.
- Keep closed tasks here for history; archive to `handoff/archive/` only if the
  folder gets noisy.
- **One folder, one agent at a time.** Don't run Claude and Codex on this repo
  concurrently.
