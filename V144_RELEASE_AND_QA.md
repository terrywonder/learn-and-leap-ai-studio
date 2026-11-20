# Learn & Leap Adventure v14.4 — Natural Run Cycle Integration

Date: 7 November 2026 (Malaysia). **Release status: LOCAL DEVELOPMENT CANDIDATE — NOT PRODUCTION APPROVED.**

## Source and preservation
- Baseline: `Learn-and-Leap-Adventure-v14.3-Professional-Visual-Pass-Antigravity-Under20MB.zip`; SHA-256 `83c5a2b5b8c4855310313c7838cccb89b2258334138d8221055dcc3f3f402f93`.
- Implementation: reduced Ari's exaggerated hip rotation and changed foot clearance/contact timing so the painted rear and front boots alternately support and swing. The supporting boot is aligned to the same existing platform collision plane; no player hitbox, level geometry or physics position changes.
- Exact changed files: `src/animation.js`, `src/animation_v12.js`, `src/premium.js`, `index.html`, `package.json`, `tests/v143_visual_polish.cjs` (only to accept the new version label). New tests: `tests/v144_stride.cjs`, `tests/v144_visual_runtime.py`, `tests/v144_browser_preview.py`.
- Source assets: all 95 previous asset files from v14.3 remain SHA-256 byte-for-byte identical (including approved Ari art and Rootkeeper). The approved November 7 run-pose illustration is a visual reference only; it has NOT been substituted for the animated character or incorporated as a baked screenshot.
- The 100-level structure, ten worlds, all 4 learning subjects, five age groups, three languages and World 1 mechanics are preserved by source and regression checks. Existing local save keys and the curriculum are unchanged.

## Completed tests
- Clean v14.3 baseline run: 16/16 existing npm test scripts passed.
- v14.4 source: **17/17 npm test scripts passed**. Added 241 phase samples and alternate boot contact/air state tests; legacy v14.2.1 gait and v14.3 visual checks still pass.
- Actual local Chromium rendering (in-memory source/asset harness): ten World 1 locations rendered; 16 right-/left-facing phase captures; **0 page JavaScript errors**. NOT an HTTP-hosted browser pass.
- Browser sample: horizontal arrow-key movement 73.46 pixels; four subjects tested for incorrect feedback and correct rune increments 1→4; five ages × three languages = 15 question-generation combinations.
- Performance, headless Chromium 0.78-s samples: Level 1 44.8 FPS, L3 48.6, L5 49.9, L7 44.8, L9 47.4, L10 39.7. **Not physical device measurements.**
- Screenshots are real source-rendered Canvas captures, not AI images. The phase comparison samples hold a fixed pose and manually set gameplay state to inspect animation, rather than representing a normal uninterrupted playthrough.

## Pending verification
- Cloudflare Pages preview/staging deployment, HTTPS/MIME response checks, prior deployment ID and rollback procedure.
- Full uninterrupted manual 10-level completion, normal-speed continuous clips, and independent in-game animation acceptance.
- Desktop Edge; physical iPhone Safari and Android Chrome; real-device FPS, touch and save/reload; owner review.

## Release decision
**READY FOR OWNER REVIEW — LOCAL DEVELOPMENT ONLY.** No production release authorized.
