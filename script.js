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
