import { useState, useEffect, useRef } from 'react';

const Reveal = ({ children, delay = 0, className = '', style = {} }) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

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
        transform: visible ? 'translateY(0)' : 'translateY(18px)',
        transition: `opacity 0.45s cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}s, transform 0.45s cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Reveal;
