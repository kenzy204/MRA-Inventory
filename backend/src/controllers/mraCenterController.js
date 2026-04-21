const { getPool } = require('../config/db');

//
// COMPANY PROFILE
//

async function getProfile(req, res) {
  try {
    const pool = await getPool();

    const result = await pool.query(`
      SELECT *
      FROM company_profile
      WHERE id = 1
      LIMIT 1
    `);

    res.json(result.rows[0] || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateProfile(req, res) {
  try {
    const {
      name,
      description,
      logo_url,
      logo_position,
      logo_format,
      logo_photo_count,
      address,
      postcode,
      city,
      province,
      country,
      phone,
      phone_secondary,
      website,
      email_contact_forms,
      kvk_number,
      iban_number,
      vat_number,
      bsn_rsin_number
    } = req.body;

    const pool = await getPool();

    await pool.query(
      `
      UPDATE company_profile
      SET
        name = $1,
        description = $2,
        logo_url = $3,
        logo_position = $4,
        logo_format = $5,
        logo_photo_count = $6,
        address = $7,
        postcode = $8,
        city = $9,
        province = $10,
        country = $11,
        phone = $12,
        phone_secondary = $13,
        website = $14,
        email_contact_forms = $15,
        kvk_number = $16,
        iban_number = $17,
        vat_number = $18,
        bsn_rsin_number = $19,
        updated_at = NOW()
      WHERE id = 1
      `,
      [
        name || '',
        description || '',
        logo_url || '',
        logo_position || 'rechtsonder',
        logo_format || 'normaal',
        Number(logo_photo_count || 0),
        address || '',
        postcode || '',
        city || '',
        province || '',
        country || 'Nederland',
        phone || '',
        phone_secondary || '',
        website || '',
        email_contact_forms || '',
        kvk_number || '',
        iban_number || '',
        vat_number || '',
        bsn_rsin_number || ''
      ]
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//
// LOCATIONS
//

async function getLocations(req, res) {
  try {
    const pool = await getPool();

    const result = await pool.query(`
      SELECT *
      FROM store_locations
      ORDER BY is_main DESC, id ASC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createLocation(req, res) {
  try {
    const {
      parent_id,
      name,
      address,
      postcode,
      city,
      province,
      country,
      phone,
      phone_secondary,
      website
    } = req.body;

    const pool = await getPool();

    const result = await pool.query(
      `
      INSERT INTO store_locations (
        parent_id,
        name,
        address,
        postcode,
        city,
        province,
        country,
        phone,
        phone_secondary,
        website,
        updated_at
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW()
      )
      RETURNING *
      `,
      [
        parent_id || 1,
        name,
        address || '',
        postcode || '',
        city || '',
        province || '',
        country || 'Nederland',
        phone || '',
        phone_secondary || '',
        website || ''
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateLocation(req, res) {
  try {
    const id = req.params.id;

    const {
      name,
      address,
      postcode,
      city,
      province,
      country,
      phone,
      phone_secondary,
      website
    } = req.body;

    const pool = await getPool();

    const result = await pool.query(
      `
      UPDATE store_locations
      SET
        name = $1,
        address = $2,
        postcode = $3,
        city = $4,
        province = $5,
        country = $6,
        phone = $7,
        phone_secondary = $8,
        website = $9,
        updated_at = NOW()
      WHERE id = $10
      RETURNING *
      `,
      [
        name,
        address || '',
        postcode || '',
        city || '',
        province || '',
        country || 'Nederland',
        phone || '',
        phone_secondary || '',
        website || '',
        id
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: 'Location not found'
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteLocation(req, res) {
  try {
    const id = req.params.id;

    const pool = await getPool();

    const result = await pool.query(
      `
      DELETE FROM store_locations
      WHERE id = $1
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: 'Location not found'
      });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//
// OPENING HOURS
//

async function getOpeningHours(req, res) {
  try {
    const locationId = req.params.locationId;
    const pool = await getPool();

    const result = await pool.query(
      `
      SELECT *
      FROM store_opening_hours
      WHERE location_id = $1
      ORDER BY day_of_week ASC
      `,
      [locationId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateOpeningHours(req, res) {
  try {
    const locationId = req.params.locationId;
    const rows = req.body.rows || [];

    const pool = await getPool();

    await pool.query(
      `
      DELETE FROM store_opening_hours
      WHERE location_id = $1
      `,
      [locationId]
    );

    for (const row of rows) {
      await pool.query(
        `
        INSERT INTO store_opening_hours (
          location_id,
          day_of_week,
          open_time,
          close_time
        )
        VALUES ($1,$2,$3,$4)
        `,
        [
          locationId,
          row.day_of_week,
          row.open_time,
          row.close_time
        ]
      );
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getProfile,
  updateProfile,
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
  getOpeningHours,
  updateOpeningHours
};
