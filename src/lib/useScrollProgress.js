import { useEffect, useRef } from 'react';

// Returns a ref to attach to an element. Calls onProgress(progress)
// with 0..1 as the element scrolls through the viewport (rAF-throttled,
// passive listener — reading scrolls never blocks paint).
const useScrollProgress = (onProgress) => {
  const ref = useRef(null);
  const rafRef = useRef(0);
  const progressRef = useRef(onProgress);
  progressRef.current = onProgress;

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      progressRef.current(0);
      return undefined;
    }

    const totalRange = () => el.offsetHeight + window.innerHeight;

    const measure = () => {
      rafRef.current = 0;
      const rect = el.getBoundingClientRect();
      const range = totalRange();
      // 0 = element fully below viewport, 1 = fully scrolled past
      const progress = Math.min(1, Math.max(0, 1 - (rect.bottom + window.innerHeight * 0.2) / range));
      progressRef.current(progress);
    };

    const schedule = () => {
      if (!rafRef.current) rafRef.current = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return ref;
};

export default useScrollProgress;
