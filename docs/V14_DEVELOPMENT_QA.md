# v14 Development QA Report — 20 October 2026

## Classification

**Implemented developer build; NOT hosted; NOT approved for production.** The user authorized game development based on the supplied v13 archive. Existing staging and production were not modified.

**Input source:** `Learn-and-Leap-Adventure-v13-Level-Variety-Full-Project(1).zip`  
**Input SHA-256:** `46065fcaec829f53ec1da92e2e931944780949b8dceea68a535abcd8ab0ae3de`  
**Git revision:** None provided with this archive; use the digest above and the separately delivered v14 ZIP digest as immutable provenance.  
**Current deployment identifier / rollback:** Not available; no Cloudflare operations were performed.

## Unit and regression coverage

`npm test`: **PASS**. Eleven tests: full100, art integrity, Three/WebGL structure, renderer construction adapter, premium integrity, world1 v6 legacy integrity, v7 animation, v11 Rootkeeper, v12 motion, v13 diversity, v14 World 1.

- 100 unique original level definitions; 10 worlds; original curriculum, all four shrines in every level.
- 500 level × age combinations, 2,000 correct shrine answers, 50 boss fights, and 500 victory screens in the original automated model harness. These are simulated DOM/renderer checks, not real playthroughs.
- All five ages and three languages across four subjects checked by original generator test (18,000 case/attempt combinations).
- New v14 data/physics tests: mushroom bounce impulse; temple and lantern **physical** bridge activation, educational bridge reward; sinking platforms; player-carrying lift geometry; storm force and collapsible platforms; multi-phase boss progression; original 90 levels unaffected.
- No character image, animation atlas, curriculum.js, level data definitions, or assets overwritten.

## Browser observations (local, not hosted)

The sandbox Chromium security policy blocked all `http://localhost`, `file://` and public URL navigation (`ERR_BLOCKED_BY_ADMINISTRATOR`). To validate rendering and input, a Playwright harness instead loaded the **same** game scripts, preserved character assets via in-memory image data URIs, and ran them in a Chromium `about:blank` page. This is a real Chromium Canvas/gameplay execution but **not a normal HTTPS page-load test or hosted QA**.

- Renderer: native 1280×720 Canvas, original Ari rig and Rootkeeper v11 atlas. Ten individual gameplay canvas captures: `evidence/local-chromium/level-01.png` through `level-10.png`; contact sheet `v14-world1-runtime-comparison.jpg`.
- Keyboard right-arrow movement: visibly changed game position (approximately 59 px in a 340 ms key-down sample; actual value varies with scheduling).
- Four subjects: actual Chromium questions tested correct and incorrect branches, appropriate wrong-answer feedback, rune and magic key increments.
- Five age groups × three UI languages: 15 actual Chromium samples returned localized, age-dependent prompts.
- Ten levels: scripted Chromium game state visited each of the four shrines, accepted correct answers, registered all four runes and reached the win state; Level 10 had three real projectile hit updates with HP 3→2→1→0. This harness **teleported between points** to inspect game logic, so it does **not** demonstrate uninterrupted playable traversal.
- No JavaScript page errors in the tested in-memory harness.
- Asset count in the in-memory harness: 23/68 intentionally injected (only the images needed for captured World 1 artwork/characters); the complete normal `assets/` package is present locally. Normal HTTP asset loading has not been verified.

## World 1 locations and implementation

| Level | Local runtime screenshot | Distinct landmark | Player mechanic tested | Learning and completion |
|---|---|---|---|---|
| 01 | `evidence/local-chromium/level-01.png` | Forest entrance with giant root arch | Standard move/jump/coin baseline | Scripted shrine / win pass |
| 02 | `evidence/local-chromium/level-02.png` | Multicoloured giant mushroom towers | Bounce velocity impulse and boost on rune | Scripted shrine / win pass |
| 03 | `evidence/local-chromium/level-03.png` | Cascading falls, cliffs, crystal spires | New ravine pits, midair water-drift force | Scripted shrine / win pass |
| 04 | `evidence/local-chromium/level-04.png` | Elevated cabins, rope bridges | High/low branch collision route | Scripted shrine / win pass |
| 05 | `evidence/local-chromium/level-05.png` | Monumental temple and stone pillars | Lever toggles bridge collision + rune reward | Scripted shrine / win pass |
| 06 | `evidence/local-chromium/level-06.png` | Nighttime lantern canopy and fireflies | Lantern/rune reveals solid bridge | Scripted shrine / win pass |
| 07 | `evidence/local-chromium/level-07.png` | Cypress swamp, lily pools | Actual timed sinking ledges; rune protection | Scripted shrine / win pass |
| 08 | `evidence/local-chromium/level-08.png` | Root tunnel, underground geodes | Animated lift collision/rider movement | Scripted shrine / win pass |
| 09 | `evidence/local-chromium/level-09.png` | Lightning ridge / storm windmill | Wind acceleration and ledge collapse/reset | Scripted shrine / win pass |
| 10 | `evidence/local-chromium/level-10.png` | Ancient heart-tree and preserved Rootkeeper | Three hit phases and distinct boss telegraphs | Scripted shrine / boss / win pass |

## Outstanding QA and defects

- **NOT TESTED:** Hosted Cloudflare Preview HTTPS, proper MIME loading, browser navigation and network cache; staging identity; rollback deployment record.
- **NOT TESTED:** normal-speed manual uninterrupted traversal of 10 levels; 15–30 s real-time hosted gameplay recordings; progress-blocker testing under ordinary player movement.
- **NOT TESTED:** desktop Edge; physical iPhone Safari; physical Android Chrome; touch input on actual phones; mobile sustained FPS/battery; actual host saved progress after reload.
- **NOT VERIFIED:** ten levels' visual acceptance by the owner, full localization layout overflow on physical devices, framerate performance targets, enemy species suitability by independent QA.
- Optional `?renderer=three` is the archived comparison renderer and does not carry the v14 illustrated scene upgrade. Only default v14 illustrated mode is a v14 candidate.
- No production deployment or DNS change has occurred. The browser in-memory rendering results are not evidence of normal HTTPS asset delivery.

## Next release gate

Deploy this developer-completed ZIP to an **authorized preview only**, collect 10 full gameplay videos, manually traverse all 10 levels, perform cross-browser/cross-device and owner visual acceptance, then return a new verdict. The v14 project should not yet be labelled `READY FOR OWNER REVIEW` under the original strict hosted-QA release checklist.
