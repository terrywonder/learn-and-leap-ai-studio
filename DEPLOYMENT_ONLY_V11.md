# Learn & Leap Adventure v11 — Antigravity deployment-only release brief

**Scope:** Staging deployment of the exact supplied v11 source. **Do not redesign, regenerate artwork, change gameplay logic, rewrite the curriculum, or overwrite production without approval.**

1. Extract the entire `Learn-and-Leap-World1-v11` folder. Open that project folder, which directly contains `index.html`, `src/`, and `assets/`.
2. Run `npm test` as source validation. **There is no build command.** The default illustrated 2.5D game is static, self-contained, and does not need a CDN. The optional `?renderer=three` comparison mode still needs internet for Three.js.
3. Publish the project root as a public **HTTPS staging** website. Configure default document `index.html`; serve JavaScript modules as JS and WebP/PNG assets with valid MIME types. Preserve folder paths and case.
4. In the deployed v11 site, visit `/ANIMATION_REVIEW.html` to review Rootkeeper's animated artwork, speed and poses. Do not claim it demonstrates real gameplay; it is a focused motion review.
5. In the **actual game**, open World 1 Level 10 and verify: Rootkeeper height visually about **1.7–2.0× Ari**, feet level with the fighting surface, 4 learning shrines, attack timing, hit reactions, rune keys, magic, victory and saved progress.
6. Check Level 1 movement, education gates, and controls at desktop and mobile widths. Test iPhone Safari on a real device if available; report if not.
7. Keep Worlds 2–10 visually unchanged. Keep all 100 levels and the five age bands / three languages intact.
8. Give the owner: staging URL, revision/checksum, test results, actual gameplay screenshots/video, browser/device matrix, observed defects and recommendation. Wait for owner visual approval before production release or expanding to other guardians.

### Release limitations

- v11 uses **single-skin bone-deformed 2D animation baked into WebP atlases**. It avoids v10's visibly crude mechanical pieces and the old 345px boss scale; it is **not** a commissioned professional 3D rig or AAA production asset.
- The v11 preview is a local Canvas comparison render. Browser navigation to a hosted URL is blocked in the current authoring environment; full end-to-end gameplay, performance and real-iPhone QA are pending.
- Keep `build_rootkeeper_v11.py` for repeatable atlas generation. Original exported atlases are provided, so Python is not needed for deployment.
