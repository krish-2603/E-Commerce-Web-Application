/**
 * Product Model
 * Handles data access and relational SQL queries for products, categories,
 * and technical specifications.
 */

const { queryAll, queryOne } = require('../../database/db');

class ProductModel {
  /**
   * Find products with filtering, searching, sorting, and pagination
   * @param {Object} options
   * @param {string} [options.search]
   * @param {string} [options.category] - category slug or id
   * @param {number} [options.minPrice]
   * @param {number} [options.maxPrice]
   * @param {boolean} [options.inStock]
   * @param {string} [options.sortBy] - price_asc, price_desc, rating, name_asc, newest
   * @param {number} [options.page=1]
   * @param {number} [options.limit=20]
   */
  static findAll({
    search,
    category,
    minPrice,
    maxPrice,
    inStock,
    sortBy = 'newest',
    page = 1,
    limit = 24
  } = {}) {
    let whereClauses = [];
    let params = [];

    // Search filter (name or description)
    if (search && search.trim() !== '') {
      const searchTerm = `%${search.trim()}%`;
      whereClauses.push('(p.name LIKE ? OR p.description LIKE ?)');
      params.push(searchTerm, searchTerm);
    }

    // Category filter (slug or id)
    if (category && category !== 'all') {
      if (/^\d+$/.test(category)) {
        whereClauses.push('p.category_id = ?');
        params.push(parseInt(category, 10));
      } else {
        whereClauses.push('LOWER(c.slug) = LOWER(?)');
        params.push(category.trim());
      }
    }

    // Min price filter
    if (minPrice !== undefined && minPrice !== null && !isNaN(minPrice)) {
      whereClauses.push('p.price >= ?');
      params.push(parseFloat(minPrice));
    }

    // Max price filter
    if (maxPrice !== undefined && maxPrice !== null && !isNaN(maxPrice)) {
      whereClauses.push('p.price <= ?');
      params.push(parseFloat(maxPrice));
    }

    // In-stock only filter
    if (inStock === true || inStock === 'true' || inStock === '1' || inStock === 1) {
      whereClauses.push('p.stock_quantity > 0');
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Count total matching items
    const countSql = `
      SELECT COUNT(p.id) as total
      FROM products p
      INNER JOIN categories c ON p.category_id = c.id
      ${whereSql}
    `;
    const countResult = queryOne(countSql, params);
    const total = countResult ? countResult.total : 0;

    // Sorting
    let orderBySql = 'ORDER BY p.id ASC';
    switch (sortBy) {
      case 'price_asc':
        orderBySql = 'ORDER BY p.price ASC';
        break;
      case 'price_desc':
        orderBySql = 'ORDER BY p.price DESC';
        break;
      case 'rating':
        orderBySql = 'ORDER BY p.rating DESC, p.review_count DESC';
        break;
      case 'name_asc':
        orderBySql = 'ORDER BY p.name ASC';
        break;
      case 'newest':
        orderBySql = 'ORDER BY p.created_at DESC, p.id DESC';
        break;
      default:
        orderBySql = 'ORDER BY p.featured DESC, p.id ASC';
        break;
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const offset = (pageNum - 1) * limitNum;

    // Data query
    const dataSql = `
      SELECT
        p.id,
        p.name,
        p.slug,
        p.description,
        p.price,
        p.original_price,
        p.image_url,
        p.category_id,
        p.stock_quantity,
        p.rating,
        p.review_count,
        p.featured,
        p.created_at,
        c.name AS category_name,
        c.slug AS category_slug
      FROM products p
      INNER JOIN categories c ON p.category_id = c.id
      ${whereSql}
      ${orderBySql}
      LIMIT ? OFFSET ?
    `;

    const dataParams = [...params, limitNum, offset];
    const products = queryAll(dataSql, dataParams);

    const totalPages = Math.ceil(total / limitNum) || 1;

    return {
      products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    };
  }

  /**
   * Find product by ID including its relational category and specifications
   * @param {number} id
   */
  static findById(id) {
    const productSql = `
      SELECT
        p.id,
        p.name,
        p.slug,
        p.description,
        p.price,
        p.original_price,
        p.image_url,
        p.category_id,
        p.stock_quantity,
        p.rating,
        p.review_count,
        p.featured,
        p.created_at,
        p.updated_at,
        c.name AS category_name,
        c.slug AS category_slug,
        c.description AS category_description
      FROM products p
      INNER JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `;

    const product = queryOne(productSql, [id]);
    if (!product) {
      return null;
    }

    // Retrieve relational specifications (1:many)
    const specsSql = `
      SELECT spec_name, spec_value
      FROM product_specifications
      WHERE product_id = ?
      ORDER BY id ASC
    `;
    const specifications = queryAll(specsSql, [id]);

    return {
      ...product,
      specifications
    };
  }

  /**
   * Get all categories with product counts
   */
  static getCategories() {
    const sql = `
      SELECT
        c.id,
        c.name,
        c.slug,
        c.description,
        c.icon,
        COUNT(p.id) AS product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id
      ORDER BY c.id ASC
    `;
    return queryAll(sql);
  }
}

module.exports = ProductModel;
