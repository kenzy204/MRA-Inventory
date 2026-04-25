const { getPool } = require('../config/db');

async function getStickers(req, res) {
  try {
    const pool = await getPool();
    const result = await pool.query(`
      SELECT *
      FROM photo_stickers
      ORDER BY id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createSticker(req, res) {
  try {
    const {
      title,
      category,
      size,
      photo_count
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Sticker image is required' });
    }

    const imageUrl = req.file.path;
    const pool = await getPool();

    const result = await pool.query(
      `
      INSERT INTO photo_stickers (
        title,
        category,
        image_url,
        size,
        photo_count,
        is_active,
        updated_at
      )
      VALUES ($1,$2,$3,$4,$5,true,NOW())
      RETURNING *
      `,
      [
        title,
        category || 'linksboven',
        imageUrl,
        size || 'groot',
        Number(photo_count || 0)
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function toggleSticker(req, res) {
  try {
    const pool = await getPool();

    const result = await pool.query(
      `
      UPDATE photo_stickers
      SET
        is_active = NOT is_active,
        updated_at = NOW()
      WHERE id = $1
      RETURNING *
      `,
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Sticker not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteSticker(req, res) {
  try {
    const pool = await getPool();

    const result = await pool.query(
      `
      DELETE FROM photo_stickers
      WHERE id = $1
      `,
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Sticker not found' });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getStickers,
  createSticker,
  toggleSticker,
  deleteSticker
};
