# The Imaginatorium

A Node.js + Phaser.js prototype of a persistent virtual world. See `README.md` and `QUICK_START.md` for the product overview and standard commands.

## Cursor Cloud specific instructions

### Services

- Browser mode (primary demo): `npm run browser` serves the static app on http://localhost:8080 via `http-server`. Open the page and click "Start" to initialize the Phaser scene. Phaser is loaded from a CDN (`cdn.jsdelivr.net`), so the browser needs outbound internet access. This is the canonical runnable app.
- Headless mode: `npm start` / `npm run dev` (`node src/main.js`) currently crashes with `ReferenceError: window is not defined`. This is a code issue, not an environment problem: `src/main.js` unconditionally requires `src/world/GameManager.js`, which imports `phaser` at module load, and Phaser expects a browser `window`. Don't treat this as a setup failure. Individual Node core modules (e.g. `src/core/WorldStateManager.js`) run fine under Node when required directly.

### Notes / gotchas

- `http-server` is a devDependency so `npm run browser` runs non-interactively. Running the raw `npx http-server` from a clean cache would otherwise prompt "Ok to proceed? (y)" and block.
- SQLite (`better-sqlite3`) writes to `data/imaginatorium.db`. The `data/` directory is git-ignored/untracked and is not created automatically, so create it (`mkdir -p data`) before running any code path that opens the DB (`WorldStateManager.initialize()`).
- There is no lint config, no build step, and no real test suite (`npm test` is a placeholder that exits 1).
