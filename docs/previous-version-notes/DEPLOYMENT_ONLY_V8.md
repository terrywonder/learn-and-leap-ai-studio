# Google Antigravity — v8 Deployment-Only Instruction

**Project:** Learn & Leap Adventure v8 — Rootkeeper Animation Rebuild

Use this directory as the static web root, keeping `index.html`, `src/`, `assets/` unchanged. Deploy to an **authorized staging HTTPS URL**; do not overwrite production or change DNS without explicit approval.

## Non-negotiable
- This is deployment and verification ONLY. Do not generate new graphics, substitute previous v7 Rootkeeper frames, change educational content, or make changes to existing game mechanics.
- Do not change the default illustrated Canvas renderer. The `?renderer=three` mode is the legacy visual comparison and does **not** contain the v8 animation.
- Do not change localStorage progress keys. Retain all 100 levels, 10 worlds, 5 age groups, 3 languages, 4 subjects.
- Deploy all 5 local sprite atlases in `assets/animation/rootkeeper-v8/` (idle.webp, stalk.webp, attack.webp, hurt.webp, defeat.webp).

## Steps
1. Verify you opened the v8 folder (read `README.md`, `package.json`, and `tests/v8_rootkeeper.cjs`).
2. Run `npm test`; report pass/fail, never hide failures.
3. Set static deployment web root to this folder; **no build command required**. Publish with correct JS, WebP and HTML content types.
4. Visit Level 10 (World 1) on an HTTPS staging URL. Check Rootkeeper idle, attack wind-up/impact, reaction to damage and defeat. The character must be intact: **no missing torso panels or displaced/detached arms/legs**.
5. Confirm runtime visual differences by comparing to `docs/v8-rootkeeper-real-render-poses.png` and `docs/v8-rootkeeper-runtime-attack.gif` (locally rendered reference, not hosted proof).
6. Check the character's feet do not slide across the floor during boss attack, and attack animation timing matches collision/damage timing.
7. Test the full game functions: Ari left/right/jump/cast, questions across all subjects, age/language, rune awards, 100-level map, save/load and boss victory.
8. Perform real desktop Chrome and iPhone Safari/Android Chrome QA if devices are available. Collect an actual gameplay video and screenshots from the deployed URL. Explicitly report skipped devices and unknown performance.
9. Return the staging URL and a visual/functional GO or NO-GO. Do not declare AAA-quality or release to production until owner approval.

## Required report
Hosting and staging URL; exact source version; complete test results; files changed during deployment (prefer none); browser/device QA results; screenshots/video of **actual gameplay**; remaining animation seams or warping; release verdict.
