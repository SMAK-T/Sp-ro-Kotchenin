(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = matchMedia('(hover: hover) and (pointer: fine)');
  const frames = document.querySelectorAll('.about-photo-break, .about-panorama');
  frames.forEach(frame => {
    let nextX = 0, nextY = 0, x = 0, y = 0, raf = 0;
    const reset = () => {
      cancelAnimationFrame(raf); raf = 0;
      x = y = nextX = nextY = 0;
      frame.classList.remove('photo-following');
      frame.style.removeProperty('--photo-x');
      frame.style.removeProperty('--photo-y');
    };
    const render = () => {
      x += (nextX - x) * .12;
      y += (nextY - y) * .12;
      frame.style.setProperty('--photo-x', `${x.toFixed(2)}px`);
      frame.style.setProperty('--photo-y', `${y.toFixed(2)}px`);
      if (Math.abs(nextX - x) + Math.abs(nextY - y) > .04) raf = requestAnimationFrame(render);
      else raf = 0;
    };
    frame.addEventListener('pointermove', event => {
      if (reduce.matches || !pointer.matches || event.pointerType === 'touch') return;
      const rect = frame.getBoundingClientRect();
      nextX = ((event.clientX - rect.left) / rect.width - .5) * 24;
      nextY = ((event.clientY - rect.top) / rect.height - .5) * 18;
      frame.classList.add('photo-following');
      if (!raf) raf = requestAnimationFrame(render);
    });
    frame.addEventListener('pointerleave', reset);
    frame.addEventListener('pointercancel', reset);
    reduce.addEventListener('change', reset);
    pointer.addEventListener('change', reset);
    document.addEventListener('visibilitychange', () => { if (document.hidden) reset(); });
  });
})();
