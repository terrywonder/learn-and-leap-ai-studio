# Learn & Leap Adventure v14.1 — Development and QA Report

**Date:** 2026-10-21  
**Candidate:** v14.1 Hero Animation Integrity & World 1 Terrain Art Polish  
**Baseline archive:** `Learn-and-Leap-Adventure-v14-World1-Full-Variety-Complete-Project.zip`  
**Baseline SHA-256:** `7d5daf9eeda5dc7cc959221bb66ce8807ead70a00c41ad020f750063e80ede84`  
**Source revision:** locally modified v14.1 source snapshot, **no Git commit available**  
**Environment:** local headless Chromium on Linux; **Cloudflare not deployed**  
**Classification:** Developer candidate — ready for visual owner review only; NOT production-authorized.

## Root cause — Ari foot

The original `assets/animation/ari/back-leg.png` was intrinsically missing the rear boot: alpha bounding box (91,133)–(187,194); the leg ends in a cuff and tiny leftover thread. Painting/draw-order adjustments alone would not restore it. The other approved layers were preserved unmodified. Created `assets/animation/ari/back-leg-v141.png`: footwear detail re-used from the approved front-leg illustration, oriented and **integrated into the articulated rear-leg sprite** so it rotates with the hip bone. It is **not** a fixed-position overlaid duplicate or static replacement character. Old rear-leg retained for rollback. New layer alpha bounds (72,133)–(187,206); opaque pixels inside foot test region increased 169 → 1052. Added diagnostic joint/sprite-bound view (`PainterWorld.debugCharacter`).

Visual evidence: `evidence/v141-comparison/ari-6-state-rear-foot-before-after.png` (six sampled poses including left-facing). These are composed from the actual game sprite layers. This alone does not prove every transitional frame or touch interaction is defect-free. Owner should inspect idle, left/right running, jump, falling, landing, casting, hit and defeat in hosted play.

## Terrain art implementation

New active renderer module: `src/world1_terrain_v141.js`.
It combines existing approved illustrated cliff/rock and living-ledge source assets, cropped varied sections, clipped 312 px face modules, per-level seeded fracture and strata composition, finer mossy grass silhouettes, distinct rim/edge materials, source lighting/shading, and biome-specific structures. Material families: forest, mushroom, waterfall, timber, temple, firefly, swamp, cave, storm and sacred. Functional collision coordinates continue to use the original platforms from `src/levels.js`; no collision edits. World 2–10 renderer branch unchanged.

Changed: `src/premium.js` (active sprite asset and World 1 terrain call, optional diagnostic overlay), `src/world1_terrain_v141.js` (new), `assets/animation/ari/back-leg-v141.png` (new), `package.json`, `README.md`, `index.html` (version labels), `tests/v14_world1.cjs` (checks delegated terrain renderer), and new v14.1 regression/browser-capture scripts. Game engine, world 1 mechanics, curriculum, all 100 levels, saved-progress keys and Rootkeeper assets were not rewritten.

## Automated validation

- Baseline before edit: `npm test` — **11/11 checks PASS** (original v14).
- After v14.1: `npm test` — **12/12 checks PASS**. Includes 100-level data/progression, subjects/age/language, input/physics, Rootkeeper, world 1 uniqueness, mechanic-level checks and new sprite/terrain integration.
- `python tests/v141_alpha_runtime.py` — PASS: physical sprite dimensions/alpha-foot coverage checked, no fabricated pixel geometry.
- `python tests/v14_browser_inmemory.py` — PASS: actual game renderer executed in Chromium with data-URI bundled asset injection, 10-level screenshots, actual keyboard movement, four question subjects (wrong + correct answers), age × language samples, game-script-assisted 10/10 level victory, Rootkeeper 3-hit progression; **0 JavaScript errors**.
- **Important:** browser test uses scripted relocation to shrines/gates; this is not an uninterrupted manual traversal. Browser harness loads 26/68 selectively injected renderer image references; other optional/nonessential asset paths were not comprehensively HTTP-tested. Hosted asset loading has NOT been verified.

## Frame-rate observations, NOT mobile benchmarks

Measured using Chromium headless software rendering, 1280×720 game canvas, roughly 1 second samples; values fluctuate and hardware is not representative of a capable gaming desktop:

| Level | Observed FPS |
|---|---:|
| 1 | 43.7 |
| 2 | 45.7 |
| 5 | 58.0 |
| 7 | 48.5 |
| 9 | 51.4 |
| 10 | 35.2 |

Desktop target of 60 FPS is **not consistently reached in this headless test**; physical desktop and mobile performance remain unverified. Playwright recorded video at 25 FPS; **video encoding frame rate is not game-render FPS**.

## Ten level runtime evidence

Each screenshot is an actual in-memory local Chromium gameplay-renderer frame. Each ~15.3–15.5-second normal-speed MP4 is recorded from the running game, with keyboard movement, jumping and a real shrine interaction. Captures are **script-assisted** (player relocated between sections); footage does not demonstrate continuous unaided level completion or all mechanics. Specific mechanics L2 bounce/L5 bridges/L7 sink/L8 lifts/L9 wind/L10 phases are covered by logic regression tests; footage alone is insufficient to certify every mechanic.

