# Chinese In Flow — Webapp (production build)

Vendored production build of the Pixi.js + TypeScript game. The source lives in the
separate `webapp/` project; run its production build there and copy the resulting
`dist/` artifacts here:

```
js/      bundle (all.min.{version}.js) + vendor scripts (pixi, gsap, opd-firebase, preloadviewoffline)
res/     processed content images, sprites, and audio
fonts/   webfonts (cabin, ubuntu, lato)
```

`build.mjs` (repo root) copies these into `dist/` and injects the version from
`package.json` into the homepage script tag.

To update the game, rebuild `webapp` (`npm run build` + asset processing) and replace
`js/`, `res/`, `fonts/`, and the `version` in `package.json` here.
