import test from 'node:test';
import assert from 'node:assert/strict';
import {
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
  tickVisualFeel,
  tickSimFeel,
  computeCameraTarget
} from './adventure_feel.js';

test('coyote time allows jump shortly after leaving ground', () => {
  const feel = createFeelState();
  const player = { x: 100, y: 400, h: 62, vx: 120, vy: 20, grounded: true, face: 1, inv: 0, land: 0 };
  tickSimFeel(feel, player, 0.016);
  assert.equal(feel.coyoteTimer, FEEL_CONFIG.coyoteDuration);

  // Player walks off ledge
  player.grounded = false;
  tickSimFeel(feel, player, 0.06);
  assert(feel.coyoteTimer > 0, 'coyote time should still be active');

  queueJump(feel);
  const kind = consumeJump(feel, player);
  assert.equal(kind, 'ground');
  assert.equal(player.vy, FEEL_CONFIG.jumpVelocity);
  assert.equal(feel.coyoteTimer, 0);
});

test('double jump works once in mid-air and resets upon landing', () => {
  const feel = createFeelState();
  const player = { x: 100, y: 360, h: 62, vx: 0, vy: -200, grounded: false, face: 1, inv: 0, land: 0 };
  feel.coyoteTimer = 0;

  queueJump(feel);
  assert.equal(consumeJump(feel, player), 'double');
  assert.equal(player.vy, FEEL_CONFIG.doubleJumpVelocity);
  assert.equal(feel.airJumpsLeft, 0);

  // Second air jump should be denied
  queueJump(feel);
  assert.equal(consumeJump(feel, player), null);

  // Landing resets air jumps
  player.grounded = true;
  tickSimFeel(feel, player, 0.016);
  assert.equal(feel.airJumpsLeft, 1);
});

test('variable jump cut reduces upward velocity when ascending', () => {
  const player = { grounded: false, vy: -600 };
  assert.equal(applyVariableJumpCut(player), true);
  assert.equal(player.vy, -600 * FEEL_CONFIG.jumpCutMultiplier);

  // Falling player is unaffected
  const falling = { grounded: false, vy: 240 };
  assert.equal(applyVariableJumpCut(falling), false);
  assert.equal(falling.vy, 240);
});

test('spirit dash grants burst speed, brief invulnerability, and enforces cooldown', () => {
  const feel = createFeelState();
  const player = { x: 200, y: 450, h: 62, vx: 0, vy: 0, grounded: true, face: 1, inv: 0 };

  assert.equal(triggerDash(feel, player, -1), true);
  assert.equal(player.face, -1);
  assert.equal(player.vx, -FEEL_CONFIG.dashSpeed);
  assert(player.inv >= FEEL_CONFIG.dashInvuln);
  assert(feel.dashCooldown > 0);

  // Immediate re-trigger is blocked by cooldown
  assert.equal(triggerDash(feel, player, 1), false);

  // Advance past cooldown
  for (let i = 0; i < 60; i++) tickSimFeel(feel, player, 0.02);
  assert.equal(feel.dashCooldown, 0);
  assert.equal(triggerDash(feel, player, 1), true);
});

test('hitstop freezes simulation delta while trauma shake decays cleanly', () => {
  const feel = createFeelState();
  addTrauma(feel, 0.8);
  triggerHitstop(feel, true);

  const shake = getShakeOffset(feel, 123);
  assert(Number.isFinite(shake.x) && Number.isFinite(shake.y));

  const step1 = tickVisualFeel(feel, 0.02);
  assert.equal(step1.frozen, true);
  assert.equal(step1.simDt, 0);
  assert(feel.trauma < 0.8, 'trauma should decay even during hitstop');

  // After hitstop expires, simulation resumes
  tickVisualFeel(feel, 0.05);
  const step3 = tickVisualFeel(feel, 0.016);
  assert.equal(step3.frozen, false);
  assert.equal(step3.simDt, 0.016);
});

test('combo streak increments, tracks max, and resets after timeout', () => {
  const feel = createFeelState();
  const player = { x: 100, y: 400, h: 62, vx: 0, vy: 0, grounded: true, face: 1, inv: 0 };
  assert.equal(registerCombo(feel), 1);
  assert.equal(registerCombo(feel), 2);
  assert.equal(registerCombo(feel), 3);
  assert.equal(feel.maxComboReached, 3);

  // Decay past comboWindow
  for (let i = 0; i < 200; i++) tickSimFeel(feel, player, 0.02);
  assert.equal(feel.combo, 0);
  assert.equal(feel.maxComboReached, 3);

  resetFeelState(feel, { world: 'WORLD 01', title: 'First Light', subtitle: 'Begin' });
  assert.equal(feel.maxComboReached, 0);
  assert.equal(feel.bannerTitle, 'First Light');
});

test('camera look-ahead clamps cleanly within level bounds', () => {
  assert.equal(computeCameraTarget(100, -125, 5000, 1280), 0);
  assert.equal(computeCameraTarget(4950, 125, 5000, 1280), 5000 - 1280);
  const mid = computeCameraTarget(2000, 125, 5000, 1280);
  assert.equal(mid, 2000 - 420 + 125);
});
