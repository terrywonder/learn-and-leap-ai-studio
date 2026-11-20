# Learn & Leap Adventure v14.3 — Professional Visual Pass

**Build type:** Owner review candidate, complete playable source project. **Not deployed; not production approved.**

## Baseline and scope
- Previous source archive: `Learn-and-Leap-Adventure-v14.2.1-Ari-Gait-Polish-Antigravity-Under20MB.zip`
- Previous archive SHA-256: `a4469e5dbe48072ff91878e01a1dd07d5519c272543b077809d19631186c4a1b`
- New source: archive-derived; no git revision is claimed.
- All 100 levels, Worlds 1–10, four subjects, five age groups, three languages, Ari and Rootkeeper sprites/rigs, saves, game physics and progression retained.
- Graphics changes are scoped to the default World 1 Canvas renderer; Worlds 2–10 and the optional Three.js renderer were not redesigned.

## Implemented visual changes
- Ten World 1 biome-aware, stone/moss material atlases used by **live platform drawing** at the existing collision geometry.
- World 1 Level 3 cinematic waterfall scenic plate, derived from an existing scenery-only image (not a baked screenshot containing Ari, HUD, coins or shrines).
- Improved warm highlights, edge/shadow treatment, soft water reflections, and gold-rimmed high-contrast HUD and gate plaque.
- Approved v14.2.1 Ari gait code, repaired boots, and Rootkeeper sprites retained unchanged.
- Unique World 1 scene backgrounds, mechanisms and landmark drawing preserved for all ten levels. No ten-scene recolour substitution.

## Source artwork provenance
The owner-approved November 7 visual was a composed image containing UI, character and interactive objects. Only a **narrow stone-and-moss ground sample** was derived from its background-free lower terrain band to make reusable material textures. It is **not used as runtime proof**, and it was not pasted into the scene as a full background. The cinematic waterfall scenery is graded from the earlier scenery-only asset. Approved artwork in the actual game remains separately animated.

## Changed or added source files
Existing modified: src/premium.js, src/world1_terrain_v141.js, src/style.css, index.html, package.json.
Added: assets/world1-v143/cave-stone-moss.webp, assets/world1-v143/firefly-stone-moss.webp, assets/world1-v143/forest-stone-moss.webp, assets/world1-v143/mistwalk-cinematic-scenery.webp, assets/world1-v143/mushroom-stone-moss.webp, assets/world1-v143/sacred-stone-moss.webp, assets/world1-v143/storm-stone-moss.webp, assets/world1-v143/swamp-stone-moss.webp, assets/world1-v143/temple-stone-moss.webp, assets/world1-v143/timber-stone-moss.webp, assets/world1-v143/waterfall-stone-moss.webp, tests/v143_browser_preview.py, tests/v143_visual_polish.cjs.
Preservation audit: identical SHA-256 bytes for game logic, levels, curriculum, World 1 mechanisms, hero images and Rootkeeper animation (11 files sampled).

## QA — completed locally
- `npm test`: **16/16 scripts pass** from v14.3 source.
- 100 level structures, four shrine subjects, five age groups and three languages: automated checks pass.
- Chromium local **in-memory actual game renderer**: ten World 1 scenes captured, no JavaScript page errors.
- Real Chromium keyboard movement: 74.27px observed in local script interval.
- Four educational subjects: incorrect-answer feedback displayed; correct answer increased rune count 1→4.
- Five age groups × three languages: 15 question-generation samples.
- Sampled headless Chromium FPS (levels 1/3/5/7/9/10): **43.5 / 46.0 / 47.3 / 44.7 / 47.3 / 37.2**. These are not physical-device measurements.
- Browser navigation to 127.0.0.1 was blocked by administrator, so the in-memory renderer harness used real game source and PNG/WebP bytes. **HTTP-served browser QA remains unverified.**

## Pending / NOT TESTED
- Cloudflare Pages account/project authorization, deployment identifier, HTTPS URL, previous deployment rollback identifier.
- Full uninterrupted manual ten-level playthroughs and 15–30-second recordings.
- Desktop Edge, physical iPhone Safari, physical Android Chrome, accessibility/manual localization review, hosted frame rates, reliable cross-device performance.
- Owner's final art approval for all ten scenes. Current graphics are a visual polish, **not a claim that all Worlds 2–10 received bespoke art upgrades**.

## Release verdict
**READY FOR OWNER REVIEW — LOCAL DEVELOPMENT CANDIDATE ONLY.** Not approved for production deployment. Antigravity should run tests and deploy only to a new authorized preview/staging URL after preserving rollback ID.
