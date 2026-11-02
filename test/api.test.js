/**
 * Backend API Verification & Integration Test Suite
 * Tests all endpoints, query validations, status codes, and relational data.
 */

const http = require('http');
const app = require('../backend/server');

const TEST_PORT = 5001;
let server;

function makeRequest(path, method = 'GET') {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: TEST_PORT,
        path,
        method,
        headers: { 'Content-Type': 'application/json' }
      },
      (res) => {
        let rawData = '';
        res.on('data', (chunk) => (rawData += chunk));
        res.on('end', () => {
          let body = rawData;
          try {
            body = JSON.parse(rawData);
          } catch (e) {}
          resolve({ status: res.statusCode, headers: res.headers, body });
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  console.log('\n======================================================');
  console.log('  Running Backend API & Integration Test Suite');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(testName, condition, errorMsg = '') {
    if (condition) {
      console.log(`  [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${testName} - ${errorMsg}`);
      failed++;
    }
  }

  server = app.listen(TEST_PORT);

  try {
    // 1. Health check
    const health = await makeRequest('/api/health');
    assert('Health Check: GET /api/health returns 200 OK', health.status === 200 && health.body.success === true);

    // 2. Full product catalogue
    const allProducts = await makeRequest('/api/products');
    assert('Catalogue Retrieval: GET /api/products returns 200 OK', allProducts.status === 200);
    assert('Catalogue Count: Contains products array', Array.isArray(allProducts.body.data) && allProducts.body.data.length >= 12);
    assert('Catalogue Schema: First product has name, description, price, image_url',
      Boolean(allProducts.body.data[0].name && allProducts.body.data[0].description && allProducts.body.data[0].price && allProducts.body.data[0].image_url));

    // 3. Search query
    const searchRes = await makeRequest('/api/products?search=Sony');
    assert('Search Filter: GET /api/products?search=Sony returns 200', searchRes.status === 200);
    assert('Search Accuracy: Finds matching Sony product',
      searchRes.body.data.some(p => p.name.includes('Sony')));

    // 4. Category filter
    const catRes = await makeRequest('/api/products?category=audio');
    assert('Category Filter: GET /api/products?category=audio returns 200', catRes.status === 200);
    assert('Category Accuracy: All returned items belong to Audio',
      catRes.body.data.every(p => p.category_slug === 'audio'));

    // 5. Price range filter
    const priceRes = await makeRequest('/api/products?minPrice=100&maxPrice=300');
    assert('Price Range Filter: GET /api/products?minPrice=100&maxPrice=300 returns 200', priceRes.status === 200);
    assert('Price Range Accuracy: All items within $100-$300',
      priceRes.body.data.every(p => p.price >= 100 && p.price <= 300));

    // 6. Sorting
    const sortRes = await makeRequest('/api/products?sortBy=price_asc');
    assert('Sorting: GET /api/products?sortBy=price_asc returns 200', sortRes.status === 200);
    const prices = sortRes.body.data.map(p => p.price);
    const isSorted = prices.every((val, i, arr) => !i || arr[i - 1] <= val);
    assert('Sorting Accuracy: Prices strictly in ascending order', isSorted);

    // 7. Single Product Details (Relational Data)
    const singleRes = await makeRequest('/api/products/1');
    assert('Product Detail: GET /api/products/1 returns 200 OK', singleRes.status === 200);
    assert('Product Detail Specifications: Relational specs table attached',
      Array.isArray(singleRes.body.data.specifications) && singleRes.body.data.specifications.length > 0);

    // 8. 404 Product Not Found
    const notFoundRes = await makeRequest('/api/products/99999');
    assert('Status Code 404: Non-existent product ID returns 404', notFoundRes.status === 404 && notFoundRes.body.success === false);

    // 9. 400 Bad Request on invalid ID
    const badIdRes = await makeRequest('/api/products/not-a-number');
    assert('Status Code 400: Non-numeric ID returns 400 Bad Request', badIdRes.status === 400 && badIdRes.body.success === false);

    // 10. 400 Bad Request on invalid price range
    const badPriceRes = await makeRequest('/api/products?minPrice=500&maxPrice=200');
    assert('Status Code 400: minPrice > maxPrice returns 400 Bad Request', badPriceRes.status === 400 && badPriceRes.body.success === false);

    // 11. Categories list
    const categoriesRes = await makeRequest('/api/categories');
    assert('Categories Endpoint: GET /api/categories returns 200 OK', categoriesRes.status === 200 && Array.isArray(categoriesRes.body.data));
    assert('Categories Product Count: Includes relational product_count field',
      categoriesRes.body.data.every(c => typeof c.product_count === 'number'));

  } catch (err) {
    console.error('Test execution failed with error:', err);
    failed++;
  } finally {
    server.close();
    console.log('\n------------------------------------------------------');
    console.log(`  Tests Completed: ${passed} Passed, ${failed} Failed`);
    console.log('------------------------------------------------------\n');
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
