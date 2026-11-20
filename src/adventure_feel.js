/**
 * Learn & Leap AAA Adventure Feel — pure, deterministic gameplay-feel mechanics.
 * Decoupled from DOM/Canvas so every rule is fast and unit-testable.
 * Covers: Coyote Time, Jump Buffering, Double Jump (Spirit Leap), Variable Jump Cut,
 * Spirit Dash with i-frames & cooldown, Combo Streaks, Hitstop, Trauma Shake, and Look-Ahead Camera.
 */

export const FEEL_CONFIG = Object.freeze({
  coyoteDuration: 0.11,
  jumpBufferDuration: 0.13,
  jumpVelocity: -685,
  doubleJumpVelocity: -610,
  jumpCutMultiplier: 0.52,
  dashSpeed: 760,
  dashDuration: 0.16,
  dashCooldown: 0.85,
  dashInvuln: 0.22,
  comboWindow: 3.4,
  maxCombo: 8,
  hitstopLight: 0.032,
  hitstopHeavy: 0.058,
  traumaDecay: 2.4,
  lookAheadDistance: 125,
  lookAheadSmoothing: 4.5,
  maxCallouts: 18,
  maxAfterimages: 10
});

export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

export function createFeelState() {
  return {
    coyoteTimer: 0,
    jumpBufferTimer: 0,
    airJumpsLeft: 1,
    maxAirJumps: 1,
    dashTimer: 0,
    dashCooldown: 0,
    dashDir: 1,
    hitstopTimer: 0,
    trauma: 0,
    combo: 0,
    maxComboReached: 0,
    comboTimer: 0,
    lookAheadX: 0,
    bannerTimer: 0,
    bannerTitle: '',
    bannerSubtitle: '',
    bannerWorld: '',
    vignetteColor: null,
    vignetteAlpha: 0,
    callouts: [],
    afterimages: [],
    koGhosts: [],
    shockwaves: [],
    afterimageClock: 0
  };
}

export function resetFeelState(feel, bannerInfo = null) {
  feel.coyoteTimer = 0;
  feel.jumpBufferTimer = 0;
  feel.airJumpsLeft = feel.maxAirJumps;
  feel.dashTimer = 0;
  feel.dashCooldown = 0;
  feel.dashDir = 1;
  feel.hitstopTimer = 0;
  feel.trauma = 0;
  feel.combo = 0;
  feel.maxComboReached = 0;
  feel.comboTimer = 0;
  feel.lookAheadX = 0;
  feel.vignetteColor = null;
  feel.vignetteAlpha = 0;
  feel.callouts = [];
  feel.afterimages = [];
  feel.koGhosts = [];
  feel.shockwaves = [];
  feel.afterimageClock = 0;
  if (bannerInfo) {
    feel.bannerTimer = 2.6;
    feel.bannerWorld = bannerInfo.world || '';
    feel.bannerTitle = bannerInfo.title || '';
    feel.bannerSubtitle = bannerInfo.subtitle || '';
  } else {
    feel.bannerTimer = 0;
  }
  return feel;
}

export function queueJump(feel) {
  feel.jumpBufferTimer = FEEL_CONFIG.jumpBufferDuration;
}

/**
 * Evaluates whether a jump (ground/coyote or double-jump) executes right now.
 * Returns 'ground' | 'double' | null.
 */
export function consumeJump(feel, player) {
  if (feel.jumpBufferTimer <= 0) return null;

  if (player.grounded || feel.coyoteTimer > 0) {
    player.vy = FEEL_CONFIG.jumpVelocity;
    player.grounded = false;
    player.land = 0;
    feel.coyoteTimer = 0;
    feel.jumpBufferTimer = 0;
    feel.airJumpsLeft = feel.maxAirJumps;
    return 'ground';
  }

  if (feel.airJumpsLeft > 0) {
    player.vy = FEEL_CONFIG.doubleJumpVelocity;
    player.grounded = false;
    player.land = 0;
    feel.airJumpsLeft -= 1;
    feel.jumpBufferTimer = 0;
    return 'double';
  }

  return null;
}

