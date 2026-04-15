export default function TableSkeleton({ rows = 5 }) {
  return (
    <div className="table-skeleton">
      <div className="table-skeleton-head">
        <div className="skeleton-block" style={{ height: 42 }} />
      </div>

      <div className="table-skeleton-body">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="table-skeleton-row">
            <div className="skeleton-block" style={{ height: 54 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
