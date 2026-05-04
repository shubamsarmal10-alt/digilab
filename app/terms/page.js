export const metadata = { title: 'Terms of Service | DigiLib+', description: 'Terms of Service for DigiLib+ Digital Library Management System' };

export default function TermsPage() {
  return (
    <div className="container animate-fade-up" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="page-title" style={{ fontSize: '36px', marginBottom: '32px' }}>Terms of Service</h1>
      <div className="card" style={{ lineHeight: '1.8', fontSize: '15px', color: 'var(--text-main)' }}>
        <p style={{ marginBottom: '24px', color: 'var(--text-muted)' }}>Last updated: January 2024</p>
        <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>1. Acceptance of Terms</h2>
        <p style={{ marginBottom: '24px' }}>By accessing and using DigiLib+, you accept and agree to be bound by these Terms of Service and our Privacy Policy.</p>
        <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>2. Library Usage</h2>
        <p style={{ marginBottom: '24px' }}>Users may borrow up to 5 books at a time. Books must be returned within the specified due date. Overdue books may result in temporary suspension of borrowing privileges.</p>
        <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>3. User Accounts</h2>
        <p style={{ marginBottom: '24px' }}>You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.</p>
        <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>4. Prohibited Conduct</h2>
        <p style={{ marginBottom: '24px' }}>Users must not share account credentials, submit fraudulent reviews, or attempt to manipulate the borrowing system. Violation may result in account suspension.</p>
        <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>5. Modifications</h2>
        <p>We reserve the right to modify these terms at any time. Continued use of DigiLib+ constitutes acceptance of modified terms.</p>
      </div>
    </div>
  );
}
