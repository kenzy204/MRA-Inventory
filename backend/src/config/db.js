// const sql = require('mssql');
// require('dotenv').config();

// const dbConfig = {
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   server: process.env.DB_SERVER,
//   database: process.env.DB_DATABASE,
//   port: Number(process.env.DB_PORT || 1433),
//   options: {
//     encrypt: false,
//     trustServerCertificate: true
//   }
// };

// let pool;

// async function getPool() {
//   if (pool) return pool;
//   pool = await sql.connect(dbConfig);
//   return pool;
// }

// module.exports = { sql, getPool };
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false
});

pool.on('error', (err) => {
  console.error('Unexpected Postgres error:', err);
});

async function getPool() {
  return pool;
}

module.exports = { pool, getPool };