
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { VehicleFormData } from '@/types/vehicle';
import { ImagePreview } from './types';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export const useImageUpload = (
  form: UseFormReturn<VehicleFormData>,
  onImageChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
) => {
  const { t } = useLanguage();
  const [selectedImages, setSelectedImages] = useState<ImagePreview[]>([]);

  // Handler for single image upload
  const handleSingleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    if (selectedImages.length >= 25) {
      toast.error(t('vehicles.maxImagesReached', { fallback: 'Máximo 25 imágenes permitidas' }));
      e.target.value = '';
      return;
    }
    
    const file = e.target.files[0];
    addImageToCollection([file], true); // La primera imagen siempre es principal
    
    if (onImageChange) {
      onImageChange(e);
    }
    
    e.target.value = '';
  };

  // Handler for bulk image upload (from input event)
  const handleBulkImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    
    if (selectedImages.length + files.length > 25) {
      toast.error(t('vehicles.maxImagesReached', { fallback: 'Máximo 25 imágenes permitidas' }));
      e.target.value = '';
      return;
    }
    
    addImageToCollection(files, false); // Las imágenes en lote no son principales por defecto
    toast.success(t('vehicles.imagesAdded', { 
      count: files.length, 
      fallback: `${files.length} imágenes añadidas` 
    }));
    
    e.target.value = '';
  };

  // Handler for multiple images upload (from File array)
  const handleMultipleImagesUpload = (files: File[]) => {
    if (selectedImages.length + files.length > 25) {
      toast.error(t('vehicles.maxImagesReached', { fallback: 'Máximo 25 imágenes permitidas' }));
      return;
    }
    
    addImageToCollection(files, false); // Las imágenes en lote no son principales por defecto
    toast.success(t('vehicles.imagesAdded', { 
      count: files.length, 
      fallback: `${files.length} imágenes añadidas` 
    }));
  };

  // Add images to collection
  const addImageToCollection = (files: File[], forceFirstAsPrimary: boolean = false) => {
    try {
      const newImages = files.map((file, index) => {
        const previewUrl = URL.createObjectURL(file);
        // La primera imagen es principal si no hay imágenes existentes O si se fuerza
        const isPrimary = (selectedImages.length === 0 && index === 0) || 
                         (forceFirstAsPrimary && index === 0);
        return { file, preview: previewUrl, isPrimary };
      });
      
      // Use functional update to avoid stale closure issues
      setSelectedImages(prev => {
        const combined = [...prev, ...newImages];
        // Update form value with the latest combined list
        updateFormValue(combined);
        return combined;
      });
    } catch (error) {
      console.error('❌ [useImageUpload] Error adding images:', error);
    }
  };

  // Handler to remove an image
  const handleRemoveImage = (index: number) => {
    const updatedImages = [...selectedImages];
    const removedImage = updatedImages.splice(index, 1)[0];
    
    URL.revokeObjectURL(removedImage.preview);
    
    // If removed image was primary, set first remaining as primary
    if (removedImage.isPrimary && updatedImages.length > 0) {
      updatedImages[0].isPrimary = true;
    }
    
    setSelectedImages(updatedImages);
    updateFormValue(updatedImages);
    
    toast.info(t('vehicles.imageRemoved', { fallback: 'Imagen eliminada' }));
  };

  // Handler to set an image as primary
  const handleSetPrimary = (index: number) => {
    const updatedImages = selectedImages.map((img, idx) => ({
      ...img,
      isPrimary: idx === index
    }));
    
    setSelectedImages(updatedImages);
    updateFormValue(updatedImages);
    
    toast.success(t('vehicles.primaryImageSet', { fallback: 'Imagen principal establecida' }));
  };

  // Handler for reordering images
  const handleReorderImages = (startIndex: number, endIndex: number) => {
    const items = Array.from(selectedImages);
    const [reorderedItem] = items.splice(startIndex, 1);
    items.splice(endIndex, 0, reorderedItem);
    
    setSelectedImages(items);
    updateFormValue(items);
    
    toast.success(t('vehicles.imagesReordered', { fallback: 'Imágenes reordenadas' }));
  };

  // Update form value with current images
  const updateFormValue = (images: ImagePreview[]) => {
    try {
      if (images.length === 0) {
        form.setValue('images', undefined);
        return;
      }

      const dataTransfer = new DataTransfer();
      
      // Add primary image first, then others
      const primaryImage = images.find(img => img.isPrimary);
      const otherImages = images.filter(img => !img.isPrimary);
      
      if (primaryImage) {
        dataTransfer.items.add(primaryImage.file);
      }
      
      otherImages.forEach(img => {
        dataTransfer.items.add(img.file);
      });
      
      form.setValue('images', dataTransfer.files);
    } catch (error) {
      console.error('❌ [useImageUpload] Error updating form value:', error);
    }
  };

  // Function to set images from existing URLs (for editing)
  const setImagesFromUrls = async (images: { url: string, isPrimary: boolean }[]) => {
    try {
      const imagePromises = images.map(async (image, index) => {
        const response = await fetch(image.url);
        const blob = await response.blob();
        const fileName = image.url.split('/').pop() || `image-${index}.jpg`;
        const file = new File([blob], fileName, { type: blob.type });
        return {
          file,
          preview: image.url,
          isPrimary: image.isPrimary
        };
      });
      
      const loadedImages = await Promise.all(imagePromises);
      setSelectedImages(loadedImages);
      updateFormValue(loadedImages);
      
      return true;
    } catch (error) {
      console.error('Error loading images from URLs:', error);
      return false;
    }
  };

  return {
    selectedImages,
    handleSingleImageUpload,
    handleBulkImageUpload,
    handleMultipleImagesUpload,
    handleRemoveImage,
    handleSetPrimary,
    handleReorderImages,
    setImagesFromUrls
  };
};
