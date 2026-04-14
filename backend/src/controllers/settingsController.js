// const { getPool, sql } = require('../config/db');

// async function getSettings(req, res) {
//   try {
//     const pool = await getPool();
//     const result = await pool.request().query('SELECT TOP 1 * FROM settings ORDER BY id ASC');
//     res.json(result.recordset[0] || {});
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

// async function updateSettings(req, res) {
//   try {
//     const { shopify_store_url, shopify_access_token, shopify_location_id } = req.body;

//     const pool = await getPool();
//     await pool.request()
//       .input('shopify_store_url', sql.NVarChar, shopify_store_url || null)
//       .input('shopify_access_token', sql.NVarChar, shopify_access_token || null)
//       .input('shopify_location_id', sql.NVarChar, shopify_location_id || null)
//       .query(`
//         UPDATE settings
//         SET
//           shopify_store_url = @shopify_store_url,
//           shopify_access_token = @shopify_access_token,
//           shopify_location_id = @shopify_location_id,
//           updated_at = GETDATE()
//         WHERE id = 1
//       `);

//     res.json({ success: true });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

// module.exports = {
//   getSettings,
//   updateSettings
// };


const { getPool } = require('../config/db');

async function getSettings(req, res) {
  try {
    const pool = await getPool();
    const result = await pool.query(
      'SELECT * FROM settings ORDER BY id ASC LIMIT 1'
    );

    res.json(result.rows[0] || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateSettings(req, res) {
  try {
    const { shopify_store_url, shopify_access_token, shopify_location_id } = req.body;

    const pool = await getPool();
    await pool.query(
      `
        UPDATE settings
        SET
          shopify_store_url = $1,
          shopify_access_token = $2,
          shopify_location_id = $3,
          updated_at = NOW()
        WHERE id = 1
      `,
      [
        shopify_store_url || null,
        shopify_access_token || null,
        shopify_location_id || null
      ]
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getSettings,
  updateSettings
};