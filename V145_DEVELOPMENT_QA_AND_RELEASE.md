# Learn & Leap Adventure v14.5 — Development QA and release status

Date: 7 November 2026 (Malaysia)  
Owner-approved design reference: `ari_s_run_cycle_redesign_board.png` (concept only, *not* runtime proof).  
Previous source: v14.4 ZIP SHA-256 `60a9ed87e1ae202403154411540d1d4d38bb60fbe06b9e5b26b48c21ccc2fbfa`.

## Actual code change

- `src/animation.js`: four-phase front/rear stance cycle and **two independent ankle angles**; `ARI_FOOT_RIG` and `heroSoleHeights` calculate transformed boot-sole heights.
- `src/animation_v12.js`: blend independent ankle angles when changing animation states.
- `src/premium.js`: draw segmented approved artwork with ankle pivots separately from hip rotation; visual-only sole height correction. Fallback still uses original unsegmented approved sprites.
- `assets/animation/ari/rear-shin-v145.png`, `rear-boot-v145.png`, `front-shin-v145.png`, `front-boot-v145.png`: masked segments of EXISTING approved boot and trousers; no newly generated painted replacement character.
- v14.4 animation tests updated to validate independent ankles and actual sole transformation. Added `tests/v145_ankle_rig.cjs` (721 sampled phases).
- `src/game.js`, `src/levels.js`, `src/curriculum.js`, `src/world1_v14.js`, `src/scene3d.js`, and original assets have identical bytes to v14.4.

## QA results

- Baseline `npm test`: passed all 17 scripts before edits.
- v14.5 `npm test`: passed **18/18** scripts; includes the 100-level structural checks and the v14.5 animation assertions.
- Local headless Chromium with **actual game Canvas renderer**, in-memory script/assets (not hosted): ten World 1 scenes rendered, zero JS page errors.
- Local browser gameplay input (keyboard): movement delta >75 px over a short test.
- Four subject shrine checks: wrong answer showed error and correct answer awarded a rune (4 total).
- Age/language question generation: 5 age groups × 3 interface languages sampled.
- Local headless Chromium FPS snapshots: see `evidence/v145-local-renderer/functional-browser-observations.json`; NOT physical device results.
- Eight phase-aligned actual renderer captures (right/left × 4 phases) performed using synthetic pose state for frame-to-frame comparison. These are actual Canvas-renderer frames, but **not uninterrupted gameplay**.
- A local HTTP server returned index.html with HTTP 200; headless browser navigation to localhost was blocked by environment administrator, so *HTTP-served browser QA was not completed*.

## Outstanding / not verified

- Hosted Cloudflare staging deployment and owner acceptance: NOT PERFORMED.
- Physical Chrome/Edge/iOS Safari/Android Chrome device coverage: NOT TESTED (Chromium headless only).
- Normal-speed manual full-length playthrough and video recording for each level: NOT TESTED.
- Real hardware FPS and precise ankle art seam behavior across all arbitrary blends: require manual owner review.
- All original illustrated environments and gameplay are retained; this is a targeted gait/footwork integration, not a full graphical redesign.

**Verdict: READY FOR OWNER REVIEW — local development candidate; production approval NOT granted.**
