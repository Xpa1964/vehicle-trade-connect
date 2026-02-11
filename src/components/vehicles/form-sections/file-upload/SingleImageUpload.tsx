
import React from 'react';
import { Button } from '@/components/ui/button';
import { Image } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SingleImageUploadProps {
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SingleImageUpload = ({ onImageUpload }: SingleImageUploadProps) => {
  const { t } = useLanguage();
  
  return (
    <>
      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-2"
        onClick={() => document.getElementById('singleImageInput')?.click()}
      >
        <Image size={16} />
        {t('vehicles.addSingleImage', { fallback: 'Add Single Image' })}
      </Button>
      
      <input
        id="singleImageInput"
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.gif,.bmp,.tiff,.tif"
        className="hidden"
        onChange={onImageUpload}
      />
    </>
  );
};
