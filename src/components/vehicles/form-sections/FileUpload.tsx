
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
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
import { ImageOff, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  form: UseFormReturn<VehicleFormData>;
  onImageChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl?: string | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  form, 
  onImageChange,
  previewUrl 
}) => {
  const { t } = useLanguage();
  const { 
    selectedImages, 
    handleSingleImageUpload, 
    handleBulkImageUpload,
    handleMultipleImagesUpload, 
    handleRemoveImage, 
    handleSetPrimary,
    handleReorderImages
  } = useImageUpload(form, onImageChange);
  
  const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null);

  const handleEditImage = (index: number) => {
    setEditingImageIndex(index);
  };

  const handleSaveEdit = (editedImage: any) => {
    setEditingImageIndex(null);
    // Here you would update the image with the edits
  };

  const handleCancelEdit = () => {
    setEditingImageIndex(null);
  };

  return (
    <div className="space-y-6 min-h-[600px]">
      <div>
        <h3 className="text-lg font-bold mb-4">{t('vehicles.vehicleImages')}</h3>
        
        {/* Upload Controls */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <SingleImageUpload onImageUpload={handleSingleImageUpload} />
          <BulkImageUpload onImagesUpload={handleBulkImageUpload} />
          
          {selectedImages.length > 0 && (
            <p className="text-sm text-muted-foreground ml-2">
              {selectedImages.length} {t('vehicles.images').toLowerCase()}
            </p>
          )}
        </div>
        
        {/* Image Editor */}
        {editingImageIndex !== null && selectedImages[editingImageIndex] && (
          <ImageEditor
            image={selectedImages[editingImageIndex]}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
          />
        )}

        {/* Multiple Upload Area */}
        {selectedImages.length === 0 ? (
          <MultipleImageUpload
            onImagesUpload={handleMultipleImagesUpload}
            currentImageCount={selectedImages.length}
          />
        ) : (
          <div className="space-y-4">
            {/* Image Grid */}
            <ImagePreviewGrid
              images={selectedImages}
              onReorder={handleReorderImages}
              onRemove={handleRemoveImage}
              onSetPrimary={handleSetPrimary}
              onEdit={handleEditImage}
            />
            
            {/* Add More Images */}
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

      {/* Additional Files Section */}
      <div>
        <h3 className="text-lg font-bold mb-4">{t('vehicles.additionalFiles')}</h3>
        <FormField
          control={form.control}
          name="additionalFiles"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>{t('vehicles.allowedFileTypes')}</FormLabel>
              <FormControl>
                <Input
                  {...fieldProps}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  onChange={(e) => {
                    onChange(e.target.files);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {form.watch('additionalFiles') && form.watch('additionalFiles').length > 0 && (
          <div className="mt-2">
            <p className="text-sm">
              {form.watch('additionalFiles').length} {t('vehicles.files').toLowerCase()}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              {Array.from(form.watch('additionalFiles')).map((file, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-md bg-gray-50 border">
                  <FileText className="h-4 w-4 text-auto-blue" />
                  <span className="text-sm truncate flex-1">{file.name}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={() => {
                      const newFiles = Array.from(form.watch('additionalFiles'));
                      newFiles.splice(i, 1);
                      const dataTransfer = new DataTransfer();
                      newFiles.forEach(file => dataTransfer.items.add(file));
                      form.setValue('additionalFiles', dataTransfer.files);
                    }}
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
