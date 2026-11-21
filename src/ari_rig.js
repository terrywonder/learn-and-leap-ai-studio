/**
 * Learn & Leap AAA Fit Hero Skeleton & Articulated Movement Engine (Ari v16).
 * Pure, deterministic 2-bone IK/FK kinematics + flowing multi-segment cloth physics.
 * Zero DOM/Canvas dependency — 100% unit-testable via node:test.
 */

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const lerp = (a, b, t) => a + (b - a) * t;
const TAU = Math.PI * 2;

// Heroic athletic proportions (~4.5 heads tall: tall lean torso, strong legs, agile silhouette)
// Coordinate frame: origin (0, 0) is ground contact directly under Ari's center; -Y is UP, +X is FORWARD.
export const ARI_PROPORTIONS = Object.freeze({
  totalHeight: 114,
  headHeight: 24,
  headWidth: 21,
  shoulderWidth: 25,
  waistWidth: 15.5,
  hipHeight: 56,
  torsoLen: 30,
  neckLen: 5.5,
  thighLen: 25.5,
  shinLen: 24.5,
  footHeight: 6.5,
  footLen: 16.5,
  upperArmLen: 17,
  forearmLen: 16
});

/**
 * Analytic 2-bone Inverse Kinematics solver in 2D.
 * bendDir: +1 bends joint toward +X (e.g. forward-pointing knee when facing right),
 *          -1 bends joint toward -X (e.g. backward-pointing elbow).
 */
export function solveTwoBoneIK(rx, ry, tx, ty, l1, l2, bendDir = 1) {
  const dx = tx - rx;
  const dy = ty - ry;
  const rawDist = Math.hypot(dx, dy);
  const minDist = Math.abs(l1 - l2) + 0.5;
  const maxDist = l1 + l2 - 0.15;
  const dist = clamp(rawDist, minDist, maxDist);

  const baseAngle = Math.atan2(dy, dx);
  const cosA = clamp((l1 * l1 + dist * dist - l2 * l2) / (2 * l1 * dist), -1, 1);
  const angleA = Math.acos(cosA);

  const jointAngle = baseAngle - bendDir * angleA;
  const jx = rx + Math.cos(jointAngle) * l1;
  const jy = ry + Math.sin(jointAngle) * l1;

  const ex = rawDist > maxDist ? rx + (dx / (rawDist || 1)) * maxDist : tx;
  const ey = rawDist > maxDist ? ry + (dy / (rawDist || 1)) * maxDist : ty;

  return {
    root: { x: rx, y: ry },
    joint: { x: jx, y: jy },
    end: { x: ex, y: ey }
  };
}

/**
 * Forward Kinematics helper for 2-bone arms.
 * shoulderAngle: radians from straight down (+Y is 0, +angle swings forward toward +X, -angle swings back toward -X).
 * elbowBend: positive radians bends forearm forward/upward naturally.
 */
export function solveTwoBoneArmFK(sx, sy, l1, l2, shoulderAngle, elbowBend) {
  const bend = clamp(elbowBend, 0.06, 2.35);
  const ex = sx + Math.sin(shoulderAngle) * l1;
  const ey = sy + Math.cos(shoulderAngle) * l1;
  const foreAngle = shoulderAngle + bend;
  const hx = ex + Math.sin(foreAngle) * l2;
  const hy = ey + Math.cos(foreAngle) * l2;
  return {
    shoulder: { x: sx, y: sy },
    elbow: { x: ex, y: ey },
    hand: { x: hx, y: hy },
    upperAngle: shoulderAngle,
    foreAngle
  };
}

/**
 * Multi-segment flowing cape & crimson scarf wave solver with natural gravity drape when calm.
 */
