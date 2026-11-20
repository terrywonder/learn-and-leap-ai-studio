# Learn & Leap Adventure v15.0 — Full-Game Development & QA Handoff
**Build status:** Local development candidate; owner art acceptance and Cloudflare staging QA required. **Date:** 2026-11-07 (MYT).

## Actual implementation delivered
- Baseline: owner-provided v14.6 rear-foot correction. The approved Ari articulated sprites and Rootkeeper art are preserved; world 1 v14.6 gameplay and the approved waterfall scene remain unchanged.
- All 100 data-defined levels continue to load, with 4 educational shrines per level, four subjects, 5 age bands, and 3 interface languages. The existing per-age localStorage progress key `learn-leap-v2-full` was not migrated.
- World 1 levels 1–10 retain their ten locations, terrain, shrine puzzles and environmental mechanics from v14.
- Worlds 2–10 now have **90 named stages**, each with a distinct world + stage identity and a procedural stage-specific visual signature. Titles are in English, Simplified Chinese and Bahasa Melayu. The visual system adds biome-specific terrain, landmarks, parallax, safe on-screen switch cues and hazard graphics.
- New *actual gameplay* physics/system effects: resonant crystal rebounds, sky updrafts, thermal lift, ice friction, reef bubble currents, switched clockwork lifts, sinking moon-shadow platforms, star gravity pulses, rune-powered moving platforms; plus crossing, precision, mechanism, hazard, secret, mastery and guardian stage variants.
- Existing weapon/combat, checkpoints, four educational subjects, coins, save/progression and ten-world guardian data are preserved. No new framework, backend, account or payments.

## Changed source
- New `src/worlds_v15.js`: 90 stage configurations and gameplay physics.
- New `src/worlds_v15_art.js`: biome and stage landmarks, 2.5D materials and cues.
- Updated `src/levels.js`: invokes the new stage decorator after the existing World 1 decorator.
- Updated `src/game.js`: world mechanics hook, switch interaction, rune rewards, real collision contact and ice braking. Existing educational logic and save keys left intact.
- Updated `src/premium.js`: active Canvas renderer for Worlds 2–10 paints new environments; World 1 retains prior renderer.
- Updated `index.html`: loads expansion configuration and declares v15 development.
- Updated `package.json`: v15 development version, appends new v15 regression test to existing suite.
- Updated `tests/v143_visual_polish.cjs`: allows v15 release version while retaining all original detailed art assertions.
- New `tests/v15_full_game.cjs`, `tests/v15_browser_capture.py`, `docs/V15_100_LEVEL_RELEASE_MATRIX.csv`.

## Automated regression
`npm test`: **20 of 20 stages passed** in the local project, including legacy v14.6 checks and the v15 stage-and-physics check. The existing `tests/full100.cjs` provides automated curriculum and progression coverage. Do not interpret source tests as manual playthroughs or real-device passes.

## Actual local browser observations
The browser harness uses real Chromium and the actual HTML, Canvas renderer, game simulation and PNG assets, but loads them through an in-memory document because local HTTP navigation is restricted by this execution environment.
- 100/100 levels: `startLevel()` plus a real frame rendered without a reported exception; this is a **startup/render smoke test**, not 100 level completions.
- Ten world screenshots: one level from each world, shown in `evidence/v15-local-chromium/ten-worlds-real-game-contact-sheet.jpg`.
- Keyboard right-movement in World 8: measured **60.75 game-world units** after a short key hold.
- World 6 shrine: opens the actual question overlay with four options and a live prompt.
- Five age groups × three UI languages: 15 additional actual browser question-generation samples.
- Nine sampled new-world scenes: headless Chromium approx **40–52 FPS** in this harness. Headless render rate is not physical mobile FPS.
- JavaScript page errors in captured local harness: **none reported**.

## Known limitations / release blockers
1. **Not production approved.** World 2–10 art is stylized procedural biome scenery, not individually hand-painted, cinematic art plates equal to the previously approved World 1 waterfall. Owner review is mandatory; do not call the graphics finally approved.
2. **Not manually completed:** all 100 levels have *not* been completed by uninterrupted human play. The regression suite and scripted smoke tests cannot establish absence of difficult/unreachable platform sections.
3. **Device QA not done:** physical iPhone Safari, Android Chrome, desktop Edge, and actual touch handling under deployment are untested.
4. **Cloudflare staging not deployed:** no authenticated Cloudflare Pages account or confirmed staging project was available to this development environment. No staging URL/rollback deployment ID exists from this build.
5. **Optional `?renderer=three` mode is legacy** and does not reflect the new visual acceptance design. Default Canvas mode is the release review target.
6. A single background still cannot prove gameplay interaction; use hosted screen recordings during acceptance.

## Release verdict
**READY FOR OWNER REVIEW — LOCAL DEVELOPMENT CANDIDATE ONLY**, not READY FOR PRODUCTION. Staging and manual/browser/device tests remain release gates.

## Reference and rollback
Previous baseline archive: `Learn-and-Leap-Adventure-v14.6-Rear-Foot-Final-Fix-Antigravity-Under20MB.zip`, SHA-256 `aeebfbb7a92e2f97247ea61af53b733644682265f0fcdbd8df37beede5b84bd7`. Cloudflare rollback deployment ID cannot be claimed without authorized account inspection.
