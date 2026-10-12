import Image from 'next/image';
import { useEffect, useRef } from 'react';
import useScrollProgress from '@/lib/useScrollProgress';

// Backdrop do hero: faixa infinita de fotos atrás do conteúdo.
// - Track duplicado (2ª metade aria-hidden) → loop sem emenda
// - Loop automático linear e calmo (40s; 120s com prefers-reduced-motion)
// - O scroll dá um giro extra no carrossel (acelera pela velocidade) e,
//   ao parar de rolar, ele desacelera de volta ao ritmo calmo
// - Deslocamento leve ligado ao progresso do scroll
// - Camada decorativa: o texto vive acima, com scrim no meio

const PHOTOS = [
  { src: '/images/ens-1.png', alt: '', position: '58% 40%' },
  { src: '/images/profile-about.png', alt: '', position: '48% 34%' },
  { src: '/images/workspace-topdown.jpg', alt: '', position: '56% 42%' },
  { src: '/images/ens-2.jpg', alt: '', position: '52% 34%' },
  { src: '/images/ens-3.jpg', alt: '', position: '60% 52%' },
];

// Rampa da aceleração: velocidade do scroll (px/s) → multiplicador do loop
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
        style={{ objectPosition: photo.position, opacity: 0.97 }}
        aria-hidden="true"
      />
    </span>
  </span>
);

const PhotoMarquee = () => {
  const trackRef = useRef(null);

  // Deslocamento leve conforme o hero sai de cena (as fotos correm junto do scroll)
  const driftRef = useScrollProgress((progress) => {
    const el = driftRef.current;
    if (!el) return;
    const p = Math.min(1, Math.max(0, progress));
    el.style.transform = `translate3d(${(-p * 10).toFixed(2)}vw, 0, 0)`;
  });

  // Scroll acelera o loop; ao parar, a velocidade decai de volta ao ritmo calmo.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    if (typeof track.getAnimations !== 'function') return undefined;

    let raf = 0;
    let rate = 1;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let velocity = 0; // px/s

    const loop = () => {
      velocity *= DECAY;
      const target = velocity > 30 ? Math.min(MAX_RATE, 1 + velocity / VELOCITY_REF) : 1;
      rate += (target - rate) * EASE;

      const [anim] = track.getAnimations();
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
