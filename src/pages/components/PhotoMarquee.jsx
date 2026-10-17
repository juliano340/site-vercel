import Image from 'next/image';
import { useEffect, useRef } from 'react';
import useScrollProgress from '@/lib/useScrollProgress';

// Backdrop do hero: faixa infinita de fotos atrás do conteúdo.
//
// Desktop (ponteiro fino): "pin" — a página fica presa no topo e a roda
// injeta VELOCIDADE no carrossel (nunca pausa, nunca salta). Quando a
// rolagem acumulada completa uma volta, a página é liberada.
//
// Mobile: loop calmo (40s), com arrasto horizontal e impulso ao soltar.
// A rolagem vertical continua nativa e não altera a velocidade das fotos.
//
// prefers-reduced-motion: loop lento (120s, ver globals.css); o pin continua
// porque é movimento dirigido pelo usuário.

const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

const PHOTOS = [
  { src: '/images/ens-1.png', alt: '', position: '58% 40%', mobilePosition: '65% 40%' },
  // Preserve a resolução original da foto horizontal no recorte quadrado.
  { src: '/images/workspace-topdown.jpg', alt: '', position: '56% 42%', mobilePosition: '82% 42%', unoptimized: true },
  { src: '/images/retrato-escritorio.png', alt: '', position: '52% 38%', mobilePosition: '50% 24%' },
  { src: '/images/ens-2.jpg', alt: '', position: '52% 34%', mobilePosition: '76% 100%', mobileScale: 1.2 },
];

// Pin: quanta rolagem acumulada libera a página
const PIN_SCROLL_RATIO = 1.2; // múltiplos da altura da viewport

// Aceleração: impulso da roda/scroll vira multiplicador de velocidade do loop
const VELOCITY_REF = 320;
const MAX_RATE = 14;
const EASE = 0.12;
const DECAY = 0.92;
const WHEEL_PULSE = 60; // deltaY → impulso
const DRAG_THRESHOLD = 6;
const MAX_DRAG_SPEED = 1800; // px/s
const DRAG_SPEED_BLEND = 0.35;
const DRAG_IDLE_MS = 80;
const DRAG_DECAY = 0.96;
const SETTLE_DRAG_SPEED = 2; // px/s
const FRAME_MS = 1000 / 60;

