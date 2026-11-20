# Google Antigravity handoff — Learn & Leap Adventure v14.5

**Scope:** Deploy and independently verify only. v14.5 game development is packaged; do not regenerate Ari/Rootkeeper or rebuild the curriculum.

1. Extract `Learn-and-Leap-Adventure-v14.5-Independent-Ankle-Animation-Antigravity-Under20MB.zip` into a clean workspace.
2. Confirm `index.html`, `src/`, `assets/`, `tests/`, and `package.json` are all at the same project root. Record the ZIP SHA-256 and source file revisions.
3. Run `npm test` exactly as provided. Do not claim absent/manual/device tests passed.
4. Inspect `src/animation.js`, `src/animation_v12.js`, `src/premium.js` and `assets/animation/ari/{rear,front}-{shin,boot}-v145.png`.
5. Serve the root via the project's existing static deployment configuration (no mandatory compilation). `index.html` is the public entry point; keep `src/` and `assets/` at the public root. Use a local/static preview to inspect both run directions and all jump/land poses.
6. Confirm all 100 levels / ten worlds, four subjects, five age bands, three languages, save/progression, combat, environmental mechanics, characters and boss remain functional.
7. Verify ownership of the intended Cloudflare Pages Education Game staging project. Record previous deployment ID and rollback plan; deploy only to an authorized NEW preview/staging deployment first. Do not change production DNS or overwrite production.
8. In the **hosted running game**, record animations in right and left run cycles at normal speed (15–30 seconds), jump/land, gate/shrine interaction, and stage completion. Check feet for detached ankle seams, foot twisting, penetrating ground and sprite clipping.
9. Test Chrome + Edge on desktop; test iPhone Safari + Android Chrome on *physical* devices. Where unavailable, mark NOT TESTED. Record measured FPS and asset responses, and provide real screenshots and recordings for ten World 1 levels.
10. Publish a truthful report with staging URL, deployment ID, source SHA, regression/test outcomes, measured performance, screenshot/video paths, bugs and rollback. One verdict: BLOCKED—IMPLEMENTATION, BLOCKED—DEPLOYMENT, BLOCKED—FUNCTIONAL, BLOCKED—VISUAL, or READY FOR OWNER REVIEW.

**Production release is not authorized.**

Baseline rollback candidate: v14.4 original archive. SHA-256: 60a9ed87e1ae202403154411540d1d4d38bb60fbe06b9e5b26b48c21ccc2fbfa

This v14.5 update changes rendering only: gameplay physics, questions, saved-progress format, Worlds 2–10, and approved Rootkeeper artwork are not modified.
