'use client';

import { useState, useEffect } from 'react';
import { StatsSkeleton } from '@/components/LoadingSkeleton';

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then(r => r.json())
      .then(data => { if (data.success) setStats(data.stats); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div><h1 style={{ fontSize: '28px', marginBottom: '32px' }}>Analytics</h1><StatsSkeleton /></div>;

  const maxBorrowed = Math.max(...(stats?.popularBooks?.map(b => b.totalIssued) || [1]), 1);

  return (
    <div className="animate-fade-up">
      <h1 style={{ fontSize: '28px', marginBottom: '32px' }}>Analytics & Reports</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* Most Borrowed Books */}
        <div className="card">
          <h3 style={{ marginBottom: '24px', fontSize: '18px' }}>Most Borrowed Books (Top 10)</h3>
          {stats?.popularBooks?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {stats.popularBooks.slice(0, 10).map((book, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', flexShrink: 0 }}>
                    {i + 1}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>{book.title || book._id}</p>
                    <div style={{ width: '100%', height: '6px', background: 'var(--border)', borderRadius: '3px' }}>
                      <div style={{ width: `${(book.totalIssued / maxBorrowed) * 100}%`, height: '100%', background: 'var(--accent)', borderRadius: '3px' }} />
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--accent)', flexShrink: 0 }}>{book.totalIssued}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>No borrow data yet</p>
          )}
        </div>

        {/* Category Distribution */}
        <div className="card">
          <h3 style={{ marginBottom: '24px', fontSize: '18px' }}>Books by Category</h3>
          {stats?.categoryStats?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {stats.categoryStats.map((cat, i) => {
                const colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '500' }}>{cat._id}</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: colors[i % colors.length] }}>{cat.count}</span>
                    </div>
                    <div style={{ width: '100%', height: '32px', background: 'var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${(cat.count / (stats.totalBooks || 1)) * 100}%`,
                        height: '100%', background: colors[i % colors.length],
                        borderRadius: '6px', display: 'flex', alignItems: 'center', paddingLeft: '12px',
                        color: 'white', fontSize: '12px', fontWeight: '600',
                        minWidth: '40px', transition: 'width 1s ease',
                      }}>
                        {Math.round((cat.count / (stats.totalBooks || 1)) * 100)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>No category data</p>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="card">
        <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>System Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px' }}>
          {[
            { label: 'Total Books', value: stats?.totalBooks || 0 },
            { label: 'Total Users', value: stats?.totalUsers || 0 },
            { label: 'Active Loans', value: stats?.activeIssues || 0 },
            { label: 'Categories', value: stats?.categoryStats?.length || 0 },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '16px' }}>
              <p style={{ fontSize: '36px', fontWeight: '800', color: 'var(--accent)' }}>{s.value}</p>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
