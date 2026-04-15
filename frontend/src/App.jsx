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
import { useEffect, useMemo, useState } from 'react';

import LoginPage from './pages/LoginPage';
import BikesPage from './pages/BikesPage';
import BikeCreatePage from './pages/BikeCreatePage';
import BikeEditPage from './pages/BikeEditPage';
import SettingsPage from './pages/SettingsPage';
import SyncLogsPage from './pages/SyncLogsPage';

import DashboardPage from './pages/DashboardPage';
import AdministratiePage from './pages/AdministratiePage';
import FietsverzekeringPage from './pages/FietsverzekeringPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import SocialMediaPage from './pages/SocialMediaPage';

function ProtectedLayout() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  const activeMenu = useMemo(() => {
    if (location.pathname.startsWith('/fietsen')) return 'voertuigen';
    if (location.pathname.startsWith('/account')) return 'account';
    if (location.pathname.startsWith('/social-media') || location.pathname.startsWith('/settings')) {
      return 'settings';
    }
    if (location.pathname.startsWith('/fietsverzekering')) return 'tools';
    return null;
  }, [location.pathname]);

  useEffect(() => {
    if (activeMenu) {
      setOpenMenu(activeMenu);
    }
  }, [activeMenu]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  function logout() {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  }

  function toggleMenu(name) {
    setOpenMenu((prev) => (prev === name ? null : name));
  }

  function getPageMeta() {
    if (location.pathname === '/') {
      return {
        title: 'Dashboard',
        subtitle: 'Welkom bij CyclePro.'
      };
    }

    if (location.pathname === '/fietsen') {
      return {
        title: 'Fietsen',
        subtitle: 'Beheer je voorraad en premium e-bike collectie.'
      };
    }

    if (location.pathname === '/administratie') {
      return {
        title: 'Administratie',
        subtitle: 'Overzicht van rapportages en administratieve functies.'
      };
    }

    if (location.pathname === '/fietsverzekering') {
      return {
        title: 'Fietsverzekering',
        subtitle: 'Tools en informatie rondom verzekeringen.'
      };
    }

    if (location.pathname === '/account/change-password') {
      return {
        title: 'Wachtwoord wijzigen',
        subtitle: 'Werk je accountwachtwoord veilig bij.'
      };
    }

    if (location.pathname === '/social-media') {
      return {
        title: 'Social media',
        subtitle: 'Beheer je social media links en kanalen.'
      };
    }

    if (location.pathname === '/settings') {
      return {
        title: 'MRA E-Bike Center',
        subtitle: 'Beheer winkelkoppeling en instellingen.'
      };
    }

    if (location.pathname === '/bikes/new') {
      return {
        title: 'Nieuwe fiets toevoegen',
        subtitle: 'Maak een nieuwe fiets aan.'
      };
    }

    if (
      location.pathname.includes('/bikes/') &&
      location.pathname.includes('/edit')
    ) {
      return {
        title: 'Fiets bewerken',
        subtitle: 'Werk fietsgegevens en media bij.'
      };
    }

    if (location.pathname === '/sync-logs') {
      return {
        title: 'Synchronisatielogs',
        subtitle: 'Bekijk recente synchronisaties.'
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
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">◻</span>
            <span>Dashboard</span>
          </NavLink>

          <button
            className={`nav-group-btn ${openMenu === 'voertuigen' ? 'open' : ''}`}
            onClick={() => toggleMenu('voertuigen')}
            type="button"
          >
            <span>Voertuigen</span>
            <span className="nav-caret">{openMenu === 'voertuigen' ? '−' : '+'}</span>
          </button>

          {openMenu === 'voertuigen' && (
            <div className="submenu">
              <NavLink
                to="/fietsen"
                className={({ isActive }) => `nav-sublink ${isActive ? 'active' : ''}`}
              >
                Fietsen
              </NavLink>
            </div>
          )}

          <NavLink
            to="/administratie"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">◻</span>
            <span>Administratie</span>
          </NavLink>

          <button
            className={`nav-group-btn ${openMenu === 'tools' ? 'open' : ''}`}
            onClick={() => toggleMenu('tools')}
            type="button"
          >
            <span>Tools</span>
            <span className="nav-caret">{openMenu === 'tools' ? '−' : '+'}</span>
          </button>

          {openMenu === 'tools' && (
            <div className="submenu">
              <NavLink
                to="/fietsverzekering"
                className={({ isActive }) => `nav-sublink ${isActive ? 'active' : ''}`}
              >
                Fietsverzekering
              </NavLink>
            </div>
          )}

          <button
            className={`nav-group-btn ${openMenu === 'account' ? 'open' : ''}`}
            onClick={() => toggleMenu('account')}
            type="button"
          >
            <span>Mijn account</span>
            <span className="nav-caret">{openMenu === 'account' ? '−' : '+'}</span>
          </button>

          {openMenu === 'account' && (
            <div className="submenu">
              <NavLink
                to="/account/change-password"
                className={({ isActive }) => `nav-sublink ${isActive ? 'active' : ''}`}
              >
                Wachtwoord wijzigen
              </NavLink>
            </div>
          )}

          <button
            className={`nav-group-btn ${openMenu === 'settings' ? 'open' : ''}`}
            onClick={() => toggleMenu('settings')}
            type="button"
          >
            <span>Instellingen</span>
            <span className="nav-caret">{openMenu === 'settings' ? '−' : '+'}</span>
          </button>

          {openMenu === 'settings' && (
            <div className="submenu">
              <NavLink
                to="/social-media"
                className={({ isActive }) => `nav-sublink ${isActive ? 'active' : ''}`}
              >
                Social media
              </NavLink>

              <NavLink
                to="/settings"
                className={({ isActive }) => `nav-sublink ${isActive ? 'active' : ''}`}
              >
                MRA E-Bike Center
              </NavLink>
            </div>
          )}

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
            {['/', '/fietsen'].includes(location.pathname) && (
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
          <Route path="/" element={<DashboardPage />} />

          <Route path="/fietsen" element={<BikesPage />} />
          <Route path="/bikes/new" element={<BikeCreatePage />} />
          <Route path="/bikes/:id/edit" element={<BikeEditPage />} />

          <Route path="/administratie" element={<AdministratiePage />} />
          <Route path="/fietsverzekering" element={<FietsverzekeringPage />} />

          <Route
            path="/account/change-password"
            element={<ChangePasswordPage />}
          />

          <Route path="/social-media" element={<SocialMediaPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          <Route path="/sync-logs" element={<SyncLogsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
