import Link from 'next/link';
import Image from 'next/image';
import useScrollProgress from '@/lib/useScrollProgress';
import { useRef } from 'react';
import { HOME_CONTAINER, HOME_LINK, HOME_BUTTON } from '@/lib/homePresentation';

const TITLE_ROWS = [
  [{ text: 'Desenvolvedor', delay: 0.1 }],
  [{ text: 'Full', delay: 0.22 }, { text: 'Stack', delay: 0.34 }],
];

const HeroSectionView = () => {
  const ref = useRef(null);

  useScrollProgress((progress) => {
    const el = ref.current;
    if (!el) return;
    // Scrollytelling: content sinks + fades as the user scrolls on.
    const clamped = Math.min(1, Math.max(0, progress));
    el.style.transform = `translate3d(0, ${clamped * 40}px, 0) scale(${1 - clamped * 0.03})`;
    el.style.opacity = `${1 - clamped * 0.9}`;
  });

  return (
    <section aria-labelledby="home-title" className="relative flex flex-col justify-center overflow-hidden bg-background text-primary lg:min-h-[calc(100vh-60px)]">
      {/* ── Fundo em camadas, mais contido — textura, não efeito ── */}
      <div
        aria-hidden="true"
        className="animate-hero-glow-drift pointer-events-none absolute -top-32 left-1/2 h-[36rem] w-[52rem] max-w-none -translate-x-1/2 opacity-40 blur-[110px]"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(var(--accent-rgb), 0.12) 0%, rgba(var(--accent-rgb), 0.04) 45%, transparent 70%)',
        }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ perspective: '600px' }}>
        <div
          className="animate-hero-grid-slide absolute inset-x-0 -bottom-16 top-0"
          style={{
            transform: 'rotateX(58deg) scale(1.6)',
            transformOrigin: '50% 0%',
            backgroundImage:
              'linear-gradient(rgba(var(--accent-rgb), 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb), 0.05) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            maskImage: 'linear-gradient(to bottom, transparent 30%, black 70%, transparent 98%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 30%, black 70%, transparent 98%)',
          }}
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, transparent 0%, var(--color-background) 85%)' }}
      />

      {/* ── Conteúdo ──────────────────────────────────────────── */}
      <div className={`${HOME_CONTAINER} relative pb-14 pt-10 sm:pb-16 sm:pt-12 lg:pt-16`} style={{ perspective: '1000px' }}>
        <div ref={ref} style={{ willChange: 'transform, opacity' }}>
          <p
            className="ds-label mb-6 flex items-center justify-center gap-3 lg:justify-start"
            style={{ animation: 'fadeIn 0.8s var(--motion-ease-cinematic) 0.05s both' }}
          >
            <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: 'var(--color-accent)' }} />
            Porto Alegre, Brasil
          </p>

          <div className="grid items-center gap-y-10 sm:gap-y-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-x-14">
            <div className="max-w-3xl">
              <h1 id="home-title" className="ds-display flex flex-col items-center gap-x-[0.28em] lg:items-start" style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
                {TITLE_ROWS.map((row, i) => (
                  <span key={i} className="flex gap-x-[0.28em]">
                    {row.map(({ text, delay }) => (
                      <span key={text} className="hero-mask inline-block">
                        <span
                          className="animate-hero-word-rise inline-block text-primary"
                          style={{ '--rise-delay': `${delay}s` }}
                        >
                          {text}
                        </span>
                      </span>
                    ))}
                  </span>
                ))}
              </h1>

              {/* Assinatura em terminal — amarra com a página /terminal */}
              <p
                className="mt-5 flex justify-center font-mono text-xs sm:text-sm lg:justify-start"
                style={{ color: 'var(--color-dim)', animation: 'fadeIn 0.8s var(--motion-ease-cinematic) 0.45s both' }}
                aria-label="Terminal: deploy com papel de desenvolvedor full stack, desde 2006"
              >
                <span aria-hidden="true" style={{ color: 'var(--color-accent)' }}>$&nbsp;</span>
                <span aria-hidden="true">
                  ~/juliano340 <span style={{ color: 'var(--color-muted)' }}>deploy</span> --role=<span style={{ color: 'var(--color-text)' }}>full-stack</span> --since=<span style={{ color: 'var(--color-text)' }}>2006</span>
                </span>
              </p>

              <p
                className="ds-body mx-auto mt-6 max-w-xl text-center text-muted lg:mx-0 lg:text-left"
                style={{ animation: 'fadeIn 0.8s var(--motion-ease-cinematic) 0.55s both' }}
              >
                Tiro ideias do papel com código que sobrevive à produção — Next.js, TypeScript e o
                olhar de QA que aprendi dentro de ERPs e sistemas críticos.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:justify-start" style={{ animation: 'fadeIn 0.8s var(--motion-ease-cinematic) 0.75s both' }}>
                <a href="#portfolio" className={`${HOME_BUTTON} group`}>
                  Ver projetos
                  <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
                <Link href="/contato" legacyBehavior><a className={HOME_LINK}>Fale comigo</a></Link>
              </div>
            </div>

            {/* Coluna direita: foto + hairline vertical + ficha técnica em mono */}
            <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:gap-7" style={{ animation: 'fadeIn 1s var(--motion-ease-cinematic) 0.45s both' }}>
              <RevealInHero />
              <div aria-hidden="true" className="hidden h-32 w-px animate-hero-rule origin-center lg:block" style={{ background: 'var(--color-border)' }} />
              <dl className="flex justify-center gap-x-5 gap-y-1 font-mono text-[0.7rem] uppercase tracking-[0.14em] lg:flex-col lg:justify-start" style={{ color: 'var(--color-dim)' }}>
                <div className="flex items-center gap-2">
                  <span aria-hidden="true" className="inline-block h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: 'var(--color-accent)' }} />
                  <dd>disponível</dd>
                </div>
                <div className="flex items-center gap-2">
                  <span aria-hidden="true" className="inline-block h-px w-3 shrink-0" style={{ background: 'var(--color-border)' }} />
                  <dd>POA/RS</dd>
                </div>
                <div className="flex items-center gap-2">
                  <span aria-hidden="true" className="inline-block h-px w-3 shrink-0" style={{ background: 'var(--color-border)' }} />
                  <dd>TS · Next · QA</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mx-auto max-w-3xl lg:col-start-1 lg:mx-0" style={{ animation: 'fadeIn 1s var(--motion-ease-cinematic) 0.95s both' }}>
            <p className="ds-body mt-2 max-w-xl text-center text-muted sm:mt-8 lg:mt-0 lg:text-left">
              Duas décadas entre suporte, QA e desenvolvimento me mostraram o que realmente
              quebra em produção — hoje escrevo código pensando no dia seguinte ao deploy,
              com formação em <strong className="text-primary">Sistemas para Internet</strong> (Unisinos)
              e pós em <strong className="text-primary">Eng. de Qualidade</strong> (PUC Minas).
            </p>
            <div className="mt-6 flex justify-center lg:justify-start" style={{ animation: 'fadeIn 1s var(--motion-ease-cinematic) 1.1s both' }}>
              <Link href="/sobre" legacyBehavior>
                <a className="mono-focus-ring inline-flex min-h-11 items-center gap-2 text-sm font-bold hover:underline underline-offset-4">
                  Currículo completo →
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Indicador de scroll — linha estática, quieta */}
      <div aria-hidden="true" className="pointer-events-none absolute bottom-4 left-1/2 hidden -translate-x-1/2 lg:block" style={{ animation: 'fadeIn 1s linear 1.4s both' }}>
        <div className="h-8 w-[2px] rounded-full" style={{ background: 'linear-gradient(to bottom, var(--color-border), transparent)' }} />
      </div>
    </section>
  );
};

// Foto com ring discreto; glow só no hover.
const RevealInHero = () => (
  <div className="group relative mx-auto justify-self-center lg:mx-0 lg:justify-self-end">
    <div
      aria-hidden="true"
      className="absolute left-0 top-0 h-52 w-52 rounded-full opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-50 lg:h-64 lg:w-64"
      style={{ background: 'radial-gradient(circle, rgba(var(--accent-rgb), 0.3) 0%, transparent 70%)' }}
    />
    <div
      className="relative h-52 w-52 overflow-hidden rounded-full transition-transform duration-500 lg:h-64 lg:w-64 group-hover:scale-[1.02]"
      style={{ boxShadow: '0 0 0 1px var(--color-border), 0 12px 40px rgba(0,0,0,0.5)' }}
    >
      <Image
        src="/images/profile-about.png"
        alt="Juliano Pereira"
        fill
        sizes="(max-width: 1024px) 208px, 256px"
        className="object-cover scale-[1.15]"
        style={{ objectPosition: '48% 52%' }}
      />
    </div>
  </div>
);

export default HeroSectionView;
