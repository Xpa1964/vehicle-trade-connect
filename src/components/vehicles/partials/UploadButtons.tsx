
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
const loadXLSXTemplate = () => import('@/utils/xlsxTemplateGenerator').then(m => m.generateXLSXTemplate);

interface UploadButtonsProps {
  isUploading: boolean;
}

export const UploadButtons = ({ isUploading }: UploadButtonsProps) => {
  const { t, currentLanguage } = useLanguage();

  return (
    <div>
      <Button
        variant="outline"
        onClick={async () => { const gen = await loadXLSXTemplate(); gen(currentLanguage); }}
        className="flex items-center gap-2 w-full md:w-auto"
        disabled={isUploading}
      >
        <FileText className="w-4 h-4" />
        {t('vehicles.downloadTemplate')}
      </Button>
      <p className="text-sm text-muted-foreground mt-2">
        {t('vehicles.templateDownloadDescription') || 'Descarga la plantilla, completa los datos y súbela para una carga masiva.'}
      </p>
    </div>
  );
};
