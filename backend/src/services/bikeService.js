// const { getPool, sql } = require('../config/db');

// async function getAllBikes() {
//   const pool = await getPool();
//   const result = await pool.request().query(`
//     SELECT * FROM bikes
//     WHERE is_deleted = 0
//     ORDER BY id DESC
//   `);
//   return result.recordset;
// }

// async function getBikeById(id) {
//   const pool = await getPool();

//   const bikeResult = await pool.request()
//     .input('id', sql.Int, id)
//     .query('SELECT * FROM bikes WHERE id = @id');

//   const bike = bikeResult.recordset[0];
//   if (!bike) return null;

//   const imageResult = await pool.request()
//     .input('bikeId', sql.Int, id)
//     .query('SELECT * FROM bike_images WHERE bike_id = @bikeId ORDER BY sort_order ASC, id ASC');

//   bike.images = imageResult.recordset;
//   return bike;
// }

// async function createBike(data) {
//   const pool = await getPool();

//   const result = await pool.request()
//     .input('brand', sql.NVarChar, data.brand)
//     .input('model', sql.NVarChar, data.model)
//     .input('title', sql.NVarChar, data.title || null)
//     .input('description', sql.NVarChar(sql.MAX), data.description || null)
//     .input('price', sql.Decimal(10, 2), Number(data.price || 0))
//     .input('stock', sql.Int, Number(data.stock || 0))
//     .input('condition', sql.NVarChar, data.condition || 'used')
//     .input('mileage', sql.Int, data.mileage ? Number(data.mileage) : null)
//     .input('motor_type', sql.NVarChar, data.motor_type || null)
//     .input('battery_capacity', sql.NVarChar, data.battery_capacity || null)
//     .input('range_km', sql.NVarChar, data.range_km || null)
//     .input('frame_type', sql.NVarChar, data.frame_type || null)
//     .input('frame_size', sql.NVarChar, data.frame_size || null)
//     .input('brakes', sql.NVarChar, data.brakes || null)
//     .input('suspension', sql.NVarChar, data.suspension || null)
//     .input('tires', sql.NVarChar, data.tires || null)
//     .input('display', sql.NVarChar, data.display || null)
//     .input('drivetrain', sql.NVarChar, data.drivetrain || null)
//     .input('sku', sql.NVarChar, data.sku || null)
//     .input('tags', sql.NVarChar(sql.MAX), data.tags || null)
//     .query(`
//       INSERT INTO bikes (
//         brand, model, title, description, price, stock, condition, mileage,
//         motor_type, battery_capacity, range_km, frame_type, frame_size,
//         brakes, suspension, tires, display, drivetrain, sku, tags
//       )
//       OUTPUT INSERTED.id
//       VALUES (
//         @brand, @model, @title, @description, @price, @stock, @condition, @mileage,
//         @motor_type, @battery_capacity, @range_km, @frame_type, @frame_size,
//         @brakes, @suspension, @tires, @display, @drivetrain, @sku, @tags
//       )
//     `);

//   return result.recordset[0].id;
// }

// async function updateBike(id, data) {
//   const pool = await getPool();

