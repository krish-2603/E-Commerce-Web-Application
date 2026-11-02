/**
 * Database Module (SQLite / Relational SQL)
 * Provides centralized connection management, automatic schema initialization,
 * and parameterized query execution to safeguard against SQL injection.
 */

const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'ecommerce.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');
const SEED_PATH = path.join(__dirname, 'seed.sql');

let dbInstance = null;
let dbDriverType = 'better-sqlite3';

function getDatabase() {
  if (dbInstance) return dbInstance;

  try {
    const Database = require('better-sqlite3');
    dbInstance = new Database(DB_PATH);
    dbInstance.pragma('foreign_keys = ON');
    dbDriverType = 'better-sqlite3';
  } catch (betterSqliteErr) {
    // Fallback to Node 22 built-in node:sqlite if native binary is unavailable
    try {
      const { DatabaseSync } = require('node:sqlite');
      const syncDb = new DatabaseSync(DB_PATH);
      syncDb.exec('PRAGMA foreign_keys = ON;');
      dbDriverType = 'node:sqlite';
      dbInstance = syncDb;
    } catch (nodeSqliteErr) {
      console.error('Failed to load both better-sqlite3 and node:sqlite:');
      console.error('better-sqlite3 error:', betterSqliteErr.message);
      console.error('node:sqlite error:', nodeSqliteErr.message);
      throw new Error('No compatible SQLite engine available.');
    }
  }

  return dbInstance;
}

/**
 * Execute raw SQL string (multiple statements allowed)
 */
function exec(sqlString) {
  const db = getDatabase();
  db.exec(sqlString);
}

/**
 * Execute a SELECT query returning all matching rows
 * @param {string} sql
 * @param {Array} params
 * @returns {Array<Object>}
 */
function queryAll(sql, params = []) {
  const db = getDatabase();
  if (dbDriverType === 'better-sqlite3') {
    const stmt = db.prepare(sql);
    return stmt.all(...params);
  } else {
    // node:sqlite
    const stmt = db.prepare(sql);
    return stmt.all(...params);
  }
}

/**
 * Execute a SELECT query returning a single row (or undefined)
 * @param {string} sql
 * @param {Array} params
 * @returns {Object|undefined}
 */
function queryOne(sql, params = []) {
  const db = getDatabase();
  if (dbDriverType === 'better-sqlite3') {
    const stmt = db.prepare(sql);
    return stmt.get(...params);
  } else {
    // node:sqlite
    const stmt = db.prepare(sql);
    return stmt.get(...params);
  }
}

/**
 * Execute an INSERT / UPDATE / DELETE query
 * @param {string} sql
 * @param {Array} params
 * @returns {{ changes: number, lastInsertRowid: number|bigint }}
 */
function run(sql, params = []) {
  const db = getDatabase();
  if (dbDriverType === 'better-sqlite3') {
    const stmt = db.prepare(sql);
    return stmt.run(...params);
  } else {
    const stmt = db.prepare(sql);
    return stmt.run(...params);
  }
}

/**
 * Initialize database with schema and seed data if uninitialized or forced
 */
function initDatabase(force = false) {
  console.log(`[Database] Initializing relational database at: ${DB_PATH} using [${dbDriverType}]...`);

  const db = getDatabase();

  // Run Schema DDL
  if (fs.existsSync(SCHEMA_PATH)) {
    const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf-8');
    db.exec(schemaSql);
    console.log('[Database] Schema created / verified successfully.');
  } else {
    throw new Error(`Schema file not found at ${SCHEMA_PATH}`);
  }

  // Check if products already exist
  let count = 0;
  try {
    const result = queryOne('SELECT COUNT(*) as count FROM products');
    count = result ? result.count : 0;
  } catch (e) {
    count = 0;
  }

  if (count === 0 || force) {
    console.log('[Database] Seeding sample catalogue data...');
    if (fs.existsSync(SEED_PATH)) {
      const seedSql = fs.readFileSync(SEED_PATH, 'utf-8');
      db.exec(seedSql);
      const afterCount = queryOne('SELECT COUNT(*) as count FROM products');
      console.log(`[Database] Seed complete. ${afterCount ? afterCount.count : 0} products in database.`);
    } else {
      console.warn('[Database] Seed file not found at', SEED_PATH);
    }
  } else {
    console.log(`[Database] Database already populated with ${count} products.`);
  }

  return true;
}

module.exports = {
  getDatabase,
  exec,
  queryAll,
  queryOne,
  run,
  initDatabase,
  DB_PATH
};
