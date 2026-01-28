
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { UseFormReturn } from 'react-hook-form';
import { VehicleFormData } from '@/types/vehicle';

interface AdditionalFilesUploadProps {
  form: UseFormReturn<VehicleFormData>;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AdditionalFilesUpload = ({ 
  form, 
  onFileUpload 
}: AdditionalFilesUploadProps) => {
  const { t } = useLanguage();
  const [uploadingDocs, setUploadingDocs] = useState(false);

  const handleFileUploadWrapper = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadingDocs(true);
    onFileUpload(e);
    setUploadingDocs(false);
  };

  return (
    <FormField
      control={form.control}
      name="additionalFiles"
      render={({ field: { value, onChange, ...field } }) => (
        <FormItem>
          <FormLabel>{t('vehicles.additionalFiles')}</FormLabel>
          <div className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            <FormControl>
              <Input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                {...field}
                onChange={(e) => {
                  onChange(e.target.files);
                  handleFileUploadWrapper(e);
                }}
                disabled={uploadingDocs}
              />
            </FormControl>
          </div>
          {uploadingDocs && (
            <div className="text-sm text-muted-foreground mt-1">
              {t('common.uploading')}...
            </div>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            {t('vehicles.allowedFileTypes')}
          </p>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
