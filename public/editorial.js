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
    const show = (index) => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.classList.toggle('is-active', i === current);
        slide.setAttribute('aria-hidden', String(i !== current));
        dots[i].setAttribute('aria-pressed', String(i === current));
      });
      hero.querySelector('.slide-title').textContent = labels[current].title;
      hero.querySelector('.slide-description').textContent = labels[current].description;

      const img = slides[(current + 1) % slides.length].querySelector('img');
      img.loading = 'eager';
    };
    const start = () => {
      clearInterval(timer);
      if (!paused && !document.hidden) timer = setInterval(() => show(current + 1), 5000);
      if (pause) pause.textContent = paused ? '▷' : 'Ⅱ';
      pause?.setAttribute('aria-label', paused ? 'Lancer le diaporama' : 'Mettre le diaporama en pause');
    };
    dots.forEach((dot, i) => dot.addEventListener('click', () => { show(i); start(); }));
    pause?.addEventListener('click', () => { paused = !paused; start(); });
    hero.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        show(current + (event.key === 'ArrowRight' ? 1 : -1));
        dots[current].focus();
        start();
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
    const events = window.neotisseWorkshops || [];
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
      const upcoming = events.filter(event => event.date >= key(today));
      const displayed = matching.length ? matching : upcoming;
      if (!displayed.length) {
        const empty = document.createElement('div');
        empty.className = 'day-empty';
        empty.innerHTML = '<span aria-hidden="true">✳</span><div><h4>Un rendez-vous à venir.</h4><p>Aucune rencontre annoncée pour cette date. Les prochains ateliers seront présentés ici dès leur confirmation.</p><a class="text-link" href="contact.html?motif=atelier#ecrivez-nous">Organiser une rencontre</a></div>';
        list.append(empty);
      }
      if (!matching.length && upcoming.length) {
        calendar.querySelector('.selected-date').textContent = 'Les prochaines prestations de Néotisse';
        const info = document.createElement('p'); info.className = 'calendar-list-intro';
        info.textContent = 'Aucun atelier ce jour-là. Découvrez les prochains rendez-vous ci-dessous et sélectionnez une date marquée dans le calendrier.';
        list.append(info);
      }
      displayed.forEach((event) => {
        const item = document.createElement('article'); item.className = 'calendar-photo-card';
        const image = document.createElement('img'); image.src = `assets/media/${event.image}`; image.alt = event.title; image.loading = 'lazy';
        const copy = document.createElement('div');
        const date = document.createElement('time'); date.dateTime = event.date; date.textContent = new Date(event.date+'T12:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'});
        const title = document.createElement('h4'); title.textContent = event.title;
        const hours = document.createElement('p'); hours.textContent = `${event.start} · ${event.place}`;
        const badge = document.createElement('p'); badge.className = 'calendar-demo'; badge.textContent = 'Atelier et horaires d’exemple · sans inscription';
        const detail = document.createElement('details');
        const summary = document.createElement('summary'); summary.textContent = 'Voir les détails';
        const description = document.createElement('p'); description.textContent = event.description;
        detail.append(summary,description); copy.append(date,title,hours,badge,detail); item.append(image,copy); list.append(item);
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
        const count = events.filter(event => event.date === key(date)).length;
        if (count) {
          button.classList.add('has-event');
          button.setAttribute('aria-label', button.getAttribute('aria-label') + `, ${count} atelier d’exemple`);
        }
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

// Gentle section reveals; preserve native scrolling and reduced-motion settings.
(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !('IntersectionObserver' in window)) return;
  const targets = document.querySelectorAll('main > section:not(.hero-slideshow):not(.curved-hero):not(.client-intro)');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('scroll-settled');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
  targets.forEach(target => {
    if (target.getBoundingClientRect().top < innerHeight - 24) return;
    target.classList.add('scroll-gentle');
    observer.observe(target);
  });
  const revealAll = () => {
    observer.disconnect();
    targets.forEach(target => target.classList.add('scroll-settled'));
  };
  document.addEventListener('focusin', event => {
    event.target.closest?.('.scroll-gentle')?.classList.add('scroll-settled');
  });
  preference.addEventListener('change', event => { if (event.matches) revealAll(); });
  addEventListener('beforeprint', revealAll);
})();
