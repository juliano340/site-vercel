import Image from 'next/image';
import { useEffect, useRef } from 'react';
import useScrollProgress from '@/lib/useScrollProgress';

// Backdrop do hero: faixa infinita de fotos atrás do conteúdo.
//
// Desktop (ponteiro fino): "pin" — a página fica presa no topo e a roda
// injeta VELOCIDADE no carrossel (nunca pausa, nunca salta). Quando a
// rolagem acumulada completa uma volta, a página é liberada.
//
// Mobile: sem efeitos acoplados ao scroll — apenas o loop calmo girando
// (40s). A aceleração por scroll causava tranco no toque.
//
// prefers-reduced-motion: loop lento (120s, ver globals.css); o pin continua
// porque é movimento dirigido pelo usuário.

const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

const PHOTOS = [
  { src: '/images/ens-1.png', alt: '', position: '58% 40%', ratio: 1.5 },
  // Preserve a resolução original da foto horizontal no recorte quadrado.
  { src: '/images/workspace-topdown.jpg', alt: '', position: '56% 42%', ratio: 1376 / 768, unoptimized: true },
  { src: '/images/retrato-escritorio.png', alt: '', position: '52% 38%', ratio: 1122 / 1402 },
  { src: '/images/ens-2.jpg', alt: '', position: '52% 34%', ratio: 896 / 1200 },
];

// Pin: quanta rolagem acumulada libera a página
const PIN_SCROLL_RATIO = 1.2; // múltiplos da altura da viewport

// Aceleração: impulso da roda/scroll vira multiplicador de velocidade do loop
const VELOCITY_REF = 320;
const MAX_RATE = 14;
const EASE = 0.12;
const DECAY = 0.92;
const WHEEL_PULSE = 60; // deltaY → impulso

const Card = ({ photo, priority }) => (
  <span className="block h-full shrink-0 pr-3 lg:h-[72vh] lg:pr-6">
    <span
      className="relative block h-full w-[calc(var(--hero-photo-height)*var(--photo-ratio))] overflow-hidden lg:w-[72vh]"
      style={{
        '--photo-ratio': photo.ratio,
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(255,255,255,0.04)',
        background: 'var(--color-surface)',
      }}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes="(max-width: 1023px) 100vw, 72vh"
        priority={priority}
        unoptimized={photo.unoptimized}
        className="object-contain lg:scale-[1.02] lg:object-cover"
        style={{ objectPosition: photo.position, filter: 'brightness(1.06)' }}
        aria-hidden="true"
      />
    </span>
  </span>
);

// Motor de velocidade: aplica playbackRate na animação do loop.
// Sempre contínuo — o loop nunca pausa; a velocidade apenas sobe e desce.
const createDriver = (track) => {
  let raf = 0;
  let rate = 1;
  let velocity = 0;

  const step = () => {
    velocity *= DECAY;
    const target = velocity > 30 ? Math.min(MAX_RATE, 1 + velocity / VELOCITY_REF) : 1;
    rate += (target - rate) * EASE;

    const [anim] = typeof track.getAnimations === 'function' ? track.getAnimations() : [];
    if (anim) anim.playbackRate = rate;

    const settled = Math.abs(rate - 1) < 0.02 && velocity < 30;
    raf = settled ? 0 : window.requestAnimationFrame(step);
  };

  return {
    pulse(amount) {
      velocity = Math.min(velocity + amount, 14000);
      if (!raf) raf = window.requestAnimationFrame(step);
    },
    stop() {
      if (raf) window.cancelAnimationFrame(raf);
      raf = 0;
    },
  };
};

