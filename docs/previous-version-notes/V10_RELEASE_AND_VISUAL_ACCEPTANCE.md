# Learn & Leap Adventure v10 — Rootkeeper Art and Skeletal Skin Rebuild

## Deliverable
This is the **complete existing 100-level game project**, upgraded in World 1 Rootkeeper only. It includes playable game, all required assets, five age bands, four learning subjects, three interface languages, local progress, the standalone `ANIMATION_REVIEW.html` inspection page, and the source and regression tests.

## What v10 implements
- Preserves v9 **17-joint articulated rig**, analytic shoulder/elbow/wrist and hip/knee/ankle two-bone inverse kinematics, boss-state and game-collision wiring.
- Replaces geometric joint discs, flat triangle feet and large flat torso panels with a **continuous organic 2D bark skin**, layered root tendrils, texturing, moss patches, tapered fingers and splayed root toes.
- Retains illustrated Rootkeeper head/chest artwork; animated torso covers hip/shoulder gaps.
- Distinct idle, stalking, attack anticipation/impact/recovery, damage, defeat animation poses.
- No whole-image zoom or stretch fake animation. The character body and head remain anchored to the skeletal pose.
- Limits changes to the World 1 Rootkeeper **visual rendering**; movement physics, collisions, educational content and saved progress are unchanged.

## Quality limitations — do not misrepresent
This is a **custom procedural 2D skeletal skin**, not a professionally sculpted/weight-painted Blender/Spine production character. Organic curves and detailed textures look more cohesive than v9, but the boss still requires character-artist skinning polish and an animator's pass. The current runtime screenshots are evidence of what was rendered, not proof of AAA-grade acceptance. Prioritise owner review of actual movement at normal speed.

## Acceptance checklist
- [ ] Rootkeeper readable and visually cohesive at gameplay scale
- [ ] No obvious flat torso panels, geometric hand discs or triangular feet
- [ ] No visible gaps at elbows, shoulders, hips and knees across all clips
- [ ] Leg stance/swing with believable foot contact; no unacceptable skating
- [ ] Separate recognizable idle/stalk/wind-up/impact/recovery/hurt/defeat poses
- [ ] On-screen boss hit matches attack animation timing
- [ ] Mobile Safari and Chrome device playback, controls and frame-rate tested
- [ ] 100-level and 3-language curriculum regression passed
- [ ] Owner approves visual quality **during gameplay**, not only screenshots

## Testing
Run `npm test` in the project root. `tests/v10_rootkeeper.cjs` validates 505 rig poses, finite joints, bone lengths, pose differentiation, and the changed skin source. Chromium scripted gameplay tests under `tests/v9_browser_interactions.py` remain valid for the unchanged game logic and are recommended after deployment. Check `ANIMATION_REVIEW.html` at normal and quarter speed, with and without the bones overlay.

## Deployment
The project is a static website. Publish the folder containing `index.html`, `src/`, and `assets/` to an HTTPS staging site; no build command. Do **not** publish to production or propagate to the remaining bosses until owner approval. Default rendering is the illustrated 2.5D renderer. The optional `?renderer=three` path is not the upgraded v10 art.
