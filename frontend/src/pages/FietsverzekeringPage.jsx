export default function FietsverzekeringPage() {
  const insuranceUrl =
    'https://service.unigarant.nl/Axon/add-single-application/form/fill-form/screen/S1?formExtId=ANDoorlopendeFiets&formDialogueExtId=aanvraagInternetExternSysteemANWB&formBehaviourExtId=%257B%2522prefix%2522%253A%2522A%2522%252C%2522agreementExtId%2522%253A%252213283.ANDoorlopendeFiets%2522%257D&dateFormDefinition=2026-04-15&originExtId=Internet';

  return (
    <div className="insurance-page">
      <div className="panel">
        <h2 style={{ marginTop: 0 }}>Fietsverzekering</h2>

        <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
          Op deze pagina vind je informatie over onze fietsverzekering.
          Via de knop hieronder kun je direct doorgaan naar de externe
          verzekeringsaanvraag.
        </p>

        <div className="insurance-info-box">
          <h3 style={{ marginTop: 0 }}>Belangrijke informatie</h3>

          <ul className="insurance-list">
            <li>De aanvraag wordt geopend in een nieuw tabblad.</li>
            <li>Je wordt doorgestuurd naar onze verzekeringspartner.</li>
            <li>Controleer je gegevens goed voordat je de aanvraag verzendt.</li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 20 }}>
          <a
            href={insuranceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="primary-btn"
          >
            Open fietsverzekering
          </a>
        </div>
      </div>
    </div>
  );
}
