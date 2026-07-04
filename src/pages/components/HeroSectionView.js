import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import HeroBackground from './HeroBackground';

const CURRENT_YEAR = new Date().getFullYear();

const HeroSectionView = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)').matches) return;
    setMounted(true);
  }, []);

  return (
    <section className="hero-fullheight relative flex items-center overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <HeroBackground />

      <div className="relative z-10 mx-auto w-full max-w-7xl grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Left Column */}
        <div
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateX(0)' : 'translateX(-40px)',
            transition: 'all 0.7s cubic-bezier(0.22, 0.61, 0.36, 1)',
          }}
        >
          {/* Eyebrow */}
          <p
            className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.25em]"
            style={{ color: 'var(--color-accent)' }}
          >
            {`< code & product />`}
          </p>

          {/* Headline */}
          <h1
            className="mb-6"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(3rem, 7vw, 5.5rem)',
              lineHeight: 0.88,
              color: 'var(--color-text)',
              fontWeight: 700,
            }}
          >
            DESENVOLVEDOR
            <br />
            <span
              style={{
                color: 'var(--color-accent)',
                letterSpacing: '0.08em',
                display: 'inline-block',
              }}
            >
              FULL STACK
            </span>
          </h1>

          {/* Value prop */}
          <p
            className="mb-6 max-w-xl text-lg sm:text-xl font-light leading-relaxed"
            style={{ color: 'var(--color-muted)' }}
          >
            Transformo ideias em produtos digitais — do conceito ao deploy, com código limpo e IA aplicada no dia a dia.
          </p>

          {/* Stats line */}
          <div className="mb-8 flex flex-wrap gap-6">
            <div>
              <span className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>{CURRENT_YEAR - 2022}+ anos</span>
              <span className="ml-1.5 text-sm" style={{ color: 'var(--color-muted-dim)' }}>de mercado</span>
            </div>
            <div>
              <span className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>8+ projetos</span>
              <span className="ml-1.5 text-sm" style={{ color: 'var(--color-muted-dim)' }}>entregues</span>
            </div>
            <div>
              <span className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>2-4 sem</span>
              <span className="ml-1.5 text-sm" style={{ color: 'var(--color-muted-dim)' }}>brief → deploy</span>
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Link href="/contato" legacyBehavior>
              <a className="group mono-button-primary text-[0.75rem] px-8 py-4" style={{ letterSpacing: '0.1em' }}>
                <span className="flex items-center justify-center gap-2">
                  FALE COMIGO
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </a>
            </Link>

            <a
              href="https://github.com/juliano340"
              target="_blank"
              rel="noopener noreferrer"
              className="mono-focus-ring inline-flex items-center justify-center w-12 h-12 transition-all duration-300"
              style={{
                border: '1px solid var(--color-border)',
                borderRadius: '999px',
                color: 'var(--color-muted)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-accent)';
                e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb), 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-muted)';
                e.currentTarget.style.borderColor = 'var(--color-border)';
              }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>

        {/* Right Column - Profile Card */}
        <div className="flex justify-center lg:justify-end">
          <div
            className="w-full max-w-xs"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateX(0) scale(1)' : 'translateX(40px) scale(0.95)',
              transition: 'all 0.7s cubic-bezier(0.22, 0.61, 0.36, 1) 0.15s',
            }}
          >
            <div
              className="p-8 text-center"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
              }}
            >
              {/* Avatar */}
              <div
                className="relative mx-auto mb-5 h-24 w-24 overflow-hidden"
                style={{
                  border: '2px solid var(--color-accent)',
                  borderRadius: '50%',
                }}
              >
                <Image
                  src="https://avatars.githubusercontent.com/u/87342139?v=4"
                  alt="Juliano340"
                  fill
                  sizes="96px"
                  className="object-cover"
                  priority
                />
              </div>

              {/* Name */}
              <h2
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '1.8rem',
                  color: 'var(--color-text)',
                  letterSpacing: '0.08em',
                  lineHeight: 1,
                  marginBottom: '4px',
                }}
              >
                JULIANO PEREIRA
              </h2>

              {/* Role */}
              <p
                className="mb-5 text-sm font-medium"
                style={{ color: 'var(--color-accent)' }}
              >
                Full Stack Developer
              </p>

              {/* Location + Tech */}
              <div
                className="mx-auto max-w-[200px] space-y-1.5 py-4"
                style={{ borderTop: '1px solid var(--color-border)' }}
              >
                <div className="flex items-center justify-center gap-2 text-xs" style={{ color: 'var(--color-muted-dim)' }}>
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Porto Alegre, Brasil
                </div>
                <div className="flex items-center justify-center gap-2 text-xs" style={{ color: 'var(--color-muted-dim)' }}>
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Next.js · Node.js · C#/.NET
                </div>
              </div>

              {/* Mini CTA */}
              <Link href="/contato" legacyBehavior>
                <a
                  className="mono-focus-ring inline-flex items-center justify-center gap-2 w-full py-3 text-[0.65rem] font-bold uppercase tracking-[0.15em] transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    background: 'var(--color-accent)',
                    color: 'var(--btn-text)',
                    borderRadius: '999px',
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  FALE COMIGO
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionView;
