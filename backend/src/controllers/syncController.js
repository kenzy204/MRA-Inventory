// const { getPool } = require('../config/db');
// const { syncBike } = require('../services/syncService');

// async function manualSync(req, res) {
//   try {
//     await syncBike(req.params.bikeId, 'manual');
//     res.json({ success: true });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

// async function getSyncLogs(req, res) {
//   try {
//     const pool = await getPool();
//     const result = await pool.request().query(`
//       SELECT TOP 100 *
//       FROM sync_logs
//       ORDER BY id DESC
//     `);
//     res.json(result.recordset);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

// module.exports = {
//   manualSync,
//   getSyncLogs
// };


const { getPool } = require('../config/db');
const { syncBike } = require('../services/syncService');

async function manualSync(req, res) {
  try {
    await syncBike(req.params.bikeId, 'manual');
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getSyncLogs(req, res) {
  try {
    const pool = await getPool();

    const result = await pool.query(`
      SELECT *
      FROM sync_logs
      ORDER BY id DESC
      LIMIT 100
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  manualSync,
  getSyncLogs
};