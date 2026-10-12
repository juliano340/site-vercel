import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';
import SmartImage from '@/pages/components/SmartImage';
import Reveal from '@/pages/components/Reveal';
import SectionHeader from '@/pages/components/SectionHeader';
import { HOME_CONTAINER } from '@/lib/homePresentation';

// Versão resumida e profissional da trajetória (detalhes completos em /sobre).
const TIMELINE = [
  {
    period: 'Jun 2026 — Atual',
    role: 'Técnico de Suporte N1',
    company: 'InterOp · TJRS',
    highlight: 'Atendimento e diagnóstico em sistemas judiciais.',
    current: true,
  },
  {
    period: 'Ago 2025 — Dez 2025',
    role: 'Analista de Suporte',
    company: 'LWSA · Bling ERP',
    highlight: 'Integrações com marketplaces e APIs REST.',
  },
  {
    period: 'Dez 2022 — Jun 2025',
    role: 'Suporte → QA → Full Stack',
    company: 'Dataweb Tecnologia',
    highlight: 'Evolução interna até dev full stack no ERP (.NET / Angular).',
  },
  {
    period: 'Set 2022 — Dez 2022',
    role: 'Programador Web',
    company: 'Agexcom · Unisinos',
    highlight: 'Hotsites e blogs em WordPress.',
  },
  {
    period: '2006 — 2020',
    role: 'Operador → Analista de Suporte',
    company: 'Sicredi · Atento',
    highlight: '14 anos de evolução: suporte a sistemas críticos e automação.',
  },
];

const FORMACAO = [
  { period: '2026', name: 'Eng. de Qualidade e Teste de Software', place: 'PUC Minas' },
  { period: '2025', name: 'Sistemas para Internet', place: 'Unisinos' },
  { period: '2019', name: 'MBA Gestão Empresarial e Marketing', place: 'Uninter' },
];

// Momento editorial: galeria deslizável com a foto de capa e as demais
// passando ao lado (swipe no mobile, chevrons no desktop).
// Scrim e legenda ficam fixos — a foto desliza por baixo.
const GALLERY = [
  {
    src: '/images/workspace-topdown.jpg',
    alt: 'Juliano visto de cima, sentado numa poltrona de couro com notebook, caderno e café num estúdio amplo e claro',
    position: '[object-position:70%_44%] sm:[object-position:66%_46%]',
  },
  {
    src: '/images/40b7ebcb-5ac8-47df-9f4f-228afe7d698c.png',
    alt: 'Retrato profissional de Juliano de camisa verde, sorrindo para a câmera num escritório claro',
    position: '[object-position:50%_40%] sm:[object-position:50%_42%]',
  },
  {
    src: '/images/ens-2.jpg',
    alt: 'Juliano trabalhando com o notebook no colo, num salão industrial com janelas grandes',
    position: '[object-position:54%_70%] sm:[object-position:56%_72%]',
  },
  {
    src: '/images/ens-1.png',
    alt: 'Juliano sorrindo enquanto trabalha no notebook, escritório claro',
    position: '[object-position:60%_42%] sm:[object-position:58%_42%]',
  },
];

