-- ====================================================================
-- E-Commerce Full-Stack Application: Seed Data
-- Part 1: Product Listing Website
-- Dialect: SQLite / Relational SQL
-- ====================================================================

-- Clean existing data
DELETE FROM product_specifications;
DELETE FROM products;
DELETE FROM categories;

-- Reset sequence IDs
DELETE FROM sqlite_sequence WHERE name IN ('product_specifications', 'products', 'categories');

-- --------------------------------------------------------------------
-- 1. Insert Categories
-- --------------------------------------------------------------------
INSERT INTO categories (id, name, slug, description, icon) VALUES
(1, 'Audio', 'audio', 'High-fidelity headphones, wireless earbuds, and studio speakers', 'headphones'),
(2, 'Wearables', 'wearables', 'Next-generation smartwatches, fitness bands, and wearable tech', 'watch'),
(3, 'Computing', 'computing', 'Mechanical keyboards, 4K monitors, and ergonomic productivity gear', 'monitor'),
(4, 'Photography', 'photography', 'Mirrorless cameras, handheld gimbals, and visual gear', 'camera'),
(5, 'Accessories', 'accessories', 'Fast-charging power banks, everyday bags, and wireless stands', 'shield');

-- --------------------------------------------------------------------
-- 2. Insert Products
-- --------------------------------------------------------------------
INSERT INTO products (id, name, slug, description, price, original_price, image_url, category_id, stock_quantity, rating, review_count, featured) VALUES
(
    1,
    'Sony WH-1000XM5 Wireless Noise-Canceling Headphones',
    'sony-wh1000xm5-headphones',
    'Industry-leading noise cancelation optimized automatically based on wearing conditions and environment. Engineered with two processors and 8 microphones for exceptional call quality and ultra-pure sound fidelity.',
    349.99,
    399.99,
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    1,
    24,
    4.8,
    412,
    1
),
(
    2,
    'Apple Watch Series 9 GPS 45mm',
    'apple-watch-series-9',
    'Smarter, brighter, and mightier. Powered by the S9 SiP chip enabling a magical new way to use your watch without touching the screen: double tap gesture. Advanced health, safety, and activity sensors.',
    389.00,
    429.00,
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    2,
    15,
    4.9,
    580,
    1
),
(
    3,
    'Keychron Q1 Pro Wireless Custom Mechanical Keyboard',
    'keychron-q1-pro-keyboard',
    'Full metal CNC machined 75% layout custom mechanical keyboard with QMK/VIA support, double-gasket design, screw-in stabilizers, and seamless multi-device Bluetooth 5.1 / wired USB-C connectivity.',
    199.50,
    219.00,
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    3,
    32,
    4.7,
    189,
    0
),
(
    4,
    'Dell UltraSharp 27" 4K USB-C Hub Monitor (U2723QE)',
    'dell-ultrasharp-27-4k-monitor',
    'Experience incredible color clarity and superior black performance with a contrast ratio of 2000:1 on the world''s first 27-inch 4K monitor with IPS Black technology. Delivers up to 90W power delivery via USB-C.',
    549.99,
    619.99,
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    3,
    8,
    4.6,
    124,
    1
),
(
    5,
    'Fujifilm X-T5 Mirrorless Digital Camera (Body)',
    'fujifilm-xt5-camera',
    'A portable, powerful multimedia mirrorless camera featuring the newly developed 40.2-megapixel X-Trans CMOS 5 HR sensor, up to 7 stops of 5-axis in-body image stabilization, and 6.2K 30p internal video recording.',
    1699.00,
    1799.00,
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    4,
    6,
    4.9,
    95,
    1
),
(
    6,
    'Anker Prime 20,000mAh Power Bank (200W Output)',
    'anker-prime-20000mah-powerbank',
    'Equipped with 2 USB-C ports and 1 USB-A port to deliver up to 200W total output. Fast charge two laptops simultaneously at 100W each. Smart digital display shows real-time output, remaining battery, and charging speed.',
    129.99,
    149.99,
    'https://images.unsplash.com/photo-1609592424365-a681d8a1aa8c?auto=format&fit=crop&w=800&q=80',
    5,
    45,
    4.7,
    310,
    0
),
(
    7,
    'Bose QuietComfort Ultra Wireless Noise-Canceling Earbuds',
    'bose-qc-ultra-earbuds',
    'Breakthrough spatialized audio for more immersive listening that makes music feel more real than ever. CustomTune technology personalizes sound shaped specifically to the unique anatomy of your ears.',
    279.00,
    299.00,
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    1,
    19,
    4.6,
    235,
    0
),
(
    8,
    'Garmin Fenix 7 Pro Solar Sapphire Multisport Watch',
    'garmin-fenix-7-pro-solar',
    'Rugged multisport GPS smartwatch built for all-day every-day performance. Features solar charging sapphire crystal lens for up to 22 days of battery life, built-in LED flashlight, and topo mapping.',
    799.99,
    899.99,
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
    2,
    11,
    4.9,
    174,
    1
),
(
    9,
    'Logitech MX Master 3S Performance Wireless Mouse',
    'logitech-mx-master-3s',
    'An icon remastered with Quiet Click switches and an 8,000 DPI track-on-glass sensor. MagSpeed Electromagnetic scrolling is precise enough to stop on a pixel and quick enough to scroll 1,000 lines a second.',
    99.99,
    109.99,
    'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    3,
    50,
    4.8,
    720,
    0
),
(
    10,
    'Peak Design Everyday Backpack 20L v2 (Charcoal)',
    'peak-design-everyday-backpack-20l',
    'An iconic, multi-award-winning pack for everyday and photo carry. 100% recycled 400D weatherproof shell, dual weatherproof UltraZips, expandable MagLatch hardware, and modular internal FlexFold dividers.',
    259.95,
    279.95,
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    5,
    14,
    4.8,
    210,
    0
),
(
    11,
    'DJI Osmo Pocket 3 Creator Combo 4K Camera',
    'dji-osmo-pocket-3-creator-combo',
    'Pocket-sized gimbal camera featuring a powerful 1-inch CMOS sensor, 4K/120fps recording, 3-axis mechanical stabilization, 2-inch rotatable OLED touchscreen, and ActiveTrack 6.0 intelligent tracking.',
    669.00,
    719.00,
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
    4,
    7,
    4.9,
    330,
    1
),
(
    12,
    'Belkin BoostCharge Pro 3-in-1 Wireless Charger with MagSafe',
    'belkin-boostcharge-pro-3in1',
    'Fast wireless charging up to 15W for iPhone, seamless magnetic alignment with MagSafe, dedicated wireless charging puck for Apple Watch, and Qi charging pad for AirPods in an architectural chrome finish.',
    149.99,
    169.99,
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
    5,
    28,
    4.5,
    140,
    0
);

