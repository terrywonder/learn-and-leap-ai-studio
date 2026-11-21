/**
 * Learn & Leap AAA Painterly Athletic Ari Renderer (v16.1).
 * Hand-crafted painterly shading, color-matched fine contours (no heavy cartoon black lines),
 * sunlit rim highlights, sleek ranger knee guards, curved layered crimson cape,
 * sculpted anime-fantasy profile & dynamic multi-ribbon chestnut hair.
 */

const TAU = Math.PI * 2;
const INK_WARM = '#341d15';
const INK_NAVY = '#14233b';
const INK_CRIMSON = '#4d0b14';
const INK_TEAL = '#0f2b28';

/** Draw a smoothly tapered painterly capsule segment with optional sunlit front rim. */
function drawTaperedLimb(ctx, ax, ay, bx, by, rStart, rEnd, fillStyle, strokeStyle = INK_WARM, lineWidth = 1.15, rimColor = null) {
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

  if (rimColor) {
    ctx.strokeStyle = rimColor;
    ctx.lineWidth = 1.25;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(2, -rStart * 0.65);
    ctx.lineTo(len - 2, -rEnd * 0.65);
    ctx.stroke();
  }

  if (strokeStyle) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.lineJoin = 'round';
    ctx.stroke();
  }
  ctx.restore();
}

/** Draw flowing crimson cape mantle with shaded inner lining & graceful curved scarf tail. */
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
    const halfW = 4.2 + frac * 12.2;
    topEdge.push({ x: p.x - nx * (halfW * 0.32), y: p.y - ny * (halfW * 0.32) });
    botEdge.push({ x: p.x + nx * halfW, y: p.y + ny * halfW });
  }

  ctx.save();
  const tailEnd = pts[pts.length - 1];

  // Inner dark-burgundy cape underside fold for rich 3D depth
  if (!ghostTint) {
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y + 2);
    for (let i = 1; i < botEdge.length; i++) {
      ctx.lineTo(botEdge[i].x + 2, botEdge[i].y + 3.2);
    }
    ctx.lineTo(pts[pts.length - 1].x + 4, pts[pts.length - 1].y + 1);
    ctx.closePath();
    ctx.fillStyle = '#5c0c18';
    ctx.fill();
  }

  const capeGrad = ghostTint
    ? ghostTint
    : (() => {
        const g = ctx.createLinearGradient(pts[0].x, pts[0].y - 6, tailEnd.x, tailEnd.y + 18);
        g.addColorStop(0, '#e6394b');
        g.addColorStop(0.5, '#be1e30');
        g.addColorStop(1, '#841020');
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
  ctx.lineTo((lastTop.x + lastBot.x) * 0.5 + 5, (lastTop.y + lastBot.y) * 0.5);
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
    // Sunlit warm-coral rim along upper mantle edge
    ctx.strokeStyle = 'rgba(255, 186, 174, 0.65)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(topEdge[0].x, topEdge[0].y + 1.1);
    for (let i = 1; i < topEdge.length; i++) ctx.lineTo(topEdge[i].x, topEdge[i].y + 1.2);
    ctx.stroke();

    // Subtle golden ranger hem embroidery
    ctx.strokeStyle = 'rgba(248, 214, 130, 0.58)';
    ctx.lineWidth = 1.15;
    ctx.beginPath();
    ctx.moveTo(botEdge[1].x, botEdge[1].y - 1.6);
    for (let i = 2; i < botEdge.length; i++) ctx.lineTo(botEdge[i].x, botEdge[i].y - 1.6);
    ctx.stroke();

    ctx.strokeStyle = INK_CRIMSON;
    ctx.lineWidth = 1.15;
    ctx.stroke();
  }

  // Graceful S-curved scarf ribbon
  const tail = cape.tail;
  if (tail && tail.length > 2 && !ghostTint) {
    ctx.beginPath();
    ctx.moveTo(tail[0].x, tail[0].y - 2.2);
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
    ctx.fillStyle = '#ed4050';
    ctx.fill();
    ctx.strokeStyle = INK_CRIMSON;
    ctx.lineWidth = 1.0;
    ctx.stroke();
  }
  ctx.restore();
}

