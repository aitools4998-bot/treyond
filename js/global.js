/* global.js - Core site functionality */
'use strict';

// ===== CART STATE =====
const Cart = (() => {
  let items = JSON.parse(localStorage.getItem('tw_cart') || '[]');
  const listeners = [];

  const save = () => {
    localStorage.setItem('tw_cart', JSON.stringify(items));
    listeners.forEach(fn => fn(items));
    updateCartBadge();
  };

  const add = (product) => {
    const existing = items.find(i => i.id === product.id && i.variant === product.variant);
    if (existing) {
      existing.qty = Math.min(existing.qty + (product.qty || 1), 10);
    } else {
      items.push({ ...product, qty: product.qty || 1 });
    }
    save();
    openCartDrawer();
    showToast(`${product.name} added to cart`, 'success');
  };

  const remove = (id, variant) => {
    items = items.filter(i => !(i.id === id && i.variant === variant));
    save();
  };

  const updateQty = (id, variant, qty) => {
    const item = items.find(i => i.id === id && i.variant === variant);
    if (item) {
      if (qty <= 0) remove(id, variant);
      else item.qty = Math.min(qty, 10);
      save();
    }
  };

  const getTotal = () => items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const getCount = () => items.reduce((sum, i) => sum + i.qty, 0);
  const getItems = () => [...items];
  const clear = () => { items = []; save(); };
  const subscribe = (fn) => listeners.push(fn);

  return { add, remove, updateQty, getTotal, getCount, getItems, clear, subscribe };
})();

// ===== WISHLIST =====
const Wishlist = (() => {
  let items = JSON.parse(localStorage.getItem('tw_wishlist') || '[]');

  const toggle = (id) => {
    const idx = items.indexOf(id);
    if (idx >= 0) items.splice(idx, 1);
    else items.push(id);
    localStorage.setItem('tw_wishlist', JSON.stringify(items));
    return idx < 0;
  };
  const has = (id) => items.includes(id);
  const getAll = () => [...items];

  return { toggle, has, getAll };
})();

// ===== RECENTLY VIEWED =====
const RecentlyViewed = (() => {
  const KEY = 'tw_recently_viewed';
  const MAX = 8;
  let items = JSON.parse(localStorage.getItem(KEY) || '[]');

  const add = (product) => {
    items = items.filter(i => i.id !== product.id);
    items.unshift(product);
    items = items.slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(items));
  };
  const get = () => [...items];

  return { add, get };
})();

// ===== CART DRAWER =====
function openCartDrawer() {
  document.getElementById('cart-drawer')?.classList.add('active');
  document.getElementById('overlay')?.classList.add('active');
  document.body.style.overflow = 'hidden';
  renderCartDrawer();
}

function closeCartDrawer() {
  document.getElementById('cart-drawer')?.classList.remove('active');
  document.getElementById('overlay')?.classList.remove('active');
  document.body.style.overflow = '';
}

