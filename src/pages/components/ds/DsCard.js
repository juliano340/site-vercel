import React from 'react';

const VARIANTS = {
  default: 'mono-card',
  interactive: 'mono-card-interactive',
  featured: 'mono-card-interactive',
};

// Card variants: default / interactive / featured.
// Featured = interactive + top edge. Nothing else.
const Card = ({ variant = 'default', children, className = '', style = {}, ...props }) => (
  <div
    className={`${VARIANTS[variant] || VARIANTS.default} ${className}`.trim()}
    style={variant === 'featured' ? { borderTop: '2px solid var(--color-text)', ...style } : style}
    {...props}
  >
    {children}
  </div>
);

export default Card;
