import Link from 'next/link';
import { useRef } from 'react';
import SmartImage from '@/pages/components/SmartImage';
import Reveal from '@/pages/components/Reveal';
import SectionHeader from '@/pages/components/SectionHeader';
import useScrollProgress from '@/lib/useScrollProgress';
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
    period: 'Dez 2022 — Jun 2025',
    role: 'Suporte → QA → Full Stack',
    company: 'Dataweb Tecnologia',
    highlight: 'Evolução interna até dev full stack no ERP (.NET / Angular).',
  },
  {
    period: 'Ago 2025 — Dez 2025',
    role: 'Analista de Suporte',
    company: 'LWSA · Bling ERP',
    highlight: 'Integrações com marketplaces e APIs REST.',
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

// Momento editorial: retrato top-down como "palco" — o espaço negativo
// carrega a frase. Parallax leve no interior, vinheta para amarrar no fundo.
const WorkspacePortrait = () => {
  const innerRef = useRef(null);
  useScrollProgress((progress) => {
    const el = innerRef.current;
    if (!el) return;
    const drift = (Math.min(1, Math.max(0, progress)) - 0.5) * -36;
    el.style.transform = `translate3d(0, ${drift.toFixed(1)}px, 0) scale(1.06)`;
  });

  return (
    <Reveal variant="blur" className="mb-16">
      <figure
        className="relative aspect-[3/4] overflow-hidden sm:aspect-[16/10]"
        style={{
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: 'var(--shadow-lift)',
        }}
      >
        <div ref={innerRef} className="absolute inset-0" style={{ willChange: 'transform' }}>
          <SmartImage
            src="/images/workspace-topdown.jpg"
            alt="Juliano visto de cima, sentado com laptop, caderno e café num estúdio amplo e claro"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 90vw, 1152px"
            quality={85}
            className="object-cover [object-position:74%_58%] sm:[object-position:72%_62%]"
          />
        </div>

        {/* Vinheta nas bordas + gradiente de leitura no espaço vazio */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(105deg, rgba(18,18,18,0.72) 0%, rgba(18,18,18,0.25) 42%, rgba(18,18,18,0) 62%), radial-gradient(120% 90% at 50% 45%, transparent 62%, rgba(0,0,0,0.38) 100%)',
          }}
        />

        <figcaption className="absolute bottom-5 left-5 max-w-[16rem] sm:bottom-auto sm:left-8 sm:top-8 sm:max-w-md">
          <p className="ds-label mb-2" style={{ color: 'var(--color-accent)' }}>2006 → hoje</p>
          <p className="text-xl font-bold leading-snug text-primary sm:text-3xl" style={{ textShadow: '0 1px 24px rgba(0,0,0,0.55)' }}>
            Do primeiro chamado<br />ao deploy.
          </p>
        </figcaption>
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
