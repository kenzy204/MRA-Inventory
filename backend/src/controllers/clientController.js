const { getPool } = require('../config/db');

async function getClients(req, res) {
  try {
    const search = String(req.query.search || '').trim();
    const pool = await getPool();

    let result;

    if (search) {
      const q = `%${search}%`;

      result = await pool.query(
        `
          SELECT *
          FROM clients
          WHERE
            COALESCE(voornaam, '') ILIKE $1 OR
            COALESCE(achternaam, '') ILIKE $1 OR
            COALESCE(bedrijfsnaam, '') ILIKE $1 OR
            COALESCE(email, '') ILIKE $1 OR
            COALESCE(plaatsnaam, '') ILIKE $1
          ORDER BY id DESC
        `,
        [q]
      );
    } else {
      result = await pool.query(`
        SELECT *
        FROM clients
        ORDER BY id DESC
      `);
    }

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getClient(req, res) {
  try {
    const pool = await getPool();
    const result = await pool.query(
      `
        SELECT *
        FROM clients
        WHERE id = $1
        LIMIT 1
      `,
      [req.params.id]
    );

    const client = result.rows[0];

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createClient(req, res) {
  try {
    const {
      client_type,
      aanhef,
      voornaam,
      achternaam,
      bedrijfsnaam,
      email,
      telefoonnummer,
      postcode,
      huisnummer,
      adres,
      plaatsnaam,
      land,
      opmerkingen
    } = req.body;

    const pool = await getPool();

    const result = await pool.query(
      `
        INSERT INTO clients (
          client_type,
          aanhef,
          voornaam,
          achternaam,
          bedrijfsnaam,
          email,
          telefoonnummer,
          postcode,
          huisnummer,
          adres,
          plaatsnaam,
          land,
          opmerkingen,
          updated_at
        )
        VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,NOW()
        )
        RETURNING *
      `,
      [
        client_type || 'particulier',
        aanhef || null,
        voornaam || null,
        achternaam || null,
        bedrijfsnaam || null,
        email || null,
        telefoonnummer || null,
        postcode || null,
        huisnummer || null,
        adres || null,
        plaatsnaam || null,
        land || 'Nederland',
        opmerkingen || null
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteClient(req, res) {
  try {
    const pool = await getPool();

    const result = await pool.query(
      `
        DELETE FROM clients
        WHERE id = $1
      `,
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getClients,
  getClient,
  createClient,
  deleteClient
};
