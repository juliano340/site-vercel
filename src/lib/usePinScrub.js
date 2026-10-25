import { useEffect, useRef } from 'react';

// Pin de rolagem: intercepta a roda no topo da página e converte o delta
// acumulado em progresso 0..1. Quando o percurso termina, a página é liberada.
//
// Só roda em ponteiro fino (desktop). No toque o scroll fica nativo — quem
// decide isso é o consumidor, via `enabled`.
//
// Saídas:
//   onEngage()            — o pin engatou (primeira roda pra baixo no topo)
//   onProgress(0..1)      — progresso do percurso
//   onRelease({completed})— o pin soltou (fim do percurso ou escape)
//   onReset()             — voltou ao topo: estado zerado
//   canRelease()          — opcional: false segura a página no fim até o
//                           consumidor terminar o que estava fazendo
const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

// Teto por evento de roda. Um notch comum do Windows manda 100; trackpads
// mandam dezenas de eventos pequenos. O que não pode é um evento de 1000+
// consumir o percurso inteiro de uma vez.
const MAX_WHEEL_STEP = 120;
const HOLD_POLL = 60; // ms entre checagens enquanto a página está presa no fim

const usePinScrub = ({ ratio = 1.4, enabled = true, canRelease, onEngage, onProgress, onRelease, onReset }) => {
  const callbacks = useRef({ onEngage, onProgress, onRelease, onReset, canRelease });
  callbacks.current = { onEngage, onProgress, onRelease, onReset, canRelease };

  useEffect(() => {
    if (!enabled) return undefined;
    if (!window.matchMedia(FINE_POINTER_QUERY).matches) return undefined;

    let mode = 'idle'; // idle · pinned · released
    let accum = 0;
    let progress = 0;
    let touchY;
    let holdTimer = 0;

    const limit = () => ratio * window.innerHeight;
    const report = (value) => {
      progress = value;
      callbacks.current.onProgress?.(value);
    };
    const mayRelease = () => {
      const fn = callbacks.current.canRelease;
      return typeof fn === 'function' ? fn() : true;
    };

    const clearHold = () => {
      if (!holdTimer) return;
      window.clearTimeout(holdTimer);
      holdTimer = 0;
    };

    const reset = (nextMode, completed = false) => {
      const wasPinned = mode === 'pinned';
      clearHold();
      mode = nextMode;
      accum = 0;
      if (!wasPinned) return;
      callbacks.current.onRelease?.({ completed });
      if (nextMode === 'idle') callbacks.current.onReset?.();
    };

    const engage = () => {
      mode = 'pinned';
      accum = 0;
      callbacks.current.onEngage?.();
    };

    // O fim do percurso pode chegar antes de o consumidor terminar (o vídeo
    // ainda está assentando). Segura a página e libera sozinho assim que ele
    // avisar — sem depender de mais um evento de roda.
    const holdAtEnd = () => {
      report(1);
      if (holdTimer) return;
      const check = () => {
        holdTimer = 0;
        if (!mayRelease()) {
          holdTimer = window.setTimeout(check, HOLD_POLL);
          return;
        }
        reset('released', true);
      };
      holdTimer = window.setTimeout(check, HOLD_POLL);
    };

    const advance = (delta) => {
      accum = Math.max(0, accum + delta);

      if (accum >= limit()) {
        accum = limit();
        holdAtEnd();
        return;
      }

      clearHold();
      report(Math.min(1, accum / limit()));
      if (accum <= 0) reset('idle');
    };

    const onWheel = (event) => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      if (mode === 'released') return;
      if (mode === 'idle') {
        if (window.scrollY > 4) return;
        if (event.deltaY <= 0) return; // só engata girando pra baixo
        engage();
      }
      event.preventDefault();

      // Normaliza o passo: trackpad de alta precisão e roda "uma página"
      // mandam deltas muito diferentes. Sem o clamp, um flick único
      // atravessa o vídeo inteiro e o efeito parece não existir.
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1);
      advance(Math.max(-MAX_WHEEL_STEP, Math.min(delta, MAX_WHEEL_STEP)));
    };

    // Telas de toque com ponteiro fino (notebook com touch): mesmo percurso,
    // mesmo bloqueio — o dedo vira roda.
    const onTouchMove = (event) => {
      if (mode === 'released') return;
      if (mode === 'idle') {
        if (window.scrollY > 4) return;
        engage();
        touchY = event.touches[0].clientY;
        return;
      }
      event.preventDefault();
      const y = event.touches[0].clientY;
      if (touchY === undefined) {
        touchY = y;
        return;
      }
      const delta = (touchY - y) * 2.2;
      touchY = y;
      advance(delta);
    };

    // Escape por teclado/barra de rolagem. Ao voltar pro topo, o pin re-arma
    // EXATAMENTE onde o vídeo parou: subir continua rebobinando o plano em vez
    // de dar um corte para o primeiro frame.
    const onScroll = () => {
      if (mode === 'pinned' && window.scrollY > 4) reset('released');
      else if (mode === 'released' && window.scrollY <= 4) {
        mode = 'pinned';
        accum = progress * limit();
        report(progress);
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearHold();
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, [enabled, ratio]);
};

export default usePinScrub;
