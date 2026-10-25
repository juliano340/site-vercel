import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
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
const PIN_PARALLAX = 120; // percurso máximo; limitado pelo espaço até o topo
const PIN_PARALLAX_REDUCED = 72;
const PIN_TOP_GAP = 24;
const TERMINAL_IN = [0.68, 0.9]; // escrita acompanha a apresentação final
const STEP_MARKS = 3; // marcos do stepper (a barra vira 3 segmentos)
const STORY_TRAVEL = 48;
const FINAL_START = 0.62;
const FINAL_STAGGER = 0.035;
const REVEAL_SPAN = 0.14;
const STORY_SCENES = [
  { label: '01 / O próximo passo', from: 0, to: 0.3, lines: ['Toda grande ideia', 'começa com um', 'próximo passo.'], caption: 'Um produto digital que merece sair do papel.' },
  { label: '02 / Da ideia à entrega', from: 0.3, to: 0.66, lines: ['Do papel.', 'Para o mundo.'], caption: 'Código, experiência e qualidade em cada entrega.' },
];

const clamp01 = (value) => Math.min(1, Math.max(0, value));
const ramp = (value, from, to) => clamp01((value - from) / (to - from));

const HeroSectionView = () => {
  const pinRef = useRef(null);
  const storyRefs = useRef([]);
  const terminalRef = useRef(null);
  const pinTravelRef = useRef(0);
  const currentProgressRef = useRef(0);
  const [pinProgress, setPinProgress] = useState(null);
  const [scrubAvailable, setScrubAvailable] = useState(null);
  const [storySkipped, setStorySkipped] = useState(false);
  const storyActive = scrubAvailable !== false && !storySkipped;

  // Progresso do pin → DOM direto (sem re-render por evento de roda):
  // parallax do conteúdo e terminal que se escreve.
  const applyPinProgress = useCallback((value, measure = false) => {
    currentProgressRef.current = value;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const narrative = storyActive && window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)').matches;
    const travel = reduced ? 0 : STORY_TRAVEL;
    storyRefs.current.forEach((scene, index) => {
      if (!scene) return;
      const { from, to } = STORY_SCENES[index];
      const enter = index === 0 ? 1 : ramp(value, from, from + REVEAL_SPAN);
      const exit = ramp(value, to - REVEAL_SPAN, to);
      scene.style.opacity = `${narrative ? enter * (1 - exit) : 0}`;
      scene.style.transform = `translate3d(0, calc(-50% + ${travel * (1 - enter - exit)}px), 0)`;
    });
    const pin = pinRef.current;
    if (pin) {
      if (measure || value === 0) {
        const contentTop = pin.parentElement.getBoundingClientRect().top + pin.offsetTop;
        const heroTop = pin.closest('section').getBoundingClientRect().top;
        const maxTravel = reduced
          ? PIN_PARALLAX_REDUCED : PIN_PARALLAX;
        pinTravelRef.current = Math.min(maxTravel, Math.max(0, contentTop - heroTop - PIN_TOP_GAP));
      }
      const finalProgress = narrative ? ramp(value, FINAL_START, 1) : 0;
      pin.style.transform = `translate3d(0, ${(-pinTravelRef.current * finalProgress).toFixed(1)}px, 0)`;
      pin.inert = narrative && value < FINAL_START + FINAL_STAGGER * 4;
      pin.querySelectorAll('[data-hero-reveal]').forEach((group, index) => {
        const enter = narrative ? ramp(value, FINAL_START + index * FINAL_STAGGER, FINAL_START + index * FINAL_STAGGER + REVEAL_SPAN) : 1;
        group.style.opacity = `${enter}`;
        group.style.transform = `translate3d(0, ${travel * (1 - enter)}px, 0)`;
      });
    }

    const terminal = terminalRef.current;
    if (terminal) {
      const written = narrative ? ramp(value, TERMINAL_IN[0], TERMINAL_IN[1]) : 1;
      terminal.style.clipPath = `inset(0 ${((1 - written) * 100).toFixed(2)}% 0 0)`;
    }
  }, [storyActive]);

  useEffect(() => {
    applyPinProgress(currentProgressRef.current, true);
    const onResize = () => applyPinProgress(currentProgressRef.current, true);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, [applyPinProgress]);

  // Progresso do "pin" do vídeo (0..1) ou null quando liberado.
  // Throttle por delta pra não re-renderizar a cada pixel de rolagem.
  const handlePinProgress = useCallback((value) => {
    if (value !== null) applyPinProgress(value);
    setPinProgress((prev) => {
      if (value === null) return prev;
      if (prev !== null && Math.abs(value - prev) < 0.02 && value < 1) return prev;
      return value;
    });
  }, [applyPinProgress]);

  useEffect(() => {
    if (!storyActive) return undefined;
    const onScroll = () => {
      if (window.scrollY > 4 && currentProgressRef.current < 0.95) setStorySkipped(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [storyActive]);

  return (
    <section aria-labelledby="home-title" className="relative flex flex-col bg-background text-primary [--hero-media-height:clamp(14rem,42svh,24rem)] lg:min-h-[calc(100vh-5rem)] lg:justify-center lg:overflow-hidden">
      <noscript><style>{'[data-hero-final] { visibility: visible !important; } [data-hero-story] { display: none !important; }'}</style></noscript>
      {/* ── Vídeo: scrub no desktop, autoplay uma vez no mobile (scrim embutido) ── */}
      <HeroVideoBackdrop onPinProgress={handlePinProgress} onScrubAvailable={setScrubAvailable} scrubEnabled={!storySkipped} />

      {storyActive && (
        <div data-hero-story className="pointer-events-none absolute inset-0 z-20 hidden items-center lg:[@media(hover:hover)_and_(pointer:fine)]:flex">
          <div className={`${HOME_CONTAINER} relative`}>
            {STORY_SCENES.map((scene, index) => (
              <div key={scene.label} ref={(element) => { storyRefs.current[index] = element; }} aria-hidden="true" className="absolute inset-x-8 top-1/2 max-w-2xl" style={{ opacity: index === 0 ? 1 : 0, transform: 'translate3d(0, -50%, 0)' }}>
                <p className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-muted"><span className="h-1.5 w-1.5 rounded-full bg-accent" />{scene.label}</p>
                <p className="ds-display" style={{ fontSize: index === 0 ? 'clamp(2.8rem,4.5vw,4rem)' : 'clamp(3.4rem,6vw,5.5rem)', lineHeight: 1.04, letterSpacing: '-0.035em' }}>
                  {scene.lines.map((line) => <span key={line} className="block">{line}</span>)}
                </p>
                <p className="mt-6 max-w-sm text-base text-muted">{scene.caption}</p>
                {index === 0 && (
                  <div className="mt-8 inline-flex items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-primary/80">
                    <svg viewBox="0 0 24 36" fill="none" className="h-9 w-6 text-accent"><rect x="1" y="1" width="22" height="34" rx="11" stroke="currentColor" /><path d="M12 8v12m-4-4 4 4 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    Role para iniciar <span className="text-muted">↓</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Conteúdo: no mobile sobe sobre o degradê do vídeo ──── */}
      <div data-hero-final className={`${HOME_CONTAINER} pointer-events-none relative z-20 -mt-14 pb-10 lg:pointer-events-auto lg:mt-0 lg:py-20 ${scrubAvailable === null && !storySkipped ? 'lg:[@media(hover:hover)_and_(pointer:fine)]:invisible' : ''}`}>
        <div ref={pinRef} className="pointer-events-auto" style={{ willChange: 'transform' }}>
          <div>
          <p className="mb-4 flex items-center gap-2 text-xs font-medium text-primary/80 lg:hidden">
            <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            Disponível <span aria-hidden="true" className="text-muted">·</span> Porto Alegre
          </p>
          <p
            data-hero-reveal
            className="ds-label mb-6 hidden items-center gap-3 lg:flex"
            style={{ animation: !scrubAvailable && !storySkipped ? 'fadeIn 0.8s var(--motion-ease-cinematic) 0.05s both' : undefined }}
          >
            <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: 'var(--color-accent)' }} />
            Porto Alegre, Brasil
          </p>

          <h1
            id="home-title"
            tabIndex={-1}
            data-hero-reveal
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
            data-hero-reveal
            className="mt-5 hidden font-mono text-xs text-[var(--color-muted)] sm:text-sm lg:flex lg:text-[var(--color-dim)]"
            style={{ animation: !scrubAvailable && !storySkipped ? 'fadeIn 0.8s var(--motion-ease-cinematic) 0.45s both' : undefined }}
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
            data-hero-reveal
            className="ds-body-lg mt-4 max-w-[22rem] text-primary/80 lg:mt-6 lg:max-w-xl lg:text-muted"
            style={{ animation: !scrubAvailable && !storySkipped ? 'fadeIn 0.8s var(--motion-ease-cinematic) 0.55s both' : undefined }}
          >
            <span className="lg:hidden">Transformo ideias em produtos digitais, com código e qualidade.</span>
            <span className="hidden lg:inline">Tiro ideias do papel com código que sobrevive à produção — Next.js, TypeScript
            e o olhar de QA que aprendi dentro de ERPs e sistemas críticos.</span>
          </p>

          <div data-hero-reveal className="mt-6 flex flex-col gap-3 lg:mt-8 lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-7 lg:gap-y-3" style={{ animation: !scrubAvailable && !storySkipped ? 'fadeIn 0.8s var(--motion-ease-cinematic) 0.75s both' : undefined }}>
            <a href="#portfolio" className={`${HOME_BUTTON} group`}>
              Ver projetos
              <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
            <div className="grid grid-cols-2 gap-3 lg:flex lg:items-center lg:gap-7">
              <Link href="/contato" legacyBehavior><a className={`${HOME_LINK} justify-center rounded-full border border-subtle px-4 text-primary/80 [touch-action:manipulation] active:bg-surface lg:justify-start lg:rounded-none lg:border-0 lg:px-0 lg:text-primary`}>Fale comigo</a></Link>
              <Link href="/sobre" legacyBehavior><a className={`${HOME_LINK} justify-center rounded-full border border-subtle px-4 text-primary/80 [touch-action:manipulation] active:bg-surface lg:justify-start lg:rounded-none lg:border-0 lg:px-0 lg:text-primary`}>Currículo</a></Link>
            </div>
          </div>

          {/* Ficha em mono — o dado frio que dá contexto */}
          <dl
            data-hero-reveal
            className="mt-10 hidden flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--color-muted)] lg:flex lg:text-[var(--color-dim)]"
            style={{ animation: !scrubAvailable && !storySkipped ? 'fadeIn 1s var(--motion-ease-cinematic) 0.95s both' : undefined }}
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
        data-hero-story
        className="pointer-events-none absolute inset-x-0 bottom-4 z-20 hidden flex-col items-center gap-3 lg:[@media(hover:hover)_and_(pointer:fine)]:flex"
        style={{
          opacity: storyActive || pinProgress !== null ? 1 : 0,
          transition: 'opacity 300ms var(--motion-ease-cinematic)',
        }}
      >
        <span
          className="font-mono text-[0.65rem] uppercase tracking-[0.2em]"
          style={{ color: 'var(--color-muted)', opacity: Math.max(0, 1 - (pinProgress || 0) * 3) }}
        >
          <span aria-hidden="true" className="mr-3 inline-block rounded border border-white/25 px-2 py-1 text-accent">↓</span>role para avançar
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
