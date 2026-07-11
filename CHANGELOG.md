# Changelog

## July 2026

Replaced the CreateJS game with the **Pixi.js + TypeScript rewrite** (`webapp`).

- Swapped `packages/game` (CreateJS, v7.0.2) for the vendored Pixi.js production build in `packages/webapp` (v0.1.0).
- `build.mjs` now copies the prebuilt game assets (`js/`, `res/`, `fonts/`) and assembles the site — no game compile at deploy time.
- Homepage now embeds the Pixi canvas + preloader; added local webfonts served from `/fonts/`.

## June 2026

Development is now **AI controlled** — changes are made via Cursor agents, built on Netlify, and deployed from the [chineseinflow-web](https://github.com/owendwyer/chineseinflow-web) repository.

- Migrated to a monorepo (`packages/game` + `packages/site`) with a single `npm run build` pipeline; `dist/` is built on deploy, not committed to git.
- Deployed to Netlify from the new GitHub repo.
- **v7.0.1** — version sync between `package.json` and game model.
- **v7.0.2** — fixed invalid canvas `textBaseline` value (`'center'` → `'middle'`) in `centerText`.

## Sep 2022

Tidied things up a bit.

## Oct 2020

The source code for the game is in `packages/game`. The site has been simplified and remade as a static site; this means no more comments and no high-score function in the application.

## March 2017

Added HSK 4 and 5 — without audio. This, especially level 5, is quite beyond my Chinese ability, so I'm afraid that the translations may not be as accurate as those for HSK 1 to 3. Please let me know if you find any issues or think that any items should be altered.

Removed the button for "Audio" as it was quite redundant. The same kind of play can easily be achieved by tapping on the settings button in game. Instead there is the "Options" button, which allows for the timer to be removed.

## August 2016

Combined all the different HSK games together into this version. While it may look pretty much the same, this version is preferable as it is made with HTML5 instead of flash. Removed links to the other flash games from the front page.

Content loads faster as it doesn't wait for the audio to be loaded before proceeding. The scores have also been rejigged somewhat and the timings adjust more to the player rather than just being really fast all the time.

## 2013

Original release — a resource for practicing Chinese characters for the HSK 1 test. A simple click-and-match game for reviewing characters.
