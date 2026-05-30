async function getRelatedProducts(slug, limit = 8) {
  const res = await fetch('/js/product-metadata.json');
  const products = await res.json();

  const current = products.find(p => p.slug === slug);
  if (!current) return [];

  const scored = products
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

  return scored;
}

window.getRelatedProducts = getRelatedProducts;
console.log('Recommendation engine loaded');
