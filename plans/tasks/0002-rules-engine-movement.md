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

- [x] Implement board representation and the standard starting position for the 7x7 variant
- [x] Implement legal move generation for Rook, Knight, Bishop, and Pawn (including the 2-square
      first move and diagonal captures)
- [x] Implement legal move generation for the Monarch (queen-style directions, capped at 4
      squares, allowed to move into attacked squares)
- [x] Implement move application (updating board state, handling captures)
- [x] Implement pawn promotion (choice of Rook/Knight/Bishop) when a pawn reaches the last rank
- [x] Write unit tests covering movement, blocking, capturing, and promotion for every piece type,
      including edge-of-board cases

## Acceptance criteria

- [x] Given a board state, the engine returns the correct legal destination squares for any piece,
      including the Monarch's capped range
- [x] Illegal moves (off-board, blocked, moving through pieces for sliding pieces, wrong pawn
      direction) are rejected
- [x] Pawn promotion produces the chosen piece type and never allows promoting to Monarch
- [x] Unit test suite passes and covers all piece types plus edge/boundary cases

## Implementation log

- New module at `server/src/rules/`: `types.ts` (`Color`, `PieceType`, `Piece`, `Square`, `Board`,
  `Move`, `BOARD_SIZE`), `board.ts` (`createInitialBoard`), `moves.ts` (`getMoves`), `applyMove.ts`
  (`applyMove`). No framework dependencies, pure functions over an immutable `Board`
  (`(Piece | null)[][]`).
- `getMoves(board, square)` dispatches per piece type: Rook/Bishop/Monarch share a `slideMoves`
  helper parameterized by direction set and max distance (Monarch reuses Rook+Bishop's 8
  directions capped at `MONARCH_MAX_DISTANCE = 4`); Knight uses fixed L-shaped offsets; Pawn has
  its own function (direction and home row keyed by color, diagonal-only capture, no straight
  capture).
- No en passant means no move-history state was needed for pawns: "eligible for a 2-square first
  move" is inferred from the pawn still sitting on its home row (row 1 for white, row 5 for
  black), which is a safe inference since pawns only ever move forward.
- `applyMove(board, move)` returns a new board (original untouched), removes any captured piece,
  and promotes a pawn landing on the last rank to `move.promotion`. Both `getMoves` and `applyMove`
  reject an off-board square with a clear `Error` (`"... is off the board: ..."`) rather than
  crashing with a raw `TypeError` or silently writing to a non-index property — `isOnBoard` lives
  in `board.ts` and is shared by both. `applyMove` also validates that `move.to` is actually in
  `getMoves(board, move.from)` before applying it, so a blocked or wrong-shaped move throws instead
  of being silently applied. Promotion is validated at **runtime** against a `VALID_PROMOTIONS` set
  (`rook`/`knight`/`bishop`), not just via `Move.promotion`'s compile-time type — this matters
  because the architectural header notes this module is the server's sole authority on move
  legality, so it can't assume every caller is itself type-checked TypeScript. `getMoves` also
  throws for an unrecognized `piece.type` instead of returning `undefined`. `isOnBoard` also
  requires both coordinates to be integers, not just in range, so a non-integer square (e.g. from
  malformed input) is rejected the same way an out-of-range one is, rather than passing the range
  check and crashing deeper in array indexing. Found and fixed via three `task-review --afk` passes
  (initial pass: Spec + Bug flagged the missing move-legality/bounds checks, Standards + Spec + Bug
  all independently flagged the promotion gap; re-review pass 1: Bug caught that the same bounds
  hardening had been applied to `applyMove` but not to `getMoves`, a separate exported entry point
  with the identical failure mode; re-review pass 2: all three lenses came back clean except a
  minor non-integer-coordinate gap in `isOnBoard`, fixed here).
- Check/checkmate/"trapped" detection is explicitly out of scope here (task 0003); `getMoves`
  returns pseudo-legal moves only — e.g. the Monarch may be offered a move into an attacked
  square, and no move is filtered out because it would leave a Monarch in check.
- 44 unit tests across 8 files in `server/test/rules/`, covering every piece type's movement,
  blocking/capturing, edge-of-board clipping (corners), pawn direction-by-color, promotion
  (including "promotion required" and "no promotion before the last rank"), the off-board/illegal-
  move rejections above (including that `isOnBoard` rejects non-integer coordinates, not just
  out-of-range ones), and four integration-style tests that run `getMoves`/`applyMove` against the
  real `createInitialBoard()` output rather than only synthetic boards. Built test-first
  (red → green) per the tdd skill, one behavior at a time.
