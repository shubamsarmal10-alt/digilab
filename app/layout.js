import './globals.css';
import Link from 'next/link';
import { AuthProvider } from '@/components/AuthProvider';
import { Navbar } from '@/components/Navbar';
import { ToastProvider } from '@/components/Toast';

export const metadata = {
  title: 'DigiLib+ | Premium Digital Library',
  description: 'A sophisticated NoSQL-based Digital Library Management System for academic and professional excellence.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;700;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            
            <main className="main-content">
              {children}
            </main>

            <footer style={{ padding: '60px 0', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
              <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                  © 2024 DigiLib+ Advanced DBMS Project. All rights reserved.
                </div>
                <div style={{ display: 'flex', gap: '24px' }}>
                  <Link href="/privacy" className="nav-item" style={{ fontSize: '13px' }}>Privacy Policy</Link>
                  <Link href="/terms" className="nav-item" style={{ fontSize: '13px' }}>Terms of Service</Link>
                </div>
              </div>
            </footer>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
