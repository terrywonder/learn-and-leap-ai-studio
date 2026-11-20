# Google AI Studio & Antigravity Workspace Rules (`.idx/airules.md`)

This repository is the **Google AI Studio Build Mode workspace** for **Learn & Leap Adventure v15.0 (Full 100-Level World Variety Adventure)**, published live at `https://www.openai.com.my/learn-and-leap/`.

## 1. Preserve Entry Points, Approved Artwork & Test Contracts

- **Root Entry (`index.html`)**: Loads `../shared/portal-sdk.js?v=3.1.0` (served from `public/shared/portal-sdk.js` in standalone Vite preview), classic engine scripts (`src/diversity_v13.js`, `src/world1_v14.js`, `src/worlds_v15.js`, `src/curriculum.js`, `src/levels.js`), and `<script type="module" src="src/main.js"></script>`. Keep `<meta name="openai-portal-game" content="learn-and-leap">` and `v15.0 FULL ADVENTURE`.
- **Vite Config (`vite.config.ts`)**: Keep `base: './'`, `assetsDir: '_bundle'`, `DISABLE_HMR` handling, `learnAndLeapRuntimeAssetsPlugin()`, and the `/api/gemini` server middleware intact so live preview works cleanly on port `3000` inside Google AI Studio AND `npm run build` produces a self-contained `dist/` bundle.
- **Core Game Modules (`src/`)**:
  - `src/premium.js`: Default 2.5D illustrated Canvas renderer (`PainterWorld`), articulated Ari rig + Rootkeeper v11 atlases, `c.strokeText('DISCOVER',x,y-40)` gate contract, and adaptive 60 FPS `perfMode` optimizer for low-spec mobile/tablets.
  - `src/animation.js`, `src/animation_v12.js`, `src/rootkeeper_rig.js`: Approved gait cycle (`back-leg-v141.png`, `rear-boot-forward-v146.png`, `body-v1411-clean.png`, `front-arm-v1411-clean.png`) and boss state machine. Do **not** alter sprite files in `assets/animation/` or `assets/world1-*` unless explicitly intended.
  - `src/levels.js`, `src/world1_v14.js`, `src/worlds_v15.js`, `src/worlds_v15_art.js`: All 100 playable levels across 10 distinct fantasy worlds (4 shrines per stage, boss stages every 10th level).
  - `src/curriculum.js`: Trilingual (`en`, `zh`, `ms`) MOE KSSR/KSSM/SPM curriculum across 5 age bands (`5-6`, `7-9`, `10-12`, `13-15`, `16+`) and 4 subjects (`math`, `english`, `science`, `general`).
  - `src/game.js`: Fixed-timestep sub-stepping physics loop (`Math.min(rem, 0.02)`), touch pointer capture, pause menu `âš¡ SMOOTH 60FPS` / `âœ¦ HIGH QUALITY` toggle, and local progression storage (`learn-leap-v2-full`).
  - `src/scene3d.js`: Legacy `?renderer=three` Three.js WebGL comparison renderer.

## 2. Verification & Secret Safety

- Always preserve `"version": "15.0.0-development"` (required by `tests/v143_visual_polish.cjs`) and run `npm test` (20/20 test suites) after modifying game code.
- **Never** hardcode `GEMINI_API_KEY` or put it in any `VITE_*` client variable. Route Gemini requests through `/api/gemini` (`window.OpenAIPortal?.askGemini(...)`), handled securely by `vite.config.ts` in AI Studio or Cloudflare Pages `functions/api/gemini.js` in production.

## 3. Deploying Back to OpenAI.com.my

After enhancing the game in Google AI Studio:
```bash
npm test && npm run build
```
Then copy the updated `index.html`, `src/` (`animation*`, `curriculum.js`, `diversity_v13.js`, `game.js`, `levels.js`, `main.js`, `premium.js`, `rootkeeper_rig.js`, `scene3d.js`, `style.css`, `world1_*`, `worlds_v15*`, `vendor/`), and `assets/` back into `learn-and-leap/` inside `terrywonder/openai.com.my` (taking care never to overwrite the root `index.html` of the portal).
