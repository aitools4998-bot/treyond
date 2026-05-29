/* homepage.js */
'use strict';

// ===== HERO SLIDER =====
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;
  let current = 0, timer;
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
  let touchStartX = 0;
  const slider = document.querySelector('.hero-slider');
  slider?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  slider?.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { stopAuto(); diff > 0 ? next() : prev(); startAuto(); }
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
    track.style.transform = `translateX(-${current * (card.offsetWidth + 24)}px)`;
  };
  document.getElementById('test-prev')?.addEventListener('click', () => { if (current > 0) { current--; move(); } });
  document.getElementById('test-next')?.addEventListener('click', () => { if (current < cards.length - visible) { current++; move(); } });
}

// ===== QUICK VIEW =====
function openQuickView(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;
  const modal = document.getElementById('quickview-modal');
  if (!modal) return;
  modal.querySelector('.quickview-gallery img').src = product.images[0];
  modal.querySelector('.quickview-info').innerHTML = `
    <button class="modal-close" onclick="closeQuickView()"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"/></svg></button>
    <div class="product-badges">${product.badge ? `<span class="badge">${product.badge}</span>` : ''}</div>
    <h2 class="product-name" style="font-size:1.4rem">${product.name}</h2>
    <div class="product-price-main" style="margin-bottom:20px">${formatPrice(product.price)}</div>
    <div class="variant-group"><div class="variant-label">Size</div><div class="size-options">${product.sizes?.map(s => `<button class="size-btn" onclick="this.closest('.size-options').querySelectorAll('.size-btn').forEach(b=>b.classList.remove('active'));this.classList.add('active');">${s}</button>`).join('')||''}</div></div>
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

// ===== PRODUCTS DATA =====
const PRODUCTS_DATA = [
  // SHIRTS
  { id: 'p6752', name: "Men's Light Khaki Oxford Soft Premium Cotton Formal Shirt", price: 1300, badge: 'Shirts', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2023/12/CKS08714.jpg'], url: '/shirts/men-light-khaki-oxford-soft-premium-cotton-formal-shirt-for-mens', category: 'shirts' },
  { id: 'p6761', name: "Men's Gray Color Oxford Soft Premium Cotton Formal Shirt", price: 1300, badge: 'Shirts', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2023/12/CKS08729.jpg'], url: '/shirts/gray-color-oxford-soft-premium-cotton-formal-shirt-for-mens', category: 'shirts' },
  { id: 'p6770', name: "Men's Dark Grey Fila Fill Soft Premium Cotton Formal Shirt", price: 1100, badge: 'Shirts', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2023/12/CKS08743.jpg'], url: '/shirts/men-dark-grey-fila-fill-soft-premium-cotton-formal-shirt', category: 'shirts' },
  { id: 'p6779', name: "Men's Orange Color Super Soft Premium Cotton Dobby Formal Shirt", price: 1100, badge: 'Shirts', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2023/12/CKS08768.jpg'], url: '/shirts/men-orange-color-super-soft-premium-cotton-dobby-formal-shirt', category: 'shirts' },
  // CHECK SHIRTS
  { id: 'p6888', name: "Men's Premium Firoz Printed Cotton Party Wear Shirt", price: 1400, badge: 'Check Shirts', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2024/02/New-Fabric__ocm_b3_acrylicshirt_4__2024-2-4-21-30-40__2730X4096.jpg'], url: '/shirts/check/men-premium-firoz-printed-cotton-party-wear-shirt', category: 'check-shirts' },
  { id: 'p6889', name: "Men's Premium Khaki Multi Color Printed Cotton Party Wear Shirt", price: 1400, badge: 'Check Shirts', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2024/02/New-Fabric__a2_all_set211_shirtfolded_front2__2024-2-4-23-14-57__2730X4096.jpg'], url: '/shirts/check/mens-premium-khaki-multi-color-printed-cotton-party-wear-shirt', category: 'check-shirts' },
  { id: 'p6890', name: "Men's Premium Multi Color Printed Cotton Casual Party Wear Shirt", price: 1400, badge: 'Check Shirts', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2024/02/New-Fabric__all_set255_hanger_shirt__2024-2-5-20-23-13__2730X4096.jpg'], url: '/shirts/check/mens-premium-multi-color-printed-cotton-casual-party-wear-shirt', category: 'check-shirts' },
  { id: 'p6891', name: "Men's Premium Multi Color Printed Cotton Party Wear Shirt", price: 1400, badge: 'Check Shirts', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2024/02/New-Fabric__all_set255_hanger_shirt__2024-2-4-22-50-59__2730X4096.jpg'], url: '/shirts/check/mens-premium-multi-color-printed-cotton-party-wear-shirt', category: 'check-shirts' },
  { id: 'p6892', name: "Men's Premium Printed Cotton Party Wear Shirt", price: 1400, badge: 'Check Shirts', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2024/02/New-Fabric__all_set211_nomo_shirtfolded_front7__2024-2-4-21-56-17__2730X4096.jpg'], url: '/shirts/check/mens-premium-printed-cotton-party-wear-shirt', category: 'check-shirts' },
  { id: 'p6893', name: "Men's Premium Sky Color Printed Cotton Regular Fit Shirt", price: 1400, badge: 'Check Shirts', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2024/02/New-Fabric__all_set161_men_formal_side2__2024-2-4-21-12-27__2730X4096.jpg'], url: '/shirts/check/mens-premium-sky-color-printed-cotton-regular-fit-shirt', category: 'check-shirts' },
  // STRAP SHIRTS
  { id: 'p9462', name: "Men's Premium Stripe Cotton Formal Shirt", price: 1400, badge: 'Strap Shirts', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2024/02/lining-shirt-__ocm_b3_acrylicshirt_4__2024-2-4-20-5-35__2730X4096.jpg'], url: '/shirts/strap/mens-stripe-cotton-formal-shirt', category: 'strap-shirts' },
  { id: 'p9482', name: "Men's Light Blue With White Stripe Cotton Formal Shirt", price: 1400, badge: 'Strap Shirts', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2024/02/shirt-__ocm_b3_acrylicshirt_4__2024-2-4-20-33-28__2730X4096.jpg'], url: '/shirts/strap/mens-light-blue-with-white-stripe-cotton-formal-shirt', category: 'strap-shirts' },
  { id: 'p9503', name: "Men's Premium Multi Color Stripe Cotton Formal Shirt", price: 1400, badge: 'Strap Shirts', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2024/02/shirt-__ocm_b3_acrylicshirt_4__2024-2-4-20-52-50__2730X4096.jpg'], url: '/shirts/strap/mens-premium-muliti-color-stripe-cotton-formal-shirt', category: 'strap-shirts' },
  // TROUSERS
  { id: 'p6906', name: "Men's Light Grey Italian Wool Rich Formal Trouser", price: 1600, badge: 'Trousers', sizes: ['36','38','40','42','44','46'], images: ['https://media.treyondworld.com/2023/12/t-wool-col-19__a4_all_set158_trouser_front__2024-1-31-22-59-54__2730X4096.jpg'], url: '/trousers/mens-light-grey-italian-wool-trouser', category: 'trousers' },
  { id: 'p6916', name: "Men's Dark Blue Italian Wool Rich Formal Trouser", price: 1600, badge: 'Trousers', sizes: ['36','38','40','42','44','46'], images: ['https://media.treyondworld.com/2023/12/T-wool-col-32__a4_all_set158_trouser_front__2024-1-31-22-47-57__2730X4096.jpg'], url: '/trousers/mens-dark-blue-italian-formal-trouser', category: 'trousers' },
  { id: 'p6925', name: "Men's Grey Stripe Italian Wool Rich Formal Trouser", price: 1600, badge: 'Trousers', sizes: ['36','38','40','42','44','46'], images: ['https://media.treyondworld.com/2023/12/t-wool-col-28__a4_all_set158_trouser_front__2024-1-31-22-40-6__2730X4096.jpg'], url: '/trousers/mens-grey-stripe-italian-trouser', category: 'trousers' },
  { id: 'p6934', name: "Men's Grey Check Italian Wool Rich Formal Trouser", price: 1600, badge: 'Trousers', sizes: ['36','38','40','42','44','46'], images: ['https://media.treyondworld.com/2023/12/t-wool-col-40__a4_all_set158_trouser_front__2024-1-31-19-11-15__2730X4096.jpg'], url: '/trousers/mens-grey-check-italian-formal-trouser', category: 'trousers' },
  // BLAZERS
  { id: 'p7921', name: "Men's Navy Blue Woven Italian Classic Blazer", price: 5500, badge: 'Blazers', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2024/01/1000040295.jpg'], url: '/blazers/men-navy-blue-woven-italian-classic-blazer', category: 'blazers' },
  { id: 'p7930', name: "Men's Grey Color Terry Rayon Regular Fit Blazer", price: 5500, badge: 'Blazers', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2024/01/1000040303.jpg'], url: '/blazers/men-grey-color-terry-rayon-regular-fit-blazer', category: 'blazers' },
  { id: 'p7948', name: "Men's Dark Brick Color Regular Fit Blazer", price: 6000, badge: 'Blazers', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2024/01/1000040255.jpg'], url: '/blazers/men-dark-brick-color-regular-fit-blazer', category: 'blazers' },
  { id: 'p7996', name: "Men's Black Terry Rayon Regular Fit Blazer", price: 5500, badge: 'Blazers', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2024/01/1000040091.jpg'], url: '/blazers/men-black-terry-rayon-regular-fit-blazer', category: 'blazers' },
  // MODI JACKET
  { id: 'p6538', name: "Men's Yellow Jacquard Jacket With Silk Kurta And Pajama", price: 1999, badge: 'Modi Jacket', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2023/12/CKS08279.jpg'], url: '/modi-jacket/men-yellow-jacquard-jacket-with-silk-kurta-and-pajama', category: 'modi-jacket' },
  { id: 'p6558', name: "Men's Light Yellow Jacquard Modi Jacket With Silk Kurta Pajama", price: 1999, badge: 'Modi Jacket', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2023/12/CKS08320.jpg'], url: '/modi-jacket/men-light-yellow-jacquard-modi-jacket-with-silk-kurta-pajama', category: 'modi-jacket' },
  { id: 'p9863', name: "Men's Navy Blue Modi Jacket", price: 2400, badge: 'Modi Jacket', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2024/02/terry-rayon-52a__all_set309_nehrujacket_side__2024-2-10-20-50-12__2730X4096.jpg'], url: '/modi-jacket/mens-navy-blue-modi-jacket', category: 'modi-jacket' },
  { id: 'p10018', name: "Men's Gray Check With Wool Rich Modi Jacket", price: 3000, badge: 'Modi Jacket', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2024/02/t-wool-col-40__all_set309_nehrujacket_side__2024-2-10-20-52-8__2730X4096.jpg'], url: '/modi-jacket/mens-gray-check-with-wool-rich-modi-jacket', category: 'modi-jacket' },
  // SUITS
  { id: 'p6566', name: "Men's Grey Tuxedo 3 Piece Suits", price: 7000, badge: 'Suits', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2023/12/CKS08338.jpg'], url: '/suits/men-grey-tuxedo-3-piece-suits-wedding-groomsmen-fashion-suits', category: 'suits' },
  { id: 'p6587', name: "Men's Maroon Sequins Embroidered Tuxedo 3 Piece Suit", price: 7000, badge: 'Suits', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2023/12/CKS08392.jpg'], url: '/suits/men-maroon-sequins-embroidered-tuxedo-3-piece-suit', category: 'suits' },
  { id: 'p6597', name: "Men's Black Sequins Embroidered Tuxedo 3 Piece Suit", price: 7000, badge: 'Suits', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2023/12/CKS08410.jpg'], url: '/suits/men-black-sequins-embroidered-tuxedo-3-piece-suit', category: 'suits' },
  { id: 'p9108', name: "Men's Blue Classic Luxurious 3 Piece Suits", price: 8000, badge: 'Suits', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2024/02/Tri3dImage_1705511954057.jpeg'], url: '/suits/mens-blue-color-classic-luxurious-3-piece-suits', category: 'suits' },
  // UNIFORMS
  { id: 'u1', name: 'CRPF Khaki Uniform By Ajanta Oswal Super Premium Trovine', price: 2099, badge: 'Uniform', sizes: ['36','38','40','42','44','46'], images: ['https://media.treyondworld.com/2024/05/CKS00578-copy-scaled.jpg'], url: '/uniforms/crpf/crpf-khaki-uniform-by-ajanta-oswal-super-premium-trovine', category: 'uniforms' },
  { id: 'u2', name: 'BSF Khaki Uniform Vimal Super Premium Trovine', price: 2099, badge: 'Uniform', sizes: ['36','38','40','42','44','46'], images: ['https://media.treyondworld.com/2024/05/CKS00496.jpg'], url: '/uniforms/bsf/bsf-khaki-uniform-vimal-super-premium-trovine', category: 'uniforms' },
  { id: 'u3', name: 'Police Stretchable Khaki Uniform By Vimal Officer Stretch Fit', price: 2199, badge: 'Uniform', sizes: ['36','38','40','42','44','46'], images: ['https://media.treyondworld.com/2024/05/CKS00690.jpg'], url: '/uniforms/police/police-stretchable-khaki-uniform-by-vimal-officer-stretch-fit', category: 'uniforms' },
  { id: 'u4', name: 'SSB US Pattern Combat Uniform', price: 1999, badge: 'Combat', sizes: ['36','38','40','42','44','46'], images: ['https://media.treyondworld.com/2024/05/CKS00728.jpg'], url: '/uniforms/combat/ssb-us-pattern-combat-uniform', category: 'combat-uniforms' },
  // T-SHIRTS
  { id: 'tshirt-01', name: 'White Premium Cotton T-Shirt', price: 599, badge: 'T-Shirts', sizes: ['36','38','40','42'], images: ['https://media.treyondworld.com/2024/05/CKS00700.jpg'], url: '/t-shirts/white-premium-cotton-t-shirt', category: 't-shirts' },
  { id: 'tshirt-02', name: 'White Cotton T-Shirt', price: 399, badge: 'T-Shirts', sizes: ['36','38','40','42'], images: ['https://media.treyondworld.com/2024/05/CKS00709.jpg'], url: '/t-shirts/white-cotton-t-shirt', category: 't-shirts' },
];

// ===== RENDER PRODUCT GRID =====
function renderProductGrid(containerId, products) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = products.filter(Boolean).map(p => `
    <div class="product-card reveal">
      <a href="${p.url}">
        <div class="product-card-img-wrap">
          <img class="product-card-img" src="${p.images[0]}" alt="${p.name}" loading="lazy">
          <div class="product-card-badges">${p.badge ? `<span class="badge">${p.badge}</span>` : ''}</div>
          <div class="product-card-actions">
            <button class="product-action-btn" onclick="event.preventDefault();Wishlist.toggle('${p.id}');this.style.color=Wishlist.has('${p.id}')?'#e11d48':''" title="Wishlist">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            </button>
            <button class="product-action-btn" onclick="event.preventDefault();openQuickView('${p.id}')" title="Quick View">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            </button>
          </div>
          <button class="product-card-quick" onclick="event.preventDefault();Cart.add({id:'${p.id}',name:'${p.name}',price:${p.price},image:'${p.images[0]}',variant:'Default'})">Quick Add</button>
        </div>
      </a>
      <a href="${p.url}">
        <div class="product-card-info">
          <div class="product-card-name">${p.name}</div>
          <div class="product-card-price"><span class="product-price">${formatPrice(p.price)}</span></div>
        </div>
      </a>
    </div>`).join('');
  initScrollReveal();
}

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  initTestimonialsSlider();
  initNewsletter();

  if (document.getElementById('uniform-page') || window.location.pathname.includes('uniform')) {
    renderProductGrid('uniforms-featured-grid', PRODUCTS_DATA.filter(p => p.category === 'uniforms'));
    renderProductGrid('combat-featured-grid', PRODUCTS_DATA.filter(p => p.category === 'combat-uniforms'));
    renderProductGrid('tshirts-featured-grid', PRODUCTS_DATA.filter(p => p.category === 't-shirts'));
    renderProductGrid('trending-grid', PRODUCTS_DATA.filter(p => ['u1','u4','u2','tshirt-01'].includes(p.id)));
  } else {
    // 7 category grids
    renderProductGrid('shirts-grid', PRODUCTS_DATA.filter(p => p.category === 'shirts').slice(0, 4));
    renderProductGrid('check-shirts-grid', PRODUCTS_DATA.filter(p => p.category === 'check-shirts').slice(0, 4));
    renderProductGrid('strap-shirts-grid', PRODUCTS_DATA.filter(p => p.category === 'strap-shirts').slice(0, 4));
    renderProductGrid('trousers-grid', PRODUCTS_DATA.filter(p => p.category === 'trousers').slice(0, 4));
    renderProductGrid('blazers-grid', PRODUCTS_DATA.filter(p => p.category === 'blazers').slice(0, 4));
    renderProductGrid('modi-grid', PRODUCTS_DATA.filter(p => p.category === 'modi-jacket').slice(0, 4));
    renderProductGrid('suits-grid', PRODUCTS_DATA.filter(p => p.category === 'suits').slice(0, 4));
  }
});
