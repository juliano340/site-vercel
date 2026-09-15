import React from 'react';

// Single content width for the whole site (mirrors --container-max).
// MUST: use this instead of ad-hoc max-w-* on section containers.
const Container = ({ children, className = '' }) => (
  <div className={`relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </div>
);

export default Container;
