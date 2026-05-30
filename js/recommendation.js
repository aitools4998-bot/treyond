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

  const cards = items.map(item => {
    const cat = catalog.find(p => p.url && p.url.includes(item.slug));
    if (!cat) return '';
    const image = cat.images[0];
    const price = '₹' + Number(cat.price).toLocaleString('en-IN');
    const name = cat.name;
    const url = cat.url.startsWith('/') ? cat.url : '/' + cat.url;
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
            <div class="product-card-price"><span class="product-price">${price}</span></div>
          </div>
        </a>
      </div>`; }).filter(Boolean).join('');

  grid.innerHTML = cards;

  if (!cards) {
    const sec = document.getElementById('complete-your-look-section');
    if (sec) sec.style.display = 'none';
  }
}
window.initCompleteYourLook = initCompleteYourLook;
