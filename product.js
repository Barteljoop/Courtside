// ============================================================
// COURTSIDE FRONT-ROW — product.js
// ============================================================

// Nav scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// Size guide accordion
const sizeGuideToggle = document.querySelector('.pdp__sizeguide-toggle');
if (sizeGuideToggle) {
  sizeGuideToggle.addEventListener('click', function () {
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', String(!expanded));
    this.nextElementSibling.classList.toggle('is-open', !expanded);
  });
}

// PDP photo gallery — dot navigation
const pdpGallery = document.getElementById('pdpGallery');
if (pdpGallery) {
  const slides = Array.from(pdpGallery.querySelectorAll('.pdp__slide'));
  const prevBtn = document.getElementById('pdpPrev');
  const nextBtn = document.getElementById('pdpNext');
  let current = slides.findIndex((s) => s.classList.contains('pdp__slide--active'));
  if (current < 0) current = 0;

  const goTo = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('pdp__slide--active', i === current));
  };

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));
}

