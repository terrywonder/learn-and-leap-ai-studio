# Google Antigravity — v14.6 deployment and independent QA

1. Extract this ZIP. The folder containing `index.html` is the static public root. Read `README.md` and `V146_DEVELOPMENT_QA.md`.
2. Record exact ZIP SHA-256, v14.5 baseline digest and changed files. Run `npm test` (19 chained Node scripts). Tests must pass; do not ignore failures.
3. Verify the default illustrated Canvas renderer (not legacy optional `?renderer=three`). Check the new `animation/ari/rear-boot-forward-v146.png` loads, and run actual gameplay with Ari facing BOTH directions.
4. Inspect the four phases of a full running cycle at normal speed and slow motion. Watch heel/toe contact in the supporting leg, rear ankle orientation, boot attachment, foot sliding, idle-run-jump-land transitions, and sprite clipping. Compare with the approved *design reference* in `docs/ARI_RUN_FINAL_APPROVED_REFERENCE.png`; never use that illustration as gameplay evidence.
5. Verify all 100 level IDs and World 1's 10 differentiated locations and mechanics, four subjects, five ages, three languages, rune rewards, coins, checkpoints and local saves.
6. Verify the authorized Cloudflare account and staging project; record the previous working deployment ID. Publish only to a NEW preview. **No production deployment or DNS modification.**
7. Capture actual HTTPS-hosted screenshots/recordings, browser console/network logs and manual progression results for 10 World 1 levels. Test desktop Chrome and Edge and real iPhone Safari and Android Chrome where available; report NOT TESTED when unavailable. Measure FPS under actual device conditions.
8. Update production tracker with evidence, source digest and all unresolved issues; report one release verdict. READY FOR OWNER REVIEW does NOT authorize production.

Build command: **none (static HTML/CSS/ES modules)**. Public directory: extracted folder with `index.html`, `src/`, and `assets/`.

Rollback: use the previous Cloudflare Pages deployment ID captured before publishing and restore/roll back that deployment through the authorized Pages project, not by changing DNS.

No runtime external service, analytics or subscription required by this new gait patch.
