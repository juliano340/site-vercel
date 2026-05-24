import React, { useState, useEffect } from 'react';

// Animated code-like grid background
const HeroBackground = () => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 150);
    return () => clearInterval(interval);
  }, []);

  const codeLines = [
    '> juliano340 init --dev fullstack',
    '> Loading: Next.js + TypeScript + AI...',
    '> Building solutions that ship fast...',
    '> Status: AVAILABLE_FOR_HIRE',
    '> Deploying to production...',
  ];

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #050505 0%, #0a1a00 30%, #080808 60%, #050505 100%)',
        }}
      />

      {/* Acid green glow blobs */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[120px]"
        style={{
          background: 'radial-gradient(circle, rgba(200,255,0,0.15) 0%, transparent 70%)',
          top: '10%', left: '-5%',
          opacity: 0.6,
          animation: 'blob 20s infinite',
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full blur-[100px]"
        style={{
          background: 'radial-gradient(circle, rgba(0,176,64,0.2) 0%, transparent 70%)',
          bottom: '5%', right: '-5%',
          opacity: 0.5,
          animation: 'blob2 25s infinite',
        }}
      />
      <div
        className="absolute w-[300px] h-[300px] rounded-full blur-[80px]"
        style={{
          background: 'radial-gradient(circle, rgba(184,238,0,0.12) 0%, transparent 70%)',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'blob3 18s infinite',
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(200,255,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200,255,0,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Floating code lines */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.04] pointer-events-none">
        {codeLines.map((line, i) => (
          <div
            key={i}
            className="font-mono text-[10px] leading-6 whitespace-nowrap"
            style={{
              color: '#C8FF00',
              animationDelay: `${i * 0.5}s`,
              transform: `translateX(${Math.sin(tick * 0.1 + i) * 10}px)`,
            }}
          >
            {line}
          </div>
        ))}
      </div>

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 pointer-events-none" style={{ opacity: 0.15 }}>
        <svg width="40" height="40" fill="none" stroke="#C8FF00" strokeWidth="1">
          <path d="M0 40V0H40" />
        </svg>
      </div>
      <div className="absolute top-4 right-4 pointer-events-none" style={{ opacity: 0.15 }}>
        <svg width="40" height="40" fill="none" stroke="#C8FF00" strokeWidth="1">
          <path d="M40 0V40H0" />
        </svg>
      </div>
      <div className="absolute bottom-4 left-4 pointer-events-none" style={{ opacity: 0.15 }}>
        <svg width="40" height="40" fill="none" stroke="#C8FF00" strokeWidth="1">
          <path d="M0 0V40H40" />
        </svg>
      </div>
      <div className="absolute bottom-4 right-4 pointer-events-none" style={{ opacity: 0.15 }}>
        <svg width="40" height="40" fill="none" stroke="#C8FF00" strokeWidth="1">
          <path d="M40 40V0H0" />
        </svg>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 30px) scale(0.9); }
        }
        @keyframes blob2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-40px, 40px) scale(1.2); }
          66% { transform: translate(30px, -30px) scale(0.8); }
        }
        @keyframes blob3 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.3); }
        }
      `}</style>
    </div>
  );
};

export default HeroBackground;
