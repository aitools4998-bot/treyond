/* homepage.js */
'use strict';

// ===== HERO SLIDER =====
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;

  let current = 0;
  let timer;

  const goTo = (idx) => {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  };

  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  const startAuto = () => { timer = setInterval(next, 5500); };
  const stopAuto = () => clearInterval(timer);

  slides[0]?.classList.add('active');
  dots[0]?.classList.add('active');
  startAuto();

  document.getElementById('hero-next')?.addEventListener('click', () => { stopAuto(); next(); startAuto(); });
  document.getElementById('hero-prev')?.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); }));

  // Touch swipe
  let touchStartX = 0;
  const slider = document.querySelector('.hero-slider');
  slider?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  slider?.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { stopAuto(); diff > 0 ? next() : prev(); startAuto(); }
  });
}

// ===== TABS (Featured/New Arrivals/Best Sellers) =====
function initProductTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.tabs-section');
      group?.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.dataset.tab;
      group?.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('hidden', p.dataset.panel !== target));
    });
  });
  // Activate first tab
  document.querySelectorAll('.tabs-section').forEach(sec => {
    sec.querySelector('.tab-btn')?.click();
  });
}

// ===== TESTIMONIALS SLIDER =====
function initTestimonialsSlider() {
  const track = document.getElementById('testimonials-track');
  if (!track) return;
  const cards = track.querySelectorAll('.testimonial-card');
  let current = 0;
  const visible = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;

  const move = () => {
    const card = cards[0];
    if (!card) return;
    const cardWidth = card.offsetWidth + 24;
    track.style.transform = `translateX(-${current * cardWidth}px)`;
  };

  document.getElementById('test-prev')?.addEventListener('click', () => {
    if (current > 0) { current--; move(); }
  });
  document.getElementById('test-next')?.addEventListener('click', () => {
    if (current < cards.length - visible) { current++; move(); }
  });
}

// ===== QUICK VIEW =====
function openQuickView(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('quickview-modal');
  if (!modal) return;

  modal.querySelector('.quickview-gallery img').src = product.images[0];
  modal.querySelector('.quickview-info').innerHTML = `
    <button class="modal-close" onclick="closeQuickView()">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
    <div class="product-badges">${product.badge ? `<span class="badge">${product.badge}</span>` : ''}</div>
    <h2 class="product-name" style="font-size:1.4rem">${product.name}</h2>
    <div class="product-price-main" style="margin-bottom:20px">${formatPrice(product.price)}</div>
    <div class="variant-group">
      <div class="variant-label">Size</div>
      <div class="size-options">
        ${product.sizes?.map(s => `<button class="size-btn" onclick="this.closest('.size-options').querySelectorAll('.size-btn').forEach(b=>b.classList.remove('active')); this.classList.add('active');">${s}</button>`).join('') || ''}
      </div>
    </div>
    <div style="display:flex;gap:12px;margin-top:20px">
      <button class="add-to-cart-btn" style="flex:1" onclick="Cart.add({id:'${product.id}',name:'${product.name}',price:${product.price},image:'${product.images[0]}',variant:'Default'})">Add to Cart</button>
      <a href="${product.url}" class="btn btn-outline" style="white-space:nowrap">View Details</a>
    </div>`;

  modal.classList.add('active');
  document.getElementById('overlay')?.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeQuickView() {
  document.getElementById('quickview-modal')?.classList.remove('active');
  document.getElementById('overlay')?.classList.remove('active');
  document.body.style.overflow = '';
}

// ===== NEWSLETTER =====
function initNewsletter() {
  document.querySelectorAll('.newsletter-form, .newsletter-form-large').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (!input?.value) return;
      showToast('Thank you for subscribing!', 'success');
      input.value = '';
    });
  });
}

// ===== COUNTDOWN TIMER =====
function initCountdown() {
  const el = document.getElementById('countdown-timer');
  if (!el) return;
  const target = new Date(el.dataset.end || Date.now() + 86400000);

  const update = () => {
    const diff = target - Date.now();
    if (diff <= 0) { el.textContent = 'Expired'; return; }
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    el.innerHTML = `
      <span class="countdown-block"><span class="count-num">${String(h).padStart(2,'0')}</span><span class="count-label">Hrs</span></span>
      <span class="countdown-sep">:</span>
      <span class="countdown-block"><span class="count-num">${String(m).padStart(2,'0')}</span><span class="count-label">Min</span></span>
      <span class="countdown-sep">:</span>
      <span class="countdown-block"><span class="count-num">${String(s).padStart(2,'0')}</span><span class="count-label">Sec</span></span>`;
  };
  update();
  setInterval(update, 1000);
}

