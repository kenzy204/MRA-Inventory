import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-grid">

      <div className="panel">
        <h2>Welkom bij CyclePro</h2>

        <div className="announcement-box">
          Goed nieuws: we bouwen aan een nieuwe inruiltool om het
          inruilproces sneller, makkelijker en efficiënter te maken.
          Binnenkort meer!
        </div>
      </div>

      <div className="card-grid">
        <div className="stat-card">
          <div className="stat-label">Snelle actie</div>
          <button
            className="primary-btn"
            onClick={() => navigate('/bikes/new')}
          >
            + Nieuwe fiets
          </button>
        </div>

        <div className="stat-card">
          <div className="stat-label">Voorraad</div>
          <button
            className="secondary-btn"
            onClick={() => navigate('/fietsen')}
          >
            Bekijk fietsen
          </button>
        </div>

        <div className="stat-card">
          <div className="stat-label">Instellingen</div>
          <button
            className="secondary-btn"
            onClick={() => navigate('/settings')}
          >
            Open instellingen
          </button>
        </div>
      </div>
    </div>
  );
}
