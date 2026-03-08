
import React from 'react';
import { Input } from '@/components/ui/input';
import { AlertCircle, Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface FileInputsProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  showImagesInput: boolean;
}

export const FileInputs = ({ onFileChange, onImageUpload, isUploading, showImagesInput }: FileInputsProps) => {
  const { t } = useLanguage();

  const handleBeforeImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    // Check if any files are too large
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    const tooLargeFiles = Array.from(e.target.files).filter(file => file.size > maxSizeInBytes);
    
    if (tooLargeFiles.length > 0) {
      const fileText = tooLargeFiles.length === 1 
        ? t('validation.fileSizeExceeded')
        : t('validation.filesSizeExceeded');
      toast.warning(`${tooLargeFiles.length} ${fileText} ${t('validation.fileSizeLimit')}`);
    }

    // Check total number of files
    if (e.target.files.length > 25) {
      toast.warning(t('validation.maxImagesExceeded'));
    }
    
    // Check file types
    const allowedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const invalidFiles = Array.from(e.target.files).filter(file => !allowedFormats.includes(file.type));
    
    if (invalidFiles.length > 0) {
      const fileText = invalidFiles.length === 1 
        ? t('validation.fileUnsupported')
        : t('validation.filesUnsupported');
      toast.warning(`${invalidFiles.length} ${fileText} ${t('validation.supportedFormat')}`);
    }
    
    // Pass to the actual handler
    onImageUpload(e);
  };

  return (
    <>
      <div className="grid w-full items-center gap-1.5">
        <Input
          id="fileInput"
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={onFileChange}
          className="cursor-pointer"
          disabled={isUploading}
        />
        <p className="text-xs text-muted-foreground">
          {t('vehicles.acceptedFormats')}
        </p>
      </div>

      {showImagesInput && (
        <div className="grid w-full items-center gap-1.5">
          <label className="text-sm font-medium">
            {t('vehicles.vehicleImages')}
          </label>
          <Input
            id="imageInput"
            type="file"
            accept="image/*"
            multiple
            onChange={handleBeforeImageUpload}
            className="cursor-pointer"
            disabled={isUploading}
          />
          <div className="space-y-2 mt-1">
            <div className="flex items-center bg-amber-50 border border-amber-200 text-amber-800 px-3 py-2 rounded-md">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              <p className="text-xs font-medium">
                {t('vehicles.firstImageMain')}
              </p>
            </div>
            <div className="flex items-center bg-blue-50 border border-blue-200 text-blue-800 px-3 py-2 rounded-md">
              <Info className="h-4 w-4 mr-2 flex-shrink-0" />
              <p className="text-xs">
                {t('validation.imageConstraints')}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
