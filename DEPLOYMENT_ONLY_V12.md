# Learn & Leap v12 — Deployment-Only Brief

**Scope:** Ari & Rootkeeper animation polish on the approved v11 art. Existing complete 100-level learning game remains unchanged. This package is a staging review candidate.

1. Extract the `Learn-and-Leap-World1-v12` folder and open it as the project root.
2. Run `npm test`. No build step is required for the default 2D illustrated renderer. `src/animation_v12.js` is a new runtime ES module imported by `src/premium.js`; upload it alongside all other `src/` files.
3. Deploy the entire folder publicly to your authorized **HTTPS staging** website. The web root must contain `index.html`, `src/`, and `assets/`. Use a static host; do not require ChatGPT login.
4. Keep the default illustrated renderer. The optional `?renderer=three` legacy comparison is not the v12 animation implementation and needs the Three.js CDN.
5. Open `ANIMATION_REVIEW_V12.html` on staging. Review Ari idle/run/jump/fall/land/cast and Rootkeeper idle/attack/hit/defeat at both 1× and 0.5×, particularly transitions, ground contact and visible joints.
6. **Actual game QA:** Play Level 1 and Level 10 on desktop. Check interactions with four learning shrines, rune keys, magic attacks, boss damage, boss death and saved progress. Check graphics at mobile widths and on iPhone Safari if you have a device. Do not call a mocked renderer test real-device QA.
7. Before production, provide the staging URL, screenshots and a short recording of normal-speed Ari movement alongside Rootkeeper's full attack and recovery, plus browser console errors and FPS/memory findings. Await owner approval.
8. **Do not** alter the approved character designs, 100 levels, subjects, five age bands, three languages, progress storage, world layout or other bosses. Do not expand animation to Worlds 2–10 yet.

## QA boundaries
- `npm test`: unit/integration simulation and static resource validation.
- `tests/v12_visual_capture.py`: Chromium Canvas rendering in an isolated in-memory page; no deployed-navigation or device validation. Requires Python Playwright and Pillow.
- Host-specific and mobile browser end-to-end QA remain to be performed. This is polish on 2D illustrated animation, not a commissioned 3D motion-capture/skeletal model.
