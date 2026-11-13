(async () => {
  if(window.neotisseContentReady) await window.neotisseContentReady;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  // Move only cover-fitted photographs inside their existing frame.
  // Full-image/contain previews keep their entire photograph visible.
  const photos = [...document.querySelectorAll('#main .client-card>img,#main .action-layout>img,#main .service-detail>img,#main .team-profiles img,#main .figma-home-feature>img,#main .media-story-grid img,#main .media-experiment-grid img')];
  const positions = new Map();
  const activePhotos = new Set();
  let photoFrame = 0;
  photos.forEach(image => {
    const style = getComputedStyle(image);
    if (style.objectFit !== 'cover') return;
    const [x = '50%', y = '50%'] = style.objectPosition.split(' ');
    positions.set(image, {original: image.style.objectPosition, x, y: y.endsWith('%') ? parseFloat(y) : 50});
  });
  const renderPhotos = () => {
    photoFrame = 0;
    if (reduced.matches || document.hidden) return;
    activePhotos.forEach(image => {
      const bounds = image.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (innerHeight - bounds.top) / (innerHeight + bounds.height)));
      const base = positions.get(image);
      image.style.objectPosition = base.x + ' ' + Math.max(0, Math.min(100, base.y + (progress - .5) * 38)).toFixed(2) + '%';
    });
  };
  const requestPhotos = () => {
    if (!reduced.matches && activePhotos.size && !photoFrame) photoFrame = requestAnimationFrame(renderPhotos);
  };
  if ('IntersectionObserver' in window) {
    const photoObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.isIntersecting ? activePhotos.add(entry.target) : activePhotos.delete(entry.target));
      requestPhotos();
    }, {rootMargin: '100px 0px'});
    positions.forEach((_, image) => photoObserver.observe(image));
  }
  addEventListener('scroll', requestPhotos, {passive:true});
  addEventListener('resize', requestPhotos, {passive:true});
  const restorePhotos = () => positions.forEach((base, image) => {image.style.objectPosition = base.original;});
  reduced.addEventListener('change', () => reduced.matches ? restorePhotos() : requestPhotos());
  document.addEventListener('visibilitychange', requestPhotos);
  addEventListener('beforeprint', restorePhotos);
  addEventListener('afterprint', requestPhotos);
  const namespace = 'http://www.w3.org/2000/svg';
  const targets = [];
  const makePath = (d, width, opacity) => {
    const path = document.createElementNS(namespace, 'path');
    path.setAttribute('d', d);
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', width);
    path.setAttribute('opacity', opacity);
    return path;
  };
  document.querySelectorAll('#main > .color-band, #site-footer').forEach((heading, index) => {
    if (!index) return;
    if (heading.closest('#ecrivez-nous') || heading.querySelector('.thread-title-copy')) return;
    const copy = document.createElement('span');
    copy.className = 'thread-title-copy section-thread-seam';
    copy.setAttribute('aria-hidden', 'true');
    const svg = document.createElementNS(namespace, 'svg');
    svg.classList.add('textile-underline');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('aria-hidden', 'true');
    copy.append(svg); heading.prepend(copy); targets.push(copy);
    let lastWidth = 0;
    const prepare = (path, delay, className = 'thread-strand') => {
      path.classList.add(className);
      path.style.setProperty('--thread-length', path.getTotalLength());
      path.style.setProperty('--strand-delay', delay + 'ms');
    };
    const draw = () => {
      const width = Math.max(90, heading.clientWidth);
      svg.style.width = width + "px";
      if (Math.abs(width-lastWidth)<1) return;
      lastWidth=width; svg.setAttribute('viewBox', '0 0 '+width+' 48');svg.replaceChildren();
      const left=2, right=width-2;
      const baseline = x => 23.4 + .65*Math.sin((x-left)/65);
      for(let strand=0;strand<7;strand++){
        let d='';
        for(let x=left;x<=right+.1;x+=1.4){const y=baseline(x)+Math.sin(x/7+strand*Math.PI/3.5)*3.1+(strand-3)*.48;d+=(x===left?'M':'L')+x.toFixed(2)+' '+y.toFixed(2)+' ';}
        const path=makePath(d,strand%3===0?1.8:1.35,.82+strand*.025);svg.append(path);prepare(path,strand*35);
      }
      const fibreCount=Math.floor((right-left)/12);
      for(let i=0;i<fibreCount;i++){
        const x=left+5+i*12,sign=i%2?1:-1,y=baseline(x)+sign*3.4;
        const path=makePath('M'+x+' '+y+'q.7 '+sign*1.2+' 2.3 '+sign*2.6,.55,.42);svg.append(path);path.classList.add('thread-fibre');
      }

    };
    draw();
    if('ResizeObserver'in window){const resize=new ResizeObserver(draw);resize.observe(copy);resize.observe(heading);}
    svg.addEventListener('animationend',event=>{if(event.target===svg&&event.animationName==='thread-pull')copy.classList.add('thread-complete')});
    // The heading's observer reveals this once; hovering does not restart it.
  });
  document.querySelectorAll('#main .client-card>img,#main .action-layout>img,#main .service-detail>img,#main .workshop-image-frame>img,#main .media-story-grid img,#main .media-experiment-grid img,#main .team-profiles img').forEach(image => image.classList.add('motion-photo'));
  const scrollCards = [];
  document.querySelectorAll('.client-card-grid,.review-grid,.workshop-track,.team-profiles,.media-story-grid,.media-experiment-grid').forEach(group => {
    [...group.children].forEach((card, index) => {
      card.classList.add('motion-card');
      scrollCards.push({card, stagger:Math.min(index, 3) * 16});
    });
  });
  // Standalone editorial photos rise as well as cards; never animate an image twice.
  document.querySelectorAll('#main .action-layout>img,#main .service-detail>img,#main .mcgee-wide-image,#main .about-encounter-layout>img').forEach(image => {
    if (image.closest('.motion-card')) return;
    image.classList.add('motion-card');
    scrollCards.push({card:image, stagger:0});
  });
  // Apply one consistent rise to each editorial section after a band boundary.
  // Move the section as a whole to avoid doubling motion on its nested cards.
  const editorialSections=[...document.querySelectorAll('#main > .color-band > section')];
  editorialSections.forEach(section=>{
    for(let i=scrollCards.length-1;i>=0;i--){
      if(section.contains(scrollCards[i].card)){
        scrollCards[i].card.classList.remove('motion-card');
        scrollCards.splice(i,1);
      }
    }
    section.classList.add('motion-card','motion-section');
    scrollCards.push({card:section,stagger:0});
  });
  // Card progress follows the viewport in both scroll directions.
  const visibleCards = new Set(scrollCards);
  let cardFrame = 0;
  const renderCards = () => {
    cardFrame = 0;
    if (document.hidden) return;
    visibleCards.forEach(({card, stagger}) => {
      if (reduced.matches) {
        card.style.setProperty('--card-rise', '0px');
        card.style.setProperty('--card-opacity', '1');
        return;
      }
      const translate = getComputedStyle(card).translate.split(' ');
      const currentY = parseFloat(translate[1]) || 0;
      const top = card.getBoundingClientRect().top - currentY;
      const progress = Math.max(0, Math.min(1, (innerHeight * .98 - top - stagger) / (innerHeight * .72)));
      const eased = progress * progress * (3 - 2 * progress);
      card.style.setProperty('--card-rise', (200 * (1 - eased)).toFixed(2) + 'px');
      card.style.setProperty('--card-opacity', (.42 + .58 * eased).toFixed(3));
    });
  };
  const requestCards = () => { if (!cardFrame) cardFrame = requestAnimationFrame(renderCards); };
  renderCards();
  if ('IntersectionObserver' in window) {
    const cardEntries = new Map(scrollCards.map(item => [item.card, item]));
    const cardObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const item = cardEntries.get(entry.target);
        if (entry.isIntersecting) visibleCards.add(item); else visibleCards.delete(item);
      });
      requestCards();
    }, {rootMargin:'100px 0px'});
    scrollCards.forEach(({card}) => cardObserver.observe(card));
  }
  addEventListener('scroll', requestCards, {passive:true});
  addEventListener('resize', requestCards, {passive:true});
  document.addEventListener('visibilitychange', requestCards);
  reduced.addEventListener('change', () => {
    scrollCards.forEach(item => visibleCards.add(item));
    requestCards();
  });
  document.addEventListener('focusout', requestCards);
  const arrive = target => target.classList.add(target.classList.contains('thread-title-copy') ? 'thread-visible' : 'motion-arrived');
  if (reduced.matches || !('IntersectionObserver' in window)) { targets.forEach(arrive); return; }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    arrive(entry.target); observer.unobserve(entry.target);
  }), { threshold: .15 });
  targets.forEach(target => observer.observe(target));
  document.addEventListener('focusin', event => {
    const card = event.target.closest?.('.motion-card'); if (card) arrive(card);
  });
  reduced.addEventListener('change', event => { if (event.matches) { observer.disconnect(); targets.forEach(arrive); } });
  addEventListener('beforeprint', () => targets.forEach(arrive));
})();
