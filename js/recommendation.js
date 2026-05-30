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

document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('recommendation-grid');
  if (!grid) return;

  const items = await getRelatedProducts(
    'mens-blue-check-with-wool-rich-modi-jacket'
  );

  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
  grid.style.gap = '20px';
  grid.style.marginTop = '20px';

  grid.innerHTML = items.map(item => `
    <a href="/${item.file.replace('.html','')}"
       style="text-decoration:none;color:inherit;border:1px solid #eee;padding:12px;display:block;">
      <div style="font-size:12px;color:#777;">${item.category}</div>
      <div style="font-weight:600;margin-top:8px;">
        ${item.slug.replace(/-/g,' ')}
      </div>
      <div style="margin-top:8px;font-size:12px;">
        Score: ${item.score}
      </div>
    </a>
  `).join('');
});
