// ============================================================
// COURTSIDE FRONT-ROW STREETWEAR — script.js
// ============================================================

// ============================================================
// WAITING ROOM
// ============================================================

(function () {
  const TOTAL_MS = (Math.floor(Math.random() * 15) + 1) * 60 * 1000;
  const START    = Date.now();

  const queue       = document.getElementById('queue');
  const queueInner  = document.getElementById('queueInner');
  const queueFill   = document.getElementById('queueBarFill');
  const queueTime   = document.getElementById('queueTime');
  const queueReveal = document.getElementById('queueReveal');
  const queueCta    = document.getElementById('queueCta');

  let revealShown = false;

  // Already admitted this session — skip queue entirely
  if (sessionStorage.getItem('cfr-admitted')) {
    queue.remove();
    return;
  }

  // — Password bypass —
  const passForm  = document.getElementById('queuePassForm');
  const passInput = document.getElementById('queuePassInput');
  const passError = document.getElementById('queuePassError');

  function admitNow() {
    sessionStorage.setItem('cfr-admitted', '1');
    document.body.classList.remove('queue-active');
    queue.classList.add('queue--exit');
    setTimeout(() => queue.remove(), 950);
  }

  passForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (passInput.value === 'Rabby') {
      admitNow();
    } else {
      passError.classList.add('visible');
      passInput.value = '';
      setTimeout(() => passError.classList.remove('visible'), 2000);
    }
  });

  // Lock scroll while waiting
  document.body.classList.add('queue-active');

  // Kick off the smooth bar animation via CSS transition
  // Two rAF frames ensure the browser has painted the 0% state first
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      queueFill.style.transition = `width ${TOTAL_MS}ms linear`;
      queueFill.style.width = '100%';
    });
  });

  // Show initial estimated wait
  const totalMins = Math.ceil(TOTAL_MS / 60000);
  queueTime.textContent = `Est. wait: ${totalMins} min`;

  // Countdown tick every second
  const interval = setInterval(() => {
    const elapsed   = Date.now() - START;
    const remaining = Math.max(0, TOTAL_MS - elapsed);

    if (remaining > 60000) {
      // Update countdown display
      const mins = Math.ceil(remaining / 60000);
      queueTime.textContent = `Est. wait: ${mins} min`;
    }

    // Enter last minute — fade waiting UI, show reveal
    if (remaining <= 60000 && !revealShown) {
      revealShown = true;
      queueInner.classList.add('fade-out');
      setTimeout(() => queueReveal.classList.add('active'), 550);
    }

    // Time's up — show the SHOP NOW button
    if (remaining <= 0) {
      clearInterval(interval);
      sessionStorage.setItem('cfr-admitted', '1');
      queueCta.classList.add('visible');
      queueCta.addEventListener('click', admitNow, { once: true });
    }
  }, 1000);
})();


// ============================================================
// STORY SLIDESHOW
// ============================================================

const slides = document.querySelectorAll('.story__slide');
if (slides.length) {
  let current = 0;
  setInterval(() => {
    slides[current].classList.remove('story__slide--active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('story__slide--active');
  }, 5000);
}


// ============================================================
// NAV — shrink + blur on scroll
// ============================================================

const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });


// ============================================================
// MARQUEE DISTORTION — distort → clear oscillation
// ============================================================

(function () {
  const turb = document.getElementById('mqTurb');
  const disp = document.getElementById('mqDisp');
  if (!turb || !disp) return;

  let t = 0;
  function tick() {
    t += 0.022;
    // Sharp spike: very brief distortion, long clear period
    const wave = Math.pow(Math.max(0, Math.sin(t)), 8);
    const scale = wave * 28;
    const bf    = wave * 0.022;
    turb.setAttribute('baseFrequency', bf.toFixed(5) + ' ' + (bf * 1.6).toFixed(5));
    disp.setAttribute('scale', scale.toFixed(2));
    requestAnimationFrame(tick);
  }
  tick();
})();


// ============================================================
// EDITORIAL CARDS — touch tap to reveal flatlay
// ============================================================

(function () {
  const isTouch = window.matchMedia('(hover: none)').matches;
  if (!isTouch) return;

  document.querySelectorAll('.editorial-card').forEach(function (card) {
    card.addEventListener('click', function (e) {
      if (!card.classList.contains('is-tapped')) {
        e.preventDefault();
        // Deactivate any other open card
        document.querySelectorAll('.editorial-card.is-tapped').forEach(function (c) {
          c.classList.remove('is-tapped');
        });
        card.classList.add('is-tapped');
      }
      // Already tapped → let the link navigate naturally
    });
  });
})();


// ============================================================
// SCROLL REVEAL
// ============================================================

const revealElements = document.querySelectorAll(
  '.hero__content, .story__media, .story__content, .products__header, .editorial-card, .footer__brand, .footer__col'
);

revealElements.forEach((el, i) => {
  el.classList.add('reveal');
  if (el.classList.contains('editorial-card')) {
    el.classList.add(`reveal-delay-${(i % 3) + 1}`);
  }
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => revealObserver.observe(el));
