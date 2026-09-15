import { useState, useEffect, useRef } from 'react';

// Scroll-reveal primitive. Timing comes from motion tokens
// (--motion-duration-slow / --motion-ease-standard), so the whole
// site's entrance feel is tuned in one place (globals.css).
// Honors prefers-reduced-motion: content appears instantly.
const Reveal = ({ children, delay = 0, className = '', style = {} }) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(var(--motion-reveal-distance))',
        transition:
          `opacity var(--motion-duration-slow) var(--motion-ease-standard) ${delay}s, ` +
          `transform var(--motion-duration-slow) var(--motion-ease-standard) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Reveal;
