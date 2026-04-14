// import { useEffect, useState } from 'react';
// import { getSyncLogs } from '../api/bikes';

// export default function SyncLogsPage() {
//   const [logs, setLogs] = useState([]);

//   useEffect(() => {
//     getSyncLogs().then(setLogs);
//   }, []);

//   return (
//     <div>
//       <h1>Sync Logs</h1>
//       <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Bike ID</th>
//             <th>Action</th>
//             <th>Status</th>
//             <th>Message</th>
//             <th>Date</th>
//           </tr>
//         </thead>
//         <tbody>
//           {logs.map((log) => (
//             <tr key={log.id}>
//               <td>{log.id}</td>
//               <td>{log.bike_id}</td>
//               <td>{log.action_type}</td>
//               <td>{log.sync_status}</td>
//               <td>{log.message}</td>
//               <td>{log.created_at}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { getSyncLogs } from '../api/bikes';

export default function SyncLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await getSyncLogs();
        setLogs(data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load logs');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <p>Loading logs...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="panel">
      <table className="log-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Bike ID</th>
            <th>Action</th>
            <th>Status</th>
            <th>Message</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.id}</td>
              <td>{log.bike_id}</td>
              <td>{log.action_type}</td>
              <td>
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
              </td>
              <td>{log.message}</td>
              <td>{new Date(log.created_at).toLocaleString()}</td>
            </tr>
          ))}

          {logs.length === 0 && (
            <tr>
              <td colSpan="6">No logs found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}