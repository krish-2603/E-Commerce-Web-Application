/**
 * Main Application Server
 * Express full-stack server integrating REST API, database, and static frontend.
 */

require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const { initDatabase, getDatabase } = require('../database/db');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');

// 1. Auto-initialize Database on startup
try {
  initDatabase(false);
} catch (dbErr) {
  console.error('[Database] Initialization error on startup:', dbErr.message);
}

// 2. Core Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.originalUrl.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// 3. Static Frontend Assets
app.use(express.static(FRONTEND_DIR));

// 4. System Health Check Endpoint
app.get('/api/health', (req, res) => {
  try {
    const db = getDatabase();
    res.status(200).json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected (SQLite relational)',
      version: '1.0.0'
    });
  } catch (err) {
    res.status(503).json({
      success: false,
      status: 'degraded',
      error: err.message
    });
  }
});

// 5. REST API Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

// 6. Handle Undefined API Routes (404)
app.use('/api', notFoundHandler);

// 7. SPA Route Fallback - Deliver Frontend index.html for non-API routes
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
  }
  next();
});

// 8. Centralized Error Handler
app.use(errorHandler);

// 9. Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log('====================================================');
    console.log(`  E-Commerce Application Server is Running!`);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`  Local URL:   http://localhost:${PORT}`);
    console.log(`  API Health:  http://localhost:${PORT}/api/health`);
    console.log(`  Products:    http://localhost:${PORT}/api/products`);
    console.log(`  Categories:  http://localhost:${PORT}/api/categories`);
    console.log('====================================================');
  });
}

module.exports = app;
