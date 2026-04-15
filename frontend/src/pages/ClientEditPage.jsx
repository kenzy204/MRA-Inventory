import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getClient, updateClient } from '../api/clients';

const initialForm = {
  client_type: 'particulier',
  aanhef: '',
  voornaam: '',
  achternaam: '',
  bedrijfsnaam: '',
  email: '',
  telefoonnummer: '',
  postcode: '',
  huisnummer: '',
  adres: '',
  plaatsnaam: '',
  land: 'Nederland',
  opmerkingen: ''
};

export default function ClientEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getClient(id);

        setForm({
          client_type: data.client_type || 'particulier',
          aanhef: data.aanhef || '',
          voornaam: data.voornaam || '',
          achternaam: data.achternaam || '',
          bedrijfsnaam: data.bedrijfsnaam || '',
          email: data.email || '',
          telefoonnummer: data.telefoonnummer || '',
          postcode: data.postcode || '',
          huisnummer: data.huisnummer || '',
          adres: data.adres || '',
          plaatsnaam: data.plaatsnaam || '',
          land: data.land || 'Nederland',
          opmerkingen: data.opmerkingen || ''
        });

        setError('');
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load client');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

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
    setError('');

    try {
      await updateClient(id, form);
      navigate('/administratie');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update client');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p>Laden...</p>;
  }

  return (
    <div className="panel">
      <div className="admin-page-head">
        <h2 style={{ margin: 0 }}>Klant bewerken</h2>

        <button
          type="button"
          className="secondary-btn"
          onClick={() => navigate('/administratie')}
        >
          Terug naar lijst
        </button>
      </div>

      <form onSubmit={handleSubmit} className="form-stack" style={{ marginTop: 24 }}>
        <div className="client-type-row">
          <label className="radio-option">
            <input
              type="radio"
              name="client_type"
              value="particulier"
              checked={form.client_type === 'particulier'}
              onChange={handleChange}
            />
            <span>Particulier</span>
          </label>

          <label className="radio-option">
            <input
              type="radio"
              name="client_type"
              value="zakelijk"
              checked={form.client_type === 'zakelijk'}
              onChange={handleChange}
            />
            <span>Zakelijk</span>
          </label>
        </div>

        <div className="client-form-grid">
          <div className="field">
            <label>Aanhef</label>
            <select
              className="select"
              name="aanhef"
              value={form.aanhef}
              onChange={handleChange}
            >
              <option value="">Selecteer</option>
              <option value="Dhr.">Dhr.</option>
              <option value="Mevr.">Mevr.</option>
            </select>
          </div>

          <div className="field">
            <label>Bedrijfsnaam</label>
            <input
              className="input"
              name="bedrijfsnaam"
              value={form.bedrijfsnaam}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>Voornaam</label>
            <input
              className="input"
              name="voornaam"
              value={form.voornaam}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>Achternaam</label>
            <input
              className="input"
              name="achternaam"
              value={form.achternaam}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>E-mail</label>
            <input
              className="input"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>Telefoonnummer</label>
            <input
              className="input"
              name="telefoonnummer"
              value={form.telefoonnummer}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>Postcode</label>
            <input
              className="input"
              name="postcode"
              value={form.postcode}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>Huisnummer</label>
            <input
              className="input"
              name="huisnummer"
              value={form.huisnummer}
              onChange={handleChange}
            />
          </div>

          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label>Adres</label>
            <input
              className="input"
              name="adres"
              value={form.adres}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>Plaatsnaam</label>
            <input
              className="input"
              name="plaatsnaam"
              value={form.plaatsnaam}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>Land</label>
            <select
              className="select"
              name="land"
              value={form.land}
              onChange={handleChange}
            >
              <option value="Nederland">Nederland</option>
              <option value="België">België</option>
              <option value="Duitsland">Duitsland</option>
            </select>
          </div>

          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label>Opmerkingen</label>
            <textarea
              className="textarea"
              name="opmerkingen"
              value={form.opmerkingen}
              onChange={handleChange}
              placeholder="Hier kunt u opmerkingen noteren..."
            />
          </div>
        </div>

        {error && <p className="error-text">{error}</p>}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button
            type="button"
            className="secondary-btn"
            onClick={() => navigate('/administratie')}
          >
            Annuleren
          </button>

          <button className="primary-btn" type="submit" disabled={saving}>
            {saving ? 'Opslaan...' : 'Wijzigingen opslaan'}
          </button>
        </div>
      </form>
    </div>
  );
}
