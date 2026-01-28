import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';
import SimpleImage from '@/components/shared/SimpleImage';
import { cn } from '@/lib/utils';

interface ImageIconProps {
  imageSrc?: string | null;
  fallbackSrc?: string;
  FallbackIcon: LucideIcon;
  alt: string;
  className?: string;
  isLoading?: boolean;
}

const ImageIcon: React.FC<ImageIconProps> = ({ 
  imageSrc, 
  fallbackSrc,
  FallbackIcon, 
  alt, 
  className,
  isLoading = false
}) => {
  const [imageError, setImageError] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleFallbackError = () => {
    setFallbackError(true);
  };

  // Show loading spinner if loading
  if (isLoading) {
    return (
      <div className={cn("p-4 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 animate-pulse", className)}>
        <div className="h-8 w-8 bg-blue-200 rounded animate-pulse"></div>
      </div>
    );
  }

  // Show icon if no image src or both image and fallback failed
  if (!imageSrc || (imageError && (fallbackError || !fallbackSrc))) {
    return (
      <div className={cn("p-4 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100", className)}>
        <FallbackIcon className="h-8 w-8 text-blue-600" />
      </div>
    );
  }

  // Show fallback image if primary failed but fallback exists
  if (imageSrc && imageError && fallbackSrc && !fallbackError) {
    return (
      <div className={cn("overflow-hidden rounded-full border border-blue-100", className)}>
        <SimpleImage
          src={fallbackSrc}
          alt={alt}
          className="w-full h-full object-cover"
          onError={handleFallbackError}
        />
      </div>
    );
  }

  // Show primary image if available
  if (imageSrc && !imageError) {
    return (
      <div className={cn("overflow-hidden rounded-full border border-blue-100", className)}>
        <SimpleImage
          src={imageSrc}
          alt={alt}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      </div>
    );
  }

  // Fallback to icon if nothing else works
  return (
    <div className={cn("p-4 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100", className)}>
      <FallbackIcon className="h-8 w-8 text-blue-600" />
    </div>
  );
};

export default ImageIcon;