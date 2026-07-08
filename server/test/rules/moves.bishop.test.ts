import { describe, expect, it } from "vitest";
import { getMoves } from "../../src/rules/moves.js";
import type { Board } from "../../src/rules/types.js";

function emptyBoard(): Board {
  return Array.from({ length: 7 }, () => Array.from({ length: 7 }, () => null));
}

describe("getMoves — bishop", () => {
  it("moves any distance diagonally on an empty board", () => {
    const board = emptyBoard();
    board[3][3] = { type: "bishop", color: "white" };

    const moves = getMoves(board, { row: 3, col: 3 });

    const expected = [
      { row: 4, col: 4 }, { row: 5, col: 5 }, { row: 6, col: 6 },
      { row: 2, col: 2 }, { row: 1, col: 1 }, { row: 0, col: 0 },
      { row: 4, col: 2 }, { row: 5, col: 1 }, { row: 6, col: 0 },
      { row: 2, col: 4 }, { row: 1, col: 5 }, { row: 0, col: 6 },
    ];
    expect(moves).toHaveLength(expected.length);
    for (const square of expected) {
      expect(moves).toContainEqual(square);
    }
  });

  it("is blocked by a friendly piece and can capture an enemy piece without passing it", () => {
    const board = emptyBoard();
    board[3][3] = { type: "bishop", color: "white" };
    board[5][5] = { type: "pawn", color: "white" };
    board[1][1] = { type: "pawn", color: "black" };

    const moves = getMoves(board, { row: 3, col: 3 });

    expect(moves).toContainEqual({ row: 4, col: 4 });
    expect(moves).not.toContainEqual({ row: 5, col: 5 });
    expect(moves).not.toContainEqual({ row: 6, col: 6 });

    expect(moves).toContainEqual({ row: 2, col: 2 });
    expect(moves).toContainEqual({ row: 1, col: 1 });
    expect(moves).not.toContainEqual({ row: 0, col: 0 });
  });

  it("from a corner, only generates on-board squares along the single available diagonal", () => {
    const board = emptyBoard();
    board[0][0] = { type: "bishop", color: "white" };

    const moves = getMoves(board, { row: 0, col: 0 });

    expect(moves).toEqual([
      { row: 1, col: 1 },
      { row: 2, col: 2 },
      { row: 3, col: 3 },
      { row: 4, col: 4 },
      { row: 5, col: 5 },
      { row: 6, col: 6 },
    ]);
  });
});
