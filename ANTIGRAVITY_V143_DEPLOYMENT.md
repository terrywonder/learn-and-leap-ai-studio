# Google Antigravity — v14.3 staging-only handoff

1. Upload and extract the complete v14.3 ZIP. Open its `Learn-and-Leap-Adventure-v14.3-Professional-Visual-Pass` folder as the project root.
2. Confirm source package identity and checksum in `docs/V143_BUILD_MANIFEST.json`; inspect `package.json`, `index.html`, `/src` and `/assets`.
3. Run `npm test` from the project root. This is a no-dependency static project; do not install or upgrade a game framework.
4. Read `V143_RELEASE_AND_VERIFICATION.md`, including local-only evidence limitations. Verify real gameplay in actual browser for every World 1 level and check all four learning shrines, ages and languages.
5. Check art loads (especially `assets/world1-v143/*`), HTTP 200 and correct JS/CSS/image MIME types. Test interactive Ari animation, moving enemies, platform collisions, stage-specific mechanics, rune rewards, checkpoints, saving and ten-level progression.
6. Authenticate to the intended Cloudflare account and verify the Pages project/hostname mapping. Capture previous deployment ID for rollback. Do not overwrite existing staging or production blindly.
7. Publish to a NEW authorized Cloudflare Pages preview/staging URL only. Static public root must contain `index.html`, `src/` and `assets/`. No production DNS or domain changes.
8. Browser QA on Chrome, Edge, iPhone Safari and Android Chrome where possible; if physical devices are unavailable, mark NOT TESTED rather than passed. Measure FPS rather than assuming 60.
9. Capture actual gameplay screenshots, 15–30s recordings, unique mechanic, education and victory evidence for each World 1 level. A static picture does not count as a game pass.
10. Owner reviews staging before any production action. READY FOR OWNER REVIEW is not production authorization.

**Restrictions:** preserve 100 levels, 10 worlds, original curriculum, save system, character sprite assets, Rootkeeper boss, and worlds 2–10. No silent game redesigns or account changes.
