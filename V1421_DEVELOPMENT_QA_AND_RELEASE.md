# Learn & Leap Adventure v14.2.1 — Development and QA handoff

**Candidate, NOT production approved.** Baseline: `Learn-and-Leap-Adventure-v14.2-Waterfall-Approved-Antigravity-Under20MB.zip`.

### Why the existing leg layout appeared wrong

Ari's approved front- and rear-leg PNG layers have hip pivots at `(187,141)` and `(147,145)` in 285×235 source-pixel coordinates. The original animation applies a sharply splayed idle stance, with a large, oppositely driven run rotation on each layer. This creates inconsistent boot placement at a fixed ground collision plane, especially in transitional frames; the art itself was previously repaired in v14.1/14.1.1 and has not been replaced here.

### Implementation (render/pose-only)

- `src/animation.js`: smaller natural neutral angles, coordinated but independently articulated strides, less abrupt air/landing angles.
- `src/premium.js`: render-only planted-boot offset computed from the source artwork's hip and sole landmarks, bounded to ±7 screen pixels on grounded motion. Tightened maximum painted-part rotation. No modification to `player.y`, collision bodies, movement speed, combat or game physics.
- `index.html`: correct current version label.
- `tests/v1421_ari_gait.cjs`: 121-step gait sampling, idle/run/jump/fall checks, two-leg articulation/anchors, five attributes including unchanged 100-level database.
- `tests/v1421_capture_ari.py`: optional Chromium movement-state screenshot harness; it loads actual game source and assets into a local browser page. It is **not** hosted browser evidence.

### Evidence and automated testing

- `npm test`: **15/15 test scripts passed** after changes (see `v1421-npm-test.log` in optional evidence ZIP). Includes 100-level, curriculum, animation, visuals-integration structural and gait tests.
- Local Chromium used the real canvas renderer in a `about:blank` page with actual project code/assets loaded as in-memory data URIs; Level 3 was entered and keyboard movement, jumping and casting were exercised; **0 page JS errors observed** in that run.
- See evidence JPGs for local renderer captures of the updated leg pose; the before/after is not frame-time-aligned and should not be interpreted as a measured animation test.
- **Not verified**: uninterrupted manual playthrough of all ten World 1 levels with v14.2.1, production hosting, real Cloudflare Pages staging, native Edge and physical iPhone/Android devices. Actual FPS has not been measured for this release.
- No owner approval yet. Staging only; provide player-visible animations for owner signoff.

### Regressions and rollback

All user-approved PNG art, Rootkeeper sprites/atlases, waterfall background, World 1 terrain, 100 levels, five age groups, three interface languages, save logic and Worlds 2–10 are unchanged in the source archive relative to v14.2. Undo the v14.2.1 pose changes by deploying the previous verified v14.2 archive or its existing Cloudflare deployment; obtain deployment ID before uploading candidate.
