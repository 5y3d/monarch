import { describe, expect, it } from "vitest";
import { getMoves } from "../../src/rules/moves.js";
import type { Board } from "../../src/rules/types.js";

function emptyBoard(): Board {
  return Array.from({ length: 7 }, () => Array.from({ length: 7 }, () => null));
}

describe("getMoves — rook", () => {
  it("moves any distance in a straight line on an empty board", () => {
    const board = emptyBoard();
    board[3][3] = { type: "rook", color: "white" };

    const moves = getMoves(board, { row: 3, col: 3 });

    const expected = [
      // up column
      { row: 4, col: 3 }, { row: 5, col: 3 }, { row: 6, col: 3 },
      // down column
      { row: 2, col: 3 }, { row: 1, col: 3 }, { row: 0, col: 3 },
      // right row
      { row: 3, col: 4 }, { row: 3, col: 5 }, { row: 3, col: 6 },
      // left row
      { row: 3, col: 2 }, { row: 3, col: 1 }, { row: 3, col: 0 },
    ];
    expect(moves).toHaveLength(expected.length);
    for (const square of expected) {
      expect(moves).toContainEqual(square);
    }
  });

  it("is blocked by a friendly piece and cannot land on or pass it", () => {
    const board = emptyBoard();
    board[3][3] = { type: "rook", color: "white" };
    board[3][5] = { type: "pawn", color: "white" };

    const moves = getMoves(board, { row: 3, col: 3 });

    expect(moves).toContainEqual({ row: 3, col: 4 });
    expect(moves).not.toContainEqual({ row: 3, col: 5 });
    expect(moves).not.toContainEqual({ row: 3, col: 6 });
  });

  it("can capture an enemy piece but not move past it", () => {
    const board = emptyBoard();
    board[3][3] = { type: "rook", color: "white" };
    board[3][5] = { type: "pawn", color: "black" };

    const moves = getMoves(board, { row: 3, col: 3 });

    expect(moves).toContainEqual({ row: 3, col: 5 });
    expect(moves).not.toContainEqual({ row: 3, col: 6 });
  });

  it("from a corner, only generates on-board squares in the two available directions", () => {
    const board = emptyBoard();
    board[0][0] = { type: "rook", color: "white" };

    const moves = getMoves(board, { row: 0, col: 0 });

    expect(moves).toHaveLength(12); // 6 along the row + 6 along the column
    for (const square of moves) {
      expect(square.row).toBeGreaterThanOrEqual(0);
      expect(square.row).toBeLessThan(7);
      expect(square.col).toBeGreaterThanOrEqual(0);
      expect(square.col).toBeLessThan(7);
    }
  });
});
