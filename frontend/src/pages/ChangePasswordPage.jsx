import { useState } from 'react';
import { changePassword } from '../api/auth';

export default function ChangePasswordPage() {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const result = await changePassword(form);

      setMessage(result.message || 'Password changed successfully');

      setForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="settings-grid">
      <div className="form-card">
        <h3 style={{ marginTop: 0 }}>Wachtwoord wijzigen</h3>
        <p style={{ color: 'var(--muted)', marginTop: 0 }}>
          Werk hier veilig je accountwachtwoord bij.
        </p>

        <form onSubmit={handleSubmit} className="form-stack">
          <div className="field">
            <label>Huidig wachtwoord</label>
            <input
              className="input"
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label>Nieuw wachtwoord</label>
            <input
              className="input"
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>

          <div className="field">
            <label>Bevestig nieuw wachtwoord</label>
            <input
              className="input"
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>

          {message && (
            <p style={{ color: 'var(--success)', fontWeight: 700, margin: 0 }}>
              {message}
            </p>
          )}

          {error && <p className="error-text">{error}</p>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button
              type="button"
              className="secondary-btn"
              onClick={() =>
                setForm({
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: ''
                })
              }
            >
              Reset
            </button>

            <button className="primary-btn" type="submit" disabled={saving}>
              {saving ? 'Opslaan...' : 'Wachtwoord opslaan'}
            </button>
          </div>
        </form>
      </div>

      <div className="sync-summary-card">
        <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 12 }}>
          Veiligheid
        </div>

        <div className="big-number">8+</div>
        <div style={{ marginTop: 8, opacity: 0.8 }}>
          Gebruik minimaal 8 tekens voor je nieuwe wachtwoord
        </div>

        <div className="inline-pills" style={{ marginTop: 20 }}>
          <div className="pill">Sterk wachtwoord</div>
          <div className="pill">Veilig account</div>
        </div>
      </div>
    </div>
  );
}
