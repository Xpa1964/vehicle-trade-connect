
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface BulkImageUploadProps {
  onImagesUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BulkImageUpload = ({ onImagesUpload }: BulkImageUploadProps) => {
  const { t } = useLanguage();
  
  return (
    <>
      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-2"
        onClick={() => document.getElementById('multipleImagesInput')?.click()}
      >
        <Upload size={16} />
        {t('vehicles.addMultipleImages', { fallback: 'Add Multiple Images' })}
      </Button>
      
      <input
        id="multipleImagesInput"
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={onImagesUpload}
      />
    </>
  );
};
