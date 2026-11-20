# Learn & Leap Adventure v14.2 — Development QA & Google Antigravity Handoff

**Date:** 23 October 2026 (Malaysia)  
**Status:** LOCAL DEVELOPMENT CANDIDATE — production not authorized  
**Base archive:** `Learn-and-Leap-Adventure-v14.1.1-Ari-Cleanup-Playable-Under20MB.zip`  
**Base SHA-256:** `ad272f560607d62841d8301888d892da8a8ea8fb137a7b7726ab32fcd9646120`  
**Candidate:** v14.2.0 — Crystal Waterfall Gorge scenery integration, Ari run-pose restraint and shrine/gate readability  

## What was implemented

1. Added `assets/world1-v142/crystal-waterfall-scenery.webp`, built from the scenery-only portion of the owner-approved `docs/visual-references/owner-approved-waterfall-fullscene.png` (owner-approved reference image SHA-256 `adfa83150bac5da12106639b7d081535a336ba0d625ad8522227f1cc71dd3036`). The full flattened illustration includes Ari, coins, platforms and a gate; these are **not baked into runtime scenery**. A subtle animated water-streak effect is drawn behind live geometry.
2. `src/premium.js`: introduced a Level 3-only runtime background path. World 1 Levels 1–2 and 4–10 retain the v14 authored renderer, and Worlds 2–10 are unchanged.
3. `src/premium.js`: added contrast plates and outline for visible labels, including the **DISCOVER** exit gate and four educational shrine captions; the runtime gate remains unlockable only by the original rules.
4. `src/premium.js`: restrained the leg swing range within the existing articulated sprite rig to reduce crossing or awkward boot overlap. No character design or gameplay physics was changed.
5. Added `tests/v142_visual_integration.cjs` and a portable source-art extraction script, `scripts/build_v142_background.py`.
6. Preserved approved v14.1.1 clean Ari sprite layers, repaired rear boot, Rootkeeper assets, ten world data and existing curriculum.

## Verification conducted (truthful scope)

- **Automated source regression:** `npm test` **PASS** including 13 prior test scripts plus 1 new v14.2 test (14 scripts total).
- **Level definitions:** All 100 defined and constructible (from existing and new tests).
- **World 1 local screenshot coverage:** 10/10 rendered inside Chromium's real Canvas, using the project game scripts and original assets in an in-memory browser harness; `evidence/v142-local-chromium/`.
- **Level 3 interaction:** Question opened with four options. A wrong response produced “Not quite. Try again!” without awarding rune; the correct response awarded rune 1/4 and returned to play. This was a browser-assisted targeted interaction, not uninterrupted manual play.
- **JavaScript errors in local harness:** 0.
- **Asset preload in local harness:** 69 of 69 referenced images loaded.
- **Visual comparison:** actual local browser screenshot comparison available separately, not a hosted staging capture.
- **Performance FPS:** NOT MEASURED for this build; do not reuse older v14.1 FPS numbers as v14.2.
- **Mobile physical device, Edge, iPhone Safari, Android Chrome:** NOT TESTED.
- **Cloudflare HTTPS preview/staging and ownership:** NOT TESTED / NOT DEPLOYED. No Cloudflare settings or DNS changed.
- **Runtime full manual playthroughs, 15–30 sec Level 3 recording:** NOT COMPLETED for v14.2. Neither unit tests nor scripted camera movement are evidence of a full playthrough.

## Visual scope and limitations

The approved image was a **flattened composite**. The game background uses its scenery-only upper portion, blending lower waterfalls into mist so no duplicate baked character/shrines/gameplay geometry remains. Consequently the running game is an integration of the approved *look*, not a pixel-for-pixel recreation of the whole concept image. Terrain, shrine, physics and interactive objects remain independent of the background.

`?renderer=three` is an archived optional renderer and does not implement this art upgrade. Use the default illustrated Canvas runtime for visual acceptance.

## Deployment and rollback

Static site: root `index.html` + `src/` + `assets/`; no compilation is needed. Run `npm test` and serve extracted project root over HTTP for local preview; deploy to a new authorized Cloudflare Pages preview or staging only, after confirming account/project ownership and saving the existing rollback deployment ID. No production deployment until explicit owner approval. To rollback this local development change, restore the v14.1.1 archive with the SHA-256 above; for hosted rollback use the Cloudflare deployment ID recorded during staging deployment (not available here).

**Release verdict:** READY FOR OWNER *LOCAL VISUAL REVIEW*; production readiness is **not established** pending staging QA, normal gameplay recordings, manual and physical-device verification.