const Chevron = ({ direction }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
    {direction === 'prev' ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 6l6 6-6 6" />}
  </svg>
);

const WorkspacePortrait = () => {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);

  const goTo = useCallback((next) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(GALLERY.length - 1, next));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollTo({ left: clamped * track.clientWidth, behavior: reduced ? 'auto' : 'smooth' });
  }, []);

  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const current = Math.round(track.scrollLeft / track.clientWidth);
    setIndex((prev) => (prev === current ? prev : current));
  }, []);

  return (
    <Reveal variant="blur" className="mb-16">
      <figure
        className="group relative overflow-hidden"
        style={{
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: 'var(--shadow-lift)',
        }}
      >
        <div className="relative aspect-[1/1] sm:aspect-[16/10]" style={{ background: 'var(--color-surface-1, #181818)' }}>
          {/* Trilho deslizável */}
          <div
            ref={trackRef}
            onScroll={handleScroll}
            tabIndex={0}
            role="group"
            aria-label="Galeria de fotos: deslize ou use as setas do teclado"
            className="no-scrollbar absolute inset-0 flex snap-x snap-mandatory overflow-x-auto"
          >
            {GALLERY.map((photo, i) => (
              <div key={photo.src} className="relative h-full w-full shrink-0 snap-center">
                <SmartImage
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 90vw, 1152px"
                  quality={85}
                  priority={i === 0}
                  className={`${photo.fit || 'object-cover'} ${photo.position}`}
                />
              </div>
            ))}
          </div>

          {/* Vinheta nas bordas + gradiente de leitura (fixos sobre o trilho) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(105deg, rgba(18,18,18,0.72) 0%, rgba(18,18,18,0.25) 42%, rgba(18,18,18,0) 62%), radial-gradient(120% 90% at 50% 45%, transparent 62%, rgba(0,0,0,0.38) 100%)',
            }}
          />

          <figcaption className="pointer-events-none absolute bottom-5 left-5 max-w-[16rem] sm:bottom-auto sm:left-8 sm:top-8 sm:max-w-md">
            <p className="ds-label mb-2" style={{ color: 'var(--color-accent)' }}>2006 → hoje</p>
            <p className="text-xl font-bold leading-snug text-primary sm:text-3xl" style={{ textShadow: '0 1px 24px rgba(0,0,0,0.55)' }}>
              Do primeiro chamado<br />ao deploy.
            </p>
          </figcaption>

          {/* Chevrons (desktop): aparecem no hover */}
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Foto anterior"
            disabled={index === 0}
            className="mono-focus-ring absolute left-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100 disabled:pointer-events-none disabled:opacity-0 lg:flex"
            style={{ background: 'rgba(18,18,18,0.55)', backdropFilter: 'blur(6px)' }}
          >
            <Chevron direction="prev" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Próxima foto"
            disabled={index === GALLERY.length - 1}
            className="mono-focus-ring absolute right-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100 disabled:pointer-events-none disabled:opacity-0 lg:flex"
            style={{ background: 'rgba(18,18,18,0.55)', backdropFilter: 'blur(6px)' }}
          >
            <Chevron direction="next" />
          </button>

          {/* Pills indicadoras */}
          <div className="absolute bottom-5 right-5 flex items-center gap-2 sm:bottom-8 sm:right-8" role="group" aria-label="Selecionar foto">
            {GALLERY.map((photo, i) => (
              <button
                key={photo.src}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Foto ${i + 1} de ${GALLERY.length}`}
                aria-current={i === index}
                className="mono-focus-ring h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === index ? 18 : 6,
                  background: i === index ? 'var(--color-accent)' : 'rgba(255,255,255,0.45)',
                }}
              />
            ))}
          </div>
        </div>
      </figure>
    </Reveal>
  );
};

const ExperienceTimeline = () => (
  <section id="percurso" aria-labelledby="percurso-title" className="py-20 text-primary sm:py-24" style={{ background: 'var(--color-background-deep)' }}>
    <div className={HOME_CONTAINER}>
      <SectionHeader
        number="03"
        label="Percurso"
        title="Experiência & formação"
        description="Quase 20 anos entre suporte, QA e desenvolvimento — uma trajetória de evolução constante."
      />

      <WorkspacePortrait />

      <div className="grid gap-14 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,1fr)] lg:gap-20">
        {/* Linha do tempo profissional */}
        <ol id="percurso-title" aria-label="Experiência profissional" className="relative ml-3 border-l" style={{ borderColor: 'var(--color-border)' }}>
          {TIMELINE.map((job, i) => (
            <li key={`${job.company}-${job.period}`} className="relative pb-10 last:pb-0 pl-8 sm:pl-10">
              <span
                aria-hidden="true"
                className="absolute -left-[7px] top-1 h-3.5 w-3.5 rounded-full"
                style={{
                  background: job.current ? 'var(--color-accent)' : 'var(--color-surface-raised)',
                  boxShadow: job.current
                    ? '0 0 0 4px rgba(var(--accent-rgb), 0.15), 0 0 12px rgba(var(--accent-rgb), 0.5)'
                    : '0 0 0 3px var(--color-background-deep)',
                }}
              />
              <Reveal delay={i * 0.06}>
                <p className="text-xs font-bold uppercase tracking-[0.07em] text-muted">{job.period}</p>
                <h3 className="mt-1 text-lg font-semibold text-primary">{job.role}</h3>
                <p className="text-sm" style={{ color: job.current ? 'var(--color-accent)' : 'var(--color-muted)' }}>
                  {job.company}
                </p>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{job.highlight}</p>
              </Reveal>
            </li>
          ))}
        </ol>

        {/* Formação */}
        <div>
          <Reveal variant="right">
            <h3 className="ds-h3 mb-8 text-primary">Formação</h3>
            <ol className="space-y-6">
              {FORMACAO.map((fc, i) => (
                <li key={fc.name} className="mono-card-interactive block p-4">
                  <Reveal delay={i * 0.08} variant="right">
                    <p className="font-mono text-xs" style={{ color: 'var(--color-accent)' }}>{fc.period}</p>
                    <p className="mt-1 font-semibold text-primary">{fc.name}</p>
                    <p className="text-sm text-muted">{fc.place}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={0.2} variant="right" className="mt-10">
            <Link href="/sobre" legacyBehavior>
              <a className="mono-focus-ring inline-flex min-h-11 items-center gap-2 text-sm font-bold hover:underline underline-offset-4">
                Trajetória completa →
              </a>
            </Link>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);

export default ExperienceTimeline;
