# Chinese In Flow

Practice Chinese characters — [chineseinflow.com](https://www.chineseinflow.com)

Monorepo containing the static site and the CreateJS game. Lives at `cif/web/` alongside the `android/` app.

## Structure

```
packages/
  game/   CreateJS game (canvas app, content assets)
  site/   HTML templates and site CSS
build.mjs   Builds everything into dist/
dist/       Deploy output (gitignored, built by Netlify)
```

Site CSS (`packages/site/css/cif.1.0.css`) includes both page layout and game canvas styles. The old `packages/game/css/gameStyle.css` was a subset and is no longer used.

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

1. Bundle the game JS (`packages/game` → `dist/js/all.min.{version}.js`)
2. Copy game assets (`content/`, `res/`)
3. Assemble HTML pages from templates into `dist/`

## Deploy

The site is hosted on **Netlify**. Push to the connected branch and Netlify runs `npm install && npm run build`, publishing `dist/`.

Configuration is in `netlify.toml`. No built files are committed to git.

If the Netlify site is connected to the `cif` repo root, set **Base directory** to `web` in the Netlify site settings (or deploy only from the `web/` directory).

## Game version

The JS bundle version comes from `packages/game/package.json`. The build injects it into the homepage script tag automatically.
