import Image from 'next/image';
import { useEffect, useRef } from 'react';
import useScrollProgress from '@/lib/useScrollProgress';

// Backdrop do hero: faixa infinita de fotos atrás do conteúdo.
//
// Desktop (ponteiro fino): "pin" — a página fica presa no topo e a roda
// injeta VELOCIDADE no carrossel (nunca pausa, nunca salta). Quando a
// rolagem acumulada completa uma volta, a página é liberada.
//
// Mobile: loop calmo + aceleração pela velocidade do scroll (sem pin).
//
// prefers-reduced-motion: loop lento (120s, ver globals.css); o pin continua
// porque é movimento dirigido pelo usuário.

const PHOTOS = [
  { src: '/images/ens-1.png', alt: '', position: '58% 40%' },
  { src: '/images/workspace-topdown.jpg', alt: '', position: '56% 42%' },
  { src: '/images/retrato-escritorio.png', alt: '', position: '52% 38%' },
  { src: '/images/ens-2.jpg', alt: '', position: '52% 34%' },
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
  <span className="block h-[64vh] shrink-0 pr-4 sm:h-[72vh] sm:pr-6">
    <span
      className="relative block h-full w-[64vh] overflow-hidden sm:w-[72vh]"
      style={{
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(255,255,255,0.04)',
        background: 'var(--color-surface)',
      }}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes="(max-width: 640px) 64vh, 72vh"
        priority={priority}
        className="scale-[1.02] object-cover"
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

  // Deslocamento leve conforme o hero sai de cena (as fotos correm junto do scroll)
  const driftRef = useScrollProgress((progress) => {
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
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

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

    // ── Mobile: acelera pela velocidade do scroll (loop sempre ativo) ──
    let lastY = window.scrollY;
    let lastT = performance.now();

    const onScroll = () => {
      const now = performance.now();
      const y = window.scrollY;
      const dt = Math.max(16, now - lastT);
      const speed = (Math.abs(y - lastY) / dt) * 1000; // px/s
      if (speed > 30) driver.pulse(speed);
      lastY = y;
      lastT = now;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      driver.stop();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-0 flex items-center overflow-hidden"
      style={{
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)',
      }}
    >
      <div ref={driftRef} className="w-full" style={{ willChange: 'transform' }}>
        <div
          ref={trackRef}
          className="animate-marquee flex w-max items-center"
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
