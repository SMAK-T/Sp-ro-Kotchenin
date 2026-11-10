(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
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
  document.querySelectorAll('#main h2').forEach(heading => {
    if (heading.querySelector('.thread-title-copy')) return;
    const copy = document.createElement('span');
    copy.className = 'thread-title-copy';
    while (heading.firstChild) copy.append(heading.firstChild);
    const svg = document.createElementNS(namespace, 'svg');
    svg.classList.add('textile-underline');
    svg.setAttribute('viewBox', '0 32 640 34');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');
    const baseline = x => 48 + 4 * Math.sin(x / 110) + 1.6 * Math.sin(x / 39);
    for (let strand = 0; strand < 7; strand++) {
      let d = '';
      for (let x = 8; x <= 625; x += 3) {
        const y = baseline(x) + Math.sin(x / 6 + strand * Math.PI / 3.5) * 2.8 + (strand - 3) * .4;
        d += `${x === 8 ? 'M' : 'L'}${x} ${y.toFixed(2)} `;
      }
      svg.append(makePath(d, strand % 3 === 0 ? 1.8 : 1.15, .62 + strand * .05));
    }
    for (let i = 0; i < 110; i++) {
      const x = 10 + i * 5.55, sign = i % 2 ? 1 : -1;
      const y = baseline(x) + sign * 2, len = 3 + (Math.sin(i * 7.7) + 1) * 4;
      svg.append(makePath(`M${x} ${y}q${Math.sin(i * 5.3) * 3} ${sign * len * .6} 2 ${sign * len}`, .7, .65));
    }
    copy.append(svg); heading.append(copy); targets.push(copy);
    [...svg.children].forEach((path, index) => {
      if (index < 7) {
        path.classList.add('thread-strand');
        path.style.setProperty('--thread-length', path.getTotalLength());
        path.style.setProperty('--strand-delay', `${index * 45}ms`);
      } else path.classList.add('thread-fibre');
    });
    heading.addEventListener('pointerenter', event => {
      if (reduced.matches || event.pointerType !== 'mouse' || !copy.classList.contains('thread-visible')) return;
      copy.classList.remove('thread-visible');
      void copy.offsetWidth;
      copy.classList.add('thread-visible');
    });
  });
  document.querySelectorAll('#main .client-card>img,#main .action-layout>img,#main .service-detail>img,#main .workshop-image-frame>img,#main .media-story-grid img,#main .media-experiment-grid img,#main .team-profiles img').forEach(image => image.classList.add('motion-photo'));
  document.querySelectorAll('.client-card-grid,.review-grid,.workshop-track').forEach(group => {
    [...group.children].forEach((card, index) => {
      card.classList.add('motion-card');
      card.style.setProperty('--motion-delay', `${Math.min(index, 4) * 90}ms`);
      targets.push(card);
    });
  });
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