//   await pool.request()
//     .input('id', sql.Int, id)
//     .input('brand', sql.NVarChar, data.brand)
//     .input('model', sql.NVarChar, data.model)
//     .input('title', sql.NVarChar, data.title || null)
//     .input('description', sql.NVarChar(sql.MAX), data.description || null)
//     .input('price', sql.Decimal(10, 2), Number(data.price || 0))
//     .input('stock', sql.Int, Number(data.stock || 0))
//     .input('condition', sql.NVarChar, data.condition || 'used')
//     .input('mileage', sql.Int, data.mileage ? Number(data.mileage) : null)
//     .input('motor_type', sql.NVarChar, data.motor_type || null)
//     .input('battery_capacity', sql.NVarChar, data.battery_capacity || null)
//     .input('range_km', sql.NVarChar, data.range_km || null)
//     .input('frame_type', sql.NVarChar, data.frame_type || null)
//     .input('frame_size', sql.NVarChar, data.frame_size || null)
//     .input('brakes', sql.NVarChar, data.brakes || null)
//     .input('suspension', sql.NVarChar, data.suspension || null)
//     .input('tires', sql.NVarChar, data.tires || null)
//     .input('display', sql.NVarChar, data.display || null)
//     .input('drivetrain', sql.NVarChar, data.drivetrain || null)
//     .input('sku', sql.NVarChar, data.sku || null)
//     .input('tags', sql.NVarChar(sql.MAX), data.tags || null)
//     .query(`
//       UPDATE bikes
//       SET
//         brand = @brand,
//         model = @model,
//         title = @title,
//         description = @description,
//         price = @price,
//         stock = @stock,
//         condition = @condition,
//         mileage = @mileage,
//         motor_type = @motor_type,
//         battery_capacity = @battery_capacity,
//         range_km = @range_km,
//         frame_type = @frame_type,
//         frame_size = @frame_size,
//         brakes = @brakes,
//         suspension = @suspension,
//         tires = @tires,
//         display = @display,
//         drivetrain = @drivetrain,
//         sku = @sku,
//         tags = @tags,
//         updated_at = GETDATE(),
//         sync_status = 'pending'
//       WHERE id = @id
//     `);
// }

// async function softDeleteBike(id) {
//   const pool = await getPool();
//   await pool.request()
//     .input('id', sql.Int, id)
//     .query(`
//       UPDATE bikes
//       SET is_deleted = 1, sync_status = 'pending', updated_at = GETDATE()
//       WHERE id = @id
//     `);
// }

// async function addBikeImage(bikeId, imageUrl) {
//   const pool = await getPool();
//   await pool.request()
//     .input('bikeId', sql.Int, bikeId)
//     .input('imageUrl', sql.NVarChar, imageUrl)
//     .query(`
//       INSERT INTO bike_images (bike_id, image_url, sort_order)
//       VALUES (@bikeId, @imageUrl, 0)
//     `);
// }

// async function updateSyncData(id, data) {
//   const pool = await getPool();

//   await pool.request()
//     .input('id', sql.Int, id)
//     .input('shopify_product_id', sql.NVarChar, data.shopify_product_id || null)
//     .input('shopify_variant_id', sql.NVarChar, data.shopify_variant_id || null)
//     .input('shopify_inventory_item_id', sql.NVarChar, data.shopify_inventory_item_id || null)
//     .input('sync_status', sql.NVarChar, data.sync_status || 'pending')
//     .query(`
//       UPDATE bikes
//       SET
//         shopify_product_id = COALESCE(@shopify_product_id, shopify_product_id),
//         shopify_variant_id = COALESCE(@shopify_variant_id, shopify_variant_id),
//         shopify_inventory_item_id = COALESCE(@shopify_inventory_item_id, shopify_inventory_item_id),
//         sync_status = @sync_status,
//         last_synced_at = GETDATE(),
//         updated_at = GETDATE()
//       WHERE id = @id
//     `);
// }

// module.exports = {
//   getAllBikes,
//   getBikeById,
//   createBike,
//   updateBike,
//   softDeleteBike,
//   addBikeImage,
//   updateSyncData
// };


const { getPool } = require('../config/db');

async function getAllBikes() {
  const pool = await getPool();

  const result = await pool.query(`
    SELECT *
    FROM bikes
    WHERE is_deleted = false
    ORDER BY id DESC
  `);

  return result.rows;
}

async function getBikeById(id) {
  const pool = await getPool();

  const bikeResult = await pool.query(
    'SELECT * FROM bikes WHERE id = $1',
    [id]
  );

  const bike = bikeResult.rows[0];
  if (!bike) return null;

  const imageResult = await pool.query(
    `
      SELECT *
      FROM bike_images
      WHERE bike_id = $1
      ORDER BY sort_order ASC, id ASC
    `,
    [id]
  );

  bike.images = imageResult.rows;
  return bike;
}

