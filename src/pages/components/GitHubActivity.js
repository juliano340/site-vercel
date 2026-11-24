import { useEffect, useState } from 'react';

import Reveal from '@/pages/components/Reveal';
import SectionHeader from '@/pages/components/SectionHeader';
import { HOME_CONTAINER } from '@/lib/homePresentation';

const GITHUB_PROFILE = 'https://github.com/juliano340';
const profileUrl = (username) => (username ? `https://github.com/${username}` : GITHUB_PROFILE);

// Cinco níveis de intensidade na cor de acento do site — nada das cores
// cruas do GitHub, que não pertencem à paleta.
const LEVEL_COLORS = [
  'rgba(255,255,255,0.07)',
  'rgba(var(--accent-rgb), 0.22)',
  'rgba(var(--accent-rgb), 0.42)',
  'rgba(var(--accent-rgb), 0.68)',
  'var(--color-accent)',
];

const levelFor = (count) => {
  if (!count || count <= 0) return 0;
  if (count < 3) return 1;
  if (count < 6) return 2;
  if (count < 10) return 3;
  return 4;
};

const numberFormatter = new Intl.NumberFormat('pt-BR');

const formatNumber = (value) => (typeof value === 'number' ? numberFormatter.format(value) : '—');

const formatDay = (iso) => {
  if (!iso) return '';
  const date = new Date(`${iso}T00:00:00`);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('pt-BR');
};

const Stat = ({ label, value }) => (
  <li className="lg:flex lg:items-baseline lg:justify-between lg:gap-3 lg:border-b lg:border-white/10 lg:py-2 lg:first:pt-0 lg:last:border-0 lg:last:pb-0">
    <p className="font-mono text-2xl font-bold leading-none text-primary sm:text-3xl lg:text-2xl">
      {formatNumber(value)}
    </p>
    <p className="mt-2 text-[0.65rem] font-bold uppercase leading-tight tracking-[0.07em] text-muted lg:mt-0 lg:max-w-[6rem] lg:text-right">
      {label}
    </p>
  </li>
);

