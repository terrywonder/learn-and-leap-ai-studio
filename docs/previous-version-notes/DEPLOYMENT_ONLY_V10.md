# Google Antigravity — Deployment only: Learn & Leap v10

You are deploying **the existing complete Learn & Leap Adventure v10 project**. The game, World 1 environment art, Rootkeeper organic skeletal skin, 100 levels, 4 subjects, 5 age groups and 3 languages are implemented in the supplied files. **Do not regenerate/redesign/rewrite the game or swap out assets.**

1. Read `V10_RELEASE_AND_VISUAL_ACCEPTANCE.md` and run `npm test`. If it fails, stop and report the exact error before altering any gameplay source.
2. Publish the project root containing `index.html`, `src/`, and `assets/` on an HTTPS staging URL. It is a static project; the default renderer requires no bundling or backend.
3. Make the staging URL public without a ChatGPT sign-in requirement. Do not touch unrelated websites or DNS without authorization.
4. Verify the page, local image assets, scripts and character rig load with zero HTTP or JavaScript errors. Confirm the default illustrated renderer, **not** `?renderer=three`, is selected.
5. Open `/ANIMATION_REVIEW.html` in a browser. Check normal, slow and frame-by-frame idle, stalk, attack, hurt and defeat states. Toggle bones to verify 17 joints and view natural limb motion without gaps.
6. Play World 1 Level 10: jumping, entering shrines, answering questions, rune rewards, Rootkeeper battle, attacks, hit and victory. Verify animations line up with collision timing.
7. Test desktop Chrome/Edge and real iPhone Safari/Android Chrome where available. Do not claim unperformed physical-device checks passed.
8. Return staging URL, test output, actual-game screenshots/video, issues, performance notes and an explicit `READY FOR OWNER VISUAL REVIEW` or `BLOCKED` status. **Do not promote to production without owner approval.**
