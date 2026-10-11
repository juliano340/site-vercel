import Reveal from './Reveal';

// Header de seção no padrão do site: número à esquerda ("01") + label,
// título grande. Entrada em stagger via Reveal.
const SectionHeader = ({ number, label, title, description, className = '' }) => (
  <header className={`mb-12 ${className}`}>
    <Reveal>
      <p className="ds-label mb-3 flex items-center gap-3">
        <span
          className="inline-flex h-6 items-center rounded-full px-2 font-mono text-[0.65rem]"
          style={{
            background: 'rgba(var(--accent-rgb), 0.08)',
            color: 'var(--color-accent)',
            border: '1px solid rgba(var(--accent-rgb), 0.2)',
          }}
        >
          {number}
        </span>
        {label}
      </p>
    </Reveal>
    <Reveal delay={0.08}>
      <h2 className="ds-h1 max-w-2xl text-primary lg:text-3xl">{title}</h2>
    </Reveal>
    {description && (
      <Reveal delay={0.16}>
        <p className="ds-body mt-4 max-w-2xl text-muted">{description}</p>
      </Reveal>
    )}
  </header>
);

export default SectionHeader;
