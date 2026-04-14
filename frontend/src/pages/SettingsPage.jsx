// import { useEffect, useState } from 'react';
// import { getSettings, updateSettings } from '../api/settings';

// export default function SettingsPage() {
//   const [form, setForm] = useState({
//     shopify_store_url: '',
//     shopify_access_token: '',
//     shopify_location_id: ''
//   });

//   useEffect(() => {
//     getSettings().then((data) => {
//       setForm({
//         shopify_store_url: data.shopify_store_url || '',
//         shopify_access_token: data.shopify_access_token || '',
//         shopify_location_id: data.shopify_location_id || ''
//       });
//     });
//   }, []);

//   async function save(e) {
//     e.preventDefault();
//     await updateSettings(form);
//     alert('Saved');
//   }

//   return (
//     <div>
//       <h1>Shopify Settings</h1>
//       <form onSubmit={save}>
//         <div style={{ marginBottom: 12 }}>
//           <label>Store URL</label>
//           <input
//             style={{ width: '100%', padding: 8 }}
//             placeholder="your-store.myshopify.com"
//             value={form.shopify_store_url}
//             onChange={(e) => setForm({ ...form, shopify_store_url: e.target.value })}
//           />
//         </div>

//         <div style={{ marginBottom: 12 }}>
//           <label>Access Token</label>
//           <input
//             style={{ width: '100%', padding: 8 }}
//             value={form.shopify_access_token}
//             onChange={(e) => setForm({ ...form, shopify_access_token: e.target.value })}
//           />
//         </div>

//         <div style={{ marginBottom: 12 }}>
//           <label>Location ID</label>
//           <input
//             style={{ width: '100%', padding: 8 }}
//             value={form.shopify_location_id}
//             onChange={(e) => setForm({ ...form, shopify_location_id: e.target.value })}
//           />
//         </div>

//         <button type="submit">Save Settings</button>
//       </form>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import { getSettings, updateSettings } from '../api/settings';

export default function SettingsPage() {
  const [form, setForm] = useState({
    shopify_store_url: '',
    shopify_access_token: '',
    shopify_location_id: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await getSettings();
        setForm({
          shopify_store_url: data.shopify_store_url || '',
          shopify_access_token: data.shopify_access_token || '',
          shopify_location_id: data.shopify_location_id || ''
        });
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      await updateSettings(form);
      setMessage('Credentials saved successfully.');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading settings...</p>;

  return (
    <div className="settings-grid">
      <div className="form-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start' }}>
          <div>
            <div className="pill green" style={{ display: 'inline-flex', marginBottom: 12 }}>
              Sync Status
            </div>
            <h3 style={{ marginTop: 0 }}>API Connection: Connected</h3>
            <p style={{ color: 'var(--muted)', marginTop: 0 }}>
              Configure your Shopify credentials and location mapping for inventory sync.
            </p>
          </div>
        </div>

        <div className="inline-pills">
          <div className="pill green">Live Sync Enabled</div>
          <div className="pill">0.4s Latency</div>
        </div>

        <form onSubmit={save} style={{ marginTop: 24 }}>
          <div className="field-grid-2">
            <div className="field">
              <label>Shopify Store URL</label>
              <input
                className="input"
                name="shopify_store_url"
                placeholder="your-store.myshopify.com"
                value={form.shopify_store_url}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Admin Access Token</label>
              <input
                className="input"
                type="password"
                name="shopify_access_token"
                value={form.shopify_access_token}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="field" style={{ marginTop: 14 }}>
            <label>Location ID</label>
            <input
              className="input"
              name="shopify_location_id"
              value={form.shopify_location_id}
              onChange={handleChange}
            />
          </div>

          {message && (
            <p style={{ color: 'var(--success)', fontWeight: 700, marginTop: 16 }}>{message}</p>
          )}

          {error && <p className="error-text">{error}</p>}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 18 }}>
            <button
              className="secondary-btn"
              type="button"
              onClick={() =>
                setForm({
                  shopify_store_url: '',
                  shopify_access_token: '',
                  shopify_location_id: ''
                })
              }
            >
              Discard Changes
            </button>
            <button className="primary-btn" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Credentials'}
            </button>
          </div>
        </form>
      </div>

      <div className="sync-summary-card">
        <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 12 }}>Sync Summary</div>
        <div className="big-number">1,428</div>
        <div style={{ marginTop: 8, opacity: 0.8 }}>Active SKU links</div>

        <div className="inline-pills" style={{ marginTop: 20 }}>
          <div className="pill">Uptime 99.98%</div>
          <div className="pill">Connected</div>
        </div>
      </div>
    </div>
  );
}