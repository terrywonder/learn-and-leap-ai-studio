# Rootkeeper v9 — Skeletal Animation Acceptance Checklist

## Fix delivered
- No v7 transparent cutout pieces; no v8 whole-image deformation or frame zoom sheets.
- A dedicated rootkeeper skeletal rig (`src/rootkeeper_rig.js`) defines **17 named joints** and **four analytic two-bone IK chains**.
- Connected, textured bark geometry spans elbows and knees and paints a continuous torso under limb overlaps.
- Gait uses separate contact/swing phases, with a swing-foot lift; the enemy animation is linked to real accumulated horizontal travel, not only a clock.
- Boss attack transitions through **wind-up → held anticipation → forward strike → follow-through → recovery**; damage and defeat have distinct joint poses.
- Animation updates only visuals, not game hitboxes, physics, education, checkpoint or saves.
- Debug overlay: run game with `?debugRig=1` or open `/ANIMATION_REVIEW.html` to inspect joints, scrub phases and slow playback.

## What automated checks established
- `npm test`: 100 levels, 18,000 question cases, 500 age × level gameplay combinations, 2,000 shrine interactions, 50 guardian fights, mock Three tests, 17-bone IK rig and character rendering integration.
- `tests/v9_render_frames.py`: actual Chromium Canvas frame capture, 6 distinct boss states and attack GIF.
- `tests/v9_browser_interactions.py`: Chromium runtime movement/jump, shrine correct answer and rune, boss stage initialization.

## Production sign-off not yet earned
- A technical rig alone is not proof of *professionally animated AAA* imagery. The source art is relatively small and hands/feet have approximate procedural skin details. Hand-painted texture and animator polish may still be required.
- Play and inspect World 1 Level 10 **on an actual iPhone Safari**. Confirm no joint gaps, foot skating, clipped antlers, blurry textures or visual collisions.
- Review at normal speed, quarter speed and frame by frame, both directions, and near-the-player attack.
- Do not propagate to other enemies or worlds without approval.
