/* ═══════════════════════════════════════
   TuZhi Deco — blue-ring
   Animated blue energy ring around avatar
   ═══════════════════════════════════════ */
(function(){
  const cv = document.getElementById('decoCanvas');
  if(!cv) return;
  const ctx = cv.getContext('2d');
  const W=160, H=160, CX=80, CY=80, R=56;

  const C1='#00cfff', C2='#0055ff', SPARK='#aaf0ff', GLOW='rgba(0,180,255,';

  const parts = Array.from({length:20},(_,i)=>({
    angle: (i/20)*Math.PI*2,
    speed: 0.013 + Math.random()*0.009,
    size:  1.5 + Math.random()*2.5,
    alpha: 0.4 + Math.random()*0.55,
    orbit: R + (Math.random()-0.5)*9,
    phase: Math.random()*Math.PI*2,
  }));

  let t=0, raf;
  function draw(){
    ctx.clearRect(0,0,W,H);
    t++;

    /* base glow ring */
    ctx.save();
    ctx.beginPath(); ctx.arc(CX,CY,R,0,Math.PI*2);
    ctx.strokeStyle=C1; ctx.lineWidth=2.5;
    ctx.shadowColor=C1; ctx.shadowBlur=18;
    ctx.globalAlpha=0.28; ctx.stroke(); ctx.restore();

    /* main rotating arc */
    const a1=t*0.026, len1=Math.PI*1.15;
    ctx.save();
    ctx.beginPath(); ctx.arc(CX,CY,R,a1,a1+len1);
    ctx.strokeStyle=C1; ctx.lineWidth=4.5; ctx.lineCap='round';
    ctx.shadowColor=C1; ctx.shadowBlur=22;
    ctx.globalAlpha=0.92; ctx.stroke(); ctx.restore();

    /* counter arc */
    const a2=-t*0.017+Math.PI*0.8, len2=Math.PI*0.4;
    ctx.save();
    ctx.beginPath(); ctx.arc(CX,CY,R,a2,a2+len2);
    ctx.strokeStyle=C2; ctx.lineWidth=3; ctx.lineCap='round';
    ctx.shadowColor=C2; ctx.shadowBlur=16;
    ctx.globalAlpha=0.75; ctx.stroke(); ctx.restore();

    /* inner thin ring pulse */
    const pulse=0.5+0.5*Math.sin(t*0.04);
    ctx.save();
    ctx.beginPath(); ctx.arc(CX,CY,R-8,0,Math.PI*2);
    ctx.strokeStyle=C2; ctx.lineWidth=1;
    ctx.shadowColor=C2; ctx.shadowBlur=8;
    ctx.globalAlpha=0.15*pulse; ctx.stroke(); ctx.restore();

    /* particles */
    parts.forEach(p=>{
      p.angle+=p.speed;
      const px=Math.sin(t*0.05+p.phase);
      const x=CX+Math.cos(p.angle)*p.orbit;
      const y=CY+Math.sin(p.angle)*p.orbit;
      ctx.save();
      ctx.beginPath(); ctx.arc(x,y,p.size*(0.7+0.3*px),0,Math.PI*2);
      ctx.fillStyle=SPARK; ctx.shadowColor=SPARK; ctx.shadowBlur=9;
      ctx.globalAlpha=p.alpha*(0.7+0.3*px); ctx.fill(); ctx.restore();
    });

    /* bright head */
    const hx=CX+Math.cos(a1+len1)*R, hy=CY+Math.sin(a1+len1)*R;
    ctx.save();
    ctx.beginPath(); ctx.arc(hx,hy,5.5,0,Math.PI*2);
    ctx.fillStyle='#fff'; ctx.shadowColor=C1; ctx.shadowBlur=20;
    ctx.globalAlpha=0.97; ctx.fill(); ctx.restore();

    window._decoRaf = raf = requestAnimationFrame(draw);
  }
  if(window._decoRaf) cancelAnimationFrame(window._decoRaf);
  draw();
})();
