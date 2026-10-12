import Image from 'next/image';
import useScrollProgress from '@/lib/useScrollProgress';

// Backdrop do hero: faixa infinita de fotos atrás do conteúdo.
// - Track duplicado (2ª metade aria-hidden) → loop sem emenda
// - Loop automático, lento e linear (calmo)
// - Soma um deslocamento extra ligado ao scroll (as fotos correm junto do mouse/roda)
// - Camada decorativa: o texto vive acima, com scrim no meio
// - prefers-reduced-motion: sem animação e sem deslocamento (globals.css + hook)

const PHOTOS = [
  { src: '/images/ens-1.png', alt: '', position: '58% 40%' },
  { src: '/images/profile-about.png', alt: '', position: '48% 34%' },
  { src: '/images/workspace-topdown.jpg', alt: '', position: '56% 42%' },
  { src: '/images/ens-2.jpg', alt: '', position: '52% 34%' },
  { src: '/images/ens-3.jpg', alt: '', position: '60% 52%' },
];

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
        className="scale-[1.06] object-cover blur-[2px]"
        style={{ objectPosition: photo.position, opacity: 0.92 }}
        aria-hidden="true"
      />
    </span>
  </span>
);

const PhotoMarquee = () => {
  // Conforme o hero sai de cena, a faixa ganha um empurrão lateral:
  // sensação de as fotos correrem junto do scroll.
  const driftRef = useScrollProgress((progress) => {
    const el = driftRef.current;
    if (!el) return;
    const p = Math.min(1, Math.max(0, progress));
    el.style.transform = `translate3d(${(-p * 26).toFixed(2)}vw, 0, 0)`;
  });

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
