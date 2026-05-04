'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { StatsSkeleton } from '@/components/LoadingSkeleton';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/dashboard?userId=${session.user.id}`)
        .then(r => r.json())
        .then(data => { if (data.success) setStats(data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [session]);

  const getDueStatus = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    if (diff < 0) return { label: 'Overdue', class: 'badge-danger' };
    if (diff <= 3) return { label: 'Due Soon', class: 'badge-warning' };
    return { label: 'On Time', class: 'badge-success' };
  };

  if (loading) return <div><StatsSkeleton count={4} /></div>;

  return (
    <div className="animate-fade-up">
      <h1 style={{ fontSize: '28px', marginBottom: '32px' }}>Dashboard Overview</h1>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {[
          { label: 'Books Borrowed', value: stats?.totalBorrowed || 0, color: 'var(--accent)', icon: '📚' },
          { label: 'Books Returned', value: stats?.totalReturned || 0, color: 'var(--success)', icon: '✅' },
          { label: 'Active Loans', value: stats?.activeLoans || 0, color: '#f59e0b', icon: '📖' },
          { label: 'Reviews Given', value: stats?.reviewsGiven || 0, color: 'var(--primary)', icon: '⭐' },
        ].map((stat, i) => (
          <div key={i} className="card" style={{ padding: '24px', textAlign: 'center' }}>
            <span style={{ fontSize: '28px', display: 'block', marginBottom: '8px' }}>{stat.icon}</span>
            <p style={{ fontSize: '32px', fontWeight: '800', color: stat.color }}>{stat.value}</p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500', marginTop: '4px' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Currently Borrowed */}
      <div className="card" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px' }}>Currently Borrowed</h3>
          <Link href="/dashboard/borrowed" style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: '600' }}>View All →</Link>
        </div>
        {stats?.currentlyBorrowed?.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stats.currentlyBorrowed.slice(0, 5).map((loan, i) => {
              const status = getDueStatus(loan.dueDate);
              return (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: '600', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={loan.bookTitle}>
                      {loan.bookTitle}
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Due: {new Date(loan.dueDate).toLocaleDateString()}</p>
                  </div>
                  <span className={`badge ${status.class}`}>{status.label}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>No active loans. Visit the <Link href="/library" style={{ color: 'var(--accent)' }}>library</Link> to borrow books!</p>
        )}
      </div>

      {/* Recommended */}
      <div className="card">
        <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>Recommended For You</h3>
        {stats?.recommended?.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {stats.recommended.map((book, i) => (
              <Link key={i} href={`/library/${book._id}`} style={{ textDecoration: 'none' }}>
                <div style={{ padding: '16px', borderLeft: '3px solid var(--accent)', background: 'var(--surface-hover)', borderRadius: '4px' }}>
                  <p style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: '700', marginBottom: '4px' }}>{book.category}</p>
                  <h4 style={{ fontSize: '14px', marginBottom: '4px' }}>{book.title}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{book.author}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>Borrow some books to get personalized recommendations!</p>
        )}
      </div>
    </div>
  );
}
