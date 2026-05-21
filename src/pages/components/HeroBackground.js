const HeroBackground = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Base dark background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'var(--color-background)',
        }}
      />

      {/* Animated gradient mesh - subtle aurora effect */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(var(--accent-rgb), 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(var(--accent-rgb), 0.05) 0%, transparent 40%),
            radial-gradient(ellipse at 40% 80%, rgba(0, 177, 64, 0.06) 0%, transparent 45%)
          `,
          animation: 'gradientShift 20s ease-in-out infinite',
          backgroundSize: '200% 200%',
        }}
      />

      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(var(--accent-rgb), 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(var(--accent-rgb), 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Vignette overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, var(--color-shadow) 100%)',
        }}
      />

      {/* CSS Animation keyframes */}
      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          25% {
            background-position: 100% 0%;
          }
          50% {
            background-position: 100% 100%;
          }
          75% {
            background-position: 0% 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroBackground;
