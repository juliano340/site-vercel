import { useEffect, useRef, useState } from 'react';

const TYPE_MS = 30;
const ERASE_MS = 9;
const HOLD_MS = 3200;
const RESUME_MS = 450;
const START_DELAY_MS = 600;

const KEYWORD = 'text-[var(--color-accent)]';
const NAME = 'font-medium text-primary';
const KEY = 'text-muted';
const STRING = 'text-primary';
const PUNCT = 'text-[var(--color-dim)]';

const LINES = [
  [['const', KEYWORD], [' ', ''], ['juliano', NAME], [' ', ''], ['=', PUNCT], [' ', ''], ['{', PUNCT]],
  [['  ', ''], ['role', KEY], [':', PUNCT], ['  ', ''], ["'Desenvolvedor Full Stack'", STRING], [',', PUNCT]],
  [['  ', ''], ['stack', KEY], [':', PUNCT], [' ', ''], ['[', PUNCT], ["'TypeScript'", STRING], [',', PUNCT], [' ', ''], ["'Next.js'", STRING], [',', PUNCT], [' ', ''], ["'Node'", STRING], [']', PUNCT], [',', PUNCT]],
  [['  ', ''], ['foco', KEY], [':', PUNCT], ['  ', ''], ["'produtos com IA aplicada'", STRING], [',', PUNCT]],
  [['}', PUNCT]],
];

const FLAT = LINES.map((line) => {
  const chars = [];
  line.forEach(([text, cls]) => {
    for (const c of Array.from(text)) chars.push({ c, cls });
  });
  return chars;
});
const TOTAL = FLAT.reduce((sum, line) => sum + line.length, 0);

const HeroVisual = () => {
  const rootRef = useRef(null);
  const tiltRef = useRef(null);
  const timerRef = useRef(null);
  const visibleRef = useRef(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    const tiltEl = tiltRef.current;
    const canHover = window.matchMedia('(hover: hover)').matches;

    let n = 0;
    let growing = true;
    const step = () => {
      if (!visibleRef.current) {
        timerRef.current = setTimeout(step, RESUME_MS);
        return;
      }
      if (growing) {
        n += 1;
        setCount(n);
        if (n >= TOTAL) {
          growing = false;
          timerRef.current = setTimeout(step, HOLD_MS);
        } else {
          timerRef.current = setTimeout(step, TYPE_MS);
        }
      } else {
        n -= 1;
        setCount(n);
        if (n <= 0) {
          growing = true;
          timerRef.current = setTimeout(step, RESUME_MS);
        } else {
          timerRef.current = setTimeout(step, ERASE_MS);
        }
      }
    };
    timerRef.current = setTimeout(step, START_DELAY_MS);

    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
    });
    if (root) observer.observe(root);

    const onMove = (event) => {
      if (!tiltEl) return;
      const rect = tiltEl.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      tiltEl.style.transform = `perspective(1100px) rotateY(${(px * 5).toFixed(2)}deg) rotateX(${(py * -5).toFixed(2)}deg)`;
    };
    const onLeave = () => {
      if (tiltEl) tiltEl.style.transform = 'perspective(1100px) rotateY(0deg) rotateX(0deg)';
    };

    if (canHover && root) {
      root.addEventListener('mousemove', onMove);
      root.addEventListener('mouseleave', onLeave);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      observer.disconnect();
      if (root) {
        root.removeEventListener('mousemove', onMove);
        root.removeEventListener('mouseleave', onLeave);
      }
    };
  }, []);

  let caretLine = FLAT.length - 1;
  {
    let remaining = count;
    for (let li = 0; li < FLAT.length; li++) {
      if (remaining <= FLAT[li].length) {
        caretLine = li;
        break;
      }
      remaining -= FLAT[li].length;
    }
  }

  const lines = [];
  let remaining = count;
  for (let li = 0; li < FLAT.length; li++) {
    const lineChars = FLAT[li];
    const take = Math.max(0, Math.min(remaining, lineChars.length));
    remaining -= take;
    lines.push(
      <div key={li} className="whitespace-pre">
        {lineChars.slice(0, take).map((ch, ci) => (
          <span key={ci} className={ch.cls}>{ch.c}</span>
        ))}
        {caretLine === li && (
          <span
            aria-hidden="true"
            className="caret-blink -mb-[0.15em] ml-[1px] inline-block h-[1.05em] w-[0.5em] bg-[var(--color-accent)] align-baseline"
          />
        )}
      </div>
    );
  }

  return (
    <div ref={rootRef} aria-hidden="true" className="relative aspect-[4/3] w-full lg:aspect-auto lg:min-h-[460px]">
      <div
        ref={tiltRef}
        className="absolute inset-0 overflow-hidden border border-subtle bg-surface shadow-soft"
        style={{ transition: 'transform 300ms cubic-bezier(0.22, 0.61, 0.36, 1)', willChange: 'transform' }}
      >
        <div className="flex items-center gap-1.5 border-b border-subtle px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-dim)] opacity-50" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-dim)] opacity-50" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-dim)] opacity-50" />
          <span className="ml-2 font-mono text-xs text-muted">juliano.ts</span>
        </div>
        <div className="px-4 py-5 sm:px-5">
          <div className="w-full font-mono text-[11px] leading-6 sm:text-[13px] sm:leading-7">
            {lines}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroVisual;