(async () => {
  if (window.neotisseContentReady) await window.neotisseContentReady;
  const ns = 'http://www.w3.org/2000/svg';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const groups = [];
  document.querySelectorAll('#main > .color-band--sage').forEach(band => {
    band.classList.add('services-thread-frame');
    const svg = document.createElementNS(ns, 'svg');
    svg.classList.add('services-frame-threads');
    svg.setAttribute('viewBox','0 0 900 540');
    svg.setAttribute('preserveAspectRatio','none');
    svg.setAttribute('aria-hidden','true');
    const paths = [];
    for (let i=0;i<6;i++) {
      const k=i*7;
      for (const d of [
        `M 900 ${45+k} C 680 ${-25+i*11}, 740 ${145+i*8}, 858 ${145+i*8} C 960 ${145+i*8}, 880 ${275+i*9}, 760 ${330+i*5}`,
        `M -15 ${335+i*8} C 190 ${330+i*10}, 200 ${515+i*4}, -10 ${495+i*6}`
      ]) {
        const path=document.createElementNS(ns,'path');
        path.setAttribute('d',d);svg.append(path);
        path.setAttribute('pathLength','1');
        path.style.strokeDasharray='1 1';
        paths.push(path);
      }
    }
    band.append(svg);groups.push({band,paths});
  });
  let raf=0;
  function render(){raf=0;groups.forEach(({band,paths})=>{
    const r=band.getBoundingClientRect();
    const p=reduced.matches?1:Math.max(0,Math.min(1,(innerHeight*.95-r.top)/(innerHeight*.75)));
    paths.forEach(path=>path.style.strokeDashoffset=1-p);
  });}
  function request(){if(!raf)raf=requestAnimationFrame(render);}
  addEventListener('scroll',request,{passive:true});
  addEventListener('resize',request);reduced.addEventListener('change',request);render();
})();
