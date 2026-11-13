(async()=>{
  if(window.neotisseContentReady) await window.neotisseContentReady;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('.partner-carousel').forEach(carousel=>{
    const track=carousel.querySelector('.partner-gallery');
    const originals=[...track.querySelectorAll('article')];
    if(!originals.length)return;
    carousel.classList.add('partner-band');
    let hover=false,focused=false,visible=false,frame=0,previous=0,segment=0,position=0;
    const canMove=()=>!hover&&!focused&&!reduced.matches&&!document.hidden&&visible&&segment>0;
    const tick=time=>{
      frame=0;if(!canMove()){previous=0;return}
      if(previous){const delta=Math.min(time-previous,50);let next=position+delta*.028;if(next>=segment)next%=segment;position=next;track.scrollLeft=next}
      previous=time;frame=requestAnimationFrame(tick);
    };
    const resume=()=>{if(canMove()&&!frame){previous=0;position=track.scrollLeft;frame=requestAnimationFrame(tick)}else if(!canMove()&&frame){cancelAnimationFrame(frame);frame=0;previous=0}};
    const build=()=>{
      track.querySelectorAll('[data-band-clone]').forEach(n=>n.remove());
      if(reduced.matches){segment=0;track.scrollLeft=0;resume();return}
      const appendSet=()=>originals.forEach(original=>{
        const clone=original.cloneNode(true);clone.dataset.bandClone='';clone.setAttribute('aria-hidden','true');clone.removeAttribute('id');clone.querySelectorAll('[id]').forEach(n=>n.removeAttribute('id'));clone.querySelectorAll('a,button,input,select,textarea,[tabindex]').forEach(n=>n.setAttribute('tabindex','-1'));clone.querySelectorAll('img').forEach(img=>img.loading='eager');track.append(clone);
      });
      appendSet();segment=track.querySelector('[data-band-clone]').offsetLeft-originals[0].offsetLeft;
      for(let i=0;i<12&&track.scrollWidth<track.clientWidth+segment+1;i++)appendSet();
      if(segment>0&&track.scrollLeft>=segment)track.scrollLeft%=segment;
      resume();
    };
    carousel.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'){hover=true;resume()}});
    carousel.addEventListener('pointerleave',()=>{hover=false;resume()});
    carousel.addEventListener('focusin',()=>{focused=true;resume()});
    carousel.addEventListener('focusout',event=>{focused=!!event.relatedTarget&&carousel.contains(event.relatedTarget);resume()});
    const move=direction=>track.scrollBy({left:direction*track.clientWidth*.7,behavior:reduced.matches?'instant':'smooth'});
    carousel.querySelector('.partner-prev')?.addEventListener('click',()=>move(-1));carousel.querySelector('.partner-next')?.addEventListener('click',()=>move(1));
    track.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();move(event.key==='ArrowRight'?1:-1)}});
    track.addEventListener('pointermove',event=>{
      const card=event.target.closest('article');if(!card||event.pointerType!=='mouse'||reduced.matches)return;
      const bounds=card.getBoundingClientRect();card.style.setProperty('--tilt-x',((event.clientX-bounds.left)/bounds.width-.5)*7+'deg');card.style.setProperty('--tilt-y',-((event.clientY-bounds.top)/bounds.height-.5)*5+'deg');
    });
    track.addEventListener('pointerout',event=>{const card=event.target.closest('article');if(card&&!card.contains(event.relatedTarget)){card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg')}});
    if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;resume()},{rootMargin:'100px'}).observe(carousel);else visible=true;
    carousel.querySelector('.partner-hint')?.remove();
    reduced.addEventListener('change',build);document.addEventListener('visibilitychange',resume);
    if('ResizeObserver'in window)new ResizeObserver(build).observe(track);else addEventListener('resize',build);
    build();
  });
})();
