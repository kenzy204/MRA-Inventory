import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteBike, getBikes, syncBike } from '../api/bikes';
import TableSkeleton from '../components/TableSkeleton';

export default function BikesPage() {
  const [bikes, setBikes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');
  const [conditionFilter, setConditionFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  async function load() {
    try {
      setLoading(true);
      const data = await getBikes();
      setBikes(data);
      setError('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Fietsen laden mislukt');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm('Weet je zeker dat je deze fiets wilt verwijderen?')) return;
    await deleteBike(id);
    await load();
  }

  async function handleSync(id) {
    await syncBike(id);
    await load();
  }

  const brandOptions = useMemo(() => {
    return [...new Set(bikes.map((bike) => bike.brand).filter(Boolean))];
  }, [bikes]);

  const filteredBikes = useMemo(() => {
    return bikes.filter((bike) => {
      const title = bike.title || `${bike.brand || ''} ${bike.model || ''}`;
      const haystack = `${title} ${bike.model || ''} ${bike.sku || ''} ${bike.brand || ''}`.toLowerCase();

      const matchesSearch = haystack.includes(search.toLowerCase());
      const matchesBrand = brandFilter === 'all' || bike.brand === brandFilter;
      const matchesCondition =
        conditionFilter === 'all' || String(bike.condition || '').toLowerCase() === conditionFilter;

      const stockValue = Number(bike.stock || 0);
      const matchesStock =
        stockFilter === 'all' ||
        (stockFilter === 'in-stock' && stockValue > 3) ||
        (stockFilter === 'low' && stockValue > 0 && stockValue <= 3) ||
        (stockFilter === 'out' && stockValue <= 0);

      return matchesSearch && matchesBrand && matchesCondition && matchesStock;
    });
  }, [bikes, search, brandFilter, conditionFilter, stockFilter]);

  const stats = useMemo(() => {
    const totalStock = bikes.reduce((sum, bike) => sum + Number(bike.stock || 0), 0);
    const lowStock = bikes.filter((bike) => Number(bike.stock || 0) > 0 && Number(bike.stock || 0) <= 3).length;
    const syncHealthy = bikes.length
      ? Math.round((bikes.filter((b) => b.sync_status === 'success').length / bikes.length) * 100)
      : 0;

    return {
      totalStock,
      activeListings: bikes.length,
      syncHealthy,
      lowStock
    };
  }, [bikes]);

  function stockClass(stock) {
    const value = Number(stock || 0);
    if (value <= 0) return 'stock-out';
    if (value <= 3) return 'stock-low';
    return 'stock-ok';
  }

  function syncBadge(status) {
    if (status === 'success') return 'badge badge-success';
    if (status === 'pending') return 'badge badge-pending';
    if (status === 'error') return 'badge badge-error';
    return 'badge badge-synced';
  }

  function imageSrc(imageUrl) {
    if (!imageUrl) return '';
    return /^https?:\/\//i.test(imageUrl)
      ? imageUrl
      : `${import.meta.env.VITE_BACKEND_URL}${imageUrl}`;
  }

  return (
    <>
    
       

      <div className="panel">
        <div className="filters-row">
          <input
            className="input"
            placeholder="Zoek op titel, model, merk of SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select className="select" value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}>
            <option value="all">Alle merken</option>
            {brandOptions.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>

          <select
            className="select"
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
          >
            <option value="all">Conditie</option>
            <option value="used">Gebruikt</option>
            <option value="new">Nieuw</option>
            <option value="demo">Demo</option>
          </select>

          <select className="select" value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
            <option value="all">Voorraadstatus</option>
            <option value="in-stock">Op voorraad</option>
            <option value="low">Lage voorraad</option>
            <option value="out">Uitverkocht</option>
          </select>

          <button
            className="secondary-btn"
            type="button"
            onClick={() => {
              setSearch('');
              setBrandFilter('all');
              setConditionFilter('all');
              setStockFilter('all');
            }}
          >
            ↺
          </button>
        </div>

        {error && <p className="error-text">{error}</p>}
        {loading && <TableSkeleton rows={6} />}

        {!loading && (
          <div className="table-wrap">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Fiets</th>
                  <th>Merk</th>
                  <th>Prijs</th>
                  <th>Voorraad</th>
                  <th>Kilometerstand</th>
                  <th>Shopify sync</th>
                  <th>Acties</th>
                </tr>
              </thead>

              <tbody>
                {filteredBikes.map((bike) => {
                 const firstImage = bike.first_image;
                  const displayTitle = bike.title || `${bike.brand || ''} ${bike.model || ''}`.trim();

                  return (
                    <tr key={bike.id}>
                      <td>
                        <div className="bike-cell">
                          {firstImage ? (
                            <img
                              className="bike-thumb"
                              src={imageSrc(firstImage)}
                              alt={displayTitle}
                            />
                          ) : (
                            <div className="bike-thumb-placeholder" />
                          )}

                          <div>
                            <div className="bike-title">{displayTitle}</div>
                            <div className="bike-subtitle">
                              {bike.model || 'Geen model'} {bike.sku ? `• ${bike.sku}` : ''}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>{bike.brand || '-'}</td>

                      <td className="value-strong">
                        €{Number(bike.price || 0).toLocaleString()}
                      </td>

                      <td>
                        <span className="value-strong">{bike.stock}</span>
                        <span className={`stock-indicator ${stockClass(bike.stock)}`}>
                          {Number(bike.stock || 0) <= 0
                            ? 'UIT'
                            : Number(bike.stock || 0) <= 3
                            ? 'LAAG'
                            : 'OP VOORRAAD'}
                        </span>
                      </td>

                      <td>{bike.kilometerstand || 0} km</td>

                      <td>
                        <span className={syncBadge(bike.sync_status)}>
                          {bike.sync_status || 'onbekend'}
                        </span>
                      </td>

                      <td>
                        <div className="table-actions">
                          <Link className="table-btn" to={`/bikes/${bike.id}/edit`}>
                            Bewerken
                          </Link>
                          <button className="table-btn" onClick={() => handleSync(bike.id)}>
                            Sync
                          </button>
                          <button className="table-btn" onClick={() => handleDelete(bike.id)}>
                            Verwijderen
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredBikes.length === 0 && !loading && (
                  <tr>
                    <td colSpan="7">Geen fietsen gevonden</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
