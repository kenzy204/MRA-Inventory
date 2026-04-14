// import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
// import LoginPage from './pages/LoginPage';
// import BikesPage from './pages/BikesPage';
// import BikeCreatePage from './pages/BikeCreatePage';
// import BikeEditPage from './pages/BikeEditPage';
// import SettingsPage from './pages/SettingsPage';
// import SyncLogsPage from './pages/SyncLogsPage';
// import ProtectedRoute from './components/ProtectedRoute';

// function Layout({ children }) {
//   const navigate = useNavigate();

//   function logout() {
//     localStorage.removeItem('token');
//     navigate('/login');
//   }

//   return (
//     <div style={{ padding: 24, fontFamily: 'Arial, sans-serif' }}>
//       <nav style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center' }}>
//         <Link to="/">Bikes</Link>
//         <Link to="/bikes/new">Create Bike</Link>
//         <Link to="/settings">Settings</Link>
//         <Link to="/sync-logs">Sync Logs</Link>
//         <button onClick={logout}>Logout</button>
//       </nav>
//       {children}
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/login" element={<LoginPage />} />

//         <Route
//           path="/"
//           element={
//             <ProtectedRoute>
//               <Layout>
//                 <BikesPage />
//               </Layout>
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/bikes/new"
//           element={
//             <ProtectedRoute>
//               <Layout>
//                 <BikeCreatePage />
//               </Layout>
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/bikes/:id/edit"
//           element={
//             <ProtectedRoute>
//               <Layout>
//                 <BikeEditPage />
//               </Layout>
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/settings"
//           element={
//             <ProtectedRoute>
//               <Layout>
//                 <SettingsPage />
//               </Layout>
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/sync-logs"
//           element={
//             <ProtectedRoute>
//               <Layout>
//                 <SyncLogsPage />
//               </Layout>
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }


import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
  Outlet,
  useNavigate,
  useLocation
} from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import BikesPage from './pages/BikesPage';
import BikeCreatePage from './pages/BikeCreatePage';
import BikeEditPage from './pages/BikeEditPage';
import SettingsPage from './pages/SettingsPage';
import SyncLogsPage from './pages/SyncLogsPage';

function ProtectedLayout() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  function logout() {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  }

  function getPageMeta() {
    if (location.pathname === '/') {
      return {
        title: 'Inventory Overview',
        subtitle: 'Manage and synchronize your high-performance e-bike fleet.'
      };
    }

    if (location.pathname === '/bikes/new') {
      return {
        title: 'Add New Bike',
        subtitle: 'Create a new bike model and prepare it for Shopify sync.'
      };
    }

    if (location.pathname.includes('/bikes/') && location.pathname.includes('/edit')) {
      return {
        title: 'Edit Bike Model',
        subtitle: 'Detailed specifications and asset management.'
      };
    }

    if (location.pathname === '/settings') {
      return {
        title: 'Shopify Sync Settings',
        subtitle: 'Manage integration credentials and synchronization health.'
      };
    }

    if (location.pathname === '/sync-logs') {
      return {
        title: 'Sync Logs',
        subtitle: 'Review recent synchronization events and errors.'
      };
    }

    return {
      title: 'Dashboard',
      subtitle: ''
    };
  }

  const page = getPageMeta();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <h1 className="brand-title">Precision Ledger</h1>
          <div className="brand-subtitle">E-Bike Warehouse</div>
        </div>

        <div className="nav-section">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Inventory
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Shopify Sync
          </NavLink>

          <NavLink
            to="/sync-logs"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Logs
          </NavLink>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-live-card">
            <div className="sidebar-live-title">System Live</div>
            <div className="sidebar-live-value">Last sync: 2 min ago</div>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <div className="topbar-tabs">
              <NavLink to="/" end className={({ isActive }) => `topbar-tab ${isActive ? 'active' : ''}`}>
                Inventory
              </NavLink>
              <NavLink to="/settings" className={({ isActive }) => `topbar-tab ${isActive ? 'active' : ''}`}>
                Shopify Sync
              </NavLink>
              <NavLink to="/settings" className={({ isActive }) => `topbar-tab ${isActive ? 'active' : ''}`}>
  Settings
</NavLink>
<NavLink to="/sync-logs" className={({ isActive }) => `topbar-tab ${isActive ? 'active' : ''}`}>
  Logs
</NavLink>
            </div>
          </div>

          <div className="topbar-right">
            <input className="search-box" placeholder="Global Search..." />
            <button className="icon-btn" type="button">🔔</button>
            <button className="avatar-btn" type="button">A</button>
            <button className="secondary-btn" type="button" onClick={logout}>
              Logout
            </button>
          </div>
        </header>

        <div className="page-content">
          <div className="page-heading-row">
            <div className="page-heading">
              <h1>{page.title}</h1>
              <p>{page.subtitle}</p>
            </div>

            {location.pathname === '/' && (
              <button className="primary-btn" onClick={() => navigate('/bikes/new')}>
                + Add New Bike
              </button>
            )}
          </div>

          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<BikesPage />} />
          <Route path="/bikes/new" element={<BikeCreatePage />} />
          <Route path="/bikes/:id/edit" element={<BikeEditPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/sync-logs" element={<SyncLogsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}