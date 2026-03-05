import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../contexts/ThemeContext';

// ─── Typing Hook ──────────────────────────────────────────────────────────────
function useTyping(phrases) {
  const [text, setText] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIdx];
    let t;
    if (!deleting && text === current)
      t = setTimeout(() => setDeleting(true), 2200);
    else if (deleting && text === '') { setDeleting(false); setPhraseIdx(i => (i + 1) % phrases.length); }
    else
      t = setTimeout(() =>
        setText(p => deleting ? p.slice(0, -1) : current.slice(0, p.length + 1)),
        deleting ? 45 : 95
      );
    return () => clearTimeout(t);
  }, [text, deleting, phraseIdx, phrases]);

  return { text };
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const MailIcon = () => (
  <svg viewBox="0 0 20 20" width="15" height="15" fill="currentColor">
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
);

// ─── Sub-components ───────────────────────────────────────────────────────────
function MatrixRain({ isDark }) {
  const columns = Array.from({ length: 26 }, (_, i) => i);

  const buildStream = (seed) => {
    const length = 20 + ((seed * 11) % 14);
    return Array.from({ length }, (_, idx) => ((seed + idx * 3) % 2 === 0 ? '1' : '0')).join('\n');
  };

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
      overflow: 'hidden',
      background: isDark
        ? 'linear-gradient(180deg, rgba(6,10,18,0.15) 0%, rgba(2,7,12,0.28) 100%)'
        : 'linear-gradient(180deg, rgba(2,132,199,0.06) 0%, rgba(15,23,42,0.04) 100%)',
      maskImage: 'radial-gradient(ellipse 75% 75% at 50% 50%, black 30%, transparent 100%)',
      WebkitMaskImage: 'radial-gradient(ellipse 75% 75% at 50% 50%, black 30%, transparent 100%)',
      transition: 'background 0.4s',
    }}>
      {columns.map((col) => {
        const duration = 8 + (col % 6);
        const delay = -col * 0.55;
        const left = (col / (columns.length - 1)) * 100;
        return (
          <span
            key={col}
            style={{
              position: 'absolute',
              top: '-140%',
              left: `${left}%`,
              whiteSpace: 'pre',
              lineHeight: 1.08,
              letterSpacing: '0.02em',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              color: isDark ? 'rgba(34,197,94,0.55)' : 'rgba(2,132,199,0.35)',
              textShadow: isDark ? '0 0 8px rgba(34,197,94,0.32)' : '0 0 5px rgba(2,132,199,0.24)',
              opacity: 0.45 + ((col * 7) % 40) / 100,
              animation: `hu-matrixFall ${duration}s linear ${delay}s infinite, hu-matrixFlicker ${2.2 + (col % 4)}s ease-in-out ${delay}s infinite`,
            }}
          >
            {buildStream(col)}
          </span>
        );
      })}
    </div>
  );
}

function Orb({ style }) {
  return <div style={{ position: 'absolute', borderRadius: '50%', pointerEvents: 'none', zIndex: 0, ...style }} />;
}

function StatusPill({ isDark, accent }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '5px 14px', borderRadius: 999,
      fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, fontWeight: 500,
      letterSpacing: '0.03em',
      background: isDark ? 'rgba(56,189,248,0.08)' : 'rgba(2,132,199,0.07)',
      color: accent,
      border: `1px solid ${isDark ? 'rgba(56,189,248,0.18)' : 'rgba(2,132,199,0.18)'}`,
      marginBottom: 28,
      animation: 'hu-fadeUp 0.45s ease 0.1s both',
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
        background: '#22c55e',
        boxShadow: '0 0 6px #22c55e',
        animation: 'hu-pulse 2.2s ease-in-out infinite',
      }} />
      openTo: true — disponível para projetos
    </div>
  );
}

function Avatar({ isDark, accent }) {
  return (
    <div style={{ position: 'relative', marginBottom: 28, animation: 'hu-fadeUp 0.45s ease 0.15s both' }}>
      {/* outer soft ring */}
      <div style={{
        position: 'absolute', inset: -14, borderRadius: '50%',
        border: `1px solid ${accent}`,
        opacity: 0.15,
      }} />
      {/* inner ring */}
      <div style={{
        position: 'absolute', inset: -5, borderRadius: '50%',
        border: `2px solid ${accent}`,
        opacity: 0.45,
        animation: 'hu-pulse 3s ease-in-out infinite',
      }} />
      <Image
        src="https://avatars.githubusercontent.com/u/87342139?v=4"
        alt="Profile Picture"
        width={96} height={96} priority
        style={{ borderRadius: '50%', display: 'block', position: 'relative', zIndex: 1 }}
      />
    </div>
  );
}

