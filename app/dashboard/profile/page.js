'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/Toast';
import { Modal } from '@/components/Modal';

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const { addToast } = useToast();
  const [name, setName] = useState(session?.user?.name || '');
  const [email, setEmail] = useState(session?.user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id, name, email }),
      });
      const data = await res.json();
      if (data.success) {
        addToast('Profile updated!', 'success');
        update({ name, email });
      } else {
        addToast(data.error || 'Update failed', 'error');
      }
    } catch (err) {
      addToast('Update failed', 'error');
    }
    setSaving(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) { addToast('Password must be at least 6 characters', 'error'); return; }
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id, currentPassword, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        addToast('Password changed!', 'success');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        addToast(data.error || 'Password change failed', 'error');
      }
    } catch (err) {
      addToast('Password change failed', 'error');
    }
  };

  return (
    <div className="animate-fade-up">
      <h1 style={{ fontSize: '28px', marginBottom: '32px' }}>Profile & Settings</h1>

      {/* Edit Profile */}
      <div className="card" style={{ marginBottom: '24px', maxWidth: '600px' }}>
        <h3 style={{ marginBottom: '24px' }}>Personal Information</h3>
        <form onSubmit={handleSaveProfile}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="card" style={{ marginBottom: '24px', maxWidth: '600px' }}>
        <h3 style={{ marginBottom: '24px' }}>Change Password</h3>
        <form onSubmit={handleChangePassword}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input type="password" className="form-input" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input type="password" className="form-input" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="At least 6 characters" />
          </div>
          <button type="submit" className="btn btn-primary">Change Password</button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="card" style={{ maxWidth: '600px', borderColor: 'var(--danger)' }}>
        <h3 style={{ color: 'var(--danger)', marginBottom: '12px' }}>Danger Zone</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button className="btn" style={{ background: 'var(--danger)', color: 'white' }} onClick={() => setDeleteModal(true)}>
          Delete Account
        </button>
      </div>

      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Account"
        onConfirm={() => { addToast('Account deletion is not available in demo mode', 'info'); setDeleteModal(false); }}
        confirmText="Delete" confirmStyle="btn" >
        <p>Are you sure you want to permanently delete your account? This action cannot be undone.</p>
      </Modal>
    </div>
  );
}
