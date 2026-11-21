/**
 * Learn & Leap AAA Pixar-Painterly Fit Athletic Ari Renderer (v16.3).
 * Combines Ari's beloved warm, friendly, cheerful painted face & fluffy hair
 * (assets/animation/ari/head-cheerful-v16.png) with a lean, fit, athletic
 * 2-bone IK/FK articulated body shaded in matching soft 3D painterly tones
 * (cream-white fitted tunic, chestnut leather harness & hip satchel, plush
 * crimson cape & neck scarf, smooth continuous deep sapphire-navy trousers,
 * cozy rolled cream-tan boot cuffs, and sculpted chestnut leather boots).
 */

const TAU = Math.PI * 2;
const SOFT_EDGE_WARM = 'rgba(66, 36, 22, 0.22)';
const SOFT_EDGE_NAVY = 'rgba(18, 34, 62, 0.22)';
const SOFT_EDGE_CRIMSON = 'rgba(84, 12, 22, 0.22)';

/** Draw a smoothly tapered 3D-shaded painterly limb capsule with soft sunlit rim & ambient underside. */
function drawPainterlyLimb(ctx, ax, ay, bx, by, rStart, rEnd, fillStyle, opts = {}) {
  const { rimColor = null, shadeColor = null, edgeColor = null, edgeWidth = 0.8 } = opts;
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  const ang = Math.atan2(dy, dx);

  ctx.save();
  ctx.translate(ax, ay);
  ctx.rotate(ang);

  ctx.beginPath();
  ctx.arc(0, 0, rStart, Math.PI * 0.5, Math.PI * 1.5);
  ctx.lineTo(len, -rEnd);
  ctx.arc(len, 0, rEnd, -Math.PI * 0.5, Math.PI * 0.5);
  ctx.closePath();
  ctx.fillStyle = fillStyle;
  ctx.fill();

  // Soft 3D cylindrical underside occlusion
  if (shadeColor) {
    ctx.save();
    ctx.clip();
    const sh = ctx.createLinearGradient(0, -rStart, 0, rStart);
    sh.addColorStop(0, 'rgba(0,0,0,0)');
    sh.addColorStop(0.55, 'rgba(0,0,0,0)');
    sh.addColorStop(1, shadeColor);
    ctx.fillStyle = sh;
    ctx.fillRect(-rStart - 1, -rStart - 1, len + rStart + rEnd + 2, (rStart + 1) * 2);
    ctx.restore();
  }

  // Warm sunlit painterly top rim
  if (rimColor) {
    ctx.strokeStyle = rimColor;
    ctx.lineWidth = 1.45;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(2.5, -rStart * 0.56);
    ctx.lineTo(len - 2.5, -rEnd * 0.56);
    ctx.stroke();
  }

  if (edgeColor) {
    ctx.strokeStyle = edgeColor;
    ctx.lineWidth = edgeWidth;
    ctx.lineJoin = 'round';
    ctx.stroke();
  }

  ctx.restore();
}

