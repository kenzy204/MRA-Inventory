const { getPool } = require('./config/db');

async function init() {
  const pool = await getPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role VARCHAR(50) DEFAULT 'admin',
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS settings (
      id SERIAL PRIMARY KEY,
      shopify_store_url VARCHAR(255),
      shopify_access_token TEXT,
      shopify_location_id VARCHAR(255),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS bikes (
      id SERIAL PRIMARY KEY,
      brand VARCHAR(255),
      model VARCHAR(255),
      title VARCHAR(255),
      description TEXT,
      price NUMERIC(10,2) DEFAULT 0,
      stock INTEGER DEFAULT 0,
      condition VARCHAR(50) DEFAULT 'used',
      mileage INTEGER,
      motor_type VARCHAR(255),
      battery_capacity VARCHAR(255),
      range_km VARCHAR(255),
      frame_type VARCHAR(255),
      frame_size VARCHAR(255),
      brakes VARCHAR(255),
      suspension VARCHAR(255),
      tires VARCHAR(255),
      display VARCHAR(255),
      drivetrain VARCHAR(255),
      sku VARCHAR(255),
      tags TEXT,
      is_deleted BOOLEAN DEFAULT false,
      sync_status VARCHAR(50) DEFAULT 'pending',
      shopify_product_id VARCHAR(255),
      shopify_variant_id VARCHAR(255),
      shopify_inventory_item_id VARCHAR(255),
      last_synced_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS bike_images (
      id SERIAL PRIMARY KEY,
      bike_id INTEGER REFERENCES bikes(id) ON DELETE CASCADE,
      image_url TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS sync_logs (
      id SERIAL PRIMARY KEY,
      bike_id INTEGER,
      action_type VARCHAR(50),
      sync_status VARCHAR(50),
      message TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    INSERT INTO settings (id)
    VALUES (1)
    ON CONFLICT (id) DO NOTHING;
  `);

  console.log('Database initialized ✅');
  process.exit();
}

init().catch((err) => {
  console.error(err);
  process.exit(1);
});