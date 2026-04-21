import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBikes } from '../api/bikes';
import PageLoader from '../components/PageLoader';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getBikes();
        setBikes(Array.isArray(data) ? data : []);
        setError('');
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const stats = useMemo(() => {
  const totalBikes = bikes.length;
  const totalStock = bikes.reduce((sum, bike) => sum + Number(bike.stock || 0), 0);

  const totalStockValue = bikes.reduce(
    (sum, bike) => sum + Number(bike.price || 0) * Number(bike.stock || 0),
    0
  );

  const lowStockCount = bikes.filter((bike) => {
    const stock = Number(bike.stock || 0);
    return stock > 0 && stock <= 3;
  }).length;

  const outOfStockCount = bikes.filter((bike) => Number(bike.stock || 0) <= 0).length;
  const syncErrorCount = bikes.filter((bike) => bike.sync_status === 'error').length;
  const syncedCount = bikes.filter((bike) => bike.sync_status === 'success').length;

  const locations = {
    beilen: { totalBikes: 0, totalStockValue: 0 },
    zwolle: { totalBikes: 0, totalStockValue: 0 },
    eindhoven: { totalBikes: 0, totalStockValue: 0 }
  };

  bikes.forEach((bike) => {
    const tag = String(bike.tags || '').toLowerCase();
    const stockValue = Number(bike.price || 0) * Number(bike.stock || 0);

    if (tag.includes('beilen')) {
      locations.beilen.totalBikes += 1;
      locations.beilen.totalStockValue += stockValue;
    }

    if (tag.includes('zwolle')) {
      locations.zwolle.totalBikes += 1;
      locations.zwolle.totalStockValue += stockValue;
    }

    if (tag.includes('eindhoven')) {
      locations.eindhoven.totalBikes += 1;
      locations.eindhoven.totalStockValue += stockValue;
    }
  });

  return {
    totalBikes,
    totalStock,
    totalStockValue,
    lowStockCount,
    outOfStockCount,
    syncErrorCount,
    syncedCount,
    locations
  };
}, [bikes]);

  
  const syncHealthLabel = useMemo(() => {
    if (stats.totalBikes === 0) return 'Geen data';
    if (stats.syncErrorCount === 0) return 'Gezond';
    if (stats.syncErrorCount <= 3) return 'Let op';
    return 'Actie nodig';
  }, [stats]);




