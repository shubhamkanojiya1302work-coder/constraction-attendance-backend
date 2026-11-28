# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Express 5 + PostgreSQL REST API for a construction-site attendance app. The matching frontend lives in the sibling directory `../constraction-attendance-frontend` (note the "constraction" spelling is used consistently in repo/package names).

The project is at an early scaffold stage: the endpoints so far are `GET /api/health`, `GET /api/health/db` (runs `SELECT NOW()` and returns the DB time) `GET /api/workers` (active users with role `worker` from `user_main`, sorted by name), `GET /api/workers/:id` (one worker; 400 for an invalid id, 404 if not found), `POST /api/workers` (body `{ name, trade, phone? }`; creates a worker and returns it with 201, 400 if `name` or `trade` is missing, 409 if the phone is already used) and `PUT /api/workers/:id` (same body; updates the worker and returns it; 400 for an invalid id or missing `name`/`trade`, 404 if not found, 409 if the phone is already used).

## Commands

Package manager is **Yarn 4** (`packageManager: yarn@4.18.1`) with `nodeLinker: node-modules` — use `yarn`, not npm.

- `yarn install` — install dependencies
- `yarn dev` — run with nodemon (auto-restart) on `src/server.js`
- `yarn start` — run with plain node

There is no test runner, linter, or build step configured yet.

Smoke check once running: `GET /api/health` and `GET /api/health/db`.

## Configuration

Copy `.env.example` to `.env`. Variables read by the code:

- `PORT` (default 5000)
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` — Postgres connection
- `FRONTEND_URL` — the single allowed CORS origin (frontend Vite dev server defaults to `http://localhost:5173`). If unset, no CORS header is sent and browser requests from the frontend will be blocked.

`.env` is gitignored (it was deliberately removed from tracking) — never commit it.

## Architecture

Request flow: `src/server.js` → `src/app.js` → `src/routes/*Router.js` → `src/controllers/*Controller.js` → `src/models/*.js`.

- `src/server.js` — entry point. Its first line is `import "dotenv/config"`, which must stay first: other modules (e.g. `src/config/db.js`) read `process.env` when they're imported, so `.env` has to load before them. It then calls `checkConnection()` and only starts the app on `PORT` if the database is reachable; otherwise it logs the error and exits with code 1, so Postgres must be running to start the server.
- `src/app.js` — builds the Express app: CORS, `express.json()`, `morgan("dev")` request logging, mounts routers under `/api`, then `notFound` and `errorHandler`.
- `src/routes/` — one router per feature (e.g. `healthRouter.js`), mounted in `src/app.js` under `/api`.
- `src/controllers/` — request handlers (e.g. `healthController.js`, `workerController.js`).
- `src/models/` — database queries, one file per table (e.g. `user_main.js` exports `findAllWorkers()`, `findWorkerById()`, `createWorker()` and `updateWorker()`). Controllers call these instead of querying the pool directly.
- `src/middlewares/errorHandler.js` — exports `notFound` (404 JSON) and `errorHandler`. Express 5 sends rejected promises from async handlers here automatically. `errorHandler` logs the error and responds with `err.status` (default 500) and `{ message }`. To send a 4xx, throw an error with a `status` property (e.g. `const e = new Error("Worker not found"); e.status = 404; throw e;`). For 5xx, the client only sees `"Internal server error"`, so database and internal details aren't exposed.
- `src/config/db.js` — exports a single shared `pg.Pool` built from env vars. Import it (`import pool from "../config/db.js"` from a model) and use `pool.query(...)` with parameterized queries; don't create additional pools. It also exports `checkConnection()`, which runs `SELECT NOW()` and returns the time (used at startup and by `GET /api/health/db`).

Database SQL lives in `db/` (not run automatically; apply it by hand, e.g. with `psql`):

- `db/schema.sql` — creates the `user_main` table (roles: `superadmin`, `admin`, `supervisor`, `worker`; `user_phone` is optional but unique).
- `db/seed.sql` — inserts sample users into `user_main`. Run it after `schema.sql`.

The package is ESM (`"type": "module"`): use `import`/`export` with explicit `.js` extensions in relative imports.

## Working rules (from the repo owner)

- **Scope:** work only inside this backend folder. Don't read or edit the sibling frontend (or anything else outside this repo) unless explicitly asked.
- **Authorship:** whenever the user asks to commit, push or create a PR, the user must be the **only** author. Use the configured git identity for commits and the user's `gh` login for PRs. Add **no** `Co-Authored-By` trailer, "Generated with Claude Code" line or any other Claude attribution to commit messages, PR titles or PR descriptions.
- **Commit/push only when asked.**
- **Before every push:** confirm `.env` is still ignored and untracked (`git check-ignore .env` prints `.env`; `git ls-files .env` prints nothing). If either check fails, stop and tell the user.
- **"Push to dev" means a PR:** push a feature branch and open a PR targeting `dev` with `gh pr create --base dev`. Never push directly to `dev`. `dev` branches from `main`. Feature branches use prefixes like `chore/`, `feat/` or `fix/`.
- **Keep this file current:** after any change that affects commands, env vars, endpoints, architecture or these rules, update CLAUDE.md in the same piece of work.

## Coding guidelines (Karpathy)

Copied verbatim from the `andrej-karpathy-skills:karpathy-guidelines` skill.

Behavioral guidelines to reduce common LLM coding mistakes, derived from [Andrej Karpathy's observations](https://x.com/karpathy/status/2015883857489522876) on LLM coding pitfalls.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

## Style

Per `.editorconfig`: 2-space indentation, LF line endings, UTF-8, final newline.
