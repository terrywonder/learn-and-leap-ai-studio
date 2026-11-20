# Learn & Leap World 1 — v11 Rootkeeper release and acceptance

## Root issue and resolution

- **v9/v10 failed aesthetically.** Rootkeeper combined a detailed illustrated head and torso with procedural cylindrical roots, circles and crude polygon feet. It was also rendered at approximately 345 px height, visually overwhelming Ari and the shrine.
- **v11** displays a **complete painted Rootkeeper silhouette** from `assets/foe-03.webp`, never split into transparent detached cutouts. Its movement is authored as a continuous 2D skin-deformation field driven by anatomical joint controls. The five exported clips are idle, stalk/walk, attack, hurt and defeat.
- The boss display height has been reduced from 345px to **226px** in the 1280×720 logical game viewport; Ari's illustrated body is approximately 125px high. The 178px boss width leaves substantially more combat space. The player and boss **collision geometry is deliberately unchanged**.
- Rootkeeper's visual sprite is ground aligned; the health bar now follows the new boss height.

## What is technically real

- Source generator: `build_rootkeeper_v11.py` includes bind-pose anatomical controls and per-pixel skin weights. It exports 80 deterministic frames across five WebP atlases, with a fixed pixel grid and no frame zoom.
- Gameplay renderer: `src/premium.js` selects clips according to live boss attack, injury and defeat timers. Walking enemy variants use the stalk clip.
- Review screen: `ANIMATION_REVIEW.html` allows play/pause, action selection, quarter-speed playback and scrubbing.

## QA completed

- `npm test` passes, covering 100 authored levels, 18,000 generated curriculum cases, 500 age/level simulations, 2,000 shrine answers and 50 guardian battle simulations, plus asset and renderer integration checks.
- Chromium data-backed Canvas test renders the actual v11 atlas-cropping method with the corrected boss/Ari size and generates `docs/v11-canvas-character-scale.png` and `docs/v11-canvas-pose-review.png`.
- Browser navigation to localhost was blocked by the testing environment. **No claim of a real hosted-site game test or real iPhone test is made.**

## Approval criteria

1. Boss is visually cohesive and no longer displays giant geometric discs or detached claws.
2. Rootkeeper is between **1.7× and 2.0×** Ari's painted size at normal framing.
3. There is no whole-image zoom used to imitate walking or attacks.
4. Arms and legs change pose while all body pixels remain continuously skinned; no large body gaps.
5. The player has sufficient movement space, the learning shrine remains readable, and the boss health bar does not overlap the HUD.
6. Attack anticipation, strike, recovery, damage and defeat are legible in a **real game recording at normal speed**.
7. All four subject shrines, attack damage, completion, save data, five age groups and three languages still work.
8. Owner has reviewed a real hosted gameplay clip and approved it.

**Status:** v11 candidate ready for owner review **after staging verification**. Not yet AAA certified or approved for production, nor a final professional weight-painted 3D skeletal rig.
