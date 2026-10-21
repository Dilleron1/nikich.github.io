(function(){
  document.addEventListener('DOMContentLoaded', ()=>{
    const img = document.getElementById('walker-img');
    const canvas = document.getElementById('walker-canvas');
    const parent = img ? img.parentElement : document.body;
    if (!img) return;

    const rect = parent.getBoundingClientRect();

    let x = rect.width * 0.08;
    let y = rect.height * 0.65;

    function ensureSize(){
      const cssW = parseFloat(getComputedStyle(img).width) || 160;
      img._w = cssW;
      img._h = parseFloat(getComputedStyle(img).height) || (cssW);
    }
    ensureSize();

    let vx = 70;

    function updateFlip(){ img.style.transform = (vx < 0) ? 'scaleX(-1)' : 'scaleX(1)'; }
    updateFlip();

    function bobAt(t){ return Math.sin(t/250) * 6; }

    function bounds(){ const r = parent.getBoundingClientRect(); return {min:0, max: Math.max(0, r.width - (img._w||160))}; }

    function initStyle(){
      const left = img.style.left || '8%';
      const top = img.style.top || '60%';
      if (left.toString().includes('%')) {
        const p = parseFloat(left)/100.0;
        x = parent.getBoundingClientRect().width * p;
      } else x = parseFloat(left);
      if (top.toString().includes('%')) {
        const p = parseFloat(top)/100.0;
        y = parent.getBoundingClientRect().height * p;
      } else y = parseFloat(top);
    }
    initStyle();

    let last = performance.now();
    let frameNow = last;

    function loop(now){
      const dt = (now - last)/1000; last = now;
      frameNow = now;

      x += vx * dt;

      const b = bounds();
      if (x < b.min) { x = b.min; vx = Math.abs(vx); updateFlip(); }
      if (x > b.max) { x = b.max; vx = -Math.abs(vx); updateFlip(); }

      const by = bobAt(now);

      img.style.left = Math.round(x) + 'px';
      img.style.top = Math.round(y + by) + 'px';

      requestAnimationFrame(loop);
    }

    window.addEventListener('resize', ()=>{ ensureSize(); });

    img.addEventListener('click', ()=>{ vx = -vx; updateFlip(); });

    requestAnimationFrame(loop);
  });
})();
