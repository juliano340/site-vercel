import { useEffect, useState } from 'react';

const POLL_MS = 60_000;

// Estado do "ouvindo agora": busca uma vez, repete a cada minuto e pausa o
// polling quando a aba está oculta (nada de gastar request à toa).
const useNowPlaying = ({ enabled = true } = {}) => {
  const [state, setState] = useState({ configured: null, track: null });

  useEffect(() => {
    if (!enabled) return undefined;

    let cancelled = false;
    let timer = 0;

    const load = async () => {
      try {
        const response = await fetch('/api/spotify/now-playing', { cache: 'no-store' });
        if (!response.ok) throw new Error(String(response.status));
        const data = await response.json();
        if (!cancelled) setState({ configured: data.configured !== false, track: data.track ?? null });
      } catch {
        if (!cancelled) setState({ configured: false, track: null });
      }
    };

    const schedule = () => {
      window.clearTimeout(timer);
      if (document.hidden) return;
      timer = window.setTimeout(async () => {
        await load();
        schedule();
      }, POLL_MS);
    };

    const onVisibility = () => {
      window.clearTimeout(timer);
      timer = 0;
      if (document.hidden) return;
      load();
      schedule();
    };

    load().then(schedule);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [enabled]);

  return state;
};

export default useNowPlaying;
