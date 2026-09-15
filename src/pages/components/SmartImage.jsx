import Image from 'next/image';
import { useState } from 'react';

const SmartImage = ({ alt, className = '', ...props }) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <span role="img" aria-label={alt} className={`flex items-center justify-center bg-surface p-4 text-sm text-muted ${className}`}>{alt}</span>;
  }

  return <Image {...props} alt={alt} className={className} onError={() => setFailed(true)} />;
};

export default SmartImage;
