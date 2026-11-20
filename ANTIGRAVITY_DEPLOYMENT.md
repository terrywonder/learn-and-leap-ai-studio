# Google Antigravity — Deployment Only

Unzip and open the **Learn & Leap Three.js v4** project folder in Google Antigravity. Then paste:

> Deploy the existing Learn & Leap Adventure v4 Three.js WebGL project to my domain as a public, HTTPS-hosted static website. Do not redesign it, generate levels, rewrite its game logic, or replace its 3D renderer. The project root contains index.html, src/, assets/, tests/ and docs/. Publish index.html with src/ and assets/ at matching relative URLs. There is no build command or npm install. Ensure the browser can reach the pinned public Three.js ESM CDN imported by src/scene3d.js. Configure static content types for .js, .webp, .png and .css. Verify it on iPhone Safari and desktop Chrome: the opening menu loads with real 3D terrain and a character, Level 1 moves and jumps, all four educational shrines answer, the portal unlocks, World 2 has different 3D scenery, and Level 10 has a 3D guardian. Check browser console for CDN/WebGL errors and measure frame rate on a mobile device. Do not say it is production QA-passed unless those checks actually pass.

## Hosting checklist
1. Static site, publish entire folder root (`index.html`, `src`, `assets`).
2. HTTPS and no auth gate; visitors with a link can play.
3. Three.js CDN at `https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js` must be reachable by players; site is **not** offline.
4. `src/main.js` must be served as `text/javascript` or a compatible JavaScript MIME type.
5. Test browser supports WebGL2 and JavaScript modules.
6. Store user progress in their own browser localStorage (no account needed).
7. Test iPhone Safari **hosted URL**, not downloaded HTML attachment in Facebook preview.

## Optional later upgrade
For a fully self-hosted library dependency, download/vend the exact licensed Three.js module and change one import. The current package intentionally does not claim to bundle Three.js locally. Vendoring changes the hosting setup and should be checked separately.
