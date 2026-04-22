// ── Scroll Reveal ──────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .img-reveal')
  .forEach(el => revealObserver.observe(el));

// ── Nav scroll ────────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 80);
}, { passive: true });

// ── Hero zoom-in on load ──────────────────────────────────────
setTimeout(() => document.getElementById('hero').classList.add('loaded'), 100);

// ── Parallax ──────────────────────────────────────────────────
const parallaxEls = [
  { el: document.getElementById('pb1'), speed: 0.28 },
  { el: document.getElementById('pb2'), speed: 0.28 },
];

function onScroll() {
  parallaxEls.forEach(({ el, speed }) => {
    if (!el) return;
    const rect = el.parentElement.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    el.style.transform = `translateY(${rect.top * speed}px)`;
  });
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ── Re-observe dynamically added cards ───────────────────────
// Called by menu.js after cards are rendered
window.observeNewCards = function () {
  document.querySelectorAll('.reveal-scale:not(.visible)')
    .forEach(el => revealObserver.observe(el));
};
