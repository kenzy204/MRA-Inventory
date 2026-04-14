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
        title: 'Voorraadoverzicht',
        subtitle: 'Beheer je premium e-bike collectie snel, duidelijk en professioneel.'
      };
    }

    if (location.pathname === '/bikes/new') {
      return {
        title: 'Nieuwe fiets toevoegen',
        subtitle: 'Maak een nieuwe fiets aan met specificaties, media en Shopify-sync.'
      };
    }

    if (location.pathname.includes('/bikes/') && location.pathname.includes('/edit')) {
      return {
        title: 'Fiets bewerken',
        subtitle: 'Werk specificaties, afbeeldingen en synchronisatiegegevens bij.'
      };
    }

    if (location.pathname === '/settings') {
      return {
        title: 'Shopify-instellingen',
        subtitle: 'Beheer winkelkoppeling, toegangsgegevens en synchronisatie.'
      };
    }

    if (location.pathname === '/sync-logs') {
      return {
        title: 'Synchronisatielogs',
        subtitle: 'Bekijk recente synchronisaties en los fouten sneller op.'
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
            <h1 className="brand-title">MRA Voorraad</h1>
            <div className="brand-subtitle">E-Bike Beheer</div>
          </div>
        </div>

        <div className="nav-section">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">◻</span>
            <span>Voorraad</span>
          </NavLink>

          <NavLink
            to="/bikes/new"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">＋</span>
            <span>Nieuwe fiets</span>
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
            <div className="sidebar-live-title">Werkruimte</div>
            <div className="sidebar-live-value">Verbonden & klaar</div>
            <div className="sidebar-live-note">
              Beheer fietsen, media en Shopify-sync op één centrale plek.
            </div>
          </div>
        </div>
      </aside>

      {mobileNavOpen && (
        <button
          className="mobile-overlay"
          type="button"
          onClick={() => setMobileNavOpen(false)}
          aria-label="Menu sluiten"
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
                + Nieuwe fiets
              </button>
            )}
            <button className="secondary-btn" type="button" onClick={logout}>
              Uitloggen
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
