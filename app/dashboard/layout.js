'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

const sidebarLinks = [
  { href: '/dashboard', label: 'Overview', icon: '📊' },
  { href: '/dashboard/borrowed', label: 'Borrowed Books', icon: '📚' },
  { href: '/dashboard/history', label: 'Reading History', icon: '📜' },
  { href: '/dashboard/profile', label: 'Profile', icon: '👤' },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="dashboard-sidebar-header">
          <div className="dashboard-avatar">
            {session?.user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="dashboard-welcome">Welcome back,</p>
            <p className="dashboard-name">{session?.user?.name || 'User'}</p>
          </div>
        </div>
        <nav className="dashboard-nav">
          {sidebarLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`dashboard-nav-item ${pathname === link.href ? 'active' : ''}`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="dashboard-main">
        <header className="dashboard-topbar" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '16px 32px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface)',
          marginBottom: '32px'
        }}>
          <Link href="/" style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: '600' }}>← Back to Site</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: '500' }}>{session?.user?.name}</span>
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent)', 
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700' 
            }}>
              {session?.user?.name?.charAt(0)?.toUpperCase()}
            </div>
          </div>
        </header>
        <div style={{ padding: '0 32px 32px 32px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
