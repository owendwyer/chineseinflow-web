# Chinese In Flow

Practice Chinese characters — [chineseinflow.com](https://www.chineseinflow.com)

Monorepo containing the static site and the Pixi.js game. Lives at `cif/` alongside the `android/` app.

## Structure

```
packages/
  webapp/   Pixi.js game — vendored production build (js bundle, res, fonts)
  site/     HTML templates and site CSS
build.mjs   Assembles everything into dist/
dist/       Deploy output (gitignored, built by Netlify)
```

The game is the Pixi.js + TypeScript rewrite. Its source lives in the separate `webapp/`
project; the production build (`dist/`) is vendored into `packages/webapp/`. See
[packages/webapp/README.md](packages/webapp/README.md) for how to refresh it.

Site CSS (`packages/site/css/cif.1.1.css`) includes both page layout and game canvas styles.

## Development

```bash
npm install
npm run dev
```

Opens a local server at `http://localhost:3000` (via `serve`).

## Build

```bash
npm run build
```

This will:

1. Copy the vendored game assets (`packages/webapp/{js,res,fonts}` → `dist/`)
2. Copy site CSS and favicon
3. Assemble HTML pages from templates into `dist/`

There is no game compile step at deploy time — `packages/webapp/` already holds the
production build. Rebuild it in the `webapp/` project when the game changes.

## Deploy

The site is hosted on **Netlify**. Push to the connected branch and Netlify runs `npm install && npm run build`, publishing `dist/`.

Configuration is in `netlify.toml`. No built files are committed to git.

## Game version

The JS bundle version comes from `packages/webapp/package.json`. The build injects it into the homepage script tag automatically.
