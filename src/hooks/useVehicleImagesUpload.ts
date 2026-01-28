
import { vehicleImageServiceCore } from '@/services/vehicleImageServiceCore';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export const useVehicleImagesUpload = () => {
  const { t } = useLanguage();

  const handleImageUploads = async (images: FileList, vehicleId: string) => {
    console.log(`Processing ${images.length} images for upload with validation`);
    
    const result = await vehicleImageServiceCore.uploadMultipleImages(images, vehicleId, 0);
    
    // Mostrar advertencias si las hay
    if (result.warnings.length > 0) {
      console.warn('Upload warnings:', result.warnings);
      // Podrías mostrar las advertencias al usuario si lo deseas
      result.warnings.forEach(warning => {
        toast.warning(warning);
      });
    }
    
    // Mostrar errores si los hay
    if (result.errors.length > 0) {
      console.error('Upload errors:', result.errors);
      result.errors.forEach(error => {
        toast.error(error);
      });
    }
    
    // Mostrar resumen de optimización si hubo optimizaciones
    if ((result as any).optimizationSummary) {
      const { totalSavings, optimizedCount } = (result as any).optimizationSummary;
      const savingsKB = (totalSavings / 1024).toFixed(1);
      toast.success(
        `${optimizedCount} imágenes optimizadas. Espacio ahorrado: ${savingsKB}KB`
      );
    }
    
    // Mostrar resumen final
    if (result.successful.length > 0) {
      const message = `${result.successful.length}/${result.total} imágenes subidas exitosamente`;
      if (result.failed === 0) {
        toast.success(message);
      } else {
        toast.warning(message);
      }
    } else if (result.total > 0) {
      toast.error(`No se pudo subir ninguna imagen de ${result.total} intentadas`);
    }
    
    console.log(`Upload completed: ${result.successful.length}/${result.total} successful, ${result.failed} failed`);
    
    return result;
  };

  return { handleImageUploads };
};
