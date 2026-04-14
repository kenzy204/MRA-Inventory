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
import { useEffect, useState } from 'react';

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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

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
        subtitle: 'Manage your premium e-bike collection with clarity and speed.'
      };
    }

    if (location.pathname === '/bikes/new') {
      return {
        title: 'Add New Bike',
        subtitle: 'Create a new listing with specifications, media, and Shopify sync.'
      };
    }

    if (location.pathname.includes('/bikes/') && location.pathname.includes('/edit')) {
      return {
        title: 'Edit Bike',
        subtitle: 'Update specifications, images, and synchronization details.'
      };
    }

    if (location.pathname === '/settings') {
      return {
        title: 'Shopify Settings',
        subtitle: 'Control store connection, credentials, and sync readiness.'
      };
    }

    if (location.pathname === '/sync-logs') {
      return {
        title: 'Sync Logs',
        subtitle: 'Track recent sync activity and troubleshoot issues quickly.'
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
      <aside className={`sidebar ${mobileNavOpen ? 'open' : ''}`}>
        <div className="brand-block">
          <div className="brand-mark">M</div>
          <div>
            <h1 className="brand-title">MRA Inventory</h1>
            <div className="brand-subtitle">Luxury E-Bike Management</div>
          </div>
        </div>

        <div className="nav-section">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">◻</span>
            <span>Inventory</span>
          </NavLink>

          <NavLink
            to="/bikes/new"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">＋</span>
            <span>Add Bike</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">⚙</span>
            <span>Shopify Sync</span>
          </NavLink>

          <NavLink
            to="/sync-logs"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">☰</span>
            <span>Logs</span>
          </NavLink>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-live-card">
            <div className="sidebar-live-title">Workspace</div>
            <div className="sidebar-live-value">Connected & ready</div>
            <div className="sidebar-live-note">
              Maintain bikes, media, and Shopify sync from one place.
            </div>
          </div>
        </div>
      </aside>

      {mobileNavOpen && (
        <button
          className="mobile-overlay"
          type="button"
          onClick={() => setMobileNavOpen(false)}
          aria-label="Close menu"
        />
      )}

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="menu-btn"
              type="button"
              onClick={() => setMobileNavOpen((prev) => !prev)}
            >
              ☰
            </button>

            <div className="page-heading-inline">
              <h1>{page.title}</h1>
              <p>{page.subtitle}</p>
            </div>
          </div>

          <div className="topbar-right">
            {location.pathname === '/' && (
              <button className="primary-btn" onClick={() => navigate('/bikes/new')}>
                + Add New Bike
              </button>
            )}
            <button className="secondary-btn" type="button" onClick={logout}>
              Logout
            </button>
          </div>
        </header>

        <div className="page-content">
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
