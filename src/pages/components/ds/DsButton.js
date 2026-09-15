import React from 'react';

const VARIANTS = {
  primary: 'mono-button-primary',
  secondary: 'mono-button-secondary',
  ghost:
    'mono-focus-ring inline-flex min-h-[2.75rem] items-center gap-2 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--color-accent)] underline-offset-4 hover:underline',
};

// Controlled variants only: primary / secondary / ghost.
// MUST: use this instead of inventing a new button style.
const Button = ({ variant = 'primary', href, children, className = '', ...props }) => {
  const cls = `${VARIANTS[variant] || VARIANTS.primary} ${className}`.trim();
  if (href) {
    return (
      <a href={href} className={cls} {...props}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={cls} {...props}>
      {children}
    </button>
  );
};

const IconButton = ({ children, label, className = '', ...props }) => (
  <button type="button" aria-label={label} className={`mono-focus-ring mono-icon-button p-2.5 ${className}`} {...props}>
    {children}
  </button>
);

export { Button, IconButton };
export default Button;
