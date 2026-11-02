/**
 * Request Validation Middleware
 * Enforces parameter sanity and returns HTTP 400 Bad Request for malformed requests.
 */

const ALLOWED_SORT_OPTIONS = ['price_asc', 'price_desc', 'rating', 'name_asc', 'newest', 'featured'];

/**
 * Validate query parameters for product catalogue retrieval
 */
function validateProductQuery(req, res, next) {
  const { minPrice, maxPrice, sortBy, page, limit } = req.query;
  const errors = [];

  if (minPrice !== undefined) {
    const min = parseFloat(minPrice);
    if (isNaN(min) || min < 0) {
      errors.push('minPrice must be a non-negative number.');
    }
  }

  if (maxPrice !== undefined) {
    const max = parseFloat(maxPrice);
    if (isNaN(max) || max < 0) {
      errors.push('maxPrice must be a non-negative number.');
    }
  }

  if (minPrice !== undefined && maxPrice !== undefined) {
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    if (!isNaN(min) && !isNaN(max) && min > max) {
      errors.push('minPrice cannot be greater than maxPrice.');
    }
  }

  if (sortBy !== undefined && !ALLOWED_SORT_OPTIONS.includes(sortBy)) {
    errors.push(`Invalid sortBy parameter. Allowed values: ${ALLOWED_SORT_OPTIONS.join(', ')}.`);
  }

  if (page !== undefined) {
    const pageNum = parseInt(page, 10);
    if (isNaN(pageNum) || pageNum <= 0) {
      errors.push('page must be a positive integer.');
    }
  }

  if (limit !== undefined) {
    const limitNum = parseInt(limit, 10);
    if (isNaN(limitNum) || limitNum <= 0 || limitNum > 100) {
      errors.push('limit must be an integer between 1 and 100.');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid query parameters',
      details: errors
    });
  }

  next();
}

/**
 * Validate product ID route parameter
 */
function validateProductId(req, res, next) {
  const { id } = req.params;
  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId) || !/^\d+$/.test(id) || parsedId <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid product ID format. ID must be a positive integer.'
    });
  }

  req.validatedId = parsedId;
  next();
}

module.exports = {
  validateProductQuery,
  validateProductId
};
