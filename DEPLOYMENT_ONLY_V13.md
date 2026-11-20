# Google Antigravity — Learn & Leap v13 staging deploy

Treat this folder as the existing, fully sourced game. Your assignment is deployment and hosted QA, NOT redesign or game-content generation.

1. Read `V13_RELEASE_AND_REVIEW.md` and `README.md`. The owner has approved Ari and Rootkeeper's appearance and v12 animation. Preserve them and their sprite atlases.
2. Preserve the existing staging deploy and record the rollback deployment/revision. Do not overwrite unrelated production sites.
3. Run `npm test`, record output, and use **no build command** for the default static illustrated renderer.
4. Publish project root with `index.html`, `src/`, and all `assets/` (particularly `assets/stage-forest/01.webp` through `10.webp`) to the owner's authorized Cloudflare Pages staging project. Verify the target account/project before changing it.
5. Serve as public HTTPS, no login. Confirm the new `src/diversity_v13.js` loads before `src/main.js` and verify the default renderer does not switch to the optional `?renderer=three` mode.
6. Open the hosted URL. Compare World 1 Levels 1–10: moods, creatures, five bonus-mission types, and four live shrine interactions. Check all three language modes and age bands.
7. Check the game still saves 100 levels, stage progression, Ari movement, Rootkeeper Level 10 and the four-subject shrine rules. Examine browser console/network errors.
8. Verify iPhone Safari and Android Chrome on actual devices if available; if unavailable, report `NOT TESTED` rather than claiming a pass.
9. Provide URL, build revision, screenshots from live gameplay (NOT concept art), actual QA results, outstanding issues and recommendation `READY FOR OWNER REVIEW` or `BLOCKED`.

No production promotion until owner approval of level variety, challenge interaction quality and performance.
