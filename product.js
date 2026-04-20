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

