# World 1 — actual playable art-pass handover

**Build:** Learn & Leap Adventure v5 — World 1 Cinematic Vertical Slice Candidate  
**Status:** functionally implemented and source/simulation tested, **not final AAA approval**.

## Why this exists

The previous v4 build showed low-poly primitive characters, round trees and rectangular platforms. The user's reference is a detailed cinematic fantasy platformer. This package replaces the default **visible** renderer with a painterly 2.5D rendering system using detailed self-contained artwork while preserving the gameplay engine. It does NOT pass off a still image or concept art as a game.

## Playable features (real actions and consequences)

- Side-scrolling run and jump across collision-tested platforms and pits
- Four subjects per level (Mathematics, English, Science and General Knowledge) via interactive shrines; correct answers unlock runes and +2 magic
- Five age groups and three interface languages; quiz variants use the original curriculum
- Coins, enemies, checkpoint respawns, health and magic projectiles
- World 1's Rootkeeper on Level 10, whose health is reduced by magic once four runes are active
- Stars and level-completion saves per age group
- Ten World 1 chapters (Levels 1–10); original levels 11–100 remain in the same engine

## Graphics changed

- Image-based original Ari animation layer in place of on-screen primitive mesh model
- Forest environmental plate with parallax and independently rendered world entities
- Screen-space high-resolution moss and stone terrain textures
- Rich layered canopy, vine, flowers, foliage and environmental fireflies
- Image-based animated enemies and illustrated Rootkeeper guardian
- Magic shrine and gate VFX; actual question UI is HTML, not pixels baked into a screenshot
- New fantasy parchment educational challenge cards and glossed game HUD

## Renderer architecture / limitations

`src/premium.js` is a **self-contained illustrated Canvas 2D 2.5D renderer**. It uses one local image for Ari rather than skeletal 3D animation, and its environment layers are hand-illustrated rather than AAA-sculpted glTF models. It is **closer to the requested image visually, but has not achieved actual console/AAA production fidelity**. The engine was chosen as an immediately playable, offline-functional art pass with no external rendering dependencies.

`src/scene3d.js` remains unchanged and can be selected using `?renderer=three` for comparison; it loads Three.js from the external public CDN. BOTH renderers share `src/game.js`, `src/levels.js` and `src/curriculum.js`.

**No claim of real iPhone Safari or real-browser end-to-end verification**. This container's browser is blocked from URL navigation. Source tests passed and actual gameplay frames were rendered and inspected with Skia Canvas, a separate canvas implementation.

## How to play

1. Publish the full project folder as a static HTTPS site (keep all `assets` and `src` paths). No build or framework installation required.
2. Open the hosted URL in iPhone Safari, Android Chrome or a desktop browser. Do **not** open the ZIP/HTML inside Facebook attachment preview.
3. Select age group and language; press Begin Adventure; choose Chapter 01.
4. Desktop: A/D or arrows to move; W/↑/Space to jump; E to interact; J to shoot. Mobile: on-screen buttons.
5. Answer a shrine question correctly to earn rune keys and magic. Collect all four, then reach the exit.
6. Choose Level 10 to challenge the Rootkeeper. Unlock all four runes, then cast three hits of magic near the guardian.

## Minimum launch gate for the project manager

- [ ] Manually play Level 1 from beginning to gate on iPhone Safari and Android Chrome
- [ ] Verify all four shrines, correct/wrong/hint paths and age/language combinations
- [ ] Verify all coins, magic, health, pits, enemy contact, checkpoints and restart
- [ ] Defeat Rootkeeper in Level 10 using earned magic
- [ ] Check whether jump/camera/collision positions visually match foreground artwork
- [ ] Check real device FPS, memory and touch accuracy
- [ ] Compare actual gameplay screenshots—not mockups—with the owner's second reference
- [ ] Get explicit owner sign-off before producing final detailed models and the remaining nine worlds

## Unfinished AAA quality items

Professionally authored 3D Ari model with rigged animation, physically based materials, detailed sculpted vegetation and buildings, unique per-world environment kits, boss cinematic animation, advanced lighting/post-processing and mobile LOD pipelines. They require separate professional asset production and GPU/browser QA.
