# Learn & Leap Adventure v14.6 — Development & QA Report

**Release verdict:** LOCAL DEVELOPMENT CANDIDATE — STAGING AND OWNER REVIEW REQUIRED. Production not authorized.

## Verified baseline and corrective change

- v14.5 source ZIP SHA-256: `6eded43361a1fbe35d4a7cce067c73bc50db470ee6fee4f979b2f8b4d49a8a0b`.
- Source is the uploaded v14.5 project, not v13 or a generated mockup.
- Root defect: the v14.5 rear boot image faced backward even when supporting Ari's weight. Both painted boot soles have native toe-up bias (front approximately 36°, rear approximately 53° after reorientation); a naïve zero-angle ankle does *not* correspond to a planted boot.
- Fix: derive `rear-boot-forward-v146.png` by mirroring only the original rear boot around ankle x=120 in source space (285×235); no regenerated hero image. For planted poses, cancel hip rotation at each ankle AND compensate heel-to-toe source art pitch. For lifted poses, apply smaller toe pitch. Preserve the painted thigh/shin/boots and existing physics.
- Changed source: `src/animation.js`, `src/premium.js`, `package.json`, `index.html`, `README.md`, and the new rear boot PNG. Added the approved concept *reference* in `docs/` and new regression checks. Updated older assertions that explicitly expected v14.5's exaggerated raw ankle amplitude/version string; retained substantive tests of support, clearance, stability, gameplay and 100 levels. No `src/game.js`, `src/levels.js`, `src/curriculum.js`, Rootkeeper art, or Worlds 2–10 edits.

## Tests and evidence

- `npm test`: **19/19 scripts PASS** after the final source-angle calibration. Full 100 levels; 18,000 generated questions checked by existing regression scripts; World 1 mechanics remain present; 721 gait phases tested.
- In-memory actual Chromium Canvas capture: **four final ground-contact poses** covering right/left facing and front/rear support, no JavaScript page errors. These are rendered game screenshots with deterministic phase setup, **not** AI-generated concept imagery.
- A wider earlier in-memory Chromium run of the same v14.6 codebase *before the final ankle art-pitch calibration* rendered World 1 Levels 1–10 without page errors; showed keyboard movement (~86px), sampled wrong/right answers for all four subjects and generated 15 age/language samples. Because the ankle art-pitch correction was added after that run, those ten earlier scene screenshots do not independently certify the final four-phase animation across every level. The final four-pose renderer capture covers the resulting source calibration.
- The earlier pre-calibration local headless Chromium pass sampled 27–38 FPS across six levels. **This is not a final build benchmark or real-device result**; no performance target is claimed achieved.
- NOT VERIFIED: HTTPS hosted staging, uninterrupted 10-level manual clears, real iPhone Safari or Android Chrome, multi-device saving (the existing progress mechanism is local), mobile touch/long-session stability and hosted performance.

## Release blockers for production

Require full human review of 8-phase running, left/right animation, jumps/landings, 10-level hosted play and real mobile device validation. The user-approved illustration remains a *design reference*, not proof that every frame is approved in game.
