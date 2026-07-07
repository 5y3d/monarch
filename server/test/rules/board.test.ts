import { describe, expect, it } from "vitest";
import { createInitialBoard } from "../../src/rules/board.js";

describe("createInitialBoard", () => {
  it("places white's back rank on row 0 and black's on row 6", () => {
    const board = createInitialBoard();

    expect(board[0]).toEqual([
      { type: "rook", color: "white" },
      { type: "knight", color: "white" },
      { type: "bishop", color: "white" },
      { type: "monarch", color: "white" },
      { type: "bishop", color: "white" },
      { type: "knight", color: "white" },
      { type: "rook", color: "white" },
    ]);

    expect(board[6]).toEqual([
      { type: "rook", color: "black" },
      { type: "knight", color: "black" },
      { type: "bishop", color: "black" },
      { type: "monarch", color: "black" },
      { type: "bishop", color: "black" },
      { type: "knight", color: "black" },
      { type: "rook", color: "black" },
    ]);
  });

  it("places a full row of pawns in front of each back rank, with empty rows between", () => {
    const board = createInitialBoard();

    for (let col = 0; col < 7; col++) {
      expect(board[1][col]).toEqual({ type: "pawn", color: "white" });
      expect(board[5][col]).toEqual({ type: "pawn", color: "black" });
    }

    for (let row = 2; row <= 4; row++) {
      for (let col = 0; col < 7; col++) {
        expect(board[row][col]).toBeNull();
      }
    }
  });
});
