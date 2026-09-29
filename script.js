document.documentElement.classList.add('js');
document.getElementById('year').textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const nav = document.querySelector('.nav');
const hero = document.querySelector('.hero');
const heroImage = document.querySelector('.hero-photo img');
const portraitImage = document.querySelector('.office-card img');
const principles = document.querySelector('.principles');

const revealGroups = [
  ['.expertise .eyebrow, .expertise-text, .expertise-note', ''],
  ['.section-intro > *, .topics article', ''],
  ['.office-card', 'reveal-scale'],
  ['.approach-copy > *', ''],
  ['.articles-heading > *, .article-grid a', ''],
  ['.faq-heading > *, .faq details', ''],
  ['.contact-heading > *, .contact-options article', '']
];

const revealItems = [];
revealGroups.forEach(([selector, modifier]) => {
  document.querySelectorAll(selector).forEach((element, index) => {
    element.classList.add('reveal');
    if (modifier) element.classList.add(modifier);
    element.style.setProperty('--delay', `${Math.min(index, 4) * 80}ms`);
    revealItems.push(element);
  });
});

if ('IntersectionObserver' in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.13, rootMargin: '0px 0px -6% 0px' });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const updateMotion = () => {
  const scrollY = window.scrollY;
  nav.classList.toggle('is-scrolled', scrollY > 36);

  if (reduceMotion) return;
  if (heroImage && scrollY < hero.offsetHeight * 1.2) {
    heroImage.style.setProperty('--hero-shift', `${scrollY * 0.08}px`);
  }

  if (portraitImage) {
    const frame = portraitImage.parentElement.getBoundingClientRect();
    const centerOffset = window.innerHeight / 2 - (frame.top + frame.height / 2);
    portraitImage.style.setProperty('--portrait-shift', `${clamp(centerOffset * 0.055, -30, 30)}px`);
  }

  if (principles) {
    const rect = principles.getBoundingClientRect();
    const progress = clamp((window.innerHeight * 0.72 - rect.top) / (rect.height + window.innerHeight * 0.2), 0, 1);
    principles.style.setProperty('--principles-progress', `${progress * 100}%`);
  }
};

let ticking = false;
const requestMotionUpdate = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    updateMotion();
    ticking = false;
  });
};

window.addEventListener('scroll', requestMotionUpdate, { passive: true });
window.addEventListener('resize', requestMotionUpdate);
updateMotion();

document.querySelectorAll('.article-grid a').forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--card-x', `${event.clientX - rect.left}px`);
    card.style.setProperty('--card-y', `${event.clientY - rect.top}px`);
  });
});
