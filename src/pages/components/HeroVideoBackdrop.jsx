import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import usePinScrub from '@/lib/usePinScrub';

// Desktop: scrub pela roda. Mobile: pôster como LCP e reprodução manual.
// O vídeo só entra depois de um gesto, evitando competir com a primeira pintura.

const SRC_SCRUB = '/video/hero/hero-scrub-v2.mp4';
const SRC_ONCE = '/video/hero/hero-once-v2.mp4';
const POSTER = '/video/hero/hero-poster-v1.webp';

const FINE_POINTER_QUERY = '(min-width: 1024px) and (hover: hover) and (pointer: fine)';

// O percurso é calibrado por tempo, não por tamanho: 1 viewport de rolagem =
// ~2,3 s de vídeo. Percurso curto demais faz cada notch da roda valer 12+
// frames e o vídeo nunca "acompanha" a mão. Ao mudar a duração do clipe,
// recalibre: PIN_RATIO = duração / 2,3.
const PIN_RATIO = 2.25; // 5,2 s / 2,25 ≈ 2,3 s de vídeo por viewport
const SEEK_EPSILON = 0.02; // segundos
const END_HOLD = 0.05; // não encosta no último frame (evita rewind no loop)
// Mesmo teto nos dois sentidos: voltar tem que gastar o mesmo esforço de
// rolagem que avançar, senão o vídeo "descola" da roda na subida.
// 1.8 = o clipe nunca corre mais de 1,8x o tempo real (antes 2,4x, que
// pulava frames e embolava o plano). Descer mais deixa o fim arrastado;
// subir encurta a leitura do movimento.
const MAX_RATE = 1.8; // segundos de vídeo por segundo real, em ambos sentidos
// A roda pode pedir 0,3 s de vídeo de uma vez; seguir isso em um frame fazia
// o clipe disparar. O glide agora tem aceleração limitada e chega ao teto em
// ~0,23 s: flick forte vira movimento de câmera, não corte seco de frames.
const MAX_ACCEL = 8; // s/s² de aceleração e frenagem
const GLIDE_TIME = 0.24; // s — tempo nominal para percorrer o que falta
// O pin só solta a página com o vídeo assentado no fim. A janela é folgada de
// propósito: com o glide mais lento, esperar o frame final colado deixava a
// roda morta por centenas de ms. Os últimos ~8 frames terminam de tocar
// enquanto a página já começa a sair.
const SETTLE_EPSILON = 0.35; // segundos
// Distância a partir da qual o reset do pin corta direto para o frame 0 em vez
// de rebobinar: Home/End/troca de modo pedem salto; inércia da roda, não.
const RESET_SNAP_DISTANCE = 0.6; // segundos

// Tempo máximo que o glide aceita esperar um seek antes de reescrever a
// posição (proteção contra seek pendurado que nunca dispara `seeked`).
const SEEK_STALL = 250; // ms

