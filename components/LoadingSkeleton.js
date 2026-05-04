export function CardSkeleton({ count = 3 }) {
  return (
    <div className="grid-cards">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card skeleton-card">
          <div className="skeleton skeleton-badge" />
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-text-short" />
          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <div className="skeleton skeleton-button" />
            <div className="skeleton skeleton-button" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div style={{ width: '100%' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: '16px', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="skeleton skeleton-text" style={{ flex: 1 }} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function StatsSkeleton({ count = 4 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))`, gap: '24px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card" style={{ padding: '24px', textAlign: 'center' }}>
          <div className="skeleton skeleton-text-short" style={{ margin: '0 auto 12px' }} />
          <div className="skeleton skeleton-title" style={{ margin: '0 auto 8px', width: '60px' }} />
          <div className="skeleton skeleton-text-short" style={{ margin: '0 auto' }} />
        </div>
      ))}
    </div>
  );
}
