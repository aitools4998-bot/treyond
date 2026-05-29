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
  {
    id: 'shirt-01',
    name: 'Light Khaki Oxford Soft Premium Cotton Formal Shirt',
    price: 1300,
    badge: 'Shirts',
    sizes: ['38','40','42','44'],
    images: [
      'https://media.treyondworld.com/2023/12/CKS08714.jpg',
      'https://media.treyondworld.com/2023/12/CKS08720.jpg',
      'https://media.treyondworld.com/2023/12/CKS08718.jpg',
      'https://media.treyondworld.com/2023/12/CKS08717.jpg',
      'https://media.treyondworld.com/2023/12/CKS08708.jpg'
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
      'https://media.treyondworld.com/2023/12/CKS08729.jpg',
      'https://media.treyondworld.com/2023/12/CKS08735.jpg',
      'https://media.treyondworld.com/2023/12/CKS08733.jpg',
      'https://media.treyondworld.com/2023/12/CKS08732.jpg',
      'https://media.treyondworld.com/2023/12/CKS08724.jpg'
    ],
    url: '/pages/gray-color-oxford-soft-premium-cotton-formal-shirt-for-mens.html',
    category: 'shirts'
  },
  {
    id: 'shirt-03',
    name: "Men's Dark Grey Fila Fill Soft Premium Cotton Formal Shirt",
    price: 1100,
    badge: 'Shirts',
    sizes: ['38','40','42','44'],
    images: [
      'https://media.treyondworld.com/2023/12/CKS08743.jpg',
      'https://media.treyondworld.com/2023/12/CKS08746.jpg',
      'https://media.treyondworld.com/2023/12/CKS08749.jpg',
      'https://media.treyondworld.com/2023/12/CKS08747.jpg',
      'https://media.treyondworld.com/2023/12/CKS08738.jpg'
    ],
    url: '/pages/men-dark-grey-fila-fill-soft-premium-cotton-formal-shirt.html',
    category: 'shirts'
  },
  {
    id: 'shirt-04',
    name: "Men's Orange Color Super Soft Premium Cotton Dobby Formal Shirt",
    price: 1100,
    badge: 'Shirts',
    sizes: ['38','40','42','44'],
    images: [
      'https://media.treyondworld.com/2023/12/CKS08768.jpg',
      'https://media.treyondworld.com/2023/12/CKS08775.jpg',
      'https://media.treyondworld.com/2023/12/CKS08773.jpg',
      'https://media.treyondworld.com/2023/12/CKS08772.jpg',
      'https://media.treyondworld.com/2023/12/CKS08771.jpg'
    ],
    url: '/pages/men-orange-color-super-soft-premium-cotton-dobby-formal-shirt.html',
    category: 'shirts'
  },
  {
    id: 'shirt-09',
    name: "Men's Mango Color Fila Fill Soft Premium Cotton Formal Shirt",
    price: 1100,
    badge: 'Shirts',
    sizes: ['38','40','42','44'],
    images: [
      'https://media.treyondworld.com/2023/12/CKS08491.jpg',
      'https://media.treyondworld.com/2023/12/CKS08483.jpg',
      'https://media.treyondworld.com/2023/12/CKS08495.jpg',
      'https://media.treyondworld.com/2023/12/CKS08493.jpg',
      'https://media.treyondworld.com/2023/12/CKS08489.jpg'
    ],
    url: '/pages/men-mango-color-fila-fill-soft-premium-cotton-formal-shirt.html',
    category: 'shirts'
  },
  {
    id: 'shirt-10',
    name: "Men's Lemon Color Super Soft Premium Dobby Cotton Formal Shirt",
    price: 1100,
    badge: 'Shirts',
    sizes: ['38','40','42','44'],
    images: [
      'https://media.treyondworld.com/2023/12/CKS08471.jpg',
      'https://media.treyondworld.com/2023/12/CKS08481.jpg',
      'https://media.treyondworld.com/2023/12/CKS08479.jpg',
      'https://media.treyondworld.com/2023/12/CKS08477.jpg',
      'https://media.treyondworld.com/2023/12/CKS08475.jpg'
    ],
    url: '/pages/men-lemon-color-super-soft-premium-dobby-cotton-formal-shirt.html',
    category: 'shirts'
  },
  {
    id: 'shirt-11',
    name: "Men's Pink Color Super Soft Premium Cotton Dobby Formal Shirt",
    price: 1100,
    badge: 'Shirts',
    sizes: ['38','40','42','44'],
    images: [
      'https://media.treyondworld.com/2023/12/CKS08458.jpg',
      'https://media.treyondworld.com/2023/12/CKS08468.jpg',
      'https://media.treyondworld.com/2023/12/CKS08464.jpg',
      'https://media.treyondworld.com/2023/12/CKS08463.jpg',
      'https://media.treyondworld.com/2023/12/CKS08461.jpg'
    ],
    url: '/pages/men-pink-color-super-soft-premium-cotton-dobby-formal-shirt-for-mens.html',
    category: 'shirts'
  },
  {
    id: 'shirt-12',
    name: "Men's Move Color Fila Fill Soft Premium Cotton Formal Shirt",
    price: 1100,
    badge: 'Shirts',
    sizes: ['38','40','42','44'],
    images: [
      'https://media.treyondworld.com/2023/12/CKS08445.jpg',
      'https://media.treyondworld.com/2023/12/CKS08454.jpg',
      'https://media.treyondworld.com/2023/12/CKS08452.jpg',
      'https://media.treyondworld.com/2023/12/CKS08451.jpg',
      'https://media.treyondworld.com/2023/12/CKS08450.jpg'
    ],
    url: '/pages/men-move-color-fila-fill-soft-premium-cotton-formal-shirt.html',
    category: 'shirts'
  },
  {
    id: 'shirt-05',
    name: "Men's Premium Multi Color Printed Cotton Casual Party Wear Shirt",
    price: 1400,
    badge: 'Check Shirts',
    sizes: ['38','40','42','44'],
    images: [
      'https://media.treyondworld.com/2023/12/CKS08864-PhotoRoom.png',
      'https://media.treyondworld.com/2023/12/CKS08912-PhotoRoom.png'
    ],
    url: '/pages/mens-premium-multi-color-printed-cotton-casual-party-wear-shirt.html',
    category: 'check-shirts'
  },
  {
    id: 'shirt-06',
    name: "Men's Premium Multi Color Printed Cotton Party Wear Shirt",
    price: 1400,
    badge: 'Check Shirts',
    sizes: ['38','40','42','44'],
    images: [
      'https://media.treyondworld.com/2023/12/CKS08407-PhotoRoom.png',
      'https://media.treyondworld.com/2023/12/CKS08450-PhotoRoom1-PhotoRoom.png'
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
      'https://media.treyondworld.com/2023/12/CKS08288-PhotoRoom.png',
      'https://media.treyondworld.com/2023/12/CKS08153-PhotoRoom.png'
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
      'https://media.treyondworld.com/2023/12/CKS08161-PhotoRoom.png',
      'https://media.treyondworld.com/2023/12/CKS08164-PhotoRoom.png'
    ],
    url: '/pages/men-premium-firoz-printed-cotton-party-wear-shirt.html',
    category: 'check-shirts'
  },
  {
    id: 'strap-01',
    name: "Men's Light Blue With White Stripe Cotton Formal Shirt",
    price: 1100,
    badge: 'Strap Shirts',
    sizes: ['38','40','42','44'],
    images: ['https://media.treyondworld.com/2024/06/CKS02511-copy.jpg'],
    url: '/pages/mens-light-blue-with-white-stripe-cotton-formal-shirt.html',
    category: 'strap-shirts'
  },
  {
    id: 'strap-02',
    name: "Men's Premium Multi Color Stripe Cotton Formal Shirt",
    price: 1100,
    badge: 'Strap Shirts',
    sizes: ['38','40','42','44'],
    images: ['https://media.treyondworld.com/2024/06/CKS02494-copy.jpg'],
    url: '/pages/mens-premium-muliti-color-stripe-cotton-formal-shirt.html',
    category: 'strap-shirts'
  },
  {
    id: 'suit-01',
    name: "Men's Grey Tuxedo 3 Piece Suits Wedding Groomsmen Fashion Suits",
    price: 8999,
    badge: 'Suits',
    sizes: ['38','40','42','44'],
    images: ['https://media.treyondworld.com/2023/12/tr__tr__New-Fabric__tr__tr____all_set183_threepiecesuit_front__2023-12-10-19-40-23__2730X4096-PhotoRoom.png'],
    url: '/pages/men-grey-tuxedo-3-piece-suits-wedding-groomsmen-fashion-suits.html',
    category: 'suits'
  },
  {
    id: 'suit-02',
    name: "Men's Black Sequins Embroidered Tuxedo 3 Piece Suit",
    price: 9999,
    badge: 'Suits',
    sizes: ['38','40','42','44'],
    images: ['https://media.treyondworld.com/2023/12/New-Fatery-bric____all_set255_mannequin_tuxedo1_v2__2023-12-15-16-59-53__2730X4096-PhotoRoom.png'],
    url: '/pages/men-black-sequins-embroidered-tuxedo-3-piece-suit.html',
    category: 'suits'
  },
  {
    id: 'suit-03',
    name: "Men's Blue Classic Formal 2 Piece Suit",
    price: 7999,
    badge: 'Suits',
    sizes: ['38','40','42','44'],
    images: ['https://media.treyondworld.com/2023/12/fab1__Khaki____all_set256_man_suit2__2023-12-15-17-30-31__4096X4096-PhotoRoom.png'],
    url: '/pages/men-blue-classic-formal-2-piece-suit.html',
    category: 'suits'
  },
  {
    id: 'suit-04',
    name: "Men's Grey Classic Luxurious 3 Piece Suits",
    price: 9499,
    badge: 'Suits',
    sizes: ['38','40','42','44'],
    images: ['https://media.treyondworld.com/2023/12/New-Fabric__New-Fabric__white__fab5____all_set255_mannequin_suit1__2023-12-18-16-30-11__4096X4096-PhotoRoom.jpg'],
    url: '/pages/mens-grey-classic-luxurious-3-piece-suits.html',
    category: 'suits'
  },
  {
    id: 'blazer-01',
    name: "Men's Black Terry Rayon Regular Fit Blazer",
    price: 3499,
    badge: 'Blazers',
    sizes: ['38','40','42','44'],
    images: ['https://media.treyondworld.com/2024/02/t-wool-color-04__all_set256_man_suit2__2024-2-25-22-16-12__2816X4096.jpg'],
    url: '/pages/men-black-terry-rayon-regular-fit-blazer.html',
    category: 'blazers'
  },
  {
    id: 'blazer-02',
    name: "Men's Navy Blue Formal Blazer",
    price: 3499,
    badge: 'Blazers',
    sizes: ['38','40','42','44'],
    images: ['https://media.treyondworld.com/2024/02/t-wool-col-28__all_set309_nehrujacket_front__2024-2-10-21-0-48__2730X4096.jpg'],
    url: '/pages/men-navy-blue-formal-blazer.html',
    category: 'blazers'
  },
  {
    id: 'blazer-03',
    name: "Men's Dark Grey Blazer Italian Terry Rayon",
    price: 3499,
    badge: 'Blazers',
    sizes: ['38','40','42','44'],
    images: ['https://media.treyondworld.com/2024/02/t-wool-col-36__all_set309_nehrujacket_front__2024-2-10-20-55-42__2730X4096.jpg'],
    url: '/pages/men-dark-grey-blazer-italian-terry-rayon.html',
    category: 'blazers'
  },
  {
    id: 'blazer-04',
    name: "Men's Brown Color Terry Rayon Regular Fit Blazer",
    price: 3499,
    badge: 'Blazers',
    sizes: ['38','40','42','44'],
    images: ['https://media.treyondworld.com/2024/02/t-wool-col-39__all_set309_nehrujacket_front__2024-2-10-20-54-48__2730X4096.jpg'],
    url: '/pages/men-brown-color-terry-rayon-regular-fit-blazer.html',
    category: 'blazers'
  },
  {
    id: 'modi-01',
    name: "Men's Yellow Jacquard Jacket With Silk Kurta And Pajama",
    price: 1999,
    badge: 'Modi Jacket',
    sizes: ['38','40','42','44'],
    images: ['https://media.treyondworld.com/2023/12/CKS08279.jpg'],
    url: '/pages/men-yellow-jacquard-jacket-with-silk-kurta-and-pajama.html',
    category: 'modi-jacket'
  },
  {
    id: 'modi-02',
    name: "Men's Navy Blue Modi Jacket",
    price: 2499,
    badge: 'Modi Jacket',
    sizes: ['38','40','42','44'],
    images: ['https://media.treyondworld.com/2024/02/t-wool-col-19__all_set309_nehrujacket_front__2024-2-10-21-4-57__2730X4096.jpg'],
    url: '/pages/mens-navy-blue-modi-jacket.html',
    category: 'modi-jacket'
  },
  {
    id: 'modi-03',
    name: "Men's Gray Check Modi Jacket",
    price: 2499,
    badge: 'Modi Jacket',
    sizes: ['38','40','42','44'],
    images: ['https://media.treyondworld.com/2024/02/remond-blue-check-__all_set309_nehrujacket_front__2024-2-10-21-22-37__2730X4096.jpg'],
    url: '/pages/mens-gray-check-modi-jacket.html',
    category: 'modi-jacket'
  },
  {
    id: 'modi-04',
    name: "Men's Light Yellow Jacquard Modi Jacket With Silk Kurta Pajama",
    price: 1999,
    badge: 'Modi Jacket',
    sizes: ['38','40','42','44'],
    images: ['https://media.treyondworld.com/2023/12/fab6__public_frenchcrown_nehrujacket_2_style1__2023-12-15-15-21-14__2730X4096-PhotoRoom.png'],
    url: '/pages/men-light-yellow-jacquard-modi-jacket-with-silk-kurta-pajama.html',
    category: 'modi-jacket'
  },
  {
    id: 'trouser-01',
    name: "Men's Blue Italian Regular Trouser",
    price: 1299,
    badge: 'Trousers',
    sizes: ['30','32','34','36','38'],
    images: ['https://media.treyondworld.com/2024/02/t-wool-col-28__a4_all_set158_trouser_front__2024-1-31-22-40-6__2730X4096.jpg'],
    url: '/pages/mens-blue-italian-regular-trouser.html',
    category: 'trousers'
  },
  {
    id: 'trouser-02',
    name: "Men's Dark Blue Italian Formal Trouser",
    price: 1299,
    badge: 'Trousers',
    sizes: ['30','32','34','36','38'],
    images: ['https://media.treyondworld.com/2024/02/t-wool-col-36__a4_all_set158_trouser_front__2024-1-31-19-2-43__2730X4096.jpg'],
    url: '/pages/mens-dark-blue-italian-formal-trouser.html',
    category: 'trousers'
  },
  {
    id: 'trouser-03',
    name: "Men's Grey Check Italian Formal Trouser",
    price: 1299,
    badge: 'Trousers',
    sizes: ['30','32','34','36','38'],
    images: ['https://media.treyondworld.com/2024/02/t-wool-col-39__a4_all_set158_trouser_front__2024-1-31-19-9-44__2730X4096.jpg'],
    url: '/pages/mens-grey-check-italian-formal-trouser.html',
    category: 'trousers'
  },
  {
    id: 'trouser-04',
    name: "Men's Light Blue Italian Trouser",
    price: 1299,
    badge: 'Trousers',
    sizes: ['30','32','34','36','38'],
    images: ['https://media.treyondworld.com/2024/02/raymond-yellow-khaki__all_set309_nehrujacket_front__2024-2-10-21-21-7__2730X4096.jpg'],
    url: '/pages/mens-light-blue-italian-trouser.html',
    category: 'trousers'
  },
  {
    id: 'tshirt-01',
    name: 'White Premium Cotton T-Shirt',
    price: 450,
    badge: 'T-Shirt',
    sizes: ['36','38','40','42'],
    images: [
      'https://media.treyondworld.com/2024/05/CKS00717-scaled.jpg',
      'https://media.treyondworld.com/2024/05/CKS00720-scaled.jpg',
      'https://media.treyondworld.com/2024/05/CKS00724-scaled.jpg'
    ],
    url: '/pages/white-premium-cotton-t-shirt.html',
    category: 't-shirts'
  },
  {
    id: 'tshirt-02',
    name: 'White Cotton T-Shirt',
    price: 450,
    badge: 'T-Shirt',
    sizes: ['36','38','40','42'],
    images: [
      'https://media.treyondworld.com/2024/05/CKS00709-scaled.jpg',
      'https://media.treyondworld.com/2024/05/CKS00711-scaled.jpg',
      'https://media.treyondworld.com/2024/05/CKS00715-scaled.jpg'
    ],
    url: '/pages/white-t-shirt-cotton.html',
    category: 't-shirts'
  },
  {
    id: 'tshirt-03',
    name: 'White Cotton T-Shirt (Matty)',
    price: 399,
    badge: 'T-Shirt',
    sizes: ['36','38','40','42'],
    images: ['https://media.treyondworld.com/2024/05/CKS00709-scaled.jpg'],
    url: '/pages/whit-t-shirt-cotton-matty.html',
    category: 't-shirts'
  },
  {
    id: 'tshirt-04',
    name: 'White Premium Cotton T-Shirt (Heavy)',
    price: 599,
    badge: 'T-Shirt',
    sizes: ['36','38','40','42'],
    images: [
      'https://media.treyondworld.com/2024/05/CKS00700-scaled.jpg',
      'https://media.treyondworld.com/2024/05/CKS00702-scaled.jpg'
    ],
    url: '/pages/white-t-shirt-cotton-2.html',
    category: 't-shirts'
  },
  {
    id: 'uniform-01',
    name: 'CRPF Khaki Uniform By Ajanta Oswal Super Premium Trovine',
    price: 2099,
    badge: 'Uniform',
    sizes: ['38','40','42','44','46'],
    images: [
      'https://media.treyondworld.com/2024/05/CKS00578-copy-scaled.jpg',
      'https://media.treyondworld.com/2024/05/CKS00585-copy-scaled.jpg',
      'https://media.treyondworld.com/2024/05/CKS00580-copy-scaled.jpg'
    ],
    url: '/pages/crpf-khaki-uniform-by-ajanta-oswal-super-premium-trovine.html',
    category: 'uniforms'
  },
  {
    id: 'uniform-02',
    name: 'Police Stretchable Khaki Uniform By Vimal Officer Stretch Fit',
    price: 2199,
    badge: 'Uniform',
    sizes: ['38','40','42','44','46'],
    images: [
      'https://media.treyondworld.com/2024/05/CKS00690-scaled.jpg',
      'https://media.treyondworld.com/2024/05/CKS00697-scaled.jpg'
    ],
    url: '/pages/police-stretchable-khaki-uniform-by-vimal-officer-stretch-fit.html',
    category: 'uniforms'
  },
  {
    id: 'uniform-03',
    name: 'Police Khaki Uniform By Vimal Premium Trovine',
    price: 2199,
    badge: 'Uniform',
    sizes: ['38','40','42','44','46'],
    images: [
      'https://media.treyondworld.com/2024/05/CKS00651-copy-scaled.jpg',
      'https://media.treyondworld.com/2024/05/CKS00657-copy-scaled.jpg'
    ],
    url: '/pages/police-khaki-uniform-by-vimal-premium-trovine.html',
    category: 'uniforms'
  },
  {
    id: 'uniform-04',
    name: 'Police Khaki Uniform Vimal Premium Trovine Light Color',
    price: 2199,
    badge: 'Uniform',
    sizes: ['38','40','42','44','46'],
    images: ['https://media.treyondworld.com/2024/05/CKS00640-copy-scaled.jpg'],
    url: '/pages/police-khaki-uniform-vimal-premium-trovine-light-color.html',
    category: 'uniforms'
  },
  {
    id: 'uniform-05',
    name: 'BSF Graviera Khaki Uniform',
    price: 1700,
    badge: 'Uniform',
    sizes: ['36','38','40','42','44','46'],
    images: [
      'https://media.treyondworld.com/2024/05/CKS00468-scaled.jpg',
      'https://media.treyondworld.com/2024/05/CKS00472-scaled.jpg'
    ],
    url: '/pages/khaki-uniform-oswal-ajanta-super-primium-trovin.html',
    category: 'uniforms'
  },
  {
    id: 'uniform-06',
    name: 'Police Khaki Uniform BY Vimal Super Trovine',
    price: 1999,
    badge: 'Uniform',
    sizes: ['36','38','40','42','44','46'],
    images: ['https://media.treyondworld.com/2024/05/CKS00667-copy-scaled.jpg'],
    url: '/pages/police-khaki-uniform-by-vimal-super-trovine.html',
    category: 'uniforms'
  },
  {
    id: 'uniform-07',
    name: 'BSF Khaki Uniform Vimal Super Premium Trovine',
    price: 2099,
    badge: 'Uniform',
    sizes: ['36','38','40','42','44','46'],
    images: ['https://media.treyondworld.com/2024/05/CKS00496-scaled.jpg'],
    url: '/pages/bsf-khaki-uniform-vimal-super-trovine.html',
    category: 'uniforms'
  },
  {
    id: 'uniform-08',
    name: 'BSF Khaki Uniform Vimal Saphire Matty',
    price: 1999,
    badge: 'Uniform',
    sizes: ['36','38','40','42','44','46'],
    images: ['https://media.treyondworld.com/2024/05/CKS00512-scaled.jpg'],
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
      'https://media.treyondworld.com/2024/05/CKS00770-scaled.jpg',
      'https://media.treyondworld.com/2024/05/CKS00772-scaled.jpg'
    ],
    url: '/pages/ssb-new-pattern-combat-uniform.html',
    category: 'combat-uniforms'
  },
  {
    id: 'combat-02',
    name: 'SSB US Pattern Combat Uniform (Trovine Premium)',
    price: 2199,
    badge: 'Combat',
    sizes: ['38','40','42','44','46'],
    images: ['https://media.treyondworld.com/2024/05/CKS00758-scaled.jpg'],
    url: '/pages/ssb-us-pattern-combat-uniform.html',
    category: 'combat-uniforms'
  },
  {
    id: 'combat-03',
    name: 'CRPF Combat Cotton 80% Poly 20% Us Pattern Wardi',
    price: 1550,
    badge: 'Combat',
    sizes: ['36','38','40','42','44','46'],
    images: ['https://media.treyondworld.com/2024/05/CKS00598-copy-scaled.jpg'],
    url: '/pages/crpf-combat-uniform.html',
    category: 'combat-uniforms'
  },
  {
    id: 'combat-04',
    name: 'CRPF Combat Manipuri Pattern Uniform By Cool Touch Ajanta',
    price: 2199,
    badge: 'Combat',
    sizes: ['36','38','40','42','44','46'],
    images: ['https://media.treyondworld.com/2024/05/CKS00613-copy-scaled.jpg'],
    url: '/pages/crpf-cotton-combat-uniform.html',
    category: 'combat-uniforms'
  },
  {
    id: 'combat-05',
    name: 'CRPF Combat Uniform Cool Touch Fast Color by Ajanta',
    price: 1799,
    badge: 'Combat',
    sizes: ['36','38','40','42','44','46'],
    images: ['https://media.treyondworld.com/2024/05/crpf-poly-coot-touch-main-photo.jpg'],
    url: '/pages/crpf-combat-uniform-cool-touch-fast-colour-by-ajanta.html',
    category: 'combat-uniforms'
  }
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
  initTestimonialsSlider();
  initNewsletter();

  if (document.getElementById('uniform-page') || window.location.pathname.includes('uniform')) {
    renderProductGrid('uniforms-featured-grid', PRODUCTS_DATA.filter(p=>p.category==='uniforms'));
    renderProductGrid('combat-featured-grid', PRODUCTS_DATA.filter(p=>p.category==='combat-uniforms'));
    renderProductGrid('tshirts-featured-grid', PRODUCTS_DATA.filter(p=>p.category==='t-shirts'));
    renderProductGrid('trending-grid', PRODUCTS_DATA.filter(p=>['uniform-05','combat-01','uniform-06','tshirt-04'].includes(p.id)));
  } else {
    // Homepage category-wise grids
    renderProductGrid('shirts-grid', PRODUCTS_DATA.filter(p=>p.category==='shirts').slice(0,4));
    renderProductGrid('check-shirts-grid', PRODUCTS_DATA.filter(p=>p.category==='check-shirts').slice(0,4));
    renderProductGrid('strap-shirts-grid', PRODUCTS_DATA.filter(p=>p.category==='strap-shirts').slice(0,4));
    renderProductGrid('blazers-grid', PRODUCTS_DATA.filter(p=>p.category==='blazers').slice(0,4));
    renderProductGrid('suits-grid', PRODUCTS_DATA.filter(p=>p.category==='suits').slice(0,4));
    renderProductGrid('modi-grid', PRODUCTS_DATA.filter(p=>p.category==='modi-jacket').slice(0,4));
    renderProductGrid('trousers-grid', PRODUCTS_DATA.filter(p=>p.category==='trousers').slice(0,4));
    renderProductGrid('tshirts-grid', PRODUCTS_DATA.filter(p=>p.category==='t-shirts').slice(0,4));
  }
});