/** Draw an articulated 2-bone athletic leg with sleek leather knee trim and sculpted ranger boot. */
function drawLeg(ctx, leg, isFront, ghostTint) {
  const { hip, knee, ankle, footAngle } = leg;

  const thighFill = ghostTint
    ? ghostTint
    : (() => {
        const g = ctx.createLinearGradient(hip.x - 5, hip.y, knee.x + 6, knee.y);
        if (isFront) {
          g.addColorStop(0, '#28456e');
          g.addColorStop(0.55, '#3b6194');
          g.addColorStop(1, '#5882b8');
        } else {
          g.addColorStop(0, '#1a2f4d');
          g.addColorStop(1, '#2a4870');
        }
        return g;
      })();

  const shinFill = ghostTint
    ? ghostTint
    : (() => {
        const g = ctx.createLinearGradient(knee.x - 4, knee.y, ankle.x + 5, ankle.y);
        if (isFront) {
          g.addColorStop(0, '#365887');
          g.addColorStop(0.45, '#2b476e');
          g.addColorStop(1, '#5a3621');
        } else {
          g.addColorStop(0, '#233b5c');
          g.addColorStop(1, '#3d2415');
        }
        return g;
      })();

  const rim = !ghostTint && isFront ? 'rgba(176, 214, 255, 0.38)' : null;
  drawTaperedLimb(ctx, hip.x, hip.y, knee.x, knee.y, 5.7, 4.4, thighFill, ghostTint ? null : INK_NAVY, 1.15, rim);
  drawTaperedLimb(ctx, knee.x, knee.y, ankle.x, ankle.y, 4.3, 3.5, shinFill, ghostTint ? null : INK_NAVY, 1.15, rim);

  if (!ghostTint) {
    // Sleek low-profile stitched leather knee patch (replaces bulky clunky brown oval!)
    const kneeAng = Math.atan2(ankle.y - hip.y, ankle.x - hip.x);
    ctx.save();
    ctx.translate(knee.x + 1.2, knee.y);
    ctx.rotate(kneeAng - Math.PI * 0.5);
    ctx.fillStyle = isFront ? '#6f462b' : '#4d301d';
    ctx.strokeStyle = INK_WARM;
    ctx.lineWidth = 0.95;
    ctx.beginPath();
    ctx.roundRect(-2.4, -2.5, 5.4, 4.8, 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Tall folded ranger boot cuff
    const cuffX = knee.x + (ankle.x - knee.x) * 0.54;
    const cuffY = knee.y + (ankle.y - knee.y) * 0.54;
    const shinAng = Math.atan2(ankle.y - knee.y, ankle.x - knee.x);
    ctx.save();
    ctx.translate(cuffX, cuffY);
    ctx.rotate(shinAng - Math.PI * 0.5);
    ctx.fillStyle = isFront ? '#e3c396' : '#ae9068';
    ctx.strokeStyle = INK_WARM;
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.roundRect(-4.8, -2.2, 9.6, 4.6, 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // Sleek sculpted adventurer boot
  ctx.save();
  ctx.translate(ankle.x, ankle.y);
  ctx.rotate(footAngle);

  const bootGrad = ghostTint
    ? ghostTint
    : (() => {
        const g = ctx.createLinearGradient(-4, -5, 11, 6);
        if (isFront) {
          g.addColorStop(0, '#965d35');
          g.addColorStop(0.55, '#6e3f20');
          g.addColorStop(1, '#482612');
        } else {
          g.addColorStop(0, '#6e4225');
          g.addColorStop(1, '#391d0e');
        }
        return g;
      })();

  ctx.beginPath();
  ctx.moveTo(-4.4, -5.2);
  ctx.lineTo(3.4, -4.4);
  ctx.quadraticCurveTo(9.0, -1.6, 13.0, 2.2);
  ctx.quadraticCurveTo(14.0, 5.4, 11.2, 6.4);
  ctx.lineTo(-4.2, 6.4);
  ctx.quadraticCurveTo(-5.8, 5.2, -5.2, 1.4);
  ctx.closePath();
  ctx.fillStyle = bootGrad;
  ctx.fill();

  if (!ghostTint) {
    ctx.fillStyle = isFront ? '#dcb06c' : '#a17c46';
    ctx.beginPath();
    ctx.moveTo(-4.8, 4.6);
    ctx.lineTo(12.8, 4.6);
    ctx.lineTo(11.8, 6.5);
    ctx.lineTo(3.4, 6.5);
    ctx.lineTo(1.8, 5.7);
    ctx.lineTo(-0.4, 6.5);
    ctx.lineTo(-4.4, 6.5);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 232, 192, 0.62)';
    ctx.lineWidth = 1.15;
    ctx.beginPath();
    ctx.moveTo(4.2, -1.4);
    ctx.quadraticCurveTo(8.8, 0.0, 11.4, 2.2);
    ctx.stroke();

    ctx.strokeStyle = INK_WARM;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(-4.4, -5.2);
    ctx.lineTo(3.4, -4.4);
    ctx.quadraticCurveTo(9.0, -1.6, 13.0, 2.2);
    ctx.quadraticCurveTo(14.0, 5.4, 11.2, 6.4);
    ctx.lineTo(-4.2, 6.4);
    ctx.quadraticCurveTo(-5.8, 5.2, -5.2, 1.4);
    ctx.closePath();
    ctx.stroke();
  }
  ctx.restore();
}

/** Draw an articulated 2-bone arm with rolled linen sleeve, leather bracer & expressive glove. */
function drawArm(ctx, arm, isFront, castGlow, ghostTint) {
  const { shoulder, elbow, hand, handPose } = arm;

  const sleeveFill = ghostTint
    ? ghostTint
    : (() => {
        const g = ctx.createLinearGradient(shoulder.x - 4, shoulder.y, elbow.x + 4, elbow.y);
        if (isFront) {
          g.addColorStop(0, '#ded6c7');
          g.addColorStop(1, '#fffdf6');
        } else {
          g.addColorStop(0, '#b5ada0');
          g.addColorStop(1, '#d8d0c3');
        }
        return g;
      })();

  drawTaperedLimb(ctx, shoulder.x, shoulder.y, elbow.x, elbow.y, 4.3, 3.6, sleeveFill, ghostTint ? null : INK_WARM, 1.1);

  const bracerFill = ghostTint
    ? ghostTint
    : (() => {
        const g = ctx.createLinearGradient(elbow.x, elbow.y, hand.x, hand.y);
        if (isFront) {
          g.addColorStop(0, '#f4c29e');
          g.addColorStop(0.28, '#83502e');
          g.addColorStop(1, '#583219');
        } else {
          g.addColorStop(0, '#c99878');
          g.addColorStop(0.28, '#5f3820');
          g.addColorStop(1, '#3e2211');
        }
        return g;
      })();
  drawTaperedLimb(ctx, elbow.x, elbow.y, hand.x, hand.y, 3.5, 2.9, bracerFill, ghostTint ? null : INK_WARM, 1.1);

  if (!ghostTint) {
    const midX = elbow.x + (hand.x - elbow.x) * 0.42;
    const midY = elbow.y + (hand.y - elbow.y) * 0.42;
    const ang = Math.atan2(hand.y - elbow.y, hand.x - elbow.x);
    ctx.save();
    ctx.translate(midX, midY);
    ctx.rotate(ang);
    ctx.fillStyle = isFront ? '#f0c874' : '#b8954f';
    ctx.fillRect(-1.1, -3.2, 2.2, 6.4);
    ctx.restore();
  }

  ctx.save();
  ctx.translate(hand.x, hand.y);
  ctx.fillStyle = ghostTint ? ghostTint : (isFront ? '#633920' : '#472715');
  ctx.strokeStyle = ghostTint ? 'transparent' : INK_WARM;
  ctx.lineWidth = 1.05;
  if (handPose === 'cast') {
    ctx.beginPath();
    ctx.ellipse(2, 0, 5.0, 3.8, -0.18, 0, TAU);
    ctx.fill();
    if (!ghostTint) ctx.stroke();
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
    ctx.beginPath();
    ctx.arc(0, 0, handPose === 'open' ? 4.0 : 3.8, 0, TAU);
    ctx.fill();
    if (!ghostTint) {
      ctx.stroke();
      ctx.fillStyle = isFront ? '#f6c5a0' : '#cb9a78';
      ctx.beginPath();
      ctx.arc(1.7, 0.2, 1.7, 0, TAU);
      ctx.fill();
    }
  }
  ctx.restore();
}

/** Draw Ari's lean V-tapered athletic torso, fitted emerald-leather ranger vest, baldric & rune belt. */
function drawTorso(ctx, pelvis, chest, ghostTint) {
  const dx = chest.x - pelvis.x;
  const dy = chest.y - pelvis.y;
  const len = Math.hypot(dx, dy) || 29;
  const ang = Math.atan2(dx, -dy);

  ctx.save();
  ctx.translate(pelvis.x, pelvis.y);
  ctx.rotate(ang);

  const breathW = 1 + (chest.breath || 0) * 0.022;
  const shW = 12.2 * breathW;
  const waistW = 7.4;

  const tunicGrad = ghostTint
    ? ghostTint
    : (() => {
        const g = ctx.createLinearGradient(-shW, -len, shW, 0);
        g.addColorStop(0, '#cfc6b8');
        g.addColorStop(0.48, '#f7f2e8');
        g.addColorStop(1, '#fffef7');
        return g;
      })();

  ctx.beginPath();
  ctx.moveTo(-waistW, 2);
  ctx.quadraticCurveTo(-waistW - 1.5, -len * 0.56, -shW, -len + 2);
  ctx.quadraticCurveTo(0, -len - 3.8, shW, -len + 2);
  ctx.quadraticCurveTo(waistW + 2.4, -len * 0.54, waistW, 2);
  ctx.quadraticCurveTo(0, 6.2, -waistW, 2);
  ctx.closePath();
  ctx.fillStyle = tunicGrad;
  ctx.fill();

  if (!ghostTint) {
    // Sculpted emerald-forest ranger vest with sunlit teal highlight
    const vestGrad = ctx.createLinearGradient(-shW, -len, 4, 0);
    vestGrad.addColorStop(0, '#164540');
    vestGrad.addColorStop(0.55, '#2b776b');
    vestGrad.addColorStop(1, '#1a524b');
    ctx.fillStyle = vestGrad;
    ctx.beginPath();
    ctx.moveTo(-waistW, 1);
    ctx.quadraticCurveTo(-waistW - 1.5, -len * 0.56, -shW, -len + 2);
    ctx.lineTo(-2.2, -len + 0.5);
    ctx.quadraticCurveTo(-3.2, -len * 0.45, -1.4, 1);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(shW, -len + 2);
    ctx.lineTo(5.4, -len + 0.8);
    ctx.quadraticCurveTo(6.0, -len * 0.45, waistW - 1.4, 1);
    ctx.lineTo(waistW, 1);
    ctx.quadraticCurveTo(waistW + 2.4, -len * 0.54, shW, -len + 2);
    ctx.closePath();
    ctx.fill();

    // Gold ranger vest piping
    ctx.strokeStyle = 'rgba(248, 214, 132, 0.78)';
    ctx.lineWidth = 1.05;
    ctx.beginPath();
    ctx.moveTo(-2.2, -len + 1.5);
    ctx.quadraticCurveTo(-3.0, -len * 0.45, -1.5, 0);
    ctx.stroke();

    // Diagonal stitched leather baldric strap
    ctx.strokeStyle = '#60371e';
    ctx.lineWidth = 3.8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-shW + 2.5, -len + 4);
    ctx.lineTo(waistW - 1.0, -2);
    ctx.stroke();
    ctx.strokeStyle = '#aa6e42';
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(-shW + 3, -len + 3.6);
    ctx.lineTo(waistW - 0.8, -2.4);
    ctx.stroke();

    // Brass chest clasp
    ctx.fillStyle = '#f8d47b';
    ctx.strokeStyle = INK_WARM;
    ctx.lineWidth = 0.95;
    ctx.beginPath();
    ctx.arc(1.6, -len * 0.45, 2.5, 0, TAU);
    ctx.fill();
    ctx.stroke();

    // Sleek leather shoulder pauldron cap
    ctx.fillStyle = '#734426';
    ctx.strokeStyle = INK_WARM;
    ctx.lineWidth = 1.05;
    ctx.beginPath();
    ctx.ellipse(-shW + 3.4, -len + 4.2, 4.9, 3.3, -0.32, 0, TAU);
    ctx.fill();
    ctx.stroke();

    // Cinched waist belt + glowing cyan rune buckle + hip pouch
    ctx.fillStyle = '#522e18';
    ctx.strokeStyle = INK_WARM;
    ctx.lineWidth = 1.05;
    ctx.beginPath();
    ctx.roundRect(-waistW - 0.8, -3.4, waistW * 2 + 1.6, 5.4, 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f9da84';
    ctx.strokeStyle = INK_WARM;
    ctx.lineWidth = 0.95;
    ctx.beginPath();
    ctx.roundRect(0.6, -3.6, 5.8, 5.8, 1.5);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#5ef0e0';
    ctx.beginPath();
    ctx.arc(3.5, -0.7, 1.4, 0, TAU);
    ctx.fill();

    ctx.fillStyle = '#784828';
    ctx.strokeStyle = INK_WARM;
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.roundRect(-waistW - 3.2, -2.0, 5.8, 7.0, 2);
    ctx.fill();
    ctx.stroke();

    // Dynamic split ranger tunic tail
    ctx.fillStyle = '#266d62';
    ctx.strokeStyle = INK_TEAL;
    ctx.lineWidth = 1.05;
    ctx.beginPath();
    ctx.moveTo(-waistW + 0.5, 2.0);
    ctx.lineTo(waistW - 0.8, 2.0);
    ctx.lineTo(waistW + 2.0, 8.2);
    ctx.lineTo(-1.8, 6.2);
    ctx.lineTo(-waistW - 2.2, 8.8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Fine torso contour
    ctx.strokeStyle = INK_TEAL;
    ctx.lineWidth = 1.15;
    ctx.beginPath();
    ctx.moveTo(-waistW, 2);
    ctx.quadraticCurveTo(-waistW - 1.5, -len * 0.56, -shW, -len + 2);
    ctx.quadraticCurveTo(0, -len - 3.8, shW, -len + 2);
    ctx.quadraticCurveTo(waistW + 2.4, -len * 0.54, waistW, 2);
    ctx.stroke();

    // Snug layered crimson adventurer scarf collar
    const scarfGrad = ctx.createLinearGradient(-10, -len - 6, 11, -len + 4);
    scarfGrad.addColorStop(0, '#9e1525');
    scarfGrad.addColorStop(0.55, '#e83847');
    scarfGrad.addColorStop(1, '#ff8896');
    ctx.fillStyle = scarfGrad;
    ctx.strokeStyle = INK_CRIMSON;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.ellipse(0.6, -len - 1.5, 10.8, 4.9, 0.08, 0, TAU);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255, 212, 208, 0.62)';
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.arc(1, -len - 2, 7.2, 0.2, Math.PI * 0.85);
    ctx.stroke();
  }

  ctx.restore();
}

/** Draw Ari's warm, friendly, cheerful young adventurer head with big sparkling eyes & fluffy sunlit hair. */
function drawHead(ctx, neck, head, ghostTint) {
  ctx.save();
  ctx.translate(head.x, head.y - 1.5);
  ctx.rotate(head.tilt);

  // Soft youthful neck
  if (!ghostTint) {
    ctx.fillStyle = '#e7b18c';
    ctx.strokeStyle = INK_WARM;
    ctx.lineWidth = 0.95;
    ctx.beginPath();
    ctx.roundRect(-3.4, 7, 6.8, 7.6, 2.2);
    ctx.fill();
    ctx.stroke();
  }

  const sway = head.hairSway || 0;
  const hairDeep = ghostTint ? ghostTint : '#4a2614';
  const hairMid = ghostTint ? ghostTint : '#834824';
  const hairWarm = ghostTint ? ghostTint : '#d1823c';

  // Lush fluffy back hair locks (warm, tousled, cheerful silhouette like original Ari)
  ctx.fillStyle = hairDeep;
  ctx.strokeStyle = ghostTint ? 'transparent' : INK_WARM;
  ctx.lineWidth = 1.05;
  ctx.beginPath();
  ctx.moveTo(-4, -12);
  ctx.quadraticCurveTo(-16.5 - sway * 5, -11.5, -21 - sway * 7, -4.5 + sway * 2);
  ctx.quadraticCurveTo(-15 - sway * 3, -1.5, -19.5 - sway * 6, 3.8 + sway * 3);
  ctx.quadraticCurveTo(-12.5 - sway * 2, 5.2, -14.5 - sway * 4, 10.2 + sway * 2);
  ctx.quadraticCurveTo(-6.5, 9.8, -2, 6.5);
  ctx.closePath();
  ctx.fill();
  if (!ghostTint) ctx.stroke();

  // Warm, soft, youthful 3/4 face contour (gentle rounded cheek & soft button nose — friendly, never harsh!)
  const skinGrad = ghostTint
    ? ghostTint
    : (() => {
        const g = ctx.createLinearGradient(-9, -11, 13, 12);
        g.addColorStop(0, '#eab38c');
        g.addColorStop(0.5, '#ffd7b5');
        g.addColorStop(1, '#fff0dc');
        return g;
      })();

  ctx.beginPath();
  ctx.moveTo(-9, -9.5);
  ctx.quadraticCurveTo(2.5, -14, 11.4, -5.8);
  ctx.quadraticCurveTo(13.2, -1.0, 12.6, 2.2);
  // Cute soft upturned button nose & smooth friendly cheek/chin
  ctx.quadraticCurveTo(13.8, 3.6, 12.2, 5.4);
  ctx.quadraticCurveTo(10.6, 11.2, 3.8, 12.4);
  ctx.quadraticCurveTo(-4.8, 12.2, -9.4, 6.2);
  ctx.quadraticCurveTo(-11.4, -2.0, -9, -9.5);
  ctx.closePath();
  ctx.fillStyle = skinGrad;
  ctx.fill();

  if (!ghostTint) {
    // Soft warm glow shadow under the bangs
    ctx.fillStyle = 'rgba(180, 105, 70, 0.12)';
    ctx.beginPath();
    ctx.ellipse(2.5, -5.2, 9.5, 3.0, 0.06, 0, TAU);
    ctx.fill();

    ctx.strokeStyle = '#5a3220';
    ctx.lineWidth = 1.05;
    ctx.stroke();

    // Cute rounded ear with warm inner tint
    ctx.fillStyle = '#f5c29c';
    ctx.beginPath();
    ctx.ellipse(-6.2, 2.6, 3.2, 4.0, -0.12, 0, TAU);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgba(214, 132, 102, 0.42)';
    ctx.beginPath();
    ctx.ellipse(-5.9, 2.8, 1.5, 2.0, -0.1, 0, TAU);
    ctx.fill();

    // Warm cheerful rosy-peach cheek blush!
    const blush = ctx.createRadialGradient(6.2, 5.8, 0.4, 6.2, 5.8, 4.2);
    blush.addColorStop(0, 'rgba(255, 132, 118, 0.42)');
    blush.addColorStop(1, 'rgba(255, 132, 118, 0)');
    ctx.fillStyle = blush;
    ctx.beginPath();
    ctx.arc(6.2, 5.8, 4.2, 0, TAU);
    ctx.fill();

    // Far-side hint eye (gives friendly 3/4 charm just like original Ari!)
    const farEyeX = 11.2;
    const farEyeY = 0.9;
    if (!head.blink && head.expression !== 'hurt') {
      ctx.fillStyle = '#fffef9';
      ctx.beginPath();
      ctx.ellipse(farEyeX, farEyeY, 1.5, 3.0, 0.05, 0, TAU);
      ctx.fill();
      ctx.fillStyle = '#3d1e0e';
      ctx.beginPath();
      ctx.ellipse(farEyeX + 0.25, farEyeY + 0.1, 1.15, 2.35, 0, 0, TAU);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(farEyeX + 0.45, farEyeY - 0.9, 0.65, 0, TAU);
      ctx.fill();
    }

    // Main near-side eye: big, warm, glossy, sparkling chestnut-amber eye!
    const eyeX = 5.4;
    const eyeY = 0.8;
    if (head.blink) {
      // Happy curved smiling blink!
      ctx.strokeStyle = '#3b2013';
      ctx.lineWidth = 1.85;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(eyeX - 3.2, eyeY + 1.0);
      ctx.quadraticCurveTo(eyeX, eyeY - 1.8, eyeX + 3.4, eyeY + 0.8);
      ctx.stroke();
    } else if (head.expression === 'hurt') {
      // Soft comic wince (> <), never scary
      ctx.strokeStyle = '#3b2013';
      ctx.lineWidth = 1.8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(eyeX - 2.6, eyeY - 1.6);
      ctx.lineTo(eyeX + 2.4, eyeY + 0.6);
      ctx.lineTo(eyeX - 2.6, eyeY + 2.6);
      ctx.stroke();
    } else {
      // Bright friendly sclera
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(eyeX, eyeY, 3.8, 4.4, -0.04, 0, TAU);
      ctx.fill();

      // Rich warm dark-chocolate iris with golden-honey lower glow (stays warm & friendly even when casting!)
      const irisGrad = ctx.createLinearGradient(eyeX, eyeY - 3.5, eyeX, eyeY + 3.8);
      irisGrad.addColorStop(0, '#2e160a');
      irisGrad.addColorStop(0.58, '#5a2d15');
      irisGrad.addColorStop(1, head.expression === 'cast' ? '#e6a838' : '#c77932');
      ctx.fillStyle = irisGrad;
      ctx.beginPath();
      ctx.ellipse(eyeX + 0.5, eyeY + 0.1, 2.75, 3.55, 0, 0, TAU);
      ctx.fill();

      // Deep pupil center
      ctx.fillStyle = '#1f0e06';
      ctx.beginPath();
      ctx.ellipse(eyeX + 0.55, eyeY - 0.1, 1.35, 1.8, 0, 0, TAU);
      ctx.fill();

      // Warm golden lower iris crescent
      ctx.fillStyle = head.expression === 'cast' ? '#ffe89c' : '#eab05c';
      ctx.beginPath();
      ctx.arc(eyeX + 0.55, eyeY + 1.7, 1.2, 0, TAU);
      ctx.fill();

      // Dual Pixar-style joyful white eye catchlights!
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(eyeX + 1.45, eyeY - 1.45, 1.3, 0, TAU);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(eyeX - 0.85, eyeY + 1.35, 0.65, 0, TAU);
      ctx.fill();

      // Soft curved friendly upper eyelash
      ctx.strokeStyle = '#32190e';
      ctx.lineWidth = 1.65;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(eyeX - 3.6, eyeY - 1.0);
      ctx.quadraticCurveTo(eyeX + 0.2, eyeY - 5.0, eyeX + 3.8, eyeY - 1.4);
      ctx.stroke();
    }

    // Soft, friendly, gently arched eyebrows (NEVER angry downward V-scowl!)
    ctx.strokeStyle = '#4a2614';
    ctx.lineWidth = 1.65;
    ctx.lineCap = 'round';
    ctx.beginPath();
    if (head.expression === 'hurt') {
      ctx.moveTo(eyeX - 3.2, eyeY - 5.2);
      ctx.quadraticCurveTo(eyeX + 0.2, eyeY - 6.6, eyeX + 3.0, eyeY - 5.8);
    } else if (head.expression === 'determined' || head.expression === 'cast') {
      // Upbeat, adventurous, confident gentle arch (happy energy!)
      ctx.moveTo(eyeX - 3.2, eyeY - 5.8);
      ctx.quadraticCurveTo(eyeX + 0.4, eyeY - 7.4, eyeX + 3.6, eyeY - 5.4);
    } else {
      // Cheerful relaxed arch
      ctx.moveTo(eyeX - 3.2, eyeY - 5.8);
      ctx.quadraticCurveTo(eyeX + 0.3, eyeY - 7.6, eyeX + 3.5, eyeY - 6.0);
    }
    ctx.stroke();

    // Cheerful, warm, friendly smile!
    if (head.expression === 'cast' || head.expression === 'determined') {
      // Bright enthusiastic open adventurer smile!
      ctx.fillStyle = '#d46a62';
      ctx.strokeStyle = '#6c3624';
      ctx.lineWidth = 1.15;
      ctx.beginPath();
      ctx.moveTo(5.6, 7.2);
      ctx.quadraticCurveTo(8.4, 7.0, 10.6, 6.4);
      ctx.quadraticCurveTo(9.8, 9.8, 7.2, 9.4);
      ctx.quadraticCurveTo(5.8, 9.0, 5.6, 7.2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Tiny cheerful white tooth highlight at top of grin
      ctx.fillStyle = '#fffef9';
      ctx.beginPath();
      ctx.roundRect(6.5, 7.1, 3.1, 0.9, 0.4);
      ctx.fill();
    } else if (head.expression === 'hurt') {
      ctx.strokeStyle = '#6c3624';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.arc(8.2, 8.2, 1.5, 0, TAU);
      ctx.stroke();
    } else {
      // Warm gentle happy smile (like original Ari!)
      ctx.strokeStyle = '#6e3824';
      ctx.lineWidth = 1.45;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(5.4, 7.4);
      ctx.quadraticCurveTo(8.2, 9.8, 10.8, 7.0);
      ctx.stroke();
    }
  }

  // Lush, fluffy, warm sunlit chestnut hair crown & soft tousled bangs (matching original Ari's charm!)
  const crownGrad = ghostTint
    ? ghostTint
    : (() => {
        const g = ctx.createLinearGradient(-14, -19, 14, 2);
        g.addColorStop(0, hairDeep);
        g.addColorStop(0.5, hairMid);
        g.addColorStop(1, hairWarm);
        return g;
      })();

  ctx.fillStyle = crownGrad;
  ctx.strokeStyle = ghostTint ? 'transparent' : INK_WARM;
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.moveTo(-11, 2.5);
  ctx.quadraticCurveTo(-16.5 - sway * 3, -6.5, -14 - sway * 2, -13.5);
  // Fluffy upbeat top hair tufts
  ctx.quadraticCurveTo(-8.5, -19.5, -1.5, -16.8);
  ctx.quadraticCurveTo(5.0, -22.5, 11.2, -15.5);
  // Warm sweeping bangs framing the bright eyes cleanly (never shadowing eyes!)
  ctx.quadraticCurveTo(16.8, -11.5, 15.6, -4.2);
  ctx.quadraticCurveTo(12.2, -7.2, 10.0, -3.4);
  ctx.quadraticCurveTo(8.0, -8.2, 3.8, -5.0);
  ctx.quadraticCurveTo(1.2, -9.2, -3.0, -4.8);
  // Soft sideburn tucking nicely in front of the ear
  ctx.quadraticCurveTo(-2.8, 1.4, -5.2, 4.8);
  ctx.quadraticCurveTo(-8.0, 1.5, -8.6, -2.0);
  ctx.quadraticCurveTo(-10.0, 1.2, -11, 2.5);
  ctx.closePath();
  ctx.fill();

  if (!ghostTint) {
    ctx.stroke();
    // Bright sunlit golden-honey hair shine ribbons
    ctx.strokeStyle = 'rgba(255, 232, 162, 0.85)';
    ctx.lineWidth = 2.0;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-4.0, -13.6);
    ctx.quadraticCurveTo(4.8, -17.0, 11.8, -9.8);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 242, 198, 0.65)';
    ctx.lineWidth = 1.35;
    ctx.beginPath();
    ctx.moveTo(-10.2, -9.4);
    ctx.quadraticCurveTo(-4.2, -12.6, 2.0, -10.5);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Draw the complete redrawn, fit, friendly, articulated Ari at local origin (0, 0) = ground contact.
 */
export function drawAthleticAri(ctx, skel, opts = {}) {
  if (!skel) return;
  const ghostTint = opts.ghostTint || null;

  ctx.save();
  drawCapeAndScarf(ctx, skel.cape, ghostTint);
  drawArm(ctx, skel.rearArm, false, 0, ghostTint);
  drawLeg(ctx, skel.rearLeg, false, ghostTint);
  drawTorso(ctx, skel.pelvis, skel.chest, ghostTint);
  drawHead(ctx, skel.neck, skel.head, ghostTint);
  drawLeg(ctx, skel.frontLeg, true, ghostTint);
  drawArm(ctx, skel.frontArm, true, skel.castGlow || 0, ghostTint);
  ctx.restore();
}
