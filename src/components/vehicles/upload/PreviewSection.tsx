
import { useLanguage } from '@/contexts/LanguageContext';
import { VehicleFormData } from '@/types/vehicle';

export interface PreviewSectionProps {
  previewData: VehicleFormData[];
  hasImages?: boolean; // Added this prop to fix the TypeScript error
}

export const PreviewSection = ({ previewData, hasImages }: PreviewSectionProps) => {
  const { t } = useLanguage();

  if (previewData.length === 0) return null;

  return (
    <div className="border rounded p-4">
      <h3 className="font-medium mb-2">{t('vehicles.previewVehicles')}</h3>
      <div className="space-y-2">
        {previewData.map((vehicle, index) => (
          <div key={index} className="text-sm">
            {vehicle.brand} {vehicle.model} {vehicle.year}
            {hasImages && <span className="ml-2 text-green-500 text-xs">{t('vehicles.withImages')}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};
