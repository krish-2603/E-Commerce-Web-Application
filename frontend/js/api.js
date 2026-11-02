/**
 * API Service Client
 * Handles communication with the backend REST endpoints.
 */

const API_BASE = '/api';

const api = {
  /**
   * Fetch all categories with product counts
   */
  async getCategories() {
    try {
      const response = await fetch(`${API_BASE}/categories`);
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }
      const data = await response.json();
      return data.data || [];
    } catch (err) {
      console.error('[API] getCategories error:', err);
      throw err;
    }
  },

  /**
   * Fetch product catalogue with optional filters
   * @param {Object} params
   */
  async getProducts(params = {}) {
    try {
      const query = new URLSearchParams();

      if (params.search) query.append('search', params.search);
      if (params.category && params.category !== 'all') query.append('category', params.category);
      if (params.minPrice !== undefined && params.minPrice !== '') query.append('minPrice', params.minPrice);
      if (params.maxPrice !== undefined && params.maxPrice !== '') query.append('maxPrice', params.maxPrice);
      if (params.inStock) query.append('inStock', 'true');
      if (params.sortBy) query.append('sortBy', params.sortBy);
      if (params.page) query.append('page', params.page);
      if (params.limit) query.append('limit', params.limit);

      const url = `${API_BASE}/products${query.toString() ? `?${query.toString()}` : ''}`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to fetch products`);
      }

      return await response.json();
    } catch (err) {
      console.error('[API] getProducts error:', err);
      throw err;
    }
  },

  /**
   * Fetch individual product details by ID (including relational specs)
   * @param {number|string} id
   */
  async getProductById(id) {
    try {
      const response = await fetch(`${API_BASE}/products/${id}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Product not found (HTTP ${response.status})`);
      }
      const data = await response.json();
      return data.data;
    } catch (err) {
      console.error(`[API] getProductById(${id}) error:`, err);
      throw err;
    }
  },

  /**
   * Check backend health and database connectivity
   */
  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE}/health`);
      return response.ok;
    } catch (e) {
      return false;
    }
  }
};

window.api = api;