if (loading) return <PageLoader label="Dashboard laden..." />;

  return (
    <div className="dashboard-grid">
      <div className="dashboard-hero panel">
        <div className="dashboard-hero-text">
          <h2 style={{ marginTop: 0, marginBottom: 10 }}>Welkom bij CyclePro</h2>
          <p className="dashboard-intro">
            Beheer je voorraad, instellingen en belangrijke acties vanuit één centrale plek.
          </p>

          <div className="announcement-box">
            Goed nieuws: we bouwen aan een nieuwe inruiltool om het
            inruilproces sneller, makkelijker en efficiënter te maken.
            Binnenkort meer!
          </div>
        </div>

        <div className="dashboard-hero-actions">
          <button className="primary-btn" onClick={() => navigate('/bikes/new')}>
            + Nieuwe fiets
          </button>

          <button className="secondary-btn" onClick={() => navigate('/fietsen')}>
            Bekijk fietsen
          </button>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="card-grid">
        <div className="stat-card">
          <div className="stat-label">Totaal fietsen</div>
          <div className="stat-value">{stats.totalBikes}</div>
        </div>

      <div className="stat-card">
  <div className="stat-label">Totale voorraad</div>
  <div className="stat-value">{stats.totalStock}</div>
  <div style={{ marginTop: 10, color: 'var(--muted)' }}>
    Waarde: €{stats.totalStockValue.toLocaleString()}
  </div>
</div>

        <div className="stat-card">
          <div className="stat-label">Lage voorraad</div>
          <div className="stat-value">{stats.lowStockCount}</div>
        </div>

        <div className="stat-card dark">
          <div className="stat-label">Sync status</div>
          <div className="stat-value" style={{ fontSize: 28 }}>{syncHealthLabel}</div>
        </div>
      </div>
<div className="panel">
  <div className="dashboard-section-head">
    <h3>Voorraad per locatie</h3>
  </div>

  <div className="card-grid">
    <div className="stat-card">
      <div className="stat-label">Beilen - Aantal fietsen</div>
      <div className="stat-value">{stats.locations.beilen.totalBikes}</div>
      <div style={{ marginTop: 10, color: 'var(--muted)' }}>
        Voorraadwaarde: €{stats.locations.beilen.totalStockValue.toLocaleString()}
      </div>
    </div>

    <div className="stat-card">
      <div className="stat-label">Zwolle - Aantal fietsen</div>
      <div className="stat-value">{stats.locations.zwolle.totalBikes}</div>
      <div style={{ marginTop: 10, color: 'var(--muted)' }}>
        Voorraadwaarde: €{stats.locations.zwolle.totalStockValue.toLocaleString()}
      </div>
    </div>

    <div className="stat-card">
      <div className="stat-label">Eindhoven - Aantal fietsen</div>
      <div className="stat-value">{stats.locations.eindhoven.totalBikes}</div>
      <div style={{ marginTop: 10, color: 'var(--muted)' }}>
        Voorraadwaarde: €{stats.locations.eindhoven.totalStockValue.toLocaleString()}
      </div>
    </div>
  </div>
</div>
      <div className="dashboard-panels-simple">
        <div className="panel">
          <div className="dashboard-section-head">
            <h3>Direct naar</h3>
          </div>

          <div className="dashboard-action-grid">
            <button className="dashboard-action-card" onClick={() => navigate('/bikes/new')}>
              <span className="dashboard-action-title">Nieuwe fiets</span>
              <span className="dashboard-action-subtitle">
                Voeg snel een nieuwe fiets toe aan je voorraad.
              </span>
            </button>

            <button className="dashboard-action-card" onClick={() => navigate('/fietsen')}>
              <span className="dashboard-action-title">Fietsenoverzicht</span>
              <span className="dashboard-action-subtitle">
                Bekijk, filter en beheer alle fietsen.
              </span>
            </button>

            <button className="dashboard-action-card" onClick={() => navigate('/social-media')}>
              <span className="dashboard-action-title">Social media</span>
              <span className="dashboard-action-subtitle">
                Beheer links en kanalen van je platform.
              </span>
            </button>

            <button className="dashboard-action-card" onClick={() => navigate('/settings')}>
              <span className="dashboard-action-title">MRA E-Bike Center</span>
              <span className="dashboard-action-subtitle">
                Open instellingen en koppelingsgegevens.
              </span>
            </button>
          </div>
        </div>

        <div className="panel">
          <div className="dashboard-section-head">
            <h3>Aandacht nodig</h3>
          </div>

          <div className="dashboard-focus-list">
            <div className="dashboard-focus-row">
              <div>
                <div className="dashboard-item-title">Lage voorraad</div>
                <div className="dashboard-item-subtitle">
                  Fietsen met beperkte voorraad
                </div>
              </div>
              <span className="badge badge-pending">{stats.lowStockCount}</span>
            </div>

            <div className="dashboard-focus-row">
              <div>
                <div className="dashboard-item-title">Uitverkocht</div>
                <div className="dashboard-item-subtitle">
                  Fietsen zonder beschikbare voorraad
                </div>
              </div>
              <span className="badge badge-error">{stats.outOfStockCount}</span>
            </div>

            <div className="dashboard-focus-row">
              <div>
                <div className="dashboard-item-title">Sync fouten</div>
                <div className="dashboard-item-subtitle">
                  Items die controle nodig hebben
                </div>
              </div>
              <span className="badge badge-error">{stats.syncErrorCount}</span>
            </div>

            <div className="dashboard-focus-row">
              <div>
                <div className="dashboard-item-title">Succesvol gesynchroniseerd</div>
                <div className="dashboard-item-subtitle">
                  Items met correcte koppeling
                </div>
              </div>
              <span className="badge badge-success">{stats.syncedCount}</span>
            </div>
          </div>

          <div style={{ marginTop: 18, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="secondary-btn" onClick={() => navigate('/fietsen')}>
              Open voorraad
            </button>
            <button className="secondary-btn" onClick={() => navigate('/sync-logs')}>
              Bekijk logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
