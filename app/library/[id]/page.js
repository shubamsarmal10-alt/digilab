'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Modal } from '@/components/Modal';
import { StarRating } from '@/components/StarRating';
import { useToast } from '@/components/Toast';

export default function BookDetailPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const { addToast } = useToast();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [issueModal, setIssueModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetch(`/api/books/${id}`).then(r => r.json()).then(data => {
      if (data.success) setBook(data.book);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleIssue = async () => {
    if (!session) { router.push('/login?message=Please login to borrow books'); return; }
    setIssueModal(true);
  };

  const confirmIssue = async () => {
    setIssueModal(false);
    const res = await fetch('/api/issue', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId: id, userId: session.user.id }),
    });
    const data = await res.json();
    if (data.success) { addToast('Book issued successfully!', 'success'); fetch(`/api/books/${id}`).then(r => r.json()).then(d => { if (d.success) setBook(d.book); }); }
    else addToast(data.error || 'Failed to issue', 'error');
  };

  const submitReview = async () => {
    if (!session) { router.push('/login'); return; }
    const res = await fetch(`/api/books/${id}/reviews`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: session.user.name, userId: session.user.id, rating, comment }),
    });
    const data = await res.json();
    if (data.success) { addToast('Review submitted!', 'success'); setShowReviewForm(false); setComment(''); setRating(5); fetch(`/api/books/${id}`).then(r => r.json()).then(d => { if (d.success) setBook(d.book); }); }
    else addToast('Failed to submit review', 'error');
  };

  if (loading) return <div className="container" style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>;
  if (!book) return <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}><h2>Book not found</h2><Link href="/library" className="btn btn-primary" style={{ marginTop: '16px' }}>Back to Library</Link></div>;

  const avgRating = book.averageRating || (book.reviews?.length > 0 ? (book.reviews.reduce((a, r) => a + r.rating, 0) / book.reviews.length).toFixed(1) : 0);

  return (
    <div className="container animate-fade-up">
      <Link href="/library" style={{ color: 'var(--accent)', fontSize: '14px', fontWeight: '500', display: 'inline-block', marginBottom: '32px' }}>← Back to Library</Link>
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '48px', marginBottom: '48px' }}>
        {/* Cover placeholder */}
        <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)', borderRadius: 'var(--radius-lg)', height: '420px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', padding: '32px', textAlign: 'center' }}>
          <span style={{ fontSize: '64px', marginBottom: '16px' }}>📖</span>
          <h3 style={{ color: 'white', fontSize: '18px', marginBottom: '8px' }}>{book.title}</h3>
          <p style={{ opacity: 0.8, fontSize: '14px' }}>{book.author}</p>
        </div>
        {/* Details */}
        <div>
          <span className="badge badge-success" style={{ marginBottom: '16px' }}>{book.category}</span>
          <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>{book.title}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '18px', marginBottom: '24px' }}>{book.author}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <StarRating value={Math.round(Number(avgRating))} readOnly size={22} />
            <span style={{ fontWeight: '600' }}>{avgRating || 'Unrated'}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>({book.reviews?.length || 0} reviews)</span>
          </div>
          <p style={{ color: 'var(--text-main)', lineHeight: '1.8', marginBottom: '32px', fontSize: '15px' }}>{book.description || 'No description available.'}</p>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            <div className="card" style={{ padding: '16px 24px', textAlign: 'center', flex: 1 }}>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Available</p>
              <p style={{ fontSize: '28px', fontWeight: '800', color: book.availableQuantity > 0 ? 'var(--success)' : 'var(--danger)' }}>{book.availableQuantity}</p>
            </div>
            <div className="card" style={{ padding: '16px 24px', textAlign: 'center', flex: 1 }}>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Total Copies</p>
              <p style={{ fontSize: '28px', fontWeight: '800' }}>{book.quantity}</p>
            </div>
            <div className="card" style={{ padding: '16px 24px', textAlign: 'center', flex: 1 }}>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>ISBN</p>
              <p style={{ fontSize: '14px', fontWeight: '600', marginTop: '8px' }}>{book.isbn || 'N/A'}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-primary" style={{ padding: '14px 32px' }} onClick={handleIssue} disabled={book.availableQuantity <= 0}>
              {book.availableQuantity > 0 ? 'Issue This Book' : 'Unavailable'}
            </button>
            <Link href={`/library/${id}/chapters`} className="btn btn-secondary" style={{ padding: '14px 32px' }}>View Chapters</Link>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="card" style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px' }}>Reviews ({book.reviews?.length || 0})</h2>
          <button className="btn btn-accent" onClick={() => { if (!session) router.push('/login'); else setShowReviewForm(!showReviewForm); }}>
            {showReviewForm ? 'Cancel' : 'Write a Review'}
          </button>
        </div>
        {showReviewForm && (
          <div style={{ padding: '24px', background: 'var(--surface-hover)', borderRadius: 'var(--radius-sm)', marginBottom: '24px' }}>
            <div className="form-group"><label className="form-label">Rating</label><StarRating value={rating} onChange={setRating} /></div>
            <div className="form-group"><label className="form-label">Comment</label><textarea className="form-textarea" rows="3" value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your thoughts..." /></div>
            <button className="btn btn-primary" onClick={submitReview}>Submit Review</button>
          </div>
        )}
        {book.reviews?.length > 0 ? book.reviews.map((review, i) => (
          <div key={i} className="review-item">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div><strong>{review.user}</strong><span style={{ color: 'var(--text-light)', fontSize: '12px', marginLeft: '12px' }}>{review.date ? new Date(review.date).toLocaleDateString() : ''}</span></div>
              <StarRating value={review.rating} readOnly size={16} />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{review.comment}</p>
          </div>
        )) : !showReviewForm && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '32px' }}>No reviews yet. Be the first to review!</p>}
      </div>

      <Modal isOpen={issueModal} onClose={() => setIssueModal(false)} title="Borrow Book" onConfirm={confirmIssue} confirmText="Confirm Borrow">
        <p>Borrow <strong>{book.title}</strong>? Due in 14 days.</p>
      </Modal>
    </div>
  );
}
