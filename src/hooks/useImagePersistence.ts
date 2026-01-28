
import { useState, useCallback } from 'react';

interface ImagePersistenceResult {
  isProcessing: boolean;
  saveImageFromChat: (imageData: string, fileName: string) => Promise<string>;
  error: string | null;
}

export const useImagePersistence = (): ImagePersistenceResult => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveImageFromChat = useCallback(async (imageData: string, fileName: string): Promise<string> => {
    setIsProcessing(true);
    setError(null);

    try {
      // Convertir base64 a blob
      const response = await fetch(imageData);
      const blob = await response.blob();

      // Crear FormData para la subida
      const formData = new FormData();
      formData.append('file', blob, fileName);

      // Intentar guardar en el directorio público del proyecto
      const uploadResponse = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }

      const result = await uploadResponse.json();
      console.log('Image saved successfully:', result.path);
      
      return result.path;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error saving image from chat:', errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    isProcessing,
    saveImageFromChat,
    error,
  };
};
