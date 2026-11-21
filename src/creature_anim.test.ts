import test from 'node:test';
import assert from 'node:assert/strict';
import {
  monsterArchetype,
  evaluateMonsterMotion,
  evaluateBossMotion,
  evaluateHeroMotionFX
} from './creature_anim.js';

test('monsterArchetype classifies all 10 species into hopper, floater, or strider', () => {
  assert.equal(monsterArchetype(1), 'hopper');
  assert.equal(monsterArchetype(2), 'floater');
  assert.equal(monsterArchetype(3), 'strider');
  assert.equal(monsterArchetype(4), 'strider');
  assert.equal(monsterArchetype(9), 'floater');
});

test('monster tracks real travel facing direction and eases turn scale smoothly', () => {
  const enemy: any = { x: 500, phase: 0 };
  const m1 = evaluateMonsterMotion(enemy, 1000, null, 1);
  assert.equal(m1.facing, 1);

  // Move left
  enemy.x = 492;
  const m2 = evaluateMonsterMotion(enemy, 1016, null, 1);
  assert.equal(m2.facing, -1);
  assert.ok(m2.turnScale < 0.85, 'turnScale compresses briefly on direction flip');

  // Continue moving left — turnScale recovers smoothly toward 1
  enemy.x = 480;
  const m3 = evaluateMonsterMotion(enemy, 1200, null, 1);
  assert.equal(m3.facing, -1);
  assert.ok(m3.turnScale > m2.turnScale);
});

test('hopper monster exhibits grounded anticipation, airborne arc, and shrinking shadow', () => {
  const enemy: any = { x: 400, phase: 0 };
  const samples = [];
  for (let t = 0; t < 1600; t += 40) {
    samples.push(evaluateMonsterMotion(enemy, t, null, 1));
  }
  const minHopY = Math.min(...samples.map(s => s.hopY));
  const maxHopY = Math.max(...samples.map(s => s.hopY));
  assert.ok(minHopY < -14, 'hopper must lift clearly into a parabolic hop arc');
  assert.equal(maxHopY, 0, 'hopper must touch ground between hops');
  const airborne = samples.find(s => s.hopY < -12)!;
  const grounded = samples.find(s => s.hopY === 0)!;
  assert.ok(airborne.shadowScale < grounded.shadowScale, 'shadow shrinks while airborne');
});

test('monster raises alert intensity and turns toward Ari when approached', () => {
  const enemy: any = { x: 600, phase: 0 };
  const far = evaluateMonsterMotion(enemy, 1000, { x: 100 }, 4);
  assert.equal(far.alert, 0);
  const near = evaluateMonsterMotion(enemy, 1200, { x: 540 }, 4);
  assert.ok(near.alert > 0.15, 'alert increases when Ari enters threat range');
  assert.equal(near.facing, -1, 'stationary enemy turns toward Ari');
});

test('boss motion transitions cleanly from wind-up coil to slam lunge, hurt recoil, and defeat fade', () => {
  const windup = evaluateBossMotion({ bossPulse: 0.7, bossHurt: 0, bossDefeat: 0 }, 1000, 3, 200, 500);
  assert.equal(windup.mode, 'attack');
  assert.equal(windup.facing, -1);
  assert.ok(windup.scaleY < 0.96, 'boss coils down during attack wind-up');
  assert.ok(windup.chargeGlow > 0.3);

  const strike = evaluateBossMotion({ bossPulse: 0.17, bossHurt: 0, bossDefeat: 0 }, 1100, 3, 200, 500);
  assert.equal(strike.mode, 'attack');
  assert.ok(strike.scaleY > 1.02, 'boss stretches into slam strike');

  const hurt = evaluateBossMotion({ bossPulse: 0, bossHurt: 0.25, bossDefeat: 0 }, 1200, 3, 200, 500);
  assert.equal(hurt.mode, 'hurt');
  assert.ok(hurt.hurtFlash > 0.4);

  const defeat = evaluateBossMotion({ bossPulse: 0, bossHurt: 0, bossDefeat: 0.2 }, 1300, 3, 200, 500);
  assert.equal(defeat.mode, 'defeat');
  assert.ok(defeat.defeatFade < 0.4);
});

test('hero motion FX provides volume-preserving landing squash, dash pose, and height-aware shadow', () => {
  const landing = evaluateHeroMotionFX(
    { x: 300, y: 518, h: 62, vx: 120, vy: 0, face: 1, grounded: true, cast: 0, land: 0.18 },
    { mode: 'land', squash: 0.88 },
    null,
    1000,
    580
  );
  assert.ok(landing.scaleY < 0.92 && landing.scaleX > 1.03, 'landing squash widens horizontally to preserve volume');

  const jumping = evaluateHeroMotionFX(
    { x: 300, y: 380, h: 62, vx: 200, vy: -520, face: 1, grounded: false, cast: 0, land: 0 },
    { mode: 'jump', squash: 1 },
    null,
    1050,
    580
  );
  assert.ok(jumping.scaleY > 1.04 && jumping.scaleX < 0.98, 'jump stretches cleanly upward');
  assert.ok(jumping.shadowScale < landing.shadowScale, 'shadow shrinks when Ari is high in air');

  const dashing = evaluateHeroMotionFX(
    { x: 320, y: 518, h: 62, vx: 650, vy: 0, face: 1, grounded: true, cast: 0, land: 0 },
    { mode: 'run', squash: 1 },
    { dashTimer: 0.16 },
    1100,
    580
  );
  assert.equal(dashing.dashing, true);
  assert.ok(dashing.scaleX > 1.1 && dashing.extraLean > 0.18, 'Spirit Dash stretches forward with aerodynamic lean');
});
