import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car } from 'lucide-react';
import BackButton from '@/components/shared/BackButton';
import VehicleGalleryHero from '@/components/vehicles/VehicleGalleryHero';
import VehicleGalleryContent from '@/components/vehicles/VehicleGalleryContent';
import { useVehicleGallery } from '@/hooks/useVehicleGallery';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const VehicleGallery: React.FC = memo(() => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const vehicleGalleryData = useVehicleGallery();

  const handleBack = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <BackButton to={isAuthenticated ? '/dashboard' : '/'} label={isAuthenticated ? 'Panel de Control' : 'Inicio'} />
      </div>

      <VehicleGalleryHero />

      <VehicleGalleryContent {...vehicleGalleryData} isPublicView={!isAuthenticated} />
    </div>
  );
});

VehicleGallery.displayName = 'VehicleGallery';

export default VehicleGallery;
