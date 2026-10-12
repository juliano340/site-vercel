import Image from 'next/image';
import { useEffect, useRef } from 'react';
import useScrollProgress from '@/lib/useScrollProgress';

// Backdrop do hero: faixa infinita de fotos atrás do conteúdo.
//
// Desktop (ponteiro fino): "pin" no topo — a página não desce; a rolagem
// avança o carrossel PIN_ADVANCE de uma volta e só então libera o scroll.
// Volta ao topo re-arma. Teclado/barra de rolagem passam direto (escape).
//
// Mobile: loop calmo + aceleração pela velocidade do scroll (sem pin).
//
// prefers-reduced-motion: loop lento (120s, ver globals.css); o pin continua
// porque é movimento dirigido pelo usuário.

const PHOTOS = [
  { src: '/images/ens-1.png', alt: '', position: '58% 40%' },
  { src: '/images/ens-2.jpg', alt: '', position: '52% 34%' },
  { src: '/images/profile-about.png', alt: '', position: '48% 34%' },
  { src: '/images/workspace-topdown.jpg', alt: '', position: '56% 42%' },
  { src: '/images/ens-3.jpg', alt: '', position: '60% 52%' },
];

// Pin: quanto de uma volta o scroll avança, e quanta rolagem isso exige
const PIN_ADVANCE = 1; // 1 = volta completa (baixe pra 0.5/0.6 pra encurtar)
const PIN_SCROLL_RATIO = 1.2; // múltiplos da altura da viewport

// Aceleração (modo sem pin): velocidade do scroll (px/s) → multiplicador do loop
const VELOCITY_REF = 800;
const MAX_RATE = 6;
const EASE = 0.12;
const DECAY = 0.9;

const Card = ({ photo, priority }) => (
  <span className="block h-[52vh] shrink-0 pr-4 sm:h-[72vh] sm:pr-6">
    <span
      className="relative block h-full w-[38vh] overflow-hidden sm:w-[53vh]"
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
        sizes="(max-width: 640px) 34vh, 47vh"
        priority={priority}
        className="scale-[1.02] object-cover"
        style={{ objectPosition: photo.position, filter: 'brightness(1.06)' }}
        aria-hidden="true"
      />
    </span>
  </span>
);

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
    const getAnim = () => {
      if (typeof track.getAnimations !== 'function') return null;
      const [anim] = track.getAnimations();
      return anim || null;
    };

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    // ── Modo pin (desktop): a rolagem avança o carrossel antes de descer ──
    if (finePointer) {
      let anim = null;
      let startTime = 0;
      let duration = 40000;
      let progress = 0;
      let wheelAccum = 0;
      // idle: no topo e ainda armado · pinned: girando com a rolagem · released: já desceu
      let mode = 'idle';

      const begin = () => {
        anim = anim || getAnim();
        if (!anim) return false;
        duration = Number(anim.effect?.getTiming?.().duration) || duration;
        anim.pause();
        startTime = Number(anim.currentTime) || 0;
        mode = 'pinned';
        wheelAccum = 0;
        progress = 0;
        report(0);
        return true;
      };

      const resume = (nextMode) => {
        mode = nextMode;
        wheelAccum = 0;
        progress = 0;
        if (anim) {
          anim.playbackRate = 1;
          anim.play();
        }
        report(null);
      };

      const advance = (deltaPx) => {
        wheelAccum += deltaPx;
        // Rolou de volta pro zero (gesto pra cima): solta e volta a girar sozinho
        if (wheelAccum <= 0) {
          resume('idle');
          return;
        }
        const limit = PIN_SCROLL_RATIO * window.innerHeight;
        progress = Math.min(1, Math.max(0, wheelAccum / limit));
        if (anim) {
          anim.currentTime = (startTime + progress * PIN_ADVANCE * duration) % duration;
        }
        report(progress);
        if (progress >= 1) resume('released');
      };

      const onWheel = (event) => {
        if (mode === 'released') return;
        if (mode === 'idle') {
          if (window.scrollY > 4) return;
          if (event.deltaY <= 0) return; // só engata girando pra baixo
          if (!begin()) return;
        }
        event.preventDefault();
        advance(event.deltaY);
      };

      const onTouchMove = (event) => {
        if (mode === 'released') return;
        if (mode === 'idle') {
          if (window.scrollY > 4) return;
          if (!begin()) return;
        }
        event.preventDefault();
        const y = event.touches[0].clientY;
        if (onTouchMove.last === undefined) onTouchMove.last = y;
        advance((onTouchMove.last - y) * 2.2);
        onTouchMove.last = y;
      };

      // Escape por teclado/barra de rolagem; re-arma ao voltar pro topo
      const onScroll = () => {
        if (mode === 'pinned' && window.scrollY > 4) resume('released');
        if (mode === 'released' && window.scrollY <= 4) mode = 'idle';
      };

      window.addEventListener('wheel', onWheel, { passive: false });
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => {
        window.removeEventListener('wheel', onWheel);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('scroll', onScroll);
        if (mode === 'pinned') resume('idle');
      };
    }

    // ── Modo sem pin (mobile): acelera conforme a velocidade do scroll ──
    let raf = 0;
    let rate = 1;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let velocity = 0;

    const loop = () => {
      velocity *= DECAY;
      const target = velocity > 30 ? Math.min(MAX_RATE, 1 + velocity / VELOCITY_REF) : 1;
      rate += (target - rate) * EASE;

      const anim = getAnim();
      if (anim) anim.playbackRate = rate;

      const settled = Math.abs(rate - 1) < 0.02 && velocity < 30;
      raf = settled ? 0 : window.requestAnimationFrame(loop);
    };

    const onScroll = () => {
      const now = performance.now();
      const y = window.scrollY;
      const dt = Math.max(16, now - lastT);
      velocity = (Math.abs(y - lastY) / dt) * 1000;
      lastY = y;
      lastT = now;
      if (!raf) raf = window.requestAnimationFrame(loop);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-0 flex items-center overflow-hidden"
      style={{
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
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
