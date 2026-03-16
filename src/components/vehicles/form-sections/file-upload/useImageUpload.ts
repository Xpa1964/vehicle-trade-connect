import { useEffect, useState } from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';
import { VehicleFormData } from '@/types/vehicle';
import { ImagePreview } from './types';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

const normalizeImageFiles = (value?: FileList | File[]) => {
  if (!value) return [] as File[];
  return Array.isArray(value)
    ? value.filter((file): file is File => file instanceof File)
    : Array.from(value);
};

const createPreviewUrl = (file: File) => {
  try {
    return URL.createObjectURL(file);
  } catch {
    return '';
  }
};

const revokePreviewUrl = (url: string) => {
  if (url?.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

const areSameFiles = (images: ImagePreview[], files: File[]) => {
  if (images.length !== files.length) return false;

  return images.every((image, index) => {
    const file = files[index];
    return (
      image.file.name === file.name &&
      image.file.size === file.size &&
      image.file.lastModified === file.lastModified
    );
  });
};

export const useImageUpload = (
  form: UseFormReturn<VehicleFormData>,
  onImageChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
) => {
  const { t } = useLanguage();
  const watchedImages = useWatch({ control: form.control, name: 'images' });
  const [selectedImages, setSelectedImages] = useState<ImagePreview[]>([]);

  useEffect(() => {
    const files = normalizeImageFiles(watchedImages as FileList | File[] | undefined);

    setSelectedImages((previousImages) => {
      if (files.length === 0) {
        previousImages.forEach((image) => revokePreviewUrl(image.preview));
        return [];
      }

      if (areSameFiles(previousImages, files)) {
        return previousImages;
      }

      previousImages.forEach((image) => revokePreviewUrl(image.preview));

      return files.map((file, index) => ({
        file,
        preview: createPreviewUrl(file),
        isPrimary: index === 0,
      }));
    });
  }, [watchedImages]);

  const updateFormValue = (images: ImagePreview[]) => {
    try {
      if (images.length === 0) {
        form.setValue('images', undefined, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
        return;
      }

      const primaryImage = images.find((image) => image.isPrimary);
      const otherImages = images.filter((image) => !image.isPrimary);
      const orderedFiles = [primaryImage, ...otherImages]
        .filter((image): image is ImagePreview => Boolean(image))
        .map((image) => image.file);

      form.setValue('images', orderedFiles as VehicleFormData['images'], {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    } catch (error) {
      console.error('[useImageUpload] Error updating form value:', error);
    }
  };

  const addImageToCollection = (files: File[], forceFirstAsPrimary = false) => {
    try {
      const newImages = files.map((file, index) => ({
        file,
        preview: createPreviewUrl(file),
        isPrimary: (selectedImages.length === 0 && index === 0) || (forceFirstAsPrimary && index === 0),
      }));

      setSelectedImages((previousImages) => {
        const combinedImages = [...previousImages, ...newImages];
        updateFormValue(combinedImages);
        return combinedImages;
      });
    } catch (error) {
      console.error('[useImageUpload] Error adding images:', error);
    }
  };

  const handleSingleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    if (selectedImages.length >= 25) {
      toast.error(t('vehicles.maxImagesReached', { fallback: 'Máximo 25 imágenes permitidas' }));
      e.target.value = '';
      return;
    }

    addImageToCollection([e.target.files[0]], true);

    if (onImageChange) {
      onImageChange(e);
    }

    e.target.value = '';
  };

  const handleBulkImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);

    if (selectedImages.length + files.length > 25) {
      toast.error(t('vehicles.maxImagesReached', { fallback: 'Máximo 25 imágenes permitidas' }));
      e.target.value = '';
      return;
    }

    addImageToCollection(files);
    toast.success(t('vehicles.imagesAdded', {
      count: files.length,
      fallback: `${files.length} imágenes añadidas`
    }));

    e.target.value = '';
  };

  const handleMultipleImagesUpload = (files: File[]) => {
    if (selectedImages.length + files.length > 25) {
      toast.error(t('vehicles.maxImagesReached', { fallback: 'Máximo 25 imágenes permitidas' }));
      return;
    }

    addImageToCollection(files);
    toast.success(t('vehicles.imagesAdded', {
      count: files.length,
      fallback: `${files.length} imágenes añadidas`
    }));
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...selectedImages];
    const [removedImage] = updatedImages.splice(index, 1);

    if (removedImage) {
      revokePreviewUrl(removedImage.preview);
    }

    if (removedImage?.isPrimary && updatedImages.length > 0) {
      updatedImages[0].isPrimary = true;
    }

    setSelectedImages(updatedImages);
    updateFormValue(updatedImages);
    toast.info(t('vehicles.imageRemoved', { fallback: 'Imagen eliminada' }));
  };

  const handleSetPrimary = (index: number) => {
    const updatedImages = selectedImages.map((image, imageIndex) => ({
      ...image,
      isPrimary: imageIndex === index,
    }));

    setSelectedImages(updatedImages);
    updateFormValue(updatedImages);
    toast.success(t('vehicles.primaryImageSet', { fallback: 'Imagen principal establecida' }));
  };

  const handleReorderImages = (startIndex: number, endIndex: number) => {
    const items = Array.from(selectedImages);
    const [reorderedItem] = items.splice(startIndex, 1);
    items.splice(endIndex, 0, reorderedItem);

    setSelectedImages(items);
    updateFormValue(items);
    toast.success(t('vehicles.imagesReordered', { fallback: 'Imágenes reordenadas' }));
  };

  const setImagesFromUrls = async (images: { url: string; isPrimary: boolean }[]) => {
    try {
      const loadedImages = await Promise.all(
        images.map(async (image, index) => {
          const response = await fetch(image.url);
          const blob = await response.blob();
          const fileName = image.url.split('/').pop() || `image-${index}.jpg`;
          const file = new File([blob], fileName, { type: blob.type });

          return {
            file,
            preview: image.url,
            isPrimary: image.isPrimary,
          };
        })
      );

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
    setImagesFromUrls,
  };
};