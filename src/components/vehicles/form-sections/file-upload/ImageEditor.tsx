
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/contexts/LanguageContext';
import { ImagePreview } from './types';

interface ImageEditorProps {
  image: ImagePreview;
  onSave: (editedImage: ImagePreview) => void;
  onCancel: () => void;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({
  image,
  onSave,
  onCancel
}) => {
  const { t } = useLanguage();
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);

  const handleSave = () => {
    // In a real implementation, you would apply the filters to create a new image
    // For now, we'll just pass back the original image
    onSave(image);
  };

  const filterStyle = {
    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {t('vehicles.editImage', { fallback: 'Editar Imagen' })}
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel}>
              {t('common.cancel', { fallback: 'Cancelar' })}
            </Button>
            <Button onClick={handleSave}>
              {t('common.save', { fallback: 'Guardar' })}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preview */}
          <div className="flex justify-center">
            <img 
              src={image.preview}
              alt="Editing preview"
              className="max-h-80 object-contain rounded-lg"
              style={filterStyle}
            />
          </div>
          
          {/* Controls */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('vehicles.brightness', { fallback: 'Brillo' })}: {brightness}%
              </label>
              <Slider
                value={[brightness]}
                onValueChange={(value) => setBrightness(value[0])}
                max={200}
                min={0}
                step={5}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('vehicles.contrast', { fallback: 'Contraste' })}: {contrast}%
              </label>
              <Slider
                value={[contrast]}
                onValueChange={(value) => setContrast(value[0])}
                max={200}
                min={0}
                step={5}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('vehicles.saturation', { fallback: 'Saturación' })}: {saturation}%
              </label>
              <Slider
                value={[saturation]}
                onValueChange={(value) => setSaturation(value[0])}
                max={200}
                min={0}
                step={5}
                className="w-full"
              />
            </div>
            
            <div className="pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => {
                  setBrightness(100);
                  setContrast(100);
                  setSaturation(100);
                }}
                className="w-full"
              >
                {t('vehicles.resetFilters', { fallback: 'Restablecer' })}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
