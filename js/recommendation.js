async function getRelatedProducts(slug, limit) {
  limit = limit || 12;
  var products = window.PRODUCT_METADATA || [];
  var current = products.find(function(p) { return p.slug === slug; });
  if (!current) return [];

  var results = [];
  var sub = current.subcategory || '';

  if (sub.startsWith('uniforms-') && sub !== 'uniforms-accessories') {
    // Same subcategory uniforms
    var same = products.filter(function(p) {
      return p.slug !== slug && p.subcategory === sub;
    }).slice(0, 6);

    // Cross force combat/uniform
    var cross = [];
    if (sub === 'uniforms-crpf') {
      cross = products.filter(function(p) { return p.subcategory === 'uniforms-crpf-combat'; });
    } else if (sub === 'uniforms-crpf-combat') {
      cross = products.filter(function(p) { return p.subcategory === 'uniforms-crpf'; });
    } else if (sub === 'uniforms-ssb') {
      cross = products.filter(function(p) { return p.subcategory === 'uniforms-ssb-combat'; });
    } else if (sub === 'uniforms-ssb-combat') {
      cross = products.filter(function(p) { return p.subcategory === 'uniforms-ssb'; });
    }

    // Force-specific accessories only
    var accessories = products.filter(function(p) {
      return p.subcategory === 'uniforms-accessories' &&
             p.forces && p.forces.indexOf(sub) !== -1;
    });

    var seen = {};
    seen[slug] = true;
    var combined = [];
    same.concat(cross).concat(accessories).forEach(function(p) {
      if (!seen[p.slug]) { seen[p.slug] = true; combined.push(p); }
    });
    results = combined.slice(0, limit);

  } else if (sub === 'uniforms-accessories') {
    // Accessories page - show uniforms that use this accessory + other relevant accessories
    var relatedUniforms = products.filter(function(p) {
      var forces = current.forces || [];
      return p.subcategory && p.subcategory.startsWith('uniforms-') && 
             p.subcategory !== 'uniforms-accessories' &&
             forces.indexOf(p.subcategory) !== -1;
    }).slice(0, 6);
    var otherAcc = products.filter(function(p) {
      return p.slug !== slug && p.subcategory === 'uniforms-accessories' &&
             p.forces && p.forces.some(function(f) {
               return (current.forces || []).indexOf(f) !== -1;
             });
    }).slice(0, 6);
    var seen = {};
    seen[slug] = true;
    var combined = [];
    relatedUniforms.concat(otherAcc).forEach(function(p) {
      if (!seen[p.slug]) { seen[p.slug] = true; combined.push(p); }
    });
    results = combined.slice(0, limit);

  } else {
    // Non-uniform products
    results = products
      .filter(function(p) { return p.slug !== slug && !p.subcategory; })
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
  return results;
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
    return '<div class="product-card" style="opacity:1">' +
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