const HeroVideoBackdrop = ({ onPinProgress, onScrubAvailable, scrubEnabled = true }) => {
  const videoRef = useRef(null);
  const [mode, setMode] = useState('poster'); // poster · scrub · manual · once
  const [visible, setVisible] = useState(false);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);

  const targetRef = useRef(0);
  const positionRef = useRef(0);
  const velocityRef = useRef(0);
  const rafRef = useRef(0);
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
    const updateMode = () => {
      setVisible(false);
      setPlaying(false);
      setEnded(false);
      setFailed(false);
      targetRef.current = 0;
      positionRef.current = 0;
      velocityRef.current = 0;
      pinnedRef.current = false;
      progressCb.current?.(0);
      progressCb.current?.(null);
      setMode(finePointer.matches ? 'scrub' : 'manual');
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
      velocityRef.current = 0;
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
    if (!video || !Number.isFinite(video.duration) || video.duration === 0) return false;

    const target = targetRef.current * (video.duration - END_HOLD);
    return !video.seeking && video.readyState >= 2
      && Math.abs(target - video.currentTime) <= SETTLE_EPSILON;
  }, []);

  // ── Scrub: glide até o alvo, com teto de velocidade ───────────
  // A posição é mantida em ref (não lida de volta do vídeo): alguns browsers
  // arredondam currentTime para o frame, o que travaria o lerp.
  const runSeek = useCallback(() => {
    if (rafRef.current) return;
    let lastFrame = performance.now();
    let lastWrite = 0;

    const tick = (now) => {
      rafRef.current = 0;
      const video = videoRef.current;
      if (!video || !Number.isFinite(video.duration) || video.duration === 0) return;

      // Teto generoso: uma aba estrangulada (rAF a 1 fps) fazia cada tick valer
      // 0,05 s e o vídeo rastejava enquanto o alvo já estava longe — o pin
      // ficava segurando a página esperando um frame que nunca chegava.
      const dt = Math.min(0.1, Math.max(0.008, (now - lastFrame) / 1000));
      lastFrame = now;

      const target = targetRef.current * (video.duration - END_HOLD);
      const delta = target - positionRef.current;
      if (Math.abs(delta) < SEEK_EPSILON) {
        velocityRef.current = 0;
        if (pinnedRef.current) progressCb.current?.(targetRef.current);
        return;
      }

      // Velocidade desejada: fechar o que falta em GLIDE_TIME, limitada pelo
      // teto. Ela puxa o vídeo para o alvo e freia sozinha na chegada.
      const wanted = Math.max(-MAX_RATE, Math.min(MAX_RATE, delta / GLIDE_TIME));
      // Aceleração limitada: a roda não arranca o vídeo em velocidade máxima
      // nem o para de uma vez. É o que segura o flick abrupto.
      const maxAccel = MAX_ACCEL * dt;
      velocityRef.current += Math.max(-maxAccel, Math.min(maxAccel, wanted - velocityRef.current));

      let next = positionRef.current + velocityRef.current * dt;
      // Nunca passa do alvo: evita overshoot quando o dt abre (aba em segundo
      // plano) e garante que a parada seja exatamente no frame pedido.
      if ((delta > 0 && next > target) || (delta < 0 && next < target)) {
        next = target;
        velocityRef.current = 0;
      }

      positionRef.current = Math.min(video.duration, Math.max(0, next));
      // Só escreve quando o seek anterior terminou. Escrever a cada frame com um
      // seek em voo faz o Chrome descartar o pendente (medido: 7,6 ms de mediana,
      // mas 1 em 10 passa de 12 ms) e o quadro chega em blocos — o "binário".
      // A posição continua integrando; quando o seek fecha, escreve a mais nova.
      if (!video.seeking || now - lastWrite > SEEK_STALL) {
        video.currentTime = positionRef.current;
        lastWrite = now;
      }
      if (pinnedRef.current) progressCb.current?.(positionRef.current / (video.duration - END_HOLD));
      rafRef.current = window.requestAnimationFrame(tick);
    };
    rafRef.current = window.requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (mode === 'scrub' && visible) runSeek();
  }, [mode, visible, runSeek]);

  const handleProgress = useCallback((value) => {
    targetRef.current = value;
    runSeek();
  }, [runSeek]);

  usePinScrub({
    enabled: mode === 'scrub' && !failed && scrubEnabled,
    ratio: PIN_RATIO,
    canRelease,
    // O pin retoma daqui quando a página volta ao topo — o frame que está na
    // tela, não o último progresso que a roda pediu.
    getProgress: () => {
      const video = videoRef.current;
      if (!video || !Number.isFinite(video.duration) || video.duration <= END_HOLD) return 0;
      return positionRef.current / (video.duration - END_HOLD);
    },
    onEngage: () => {
      pinnedRef.current = true;
      progressCb.current?.(0);
    },
    onProgress: (value) => {
      pinnedRef.current = true;
      handleProgress(value);
    },
    onRelease: ({ completed }) => {
      pinnedRef.current = false;
      if (completed) progressCb.current?.(1);
      progressCb.current?.(null);
    },
    onReset: () => {
      // O pin já foi liberado: o seek não reportará mais o frame inicial.
      progressCb.current?.(0);
      progressCb.current?.(null);
      targetRef.current = 0;
      // Não reposiciona à força quando o reset chega no meio do glide de volta:
      // o salto seco (ex.: 0,24 s → 0 em um frame) aparecia como "pulo" e
      // ressaltava a câmera de um plano perto para o plano aberto. O runSeek
      // fecha o retorno com o mesmo teto de velocidade da descida.
      // Só corta quando a distância é grande demais para ser inércia (Home,
      // End, troca de modo) — aí o salto é intencional.
      const video = videoRef.current;
      if (video && positionRef.current > RESET_SNAP_DISTANCE) {
        positionRef.current = 0;
        velocityRef.current = 0;
        if (video.readyState >= 1) video.currentTime = 0;
      }
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
