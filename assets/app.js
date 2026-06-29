/* ════════════════════════════════════════════════════
   EKKLESIAMX — app.js compartido (todas las páginas)
   ════════════════════════════════════════════════════ */

// ── CURSOR DE PUNTO (visible desde el primer frame, incluido el hero) ──
(function(){
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
  const dot = document.createElement('div');
  dot.id = 'dot-cursor';
  document.documentElement.appendChild(dot);
  let mx = -50, my = -50, cx = -50, cy = -50, started = false;
  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (!started){ cx = mx; cy = my; started = true; dot.style.opacity = '1'; }
  });
  function loop(){
    cx += (mx - cx) * 0.35; cy += (my - cy) * 0.35;
    dot.style.left = cx + 'px'; dot.style.top = cy + 'px';
    requestAnimationFrame(loop);
  }
  loop();
  document.addEventListener('mousedown', () => dot.classList.add('is-down'));
  document.addEventListener('mouseup', () => dot.classList.remove('is-down'));
  const hoverSelector = 'a, button, .id-card, [data-hover], input, textarea, select, .ver-mas, .index-pull, .menu-nav a';
  document.addEventListener('mouseover', e => { if (e.target.closest(hoverSelector)) dot.classList.add('is-hover'); });
  document.addEventListener('mouseout', e => { if (e.target.closest(hoverSelector)) dot.classList.remove('is-hover'); });
})();

// ── GRANO GLOBAL ──
(function(){
  if (document.querySelector('.grain')) return;
  const g = document.createElement('div');
  g.className = 'grain';
  document.body.appendChild(g);
})();

// ── SCROLL PROGRESS ──
(function(){
  const bar = document.getElementById('progress-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = scrolled + '%';
  }, { passive:true });
})();

// ── HAMBURGER / MENU OVERLAY ──
(function(){
  const hamburger = document.getElementById('hamburgerBtn');
  const menuOverlay = document.getElementById('menuOverlay');
  if (!hamburger || !menuOverlay) return;
  let menuOpen = false;
  function toggleMenu(){
    menuOpen = !menuOpen;
    hamburger.classList.toggle('open', menuOpen);
    menuOverlay.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }
  function closeMenu(){
    menuOpen = false;
    hamburger.classList.remove('open');
    menuOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  hamburger.addEventListener('click', e => { e.stopPropagation(); toggleMenu(); });
  hamburger.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(); }});
  menuOverlay.addEventListener('click', e => { if (e.target === menuOverlay) closeMenu(); });
  menuOverlay.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
})();

// ── PESTAÑA-ÍNDICE EN LA ORILLA SUPERIOR (se despliega al acercar el cursor) ──
(function(){
  const pull = document.getElementById('indexPull');
  const panel = document.getElementById('indexPanel');
  if (!pull || !panel) return;
  let openTimer, closeTimer;
  function open(){
    clearTimeout(closeTimer);
    openTimer = setTimeout(() => { panel.classList.add('open'); pull.classList.add('lit'); }, 80);
  }
  function close(){
    clearTimeout(openTimer);
    closeTimer = setTimeout(() => { panel.classList.remove('open'); pull.classList.remove('lit'); }, 220);
  }
  pull.addEventListener('mouseenter', open);
  panel.addEventListener('mouseenter', open);
  pull.addEventListener('mouseleave', close);
  panel.addEventListener('mouseleave', close);
  pull.addEventListener('click', () => panel.classList.contains('open') ? close() : open());
  panel.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
})();

// ── MARCAR LINK ACTIVO según la página actual ──
(function(){
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('a.nav-link, .menu-nav a, .index-panel-link').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    const file = href.split('/').pop();
    if (file === path || (path === '' && file === 'index.html')) {
      a.classList.add('is-active');
    }
  });
})();

// ── SCROLL REVEAL CINEMÁTICO (soporta variantes: fade, slide-left/right, scale, clip) ──
(function(){
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting){
        e.target.classList.add('visible');
        if (e.target.dataset.once !== 'false') obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -6% 0px' });
  reveals.forEach(el => obs.observe(el));
})();

