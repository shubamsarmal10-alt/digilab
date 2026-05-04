'use client';

import { useState, useEffect } from 'react';
import { StatsSkeleton } from '@/components/LoadingSkeleton';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then(r => r.json())
      .then(data => { if (data.success) setStats(data.stats); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div><h1 style={{ fontSize: '28px', marginBottom: '32px' }}>Dashboard</h1><StatsSkeleton /></div>;

  return (
    <div className="animate-fade-up">
      <h1 style={{ fontSize: '28px', marginBottom: '32px' }}>Dashboard</h1>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <a href="/admin/books" className="btn btn-primary" style={{ padding: '10px 20px' }}>➕ Add/Manage Books</a>
        <a href="/admin/users" className="btn btn-secondary" style={{ padding: '10px 20px' }}>👥 Manage Users</a>
        <a href="/admin/analytics" className="btn btn-accent" style={{ padding: '10px 20px' }}>📈 View Reports</a>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {[
          { label: 'Total Books', value: stats?.totalBooks || 0, icon: '📚', color: 'var(--accent)' },
          { label: 'Total Users', value: stats?.totalUsers || 0, icon: '👥', color: 'var(--success)' },
          { label: 'Active Loans', value: stats?.activeIssues || 0, icon: '📖', color: '#f59e0b' },
          { label: 'Total Reviews', value: stats?.totalReviews || 0, icon: '⭐', color: 'var(--primary)' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: '24px', textAlign: 'center' }}>
            <span style={{ fontSize: '28px', display: 'block', marginBottom: '8px' }}>{s.icon}</span>
            <p style={{ fontSize: '32px', fontWeight: '800', color: s.color }}>{s.value}</p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500', marginTop: '4px' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
        {/* Recent Activity */}
        <div className="card">
          <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Recent Activity</h3>
          {stats?.recentActivity?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {stats.recentActivity.map((act, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: '600', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={act.bookTitle}>
                      {act.bookTitle}
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {act.status === 'issued' ? 'Issued to' : 'Returned by'} {act.userId}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`badge ${act.status === 'issued' ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: '10px', padding: '2px 8px' }}>
                      {act.status}
                    </span>
                    <p style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '4px' }}>
                      {new Date(act.returnDate || act.issueDate || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>No recent activity</p>
          )}
        </div>

        {/* Category Distribution */}
        <div className="card">
          <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Categories</h3>
          {stats?.categoryStats?.map((cat, i) => (
            <div key={i} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: '500' }}>{cat._id}</span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{cat.count} books</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--border)', borderRadius: '4px' }}>
                <div style={{
                  width: `${Math.min((cat.count / (stats.totalBooks || 1)) * 100, 100)}%`,
                  height: '100%', background: 'var(--accent)', borderRadius: '4px',
                  transition: 'width 1s ease',
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
