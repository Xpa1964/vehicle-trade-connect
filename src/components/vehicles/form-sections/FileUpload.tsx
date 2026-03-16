import React, { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { UseFormReturn } from 'react-hook-form';
import { VehicleFormData } from '@/types/vehicle';
import { SingleImageUpload } from './file-upload/SingleImageUpload';
import { BulkImageUpload } from './file-upload/BulkImageUpload';
import { MultipleImageUpload } from './file-upload/MultipleImageUpload';
import { ImagePreviewGrid } from './file-upload/ImagePreviewGrid';
import { ImageEditor } from './file-upload/ImageEditor';
import { useImageUpload } from './file-upload/useImageUpload';
import { FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormLabel } from '@/components/ui/form';

interface FileUploadProps {
  form: UseFormReturn<VehicleFormData>;
  onImageChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl?: string | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  form,
  onImageChange,
}) => {
  const { t } = useLanguage();
  const {
    selectedImages,
    handleSingleImageUpload,
    handleBulkImageUpload,
    handleMultipleImagesUpload,
    handleRemoveImage,
    handleSetPrimary,
    handleReorderImages,
  } = useImageUpload(form, onImageChange);
  const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null);

  const additionalFilesValue = form.watch('additionalFiles');
  const additionalFiles = useMemo(() => {
    if (!additionalFilesValue) return [] as File[];
    return Array.isArray(additionalFilesValue)
      ? additionalFilesValue.filter((file): file is File => file instanceof File)
      : Array.from(additionalFilesValue);
  }, [additionalFilesValue]);

  const handleEditImage = (index: number) => {
    setEditingImageIndex(index);
  };

  const handleSaveEdit = () => {
    setEditingImageIndex(null);
  };

  const handleCancelEdit = () => {
    setEditingImageIndex(null);
  };

  const handleAdditionalFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    form.setValue('additionalFiles', files.length > 0 ? (files as VehicleFormData['additionalFiles']) : undefined, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleRemoveAdditionalFile = (index: number) => {
    const updatedFiles = additionalFiles.filter((_, fileIndex) => fileIndex !== index);
    form.setValue('additionalFiles', updatedFiles.length > 0 ? (updatedFiles as VehicleFormData['additionalFiles']) : undefined, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  return (
    <div className="space-y-6 min-h-[600px]">
      <div>
        <h3 className="text-lg font-bold mb-4">{t('vehicles.vehicleImages')}</h3>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <SingleImageUpload onImageUpload={handleSingleImageUpload} />
          <BulkImageUpload onImagesUpload={handleBulkImageUpload} />

          {selectedImages.length > 0 && (
            <p className="text-sm text-muted-foreground ml-2">
              {selectedImages.length} {t('vehicles.images').toLowerCase()}
            </p>
          )}
        </div>

        {editingImageIndex !== null && selectedImages[editingImageIndex] && (
          <ImageEditor
            image={selectedImages[editingImageIndex]}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
          />
        )}

        {selectedImages.length === 0 ? (
          <MultipleImageUpload
            onImagesUpload={handleMultipleImagesUpload}
            currentImageCount={selectedImages.length}
          />
        ) : (
          <div className="space-y-4">
            <ImagePreviewGrid
              images={selectedImages}
              onReorder={handleReorderImages}
              onRemove={handleRemoveImage}
              onSetPrimary={handleSetPrimary}
              onEdit={handleEditImage}
            />

            {selectedImages.length < 25 && (
              <div className="border border-dashed rounded-lg p-4">
                <MultipleImageUpload
                  onImagesUpload={handleMultipleImagesUpload}
                  currentImageCount={selectedImages.length}
                />
              </div>
            )}
          </div>
        )}

        <p className="text-sm text-muted-foreground mt-2">
          {t('vehicles.imageTips')}
        </p>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4">{t('vehicles.additionalFiles')}</h3>
        <div className="space-y-2">
          <FormLabel>{t('vehicles.allowedFileTypes')}</FormLabel>
          <Input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx"
            onChange={handleAdditionalFilesChange}
          />
        </div>

        {additionalFiles.length > 0 && (
          <div className="mt-2">
            <p className="text-sm">
              {additionalFiles.length} {t('vehicles.files').toLowerCase()}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              {additionalFiles.map((file, index) => (
                <div key={`${file.name}-${index}`} className="flex items-center gap-2 p-2 rounded-md bg-muted border border-border">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm truncate flex-1 text-foreground">{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleRemoveAdditionalFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};