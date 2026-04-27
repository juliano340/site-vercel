import React from 'react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/juliano340',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/juliano340',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      )
    },
    {
      name: 'Email',
      url: `mailto:${['juliano340', 'gmail.com'].join('@')}`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  const quickLinks = [
    { name: 'Home', href: '/home' },
    { name: 'Sobre', href: '/home#about' },
    { name: 'Portfólio', href: '/home#portfolio' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contato', href: '/contato' },
    { name: 'Política de Privacidade', href: '/politica-de-privacidade' }
  ];

  return (
    <footer
      className="relative px-4 py-16 sm:px-6 lg:px-8"
      style={{ background: 'var(--color-background-deep)', borderTop: '1px solid var(--color-surface-raised)' }}
    >
      <div className="relative z-10 mx-auto max-w-7xl py-4">
        {/* Main Footer Content */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Brand Section */}
          <div
            className="h-full p-6 text-center md:text-left"
            style={{ background: 'var(--color-surface-alt)', border: '1px solid var(--color-surface-raised)', borderRadius: '4px' }}
          >
            <h3 className="mb-3 flex items-center justify-center gap-2 md:justify-start">
              <span
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  color: 'var(--color-accent)',
                  fontSize: '1.5rem',
                  letterSpacing: '0.2em',
                }}
              >
                @JULIANO340
              </span>
            </h3>
            <p className="mb-6 leading-relaxed" style={{ color: 'var(--color-muted)', fontSize: '0.875rem' }}>
              Desenvolvedor Full Stack apaixonado por criar soluções web modernas e eficientes.
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:justify-start">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mono-focus-ring inline-flex h-10 w-10 items-center justify-center transition-all duration-300"
                  style={{
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-surface)',
                    borderRadius: '4px',
                    color: 'var(--color-muted)',
                  }}
                  aria-label={link.name}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-accent)'; e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb), 0.3)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-muted)'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div
            className="h-full p-6 text-center"
            style={{ background: 'var(--color-surface-alt)', border: '1px solid var(--color-surface-raised)', borderRadius: '4px' }}
          >
            <h4
              className="mb-4"
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: 'var(--color-accent)',
              }}
            >
              LINKS RÁPIDOS
            </h4>
            <nav className="grid gap-2">
              {quickLinks.map((link) => (
                <Link key={link.name} href={link.href} legacyBehavior>
                  <a
                    className="mono-focus-ring inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-all duration-300"
                    style={{
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-surface)',
                      borderRadius: '4px',
                      color: 'var(--color-muted)',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text)'; e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb), 0.3)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-muted)'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                  >
                    {link.name}
                  </a>
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div
            className="h-full p-6 text-center md:text-right"
            style={{ background: 'var(--color-surface-alt)', border: '1px solid var(--color-surface-raised)', borderRadius: '4px' }}
          >
            <h4
              className="mb-4"
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: 'var(--color-accent)',
              }}
            >
              CONTATO
            </h4>
            <div className="space-y-3">
              <a
                href={`mailto:${['juliano340', 'gmail.com'].join('@')}`}
                className="mono-focus-ring flex items-center justify-center gap-2 px-4 py-3 transition-colors duration-200 md:justify-end"
                style={{
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  borderRadius: '4px',
                  color: 'var(--color-muted)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-muted)'; }}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {['juliano340', 'gmail.com'].join('@')}
              </a>
              <div
                className="flex items-center justify-center gap-2 px-4 py-3 md:justify-end"
                style={{
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  borderRadius: '4px',
                  color: 'var(--color-muted)',
                  fontSize: '0.875rem',
                }}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Brasil
              </div>
              <Link href="/blog" legacyBehavior>
                <a
                  className="mono-focus-ring flex items-center justify-center gap-2 px-4 py-2 text-sm transition-colors duration-200 md:justify-end"
                  style={{
                    border: '1px solid rgba(var(--accent-rgb), 0.2)',
                    background: 'transparent',
                    borderRadius: '4px',
                    color: 'var(--color-accent)',
                    textDecoration: 'none',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(var(--accent-rgb), 0.08)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Visite o Blog
                </a>
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-8" style={{ borderTop: '1px solid var(--color-surface-raised)' }}></div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2" style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>
            <span>&copy; {currentYear}</span>
            <span style={{ color: 'var(--color-text)', fontWeight: 600 }}>juliano340.com</span>
            <span>- Todos os direitos reservados</span>
          </div>

          <div className="flex items-center gap-4" style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>
            <Link href="/terminal" legacyBehavior>
              <a
                className="mono-focus-ring font-mono uppercase tracking-[0.16em] transition-colors duration-200"
                style={{
                  fontSize: '0.65rem',
                  color: 'var(--color-muted-dim)',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-accent)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-muted-dim)'; }}
                title="Modo dev — easter egg"
              >
                &gt; /terminal
              </a>
            </Link>
            <span className="flex items-center gap-2">
              Feito com
              <svg className="w-4 h-4 animate-pulse-scale" style={{ color: 'var(--color-muted)' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              e
              <svg className="w-4 h-4" style={{ color: 'var(--color-muted)' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </span>
          </div>
        </div>

        {/* Back to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="mono-focus-ring group fixed bottom-8 right-8 inline-flex items-center justify-center p-3 transition-all duration-300 hover:-translate-y-1"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '4px',
            color: 'var(--color-accent)',
          }}
          aria-label="Voltar ao topo"
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
        >
          <svg className="w-6 h-6 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
