import Link from 'next/link';
import useScrollProgress from '@/lib/useScrollProgress';
import { useCallback, useRef, useState } from 'react';
import { HOME_CONTAINER, HOME_LINK, HOME_BUTTON } from '@/lib/homePresentation';
import HeroVideoBackdrop from '@/pages/components/HeroVideoBackdrop';

const TITLE_ROWS = [
  [{ text: 'Desenvolvedor', delay: 0.1 }],
  [{ text: 'Full', delay: 0.22 }, { text: 'Stack', delay: 0.34 }],
];

const FICHA = [
  { label: 'disponível', live: true },
  { label: 'POA/RS', live: false },
  { label: 'TS · Next · QA', live: false },
];

// Camadas ligadas ao progresso do pin — tudo derivado de `progress`, nunca
// de evento. Assim subir a roda desfaz exatamente o que descer fez.
const PIN_PARALLAX = 28; // px que o conteúdo sobe ao longo do percurso
const TERMINAL_IN = [0.02, 0.42]; // faixa em que o comando se "escreve"
const STEP_MARKS = 3; // marcos do stepper (a barra vira 3 segmentos)

const clamp01 = (value) => Math.min(1, Math.max(0, value));
const ramp = (value, from, to) => clamp01((value - from) / (to - from));

const HeroSectionView = () => {
  const ref = useRef(null);
  const pinRef = useRef(null);
  const terminalRef = useRef(null);
  const [pinProgress, setPinProgress] = useState(null);

  // Progresso do pin → DOM direto (sem re-render por evento de roda):
  // parallax do conteúdo e terminal que se escreve.
  const applyPinProgress = useCallback((value) => {
    const pin = pinRef.current;
    if (pin) pin.style.transform = `translate3d(0, ${(-PIN_PARALLAX * value).toFixed(1)}px, 0)`;

    const terminal = terminalRef.current;
    if (terminal) {
      const written = ramp(value, TERMINAL_IN[0], TERMINAL_IN[1]);
      terminal.style.clipPath = `inset(0 ${((1 - written) * 100).toFixed(2)}% 0 0)`;
    }
  }, []);

  // Progresso do "pin" do vídeo (0..1) ou null quando liberado.
  // Throttle por delta pra não re-renderizar a cada pixel de rolagem.
  const handlePinProgress = useCallback((value) => {
    if (value !== null) applyPinProgress(value);
    setPinProgress((prev) => {
      if (value === null) return prev === null ? prev : null;
      if (prev !== null && Math.abs(value - prev) < 0.02 && value < 1) return prev;
      return value;
    });
  }, [applyPinProgress]);

  // Conteúdo: translateY + scale + fade conforme o hero sai de cena —
  // desktop apenas. No mobile o scroll fica nativo, sem acoplamento.
  useScrollProgress((progress) => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const clamped = Math.min(1, Math.max(0, progress));

    const el = ref.current;
    if (el) {
      el.style.transform = `translate3d(0, ${clamped * 40}px, 0) scale(${1 - clamped * 0.03})`;
      el.style.opacity = `${1 - clamped * 0.9}`;
    }
  });

  return (
    <section aria-labelledby="home-title" className="relative flex flex-col overflow-hidden bg-background text-primary [--hero-media-height:clamp(14rem,42svh,24rem)] lg:min-h-[calc(100vh-5rem)] lg:justify-center">
      {/* ── Vídeo: scrub no desktop, one-shot no mobile (scrim embutido) ── */}
      <HeroVideoBackdrop onPinProgress={handlePinProgress} />

      {/* ── Conteúdo: no mobile sobe sobre o degradê do vídeo ──── */}
      <div className={`${HOME_CONTAINER} pointer-events-none relative z-20 pb-6 pt-[calc(var(--hero-media-height)-3.5rem)] lg:pointer-events-auto lg:py-20`}>
        <div ref={pinRef} className="pointer-events-auto" style={{ willChange: 'transform' }}>
          <div ref={ref} style={{ willChange: 'transform, opacity' }}>
          <p className="mb-4 flex items-center gap-2 text-xs font-medium text-primary/80 lg:hidden">
            <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            Disponível <span aria-hidden="true" className="text-muted">·</span> Porto Alegre
          </p>
          <p
            className="ds-label mb-6 hidden items-center gap-3 lg:flex"
            style={{ animation: 'fadeIn 0.8s var(--motion-ease-cinematic) 0.05s both' }}
          >
            <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: 'var(--color-accent)' }} />
            Porto Alegre, Brasil
          </p>

          <h1
            id="home-title"
            className="ds-display flex flex-col items-start [--hero-title-size:clamp(1.9rem,9vw,3rem)] lg:[--hero-title-size:clamp(2.6rem,6.4vw,4.4rem)]"
            style={{ fontSize: 'var(--hero-title-size)', lineHeight: 1.04, letterSpacing: '-0.025em' }}
          >
            {TITLE_ROWS.map((row, i) => (
              <span key={i} className="flex gap-x-[0.28em]">
                {row.map(({ text, delay }) => (
                  <span key={text} className="hero-mask inline-block">
                    <span className="animate-hero-word-rise inline-block text-primary" style={{ '--rise-delay': `${delay}s` }}>
                      <span className="text-gradient-sweep" style={{ '--sweep-delay': `${delay + 0.12}s` }}>{text}</span>
                    </span>
                  </span>
                ))}
              </span>
            ))}
          </h1>

          {/* Assinatura em terminal — amarra com a página /terminal */}
          <p
            className="mt-5 hidden font-mono text-xs text-[var(--color-muted)] sm:text-sm lg:flex lg:text-[var(--color-dim)]"
            style={{ animation: 'fadeIn 0.8s var(--motion-ease-cinematic) 0.45s both' }}
            aria-label="Terminal: deploy com papel de desenvolvedor full stack, desde 2006"
          >
            <span
              ref={terminalRef}
              aria-hidden="true"
              className="inline-block"
              style={{ clipPath: 'inset(0 100% 0 0)', willChange: 'clip-path' }}
            >
              <span style={{ color: 'var(--color-accent)' }}>$&nbsp;</span>
              ~/juliano340 <span style={{ color: 'var(--color-muted)' }}>deploy</span> --role=<span style={{ color: 'var(--color-text)' }}>full-stack</span> --since=<span style={{ color: 'var(--color-text)' }}>2006</span>
            </span>
          </p>

          <p
            className="ds-body-lg mt-4 max-w-[22rem] text-primary/80 lg:mt-6 lg:max-w-xl lg:text-muted"
            style={{ animation: 'fadeIn 0.8s var(--motion-ease-cinematic) 0.55s both' }}
          >
            <span className="lg:hidden">Transformo ideias em produtos digitais, com código e qualidade.</span>
            <span className="hidden lg:inline">Tiro ideias do papel com código que sobrevive à produção — Next.js, TypeScript
            e o olhar de QA que aprendi dentro de ERPs e sistemas críticos.</span>
          </p>

          <div className="mt-6 flex flex-col gap-2 lg:mt-8 lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-7 lg:gap-y-3" style={{ animation: 'fadeIn 0.8s var(--motion-ease-cinematic) 0.75s both' }}>
            <a href="#portfolio" className={`${HOME_BUTTON} group`}>
              Ver projetos
              <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
            <div className="flex items-center justify-start gap-7">
              <Link href="/contato" legacyBehavior><a className={HOME_LINK}>Fale comigo</a></Link>
              <Link href="/sobre" legacyBehavior><a className={HOME_LINK}>Currículo</a></Link>
            </div>
          </div>

          {/* Ficha em mono — o dado frio que dá contexto */}
          <dl
            className="mt-10 hidden flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--color-muted)] lg:flex lg:text-[var(--color-dim)]"
            style={{ animation: 'fadeIn 1s var(--motion-ease-cinematic) 0.95s both' }}
          >
            {FICHA.map(({ label, live }) => (
              <div key={label} className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={live ? 'inline-block h-1.5 w-1.5 shrink-0 rounded-full' : 'inline-block h-px w-3 shrink-0'}
                  style={{ background: live ? 'var(--color-accent)' : 'var(--color-border)' }}
                />
                <dd>{label}</dd>
              </div>
            ))}
          </dl>
          </div>
        </div>
      </div>

      {/* ── Stepper do pin: 3 marcos, cada um enche na sua faixa ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex flex-col items-center gap-3"
        style={{
          opacity: pinProgress === null ? 0 : 1,
          transition: 'opacity 300ms var(--motion-ease-cinematic)',
        }}
      >
        <span
          className="font-mono text-[0.65rem] uppercase tracking-[0.2em]"
          style={{ color: 'var(--color-dim)', opacity: Math.max(0, 1 - (pinProgress || 0) * 3) }}
        >
          role para avançar
        </span>
        <span className="flex items-center gap-1.5">
          {Array.from({ length: STEP_MARKS }, (_, i) => {
            const local = clamp01(((pinProgress || 0) - i / STEP_MARKS) * STEP_MARKS);
            return (
              <span
                key={i}
                className="block h-[2px] w-12 overflow-hidden rounded-full"
                style={{ background: 'var(--color-border)' }}
              >
                <span
                  className="block h-full rounded-full"
                  style={{
                    width: `${local * 100}%`,
                    background: 'var(--color-accent)',
                    transition: 'width 120ms linear',
                  }}
                />
              </span>
            );
          })}
        </span>
      </div>
    </section>
  );
};

export default HeroSectionView;
