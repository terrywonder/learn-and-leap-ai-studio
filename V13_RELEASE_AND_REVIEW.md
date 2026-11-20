# Learn & Leap Adventure v13 — Level Variety Pass

## Owner approvals retained
- Ari character illustration and v12 movement are preserved.
- Rootkeeper v11 appearance and v12 animation are preserved.
- Existing 100 level records, four educational subjects, five age bands, three languages, and browser-local progress are preserved.

## Changes implemented in actual game
1. **Enemy lineups change per level:** the first enemy in each of the ten stages of a world now draws from a different one of ten existing creature illustrations, and additional enemies have other level-seeded lineups. Five ground-patrol patterns vary their speed and movement within each level. **This is NOT 100 individually sculpted monster species**; the project contains ten existing illustrated enemy types and ten boss illustrations.
2. **World 1 scenes:** 10 stage-specific cinematic crops, palette treatments and atmosphere variants derived from approved existing art; these are local WebP assets in `assets/stage-forest/`. Stage weather includes mist, warm pollen, fireflies, rain, blossoms and magic motes. Other worlds retain their existing world illustration, with ten different overlay atmospheres per world.
3. **Four shrine answer interactions:** (a) rune choices, (b) compass choices, (c) reveal-and-answer stones, and (d) bridge-plank selection with native desktop drag/drop and tap/keyboard alternatives. All still use the source curriculum's authoritative question and correct-answer key. These are interaction variants, not 400 hand-written puzzle mechanics.
4. **Optional mini-missions:** coin collecting, defeating enemies, preserving health, flawless answering, and movement-speed target. Missions contribute to the third completion star, but do NOT block exit, alter four-key requirements, or restrict younger players from finishing the level. All mission text supports English, Chinese and Bahasa Melayu.
5. All v12 animation source, footage and optional Three.js comparison renderer retained.

## Not yet achieved
- 100 newly authored backgrounds / 100 unique monster illustrations.
- Unique authored puzzles for every level; the non-math content still uses the existing reusable bank and should be expanded with teacher review.
- AAA console-quality world scenery for every stage.
- Physical-device gameplay acceptance. Attempts to navigate to local HTTP and file URLs were blocked by the testing environment; an isolated graphical capture was also timed out. No final live browser or Safari approval is asserted.

## QA
`npm test` (offline, Node 22) includes `tests/v13_diversity.cjs` and the preserved 100-level gameplay suite. It validates world/stage profiles, 10 distinct first-enemy images per world, five missions, four shrine modes per level, translated instructions, level asset paths, 500 age/level completions, 2,000 shrine answers and 50 boss hits.

## Owner review tasks
1. Deploy the complete folder, which contains `index.html`, `src`, and `assets`, to a **public HTTPS staging** site.
2. Play World 1 Levels 1, 2, 3, 5, 6, 9 and 10. Compare enemy art, stage atmosphere, mini missions, and learning interfaces.
3. Verify tap, drag/drop, keyboard and on-screen controls, especially mobile `reveal` and `bridge` shrine modes.
4. Confirm that all 10 worlds and the complete 100-level structure remain accessible, and that browser-local progress persists.
5. Seek explicit owner approval of stage variety and gameplay depth before asking to produce 100 original world backgrounds or fully unique enemy models.
