# Learn & Leap Adventure v14.1.1 — Ari Sprite Debris Cleanup

**Status:** developer patch for owner review; not staged or production-approved.  
**Source baseline:** supplied `Learn-and-Leap-Adventure-v14.1-Complete-Game-Under20MB.zip`.  
**Scope:** sprite layer transparency cleanup only. World 1 terrain and gameplay remain as v14.1.

## Root cause and correction

Floating fragments visible around Ari originated in the `assets/animation/ari/body.png` and `front-arm.png` cutout source layers. In the unmodified originals, the body image contains 12 visually distinct alpha components and the front-arm contains three; the extra components are image segmentation debris, not motion particles. Those loose fragments remain attached to the screen as the rig animates.

The reproducible script `scripts/clean_ari_v1411.py` retains the largest 8-connected alpha component (threshold 20), its immediate antialiased fringe, all original interior RGBA values and sprite dimensions (285×235). This is deterministic source-image cleanup, not an AI repaint. It writes:

- `assets/animation/ari/body-v1411-clean.png` — 487 visible disconnected pixels removed; 12 → 1 visible alpha components.
- `assets/animation/ari/front-arm-v1411-clean.png` — 16 visible disconnected pixels removed; 3 → 1 components.

`src/premium.js` now preloads and draws these two clean layers in the existing bone rig, preserving pivot transforms. The approved face, clothing, hair, scarf and proportions are untouched, and `back-leg-v141.png` retains the attached boot restoration. Original `body.png` and `front-arm.png` remain unchanged for rollback.

## Game structure

All 100 original level definitions, Worlds 1–10, four educational subjects, five age selections, three interface languages, coins/runes, save keys, enemy logic, Rootkeeper and v14/v14.1 terrain implementations were retained. No third-party engine or CDN dependency was added.

## QA evidence and limitations

- `npm test`: **13/13 test scripts PASS** (including the new alpha-component verification).
- `python tests/v14_browser_inmemory.py`: locally ran game logic and v14.1.1 actual scene renderer inside headless Chromium; ten World 1 screenshots, keyboard movement, four subjects, age/language sample, scripted rune rewards and level completion 10/10, Rootkeeper three hits; **zero browser JavaScript errors**.
- `python tests/v1411_capture_ari.py`: captured local Chromium animation QA snapshots using keyboard inputs. **Enemies and hazards are disabled by the test harness only** to prevent player death during pose capture; gameplay files and normal levels remain unchanged. These captures cannot be used to assert actual combat survival.
- Local in-memory browser harness intentionally injects 26 key images rather than exercising the complete HTTP asset loading path. Localhost navigation was refused by the managed browser environment. Actual hosted staging, network requests and physical devices remain **NOT TESTED**.
- Screenshot frames and pose captures are sample evidence, not exhaustive proof that every transition frame is artifact-free.
- No new real-gameplay video of v14.1.1 was recorded. The earlier v14.1 videos are **not evidence of this newer sprite patch**.

## Deployment instructions

Unzip this folder as the site root. It is a **static web project**, with `index.html`, `src/`, `assets/`; no build command is defined. Run `npm test`. In Google Antigravity, check the Cloudflare account and existing Education Game Pages project, preserve the current staging deployment ID and deploy to a **new authorized preview** first. Verify every image path, console logs, Ari's left/right idle/run/jump/land/cast/hit/defeat states and collisions. Do not deploy production without explicit owner approval. `README.md` and existing `ANTIGRAVITY_DEPLOYMENT_V14.md` remain applicable.

## Rollback

Revert `src/premium.js`, `package.json`, and `index.html` to the supplied original v14.1 source and remove the two new cleaned layers or stop referencing them. Retain existing older assets for rollback. Cloudflare rollback ID is unknown, because this patch has not been deployed.

## Verdict

**READY FOR OWNER VISUAL REVIEW — DEVELOPMENT BUILD ONLY.** No hosted or physical-device approval implied.
