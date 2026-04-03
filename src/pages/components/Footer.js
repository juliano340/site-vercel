import React from 'react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/juliano340',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/juliano340',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      )
    },
    {
      name: 'Email',
      url: `mailto:${['juliano340', 'gmail.com'].join('@')}`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
    { name: 'Contato', href: '/contato' }
  ];

  return (
    <footer className="mono-section mono-section-surface py-16">
      {/* Decorative top border */}
      <div className="absolute left-0 right-0 top-0 h-px bg-subtle"></div>

      <div className="mono-container py-4">
        {/* Main Footer Content */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Brand Section */}
          <div className="mono-card h-full text-center md:text-left">
            <h3 className="mb-3 flex items-center justify-center gap-2 text-2xl font-bold text-primary md:justify-start">
              <span>@JULIANO340</span>
            </h3>
            <p className="mb-4 leading-relaxed text-muted">
              Desenvolvedor Full Stack apaixonado por criar soluções web modernas e eficientes.
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:justify-start">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mono-focus-ring mono-button-secondary group h-12 w-12 p-0"
                  aria-label={link.name}
                >
                  <div className="text-muted transition-colors group-hover:text-primary">
                    {link.icon}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="mono-card h-full text-center">
            <h4 className="mb-4 text-lg font-semibold text-primary">Links Rápidos</h4>
            <nav className="grid gap-2">
              {quickLinks.map((link) => (
                <Link key={link.name} href={link.href} legacyBehavior>
                  <a className="mono-focus-ring inline-flex items-center justify-center rounded-xl border border-subtle bg-background px-4 py-2 text-sm font-medium text-primary transition-all duration-300 hover:bg-surface md:justify-start">
                    {link.name}
                  </a>
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="mono-card h-full text-center md:text-right">
            <h4 className="mb-4 text-lg font-semibold text-primary">Contato</h4>
            <div className="space-y-3 text-muted">
              <a
                href={`mailto:${['juliano340', 'gmail.com'].join('@')}`}
                className="mono-focus-ring flex items-center justify-center gap-2 rounded-xl border border-subtle bg-background px-4 py-3 transition-colors hover:bg-surface hover:text-primary md:justify-end"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {['juliano340', 'gmail.com'].join('@')}
              </a>
              <div className="flex items-center justify-center gap-2 rounded-xl border border-subtle bg-background px-4 py-3 md:justify-end">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Brasil
              </div>
              <Link href="/blog" legacyBehavior>
                <a className="mono-focus-ring mono-button-secondary px-4 py-2 text-sm">
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
        <div className="mb-8 border-t border-subtle"></div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted md:flex-row">
          <div className="flex items-center gap-2">
            <span>&copy; {currentYear}</span>
            <span className="font-semibold text-primary">juliano340.com</span>
            <span>- Todos os direitos reservados</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              Feito com
              <svg className="w-4 h-4 animate-pulse-scale text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              e
              <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </span>
          </div>
        </div>

        {/* Back to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="mono-focus-ring group fixed bottom-8 right-8 inline-flex items-center justify-center rounded-xl border border-primary bg-primary p-3 text-background shadow-soft transition-all duration-300 hover:-translate-y-1"
          aria-label="Voltar ao topo"
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
