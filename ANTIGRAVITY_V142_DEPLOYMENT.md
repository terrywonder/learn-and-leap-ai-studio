# Antigravity instructions — Learn & Leap v14.2

Extract the provided ZIP. Enter the directory with `index.html` and `package.json`. Run `npm test` and retain its output. Serve as a static website; no bundling and no build command are required. Use the project root as the Cloudflare Pages output directory.

Verify authorized Cloudflare account and intended Education Game staging project. Record the currently working deployment ID first. Publish only as a NEW preview or approved staging release. Do not overwrite production or DNS. Verify `assets/world1-v142/crystal-waterfall-scenery.webp` returns HTTP 200 and displays on Level 3 in the DEFAULT renderer, not `?renderer=three`.

Check: Levels 1–10 all different, level 3 waterfall parallax, actual movable player with two correctly attached boots, gate DISCOVER plaque, readable educational shrine labels, correct/wrong quiz and rewards, coin/checkpoints, Level 10 boss, save/reload, and Worlds 2–10 unchanged. Check all 100 levels, 4 subjects, 5 age bands, 3 languages. Capture actual hosted runtime screenshots, 15–30 second clips, actual FPS and browser console logs. Test desktop Chrome/Edge and physical iPhone Safari/Android Chrome (mark untested if unavailable).

Do not treat local in-memory screenshot harness as proof of deployment or mobile QA. Request explicit owner approval before production release. See V142_DEVELOPMENT_QA_AND_RELEASE.md.
