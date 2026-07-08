import { BOARD_SIZE, type Board, type Color, type Piece, type PieceType, type Square } from "./types.js";

export function isOnBoard(square: Square): boolean {
  return (
    Number.isInteger(square.row) &&
    Number.isInteger(square.col) &&
    square.row >= 0 &&
    square.row < BOARD_SIZE &&
    square.col >= 0 &&
    square.col < BOARD_SIZE
  );
}

const BACK_RANK: PieceType[] = ["rook", "knight", "bishop", "monarch", "bishop", "knight", "rook"];

function backRank(color: Color): (Piece | null)[] {
  return BACK_RANK.map((type) => ({ type, color }));
}

function pawnRank(color: Color): (Piece | null)[] {
  return Array.from({ length: BOARD_SIZE }, () => ({ type: "pawn", color }) as Piece);
}

function emptyRank(): (Piece | null)[] {
  return Array.from({ length: BOARD_SIZE }, () => null);
}

export function createInitialBoard(): Board {
  return [
    backRank("white"),
    pawnRank("white"),
    emptyRank(),
    emptyRank(),
    emptyRank(),
    pawnRank("black"),
    backRank("black"),
  ];
}
