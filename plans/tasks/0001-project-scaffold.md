# Task 0001: Project scaffold

**Branch**: `feature/project-scaffold`
**Depends on**: none
**Source**: talk-it-through 2026-07-07 · **User stories**: foundational setup for all later work

## What to build

A working monorepo with a Vite + React + TypeScript client and an Express + TypeScript server,
wired together with a trivial health-check round trip, so every later task has a foundation to
build on.

## AFK tasks

- [x] Initialize `server/` as an Express + TypeScript project (tsconfig, build/dev scripts, entrypoint)
- [x] Initialize `client/` as a Vite + React + TypeScript project
- [x] Add a `GET /api/health` endpoint on the server returning a simple JSON status
- [x] Client fetches `/api/health` on load and renders the returned status; proxy API requests to
      the server during dev (e.g. Vite dev server proxy) so client and server can run on separate
      ports without CORS friction
- [x] Add scripts to run client and server dev servers (documented in a README)
- [x] Add an automated check that boots the server and confirms `/api/health` responds 200

## Acceptance criteria

- [x] Documented command(s) start both client and server in dev mode
- [x] Client displays a successful health-check response from the server when loaded
- [x] TypeScript compiles cleanly in both `client/` and `server/`

## Implementation log

- `server/`: Express + TypeScript, entrypoint `src/index.ts` (listens) built on top of
  `src/app.ts` (exports `createApp()` for testability). `GET /api/health` returns
  `{ status: "ok" }`. Test runner: Vitest + supertest, `server/test/health.test.ts` — built
  test-first (red → green) per the tdd skill. `npm run build` uses `tsconfig.build.json`
  (excludes `test/`) so the shipped build only contains `src/`.
- `client/`: scaffolded via `npm create vite@latest client -- --template react-ts`. Replaced the
  template's demo `App.tsx`/`App.css` with a minimal health-check view (`fetch('/api/health')` on
  mount, renders loading/OK/unreachable). Removed unused template assets (hero/react/vite
  SVGs, `icons.svg`) since nothing references them anymore. `vite.config.ts` proxies `/api` to
  `http://localhost:3001` in dev.
- Root `.gitignore` added (node_modules, dist, .env, local sqlite files, `.claude/skills/`,
  `skills-lock.json`). Root `README.md` documents the two dev commands.
- Verified end-to-end manually: booted both dev servers, confirmed `/api/health` responds 200
  directly on :3001 and via the client's :5173 proxy. Also verified `npm run build` in both
  packages and `tsc --noEmit` clean in both.
