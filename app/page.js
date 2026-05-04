'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const TypewriterText = ({ text, delay = 100, pauseDelay = 4000 }) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let i = 0;
    let isTyping = true;
    let interval;

    const startTyping = () => {
      interval = setInterval(() => {
        if (isTyping) {
          setDisplayText(text.substring(0, i + 1));
          i++;
          if (i > text.length) {
            isTyping = false;
            clearInterval(interval);
            setTimeout(() => {
              i = 0;
              setDisplayText('');
              isTyping = true;
              startTyping();
            }, pauseDelay);
          }
        }
      }, delay);
    };

    startTyping();
    return () => clearInterval(interval);
  }, [text, delay, pauseDelay]);

  return (
    <>
      {displayText}
      <span className="cursor-blink">|</span>
    </>
  );
};

export default function HomePage() {
  return (
    <div className="animate-fade-up">
      <div className="page-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '60px 0 20px 0', borderBottom: 'none' }}>
        <h1 className="page-title" style={{ fontSize: '64px', fontWeight: '800', minHeight: '80px' }}>
          <span style={{ color: 'var(--primary)' }}>_</span>
          <TypewriterText text="Welcome to DigiLib+" delay={100} pauseDelay={4000} />
        </h1>
        <p className="page-subtitle" style={{ fontSize: '20px', maxWidth: '600px', margin: '0 auto 40px auto', color: 'var(--text-muted)' }}>
          A modern, high-performance Digital Library Management System built with Next.js and MongoDB.
        </p>
        <Link href="/library" className="btn btn-primary" style={{ padding: '16px 36px', fontSize: '16px', borderRadius: '30px' }} id="explore-library-cta">
          Explore Library →
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '80px', padding: '0 24px' }}>
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: '1000px', 
          height: '450px', 
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(37, 99, 235, 0.15)',
          border: '1px solid var(--border)'
        }}>
          <Image 
            src="/library-students.png" 
            alt="Students studying in a beautiful library" 
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: '150px',
            background: 'linear-gradient(to top, var(--background), transparent)',
            pointerEvents: 'none'
          }}></div>
        </div>
      </div>

      <div className="container">
        <div className="grid-cards" style={{ marginBottom: '60px' }}>
          <div className="card delay-1">
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(37, 99, 235, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: 'var(--accent)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            </div>
            <h3 style={{ marginBottom: '8px' }}>Lightning Fast</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              Built on MongoDB, experiencing real-time updates and lightning-fast search without the burden of complex SQL joins.
            </p>
          </div>
          
          <div className="card delay-2">
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(37, 99, 235, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: 'var(--accent)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            </div>
            <h3 style={{ marginBottom: '8px' }}>Document Oriented</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              Books and their reviews are inscribed as embedded documents for optimal performance and infinite scalability.
            </p>
          </div>
          
          <div className="card delay-3">
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(37, 99, 235, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: 'var(--accent)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            </div>
            <h3 style={{ marginBottom: '8px' }}>Smart Analytics</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              Utilizing MongoDB Aggregation Pipelines to analyze transaction data and uncover the most popular reads.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
