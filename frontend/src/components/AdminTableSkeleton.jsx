export default function AdminTableSkeleton() {
  return (
    <div className="admin-skeleton">
      <div className="admin-skeleton-toolbar">
        <div className="skeleton-block" style={{ height: 48, flex: 1 }} />
        <div className="skeleton-block" style={{ height: 48, width: 190 }} />
      </div>

      <div className="admin-skeleton-table">
        <div className="skeleton-block" style={{ height: 46, marginBottom: 12 }} />
        <div className="skeleton-block" style={{ height: 56, marginBottom: 10 }} />
        <div className="skeleton-block" style={{ height: 56, marginBottom: 10 }} />
        <div className="skeleton-block" style={{ height: 56, marginBottom: 10 }} />
        <div className="skeleton-block" style={{ height: 56 }} />
      </div>
    </div>
  );
}
