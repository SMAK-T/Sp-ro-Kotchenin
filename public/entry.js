(() => {
  const root=document.documentElement;
  let finish;
  window.neotisseEntryReady=new Promise(resolve=>{finish=resolve;});
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  if(reduced.matches||location.hash){finish();return;}
  root.classList.add('neotisse-entering');
  const run=async()=>{
    const hero=document.querySelector('.hero-slideshow'),header=document.querySelector('.site-header');
    let overlay,watchdog;const animations=[];
    const cleanup=()=>{
      clearTimeout(watchdog);animations.forEach(a=>a.cancel());overlay?.remove();
      root.classList.remove('neotisse-entering');
      reduced.removeEventListener('change',onReduced);finish();
    };
    const onReduced=()=>{if(reduced.matches)cleanup();};
    if(!hero||!header||!hero.animate){cleanup();return;}
    watchdog=setTimeout(cleanup,9500);
    reduced.addEventListener('change',onReduced);
    const animate=(el,frames,duration,delay=0,easing='cubic-bezier(.22,.65,.25,1)')=>{
      const a=el.animate(frames,{duration,delay,easing,fill:'both'});animations.push(a);return a;
    };
    try{
      overlay=document.createElement('div');overlay.className='neotisse-entry';overlay.setAttribute('aria-hidden','true');
      overlay.innerHTML='<div class="neotisse-entry-gallery"><div class="neotisse-entry-title">NÉOTISSE</div><div class="neotisse-entry-strip"></div></div><div class="neotisse-entry-loader"><img src="assets/neotisse-logo-brun.png" alt=""></div>';
      const strip=overlay.querySelector('.neotisse-entry-strip');
      ['demonstration-outils.jpg','filage-fuseau.jpg','mediation-plein-air.jpg','tissage-tablettes.jpg'].forEach(file=>{
        const image=document.createElement('img');image.src='assets/media/'+file;image.alt='';strip.append(image);
      });
      document.body.append(overlay);
      const distance=Math.round(innerHeight*1.15);
      const spring=[
        {transform:`translateY(-${distance}px) scaleY(1.1)`,borderRadius:'0 0 40% 40%',offset:0},
        {transform:'translateY(8vh) scaleY(.92)',borderRadius:'0',offset:.52},
        {transform:'translateY(-4vh) scaleY(1.04)',offset:.7},
        {transform:'translateY(2vh) scaleY(.98)',offset:.83},
        {transform:'translateY(-.6vh) scaleY(1.006)',offset:.94},
        {transform:'translateY(0) scaleY(1)',borderRadius:'0',offset:1}
      ];
      // Reserve the final reveal immediately, so the actual home hero stays above the frame.
      const entrance=animate(hero,spring,1900,3750,'linear');
      animate(header,[{transform:`translateY(-${distance}px)`,opacity:0},{transform:'translateY(0)',opacity:1}],850,4650);
      animate(overlay.querySelector('.neotisse-entry-loader img'),[
        {opacity:0,transform:'scale(.1) rotate(-12deg)',offset:0},
        {opacity:1,transform:'scale(1.2) rotate(2deg)',offset:.4},
        {opacity:1,transform:'scale(1) rotate(0)',offset:.58},
        {opacity:1,transform:'scale(1) rotate(0)',offset:.64},
        {opacity:0,transform:'scale(.4) translateY(-100px)',offset:1}
      ],1650);
      animate(overlay.querySelector('.neotisse-entry-loader'),[{clipPath:'inset(0 0 0 0)'},{clipPath:'inset(0 0 100% 0)'}],700,1300);
      animate(overlay.querySelector('.neotisse-entry-title'),[{opacity:0,transform:'translateY(-80px)'},{opacity:1,transform:'translateY(0)'}],900,1450);
      animate(strip,[{opacity:0,transform:'translateX(50%) translateY(180px) rotate(-14deg)'},{opacity:1,transform:'translateX(-3%) translateY(-12px) rotate(2deg)',offset:.75},{opacity:1,transform:'translateX(0) translateY(0) rotate(0)'}],1500,1600);
      strip.querySelectorAll('img').forEach((image,i)=>{
        const angle=[-14,-5,5,14][i],y=[30,0,0,30][i];
        animate(image,[{transform:'rotate(0deg) translateY(0)'},{transform:`rotate(${angle}deg) translateY(${y}px)`,offset:.65},{transform:`rotate(${angle*.7}deg) translateY(${y*.8}px)`}],1400,2450+i*50);
      });
      const copy=hero.querySelector('.hero-content');
      if(copy)animate(copy,[{transform:'translateY(-35px)',opacity:0},{transform:'translateY(10px)',opacity:1,offset:.6},{transform:'translateY(0)',opacity:1}],1200,4350);
      hero.querySelectorAll('.hero-actions a').forEach((button,i)=>animate(button,[{opacity:0,transform:'translateY(25px)'},{opacity:1,transform:'translateY(-4px)',offset:.8},{opacity:1,transform:'translateY(0)'}],800,4950+i*120));
      await entrance.finished;await new Promise(resolve=>setTimeout(resolve,250));cleanup();
    }catch{cleanup();}
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
