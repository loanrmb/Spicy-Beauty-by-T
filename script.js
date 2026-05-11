/* script.js */
/* ═══════════════════════════════════════════
   SPICY BEAUTY BY T. — script.js
   avec animation gooey text au chargement
═══════════════════════════════════════════ */

(function() {
  /* Favicon rond généré dynamiquement */
  const img = new Image();
  img.onload = () => {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const ctx = c.getContext('2d');
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, 0, 0, 64, 64);
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = c.toDataURL();
    document.head.appendChild(link);
  };
  img.src = 'images/logo-spicy-beauty-by-t.jpg';

  /* ── Gooey text animation ── */
  const text1 = document.querySelector('.hero-morph-text-1');
  const text2 = document.querySelector('.hero-morph-text-2');
  const revealElements = document.querySelectorAll('.hero-reveal');
  const morphTime = 1.2; // secondes que dure l'animation
  let animationId;

  function setMorph(fraction) {
    // fraction entre 0 (début) et 1 (fin)
    if (text2) {
      const blur2 = Math.min(8 / fraction - 8, 100);
      text2.style.filter = `blur(${blur2}px)`;
      text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
    }
    if (text1) {
      const f1 = 1 - fraction;
      const blur1 = Math.min(8 / f1 - 8, 100);
      text1.style.filter = `blur(${blur1}px)`;
      text1.style.opacity = `${Math.pow(f1, 0.4) * 100}%`;
    }
  }

  function startGooeyAnimation() {
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;
      const fraction = Math.min(elapsed / morphTime, 1);
      setMorph(fraction);

      if (fraction < 1) {
        animationId = requestAnimationFrame(step);
      } else {
        // Animation terminée
        if (text2) {
          text2.style.filter = '';
          text2.style.opacity = '1';
        }
        if (text1) {
          text1.style.display = 'none';
        }
        // Révélation progressive du reste
        revealElements.forEach(el => el.classList.add('visible'));
        // Supprimer le filtre sur le conteneur pour éviter les artefacts
        const morphContainer = document.querySelector('.hero-morph');
        if (morphContainer) morphContainer.style.filter = '';
      }
    }

    animationId = requestAnimationFrame(step);
  }

  // État initial (fraction = 0)
  setMorph(0);
  // Lancer l'animation dès que possible
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startGooeyAnimation);
  } else {
    startGooeyAnimation();
  }

  /* ── Nav scroll shadow ── */
  const navPill = document.getElementById('navPill');
  window.addEventListener('scroll', () => {
    navPill && navPill.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  /* ── Hamburger / Drawer ── */
  const hbg = document.getElementById('hbg');
  const drw = document.getElementById('drawer');

  function openDrawer() {
    drw.classList.add('open');
    document.body.style.overflow = 'hidden';
    const s = hbg.querySelectorAll('span');
    s[0].style.transform = 'rotate(45deg) translate(5px,5px)';
    s[1].style.opacity   = '0';
    s[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
  }

  function closeDrawer() {
    drw.classList.remove('open');
    document.body.style.overflow = '';
    hbg.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity   = '';
    });
  }

  hbg.addEventListener('click', () =>
    drw.classList.contains('open') ? closeDrawer() : openDrawer()
  );

  /* ── Popup contact ── */
  const overlay = document.getElementById('overlay');
  function openPopup()  { overlay.classList.add('active');    document.body.style.overflow = 'hidden'; }
  function closePopup() { overlay.classList.remove('active'); document.body.style.overflow = ''; }
  function outClick(e)  { if (e.target === overlay) closePopup(); }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closePopup(); closeDrawer(); }
  });

  /* Rendre accessibles dans le HTML */
  window.openPopup = openPopup;
  window.closePopup = closePopup;
  window.closeDrawer = closeDrawer;
  window.outClick = outClick;

  /* ── Toggle Nails / Épilations ── */
  function switchTab(tab) {
    document.querySelectorAll('.tarif-panel').forEach(p => {
      p.classList.toggle('active', p.dataset.tab === tab);
    });
    document.querySelectorAll('.toggle-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });
  }
  window.switchTab = switchTab;
  /* Init : Nails en premier */
  switchTab('nails');

  /* ── Scroll reveal général ── */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('vis');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.anim-up, .anim-left, .anim-right, .anim-scale')
    .forEach(el => revealObs.observe(el));

  /* ── Carousel galerie mobile ── */
  (function () {
    const car = document.querySelector('.gal-carousel');
    if (!car) return;

    const track  = car.querySelector('.gal-car-track');
    const slides = car.querySelectorAll('.gal-car-slide');
    const dots   = car.querySelectorAll('.gal-car-dot');
    const btnPrev = car.querySelector('.gal-car-prev');
    const btnNext = car.querySelector('.gal-car-next');
    const total  = slides.length;
    let current  = 0;
    let timer;

    function goTo(n) {
      current = ((n % total) + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function startAuto() {
      clearInterval(timer);
      timer = setInterval(() => goTo(current + 1), 3000);
    }

    btnPrev.addEventListener('click', () => { goTo(current - 1); startAuto(); });
    btnNext.addEventListener('click', () => { goTo(current + 1); startAuto(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); startAuto(); }));

    /* Swipe tactile */
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) { goTo(current + (dx < 0 ? 1 : -1)); startAuto(); }
    }, { passive: true });

    /* Pause au survol (desktop) */
    car.addEventListener('mouseenter', () => clearInterval(timer));
    car.addEventListener('mouseleave', startAuto);

    goTo(0);
    startAuto();
  })();

  /* ── Leaflet map ── */
  document.addEventListener('DOMContentLoaded', () => {
    const lat = 50.352253, lng = 3.494597;
    const isMobile = window.innerWidth < 768;

    const map = L.map('leaflet-map', {
      center:           [lat, lng],
      zoom:             isMobile ? 13 : 14,
      zoomControl:      false,
      scrollWheelZoom:  false,
      dragging:         !isMobile,
      doubleClickZoom:  false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    L.circle([lat, lng], {
      radius:      1000,
      color:       '#ffd3fa',
      fillColor:   '#ffd3fa',
      fillOpacity: 0.12,
      weight:      2.5,
      dashArray:   '8 5',
      opacity:     0.9
    }).addTo(map);
  });
})();