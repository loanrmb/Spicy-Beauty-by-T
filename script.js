/* ═══════════════════════════════════════════
   SPICY BEAUTY BY T. — script.js
═══════════════════════════════════════════ */

/* ── Config ── */
/* Clé API CARTO — publique par nature (restreinte par domaine côté CARTO),
   requise depuis que les basemaps raster refusent les requêtes sans clé. */
const CARTO_KEY = 'cb1_2jk2_1_04e082adc4a2b9696094dd18';

/* ── Favicon rond généré dynamiquement ── */
(function() {
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
})();
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


/* ── Toggle Nails / Épilations ── */
function switchTab(tab) {
  /* Panels */
  document.querySelectorAll('.tarif-panel').forEach(p => {
    p.classList.toggle('active', p.dataset.tab === tab);
  });
  /* Boutons */
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
}
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


/* ═══════════════════════════════════════════
   GALERIE CAROUSEL — horizontal, peek + infinite loop
═══════════════════════════════════════════ */
(function () {
  const wrap = document.querySelector('.gal-carousel-wrap');
  if (!wrap) return;

  const track   = wrap.querySelector('#galTrack');
  const dotsBox = wrap.querySelector('#galDots');
  const btnPrev = wrap.querySelector('.gal-prev');
  const btnNext = wrap.querySelector('.gal-next');
  if (!track || !dotsBox) return;

  /* ── Photos (plus récentes en premier, puis nouveaux ajouts 15→30) ──
     w/h = dimensions intrinsèques réelles du fichier (ratio, anti-CLS). */
  const GAL_PHOTOS = [
    { src: 'images/gallery-12.jpeg', w: 3072, h: 4096, alt: 'Réalisation Spicy Beauty by T.' },
    { src: 'images/gallery-13.jpeg', w: 3072, h: 4096, alt: 'Nail art Spicy Beauty by T.' },
    { src: 'images/gallery-14.jpeg', w: 2390, h: 3187, alt: 'Manucure semi-permanent Spicy Beauty' },
    { src: 'images/gallery-11.jpeg', w: 3024, h: 4032, alt: 'Manucure Spicy Beauty by T.' },
    { src: 'images/gallery-10.jpeg', w: 3024, h: 4032, alt: 'Capsules gel Spicy Beauty' },
    { src: 'images/gallery-9.jpeg',  w: 3024, h: 4032, alt: 'Semi-permanent Spicy Beauty' },
    { src: 'images/gallery-8.jpeg',  w: 3024, h: 4032, alt: 'Nail art Spicy Beauty by T.' },
    { src: 'images/gallery-5.jpg',   w: 3024, h: 4032, alt: 'Nail art semi-permanent' },
    { src: 'images/gallery-3.jpg',   w: 1320, h: 1484, alt: 'Pédicure Spicy Beauty' },
    { src: 'images/gallery-2.jpg',   w: 1320, h: 1516, alt: 'Ongles capsules extension' },
    { src: 'images/gallery-1.jpg',   w: 1440, h: 1920, alt: 'Réalisation Spicy Beauty by T.' },
    { src: 'images/gallery-15.jpeg', w: 3072, h: 4096, alt: 'Pose de semi-permanent sur ongles naturels réalisée à Valenciennes' },
    { src: 'images/gallery-16.jpeg', w: 3024, h: 4032, alt: 'Nail art sur mesure par l\'esthéticienne Spicy Beauty by T. à Valenciennes' },
    { src: 'images/gallery-18.jpeg', w: 3024, h: 4032, alt: 'Manucure et pose de capsules gel en institut de beauté à Valenciennes' },
    { src: 'images/gallery-19.jpeg', w: 3024, h: 3334, alt: 'Ongles en gel effet baby boomer, salon de beauté à Valenciennes' },
    { src: 'images/gallery-21.jpeg', w: 3024, h: 4032, alt: 'Semi-permanent longue tenue sur mains soignées, Valenciennes' },
    { src: 'images/gallery-22.jpeg', w: 3024, h: 4032, alt: 'Nail art coloré réalisé chez Spicy Beauty by T., Valenciennes' },
    { src: 'images/gallery-23.jpeg', w: 3024, h: 4032, alt: 'Pose d\'ongles avec gainage, prestation beauté à Valenciennes' },
    { src: 'images/gallery-26.jpeg', w: 3024, h: 4032, alt: 'Manucure française revisitée par Spicy Beauty by T. à Valenciennes' },
    { src: 'images/gallery-28.jpeg', w: 3024, h: 4032, alt: 'Vernis semi-permanent effet miroir chrome, Valenciennes 59300' },
    { src: 'images/gallery-29.jpeg', w: 3024, h: 4032, alt: 'Remplissage et entretien d\'ongles en gel à Valenciennes' },
    { src: 'images/gallery-30.jpeg', w: 3024, h: 4032, alt: 'Réalisation ongles Spicy Beauty by T., esthéticienne à Valenciennes' },
  ];

  const n = GAL_PHOTOS.length;
  const TRANSITION = 'transform .6s cubic-bezier(.16,1,.3,1)';
  /* Les 2 premiers slides sont visibles au chargement (actif + peek) → eager */
  const EAGER_COUNT = Math.min(2, n);
  /* Margin de chaque côté du slide — doit matcher le CSS (10px desktop, 8px mobile) */
  const getMargin = () => (window.innerWidth <= 860 ? 8 : 10);

  /* ── Build slide DOM ── */
  function buildSlide(photo, isClone = false, eager = false) {
    const slide = document.createElement('div');
    slide.className = 'gal-slide';
    if (isClone) slide.dataset.clone = 'true';
    const img = document.createElement('img');
    img.src = photo.src;
    img.alt = photo.alt;
    img.width  = photo.w;
    img.height = photo.h;
    img.loading = eager ? 'eager' : 'lazy';
    img.decoding = 'async';
    slide.appendChild(img);
    return slide;
  }

  /* ── Injection : clone(last) + reals + clone(first) ── */
  track.appendChild(buildSlide(GAL_PHOTOS[n - 1], true));      // index 0  = clone du dernier
  GAL_PHOTOS.forEach((p, i) => track.appendChild(buildSlide(p, false, i < EAGER_COUNT))); // index 1..n = vrais slides
  track.appendChild(buildSlide(GAL_PHOTOS[0], true));          // index n+1 = clone du premier

  const slides = track.querySelectorAll('.gal-slide');

  /* ── Dots (n, basés sur les vrais slides uniquement) ── */
  for (let i = 0; i < n; i++) {
    const d = document.createElement('button');
    d.className = 'gal-dot';
    d.setAttribute('aria-label', `Photo ${i + 1}`);
    d.addEventListener('click', () => goTo(i + 1));
    dotsBox.appendChild(d);
  }
  const dots = dotsBox.querySelectorAll('.gal-dot');

  let current = 1;

  /* ── Update visuel ── */
  function getSlideOffset(index) {
    /* Centre le slide actif dans le wrapper, en pixels */
    const slide = track.querySelector('.gal-slide');
    if (!slide) return 0;
    const wrapW   = wrap.offsetWidth;
    const slideW  = slide.offsetWidth;
    const margin  = getMargin();
    const totalW  = slideW + margin * 2;
    const center  = (wrapW - slideW) / 2 - margin;
    return center - index * totalW;
  }

  function updateTransform() {
    track.style.transform = `translateX(${getSlideOffset(current)}px)`;
  }

  function updateDots() {
    const real = ((current - 1) % n + n) % n;
    dots.forEach((d, i) => d.classList.toggle('active', i === real));
    slides.forEach((s, i) => s.classList.toggle('active', i === current));
  }

  /* ── Navigation ── */
  function goTo(index, animate = true) {
    track.style.transition = animate ? TRANSITION : 'none';
    current = index;
    updateTransform();
    updateDots();
  }

  /* ── Reset infinite loop après transition ── */
  track.addEventListener('transitionend', () => {
    if (current === 0)      goTo(n, false);          // clone du dernier → vrai dernier
    else if (current === n + 1) goTo(1, false);      // clone du premier → vrai premier
  });

  /* ── Boutons ── */
  btnPrev.addEventListener('click', () => goTo(current - 1));
  btnNext.addEventListener('click', () => goTo(current + 1));

  /* ── Swipe horizontal (touch + mouse drag) ── */
  let startX = 0, dragging = false;
  const THRESHOLD = 40;

  function onSwipeEnd(x) {
    if (!dragging) return;
    dragging = false;
    const dx = x - startX;
    if (Math.abs(dx) > THRESHOLD) goTo(current + (dx < 0 ? 1 : -1));
  }

  /* Touch — passive : on ne bloque pas le scroll vertical natif de la page */
  track.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    dragging = true;
  }, { passive: true });

  track.addEventListener('touchend', e => {
    onSwipeEnd(e.changedTouches[0].clientX);
  }, { passive: true });

  /* Mouse drag (desktop) */
  track.addEventListener('mousedown', e => {
    e.preventDefault();
    startX = e.clientX;
    dragging = true;
  });
  document.addEventListener('mouseup', e => {
    if (dragging) onSwipeEnd(e.clientX);
  });
  track.addEventListener('mouseleave', () => { dragging = false; });

  /* ── Resize : recalcule l'offset pixel (debounce 150ms, sans animation) ── */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      track.style.transition = 'none';
      track.style.transform = `translateX(${getSlideOffset(current)}px)`;
    }, 150);
  });

  /* ── Init : positionner sur le premier vrai slide sans transition ── */
  goTo(1, false);

  /* Recaler après chargement complet (images/fonts) — sécurise les dimensions */
  window.addEventListener('load', () => {
    track.style.transition = 'none';
    track.style.transform = `translateX(${getSlideOffset(current)}px)`;
  });
})();

