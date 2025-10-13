## Nefol Monorepo

Apps and packages:
- `user-panel`: Public website (React 18 + Vite + TypeScript + TailwindCSS)
- `admin-panel`: Admin dashboard (React 18 + Vite + TypeScript + TailwindCSS)
- `backend`: API (Node.js + Express + TypeScript + PostgreSQL)
- `common`: Shared types and utilities

Install (use pnpm recommended):

```bash
corepack enable
corepack prepare pnpm@latest --activate
pnpm i
```

Run all apps:

```bash
pnpm dev
```

Environment variables for `backend` (create `backend/.env`):

```
PORT=4000
DATABASE_URL=postgres://user:password@localhost:5432/nefol
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
```


