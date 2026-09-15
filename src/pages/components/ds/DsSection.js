import React from 'react';
import Container from '@/pages/components/ds/DsContainer';

// Consistent section rhythm: spacing + tone handled here,
// so sections don't each invent their own paddings/backgrounds.
const Section = ({ id, tone = 'default', container = true, children, className = '', ...props }) => (
  <section
    id={id}
    className={`mono-section${tone === 'surface' ? ' mono-section-surface' : ''} ${className}`}
    {...props}
  >
    {container ? <Container>{children}</Container> : children}
  </section>
);

export default Section;
