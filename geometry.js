/* Two original, slowly transforming wireframes. Pure canvas; no dependencies. */
(() => {
  const canvas = document.querySelector('canvas.geometry');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const button = document.querySelector('.geometry-pause');
  const de = document.documentElement.lang === 'de';
  const nav = document.querySelector('.site-nav');
  if (nav) new ResizeObserver(() => {
    document.documentElement.style.setProperty('--nav-height', `${nav.getBoundingClientRect().height}px`);
  }).observe(nav);
  let paused = reduced.matches, frame = 0, last = 0, phase = 0, width = 0, height = 0;
  let ink = '', light = false;
  function colors() {
    light = document.documentElement.dataset.theme === 'light';
    ink = light ? '58,91,68' : '177,204,182';
  }
  function point(u, v) {
    const r = 1.75 + .62 * Math.cos(v);
    const x = r * Math.cos(u), y = r * Math.sin(u), z = .62 * Math.sin(v) + .17 * Math.sin(3*u + phase*.4);
    const a = phase*.12 + .5, b = .86 + .13*Math.sin(phase*.16);
    const xx = x*Math.cos(a) - z*Math.sin(a), zz = x*Math.sin(a) + z*Math.cos(a);
    const yy = y*Math.cos(b) - zz*Math.sin(b), depth = y*Math.sin(b) + zz*Math.cos(b);
    const scale = Math.min(width*.22, height*.39) * 4.7/(5.8-depth*.4);
    return [width*.80 + xx*scale, height*.64 + yy*scale, depth];
  }
  // A smaller, softly lobed shell: distinct from the open torus below it.
  function shellPoint(u, v) {
    const radius = 1 + .16 * Math.sin(3*u + phase*.18) * Math.sin(v)**2;
    const twist = u + .3*Math.cos(v + phase*.09);
    const x = radius*Math.sin(v)*Math.cos(twist);
    const y = 1.18*radius*Math.cos(v);
    const z = radius*Math.sin(v)*Math.sin(twist);
    const a = -.45 - phase*.09, b = .35;
    const xx = x*Math.cos(a)-z*Math.sin(a), zz = x*Math.sin(a)+z*Math.cos(a);
    const yy = y*Math.cos(b)-zz*Math.sin(b), depth = y*Math.sin(b)+zz*Math.cos(b);
    const scale = Math.min(width*.19,height*.24)*3.8/(4-depth*.3);
    return [width*.23+xx*scale,height*.25+yy*scale,depth];
  }
  function drawShell() {
    // Draw continuous ribs, keeping the extra animation light on small devices.
    ctx.lineWidth = .7;
    for (let rib=0;rib<26;rib++) {
      ctx.beginPath();
      for (let step=0;step<=64;step++) {
        const p = shellPoint(rib/26*Math.PI*2,step/64*Math.PI);
        step ? ctx.lineTo(p[0],p[1]) : ctx.moveTo(p[0],p[1]);
      }
      ctx.strokeStyle=`rgba(${ink},.22)`;
      ctx.stroke();
    }
    ctx.strokeStyle=`rgba(${ink},.13)`;
    for (let ring=1;ring<19;ring++) {
      ctx.beginPath();
      for (let step=0;step<=80;step++) {
        const p = shellPoint(step/80*Math.PI*2,ring/19*Math.PI);
        step ? ctx.lineTo(p[0],p[1]) : ctx.moveTo(p[0],p[1]);
      }
      ctx.stroke();
    }
  }
  function draw() {
    ctx.clearRect(0,0,width,height);
    for(let row=0;row<35;row++){
      const v=row/35*Math.PI*2;
      for(let segment=0;segment<100;segment++){
        const p=point(segment/100*Math.PI*2,v), q=point((segment+1)/100*Math.PI*2,v);
        const fade=Math.max(.035,Math.min(.42,(p[2]+3)/12));
        ctx.strokeStyle=`rgba(${ink},${fade})`;ctx.lineWidth=.65;
        ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();
      }
    }
    for(let col=0;col<44;col++){
      ctx.strokeStyle=`rgba(${ink},.09)`;ctx.lineWidth=.6;ctx.beginPath();
      for(let j=0;j<=36;j++){const p=point(col/44*Math.PI*2,j/36*Math.PI*2);j?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);}ctx.stroke();
    }
    // Dissolve the geometry where the copy begins, leaving text completely legible.
    ctx.globalCompositeOperation='destination-out';
    const mask=ctx.createLinearGradient(0,0,width,0);
    mask.addColorStop(0,'rgba(0,0,0,1)');mask.addColorStop(.34,'rgba(0,0,0,1)');mask.addColorStop(.66,'rgba(0,0,0,0)');
    ctx.fillStyle=mask;ctx.fillRect(0,0,width,height);ctx.globalCompositeOperation='source-over';
    // Keep the left shell visible outside the torus mask, but quiet behind the copy.
    ctx.save();
    ctx.globalAlpha=.45;
    drawShell();
    ctx.restore();
  }
  function tick(t){if(paused||document.hidden)return;if(t-last>40){phase+=.011;draw();last=t;}frame=requestAnimationFrame(tick);}
  function sync(){cancelAnimationFrame(frame);draw();if(!paused&&!document.hidden)frame=requestAnimationFrame(tick);if(button){button.textContent=paused?(de?'Animation starten':'Play motion'):(de?'Animation pausieren':'Pause motion');button.setAttribute('aria-pressed',String(paused));}}
  function resize(){const rect=canvas.getBoundingClientRect();width=rect.width;height=rect.height;const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw();}
  colors();new ResizeObserver(resize).observe(canvas);
  new MutationObserver(()=>{colors();draw();}).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  reduced.addEventListener('change',e=>{paused=e.matches;sync();});
  document.addEventListener('visibilitychange',sync);
  button?.addEventListener('click',()=>{paused=!paused;sync();});
  sync();
})();
