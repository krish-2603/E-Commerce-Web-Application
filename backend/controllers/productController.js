/**
 * Product Controller
 * Handles business logic and responses for product catalogue and details.
 */
const ProductModel = require('../models/productModel');

class ProductController {
  /**
   * GET /api/products
   * Retrieves filtered, sorted, and paginated product list
   */
  static async getAllProducts(req, res, next) {
    try {
      const {
        search,
        category,
        minPrice,
        maxPrice,
        inStock,
        sortBy,
        page,
        limit
      } = req.query;

      const result = ProductModel.findAll({
        search,
        category,
        minPrice,
        maxPrice,
        inStock,
        sortBy,
        page,
        limit
      });

      return res.status(200).json({
        success: true,
        count: result.products.length,
        total: result.pagination.total,
        pagination: result.pagination,
        data: result.products
      });
    } catch (err) {
      next(err);
    }
  }
  /**
   * GET /api/products/:id
   * Retrieves single product by ID with specifications
   */
  static async getProductById(req, res, next) {
    try {
      const productId = req.validatedId;
      const product = ProductModel.findById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: `Product with ID ${productId} not found.`
        });
      }

      return res.status(200).json({
        success: true,
        data: product
      });
    } catch (err) {
      next(err);
    }
  }
  /**
   * GET /api/categories
   * Retrieves list of categories with product count
   */
  static async getCategories(req, res, next) {
    try {
      const categories = ProductModel.getCategories();
      return res.status(200).json({
        success: true,
        count: categories.length,
        data: categories
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ProductController;
