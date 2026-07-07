# Task 0002: Rules engine — board & piece movement

**Branch**: `feature/rules-engine-movement`
**Depends on**: 0001
**Source**: talk-it-through 2026-07-07 · **User stories**: core movement rules for the 7x7
Monarch variant

## What to build

A pure TypeScript module living in `server/` (no framework dependencies) representing the 7x7
board and standard starting position, capable of generating and validating legal moves for every
piece type — Rook, Knight, Bishop, Pawn, and the Monarch — given a board state. Check/checkmate
detection is out of scope here (see task 0003).

Rules to encode (see the master plan's architectural decisions for full context):

- 7x7 board. Starting layout per side: back rank Rook, Knight, Bishop, Monarch, Bishop, Knight,
  Rook; a full row of 7 pawns in front.
- Rook, Knight, Bishop, Pawn move per standard chess rules, bounded to the 7x7 board.
- The Monarch moves like a queen (any distance, 8 directions, blocked by pieces) but capped at a
  maximum of 4 squares per move. It may move into a square attacked by an opponent piece — no
  "can't move into check" restriction applies to movement itself.
- No castling, no en passant.
- Pawns may move 1 or 2 squares on their first move.
- Pawns promote on reaching the last rank; promotion choices are Rook, Knight, or Bishop only —
  never Monarch.
- Captures follow standard chess capture rules for all pieces.

## AFK tasks

- [ ] Implement board representation and the standard starting position for the 7x7 variant
- [ ] Implement legal move generation for Rook, Knight, Bishop, and Pawn (including the 2-square
      first move and diagonal captures)
- [ ] Implement legal move generation for the Monarch (queen-style directions, capped at 4
      squares, allowed to move into attacked squares)
- [ ] Implement move application (updating board state, handling captures)
- [ ] Implement pawn promotion (choice of Rook/Knight/Bishop) when a pawn reaches the last rank
- [ ] Write unit tests covering movement, blocking, capturing, and promotion for every piece type,
      including edge-of-board cases

## Acceptance criteria

- [ ] Given a board state, the engine returns the correct legal destination squares for any piece,
      including the Monarch's capped range
- [ ] Illegal moves (off-board, blocked, moving through pieces for sliding pieces, wrong pawn
      direction) are rejected
- [ ] Pawn promotion produces the chosen piece type and never allows promoting to Monarch
- [ ] Unit test suite passes and covers all piece types plus edge/boundary cases