export function applyVariableJumpCut(player) {
  if (!player.grounded && player.vy < -180) {
    player.vy *= FEEL_CONFIG.jumpCutMultiplier;
    return true;
  }
  return false;
}

export function triggerDash(feel, player, inputDir = 0) {
  if (feel.dashCooldown > 0 || feel.dashTimer > 0) return false;
  const dir = inputDir !== 0 ? Math.sign(inputDir) : (player.face || 1);
  player.face = dir;
  feel.dashDir = dir;
  feel.dashTimer = FEEL_CONFIG.dashDuration;
  feel.dashCooldown = FEEL_CONFIG.dashCooldown;
  feel.afterimageClock = 0;
  player.vx = dir * FEEL_CONFIG.dashSpeed;
  player.vy = Math.min(player.vy, 0) * 0.2;
  player.inv = Math.max(player.inv || 0, FEEL_CONFIG.dashInvuln);
  return true;
}

export function registerCombo(feel, amount = 1) {
  feel.combo = Math.min(FEEL_CONFIG.maxCombo, feel.combo + amount);
  feel.maxComboReached = Math.max(feel.maxComboReached, feel.combo);
  feel.comboTimer = FEEL_CONFIG.comboWindow;
  return feel.combo;
}

export function addTrauma(feel, amount) {
  feel.trauma = clamp(feel.trauma + amount, 0, 1);
  return feel.trauma;
}

export function getShakeOffset(feel, timeMs = 0) {
  if (feel.trauma <= 0.001) return { x: 0, y: 0 };
  const power = feel.trauma * feel.trauma * 15;
  return {
    x: Math.sin(timeMs * 0.067) * power,
    y: Math.cos(timeMs * 0.089) * power * 0.72
  };
}

export function triggerHitstop(feel, heavy = false) {
  const dur = heavy ? FEEL_CONFIG.hitstopHeavy : FEEL_CONFIG.hitstopLight;
  feel.hitstopTimer = Math.max(feel.hitstopTimer, dur);
}

export function triggerVignette(feel, color, alpha = 0.55) {
  feel.vignetteColor = color;
  feel.vignetteAlpha = clamp(alpha, 0, 0.85);
}

export function pushCallout(feel, x, y, text, color = '#fff2b2', scale = 1) {
  feel.callouts.push({
    x,
    y,
    vy: -68,
    text: String(text),
    color,
    scale,
    life: 1.05,
    maxLife: 1.05
  });
  if (feel.callouts.length > FEEL_CONFIG.maxCallouts) {
    feel.callouts.shift();
  }
}

export function pushShockwave(feel, x, y, color = '#aef7d0', maxRadius = 85, duration = 0.34) {
  feel.shockwaves.push({
    x,
    y,
    color,
    radius: 10,
    maxRadius,
    life: duration,
    maxLife: duration
  });
  if (feel.shockwaves.length > 12) {
    feel.shockwaves.shift();
  }
}

export function pushEnemyKO(feel, enemy, index, faceDir = 1) {
  feel.koGhosts.push({
    x: enemy.x,
    y: 525,
    vx: faceDir * 145,
    vy: -290,
    rot: 0,
    vrot: faceDir * 9.5,
    index,
    life: 0.42,
    maxLife: 0.42
  });
  if (feel.koGhosts.length > 10) {
    feel.koGhosts.shift();
  }
}

/**
 * Advances real-time visual feel timers even during hitstop.
 * Returns { frozen: boolean, simDt: number }
 */
