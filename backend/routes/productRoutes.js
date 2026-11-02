/**
 * Product Routes
 * Mounts endpoints for product catalogue search, filtering, and detail view.
 */

const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const { validateProductQuery, validateProductId } = require('../middleware/validator');

// GET /api/products - List products with optional search, category, price, and sorting
router.get('/', validateProductQuery, ProductController.getAllProducts);

// GET /api/products/:id - Retrieve single product details with technical specs
router.get('/:id', validateProductId, ProductController.getProductById);

module.exports = router;
