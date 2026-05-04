'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Modal } from '@/components/Modal';
import { useToast } from '@/components/Toast';
import { TableSkeleton } from '@/components/LoadingSkeleton';

export default function BorrowedBooksPage() {
  const { data: session } = useSession();
  const { addToast } = useToast();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returnModal, setReturnModal] = useState({ open: false, loan: null });

  const fetchLoans = () => {
    if (session?.user?.id) {
      fetch(`/api/dashboard?userId=${session.user.id}&type=borrowed`)
        .then(r => r.json())
        .then(data => { if (data.success) setLoans(data.currentlyBorrowed || []); setLoading(false); })
        .catch(() => setLoading(false));
    }
  };

  useEffect(() => { fetchLoans(); }, [session]);

  const getDueStatus = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    if (diff < 0) return { label: 'Overdue', class: 'badge-danger' };
    if (diff <= 3) return { label: 'Due Soon', class: 'badge-warning' };
    return { label: 'On Time', class: 'badge-success' };
  };

  const handleReturn = async () => {
    const loan = returnModal.loan;
    setReturnModal({ open: false, loan: null });
    try {
      const res = await fetch('/api/issue/return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId: loan._id, bookId: loan.bookId, userId: session.user.id }),
      });
      const data = await res.json();
      if (data.success) {
        addToast('Book returned successfully!', 'success');
        fetchLoans();
      } else {
        addToast(data.error || 'Failed to return book', 'error');
      }
    } catch (err) {
      addToast('Failed to return book', 'error');
    }
  };

  if (loading) return <div><h1 style={{ fontSize: '28px', marginBottom: '32px' }}>Borrowed Books</h1><TableSkeleton rows={5} cols={5} /></div>;

  return (
    <div className="animate-fade-up">
      <h1 style={{ fontSize: '28px', marginBottom: '32px' }}>Borrowed Books</h1>

      {loans.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <h3>No active loans</h3>
          <p style={{ color: 'var(--text-muted)' }}>You haven&apos;t borrowed any books yet.</p>
        </div>
      ) : (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Title</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Issue Date</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Due Date</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Status</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loans.map(loan => {
                const status = getDueStatus(loan.dueDate);
                return (
                  <tr key={loan._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px' }}>
                      <p style={{ fontWeight: '600', fontSize: '14px' }}>{loan.bookTitle}</p>
                    </td>
                    <td style={{ padding: '16px', fontSize: '13px' }}>{new Date(loan.issueDate).toLocaleDateString()}</td>
                    <td style={{ padding: '16px', fontSize: '13px' }}>{new Date(loan.dueDate).toLocaleDateString()}</td>
                    <td style={{ padding: '16px' }}><span className={`badge ${status.class}`}>{status.label}</span></td>
                    <td style={{ padding: '16px' }}>
                      <button className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '12px' }}
                        onClick={() => setReturnModal({ open: true, loan })}>
                        Return
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={returnModal.open} onClose={() => setReturnModal({ open: false, loan: null })}
        title="Return Book" onConfirm={handleReturn} confirmText="Confirm Return">
        {returnModal.loan && (
          <div>
            <p style={{ marginBottom: '16px' }}>Return <strong>{returnModal.loan.bookTitle}</strong>?</p>
            {new Date() > new Date(returnModal.loan.dueDate) && (
              <div style={{ padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626' }}>
                <p style={{ fontWeight: '700', fontSize: '14px' }}>⚠️ Overdue Fine Notice</p>
                <p style={{ fontSize: '13px' }}>
                  This book is overdue. A fine of <strong>₹{
                    Math.ceil(Math.abs(new Date() - new Date(returnModal.loan.dueDate)) / (1000 * 60 * 60 * 24)) * 3
                  }</strong> will be applied (₹3/day).
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
