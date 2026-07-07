# Task 0001: Project scaffold

**Branch**: `feature/project-scaffold`
**Depends on**: none
**Source**: talk-it-through 2026-07-07 · **User stories**: foundational setup for all later work

## What to build

A working monorepo with a Vite + React + TypeScript client and an Express + TypeScript server,
wired together with a trivial health-check round trip, so every later task has a foundation to
build on.

## AFK tasks

- [ ] Initialize `server/` as an Express + TypeScript project (tsconfig, build/dev scripts, entrypoint)
- [ ] Initialize `client/` as a Vite + React + TypeScript project
- [ ] Add a `GET /api/health` endpoint on the server returning a simple JSON status
- [ ] Client fetches `/api/health` on load and renders the returned status; proxy API requests to
      the server during dev (e.g. Vite dev server proxy) so client and server can run on separate
      ports without CORS friction
- [ ] Add scripts to run client and server dev servers (documented in a README)
- [ ] Add an automated check that boots the server and confirms `/api/health` responds 200

## Acceptance criteria

- [ ] Documented command(s) start both client and server in dev mode
- [ ] Client displays a successful health-check response from the server when loaded
- [ ] TypeScript compiles cleanly in both `client/` and `server/`
