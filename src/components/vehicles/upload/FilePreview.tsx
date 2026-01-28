
import { Images, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface FilePreviewProps {
  file: File | null;
  images: FileList | null;
  previewImages: string[];
}

export const FilePreview = ({ file, images, previewImages }: FilePreviewProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      {file && (
        <div className="text-sm">
          <span className="font-medium">Archivo seleccionado:</span> {file.name}
        </div>
      )}

      {images && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">{t('vehicles.preview')}:</h4>
          <div className="grid grid-cols-3 gap-2">
            {previewImages.map((url, i) => (
              <div 
                key={i} 
                className="aspect-square rounded-md overflow-hidden border relative"
              >
                <img 
                  src={url} 
                  alt={`Preview ${i+1}`}
                  className="w-full h-full object-cover"
                />
                {i === 0 && (
                  <div className="bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 absolute top-0 left-0 m-1 rounded">
                    Principal
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {images.length > 3 ? `+${images.length - 3} imágenes más` : ''}
          </p>
          <div className="mt-2 text-sm text-green-600 font-medium">
            {images.length} imágenes seleccionadas
          </div>
        </div>
      )}
    </div>
  );
};
