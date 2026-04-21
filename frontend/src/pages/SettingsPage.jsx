import { useEffect, useState } from 'react';
import {
  getProfile,
  updateProfile,
  getLocations,
  createLocation,
  deleteLocation,
  getOpeningHours,
  updateOpeningHours
} from '../api/mraCenter';

const days = [
  { id: 1, label: 'Maandag' },
  { id: 2, label: 'Dinsdag' },
  { id: 3, label: 'Woensdag' },
  { id: 4, label: 'Donderdag' },
  { id: 5, label: 'Vrijdag' },
  { id: 6, label: 'Zaterdag' },
  { id: 7, label: 'Zondag' }
];

export default function SettingsPage() {
  const [tab, setTab] = useState('general');

  const [profile, setProfile] = useState({});
  const [locations, setLocations] = useState([]);
  const [hours, setHours] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function loadAll() {
    try {
      setLoading(true);

      const profileData = await getProfile();
      const locationData = await getLocations();
      const hoursData = await getOpeningHours(1);

      setProfile(profileData || {});
      setLocations(Array.isArray(locationData) ? locationData : []);
      setHours(
        Array.isArray(hoursData) && hoursData.length > 0
          ? hoursData
          : days.map((day) => ({
              day_of_week: day.id,
              open_time: '09:00',
              close_time: '18:00'
            }))
      );

      setError('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  function updateField(name, value) {
    setProfile((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  async function saveProfile() {
    try {
      await updateProfile(profile);
      setMessage('Opgeslagen');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setError(err?.response?.data?.message || 'Save failed');
    }
  }

  async function addLocation() {
    const name = prompt('Naam van sublocatie:');
    if (!name) return;

    await createLocation({ name, parent_id: 1 });
    await loadAll();
  }

  async function removeLocation(id) {
    const ok = window.confirm('Verwijderen?');
    if (!ok) return;

    await deleteLocation(id);
    await loadAll();
  }

  function changeHour(index, field, value) {
    setHours((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
              ...row,
              [field]: value
            }
          : row
      )
    );
  }

  async function saveHours() {
    try {
      await updateOpeningHours(1, hours);
      setMessage('Openingstijden opgeslagen');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setError(err?.response?.data?.message || 'Save failed');
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="panel">
      <div className="settings-layout">
        {/* LEFT MENU */}
        <div className="settings-sidebar-inner">
          <button
            className={`settings-tab-btn ${tab === 'general' ? 'active' : ''}`}
            onClick={() => setTab('general')}
          >
            Algemeen
          </button>

          <button
            className={`settings-tab-btn ${tab === 'locations' ? 'active' : ''}`}
            onClick={() => setTab('locations')}
          >
            Sublocaties
          </button>

          <button
            className={`settings-tab-btn ${tab === 'hours' ? 'active' : ''}`}
            onClick={() => setTab('hours')}
          >
            Openingstijden
          </button>
        </div>

        {/* RIGHT CONTENT */}
        <div className="settings-content">
          {message && (
            <p style={{ color: 'green', fontWeight: 700 }}>{message}</p>
          )}

          {error && <p className="error-text">{error}</p>}

          {/* GENERAL */}
          {tab === 'general' && (
            <div className="form-stack">
              <div className="field">
                <label>Naam</label>
                <input
                  className="input"
                  value={profile.name || ''}
                  onChange={(e) => updateField('name', e.target.value)}
                />
              </div>

              <div className="field">
                <label>Omschrijving</label>
                <textarea
                  className="input"
                  rows="4"
                  value={profile.description || ''}
                  onChange={(e) =>
                    updateField('description', e.target.value)
                  }
                />
              </div>

              <div className="field-grid-2">
                <div className="field">
                  <label>Adres</label>
                  <input
                    className="input"
                    value={profile.address || ''}
                    onChange={(e) => updateField('address', e.target.value)}
                  />
                </div>

                <div className="field">
                  <label>Postcode</label>
                  <input
                    className="input"
                    value={profile.postcode || ''}
                    onChange={(e) => updateField('postcode', e.target.value)}
                  />
                </div>
              </div>

              <div className="field-grid-2">
                <div className="field">
                  <label>Woonplaats</label>
                  <input
                    className="input"
                    value={profile.city || ''}
                    onChange={(e) => updateField('city', e.target.value)}
                  />
                </div>

                <div className="field">
                  <label>Provincie</label>
                  <input
                    className="input"
                    value={profile.province || ''}
                    onChange={(e) => updateField('province', e.target.value)}
                  />
                </div>
              </div>

              <div className="field-grid-2">
                <div className="field">
                  <label>Telefoon</label>
                  <input
                    className="input"
                    value={profile.phone || ''}
                    onChange={(e) => updateField('phone', e.target.value)}
                  />
                </div>

                <div className="field">
                  <label>Website</label>
                  <input
                    className="input"
                    value={profile.website || ''}
                    onChange={(e) => updateField('website', e.target.value)}
                  />
                </div>
              </div>

              <div className="field-grid-2">
                <div className="field">
                  <label>KvK</label>
                  <input
                    className="input"
                    value={profile.kvk_number || ''}
                    onChange={(e) =>
                      updateField('kvk_number', e.target.value)
                    }
                  />
                </div>

                <div className="field">
                  <label>IBAN</label>
                  <input
                    className="input"
                    value={profile.iban_number || ''}
                    onChange={(e) =>
                      updateField('iban_number', e.target.value)
                    }
                  />
                </div>
              </div>

              <button className="primary-btn" onClick={saveProfile}>
                Opslaan
              </button>
            </div>
          )}

          {/* LOCATIONS */}
          {tab === 'locations' && (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 20
                }}
              >
                <h3 style={{ margin: 0 }}>Sublocaties</h3>

                <button
                  className="primary-btn"
                  onClick={addLocation}
                >
                  + Toevoegen
                </button>
              </div>

              <div className="table-wrap">
                <table className="inventory-table">
                  <thead>
                    <tr>
                      <th>Naam</th>
                      <th>Plaats</th>
                      <th>Acties</th>
                    </tr>
                  </thead>

                  <tbody>
                    {locations.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.city || '-'}</td>
                        <td>
                          {item.is_main ? (
                            <span>Hoofdlocatie</span>
                          ) : (
                            <button
                              className="table-btn"
                              onClick={() =>
                                removeLocation(item.id)
                              }
                            >
                              Verwijderen
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* HOURS */}
          {tab === 'hours' && (
            <div className="form-stack">
              {days.map((day, index) => {
                const row = hours[index] || {};

                return (
                  <div
                    key={day.id}
                    className="field-grid-2"
                  >
                    <div className="field">
                      <label>{day.label} van</label>
                      <input
                        type="time"
                        className="input"
                        value={row.open_time || '09:00'}
                        onChange={(e) =>
                          changeHour(
                            index,
                            'open_time',
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="field">
                      <label>{day.label} tot</label>
                      <input
                        type="time"
                        className="input"
                        value={row.close_time || '18:00'}
                        onChange={(e) =>
                          changeHour(
                            index,
                            'close_time',
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                );
              })}

              <button
                className="primary-btn"
                onClick={saveHours}
              >
                Opslaan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
