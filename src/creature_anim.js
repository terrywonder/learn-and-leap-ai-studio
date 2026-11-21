/**
 * Learn & Leap AAA Character & Monster Motion Engine.
 * Pure, deterministic presentation kinematics:
 *  - Seamless species-specific monster locomotion (hopper, floater, strider) with true facing & turn easing
 *  - Grounded bottom-pivot squash-stretch & elastic shear (no torn rectangular cutouts)
 *  - Dramatic boss anticipation coil, impact slam lunge, and hurt recoil
 *  - Feet-anchored volume-preserving hero squash-stretch, dash streamline, smooth turn, & cast flare
 * Zero DOM/canvas dependency so it is 100% unit-testable via node:test.
 */

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smoothstep = (t) => {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
};

// Map enemy art index (1..10) to natural locomotion archetype
export function monsterArchetype(speciesIndex) {
  if (speciesIndex === 1 || speciesIndex === 6 || speciesIndex === 8) return 'hopper';
  if (speciesIndex === 2 || speciesIndex === 5 || speciesIndex === 9 || speciesIndex === 10) return 'floater';
  return 'strider';
}

/**
 * Compute smooth, grounded, non-awkward locomotion & squash-stretch for any enemy monster.
 * Mutates only presentation-only `_anim` scratch state on the enemy object (never touches physics).
 */
