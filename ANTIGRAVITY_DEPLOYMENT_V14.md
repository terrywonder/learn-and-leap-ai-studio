# Antigravity — v14 Developer Handoff / Staging QA

You are receiving the **implemented** v14 project from a source-supplied v13 baseline. **This is not a deployment authorization to production.**

## Strict order

1. Confirm files and archive digest against the separately supplied `.sha256` digest.
2. Run `npm test`; retain logs.
3. Confirm the authorized Cloudflare Pages staging project; record current deployment for rollback.
4. Publish the static site directory to a **new authorized preview** and verify HTTPS; no login wall.
5. Inspect the DEFAULT illustrated 2.5D renderer (no `?renderer=three`). The optional Three comparison path is not a v14 visual reference.
6. Capture actual hosted 1280×720 gameplay of each World 1 level, including a 15–30 s normal-speed clip, scene-specific mechanism, shrine response, coins, character motion, enemy behavior, checkpoint and final gate.
7. Run five-age / three-language / four-subject QA and both correct/wrong response recovery. Test on desktop Chrome, desktop Edge, real iPhone Safari, and real Android Chrome. Do not claim real-device success from emulators or desktop viewports.
8. Inspect unchanged Worlds 2–10, 100 levels, saves/reload, no errors/404s. Update the tracker accurately.
9. Return the detailed release report and explicit verdict. Do not promote until OWNER APPROVES.

**Known non-release evidence**: `evidence/local-chromium/` contains screenshots from a Chromium in-memory runtime harness, not from a hosted Cloudflare deployment. They are valid local developmental render observations only; they do not fulfil the required hosted evidence or videos.
