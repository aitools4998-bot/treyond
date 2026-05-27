/* category.js */
'use strict';

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const PER_PAGE = 20;
let isLoading = false;
let allLoaded = false;

function loadCategoryProducts() {
  allProducts = window.CATEGORY_PRODUCTS || [];
  const params = new URLSearchParams(window.location.search);
  const catParam = params.get('cat');
  if (catParam) {
    const opt = document.querySelector(`.filter-option[data-category="${catParam}"]`);
    if (opt) opt.classList.add('checked');
  }
  applyFilters();
}

function applyFilters() {
  const checkedSizes = [...document.querySelectorAll('.filter-option[data-size].checked')].map(e => e.dataset.size);
  const checkedColors = [...document.querySelectorAll('.filter-option[data-color].checked')].map(e => e.dataset.color);
  const checkedCategories = [...document.querySelectorAll('.filter-option[data-category].checked')].map(e => e.dataset.category);
  const minPrice = parseFloat(document.getElementById('price-min')?.value || 0);
  const maxPrice = parseFloat(document.getElementById('price-max')?.value || Infinity);
  const sortVal = document.getElementById('sort-select')?.value || 'featured';

  filteredProducts = allProducts.filter(p => {
    if (checkedSizes.length && !checkedSizes.some(s => p.sizes?.includes(s))) return false;
    if (checkedColors.length && !checkedColors.some(c => p.colors?.includes(c))) return false;
    if (checkedCategories.length && !checkedCategories.includes(p.category)) return false;
    if (p.price < minPrice || p.price > maxPrice) return false;
    return true;
  });

  if (sortVal === 'price-asc') filteredProducts.sort((a,b) => a.price - b.price);
  else if (sortVal === 'price-desc') filteredProducts.sort((a,b) => b.price - a.price);
  else if (sortVal === 'newest') filteredProducts.sort((a,b) => (b.date||0) - (a.date||0));
  else if (sortVal === 'az') filteredProducts.sort((a,b) => a.name.localeCompare(b.name));

  currentPage = 1;
  allLoaded = false;
  const grid = document.getElementById('products-grid');
  if (grid) grid.innerHTML = '';
  renderProducts();
  updateResultsCount();
  renderActiveFilters();
}

function renderProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  const start = (currentPage - 1) * PER_PAGE;
  const page = filteredProducts.slice(start, start + PER_PAGE);

  if (currentPage === 1 && page.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--gray-400)"><p style="font-size:1.1rem;margin-bottom:12px">No products found</p><button onclick="clearAllFilters()" class="btn btn-outline btn-sm">Clear Filters</button></div>`;
    allLoaded = true;
    return;
  }

  if (page.length === 0) { allLoaded = true; return; }

  const isListView = grid.classList.contains('list-view');
  const html = page.map(p => `
    <div class="product-card reveal ${isListView ? 'list-card' : ''}">
      <a href="${p.url || '/pages/product.html?id='+p.id}">
        <div class="product-card-img-wrap">
          <img class="product-card-img" src="${p.images?.[0] || p.image}" alt="${p.name}" loading="lazy">
          ${p.badge ? `<div class="product-card-badges"><span class="badge">${p.badge}</span></div>` : ''}
          <div class="product-card-actions">
            <button class="product-action-btn" onclick="event.preventDefault();Wishlist.toggle('${p.id}')" title="Wishlist"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg></button>
            <button class="product-action-btn" onclick="event.preventDefault();openQuickView('${p.id}')" title="Quick View"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg></button>
          </div>
          <button class="product-card-quick" onclick="event.preventDefault();Cart.add({id:'${p.id}',name:'${p.name}',price:${p.price},image:'${p.images?.[0]||p.image}',variant:'Default'})">Quick Add</button>
        </div>
      </a>
      <a href="${p.url || '/pages/product.html?id='+p.id}">
        <div class="product-card-info">
          <div class="product-card-name">${p.name}</div>
          <div class="product-card-price"><span class="product-price">${formatPrice(p.price)}</span>${p.originalPrice ? `<span class="product-price-original">${formatPrice(p.originalPrice)}</span>` : ''}</div>
        </div>
      </a>
    </div>`).join('');

  grid.insertAdjacentHTML('beforeend', html);
  if (start + PER_PAGE >= filteredProducts.length) allLoaded = true;
  initScrollReveal();
  isLoading = false;
}

function initInfiniteScroll() {
  window.addEventListener('scroll', () => {
    if (isLoading || allLoaded) return;
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
      isLoading = true;
      currentPage++;
      renderProducts();
    }
  });
}

function updateResultsCount() {
  const el = document.getElementById('results-count');
  if (el) el.textContent = `${filteredProducts.length} ${filteredProducts.length === 1 ? 'product' : 'products'}`;
}

function renderActiveFilters() {
  const container = document.getElementById('active-filters');
  if (!container) return;
  const active = document.querySelectorAll('.filter-option.checked');
  container.innerHTML = [...active].map(el => `<span class="active-filter">${el.querySelector('span:not(.filter-checkbox):not(.filter-count)')?.textContent?.trim() || el.textContent?.trim()}<span class="active-filter-remove" onclick="removeFilter(this.parentElement)">×</span></span>`).join('');
}

function remoeFilter(el) { el.remove(); applyFilters(); }

function clearAllFilters() {
  document.querySelectorAll('.filter-option.checked').forEach(el => el.classList.remove('checked'));
  document.getElementById('price-min') && (document.getElementById('price-min').value = '');
  document.getElementById('price-max') && (document.getElementById('price-max').value = '');
  applyFilters();
}

function initViewToggle() {
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const grid = document.getElementById('products-grid');
      grid?.classList.toggle('list-view', btn.dataset.view === 'list');
      currentPage = 1; allLoaded = false;
      if (grid) grid.innerHTML = '';
      renderProducts();
    });
  });
}

function initCategorySearch() {
  const input = document.getElementById('category-search');
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    filteredProducts = allProducts.filter(p => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
    currentPage = 1; allLoaded = false;
    const grid = document.getElementById('products-grid');
    if (grid) grid.innerHTML = '';
    renderProducts();
    updateResultsCount();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadCategoryProducts();
  initViewToggle();
  initCategorySearch();
  initInfiniteScroll();
  document.getElementById('sort-select')?.addEventListener('change', applyFilters);
  document.querySelectorAll('.filter-option').forEach(opt => opt.addEventListener('click', () => setTimeout(applyFilters, 10)));
  document.getElementById('filter-clear')?.addEventListener('click', clearAllFilters);
});
