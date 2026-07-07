# Task 0009: Disconnect handling → forfeit loss

**Branch**: `feature/disconnect-forfeit`
**Depends on**: 0008 (shared: game socket/board module)
**Source**: talk-it-through 2026-07-07 · **User stories**: disconnects resolve the game

## What to build

If a player disconnects (closes tab, loses connection) during an active game, the game ends
immediately and is recorded as a forfeit loss for the disconnecting player, using the same
result-persistence pathway as 0008.

## AFK tasks

- [ ] Detect a player's socket disconnect while their game is active
- [ ] On disconnect, immediately end the game via the same result-persistence pathway as 0008,
      recording a forfeit loss for the disconnecting player (and a win for the opponent) with an
      appropriate end_reason (e.g. `forfeit_disconnect`)
- [ ] Notify the remaining connected player in real time that their opponent disconnected and
      they've won
- [ ] Ensure a disconnect in a game that isn't active (e.g. still waiting for a second player)
      does not record a forfeit result
- [ ] Add automated integration tests simulating a client disconnect mid-game and asserting the
      persisted result and the opponent's notification

## Human-in-the-loop tasks

- [ ] [verify] Manually play a full game end-to-end in two browser tabs, including deliberately
      closing one tab mid-game, to confirm the win/draw/forfeit banners and persisted results all
      look and behave correctly across the complete real-time flow

## Acceptance criteria

- [ ] Disconnecting mid-active-game ends the game and records a forfeit loss for the disconnecter
- [ ] The remaining player is notified in real time and sees the correct outcome
- [ ] Disconnects outside an active game (e.g. waiting room) do not produce a forfeit result
