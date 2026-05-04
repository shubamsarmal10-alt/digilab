'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function ChaptersPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/books/${id}`).then(r => r.json()).then(data => {
      if (data.success) setBook(data.book);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container" style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-muted)' }}>Loading chapters...</div>;
  if (!book) return <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}><h2>Book not found</h2></div>;

  const chapters = book.chapters?.length > 0 ? book.chapters : [
    { title: 'Table of Contents', pageNumber: 1 },
    { title: 'Introduction', pageNumber: 5 },
    { title: 'Main Content', pageNumber: 15 },
    { title: 'Conclusion', pageNumber: 95 },
    { title: 'Index', pageNumber: 105 },
  ];

  return (
    <div className="container animate-fade-up">
      <Link href={`/library/${id}`} style={{ color: 'var(--accent)', fontSize: '14px', fontWeight: '500', display: 'inline-block', marginBottom: '32px' }}>
        ← Back to Book Details
      </Link>

      <div className="page-header" style={{ marginBottom: '40px' }}>
        <h1 className="page-title" style={{ fontSize: '36px' }}>{book.title}</h1>
        <p className="page-subtitle">{book.author} — Chapter Index</p>
      </div>

      <div className="card" style={{ maxWidth: '700px' }}>
        <h3 style={{ marginBottom: '24px', fontSize: '18px' }}>📖 Chapters</h3>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {chapters.map((ch, i) => (
            <div
              key={i}
              className="chapter-row"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 0',
                borderBottom: i < chapters.length - 1 ? '1px solid var(--border)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: 'rgba(37, 99, 235, 0.1)', color: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: '700'
                }}>
                  {i + 1}
                </span>
                <span style={{ fontWeight: '500', fontSize: '15px' }}>{ch.title}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ color: 'var(--text-light)', fontSize: '13px' }}>
                  Page {ch.pageNumber || '—'}
                </span>
                <button className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '12px' }}>
                  Read
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
