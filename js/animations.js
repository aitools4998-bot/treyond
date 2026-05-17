'use strict';
// Parallax, page transitions, micro-animations

function initParallax() {
  const els = document.querySelectorAll('[data-parallax]');
  if (!els.length) return;
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    els.forEach(el => {
      const speed = parseFloat(el.dataset.parallax || 0.3);
      const rect = el.getBoundingClientRect();
      const offset = (rect.top + sy) - sy;
      el.style.transform = `translateY(${(sy - offset) * speed}px)`;
    });
  }, { passive: true });
}

function initPageTransitions() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  requestAnimationFrame(() => { document.body.style.opacity = '1'; });

  document.querySelectorAll('a[href]:not([href^="#"]):not([href^="mailto"]):not([href^="tel"]):not([target])').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('javascript') || link.origin !== location.origin) return;
      e.preventDefault();
      document.body.style.opacity = '0';
      setTimeout(() => { window.location.href = href; }, 350);
    });
  });
}

function initHoverTilt() {
  document.querySelectorAll('[data-tilt]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.02)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

function initCountUp() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const duration = 1800;
      const start = performance.now();
      const update = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = (el.dataset.prefix || '') + Math.round(ease * target).toLocaleString() + (el.dataset.suffix || '');
        if (progress < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  els.forEach(el => obs.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  initParallax();
  initPageTransitions();
  initHoverTilt();
  initCountUp();
});
