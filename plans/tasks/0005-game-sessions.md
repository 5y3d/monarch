# Task 0005: Game creation & joining via game code

**Branch**: `feature/game-sessions`
**Depends on**: 0004
**Source**: talk-it-through 2026-07-07 · **User stories**: pairing two players into a game

## What to build

Logged-in players can create a new game (getting a shareable game code) or join an existing one
by entering that code. Once both players have joined, the game session moves to an "active" state
and both clients are placed in a shared Socket.io room for that game.

## AFK tasks

- [ ] Create SQLite schema for a `games` table (id, code, player_white_id, player_black_id,
      status, created_at, ...)
- [ ] Implement `POST /api/games` to create a game owned by the logged-in player, generating a
      short unique game code
- [ ] Implement `POST /api/games/:code/join` for a second logged-in player to join an existing
      waiting game
- [ ] Reject joining a full or nonexistent game code with a clear error
- [ ] Set up a Socket.io room per game (keyed by game code), joined by each connected player's
      socket once authenticated for that game
- [ ] Track and broadcast game status transitions (waiting → active) to connected clients in the
      room
- [ ] Build React screens: "create game" (shows the resulting code/link), "join game" (code
      entry), and a waiting-room view that transitions to the game view once both players are
      present
- [ ] Add automated integration tests for create/join flows, including the full/nonexistent-code
      rejection cases

## Acceptance criteria

- [ ] A logged-in player can create a game and receives a shareable code
- [ ] A second logged-in player can join via that code and both clients see the game transition to
      active
- [ ] Attempting to join a full or invalid game code fails with a clear error
- [ ] Each game's two players are isolated in their own Socket.io room
