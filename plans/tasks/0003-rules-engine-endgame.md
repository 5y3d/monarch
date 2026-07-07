# Task 0003: Rules engine — win/draw detection

**Branch**: `feature/rules-engine-endgame`
**Depends on**: 0002 (shared: rules engine module)
**Source**: talk-it-through 2026-07-07 · **User stories**: end-game detection for the 7x7
Monarch variant

## What to build

Extend the rules engine from task 0002 with game-status detection layered on top of move
generation: capturing the Monarch, checkmate-style "trapped" detection, stalemate-as-loss, and the
two draw conditions — so that given a board state (and move history, for the draw clock) the
engine can report whether the game is ongoing, won, or drawn.

Rules to encode:

- **Killed**: if a Monarch is captured, that side loses immediately.
- **Trapped** (checkmate-style): the Monarch is currently under attack, and there is no move by
  that side that either captures the attacker, blocks the attack (for sliding-piece attackers), or
  moves the Monarch to a square that is not itself under attack. Moving to another attacked square
  does **not** count as escaping.
- **Stalemate**: if the side to move has zero legal moves anywhere and their Monarch is not under
  attack, and it isn't one of the draw scenarios below, the side to move **loses**.
- **Draw condition 1**: both sides reduced to only their Monarch (no other pieces) — immediate
  draw.
- **Draw condition 2**: one side reduced to only their Monarch while the other retains other
  pieces — the stronger side has 15 of their own moves (from the moment the reduction happens) to
  capture or checkmate the Monarch; if move 15 passes without a win, it's a draw.

## AFK tasks

- [ ] Implement "is this Monarch currently under attack" detection
- [ ] Implement "trapped" (checkmate-style) detection per the escape rule above
- [ ] Implement capture-based immediate win detection
- [ ] Implement stalemate-as-loss detection
- [ ] Implement the lone-Monarch-vs-lone-Monarch draw condition
- [ ] Implement the 15-move drawing clock for the one-side-lone-Monarch scenario, tracked from
      move history
- [ ] Write unit tests for each win/draw/loss condition, including edge cases (e.g. a move that
      blocks vs. a move that only delays)

## Acceptance criteria

- [ ] Engine correctly reports checkmate-style "trapped" only when no capture/block/safe-escape
      exists
- [ ] Engine correctly reports stalemate-loss, distinguishing it from the two draw conditions
- [ ] Both draw conditions are correctly detected, including the 15-move clock boundary (move 15
      vs move 16)
- [ ] Unit test suite passes covering all end-game scenarios
