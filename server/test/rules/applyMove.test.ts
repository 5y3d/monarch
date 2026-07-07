import { describe, expect, it } from "vitest";
import { applyMove } from "../../src/rules/applyMove.js";
import type { Board } from "../../src/rules/types.js";

function emptyBoard(): Board {
  return Array.from({ length: 7 }, () => Array.from({ length: 7 }, () => null));
}

describe("applyMove", () => {
  it("moves a piece to an empty square without mutating the original board", () => {
    const board = emptyBoard();
    board[3][3] = { type: "rook", color: "white" };

    const next = applyMove(board, { from: { row: 3, col: 3 }, to: { row: 3, col: 6 } });

    expect(next[3][6]).toEqual({ type: "rook", color: "white" });
    expect(next[3][3]).toBeNull();
    // Original board is untouched.
    expect(board[3][3]).toEqual({ type: "rook", color: "white" });
    expect(board[3][6]).toBeNull();
  });

  it("removes the captured piece and places the moving piece on its square", () => {
    const board = emptyBoard();
    board[3][3] = { type: "rook", color: "white" };
    board[3][6] = { type: "bishop", color: "black" };

    const next = applyMove(board, { from: { row: 3, col: 3 }, to: { row: 3, col: 6 } });

    expect(next[3][6]).toEqual({ type: "rook", color: "white" });
    expect(next[3][3]).toBeNull();
  });

  it("promotes a white pawn reaching the last rank to the chosen piece type", () => {
    const board = emptyBoard();
    board[5][3] = { type: "pawn", color: "white" };

    const next = applyMove(board, {
      from: { row: 5, col: 3 },
      to: { row: 6, col: 3 },
      promotion: "rook",
    });

    expect(next[6][3]).toEqual({ type: "rook", color: "white" });
  });

  it("promotes a black pawn reaching the last rank (row 0) to the chosen piece type", () => {
    const board = emptyBoard();
    board[1][3] = { type: "pawn", color: "black" };

    const next = applyMove(board, {
      from: { row: 1, col: 3 },
      to: { row: 0, col: 3 },
      promotion: "knight",
    });

    expect(next[0][3]).toEqual({ type: "knight", color: "black" });
  });

  it("throws if a pawn move reaches the last rank without a promotion choice", () => {
    const board = emptyBoard();
    board[5][3] = { type: "pawn", color: "white" };

    expect(() =>
      applyMove(board, { from: { row: 5, col: 3 }, to: { row: 6, col: 3 } }),
    ).toThrow();
  });

  it("does not promote a pawn that has not reached the last rank, even if a promotion is given", () => {
    const board = emptyBoard();
    board[3][3] = { type: "pawn", color: "white" };

    const next = applyMove(board, { from: { row: 3, col: 3 }, to: { row: 4, col: 3 } });

    expect(next[4][3]).toEqual({ type: "pawn", color: "white" });
  });
});
