import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import usePinScrub from '@/lib/usePinScrub';

// Backdrop do hero: vídeo cinematográfico com dois regimes.
//
// Desktop (ponteiro fino): scrub — a roda avança o vídeo no lugar de rolar.
// Mobile: loop mudo em ping-pong (16s, sem emenda), desacoplado do scroll.
// reduced-motion / save-data / rede 2G: só o poster, zero download de vídeo.
//
// O poster é o LCP: entra com priority e fica visível até o vídeo ter o
// primeiro frame decodificado. O vídeo só é baixado depois do load da página.

const SRC_SCRUB = '/video/hero/hero-scrub-v2.mp4';
const SRC_LOOP = '/video/hero/hero-loop-v2.mp4';
const POSTER = '/video/hero/hero-poster-v1.webp';

const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

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

const HeroVideoBackdrop = ({ onPinProgress }) => {
  const videoRef = useRef(null);
  const [mode, setMode] = useState('poster'); // poster · scrub · loop
  const [visible, setVisible] = useState(false);
  const [failed, setFailed] = useState(false);

  const targetRef = useRef(0);
  const positionRef = useRef(0);
  const rafRef = useRef(0);
  const settleWaitRef = useRef(0);
  const inViewRef = useRef(true);
  const progressCb = useRef(onPinProgress);
  progressCb.current = onPinProgress;

  // ── Estratégia de mídia (só no cliente) ──────────────────────
  // reduced-motion desliga o movimento autônomo (loop, entradas), mas NÃO o
  // scrub: ali quem move é a roda do usuário, frame a frame. No toque não há
  // scrub, então reduced-motion ali fica no poster.
  useEffect(() => {
    const reduced = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    const finePointer = window.matchMedia(FINE_POINTER_QUERY).matches;

    const connection = navigator.connection || navigator.mozConnection || {};
    const saveData = connection.saveData === true;
    const slowNetwork = typeof connection.effectiveType === 'string'
      && /(^|-)2g$/.test(connection.effectiveType);
    if (saveData || slowNetwork) return;
    if (reduced && !finePointer) return;

    setMode(finePointer ? 'scrub' : 'loop');
  }, []);

  // ── Carregamento preguiçoso: nunca compete com o primeiro paint ──
  useEffect(() => {
    if (mode === 'poster') return undefined;
    const video = videoRef.current;
    if (!video) return undefined;

    let cancelled = false;
    let idleId;
    let timeoutId;

    const start = () => {
      if (cancelled) return;
      video.src = mode === 'scrub' ? SRC_SCRUB : SRC_LOOP;
      video.preload = 'auto';
      video.load();
      if (mode === 'loop') video.play().catch(() => {});
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

    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });

    return () => {
      cancelled = true;
      video.removeEventListener('loadeddata', onReady);
      window.removeEventListener('load', schedule);
      if (idleId) window.cancelIdleCallback?.(idleId);
      if (timeoutId) window.clearTimeout(timeoutId);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
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
      if (Math.abs(delta) < SEEK_EPSILON) return;

      // Mesmo teto para avançar e voltar; o ease só suaviza a chegada.
      const maxStep = MAX_RATE * dt;
      const step = Math.max(-maxStep, Math.min(maxStep, delta * SEEK_EASE));

      positionRef.current = Math.min(video.duration, Math.max(0, positionRef.current + step));
      video.currentTime = positionRef.current;
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
    enabled: mode === 'scrub' && !failed,
    ratio: PIN_RATIO,
    canRelease,
    onEngage: () => progressCb.current?.(0),
    onProgress: (value) => {
      progressCb.current?.(value);
      handleProgress(value);
    },
    onRelease: () => {
      settleWaitRef.current = 0;
      progressCb.current?.(null);
    },
    onReset: () => {
      progressCb.current?.(null);
      targetRef.current = 0;
      positionRef.current = 0;
      const video = videoRef.current;
      if (video && video.readyState >= 1) video.currentTime = 0;
      runSeek();
    },
  });

  // ── Economia: pausa o loop fora de vista / com a aba oculta ──
  useEffect(() => {
    const video = videoRef.current;
    if (!video || mode !== 'loop') return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      inViewRef.current = entry.isIntersecting;
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    }, { threshold: 0.05 });
    observer.observe(video);

    const onVisibility = () => {
      if (document.hidden) video.pause();
      else if (inViewRef.current) video.play().catch(() => {});
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [mode]);

  const handleError = () => {
    setFailed(true);
    setVisible(false);
    setMode('poster');
  };

  return (
    <div
      aria-hidden="true"
      className="absolute inset-x-4 top-4 z-0 h-[var(--hero-media-height)] overflow-hidden rounded-[var(--radius-md)] bg-background-deep ring-1 ring-white/5 lg:inset-0 lg:h-auto lg:rounded-none lg:ring-0"
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

      {mode !== 'poster' && (
        <video
          ref={videoRef}
          muted
          playsInline
          loop={mode === 'loop'}
          autoPlay={mode === 'loop'}
          poster={POSTER}
          disablePictureInPicture
          onError={handleError}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out"
          style={{ objectPosition: '50% 42%', opacity: visible && !failed ? 1 : 0 }}
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
      {/* Mobile: faixa respira; só as bordas escurecem */}
      <div
        className="absolute inset-0 lg:hidden"
        style={{
          background:
            'linear-gradient(180deg, rgba(18,18,18,0.32) 0%, rgba(18,18,18,0) 28%, rgba(18,18,18,0) 64%, rgba(18,18,18,0.52) 100%)',
        }}
      />
    </div>
  );
};

export default HeroVideoBackdrop;
