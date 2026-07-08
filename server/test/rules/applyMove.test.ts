import { describe, expect, it } from "vitest";
import { applyMove } from "../../src/rules/applyMove.js";
import { createInitialBoard } from "../../src/rules/board.js";
import type { Board, PieceType } from "../../src/rules/types.js";

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

    const next = applyMove(board, {
      from: { row: 3, col: 3 },
      to: { row: 4, col: 3 },
      promotion: "rook",
    });

    expect(next[4][3]).toEqual({ type: "pawn", color: "white" });
  });

  it("rejects a move whose destination is not a legal move for the piece (e.g. a rook moving diagonally)", () => {
    const board = emptyBoard();
    board[3][3] = { type: "rook", color: "white" };

    expect(() =>
      applyMove(board, { from: { row: 3, col: 3 }, to: { row: 4, col: 4 } }),
    ).toThrow();
  });

  it("rejects a sliding move that passes through a blocking piece, even though the destination square is empty", () => {
    const board = emptyBoard();
    board[3][3] = { type: "rook", color: "white" };
    board[3][5] = { type: "pawn", color: "white" };

    expect(() =>
      applyMove(board, { from: { row: 3, col: 3 }, to: { row: 3, col: 6 } }),
    ).toThrow();
  });

  it("rejects an off-board destination instead of crashing or writing to a non-index property", () => {
    const board = emptyBoard();
    board[3][3] = { type: "rook", color: "white" };

    expect(() =>
      applyMove(board, { from: { row: 3, col: 3 }, to: { row: 3, col: -1 } }),
    ).toThrow();
  });

  it("rejects an off-board 'from' square with a clear domain error, not an unrelated TypeError", () => {
    const board = emptyBoard();

    expect(() =>
      applyMove(board, { from: { row: 7, col: 0 }, to: { row: 6, col: 0 } }),
    ).toThrow(/off the board/i);
  });

  it("composes correctly against the real starting position: a home-row pawn double-step captures nothing and clears its path", () => {
    const board = createInitialBoard();

    const next = applyMove(board, { from: { row: 1, col: 3 }, to: { row: 3, col: 3 } });

    expect(next[3][3]).toEqual({ type: "pawn", color: "white" });
    expect(next[1][3]).toBeNull();
    // The rest of the starting position is untouched.
    expect(next[0][3]).toEqual({ type: "monarch", color: "white" });
    expect(board[1][3]).toEqual({ type: "pawn", color: "white" }); // original board unmutated
  });

  it("rejects a promotion value outside rook/knight/bishop even if it bypasses the TypeScript type", () => {
    const board = emptyBoard();
    board[5][3] = { type: "pawn", color: "white" };

    expect(() =>
      applyMove(board, {
        from: { row: 5, col: 3 },
        to: { row: 6, col: 3 },
        promotion: "monarch" as PieceType as "rook",
      }),
    ).toThrow();
  });
});
