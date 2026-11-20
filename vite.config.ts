import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import * as geminiFn from './server/gemini.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROD_GEMINI_URL = 'https://www.openai.com.my/api/gemini';

function geminiDevBridgePlugin() {
  const attach = (middlewares: any) => {
    middlewares.use('/favicon.ico', (_req: any, res: any) => {
      res.statusCode = 204;
      res.end();
    });

    middlewares.use('/api/telemetry', (req: any, res: any) => {
      res.statusCode = req.method === 'OPTIONS' ? 204 : 200;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      if (req.method === 'OPTIONS') {
        res.end();
        return;
      }
      res.end(JSON.stringify({ ok: true, local: true, onlineTotal: 1, byGame: { 'learn-and-leap': 1 } }));
    });

    middlewares.use('/api/gemini', async (req: any, res: any) => {
      try {
        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(chunk);
        const rawBody = Buffer.concat(chunks).toString('utf8');
        const method = req.method || 'GET';

        if (method === 'OPTIONS') {
          const optRes = await geminiFn.onRequestOptions();
          res.statusCode = optRes.status;
          optRes.headers.forEach((v: string, k: string) => res.setHeader(k, v));
          res.end();
          return;
        }

        // Prefer AI Studio Secrets key when configured; otherwise relay cleanly to OpenAI.com.my edge proxy
        if (process.env.GEMINI_API_KEY) {
          const webReq = new Request('http://localhost/api/gemini', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: method === 'POST' ? rawBody : undefined
          });
          const env = { GEMINI_API_KEY: process.env.GEMINI_API_KEY, GEMINI_MODEL: process.env.GEMINI_MODEL };
          const webRes = method === 'POST'
            ? await geminiFn.onRequestPost({ env, request: webReq })
            : await geminiFn.onRequestGet({ env });
          const text = await webRes.text();
          res.statusCode = webRes.status;
          webRes.headers.forEach((v: string, k: string) => res.setHeader(k, v));
          res.end(text);
          return;
        }

        const upstream = await fetch(PROD_GEMINI_URL, {
          method,
          headers: method === 'POST' ? { 'Content-Type': 'application/json' } : undefined,
          body: method === 'POST' ? rawBody : undefined
        });
        const text = await upstream.text();
        res.statusCode = upstream.status;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(text);
      } catch (err: any) {
        res.statusCode = 502;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify({ ok: false, error: err?.message || 'Gemini bridge error' }));
      }
    });
  };

  return {
    name: 'openai-my-gemini-bridge',
    configureServer(server: any) {
      attach(server.middlewares);
    },
    configurePreviewServer(server: any) {
      attach(server.middlewares);
    }
  };
}

function copyDirRecursive(srcDir: string, destDir: string) {
  if (!fs.existsSync(srcDir)) return;
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Preserves Learn & Leap's runtime-loaded sprites (`assets/`) and classic non-module
 * engine scripts (`src/curriculum.js`, `src/levels.js`, etc.) inside `dist/` during `vite build`.
 */
function learnAndLeapRuntimeAssetsPlugin() {
  const classicScripts = [
    'src/diversity_v13.js',
    'src/world1_v14.js',
    'src/worlds_v15.js',
    'src/curriculum.js',
    'src/levels.js'
  ];

  return {
    name: 'learn-and-leap-runtime-assets',
    writeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      copyDirRecursive(path.resolve(__dirname, 'assets'), path.join(distDir, 'assets'));
      fs.mkdirSync(path.join(distDir, 'src'), { recursive: true });
      for (const rel of classicScripts) {
        const srcFile = path.resolve(__dirname, rel);
        if (fs.existsSync(srcFile)) {
          fs.copyFileSync(srcFile, path.join(distDir, rel));
        }
      }
    }
  };
}

export default defineConfig({
  base: './',
  plugins: [geminiDevBridgePlugin(), learnAndLeapRuntimeAssetsPlugin()],
  build: {
    target: 'esnext',
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: '_bundle'
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {}
  },
  preview: {
    port: 3000,
    host: '0.0.0.0'
  }
});
