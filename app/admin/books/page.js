'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/Modal';
import { useToast } from '@/components/Toast';
import { TableSkeleton } from '@/components/LoadingSkeleton';

export default function AdminBooksPage() {
  const { addToast } = useToast();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [deleteBook, setDeleteBook] = useState(null);

  // Form state
  const [form, setForm] = useState({ title: '', author: '', category: 'Education', isbn: '', quantity: 1, description: '' });

  const fetchBooks = () => {
    fetch('/api/books').then(r => r.json()).then(data => {
      if (data.success) setBooks(data.books);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchBooks(); }, []);

  const resetForm = () => setForm({ title: '', author: '', category: 'Education', isbn: '', quantity: 1, description: '' });

  const handleAdd = async () => {
    if (!form.title || !form.author) { addToast('Title and author required', 'error'); return; }
    const res = await fetch('/api/books', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) { addToast('Book added!', 'success'); setShowAddModal(false); resetForm(); fetchBooks(); }
    else addToast(data.error || 'Failed', 'error');
  };

  const handleEdit = async () => {
    const res = await fetch('/api/books', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id: editBook._id, ...form }),
    });
    const data = await res.json();
    if (data.success) { addToast('Book updated!', 'success'); setEditBook(null); resetForm(); fetchBooks(); }
    else addToast(data.error || 'Failed', 'error');
  };

  const handleDelete = async () => {
    const res = await fetch(`/api/books?id=${deleteBook._id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) { addToast('Book deleted', 'success'); setDeleteBook(null); fetchBooks(); }
    else addToast(data.error || 'Failed', 'error');
  };

  const openEdit = (book) => {
    setForm({ title: book.title, author: book.author, category: book.category, isbn: book.isbn || '', quantity: book.quantity, description: book.description || '' });
    setEditBook(book);
  };

  const filtered = books.filter(b =>
    b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.author?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div><h1 style={{ fontSize: '28px', marginBottom: '32px' }}>Books Management</h1><TableSkeleton /></div>;

  return (
    <div className="animate-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px' }}>Books Management</h1>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowAddModal(true); }}>+ Add New Book</button>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <input type="text" className="form-input" placeholder="Search books..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          style={{ maxWidth: '400px' }} />
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)' }}>
              {['Title', 'Author', 'Category', 'Available', 'Total', 'ISBN', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(book => (
              <tr key={book._id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '16px', fontWeight: '600', fontSize: '14px' }}>{book.title}</td>
                <td style={{ padding: '16px', fontSize: '13px' }}>{book.author}</td>
                <td style={{ padding: '16px', fontSize: '13px' }}>{book.category}</td>
                <td style={{ padding: '16px' }}>
                  <span className={`badge ${book.availableQuantity > 0 ? 'badge-success' : 'badge-danger'}`} style={{ padding: '2px 8px', fontSize: '10px' }}>
                    {book.availableQuantity}
                  </span>
                </td>
                <td style={{ padding: '16px', fontSize: '13px' }}>{book.quantity}</td>
                <td style={{ padding: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>{book.isbn || 'N/A'}</td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={() => openEdit(book)}>Edit</button>
                    <button className="btn" style={{ padding: '4px 10px', fontSize: '11px', background: 'var(--danger)', color: 'white', border: 'none' }} onClick={() => setDeleteBook(book)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={showAddModal || !!editBook} onClose={() => { setShowAddModal(false); setEditBook(null); resetForm(); }}
        title={editBook ? 'Edit Book' : 'Add New Book'} onConfirm={editBook ? handleEdit : handleAdd}
        confirmText={editBook ? 'Save Changes' : 'Add Book'}>
        <div className="form-group"><label className="form-label">Title</label>
          <input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
        <div className="form-group"><label className="form-label">Author</label>
          <input className="form-input" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} /></div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="form-group" style={{ flex: 1 }}><label className="form-label">Category</label>
            <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {['Education', 'Technology', 'Science', 'Fiction'].map(c => <option key={c}>{c}</option>)}
            </select></div>
          <div className="form-group" style={{ width: '100px' }}><label className="form-label">Copies</label>
            <input type="number" className="form-input" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} min="1" /></div>
        </div>
        <div className="form-group"><label className="form-label">ISBN</label>
          <input className="form-input" value={form.isbn} onChange={e => setForm({ ...form, isbn: e.target.value })} placeholder="978-..." /></div>
        <div className="form-group"><label className="form-label">Description</label>
          <textarea className="form-textarea" rows="3" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!deleteBook} onClose={() => setDeleteBook(null)} title="Delete Book"
        onConfirm={handleDelete} confirmText="Delete" confirmStyle="btn">
        <p>Are you sure you want to delete <strong>{deleteBook?.title}</strong>? This action cannot be undone.</p>
      </Modal>
    </div>
  );
}
