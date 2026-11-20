# Google Antigravity — Learn & Leap Adventure v14.2.1

## Upload / extract

Upload **Learn-and-Leap-Adventure-v14.2.1-Ari-Gait-Polish-Antigravity-Under20MB.zip** (the ZIP itself is below the 20 MB upload limit). Extract it, then use the directory containing `index.html`, `package.json`, `src/`, `assets/` and `tests/` as the website root. The app is a static web game; no bundling, package installation or framework migration is needed.

## Verify BEFORE staging deployment

1. Record input ZIP checksum and inspect changes in `src/animation.js`, `src/premium.js`, `tests/v1421_ari_gait.cjs`, `index.html`. Baseline release: v14.2.
2. Run `npm test`; expect 15 scripts. The test runner needs Node.js. Do not replace failing tests with lower standards.
3. Use `python tests/v1421_capture_ari.py` for a *local Chromium harness* only if Playwright, Pillow and Chromium are already available. This is not a substitute for hosted QA.
4. Confirm Ari's existing sprite layers remain unchanged (`assets/animation/ari`); changes are pose and painting alignment only. Check idle, both run directions, jump, fall, landing, cast and foot placement. Take new hosted screenshots and short gameplay clips; verify no floating, clipping or unnatural boot crossings.
5. Confirm World 1 Level 3 retains the approved `assets/world1-v142/crystal-waterfall-scenery.webp`; ensure the four subject shrines and `DISCOVER` gate lettering are readable and interactive.
6. Confirm all 100 levels, five age groups, three languages and four subjects function, with progress saving. Verify worlds 2–10 are unchanged.

## Cloudflare Pages staging, NOT production

- Verify the authorized Cloudflare Pages account, staging project and domain; reference: `https://v6-world1-staging.titan-academy.pages.dev/` (do not overwrite solely based on hostname).
- Record existing deployment ID for rollback. Deploy a **new preview** from the extracted project root. No build command. Output/public directory must resolve `index.html` and `src/`/`assets/` directly.
- Verify HTTPS, MIME types, cache behavior and all assets; test desktop Chrome/Edge and physical iPhone Safari/Android Chrome, recording NOT TESTED if physical devices are unavailable.
- Record 15–30s real hosted gameplay per World 1 level, educational actions and level completion, console errors and measured FPS.
- Request explicit owner sign-off before any production promotion. Do not edit DNS, backend, accounts or approved characters.

## Release provenance and rollback

See `V1421_DEVELOPMENT_QA_AND_RELEASE.md` for implementation summary. Preserve the existing v14.2 build and its Cloudflare deployment ID. A rollback must restore that exact previous deployment or immutable archive, not apply a new speculative repair.
