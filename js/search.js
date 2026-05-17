'use strict';
// Search functionality with suggestions

const SEARCH_DATA = window.PRODUCTS_DATA || [];

function initSearch() {
  const input = document.getElementById('search-input');
  const suggestions = document.getElementById('search-suggestions');
  if (!input || !suggestions) return;

  let debounce;
  input.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => renderSuggestions(input.value.trim()), 200);
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && input.value.trim()) {
      window.location.href = `/pages/search.html?q=${encodeURIComponent(input.value.trim())}`;
    }
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('#search-bar')) suggestions.classList.remove('active');
  });
}

function renderSuggestions(query) {
  const suggestions = document.getElementById('search-suggestions');
  if (!suggestions) return;
  if (!query || query.length < 2) { suggestions.classList.remove('active'); return; }

  const results = SEARCH_DATA.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.category?.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 6);

  if (!results.length) { suggestions.classList.remove('active'); return; }

  suggestions.innerHTML = results.map(p => `
    <a class="search-suggestion-item" href="${p.url || '/pages/product.html?id='+p.id}">
      <img class="search-suggestion-img" src="${p.images?.[0] || p.image}" alt="${p.name}" loading="lazy">
      <div>
        <div class="search-suggestion-name">${highlight(p.name, query)}</div>
        <div class="search-suggestion-price">${formatPrice(p.price)}</div>
      </div>
    </a>`).join('') +
    `<a class="search-suggestion-item" href="/pages/search.html?q=${encodeURIComponent(query)}" style="justify-content:center;font-size:0.8rem;font-weight:600;color:var(--black)">
      View all results for "${query}" →
    </a>`;

  suggestions.classList.add('active');
}

function highlight(text, query) {
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark style="background:transparent;font-weight:700">$1</mark>');
}

document.addEventListener('DOMContentLoaded', initSearch);
