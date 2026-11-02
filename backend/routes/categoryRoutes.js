/**
 * Category Routes
 * Mounts endpoints for product categories.
 */

const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');

// GET /api/categories - List all categories with product counts
router.get('/', ProductController.getCategories);

module.exports = router;
