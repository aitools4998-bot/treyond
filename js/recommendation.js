async function getRelatedProducts(slug, limit) {
  limit = limit || 8;
  var res = await fetch('/js/product-metadata.json');
  var products = await res.json();
  var current = products.find(function(p) { return p.slug === slug; });
  if (!current) return [];

  var results = [];
  var sub = current.subcategory || '';

  if (sub.startsWith('uniforms-')) {
    // Same subcategory products
    var same = products.filter(function(p) {
      return p.slug !== slug && p.subcategory === sub;
    });

    // Cross show: uniform <-> combat of same force
    var cross = [];
    if (sub === 'uniforms-bsf') {
      // BSF: show other BSF + accessories
      cross = products.filter(function(p) {
        return p.subcategory === 'uniforms-accessories';
      });
    } else if (sub === 'uniforms-crpf') {
      cross = products.filter(function(p) {
        return p.subcategory === 'uniforms-crpf-combat' || p.subcategory === 'uniforms-accessories';
      });
    } else if (sub === 'uniforms-crpf-combat') {
      cross = products.filter(function(p) {
        return p.subcategory === 'uniforms-crpf' || p.subcategory === 'uniforms-accessories';
      });
    } else if (sub === 'uniforms-ssb') {
      cross = products.filter(function(p) {
        return p.subcategory === 'uniforms-ssb-combat' || p.subcategory === 'uniforms-accessories';
      });
    } else if (sub === 'uniforms-ssb-combat') {
      cross = products.filter(function(p) {
        return p.subcategory === 'uniforms-ssb' || p.subcategory === 'uniforms-accessories';
      });
    } else if (sub === 'uniforms-police') {
      cross = products.filter(function(p) {
        return p.subcategory === 'uniforms-accessories';
      });
    } else if (sub === 'uniforms-accessories') {
      // Accessories - show all uniform subcategories
      cross = products.filter(function(p) {
        return p.subcategory && p.subcategory.startsWith('uniforms-') && p.subcategory !== 'uniforms-accessories';
      }).slice(0, 4);
    }

    // Combine: same first, then cross, deduplicate
    var seen = {};
    seen[slug] = true;
    var combined = [];
    same.concat(cross).forEach(function(p) {
      if (!seen[p.slug]) {
        seen[p.slug] = true;
        combined.push(p);
      }
    });
    results = combined.slice(0, limit);

  } else {
    // Non-uniform: score by category + color + fabric
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
