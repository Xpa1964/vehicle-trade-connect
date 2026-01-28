
import React from 'react';
import { cn } from '@/lib/utils';

interface SimpleImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'fetchPriority'> {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  fetchpriority?: 'high' | 'low' | 'auto';
}

/**
 * Ultra-simple image component for critical images that need instant loading
 * No complex loading states, no multiple fallbacks, just fast rendering
 */
const SimpleImage: React.FC<SimpleImageProps> = ({
  src,
  alt,
  className,
  fallbackSrc = "/placeholder.svg",
  ...props
}) => {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (fallbackSrc && e.currentTarget.src !== fallbackSrc) {
      e.currentTarget.src = fallbackSrc;
    }
  };

  return (
    <img
      src={src}
      alt={alt}
      className={cn('w-full h-full', className)}
      onError={handleError}
      {...props}
    />
  );
};

export default SimpleImage;