// ===== PRODUCTS DATA =====
const PRODUCTS_DATA = [
  { id: 'sherwani-01', name: 'Royal Sherwani', price: 18999, badge: 'Bestseller', sizes: ['S','M','L','XL','XXL'], images: ['https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?auto=compress&cs=tinysrgb&w=800'], url: '/pages/product.html?id=sherwani-01' },
  { id: 'kurta-set-01', name: 'Premium Kurta Set', price: 5999, badge: 'New', sizes: ['S','M','L','XL'], images: ['https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800'], url: '/pages/product.html?id=kurta-set-01' },
  { id: 'suit-01', name: 'Italian Tuxedo Suit', price: 24999, badge: 'Premium', sizes: ['38','40','42','44'], images: ['https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800'], url: '/pages/product.html?id=suit-01' },
  { id: 'blazer-01', name: 'Indo-Western Blazer', price: 8999, badge: '', sizes: ['S','M','L','XL'], images: ['https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&w=800'], url: '/pages/product.html?id=blazer-01' },
  { id: 'jacket-01', name: 'Wedding Bandhgala Jacket', price: 12999, badge: 'New', sizes: ['S','M','L','XL'], images: ['https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800'], url: '/pages/product.html?id=jacket-01' },
  { id: 'kurta-02', name: 'Classic Cotton Kurta', price: 2999, badge: '', sizes: ['S','M','L','XL','XXL'], images: ['https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?auto=compress&cs=tinysrgb&w=800'], url: '/pages/product.html?id=kurta-02' },
  { id: 'sherwani-02', name: 'Embroidered Wedding Sherwani', price: 32999, badge: 'Limited', sizes: ['S','M','L','XL'], images: ['https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=800'], url: '/pages/product.html?id=sherwani-02' },
  { id: 'suit-02', name: 'Double Breasted Suit', price: 19999, badge: '', sizes: ['38','40','42','44','46'], images: ['https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=800'], url: '/pages/product.html?id=suit-02' },
];

// ===== RENDER PRODUCT GRID =====
function renderProductGrid(containerId, products) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = products.map(p => `
    <div class="product-card reveal">
      <a href="${p.url}">
        <div class="product-card-img-wrap">
          <img class="product-card-img" src="${p.images[0]}" alt="${p.name}" loading="lazy">
          <div class="product-card-badges">
            ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
          </div>
          <div class="product-card-actions">
            <button class="product-action-btn" onclick="event.preventDefault(); Wishlist.toggle('${p.id}'); this.style.color=Wishlist.has('${p.id}')?'#e11d48':''" title="Wishlist">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            </button>
            <button class="product-action-btn" onclick="event.preventDefault(); openQuickView('${p.id}')" title="Quick View">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            </button>
          </div>
          <button class="product-card-quick" onclick="event.preventDefault(); Cart.add({id:'${p.id}',name:'${p.name}',price:${p.price},image:'${p.images[0]}',variant:'Default'})">Quick Add</button>
        </div>
      </a>
      <a href="${p.url}">
        <div class="product-card-info">
          <div class="product-card-name">${p.name}</div>
          <div class="product-card-price">
            <span class="product-price">${formatPrice(p.price)}</span>
          </div>
        </div>
      </a>
    </div>`).join('');
  initScrollReveal();
}

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  initProductTabs();
  initTestimonialsSlider();
  initNewsletter();
  initCountdown();
  renderProductGrid('featured-products', PRODUCTS_DATA.slice(0,4));
  renderProductGrid('new-arrivals-grid', PRODUCTS_DATA.filter(p=>p.badge==='New'));
  renderProductGrid('bestsellers-grid', PRODUCTS_DATA.filter(p=>p.badge==='Bestseller'||p.badge==='Limited'));
  renderProductGrid('trending-grid', PRODUCTS_DATA.slice(4,8));
});
