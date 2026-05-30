async function getRelatedProducts(slug, limit) {
  limit = limit || 8;
  var res = await fetch('/js/product-metadata.json');
  var products = await res.json();
  var current = products.find(function(p) { return p.slug === slug; });
  if (!current) return [];
  return products
    .filter(function(p) { return p.slug !== slug; })
    .map(function(p) {
      var score = 0;
      if (p.category === current.category) score += 40;
      if (p.color && p.color === current.color) score += 30;
      if (p.fabric && p.fabric === current.fabric) score += 20;
      return Object.assign({}, p, {score: score});
    })
    .sort(function(a,b) { return b.score - a.score; })
    .slice(0, limit);
}
window.getRelatedProducts = getRelatedProducts;

async function initCompleteYourLook(slug) {
  var grid = document.getElementById('complete-your-look-grid');
  if (!grid) return;
  var items = await getRelatedProducts(slug);
  if (!items.length) {
    var sec = document.getElementById('complete-your-look-section');
    if (sec) sec.style.display = 'none';
    return;
  }
  var catalog = [];
  if (typeof ALL_PRODUCTS !== 'undefined') catalog = catalog.concat(ALL_PRODUCTS);
  if (typeof UNIFORM_PRODUCTS !== 'undefined') catalog = catalog.concat(UNIFORM_PRODUCTS);
  var cards = items.map(function(item) {
    var cat = catalog.find(function(p) { return p.url && p.url.includes(item.slug); });
    if (!cat) return '';
    var image = cat.images[0];
    var price = '\u20B9' + Number(cat.price).toLocaleString('en-IN');
    var name = cat.name;
    var url = cat.url.startsWith('/') ? cat.url : '/' + cat.url;
    return '<div class="product-card">' +
      '<a href="' + url + '">' +
      '<div class="product-card-img-wrap">' +
      '<img class="product-card-img" src="' + image + '" alt="' + name + '" loading="lazy">' +
      '</div></a>' +
      '<a href="' + url + '">' +
      '<div class="product-card-info">' +
      '<div class="product-card-name">' + name + '</div>' +
      '<div class="product-card-price"><span class="product-price">' + price + '</span></div>' +
      '</div></a></div>';
  }).filter(Boolean).join('');
  grid.innerHTML = cards;
  if (!cards) {
    var sec = document.getElementById('complete-your-look-section');
    if (sec) sec.style.display = 'none';
  }
}
window.initCompleteYourLook = initCompleteYourLook;
