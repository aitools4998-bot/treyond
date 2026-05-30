/* product.js */
'use strict';

// ===== GALLERY =====
let currentImg = 0;
function initGallery() {
  const mainImg = document.getElementById('main-product-img');
  const thumbs = document.querySelectorAll('.product-gallery-thumb');
  if (!mainImg || !thumbs.length) return;

  const images = Array.from(thumbs).map(t => t.querySelector('img')?.src);

  thumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      mainImg.src = images[i];
      currentImg = i;
    });
  });
  thumbs[0]?.classList.add('active');

  // Zoom on hover
  const gallery = mainImg.closest('.product-gallery-main');
  gallery?.addEventListener('mousemove', (e) => {
    const rect = gallery.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    gallery.style.setProperty('--zoom-x', x + '%');
    gallery.style.setProperty('--zoom-y', y + '%');
  });
  gallery?.addEventListener('click', () => gallery.classList.toggle('zoomed'));
}

// ===== VARIANT SELECTION =====
function initVariants() {
  // Size buttons
  document.querySelectorAll('.size-btn').forEach(btn => {
    if (!btn.classList.contains('unavailable')) {
      btn.addEventListener('click', () => {
        btn.closest('.size-options').querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateCurrentVariant();
      });
    }
  });
  // Color swatches
  document.querySelectorAll('.color-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      swatch.closest('.color-swatches').querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      const label = swatch.closest('.variant-group').querySelector('.variant-selected');
      if (label) label.textContent = swatch.dataset.color || swatch.title;
      updateCurrentVariant();
    });
  });
}

function updateCurrentVariant() {
  const size = document.querySelector('.size-btn.active')?.textContent.trim();
  const color = document.querySelector('.color-swatch.active')?.dataset.color || document.querySelector('.color-swatch.active')?.title;
  window._currentVariant = [color, size].filter(Boolean).join(' / ') || 'Default';
}

// ===== QUANTITY =====
function initQuantity() {
  const input = document.getElementById('product-qty');
  document.getElementById('qty-minus')?.addEventListener('click', () => {
    if (input && +input.value > 1) input.value = +input.value - 1;
  });
  document.getElementById('qty-plus')?.addEventListener('click', () => {
    if (input && +input.value < 10) input.value = +input.value + 1;
  });
}

// ===== ADD TO CART =====
function initAddToCart() {
  document.getElementById('add-to-cart-btn')?.addEventListener('click', () => {
    const name = document.getElementById('product-title')?.textContent;
    const price = parseFloat(document.getElementById('product-price')?.dataset.price || 0);
    const qty = parseInt(document.getElementById('product-qty')?.value || 1);
    const image = document.getElementById('main-product-img')?.src;
    const variant = window._currentVariant || 'Default';
    const id = document.getElementById('product-id')?.value || 'product';

    if (!document.querySelector('.size-btn.active') && document.querySelectorAll('.size-btn:not(.unavailable)').length > 0) {
      showToast('Please select a size', 'error');
      document.querySelector('.size-options')?.classList.add('shake');
      setTimeout(() => document.querySelector('.size-options')?.classList.remove('shake'), 600);
      return;
    }

    Cart.add({ id, name, price, qty, image, variant });
    const btn = document.getElementById('add-to-cart-btn');
    btn.textContent = 'Added!';
    btn.style.background = '#16a34a';
    setTimeout(() => { btn.innerHTML = 'Add to Cart'; btn.style.background = ''; }, 2000);
  });

  document.getElementById('buy-now-btn')?.addEventListener('click', () => {
    document.getElementById('add-to-cart-btn')?.click();
    setTimeout(() => { window.location.href = "https://treyondworld.com/checkout.html"; }, 800);
  });
}

// ===== WISHLIST BUTTON =====
function initWishlistBtn() {
  const btn = document.getElementById('wishlist-btn');
  const id = document.getElementById('product-id')?.value;
  if (!btn || !id) return;

  const update = () => {
    const has = Wishlist.has(id);
    btn.classList.toggle('active', has);
    btn.title = has ? 'Remove from Wishlist' : 'Add to Wishlist';
  };
  update();
  btn.addEventListener('click', () => { Wishlist.toggle(id); update(); showToast(Wishlist.has(id) ? 'Added to Wishlist' : 'Removed from Wishlist', 'info'); });
}

// ===== STICKY ATC BAR =====
function initStickyATC() {
  const bar = document.getElementById('sticky-atc');
  const section = document.getElementById('add-to-cart-section');
  if (!bar || !section) return;

  const observer = new IntersectionObserver(([entry]) => {
    bar.classList.toggle('visible', !entry.isIntersecting);
  }, { threshold: 0 });

  observer.observe(section);
  document.getElementById('sticky-atc-btn')?.addEventListener('click', () => document.getElementById('add-to-cart-btn')?.click());
}

// ===== IMAGE LIGHTBOX =====
function initLightbox() {
  document.querySelectorAll('.review-img').forEach(img => {
    img.addEventListener('click', () => {
      const lb = document.createElement('div');
      lb.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:pointer';
      const image = document.createElement('img');
      image.src = img.src;
      image.style.cssText = 'max-width:90vw;max-height:90vh;object-fit:contain';
      lb.appendChild(image);
      lb.addEventListener('click', () => lb.remove());
      document.body.appendChild(lb);
    });
  });
}

// ===== SIZE GUIDE MODAL =====
function openSizeGuide() {
  document.getElementById('size-guide-modal')?.classList.add('active');
  document.getElementById('overlay')?.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeSizeGuide() {
  document.getElementById('size-guide-modal')?.classList.remove('active');
  document.getElementById('overlay')?.classList.remove('active');
  document.body.style.overflow = '';
}

// ===== READING PROGRESS (reuse for product scroll) =====
function initScrollProgress() {
  const bar = document.getElementById('reading-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.body.scrollHeight - window.innerHeight;
    bar.style.width = (scrolled / total * 100) + '%';
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', () => {
  initGallery();
  initVariants();
  initQuantity();
  initAddToCart();
  initWishlistBtn();
  initStickyATC();
  initLightbox();
  initScrollProgress();
  updateCurrentVariant();

  // Add to recently viewed
  const id = document.getElementById('product-id')?.value;
  const name = document.getElementById('product-title')?.textContent;
  const price = parseFloat(document.getElementById('product-price')?.dataset.price || 0);
  const image = document.getElementById('main-product-img')?.src;
  if (id && name) RecentlyViewed.add({ id, name, price, image, url: window.location.href });

  // Size guide
  document.getElementById('size-guide-link')?.addEventListener('click', openSizeGuide);
  document.getElementById('size-guide-close')?.addEventListener('click', closeSizeGuide);
  document.querySelector('#size-guide-modal .modal-backdrop')?.addEventListener('click', closeSizeGuide);
});
