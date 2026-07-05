import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import HeroBackground from './HeroBackground';

const CURRENT_YEAR = new Date().getFullYear();

const HeroSectionView = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* Hero Content */}
      <div className="relative flex items-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <HeroBackground />

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div
              className="lg:col-span-7 flex flex-col gap-8"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateX(0)' : 'translateX(-40px)',
                transition: 'all 0.7s cubic-bezier(0.22, 0.61, 0.36, 1)',
              }}
            >
              {/* Eyebrow */}
              <div className="flex items-center gap-3">
                <span className="h-px w-10" style={{ background: 'var(--color-accent)' }} />
                <span
                  className="font-mono text-[0.7rem] uppercase tracking-[0.2em] font-semibold"
                  style={{ color: 'var(--color-accent)' }}
                >
                  Code &amp; Product
                </span>
              </div>

              {/* Headline */}
              <h1 className="flex flex-col">
                <span
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 'clamp(3.5rem, 9vw, 6.5rem)',
                    lineHeight: 0.92,
                    color: 'var(--color-text)',
                    fontWeight: 400,
                  }}
                >
                  DESENVOLVEDOR
                </span>
                <span
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 'clamp(3.5rem, 9vw, 6.5rem)',
                    lineHeight: 0.85,
                    color: 'var(--color-accent)',
                    fontWeight: 400,
                    letterSpacing: '0.04em',
                  }}
                >
                  FULL STACK
                </span>
              </h1>

              {/* Value prop */}
              <p
                className="max-w-xl text-lg sm:text-xl font-light leading-relaxed"
                style={{ color: 'var(--color-muted)' }}
              >
                Produtos digitais do conceito ao deploy — com código limpo, velocidade e IA aplicada.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-8 py-2">
                <div className="flex flex-col">
                  <span className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>{CURRENT_YEAR - 2022}+ anos</span>
                  <span className="text-[0.65rem] font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--color-muted-dim)' }}>de mercado</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>2-4 sem</span>
                  <span className="text-[0.65rem] font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--color-muted-dim)' }}>brief → deploy</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-5">
                <Link href="/contato" legacyBehavior>
                  <a
                    className="group mono-button-primary text-[0.75rem] px-10 py-5"
                    style={{ letterSpacing: '0.1em' }}
                  >
                    <span className="flex items-center justify-center gap-3">
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
                  className="group flex items-center gap-3 text-[0.7rem] font-bold uppercase tracking-[0.1em] transition-colors"
                  style={{ color: 'var(--color-muted)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-muted)'; }}
                >
                  <span
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
                    style={{ border: '1px solid var(--color-border)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb), 0.4)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </span>
                  GitHub
                </a>
              </div>
            </div>

            {/* Right Profile Card */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
              {/* Decorative blurred orbs */}
              <div
                className="absolute -top-12 -right-12 w-48 h-48 rounded-full -z-10"
                style={{ background: 'rgba(var(--accent-rgb), 0.08)', filter: 'blur(80px)' }}
              />
              <div
                className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full -z-10"
                style={{ background: 'rgba(var(--accent-rgb), 0.05)', filter: 'blur(100px)' }}
              />

              <div
                className="w-full max-w-[420px] rounded-2xl p-8 flex flex-col items-center text-center"
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateX(0) scale(1)' : 'translateX(40px) scale(0.95)',
                  transition: 'all 0.7s cubic-bezier(0.22, 0.61, 0.36, 1) 0.15s',
                  background: 'rgba(var(--color-surface), 0.8)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(var(--accent-rgb), 0.12)',
                }}
              >
                {/* Avatar */}
                <div className="relative w-36 h-36 mb-6">
                  <div
                    className="absolute inset-0 rounded-full animate-[spin_12s_linear_infinite]"
                    style={{ border: '3px solid rgba(var(--accent-rgb), 0.25)' }}
                  />
                  <div
                    className="absolute -inset-2 rounded-full"
                    style={{ border: '1px solid rgba(var(--accent-rgb), 0.1)' }}
                  />
                  <div
                    className="relative w-full h-full p-2"
                    style={{ border: '2px solid var(--color-surface)', borderRadius: '50%' }}
                  >
                    <Image
                      src="https://avatars.githubusercontent.com/u/87342139?v=4"
                      alt="Juliano Pereira"
                      fill
                      sizes="144px"
                      className="object-cover rounded-full"
                      priority
                    />
                  </div>
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
                  className="mb-6 text-[0.7rem] font-bold uppercase tracking-[0.18em]"
                  style={{ color: 'var(--color-accent)' }}
                >
                  Full Stack Developer
                </p>

                {/* Divider */}
                <div className="w-full h-px mb-6" style={{ background: 'rgba(var(--accent-rgb), 0.12)' }} />

                {/* Location + Stack */}
                <div className="flex flex-col gap-3 w-full" style={{ color: 'var(--color-muted-dim)' }}>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Porto Alegre, Brasil
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Next.js · Node.js · C#/.NET
                  </div>
                </div>

                {/* Mini CTA */}
                <Link href="/contato" legacyBehavior>
                  <a
                    className="mono-focus-ring mt-6 w-full py-3.5 text-[0.65rem] font-bold uppercase tracking-[0.15em] transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    style={{
                      background: 'rgba(var(--accent-rgb), 0.08)',
                      color: 'var(--color-accent)',
                      border: '1px solid rgba(var(--accent-rgb), 0.2)',
                      borderRadius: '999px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(var(--accent-rgb), 0.15)';
                      e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb), 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(var(--accent-rgb), 0.08)';
                      e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb), 0.2)';
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Enviar Mensagem
                  </a>
                </Link>

                {/* Tags */}
                <div className="flex gap-2 mt-5 flex-wrap justify-center">
                  {['REACT', 'DOCKER', 'AWS'].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.1em] rounded"
                      style={{
                        background: 'rgba(var(--accent-rgb), 0.05)',
                        color: 'var(--color-muted-dim)',
                        border: '1px solid rgba(var(--accent-rgb), 0.08)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="border-y py-10 overflow-hidden" style={{ borderColor: 'rgba(var(--accent-rgb), 0.1)' }}>
        <div className="marquee-track flex gap-16 whitespace-nowrap">
          {[
            'Enterprise Software',
            'AI Integration',
            'Scalable Architecture',
            'Clean Code',
            'Product Strategy',
            'Full Stack Development',
          ].map((text, i) => (
            <span
              key={i}
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
                color: 'var(--color-border)',
                letterSpacing: '0.05em',
                opacity: 0.6,
              }}
            >
              {text}
            </span>
          ))}
          {[
            'Enterprise Software',
            'AI Integration',
            'Scalable Architecture',
            'Clean Code',
            'Product Strategy',
            'Full Stack Development',
          ].map((text, i) => (
            <span
              key={`dup-${i}`}
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
                color: 'var(--color-border)',
                letterSpacing: '0.05em',
                opacity: 0.6,
              }}
            >
              {text}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee-scroll 35s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSectionView;
