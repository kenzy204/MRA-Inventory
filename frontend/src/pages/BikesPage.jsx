// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { deleteBike, getBikes, syncBike } from '../api/bikes';

// export default function BikesPage() {
//   const [bikes, setBikes] = useState([]);
//   const [error, setError] = useState('');

//   async function load() {
//     try {
//       const data = await getBikes();
//       setBikes(data);
//       setError('');
//     } catch (err) {
//       setError(err?.response?.data?.message || 'Failed to load bikes');
//     }
//   }

//   useEffect(() => {
//     load();
//   }, []);

//   async function handleDelete(id) {
//     if (!window.confirm('Delete this bike?')) return;
//     await deleteBike(id);
//     load();
//   }

//   async function handleSync(id) {
//     await syncBike(id);
//     load();
//   }

//   return (
//     <div>
//       <h1>Bikes</h1>
//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Brand</th>
//             <th>Model</th>
//             <th>Price</th>
//             <th>Stock</th>
//             <th>Sync Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {bikes.map((bike) => (
//             <tr key={bike.id}>
//               <td>{bike.id}</td>
//               <td>{bike.brand}</td>
//               <td>{bike.model}</td>
//               <td>{bike.price}</td>
//               <td>{bike.stock}</td>
//               <td>{bike.sync_status}</td>
//               <td>
//                 <Link to={`/bikes/${bike.id}/edit`}>Edit</Link>{' | '}
//                 <button onClick={() => handleSync(bike.id)}>Sync</button>{' | '}
//                 <button onClick={() => handleDelete(bike.id)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//           {bikes.length === 0 && (
//             <tr>
//               <td colSpan="7">No bikes found</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }


import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteBike, getBikes, syncBike } from '../api/bikes';

export default function BikesPage() {
  const [bikes, setBikes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      const data = await getBikes();
      setBikes(data);
      setError('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load bikes');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm('Delete this bike?')) return;
    await deleteBike(id);
    await load();
  }

  async function handleSync(id) {
    await syncBike(id);
    await load();
  }

  const stats = useMemo(() => {
    const totalStock = bikes.reduce((sum, bike) => sum + Number(bike.stock || 0), 0);
    const lowStock = bikes.filter((bike) => Number(bike.stock || 0) > 0 && Number(bike.stock || 0) <= 3).length;
    const syncHealthy = bikes.length
      ? Math.round((bikes.filter((b) => b.sync_status === 'success').length / bikes.length) * 100)
      : 0;

    return {
      totalStock,
      inTransit: 84,
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

  return (
    <>
      <div className="card-grid">
        <div className="stat-card">
          <div className="stat-label">Total Stock</div>
          <div className="stat-value">{stats.totalStock}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">In Transit</div>
          <div className="stat-value">{stats.inTransit}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Sync Health</div>
          <div className="stat-value">{stats.syncHealthy}%</div>
        </div>

        <div className="stat-card dark">
          <div className="stat-label">Low Stock Alerts</div>
          <div className="stat-value">{stats.lowStock}</div>
        </div>
      </div>

      <div className="panel">
        <div className="filters-row">
          <input className="input" placeholder="Filter by title, model or SKU..." />
          <select className="select">
            <option>All Brands</option>
          </select>
          <select className="select">
            <option>Condition</option>
          </select>
          <select className="select">
            <option>Stock Status</option>
          </select>
          <button className="secondary-btn" type="button">⚙</button>
        </div>

        {error && <p className="error-text">{error}</p>}
        {loading && <p>Loading...</p>}

        {!loading && (
          <div className="table-wrap">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title / Model</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Mileage</th>
                  <th>Shopify Sync</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bikes.map((bike) => {
                  const firstImage = bike.images?.[0]?.image_url;

                  return (
                    <tr key={bike.id}>
                      <td>
                        <div className="bike-cell">
                          {firstImage ? (
                            <img
                              className="bike-thumb"
                              src={`${import.meta.env.VITE_BACKEND_URL}${firstImage}`}
                              alt={bike.title || `${bike.brand} ${bike.model}`}
                            />
                          ) : (
                            <div className="bike-thumb-placeholder" />
                          )}
                        </div>
                      </td>

                      <td>
                        <div className="bike-title">{bike.title || `${bike.brand} ${bike.model}`}</div>
                        <div className="bike-subtitle">{bike.model}</div>
                      </td>

                      <td>{bike.brand}</td>

                      <td className="value-strong">
                        ${Number(bike.price || 0).toLocaleString()}
                      </td>

                      <td>
                        <span className="value-strong">{bike.stock}</span>
                        <span className={`stock-indicator ${stockClass(bike.stock)}`}>
                          {Number(bike.stock || 0) <= 0 ? 'OUT' : Number(bike.stock || 0) <= 3 ? 'LOW' : 'IN STOCK'}
                        </span>
                      </td>

                      <td>{bike.mileage || 0} mi</td>

                      <td>
                        <span className={syncBadge(bike.sync_status)}>
                          {bike.sync_status || 'unknown'}
                        </span>
                      </td>

                      <td>
                        <div className="table-actions">
                          <Link className="table-btn" to={`/bikes/${bike.id}/edit`}>
                            Edit
                          </Link>
                          <button className="table-btn" onClick={() => handleSync(bike.id)}>
                            Sync
                          </button>
                          <button className="table-btn" onClick={() => handleDelete(bike.id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {bikes.length === 0 && !loading && (
                  <tr>
                    <td colSpan="8">No bikes found</td>
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