# Learn & Leap Adventure v15.0 — Google AI Studio Workspace

Full 100-level trilingual 2.5D educational platformer integrated with **OpenAI.com.my (O.A.I. Malaysia)** (`https://www.openai.com.my/learn-and-leap/`) and ready for interactive development in **Google AI Studio Build Mode**.

## Highlights
- **100 Playable Levels across 10 Worlds:** World 1 authored locations (`src/world1_v14.js`, `src/world1_v14_art.js`) + Worlds 2–10 biome engines (`src/worlds_v15.js`, `src/worlds_v15_art.js`).
- **Trilingual MOE Curriculum:** 4 subjects (`math`, `english`, `science`, `general`), 5 age bands (`5-6`, `7-9`, `10-12`, `13-15`, `16+`), and 3 languages (`English`, `中文`, `Bahasa Melayu`) with 4 shrines per stage.
- **Approved Character & Boss Animation:** Articulated multi-layer Ari gait rig (`src/animation.js`, `src/animation_v12.js`) and Rootkeeper v11 deformation atlases (`src/rootkeeper_rig.js`).
- **Low-Spec Mobile 60 FPS Optimizer:** Auto-detects budget hardware, dynamically guards multi-pass blurs (`perfMode`), runs fixed-timestep physics sub-stepping (`src/game.js`), and offers a live Pause-menu quality toggle (`⚡ SMOOTH 60FPS` / `✦ HIGH QUALITY`).
- **OpenAI.com.my Portal Integration:** Connects with `public/shared/portal-sdk.js` (`v3.1.0`) and `/api/gemini` dev bridge (`server/gemini.mjs`).

---

## Opening in Google AI Studio

1. Open [Google AI Studio](https://aistudio.google.com) → **Build** → **Import from GitHub** and select **`terrywonder/learn-and-leap-ai-studio`**.
2. Google AI Studio installs dependencies (`npm install`) and launches live preview via `npm run dev` (`vite --port=3000 --host=0.0.0.0`).
3. If you add AI-powered hints or dynamic questions via `/api/gemini`, set `GEMINI_API_KEY` in AI Studio **Secrets** (server-side middleware relays automatically to `https://www.openai.com.my/api/gemini` when no local key is set).

## Local Development & Verification

```bash
# Install dev dependencies (Vite + @google/genai)
npm install

# Run all 20 automated test suites (curriculum, gait rig, levels, rendering integrity)
npm test

# Start live local dev server on port 3000
npm run dev

# Build production static bundle into dist/
npm run build
```

## Syncing Updates Back to `openai.com.my`

When ready to publish updates to `https://www.openai.com.my/learn-and-leap/`:
1. Run `npm test` to confirm all **20 / 20** automated suites pass.
2. Sync updated `index.html`, `src/`, `assets/`, `docs/`, and `tests/` into the `learn-and-leap/` subdirectory of `terrywonder/openai.com.my` (never overwrite the root portal homepage!).
