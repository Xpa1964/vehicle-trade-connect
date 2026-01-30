import React, { memo } from 'react';
import { useStaticImage } from '@/hooks/useStaticImage';
import ServiceCard, { ServiceCardProps } from './ServiceCard';

interface RegistryServiceCardProps extends Omit<ServiceCardProps, 'backgroundImage'> {
  /** Static Image Registry id (e.g. "services.showroom") */
  imageId: string;
  /** Optional fallback (legacy) */
  fallbackBackgroundImage?: string;
}

const RegistryServiceCard: React.FC<RegistryServiceCardProps> = memo(({
  imageId,
  fallbackBackgroundImage,
  ...rest
}) => {
  const { src } = useStaticImage(imageId);

  return (
    <ServiceCard
      {...rest}
      backgroundImage={src || fallbackBackgroundImage}
    />
  );
});

RegistryServiceCard.displayName = 'RegistryServiceCard';

export default RegistryServiceCard;
