export default function PageLoader({ label = 'Laden...' }) {
  return (
    <div className="page-loader">
      <div className="page-loader-spinner" />
      <p>{label}</p>
    </div>
  );
}
