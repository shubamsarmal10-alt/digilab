'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { TableSkeleton } from '@/components/LoadingSkeleton';

export default function HistoryPage() {
  const { data: session } = useSession();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/dashboard/history?userId=${session.user.id}`)
        .then(r => r.json())
        .then(data => { if (data.success) setHistory(data.history || []); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [session]);

  if (loading) return <div><h1 style={{ fontSize: '28px', marginBottom: '32px' }}>Reading History</h1><TableSkeleton /></div>;

  return (
    <div className="animate-fade-up">
      <h1 style={{ fontSize: '28px', marginBottom: '32px' }}>Reading History</h1>

      {history.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📜</div>
          <h3>No history yet</h3>
          <p style={{ color: 'var(--text-muted)' }}>Your borrow and return history will appear here.</p>
        </div>
      ) : (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Book</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Issued</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Returned</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Status</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Fine</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px', fontWeight: '600', fontSize: '14px' }}>{item.bookTitle}</td>
                  <td style={{ padding: '16px', fontSize: '13px' }}>{new Date(item.issueDate).toLocaleDateString()}</td>
                  <td style={{ padding: '16px', fontSize: '13px' }}>{item.returnDate ? new Date(item.returnDate).toLocaleDateString() : '—'}</td>
                  <td style={{ padding: '16px' }}>
                    <span className={`badge ${item.status === 'returned' ? 'badge-success' : item.status === 'issued' ? 'badge-warning' : 'badge-danger'}`}>
                      {item.status === 'returned' ? 'Returned' : item.status === 'issued' ? 'Active' : 'Overdue'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontSize: '13px', fontWeight: item.fineAmount > 0 ? '700' : '400', color: item.fineAmount > 0 ? 'var(--danger)' : 'inherit' }}>
                    {item.fineAmount > 0 ? `₹${item.fineAmount}` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
