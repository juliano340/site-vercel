import React from 'react';
import Link from 'next/link';

const CtaSection = () => {
  return (
    <section
      className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8"
      style={{ background: '#080808' }}
    >
      <div className="relative z-10 mx-auto max-w-7xl">
        <div
          className="relative overflow-hidden p-8 md:p-14"
          style={{ background: '#C8FF00', borderRadius: '4px' }}
        >
          {/* Noise overlay */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: 0.04,
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              zIndex: 0,
            }}
          />

          {/* Crosshairs nos 4 cantos */}
          {/* Top-left */}
          <div className="pointer-events-none absolute left-4 top-4" style={{ color: 'rgba(0,0,0,0.15)' }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M12 2v6M12 16v6M2 12h6M16 12h6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>
          {/* Top-right */}
          <div className="pointer-events-none absolute right-4 top-4" style={{ color: 'rgba(0,0,0,0.15)' }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M12 2v6M12 16v6M2 12h6M16 12h6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>
          {/* Bottom-left */}
          <div className="pointer-events-none absolute bottom-4 left-4" style={{ color: 'rgba(0,0,0,0.15)' }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M12 2v6M12 16v6M2 12h6M16 12h6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>
          {/* Bottom-right */}
          <div className="pointer-events-none absolute bottom-4 right-4" style={{ color: 'rgba(0,0,0,0.15)' }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M12 2v6M12 16v6M2 12h6M16 12h6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>

          <div className="relative z-10 grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)] lg:items-end">
            <div>
              <p
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  color: 'rgba(0,0,0,0.5)',
                  marginBottom: '12px',
                }}
              >
                Vamos conversar
              </p>

              <h2
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                  color: '#000',
                  lineHeight: 0.95,
                  letterSpacing: '0.02em',
                  marginBottom: '20px',
                }}
              >
                GOSTOU DO MEU TRABALHO?
              </h2>

              <p style={{ color: 'rgba(0,0,0,0.6)', fontSize: '1.1rem', lineHeight: 1.6, maxWidth: '520px' }}>
                Posso ajudar a transformar a sua ideia em uma solução digital clara,
                objetiva e pronta para gerar resultado.
              </p>
            </div>

            <div className="grid gap-3">
              <Link href="/contato" legacyBehavior>
                <a
                  className="mono-focus-ring inline-flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: '#000',
                    color: '#C8FF00',
                    border: 'none',
                    borderRadius: '999px',
                    padding: '16px 28px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Fale comigo agora
                </a>
              </Link>

              <a
                href="https://github.com/juliano340"
                target="_blank"
                rel="noopener noreferrer"
                className="mono-focus-ring inline-flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'transparent',
                  color: '#000',
                  border: '1px solid rgba(0,0,0,0.3)',
                  borderRadius: '999px',
                  padding: '16px 28px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  textDecoration: 'none',
                }}
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                Ver meu GitHub
              </a>
            </div>
          </div>

          {/* Stats */}
          <div
            className="relative z-10 mt-10 grid grid-cols-1 gap-4 pt-8 md:grid-cols-3"
            style={{ borderTop: '1px solid rgba(0,0,0,0.2)' }}
          >
            <div style={{ padding: '16px 0' }}>
              <div
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '2.5rem',
                  color: '#000',
                  lineHeight: 1,
                  marginBottom: '4px',
                }}
              >
                5+
              </div>
              <div
                style={{
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  color: 'rgba(0,0,0,0.5)',
                  marginBottom: '4px',
                }}
              >
                Entrega
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.5)' }}>
                Projetos concluídos com foco em clareza e execução.
              </div>
            </div>
            <div style={{ padding: '16px 0' }}>
              <div
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '2.5rem',
                  color: '#000',
                  lineHeight: 1,
                  marginBottom: '4px',
                }}
              >
                5+
              </div>
              <div
                style={{
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  color: 'rgba(0,0,0,0.5)',
                  marginBottom: '4px',
                }}
              >
                Stack
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.5)' }}>
                Tecnologias aplicadas entre front-end, back-end e produto.
              </div>
            </div>
            <div style={{ padding: '16px 0' }}>
              <div
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '2.5rem',
                  color: '#000',
                  lineHeight: 1,
                  marginBottom: '4px',
                }}
              >
                100%
              </div>
              <div
                style={{
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  color: 'rgba(0,0,0,0.5)',
                  marginBottom: '4px',
                }}
              >
                Compromisso
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.5)' }}>
                Acompanhamento atento da ideia inicial ao resultado final.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
