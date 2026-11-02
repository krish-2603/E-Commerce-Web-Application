-- ====================================================================
-- E-Commerce Full-Stack Application: Relational Database Schema
-- Part 1: Product Listing Website
-- Dialect: SQLite / Relational SQL (ACID compliant)
-- ====================================================================

PRAGMA foreign_keys = ON;

-- --------------------------------------------------------------------
-- 1. Categories Table
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE COLLATE NOCASE,
    slug TEXT NOT NULL UNIQUE COLLATE NOCASE,
    description TEXT,
    icon TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------------------
-- 2. Products Table
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE COLLATE NOCASE,
    description TEXT NOT NULL,
    price REAL NOT NULL CHECK(price >= 0),
    original_price REAL CHECK(original_price IS NULL OR original_price >= price),
    image_url TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK(stock_quantity >= 0),
    rating REAL NOT NULL DEFAULT 0.0 CHECK(rating >= 0.0 AND rating <= 5.0),
    review_count INTEGER NOT NULL DEFAULT 0 CHECK(review_count >= 0),
    featured INTEGER NOT NULL DEFAULT 0 CHECK(featured IN (0, 1)),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- --------------------------------------------------------------------
-- 3. Product Specifications Table (Relational 1:Many)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_specifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    spec_name TEXT NOT NULL,
    spec_value TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- --------------------------------------------------------------------
-- Indexes for Performance & Scalability
-- --------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name COLLATE NOCASE);
CREATE INDEX IF NOT EXISTS idx_specs_product_id ON product_specifications(product_id);