| Level | Local screenshot path | 15-sec recording path | Location gameplay intent | Testing status |
|---|---|---|---|---|
| 01 Enchanted Forest Entrance | `evidence/local-chromium/level-01.png` | `evidence/v141-gameplay-clips/world1-level-01-runtime-15sec.mp4` | forest onboarding | Chromium script pass; owner manual traversal pending |
| 02 Giant Mushroom Valley | `evidence/local-chromium/level-02.png` | `evidence/v141-gameplay-clips/world1-level-02-runtime-15sec.mp4` | mushroom bounce | Chromium script pass; owner manual traversal pending |
| 03 Crystal Waterfall Gorge | `evidence/local-chromium/level-03.png` | `evidence/v141-gameplay-clips/world1-level-03-runtime-15sec.mp4` | waterfall gaps/drift | Chromium script pass; owner manual traversal pending |
| 04 Treetop Village | `evidence/local-chromium/level-04.png` | `evidence/v141-gameplay-clips/world1-level-04-runtime-15sec.mp4` | treetop route | Chromium script pass; owner manual traversal pending |
| 05 Forgotten Temple | `evidence/local-chromium/level-05.png` | `evidence/v141-gameplay-clips/world1-level-05-runtime-15sec.mp4` | temple bridge levers | Chromium script pass; owner manual traversal pending |
| 06 Firefly Forest | `evidence/local-chromium/level-06.png` | `evidence/v141-gameplay-clips/world1-level-06-runtime-15sec.mp4` | light-guided bridges | Chromium script pass; owner manual traversal pending |
| 07 Misty Swamplands | `evidence/local-chromium/level-07.png` | `evidence/v141-gameplay-clips/world1-level-07-runtime-15sec.mp4` | sinking marsh | Chromium script pass; owner manual traversal pending |
| 08 Underground Root Caverns | `evidence/local-chromium/level-08.png` | `evidence/v141-gameplay-clips/world1-level-08-runtime-15sec.mp4` | cave lift/switch | Chromium script pass; owner manual traversal pending |
| 09 Stormwood Highlands | `evidence/local-chromium/level-09.png` | `evidence/v141-gameplay-clips/world1-level-09-runtime-15sec.mp4` | wind/collapse | Chromium script pass; owner manual traversal pending |
| 10 Heart of the Ancient Forest | `evidence/local-chromium/level-10.png` | `evidence/v141-gameplay-clips/world1-level-10-runtime-15sec.mp4` | Rootkeeper three-phase boss | Chromium script pass; owner manual traversal pending |

Visual contact sheet: `evidence/v141-comparison/v141-ten-level-actual-runtime-sheet.jpg`  
Before/after comparison (levels 1, 7 and 9): `evidence/v141-comparison/v14-v141-actual-runtime-before-after.jpg`.

## Device/browser matrix

| Environment | Status | Observations |
|---|---|---|
| Headless Chromium desktop | TESTED LOCALLY | Render, scripted movement, interaction, save/progression checks passed; performance above |
| Desktop Chrome GUI | NOT TESTED | Real desktop interactive user session needed |
| Desktop Edge | NOT TESTED | Not accessible |
| iPhone Safari physical | NOT TESTED | No physical iPhone device available |
| Android Chrome physical | NOT TESTED | No physical Android device available |
| Chromium 390×844 responsive viewport | SIMULATED ONLY | Screenshot captured; NOT equivalent to mobile Safari/Chrome or touch testing |
| Cloudflare Pages HTTPS staging | NOT DEPLOYED | Authorized account/project not verified here |

## Unresolved acceptance and caution

1. Owner must approve character motion and terrain art quality in the actual game. Contact sheet/recordings should be reviewed at normal zoom.
2. Run **uninterrupted** manual World 1 playthroughs, verify terrain edges and collision seams while scrolling, and record full shrine + completion results without scripted teleporting.
3. Validate all ten biome materials with actual hosted assets and responsive question UIs, languages and all age groups.
4. Browser performance (especially Level 10 at 35.2 FPS in headless software Chromium) should be measured on supported desktop/mobile devices; optimize only if actual hardware reveals a problem.
5. Test Chrome, Edge, iPhone Safari, Android Chrome and touch sound/saving before release acceptance.
6. No deployment, DNS change or production action has been taken.

## Deployment handoff / rollback

Source is a **static site**; no build command. Project root is the directory with `index.html`, `src/` and `assets/`; Cloudflare Pages output directory is this same root (`.`). Run `npm test` first. In Google Antigravity, verify Cloudflare account and staging project ownership, record working deployment ID, and publish to a NEW authorized preview (not production). Open URL and independently verify assets, visuals, mechanics and device coverage. Roll back by redeploying the original v14 archive with SHA-256 `7d5daf9eeda5dc7cc959221bb66ce8807ead70a00c41ad020f750063e80ede84` or choosing the previously recorded Cloudflare deployment ID. No Cloudflare ID is known, because v14.1 was not deployed.

## Verdict

**READY FOR OWNER REVIEW — LOCAL DEVELOPMENT CANDIDATE ONLY.** This verdict recognizes source implementation and local scripted runtime evidence. It **does not** certify completion of uninterrupted manual gameplay, hosted/browser QA or physical-device coverage. Production release is NOT authorized.