// ── PARALLAX SUTIL para elementos con [data-parallax] ──
(function(){
  const items = document.querySelectorAll('[data-parallax]');
  if (!items.length) return;
  let ticking = false;
  function update(){
    const vh = window.innerHeight;
    items.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.15;
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - vh / 2;
      el.style.transform = `translateY(${(-center * speed).toFixed(1)}px)`;
    });
    ticking = false;
  }
  window.addEventListener('scroll', () => { if (!ticking){ requestAnimationFrame(update); ticking = true; } }, { passive:true });
  update();
})();

// ── SMOOTH SCROLL para anclas internas ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ── AUDIO POR SECCIÓN (cada página define su propia pista vía window.EKKLESIA_TRACK) ──
(function(){
  const cfg = window.EKKLESIA_TRACK;
  if (!cfg || !cfg.src) return;

  const STORAGE_KEY = 'ekklesia-audio-muted';
  const isMuted = () => localStorage.getItem(STORAGE_KEY) === '1';
  const setMuted = v => localStorage.setItem(STORAGE_KEY, v ? '1' : '0');
  const targetVolume = cfg.volume || 0.22;

  // Si la página ya gestiona su propio <audio> (ej. Inicio, con modal de bienvenida),
  // usamos ESE elemento en vez de crear uno nuevo, para no duplicar la reproducción.
  const audio = cfg.useExisting ? document.getElementById(cfg.useExisting) : new Audio(cfg.src);
  if (!audio) return;
  if (!cfg.useExisting){ audio.loop = true; audio.volume = 0; audio.preload = 'auto'; }

  function fadeTo(vol, ms){
    const start = audio.volume, delta = vol - start, steps = Math.max(1, Math.round(ms / 30));
    let i = 0;
    const id = setInterval(() => {
      i++;
      audio.volume = Math.max(0, Math.min(1, start + delta * (i / steps)));
      if (i >= steps) clearInterval(id);
    }, 30);
  }

  function buildToggle(){
    const btn = document.createElement('button');
    btn.id = 'audioToggle';
    btn.setAttribute('aria-label', 'Activar o silenciar música');
    btn.innerHTML = '<span class="audio-bars"><i></i><i></i><i></i></span>';
    document.body.appendChild(btn);
    return btn;
  }
  const toggle = buildToggle();

  function refreshIcon(){ toggle.classList.toggle('is-muted', isMuted() || audio.paused); }

  function tryPlay(){
    audio.play().then(() => { fadeTo(targetVolume, 900); refreshIcon(); })
      .catch(() => { refreshIcon(); }); // bloqueado por el navegador hasta interacción
  }

  if (cfg.useExisting){
    // El audio ya existente arranca cuando el propio modal/flujo de la página lo decide;
    // aquí solo reflejamos su estado en el botón.
    audio.addEventListener('play', refreshIcon);
    audio.addEventListener('pause', refreshIcon);
    refreshIcon();
  } else if (!isMuted()) {
    tryPlay();
    const resume = () => { if (!isMuted() && audio.paused) tryPlay(); document.removeEventListener('pointerdown', resume); };
    document.addEventListener('pointerdown', resume, { once:true });
  } else {
    refreshIcon();
  }

  toggle.addEventListener('click', () => {
    if (cfg.useExisting && document.getElementById('modal-identidad') && !document.getElementById('modal-identidad').classList.contains('modal-oculto')) {
      return; // el modal de bienvenida aún no se respondió; el botón flotante no debe adelantarse
    }
    if (audio.paused || isMuted()){
      setMuted(false);
      tryPlay();
    } else {
      setMuted(true);
      fadeTo(0, 500);
      setTimeout(() => audio.pause(), 520);
      refreshIcon();
    }
  });

  window.addEventListener('beforeunload', () => { try{ audio.pause(); }catch(e){} });
})();