function SkillBadge({ label, isDark, delay }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '4px 12px', borderRadius: 999,
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 11, fontWeight: 600, letterSpacing: '0.04em',
      background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
      color: isDark ? '#94a3b8' : '#64748b',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.07)'}`,
      transition: 'background 0.2s, color 0.2s',
      animation: `hu-fadeUp 0.4s ease ${delay}s both`,
    }}>
      {label}
    </span>
  );
}

function CodeMarquee({ isDark }) {
  const snippets = [
    'const dev = { name: "Seu Nome", openTo: true }',
    'npm run build  →  ✓ compiled in 1.2s',
    'git commit -m "feat: melhoria de performance"',
    "SELECT * FROM projetos WHERE status = 'production'",
    'docker build -t portfolio:latest .',
    'npx create-next-app@latest --typescript',
  ];
  const doubled = [...snippets, ...snippets];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      height: 34, overflow: 'hidden',
      borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
      background: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.015)',
      display: 'flex', alignItems: 'center',
      transition: 'border-color 0.3s, background 0.3s',
    }}>
      <div style={{
        display: 'flex', gap: 56, whiteSpace: 'nowrap',
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
        color: isDark ? 'rgba(148,163,184,0.35)' : 'rgba(71,85,105,0.3)',
        paddingLeft: '100%',
        animation: 'hu-scrollX 20s linear infinite',
        transition: 'color 0.3s',
      }}>
        {doubled.map((s, i) => <span key={i}>{s}</span>)}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const ROLES = ['Desenvolvedor Front-end', 'Desenvolvedor Back-end', 'Desenvolvedor Full Stack'];
const SKILLS = ['React', 'Next.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker'];

