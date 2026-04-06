import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const STACK = ['React', 'Next.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker'];

const HeroSectionView = () => {
  return (
    <section
      className="relative flex min-h-[80vh] items-center overflow-hidden px-4 py-20 sm:px-6 lg:px-8"
      style={{
        background: 'var(--color-background)',
        backgroundImage: 'radial-gradient(ellipse at 50% 100%, rgba(var(--accent-rgb), 0.03) 0%, transparent 70%)',
      }}
    >
      {/* Vignette overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, var(--color-shadow) 100%)',
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl grid items-center gap-12 lg:grid-cols-2">
        {/* Coluna esquerda */}
        <div>
          {/* Badge */}
          <div className="mb-6 inline-block">
            <span
              className="inline-flex items-center gap-2 px-4 py-2"
              style={{
                background: 'rgba(var(--accent-rgb), 0.08)',
                border: '1px solid rgba(var(--accent-rgb), 0.2)',
                borderRadius: '999px',
                color: 'var(--color-accent)',
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'var(--color-accent)',
                  animation: 'pulse 2s infinite',
                }}
              />
              FULL STACK DEVELOPER
            </span>
          </div>

          {/* H1 */}
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(3rem, 6vw, 5rem)',
              lineHeight: 0.9,
              color: 'var(--color-text)',
              marginBottom: '1.5rem',
              letterSpacing: '0.02em',
            }}
          >
            PROGRAMAÇÃO WEB COM FOCO EM CLAREZA, PERFORMANCE E RESULTADO.
          </h1>

          {/* Paragraph */}
          <p
            style={{
              color: 'var(--color-muted)',
              fontSize: '1.1rem',
              lineHeight: 1.7,
              maxWidth: '540px',
              marginBottom: '2rem',
            }}
          >
            Sou desenvolvedor full stack e construo soluções digitais do design ao deploy,
            com código limpo, experiência consistente e prioridade no que realmente importa.
          </p>

          {/* Stack chips */}
          <div className="mb-8 flex flex-wrap gap-2">
            {STACK.map((item) => (
              <span key={item} className="mono-chip">
                {item}
              </span>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/contato" legacyBehavior>
              <a className="mono-focus-ring mono-button-primary">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Fale comigo
              </a>
            </Link>

            <a
              href="https://github.com/juliano340"
              target="_blank"
              rel="noopener noreferrer"
              className="mono-focus-ring mono-button-secondary"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              Ver GitHub
            </a>
          </div>
        </div>

        {/* Coluna direita — card de perfil */}
        <div className="flex justify-center lg:justify-end">
          <div
            className="w-full max-w-sm"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '4px',
              padding: '24px',
            }}
          >
            {/* Card header — 3 colunas de texto */}
            <div
              className="mb-4 grid grid-cols-3 text-center"
              style={{
                fontSize: '8px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: 'var(--color-dim)',
              }}
            >
              <span>FULL STACK</span>
              <span>@JULIANO340</span>
              <span>2024</span>
            </div>

            {/* Separador */}
            <div style={{ height: '1px', background: 'var(--color-border)', marginBottom: '20px' }} />

            {/* Avatar + info */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className="relative h-16 w-16 overflow-hidden flex-shrink-0"
                style={{
                  border: '2px solid rgba(var(--accent-rgb), 0.3)',
                  borderRadius: '50%',
                }}
              >
                <Image
                  src="https://avatars.githubusercontent.com/u/87342139?v=4"
                  alt="Foto de perfil de Juliano"
                  fill
                  sizes="64px"
                  className="object-cover"
                  priority
                />
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    color: 'var(--color-accent)',
                    fontSize: '1.4rem',
                    letterSpacing: '0.1em',
                    lineHeight: 1,
                  }}
                >
                  JULIANO340
                </p>
                <p style={{ color: 'var(--color-text)', fontSize: '0.875rem', marginTop: '2px' }}>
                  Desenvolvedor Web
                </p>
                <p style={{ color: 'var(--color-muted)', fontSize: '0.75rem', marginTop: '4px' }}>
                  Projetos sob medida para web e produtos digitais.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div style={{ background: 'var(--color-surface-alt)', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '12px' }}>
                <p
                  style={{
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    color: 'var(--color-muted-dim)',
                    marginBottom: '6px',
                  }}
                >
                  Escopo
                </p>
                <p style={{ color: 'var(--color-text)', fontSize: '0.8rem', fontWeight: 600 }}>
                  Landing pages, apps e sistemas web
                </p>
              </div>
              <div style={{ background: 'var(--color-surface-alt)', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '12px' }}>
                <p
                  style={{
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    color: 'var(--color-muted-dim)',
                    marginBottom: '6px',
                  }}
                >
                  Entrega
                </p>
                <p style={{ color: 'var(--color-text)', fontSize: '0.8rem', fontWeight: 600 }}>
                  Design consistente e implementação objetiva
                </p>
              </div>
            </div>

            {/* Rodapé do card */}
            <div style={{ height: '1px', background: 'var(--color-border)', marginBottom: '16px' }} />
            <div className="flex items-center gap-2">
              <span
                style={{
                  display: 'inline-block',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'var(--color-accent)',
                  animation: 'pulse 2s infinite',
                  flexShrink: 0,
                }}
              />
              <span style={{ color: 'var(--color-muted)', fontSize: '0.75rem' }}>
                Disponível para projetos
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionView;
