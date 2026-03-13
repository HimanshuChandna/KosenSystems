-- =============================================
-- Kosen Systems — Database Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- ========================
-- 1. PRODUCTS TABLE
-- ========================
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT,
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  description TEXT,
  category TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  datasheet TEXT,
  in_stock BOOLEAN DEFAULT true,
  stock INTEGER DEFAULT 0,
  badge TEXT,
  specs JSONB DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for category filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);

-- ========================
-- 2. CATEGORIES TABLE
-- ========================
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  product_count INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- 3. ORDERS TABLE
-- ========================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  items JSONB NOT NULL DEFAULT '[]',
  subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
  shipping NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL DEFAULT 0,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  order_status TEXT DEFAULT 'placed' CHECK (order_status IN ('placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  shipping_address JSONB,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_payment ON orders(payment_status);

-- ========================
-- 4. TUTORIALS TABLE
-- ========================
CREATE TABLE IF NOT EXISTS tutorials (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
  category TEXT,
  read_time TEXT,
  difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  images TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tutorials_product ON tutorials(product_id);
CREATE INDEX IF NOT EXISTS idx_tutorials_published ON tutorials(published);

-- ========================
-- 5. USER PROFILES TABLE
-- ========================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- 6. ADDRESSES TABLE
-- ========================
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT DEFAULT 'Home',
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_addresses_user ON addresses(user_id);

-- ========================
-- 7. AUTO-UPDATE TIMESTAMPS
-- ========================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_tutorials_updated_at
  BEFORE UPDATE ON tutorials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ========================
-- 8. AUTO-CREATE PROFILE ON SIGNUP
-- ========================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ========================
-- 9. ROW LEVEL SECURITY (RLS)
-- ========================

-- Products: Public read, admin write
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Products are editable by service role only"
  ON products FOR ALL
  USING (auth.role() = 'service_role');

-- Categories: Public read
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Categories are editable by service role only"
  ON categories FOR ALL
  USING (auth.role() = 'service_role');

-- Orders: Users can see their own orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage all orders"
  ON orders FOR ALL
  USING (auth.role() = 'service_role');

-- Tutorials: Public read for published
ALTER TABLE tutorials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published tutorials are viewable by everyone"
  ON tutorials FOR SELECT
  USING (published = true);

CREATE POLICY "Tutorials are editable by service role only"
  ON tutorials FOR ALL
  USING (auth.role() = 'service_role');

-- Profiles: Users can read/update their own
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Addresses: Users manage their own
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own addresses"
  ON addresses FOR ALL
  USING (auth.uid() = user_id);

-- ========================
-- 10. SEED DATA
-- ========================
INSERT INTO categories (id, name, description, icon, product_count, sort_order) VALUES
  ('buck-converters', 'DC-DC Buck Converters', 'High-efficiency step-down voltage converters for power management', '⚡', 3, 1),
  ('iot-boards', 'IoT Development Boards', 'WiFi & Bluetooth enabled microcontroller boards for IoT', '📡', 1, 2),
  ('modules', 'Control Modules', 'Relay, motor driver, and industrial control modules', '🔧', 1, 3),
  ('accessories', 'Kits & Accessories', 'Sensor kits, cables, and development accessories', '🧰', 1, 4)
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, short_name, price, original_price, description, category, in_stock, stock, badge, specs, features) VALUES
  ('ks-mp1584', 'KS-MP1584 DC-DC Buck Converter', 'KS-MP1584 Buck Converter', 249, 349,
   'High-efficiency adjustable DC-DC step-down converter module based on the MP1584 chip. Perfect for industrial, automotive, and embedded power supply applications.',
   'buck-converters', true, 150, 'Best Seller',
   '{"Input Voltage":"4.5V – 28V DC","Output Voltage":"0.8V – 20V (Adjustable)","Max Output Current":"3A","Conversion Efficiency":"Up to 96%","Switching Frequency":"1.5MHz","Operating Temperature":"-40°C to +85°C","Dimensions":"22mm × 17mm × 4mm","Protection":"Over-current, Thermal Shutdown"}',
   ARRAY['Ultra-compact SMD module design','Wide input voltage range','Trimmable output via on-board potentiometer','Integrated thermal shutdown','Low quiescent current']),

  ('ks-lm2596', 'KS-LM2596 Step-Down Voltage Regulator', 'KS-LM2596 Regulator', 199, 279,
   'Robust step-down voltage regulator module with adjustable output. Ideal for battery-powered systems and solar charge controllers.',
   'buck-converters', true, 200, 'Popular',
   '{"Input Voltage":"4.5V – 40V DC","Output Voltage":"1.23V – 37V (Adjustable)","Max Output Current":"3A (2A recommended)","Conversion Efficiency":"Up to 92%","Switching Frequency":"150kHz","Operating Temperature":"-45°C to +85°C","Dimensions":"42mm × 20mm × 14mm","Protection":"Short Circuit, Thermal"}',
   ARRAY['Wide input/output voltage range','On-board voltage display (optional)','Screw terminal connections','Reverse polarity protection','High power density']),

  ('ks-xl4015', 'KS-XL4015 5A Buck Converter Module', 'KS-XL4015 5A Module', 399, 499,
   'High-current 5A DC-DC buck converter module for demanding power supply applications. Features adjustable voltage and current limiting.',
   'buck-converters', true, 75, 'New',
   '{"Input Voltage":"8V – 36V DC","Output Voltage":"1.25V – 32V (Adjustable)","Max Output Current":"5A","Conversion Efficiency":"Up to 96%","Switching Frequency":"180kHz","Operating Temperature":"-40°C to +85°C","Dimensions":"51mm × 26mm × 14mm","Protection":"OCP, OVP, Thermal"}',
   ARRAY['High current 5A output capability','CC/CV adjustable output','LED charge indicator','Heatsink included','Ideal for lithium battery charging']),

  ('ks-esp32-iot', 'KS-ESP32 IoT Development Board', 'KS-ESP32 IoT Board', 599, 749,
   'Feature-rich ESP32-based IoT development board with integrated sensors, connectivity options, and Kosen power management system.',
   'iot-boards', true, 50, 'Featured',
   '{"Microcontroller":"ESP32-WROOM-32E","Clock Speed":"Dual-core 240MHz","Flash Memory":"4MB","SRAM":"520KB","WiFi":"802.11 b/g/n","Bluetooth":"BLE 4.2","GPIO Pins":"30","Power Supply":"5V USB / 3.3V regulated"}',
   ARRAY['Dual-core Xtensa LX6 processor','Built-in WiFi & Bluetooth','Integrated temperature & humidity sensor','USB-C programming interface','Arduino & MicroPython compatible','Kosen KS-MP1584 onboard power regulation']),

  ('ks-relay-4ch', 'KS-4CH Relay Module', 'KS-4CH Relay Module', 349, 449,
   '4-channel relay module with optocoupler isolation. Designed for industrial automation, home automation, and IoT control applications.',
   'modules', true, 120, NULL,
   '{"Channels":"4","Relay Type":"SPDT (1NO + 1NC)","Coil Voltage":"5V DC","Contact Rating":"10A @ 250VAC / 30VDC","Trigger":"Active Low (with jumper config)","Isolation":"Optocoupler","Dimensions":"75mm × 55mm × 20mm","Indicator":"Per-channel LED"}',
   ARRAY['Optocoupler-isolated inputs','High-current relay contacts','Status LED per channel','Mounting holes included','Arduino / ESP32 compatible']),

  ('ks-sensor-kit', 'KS-Sensor Starter Kit', 'KS-Sensor Kit', 899, 1199,
   'Comprehensive sensor kit for IoT and embedded projects. Includes temperature, humidity, motion, light, and gas sensors with documentation.',
   'accessories', true, 30, 'Bundle',
   '{"Sensors Included":"15","Compatible With":"Arduino, ESP32, Raspberry Pi","Voltage Levels":"3.3V / 5V","Documentation":"Full guide with examples","Connectors":"Dupont & JST","Storage Case":"Included"}',
   ARRAY['DHT22 Temperature & Humidity','PIR Motion Sensor','LDR Light Sensor','MQ-2 Gas Sensor','Ultrasonic Distance Sensor','Complete wiring diagrams included'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO tutorials (id, title, excerpt, product_id, category, read_time, difficulty, published) VALUES
  ('tut-mp1584-guide', 'Getting Started with the KS-MP1584 Buck Converter',
   'Learn how to connect, configure, and optimize your KS-MP1584 for various power supply scenarios.',
   'ks-mp1584', 'Getting Started', '8 min', 'Beginner', true),
  ('tut-esp32-iot', 'Building an IoT Weather Station with KS-ESP32',
   'Step-by-step guide to build a WiFi-connected weather station using the KS-ESP32 IoT Board.',
   'ks-esp32-iot', 'Projects', '15 min', 'Intermediate', true),
  ('tut-solar-charger', 'Solar Battery Charger with KS-XL4015',
   'Design a solar-powered lithium battery charger using the KS-XL4015 CC/CV buck converter.',
   'ks-xl4015', 'Projects', '12 min', 'Intermediate', true),
  ('tut-home-automation', 'Home Automation with KS-4CH Relay & ESP32',
   'Control home appliances remotely using the relay module with ESP32 and a mobile app.',
   'ks-relay-4ch', 'Projects', '20 min', 'Advanced', true)
ON CONFLICT (id) DO NOTHING;
