const { getPool } = require('./config/db');

async function seed() {
  const pool = await getPool();

  await pool.query(`
    INSERT INTO settings (id)
    VALUES (1)
    ON CONFLICT (id) DO NOTHING;
  `);

  await pool.query(
    `
      INSERT INTO users (name, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING
    `,
    [
      'Admin',
      'admin@example.com',
      '$2b$10$3QPpc7hl/PQ1ntxp60ia7u2CCjjLtMxATD15ifFi4DchmqdKkNXyS',
      'admin'
    ]
  );

  console.log('Admin seeded ✅');
  process.exit();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});