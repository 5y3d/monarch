import { isOnBoard } from "./board.js";
import { getMoves } from "./moves.js";
import { BOARD_SIZE, type Board, type Move, type Piece } from "./types.js";

const LAST_RANK = { white: BOARD_SIZE - 1, black: 0 } as const;
const VALID_PROMOTIONS = new Set(["rook", "knight", "bishop"]);

export function applyMove(board: Board, move: Move): Board {
  if (!isOnBoard(move.from) || !isOnBoard(move.to)) {
    throw new Error(`applyMove: move is off the board: ${JSON.stringify(move)}`);
  }

  const piece = board[move.from.row][move.from.col];
  if (piece === null) {
    throw new Error(`applyMove: no piece at ${JSON.stringify(move.from)}`);
  }

  const legalDestinations = getMoves(board, move.from);
  const isLegal = legalDestinations.some(
    (square) => square.row === move.to.row && square.col === move.to.col,
  );
  if (!isLegal) {
    throw new Error(`applyMove: illegal move ${JSON.stringify(move)}`);
  }

  const next = board.map((row) => row.slice());

  let movedPiece: Piece = piece;
  if (piece.type === "pawn" && move.to.row === LAST_RANK[piece.color]) {
    if (!move.promotion || !VALID_PROMOTIONS.has(move.promotion)) {
      throw new Error(
        "applyMove: pawn reaching the last rank requires a promotion choice of rook, knight, or bishop",
      );
    }
    movedPiece = { type: move.promotion, color: piece.color };
  }

  next[move.from.row][move.from.col] = null;
  next[move.to.row][move.to.col] = movedPiece;

  return next;
}
