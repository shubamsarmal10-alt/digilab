'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

const sidebarLinks = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/books', label: 'Books', icon: '📚' },
  { href: '/admin/users', label: 'Users', icon: '👥' },
  { href: '/admin/analytics', label: 'Analytics', icon: '📈' },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="admin-sidebar-header">
          <span className="admin-sidebar-logo">{collapsed ? '📚' : '📚 DigiLib+'}</span>
          <button className="admin-collapse-btn" onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar">
            {collapsed ? '→' : '←'}
          </button>
        </div>
        <nav className="admin-nav">
          {sidebarLinks.map(link => (
            <Link key={link.href} href={link.href}
              className={`admin-nav-item ${pathname === link.href ? 'active' : ''}`}>
              <span className="admin-nav-icon">{link.icon}</span>
              {!collapsed && <span>{link.label}</span>}
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <button className="admin-nav-item" onClick={() => signOut({ callbackUrl: '/' })} style={{ border: 'none', width: '100%', cursor: 'pointer' }}>
            <span className="admin-nav-icon">🚪</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link href="/" style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: '600', textDecoration: 'none' }}>← Back to Site</Link>
            <h2 className="admin-topbar-title">Admin Panel</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{session?.user?.name}</span>
            <div className="admin-topbar-avatar">{session?.user?.name?.charAt(0)?.toUpperCase() || 'A'}</div>
          </div>
        </header>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