/** Draw flowing plush crimson cape mantle & ribbon tail matching original Ari's rich velvet scarlet. */
function drawCapeAndScarf(ctx, cape, ghostTint) {
  const pts = cape.pts;
  if (!pts || pts.length < 2) return;

  const topEdge = [];
  const botEdge = [];
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const next = pts[Math.min(pts.length - 1, i + 1)];
    const prev = pts[Math.max(0, i - 1)];
    const tx = next.x - prev.x;
    const ty = next.y - prev.y;
    const len = Math.hypot(tx, ty) || 1;
    const nx = ty / len;
    const ny = -tx / len;
    const frac = i / (pts.length - 1);
    const halfW = 4.6 + frac * 12.8;
    topEdge.push({ x: p.x - nx * (halfW * 0.34), y: p.y - ny * (halfW * 0.34) });
    botEdge.push({ x: p.x + nx * halfW, y: p.y + ny * halfW });
  }

  ctx.save();
  const tailEnd = pts[pts.length - 1];

  // Rich velvet underside fold for 3D depth
  if (!ghostTint) {
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y + 2);
    for (let i = 1; i < botEdge.length; i++) {
      ctx.lineTo(botEdge[i].x + 2, botEdge[i].y + 3.4);
    }
    ctx.lineTo(tailEnd.x + 4, tailEnd.y + 1.5);
    ctx.closePath();
    ctx.fillStyle = '#6c0d18';
    ctx.fill();
  }

  const capeGrad = ghostTint
    ? ghostTint
    : (() => {
        const g = ctx.createLinearGradient(pts[0].x, pts[0].y - 8, tailEnd.x, tailEnd.y + 20);
        g.addColorStop(0, '#ec333d');
        g.addColorStop(0.48, '#c71b28');
        g.addColorStop(1, '#870e1b');
        return g;
      })();

  ctx.beginPath();
  ctx.moveTo(topEdge[0].x, topEdge[0].y);
  for (let i = 1; i < topEdge.length; i++) {
    const prev = topEdge[i - 1];
    const cur = topEdge[i];
    ctx.quadraticCurveTo(prev.x, prev.y, (prev.x + cur.x) * 0.5, (prev.y + cur.y) * 0.5);
  }
  const lastTop = topEdge[topEdge.length - 1];
  const lastBot = botEdge[botEdge.length - 1];
  ctx.lineTo(lastTop.x, lastTop.y);
  ctx.lineTo((lastTop.x + lastBot.x) * 0.5 + 4.5, (lastTop.y + lastBot.y) * 0.5);
  ctx.lineTo(lastBot.x, lastBot.y);
  for (let i = botEdge.length - 2; i >= 0; i--) {
    const cur = botEdge[i];
    const nxt = botEdge[i + 1];
    ctx.quadraticCurveTo(nxt.x, nxt.y, (cur.x + nxt.x) * 0.5, (cur.y + nxt.y) * 0.5);
  }
  ctx.closePath();
  ctx.fillStyle = capeGrad;
  ctx.fill();

  if (!ghostTint) {
    // Soft sunlit coral-warm velvet highlight along top crest
    ctx.strokeStyle = 'rgba(255, 198, 178, 0.58)';
    ctx.lineWidth = 1.9;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(topEdge[0].x, topEdge[0].y + 1.4);
    for (let i = 1; i < topEdge.length; i++) ctx.lineTo(topEdge[i].x, topEdge[i].y + 1.4);
    ctx.stroke();

    // Subtle interior cloth crease shadow
    ctx.strokeStyle = 'rgba(98, 10, 22, 0.30)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y + 2);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y + 2.5);
    ctx.stroke();

    ctx.strokeStyle = SOFT_EDGE_CRIMSON;
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  // Soft flowing secondary scarf ribbon tail
  const tail = cape.tail;
  if (tail && tail.length > 2 && !ghostTint) {
    const tailGrad = ctx.createLinearGradient(tail[0].x, tail[0].y - 3, tail[tail.length - 1].x, tail[tail.length - 1].y + 4);
    tailGrad.addColorStop(0, '#f03e48');
    tailGrad.addColorStop(1, '#a91524');
    ctx.beginPath();
    ctx.moveTo(tail[0].x, tail[0].y - 2.3);
    for (let i = 1; i < tail.length; i++) {
      const prev = tail[i - 1];
      const cur = tail[i];
      ctx.quadraticCurveTo(prev.x, prev.y - 2.0, (prev.x + cur.x) * 0.5, (prev.y + cur.y) * 0.5 - 1.9 * (1 - i / 6));
    }
    const end = tail[tail.length - 1];
    ctx.lineTo(end.x, end.y + 0.5);
    for (let i = tail.length - 1; i >= 1; i--) {
      const cur = tail[i];
      const prev = tail[i - 1];
      ctx.quadraticCurveTo(cur.x, cur.y + 2.2, (prev.x + cur.x) * 0.5, (prev.y + cur.y) * 0.5 + 2.2 * (1 - i / 7));
    }
    ctx.closePath();
    ctx.fillStyle = tailGrad;
    ctx.fill();
  }
  ctx.restore();
}

/**
 * Draw an articulated 2-bone fit athletic leg in seamless deep sapphire-navy trousers
 * (no puppet knee seam or brown shin-guards!), cozy rolled cream-tan cuff & sculpted chestnut boot.
 */
