// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { login } from '../api/auth';

// export default function LoginPage() {
//   const [email, setEmail] = useState('admin@mra.com');
//   const [password, setPassword] = useState('admin123');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   async function handleSubmit(e) {
//     e.preventDefault();
//     try {
//       const data = await login(email, password);
//       localStorage.setItem('token', data.token);
//       navigate('/');
//     } catch (err) {
//       setError(err?.response?.data?.message || 'Login failed');
//     }
//   }

//   return (
//     <div style={{ maxWidth: 400, margin: '80px auto', fontFamily: 'Arial, sans-serif' }}>
//       <h1>MRA Inventory Login</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           style={{ width: '100%', marginBottom: 12, padding: 8 }}
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <input
//           style={{ width: '100%', marginBottom: 12, padding: 8 }}
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <button type="submit">Login</button>
//       </form>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//     </div>
//   );
// }

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Precision Ledger</h1>
        <p className="login-subtitle">Sign in to manage inventory and Shopify synchronization.</p>

        <form onSubmit={handleSubmit} className="form-stack">
          <div className="field">
            <label>Email</label>
            <input
              className="input"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>

          {error && <p className="error-text">{error}</p>}
        </form>
      </div>
    </div>
  );
}