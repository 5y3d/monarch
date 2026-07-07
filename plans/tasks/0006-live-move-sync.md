# Task 0006: Live move sync

**Branch**: `feature/live-move-sync`
**Depends on**: 0003, 0005
**Source**: talk-it-through 2026-07-07 · **User stories**: first fully playable game slice

## What to build

Once a game is active, players can make moves that are validated by the rules engine on the
server, applied to the persisted game state, and broadcast to both players in real time — the
first end-to-end "playable game" slice. Legal-move highlighting and win/draw handling are
follow-on slices (0007, 0008).

## AFK tasks

- [ ] Create SQLite schema for a `moves` table (id, game_id, ply_number, from_square, to_square,
      piece, captured_piece, promotion, created_at)
- [ ] Implement a socket event for a player to submit a move (from/to squares, promotion choice if
      applicable) for their active game
- [ ] Validate the submitted move server-side using the rules engine from 0002/0003 (movement
      legality only at this stage); reject illegal moves with an error back to the submitting
      client, without mutating state
- [ ] On a legal move: update the derived board state, persist the move to the `moves` table, and
      broadcast the updated board + last move to both players in the game's room
- [ ] Enforce turn order server-side (only the player whose turn it is may submit a move)
- [ ] Build the React game board view: renders the 7x7 board and pieces (as letters, colored per
      player), flipped per the viewing player's side, and lets a player click a piece then a
      destination square to attempt a move
- [ ] Add automated integration tests simulating two connected socket clients playing several
      moves, including an illegal-move rejection case and an out-of-turn rejection case

## Acceptance criteria

- [ ] Two players in an active game can alternate making legal moves and see the board update live
      on both clients
- [ ] Illegal moves and out-of-turn moves are rejected without changing game state
- [ ] Every legal move is persisted to the `moves` table
- [ ] The board renders flipped per player perspective, pieces shown as colored letters
