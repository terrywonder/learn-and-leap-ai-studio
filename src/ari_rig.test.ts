import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ARI_PROPORTIONS,
  solveTwoBoneIK,
  evaluateAriSkeleton,
  evaluateAriCape
} from './ari_rig.js';

test('Ari has fit, heroic athletic proportions (not squat chibi)', () => {
  const headToHeight = ARI_PROPORTIONS.headHeight / ARI_PROPORTIONS.totalHeight;
  assert.ok(headToHeight >= 0.19 && headToHeight <= 0.27, `expected athletic head ratio, got ${headToHeight}`);
  assert.ok(ARI_PROPORTIONS.shoulderWidth > ARI_PROPORTIONS.waistWidth, 'shoulders should V-taper to waist');
  assert.ok(ARI_PROPORTIONS.thighLen + ARI_PROPORTIONS.shinLen >= 46, 'athletic leg length');
});

test('solveTwoBoneIK maintains rigid limb segment lengths and forward knee bend', () => {
  const ik = solveTwoBoneIK(0, -54, 14, -10, 25, 24, 1);
  const d1 = Math.hypot(ik.joint.x - ik.root.x, ik.joint.y - ik.root.y);
  const d2 = Math.hypot(ik.end.x - ik.joint.x, ik.end.y - ik.joint.y);
  assert.ok(Math.abs(d1 - 25) < 0.05, `thigh length drifted: ${d1}`);
  assert.ok(Math.abs(d2 - 24) < 0.05, `shin length drifted: ${d2}`);
  assert.ok(ik.joint.x > (ik.root.x + ik.end.x) * 0.5, 'knee should bend forward toward +X');
});

test('run cycle has continuous 720-phase gait, alternating ground lock, and real knee flexion', () => {
  let frontPlanted = 0;
  let rearPlanted = 0;
  let maxKneeForward = -Infinity;

  for (let i = 0; i <= 720; i++) {
    const phase = (i / 720) * Math.PI * 2;
    const sk = evaluateAriSkeleton({ grounded: true, vx: 310, vy: 0, run: phase }, null, null, i * 16);
    assert.equal(sk.mode, 'run');
    const lowestSole = Math.max(sk.frontLeg.ankle.y, sk.rearLeg.ankle.y) + ARI_PROPORTIONS.footHeight;
    assert.ok(Math.abs(lowestSole) < 0.5, `lowest boot must stay ground-locked at phase ${i}, got ${lowestSole}`);
    if (sk.frontLeg.ankle.y > sk.rearLeg.ankle.y + 5) frontPlanted++;
    if (sk.rearLeg.ankle.y > sk.frontLeg.ankle.y + 5) rearPlanted++;
    maxKneeForward = Math.max(maxKneeForward, sk.frontLeg.knee.x - sk.frontLeg.hip.x);
    for (const pt of [sk.pelvis, sk.chest, sk.head, sk.frontLeg.knee, sk.rearLeg.knee, sk.frontArm.hand, sk.rearArm.hand]) {
      assert.ok(Number.isFinite(pt.x) && Number.isFinite(pt.y));
    }
  }
  assert.ok(frontPlanted > 150 && rearPlanted > 150, 'both feet alternate supporting weight');
  assert.ok(maxKneeForward > 10, `expected athletic forward knee drive, got ${maxKneeForward}`);
});

test('distinct silhouettes across idle, jump, fall, land, dash, cast, and hurt', () => {
  const idle = evaluateAriSkeleton({ grounded: true, vx: 0, vy: 0, run: 0 }, null, null, 1000);
  const jump = evaluateAriSkeleton({ grounded: false, vx: 210, vy: -420, run: 1 }, null, null, 1100);
  const fall = evaluateAriSkeleton({ grounded: false, vx: 210, vy: 430, run: 1 }, null, null, 1200);
  const land = evaluateAriSkeleton({ grounded: true, vx: 120, vy: 0, run: 1, land: 0.1 }, null, null, 1300);
  const dash = evaluateAriSkeleton({ grounded: true, vx: 540, vy: 0, run: 2 }, null, { dashTimer: 0.14 }, 1400);
  const cast = evaluateAriSkeleton({ grounded: true, vx: 0, vy: 0, run: 0, cast: 0.14 }, null, null, 1500);
  const hurt = evaluateAriSkeleton({ grounded: false, vx: -120, vy: -120, run: 0, hurt: 0.14 }, null, null, 1600);

  assert.equal(idle.mode, 'idle');
  assert.equal(jump.mode, 'jump');
  assert.equal(fall.mode, 'fall');
  assert.equal(land.mode, 'land');
  assert.equal(dash.mode, 'dash');
  assert.equal(cast.mode, 'cast');
  assert.equal(hurt.mode, 'hurt');

  // Landing crouches lower than idle
  assert.ok(land.pelvis.y > idle.pelvis.y + 4, 'landing crouch lowers pelvis');
  // Dash leans far forward
  assert.ok(dash.chest.tilt > 0.45, `dash should have deep forward sprint lean, got ${dash.chest.tilt}`);
  // Cast thrusts front hand forward with cast pose
  assert.equal(cast.frontArm.handPose, 'cast');
  assert.ok(cast.frontArm.hand.x > idle.frontArm.hand.x + 14, 'cast arm extends forward');
  // Jump tucks front knee higher than fall
  assert.ok(jump.frontLeg.ankle.y < fall.frontLeg.ankle.y, 'jump tucks front foot higher than fall');
  // Hurt recoils torso backward
  assert.ok(hurt.chest.tilt < 0, 'hurt arches torso backward');
});

test('multi-segment cape trails behind Ari and streams further during Spirit Dash', () => {
  const calm = evaluateAriCape(-5, -80, 'idle', 0, 0, false, 1000);
  const dash = evaluateAriCape(-5, -80, 'dash', 1.2, 0, true, 1000);
  assert.equal(calm.pts.length, 6);
  assert.equal(dash.pts.length, 6);
  const calmReach = calm.pts[0].x - calm.pts[5].x;
  const dashReach = dash.pts[0].x - dash.pts[5].x;
  assert.ok(dashReach > calmReach + 12, `cape should stream much further in dash (${dashReach} vs ${calmReach})`);
});
