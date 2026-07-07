# Plan: Monarch

> Source: talk-it-through session, 2026-07-07

This is the project's master plan: a durable architectural header plus an ordered list of task
pointers. Each task is one feature on its own branch, ending in a PR. Task bodies live in
`plans/tasks/`; finished tasks move to `plans/tasks/done/`.

## Workflow

- New work is added by the `to-plan` skill: a self-contained task file under
  `plans/tasks/NNNN-<slug>.md` plus a pointer below. It appends; it never creates a second plan.
- `implement-next-task` takes the first eligible pointer (or an explicit task argument), builds it
  on its branch — AFK via `tdd`, `[decision]` via `talk-it-through`, `[verify]` paused for manual
  confirmation — runs `task-review`, then opens the PR after approval and flips the pointer to `[>]`.
- A pointer has four states: `[ ]` todo · `[~]` in progress (claimed) · `[>]` done, PR open,
  awaiting merge · `[x]` merged to `main`. `sync-main` flips `[>]→[x]` and moves the task file to
  `tasks/done/` once the PR merges.
- Pointers carry their direct prerequisites as an `(after NNNN, …)` suffix (none = no suffix). A
  task is selectable only once every ordinal in its `(after …)` list is **`[x]` (merged)** — so a
  dependent never branches off `main` before its prerequisite is actually on `main`.
  `implement-next-task --worktree` uses this to pick the first task not blocked by in-progress work,
  or reports "no independent task" when every remaining task is blocked.

## Architectural decisions

Durable decisions that apply across all tasks:

- **Board**: 7x7 grid. Starting back rank per side: Rook, Knight, Bishop, Monarch, Bishop, Knight,
  Rook, with a full row of 7 pawns in front. No castling, no en passant.
- **The Monarch** (merged King+Queen): moves like a queen (any of 8 directions, blocked by
  pieces/board edge) but capped at a maximum of 4 squares per move. Unlike a standard king, it
  *may* move into a square attacked by an opponent piece — there is no "can't move into check"
  restriction on movement itself.
- **Win — "killed"**: capturing the opponent's Monarch ends the game immediately.
- **Win — "trapped"** (checkmate-style): the Monarch is currently under attack, and there is no
  move that captures the attacker, blocks the attack, or moves the Monarch to a square that is
  itself not under attack. Moving from one attacked square to another does **not** count as a
  valid escape.
- **Stalemate**: if the side to move has zero legal moves anywhere and their Monarch is not under
  attack (and it isn't one of the draw scenarios below), the side to move **loses** — this variant
  has no stalemate-as-draw.
- **Draws** — only two conditions: (1) both sides reduced to a lone Monarch, or (2) one side
  reduced to a lone Monarch while the other retains material — the stronger side then has 15 of
  their own moves (from the moment of reduction) to capture or checkmate the Monarch, or it's a
  draw.
- **Pawns**: may move 1 or 2 squares on their first move. Promote on reaching the last rank to
  Rook, Knight, or Bishop only — never Monarch.
- **Game modes**: online multiplayer only, two human players, joined via a shareable game code.
  No local pass-and-play, no AI opponent, no time control (untimed) in v1.
- **Accounts**: lightweight registration — username + password only, no email. Sessions are
  server-side, persisted in SQLite so logins survive server restarts.
- **Disconnects**: a disconnect during an active game ends it immediately and is recorded as a
  forfeit loss for the disconnecting player.
- **Stack**: TypeScript throughout. Backend: Express + Socket.io. Frontend: React + Vite +
  TypeScript, plain CSS/CSS Modules (no Tailwind). Single repo with `client/` and `server/`
  top-level folders.
- **Rules engine**: implemented entirely inside `server/` — there is no shared client/server
  package. The server is the sole authority on move legality and game state; the client is a
  "dumb" renderer that requests legal moves for a selected piece from the server (before
  highlighting them) and submits attempted moves for server-side validation.
- **Persistence**: SQLite via raw SQL (`better-sqlite3`), no ORM. Full move-by-move history is
  persisted (not just board snapshots), across `users`, `games`, and `moves` tables (exact columns
  decided per-task).
- **Board orientation**: flips per player, so each player's own pieces always render at the
  bottom of their view.
- **Piece rendering**: plain letters (first letter of the piece name), colored per player — no
  icon/glyph assets in v1.
- **Testing**: the backend rules engine gets a real unit test suite (Vitest or Jest). Other layers
  are verified via automated integration checks written during implementation, or scripted/manual
  smoke checks where noted in a task — there is no frontend component test suite or full e2e
  harness in v1.
- **Out of scope for v1**: a game-history/past-results browsing UI. Results are persisted to the
  database but not yet surfaced in the app.

---

## Tasks

- [>] 0001 · Project scaffold → tasks/0001-project-scaffold.md
- [ ] 0002 · Rules engine: board & piece movement (after 0001) → tasks/0002-rules-engine-movement.md
- [ ] 0003 · Rules engine: win/draw detection (after 0002) → tasks/0003-rules-engine-endgame.md
- [ ] 0004 · Auth: register/login/logout (after 0001) → tasks/0004-auth.md
- [ ] 0005 · Game creation & joining via game code (after 0004) → tasks/0005-game-sessions.md
- [ ] 0006 · Live move sync (after 0003, 0005) → tasks/0006-live-move-sync.md
- [ ] 0007 · Legal-move highlighting (after 0006) → tasks/0007-legal-move-highlighting.md
- [ ] 0008 · Win/draw resolution & result persistence (after 0007) → tasks/0008-game-resolution.md
- [ ] 0009 · Disconnect handling → forfeit loss (after 0008) → tasks/0009-disconnect-forfeit.md
