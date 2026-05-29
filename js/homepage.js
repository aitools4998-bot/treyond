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
    const cardWidth = card.offsetWidth + 24;
    track.style.transform = `translateX(-${current * cardWidth}px)`;
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

// ===== PRODUCTS DATA =====
const PRODUCTS_DATA = [
  // SHIRTS
  { id: 'p6606', name: 'Pista Green Color Fila Fill Soft Premium Cotton Formal Shirt', price: 1100, badge: 'Shirts', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2023/12/CKS08431.jpg'], url: '/pages/pista-green-color-fila-fill-soft-premium-cotton-formal-shirt.html', category: 'shirts' },
  { id: 'p6615', name: 'Move Color Fila Fill Soft Premium Cotton Formal Shirt', price: 1100, badge: 'Shirts', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2023/12/CKS08445.jpg'], url: '/pages/move-color-fila-fill-soft-premium-cotton-formal-shirt-for-me.html', category: 'shirts' },
  { id: 'p6624', name: 'Pink Color Super Soft Premium Cotton Dobby Formal Shirt', price: 1100, badge: 'Shirts', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2023/12/CKS08458.jpg'], url: '/pages/pink-color-super-soft-premium-cotton-dobby-formal-shirt-for.html', category: 'shirts' },
  { id: 'p6635', name: 'Lemon Color Super Soft Premium Dobby Cotton Formal Shirt', price: 1100, badge: 'Shirts', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2023/12/CKS08471.jpg'], url: '/pages/lemon-color-super-soft-premium-dobby-cotton-formal-shirt-for.html', category: 'shirts' },
  { id: 'p6644', name: 'Mango Color Fila Fill Soft Premium Cotton Formal Shirt', price: 1100, badge: 'Shirts', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2023/12/CKS08491.jpg'], url: '/pages/mango-color-fila-fill-soft-premium-cotton-formal-shirt-for-m.html', category: 'shirts' },
  { id: 'p6653', name: 'Sky Color Super Soft Premium Dobby Cotton Formal Shirt', price: 1100, badge: 'Shirts', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2023/12/CKS08508.jpg'], url: '/pages/sky-color-super-soft-premium-dobby-cotton-formal-shirt-for-m.html', category: 'shirts' },
  { id: 'p6662', name: "Men's Dark Pink Fila Fill Soft Premium Cotton Formal Shirt", price: 1100, badge: 'Shirts', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2023/12/CKS08519.jpg'], url: '/pages/men-dark-pink-fila-fill-soft-premium-cotton-formal-shirt.html', category: 'shirts' },
  { id: 'p6671', name: "Men's Light Fawn Fila Fill Soft Premium Cotton Formal Shirt", price: 1100, badge: 'Shirts', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2023/12/CKS08537.jpg'], url: '/pages/men-light-fawn-fila-fill-soft-premium-cotton-formal-shirt.html', category: 'shirts' },
  { id: 'p6752', name: "Men's Light Khaki Oxford Soft Premium Cotton Formal Shirt", price: 1300, badge: 'Shirts', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2023/12/CKS08714.jpg'], url: '/pages/men-light-khaki-oxford-soft-premium-cotton-formal-shirt-for-mens.html', category: 'shirts' },
  { id: 'p6761', name: "Men's Gray Color Oxford Soft Premium Cotton Formal Shirt", price: 1300, badge: 'Shirts', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2023/12/CKS08729.jpg'], url: '/pages/gray-color-oxford-soft-premium-cotton-formal-shirt-for-mens.html', category: 'shirts' },
  { id: 'p6770', name: "Men's Dark Grey Fila Fill Soft Premium Cotton Formal Shirt", price: 1100, badge: 'Shirts', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2023/12/CKS08743.jpg'], url: '/pages/men-dark-grey-fila-fill-soft-premium-cotton-formal-shirt.html', category: 'shirts' },
  { id: 'p6779', name: "Men's Orange Color Super Soft Premium Cotton Dobby Formal Shirt", price: 1100, badge: 'Shirts', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2023/12/CKS08768.jpg'], url: '/pages/men-orange-color-super-soft-premium-cotton-dobby-formal-shirt.html', category: 'shirts' },

  // CHECK SHIRTS
  { id: 'p6888', name: "Men's Premium Firoz Printed Cotton Party Wear Shirt", price: 1400, badge: 'Check Shirts', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2023/12/CKS08161-PhotoRoom.png'], url: '/pages/men-premium-firoz-printed-cotton-party-wear-shirt.html', category: 'check-shirts' },
  { id: 'p9523', name: "Men's Premium Sky Color Printed Cotton Regular Fit Shirt", price: 1400, badge: 'Check Shirts', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2023/12/CKS08164-PhotoRoom.png'], url: '/pages/mens-premium-sky-color-printed-cotton-regular-fit-shirt.html', category: 'check-shirts' },
  { id: 'p9543', name: "Men's Premium Multi Color Printed Cotton Party Wear Shirt", price: 1400, badge: 'Check Shirts', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2023/12/CKS08288-PhotoRoom.png'], url: '/pages/mens-premium-multi-color-printed-cotton-party-wear-shirt.html', category: 'check-shirts' },
  { id: 'p9562', name: "Men's Premium Printed Cotton Party Wear Shirt", price: 1400, badge: 'Check Shirts', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2023/12/CKS08407-PhotoRoom.png'], url: '/pages/mens-premium-printed-cotton-party-wear-shirt.html', category: 'check-shirts' },
  { id: 'p9624', name: "Men's Premium Multi Color Printed Cotton Casual Party Wear Shirt", price: 1400, badge: 'Check Shirts', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2023/12/CKS08864-PhotoRoom.png'], url: '/pages/mens-premium-multi-color-printed-cotton-casual-party-wear-shirt.html', category: 'check-shirts' },
  { id: 'p9600', name: "Men's Premium Khaki Multi Color Printed Cotton Party Wear Shirt", price: 1400, badge: 'Check Shirts', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2023/12/CKS08912-PhotoRoom.png'], url: '/pages/mens-premium-khaki-multi-color-printed-cotton-party-wear-shi.html', category: 'check-shirts' },

  // STRAP SHIRTS
  { id: 'p9462', name: "Men's Premium Stripe Cotton Formal Shirt", price: 1400, badge: 'Strap Shirts', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2024/06/CKS02478-copy.jpg'], url: '/pages/mens-premium-stripe-cotton-formal-shirt.html', category: 'strap-shirts' },
  { id: 'p9482', name: "Men's Light Blue With White Stripe Premium Cotton Formal Shirt", price: 1400, badge: 'Strap Shirts', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2024/06/CKS02491-copy.jpg'], url: '/pages/mens-light-blue-with-white-stripe-cotton-formal-shirt.html', category: 'strap-shirts' },
  { id: 'p9503', name: "Men's Premium Multi Color Stripe Cotton Formal Shirt", price: 1400, badge: 'Strap Shirts', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2024/06/CKS02494-copy.jpg'], url: '/pages/mens-premium-muliti-color-stripe-cotton-formal-shirt.html', category: 'strap-shirts' },

  // BLAZERS
  { id: 'p7921', name: "Men's Navy Blue Woven Italian Classic Blazer", price: 5500, badge: 'Blazers', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2024/01/1000040295.jpg'], url: '/pages/mens-navy-blue-woven-italian-classic-blazer.html', category: 'blazers' },
  { id: 'p7930', name: "Men's Grey Color Terry Rayon Regular Fit Blazer", price: 5500, badge: 'Blazers', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2024/01/1000040303.jpg'], url: '/pages/mens-grey-color-terry-rayon-regular-fit-blazer.html', category: 'blazers' },
  { id: 'p7939', name: "Men's Royal Green Color Regular Fit Blazer", price: 5500, badge: 'Blazers', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2024/01/1000040284.jpg'], url: '/pages/mens-royal-green-color-regular-fit-blazer.html', category: 'blazers' },
  { id: 'p7948', name: "Men's Dark Brick Color Regular Fit Blazer", price: 6000, badge: 'Blazers', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2024/01/1000040255.jpg'], url: '/pages/mens-dark-brick-color-regular-fit-blazer.html', category: 'blazers' },
  { id: 'p7959', name: "Men's Brown Color Terry Rayon Regular Fit Blazer", price: 5500, badge: 'Blazers', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2024/01/1000040271.jpg'], url: '/pages/mens-brown-color-terry-rayon-regular-fit-blazer.html', category: 'blazers' },
  { id: 'p7996', name: "Men's Black Terry Rayon Regular Fit Blazer", price: 5500, badge: 'Blazers', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2024/01/1000040091.jpg'], url: '/pages/mens-black-terry-rayon-regular-fit-blazer.html', category: 'blazers' },
  { id: 'p8013', name: "Men's Navy Blue Formal Blazer", price: 6000, badge: 'Blazers', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2024/01/1000040105.jpg'], url: '/pages/mens-navy-blue-formal-blazer.html', category: 'blazers' },
  { id: 'p8030', name: "Men's Ink Blue Regular Fit Blazer", price: 6000, badge: 'Blazers', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2024/01/1000040119.jpg'], url: '/pages/mens-ink-blue-regular-fit-blazer.html', category: 'blazers' },

  // SUITS
  { id: 'p6566', name: "Men's Grey Tuxedo 3 Piece Suits Wedding Groomsmen Fashion Suits", price: 7000, badge: 'Suits', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2023/12/CKS08338.jpg'], url: '/pages/mens-grey-tuxedo-3-piece-suits-wedding-groomsmen-fashion-suits.html', category: 'suits' },
  { id: 'p6578', name: "Men's Dark Blue Sequins Embroidered Tuxedo Blazer", price: 7000, badge: 'Suits', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2023/12/CKS08366.jpg'], url: '/pages/men-dark-blue-sequins-embroidered-tuxedo-blazer-with-blue-vest-coat-and-pant.html', category: 'suits' },
  { id: 'p6587', name: "Men's Maroon Sequins Embroidered Tuxedo 3 Piece Suit", price: 7000, badge: 'Suits', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2023/12/CKS08392.jpg'], url: '/pages/mens-maroon-sequins-embroidered-tuxedo-3-piece-suit.html', category: 'suits' },
  { id: 'p6597', name: "Men's Black Sequins Embroidered Tuxedo 3 Piece Suit", price: 7000, badge: 'Suits', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2023/12/CKS08410.jpg'], url: '/pages/men-black-sequins-embroidered-tuxedo-3-piece-suit.html', category: 'suits' },
  { id: 'p7408', name: "Men's Blue Classic Formal 2 Piece Suit", price: 7000, badge: 'Suits', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2023/12/Tri3dImage_1706377413175.jpeg'], url: '/pages/mens-blue-classic-formal-2-piece-suit.html', category: 'suits' },
  { id: 'p9108', name: "Men's Blue Classic Luxurious 3 Piece Suits", price: 8000, badge: 'Suits', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2024/02/Tri3dImage_1705511954057.jpeg'], url: '/pages/mens-blue-classic-luxurious-3-piece-suits.html', category: 'suits' },
  { id: 'p9050', name: "Men's Parrot Color Classic Luxurious 3 Piece Suits", price: 8000, badge: 'Suits', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2024/02/Tri3dImage_17055051577161.jpeg'], url: '/pages/mens-parrot-color-classic-luxurious-3-piece-suits.html', category: 'suits' },

  // MODI JACKET
  { id: 'p6538', name: "Men's Yellow Jacquard Jacket With Silk Kurta And Pajama", price: 1999, badge: 'Modi Jacket', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2023/12/CKS08279.jpg'], url: '/pages/men-yellow-jacquard-jacket-with-silk-kurta-and-pajama.html', category: 'modi-jacket' },
  { id: 'p6558', name: "Men's Light Yellow Jacquard Modi Jacket With Silk Kurta Pajama", price: 1999, badge: 'Modi Jacket', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2023/12/CKS08320.jpg'], url: '/pages/men-light-yellow-jacquard-modi-jacket-with-silk-kurta-pajama.html', category: 'modi-jacket' },
  { id: 'p9863', name: "Men's Navy Blue Modi Jacket", price: 2400, badge: 'Modi Jacket', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2024/02/terry-rayon-52a__all_set309_nehrujacket_side__2024-2-10-20-50-12__2730X4096.jpg'], url: '/pages/mens-navy-blue-modi-jacket.html', category: 'modi-jacket' },
  { id: 'p10018', name: "Men's Gray Check With Wool Rich Modi Jacket", price: 3000, badge: 'Modi Jacket', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2024/02/t-wool-col-40__all_set309_nehrujacket_side__2024-2-10-20-52-8__2730X4096.jpg'], url: '/pages/mens-gray-check-with-wool-rich-modi-jacket.html', category: 'modi-jacket' },
  { id: 'p10032', name: "Men's Ink Blue Check With Wool Rich Modi Jacket", price: 3000, badge: 'Modi Jacket', sizes: ['38','40','42','44'], images: ['https://media.treyondworld.com/2024/02/t-wool-col-39__all_set309_nehrujacket_side__2024-2-10-20-54-5__2730X4096.jpg'], url: '/pages/mens-ink-blue-check-with-wool-rich-modi-jacket.html', category: 'modi-jacket' },

  // TROUSERS
  { id: 'p6906', name: "Men's Light Grey Italian Wool Rich Formal Trouser", price: 1600, badge: 'Trousers', sizes: ['36','38','40','42','44','46'], images: ['https://media.treyondworld.com/2023/12/t-wool-col-19__a4_all_set158_trouser_front__2024-1-31-22-59-54__2730X4096.jpg'], url: '/pages/mens-light-grey-italian-wool-trouser.html', category: 'trousers' },
  { id: 'p6916', name: "Men's Dark Blue Italian Wool Rich Formal Trouser", price: 1600, badge: 'Trousers', sizes: ['36','38','40','42','44','46'], images: ['https://media.treyondworld.com/2023/12/T-wool-col-32__a4_all_set158_trouser_front__2024-1-31-22-47-57__2730X4096.jpg'], url: '/pages/mens-dark-blue-italian-formal-trouser.html', category: 'trousers' },
  { id: 'p6925', name: "Men's Grey Stripe Italian Wool Rich Formal Trouser", price: 1600, badge: 'Trousers', sizes: ['36','38','40','42','44','46'], images: ['https://media.treyondworld.com/2023/12/t-wool-col-28__a4_all_set158_trouser_front__2024-1-31-22-40-6__2730X4096.jpg'], url: '/pages/mens-grey-stripe-italian-trouser.html', category: 'trousers' },
  { id: 'p6934', name: "Men's Grey Check Italian Wool Rich Formal Trouser", price: 1600, badge: 'Trousers', sizes: ['36','38','40','42','44','46'], images: ['https://media.treyondworld.com/2023/12/t-wool-col-40__a4_all_set158_trouser_front__2024-1-31-19-11-15__2730X4096.jpg'], url: '/pages/mens-grey-check-italian-formal-trouser.html', category: 'trousers' },
  { id: 'p7006', name: "Men's Light Parrot Green Italian Wool Rich Formal Trouser", price: 1600, badge: 'Trousers', sizes: ['36','38','40','42','44','46'], images: ['https://media.treyondworld.com/2023/12/t-wool-col-36__a4_all_set158_trouser_front__2024-1-31-19-2-43__2730X4096.jpg'], url: '/pages/mens-light-parrot-green-formal-trouser.html', category: 'trousers' },

  // T-SHIRTS
  { id: 'p10440', name: 'White Premium Cotton T-Shirt', price: 599, badge: 'T-Shirts', sizes: ['36','38','40','42'], images: ['https://media.treyondworld.com/2024/05/CKS00700.jpg'], url: '/pages/white-t-shirt-cotton.html', category: 't-shirts' },
  { id: 'p10442', name: 'White Cotton T-Shirt', price: 399, badge: 'T-Shirts', sizes: ['36','38','40','42'], images: ['https://media.treyondworld.com/2024/05/CKS00709.jpg'], url: '/pages/white-cotton-t-shirt.html', category: 't-shirts' },
  { id: 'p10444', name: 'White Cotton T-Shirt (Matty)', price: 450, badge: 'T-Shirts', sizes: ['36','38','40','42'], images: ['https://media.treyondworld.com/2024/05/CKS00709.jpg'], url: '/pages/whit-t-shirt-cotton-matty.html', category: 't-shirts' },
  { id: 'p10446', name: 'White Premium Cotton T-Shirt (Soft)', price: 450, badge: 'T-Shirts', sizes: ['36','38','40','42'], images: ['https://media.treyondworld.com/2024/05/CKS00717.jpg'], url: '/pages/white-premium-cotton-t-shirt.html', category: 't-shirts' },

  // UNIFORMS
  { id: 'p10218', name: 'BSF Khaki Uniform By Graviera', price: 1700, badge: 'Uniform', sizes: ['36','38','40','42','44','46'], images: ['https://media.treyondworld.com/2024/05/CKS00468.jpg'], url: '/pages/bsf-khaki-uniform-raymond-2.html', category: 'uniforms' },
  { id: 'p10233', name: 'BSF Khaki Uniform Vimal Super Premium Trovine', price: 2099, badge: 'Uniform', sizes: ['36','38','40','42','44','46'], images: ['https://media.treyondworld.com/2024/05/CKS00496.jpg'], url: '/pages/bsf-khaki-uniform-vimal-super-trovine.html', category: 'uniforms' },
  { id: 'p10275', name: 'CRPF Khaki Uniform Vimal Sapphire', price: 1999, badge: 'Uniform', sizes: ['36','38','40','42','44','46'], images: ['https://media.treyondworld.com/2024/05/CKS00548.jpg'], url: '/pages/crpf-khaki-uniform-vimal-sapphre.html', category: 'uniforms' },
  { id: 'p10300', name: 'SSB Khaki Uniform By Ajanta Oswal Super Premium Trovine', price: 1999, badge: 'Uniform', sizes: ['36','38','40','42','44','46'], images: ['https://media.treyondworld.com/2024/05/CKS00578-copy.jpg'], url: '/pages/ssb-khaki-uniform-by-ajanta-oswal-super-premium-trovine.html', category: 'uniforms' },
  { id: 'p10430', name: 'CRPF Khaki Uniform By Vimal Premium Trovine', price: 2099, badge: 'Uniform', sizes: ['36','38','40','42','44','46'], images: ['https://media.treyondworld.com/2024/05/CKS00651-copy.jpg'], url: '/pages/crpf-khaki-uniform-by-vimal-primium-trovine.html', category: 'uniforms' },
  { id: 'p10438', name: 'CRPF Stretchable Khaki Uniform By Vimal Officer Stretch Fit', price: 2199, badge: 'Uniform', sizes: ['36','38','40','42','44','46'], images: ['https://media.treyondworld.com/2024/05/CKS00690.jpg'], url: '/pages/police-stretchable-khaki-uniform-by-vimal-officer-stretch-fit.html', category: 'uniforms' },

  // COMBAT UNIFORMS
  { id: 'p10308', name: 'CRPF Combat Uniform Cool Touch Fast Color by Ajanta', price: 1799, badge: 'Combat', sizes: ['36','38','40','42','44','46'], images: ['https://media.treyondworld.com/2024/05/crpf-poly-coot-touch-main-photo.jpg'], url: '/pages/crpf-combat-uniform-cool-touch-fast-colour-by-ajanta.html', category: 'combat-uniforms' },
  { id: 'p10317', name: 'CRPF Cotton US Pattern Combat Uniform', price: 2199, badge: 'Combat', sizes: ['36','38','40','42','44','46'], images: ['https://media.treyondworld.com/2024/05/CKS00598-copy.jpg'], url: '/pages/crpf-cotton-combat-uniform.html', category: 'combat-uniforms' },
  { id: 'p10424', name: 'CRPF Combat Manipuri Pattern Uniform By Cool Touch Ajanta', price: 2199, badge: 'Combat', sizes: ['36','38','40','42','44','46'], images: ['https://media.treyondworld.com/2024/05/CKS00613-copy.jpg'], url: '/pages/crpf-combat-uniform.html', category: 'combat-uniforms' },
  { id: 'p10448', name: 'SSB US Pattern Combat Uniform', price: 1999, badge: 'Combat', sizes: ['36','38','40','42','44','46'], images: ['https://media.treyondworld.com/2024/05/CKS00728.jpg'], url: '/pages/ssb-us-pattern-combat-uniform.html', category: 'combat-uniforms' },
  { id: 'p10450', name: 'SSB New Pattern Combat Uniform', price: 1799, badge: 'Combat', sizes: ['36','38','40','42','44','46'], images: ['https://media.treyondworld.com/2024/05/CKS00743.jpg'], url: '/pages/ssb-new-pattern-combat-uniform.html', category: 'combat-uniforms' },
  { id: 'p10454', name: 'SSB New Pattern Combat Uniform (Premium)', price: 2099, badge: 'Combat', sizes: ['36','38','40','42','44','46'], images: ['https://media.treyondworld.com/2024/05/CKS00770.jpg'], url: '/pages/ssb-new-pattern-combat-uniform.html', category: 'combat-uniforms' },
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
    renderProductGrid('trending-grid', PRODUCTS_DATA.filter(p => ['p10450','p10308','p10233','p10446'].includes(p.id)));
  } else {
    renderProductGrid('shirts-grid', PRODUCTS_DATA.filter(p => p.category === 'shirts').slice(0, 4));
    renderProductGrid('check-shirts-grid', PRODUCTS_DATA.filter(p => p.category === 'check-shirts').slice(0, 4));
    renderProductGrid('strap-shirts-grid', PRODUCTS_DATA.filter(p => p.category === 'strap-shirts').slice(0, 4));
    renderProductGrid('blazers-grid', PRODUCTS_DATA.filter(p => p.category === 'blazers').slice(0, 4));
    renderProductGrid('suits-grid', PRODUCTS_DATA.filter(p => p.category === 'suits').slice(0, 4));
    renderProductGrid('modi-grid', PRODUCTS_DATA.filter(p => p.category === 'modi-jacket').slice(0, 4));
    renderProductGrid('trousers-grid', PRODUCTS_DATA.filter(p => p.category === 'trousers').slice(0, 4));
    renderProductGrid('tshirts-grid', PRODUCTS_DATA.filter(p => p.category === 't-shirts').slice(0, 4));
  }
});
