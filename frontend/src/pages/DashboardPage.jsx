import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBikes, getSyncLogs } from '../api/bikes';

export default function DashboardPage() {
  const navigate = useNavigate();

  const [bikes, setBikes] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [bikesData, logsData] = await Promise.all([
          getBikes(),
          getSyncLogs()
        ]);

        setBikes(Array.isArray(bikesData) ? bikesData : []);
        setLogs(Array.isArray(logsData) ? logsData : []);
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
    const lowStockCount = bikes.filter((bike) => {
      const stock = Number(bike.stock || 0);
      return stock > 0 && stock <= 3;
    }).length;
    const syncErrorCount = bikes.filter((bike) => bike.sync_status === 'error').length;

    return {
      totalBikes,
      totalStock,
      lowStockCount,
      syncErrorCount
    };
  }, [bikes]);

  const lowStockBikes = useMemo(() => {
    return bikes
      .filter((bike) => {
        const stock = Number(bike.stock || 0);
        return stock > 0 && stock <= 3;
      })
      .slice(0, 5);
  }, [bikes]);

  const syncErrorBikes = useMemo(() => {
    return bikes
      .filter((bike) => bike.sync_status === 'error')
      .slice(0, 5);
  }, [bikes]);

  const recentLogs = useMemo(() => logs.slice(0, 5), [logs]);

  function formatBikeTitle(bike) {
    return bike.title || `${bike.brand || ''} ${bike.model || ''}`.trim() || `Bike ${bike.id}`;
  }

  if (loading) {
    return <p>Dashboard laden...</p>;
  }

  return (
    <div className="dashboard-grid">
      <div className="panel">
        <h2 style={{ marginTop: 0 }}>Welkom bij CyclePro</h2>

        <div className="announcement-box">
          Goed nieuws: we bouwen aan een nieuwe inruiltool om het
          inruilproces sneller, makkelijker en efficiënter te maken.
          Binnenkort meer!
        </div>

        {error && <p className="error-text">{error}</p>}
      </div>

      <div className="card-grid">
        <div className="stat-card">
          <div className="stat-label">Totaal fietsen</div>
          <div className="stat-value">{stats.totalBikes}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Totale voorraad</div>
          <div className="stat-value">{stats.totalStock}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Lage voorraad</div>
          <div className="stat-value">{stats.lowStockCount}</div>
        </div>

        <div className="stat-card dark">
          <div className="stat-label">Sync fouten</div>
          <div className="stat-value">{stats.syncErrorCount}</div>
        </div>
      </div>

      <div className="dashboard-panels">
        <div className="panel">
          <div className="dashboard-section-head">
            <h3>Actie vereist</h3>
            <button
              className="secondary-btn"
              type="button"
              onClick={() => navigate('/fietsen')}
            >
              Bekijk fietsen
            </button>
          </div>

          <div className="dashboard-list-block">
            <h4>Sync fouten</h4>
            {syncErrorBikes.length === 0 ? (
              <p className="dashboard-empty">Geen sync fouten.</p>
            ) : (
              <div className="dashboard-list">
                {syncErrorBikes.map((bike) => (
                  <button
                    key={`sync-${bike.id}`}
                    type="button"
                    className="dashboard-list-item"
                    onClick={() => navigate(`/bikes/${bike.id}/edit`)}
                  >
                    <div>
                      <div className="dashboard-item-title">{formatBikeTitle(bike)}</div>
                      <div className="dashboard-item-subtitle">
                        Status: {bike.sync_status || 'onbekend'}
                      </div>
                    </div>
                    <span className="badge badge-error">error</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="dashboard-list-block">
            <h4>Lage voorraad</h4>
            {lowStockBikes.length === 0 ? (
              <p className="dashboard-empty">Geen lage voorraad.</p>
            ) : (
              <div className="dashboard-list">
                {lowStockBikes.map((bike) => (
                  <button
                    key={`stock-${bike.id}`}
                    type="button"
                    className="dashboard-list-item"
                    onClick={() => navigate(`/bikes/${bike.id}/edit`)}
                  >
                    <div>
                      <div className="dashboard-item-title">{formatBikeTitle(bike)}</div>
                      <div className="dashboard-item-subtitle">
                        SKU: {bike.sku || '-'}
                      </div>
                    </div>
                    <span className="badge badge-pending">
                      stock {Number(bike.stock || 0)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="panel">
          <div className="dashboard-section-head">
            <h3>Recente synchronisaties</h3>
            <button
              className="secondary-btn"
              type="button"
              onClick={() => navigate('/sync-logs')}
            >
              Bekijk logs
            </button>
          </div>

          {recentLogs.length === 0 ? (
            <p className="dashboard-empty">Nog geen synchronisatielogs beschikbaar.</p>
          ) : (
            <div className="dashboard-log-list">
              {recentLogs.map((log) => (
                <div key={log.id} className="dashboard-log-item">
                  <div className="dashboard-log-top">
                    <strong>{log.action_type || 'sync'}</strong>
                    <span
                      className={
                        log.sync_status === 'success'
                          ? 'badge badge-success'
                          : log.sync_status === 'pending'
                          ? 'badge badge-pending'
                          : 'badge badge-error'
                      }
                    >
                      {log.sync_status}
                    </span>
                  </div>

                  <div className="dashboard-item-subtitle">
                    Bike ID: {log.bike_id ?? '-'}
                  </div>

                  <div className="dashboard-log-message">
                    {log.message || 'Geen bericht'}
                  </div>

                  <div className="dashboard-log-date">
                    {log.created_at ? new Date(log.created_at).toLocaleString() : '-'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="panel">
        <div className="dashboard-section-head">
          <h3>Snelle acties</h3>
        </div>

        <div className="dashboard-actions">
          <button className="primary-btn" onClick={() => navigate('/bikes/new')}>
            + Nieuwe fiets
          </button>

          <button className="secondary-btn" onClick={() => navigate('/fietsen')}>
            Bekijk fietsen
          </button>

          <button className="secondary-btn" onClick={() => navigate('/settings')}>
            MRA E-Bike Center
          </button>

          <button className="secondary-btn" onClick={() => navigate('/sync-logs')}>
            Open logs
          </button>
        </div>
      </div>
    </div>
  );
}
