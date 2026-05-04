'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/Toast';
import { Modal } from '@/components/Modal';
import { TableSkeleton } from '@/components/LoadingSkeleton';

export default function AdminUsersPage() {
  const { addToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [editUser, setEditUser] = useState(null);
  const [suspendUser, setSuspendUser] = useState(null);

  const fetchUsers = () => {
    fetch('/api/users').then(r => r.json()).then(data => {
      if (data.success) setUsers(data.users);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (userId, newRole) => {
    const res = await fetch('/api/users', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: userId, role: newRole }),
    });
    const data = await res.json();
    if (data.success) { addToast('Role updated!', 'success'); setEditUser(null); fetchUsers(); }
    else addToast('Failed', 'error');
  };

  const handleSuspend = async () => {
    const res = await fetch('/api/users', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: suspendUser._id, isBlocked: !suspendUser.isBlocked }),
    });
    const data = await res.json();
    if (data.success) {
      addToast(suspendUser.isBlocked ? 'User reactivated' : 'User suspended', 'success');
      setSuspendUser(null); fetchUsers();
    } else addToast('Failed', 'error');
  };

  const filtered = users.filter(u => {
    if (filter === 'All') return true;
    if (filter === 'Users') return u.role === 'user';
    if (filter === 'Admins') return u.role === 'admin';
    if (filter === 'Suspended') return u.isBlocked;
    return true;
  });

  if (loading) return <div><h1 style={{ fontSize: '28px', marginBottom: '32px' }}>User Management</h1><TableSkeleton /></div>;

  return (
    <div className="animate-fade-up">
      <h1 style={{ fontSize: '28px', marginBottom: '32px' }}>User Management</h1>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        {['All', 'Users', 'Admins', 'Suspended'].map(f => (
          <button key={f} className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)' }}>
              {['Name', 'Email', 'Role', 'Joined', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user._id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '16px', fontWeight: '600', fontSize: '14px' }}>{user.name}</td>
                <td style={{ padding: '16px', fontSize: '13px' }}>{user.email}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: user.role === 'admin' ? 'var(--accent)' : 'var(--text-muted)', textTransform: 'uppercase' }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '16px', fontSize: '13px' }}>{user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : 'N/A'}</td>
                <td style={{ padding: '16px' }}>
                  <span className={`badge ${user.isBlocked ? 'badge-danger' : 'badge-success'}`} style={{ padding: '2px 8px', fontSize: '10px' }}>
                    {user.isBlocked ? 'Suspended' : 'Active'}
                  </span>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={() => setEditUser(user)}>Edit</button>
                    <button className={`btn ${user.isBlocked ? 'btn-primary' : ''}`}
                      style={{ padding: '4px 10px', fontSize: '11px', background: user.isBlocked ? '' : 'var(--danger)', color: user.isBlocked ? '' : 'white', border: user.isBlocked ? '' : 'none' }}
                      onClick={() => setSuspendUser(user)}>
                      {user.isBlocked ? 'Activate' : 'Suspend'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Role Modal */}
      <Modal isOpen={!!editUser} onClose={() => setEditUser(null)} title="Edit User Role"
        onConfirm={() => handleRoleChange(editUser._id, editUser.role === 'admin' ? 'user' : 'admin')}
        confirmText={`Switch to ${editUser?.role === 'admin' ? 'User' : 'Admin'}`}>
        <p>Change <strong>{editUser?.name}</strong>&apos;s role from <strong>{editUser?.role}</strong> to <strong>{editUser?.role === 'admin' ? 'user' : 'admin'}</strong>?</p>
      </Modal>

      {/* Suspend Modal */}
      <Modal isOpen={!!suspendUser} onClose={() => setSuspendUser(null)}
        title={suspendUser?.isBlocked ? 'Reactivate User' : 'Suspend User'}
        onConfirm={handleSuspend}
        confirmText={suspendUser?.isBlocked ? 'Reactivate' : 'Suspend'}>
        <p>{suspendUser?.isBlocked ? 'Reactivate' : 'Suspend'} <strong>{suspendUser?.name}</strong>?
        {!suspendUser?.isBlocked && ' They will not be able to login.'}
        </p>
      </Modal>
    </div>
  );
}