export function evaluateMonsterMotion(enemy, time = 0, player = null, speciesIndex = 1) {
  const e = enemy || { x: 0, phase: 0 };
  const anim = (e._anim ||= {
    lastX: e.x,
    facing: 1,
    turnScale: 1,
    lastTime: time,
    alert: 0,
    prevHopSin: 0
  });

  const dt = clamp(anim.lastTime > time ? 0.016 : (time - anim.lastTime) / 1000, 0, 0.06);
  anim.lastTime = time;

  const dx = e.x - anim.lastX;
  anim.lastX = e.x;

  // Determine natural facing direction (prefer real travel velocity; turn toward Ari if very close)
  const distToPlayer = player ? Math.abs((player.x || 0) - e.x) : 9999;
  const near = distToPlayer < 170;
  let desiredFacing = anim.facing;
  if (Math.abs(dx) > 0.08) {
    desiredFacing = dx > 0 ? 1 : -1;
  } else if (near && player) {
    desiredFacing = (player.x || 0) >= e.x ? 1 : -1;
  }

  if (desiredFacing !== anim.facing) {
    anim.facing = desiredFacing;
    anim.turnScale = 0.64; // brief smooth horizontal turn-compress instead of jarring mirror snap
  }
  anim.turnScale = lerp(anim.turnScale, 1, 1 - Math.exp(-dt * 14));

  // Smooth threat/alert ramp when Ari is near
  const alertTarget = near ? clamp(1 - distToPlayer / 185, 0.25, 1) : 0;
  anim.alert = lerp(anim.alert, alertTarget, 1 - Math.exp(-dt * 10));

  const archetype = monsterArchetype(speciesIndex);
  const phase = time * (archetype === 'hopper' ? 0.0046 : archetype === 'floater' ? 0.0034 : 0.0052) + (e.phase || 0) * 1.97;
  const wave = Math.sin(phase);
  const cosWave = Math.cos(phase);

  let hopY = 0;
  let scaleX = 1;
  let scaleY = 1;
  let shearX = 0;
  let tilt = 0;
  let justLanded = false;
  let footstep = false;

  if (archetype === 'hopper') {
    // True hop cycle: anticipation crouch -> parabolic arc -> airborne stretch -> landing cushion
    const cyclePos = ((phase % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const norm = cyclePos / (Math.PI * 2);
    if (norm < 0.22) {
      // Anticipation crouch before leaping
      const c = Math.sin((norm / 0.22) * Math.PI);
      hopY = 0;
      scaleY = 1 - 0.13 * c;
      scaleX = 1 + 0.12 * c;
      shearX = 0.04 * c;
    } else if (norm < 0.78) {
      // Parabolic flight arc
      const airT = (norm - 0.22) / 0.56;
      const parabola = 4 * airT * (1 - airT);
      hopY = -20 * parabola * (1 + anim.alert * 0.28);
      // Stretch up at launch & descent, relax near apex
      const edgeStretch = Math.abs(airT - 0.5) * 2;
      scaleY = 1 + 0.11 * edgeStretch;
      scaleX = 1 - 0.08 * edgeStretch;
      tilt = (airT - 0.5) * 0.16;
    } else {
      // Soft landing recovery squash
      const landT = (norm - 0.78) / 0.22;
      const impact = Math.sin((1 - landT) * Math.PI * 0.5);
      hopY = 0;
      scaleY = 1 - 0.14 * impact;
      scaleX = 1 + 0.13 * impact;
    }
    if (anim.prevHopSin > 0.76 && norm >= 0.78) justLanded = true;
    anim.prevHopSin = norm;
  } else if (archetype === 'floater') {
    // Weightless mystical hover with figure-8 sway and gentle banking tilt
    hopY = -14 - Math.sin(phase) * 7.5;
    const breath = Math.sin(phase * 1.5);
    scaleY = 1 + breath * 0.045;
    scaleX = 1 - breath * 0.035;
    tilt = 0.075 * Math.sin(phase * 0.7) + clamp(dx * 0.025, -0.1, 0.1);
    shearX = 0.03 * cosWave;
  } else {
    // Grounded heavy strider: rhythmic step bounce, weight-transfer shear, zero torn cutouts
    const stepBounce = Math.abs(wave);
    hopY = -stepBounce * 5.5;
    scaleY = 1 + (stepBounce - 0.45) * 0.07;
    scaleX = 1 - (stepBounce - 0.45) * 0.055;
    shearX = wave * 0.075;
    tilt = wave * 0.045;
    if (Math.sign(wave) !== Math.sign(anim.prevHopSin) && Math.abs(dx) > 0.05) {
      footstep = true;
    }
    anim.prevHopSin = wave;
  }

  // Add subtle alert crouch & aggressive lean when Ari approaches
  if (anim.alert > 0.05) {
    const pulse = 0.5 + 0.5 * Math.sin(time * 0.012);
    scaleY *= 1 - anim.alert * 0.05 * pulse;
    scaleX *= 1 + anim.alert * 0.05 * pulse;
    shearX += anim.alert * 0.075;
    tilt += anim.alert * 0.045;
  }

  const shadowScale = clamp(1 + hopY / 72, 0.55, 1.08);
  const shadowAlpha = clamp(0.46 + hopY / 110, 0.18, 0.5);

  return {
    archetype,
    facing: anim.facing,
    turnScale: anim.turnScale,
    hopY,
    scaleX: clamp(scaleX, 0.82, 1.2),
    scaleY: clamp(scaleY, 0.82, 1.2),
    shearX: clamp(shearX, -0.16, 0.16),
    tilt: clamp(tilt, -0.22, 0.22),
    alert: anim.alert,
    shadowScale,
    shadowAlpha,
    justLanded,
    footstep
  };
}

/**
 * Compute dramatic, seamless motion for World 2–10 Bosses (and aura cues for Rootkeeper).
 * Synced directly to gameplay state.bossPulse, state.bossHurt, and state.bossDefeat.
 */
export function evaluateBossMotion(state, time = 0, worldIndex = 0, playerX = 0, bossX = 0) {
  const facing = playerX < bossX ? -1 : 1;
  const breath = Math.sin(time * 0.0028 + worldIndex);
  let scaleX = 1 - breath * 0.028;
  let scaleY = 1 + breath * 0.032;
  let shearX = Math.sin(time * 0.0019) * 0.025;
  let hopY = (worldIndex === 2 || worldIndex === 5 || worldIndex === 8 || worldIndex === 9)
    ? -10 - Math.sin(time * 0.0032) * 8
    : 0;
  let lean = 0;
  let chargeGlow = 0;
  let hurtFlash = 0;
  let defeatFade = 1;
  let mode = 'idle';

  if ((state?.bossDefeat || 0) > 0) {
    mode = 'defeat';
    const prog = clamp((0.95 - state.bossDefeat) / 0.95, 0, 1);
    defeatFade = clamp(1 - prog * 0.92, 0.08, 1);
    scaleY = lerp(1, 0.62, smoothstep(prog));
    scaleX = lerp(1, 1.22, smoothstep(prog));
    lean = -0.28 * prog;
  } else if ((state?.bossHurt || 0) > 0) {
    mode = 'hurt';
    const prog = clamp(state.bossHurt / 0.47, 0, 1);
    hurtFlash = prog;
    const recoil = Math.sin(prog * Math.PI);
    scaleX = 1 + 0.1 * recoil;
    scaleY = 1 - 0.09 * recoil;
    lean = -0.16 * recoil;
    shearX = -0.1 * recoil;
  } else if ((state?.bossPulse || 0) > 0) {
    mode = 'attack';
    const prog = clamp((1.15 - state.bossPulse) / 1.15, 0, 1);
    if (prog < 0.7) {
      // Dramatic wind-up coil + tremble before strike
      const w = smoothstep(prog / 0.7);
      const tremble = Math.sin(time * 0.055) * 0.025 * w;
      scaleY = lerp(1, 0.87, w);
      scaleX = lerp(1, 1.12, w);
      shearX = -0.09 * w + tremble;
      lean = -0.08 * w;
      chargeGlow = w;
    } else {
      // Explosive slam / lunge forward
      const s = smoothstep((prog - 0.7) / 0.3);
      const punch = Math.sin(s * Math.PI);
      scaleY = 1 + 0.11 * punch;
      scaleX = 1 - 0.08 * punch;
      shearX = 0.14 * punch;
      lean = 0.15 * punch;
      hopY -= 12 * punch;
      chargeGlow = 1 - s * 0.5;
    }
  }

  return {
    mode,
    facing,
    scaleX: clamp(scaleX, 0.78, 1.24),
    scaleY: clamp(scaleY, 0.6, 1.2),
    shearX: clamp(shearX, -0.2, 0.2),
    lean: clamp(lean, -0.32, 0.25),
    hopY,
    chargeGlow,
    hurtFlash,
    defeatFade
  };
}

/**
 * Presentation-only AAA motion polish for Ari (Hero).
 * Anchored at feet pivot so landing squash NEVER lifts boots off the ground.
 * Preserves 100% of v14.6 articulated foot-rig math in animation.js.
 */
export function evaluateHeroMotionFX(player, pose, feel = null, time = 0, groundY = null, scratch = null) {
  const p = player || { x: 0, y: 0, h: 62, vx: 0, vy: 0, face: 1, grounded: true, cast: 0, land: 0 };
  const st = scratch || (p._heroFX ||= { lastFace: p.face || 1, turnScale: 1, lastTime: time });
  const dt = clamp(st.lastTime > time ? 0.016 : (time - st.lastTime) / 1000, 0, 0.06);
  st.lastTime = time;

  const face = p.face === -1 ? -1 : 1;
  if (face !== st.lastFace) {
    st.lastFace = face;
    st.turnScale = 0.72; // crisp volume-conserving pivot turn
  }
  st.turnScale = lerp(st.turnScale, 1, 1 - Math.exp(-dt * 18));

  const dashing = (feel?.dashTimer || 0) > 0;
  const grounded = Boolean(p.grounded);
  const vy = p.vy || 0;
  const speedRatio = clamp(Math.abs(p.vx || 0) / 315, 0, 1.2);

  let scaleY = pose?.squash ?? 1;
  let scaleX = 1 / Math.sqrt(clamp(scaleY, 0.75, 1.25));
  let extraLean = 0;
  let capeBoost = 0;

  if (dashing) {
    // Sleek aerodynamic Spirit Dash silhouette
    scaleX = 1.13;
    scaleY = 0.90;
    extraLean = 0.22;
    capeBoost = 0.34;
  } else if (!grounded) {
    // Graceful upward launch stretch and soft fall anticipation
    if (vy < -140) {
      const rise = clamp((-vy - 140) / 480, 0, 1);
      scaleY = 1 + 0.08 * rise;
      scaleX = 1 - 0.055 * rise;
      extraLean = 0.06 * speedRatio;
      capeBoost = 0.22 * rise;
    } else if (vy > 220) {
      const fall = clamp((vy - 220) / 520, 0, 1);
      scaleY = 1 + 0.055 * fall;
      scaleX = 1 - 0.04 * fall;
      extraLean = -0.04 * fall;
      capeBoost = 0.28 * fall;
    }
  } else if (speedRatio > 0.15) {
    // Subtle heroic forward momentum tilt when running fast
    extraLean = 0.045 * speedRatio;
    capeBoost = 0.16 * speedRatio;
  }

  const castGlow = clamp((p.cast || 0) / 0.28, 0, 1);
  if (castGlow > 0) {
    const recoil = Math.sin(castGlow * Math.PI);
    extraLean -= 0.08 * recoil;
    scaleX *= 1 + 0.04 * recoil;
  }

  // Height-responsive grounded shadow
  const feetY = (p.y || 0) + (p.h || 62);
  const heightAboveGround = groundY !== null ? Math.max(0, groundY - feetY) : (grounded ? 0 : 48);
  const shadowScale = clamp(1 - heightAboveGround / 280, 0.32, 1.05) * scaleX;
  const shadowAlpha = clamp(0.52 - heightAboveGround / 360, 0.12, 0.52);

  return {
    scaleX: clamp(scaleX, 0.85, 1.18),
    scaleY: clamp(scaleY, 0.84, 1.14),
    turnScale: clamp(st.turnScale, 0.65, 1),
    extraLean: clamp(extraLean, -0.2, 0.28),
    capeBoost,
    castGlow,
    dashing,
    shadowScale,
    shadowAlpha
  };
}