export default function HeroSection() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const { text } = useTyping(ROLES);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // ── Palette ──────────────────────────────────────────────────────────────
  const p = {
    bg: isDark ? '#0b1220' : '#f0f4f8',
    cardBg: isDark ? 'rgba(15,25,45,0.85)' : 'rgba(255,255,255,0.88)',
    cardBorder: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)',
    cardShadow: isDark
      ? '0 0 0 1px rgba(255,255,255,0.04), 0 28px 72px rgba(0,0,0,0.55)'
      : '0 0 0 1px rgba(0,0,0,0.04), 0 28px 72px rgba(0,0,0,0.10)',
    heading: isDark ? '#e2e8f0' : '#0f172a',
    body: isDark ? '#94a3b8' : '#4b5563',
    accent: isDark ? '#38bdf8' : '#0284c7',
    accentHov: isDark ? '#7dd3fc' : '#0369a1',
    divider: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)',
    btnShadow: isDark ? '0 4px 22px rgba(56,189,248,0.28)' : '0 4px 22px rgba(2,132,199,0.22)',
    btnShadowHov: isDark ? '0 8px 30px rgba(56,189,248,0.38)' : '0 8px 30px rgba(2,132,199,0.32)',
    orb1: isDark ? 'radial-gradient(circle, rgba(30,58,95,0.6) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(191,219,254,0.5) 0%, transparent 70%)',
    orb2: isDark ? 'radial-gradient(circle, rgba(15,40,70,0.5) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(219,234,254,0.5) 0%, transparent 70%)',
  };

  if (!mounted) return (
    <div style={{ background: '#0b1220', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid #38bdf8', borderTopColor: 'transparent', animation: 'hu-spin 0.7s linear infinite' }} />
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

        @keyframes hu-fadeUp  { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes hu-scaleIn { from { opacity:0; transform:scale(0.9); } to { opacity:1; transform:scale(1); } }
        @keyframes hu-pulse   { 0%,100% { opacity:1; } 50% { opacity:0.35; } }
        @keyframes hu-orb1    { from { transform:translate(0,0) scale(1); } to { transform:translate(28px,18px) scale(1.08); } }
        @keyframes hu-orb2    { from { transform:translate(0,0) scale(1.05); } to { transform:translate(-22px,-28px) scale(1); } }
        @keyframes hu-scrollX { from { transform:translateX(0); } to { transform:translateX(-50%); } }
        @keyframes hu-spin    { to { transform:rotate(360deg); } }
        @keyframes hu-matrixFall {
          from { transform: translate3d(0, -6%, 0); }
          to { transform: translate3d(0, 210%, 0); }
        }
        @keyframes hu-matrixFlicker {
          0%, 100% { opacity: 0.35; }
          45% { opacity: 0.88; }
          70% { opacity: 0.5; }
        }

        .hu-root {
          font-family: 'DM Sans', sans-serif;
          background: ${p.bg};
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
          padding: 60px 20px 94px;
          transition: background 0.4s ease;
        }

        .hu-card {
          position: relative; z-index: 1;
          display: flex; flex-direction: column; align-items: center; text-align: center;
          max-width: 580px; width: 100%;
          padding: 48px 44px 44px;
          background: ${p.cardBg};
          border: 1px solid ${p.cardBorder};
          border-radius: 24px;
          backdrop-filter: blur(24px);
          box-shadow: ${p.cardShadow};
          animation: hu-scaleIn 0.45s cubic-bezier(0.16,1,0.3,1) both;
          transition: background 0.4s, border-color 0.4s, box-shadow 0.4s;
        }

        .hu-h1 {
          font-size: clamp(24px, 4.5vw, 36px);
          font-weight: 700; line-height: 1.2; letter-spacing: -0.025em;
          color: ${p.heading};
          margin: 0 0 18px;
          animation: hu-fadeUp 0.45s ease 0.2s both;
          transition: color 0.3s;
        }

        .hu-typing-row {
          min-height: 32px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px;
          animation: hu-fadeUp 0.45s ease 0.25s both;
        }

        .hu-typing {
          font-family: 'JetBrains Mono', monospace;
          font-size: clamp(13px, 2.2vw, 16px); font-weight: 500;
          color: ${p.accent};
          transition: color 0.3s;
        }

        .hu-cursor {
          display: inline-block; width: 2px; height: 1em;
          background: ${p.accent}; border-radius: 1px;
          vertical-align: middle; margin-left: 2px;
          animation: hu-pulse 1s steps(1, end) infinite;
          transition: background 0.3s;
        }

        .hu-desc {
          font-size: 14.5px; line-height: 1.7; color: ${p.body};
          max-width: 400px; margin: 0 auto 28px;
          animation: hu-fadeUp 0.45s ease 0.3s both;
          transition: color 0.3s;
        }

        .hu-badges {
          display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;
          margin-bottom: 32px;
          animation: hu-fadeUp 0.45s ease 0.35s both;
        }

        .hu-divider {
          width: 100%; height: 1px; background: ${p.divider};
          margin-bottom: 30px;
          animation: hu-fadeUp 0.45s ease 0.38s both;
          transition: background 0.3s;
        }

        .hu-cta {
          display: inline-flex; align-items: center; gap: 9px;
          padding: 13px 30px; border-radius: 999px;
          background: ${p.accent}; color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14.5px; font-weight: 600;
          text-decoration: none; border: none; cursor: pointer;
          box-shadow: ${p.btnShadow};
          transition: background 0.25s, box-shadow 0.25s, transform 0.2s;
        }
        .hu-cta:hover {
          background: ${p.accentHov};
          box-shadow: ${p.btnShadowHov};
          transform: translateY(-2px);
        }

        .hu-links {
          margin-top: 14px; font-size: 13px; color: ${p.body};
          animation: hu-fadeUp 0.45s ease 0.47s both;
          transition: color 0.3s;
        }
        .hu-links a {
          color: ${p.accent}; text-decoration: none; font-weight: 500;
          transition: color 0.2s;
        }
        .hu-links a:hover { color: ${p.accentHov}; }

        @media (max-width: 480px) {
          .hu-card { padding: 36px 22px 36px; }
        }
      `}</style>

      <div className="hu-root">

        {/* Background layers */}
        <MatrixRain isDark={isDark} />
        <Orb style={{
          width: 420, height: 420, top: '-100px', left: '-80px',
          background: p.orb1,
          animation: 'hu-orb1 9s ease-in-out infinite alternate',
        }} />
        <Orb style={{
          width: 320, height: 320, bottom: '-80px', right: '-60px',
          background: p.orb2,
          animation: 'hu-orb2 11s ease-in-out infinite alternate',
        }} />

        {/* Card */}
        <div className="hu-card">

          <StatusPill isDark={isDark} accent={p.accent} />
          <Avatar isDark={isDark} accent={p.accent} />

          <h1 className="hu-h1">
            Olá, eu sou um<br />Programador Web
          </h1>

          <div className="hu-typing-row">
            <span className="hu-typing">
              {text}
              <span className="hu-cursor" />
            </span>
          </div>

          <p className="hu-desc">
            Criando soluções web eficientes e inovadoras — do design ao deploy, com código limpo e foco em performance.
          </p>

          <div className="hu-badges">
            {SKILLS.map((s, i) => (
              <SkillBadge key={s} label={s} isDark={isDark} delay={0.36 + i * 0.04} />
            ))}
          </div>

          <div className="hu-divider" />

          <Link href="/contato" passHref>
            <div className="hu-cta">
              <MailIcon />
              Entre em Contato
            </div>
          </Link>

          <p className="hu-links">
            ou veja meu{' '}
            <a href="https://github.com/juliano340" target="_blank" rel="noopener noreferrer">GitHub</a>
            {' '}e{' '}
            <a href="https://linkedin.com/in/juliano340" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </p>

        </div>

        {/* Scrolling code strip */}
        <CodeMarquee isDark={isDark} />

      </div>
    </>
  );
}
