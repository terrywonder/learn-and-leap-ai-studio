# Google Antigravity — Learn & Leap Adventure v15.0 Staging Deployment Only

You have the source for 100 levels and 10 worlds. This is a complete runnable local development candidate, not a production-approved release.

1. **Extract the ZIP first**. The website root is the directory containing `index.html`, `src/`, and `assets/`. Do NOT host its parent folder as the website root.
2. Read `README.md`, `docs/V15_DEVELOPMENT_AND_QA.md`, `docs/V15_100_LEVEL_RELEASE_MATRIX.csv`. Confirm the source has `src/worlds_v15.js` and `src/worlds_v15_art.js`.
3. Run `npm test` (Node.js 18+). No `npm install`, npm build or external backend is required for the default Canvas game. Start a static local server such as `python -m http.server 8765` from the extracted website root.
4. Verify all 100 levels and all ten world level selections. Test real movement, jumping, educational questions, wrong-answer recovery, four rune rewards, checkpoints, enemies, boss battles, completion and reload/save. Verify three languages and five age groups. The 90 world-2–10 scenes should have actual biome effects, not just names or recolours.
5. **Cloudflare permissions:** inspect the authenticated account and intended Education Game Pages project. Existing reference `https://v6-world1-staging.titan-academy.pages.dev/` is NOT permission to overwrite it. Save an existing deployment ID before deployment. Do not change production DNS.
6. Deploy a **new authorized preview/staging deployment** via Cloudflare Pages. This project is static, build command: NONE; output directory: the `index.html` root. Test HTTPS and verify JS ES module MIME types and all `assets/` paths.
7. Capture real hosted screenshots of all ten worlds and all 100-level startup checks, plus normal-speed gameplay clips, educational interactions and completions. Compare UI-hidden scenery, platform collisions and Ari leg/boot animation. Test Chrome/Edge, physical iPhone Safari and Android Chrome. Record actual FPS and failures, not targets.
8. Fill an evidence-backed release report. Possible result: `BLOCKED — DEPLOYMENT`, `BLOCKED — FUNCTIONAL`, `BLOCKED — VISUAL`, `READY FOR OWNER REVIEW`. Owner review does not authorize production release.
9. Do not rebuild Ari/Rootkeeper artwork, remove curriculum or migrate save keys. Only propose source changes with precise diff and approval before modifications.

No production deployment without **explicit separate owner approval**.
