import { BOARD_SIZE, type Board, type Move, type Piece } from "./types.js";

const LAST_RANK = { white: BOARD_SIZE - 1, black: 0 } as const;

export function applyMove(board: Board, move: Move): Board {
  const piece = board[move.from.row][move.from.col];
  if (piece === null) {
    throw new Error(`applyMove: no piece at ${JSON.stringify(move.from)}`);
  }

  const next = board.map((row) => row.slice());

  let movedPiece: Piece = piece;
  if (piece.type === "pawn" && move.to.row === LAST_RANK[piece.color]) {
    if (!move.promotion) {
      throw new Error("applyMove: pawn reaching the last rank requires a promotion choice");
    }
    movedPiece = { type: move.promotion, color: piece.color };
  }

  next[move.from.row][move.from.col] = null;
  next[move.to.row][move.to.col] = movedPiece;

  return next;
}
