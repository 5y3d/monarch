import { describe, expect, it } from "vitest";
import { getMoves } from "../../src/rules/moves.js";
import { createInitialBoard } from "../../src/rules/board.js";
import type { Board, PieceType } from "../../src/rules/types.js";

function emptyBoard(): Board {
  return Array.from({ length: 7 }, () => Array.from({ length: 7 }, () => null));
}

describe("getMoves — dispatch", () => {
  it("throws for a piece with an unrecognized type instead of returning undefined", () => {
    const board = emptyBoard();
    // Bypass the PieceType union to simulate untrusted/deserialized board data.
    board[3][3] = { type: "king" as PieceType, color: "white" };

    expect(() => getMoves(board, { row: 3, col: 3 })).toThrow();
  });

  it("returns an empty array for an empty square", () => {
    const board = emptyBoard();

    expect(getMoves(board, { row: 3, col: 3 })).toEqual([]);
  });

  it("rejects an off-board 'from' square with a clear domain error, not an unrelated TypeError", () => {
    const board = emptyBoard();

    expect(() => getMoves(board, { row: 7, col: 0 })).toThrow(/off the board/i);
    expect(() => getMoves(board, { row: -1, col: 0 })).toThrow(/off the board/i);
    expect(() => getMoves(board, { row: 3, col: 7 })).toThrow(/off the board/i);
  });

  it("composes correctly against the real starting position: a home-row pawn has 2 moves", () => {
    const board = createInitialBoard();

    const moves = getMoves(board, { row: 1, col: 3 });

    expect(moves).toHaveLength(2);
    expect(moves).toContainEqual({ row: 2, col: 3 });
    expect(moves).toContainEqual({ row: 3, col: 3 });
  });

  it("composes correctly against the real starting position: a corner rook is fully blocked by its own pawn", () => {
    const board = createInitialBoard();

    const moves = getMoves(board, { row: 0, col: 0 });

    expect(moves).toEqual([]);
  });

  it("composes correctly against the real starting position: the Monarch is fully blocked", () => {
    const board = createInitialBoard();

    const moves = getMoves(board, { row: 0, col: 3 });

    expect(moves).toEqual([]);
  });
});