export function tickVisualFeel(feel, rawDt) {
  const dt = clamp(rawDt, 0, 0.05);
  feel.trauma = Math.max(0, feel.trauma - FEEL_CONFIG.traumaDecay * dt);
  feel.bannerTimer = Math.max(0, feel.bannerTimer - dt);
  feel.vignetteAlpha = Math.max(0, feel.vignetteAlpha - 1.45 * dt);

  for (let i = feel.callouts.length - 1; i >= 0; i--) {
    const c = feel.callouts[i];
    c.life -= dt;
    c.y += c.vy * dt;
    c.vy *= Math.pow(0.92, dt * 60);
    if (c.life <= 0) feel.callouts.splice(i, 1);
  }

  for (let i = feel.shockwaves.length - 1; i >= 0; i--) {
    const sw = feel.shockwaves[i];
    sw.life -= dt;
    const p = 1 - clamp(sw.life / sw.maxLife, 0, 1);
    sw.radius = 10 + (sw.maxRadius - 10) * (1 - Math.pow(1 - p, 3));
    if (sw.life <= 0) feel.shockwaves.splice(i, 1);
  }

  for (let i = feel.afterimages.length - 1; i >= 0; i--) {
    const a = feel.afterimages[i];
    a.life -= dt;
    if (a.life <= 0) feel.afterimages.splice(i, 1);
  }

  for (let i = feel.koGhosts.length - 1; i >= 0; i--) {
    const g = feel.koGhosts[i];
    g.life -= dt;
    g.x += g.vx * dt;
    g.y += g.vy * dt;
    g.vy += 1100 * dt;
    g.rot += g.vrot * dt;
    if (g.life <= 0) feel.koGhosts.splice(i, 1);
  }

  if (feel.hitstopTimer > 0) {
    feel.hitstopTimer = Math.max(0, feel.hitstopTimer - dt);
    return { frozen: true, simDt: 0 };
  }

  return { frozen: false, simDt: dt };
}

/**
 * Advances simulation-coupled feel timers (coyote, jump buffer, dash, combo, camera look-ahead).
 */
export function tickSimFeel(feel, player, dt) {
  if (player.grounded) {
    feel.coyoteTimer = FEEL_CONFIG.coyoteDuration;
    feel.airJumpsLeft = feel.maxAirJumps;
  } else {
    feel.coyoteTimer = Math.max(0, feel.coyoteTimer - dt);
  }

  feel.jumpBufferTimer = Math.max(0, feel.jumpBufferTimer - dt);
  feel.dashCooldown = Math.max(0, feel.dashCooldown - dt);

  if (feel.dashTimer > 0) {
    feel.dashTimer = Math.max(0, feel.dashTimer - dt);
    player.vx = feel.dashDir * FEEL_CONFIG.dashSpeed;
    player.vy = Math.min(player.vy, 30);
    feel.afterimageClock -= dt;
    if (feel.afterimageClock <= 0) {
      feel.afterimageClock = 0.032;
      feel.afterimages.push({
        x: player.x,
        y: player.y + player.h,
        face: player.face || 1,
        life: 0.24,
        maxLife: 0.24
      });
      if (feel.afterimages.length > FEEL_CONFIG.maxAfterimages) {
        feel.afterimages.shift();
      }
    }
  }

  if (feel.comboTimer > 0) {
    feel.comboTimer = Math.max(0, feel.comboTimer - dt);
    if (feel.comboTimer === 0) {
      feel.combo = 0;
    }
  }

  const desiredLookAhead = (player.face || 1) * FEEL_CONFIG.lookAheadDistance * (Math.abs(player.vx) > 40 ? 1 : 0.45);
  const alpha = 1 - Math.exp(-FEEL_CONFIG.lookAheadSmoothing * dt);
  feel.lookAheadX += (desiredLookAhead - feel.lookAheadX) * alpha;
}

export function computeCameraTarget(playerX, lookAheadX, levelLength, viewportWidth = 1280) {
  const base = playerX - 420 + lookAheadX;
  return clamp(base, 0, Math.max(0, levelLength - viewportWidth));
}

if (typeof window !== 'undefined') {
  window.LeapAdventureFeel = {
    FEEL_CONFIG,
    createFeelState,
    resetFeelState,
    queueJump,
    consumeJump,
    applyVariableJumpCut,
    triggerDash,
    registerCombo,
    addTrauma,
    getShakeOffset,
    triggerHitstop,
    triggerVignette,
    pushCallout,
    pushShockwave,
    pushEnemyKO,
    tickVisualFeel,
    tickSimFeel,
    computeCameraTarget
  };
}
