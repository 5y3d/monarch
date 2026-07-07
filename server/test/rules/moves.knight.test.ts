import { describe, expect, it } from "vitest";
import { getMoves } from "../../src/rules/moves.js";
import type { Board } from "../../src/rules/types.js";

function emptyBoard(): Board {
  return Array.from({ length: 7 }, () => Array.from({ length: 7 }, () => null));
}

describe("getMoves — knight", () => {
  it("jumps in an L-shape from the center of the board", () => {
    const board = emptyBoard();
    board[3][3] = { type: "knight", color: "white" };

    const moves = getMoves(board, { row: 3, col: 3 });

    const expected = [
      { row: 5, col: 4 }, { row: 5, col: 2 },
      { row: 1, col: 4 }, { row: 1, col: 2 },
      { row: 4, col: 5 }, { row: 2, col: 5 },
      { row: 4, col: 1 }, { row: 2, col: 1 },
    ];
    expect(moves).toHaveLength(expected.length);
    for (const square of expected) {
      expect(moves).toContainEqual(square);
    }
  });

  it("clips moves that fall off the board when near a corner", () => {
    const board = emptyBoard();
    board[0][0] = { type: "knight", color: "white" };

    const moves = getMoves(board, { row: 0, col: 0 });

    expect(moves).toHaveLength(2);
    expect(moves).toContainEqual({ row: 2, col: 1 });
    expect(moves).toContainEqual({ row: 1, col: 2 });
  });

  it("cannot land on a friendly piece but can capture an enemy piece, jumping over pieces in between", () => {
    const board = emptyBoard();
    board[3][3] = { type: "knight", color: "white" };
    board[5][4] = { type: "pawn", color: "white" };
    board[1][4] = { type: "pawn", color: "black" };
    // Pieces "in the way" (not actually in the way for a knight) should have no effect.
    board[3][4] = { type: "rook", color: "black" };
    board[4][4] = { type: "rook", color: "black" };

    const moves = getMoves(board, { row: 3, col: 3 });

    expect(moves).not.toContainEqual({ row: 5, col: 4 });
    expect(moves).toContainEqual({ row: 1, col: 4 });
  });
});