-- --------------------------------------------------------------------
-- 3. Insert Product Technical Specifications (Relational Details)
-- --------------------------------------------------------------------
-- Sony WH-1000XM5 Specs
INSERT INTO product_specifications (product_id, spec_name, spec_value) VALUES
(1, 'Battery Life', 'Up to 30 hours (NC On), 40 hours (NC Off)'),
(1, 'Charging Time', '3.5 hours via USB-C (3-min quick charge provides 3 hours playback)'),
(1, 'Weight', '250 grams'),
(1, 'Driver Unit', '30mm carbon fiber composite dome'),
(1, 'Bluetooth Version', '5.2 with LDAC, AAC, and SBC codec support');

-- Apple Watch Series 9 Specs
INSERT INTO product_specifications (product_id, spec_name, spec_value) VALUES
(2, 'Processor', 'Apple S9 SiP 64-bit dual-core with 4-core Neural Engine'),
(2, 'Display', 'Always-On Retina LTPO OLED display up to 2,000 nits'),
(2, 'Water Resistance', '50 meters (swimproof) / IP6X dust resistant'),
(2, 'Connectivity', 'Wi-Fi 4 (802.11n), Bluetooth 5.3, Second-gen Ultra Wideband'),
(2, 'Battery Life', 'Up to 18 hours typical, 36 hours in Low Power Mode');

-- Keychron Q1 Pro Specs
INSERT INTO product_specifications (product_id, spec_name, spec_value) VALUES
(3, 'Layout', '75% (81 keys) with programmable rotary encoder knob'),
(3, 'Body Material', 'Full CNC precision aluminum body'),
(3, 'Switches', 'Hot-swappable Keychron K Pro Mechanical switches'),
(3, 'Polling Rate', '1000 Hz (Wired) / 90 Hz (Wireless)'),
(3, 'Battery Capacity', '4000 mAh rechargeable Li-polymer battery');

-- Dell UltraSharp 27" 4K Specs
INSERT INTO product_specifications (product_id, spec_name, spec_value) VALUES
(4, 'Resolution', '4K UHD (3840 x 2160) at 60 Hz'),
(4, 'Panel Type', 'IPS Black Technology with 2000:1 contrast ratio'),
(4, 'Color Gamut', '100% sRGB, 100% Rec. 709, 98% DCI-P3'),
(4, 'Ports', '1x USB-C (90W PD), 1x DP 1.4, 1x HDMI 2.0, RJ45 Ethernet, 5x USB-A 10Gbps'),
(4, 'Ergonomics', 'Height adjustable (150 mm), tilt, swivel, and pivot 90°');

