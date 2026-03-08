/* ═══════════════════════════════════════════════
   TuZhi Deco — text-orbit
   Letters T U Z H I C O D E S orbit the avatar
   with glow, trails, pulse & colour cycling
   ═══════════════════════════════════════════════ */
(function(){
  const cv = document.getElementById('decoCanvas');
  if(!cv) return;
  const ctx = cv.getContext('2d');
  const W=160, H=160, CX=80, CY=80;

  /* ── CONFIG ── */
  const LETTERS  = ['T','U','Z','H','I','C','O','D','E','S'];
  const N        = LETTERS.length;
  const ORBIT_R  = 62;      /* ring radius — outside avatar edge */
  const FONT_SZ  = 13;

  /* Each letter gets a hue spread evenly across spectrum */
  const letters = LETTERS.map((ch, i) => ({
    ch,
    baseAngle : (i / N) * Math.PI * 2,   /* starting position */
    hue       : (i / N) * 360,
    scale     : 1,
    alpha     : 1,
    trailAngle: [],                       /* for motion trail */
    pulsePhase: (i / N) * Math.PI * 2,   /* stagger pulse */
  }));

  /* Trail points per letter */
  const TRAIL_LEN = 8;

  /* Speed — radians per frame */
  const SPEED = 0.018;

  /* ── SPARK POOL ── */
  const sparks = Array.from({length: 20}, () => ({
    angle : Math.random() * Math.PI * 2,
    orbit : ORBIT_R + (Math.random() - 0.5) * 16,
    size  : 1 + Math.random() * 2,
    alpha : 0.3 + Math.random() * 0.5,
    speed : 0.022 + Math.random() * 0.018,
    phase : Math.random() * Math.PI * 2,
    hue   : Math.random() * 360,
  }));

  let t = 0, raf;

  /* ── HELPERS ── */
  function hsl(h, s, l, a=1) {
    return a < 1
      ? `hsla(${h%360},${s}%,${l}%,${a})`
      : `hsl(${h%360},${s}%,${l}%)`;
  }

  /* draw a glowing text character */
  function drawChar(ch, x, y, hue, alpha, scale, blur) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.font = `900 ${FONT_SZ}px 'Nunito', sans-serif`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha  = alpha;

    /* outer glow pass */
    ctx.shadowColor = hsl(hue, 100, 65);
    ctx.shadowBlur  = blur || 14;
    ctx.fillStyle   = hsl(hue, 100, 90);
    ctx.fillText(ch, 0, 0);

    /* second pass — brighter core */
    ctx.shadowBlur  = 6;
    ctx.fillStyle   = '#ffffff';
    ctx.globalAlpha = alpha * 0.6;
    ctx.fillText(ch, 0, 0);

    ctx.restore();
  }

  /* ── MAIN LOOP ── */
  function draw() {
    ctx.clearRect(0, 0, W, H);
    t++;

    const timeAngle = t * SPEED;   /* global rotation offset */

    /* ── faint orbit path ── */
    ctx.save();
    ctx.beginPath();
    ctx.arc(CX, CY, ORBIT_R, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth   = 1;
    ctx.stroke();
    ctx.restore();

    /* ── sparks ── */
    sparks.forEach(sp => {
      sp.angle += sp.speed;
      const pulse = 0.6 + 0.4 * Math.sin(t * 0.08 + sp.phase);
      const x = CX + Math.cos(sp.angle) * sp.orbit;
      const y = CY + Math.sin(sp.angle) * sp.orbit;
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, sp.size * pulse, 0, Math.PI * 2);
      ctx.fillStyle   = hsl(sp.hue, 90, 70);
      ctx.shadowColor = hsl(sp.hue, 90, 70);
      ctx.shadowBlur  = 8;
      ctx.globalAlpha = sp.alpha * pulse;
      ctx.fill();
      ctx.restore();
    });

    /* ── letters ── */
    letters.forEach((L, i) => {
      const angle = L.baseAngle + timeAngle;

      /* save trail point */
      L.trailAngle.push(angle);
      if (L.trailAngle.length > TRAIL_LEN) L.trailAngle.shift();

      /* pulse scale */
      const pulse = 1 + 0.18 * Math.sin(t * 0.07 + L.pulsePhase);

      /* hue shift over time */
      const hue = (L.hue + t * 0.5) % 360;

      /* ── draw trail ── */
      L.trailAngle.forEach((ta, ti) => {
        const prog  = ti / TRAIL_LEN;          /* 0 = oldest, 1 = newest */
        const tx    = CX + Math.cos(ta) * ORBIT_R;
        const ty    = CY + Math.sin(ta) * ORBIT_R;
        const talph = prog * 0.35;
        const tscale= 0.55 + prog * 0.45;
        drawChar(L.ch, tx, ty, hue, talph, tscale, 8);
      });

      /* ── draw main letter ── */
      const x = CX + Math.cos(angle) * ORBIT_R;
      const y = CY + Math.sin(angle) * ORBIT_R;
      drawChar(L.ch, x, y, hue, 1, pulse, 18);

      /* ── tiny dot "meteor head" that leads the letter ── */
      const leadAngle = angle + 0.18;
      const lx = CX + Math.cos(leadAngle) * ORBIT_R;
      const ly = CY + Math.sin(leadAngle) * ORBIT_R;
      ctx.save();
      ctx.beginPath();
      ctx.arc(lx, ly, 2.5 * pulse, 0, Math.PI * 2);
      ctx.fillStyle   = '#ffffff';
      ctx.shadowColor = hsl(hue, 100, 80);
      ctx.shadowBlur  = 12;
      ctx.globalAlpha = 0.55;
      ctx.fill();
      ctx.restore();
    });

    /* ── rotating light sweep over ring ── */
    const sweepAngle = t * 0.03;
    const grad = ctx.createLinearGradient(
      CX + Math.cos(sweepAngle) * ORBIT_R,
      CY + Math.sin(sweepAngle) * ORBIT_R,
      CX + Math.cos(sweepAngle + Math.PI) * ORBIT_R,
      CY + Math.sin(sweepAngle + Math.PI) * ORBIT_R
    );
    grad.addColorStop(0, 'rgba(255,255,255,0)');
    grad.addColorStop(0.5,'rgba(255,255,255,0.07)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.save();
    ctx.beginPath();
    ctx.arc(CX, CY, ORBIT_R, 0, Math.PI * 2);
    ctx.strokeStyle = grad;
    ctx.lineWidth   = 6;
    ctx.stroke();
    ctx.restore();

    window._decoRaf = raf = requestAnimationFrame(draw);
  }

  if(window._decoRaf) cancelAnimationFrame(window._decoRaf);
  draw();
})();
                    
