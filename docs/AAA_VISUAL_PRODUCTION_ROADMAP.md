# What remains to achieve a real AAA-inspired visual standard

**Status:** this archive is a **cinematic 2D visual-upgrade pass**. The user's quality target remains higher than the current renderer can reach.

## Why a 2D art swap is not enough
The previous game used circles, polygons and gradients to draw characters, bosses and worlds. This pass upgrades those with higher-detail original bitmap illustrations and illustrated terrain. Real AAA-quality graphics require coordinated art and technology, not just higher-resolution backgrounds.

## Recommended production pipeline
1. **Art direction approval** — approve one unique hero, enemy family and a full game-level screenshot for World 1, with consistent lighting, size, colour and age suitability. Stop the asset-production pipeline until quality is accepted.
2. **Hero production** — character turnaround, proper 2D sprite animation rig or full 3D model with idle, run, jump, land, cast, hurt and victory animations. Current image is one illustrated pose, not a skeletal rig.
3. **World production** — build ten distinct themed tile/mesh sets, far/mid/near parallax layers, materials, props, weather, particles and cinematic lighting. Current worlds reuse a reference scene texture combined with hand-authored matte plates; they are not 10 individually commissioned 3D worlds.
4. **Enemies & bosses** — create ten bespoke boss rigs, animation states, attack telegraphs, VFX, sound and stage-specific behaviours. Current illustrated sprites are pose-based stand-ins.
5. **Renderer** — for browser deployment, move rendering to a performant WebGL pipeline (e.g. Three.js or a WebGL 2D framework) with proper scene depth, shading, batching and asset streaming. For true AAA 3D targets, plan Unreal or Unity with a separate deployment strategy; static browser hosting may then be unsuitable.
6. **Level polish** — map each of the 100 authored stages to curated cinematic beats, environmental storytelling, carefully arranged hazards and unique visual puzzles rather than repeating procedural layouts.
7. **Accessibility & localization** — readability, age selection, low motion/performance settings, 3 languages and touch-safe UI must be tested at final render scale.
8. **QA & release** — device coverage (iPhone Safari, Android Chrome, desktop), 30/60 fps budgets, load time, sound, screenshots, quiz answer accuracy, boss phases, collisions and save migration. Use recorded device video, not just JS unit tests.

## Current verified scope
- 100 level logical simulation and 18,000 age/subject/language question cases: passes.
- Static JavaScript parsing, all art files present and decodable: passes.
- Real browser graphic performance and cross-device visual acceptance: **not yet verified**.
