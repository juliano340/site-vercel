import { useState } from 'react';
import { SPOTIFY_EMBED_URL, SPOTIFY_PLAYLIST_NAME, SPOTIFY_PLAYLIST_URL } from '@/lib/spotifyPlaylist';

// Card "Trilha sonora" do rodapé.
//
// O iframe do Spotify não é renderizado no primeiro load: até o visitante
// clicar, nada de terceiro (cookies, JS, ~1 MB de player) é baixado. É o mesmo
// princípio do "Ver vídeo" do hero e resolve a parte de LGPD sem depender do
// banner de consentimento.
const SpotifyGlyph = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.586 14.424a.75.75 0 0 1-1.032.247c-2.824-1.723-6.38-2.113-10.567-1.157a.75.75 0 1 1-.334-1.463c4.593-1.049 8.523-.6 11.686 1.34a.75.75 0 0 1 .247 1.033Zm1.223-2.723a.937.937 0 0 1-1.29.308c-3.232-1.986-8.161-2.561-11.985-1.4a.938.938 0 0 1-.544-1.795c4.37-1.325 9.796-.686 13.51 1.597a.937.937 0 0 1 .309 1.29Zm.106-2.871C14.171 8.549 8.164 8.35 5.051 9.295a1.125 1.125 0 1 1-.653-2.153c3.573-1.085 10.207-.85 14.235 1.541a1.125 1.125 0 1 1-1.143 1.947Z" />
  </svg>
);

const SpotifyCard = () => {
  const [loaded, setLoaded] = useState(false);

  if (!SPOTIFY_EMBED_URL) return null;

  return (
    <section aria-labelledby="spotify-title" className="mb-10">
      <div
        className="grid gap-6 p-6 sm:grid-cols-[1fr_minmax(0,22rem)] sm:items-center"
        style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}
      >
        <div>
          <p
            className="mb-3 flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.16em]"
            style={{ color: 'var(--color-muted)' }}
          >
            <SpotifyGlyph className="h-3.5 w-3.5 text-accent" />
            Trilha sonora
          </p>
          <h3
            id="spotify-title"
            className="text-lg font-bold tracking-[-0.01em]"
            style={{ color: 'var(--color-text)' }}
          >
            {SPOTIFY_PLAYLIST_NAME}
          </h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>
            A playlist que roda enquanto eu escrevo código. O player só carrega quando você pede — nada do Spotify
            é baixado antes disso.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-5">
            {!loaded && (
              <button type="button" onClick={() => setLoaded(true)} className="mono-button-primary text-xs">
                Ouvir aqui
              </button>
            )}
            <a
              href={SPOTIFY_PLAYLIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mono-focus-ring inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] transition-colors duration-300 hover:text-primary"
              style={{ color: 'var(--color-muted)' }}
            >
              Abrir no Spotify
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--color-surface-alt)' }}>
          {loaded ? (
            <iframe
              src={SPOTIFY_EMBED_URL}
              title={`Playlist ${SPOTIFY_PLAYLIST_NAME} no Spotify`}
              width="100%"
              height="152"
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              style={{ border: 0, display: 'block', borderRadius: 'inherit' }}
            />
          ) : (
            <button
              type="button"
              onClick={() => setLoaded(true)}
              className="mono-focus-ring group flex h-[152px] w-full flex-col items-center justify-center gap-2 transition-colors duration-300"
              style={{ color: 'var(--color-muted)' }}
            >
              <SpotifyGlyph className="h-7 w-7 transition-transform duration-300 group-hover:scale-110" />
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em]">Carregar player</span>
              <span className="text-[0.65rem]">O iframe do Spotify entra só agora</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default SpotifyCard;
