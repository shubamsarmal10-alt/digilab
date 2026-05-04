export const metadata = { title: 'Privacy Policy | DigiLib+', description: 'Privacy Policy for DigiLib+ Digital Library Management System' };

export default function PrivacyPage() {
  return (
    <div className="container animate-fade-up" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="page-title" style={{ fontSize: '36px', marginBottom: '32px' }}>Privacy Policy</h1>
      <div className="card" style={{ lineHeight: '1.8', fontSize: '15px', color: 'var(--text-main)' }}>
        <p style={{ marginBottom: '24px', color: 'var(--text-muted)' }}>Last updated: January 2024</p>
        <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>1. Information We Collect</h2>
        <p style={{ marginBottom: '24px' }}>We collect information you provide directly to us, such as your name, email address, and reading preferences when you create an account or use our services.</p>
        <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>2. How We Use Your Information</h2>
        <p style={{ marginBottom: '24px' }}>We use the information we collect to provide, maintain, and improve our library management services, process book borrowing transactions, and send you relevant notifications.</p>
        <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>3. Data Security</h2>
        <p style={{ marginBottom: '24px' }}>We implement appropriate security measures to protect your personal information, including encryption of passwords and secure database access controls.</p>
        <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>4. Data Retention</h2>
        <p style={{ marginBottom: '24px' }}>We retain your personal information for as long as your account is active or as needed to provide our services. You may request deletion of your account at any time.</p>
        <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>5. Contact Us</h2>
        <p>If you have questions about this Privacy Policy, please contact us at privacy@digilib.com.</p>
      </div>
    </div>
  );
}
