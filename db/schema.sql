-- ============================================================================
-- TEAKWOOD FURNITURE CRAFT - CLOUDFLARE D1 (SQLITE) SCHEMA
-- ============================================================================

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  description TEXT NOT NULL,
  dimensions TEXT NOT NULL,
  wood_type TEXT NOT NULL DEFAULT '100% Seasoned Grade-A CP Teakwood',
  finish_options TEXT NOT NULL DEFAULT 'Natural Hand-Rubbed Oil, Satin Walnut, Honey Teak, Weathered Matte',
  customization_options TEXT NOT NULL DEFAULT 'Dimensions, Headboard / Cushion fabric, Underbed storage, Polish tone',
  starting_price REAL, -- NULL represents "Price on request"
  delivery_time TEXT NOT NULL DEFAULT '3 to 4 weeks (handcrafted upon order)',
  cover_image_url TEXT NOT NULL,
  video_url TEXT,
  is_featured INTEGER NOT NULL DEFAULT 0, -- 1 for featured on homepage
  is_hidden INTEGER NOT NULL DEFAULT 0,   -- 1 to hide from public catalog
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Product Images Table (Multi-image gallery per product)
CREATE TABLE IF NOT EXISTS product_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Enquiries Table (Product Enquiries, Custom Orders, & Contact Submissions)
CREATE TABLE IF NOT EXISTS enquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  enquiry_type TEXT NOT NULL CHECK(enquiry_type IN ('product', 'custom', 'contact')),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT,
  message TEXT,
  custom_item_type TEXT,
  approximate_size TEXT,
  budget_range TEXT,
  reference_images TEXT, -- JSON array of image URLs (up to 3)
  status TEXT NOT NULL DEFAULT 'New' CHECK(status IN ('New', 'Contacted', 'Quoted', 'Won', 'Lost')),
  admin_notes TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_name TEXT NOT NULL,
  client_city TEXT NOT NULL,
  product_purchased TEXT,
  rating INTEGER NOT NULL DEFAULT 5 CHECK(rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  client_image_url TEXT,
  is_featured INTEGER NOT NULL DEFAULT 1,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. Admins Table (Secure Auth with Salted Hash)
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT 'Workshop Admin',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login_at DATETIME
);

-- Indexes for lightning fast queries and filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_hidden ON products(is_hidden);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_type ON enquiries(enquiry_type);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured);
