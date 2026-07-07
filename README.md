# Monarch

A 7x7 chess variant with a merged King+Queen piece ("the Monarch"), played online two-player.

## Development

Run the server and client dev servers in two terminals:

```sh
cd server && npm install && npm run dev   # Express API on http://localhost:3001
cd client && npm install && npm run dev   # Vite dev server on http://localhost:5173, proxies /api to the server
```

Open http://localhost:5173 — it should show a "Server status: OK" message once it round-trips
through `/api/health`.

### Server scripts (`server/`)

- `npm run dev` — start the API with hot reload
- `npm test` — run the unit test suite
- `npm run build` / `npm start` — compile and run the production build

### Client scripts (`client/`)

- `npm run dev` — start the Vite dev server
- `npm run build` — production build
