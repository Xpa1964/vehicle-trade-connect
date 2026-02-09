import React, { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { FileText, Upload, AlertCircle, Image, FolderOpen, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { generateXLSXTemplate } from '@/utils/xlsxTemplateGenerator';

interface UploadFormProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage: string | null;
  previewData: any[];
  isUploading: boolean;
}

export const UploadForm = ({ 
  onFileChange, 
  onImageUpload, 
  errorMessage, 
  previewData,
  isUploading 
}: UploadFormProps) => {
  const { t, currentLanguage } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-4">
      <div>
        <Button
          variant="outline"
          onClick={() => generateXLSXTemplate(currentLanguage)}
          className="flex items-center gap-2 w-full md:w-auto"
        >
          <FileText className="w-4 h-4" />
          {t('vehicles.downloadTemplate')}
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          {t('vehicles.downloadTemplateDesc')}
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          {t('vehicles.uploadFile', { fallback: 'Subir Archivo XLSX' })}
        </label>
        <Input
          type="file"
          accept=".xlsx,.xls"
          onChange={onFileChange}
          disabled={isUploading}
          className="cursor-pointer"
        />
      </div>

      {previewData.length > 0 && (
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <Image className="h-4 w-4" />
            {t('vehicles.uploadImages', { fallback: 'Subir Imágenes (Opcional)' })}
          </label>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex-1"
            >
              <Upload className="mr-2 h-4 w-4" />
              {t('vehicles.selectFiles')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => folderInputRef.current?.click()}
              disabled={isUploading}
              className="flex-1"
            >
              <FolderOpen className="mr-2 h-4 w-4" />
              {t('vehicles.selectFolder')}
            </Button>
          </div>

          <Alert variant="warning" className="border-amber-500 bg-amber-50 dark:bg-amber-950/20">
            <Info className="h-5 w-5 text-amber-600" />
            <AlertTitle className="text-amber-900 dark:text-amber-100 font-bold text-base">
              📸 {t('vehicles.imageNamingTitle')}
            </AlertTitle>
            <AlertDescription className="text-amber-800 dark:text-amber-200 space-y-3 mt-2">
              <p className="text-sm">{t('vehicles.imageNamingInfo')}</p>
              <div className="space-y-2 text-sm bg-card p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-2">
                  <span className="font-semibold whitespace-nowrap">1️⃣ {t('vehicles.imageNamingByVin', { fallback: 'Por VIN:' })}</span>
                  <code className="text-xs bg-amber-100 dark:bg-amber-900 px-2 py-1 rounded">
                    {t('vehicles.imageNamingExampleVin')}
                  </code>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold whitespace-nowrap">2️⃣ {t('vehicles.imageNamingByPlate', { fallback: 'Por Matrícula:' })}</span>
                  <code className="text-xs bg-amber-100 dark:bg-amber-900 px-2 py-1 rounded">
                    {t('vehicles.imageNamingExamplePlate')}
                  </code>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold whitespace-nowrap">3️⃣ {t('vehicles.imageNamingByFolder', { fallback: 'Por Carpetas:' })}</span>
                  <code className="text-xs bg-amber-100 dark:bg-amber-900 px-2 py-1 rounded">
                    {t('vehicles.imageNamingExampleFolder')}
                  </code>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={onImageUpload}
            className="hidden"
          />
          <Input
            ref={folderInputRef}
            type="file"
            accept="image/*"
            {...({ webkitdirectory: "", directory: "" } as any)}
            multiple
            onChange={onImageUpload}
            className="hidden"
          />

          <p className="text-xs text-muted-foreground">
            {t('vehicles.uploadImagesHelper')}
          </p>
        </div>
      )}

      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t('common.error')}</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
