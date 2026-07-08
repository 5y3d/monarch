import { describe, expect, it } from "vitest";
import { getMoves } from "../../src/rules/moves.js";
import type { Board } from "../../src/rules/types.js";

function emptyBoard(): Board {
  return Array.from({ length: 7 }, () => Array.from({ length: 7 }, () => null));
}

describe("getMoves — monarch", () => {
  it("moves like a queen in all 8 directions when unobstructed", () => {
    const board = emptyBoard();
    board[3][3] = { type: "monarch", color: "white" };

    const moves = getMoves(board, { row: 3, col: 3 });

    expect(moves).toContainEqual({ row: 3, col: 4 }); // right
    expect(moves).toContainEqual({ row: 3, col: 2 }); // left
    expect(moves).toContainEqual({ row: 4, col: 3 }); // up
    expect(moves).toContainEqual({ row: 2, col: 3 }); // down
    expect(moves).toContainEqual({ row: 4, col: 4 }); // diagonal
  });

  it("cannot move more than 4 squares even when the board would allow further travel", () => {
    const board = emptyBoard();
    board[0][0] = { type: "monarch", color: "white" };

    const moves = getMoves(board, { row: 0, col: 0 });

    // Straight right along row 0: squares (0,1)..(0,6) are all on-board, but only 4 are reachable.
    expect(moves).toContainEqual({ row: 0, col: 1 });
    expect(moves).toContainEqual({ row: 0, col: 4 });
    expect(moves).not.toContainEqual({ row: 0, col: 5 });
    expect(moves).not.toContainEqual({ row: 0, col: 6 });

    // Straight down column 0: same cap applies.
    expect(moves).toContainEqual({ row: 4, col: 0 });
    expect(moves).not.toContainEqual({ row: 5, col: 0 });
    expect(moves).not.toContainEqual({ row: 6, col: 0 });

    // Diagonal: same cap applies.
    expect(moves).toContainEqual({ row: 4, col: 4 });
  });

  it("may move into a square attacked by an opponent piece (no check restriction here)", () => {
    const board = emptyBoard();
    board[3][3] = { type: "monarch", color: "white" };
    // A black rook attacks every square in row 3 and column 5, including (3,5).
    board[0][5] = { type: "rook", color: "black" };

    const moves = getMoves(board, { row: 3, col: 3 });

    expect(moves).toContainEqual({ row: 3, col: 5 });
  });

  it("is blocked by a friendly piece and can capture an enemy piece without passing it", () => {
    const board = emptyBoard();
    board[3][3] = { type: "monarch", color: "white" };
    board[3][5] = { type: "pawn", color: "black" };
    board[5][3] = { type: "pawn", color: "white" };

    const moves = getMoves(board, { row: 3, col: 3 });

    expect(moves).toContainEqual({ row: 3, col: 5 });
    expect(moves).not.toContainEqual({ row: 3, col: 6 });

    expect(moves).toContainEqual({ row: 4, col: 3 });
    expect(moves).not.toContainEqual({ row: 5, col: 3 });
    expect(moves).not.toContainEqual({ row: 6, col: 3 });
  });
});