const GitHubIcon = ({ className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden="true">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.42 7.42 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
  </svg>
);

const Heatmap = ({ calendar }) => {
  const total = calendar?.totalContributions || 0;
  const weeks = Array.isArray(calendar?.weeks) ? calendar.weeks : [];

  return (
    <div className="min-w-0">
      <div
        role="img"
        tabIndex={0}
        aria-label={`Mapa de contribuições no GitHub nos últimos 12 meses: ${total} contribuições no total.`}
        className="mono-focus-ring no-scrollbar w-full min-w-0 overflow-x-auto pb-1"
      >
        <div
          aria-hidden="true"
          className="grid w-max"
          style={{
            gridAutoFlow: 'column',
            gridTemplateRows: 'repeat(7, 13px)',
            gridAutoColumns: '13px',
            gap: '3px',
          }}
        >
          {weeks.flatMap((week, weekIndex) => {
            const days = [...(week?.days || [])].slice(0, 7);
            while (days.length < 7) days.push(null);

            return days.map((day, dayIndex) => (
              <span
                key={`${weekIndex}-${dayIndex}`}
                title={day ? `${day.count} contribuições em ${formatDay(day.date)}` : undefined}
                style={{
                  width: 13,
                  height: 13,
                  borderRadius: 2,
                  background: LEVEL_COLORS[levelFor(day?.count)],
                }}
              />
            ));
          })}
        </div>
      </div>
      <p className="sr-only">{total} contribuições nos últimos 12 meses.</p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs text-muted">
        <p>{formatNumber(total)} contribuições nos últimos 12 meses</p>
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span>Menos</span>
          {LEVEL_COLORS.map((color) => (
            <span
              key={color}
              className="inline-block h-2.5 w-2.5 rounded-[2px]"
              style={{ background: color }}
            />
          ))}
          <span>Mais</span>
        </div>
      </div>
    </div>
  );
};

const Skeleton = () => (
  <div aria-hidden="true" className="p-4 sm:p-5">
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[13.5rem_minmax(0,1fr)]">
      <div className="grid min-w-0 grid-cols-3 gap-3 border-b border-white/10 pb-4 lg:flex lg:flex-col lg:justify-between lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
        {[0, 1, 2].map((item) => (
          <div key={item} className="lg:flex lg:items-center lg:justify-between lg:gap-3 lg:border-b lg:border-white/10 lg:py-2 lg:last:border-0">
            <div className="h-8 w-16 rounded-sm bg-white/[0.06] motion-safe:animate-pulse" />
            <div className="mt-2 h-3 w-24 max-w-full rounded-sm bg-white/[0.04] motion-safe:animate-pulse lg:mt-0" />
          </div>
        ))}
      </div>

      <div className="min-w-0">
        <div className="h-[109px] w-full max-w-[845px] rounded-sm bg-white/[0.05] motion-safe:animate-pulse" />
        <div className="mt-4 h-3 w-52 max-w-full rounded-sm bg-white/[0.04] motion-safe:animate-pulse" />
      </div>
    </div>
  </div>
);

const GitHubActivity = () => {
  const [status, setStatus] = useState('loading');
  const [data, setData] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch('/api/github', { signal: controller.signal });
        if (!response.ok) throw new Error(String(response.status));
        const payload = await response.json();
        if (cancelled) return;
        setData(payload);
        setStatus('ready');
      } catch {
        if (!cancelled) setStatus('error');
      }
    };

    load();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const calendar = data?.calendar || null;
  const hasCalendar = Boolean(calendar && Array.isArray(calendar.weeks) && calendar.weeks.length);
  const stats = data?.stats || {};
  const githubProfile = profileUrl(data?.username);

  return (
    <section
      id="github"
      aria-label="Atividade recente no GitHub"
      className="scroll-mt-6 py-20 text-primary sm:py-24"
      style={{ background: 'var(--color-surface)' }}
    >
      <div className={HOME_CONTAINER}>
        <div className="mb-12 flex items-start justify-between gap-8">
          <SectionHeader
            number="03"
            label="GitHub"
            title="Atividade recente"
            description="O ritmo de código dos últimos 12 meses, direto do GitHub — consistência também conta a história."
            className="!mb-0"
          />
          <GitHubIcon className="mt-2 hidden h-24 w-24 shrink-0 text-white/[0.1] sm:block lg:h-32 lg:w-32" />
        </div>

        <Reveal variant="blur">
          <div
            className="w-full min-w-0 overflow-hidden border"
            style={{
              background: 'var(--color-surface-alt)',
              borderColor: 'var(--color-border)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            {status === 'loading' && (
              <>
                <p className="sr-only" role="status">
                  Carregando atividade do GitHub…
                </p>
                <Skeleton />
              </>
            )}

            {status === 'error' && (
              <div className="p-6 sm:p-7">
                <p className="ds-label" style={{ color: 'var(--color-accent)' }}>
                  GitHub indisponível
                </p>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
                  Não foi possível carregar a atividade agora. O restante da página segue normal — você
                  pode ver tudo direto no perfil.
                </p>
                <a
                  href={githubProfile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mono-focus-ring mono-button-secondary mt-5 min-h-11 px-5"
                >
                  <GitHubIcon />
                  Ver perfil no GitHub<span className="sr-only"> (nova aba)</span>
                </a>
              </div>
            )}

            {status === 'ready' && (
              <div className="p-4 sm:p-5">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[13.5rem_minmax(0,1fr)]">
                  <ul className="grid min-w-0 grid-cols-3 gap-3 border-b border-white/10 pb-4 lg:flex lg:flex-col lg:justify-between lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
                    <Stat label="Contribuições (12m)" value={stats.contributions} />
                    <Stat label="Repos públicos" value={stats.publicRepos} />
                    <Stat label="Seguidores" value={stats.followers} />
                  </ul>

                  <div className="min-w-0">
                    {hasCalendar ? (
                      <Heatmap calendar={calendar} />
                    ) : (
                      <div
                        className="p-4"
                        style={{
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--color-border)',
                          background: 'rgba(255,255,255,0.02)',
                        }}
                      >
                        <p className="ds-label" style={{ color: 'var(--color-accent)' }}>
                          Histórico no GitHub
                        </p>
                        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
                          Veja o mapa completo de contribuições direto no perfil.
                        </p>
                        <a
                          href={githubProfile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mono-focus-ring mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-primary underline-offset-4 hover:text-accent hover:underline"
                        >
                          Ver atividade no GitHub
                          <span className="sr-only"> (nova aba)</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div
                  className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t pt-4"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <p className="text-xs text-muted">Dados públicos, atualizados a cada hora.</p>
                  <a
                    href={githubProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mono-focus-ring mono-button-secondary min-h-10 px-4 text-xs"
                  >
                    <GitHubIcon />
                    Ver perfil<span className="sr-only"> no GitHub (nova aba)</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default GitHubActivity;
