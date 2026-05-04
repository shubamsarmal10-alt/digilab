'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Hide navbar on dashboard and admin pages to avoid double navigation
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    return null;
  }

  const isUser = session?.user?.role === 'user';
  const isAdmin = session?.user?.role === 'admin';

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link href="/" className="logo">
          <span>📚</span> DigiLib+
        </Link>
        <div className="nav-links">
          {/* Logged OUT */}
          {!session && status !== 'loading' && (
            <>
              <Link href="/library" className="nav-item">Explore Library</Link>
              <Link href="/login" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '13px' }}>
                Login / Register
              </Link>
            </>
          )}

          {/* Logged IN as User */}
          {isUser && (
            <>
              <Link href="/dashboard" className="nav-item">Dashboard</Link>
              <Link href="/library" className="nav-item">Explore Library</Link>
            </>
          )}

          {/* Logged IN as Admin */}
          {isAdmin && (
            <>
              <Link href="/admin" className="nav-item">Admin Panel</Link>
              <Link href="/library" className="nav-item">Explore Library</Link>
            </>
          )}

          {/* Avatar dropdown for logged-in users */}
          {session && (
            <div className="nav-avatar-wrapper" ref={dropdownRef}>
              <button
                className="nav-avatar"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="User menu"
              >
                {getInitials(session.user.name)}
              </button>
              {dropdownOpen && (
                <div className="nav-dropdown">
                  <div className="nav-dropdown-header">
                    <p className="nav-dropdown-name">{session.user.name}</p>
                    <p className="nav-dropdown-email">{session.user.email}</p>
                  </div>
                  <div className="nav-dropdown-divider" />
                  {isUser && (
                    <>
                      <Link href="/dashboard" className="nav-dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <span>📊</span> My Dashboard
                      </Link>
                      <Link href="/dashboard/profile" className="nav-dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <span>👤</span> Profile
                      </Link>
                    </>
                  )}
                  {isAdmin && (
                    <Link href="/admin" className="nav-dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <span>⚙️</span> Admin Dashboard
                    </Link>
                  )}
                  <div className="nav-dropdown-divider" />
                  <button
                    className="nav-dropdown-item nav-dropdown-logout"
                    onClick={() => signOut({ callbackUrl: '/' })}
                  >
                    <span>🚪</span> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
