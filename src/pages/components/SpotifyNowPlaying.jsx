import { useEffect, useState } from 'react';
import SmartImage from '@/pages/components/SmartImage';
import useNowPlaying from '@/lib/useNowPlaying';

// "Ouvindo agora" flutuante: aparece só quando há música tocando de verdade,
// fica acima do botão de voltar ao topo e se recolhe quando o rodapé entra em
// cena (lá o player do Spotify já está à vista). Clicar abre a faixa.
const SpotifyNowPlaying = () => {
  const { track } = useNowPlaying();
  const [dismissed, setDismissed] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return undefined;
    const observer = new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting), { threshold: 0 });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  if (dismissed || footerVisible || !track?.isPlaying) return null;

  const progress = track.durationMs > 0
    ? Math.min(100, Math.max(0, (track.progressMs / track.durationMs) * 100))
    : 0;

  return (
    <div className="fixed bottom-[5.5rem] right-4 z-[60] hidden sm:block">
      <div
        className="relative flex items-center gap-3 py-2 pl-2 pr-11"
        style={{
          background: 'var(--color-surface-raised)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-pill)',
          boxShadow: 'var(--shadow-lift)',
        }}
      >
        <a
          href={track.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mono-focus-ring flex items-center gap-3"
          style={{ borderRadius: 'var(--radius-pill)' }}
          aria-label={`Ouvindo agora: ${track.title}, ${track.artist}. Abrir no Spotify (nova aba)`}
        >
          {track.cover ? (
            <SmartImage
              src={track.cover}
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 object-cover"
              style={{ borderRadius: 'var(--radius-sm)' }}
            />
          ) : null}
          <span className="w-[10rem] shrink-0">
            <span className="block truncate text-xs font-bold" style={{ color: 'var(--color-text)' }}>{track.title}</span>
            <span className="block truncate text-[0.7rem]" style={{ color: 'var(--color-muted)' }}>{track.artist}</span>
          </span>
          <span className="eq" aria-hidden="true"><span /><span /><span /></span>
        </a>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="mono-focus-ring absolute right-2 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center transition-colors duration-200 hover:text-primary"
          style={{ color: 'var(--color-muted)', borderRadius: 'var(--radius-full)' }}
          aria-label="Ocultar widget de música"
        >
          <svg viewBox="0 0 16 16" className="h-3 w-3 fill-none stroke-current" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>

        <span
          aria-hidden="true"
          className="absolute inset-x-4 bottom-1 h-px overflow-hidden"
          style={{ background: 'var(--color-border)', borderRadius: 'var(--radius-full)' }}
        >
          <span className="block h-full" style={{ width: `${progress}%`, background: 'var(--color-accent)' }} />
        </span>
      </div>
    </div>
  );
};

export default SpotifyNowPlaying;
