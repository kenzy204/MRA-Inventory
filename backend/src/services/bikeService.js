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
        brand,
        model,
        title,
        description,
        price,
        stock,
        sku,
        tags,
        condition,

        kilometerstand,
        km_s,

        merk,
        type,
        positie,
        koppel_motor_nm,
        type_aandrijving,

        accu_capaciteit_wh,
        accu_positie,
        accu_uitneembaar,
        accu,

        type_remmen,
        merk_remmen,
        remmen,

        display_merk,
        display_type,
        display,

        voorvork_vering_aanwezig,
        voorvork_vering_type,
        verende_zadelpen_aanwezig,
        verende_zadelpen_type,
        zadelvering,
        vering,

        bandmerk,
        bandmodel,
        anti_lek_banden,
        bandbreedte,
        banden,

        frame_size,
        type_frame,
        framemateriaal,
        frame,

        wielmaat,

        aantal_sleutels,
        fabrieksgarantie
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,
        $10,$11,
        $12,$13,$14,$15,$16,
        $17,$18,$19,$20,
        $21,$22,$23,
        $24,$25,$26,
        $27,$28,$29,$30,$31,$32,
        $33,$34,$35,$36,$37,
        $38,$39,$40,$41,
        $42,
        $43,$44
      )
      RETURNING id
    `,
    [
      data.brand || null,
      data.model || null,
      data.title || null,
      data.description || null,
      Number(data.price || 0),
      Number(data.stock || 0),
      data.sku || null,
      data.tags || null,
      data.condition || 'used',

      data.kilometerstand !== undefined && data.kilometerstand !== null && data.kilometerstand !== ''
        ? Number(data.kilometerstand)
        : null,
      data.km_s || null,

      data.merk || null,
      data.type || null,
      data.positie || null,
      data.koppel_motor_nm !== undefined && data.koppel_motor_nm !== null && data.koppel_motor_nm !== ''
        ? Number(data.koppel_motor_nm)
        : null,
      data.type_aandrijving || null,

      data.accu_capaciteit_wh !== undefined && data.accu_capaciteit_wh !== null && data.accu_capaciteit_wh !== ''
        ? Number(data.accu_capaciteit_wh)
        : null,
      data.accu_positie || null,
      data.accu_uitneembaar || null,
      data.accu || null,

      data.type_remmen || null,
      data.merk_remmen || null,
      data.remmen || null,

      data.display_merk || null,
      data.display_type || null,
      data.display || null,

      data.voorvork_vering_aanwezig || null,
      data.voorvork_vering_type || null,
      data.verende_zadelpen_aanwezig || null,
      data.verende_zadelpen_type || null,
      data.zadelvering || null,
      data.vering || null,

      data.bandmerk || null,
      data.bandmodel || null,
      data.anti_lek_banden || null,
      data.bandbreedte || null,
      data.banden || null,

      data.frame_size !== undefined && data.frame_size !== null && data.frame_size !== ''
        ? Number(data.frame_size)
        : null,
      data.type_frame || null,
      data.framemateriaal || null,
      data.frame || null,

      data.wielmaat || null,

      data.aantal_sleutels !== undefined && data.aantal_sleutels !== null && data.aantal_sleutels !== ''
        ? Number(data.aantal_sleutels)
        : null,
      data.fabrieksgarantie || null
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
        sku = $7,
        tags = $8,
        condition = $9,

        kilometerstand = $10,
        km_s = $11,

        merk = $12,
        type = $13,
        positie = $14,
        koppel_motor_nm = $15,
        type_aandrijving = $16,

        accu_capaciteit_wh = $17,
        accu_positie = $18,
        accu_uitneembaar = $19,
        accu = $20,

        type_remmen = $21,
        merk_remmen = $22,
        remmen = $23,

        display_merk = $24,
        display_type = $25,
        display = $26,

        voorvork_vering_aanwezig = $27,
        voorvork_vering_type = $28,
        verende_zadelpen_aanwezig = $29,
        verende_zadelpen_type = $30,
        zadelvering = $31,
        vering = $32,

        bandmerk = $33,
        bandmodel = $34,
        anti_lek_banden = $35,
        bandbreedte = $36,
        banden = $37,

        frame_size = $38,
        type_frame = $39,
        framemateriaal = $40,
        frame = $41,

        wielmaat = $42,

        aantal_sleutels = $43,
        fabrieksgarantie = $44,

        updated_at = NOW(),
        sync_status = 'pending'
      WHERE id = $45
    `,
    [
      data.brand || null,
      data.model || null,
      data.title || null,
      data.description || null,
      Number(data.price || 0),
      Number(data.stock || 0),
      data.sku || null,
      data.tags || null,
      data.condition || 'used',

      data.kilometerstand !== undefined && data.kilometerstand !== null && data.kilometerstand !== ''
        ? Number(data.kilometerstand)
        : null,
      data.km_s || null,

      data.merk || null,
      data.type || null,
      data.positie || null,
      data.koppel_motor_nm !== undefined && data.koppel_motor_nm !== null && data.koppel_motor_nm !== ''
        ? Number(data.koppel_motor_nm)
        : null,
      data.type_aandrijving || null,

      data.accu_capaciteit_wh !== undefined && data.accu_capaciteit_wh !== null && data.accu_capaciteit_wh !== ''
        ? Number(data.accu_capaciteit_wh)
        : null,
      data.accu_positie || null,
      data.accu_uitneembaar || null,
      data.accu || null,

      data.type_remmen || null,
      data.merk_remmen || null,
      data.remmen || null,

      data.display_merk || null,
      data.display_type || null,
      data.display || null,

      data.voorvork_vering_aanwezig || null,
      data.voorvork_vering_type || null,
      data.verende_zadelpen_aanwezig || null,
      data.verende_zadelpen_type || null,
      data.zadelvering || null,
      data.vering || null,

      data.bandmerk || null,
      data.bandmodel || null,
      data.anti_lek_banden || null,
      data.bandbreedte || null,
      data.banden || null,

      data.frame_size !== undefined && data.frame_size !== null && data.frame_size !== ''
        ? Number(data.frame_size)
        : null,
      data.type_frame || null,
      data.framemateriaal || null,
      data.frame || null,

      data.wielmaat || null,

      data.aantal_sleutels !== undefined && data.aantal_sleutels !== null && data.aantal_sleutels !== ''
        ? Number(data.aantal_sleutels)
        : null,
      data.fabrieksgarantie || null,

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