document.addEventListener('DOMContentLoaded', () => {
  /* Centre : au-dessus de l'Étang du Vignoble, NW de Valenciennes */
  const lat = 50.352253, lng = 3.494597; /* 190 Avenue de Denain, Valenciennes */
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

  /* Tiles CartoDB Positron — grises et élégantes */
  L.tileLayer(`https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png?key=${CARTO_KEY}`, {
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  /* Cercle zone 1km */
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

/* ═══════════════════════════════════════════
   HERO — lance la séquence d'apparition au
   FIRST CONTENTFUL PAINT réel (pas au parse ni
   à DOMContentLoaded).

   Pourquoi : les @keyframes hFade/hSlideUp sont
   en pause (CSS : .js .hero-*) jusqu'à l'ajout
   de .hero.play. Une fois lancées, elles
   avancent sur l'horloge du document (wall-clock).
   Sur mobile, le FCP arrive APRÈS DOMContentLoaded
   (leaflet.js render-blocking, CPU lent, décodage
   vidéo). Un déclencheur ancré à DCL (rAF/DOMContentLoaded)
   démarrait donc l'horloge AVANT que la hero soit
   peinte → tout l'échelonnement s'écoulait pendant
   l'intervalle invisible et le texte apparaissait
   d'un coup. On attend le FCP pour démarrer pile
   quand le contenu devient visible.

   Émet aussi l'événement `hero:play` pour garder le
   titre gooey synchronisé sur le même signal.
═══════════════════════════════════════════ */
(function () {
  var hero = document.querySelector('.hero');
  if (!hero) return;

  var reduce = window.matchMedia &&
               window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var started = false;

  function start() {
    if (started) return;
    started = true;
    hero.classList.add('play');
    // Flag global (au cas où le gooey s'abonne après coup) + événement
    window.__heroPlay = { fired: true, reduce: !!reduce };
    document.dispatchEvent(new CustomEvent('hero:play', { detail: { reduce: !!reduce } }));
  }

  // Mouvement réduit : on révèle immédiatement, sans échelonnement.
  if (reduce) { start(); return; }

  // 1) Déclencheur principal : le First Contentful Paint.
  //    buffered:true récupère l'entrée même si le FCP a déjà eu lieu.
  try {
    var po = new PerformanceObserver(function (list) {
      for (var i = 0; i < list.getEntries().length; i++) {
        if (list.getEntries()[i].name === 'first-contentful-paint') {
          po.disconnect();
          // +1 frame pour garantir que la frame « cachée » est bien à l'écran
          requestAnimationFrame(start);
          return;
        }
      }
    });
    po.observe({ type: 'paint', buffered: true });
  } catch (e) { /* PerformanceObserver/paint non supporté */ }

  // 2) Repli : quand la hero entre réellement dans le viewport (déjà peinte).
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      for (var j = 0; j < entries.length; j++) {
        if (entries[j].isIntersecting) {
          io.disconnect();
          requestAnimationFrame(start);
          return;
        }
      }
    });
    io.observe(hero);
  }

  // 3) Filet de sécurité : ne jamais laisser la hero invisible.
  setTimeout(start, 2500);
})();

/* ═══════════════════════════════════════════
   HERO — respect de prefers-reduced-motion
   Coupe l'autoplay de la vidéo de fond et
   n'affiche que le poster si l'utilisateur a
   activé la réduction de mouvement.
═══════════════════════════════════════════ */
(function () {
  var heroVideo = document.querySelector('.hero-video');
  if (!heroVideo) return;

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    heroVideo.removeAttribute('autoplay');
    heroVideo.pause();
    // Repositionne sur le poster
    try { heroVideo.currentTime = 0; heroVideo.load(); } catch (e) {}
  }
})();
