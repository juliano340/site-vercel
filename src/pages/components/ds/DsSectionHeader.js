import React from 'react';

// Section language: eyebrow → title → rule → description.
// Use SectionHeader for standard sections; compose the parts
// directly only when a section needs a documented exception
// (e.g. Hero).

const Eyebrow = ({ children, className = '' }) => (
  <p className={`ds-label ${className}`}>{children}</p>
);

const SectionTitle = ({ as: Tag = 'h2', children, className = '' }) => (
  <Tag className={`ds-h2 ${className}`}>{children}</Tag>
);

const SectionDescription = ({ children, className = '' }) => (
  <p className={`ds-body-lg text-muted ${className}`}>{children}</p>
);

const SectionRule = ({ className = '' }) => (
  <div aria-hidden="true" className={`mono-section-rule ${className}`} />
);

const SectionHeader = ({
  eyebrow,
  title,
  description,
  titleAs = 'h2',
  align = 'center',
  rule = true,
  className = '',
}) => (
  <div className={`${align === 'center' ? 'mx-auto text-center' : 'text-left'} mb-12 max-w-2xl sm:mb-16 ${className}`}>
    {eyebrow ? <Eyebrow className="mb-3" /> : null}
    {title ? <SectionTitle as={titleAs}>{title}</SectionTitle> : null}
    {rule ? <SectionRule className={`${align === 'center' ? '' : 'mx-0'} mb-6`} /> : null}
    {description ? <SectionDescription>{description}</SectionDescription> : null}
  </div>
);

export { Eyebrow, SectionTitle, SectionDescription, SectionRule, SectionHeader };
export default SectionHeader;
