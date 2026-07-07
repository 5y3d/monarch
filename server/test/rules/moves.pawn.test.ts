import { describe, expect, it } from "vitest";
import { getMoves } from "../../src/rules/moves.js";
import type { Board } from "../../src/rules/types.js";

function emptyBoard(): Board {
  return Array.from({ length: 7 }, () => Array.from({ length: 7 }, () => null));
}

describe("getMoves — pawn", () => {
  it("white pawn on its home row can move 1 or 2 squares forward when unblocked", () => {
    const board = emptyBoard();
    board[1][3] = { type: "pawn", color: "white" };

    const moves = getMoves(board, { row: 1, col: 3 });

    expect(moves).toHaveLength(2);
    expect(moves).toContainEqual({ row: 2, col: 3 });
    expect(moves).toContainEqual({ row: 3, col: 3 });
  });

  it("black pawn on its home row moves toward decreasing rows", () => {
    const board = emptyBoard();
    board[5][3] = { type: "pawn", color: "black" };

    const moves = getMoves(board, { row: 5, col: 3 });

    expect(moves).toHaveLength(2);
    expect(moves).toContainEqual({ row: 4, col: 3 });
    expect(moves).toContainEqual({ row: 3, col: 3 });
  });

  it("a pawn off its home row can only move 1 square forward", () => {
    const board = emptyBoard();
    board[2][3] = { type: "pawn", color: "white" };

    const moves = getMoves(board, { row: 2, col: 3 });

    expect(moves).toEqual([{ row: 3, col: 3 }]);
  });

  it("cannot advance (1 or 2 squares) when the square directly ahead is occupied", () => {
    const board = emptyBoard();
    board[1][3] = { type: "pawn", color: "white" };
    board[2][3] = { type: "pawn", color: "black" };

    const moves = getMoves(board, { row: 1, col: 3 });

    expect(moves).toEqual([]);
  });

  it("cannot advance 2 squares when the second square is occupied, even if the first is clear", () => {
    const board = emptyBoard();
    board[1][3] = { type: "pawn", color: "white" };
    board[3][3] = { type: "pawn", color: "black" };

    const moves = getMoves(board, { row: 1, col: 3 });

    expect(moves).toEqual([{ row: 2, col: 3 }]);
  });

  it("captures diagonally only when an enemy piece is present, never onto an empty diagonal", () => {
    const board = emptyBoard();
    board[2][3] = { type: "pawn", color: "white" };
    board[3][4] = { type: "pawn", color: "black" };
    // (row 3, col 2) left diagonal is empty: not a legal move.

    const moves = getMoves(board, { row: 2, col: 3 });

    expect(moves).toContainEqual({ row: 3, col: 3 }); // straight ahead
    expect(moves).toContainEqual({ row: 3, col: 4 }); // capture
    expect(moves).not.toContainEqual({ row: 3, col: 2 }); // empty diagonal
    expect(moves).toHaveLength(2);
  });

  it("cannot capture a friendly piece diagonally", () => {
    const board = emptyBoard();
    board[2][3] = { type: "pawn", color: "white" };
    board[3][4] = { type: "pawn", color: "white" };

    const moves = getMoves(board, { row: 2, col: 3 });

    expect(moves).not.toContainEqual({ row: 3, col: 4 });
  });

  it("a pawn one square from promotion still reports the last-rank square as a legal move", () => {
    const board = emptyBoard();
    board[5][3] = { type: "pawn", color: "white" };

    const moves = getMoves(board, { row: 5, col: 3 });

    expect(moves).toContainEqual({ row: 6, col: 3 });
  });

  it("never generates a backward move, for either color", () => {
    const board = emptyBoard();
    board[3][3] = { type: "pawn", color: "white" };
    board[3][4] = { type: "pawn", color: "black" };

    const whiteMoves = getMoves(board, { row: 3, col: 3 });
    const blackMoves = getMoves(board, { row: 3, col: 4 });

    expect(whiteMoves.every((m) => m.row > 3)).toBe(true);
    expect(blackMoves.every((m) => m.row < 3)).toBe(true);
  });
});
