# Task 0007: Legal-move highlighting

**Branch**: `feature/legal-move-highlighting`
**Depends on**: 0006 (shared: game socket/board module)
**Source**: talk-it-through 2026-07-07 · **User stories**: see legal moves before committing

## What to build

Before committing to a move, selecting a piece shows the player which destination squares are
actually legal, via a server round-trip using the rules engine — improving on 0006's
"attempt and get rejected" flow.

## AFK tasks

- [ ] Implement a socket event/request for "legal moves for square X" in the current game,
      computed server-side via the rules engine (including check/trapped-avoidance semantics from
      0003, not just raw piece movement)
- [ ] Wire the React board so clicking/selecting a piece triggers this request and highlights the
      returned legal destination squares
- [ ] Clicking a highlighted square submits the move (reusing the 0006 move-submission flow);
      clicking elsewhere deselects
- [ ] Ensure only the current player's own pieces, and only on their turn, can be selected for
      highlighting
- [ ] Add automated integration tests for the legal-moves request (correct squares returned for a
      few representative pieces/positions, including a Monarch-in-check position where only
      escaping moves are legal)

## Human-in-the-loop tasks

- [ ] [verify] Play through piece selection in two real browser tabs and confirm the highlighted
      squares and board-flip orientation look and feel correct — visual/interaction correctness
      isn't fully captured by automated tests

## Acceptance criteria

- [ ] Selecting a piece highlights exactly its legal destination squares as computed by the rules
      engine
- [ ] A Monarch under attack only highlights squares that actually resolve the threat (capture
      attacker, block, or safe escape)
- [ ] Attempting to select an opponent's piece or move out of turn has no effect