function renderCartDrawer() {
  const body = document.getElementById('cart-drawer-body');
  const items = Cart.getItems();
  if (!body) return;

  if (items.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
        <p>Your cart is empty</p>
        <a href="/pages/shop.html" class="btn btn-primary btn-sm" onclick="closeCartDrawer()">Continue Shopping</a>
      </div>`;
    return;
  }

  body.innerHTML = items.map(item => `
    <div class="cart-item">
      <img class="cart-item-img" src="${item.image}" alt="${item.name}" loading="lazy">
      <div class="cart-item-body">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-variant">${item.variant || ''}</div>
        <div class="cart-item-price">${formatPrice(item.price * item.qty)}</div>
        <div class="cart-item-actions">
          <div class="qty-control">
            <button class="qty-btn" onclick="Cart.updateQty('${item.id}', '${item.variant}', ${item.qty - 1}); renderCartDrawer();">−</button>
            <input class="qty-input" type="number" value="${item.qty}" min="1" max="10" onchange="Cart.updateQty('${item.id}', '${item.variant}', +this.value); renderCartDrawer();">
            <button class="qty-btn" onclick="Cart.updateQty('${item.id}', '${item.variant}', ${item.qty + 1}); renderCartDrawer();">+</button>
          </div>
          <span class="cart-remove" onclick="Cart.remove('${item.id}', '${item.variant}'); renderCartDrawer();">Remove</span>
        </div>
      </div>
    </div>`).join('');

  document.getElementById('cart-subtotal').textContent = formatPrice(Cart.getTotal());
}

function updateCartBadge() {
  const count = Cart.getCount();
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
  document.getElementById('cart-count-text') && (document.getElementById('cart-count-text').textContent = `(${count})`);
}

// ===== SEARCH =====
function openSearch() {
  const bar = document.getElementById('search-bar');
  bar?.classList.add('active');
  document.getElementById('overlay')?.classList.add('active');
  setTimeout(() => document.getElementById('search-input')?.focus(), 100);
  document.body.style.overflow = 'hidden';
}

function closeSearch() {
  document.getElementById('search-bar')?.classList.remove('active');
  const cartOpen = document.getElementById('cart-drawer')?.classList.contains('active');
  if (!cartOpen) {
    document.getElementById('overlay')?.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ===== MOBILE NAV =====
function openMobileNav() {
  document.getElementById('mobile-nav')?.classList.add('active');
  document.getElementById('overlay')?.classList.add('active');
  document.getElementById('mobile-menu-btn')?.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
  document.getElementById('mobile-nav')?.classList.remove('active');
  document.getElementById('mobile-menu-btn')?.classList.remove('active');
  document.getElementById('overlay')?.classList.remove('active');
  document.body.style.overflow = '';
}

// ===== TOAST =====
function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toast-container') || createToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: '✓', error: '✗', info: 'i' };
  toast.innerHTML = `<span>${icons[type] || 'i'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateY(10px)'; toast.style.transition = '0.3s'; setTimeout(() => toast.remove(), 300); }, duration);
}

function createToastContainer() {
  const el = document.createElement('div');
  el.id = 'toast-container';
  el.className = 'toast-container';
  document.body.appendChild(el);
  return el;
}

// ===== SCROLL REVEAL =====
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ===== STICKY HEADER =====
function initStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// ===== ANNOUNCEMENT BAR =====
function initAnnouncementBar() {
  const bar = document.getElementById('announcement-bar');
  const closeBtn = document.getElementById('announcement-close');
  if (!bar || !closeBtn) return;
  if (sessionStorage.getItem('announcement_dismissed')) {
    bar.style.display = 'none';
    return;
  }
  closeBtn.addEventListener('click', () => {
    bar.style.height = bar.offsetHeight + 'px';
    requestAnimationFrame(() => { bar.style.height = '0'; bar.style.overflow = 'hidden'; bar.style.transition = 'height 0.3s ease'; });
    setTimeout(() => bar.style.display = 'none', 300);
    sessionStorage.setItem('announcement_dismissed', '1');
  });
}

// ===== MOBILE NAV SUBMENU =====
function initMobileNav() {
  document.querySelectorAll('.mobile-nav-link[data-submenu]').forEach(link => {
    link.addEventListener('click', () => {
      const submenu = document.getElementById(link.dataset.submenu);
      const isOpen = submenu?.classList.contains('active');
      document.querySelectorAll('.mobile-nav-submenu').forEach(s => s.classList.remove('active'));
      if (!isOpen) submenu?.classList.add('active');
    });
  });
}

// ===== ACCORDION =====
function initAccordions() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const body = item.querySelector('.accordion-body');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.accordion-body')?.classList.remove('open');
      });
      if (!isOpen) {
        item.classList.add('open');
        body?.classList.add('open');
      }
    });
  });
}

// ===== FORMAT PRICE =====
function formatPrice(amount, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, minimumFractionDigits: 0 }).format(amount);
}

// ===== LAZY LOAD =====
function initLazyLoad() {
  if ('loading' in HTMLImageElement.prototype) return;
  const imgs = document.querySelectorAll('img[loading="lazy"]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.src = e.target.dataset.src; io.unobserve(e.target); } });
  });
  imgs.forEach(img => io.observe(img));
}

// ===== FILTER GROUPS =====
function initFilters() {
  document.querySelectorAll('.filter-group-header').forEach(header => {
    const body = header.nextElementSibling;
    const toggle = header.querySelector('.filter-group-toggle');
    header.classList.add('open');
    body?.classList.add('open');
    header.addEventListener('click', () => {
      const open = body?.classList.contains('open');
      body?.classList.toggle('open', !open);
      header.classList.toggle('open', !open);
      toggle?.classList.toggle('open', !open);
    });
  });
  document.querySelectorAll('.filter-option').forEach(opt => {
    opt.addEventListener('click', () => opt.classList.toggle('checked'));
  });
}

// ===== GLOBAL EVENTS =====
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initStickyHeader();
  initAnnouncementBar();
  initMobileNav();
  initAccordions();
  initLazyLoad();
  initFilters();
  updateCartBadge();

  // Overlay click closes drawers
  document.getElementById('overlay')?.addEventListener('click', () => {
    closeCartDrawer();
    closeSearch();
    closeMobileNav();
    document.getElementById('mobile-filter-drawer')?.classList.remove('active');
  });

  // Cart icon
  document.getElementById('cart-icon')?.addEventListener('click', openCartDrawer);
  document.getElementById('cart-drawer-close')?.addEventListener('click', closeCartDrawer);

  // Search
  document.getElementById('search-icon')?.addEventListener('click', openSearch);
  document.getElementById('search-close')?.addEventListener('click', closeSearch);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeSearch(); closeCartDrawer(); closeMobileNav(); } });

  // Mobile menu
  document.getElementById('mobile-menu-btn')?.addEventListener('click', openMobileNav);
  document.getElementById('mobile-nav-close')?.addEventListener('click', closeMobileNav);

  // Mobile filter
  document.getElementById('mobile-filter-btn')?.addEventListener('click', () => {
    document.getElementById('mobile-filter-drawer')?.classList.add('active');
    document.getElementById('overlay')?.classList.add('active');
  });

  // Render cart
  renderCartDrawer();
  Cart.subscribe(() => renderCartDrawer());
});
