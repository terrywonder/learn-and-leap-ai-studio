# Learn & Leap v12 — Ari & Rootkeeper Animation Polish

## Approved scope
Visuals and proportions come from v11. Only animation blending, timing and contact-related visual effects have been changed. Core game/collision/education are unchanged.

## Implemented
- `src/animation_v12.js`: deterministic per-character state controllers.
- Ari pose mixer smooths **limb angles, tilt, bounce, scarf and landing compression** across abrupt changes between idle, running, jumping, falling, landing and casting. The run cycle is tied to player movement distance through `player.run`; footstep events only trigger when grounded.
- Contact-triggered footstep / landing dust replaces purely oscillating dust emission. No damage/hitbox updates.
- Rootkeeper animation controller prioritizes defeat > hurt > attack > idle and smooths clip transitions. Frames come from the approved complete-body bone-deformed v11 atlas, not cut-up limbs or a whole-body zoom.
- Rootkeeper attack phase is synchronized to `bossPulse=1.15` and advances toward its strike near the gameplay damage event.
- Original 226px height and 178px width, ground lock and illustrated body remain unchanged. Other enemy animation mechanisms are not modified.
- New `ANIMATION_REVIEW_V12.html` previews both characters at multiple playback speeds from the actual game renderer.

## Validation
- `npm test`: includes 100 level definition checks, 18,000 age/subject/language curriculum cases, 500 playable age-and-level simulations, 2,000 shrine answers, 50 guardians, original v11 visual references, and new `tests/v12_animation.cjs` checks of pose continuity and action priority.
- `tests/v12_visual_capture.py` rendered 27 game-renderer frames in an isolated headless Chromium document. This confirms no canvas JavaScript errors and gives visual evidence, **not full hosted gameplay or actual iPhone QA**.

## Limitations / next quality gate
The v11 source art is still 2D, bone-deformed illustration. Frame crossfades and pose blending cannot replace a professional authored IK rig, mocap or painstaking frame-by-frame animation. Some visual smearing may occur around rapid transitions. A real-time hosted playtest is mandatory to assess foot sliding, attack readability and mobile performance at normal speed. Do not call v12 AAA approved before owner sign-off.
