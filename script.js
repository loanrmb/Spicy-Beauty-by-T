/* ═══════════════════════════════════════════
   SPICY BEAUTY BY T. — script.js
═══════════════════════════════════════════ */

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


/* ── Leaflet map : zone 1km, sans adresse exacte ── */
document.addEventListener('DOMContentLoaded', () => {
  /* Centre : au-dessus de l'Étang du Vignoble, NW de Valenciennes */
  const lat = 50.3354, lng = 3.5307; /* 190 Avenue de Denain, Valenciennes */
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
    color:       '#C8709A',
    fillColor:   '#C8709A',
    fillOpacity: 0.1,
    weight:      2,
    dashArray:   '6 4'
  }).addTo(map);

  /* Marqueur minimal centré */
  const icon = L.divIcon({
    html: `<div style="
      width:12px; height:12px; border-radius:50%;
      background:#C8709A; border:3px solid #fff;
      box-shadow:0 2px 8px rgba(200,112,154,.6);
    "></div>`,
    className: '',
    iconSize:   [12, 12],
    iconAnchor: [6, 6]
  });
  L.marker([lat, lng], { icon }).addTo(map);
});
