-- ============================================================================
-- TEAKWOOD FURNITURE CRAFT - SEED DATA (CLOUDFLARE D1)
-- ============================================================================

-- 1. Insert Standard Categories
INSERT OR IGNORE INTO categories (id, name, slug, description, image_url, display_order) VALUES
(1, 'Beds', 'beds', 'Solid teakwood bedframes with floating headboards and heirloom joinery', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80', 1),
(2, 'Dining', 'dining', 'Heavy-slab live-edge and mortise-tenon teak dining tables & benches', 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80', 2),
(3, 'Sofas', 'sofas', 'Architectural solid teak lounge suites with natural cane and linen accents', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80', 3),
(4, 'Chairs', 'chairs', 'Hand-turned planter chairs, dining armchairs, and mid-century teak seats', 'https://images.unsplash.com/photo-1580481077111-2098ca30e163?auto=format&fit=crop&w=1200&q=80', 4),
(5, 'Tables', 'tables', 'Organic coffee tables, teak study desks, and console credenzas', 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=80', 5),
(6, 'Wardrobes', 'wardrobes', 'Traditional louvred armoires and contemporary walk-in teak wardrobes', 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80', 6),
(7, 'Doors', 'doors', 'Grand carved main entrance doors and courtyard double doors in seasoned teak', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80', 7),
(8, 'Others', 'others', 'Bespoke bar units, pooja mandirs, daybeds, and custom architectural elements', 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80', 8);

-- 2. Insert 6 Rich Sample Products
INSERT OR IGNORE INTO products (
  id, name, slug, category_id, description, dimensions, wood_type,
  finish_options, customization_options, starting_price, delivery_time,
  cover_image_url, video_url, is_featured, is_hidden
) VALUES
(
  1,
  'The Malabar Royal Teak Bed',
  'malabar-royal-teak-bed',
  1,
  'Masterfully sculpted from 100% seasoned Grade-A plantation teak, the Malabar Royal features a gently canted architectural headboard, hidden structural steel reinforcement, and seamless mortise-and-tenon interlocking joints. Designed to be passed down through generations without a single squeak.',
  '78" L x 72" W x 46" H (Fits Standard Indian King Mattress: 78" x 72")',
  '100% Seasoned Grade-A Central Province Teakwood (Moisture content < 10%)',
  'Natural Hand-Rubbed Oil & Beeswax, Satin Walnut, Honey Teak Lustre',
  'Custom mattress dimensions (King/Queen/California), Hydraulic storage box, Upholstered headboard cushion option',
  84500,
  '3 to 4 weeks (handcrafted upon order)',
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  1,
  0
),
(
  2,
  'Nilgiri 8-Seater Heavy Slab Teak Dining Table',
  'nilgiri-8-seater-slab-teak-dining-table',
  2,
  'An imposing dining masterpiece celebrating the dramatic grain and natural character of seasoned teak. Cut from mature teak logs with butterfly brass inlays and chamfered edges resting on robust double-pedestal trestle legs. Finished with water-repellent organic oil finish.',
  '96" L x 40" W x 30" H (Comfortable 8-seater arrangement)',
  '100% Solid Heartwood Teak, 2-inch thick seamless continuous plank top',
  'Natural Raw Matte, Deep Espresso, Warm Amber Honey',
  'Custom table length (4 to 12 seaters), Matching teak benches, Optional integrated wire management for conference use',
  118000,
  '4 weeks (crafted in our workshop)',
  'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80',
  NULL,
  1,
  0
),
(
  3,
  'Travancore Hand-Woven Cane & Teak 3-Seater Sofa',
  'travancore-cane-teak-3-seater-sofa',
  3,
  'A classic tribute to tropical modernist architecture. Features a precision sculpted solid teak frame paired with hand-woven natural river cane webbing across the back and arm panels. Equipped with high-resilience 40-density feather-touch foam cushions upholstered in breathable Belgian linen.',
  '84" W x 34" D x 32" H (Seat Height: 18")',
  '100% Kiln-Dried Solid Teakwood with natural rattan wickerwork',
  'Natural Teak Matte, Dark Tobacco, Vintage Teak Brown',
  'Choice of 2-seater, 3-seater, or L-shape sectional; 40+ fabric and pure leather upholstery choices',
  76000,
  '3 to 4 weeks (handcrafted to order)',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
  NULL,
  1,
  0
),
(
  4,
  'The Calicut Colonial Easy Armchair',
  'calicut-colonial-easy-armchair',
  4,
  'An authentic homage to the planters chairs of 19th-century estates. Features sweeping ergonomic broad armrests designed for resting tea or a book, hand-woven diamond-pattern cane mesh seat, and subtle brass ferrule accents. Reclines at a natural relaxing lounge angle.',
  '34" W x 38" D x 36" H',
  '100% Quarter-Sawn Solid Teakwood & Natural Cane Mesh',
  'Hand-Burnished Teak, Walnut Gloss, Heritage Dark Teak',
  'With or without swing-out leg rest extensions, choice of neck roll pillow',
  32500,
  '2 to 3 weeks',
  'https://images.unsplash.com/photo-1580481077111-2098ca30e163?auto=format&fit=crop&w=1200&q=80',
  NULL,
  1,
  0
),
(
  5,
  'Heritage Archival 3-Door Louvred Teak Wardrobe',
  'heritage-archival-3-door-teak-wardrobe',
  6,
  'Crafted like the heirloom almirahs of ancestral homes, this 3-door wardrobe features hand-fitted louvred shutters that allow natural air circulation, solid brass mortise locks, deep cedar-lined drawers, and internal concealed hanging rails.',
  '72" W x 24" D x 84" H',
  '100% Solid Seasoned Teakwood (including inner shelving and drawer sides)',
  'Aged Teak Patina, Natural Matte Sealant, Dark Antique Walnut',
  'Custom internal shelf layout, Safe locker compartment, Full-length mirror on inner door panel',
  145000,
  '4 to 5 weeks',
  'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80',
  NULL,
  1,
  0
),
(
  6,
  'Chettinad Carved Double Temple Entrance Door',
  'chettinad-carved-double-entrance-door',
  7,
  'A magnificent grand entrance door hand-carved by our senior temple woodcarvers with traditional floral medallions, solid brass lotus studs, and antique hand-forged brass handles. Built from 2.5-inch thick single-grain aged teak to withstand decades of sun and rain.',
  '60" W x 96" H (Frame Thickness: 5" x 4")',
  'High-Density Aged Burma Teakwood (Termite & borer proof)',
  'Exterior Weather-Shield Teak Oil, Antique Dark Teak',
  'Custom frame jamb size, provision for digital smart lock, custom carvings/motifs',
  NULL, -- Price on request
  '5 to 6 weeks (custom carved)',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
  NULL,
  1,
  0
);

-- 3. Insert Gallery Images for Products
INSERT OR IGNORE INTO product_images (product_id, image_url, alt_text, display_order) VALUES
(1, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80', 'Malabar Royal Teak Bed Headboard Detail', 1),
(1, 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef7?auto=format&fit=crop&w=1200&q=80', 'Teak Bed frame side joinery and grain', 2),
(1, 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80', 'Bedroom interior setting with Malabar Bed', 3),

(2, 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80', 'Nilgiri Dining Table full overview', 1),
(2, 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=1200&q=80', 'Solid teak wood grain and edge chamfer detail', 2),

(3, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80', 'Travancore 3-Seater Sofa frontal view', 1),
(3, 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80', 'Living room styled setting with teak sofa', 2),

(4, 'https://images.unsplash.com/photo-1580481077111-2098ca30e163?auto=format&fit=crop&w=1200&q=80', 'Calicut Colonial Easy Armchair', 1),
(4, 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80', 'Armrest joinery and cane weaving detail', 2),

(5, 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80', 'Heritage Louvred Teak Wardrobe', 1),
(5, 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=1200&q=80', 'Wardrobe interior cedar shelves and brass hardware', 2),

(6, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80', 'Chettinad Carved Teak Double Door', 1),
(6, 'https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&w=1200&q=80', 'Hand-carved floral motif and brass hardware', 2);

-- 4. Insert Testimonials
INSERT OR IGNORE INTO testimonials (id, client_name, client_city, product_purchased, rating, review_text, client_image_url, is_featured, display_order) VALUES
(
  1,
  'Vikram & Gayatri Menon',
  'Bengaluru (Indiranagar)',
  'Nilgiri 8-Seater Dining Table & Custom Chairs',
  5,
  'We visited their workshop directly in the outskirts. Seeing the raw seasoned teak logs and the master carvers working by hand was an incredible experience. The dining table delivered to our apartment is an absolute centerpiece—heavy, flawlessly jointed, and smooth as silk.',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  1,
  1
),
(
  2,
  'Arunabh Sen',
  'Mumbai (Bandra West)',
  'Custom King Bed & Cane Lounge Chairs',
  5,
  'Finding 100% genuine solid teak without veneer tricks or MDF in Mumbai is nearly impossible. Their team communicated every stage over WhatsApp photos while crafting. It is true heirloom furniture that smells wonderfully of natural wood oil.',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  1,
  2
),
(
  3,
  'Dr. Preeti Radhakrishnan',
  'Chennai (Adyar)',
  'Chettinad Carved Main Entrance Door',
  5,
  'Our architects recommended this workshop for our ancestral home renovation. The craftsmanship on the double doors is museum quality. The brass fittings and deep wood carvings give our home an authentic traditional soul. Highly recommend their bespoke service.',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
  1,
  3
);

-- 5. Insert Default Admin User (admin@teakaura.com / AdminTeak2026!)
-- PBKDF2 hash of "AdminTeak2026!" with salt "kaashtha_workshop_salt" (60,000 iterations SHA-256)
INSERT OR IGNORE INTO admins (id, email, password_hash, salt, full_name) VALUES
(
  1,
  'admin@teakaura.com',
  '90bb466395e54d60fcad691cbf722421ffbe7c0303bfa82a17f2fafe4d65ee1a',
  'kaashtha_workshop_salt',
  'Master Craftsman Admin'
);

-- 6. Insert Sample Enquiries for Immediate Dashboard Preview
INSERT OR IGNORE INTO enquiries (
  id, enquiry_type, name, phone, city, product_id, product_name, message,
  custom_item_type, approximate_size, budget_range, status, admin_notes, created_at
) VALUES
(
  1,
  'product',
  'Rohit Sharma',
  '+91 98450 12345',
  'Hyderabad',
  1,
  'The Malabar Royal Teak Bed',
  'Can this king bed be customized with side pull-out drawers and a slightly darker walnut stain? Looking for delivery by end of next month.',
  NULL,
  'King Size (78x72)',
  '₹80,000 - ₹1,00,000',
  'New',
  'Called customer, will send wood finish samples over WhatsApp.',
  DATETIME('now', '-2 hours')
),
(
  2,
  'custom',
  'Meera Kapoor',
  '+91 98111 67890',
  'Delhi NCR',
  NULL,
  NULL,
  'We want a 10-seater live-edge teak dining table with brass bowtie inlays and 10 matching armchairs with cane backs.',
  '10-Seater Live Edge Dining Set',
  '120" L x 42" W x 30" H',
  'Above ₹2,50,000',
  'Contacted',
  'Shared 3 raw slab options from workshop inventory. Awaiting client dimension sign-off.',
  DATETIME('now', '-1 day')
);