-- Fujifilm X-T5 Specs
INSERT INTO product_specifications (product_id, spec_name, spec_value) VALUES
(5, 'Image Sensor', '40.2MP APS-C X-Trans CMOS 5 HR sensor'),
(5, 'Image Stabilization', '5-axis in-body image stabilization (up to 7.0 stops)'),
(5, 'Video Resolution', '6.2K at 30p, 4K at 60p, Full HD at 240p in 10-bit 4:2:2'),
(5, 'Viewfinder', '3.69M-dot OLED EVF with 0.8x magnification'),
(5, 'Shutter Speed', 'Electronic shutter up to 1/180,000 sec');

-- Anker Prime 20,000mAh Specs
INSERT INTO product_specifications (product_id, spec_name, spec_value) VALUES
(6, 'Total Capacity', '20,000 mAh (72 Wh)'),
(6, 'Maximum Output', '200W total (Single port up to 100W PD 3.0)'),
(6, 'Ports', '2x USB-C, 1x USB-A'),
(6, 'Display', 'Built-in TFT Smart Color Status Display'),
(6, 'Weight', '540 grams');

-- Bose QuietComfort Ultra Earbuds Specs
INSERT INTO product_specifications (product_id, spec_name, spec_value) VALUES
(7, 'Spatial Audio', 'Bose Immersive Audio with dynamic head tracking'),
(7, 'Battery Life', 'Up to 6 hours continuous (4 hours in Immersive Audio mode)'),
(7, 'Water Rating', 'IPX4 sweat and weather resistant'),
(7, 'Microphones', '4 microphones in each earbud with noise-rejecting array');

-- Garmin Fenix 7 Pro Specs
INSERT INTO product_specifications (product_id, spec_name, spec_value) VALUES
(8, 'Lens Material', 'Power Sapphire scratch-resistant solar lens'),
(8, 'Case Size', '47 x 47 x 14.5 mm fiber-reinforced polymer with titanium bezel'),
(8, 'GPS Technology', 'Multi-band GNSS with SatIQ technology'),
(8, 'Battery Life', 'Up to 22 days in smartwatch mode with solar');

-- Logitech MX Master 3S Specs
INSERT INTO product_specifications (product_id, spec_name, spec_value) VALUES
(9, 'Sensor Technology', 'Darkfield high precision sensor (200 - 8000 DPI)'),
(9, 'Scroll Wheel', 'MagSpeed smart-shift electromagnetic scroll wheel'),
(9, 'Buttons', '7 buttons (Left/Right-click, Back/Forward, App-Switch, Wheel mode-shift, Middle click)'),
(9, 'Battery Life', 'Up to 70 days on a full charge; 1-min quick charge provides 3 hours use');

-- Peak Design Everyday Backpack Specs
INSERT INTO product_specifications (product_id, spec_name, spec_value) VALUES
(10, 'Capacity', '17L min to 20L max via MagLatch expansion'),
(10, 'Laptop Carry', 'Fits up to 15-inch / 16-inch MacBook Pro with dedicated tablet sleeve'),
(10, 'Materials', 'Weatherproof 400D double poly-coated DWR-impregnated nylon canvas shell'),
(10, 'Dividers', '3 configurable FlexFold origami-inspired dividers');

-- DJI Osmo Pocket 3 Specs
INSERT INTO product_specifications (product_id, spec_name, spec_value) VALUES
(11, 'Sensor', '1-inch CMOS sensor with 4K/120fps capability'),
(11, 'Screen', '2.0-inch rotatable OLED touch display (314x556)'),
(11, 'Stabilization', '3-axis motorized mechanical gimbal'),
(11, 'Audio', 'Three-microphone omnidirectional stereo recording with DJI Mic 2 transmitter');

-- Belkin BoostCharge Pro 3-in-1 Specs
INSERT INTO product_specifications (product_id, spec_name, spec_value) VALUES
(12, 'Wireless Standard', 'Apple MagSafe 15W official fast charging'),
(12, 'Compatibility', 'iPhone 12-16 series, Apple Watch Ultra/Series 7+, AirPods Pro/Wireless'),
(12, 'Power Supply', '40W dedicated wall adapter included'),
(12, 'Finish', 'Architectural stainless steel arm with premium silicone pads');
