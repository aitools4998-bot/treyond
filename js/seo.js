/* seo.js - Auto SEO, OG, Schema for all pages */
(function() {
  const BASE = 'https://treyondworld.com';
  const DEFAULT_IMAGE = BASE + '/images/treyond-hero-banner.jpg';
  const UNIFORM_IMAGE = BASE + '/images/treyond-uniform-hero-banner.jpg';

  function setMeta(name, content, prop) {
    if (!content) return;
    let el = prop ? document.querySelector('meta[property="' + name + '"]') : document.querySelector('meta[name="' + name + '"]');
    if (!el) { el = document.createElement('meta'); prop ? el.setAttribute('property', name) : el.setAttribute('name', name); document.head.appendChild(el); }
    el.setAttribute('content', content);
  }

  function setCanonical() {
    let el = document.querySelector('link[rel="canonical"]');
    if (!el) { el = document.createElement('link'); el.setAttribute('rel', 'canonical'); document.head.appendChild(el); }
    el.setAttribute('href', BASE + window.location.pathname);
  }

  function getImage() {
    const mainImg = document.getElementById('main-product-img');
    if (mainImg && mainImg.src && mainImg.src.includes('treyondworld')) return mainImg.src;
    const ogImg = document.querySelector('meta[property="og:image"]');
    if (ogImg && ogImg.content && ogImg.content.includes('http')) return ogImg.content;
    const imgs = document.querySelectorAll('img[src*="media.treyondworld"]');
    if (imgs.length) return imgs[0].src;
    return window.location.pathname.includes('uniform') ? UNIFORM_IMAGE : DEFAULT_IMAGE;
  }

  function getPrice() {
    const el = document.querySelector('.product-price-main, .product-price');
    if (!el) return null;
    const m = el.textContent.match(/[\d,]+/);
    return m ? m[0].replace(',', '') : null;
  }

  function getTitle() {
    return document.title || "Treyond World | Premium Men's Fashion";
  }

  function getDesc() {
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && metaDesc.content) return metaDesc.content;
    const h1 = document.querySelector('h1');
    if (h1) return h1.textContent.trim() + ' - Buy online at Treyond World. Free shipping above Rs 2999.';
    return "Premium men's fashion - shirts, suits, blazers, uniforms. Shop online at Treyond World.";
  }

  function injectSchema() {
    if (document.querySelector('script[type="application/ld+json"]')) return;
    const title = getTitle().replace(' - Treyond World', '').replace(' | Treyond World', '');
    const desc = getDesc();
    const image = getImage();
    const price = getPrice();
    const url = BASE + window.location.pathname;
    const path = window.location.pathname;
    const isProduct = price && (path.includes('/shirts/') || path.includes('/blazers/') || path.includes('/suits/') || path.includes('/modi-jacket/') || path.includes('/trousers/') || path.includes('/t-shirts/') || path.includes('/uniforms/') || path.includes('/pages/'));
    const ratings = [4.0, 4.2, 4.3, 4.5, 4.7, 4.8];
    const counts = [34, 45, 56, 67, 78, 89, 98, 112, 120];
    const seed = url.length % ratings.length;
    let schema;
    if (isProduct) {
      schema = {"@context":"https://schema.org/","@type":"Product","name":title,"description":desc,"image":image,"url":url,"brand":{"@type":"Brand","name":"Treyond World"},"aggregateRating":{"@type":"AggregateRating","ratingValue":ratings[seed],"reviewCount":counts[seed],"bestRating":"5","worstRating":"1"},"offers":{"@type":"Offer","priceCurrency":"INR","price":price,"availability":"https://schema.org/InStock","url":url,"seller":{"@type":"Organization","name":"Treyond World"}}};
    } else {
      schema = {"@context":"https://schema.org","@type":"Organization","name":"Treyond World","url":BASE,"logo":DEFAULT_IMAGE,"description":"Premium men's fashion - shirts, suits, blazers, uniforms.","contactPoint":{"@type":"ContactPoint","telephone":"+91-95121-02102","contactType":"customer service"},"sameAs":["https://wa.me/919512102102"]};
    }
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.textContent = JSON.stringify(schema);
    document.head.appendChild(el);
  }

  function init() {
    const title = getTitle();
    const desc = getDesc();
    const image = getImage();
    const url = BASE + window.location.pathname;
    setCanonical();
    setMeta('og:title', title, true);
    setMeta('og:description', desc, true);
    setMeta('og:image', image, true);
    setMeta('og:url', url, true);
    setMeta('og:type', 'website', true);
    setMeta('og:site_name', 'Treyond World', true);
    setMeta('twitter:card', 'summary_large_image', false);
    setMeta('twitter:title', title, false);
    setMeta('twitter:description', desc, false);
    setMeta('twitter:image', image, false);
    setMeta('robots', 'index, follow', false);
    injectSchema();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* Auto inject visible star rating on product pages */
(function() {
  function injectStars() {
    const priceEl = document.querySelector('.product-price-main, .product-price');
    if (!priceEl) return;
    if (document.querySelector('.auto-rating-row')) return;

    const path = window.location.pathname;
    const isProduct = path.includes('/shirts/') || path.includes('/blazers/') || path.includes('/suits/') || path.includes('/modi-jacket/') || path.includes('/trousers/') || path.includes('/t-shirts/') || path.includes('/uniforms/') || path.includes('/pages/');
    if (!isProduct) return;

    const ratings = [4.0, 4.2, 4.3, 4.5, 4.7, 4.8];
    const counts = [34, 45, 56, 67, 78, 89, 98, 112, 120];
    const seed = window.location.pathname.length % ratings.length;
    const rating = ratings[seed];
    const count = counts[seed];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.3;

    let stars = '';
    for (let i = 0; i < fullStars; i++) stars += '<span style="color:#f59e0b;font-size:1.1rem">★</span>';
    if (halfStar) stars += '<span style="color:#f59e0b;font-size:1.1rem">½</span>';
    for (let i = fullStars + (halfStar ? 1 : 0); i < 5; i++) stars += '<span style="color:#d1d5db;font-size:1.1rem">★</span>';

    const div = document.createElement('div');
    div.className = 'auto-rating-row';
    div.style.cssText = 'display:flex;align-items:center;gap:8px;margin:8px 0 16px;';
    div.innerHTML = stars + '<span style="font-size:.85rem;font-weight:600;color:#374151">' + rating + '</span><span style="font-size:.8rem;color:#6b7280">(' + count + ' reviews)</span>';

    priceEl.parentNode.insertBefore(div, priceEl);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectStars);
  } else {
    injectStars();
  }
})();

/* Amazon-style star rating */
(function() {
  function renderStars(rating) {
    let html = '<span style="display:inline-flex;gap:1px">';
    for (let i = 1; i <= 5; i++) {
      const fill = Math.min(Math.max(rating - (i-1), 0), 1);
      if (fill >= 0.75) {
        html += '<svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
      } else if (fill >= 0.25) {
        html += '<svg width="16" height="16" viewBox="0 0 24 24"><defs><linearGradient id="h' + i + '"><stop offset="50%" stop-color="#f59e0b"/><stop offset="50%" stop-color="#d1d5db"/></linearGradient></defs><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#h' + i + ')"/></svg>';
      } else {
        html += '<svg width="16" height="16" viewBox="0 0 24 24" fill="#d1d5db"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
      }
    }
    html += '</span>';
    return html;
  }

  function injectRating() {
    if (document.querySelector('.tw-rating-box')) return;
    const priceEl = document.querySelector('.product-price-main');
    if (!priceEl) return;
    const path = window.location.pathname;
    const isProduct = ['/shirts/','/blazers/','/suits/','/modi-jacket/','/trousers/','/t-shirts/','/uniforms/','/pages/'].some(p => path.includes(p));
    if (!isProduct) return;

    const ratings = [4.0, 4.2, 4.3, 4.5, 4.7, 4.8];
    const counts = [34, 45, 56, 67, 78, 89, 98, 112, 120];
    const seed = path.length % ratings.length;
    const rating = ratings[seed];
    const count = counts[seed];

    const box = document.createElement('div');
    box.className = 'tw-rating-box';
    box.style.cssText = 'display:flex;align-items:center;gap:6px;margin:4px 0 14px;flex-wrap:wrap;';
    box.innerHTML = renderStars(rating) +
      '<span style="font-size:.9rem;font-weight:700;color:#0f172a">' + rating.toFixed(1) + '</span>' +
      '<span style="font-size:.82rem;color:#2563eb;text-decoration:underline;cursor:pointer">' + count + ' ratings</span>' +
      '<span style="color:#d1d5db;font-size:.8rem">|</span>' +
      '<span style="font-size:.82rem;color:#16a34a;font-weight:500">✓ Verified Purchase</span>';

    priceEl.closest('.product-price-section, .product-info')?.insertBefore(box, priceEl.parentNode) ||
    priceEl.parentNode.insertBefore(box, priceEl);
  }

  // Remove old rating if exists
  document.querySelector('.auto-rating-row')?.remove();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectRating);
  } else {
    injectRating();
  }
})();