const Card = ({ photo, priority }) => (
  <span className="block h-full shrink-0 pr-3 lg:h-[72vh] lg:pr-6">
    <span
      className="relative block h-full w-[var(--hero-photo-height)] overflow-hidden lg:w-[72vh]"
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
        sizes="(max-width: 1023px) 100vw, 72vh"
        priority={priority}
        unoptimized={photo.unoptimized}
        draggable={false}
        className="scale-[var(--mobile-scale)] object-cover [--photo-position:var(--mobile-position)] [transform-origin:var(--mobile-position)] lg:origin-center lg:scale-[1.02] lg:[--photo-position:var(--desktop-position)]"
        style={{
          '--mobile-position': photo.mobilePosition,
          '--desktop-position': photo.position,
          '--mobile-scale': photo.mobileScale || 1,
          objectPosition: 'var(--photo-position)',
          filter: 'brightness(1.06)',
        }}
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
  const surfaceRef = useRef(null);
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

    // ── Mobile: o dedo controla a fase do loop; o impulso decai ao soltar. ──
    const surface = surfaceRef.current;
    const animation = track.getAnimations()[0];
    if (!surface || !animation) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const controller = new AbortController();
    let gesture = null;
    let raf = 0;

    const seek = (delta) => {
      const duration = animation.effect.getTiming().duration;
      const distance = track.offsetWidth / 2;
      if (!distance) return;
      const next = Number(animation.currentTime) + delta * duration / distance;
      animation.currentTime = ((next % duration) + duration) % duration;
    };

    const release = (event) => {
      if (event.type === 'lostpointercapture' && event.target !== surface) return;
      if (!gesture || event.pointerId !== gesture.id) return;
      const previous = gesture;
      gesture = null;
      if (!previous.dragging) return;
      if (surface.hasPointerCapture(previous.id)) surface.releasePointerCapture(previous.id);

      // Um breve intervalo antes do pointerup não deve apagar o impulso do gesto.
      const idleFrames = Math.max(0, event.timeStamp - previous.time - DRAG_IDLE_MS) / FRAME_MS;
      let speed = event.type === 'pointerup'
        ? previous.speed * Math.pow(DECAY, idleFrames) : 0;
      let lastFrame = performance.now();
      const coast = (now) => {
        const elapsed = Math.min(now - lastFrame, FRAME_MS * 4);
        lastFrame = now;
        if (reducedMotion.matches) speed = 0;
        speed *= Math.pow(DRAG_DECAY, elapsed / FRAME_MS);
        if (Math.abs(speed) < SETTLE_DRAG_SPEED) {
          raf = 0;
          animation.play();
          return;
        }
        // Um frame de autoplay + impulso: o sentido normal retorna gradualmente.
        const duration = animation.effect.getTiming().duration;
        seek(track.offsetWidth / 2 * elapsed / duration - speed * elapsed / 1000);
        raf = window.requestAnimationFrame(coast);
      };
      raf = window.requestAnimationFrame(coast);
    };

    const onPointerDown = (event) => {
      if (event.pointerType !== 'touch' && event.pointerType !== 'pen') return;
      if (!event.isPrimary) {
        if (gesture) release({ pointerId: gesture.id, type: 'pointercancel' });
        return;
      }
      gesture = { id: event.pointerId, x: event.clientX, y: event.clientY,
        lastX: event.clientX, time: event.timeStamp, speed: 0, dragging: false };
    };

    const onPointerMove = (event) => {
      if (!gesture || gesture.id !== event.pointerId) return;
      if (!gesture.dragging) {
        const x = event.clientX - gesture.x;
        const y = event.clientY - gesture.y;
        if (Math.max(Math.abs(x), Math.abs(y)) < DRAG_THRESHOLD) return;
        if (Math.abs(y) >= Math.abs(x)) {
          gesture = null;
          return;
        }
        gesture.dragging = true;
        window.cancelAnimationFrame(raf);
        animation.pause();
        surface.setPointerCapture(event.pointerId);
      }
      const delta = event.clientX - gesture.lastX;
      const elapsed = Math.max(1, event.timeStamp - gesture.time);
      const speed = Math.max(-MAX_DRAG_SPEED, Math.min(MAX_DRAG_SPEED, delta / elapsed * 1000));
      gesture.speed += (speed - gesture.speed) * DRAG_SPEED_BLEND;
      gesture.lastX = event.clientX;
      gesture.time = event.timeStamp;
      seek(-delta);
    };

    surface.addEventListener('pointerdown', onPointerDown, { signal: controller.signal });
    surface.addEventListener('pointermove', onPointerMove, { signal: controller.signal });
    surface.addEventListener('pointerup', release, { signal: controller.signal });
    surface.addEventListener('pointercancel', release, { signal: controller.signal });
    surface.addEventListener('lostpointercapture', release, { signal: controller.signal });
    return () => {
      controller.abort();
      window.cancelAnimationFrame(raf);
      if (gesture && surface.hasPointerCapture(gesture.id)) surface.releasePointerCapture(gesture.id);
      animation.play();
      driver.stop();
    };
  }, []);

  return (
    <div
      ref={surfaceRef}
      aria-hidden="true"
      className="absolute inset-x-0 top-4 z-0 flex h-[var(--hero-photo-height)] select-none items-center overflow-hidden [touch-action:pan-y_pinch-zoom] lg:inset-0 lg:h-auto lg:[mask-image:linear-gradient(to_bottom,transparent_0%,black_6%,black_94%,transparent_100%)] lg:[-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_6%,black_94%,transparent_100%)]"
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
