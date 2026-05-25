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
  {
    id: 'shirt-05',
    name: "Men's Premium multi Color Printed Cotton Casual Party Wear Shirt",
    price: 1400,
    badge: 'Check Shirts',
    sizes: ['38','40','42','44'],
    images: [
      'https://treyondworld.com/wp-content/uploads/2024/02/New-Fabric__ocm_b3_acrylicshirt_2__2024-2-5-20-23-38__2730X4096.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/02/New-Fabric__a2_all_set211_shirtfolded_front2__2024-2-5-20-22-4__2730X4096.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/02/New-Fabric__all_set199_m_trouser_front2__2024-2-5-20-22-26__2730X4096.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/02/New-Fabric__all_set211_nomo_shirtfolded_front7__2024-2-5-20-22-41__2730X4096.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/02/New-Fabric__all_set211_shirtfolded_front3__2024-2-5-20-22-55__2730X4096.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/02/New-Fabric__all_set255_hanger_shirt__2024-2-5-20-23-13__2730X4096.jpg'
    ],
    url: '/pages/mens-premium-multi-color-printed-cotton-casual-party-wear-shirt.html',
    category: 'check-shirts'
  },
  {
    id: 'shirt-06',
    name: "Men's Premium multi Color Printed Cotton Party Wear Shirt",
    price: 1400,
    badge: 'Check Shirts',
    sizes: ['38','40','42','44'],
    images: [
      'https://treyondworld.com/wp-content/uploads/2024/02/New-Fabric__ocm_b3_acrylicshirt_2__2024-2-4-22-52-25__2730X4096.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/02/New-Fabric__all_set255_hanger_shirt__2024-2-4-22-50-59__2730X4096.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/02/New-Fabric__all_set250_shirtandswatch__2024-2-4-22-50-34__2730X4096.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/02/New-Fabric__all_set211_shirtfolded_front3__2024-2-4-22-50-18__2730X4096.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/02/New-Fabric__all_set211_nomo_shirtfolded_front7__2024-2-4-22-49-57__2730X4096.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/02/New-Fabric__a2_all_set211_shirtfolded_front2__2024-2-4-22-48-58__2730X4096.jpg'
    ],
    url: '/pages/mens-premium-multi-color-printed-cotton-party-wear-shirt.html',
    category: 'check-shirts'
  },
  {
    id: 'shirt-07',
    name: "Men's Premium Sky Color Printed Cotton Regular Fit Shirt",
    price: 1400,
    badge: 'Check Shirts',
    sizes: ['38','40','42','44'],
    images: [
      'https://treyondworld.com/wp-content/uploads/2024/02/New-Fabric__ocm_b3_acrylicshirt_2__2024-2-4-21-7-44__2730X4096.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/02/New-Fabric__all_set161_men_formal_side2__2024-2-4-21-12-27__2730X4096.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/02/New-Fabric__all_set199_m_trouser_front2__2024-2-4-21-12-2__2730X4096.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/02/New-Fabric__all_set211_nomo_shirtfolded_front7__2024-2-4-21-11-37__2730X4096.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/02/New-Fabric__all_set211_shirtfolded_front3__2024-2-4-21-11-26__2730X4096.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/02/New-Fabric__all_set255_hanger_shirt__2024-2-4-21-8-40__2730X4096.jpg'
    ],
    url: '/pages/mens-premium-sky-color-printed-cotton-regular-fit-shirt.html',
    category: 'check-shirts'
  },
  {
    id: 'shirt-08',
    name: "Men's Premium Firoz Printed Cotton Party Wear Shirt",
    price: 1400,
    badge: 'Check Shirts',
    sizes: ['38','40','42','44'],
    images: [
      'https://treyondworld.com/wp-content/uploads/2024/02/New-Fabric__ocm_b3_acrylicshirt_2__2024-2-4-21-30-23__2730X4096.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/02/New-Fabric__ocm_b3_acrylicshirt_4__2024-2-4-21-30-40__2730X4096.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/02/New-Fabric__all_set255_hanger_shirt__2024-2-4-21-31-1__2730X4096.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/02/New-Fabric__all_set211_shirtfolded_front3__2024-2-4-21-32-19__2730X4096.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/02/New-Fabric__all_set211_nomo_shirtfolded_front7__2024-2-4-21-32-33__2730X4096.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/02/New-Fabric__all_set199_m_trouser_front2__2024-2-4-21-32-44__2730X4096.jpg'
    ],
    url: '/pages/men-premium-firoz-printed-cotton-party-wear-shirt.html',
    category: 'check-shirts'
  },
  {
    id: 'shirt-01',
    name: 'Light Khaki Oxford Soft Premium Cotton Formal Shirt',
    price: 1300,
    badge: 'Shirts',
    sizes: ['38','40','42','44'],
    images: [
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08714.jpg',
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08720.jpg',
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08718.jpg',
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08717.jpg',
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08708.jpg'
    ],
    url: '/pages/men-light-khaki-oxford-soft-premium-cotton-formal-shirt-for-mens.html',
    category: 'shirts'
  },
  {
    id: 'shirt-02',
    name: 'Gray Color Oxford Soft Premium Cotton Formal Shirt',
    price: 1300,
    badge: 'Shirts',
    sizes: ['38','40','42','44'],
    images: [
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08729.jpg',
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08735.jpg',
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08733.jpg',
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08732.jpg',
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08724.jpg'
    ],
    url: '/pages/gray-color-oxford-soft-premium-cotton-formal-shirt-for-mens.html',
    category: 'shirts'
  },
  {
    id: 'shirt-03',
    name: 'Dark Grey Fila Fill Soft Premium Cotton Formal Shirt',
    price: 1100,
    badge: 'Shirts',
    sizes: ['38','40','42','44'],
    images: [
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08743.jpg',
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08746.jpg',
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08749.jpg',
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08747.jpg',
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08738.jpg'
    ],
    url: '/pages/men-dark-grey-fila-fill-soft-premium-cotton-formal-shirt.html',
    category: 'shirts'
  },
  {
    id: 'shirt-04',
    name: 'Orange Color Super Soft Premium Cotton Dobby Formal Shirt',
    price: 1100,
    badge: 'Shirts',
    sizes: ['38','40','42','44'],
    images: [
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08768.jpg',
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08775.jpg',
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08773.jpg',
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08772.jpg',
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08771.jpg'
    ],
    url: '/pages/men-orange-color-super-soft-premium-cotton-dobby-formal-shirt.html',
    category: 'shirts'
  },
  { id: 'sherwani-01', name: 'Royal Sherwani', price: 18999, badge: 'Bestseller', sizes: ['S','M','L','XL','XXL'], images: ['https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?auto=compress&cs=tinysrgb&w=800'], url: '/pages/product.html?id=sherwani-01', category: 'sherwanis' },
  { id: 'kurta-set-01', name: 'Premium Kurta Set', price: 5999, badge: 'New', sizes: ['S','M','L','XL'], images: ['https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800'], url: '/pages/product.html?id=kurta-set-01', category: 'kurta-sets' },
  { id: 'suit-01', name: 'Italian Tuxedo Suit', price: 24999, badge: 'Premium', sizes: ['38','40','42','44'], images: ['https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800'], url: '/pages/product.html?id=suit-01', category: 'suits' },
  { id: 'blazer-01', name: 'Indo-Western Blazer', price: 8999, badge: '', sizes: ['S','M','L','XL'], images: ['https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&w=800'], url: '/pages/product.html?id=blazer-01', category: 'blazers' },
  { id: 'jacket-01', name: 'Wedding Bandhgala Jacket', price: 12999, badge: 'New', sizes: ['S','M','L','XL'], images: ['https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800'], url: '/pages/product.html?id=jacket-01', category: 'blazers' },
  { id: 'kurta-02', name: 'Classic Cotton Kurta', price: 2999, badge: '', sizes: ['S','M','L','XL','XXL'], images: ['https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?auto=compress&cs=tinysrgb&w=800'], url: '/pages/product.html?id=kurta-02', category: 'kurta-sets' },
  { id: 'sherwani-02', name: 'Embroidered Wedding Sherwani', price: 32999, badge: 'Limited', sizes: ['S','M','L','XL'], images: ['https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=800'], url: '/pages/product.html?id=sherwani-02', category: 'sherwanis' },
  { id: 'suit-02', name: 'Double Breasted Suit', price: 19999, badge: '', sizes: ['38','40','42','44','46'], images: ['https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=800'], url: '/pages/product.html?id=suit-02', category: 'suits' },
  {
    id: 'shirt-09',
    name: "Mango Color Fila Fill Soft Premium Cotton Formal Shirt",
    price: 1100,
    badge: 'Plain Shirts',
    sizes: ['38','40','42','44'],
    images: [
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08491.jpg',
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08483.jpg',
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08495.jpg',
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08493.jpg',
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08489.jpg'
    ],
    url: '/pages/men-mango-color-fila-fill-soft-premium-cotton-formal-shirt.html',
    category: 'plain-shirts'
  },
  {
    id: 'shirt-10',
    name: "Lemon Color Super Soft Premium Dobby Cotton Formal Shirt",
    price: 1100,
    badge: 'Plain Shirts',
    sizes: ['38','40','42','44'],
    images: [
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08471.jpg',
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08481.jpg',
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08479.jpg',
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08477.jpg',
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08475.jpg',
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08473.jpg'
    ],
    url: '/pages/men-lemon-color-super-soft-premium-dobby-cotton-formal-shirt.html',
    category: 'plain-shirts'
  },
  {
    id: 'shirt-11',
    name: "Pink Color Super Soft Premium Cotton Dobby Formal Shirt For Men’s",
    price: 1100,
    badge: 'Plain Shirts',
    sizes: ['38','40','42','44'],
    images: [
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08458.jpg',
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08468.jpg',
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08467.jpg',
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08464.jpg',
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08463.jpg',
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08461.jpg'
    ],
    url: '/pages/men-pink-color-super-soft-premium-cotton-dobby-formal-shirt-for-mens.html',
    category: 'plain-shirts'
  },
  {
    id: 'shirt-12',
    name: "Move Color Fila Fill Soft Premium Cotton Formal Shirt",
    price: 1100,
    badge: 'Plain Shirts',
    sizes: ['38','40','42','44'],
    images: [
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08445.jpg',
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08454.jpg',
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08452.jpg',
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08451.jpg',
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08450.jpg',
      'https://treyondworld.com/wp-content/uploads/2023/12/CKS08447.jpg'
    ],
    url: '/pages/men-move-color-fila-fill-soft-premium-cotton-formal-shirt.html',
    category: 'plain-shirts'
  },
  {
    id: 'uniform-01',
    name: 'CRPF Khaki Uniform By Ajanta Oswal super Premium Trovine',
    price: 2099,
    badge: 'Uniform',
    sizes: ['38','40','42','44','46'],
    images: [
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00578-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00585-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00583-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00582-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00580-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00575-copy-scaled.jpg'
    ],
    url: '/pages/crpf-khaki-uniform-oswal-ajanta.html',
    category: 'uniforms'
  },
  {
    id: 'uniform-02',
    name: 'Police Stretchable Khaki Uniform By Vimal Officer Stretch fit',
    price: 2199,
    badge: 'Uniform',
    sizes: ['38','40','42','44','46'],
    images: [
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00690-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00697-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00693-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00726-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00696-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00694-scaled.jpg'
    ],
    url: '/pages/police-stretchable-khaki-uniform.html',
    category: 'uniforms'
  },
  {
    id: 'uniform-03',
    name: 'Police Khaki Uniform By Vimal Premium Trovine',
    price: 2199,
    badge: 'Uniform',
    sizes: ['38','40','42','44','46'],
    images: [
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00651-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00657-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00653-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00659-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00656-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00655-copy-scaled.jpg'
    ],
    url: '/pages/police-khaki-uniform-premium.html',
    category: 'uniforms'
  },
  {
    id: 'uniform-04',
    name: 'Police Khaki Uniform Vimal Premium Trovine Light Color',
    price: 2199,
    badge: 'Uniform',
    sizes: ['38','40','42','44','46'],
    images: [
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00640-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00646-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00644-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00641-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00645-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00648-copy-scaled.jpg'
    ],
    url: '/pages/police-khaki-uniform-premium-trovine.html',
    category: 'uniforms'
  },
  {
    id: 'uniform-05',
    name: 'BSF Graviera Khaki Uniform',
    price: 1700,
    badge: 'Uniform',
    sizes: ['36','38','40','42','44','46'],
    images: [
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00468-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00472-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00473-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00476-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00477-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00493-scaled.jpg'
    ],
    url: '/pages/bsf-khaki-uniform-graviera.html',
    category: 'uniforms'
  },
  {
    id: 'uniform-06',
    name: 'Police Khaki Uniform BY Vimal Super Trovine',
    price: 1999,
    badge: 'Uniform',
    sizes: ['36','38','40','42','44','46'],
    images: [
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00667-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00669-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00668-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00676-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00675-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00673-copy-scaled.jpg'
    ],
    url: '/pages/police-khaki-uniform-vimal-super-fabric.html',
    category: 'uniforms'
  },
  {
    id: 'uniform-07',
    name: 'BSF Khaki Uniform Vimal Super Premium Trovine',
    price: 2099,
    badge: 'Uniform',
    sizes: ['36','38','40','42','44','46'],
    images: [
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00496-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00506-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00507-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00504-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00503-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00498-scaled.jpg'
    ],
    url: '/pages/bsf-khaki-uniform-vimal-super-premium-trovine.html',
    category: 'uniforms'
  },
  {
    id: 'uniform-08',
    name: 'BSF Khaki Uniform Vimal Saphire matty',
    price: 1999,
    badge: 'Uniform',
    sizes: ['36','38','40','42','44','46'],
    images: [
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00512-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00510-scaled.jpg'
    ],
    url: '/pages/bsf-khaki-uniform-vimal-saphire-matty.html',
    category: 'uniforms'
  },
  {
    id: 'combat-01',
    name: 'SSB New Pattern Combat Uniform (Premium)',
    price: 2099,
    badge: 'Combat',
    sizes: ['38','40','42','44','46'],
    images: [
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00770-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00772-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00778-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00776-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00775-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00774-scaled.jpg'
    ],
    url: '/pages/ssb-new-pattern-combat-uniforms.html',
    category: 'combat-uniforms'
  },
  {
    id: 'combat-02',
    name: 'SSB US Pattern Combat Uniform (Trovine Premium)',
    price: 2199,
    badge: 'Combat',
    sizes: ['38','40','42','44','46'],
    images: [
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00758-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00760-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00768-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00765-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00764-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00763-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00760-1-scaled.jpg'
    ],
    url: '/pages/ssb-us-pattern-combat-uniform-ssb-3.html',
    category: 'combat-uniforms'
  },
  {
    id: 'combat-03',
    name: 'SSB New Pattern Combat Uniform',
    price: 1799,
    badge: 'Combat',
    sizes: ['38','40','42','44','46'],
    images: [
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00743-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00745-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00756-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00754-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00752-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00749-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00748-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00747-scaled.jpg'
    ],
    url: '/pages/ssb-new-pattern-combat.html',
    category: 'combat-uniforms'
  },
  {
    id: 'combat-04',
    name: 'SSB US Pattern Combat Uniform',
    price: 1999,
    badge: 'Combat',
    sizes: ['38','40','42','44','46'],
    images: [
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00728-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00729-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00741-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00740-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00738-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00737-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00734-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00733-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00732-scaled.jpg'
    ],
    url: '/pages/ssb-new-pattern-combat-uniform.html',
    category: 'combat-uniforms'
  },
  {
    id: 'combat-05',
    name: 'CRPF Combat Cotton 80% Poly 20% Us Pattern Wardi',
    price: 1550,
    badge: 'Combat',
    sizes: ['36','38','40','42','44','46'],
    images: [
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00598-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00608-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00602-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00600-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00611-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00610-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00607-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00606-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00603-copy-scaled.jpg'
    ],
    url: '/pages/crpf-combat-cotton-80-poly-20-us-pattern-wardi.html',
    category: 'combat-uniforms'
  },
  {
    id: 'combat-06',
    name: 'CRPF Combat Manipuri Pattern Uniform By Cool Touch Ajanta Osawal',
    price: 2199,
    badge: 'Combat',
    sizes: ['36','38','40','42','44','46'],
    images: [
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00613-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00615-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00627-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00626-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00625-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00623-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00622-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00620-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00619-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00618-copy-scaled.jpg'
    ],
    url: '/pages/crpf-combet-manipuri-pattern-uniform-cool-touch.html',
    category: 'combat-uniforms'
  },
  {
    id: 'combat-07',
    name: 'CRPF Cotton Us Pattern Combat Uniform',
    price: 2199,
    badge: 'Combat',
    sizes: ['36','38','40','42','44','46'],
    images: [
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00598-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00608-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00602-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00600-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00611-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00610-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00607-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00606-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00603-copy-scaled.jpg'
    ],
    url: '/pages/crpf-cotton-us-pattern-combat-uniform.html',
    category: 'combat-uniforms'
  },
  {
    id: 'combat-08',
    name: 'CRPF Combat Uniform Cool Touch Fast color by Ajanta',
    price: 1799,
    badge: 'Combat',
    sizes: ['36','38','40','42','44','46'],
    images: [
      'https://treyondworld.com/wp-content/uploads/2024/05/crpf-poly-coot-touch-main-photo.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00594-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00590-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00592-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00596-copy-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00593-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00593-copy-scaled.jpg'
    ],
    url: '/pages/crpf-combat-uniform-cool-touch-fast-colour-by-ajanta.html',
    category: 'combat-uniforms'
  },
  {
    id: 'tshirt-01',
    name: 'White Premium Cotton T-Shirt',
    price: 450,
    badge: 'T-Shirt',
    sizes: ['36','38','40','42'],
    images: [
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00717-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00720-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00724-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00723-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00722-scaled.jpg'
    ],
    url: '/pages/white-cotton-t-shirt1.html',
    category: 't-shirts'
  },
  {
    id: 'tshirt-02',
    name: 'White Cotton T-Shirt',
    price: 450,
    badge: 'T-Shirt',
    sizes: ['36','38','40','42'],
    images: [
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00709-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00711-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00715-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00714-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00713-scaled.jpg'
    ],
    url: '/pages/white-cotton-t-shirt.html',
    category: 't-shirts'
  },
  {
    id: 'tshirt-03',
    name: 'White Cotton T-Shirt (Matty)',
    price: 399,
    badge: 'T-Shirt',
    sizes: ['36','38','40','42'],
    images: [
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00709-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00711-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00715-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00714-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00713-scaled.jpg'
    ],
    url: '/pages/white-t-shirt-cotton-matty.html',
    category: 't-shirts'
  },
  {
    id: 'tshirt-04',
    name: 'White Premium Cotton T-Shirt',
    price: 599,
    badge: 'T-Shirt',
    sizes: ['36','38','40','42'],
    images: [
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00700-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00702-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00706-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00705-scaled.jpg',
      'https://treyondworld.com/wp-content/uploads/2024/05/CKS00704-scaled.jpg'
    ],
    url: '/pages/white-t-shirt-cotton.html',
    category: 't-shirts'
  }
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
  
  if (document.getElementById('uniform-page') || window.location.pathname.includes('uniform')) {
    renderProductGrid('uniforms-featured-grid', PRODUCTS_DATA.filter(p=>p.category==='uniforms'));
    renderProductGrid('combat-featured-grid', PRODUCTS_DATA.filter(p=>p.category==='combat-uniforms'));
    renderProductGrid('tshirts-featured-grid', PRODUCTS_DATA.filter(p=>p.category==='t-shirts'));
    renderProductGrid('trending-grid', [
      PRODUCTS_DATA.find(p=>p.id==='uniform-05'),
      PRODUCTS_DATA.find(p=>p.id==='combat-05'),
      PRODUCTS_DATA.find(p=>p.id==='uniform-06'),
      PRODUCTS_DATA.find(p=>p.id==='tshirt-04')
    ]);
  } else {
    renderProductGrid('featured-products', PRODUCTS_DATA.slice(4,8));
    renderProductGrid('new-arrivals-grid', PRODUCTS_DATA.filter(p=>p.category==='check-shirts'));
    renderProductGrid('trending-grid', PRODUCTS_DATA.slice(8,12));
    renderProductGrid('t-shirts-grid', PRODUCTS_DATA.filter(p=>p.category==='t-shirts'));
  }
});
