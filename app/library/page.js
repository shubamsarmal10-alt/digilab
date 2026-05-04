'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Modal } from '@/components/Modal';
import { useToast } from '@/components/Toast';
import { CardSkeleton } from '@/components/LoadingSkeleton';

const categories = ["All", "Fiction", "Non-Fiction", "Science", "Technology", "History", "Biography", "Classic"];

const StarRating = ({ value, onChange }) => {
  return (
    <div className="star-rating" style={{ marginBottom: '10px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= value ? 'active' : ''}
          onClick={() => onChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default function LibraryPage() {
  const { data: session } = useSession();
  const { addToast } = useToast();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('All');
  const [sortBy, setSortBy] = useState('title');

  const [issueModal, setIssueModal] = useState({ open: false, book: null });
  const [borrowedBookIds, setBorrowedBookIds] = useState([]);
  const [reviewingBookId, setReviewingBookId] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchBorrowed = async () => {
    if (session?.user?.id) {
      try {
        const res = await fetch(`/api/dashboard?userId=${session.user.id}&type=borrowed`);
        const data = await res.json();
        if (data.success) {
          setBorrowedBookIds((data.currentlyBorrowed || []).map(b => b.bookId));
        }
      } catch (err) { console.error(err); }
    }
  };

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/books?q=${searchQuery}&category=${searchCategory}&sort=${sortBy}`);
      const data = await res.json();
      if (data.success) setBooks(data.books);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchBooks, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchCategory, sortBy]);

  useEffect(() => {
    fetchBorrowed();
  }, [session]);

  const handleIssue = (book) => {
    if (!session) {
      addToast('Please login to borrow books', 'info');
      return;
    }
    setIssueModal({ open: true, book });
  };

  const confirmIssue = async () => {
    const book = issueModal.book;
    setIssueModal({ open: false, book: null });

    try {
      const res = await fetch('/api/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: book._id, userId: session.user.id }),
      });
      const data = await res.json();
      if (data.success) {
        addToast(`Successfully issued: ${book.title}`, 'success');
        fetchBooks();
        fetchBorrowed();
      } else {
        addToast(data.error || 'Failed to issue book', 'error');
      }
    } catch (err) {
      addToast('Error issuing book', 'error');
    }
  };

  const submitReview = async (bookId) => {
    if (!session) {
      addToast('Please login to review', 'info');
      return;
    }
    if (!comment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await fetch('/api/books/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId,
          userId: session.user.id,
          userName: session.user.name,
          rating,
          comment
        }),
      });
      const data = await res.json();
      if (data.success) {
        addToast('Review submitted!', 'success');
        setReviewingBookId(null);
        setComment('');
        setRating(5);
        fetchBooks();
      }
    } catch (err) {
      addToast('Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="container">
      <div className="animate-fade-up">
        <div className="page-header">
          <h1 className="page-title">Explore Library</h1>
          <p className="page-subtitle">Discover our curated collection of academic resources.</p>
        </div>

        <div className="card" style={{ marginBottom: '48px', padding: '32px' }}>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: '2 1 300px' }}>
              <label className="form-label">Search</label>
              <input type="text" className="form-input" placeholder="Search title, author..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <div style={{ flex: '1 1 180px' }}>
              <label className="form-label">Category</label>
              <select className="form-select" value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)}>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div style={{ flex: '1 1 180px' }}>
              <label className="form-label">Sort</label>
              <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="title">Alphabetical</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Recently Added</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? <CardSkeleton count={6} /> : (
          <div className="grid-cards">
            {books.map((book) => (
              <div key={book._id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className={`badge ${book.availableQuantity > 0 ? 'badge-success' : 'badge-danger'}`}>
                    {book.availableQuantity > 0 ? 'Available' : 'Out of Stock'}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: '700' }}>{book.category}</span>
                </div>
                <Link href={`/library/${book._id}`}>
                  <h3 style={{ fontSize: '20px', cursor: 'pointer' }}>{book.title}</h3>
                </Link>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{book.author}</p>
                
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {borrowedBookIds.includes(book._id) ? (
                    <button className="btn btn-secondary" style={{ flex: '1 1 120px', cursor: 'default' }} disabled>
                      ✓ Issued
                    </button>
                  ) : (
                    <button className="btn btn-primary" style={{ flex: '1 1 120px' }} onClick={() => handleIssue(book)} disabled={book.availableQuantity <= 0}>
                      Issue
                    </button>
                  )}
                  <Link href={`/library/${book._id}/chapters`} className="btn btn-secondary" style={{ flex: '1 1 100px' }}>Chapters</Link>
                  {session?.user?.role === 'admin' && (
                    <Link href="/admin/books" className="btn btn-accent" style={{ padding: '8px 12px' }} title="Manage Book">⚙️</Link>
                  )}
                </div>

                <button className="btn btn-secondary" style={{ fontSize: '12px', padding: '4px' }} onClick={() => setReviewingBookId(reviewingBookId === book._id ? null : book._id)}>
                  {reviewingBookId === book._id ? 'Cancel' : 'Add Review'}
                </button>

                {reviewingBookId === book._id && (
                  <div style={{ marginTop: '12px' }}>
                    <StarRating value={rating} onChange={setRating} />
                    <textarea className="form-textarea" placeholder="Comment..." value={comment} onChange={e => setComment(e.target.value)} />
                    <button className="btn btn-accent" style={{ width: '100%', marginTop: '8px' }} onClick={() => submitReview(book._id)} disabled={submittingReview}>
                      Submit
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={issueModal.open} onClose={() => setIssueModal({ open: false, book: null })} title="Borrow Book" onConfirm={confirmIssue}>
        {issueModal.book && <p>Borrow <strong>{issueModal.book.title}</strong>? Due in 14 days.</p>}
      </Modal>
    </div>
  );
}
