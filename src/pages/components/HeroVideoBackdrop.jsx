import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import usePinScrub from '@/lib/usePinScrub';

// Desktop: scrub pela roda. Mobile: autoplay silencioso, uma vez, com controles.
// Pôster como LCP; economia de dados mantém reprodução por toque no mobile.

const SRC_SCRUB = '/video/hero/hero-scrub-v2.mp4';
const SRC_ONCE = '/video/hero/hero-once-v2.mp4';
const POSTER = '/video/hero/hero-poster-v1.webp';

const FINE_POINTER_QUERY = '(min-width: 1024px) and (hover: hover) and (pointer: fine)';

// O percurso é calibrado por tempo, não por tamanho: 1 viewport de rolagem =
// ~2,3 s de vídeo. Percurso curto demais faz cada notch da roda valer 12+
// frames e o vídeo nunca "acompanha" a mão. Ao mudar a duração do clipe,
// recalibre: PIN_RATIO = duração / 2,3.
const PIN_RATIO = 2.25; // 5,2 s / 2,25 ≈ 2,3 s de vídeo por viewport
const SEEK_EASE = 0.1; // aproximação por frame até o alvo
const SEEK_EPSILON = 0.02; // segundos
const END_HOLD = 0.05; // não encosta no último frame (evita rewind no loop)
// Mesmo teto nos dois sentidos: voltar tem que gastar o mesmo esforço de
// rolagem que avançar, senão o vídeo "descola" da roda na subida.
const MAX_RATE = 2.4; // segundos de vídeo por segundo real, em ambos sentidos
// O pin só solta a página com o vídeo assentado no fim (tolerância abaixo).
const SETTLE_EPSILON = 0.08; // segundos
const SETTLE_TIMEOUT = 2000; // trava de segurança, em ms