export function evaluateAriCape(anchorX, anchorY, mode, speedRatio, vy, dashing, time) {
  const nodes = 6;
  const segLen = dashing ? 12.6 : 10.4;
  const wind = dashing ? 1.85 : clamp(0.18 + speedRatio * 1.12, 0.16, 1.45);
  const fallLift = clamp((vy || 0) / 460, -0.5, 0.95);
  const freq = dashing ? 0.022 : 0.0075 + speedRatio * 0.007;
  const pts = [{ x: anchorX, y: anchorY }];

  let px = anchorX;
  let py = anchorY;
  for (let i = 1; i < nodes; i++) {
    const frac = i / (nodes - 1);
    const wave = Math.sin(time * freq - i * 0.92) * (2.2 + wind * 5.0) * frac;
    const flutter = Math.cos(time * freq * 1.65 - i * 1.15) * (1.0 + wind * 1.8) * frac;
    // Calm idle drapes gracefully down-and-back; sprint/dash billows horizontally!
    const backPull = lerp(0.32, 0.98, clamp(wind * 0.78, 0, 1));
    const droop = dashing
      ? -0.08 + wave * 0.015
      : clamp(0.95 - wind * 0.68 - fallLift * 0.65, -0.52, 0.96);
    const dirLen = Math.hypot(backPull, droop) || 1;
    px -= (backPull / dirLen) * segLen;
    py += (droop / dirLen) * segLen + wave * 0.34 + flutter * 0.16;
    pts.push({ x: px, y: py });
  }

  // Soft S-curved scarf ribbon that drapes gently down in idle and streams smoothly in sprint/dash
  const tail = [{ x: anchorX + 1, y: anchorY + 1 }];
  let tx = anchorX + 1;
  let ty = anchorY + 1;
  for (let i = 1; i < 5; i++) {
    const frac = i / 4;
    const wave = Math.sin(time * (freq * 1.18) - i * 1.1 + 0.8) * (2.6 + wind * 4.5) * frac;
    const tailBack = lerp(4.2, 11.4, clamp(wind * 0.72, 0, 1));
    const tailDrop = dashing ? -1.4 : lerp(7.8, -0.8, clamp(wind * 0.78 + Math.max(0, fallLift) * 0.45, 0, 1));
    tx -= tailBack;
    ty += tailDrop + wave * 0.42;
    tail.push({ x: tx, y: ty });
  }

  return { pts, tail };
}

/**
 * Evaluate Ari's full-body athletic articulated skeleton for any frame.
 */
