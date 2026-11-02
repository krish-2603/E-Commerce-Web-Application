/**
 * Standalone Database Setup & Seed Runner
 * Usage: node database/setup.js [--force]
 */

const { initDatabase, DB_PATH } = require('./db');

const force = process.argv.includes('--force');

try {
  console.log('--- E-Commerce Database Initialization ---');
  initDatabase(force);
  console.log(`Database initialized successfully at: ${DB_PATH}`);
  process.exit(0);
} catch (err) {
  console.error('Database initialization failed:', err);
  process.exit(1);
}
