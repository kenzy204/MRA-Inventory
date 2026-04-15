


const express = require('express');
const cors = require('cors');
const path = require('path');

const { getPool } = require('./config/db');
const { shopifyGraphQL } = require('./services/shopifyService');

const authRoutes = require('./routes/authRoutes');
const bikeRoutes = require('./routes/bikeRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const syncRoutes = require('./routes/syncRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const clientRoutes = require('./routes/clientRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Backend is running' });
});

app.get('/api/db-test', async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool.query(`
      SELECT NOW() AS currentDateTime,
             current_database() AS databaseName
    `);

    res.json({
      ok: true,
      db: 'connected',
      result: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      db: 'failed',
      message: error.message
    });
  }
});

app.get('/api/shopify-test', async (req, res) => {
  try {
    const query = `
      query {
        products(first: 5) {
          edges {
            node {
              id
              title
            }
          }
        }
      }
    `;

    const data = await shopifyGraphQL(query);
    res.json({ ok: true, data });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/bikes', bikeRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/clients', clientRoutes);

module.exports = app;
