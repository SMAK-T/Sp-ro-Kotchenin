(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const hero = document.querySelector('.hero-slideshow');
  if (hero) {
    const slides = [...hero.querySelectorAll('.hero-slide')];
    const dots = [...hero.querySelectorAll('[data-slide]')];
    const labels = JSON.parse(document.querySelector('#slide-data').textContent);
    const pause = hero.querySelector('.slide-pause');
    let current = 0;
    let paused = reducedMotion.matches;
    let timer;
    let hovered = false;
    const show = (index) => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.classList.toggle('is-active', i === current);
        slide.setAttribute('aria-hidden', String(i !== current));
        dots[i].setAttribute('aria-pressed', String(i === current));
      });
      hero.querySelector('.slide-title').textContent = labels[current].title;
      hero.querySelector('.slide-description').textContent = labels[current].description;
      hero.querySelector('.slide-number').textContent = `${String(current + 1).padStart(2, '0')} / 05`;
      const img = slides[(current + 1) % slides.length].querySelector('img');
      img.loading = 'eager';
    };
    const start = () => {
      clearInterval(timer);
      if (!paused && !hovered && !document.hidden && !hero.matches(':focus-within')) timer = setInterval(() => show(current + 1), 6500);
      pause.textContent = paused ? '▷' : 'Ⅱ';
      pause.setAttribute('aria-label', paused ? 'Lancer le diaporama' : 'Mettre le diaporama en pause');
    };
    dots.forEach((dot, i) => dot.addEventListener('click', () => { show(i); start(); }));
    pause.addEventListener('click', () => { paused = !paused; start(); });
    hero.addEventListener('mouseenter', () => { hovered = true; start(); });
    hero.addEventListener('mouseleave', () => { hovered = false; start(); });
    hero.addEventListener('focusin', () => clearInterval(timer));
    hero.addEventListener('focusout', () => requestAnimationFrame(start));
    hero.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        show(current + (event.key === 'ArrowRight' ? 1 : -1));
        dots[current].focus();
      }
    });
    document.addEventListener('visibilitychange', start);
    reducedMotion.addEventListener('change', () => { paused = reducedMotion.matches; start(); });
    start();
  }

  document.querySelectorAll('.partner-carousel').forEach((carousel) => {
    const track = carousel.querySelector('.partner-gallery');
    const move = (direction) => track.scrollBy({ left: direction * track.clientWidth * .8, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    carousel.querySelector('.partner-prev').addEventListener('click', () => move(-1));
    carousel.querySelector('.partner-next').addEventListener('click', () => move(1));
    track.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1);
      }
    });
    track.querySelectorAll('article').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        if (reducedMotion.matches || event.pointerType !== 'mouse') return;
        const bounds = card.getBoundingClientRect();
        card.style.setProperty('--tilt-x', `${((event.clientX - bounds.left) / bounds.width - .5) * 9}deg`);
        card.style.setProperty('--tilt-y', `${-((event.clientY - bounds.top) / bounds.height - .5) * 7}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--tilt-x', '0deg'); card.style.setProperty('--tilt-y', '0deg');
      });
    });
  });

  const calendar = document.querySelector('.workshop-calendar');
  if (calendar) {
    // Only confirmed events belong here. Empty until the association supplies its dates.
    const events = [];
    const today = new Date();
    let shown = new Date(today.getFullYear(), today.getMonth(), 1);
    let selected = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const grid = calendar.querySelector('.calendar-grid');
    const key = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const dayPanel = () => {
      calendar.querySelector('.selected-date').textContent = selected.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      const list = calendar.querySelector('.day-events');
      list.replaceChildren();
      const matching = events.filter((event) => event.date === key(selected));
      if (!matching.length) {
        const empty = document.createElement('div');
        empty.className = 'day-empty';
        empty.innerHTML = '<span aria-hidden="true">✳</span><div><h4>Un rendez-vous à venir.</h4><p>Aucune rencontre annoncée pour cette date. Les prochains ateliers seront présentés ici dès leur confirmation.</p><a class="text-link" href="contact.html?motif=atelier#ecrivez-nous">Organiser une rencontre</a></div>';
        list.append(empty);
      }
      matching.forEach((event) => {
        const item = document.createElement('details'); item.className = 'event-list-card';
        const summary = document.createElement('summary'); summary.textContent = `${event.title} · ${event.start}`;
        const description = document.createElement('p'); description.textContent = `${event.place} — ${event.description}`;
        item.append(summary, description); list.append(item);
      });
    };
    const render = (focusDay) => {
      calendar.querySelector('.calendar-month').textContent = shown.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      grid.replaceChildren();
      ['Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.', 'Dim.'].forEach((name) => {
        const el = document.createElement('div'); el.className = 'weekday'; el.textContent = name; grid.append(el);
      });
      const offset = (shown.getDay() + 6) % 7;
      const days = new Date(shown.getFullYear(), shown.getMonth() + 1, 0).getDate();
      for (let i = 0; i < offset; i++) { const blank = document.createElement('div'); blank.setAttribute('aria-hidden', 'true'); grid.append(blank); }
      for (let day = 1; day <= days; day++) {
        const date = new Date(shown.getFullYear(), shown.getMonth(), day);
        const button = document.createElement('button'); button.type = 'button'; button.className = 'calendar-date'; button.textContent = day;
        button.setAttribute('aria-label', date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
        button.setAttribute('aria-pressed', String(key(date) === key(selected)));
        if (key(date) === key(today)) button.setAttribute('aria-current', 'date');
        button.addEventListener('click', () => { selected = date; render(day); });
        grid.append(button);
      }
      calendar.querySelector('.calendar-status').textContent = 'Sélectionnez une date pour consulter ses rendez-vous.';
      dayPanel();
      if (focusDay) grid.querySelectorAll('.calendar-date')[focusDay - 1]?.focus({ preventScroll: true });
    };
    calendar.querySelectorAll('[data-month]').forEach((button) => button.addEventListener('click', () => {
      if (button.dataset.month === 'today') {
        shown = new Date(today.getFullYear(), today.getMonth(), 1); selected = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      } else {
        shown = new Date(shown.getFullYear(), shown.getMonth() + (button.dataset.month === 'next' ? 1 : -1), 1);
        selected = new Date(shown.getFullYear(), shown.getMonth(), 1);
      }
      render();
    }));
    render();
  }
})();
