# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Express 5 + PostgreSQL REST API for a construction-site attendance app. The matching frontend lives in the sibling directory `../constraction-attendance-frontend` (note the "constraction" spelling is used consistently in repo/package names).

The project is at an early scaffold stage: only health-check and DB-test endpoints exist so far.

## Commands

Package manager is **Yarn 4** (`packageManager: yarn@4.18.1`) with `nodeLinker: node-modules` — use `yarn`, not npm.

- `yarn install` — install dependencies
- `yarn dev` — run with nodemon (auto-restart) on `src/server.js`
- `yarn start` — run with plain node

There is no test runner, linter, or build step configured yet.

Smoke checks once running: `GET /api/health` (server up) and `GET /api/db-test` (runs `SELECT NOW()` against Postgres).

## Configuration

Copy `.env.example` to `.env`. Variables read by the code:

- `PORT` (default 5000)
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` — Postgres connection
- `FRONTEND_URL` — the single allowed CORS origin (frontend Vite dev server defaults to `http://localhost:5173`). If unset, the CORS origin becomes the string `"undefined"` and browser requests from the frontend will be blocked.

`.env` is gitignored (it was deliberately removed from tracking) — never commit it.

## Architecture

- `src/server.js` — app entry point: creates the Express app, applies CORS + `express.json()`, defines routes inline, and starts listening.
- `config/db.js` — exports a single shared `pg.Pool` built from env vars. Import it (`import pool from "../config/db.js"`) and use `pool.query(...)` with parameterized queries; don't create additional pools.

The package is ESM (`"type": "module"`): use `import`/`export` with explicit `.js` extensions in relative imports.

## Working rules (from the repo owner)

- **Scope:** work only inside this backend folder. Don't read or edit the sibling frontend (or anything else outside this repo) unless explicitly asked.
- **Authorship:** the user is the sole author of every commit and PR. Commit with the configured git identity, and add **no** `Co-Authored-By` trailer or "Generated with Claude Code" line to commit messages or PR descriptions.
- **Commit/push only when asked.**
- **Before every push:** confirm `.env` is still ignored and untracked (`git check-ignore .env` prints `.env`; `git ls-files .env` prints nothing). If either check fails, stop and tell the user.
- **"Push to dev" means a PR:** push a feature branch and open a PR targeting `dev` with `gh pr create --base dev`. Never push directly to `dev`. `dev` branches from `main`. Feature branches use prefixes like `chore/`, `feat/` or `fix/`.
- **Keep this file current:** after any change that affects commands, env vars, endpoints, architecture or these rules, update CLAUDE.md in the same piece of work.

## Style

Per `.editorconfig`: 2-space indentation, LF line endings, UTF-8, final newline.
