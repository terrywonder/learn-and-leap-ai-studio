/**
 * Learn & Leap AAA Visual Effects, Volumetric Lighting & Cinematic World Overlay Engine.
 * Uses pre-baked radial glow sprites (zero per-frame shadowBlur / filter stalls) so
 * every world looks rich, luminous, and atmospheric at locked 60 FPS on desktop, mobile & headless.
 */

const WIDTH = 1280;
const HEIGHT = 720;
const TAU = Math.PI * 2;

const WORLD_ATMOSPHERE = [
  { ray: '#fff4c4', rayAlpha: 0.13, aura: 'gold', creature: 'butterfly', accent: '#a8f7c4', dusk: '#082422', bossName: 'Rootkeeper' },
  { ray: '#d8beff', rayAlpha: 0.14, aura: 'violet', creature: 'crystalMote', accent: '#d8b4fe', dusk: '#140c36', bossName: 'Prism Wyrm' },
  { ray: '#fff7d6', rayAlpha: 0.15, aura: 'gold', creature: 'bird', accent: '#9be7ff', dusk: '#12385e', bossName: 'Cloud Seraph' },
  { ray: '#ffb66b', rayAlpha: 0.16, aura: 'ember', creature: 'ember', accent: '#ff9642', dusk: '#290c14', bossName: 'Magma Colossus' },
  { ray: '#dff9ff', rayAlpha: 0.13, aura: 'cyan', creature: 'snow', accent: '#a5f3fc', dusk: '#0e283b', bossName: 'Glacier Warden' },
  { ray: '#8cf7ee', rayAlpha: 0.15, aura: 'cyan', creature: 'bubble', accent: '#5eead4', dusk: '#042636', bossName: 'Tide Leviathan' },
  { ray: '#ffdfa0', rayAlpha: 0.14, aura: 'gold', creature: 'spark', accent: '#fcd34d', dusk: '#1e192e', bossName: 'Gear Titan' },
  { ray: '#b8f7cb', rayAlpha: 0.13, aura: 'emerald', creature: 'wisp', accent: '#86efac', dusk: '#0b1429', bossName: 'Nightmire Witch' },
  { ray: '#ffe7b3', rayAlpha: 0.15, aura: 'violet', creature: 'star', accent: '#fde68a', dusk: '#0c0f38', bossName: 'Astral Phoenix' },
  { ray: '#ffe9b8', rayAlpha: 0.16, aura: 'gold', creature: 'star', accent: '#f9d98c', dusk: '#1f1030', bossName: 'The Crownkeeper' }
];

const GLOW_PALETTES = {
  gold: ['rgba(255,248,200,0.92)', 'rgba(255,214,110,0.42)', 'rgba(255,190,80,0)'],
  emerald: ['rgba(220,255,232,0.9)', 'rgba(116,242,175,0.4)', 'rgba(60,210,140,0)'],
  cyan: ['rgba(222,255,255,0.9)', 'rgba(98,236,245,0.42)', 'rgba(50,190,220,0)'],
  violet: ['rgba(244,226,255,0.9)', 'rgba(184,132,255,0.42)', 'rgba(128,80,240,0)'],
  ember: ['rgba(255,240,190,0.95)', 'rgba(255,134,54,0.45)', 'rgba(220,55,20,0)'],
  white: ['rgba(255,255,255,0.9)', 'rgba(255,250,230,0.35)', 'rgba(255,255,255,0)']
};

const hash = n => {
  const k = Math.sin(n * 91.731 + 3.17) * 43758.5453;
  return k - Math.floor(k);
};

