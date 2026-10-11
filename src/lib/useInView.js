import { useEffect, useRef, useState } from 'react';

// Shared IntersectionObserver hook. Honors prefers-reduced-motion.
// Returns [ref, isVisible]. Fires once by default.
// rootMargin default keeps reveals around 12% into the viewport so
// taller (desktop) windows reveal on scroll, not all at page load.
const DEFAULT_ROOT_MARGIN = '0px 0px -12% 0px';
const useInView = ({ threshold = 0.05, rootMargin = DEFAULT_ROOT_MARGIN, once = true } = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    // Under prefers-reduced-motion the observer keeps running: content
    // still enters as sections cross into view, just without motion —
    // the global 0.01ms transition rule makes each entrance an instant
    // flip. Tall viewports therefore still reveal progressively.

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, isVisible];
};

export default useInView;
