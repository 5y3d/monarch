# Task 0008: Win/draw resolution & result persistence

**Branch**: `feature/game-resolution`
**Depends on**: 0007 (shared: game socket/board module)
**Source**: talk-it-through 2026-07-07 · **User stories**: games actually end and record a result

## What to build

After each move, the server checks game status via the rules engine; when the game ends (Monarch
captured, trapped/checkmate, stalemate-loss, or either draw condition), the game is locked, the
result is persisted, and both clients are shown the outcome.

## AFK tasks

- [ ] Extend the `games` table with result fields (status: active/finished, winner_id nullable,
      end_reason, ended_at)
- [ ] After each accepted move, run the 0003 end-game detection against the resulting
      board/move history
- [ ] On game end: mark the game finished in the DB with the correct winner/draw and end_reason,
      and stop accepting further moves for that game
- [ ] Broadcast the game-end result (winner or draw, and reason) to both clients in the room
- [ ] Build a simple result banner/state in the React game view showing the outcome and reason,
      and disabling further move interaction
- [ ] Add automated integration tests driving a game to each end condition (capture-win, trapped,
      stalemate-loss, both draw conditions) and asserting the persisted result and broadcast match

## Acceptance criteria

- [ ] Every supported end condition correctly ends the game, persists the right result/reason, and
      is reflected in both clients' UI
- [ ] No further moves are accepted once a game is finished
- [ ] The 15-move draw clock and lone-Monarch draw are both exercised and verified in tests
