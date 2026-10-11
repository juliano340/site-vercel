import Link from 'next/link';
import Image from 'next/image';
import useScrollProgress from '@/lib/useScrollProgress';
import { useRef } from 'react';
import { HOME_CONTAINER, HOME_LINK, HOME_BUTTON } from '@/lib/homePresentation';

const WORDS = [
  { text: 'Desenvolvedor', delay: 0.1 },
  { text: 'Full', delay: 0.22, accent: true },
  { text: 'Stack', delay: 0.34, accent: true },
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
      {/* ── Fundo futurista em camadas (puro CSS) ─────────────── */}
      {/* Glow verde orbitando atrás do conteúdo */}
      <div
        aria-hidden="true"
        className="animate-hero-glow-drift pointer-events-none absolute -top-32 left-1/2 h-[36rem] w-[52rem] max-w-none -translate-x-1/2 opacity-50 blur-[100px]"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(var(--accent-rgb), 0.16) 0%, rgba(var(--accent-rgb), 0.05) 45%, transparent 70%)',
        }}
      />
      {/* Grid técnico em perspectiva */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ perspective: '600px' }}>
        <div
          className="animate-hero-grid-slide absolute inset-x-0 -bottom-16 top-0"
          style={{
            transform: 'rotateX(58deg) scale(1.6)',
            transformOrigin: '50% 0%',
            backgroundImage:
              'linear-gradient(rgba(var(--accent-rgb), 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb), 0.07) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            maskImage: 'linear-gradient(to bottom, transparent 20%, black 60%, transparent 95%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 20%, black 60%, transparent 95%)',
          }}
        />
      </div>
      {/* Fade para o conteúdo respirar sobre o fundo */}
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

          <div className="grid items-center gap-y-10 sm:gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(240px,280px)] lg:gap-x-16">
            <div className="max-w-3xl">
              <h1 id="home-title" className="ds-display flex flex-wrap justify-center gap-x-[0.28em] lg:justify-start" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 3.4rem)', lineHeight: 1.1 }}>
                {WORDS.map(({ text, delay, accent }) => (
                  <span key={text} className="hero-mask inline-block">
                    <span
                      className={`animate-hero-word-rise inline-block ${accent ? '' : 'text-primary'}`}
                      style={{
                        '--rise-delay': `${delay}s`,
                        ...(accent
                          ? {
                              background: 'linear-gradient(100deg, var(--color-accent) 0%, var(--primitive-green-400) 55%, var(--primitive-white) 110%)',
                              WebkitBackgroundClip: 'text',
                              backgroundClip: 'text',
                              color: 'transparent',
                            }
                          : {}),
                      }}
                    >
                      {text}
                    </span>
                  </span>
                ))}
              </h1>

              <p
                className="ds-body mx-auto mt-6 max-w-xl text-center text-muted lg:mx-0 lg:text-left"
                style={{ animation: `fadeIn 0.8s var(--motion-ease-cinematic) 0.55s both` }}
              >
                Construo aplicações web de ponta a ponta — TypeScript, Next.js e IA aplicada, do primeiro commit ao deploy.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:justify-start" style={{ animation: 'fadeIn 0.8s var(--motion-ease-cinematic) 0.75s both' }}>
                <a href="#portfolio" className={HOME_BUTTON}>Ver projetos</a>
                <Link href="/contato" legacyBehavior><a className={HOME_LINK}>Fale comigo</a></Link>
              </div>
            </div>

            {/* Foto com ring de glow animado */}
            <RevealInHero />
          </div>

          <div className="mx-auto max-w-3xl lg:col-start-1 lg:mx-0" style={{ animation: 'fadeIn 1s var(--motion-ease-cinematic) 0.95s both' }}>
            <p className="ds-body mt-2 max-w-xl text-center text-muted sm:mt-8 lg:mt-0 lg:text-left">
              Sou graduado em <strong className="text-primary">Sistemas para Internet</strong> pela
              <strong className="text-primary"> Unisinos</strong> e pós-graduando em
              <strong className="text-primary"> Engenharia de Qualidade e Teste de Software</strong> na
              <strong className="text-primary"> PUC Minas</strong>. Tenho experiência prática com front-end, back-end,
              testes e suporte técnico — e gosto de transformar ideias em soluções digitais funcionais.
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

      {/* Indicador de scroll */}
      <div aria-hidden="true" className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2" style={{ animation: 'fadeIn 1s linear 1.4s both' }}>
        <div className="h-8 w-[2px] overflow-hidden rounded-full" style={{ background: 'var(--color-border)' }}>
          <div className="animate-pulse-scale h-full w-full origin-top rounded-full" style={{ background: 'var(--color-accent)' }} />
        </div>
      </div>
    </section>
  );
};

// Foto entra com máscara + glow ring; tilt suave no hover.
const RevealInHero = () => (
  <div
    className="group relative mx-auto justify-self-center lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mx-0 lg:justify-self-end"
    style={{ animation: 'fadeIn 1s var(--motion-ease-cinematic) 0.45s both' }}
  >
    <div
      aria-hidden="true"
      className="absolute left-0 top-0 h-52 w-52 rounded-full opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-60 lg:h-64 lg:w-64"
      style={{ background: 'radial-gradient(circle, rgba(var(--accent-rgb), 0.35) 0%, transparent 70%)' }}
    />
    <div
      className="relative h-52 w-52 overflow-hidden rounded-full transition-transform duration-500 lg:h-64 lg:w-64 group-hover:scale-[1.02]"
      style={{ boxShadow: '0 0 0 1px rgba(var(--accent-rgb), 0.25), 0 12px 40px rgba(0,0,0,0.5)' }}
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
    <div
      aria-hidden="true"
      className="absolute left-0 top-0 h-52 w-52 animate-pulse-opacity rounded-full lg:h-64 lg:w-64"
      style={{ boxShadow: '0 0 0 2px rgba(var(--accent-rgb), 0.12)' }}
    />
  </div>
);

export default HeroSectionView;