function drawLeg(ctx, leg, isFront, ghostTint) {
  const { hip, knee, ankle, footAngle } = leg;

  // Boot cuff sits 62% down the shin — trousers stay clean sapphire-navy all the way to the cuff!
  const cuffFrac = 0.62;
  const cuffX = knee.x + (ankle.x - knee.x) * cuffFrac;
  const cuffY = knee.y + (ankle.y - knee.y) * cuffFrac;

  const thighFill = ghostTint
    ? ghostTint
    : (() => {
        const g = ctx.createLinearGradient(hip.x - 6, hip.y, knee.x + 6, knee.y);
        if (isFront) {
          g.addColorStop(0, '#1e3a62');
          g.addColorStop(0.5, '#335d94');
          g.addColorStop(1, '#5584be');
        } else {
          g.addColorStop(0, '#142642');
          g.addColorStop(0.58, '#23426e');
          g.addColorStop(1, '#345a8c');
        }
        return g;
      })();

  const shinTrouserFill = ghostTint
    ? ghostTint
    : (() => {
        const g = ctx.createLinearGradient(knee.x - 5, knee.y, cuffX + 5, cuffY);
        if (isFront) {
          g.addColorStop(0, '#36629a');
          g.addColorStop(0.55, '#2b4f80');
          g.addColorStop(1, '#1d375c');
        } else {
          g.addColorStop(0, '#24426e');
          g.addColorStop(1, '#172d4d');
        }
        return g;
      })();

  // Draw thigh and upper trouser shin without internal circle strokes so the knee looks like continuous fabric
  drawPainterlyLimb(ctx, hip.x, hip.y, knee.x, knee.y, 6.0, 4.7, thighFill, {
    rimColor: !ghostTint && isFront ? 'rgba(186, 222, 255, 0.34)' : null,
    shadeColor: !ghostTint ? 'rgba(10, 20, 40, 0.32)' : null,
    edgeColor: null,
  });

  drawPainterlyLimb(ctx, knee.x, knee.y, cuffX, cuffY, 4.65, 3.85, shinTrouserFill, {
    rimColor: !ghostTint && isFront ? 'rgba(176, 214, 255, 0.28)' : null,
    shadeColor: !ghostTint ? 'rgba(10, 20, 40, 0.30)' : null,
    edgeColor: null,
  });

  // Smooth trouser knee connector (blends thigh & shin seamlessly like real cloth!)
  if (!ghostTint) {
    ctx.save();
    const kneeGrad = ctx.createRadialGradient(knee.x + 1.2, knee.y - 0.8, 0.5, knee.x, knee.y, 4.9);
    if (isFront) {
      kneeGrad.addColorStop(0, '#5a89c2');
      kneeGrad.addColorStop(0.65, '#335d94');
      kneeGrad.addColorStop(1, 'rgba(30, 58, 98, 0)');
    } else {
      kneeGrad.addColorStop(0, '#355c8e');
      kneeGrad.addColorStop(0.65, '#23426e');
      kneeGrad.addColorStop(1, 'rgba(20, 38, 66, 0)');
    }
    ctx.fillStyle = kneeGrad;
    ctx.beginPath();
    ctx.arc(knee.x, knee.y, 4.8, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  // Lower boot shaft (cuff -> ankle) in rich chestnut leather
  const shaftFill = ghostTint
    ? ghostTint
    : (isFront ? '#6c3c1d' : '#4a2813');
  drawPainterlyLimb(ctx, cuffX, cuffY, ankle.x, ankle.y, 3.8, 3.6, shaftFill, {
    shadeColor: !ghostTint ? 'rgba(32, 14, 6, 0.34)' : null,
    edgeColor: null,
  });

  // Cozy rolled cream-tan boot cuff (iconic original Ari detail!)
  if (!ghostTint) {
    const shinAng = Math.atan2(ankle.y - knee.y, ankle.x - knee.x);
    ctx.save();
    ctx.translate(cuffX, cuffY);
    ctx.rotate(shinAng - Math.PI * 0.5);
    const cuffGrad = ctx.createLinearGradient(-5.5, -2.8, 5.5, 3.2);
    if (isFront) {
      cuffGrad.addColorStop(0, '#c6a47a');
      cuffGrad.addColorStop(0.48, '#f3e1c4');
      cuffGrad.addColorStop(1, '#fff6e4');
    } else {
      cuffGrad.addColorStop(0, '#927656');
      cuffGrad.addColorStop(0.6, '#c2a580');
      cuffGrad.addColorStop(1, '#d8be9a');
    }
    ctx.fillStyle = cuffGrad;
    ctx.beginPath();
    ctx.roundRect(-5.3, -2.7, 10.6, 5.4, 2.7);
    ctx.fill();
    ctx.strokeStyle = SOFT_EDGE_WARM;
    ctx.lineWidth = 0.7;
    ctx.stroke();
    ctx.restore();
  }

  // Sculpted 3D-shaded chestnut adventurer boot
  ctx.save();
  ctx.translate(ankle.x, ankle.y);
  ctx.rotate(footAngle);

  const bootGrad = ghostTint
    ? ghostTint
    : (() => {
        const g = ctx.createLinearGradient(-5, -6, 12, 6);
        if (isFront) {
          g.addColorStop(0, '#ab693a');
          g.addColorStop(0.45, '#7a4421');
          g.addColorStop(1, '#44220f');
        } else {
          g.addColorStop(0, '#784727');
          g.addColorStop(0.55, '#542e15');
          g.addColorStop(1, '#31170a');
        }
        return g;
      })();

  ctx.beginPath();
  ctx.moveTo(-4.5, -5.2);
  ctx.lineTo(3.6, -4.4);
  ctx.quadraticCurveTo(9.4, -1.6, 13.2, 2.2);
  ctx.quadraticCurveTo(14.2, 5.4, 11.4, 6.4);
  ctx.lineTo(-4.3, 6.4);
  ctx.quadraticCurveTo(-5.8, 5.2, -5.2, 1.4);
  ctx.closePath();
  ctx.fillStyle = bootGrad;
  ctx.fill();

  if (!ghostTint) {
    // Warm golden-ochre boot sole
    const soleGrad = ctx.createLinearGradient(-4, 4.4, 13, 6.6);
    soleGrad.addColorStop(0, isFront ? '#c9964e' : '#8f6934');
    soleGrad.addColorStop(1, isFront ? '#f0c87c' : '#b48b50');
    ctx.fillStyle = soleGrad;
    ctx.beginPath();
    ctx.moveTo(-4.7, 4.4);
    ctx.lineTo(13.0, 4.4);
    ctx.lineTo(11.8, 6.5);
    ctx.lineTo(-4.4, 6.5);
    ctx.closePath();
    ctx.fill();

    // Sunlit warm leather toe specular shine
    ctx.strokeStyle = 'rgba(255, 232, 196, 0.56)';
    ctx.lineWidth = 1.6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(4.0, -1.5);
    ctx.quadraticCurveTo(8.8, -0.2, 11.4, 2.0);
    ctx.stroke();

    // Subtle warm golden lace accents
    ctx.strokeStyle = isFront ? 'rgba(248, 206, 134, 0.72)' : 'rgba(196, 156, 98, 0.5)';
    ctx.lineWidth = 1.05;
    ctx.beginPath();
    ctx.moveTo(2.4, -2.9);
    ctx.lineTo(4.6, -2.0);
    ctx.moveTo(3.8, -1.2);
    ctx.lineTo(6.0, -0.3);
    ctx.stroke();

    ctx.strokeStyle = SOFT_EDGE_WARM;
    ctx.lineWidth = 0.75;
    ctx.beginPath();
    ctx.moveTo(-4.5, -5.2);
    ctx.lineTo(3.6, -4.4);
    ctx.quadraticCurveTo(9.4, -1.6, 13.2, 2.2);
    ctx.quadraticCurveTo(14.2, 5.4, 11.4, 6.4);
    ctx.lineTo(-4.3, 6.4);
    ctx.quadraticCurveTo(-5.8, 5.2, -5.2, 1.4);
    ctx.closePath();
    ctx.stroke();
  }
  ctx.restore();
}

/** Draw an articulated 2-bone arm with soft short cream sleeve, warm peach elbow/forearm & chestnut leather bracer/glove. */
function drawArm(ctx, arm, isFront, castGlow, ghostTint) {
  const { shoulder, elbow, hand, handPose } = arm;

  // Short cream-white linen sleeve (extends 72% down upper arm, revealing warm peach skin at elbow like original Ari!)
  const sleeveEndX = shoulder.x + (elbow.x - shoulder.x) * 0.72;
  const sleeveEndY = shoulder.y + (elbow.y - shoulder.y) * 0.72;

  const skinUpperFill = ghostTint
    ? ghostTint
    : (isFront ? '#f6c29a' : '#cfa07d');
  drawPainterlyLimb(ctx, sleeveEndX, sleeveEndY, elbow.x, elbow.y, 3.6, 3.4, skinUpperFill, {
    edgeColor: null,
  });

  const sleeveFill = ghostTint
    ? ghostTint
    : (() => {
        const g = ctx.createLinearGradient(shoulder.x - 4, shoulder.y - 3, sleeveEndX + 4, sleeveEndY + 3);
        if (isFront) {
          g.addColorStop(0, '#d2c9bc');
          g.addColorStop(0.5, '#f5f0e7');
          g.addColorStop(1, '#fffef9');
        } else {
          g.addColorStop(0, '#aba296');
          g.addColorStop(1, '#d9d1c5');
        }
        return g;
      })();

  drawPainterlyLimb(ctx, shoulder.x, shoulder.y, sleeveEndX, sleeveEndY, 4.9, 4.2, sleeveFill, {
    rimColor: !ghostTint && isFront ? 'rgba(255, 255, 250, 0.75)' : null,
    shadeColor: !ghostTint ? 'rgba(92, 74, 62, 0.20)' : null,
    edgeColor: ghostTint ? null : SOFT_EDGE_WARM,
  });

  // Warm peach forearm transitioning cleanly into chocolate-chestnut leather bracer
  const bracerFill = ghostTint
    ? ghostTint
    : (() => {
        const g = ctx.createLinearGradient(elbow.x, elbow.y, hand.x, hand.y);
        if (isFront) {
          g.addColorStop(0, '#ffd2ad');
          g.addColorStop(0.28, '#f2b88f');
          g.addColorStop(0.32, '#8b522e');
          g.addColorStop(0.75, '#683a1d');
          g.addColorStop(1, '#4c2812');
        } else {
          g.addColorStop(0, '#d6a17e');
          g.addColorStop(0.30, '#62381f');
          g.addColorStop(1, '#3d200f');
        }
        return g;
      })();

  drawPainterlyLimb(ctx, elbow.x, elbow.y, hand.x, hand.y, 3.55, 3.1, bracerFill, {
    rimColor: !ghostTint && isFront ? 'rgba(255, 224, 190, 0.42)' : null,
    shadeColor: !ghostTint ? 'rgba(42, 18, 8, 0.28)' : null,
    edgeColor: null,
  });

  // Sculpted leather bracer cuff rim
  if (!ghostTint) {
    const midX = elbow.x + (hand.x - elbow.x) * 0.34;
    const midY = elbow.y + (hand.y - elbow.y) * 0.34;
    const ang = Math.atan2(hand.y - elbow.y, hand.x - elbow.x);
    ctx.save();
    ctx.translate(midX, midY);
    ctx.rotate(ang);
    ctx.fillStyle = isFront ? '#a3683e' : '#73482a';
    ctx.beginPath();
    ctx.roundRect(-1.5, -3.7, 3.0, 7.4, 1.3);
    ctx.fill();
    ctx.restore();
  }

  // Friendly rounded adventurer glove / hand
  ctx.save();
  ctx.translate(hand.x, hand.y);
  const handGrad = ghostTint
    ? ghostTint
    : (() => {
        const g = ctx.createRadialGradient(-1, -1.5, 0.5, 0, 0, 5.2);
        if (isFront) {
          g.addColorStop(0, '#965c36');
          g.addColorStop(0.6, '#693b1f');
          g.addColorStop(1, '#442310');
        } else {
          g.addColorStop(0, '#724426');
          g.addColorStop(1, '#3a1d0d');
        }
        return g;
      })();

  if (handPose === 'cast') {
    ctx.fillStyle = handGrad;
    ctx.beginPath();
    ctx.ellipse(2, 0, 5.1, 3.9, -0.18, 0, TAU);
    ctx.fill();
    if (!ghostTint && castGlow > 0.05) {
      ctx.save();
      const r = 10 + (1 - castGlow) * 14;
      const glow = ctx.createRadialGradient(5, -1, 1, 5, -1, r * 1.9);
      glow.addColorStop(0, `rgba(255, 253, 224, ${(0.96 * castGlow).toFixed(2)})`);
      glow.addColorStop(0.45, `rgba(125, 249, 255, ${(0.75 * castGlow).toFixed(2)})`);
      glow.addColorStop(1, 'rgba(80, 210, 255, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(5, -1, r * 1.9, 0, TAU);
      ctx.fill();

      ctx.strokeStyle = `rgba(255, 242, 178, ${(0.9 * castGlow).toFixed(2)})`;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(5, -1, r, 0, TAU);
      ctx.stroke();
      ctx.restore();
    }
  } else {
    ctx.fillStyle = handGrad;
    ctx.beginPath();
    ctx.arc(0, 0, handPose === 'open' ? 4.2 : 4.0, 0, TAU);
    ctx.fill();
    if (!ghostTint) {
      // Warm sunlit peach fingers peeking out of fingerless adventurer glove (matching original Ari!)
      ctx.fillStyle = isFront ? '#ffd2ae' : '#d6a27e';
      ctx.beginPath();
      ctx.ellipse(1.9, 0.2, 2.2, 2.5, 0.1, 0, TAU);
      ctx.fill();
    }
  }
  ctx.restore();
}

/** Draw Ari's fit athletic torso in his iconic original warm cream tunic, brown leather harness, hip satchel & plush crimson neck scarf. */
function drawTorso(ctx, pelvis, chest, ghostTint) {
  const dx = chest.x - pelvis.x;
  const dy = chest.y - pelvis.y;
  const len = Math.hypot(dx, dy) || 29;
  const ang = Math.atan2(dx, -dy);

  ctx.save();
  ctx.translate(pelvis.x, pelvis.y);
  ctx.rotate(ang);

  const breathW = 1 + (chest.breath || 0) * 0.022;
  const shW = 11.8 * breathW;
  const waistW = 7.6;

  // Iconic warm sunlit cream-white fitted adventurer shirt (matching original Ari!)
  const tunicGrad = ghostTint
    ? ghostTint
    : (() => {
        const g = ctx.createLinearGradient(-shW, -len, shW, 2);
        g.addColorStop(0, '#c6bbb0');
        g.addColorStop(0.38, '#ebe4d8');
        g.addColorStop(0.78, '#fdfbf4');
        g.addColorStop(1, '#fffef9');
        return g;
      })();

  ctx.beginPath();
  ctx.moveTo(-waistW, 2);
  ctx.quadraticCurveTo(-waistW - 1.4, -len * 0.56, -shW, -len + 2);
  ctx.quadraticCurveTo(0, -len - 3.6, shW, -len + 2);
  ctx.quadraticCurveTo(waistW + 2.2, -len * 0.54, waistW, 2);
  ctx.quadraticCurveTo(0, 5.8, -waistW, 2);
  ctx.closePath();
  ctx.fillStyle = tunicGrad;
  ctx.fill();

  if (!ghostTint) {
    // Soft cloth shadow fold under the crimson scarf & chest
    ctx.save();
    ctx.clip();
    const chestShade = ctx.createLinearGradient(-shW, -len, shW * 0.6, -len * 0.2);
    chestShade.addColorStop(0, 'rgba(116, 98, 86, 0.24)');
    chestShade.addColorStop(0.5, 'rgba(164, 146, 132, 0.06)');
    chestShade.addColorStop(1, 'rgba(255, 252, 240, 0.22)');
    ctx.fillStyle = chestShade;
    ctx.fillRect(-shW - 2, -len - 4, shW * 2 + 4, len + 10);

    // Subtle soft tunic wrinkle
    ctx.strokeStyle = 'rgba(155, 138, 124, 0.26)';
    ctx.lineWidth = 1.15;
    ctx.beginPath();
    ctx.moveTo(-4, -len * 0.32);
    ctx.quadraticCurveTo(1, -len * 0.24, 6.5, -len * 0.34);
    ctx.stroke();
    ctx.restore();

    // Signature curved brown leather shoulder/chest harness strap (matching original Ari!)
    const strapGrad = ctx.createLinearGradient(-shW, -len, waistW, 0);
    strapGrad.addColorStop(0, '#5a3016');
    strapGrad.addColorStop(0.55, '#8c512a');
    strapGrad.addColorStop(1, '#582f15');
    ctx.strokeStyle = strapGrad;
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-shW + 3.0, -len + 4.4);
    ctx.quadraticCurveTo(-2.6, -len * 0.48, -waistW + 1.0, -2.8);
    ctx.stroke();

    // Cross-body diagonal adventurer strap
    ctx.strokeStyle = '#9c6334';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(shW - 3.0, -len + 5.2);
    ctx.quadraticCurveTo(2.0, -len * 0.42, -waistW + 1.5, -1.6);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255, 226, 178, 0.45)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(shW - 3.2, -len + 4.7);
    ctx.quadraticCurveTo(1.8, -len * 0.46, -waistW + 1.4, -2.2);
    ctx.stroke();

    // Warm ochre-brown leather tunic flap / hip skirt tab (matching original Ari!)
    const flapGrad = ctx.createLinearGradient(-waistW, 1, waistW, 9);
    flapGrad.addColorStop(0, '#6e3d1e');
    flapGrad.addColorStop(0.55, '#a8622d');
    flapGrad.addColorStop(1, '#c97c3b');
    ctx.fillStyle = flapGrad;
    ctx.beginPath();
    ctx.moveTo(-waistW + 0.4, 1.4);
    ctx.lineTo(waistW - 0.8, 1.4);
    ctx.lineTo(waistW + 1.2, 6.2);
    ctx.quadraticCurveTo(0, 8.8, -waistW - 2.6, 8.2);
    ctx.closePath();
    ctx.fill();

    // Fitted rich chestnut leather waist belt + glowing polished gold buckle
    const beltGrad = ctx.createLinearGradient(-waistW, -3.4, waistW, 2.2);
    beltGrad.addColorStop(0, '#4a2510');
    beltGrad.addColorStop(0.55, '#7c4420');
    beltGrad.addColorStop(1, '#582e14');
    ctx.fillStyle = beltGrad;
    ctx.beginPath();
    ctx.roundRect(-waistW - 0.8, -3.5, waistW * 2 + 1.6, 5.2, 2.0);
    ctx.fill();

    const buckleGrad = ctx.createLinearGradient(0, -3.8, 6.4, 2.2);
    buckleGrad.addColorStop(0, '#fff2b0');
    buckleGrad.addColorStop(0.5, '#f2bd4e');
    buckleGrad.addColorStop(1, '#a86f1c');
    ctx.fillStyle = buckleGrad;
    ctx.beginPath();
    ctx.roundRect(0.6, -3.8, 5.8, 5.8, 1.6);
    ctx.fill();
    ctx.fillStyle = '#5a3016';
    ctx.beginPath();
    ctx.roundRect(2.1, -2.3, 2.8, 2.8, 0.8);
    ctx.fill();

    // Cute 3D-shaded brown leather adventurer hip satchel / pack (iconic original Ari detail!)
    const pouchGrad = ctx.createLinearGradient(-waistW - 6.5, -5.5, -waistW + 2.5, 5.5);
    pouchGrad.addColorStop(0, '#965c32');
    pouchGrad.addColorStop(0.55, '#6c3e1e');
    pouchGrad.addColorStop(1, '#442410');
    ctx.fillStyle = pouchGrad;
    ctx.beginPath();
    ctx.roundRect(-waistW - 5.2, -4.4, 7.6, 9.2, 2.6);
    ctx.fill();
    // Satchel top flap + tiny brass clasp
    ctx.fillStyle = '#a86a3c';
    ctx.beginPath();
    ctx.roundRect(-waistW - 5.4, -4.6, 8.0, 3.8, 2.0);
    ctx.fill();
    ctx.fillStyle = '#f8d47b';
    ctx.beginPath();
    ctx.arc(-waistW - 1.4, -1.2, 1.15, 0, TAU);
    ctx.fill();

    // Soft torso edge definition
    ctx.strokeStyle = SOFT_EDGE_WARM;
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.moveTo(-waistW, 2);
    ctx.quadraticCurveTo(-waistW - 1.4, -len * 0.56, -shW, -len + 2);
    ctx.quadraticCurveTo(0, -len - 3.6, shW, -len + 2);
    ctx.quadraticCurveTo(waistW + 2.2, -len * 0.54, waistW, 2);
    ctx.stroke();

    // Plush wrapped crimson neck scarf (2 lush folds hugging snugly right beneath Ari's chin!)
    const scarfLower = ctx.createLinearGradient(-12, -len - 4, 13, -len + 6);
    scarfLower.addColorStop(0, '#8d111e');
    scarfLower.addColorStop(0.45, '#d7212e');
    scarfLower.addColorStop(1, '#f44750');
    ctx.fillStyle = scarfLower;
    ctx.beginPath();
    ctx.ellipse(1.2, -len - 0.6, 12.0, 5.8, 0.14, 0, TAU);
    ctx.fill();

    const scarfUpper = ctx.createLinearGradient(-11, -len - 9, 12, -len + 1);
    scarfUpper.addColorStop(0, '#a61423');
    scarfUpper.addColorStop(0.5, '#eb323d');
    scarfUpper.addColorStop(1, '#ff7d82');
    ctx.fillStyle = scarfUpper;
    ctx.beginPath();
    ctx.ellipse(0.8, -len - 3.6, 11.4, 5.2, 0.08, 0, TAU);
    ctx.fill();

    // Soft warm crease & coral specular sheen on scarf
    ctx.strokeStyle = 'rgba(105, 10, 22, 0.45)';
    ctx.lineWidth = 1.3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(1.2, -len - 2.2, 9.0, 0.18, Math.PI * 0.86);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 206, 198, 0.58)';
    ctx.lineWidth = 1.35;
    ctx.beginPath();
    ctx.arc(1.6, -len - 4.0, 7.2, 0.12, Math.PI * 0.72);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Draw Ari's beloved, warm, cheerful Pixar-painted head (head-cheerful-v16.png)
 * smoothly anchored onto his articulated neck & head rig with natural tilt & blink.
 */
function drawHead(ctx, neck, head, ghostTint, headImg) {
  ctx.save();
  ctx.translate(head.x, head.y);
  ctx.rotate(head.tilt);

  if (!ghostTint && headImg && headImg.complete && (headImg.naturalWidth || headImg.width) > 0) {
    const imgW = headImg.naturalWidth || headImg.width;
    const imgH = headImg.naturalHeight || headImg.height;
    // Scale head cleanly (~44.5px wide x ~39.2px tall) for a heroic, fit, friendly Pixar proportion
    const drawW = 44.5;
    const drawH = drawW * (imgH / imgW);
    // Anchor chin snugly right into the plush crimson scarf (zero gap, zero neck bulge!)
    const drawX = -drawW * 0.455;
    const drawY = -drawH * 0.635;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(headImg, drawX, drawY, drawW, drawH);

    // Gentle living cheerful blink overlay matched to Ari's two painted eyes
    if (head.blink) {
      // Exact cropped eye positions in 110x97 head-cheerful-v16.png
      const ex1 = drawX + drawW * 0.573;
      const ey1 = drawY + drawH * 0.629;
      const ex2 = drawX + drawW * 0.764;
      const ey2 = drawY + drawH * 0.639;

      ctx.fillStyle = '#fcc299';
      ctx.beginPath();
      ctx.ellipse(ex1, ey1, 3.6, 3.9, -0.05, 0, TAU);
      ctx.ellipse(ex2, ey2, 2.2, 3.2, 0.05, 0, TAU);
      ctx.fill();

      ctx.strokeStyle = '#3b1f12';
      ctx.lineWidth = 1.65;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(ex1 - 2.8, ey1 + 0.6);
      ctx.quadraticCurveTo(ex1, ey1 - 1.6, ex1 + 2.8, ey1 + 0.5);
      ctx.moveTo(ex2 - 1.6, ey2 + 0.5);
      ctx.quadraticCurveTo(ex2, ey2 - 1.2, ex2 + 1.6, ey2 + 0.4);
      ctx.stroke();
    }

    // Subtle warm golden-aqua rim glow on front cheek when casting
    if (head.expression === 'cast') {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const rx = drawX + drawW * 0.78;
      const ry = drawY + drawH * 0.70;
      const rim = ctx.createRadialGradient(rx, ry, 0.5, rx, ry, 9);
      rim.addColorStop(0, 'rgba(180, 250, 255, 0.16)');
      rim.addColorStop(1, 'rgba(180, 250, 255, 0)');
      ctx.fillStyle = rim;
      ctx.beginPath();
      ctx.arc(rx, ry, 9, 0, TAU);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
    return;
  }

  // Clean silhouette fallback (used for cyan Spirit Dash afterimages or before PNG finishes loading)
  const sway = head.hairSway || 0;
  ctx.fillStyle = ghostTint || '#6b3b20';
  ctx.beginPath();
  ctx.moveTo(-12, 4);
  ctx.quadraticCurveTo(-22 - sway * 5, -4, -18 - sway * 3, -14);
  ctx.quadraticCurveTo(-6, -24, 10, -18);
  ctx.quadraticCurveTo(18, -10, 15, 2);
  ctx.quadraticCurveTo(12, 12, 2, 13);
  ctx.quadraticCurveTo(-8, 12, -12, 4);
  ctx.closePath();
  ctx.fill();

  if (!ghostTint) {
    ctx.fillStyle = '#ffd5b2';
    ctx.beginPath();
    ctx.ellipse(4, 2, 10.5, 10.2, 0, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#33180c';
    ctx.beginPath();
    ctx.ellipse(5.5, 0.5, 2.6, 3.2, 0, 0, TAU);
    ctx.ellipse(11.2, 0.8, 1.5, 2.4, 0, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(6.3, -0.8, 1.0, 0, TAU);
    ctx.arc(11.6, -0.3, 0.6, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = '#6c3824';
    ctx.lineWidth = 1.4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(5.8, 6.8);
    ctx.quadraticCurveTo(8.5, 8.8, 10.8, 6.4);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Draw the complete fit, friendly, cheerful articulated Ari at local origin (0, 0) = ground contact.
 */
export function drawAthleticAri(ctx, skel, opts = {}) {
  if (!skel) return;
  const ghostTint = opts.ghostTint || null;
  const headImg = opts.headImg || null;

  ctx.save();
  drawCapeAndScarf(ctx, skel.cape, ghostTint);
  drawArm(ctx, skel.rearArm, false, 0, ghostTint);
  drawLeg(ctx, skel.rearLeg, false, ghostTint);
  drawTorso(ctx, skel.pelvis, skel.chest, ghostTint);
  drawHead(ctx, skel.neck, skel.head, ghostTint, headImg);
  drawLeg(ctx, skel.frontLeg, true, ghostTint);
  drawArm(ctx, skel.frontArm, true, skel.castGlow || 0, ghostTint);
  ctx.restore();
}