export function evaluateAriSkeleton(player, pose = null, feel = null, time = 0) {
  const p = player || { vx: 0, vy: 0, grounded: true, run: 0, land: 0, cast: 0, hurt: 0, face: 1 };
  const P = ARI_PROPORTIONS;
  const grounded = Boolean(p.grounded);
  const vxAbs = Math.abs(p.vx || 0);
  const vy = p.vy || 0;
  const speedRatio = clamp(vxAbs / 295, 0, 1.25);
  const dashing = Boolean((feel?.dashTimer || 0) > 0);
  const landFrac = clamp((p.land || 0) / 0.19, 0, 1);
  const castFrac = clamp((p.cast || 0) / 0.28, 0, 1);
  const hurtFrac = clamp((p.hurt || 0) / 0.25, 0, 1);
  const cycle = Number(p.run) || 0;

  let mode = 'idle';
  if (hurtFrac > 0) mode = 'hurt';
  else if (castFrac > 0) mode = 'cast';
  else if (dashing) mode = 'dash';
  else if (!grounded) mode = vy > 75 ? 'fall' : 'jump';
  else if (landFrac > 0) mode = 'land';
  else if (speedRatio > 0.08) mode = 'run';

  const breath = Math.sin(time * 0.003);
  const blinkCycle = (time * 0.001) % 4.1;
  const blink = blinkCycle > 3.94 && mode !== 'hurt' && mode !== 'cast' ? 1 : 0;

  let pelvisX = 0;
  let pelvisY = -P.hipHeight;
  let torsoTilt = 0.04;
  let torsoTwist = 0;
  let headTilt = 0;
  let hairSway = Math.sin(time * 0.0038) * 0.07;
  let expression = 'focused';

  const soleGroundY = -P.footHeight;
  let frontFootX = 10;
  let frontFootY = soleGroundY;
  let frontFootAngle = 0;
  let rearFootX = -10;
  let rearFootY = soleGroundY;
  let rearFootAngle = 0;

  let frontShoulderA = -0.18;
  let frontElbowB = 0.36;
  let rearShoulderA = 0.28;
  let rearElbowB = 0.28;
  let frontHandPose = 'relaxed';
  let rearHandPose = 'relaxed';

  if (mode === 'idle') {
    // Tall, confident, fit ranger stance (upright legs with natural slight poise — no awkward half-squat!)
    const sway = Math.sin(time * 0.002);
    pelvisY = -P.hipHeight + breath * 0.9;
    pelvisX = sway * 0.7;
    torsoTilt = 0.03 + breath * 0.012;
    torsoTwist = 0.28;
    headTilt = -0.02 + Math.sin(time * 0.0016) * 0.02;
    frontFootX = 9.5;
    frontFootY = soleGroundY;
    frontFootAngle = 0.0;
    rearFootX = -9.5;
    rearFootY = soleGroundY;
    rearFootAngle = -0.02;
    // Clear, open athletic arm framing: front arm poised slightly back at hip, rear arm gently forward
    frontShoulderA = -0.26 + breath * 0.03;
    frontElbowB = 0.42 + breath * 0.035;
    rearShoulderA = 0.32 - breath * 0.025;
    rearElbowB = 0.34;
    frontHandPose = 'fist';
    rearHandPose = 'relaxed';
  } else if (mode === 'run') {
    // Explosive athletic sprint: tall bounding drive, wide stride, clear opposite-arm pump!
    const cadence = clamp(speedRatio, 0.22, 1.15);
    const phase = ((cycle % TAU) + TAU) % TAU;
    const strideLen = 23.0 * clamp(cadence, 0.45, 1.12);
    const liftHeight = 18.0 * clamp(cadence, 0.42, 1.12);

    const bounce = Math.cos(phase * 2);
    pelvisY = -P.hipHeight + 3.2 + bounce * 4.5 * cadence;
    pelvisX = 2.8 * cadence;
    torsoTilt = 0.20 + 0.14 * cadence + Math.sin(phase * 2) * 0.03;
    torsoTwist = Math.cos(phase) * 0.55;
    headTilt = -torsoTilt * 0.45;
    hairSway = 0.38 + 0.38 * cadence + Math.sin(phase * 2) * 0.14;
    expression = 'determined';

    const computeFoot = (pRad) => {
      const s = Math.sin(pRad);
      const c = Math.cos(pRad);
      const fx = c * strideLen + 2.0;
      let fy = soleGroundY;
      let fAng = 0;
      if (s < 0) {
        const airLift = Math.pow(-s, 0.82);
        fy = soleGroundY - airLift * liftHeight;
        fAng = c < 0 ? 0.52 * airLift : -0.18 * airLift;
      } else {
        fy = soleGroundY;
        fAng = c < -0.52 ? clamp((-c - 0.52) * 0.72, 0, 0.32) : 0;
      }
      return { x: fx, y: fy, angle: fAng, grounded: s >= 0 };
    };

    const fFoot = computeFoot(phase);
    const rFoot = computeFoot(phase + Math.PI);
    frontFootX = fFoot.x;
    frontFootY = fFoot.y;
    frontFootAngle = fFoot.angle;
    rearFootX = rFoot.x;
    rearFootY = rFoot.y;
    rearFootAngle = rFoot.angle;

    // Wide readable athletic arm pumping (front & rear clearly counter-swing across torso!)
    const armSwing = Math.cos(phase + Math.PI) * (0.94 * cadence + 0.22);
    frontShoulderA = armSwing;
    frontElbowB = lerp(0.95, 1.56, clamp(0.5 + Math.cos(phase + Math.PI) * 0.5, 0, 1));
    rearShoulderA = -armSwing;
    rearElbowB = lerp(0.92, 1.52, clamp(0.5 - Math.cos(phase + Math.PI) * 0.5, 0, 1));
    frontHandPose = 'fist';
    rearHandPose = 'fist';
  } else if (mode === 'jump') {
    // Dynamic heroic ascent: front knee tucked high, rear leg stretched down-back, arms sweeping open!
    const rise = clamp(-vy / 480, 0, 1);
    pelvisY = -P.hipHeight - 1;
    torsoTilt = 0.14 + speedRatio * 0.07 - rise * 0.05;
    torsoTwist = 0.42;
    headTilt = -0.10;
    hairSway = 0.28 + rise * 0.25;
    expression = 'determined';

    frontFootX = 16.5;
    frontFootY = soleGroundY - 22 - rise * 4;
    frontFootAngle = 0.30;
    rearFootX = -15.5;
    rearFootY = soleGroundY - 3;
    rearFootAngle = 0.48;

    // Front arm punches upward-forward; rear arm sweeps visibly back-down for dynamic silhouette!
    frontShoulderA = 0.96 + rise * 0.22;
    frontElbowB = 0.92;
    rearShoulderA = -1.02;
    rearElbowB = 0.55;
    frontHandPose = 'fist';
    rearHandPose = 'open';
  } else if (mode === 'fall') {
    const drop = clamp(vy / 520, 0, 1);
    pelvisY = -P.hipHeight + 1;
    torsoTilt = 0.10 - drop * 0.05;
    torsoTwist = -0.25;
    headTilt = 0.10;
    hairSway = -0.35 - drop * 0.35;
    expression = 'focused';

    frontFootX = 15;
    frontFootY = soleGroundY - 9;
    frontFootAngle = 0.18;
    rearFootX = -13;
    rearFootY = soleGroundY - 17;
    rearFootAngle = 0.36;

    frontShoulderA = 0.68;
    frontElbowB = 0.66;
    rearShoulderA = -1.18 - drop * 0.18;
    rearElbowB = 0.48;
    frontHandPose = 'open';
    rearHandPose = 'open';
  } else if (mode === 'land') {
    const impact = Math.sin(landFrac * Math.PI);
    pelvisY = -P.hipHeight + 13 * impact;
    pelvisX = 3 * impact;
    torsoTilt = 0.24 + 0.16 * impact;
    torsoTwist = 0.2;
    headTilt = -0.16 * impact;
    hairSway = 0.22 * impact;
    expression = 'effort';

    frontFootX = 15;
    frontFootY = soleGroundY;
    frontFootAngle = 0;
    rearFootX = -14;
    rearFootY = soleGroundY;
    rearFootAngle = 0.05;

    frontShoulderA = 0.42;
    frontElbowB = 0.95;
    rearShoulderA = -0.95;
    rearElbowB = 0.52;
    frontHandPose = 'fist';
    rearHandPose = 'open';
  } else if (mode === 'dash') {
    // Sleek anime-fantasy Spirit Dash lunge with trailing aerodynamic arm!
    pelvisY = -P.hipHeight + 10;
    pelvisX = 8;
    torsoTilt = 0.56;
    torsoTwist = 0.55;
    headTilt = -0.34;
    hairSway = 1.1;
    expression = 'determined';

    frontFootX = 21;
    frontFootY = grounded ? soleGroundY : soleGroundY - 8;
    frontFootAngle = grounded ? 0.02 : 0.25;
    rearFootX = -27;
    rearFootY = grounded ? soleGroundY - 11 : soleGroundY - 16;
    rearFootAngle = 0.62;

    frontShoulderA = 0.92;
    frontElbowB = 1.18;
    rearShoulderA = -1.32;
    rearElbowB = 0.22;
    frontHandPose = 'fist';
    rearHandPose = 'open';
  } else if (mode === 'cast') {
    // Powerful warrior-mage spellcast stance: wide grounded lunge, rear arm braced back, front palm thrust forward
    const surge = Math.sin(castFrac * Math.PI);
    pelvisY = -P.hipHeight + 6 * surge;
    pelvisX = 4 * surge;
    torsoTilt = 0.14 + 0.12 * surge;
    torsoTwist = 0.68 * surge;
    headTilt = -0.06 * surge;
    hairSway = 0.35 * surge;
    expression = 'cast';

    frontFootX = 16;
    frontFootY = grounded ? soleGroundY : soleGroundY - 12;
    frontFootAngle = 0;
    rearFootX = -17;
    rearFootY = grounded ? soleGroundY : soleGroundY - 6;
    rearFootAngle = 0.12;

    frontShoulderA = lerp(0.55, 1.50, surge);
    frontElbowB = lerp(0.82, 0.10, surge);
    rearShoulderA = -0.98 - 0.28 * surge;
    rearElbowB = 0.62;
    frontHandPose = 'cast';
    rearHandPose = 'fist';
  } else if (mode === 'hurt') {
    const recoil = Math.sin(hurtFrac * Math.PI);
    pelvisY = -P.hipHeight + 4 * recoil;
    pelvisX = -5 * recoil;
    torsoTilt = -0.26 * recoil;
    torsoTwist = -0.4;
    headTilt = -0.18 * recoil;
    hairSway = -0.5 * recoil;
    expression = 'hurt';

    frontFootX = 13;
    frontFootY = grounded ? soleGroundY : soleGroundY - 12;
    frontFootAngle = -0.15;
    rearFootX = -14;
    rearFootY = grounded ? soleGroundY : soleGroundY - 8;
    rearFootAngle = 0.2;

    frontShoulderA = 0.95;
    frontElbowB = 0.85;
    rearShoulderA = -1.05;
    rearElbowB = 0.55;
    frontHandPose = 'open';
    rearHandPose = 'open';
  }

  // Compute spinal chain (pelvis -> chest -> neck -> head)
  const sinT = Math.sin(torsoTilt);
  const cosT = Math.cos(torsoTilt);
  const chestX = pelvisX + sinT * P.torsoLen;
  const chestY = pelvisY - cosT * P.torsoLen;
  const neckX = chestX + sinT * P.neckLen;
  const neckY = chestY - cosT * P.neckLen;
  const headX = neckX + Math.sin(torsoTilt + headTilt) * (P.headHeight * 0.45);
  const headY = neckY - Math.cos(torsoTilt + headTilt) * (P.headHeight * 0.45);

  // Subtle shoulder depth offset from torsoTwist so arms swing cleanly around chest
  const frontHipX = pelvisX + 3.2;
  const frontHipY = pelvisY + 1.5;
  const rearHipX = pelvisX - 3.6;
  const rearHipY = pelvisY + 1.5;

  const frontShoulderX = chestX - 2 + torsoTwist * 4.5;
  const frontShoulderY = chestY + 4;
  const rearShoulderX = chestX + 3 - torsoTwist * 4.5;
  const rearShoulderY = chestY + 4.5;

  // Solve 2-bone IK for both legs (bendDir = +1 bends knee FORWARD toward +X)
  const fLegIK = solveTwoBoneIK(frontHipX, frontHipY, frontFootX, frontFootY, P.thighLen, P.shinLen, 1);
  const rLegIK = solveTwoBoneIK(rearHipX, rearHipY, rearFootX, rearFootY, P.thighLen, P.shinLen, 1);

  // Solve 2-bone FK for both arms
  const fArmFK = solveTwoBoneArmFK(frontShoulderX, frontShoulderY, P.upperArmLen, P.forearmLen, frontShoulderA, frontElbowB);
  const rArmFK = solveTwoBoneArmFK(rearShoulderX, rearShoulderY, P.upperArmLen, P.forearmLen, rearShoulderA, rearElbowB);

  // Ground lock correction: ensure lowest grounded foot sits squarely on y = 0
  const lowestSoleY = Math.max(fLegIK.end.y, rLegIK.end.y) + P.footHeight;
  const groundOffset = grounded ? -lowestSoleY : 0;

  const shiftPt = (pt) => ({ x: pt.x, y: pt.y + groundOffset });

  const capeAnchorX = chestX - 5;
  const capeAnchorY = chestY + 2 + groundOffset;
  const cape = evaluateAriCape(capeAnchorX, capeAnchorY, mode, speedRatio, vy, dashing, time);

  return {
    mode,
    proportions: P,
    groundOffset,
    pelvis: { x: pelvisX, y: pelvisY + groundOffset, tilt: torsoTilt },
    chest: { x: chestX, y: chestY + groundOffset, tilt: torsoTilt, breath, twist: torsoTwist },
    neck: { x: neckX, y: neckY + groundOffset },
    head: {
      x: headX,
      y: headY + groundOffset,
      tilt: torsoTilt * 0.42 + headTilt,
      blink,
      expression,
      hairSway
    },
    frontLeg: {
      hip: shiftPt(fLegIK.root),
      knee: shiftPt(fLegIK.joint),
      ankle: shiftPt(fLegIK.end),
      footAngle: frontFootAngle,
      grounded: frontFootY >= soleGroundY - 0.5
    },
    rearLeg: {
      hip: shiftPt(rLegIK.root),
      knee: shiftPt(rLegIK.joint),
      ankle: shiftPt(rLegIK.end),
      footAngle: rearFootAngle,
      grounded: rearFootY >= soleGroundY - 0.5
    },
    frontArm: {
      shoulder: shiftPt(fArmFK.shoulder),
      elbow: shiftPt(fArmFK.elbow),
      hand: shiftPt(fArmFK.hand),
      upperAngle: fArmFK.upperAngle,
      foreAngle: fArmFK.foreAngle,
      handPose: frontHandPose
    },
    rearArm: {
      shoulder: shiftPt(rArmFK.shoulder),
      elbow: shiftPt(rArmFK.elbow),
      hand: shiftPt(rArmFK.hand),
      upperAngle: rArmFK.upperAngle,
      foreAngle: rArmFK.foreAngle,
      handPose: rearHandPose
    },
    cape,
    castGlow: castFrac,
    dashing
  };
}
