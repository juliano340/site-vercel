import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import HeroBackground from './HeroBackground';

const STACK = ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Claude/GPT API', 'Docker', 'Stripe', 'Prisma'];
const CURRENT_YEAR = new Date().getFullYear();

// Typing effect component
const TypedText = ({ texts, speed = 60 }) => {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];
    let timeout;

    if (!isDeleting && displayText === currentText) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setTextIndex((prev) => (prev + 1) % texts.length);
    } else {
      timeout = setTimeout(
        () => setDisplayText(
          isDeleting
            ? currentText.slice(0, displayText.length - 1)
            : currentText.slice(0, displayText.length + 1)
        ),
        isDeleting ? speed / 2 : speed
      );
    }

    return () => clearTimeout(timeout);
  }, [displayText, textIndex, isDeleting, texts, speed]);

  return (
    <span>
      {displayText}
      <span className="animate-pulse ml-1" style={{ color: '#C8FF00' }}>▋</span>
    </span>
  );
};

const HeroSectionView = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)').matches) return;

    setMounted(true);
  }, []);

  const typedTexts = [
    'Desenvolvimento Front-end',
    'Desenvolvimento Back-end',
    'Desenvolvimento Full Stack',
  ];

  return (
    <section className="hero-fullheight relative flex items-center overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <HeroBackground />

      <div className="relative z-10 mx-auto w-full max-w-7xl grid items-center gap-12 lg:grid-cols-2">
        {/* Left Column - Main Content */}
        <div className="hero-left" style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateX(0)' : 'translateX(-60px)', transition: 'all 0.7s cubic-bezier(0.22, 0.61, 0.36, 1)' }}>
          {/* Status Badge */}
          <div className="mb-6 inline-flex items-center gap-2">
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[0.65rem] font-bold uppercase tracking-[0.2em]"
              style={{
                background: 'rgba(200,255,0,0.08)',
                border: '1px solid rgba(200,255,0,0.25)',
                color: '#C8FF00',
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: '#C8FF00' }}
              />
              Available for projects
            </span>
          </div>

          {/* Main Headline */}
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(2.75rem, 6vw, 4.5rem)',
              lineHeight: 0.92,
              color: '#FFFFFF',
              marginBottom: '1.5rem',
              letterSpacing: '0.02em',
              fontWeight: 700,
            }}
          >
            DESENVOLVEDOR<br />
            <span style={{ color: '#C8FF00' }}>FULL STACK</span>
          </h1>

          {/* Sub-headline with typing effect */}
          <p
            className="mb-2 text-lg sm:text-xl font-light"
            style={{ color: 'rgba(200,255,0,0.7)', minHeight: '2rem' }}
          >
            <TypedText texts={typedTexts} speed={70} />
          </p>

          {/* Description */}
          <p
            className="mb-8 max-w-lg text-base sm:text-lg leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            Desenvolvedor com experiência em TypeScript, Next.js, Node.js e C#/.NET.
            Escrevo código limpo, aplico IA no dia a dia e penso no produto como um todo.
          </p>

          {/* Stack chips */}
          <div className="mb-8 flex flex-wrap gap-2">
            {STACK.map((item) => (
              <span
                key={item}
                className="mono-chip"
                style={{ fontSize: '0.6rem', padding: '4px 10px' }}
              >
                {item}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/contato" legacyBehavior>
              <a
                className="group mono-button-primary text-[0.75rem] px-8 py-4"
                style={{ letterSpacing: '0.1em' }}
              >
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
              className="mono-button-secondary text-[0.75rem] px-8 py-4"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                GITHUB
              </span>
            </a>
          </div>

        </div>

        {/* Right Column - Profile Card */}
        <div className="flex justify-center lg:justify-end">
          <div
            className="hero-profile-card w-full max-w-sm relative"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateX(0) scale(1)' : 'translateX(60px) scale(0.95)',
              transition: 'all 0.7s cubic-bezier(0.22, 0.61, 0.36, 1) 0.15s',
            }}
          >
            {/* Glow behind card */}
            <div
              className="absolute -inset-4 rounded-xl blur-xl"
              style={{ background: 'rgba(200,255,0,0.06)' }}
            />

            <div
              className="hero-right-inner relative p-6 sm:p-8"
              style={{
                background: 'rgba(17,17,17,0.95)',
                border: '1px solid rgba(200,255,0,0.15)',
                borderRadius: '8px',
                backdropFilter: 'blur(20px)',
              }}
            >
              {/* Terminal header */}
              <div className="flex items-center gap-2 mb-5">
                <div className="w-3 h-3 rounded-full" style={{ background: '#FF5F57' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#FFBD2E' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#28CA41' }} />
                <span className="ml-2 font-mono text-[0.6rem] uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  juliano340@dev ~
                </span>
              </div>

              {/* Profile Info */}
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="relative h-16 w-16 overflow-hidden flex-shrink-0"
                  style={{
                    border: '2px solid rgba(200,255,0,0.3)',
                    borderRadius: '50%',
                  }}
                >
                  <Image
                    src="https://avatars.githubusercontent.com/u/87342139?v=4"
                    alt="Juliano340"
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
                      color: '#C8FF00',
                      fontSize: '1.5rem',
                      letterSpacing: '0.1em',
                      lineHeight: 1,
                    }}
                  >
                    JULIANO340
                  </p>
                  <p style={{ color: '#FFFFFF', fontSize: '0.85rem', marginTop: '2px' }}>
                    Full Stack Developer
                  </p>
                </div>
              </div>

              {/* Terminal-style output */}
              <div
                className="rounded p-4 mb-5 font-mono text-[0.7rem] leading-6"
                style={{
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(200,255,0,0.1)',
                }}
              >
                <p style={{ color: 'rgba(255,255,255,0.3)' }}>$ whoami</p>
                <p style={{ color: '#C8FF00' }}>Juliano Pereira</p>
                <p style={{ color: 'rgba(255,255,255,0.3)' }}>-----------------------------------</p>
                <p style={{ color: 'rgba(255,255,255,0.3)' }}>$ cat skills.txt</p>
                <p style={{ color: 'rgba(255,255,255,0.6)' }}>Next.js • TypeScript • Node.js</p>
                <p style={{ color: 'rgba(255,255,255,0.6)' }}>PostgreSQL • Prisma • Docker</p>
                <p style={{ color: 'rgba(255,255,255,0.6)' }}>Claude/GPT • Stripe • CI/CD</p>
                <p style={{ color: 'rgba(255,255,255,0.3)' }}>-----------------------------------</p>
                <p style={{ color: 'rgba(255,255,255,0.3)' }}>$ uptime</p>
                <p style={{ color: '#C8FF00' }}>{CURRENT_YEAR - 2022}+ anos em tecnologia</p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div
                  className="p-3 rounded"
                  style={{
                    background: 'rgba(200,255,0,0.04)',
                    border: '1px solid rgba(200,255,0,0.12)',
                  }}
                >
                  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', color: '#C8FF00', lineHeight: 1 }}>
                    TS · NEXT
                  </p>
                  <p style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Stack principal
                  </p>
                </div>
                <div
                  className="p-3 rounded"
                  style={{
                    background: 'rgba(200,255,0,0.04)',
                    border: '1px solid rgba(200,255,0,0.12)',
                  }}
                >
                  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', color: '#C8FF00', lineHeight: 1 }}>
                    C# · .NET
                  </p>
                  <p style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Experiência enterprise
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slideFromLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideFromRight {
          from { opacity: 0; transform: translateX(50px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .hero-left > *:nth-child(1) { animation: slideFromLeft 0.6s cubic-bezier(0.22, 0.61, 0.36, 1) 0.00s both; }
        .hero-left > *:nth-child(2) { animation: slideFromLeft 0.6s cubic-bezier(0.22, 0.61, 0.36, 1) 0.10s both; }
        .hero-left > *:nth-child(3) { animation: slideFromLeft 0.6s cubic-bezier(0.22, 0.61, 0.36, 1) 0.20s both; }
        .hero-left > *:nth-child(4) { animation: slideFromLeft 0.6s cubic-bezier(0.22, 0.61, 0.36, 1) 0.30s both; }
        .hero-left > *:nth-child(5) { animation: slideFromLeft 0.6s cubic-bezier(0.22, 0.61, 0.36, 1) 0.40s both; }
        .hero-left > *:nth-child(6) { animation: slideFromLeft 0.6s cubic-bezier(0.22, 0.61, 0.36, 1) 0.50s both; }

        .hero-right-inner > * { animation: slideFromRight 0.5s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
        .hero-right-inner > *:nth-child(1) { animation-delay: 0.30s; }
        .hero-right-inner > *:nth-child(2) { animation-delay: 0.38s; }
        .hero-right-inner > *:nth-child(3) { animation-delay: 0.46s; }
        .hero-right-inner > *:nth-child(4) { animation-delay: 0.54s; }

        @media (max-width: 767px), (prefers-reduced-motion: reduce) {
          .hero-left,
          .hero-profile-card,
          .hero-left > *,
          .hero-right-inner > * {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSectionView;