async function createBike(data) {
  const pool = await getPool();

  const result = await pool.query(
    `
      INSERT INTO bikes (
        brand, model, title, description, price, stock, condition, mileage,
        motor_type, battery_capacity, range_km, frame_type, frame_size,
        brakes, suspension, tires, display, drivetrain, sku, tags
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,
        $9,$10,$11,$12,$13,
        $14,$15,$16,$17,$18,$19,$20
      )
      RETURNING id
    `,
    [
      data.brand,
      data.model,
      data.title || null,
      data.description || null,
      Number(data.price || 0),
      Number(data.stock || 0),
      data.condition || 'used',
      data.mileage ? Number(data.mileage) : null,
      data.motor_type || null,
      data.battery_capacity || null,
      data.range_km || null,
      data.frame_type || null,
      data.frame_size || null,
      data.brakes || null,
      data.suspension || null,
      data.tires || null,
      data.display || null,
      data.drivetrain || null,
      data.sku || null,
      data.tags || null
    ]
  );

  return result.rows[0].id;
}

async function updateBike(id, data) {
  const pool = await getPool();

  await pool.query(
    `
      UPDATE bikes
      SET
        brand = $1,
        model = $2,
        title = $3,
        description = $4,
        price = $5,
        stock = $6,
        condition = $7,
        mileage = $8,
        motor_type = $9,
        battery_capacity = $10,
        range_km = $11,
        frame_type = $12,
        frame_size = $13,
        brakes = $14,
        suspension = $15,
        tires = $16,
        display = $17,
        drivetrain = $18,
        sku = $19,
        tags = $20,
        updated_at = NOW(),
        sync_status = 'pending'
      WHERE id = $21
    `,
    [
      data.brand,
      data.model,
      data.title || null,
      data.description || null,
      Number(data.price || 0),
      Number(data.stock || 0),
      data.condition || 'used',
      data.mileage ? Number(data.mileage) : null,
      data.motor_type || null,
      data.battery_capacity || null,
      data.range_km || null,
      data.frame_type || null,
      data.frame_size || null,
      data.brakes || null,
      data.suspension || null,
      data.tires || null,
      data.display || null,
      data.drivetrain || null,
      data.sku || null,
      data.tags || null,
      id
    ]
  );
}

async function softDeleteBike(id) {
  const pool = await getPool();

  await pool.query(
    `
      UPDATE bikes
      SET
        is_deleted = true,
        sync_status = 'pending',
        updated_at = NOW()
      WHERE id = $1
    `,
    [id]
  );
}

async function addBikeImage(bikeId, imageUrl) {
  const pool = await getPool();

  await pool.query(
    `
      INSERT INTO bike_images (bike_id, image_url, sort_order)
      VALUES ($1, $2, 0)
    `,
    [bikeId, imageUrl]
  );
}

async function updateSyncData(id, data) {
  const pool = await getPool();

  await pool.query(
    `
      UPDATE bikes
      SET
        shopify_product_id = COALESCE($1, shopify_product_id),
        shopify_variant_id = COALESCE($2, shopify_variant_id),
        shopify_inventory_item_id = COALESCE($3, shopify_inventory_item_id),
        sync_status = $4,
        last_synced_at = NOW(),
        updated_at = NOW()
      WHERE id = $5
    `,
    [
      data.shopify_product_id || null,
      data.shopify_variant_id || null,
      data.shopify_inventory_item_id || null,
      data.sync_status || 'pending',
      id
    ]
  );
}

module.exports = {
  getAllBikes,
  getBikeById,
  createBike,
  updateBike,
  softDeleteBike,
  addBikeImage,
  updateSyncData
};