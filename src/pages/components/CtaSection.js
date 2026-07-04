import React from 'react';
import Link from 'next/link';

const CtaSection = () => {
  return (
    <section
      className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8"
      style={{ background: 'var(--color-background)' }}
    >
      <div className="relative z-10 mx-auto max-w-7xl">
        <div
          className="relative overflow-hidden p-8 sm:p-12 md:p-16"
          style={{
            background: 'linear-gradient(135deg, rgba(var(--accent-rgb), 0.06) 0%, var(--color-background) 50%, rgba(var(--accent-rgb), 0.03) 100%)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            position: 'relative',
          }}
        >
          {/* Decorative corner marks */}
          <div className="pointer-events-none absolute left-4 top-4" style={{ color: 'rgba(var(--accent-rgb), 0.15)' }}>
            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M12 2v6M12 16v6M2 12h6M16 12h6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>
          <div className="pointer-events-none absolute right-4 top-4" style={{ color: 'rgba(var(--accent-rgb), 0.15)' }}>
            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M12 2v6M12 16v6M2 12h6M16 12h6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>
          <div className="pointer-events-none absolute bottom-4 left-4" style={{ color: 'rgba(var(--accent-rgb), 0.15)' }}>
            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M12 2v6M12 16v6M2 12h6M16 12h6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>
          <div className="pointer-events-none absolute bottom-4 right-4" style={{ color: 'rgba(var(--accent-rgb), 0.15)' }}>
            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M12 2v6M12 16v6M2 12h6M16 12h6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>

          {/* Crosshair pattern overlay */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(var(--accent-rgb), 0.02) 1px, transparent 1px),
                linear-gradient(90deg, rgba(var(--accent-rgb), 0.02) 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px',
            }}
          />

          <div className="relative z-10 grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)] lg:items-end">
            <div>
              <p
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  color: 'rgba(var(--accent-rgb), 0.5)',
                  marginBottom: '16px',
                }}
              >
                Próximo passo
              </p>
              <h2
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  color: 'var(--color-text)',
                  lineHeight: 0.95,
                  letterSpacing: '0.02em',
                  marginBottom: '20px',
                  textTransform: 'uppercase',
                }}
              >
                TEM UM PROJETO TRAVADO?<br />
                <span style={{ color: 'var(--color-accent)' }}>VAMOS DESTRAVAR.</span>
              </h2>
              <p style={{ color: 'var(--color-muted-dim)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '520px' }}>
                Conta o problema. Em até 24h eu mando uma proposta com prazo, stack e escopo claro — 
                <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}> sem enrolação</span> e sem reunião desnecessária.
              </p>

              {/* Mini trust badges */}
              <div className="mt-6 flex flex-wrap gap-3">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.15em]"
                  style={{
                    background: 'rgba(var(--accent-rgb), 0.06)',
                    border: '1px solid rgba(var(--accent-rgb), 0.15)',
                    color: 'var(--color-accent)',
                    borderRadius: '4px',
                  }}
                >
                  ✓ Proposta em 24h
                </span>
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.15em]"
                  style={{
                    background: 'rgba(var(--accent-rgb), 0.06)',
                    border: '1px solid rgba(var(--accent-rgb), 0.15)',
                    color: 'var(--color-accent)',
                    borderRadius: '4px',
                  }}
                >
                  ✓ Stack definido
                </span>
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.15em]"
                  style={{
                    background: 'rgba(var(--accent-rgb), 0.06)',
                    border: '1px solid rgba(var(--accent-rgb), 0.15)',
                    color: 'var(--color-accent)',
                    borderRadius: '4px',
                  }}
                >
                  ✓ Sem reunião burocrática
                </span>
              </div>
            </div>

            <div className="grid gap-3">
              <Link href="/contato" legacyBehavior>
                <a
                  className="group mono-focus-ring inline-flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: 'var(--btn-bg)',
                    color: 'var(--btn-text)',
                    border: 'none',
                    borderRadius: '999px',
                    padding: '16px 28px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  COMEÇAR MEU PROJETO
                </a>
              </Link>

              <a
                href="https://github.com/juliano340"
                target="_blank"
                rel="noopener noreferrer"
                className="mono-focus-ring inline-flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'transparent',
                  color: 'var(--color-muted)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '999px',
                  padding: '16px 28px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                VER MEU GITHUB
              </a>
            </div>
          </div>

          {/* Stats bar */}
          <div
            className="relative z-10 mt-10 grid grid-cols-1 gap-0 md:grid-cols-3"
            style={{ borderTop: '1px solid var(--color-border)' }}
          >
            {[
              {
                value: '2-4 SEM',
                label: 'Brief → Deploy',
                desc: 'Tempo médio do escopo fechado até o produto em produção.',
              },
              {
                value: 'TS · NEXT · NODE',
                label: 'Stack em produção',
                desc: 'Auth, Stripe, VPS, CI/CD e IA aplicada — projetos no ar hoje.',
              },
              {
                value: '1',
                label: 'Cliente por vez',
                desc: 'Foco em qualidade e prazo — nunca dois projetos competindo.',
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="px-6 py-5"
                style={{
                  borderTop: i > 0 ? '1px solid var(--color-border)' : 'none',
                }}
              >
                <div
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '2rem',
                    color: i === 2 ? 'var(--color-accent)' : 'var(--color-text)',
                    lineHeight: 1,
                    marginBottom: '4px',
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    color: 'var(--color-dim)',
                    marginBottom: '4px',
                  }}
                >
                  {stat.label}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-muted-dim)', lineHeight: 1.5 }}>
                  {stat.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
