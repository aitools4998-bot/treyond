async function getRelatedProducts(slug, limit = 8) {
  const res = await fetch('/js/product-metadata.json');
  const products = await res.json();
  const current = products.find(p => p.slug === slug);
  if (!current) return [];
  return products
    .filter(p => p.slug !== slug)
    .map(p => {
      let score = 0;
      if (p.category === current.category) score += 40;
      if (p.color && p.color === current.color) score += 30;
      if (p.fabric && p.fabric === current.fabric) score += 20;
      return { ...p, score };
    })
    .sort((a,b) => b.score - a.score)
    .slice(0, limit);
}
window.getRelatedProducts = getRelatedProducts;

async function initCompleteYourLook(slug) {
  const grid = document.getElementById('complete-your-look-grid');
  if (!grid) return;
  const items = await getRelatedProducts(slug);
  if (!items.length) {
    const sec = document.getElementById('complete-your-look-section');
    if (sec) sec.style.display = 'none';
    return;
  }
  const catalog = []
    .concat(typeof ALL_PRODUCTS !== 'undefined' ? ALL_PRODUCTS : [])
    .concat(typeof UNIFORM_PRODUCTS !== 'undefined' ? UNIFORM_PRODUCTS : []);
  grid.innerHTML = items.map(item => {
    const cat = catalog.find(p => p.url && p.url.includes(item.slug));
    const image = cat ? cat.images[0] : '';
    const price = cat ? '₹' + Number(cat.price).toLocaleString('en-IN') : '';
    const name = cat ? cat.name : item.slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const url = '/' + item.file.replace('.html', '');
    if (!image) return '';
    return `
      <div class="product-card reveal">
        <a href="${url}">
          <div class="product-card-img-wrap">
            <img class="product-card-img" src="${image}" alt="${name}" loading="lazy">
          </div>
        </a>
        <a href="${url}">
          <div class="product-card-info">
            <div class="product-card-name">${name}</div>
            <div class="product-card-price"><span ass="product-price">${price}</span></div>
          </div>
        </a>
      </div>`;
  }).filter(Boolean).join('');
  if (!grid.innerHTML.trim()) {
    const sec = document.getElementById('complete-your-look-section');
    if (sec) sec.style.display = 'none';
  }
}
