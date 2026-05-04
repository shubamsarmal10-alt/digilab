import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: '40px 24px' }}>
      <div style={{ fontSize: '120px', marginBottom: '16px', lineHeight: 1 }}>📖</div>
      <h1 style={{ fontSize: '64px', fontWeight: '800', color: 'var(--primary)', marginBottom: '16px' }}>404</h1>
      <h2 style={{ fontSize: '24px', marginBottom: '12px', color: 'var(--text-main)' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '16px', maxWidth: '400px', marginBottom: '32px' }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved to a different shelf.
      </p>
      <Link href="/" className="btn btn-primary" style={{ padding: '14px 32px' }}>
        Go Home
      </Link>
    </div>
  );
}
