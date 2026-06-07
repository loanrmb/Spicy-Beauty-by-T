/* ═══════════════════════════════════════════
   SPICY BEAUTY BY T. — script.js
═══════════════════════════════════════════ */

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
   GALERIE CAROUSEL — infinite loop, desktop H / mobile V
═══════════════════════════════════════════ */
(function () {
  const wrap = document.querySelector('.gal-carousel-wrap');
  if (!wrap) return;

  const track   = wrap.querySelector('#galTrack');
  const dotsBox = wrap.querySelector('#galDots');
  const btnPrev = wrap.querySelector('.gal-prev');
  const btnNext = wrap.querySelector('.gal-next');
  if (!track || !dotsBox) return;

  /* ── Photos (plus récentes en premier) ── */
  const GAL_PHOTOS = [
    { src: 'images/gallery-8.jpeg',  alt: 'Nail art Spicy Beauty by T.' },
    { src: 'images/gallery-9.jpeg',  alt: 'Semi-permanent Spicy Beauty' },
    { src: 'images/gallery-10.jpeg', alt: 'Capsules gel Spicy Beauty' },
    { src: 'images/gallery-11.jpeg', alt: 'Manucure Spicy Beauty by T.' },
    { src: 'images/gallery-7.png',   alt: 'Réalisation ongles gel' },
    { src: 'images/gallery-5.jpg',   alt: 'Nail art semi-permanent' },
    { src: 'images/gallery-4.jpg',   alt: 'Gainage ongle naturel' },
    { src: 'images/gallery-3.jpg',   alt: 'Pédicure Spicy Beauty' },
    { src: 'images/gallery-2.jpg',   alt: 'Ongles capsules extension' },
    { src: 'images/gallery-1.jpg',   alt: 'Réalisation Spicy Beauty by T.' },
  ];

  const n = GAL_PHOTOS.length;
  const isMobile = () => window.innerWidth <= 860;
  const TRANSITION = 'transform .6s cubic-bezier(.16,1,.3,1)';
  const SLIDE_RATIO = 0.72;    // largeur du slide vs wrapper (desktop)
  const GAP = 16;              // gap entre slides (px, desktop)

  /* ── Build slide DOM ── */
  function buildSlide(photo, isClone = false) {
    const slide = document.createElement('div');
    slide.className = 'gal-slide';
    if (isClone) slide.dataset.clone = 'true';
    const img = document.createElement('img');
    img.src = photo.src;
    img.alt = photo.alt;
    img.loading = 'lazy';
    img.decoding = 'async';
    slide.appendChild(img);
    return slide;
  }

  /* ── Injection : clone(last) + reals + clone(first) ── */
  track.appendChild(buildSlide(GAL_PHOTOS[n - 1], true));      // index 0  = clone du dernier
  GAL_PHOTOS.forEach(p => track.appendChild(buildSlide(p)));   // index 1..n = vrais slides
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
  function getOffsetPx(index) {
    /* Desktop : centre le slide actif dans le wrapper, en pixels */
    const wrapW = wrap.offsetWidth;
    const slideW = wrapW * SLIDE_RATIO;
    const center = (wrapW - slideW) / 2;
    return -(index * (slideW + GAP)) + center;
  }

  function updateTransform() {
    if (isMobile()) {
      /* Mobile : vertical, 100% par slide, pas de peek */
      track.style.transform = `translateY(-${current * 100}%)`;
    } else {
      /* Desktop : horizontal, calcul pixel pour le peek effect */
      track.style.transform = `translateX(${getOffsetPx(current)}px)`;
    }
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

  /* ── Swipe (touch + mouse drag) ── */
  let startX = 0, startY = 0, dragging = false;
  const THRESHOLD = 40;

  function onSwipeEnd(x, y) {
    if (!dragging) return;
    dragging = false;
    const dx = x - startX;
    const dy = y - startY;
    if (isMobile()) {
      if (Math.abs(dy) > THRESHOLD) goTo(current + (dy < 0 ? 1 : -1));
    } else {
      if (Math.abs(dx) > THRESHOLD) goTo(current + (dx < 0 ? 1 : -1));
    }
  }

  /* Touch */
  track.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    dragging = true;
  }, { passive: true });

  track.addEventListener('touchmove', e => {
    if (!dragging || !isMobile()) return;
    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;
    /* En mobile (carousel vertical), bloquer le scroll natif si le swipe est vertical */
    if (Math.abs(dy) > Math.abs(dx)) e.preventDefault();
  }, { passive: false });

  track.addEventListener('touchend', e => {
    onSwipeEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
  }, { passive: true });

  /* Mouse drag (desktop) */
  track.addEventListener('mousedown', e => {
    e.preventDefault();
    startX = e.clientX;
    startY = e.clientY;
    dragging = true;
  });
  document.addEventListener('mouseup', e => {
    if (dragging) onSwipeEnd(e.clientX, e.clientY);
  });
  track.addEventListener('mouseleave', () => { dragging = false; });

  /* ── Resize : recompute axis (debounce 150ms) ── */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      track.style.transition = 'none';
      updateTransform();
    }, 150);
  });

  /* ── Init : positionner sur le premier vrai slide sans transition ── */
  goTo(1, false);
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
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
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
