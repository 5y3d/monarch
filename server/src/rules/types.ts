export type Color = "white" | "black";

export type PieceType = "rook" | "knight" | "bishop" | "pawn" | "monarch";

export interface Piece {
  type: PieceType;
  color: Color;
}

export interface Square {
  row: number;
  col: number;
}

export const BOARD_SIZE = 7;

export type Board = (Piece | null)[][];

export interface Move {
  from: Square;
  to: Square;
  promotion?: "rook" | "knight" | "bishop";
}
