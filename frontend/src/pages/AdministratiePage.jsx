import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteClient, getClients } from '../api/clients';

const tabs = [
  { key: 'klanten', label: 'Klanten' },
  { key: 'offertes', label: 'Offertes' },
  { key: 'verkoopovereenkomsten', label: 'Verkoopovereenkomsten' },
  { key: 'facturen', label: 'Facturen' },
  { key: 'creditfacturen', label: 'Creditfacturen' },
  { key: 'inkoopverklaringen', label: 'Inkoopverklaringen' }
];

export default function AdministratiePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('klanten');
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load(searchValue = '') {
    try {
      setLoading(true);
      const data = await getClients(searchValue);
      setClients(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (activeTab === 'klanten') {
      load(search);
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'klanten') return;

    const timeout = setTimeout(() => {
      load(search);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, activeTab]);

  async function handleDelete(id) {
    const confirmed = window.confirm('Weet je zeker dat je deze klant wilt verwijderen?');
    if (!confirmed) return;

    try {
      await deleteClient(id);
      await load(search);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete client');
    }
  }

  const tableRows = useMemo(() => clients, [clients]);

  return (
    <div className="panel">
      <div className="admin-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`admin-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'klanten' ? (
        <>
          <div className="admin-toolbar">
            <input
              className="input"
              placeholder="Zoeken op naam, bedrijfsnaam, e-mail of plaats..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              className="primary-btn"
              type="button"
              onClick={() => navigate('/administratie/clients/new')}
            >
              + Klant toevoegen
            </button>
          </div>

          {error && <p className="error-text">{error}</p>}
          {loading ? (
            <p>Laden...</p>
          ) : (
            <div className="table-wrap">
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>Naam</th>
                    <th>Bedrijfsnaam</th>
                    <th>E-mail</th>
                    <th>Woonplaats</th>
                    <th>Acties</th>
                  </tr>
                </thead>

                <tbody>
                  {tableRows.map((item) => {
                    const fullName =
                      `${item.voornaam || ''} ${item.achternaam || ''}`.trim() || '-';

                    return (
                      <tr key={item.id}>
                        <td>{fullName}</td>
                        <td>{item.bedrijfsnaam || '-'}</td>
                        <td>{item.email || '-'}</td>
                        <td>{item.plaatsnaam || '-'}</td>
                        <td>
  <div className="table-actions">
    <button
      className="table-btn"
      type="button"
      onClick={() => navigate(`/administratie/clients/${item.id}/edit`)}
    >
      Bewerken
    </button>

    <button
      className="table-btn"
      type="button"
      onClick={() => handleDelete(item.id)}
    >
      Verwijderen
    </button>
  </div>
</td>
                      </tr>
                    );
                  })}

                  {tableRows.length === 0 && (
                    <tr>
                      <td colSpan="5">Geen klanten gevonden</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <div className="admin-placeholder">
          <h3>{tabs.find((t) => t.key === activeTab)?.label}</h3>
          <p>Dit onderdeel volgt binnenkort.</p>
        </div>
      )}
    </div>
  );
}
