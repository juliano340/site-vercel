import React from 'react';

// Small metadata primitives. Badge = accent chip (status/category),
// Tag = muted tag (tech stack). Divider = thin section rule.
const Badge = ({ children, className = '' }) => (
  <span className={`mono-chip ${className}`}>{children}</span>
);

const Tag = ({ children, className = '' }) => (
  <span className={`mono-tag ${className}`}>{children}</span>
);

const Divider = ({ className = '' }) => (
  <div aria-hidden="true" className={`h-px w-full bg-subtle ${className}`} />
);

const TextLink = ({ children, className = '', ...props }) => (
  <a
    className={`mono-focus-ring inline-flex min-h-[2.75rem] items-center gap-1.5 text-sm font-medium text-[var(--color-accent)] underline-offset-4 hover:underline ${className}`}
    {...props}
  >
    {children}
  </a>
);

export { Badge, Tag, Divider, TextLink };
export default Badge;
