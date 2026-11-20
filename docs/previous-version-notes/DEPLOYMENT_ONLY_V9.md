# Google Antigravity deployment — Learn & Leap Adventure v9 (skeletal animation candidate)

**Role:** deploy the already-built game and run QA. Do not redesign, regenerate art, or invent levels.

The correct publish root is the folder containing `index.html`, `src/`, `assets/` and `ANIMATION_REVIEW.html`.

1. Preserve a rollback of the existing v8 staging site and record its revision.
2. Deploy the v9 folder to a **new v9 staging URL** under HTTPS; do not overwrite a live production version without owner approval.
3. Verify `src/rootkeeper_rig.js` and all three `assets/animation/rootkeeper-rig/` assets respond with HTTP 200 and correct MIME types. No build command for the illustrated renderer; `npm test` validates logic.
4. Open `/ANIMATION_REVIEW.html` on the staging site. Inspect **Idle, Stalking, Attack, Hurt, Defeat** using slow-motion and **Reveal 17 joint skeleton**. The inspector must show real wrist/elbow/knee/ankle positions changing (not whole-character scaling).
5. Open the game and play World 1 Level 10. Test the boss battle and magic, the hero's run/jump, the four shrines, keys, level complete and saved progress.
6. Verify all 100 levels, five age bands, English/Chinese/Bahasa Melayu, old saved progress, all original game graphics, and mobile controls remain available.
7. Run `npm test`, `python tests/v9_render_frames.py`, `python tests/v9_browser_interactions.py`. Compare captured actual frames; do not substitute a generated concept image.
8. Test on **iPhone Safari, Android Chrome and desktop Chrome** where actual devices are available. Record real performance, runtime exceptions and memory use. Do not claim real-device testing if only a desktop simulated browser was used.
9. Provide screenshots, a gameplay video, a QA log, any limitations, and staging URL to the owner. Hold rollout to the other monsters/worlds pending owner approval.

**Design boundary:** v9 implements a custom 17-joint 2D bone/IK rig with continuous textured limb skins. It is **not** a Blender/GLTF skinned 3D mesh, licensed Spine rig, or AAA-quality animation certification. Production art/animation review and genuine iPhone Safari QA remain outstanding.