const PhotoMarquee = ({ onPinProgress }) => {
  const trackRef = useRef(null);
  const progressCb = useRef(onPinProgress);
  progressCb.current = onPinProgress;

  // Deslocamento leve conforme o hero sai de cena (as fotos correm junto do
  // scroll) — só em ponteiro fino; mobile fica sem parallax.
  const driftRef = useScrollProgress((progress) => {
    if (!window.matchMedia(FINE_POINTER_QUERY).matches) return;
    const el = driftRef.current;
    if (!el) return;
    const p = Math.min(1, Math.max(0, progress));
    el.style.transform = `translate3d(${(-p * 10).toFixed(2)}vw, 0, 0)`;
  });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const report = (value) => {
      if (progressCb.current) progressCb.current(value);
    };
    const driver = createDriver(track);
    const finePointer = window.matchMedia(FINE_POINTER_QUERY).matches;

    // ── Desktop: pin que injeta velocidade (sem nunca pausar o loop) ──
    if (finePointer) {
      let mode = 'idle'; // idle · pinned · released
      let wheelAccum = 0;

      const limit = () => PIN_SCROLL_RATIO * window.innerHeight;

      const reset = (nextMode) => {
        mode = nextMode;
        wheelAccum = 0;
        report(null);
      };

      const onWheel = (event) => {
        if (mode === 'released') return;
        if (mode === 'idle') {
          if (window.scrollY > 4) return;
          if (event.deltaY <= 0) return; // só engata girando pra baixo
          mode = 'pinned';
          wheelAccum = 0;
        }
        event.preventDefault();

        wheelAccum = Math.max(0, wheelAccum + event.deltaY);
        driver.pulse(Math.abs(event.deltaY) * WHEEL_PULSE);
        report(Math.min(1, wheelAccum / limit()));

        if (wheelAccum <= 0) reset('idle'); // voltou pra zero: devolve a página
        else if (wheelAccum >= limit()) reset('released'); // completou: página desce
      };

      const onTouchMove = (event) => {
        if (mode === 'released') return;
        if (mode === 'idle') {
          if (window.scrollY > 4) return;
          mode = 'pinned';
          wheelAccum = 0;
        }
        event.preventDefault();
        const y = event.touches[0].clientY;
        if (onTouchMove.last === undefined) onTouchMove.last = y;
        const delta = (onTouchMove.last - y) * 2.2;
        onTouchMove.last = y;

        wheelAccum = Math.max(0, wheelAccum + delta);
        driver.pulse(Math.abs(delta) * WHEEL_PULSE);
        report(Math.min(1, wheelAccum / limit()));

        if (wheelAccum <= 0) reset('idle');
        else if (wheelAccum >= limit()) reset('released');
      };

      // Escape por teclado/barra de rolagem; re-arma ao voltar pro topo
      const onScroll = () => {
        if (mode === 'pinned' && window.scrollY > 4) reset('released');
        else if (mode === 'released' && window.scrollY <= 4) reset('idle');
      };

      window.addEventListener('wheel', onWheel, { passive: false });
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => {
        window.removeEventListener('wheel', onWheel);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('scroll', onScroll);
        driver.stop();
      };
    }

    // ── Mobile: nada além do loop automático (40s) — scroll puro, sem
    //    aceleração por toque (o tranco que incomodava) ──
    return undefined;
  }, []);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-x-0 top-4 z-0 flex h-[var(--hero-photo-height)] items-center overflow-hidden lg:inset-0 lg:h-auto lg:[mask-image:linear-gradient(to_bottom,transparent_0%,black_6%,black_94%,transparent_100%)] lg:[-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_6%,black_94%,transparent_100%)]"
    >
      <div ref={driftRef} className="h-full w-full lg:h-auto" style={{ willChange: 'transform' }}>
        <div
          ref={trackRef}
          className="animate-marquee flex h-full w-max items-center lg:h-auto"
          style={{ animationDuration: '40s' }}
        >
          {PHOTOS.map((photo, i) => <Card key={photo.src} photo={photo} priority={i < 2} />)}
          <span className="contents">
            {PHOTOS.map((photo) => <Card key={`dup-${photo.src}`} photo={photo} priority={false} />)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PhotoMarquee;
