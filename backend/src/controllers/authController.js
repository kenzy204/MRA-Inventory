// const jwt = require('jsonwebtoken');
// const { getPool, sql } = require('../config/db');
// const { comparePassword } = require('../utils/password');

// async function login(req, res) {
//   try {
//     const { email, password } = req.body;

//     const pool = await getPool();
//     const result = await pool.request()
//       .input('email', sql.NVarChar, email)
//       .query('SELECT TOP 1 * FROM users WHERE email = @email');

//     const user = result.recordset[0];

//     if (!user) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const valid = await comparePassword(password, user.password_hash);

//     if (!valid) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const token = jwt.sign(
//       {
//         id: user.id,
//         email: user.email,
//         role: user.role
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     res.json({
//       token,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

// module.exports = { login };

const jwt = require('jsonwebtoken');
const { getPool } = require('../config/db');
const { comparePassword } = require('../utils/password');

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const pool = await getPool();
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 LIMIT 1',
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const valid = await comparePassword(password, user.password_hash);

    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { login };