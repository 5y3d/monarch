import { BOARD_SIZE, type Board, type Piece, type Square } from "./types.js";

type Direction = readonly [number, number];

const ROOK_DIRECTIONS: readonly Direction[] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

const BISHOP_DIRECTIONS: readonly Direction[] = [
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];

const MONARCH_DIRECTIONS: readonly Direction[] = [...ROOK_DIRECTIONS, ...BISHOP_DIRECTIONS];
const MONARCH_MAX_DISTANCE = 4;

const KNIGHT_OFFSETS: readonly Direction[] = [
  [2, 1],
  [2, -1],
  [-2, 1],
  [-2, -1],
  [1, 2],
  [-1, 2],
  [1, -2],
  [-1, -2],
];

const PAWN_HOME_ROW = { white: 1, black: 5 } as const;
const PAWN_DIRECTION = { white: 1, black: -1 } as const;

function isOnBoard(square: Square): boolean {
  return (
    square.row >= 0 && square.row < BOARD_SIZE && square.col >= 0 && square.col < BOARD_SIZE
  );
}

function slideMoves(
  board: Board,
  from: Square,
  piece: Piece,
  directions: readonly Direction[],
  maxDistance: number,
): Square[] {
  const moves: Square[] = [];

  for (const [dRow, dCol] of directions) {
    for (let distance = 1; distance <= maxDistance; distance++) {
      const to: Square = { row: from.row + dRow * distance, col: from.col + dCol * distance };
      if (!isOnBoard(to)) break;

      const occupant = board[to.row][to.col];
      if (occupant === null) {
        moves.push(to);
        continue;
      }
      if (occupant.color !== piece.color) {
        moves.push(to);
      }
      break;
    }
  }

  return moves;
}

function knightMoves(board: Board, from: Square, piece: Piece): Square[] {
  const moves: Square[] = [];

  for (const [dRow, dCol] of KNIGHT_OFFSETS) {
    const to: Square = { row: from.row + dRow, col: from.col + dCol };
    if (!isOnBoard(to)) continue;

    const occupant = board[to.row][to.col];
    if (occupant === null || occupant.color !== piece.color) {
      moves.push(to);
    }
  }

  return moves;
}

function pawnMoves(board: Board, from: Square, piece: Piece): Square[] {
  const moves: Square[] = [];
  const direction = PAWN_DIRECTION[piece.color];

  const oneStep: Square = { row: from.row + direction, col: from.col };
  if (isOnBoard(oneStep) && board[oneStep.row][oneStep.col] === null) {
    moves.push(oneStep);

    const twoStep: Square = { row: from.row + direction * 2, col: from.col };
    if (
      from.row === PAWN_HOME_ROW[piece.color] &&
      isOnBoard(twoStep) &&
      board[twoStep.row][twoStep.col] === null
    ) {
      moves.push(twoStep);
    }
  }

  for (const dCol of [-1, 1]) {
    const diagonal: Square = { row: from.row + direction, col: from.col + dCol };
    if (!isOnBoard(diagonal)) continue;

    const occupant = board[diagonal.row][diagonal.col];
    if (occupant !== null && occupant.color !== piece.color) {
      moves.push(diagonal);
    }
  }

  return moves;
}

export function getMoves(board: Board, from: Square): Square[] {
  const piece = board[from.row][from.col];
  if (piece === null) return [];

  switch (piece.type) {
    case "rook":
      return slideMoves(board, from, piece, ROOK_DIRECTIONS, BOARD_SIZE);
    case "bishop":
      return slideMoves(board, from, piece, BISHOP_DIRECTIONS, BOARD_SIZE);
    case "monarch":
      return slideMoves(board, from, piece, MONARCH_DIRECTIONS, MONARCH_MAX_DISTANCE);
    case "knight":
      return knightMoves(board, from, piece);
    case "pawn":
      return pawnMoves(board, from, piece);
  }
}