function roundRectPath(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export class AAAVisualEngine {
  constructor() {
    this.glows = {};
    this.trails = new WeakMap();
    this.bossGhostHp = 0;
    this.bossGhostLevel = -1;
    this._bakeGlows();
  }

  _bakeGlows() {
    if (typeof document === 'undefined') return;
    for (const [name, stops] of Object.entries(GLOW_PALETTES)) {
      try {
        const c = document.createElement('canvas');
        c.width = 96;
        c.height = 96;
        const gctx = c.getContext?.('2d');
        if (!gctx) continue;
        const grad = gctx.createRadialGradient(48, 48, 2, 48, 48, 48);
        grad.addColorStop(0, stops[0]);
        grad.addColorStop(0.42, stops[1]);
        grad.addColorStop(1, stops[2]);
        gctx.fillStyle = grad;
        gctx.fillRect(0, 0, 96, 96);
        this.glows[name] = c;
      } catch {}
    }
  }

  drawGlow(ctx, x, y, radius, tint = 'gold', alpha = 1) {
    const sprite = this.glows[tint] || this.glows.gold;
    if (!sprite || radius <= 0 || alpha <= 0.005) return;
    ctx.save();
    ctx.globalAlpha = Math.min(1, alpha);
    ctx.globalCompositeOperation = 'lighter';
    ctx.drawImage(sprite, x - radius, y - radius, radius * 2, radius * 2);
    ctx.restore();
  }

  getAtmo(worldIndex) {
    return WORLD_ATMOSPHERE[worldIndex] || WORLD_ATMOSPHERE[0];
  }

  /**
   * Volumetric diagonal sunbeams / god-rays drifting across the backdrop.
   */
  drawVolumetricRays(ctx, worldIndex, cam, time, perfMode = false) {
    const atmo = this.getAtmo(worldIndex);
    const count = perfMode ? 3 : 5;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < count; i++) {
      const baseX = ((i * 340 + 180 - cam * 0.11) % (WIDTH + 520) + (WIDTH + 520)) % (WIDTH + 520) - 240;
      const sway = Math.sin(time * 0.00055 + i * 1.9) * 28;
      const topX = baseX + sway;
      const topW = 72 + (i % 3) * 34;
      const botOffset = 195 + (i % 2) * 55;
      const botW = topW * 2.15;
      const pulse = 0.72 + 0.28 * Math.sin(time * 0.0009 + i * 2.4);
      const grad = ctx.createLinearGradient(topX, 0, topX + botOffset * 0.45, HEIGHT * 0.88);
      grad.addColorStop(0, atmo.ray);
      grad.addColorStop(0.55, atmo.ray);
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.globalAlpha = atmo.rayAlpha * pulse;
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(topX, -20);
      ctx.lineTo(topX + topW, -20);
      ctx.lineTo(topX + botOffset + botW, HEIGHT * 0.9);
      ctx.lineTo(topX + botOffset, HEIGHT * 0.9);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  /**
   * Living biome wildlife & ambient motes (butterflies, birds, embers, snowflakes, bubbles, wisps).
   */
  drawAmbientLife(ctx, d, cam, time, perfMode = false) {
    const atmo = this.getAtmo(d.world);
    const count = perfMode ? 12 : 24;
    ctx.save();
    for (let i = 0; i < count; i++) {
      const seed = d.id * 47 + i * 19;
      const speedX = atmo.creature === 'bird' ? 0.052 : atmo.creature === 'ember' ? 0.015 : 0.022;
      const rawX = hash(seed) * 1680 - cam * (0.22 + (i % 3) * 0.08) + time * speedX * (i % 2 ? 1 : -0.65);
      const x = ((rawX % 1620) + 1620) % 1620 - 170;
      let y = 70 + hash(seed + 5) * 430 + Math.sin(time * 0.002 + i * 1.4) * 18;

      if (atmo.creature === 'ember') {
        y = HEIGHT - ((hash(seed + 9) * HEIGHT + time * 0.065) % HEIGHT);
        this.drawGlow(ctx, x, y, 12, 'ember', 0.48);
        ctx.fillStyle = '#ffefbe';
        ctx.beginPath();
        ctx.arc(x, y, 1.8 + (i % 3) * 0.7, 0, TAU);
        ctx.fill();
      } else if (atmo.creature === 'snow') {
        y = (hash(seed + 7) * HEIGHT + time * (0.045 + (i % 3) * 0.015)) % HEIGHT;
        const sx = x + Math.sin(time * 0.0018 + i) * 20;
        ctx.fillStyle = 'rgba(235,250,255,0.75)';
        ctx.beginPath();
        ctx.arc(sx, y, 1.6 + (i % 3) * 0.9, 0, TAU);
        ctx.fill();
      } else if (atmo.creature === 'bubble') {
        y = HEIGHT - ((hash(seed + 11) * HEIGHT + time * 0.04) % HEIGHT);
        const r = 3 + (i % 4) * 1.7;
        ctx.strokeStyle = 'rgba(180,255,248,0.52)';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(x + Math.sin(time * 0.002 + i) * 12, y, r, 0, TAU);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.beginPath();
        ctx.arc(x + Math.sin(time * 0.002 + i) * 12 - r * 0.3, y - r * 0.3, r * 0.25, 0, TAU);
        ctx.fill();
      } else if (atmo.creature === 'bird' && i % 3 === 0) {
        const flap = Math.sin(time * 0.009 + i * 2) * 5;
        ctx.strokeStyle = 'rgba(255,250,235,0.65)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - 8, y + flap);
        ctx.quadraticCurveTo(x - 3, y - 4, x, y);
        ctx.quadraticCurveTo(x + 3, y - 4, x + 8, y + flap);
        ctx.stroke();
      } else if (atmo.creature === 'butterfly' && i % 2 === 0) {
        const wing = Math.abs(Math.sin(time * 0.012 + i * 1.7));
        const col = i % 4 === 0 ? '#ffe794' : '#9fffe0';
        this.drawGlow(ctx, x, y, 14, i % 4 === 0 ? 'gold' : 'emerald', 0.32);
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.ellipse(x - 3.5 * wing, y - 1, 4.5 * wing + 1, 3.2, -0.35, 0, TAU);
        ctx.ellipse(x + 3.5 * wing, y - 1, 4.5 * wing + 1, 3.2, 0.35, 0, TAU);
        ctx.fill();
      } else {
        const pulse = 0.45 + 0.55 * Math.sin(time * 0.003 + i * 2.1);
        this.drawGlow(ctx, x, y, 13 + (i % 3) * 5, atmo.aura, 0.38 * pulse);
        ctx.fillStyle = '#fffbe0';
        ctx.beginPath();
        ctx.arc(x, y, 1.8 + (i % 2) * 0.8, 0, TAU);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  /**
   * Subtle vertical light beacons and floating runes above unawakened shrines + glowing checkpoint pillars.
   */
  drawAdventureBeacons(ctx, d, state, cam, time) {
    const clr = { math: 'gold', english: 'violet', science: 'emerald', general: 'cyan' };
    ctx.save();
    for (const s of d.shrines) {
      const x = s.x - cam;
      if (x < -160 || x > WIDTH + 160) continue;
      const tint = clr[s.subject] || 'gold';
      if (!s.done) {
        const pulse = 0.55 + 0.45 * Math.sin(time * 0.0032 + s.x * 0.01);
        const grad = ctx.createLinearGradient(x, d.ground - 360, x, d.ground - 40);
        grad.addColorStop(0, 'rgba(255,250,210,0)');
        grad.addColorStop(0.7, 'rgba(255,244,190,0.11)');
        grad.addColorStop(1, 'rgba(255,244,190,0)');
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 0.75 * pulse;
        ctx.fillStyle = grad;
        ctx.fillRect(x - 24, d.ground - 360, 48, 320);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
        this.drawGlow(ctx, x, d.ground - 102, 74 + pulse * 14, tint, 0.48);

        // Proximity interactive ring when Ari approaches
        if (state?.player && Math.abs(state.player.x - s.x) < 155) {
          const ringR = 54 + Math.sin(time * 0.007) * 5;
          ctx.strokeStyle = 'rgba(255,240,175,0.75)';
          ctx.lineWidth = 2.2;
          ctx.setLineDash([7, 7]);
          ctx.beginPath();
          ctx.arc(x, d.ground - 100, ringR, time * 0.001, time * 0.001 + TAU);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      } else {
        this.drawGlow(ctx, x, d.ground - 102, 48, 'emerald', 0.28);
      }
    }

    // Checkpoints: elegant glowing stone waymarkers
    for (const cx of d.checkpoints || []) {
      const x = cx - cam;
      if (x < -80 || x > WIDTH + 80) continue;
      const lit = (state?.checkpoint || 0) >= cx;
      const y = d.ground;
      ctx.fillStyle = lit ? '#2e5d56' : '#2a3d46';
      ctx.strokeStyle = lit ? '#f8de97' : '#85a3a8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 10, y);
      ctx.lineTo(x - 6, y - 54);
      ctx.lineTo(x, y - 66);
      ctx.lineTo(x + 6, y - 54);
      ctx.lineTo(x + 10, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      const orbY = y - 42 + Math.sin(time * 0.004 + cx) * 3;
      this.drawGlow(ctx, x, orbY, lit ? 34 : 18, lit ? 'emerald' : 'gold', lit ? 0.65 : 0.25);
      ctx.fillStyle = lit ? '#c7ffe0' : '#d5d0b5';
      ctx.beginPath();
      ctx.arc(x, orbY, lit ? 5.5 : 3.5, 0, TAU);
      ctx.fill();
    }

    // Exit Gate radiant swirl when unlocked
    const gateX = d.length - 165 - cam;
    const unlocked = state?.keys === 4 && (!d.boss || state.bossHp === 0);
    if (unlocked && gateX > -220 && gateX < WIDTH + 220) {
      this.drawGlow(ctx, gateX, d.ground - 115, 130 + Math.sin(time * 0.005) * 14, 'cyan', 0.6);
      ctx.strokeStyle = 'rgba(182,255,235,0.75)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(gateX, d.ground - 115, 68, time * 0.0025, time * 0.0025 + Math.PI * 1.35);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,236,168,0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(gateX, d.ground - 115, 52, -time * 0.0032, -time * 0.0032 + Math.PI * 1.15);
      ctx.stroke();
    }
    ctx.restore();
  }

  /**
   * Subtle hero rim illumination + dash afterimages + double-jump shockwaves.
   */
  drawHeroAuraAndEffects(ctx, state, cam, time, readyFn) {
    const feel = state?.feel;
    const player = state?.scene === 'title' ? null : state?.player;

    // Shockwaves (double jump wind ring, dash burst, rune awakening, magic hits)
    if (feel?.shockwaves?.length) {
      ctx.save();
      for (const sw of feel.shockwaves) {
        const sx = sw.x - cam;
        if (sx < -150 || sx > WIDTH + 150) continue;
        const alpha = Math.max(0, sw.life / sw.maxLife);
        ctx.strokeStyle = sw.color;
        ctx.globalAlpha = alpha * 0.85;
        ctx.lineWidth = 2 + alpha * 4;
        ctx.beginPath();
        ctx.ellipse(sx, sw.y, sw.radius, sw.radius * 0.42, 0, 0, TAU);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Spirit Dash translucent afterimages
    if (feel?.afterimages?.length) {
      const heroImg = readyFn?.('animation/ari/body-v1411-clean.png') || readyFn?.('ari.png');
      ctx.save();
      for (const a of feel.afterimages) {
        const sx = a.x - cam;
        const ratio = Math.max(0, a.life / a.maxLife);
        this.drawGlow(ctx, sx, a.y - 44, 42 * ratio, 'cyan', ratio * 0.42);
        if (heroImg && (heroImg.naturalWidth || heroImg.width)) {
          ctx.save();
          ctx.globalAlpha = ratio * 0.32;
          ctx.translate(sx, a.y);
          ctx.scale(a.face === -1 ? -1 : 1, 1);
          ctx.drawImage(heroImg, -68, -110, 138, 116);
          ctx.restore();
        }
      }
      ctx.restore();
    }

    // Hero lantern rim-light (grounds Ari cleanly in dark caverns & twilight forests)
    if (player) {
      const px = player.x - cam;
      const py = player.y + player.h * 0.48;
      this.drawGlow(ctx, px, py, 92, 'gold', 0.2);
      if (feel?.dashTimer > 0) {
        this.drawGlow(ctx, px, py, 74, 'cyan', 0.55);
      }
    }
  }

  /**
   * Arcane comet projectiles with luminous ribbon trails and rotating star cores.
   */
  drawArcaneProjectiles(ctx, state, cam, time) {
    const list = state?.projectiles || [];
    if (!list.length) return;
    ctx.save();
    for (const p of list) {
      const x = p.x - cam;
      if (x < -120 || x > WIDTH + 120) continue;
      let hist = this.trails.get(p);
      if (!hist) {
        hist = [];
        this.trails.set(p, hist);
      }
      hist.push({ x: p.x, y: p.y });
      if (hist.length > 9) hist.shift();

      // Luminous comet ribbon trail
      for (let i = 0; i < hist.length - 1; i++) {
        const ratio = (i + 1) / hist.length;
        const tx = hist[i].x - cam;
        const ty = hist[i].y;
        ctx.fillStyle = i % 2 === 0 ? 'rgba(155,255,212,0.55)' : 'rgba(255,238,162,0.5)';
        ctx.globalAlpha = ratio * 0.72;
        ctx.beginPath();
        ctx.arc(tx, ty, 3 + ratio * 7.5, 0, TAU);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Halo + rotating arcane star core
      this.drawGlow(ctx, x, p.y, 44, 'emerald', 0.8);
      this.drawGlow(ctx, x, p.y, 24, 'gold', 0.9);
      ctx.save();
      ctx.translate(x, p.y);
      ctx.rotate(time * 0.015);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      for (let k = 0; k < 8; k++) {
        const a = (k * Math.PI) / 4;
        const r = k % 2 === 0 ? 12 : 5;
        if (k === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  /**
   * Defeated enemy KO spin/dissolve ghosts so kills feel crunchy and readable.
   */
  drawEnemyKOGhosts(ctx, state, cam, readyFn) {
    const ghosts = state?.feel?.koGhosts;
    if (!ghosts?.length) return;
    ctx.save();
    for (const g of ghosts) {
      const sx = g.x - cam;
      const ratio = Math.max(0, g.life / g.maxLife);
      const img = readyFn?.(`foe-${String(g.index || 1).padStart(2, '0')}.webp`);
      this.drawGlow(ctx, sx, g.y, 46 * ratio, 'emerald', ratio * 0.75);
      if (img && (img.naturalWidth || img.width)) {
        ctx.save();
        ctx.globalAlpha = ratio * 0.85;
        ctx.translate(sx, g.y);
        ctx.rotate(g.rot);
        const s = 76 * (0.55 + ratio * 0.45);
        ctx.drawImage(img, -s / 2, -s / 2, s, s);
        ctx.restore();
      }
    }
    ctx.restore();
  }

  /**
   * Crisp world-space floating callouts (+10, x3 COMBO, RUNE AWAKENED!).
   */
  drawCallouts(ctx, state, cam) {
    const list = state?.feel?.callouts;
    if (!list?.length) return;
    ctx.save();
    ctx.textAlign = 'center';
    for (const c of list) {
      const sx = c.x - cam;
      if (sx < -160 || sx > WIDTH + 160) continue;
      const ratio = Math.max(0, c.life / c.maxLife);
      const pop = ratio > 0.82 ? 1 + (1 - ratio) * 1.4 : 1;
      const size = Math.round(18 * c.scale * pop);
      ctx.globalAlpha = Math.min(1, ratio * 1.7);
      ctx.font = `900 ${size}px 'Cinzel', Georgia, serif`;
      ctx.lineWidth = 4.5;
      ctx.strokeStyle = 'rgba(7,24,32,0.92)';
      ctx.strokeText(c.text, sx, c.y);
      ctx.fillStyle = c.color;
      ctx.fillText(c.text, sx, c.y);
    }
    ctx.restore();
  }

  /**
   * Diegetic foreground botanical/biome silhouette corners (1.16x parallax, zero blur stall).
   */
  drawCinematicFraming(ctx, d, cam, time) {
    const atmo = this.getAtmo(d.world);
    ctx.save();
    // Subtle dark atmospheric grounding along bottom and top corners
    const bottomGrad = ctx.createLinearGradient(0, HEIGHT - 96, 0, HEIGHT);
    bottomGrad.addColorStop(0, 'rgba(6,18,24,0)');
    bottomGrad.addColorStop(1, 'rgba(6,18,24,0.45)');
    ctx.fillStyle = bottomGrad;
    ctx.fillRect(0, HEIGHT - 96, WIDTH, 96);

    // Subtle parallax silhouetted flora tufts at extreme bottom-left / bottom-right corners
    ctx.fillStyle = atmo.dusk;
    ctx.globalAlpha = 0.52;
    const parallaxShift = ((cam * 0.16) % 240);
    for (let side = 0; side < 2; side++) {
      const baseX = side === 0 ? -24 - parallaxShift * 0.18 : WIDTH + 24 - parallaxShift * 0.18;
      const dir = side === 0 ? 1 : -1;
      for (let k = 0; k < 4; k++) {
        const sway = Math.sin(time * 0.0014 + k + side * 2) * 5;
        const bx = baseX + dir * (k * 26);
        const h = 48 + (3 - k) * 18;
        ctx.beginPath();
        ctx.moveTo(bx - 14, HEIGHT + 8);
        ctx.quadraticCurveTo(bx + dir * 24 + sway, HEIGHT - h * 0.7, bx + dir * 38 + sway, HEIGHT - h);
        ctx.quadraticCurveTo(bx + dir * 10, HEIGHT - h * 0.45, bx + 16, HEIGHT + 8);
        ctx.closePath();
        ctx.fill();
      }
    }
    ctx.restore();
  }

  /**
   * Screen-edge damage/magic vignette pulse.
   */
  drawHitVignette(ctx, state) {
    const feel = state?.feel;
    const alpha = Math.max(feel?.vignetteAlpha || 0, (state?.flash || 0) * 0.8);
    if (alpha <= 0.01) return;
    const color = feel?.vignetteColor || '220, 56, 62';
    ctx.save();
    const g = ctx.createRadialGradient(WIDTH / 2, HEIGHT / 2, HEIGHT * 0.32, WIDTH / 2, HEIGHT / 2, WIDTH * 0.62);
    g.addColorStop(0, `rgba(${color}, 0)`);
    g.addColorStop(1, `rgba(${color}, ${Math.min(0.65, alpha)})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.restore();
  }

  /**
   * Sleek, unobtrusive Adventure Compass Strip along the bottom edge during play,
   * plus the Boss Health Bar Banner when approaching a Guardian,
   * plus the Cinematic Chapter Intro Banner on level start.
   */
  drawCinematicOverlays(ctx, d, state, time) {
    if (!state || state.scene !== 'play') return;
    const feel = state.feel;

    // 1. Bottom Adventure Progress Compass (ultra-slim, unobtrusive)
    const barW = 360;
    const barH = 6;
    const bx = (WIDTH - barW) / 2;
    const by = HEIGHT - 22;
    ctx.save();
    ctx.fillStyle = 'rgba(7,24,34,0.68)';
    ctx.strokeStyle = 'rgba(244,214,140,0.45)';
    ctx.lineWidth = 1.2;
    roundRectPath(ctx, bx - 10, by - 7, barW + 20, barH + 14, 10);
    ctx.fill();
    ctx.stroke();

    // Track rail
    ctx.fillStyle = 'rgba(255,255,255,0.16)';
    roundRectPath(ctx, bx, by, barW, barH, 3);
    ctx.fill();

    const progress = Math.max(0, Math.min(1, state.player.x / Math.max(1, d.length - 165)));
    const fillGrad = ctx.createLinearGradient(bx, 0, bx + barW, 0);
    fillGrad.addColorStop(0, '#9cf2b6');
    fillGrad.addColorStop(1, '#ffe08a');
    ctx.fillStyle = fillGrad;
    roundRectPath(ctx, bx, by, Math.max(6, barW * progress), barH, 3);
    ctx.fill();

    // Shrine diamonds on compass
    for (const s of d.shrines) {
      const sx = bx + Math.max(0, Math.min(1, s.x / Math.max(1, d.length - 165))) * barW;
      ctx.fillStyle = s.done ? '#7ef7be' : '#f8d77e';
      ctx.beginPath();
      ctx.moveTo(sx, by - 4);
      ctx.lineTo(sx + 4, by + 3);
      ctx.lineTo(sx, by + 10);
      ctx.lineTo(sx - 4, by + 3);
      ctx.closePath();
      ctx.fill();
    }

    // Ari marker dot
    const ax = bx + barW * progress;
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#143d34';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ax, by + barH / 2, 5.5, 0, TAU);
    ctx.fill();
    ctx.stroke();

    // Dash readiness indicator pill beside compass
    const dashReady = !feel || feel.dashCooldown <= 0;
    ctx.font = "800 10px 'Plus Jakarta Sans', system-ui, sans-serif";
    ctx.textAlign = 'left';
    ctx.fillStyle = dashReady ? '#a6f9e8' : 'rgba(180,210,215,0.55)';
    ctx.fillText(dashReady ? 'SHIFT · DASH READY' : 'DASH RECHARGING', bx + barW + 18, by + 6);

    // Combo indicator on right if active
    if (feel && feel.combo >= 2 && feel.comboTimer > 0) {
      ctx.textAlign = 'right';
      ctx.font = "900 15px 'Cinzel', Georgia, serif";
      ctx.fillStyle = '#ffe58f';
      ctx.fillText(`×${feel.combo} STREAK`, bx - 18, by + 7);
    }
    ctx.restore();

    // 2. Boss Arena Health Bar Banner with trailing damage ghost bar
    if (d.boss && state.bossHp > 0 && Math.abs(state.player.x - d.bossX) < 760) {
      const maxHp = 3 + Math.floor(d.world / 3);
      if (this.bossGhostLevel !== d.id) {
        this.bossGhostLevel = d.id;
        this.bossGhostHp = state.bossHp;
      }
      this.bossGhostHp += (state.bossHp - this.bossGhostHp) * 0.08;
      const bw = 420;
      const bh = 16;
      const x = (WIDTH - bw) / 2;
      const y = HEIGHT - 76;
      const atmo = this.getAtmo(d.world);
      ctx.save();
      ctx.fillStyle = 'rgba(10,18,28,0.82)';
      ctx.strokeStyle = '#f2cf84';
      ctx.lineWidth = 2;
      roundRectPath(ctx, x - 14, y - 24, bw + 28, bh + 34, 12);
      ctx.fill();
      ctx.stroke();

      ctx.font = "800 12px 'Cinzel', Georgia, serif";
      ctx.textAlign = 'left';
      ctx.fillStyle = '#ffe7ad';
      const phaseName = d.v14?.bossPhases?.[(d.v14.bossPhase || 1) - 1] || 'Guardian Arena';
      ctx.fillText(`♛ ${atmo.bossName.toUpperCase()} · ${phaseName.toUpperCase()}`, x, y - 8);
      ctx.textAlign = 'right';
      ctx.fillStyle = state.keys === 4 ? '#9af7c9' : '#f4c27d';
      ctx.fillText(state.keys === 4 ? `${state.bossHp}/${maxHp} HP` : 'AWAKEN 4 RUNES FIRST', x + bw, y - 8);

      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      roundRectPath(ctx, x, y, bw, bh, 7);
      ctx.fill();

      // Trailing ghost bar
      const ghostRatio = Math.max(0, Math.min(1, this.bossGhostHp / maxHp));
      ctx.fillStyle = 'rgba(255,235,190,0.55)';
      roundRectPath(ctx, x + 2, y + 2, (bw - 4) * ghostRatio, bh - 4, 5);
      ctx.fill();

      // Live HP bar
      const hpRatio = Math.max(0, Math.min(1, state.bossHp / maxHp));
      const hpGrad = ctx.createLinearGradient(x, 0, x + bw, 0);
      hpGrad.addColorStop(0, '#f0625b');
      hpGrad.addColorStop(0.55, '#f6a84c');
      hpGrad.addColorStop(1, '#ffe48c');
      ctx.fillStyle = hpGrad;
      roundRectPath(ctx, x + 2, y + 2, (bw - 4) * hpRatio, bh - 4, 5);
      ctx.fill();
      ctx.restore();
    }

    // 3. Cinematic Chapter Intro Banner (gracefully fades in & out without blocking gameplay)
    if (feel && feel.bannerTimer > 0 && feel.bannerTitle) {
      const t = feel.bannerTimer;
      const alpha = t > 2.2 ? (2.6 - t) / 0.4 : t < 0.6 ? t / 0.6 : 1;
      const slideY = t > 2.2 ? (t - 2.2) * 28 : 0;
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      const cy = 152 + slideY;
      const bg = ctx.createLinearGradient(WIDTH * 0.22, cy, WIDTH * 0.78, cy);
      bg.addColorStop(0, 'rgba(6,24,32,0)');
      bg.addColorStop(0.2, 'rgba(6,24,32,0.74)');
      bg.addColorStop(0.8, 'rgba(6,24,32,0.74)');
      bg.addColorStop(1, 'rgba(6,24,32,0)');
      ctx.fillStyle = bg;
      ctx.fillRect(WIDTH * 0.2, cy - 38, WIDTH * 0.6, 86);

      // Hairline gold accents
      const lineGrad = ctx.createLinearGradient(WIDTH * 0.28, 0, WIDTH * 0.72, 0);
      lineGrad.addColorStop(0, 'rgba(246,214,138,0)');
      lineGrad.addColorStop(0.5, 'rgba(246,214,138,0.85)');
      lineGrad.addColorStop(1, 'rgba(246,214,138,0)');
      ctx.fillStyle = lineGrad;
      ctx.fillRect(WIDTH * 0.28, cy - 38, WIDTH * 0.44, 1.5);
      ctx.fillRect(WIDTH * 0.28, cy + 47, WIDTH * 0.44, 1.5);

      ctx.textAlign = 'center';
      ctx.font = "700 12px 'Plus Jakarta Sans', system-ui, sans-serif";
      ctx.fillStyle = '#a8f2c8';
      ctx.fillText(feel.bannerWorld.toUpperCase(), WIDTH / 2, cy - 15);

      ctx.font = "900 30px 'Cinzel', Georgia, serif";
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'rgba(5,18,26,0.9)';
      ctx.strokeText(feel.bannerTitle, WIDTH / 2, cy + 16);
      ctx.fillStyle = '#fff6dc';
      ctx.fillText(feel.bannerTitle, WIDTH / 2, cy + 16);

      if (feel.bannerSubtitle) {
        ctx.font = "600 13px 'Plus Jakarta Sans', system-ui, sans-serif";
        ctx.fillStyle = '#e7dcb8';
        ctx.fillText(feel.bannerSubtitle, WIDTH / 2, cy + 38);
      }
      ctx.restore();
    }
  }
}
