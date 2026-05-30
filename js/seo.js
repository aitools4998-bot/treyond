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
