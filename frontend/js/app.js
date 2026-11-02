/**
 * AuraTech E-Commerce - Frontend Application Logic
 * Part 1: Product Listing Website
 */

(function () {
  'use strict';

  // Application State
  const state = {
    filters: {
      search: '',
      category: 'all',
      minPrice: '',
      maxPrice: '',
      inStock: false,
      sortBy: 'featured'
    },
    categories: [],
    products: [],
    totalProducts: 0,
    cartCount: 0,
    activeProductId: null,
    debounceTimer: null
  };

  // DOM Elements
  const elements = {
    searchInput: document.getElementById('search-input'),
    searchClearBtn: document.getElementById('search-clear-btn'),
    categoryList: document.getElementById('category-list'),
    totalProductCount: document.getElementById('total-product-count'),
    minPriceInput: document.getElementById('min-price-input'),
    maxPriceInput: document.getElementById('max-price-input'),
    priceSlider: document.getElementById('price-slider'),
    sliderMaxLabel: document.getElementById('slider-max-label'),
    stockCheckbox: document.getElementById('stock-checkbox'),
    sortSelect: document.getElementById('sort-select'),
    resetFiltersBtn: document.getElementById('reset-filters-btn'),
    resultsCount: document.getElementById('results-count'),
    activeFilterChips: document.getElementById('active-filter-chips'),
    productsGrid: document.getElementById('products-grid'),
    productModal: document.getElementById('product-modal'),
    modalDetailsContainer: document.getElementById('modal-details-container'),
    modalCloseBtn: document.getElementById('modal-close-btn'),
    cartBtn: document.getElementById('cart-btn'),
    cartCounter: document.getElementById('cart-counter'),
    toastContainer: document.getElementById('toast-container'),
    brandLink: document.getElementById('brand-link')
  };

  // ------------------------------------------------------------------
  // 1. Initialization
  // ------------------------------------------------------------------
  async function init() {
    setupEventListeners();
    await loadCategories();
    parseUrlState();
    await fetchProducts();

    // Check if initial URL points to a specific product
    checkInitialHash();
  }

  // ------------------------------------------------------------------
  // 2. Event Listeners
  // ------------------------------------------------------------------
  function setupEventListeners() {
    // Search input with debounce
    elements.searchInput.addEventListener('input', (e) => {
      const value = e.target.value.trim();
      elements.searchClearBtn.style.display = value ? 'block' : 'none';

      clearTimeout(state.debounceTimer);
      state.debounceTimer = setTimeout(() => {
        state.filters.search = value;
        fetchProducts();
      }, 300);
    });

    // Clear search button
    elements.searchClearBtn.addEventListener('click', () => {
      elements.searchInput.value = '';
      elements.searchClearBtn.style.display = 'none';
      state.filters.search = '';
      fetchProducts();
    });

    // Sort select
    elements.sortSelect.addEventListener('change', (e) => {
      state.filters.sortBy = e.target.value;
      fetchProducts();
    });

    // Price slider
    elements.priceSlider.addEventListener('input', (e) => {
      const val = e.target.value;
      elements.maxPriceInput.value = val;
      elements.sliderMaxLabel.textContent = `Up to $${parseInt(val, 10).toLocaleString()}`;
      state.filters.maxPrice = val;

      clearTimeout(state.debounceTimer);
      state.debounceTimer = setTimeout(() => {
        fetchProducts();
      }, 300);
    });

    // Price inputs
    elements.minPriceInput.addEventListener('change', (e) => {
      state.filters.minPrice = e.target.value;
      fetchProducts();
    });

    elements.maxPriceInput.addEventListener('change', (e) => {
      state.filters.maxPrice = e.target.value;
      if (e.target.value) {
        elements.priceSlider.value = e.target.value;
        elements.sliderMaxLabel.textContent = `Up to $${parseInt(e.target.value, 10).toLocaleString()}`;
      }
      fetchProducts();
    });

    // In-stock checkbox
    elements.stockCheckbox.addEventListener('change', (e) => {
      state.filters.inStock = e.target.checked;
      fetchProducts();
    });

    // Reset filters button
    elements.resetFiltersBtn.addEventListener('click', resetAllFilters);

    // Brand link: resets filters and scrolls top
    elements.brandLink.addEventListener('click', (e) => {
      e.preventDefault();
      resetAllFilters();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Modal close button
    elements.modalCloseBtn.addEventListener('click', closeModal);

    // Modal backdrop click
    elements.productModal.addEventListener('click', (e) => {
      if (e.target === elements.productModal) {
        closeModal();
      }
    });

    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && elements.productModal.classList.contains('open')) {
        closeModal();
      }
    });

    // Hash change routing
    window.addEventListener('hashchange', () => {
      checkInitialHash();
    });

    // Cart button teaser
    elements.cartBtn.addEventListener('click', () => {
      showToast(`Shopping Cart contains ${state.cartCount} items (Cart checkout is Part 2 feature).`, 'info');
    });
  }

  // ------------------------------------------------------------------
  // 3. API Communication & Data Loading
  // ------------------------------------------------------------------
  async function loadCategories() {
    try {
      const categories = await window.api.getCategories();
      state.categories = categories;

      let totalCount = 0;
      categories.forEach(c => totalCount += c.product_count);
      elements.totalProductCount.textContent = totalCount;

      renderCategoryList(categories);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  }

  async function fetchProducts() {
    renderLoading();
    renderFilterChips();

    try {
      const res = await window.api.getProducts(state.filters);
      state.products = res.data || [];
      state.totalProducts = res.total || 0;

      elements.resultsCount.textContent = state.products.length;
      renderProductsGrid(state.products);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      renderError(err.message || 'Error communicating with backend database.');
      showToast(err.message || 'Error fetching products from server', 'error');
    }
  }

  // ------------------------------------------------------------------
  // 4. DOM Rendering
  // ------------------------------------------------------------------
  function renderCategoryList(categories) {
    const items = categories.map(cat => `
      <li class="category-item ${state.filters.category === cat.slug ? 'active' : ''}" data-category="${escapeHtml(cat.slug)}">
        <span>${escapeHtml(cat.name)}</span>
        <span class="category-count">${cat.product_count}</span>
      </li>
    `).join('');

    elements.categoryList.innerHTML = `
      <li class="category-item ${state.filters.category === 'all' ? 'active' : ''}" data-category="all">
        <span>All Products</span>
        <span class="category-count">${elements.totalProductCount.textContent}</span>
      </li>
      ${items}
    `;

    // Category click handler
    elements.categoryList.querySelectorAll('.category-item').forEach(el => {
      el.addEventListener('click', () => {
        elements.categoryList.querySelectorAll('.category-item').forEach(c => c.classList.remove('active'));
        el.classList.add('active');

        state.filters.category = el.getAttribute('data-category');
        fetchProducts();
      });
    });
  }

  function renderLoading() {
    elements.productsGrid.innerHTML = `
      <div class="loading-container">
        <div class="spinner"></div>
        <p style="color: var(--gray-500); font-size: 0.9rem;">Querying database catalogue...</p>
      </div>
    `;
  }

  function renderError(message) {
    elements.productsGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon" style="color: var(--danger); background: #fee2e2;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h3 class="empty-title">Database Error</h3>
        <p class="empty-desc">${escapeHtml(message)}</p>
        <button class="btn-details" onclick="window.location.reload()">Retry Connection</button>
      </div>
    `;
  }

  function renderProductsGrid(products) {
    if (!products || products.length === 0) {
      elements.productsGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
          </div>
          <h3 class="empty-title">No products match your criteria</h3>
          <p class="empty-desc">Try loosening your search terms, increasing your price range, or clearing filters.</p>
          <button class="btn-details" id="empty-reset-btn">Reset All Filters</button>
        </div>
      `;
      const btn = document.getElementById('empty-reset-btn');
      if (btn) btn.addEventListener('click', resetAllFilters);
      return;
    }

    elements.productsGrid.innerHTML = products.map(product => {
      const hasDiscount = product.original_price && product.original_price > product.price;
      const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 10;
      const stockBadge = product.stock_quantity > 0
        ? (isLowStock
            ? `<span class="card-stock-badge badge-low-stock">Only ${product.stock_quantity} left</span>`
            : `<span class="card-stock-badge badge-in-stock">In Stock</span>`)
        : `<span class="card-stock-badge" style="background: var(--danger); color: white;">Out of Stock</span>`;

      return `
        <article class="product-card" data-id="${product.id}">
          <div class="product-card-image-wrapper">
            <img
              class="product-card-image"
              src="${escapeHtml(product.image_url)}"
              alt="${escapeHtml(product.name)}"
              loading="lazy"
              onerror="this.src='https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'"
            />
            <span class="card-category-badge">${escapeHtml(product.category_name)}</span>
            ${stockBadge}
          </div>

          <div class="product-card-body">
            <div class="card-rating">
              <span class="stars">${renderStars(product.rating)}</span>
              <strong>${product.rating.toFixed(1)}</strong>
              <span class="review-count">(${product.review_count})</span>
            </div>

            <h3 class="product-card-title" title="${escapeHtml(product.name)}" data-action="view-details" data-id="${product.id}">
              ${escapeHtml(product.name)}
            </h3>

            <p class="product-card-description">
              ${escapeHtml(product.description)}
            </p>

            <div class="product-card-footer">
              <div class="price-box">
                <span class="current-price">$${formatMoney(product.price)}</span>
                ${hasDiscount ? `<span class="original-price">$${formatMoney(product.original_price)}</span>` : ''}
              </div>

              <div class="card-actions">
                <button class="btn-details" data-action="view-details" data-id="${product.id}" title="View detailed specs">
                  <span>Details</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </button>
                <button class="btn-quick-cart" data-action="quick-cart" data-id="${product.id}" data-name="${escapeHtml(product.name)}" title="Add to cart">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach card event listeners
    elements.productsGrid.querySelectorAll('[data-action="view-details"]').forEach(el => {
      el.addEventListener('click', (e) => {
        const id = el.getAttribute('data-id');
        openProductDetails(id);
      });
    });

    elements.productsGrid.querySelectorAll('[data-action="quick-cart"]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const name = el.getAttribute('data-name');
        addToCart(name);
      });
    });
  }

  function renderFilterChips() {
    const chips = [];

    if (state.filters.search) {
      chips.push({
        label: `Search: "${state.filters.search}"`,
        clear: () => {
          elements.searchInput.value = '';
          elements.searchClearBtn.style.display = 'none';
          state.filters.search = '';
          fetchProducts();
        }
      });
    }

    if (state.filters.category && state.filters.category !== 'all') {
      const cat = state.categories.find(c => c.slug === state.filters.category);
      chips.push({
        label: `Category: ${cat ? cat.name : state.filters.category}`,
        clear: () => {
          state.filters.category = 'all';
          elements.categoryList.querySelectorAll('.category-item').forEach(c => {
            c.classList.toggle('active', c.getAttribute('data-category') === 'all');
          });
          fetchProducts();
        }
      });
    }

    if (state.filters.minPrice) {
      chips.push({
        label: `Min: $${state.filters.minPrice}`,
        clear: () => {
          elements.minPriceInput.value = '';
          state.filters.minPrice = '';
          fetchProducts();
        }
      });
    }

    if (state.filters.maxPrice) {
      chips.push({
        label: `Max: $${state.filters.maxPrice}`,
        clear: () => {
          elements.maxPriceInput.value = '';
          elements.priceSlider.value = 2000;
          elements.sliderMaxLabel.textContent = 'Up to $2,000';
          state.filters.maxPrice = '';
          fetchProducts();
        }
      });
    }

    if (state.filters.inStock) {
      chips.push({
        label: `In Stock Only`,
        clear: () => {
          elements.stockCheckbox.checked = false;
          state.filters.inStock = false;
          fetchProducts();
        }
      });
    }

    elements.activeFilterChips.innerHTML = chips.map((chip, idx) => `
      <span class="filter-chip">
        ${escapeHtml(chip.label)}
        <button class="chip-remove-btn" data-chip-idx="${idx}" title="Remove filter">✕</button>
      </span>
    `).join('');

    elements.activeFilterChips.querySelectorAll('.chip-remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-chip-idx'), 10);
        if (chips[idx] && chips[idx].clear) {
          chips[idx].clear();
        }
      });
    });
  }

  // ------------------------------------------------------------------
  // 5. Product Details Modal & View
  // ------------------------------------------------------------------
  async function openProductDetails(id) {
    state.activeProductId = id;
    window.location.hash = `#/product/${id}`;

    elements.productModal.classList.add('open');
    elements.modalDetailsContainer.innerHTML = `
      <div class="loading-container">
        <div class="spinner"></div>
        <p style="color: var(--gray-500);">Retrieving product specifications from database...</p>
      </div>
    `;

    try {
      const product = await window.api.getProductById(id);
      renderModalDetails(product);
    } catch (err) {
      elements.modalDetailsContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon" style="color: var(--danger);">✕</div>
          <h3 class="empty-title">Product Details Unavailable</h3>
          <p class="empty-desc">${escapeHtml(err.message)}</p>
          <button class="btn-details" onclick="window.history.back()">Back to Listing</button>
        </div>
      `;
    }
  }

  function renderModalDetails(product) {
    const hasDiscount = product.original_price && product.original_price > product.price;
    const discountPct = hasDiscount
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : 0;

    const specsHtml = product.specifications && product.specifications.length > 0
      ? `
        <div class="specs-section">
          <h4 class="specs-heading">Technical Specifications (Relational SQL Data)</h4>
          <table class="specs-table">
            <tbody>
              ${product.specifications.map(s => `
                <tr>
                  <td class="specs-key">${escapeHtml(s.spec_name)}</td>
                  <td class="specs-value">${escapeHtml(s.spec_value)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `
      : '';

    elements.modalDetailsContainer.innerHTML = `
      <!-- Breadcrumbs -->
      <nav class="breadcrumbs">
        <a href="#" id="modal-breadcrumb-home">Store</a>
        <span>/</span>
        <a href="#" id="modal-breadcrumb-cat">${escapeHtml(product.category_name)}</a>
        <span>/</span>
        <span style="color: var(--gray-800); font-weight: 500;">${escapeHtml(product.name)}</span>
      </nav>

      <div class="details-grid">
        <!-- Media Column -->
        <div class="details-media">
          <div class="details-main-image-box">
            <img class="details-main-image" src="${escapeHtml(product.image_url)}" alt="${escapeHtml(product.name)}" />
          </div>
        </div>

        <!-- Info Column -->
        <div class="details-info">
          <span class="details-category-pill">${escapeHtml(product.category_name)}</span>
          <h2 class="details-title">${escapeHtml(product.name)}</h2>

          <div class="details-meta">
            <div class="card-rating">
              <span class="stars">${renderStars(product.rating)}</span>
              <strong>${product.rating.toFixed(1)}</strong>
              <span class="review-count">(${product.review_count} verified reviews)</span>
            </div>
            <span class="details-sku">SKU: PROD-${String(product.id).padStart(4, '0')}</span>
          </div>

          <div class="details-price-row">
            <span class="details-current-price">$${formatMoney(product.price)}</span>
            ${hasDiscount ? `
              <span class="details-original-price">$${formatMoney(product.original_price)}</span>
              <span class="details-discount-pill">Save ${discountPct}% ($${formatMoney(product.original_price - product.price)})</span>
            ` : ''}
          </div>

          <div class="details-stock-status">
            ${product.stock_quantity > 0
              ? `<span style="color: var(--success);">● In Stock</span> <span style="color: var(--gray-400); font-weight: 400;">(${product.stock_quantity} units available)</span>`
              : `<span style="color: var(--danger);">● Currently Out of Stock</span>`}
          </div>

          <h4 class="details-desc-heading">Overview</h4>
          <p class="details-description">${escapeHtml(product.description)}</p>

          <!-- Specifications Table -->
          ${specsHtml}

          <!-- Purchase Controls -->
          <div class="purchase-row">
            <div class="quantity-picker">
              <button class="qty-btn" id="qty-minus" aria-label="Decrease quantity">−</button>
              <span class="qty-val" id="qty-val">1</span>
              <button class="qty-btn" id="qty-plus" aria-label="Increase quantity">+</button>
            </div>

            <button class="btn-add-cart-large" id="modal-add-cart-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
              </svg>
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    `;

    // Quantity Picker Logic
    let qty = 1;
    const qtyVal = document.getElementById('qty-val');
    document.getElementById('qty-minus').addEventListener('click', () => {
      if (qty > 1) {
        qty--;
        qtyVal.textContent = qty;
      }
    });
    document.getElementById('qty-plus').addEventListener('click', () => {
      if (qty < product.stock_quantity) {
        qty++;
        qtyVal.textContent = qty;
      }
    });

    // Add to Cart
    document.getElementById('modal-add-cart-btn').addEventListener('click', () => {
      addToCart(product.name, qty);
    });

    // Breadcrumb clicks
    document.getElementById('modal-breadcrumb-home').addEventListener('click', (e) => {
      e.preventDefault();
      closeModal();
    });
    document.getElementById('modal-breadcrumb-cat').addEventListener('click', (e) => {
      e.preventDefault();
      closeModal();
      state.filters.category = product.category_slug;
      elements.categoryList.querySelectorAll('.category-item').forEach(c => {
        c.classList.toggle('active', c.getAttribute('data-category') === product.category_slug);
      });
      fetchProducts();
    });
  }

  function closeModal() {
    elements.productModal.classList.remove('open');
    state.activeProductId = null;
    if (window.location.hash.startsWith('#/product/')) {
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  }

  function checkInitialHash() {
    const hash = window.location.hash;
    const match = hash.match(/^#\/product\/(\d+)$/);
    if (match) {
      openProductDetails(match[1]);
    } else if (elements.productModal.classList.contains('open')) {
      closeModal();
    }
  }

  function parseUrlState() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('search')) {
      state.filters.search = params.get('search');
      elements.searchInput.value = state.filters.search;
      elements.searchClearBtn.style.display = 'block';
    }
    if (params.get('category')) {
      state.filters.category = params.get('category');
    }
    if (params.get('sortBy')) {
      state.filters.sortBy = params.get('sortBy');
      elements.sortSelect.value = state.filters.sortBy;
    }
  }

  // ------------------------------------------------------------------
  // 6. Helpers & Cart Preview
  // ------------------------------------------------------------------
  function addToCart(productName, quantity = 1) {
    state.cartCount += quantity;
    elements.cartCounter.textContent = state.cartCount;
    showToast(`Added ${quantity > 1 ? `${quantity}x ` : ''}"${productName}" to shopping cart!`, 'success');
  }

  function resetAllFilters() {
    state.filters = {
      search: '',
      category: 'all',
      minPrice: '',
      maxPrice: '',
      inStock: false,
      sortBy: 'featured'
    };

    elements.searchInput.value = '';
    elements.searchClearBtn.style.display = 'none';
    elements.minPriceInput.value = '';
    elements.maxPriceInput.value = '';
    elements.priceSlider.value = 2000;
    elements.sliderMaxLabel.textContent = 'Up to $2,000';
    elements.stockCheckbox.checked = false;
    elements.sortSelect.value = 'featured';

    elements.categoryList.querySelectorAll('.category-item').forEach(c => {
      c.classList.toggle('active', c.getAttribute('data-category') === 'all');
    });

    fetchProducts();
    showToast('All filters have been reset.', 'info');
  }

  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span>${escapeHtml(message)}</span>
    `;
    elements.toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
  }

  function formatMoney(amount) {
    return Number(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Boot application
  document.addEventListener('DOMContentLoaded', init);
})();