const HeroVideoBackdrop = ({ onPinProgress, onScrubAvailable, scrubEnabled = true }) => {
  const videoRef = useRef(null);
  const [mode, setMode] = useState('poster'); // poster · scrub · manual · once
  const [visible, setVisible] = useState(false);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);

  const targetRef = useRef(0);
  const positionRef = useRef(0);
  const rafRef = useRef(0);
  const settleWaitRef = useRef(0);
  const pinnedRef = useRef(false);
  const progressCb = useRef(onPinProgress);
  progressCb.current = onPinProgress;

  useEffect(() => {
    if (mode === 'poster' && !failed) return;
    onScrubAvailable?.(mode === 'scrub' && !failed);
  }, [mode, failed, onScrubAvailable]);

  // ── Estratégia de mídia (só no cliente) ──────────────────────
  // O vídeo fica ativo por padrão; acompanha a troca entre mobile e desktop.
  useEffect(() => {
    const finePointer = window.matchMedia(FINE_POINTER_QUERY);
    const connection = navigator.connection || navigator.mozConnection || {};
    const updateMode = () => {
      const saveData = connection.saveData === true;
      const slowNetwork = typeof connection.effectiveType === 'string'
        && /(^|-)2g$/.test(connection.effectiveType);
      setVisible(false);
      setPlaying(false);
      setEnded(false);
      setFailed(false);
      targetRef.current = 0;
      positionRef.current = 0;
      pinnedRef.current = false;
      progressCb.current?.(0);
      progressCb.current?.(null);
      setMode(finePointer.matches ? 'scrub' : saveData || slowNetwork ? 'manual' : 'once');
    };
    updateMode();
    finePointer.addEventListener('change', updateMode);
    return () => finePointer.removeEventListener('change', updateMode);
  }, []);

  // ── Carregamento preguiçoso: nunca compete com o primeiro paint ──
  useEffect(() => {
    if (mode !== 'scrub' && mode !== 'once') return undefined;
    const video = videoRef.current;
    if (!video) return undefined;

    let cancelled = false;
    let idleId;
    let timeoutId;

    const start = () => {
      if (cancelled) return;
      if (mode === 'once' && video.getAttribute('src')) return;
      video.src = mode === 'scrub' ? SRC_SCRUB : SRC_ONCE;
      video.preload = 'auto';
      video.load();
      if (mode === 'once') {
        const rect = video.getBoundingClientRect();
        if (!document.hidden && rect.bottom > 0 && rect.top < window.innerHeight) {
          video.muted = true;
          video.play().catch(() => setPlaying(false));
        }
      }
    };

    const onReady = () => {
      if (cancelled) return;
      positionRef.current = video.currentTime || 0;
      setVisible(true);
    };
    video.addEventListener('loadeddata', onReady);

    const schedule = () => {
      if (window.requestIdleCallback) {
        idleId = window.requestIdleCallback(start, { timeout: 1500 });
      } else {
        timeoutId = window.setTimeout(start, 500);
      }
    };

    // Não espera imagens de outras seções nem scripts externos terminarem.
    schedule();

    return () => {
      cancelled = true;
      video.removeEventListener('loadeddata', onReady);
      if (idleId) window.cancelIdleCallback?.(idleId);
      if (timeoutId) window.clearTimeout(timeoutId);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, [mode]);

  // ── O pin só pode soltar a página com o vídeo no fim ─────────
  // Sem isso, num flick rápido a página começa a descer enquanto o vídeo
  // ainda está rodando — o hero sai de cena "cortando" o plano no meio.
  const canRelease = useCallback(() => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration === 0) return true;

    const target = targetRef.current * (video.duration - END_HOLD);
    if (Math.abs(target - positionRef.current) <= SETTLE_EPSILON) {
      settleWaitRef.current = 0;
      return true;
    }
    if (!settleWaitRef.current) settleWaitRef.current = performance.now();
    if (performance.now() - settleWaitRef.current > SETTLE_TIMEOUT) {
      settleWaitRef.current = 0;
      return true;
    }
    return false;
  }, []);

  // ── Scrub: glide até o alvo, com teto de velocidade ───────────
  // A posição é mantida em ref (não lida de volta do vídeo): alguns browsers
  // arredondam currentTime para o frame, o que travaria o lerp.
  const runSeek = useCallback(() => {
    if (rafRef.current) return;
    let lastFrame = performance.now();

    const tick = (now) => {
      rafRef.current = 0;
      const video = videoRef.current;
      if (!video || !Number.isFinite(video.duration) || video.duration === 0) return;

      const dt = Math.min(0.05, Math.max(0.008, (now - lastFrame) / 1000));
      lastFrame = now;

      const target = targetRef.current * (video.duration - END_HOLD);
      const delta = target - positionRef.current;
      if (Math.abs(delta) < SEEK_EPSILON) {
        if (pinnedRef.current) progressCb.current?.(targetRef.current);
        return;
      }

      // Mesmo teto para avançar e voltar; o ease só suaviza a chegada.
      const maxStep = MAX_RATE * dt;
      const step = Math.max(-maxStep, Math.min(maxStep, delta * SEEK_EASE));

      positionRef.current = Math.min(video.duration, Math.max(0, positionRef.current + step));
      video.currentTime = positionRef.current;
      if (pinnedRef.current) progressCb.current?.(positionRef.current / (video.duration - END_HOLD));
      rafRef.current = window.requestAnimationFrame(tick);
    };
    rafRef.current = window.requestAnimationFrame(tick);
  }, []);

  const handleProgress = useCallback((value) => {
    targetRef.current = value;
    if (value < 1) settleWaitRef.current = 0;
    runSeek();
  }, [runSeek]);

  usePinScrub({
    enabled: mode === 'scrub' && visible && !failed && scrubEnabled,
    ratio: PIN_RATIO,
    canRelease,
    onEngage: () => {
      pinnedRef.current = true;
      progressCb.current?.(0);
    },
    onProgress: (value) => {
      pinnedRef.current = true;
      handleProgress(value);
    },
    onRelease: ({ completed }) => {
      settleWaitRef.current = 0;
      pinnedRef.current = false;
      if (completed) progressCb.current?.(1);
      progressCb.current?.(null);
    },
    onReset: () => {
      // O pin já foi liberado: o seek não reportará mais o frame inicial.
      progressCb.current?.(0);
      progressCb.current?.(null);
      targetRef.current = 0;
      positionRef.current = 0;
      const video = videoRef.current;
      if (video && video.readyState >= 1) video.currentTime = 0;
      runSeek();
    },
  });

  // Pausa fora de vista e ao trocar de aba, sem retomar automaticamente.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || (mode !== 'manual' && mode !== 'once')) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        video.pause();
      }
    }, { threshold: 0 });
    observer.observe(video);

    const onVisibility = () => {
      if (document.hidden) video.pause();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      video.pause();
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [mode]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (!video.paused) {
      video.pause();
      return;
    }
    // Carrega somente após o gesto, mantendo play na mesma chamada para Safari.
    if (!video.getAttribute('src')) video.src = SRC_ONCE;
    if (video.ended) video.currentTime = 0;
    setEnded(false);
    video.play().catch(() => setPlaying(false));
  };

  const handleError = () => {
    setFailed(true);
    setVisible(false);
    setMode('poster');
  };

  return (
    <div
      className="pointer-events-none relative z-0 h-[var(--hero-media-height)] shrink-0 overflow-hidden bg-background lg:absolute lg:inset-0 lg:h-auto"
    >
      <Image
        src={POSTER}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: '50% 42%' }}
      />

      {(mode === 'scrub' || mode === 'manual' || mode === 'once') && (
        <video
          key={mode}
          ref={videoRef}
          muted
          playsInline
          aria-hidden="true"
          preload="none"
          poster={POSTER}
          disablePictureInPicture
          onError={handleError}
          onLoadedData={() => setVisible(true)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => { setPlaying(false); setEnded(true); }}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-200 motion-reduce:transition-none"
          style={{
            objectPosition: '50% 42%',
            opacity: visible && !failed ? 1 : 0,
          }}
        />
      )}

      {/* Scrim desktop: topo (menu), esquerda (texto) e base (CTA) */}
      <div
        className="absolute inset-0 hidden lg:block"
        style={{
          background:
            'linear-gradient(180deg, rgba(18,18,18,0.92) 0%, rgba(18,18,18,0.34) 16%, rgba(18,18,18,0.16) 52%, rgba(18,18,18,0.88) 100%), ' +
            'linear-gradient(96deg, rgba(18,18,18,0.95) 0%, rgba(18,18,18,0.74) 28%, rgba(18,18,18,0.34) 58%, rgba(18,18,18,0.06) 82%, rgba(18,18,18,0.18) 100%)',
        }}
      />
      {/* Vinheta: fecha as bordas sem apagar o centro */}
      <div
        className="absolute inset-0 hidden lg:block"
        style={{ background: 'radial-gradient(120% 90% at 50% 42%, transparent 42%, rgba(0,0,0,0.42) 100%)' }}
      />
      {/* Mobile: scrim do topo (menu) + degradê forte na base, onde o texto
          entra sobre o vídeo — o frame vira fundo do bloco, não player. */}
      <div
        className="absolute inset-0 lg:hidden"
        style={{
          background:
            'linear-gradient(180deg, rgba(18,18,18,0.24) 0%, rgba(18,18,18,0) 28%, rgba(18,18,18,0.15) 46%, rgba(18,18,18,0.8) 76%, var(--color-background) 100%)',
        }}
      />
      {(mode === 'manual' || mode === 'once') && !failed && (
        <button
          type="button"
          onClick={togglePlayback}
          aria-label={playing ? 'Pausar vídeo de apresentação' : ended ? 'Rever vídeo de apresentação' : 'Reproduzir vídeo de apresentação'}
          className="mono-focus-ring pointer-events-auto absolute right-4 top-4 z-30 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-black/60 px-4 text-xs font-medium text-primary backdrop-blur-sm [touch-action:manipulation] active:bg-black/80"
        >
          <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3 w-3 shrink-0 fill-current">
            <path d={playing ? 'M4 3h3v10H4zm5 0h3v10H9z' : 'M4 2.5v11l9-5.5z'} />
          </svg>
          {playing ? 'Pausar' : ended ? 'Rever vídeo' : 'Ver vídeo'}
        </button>
      )}
      {failed && <p role="status" className="absolute right-4 top-4 rounded-full bg-black/70 px-4 py-3 text-xs text-primary">Vídeo indisponível</p>}
    </div>
  );
};

export default HeroVideoBackdrop;
