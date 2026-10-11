import useInView from '@/lib/useInView';

// Scroll-reveal primitive with variants:
//   'up'   — rise from below (default)
//   'fade' — plain opacity
//   'blur' — futuristic: blur + slight rise
//   'left' / 'right' — lateral slide
// Timing comes from motion tokens in globals.css, so the whole
// site's entrance feel is tuned in one place.
// Honors prefers-reduced-motion (hook): content appears instantly.
const VARIANT_STYLES = {
  up: {
    hidden: 'translateY(var(--motion-reveal-distance))',
    blur: '0',
  },
  fade: {
    hidden: 'translateY(0)',
    blur: '0',
  },
  blur: {
    hidden: 'translateY(calc(var(--motion-reveal-distance) / 2))',
    blur: 'var(--motion-blur)',
  },
  left: {
    hidden: 'translateX(calc(var(--motion-reveal-distance) * 1.5))',
    blur: '0',
  },
  right: {
    hidden: 'translateX(calc(var(--motion-reveal-distance) * -1.5))',
    blur: '0',
  },
};

const Reveal = ({
  children,
  delay = 0,
  variant = 'up',
  className = '',
  style = {},
  threshold,
  rootMargin,
}) => {
  const [ref, isVisible] = useInView({ threshold, rootMargin });
  const v = VARIANT_STYLES[variant] || VARIANT_STYLES.up;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0, 0)' : v.hidden,
        filter: isVisible ? 'blur(0)' : v.blur,
        transition:
          `opacity var(--motion-duration-slow) var(--motion-ease-cinematic) ${delay}s, ` +
          `transform var(--motion-duration-slow) var(--motion-ease-cinematic) ${delay}s, ` +
          `filter var(--motion-duration-slow) var(--motion-ease-cinematic) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Reveal;
