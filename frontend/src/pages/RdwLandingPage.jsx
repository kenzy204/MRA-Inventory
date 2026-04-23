import { useParams } from 'react-router-dom';

const externalPages = {
  machtigen: 'https://opendata.rdw.nl/Voertuigen/Open-Data-RDW-Gekentekende_voertuigen/m9d7-ebf2/about_data ',
  tv: 'https://opendata.rdw.nl/Voertuigen/Open-Data-RDW-Gekentekende_voertuigen/m9d7-ebf2/about_data ',
  tda: 'https://opendata.rdw.nl/Voertuigen/Open-Data-RDW-Gekentekende_voertuigen/m9d7-ebf2/about_data ',
  ott: 'https://opendata.rdw.nl/Voertuigen/Open-Data-RDW-Gekentekende_voertuigen/m9d7-ebf2/about_data ',
  'rijbewijsnummer-controleren': 'https://opendata.rdw.nl/Voertuigen/Open-Data-RDW-Gekentekende_voertuigen/m9d7-ebf2/about_data ',
  'kentekencard-controleren': 'https://opendata.rdw.nl/Voertuigen/Open-Data-RDW-Gekentekende_voertuigen/m9d7-ebf2/about_data '
};

export default function RdwLandingPage() {
  const { page } = useParams();

  const link = externalPages[page];

  if (link && link !== 'PUT-YOUR-LINK-HERE') {
    window.open(link, '_blank', 'noopener,noreferrer');
    return null;
  }

  return (
    <div className="panel">
      <h2 style={{ marginTop: 0 }}>RDW - {page}</h2>

      <p style={{ color: 'var(--muted)' }}>
        Deze pagina is klaar.
      </p>

      <p>
        Voeg later jouw link of functionaliteit toe.
      </p>
    </div>
  );
}
