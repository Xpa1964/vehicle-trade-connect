
import { useState, useCallback } from 'react';
import { chatImagePersistence } from '@/services/chatImagePersistence';
import { toast } from 'sonner';

interface UploadResult {
  success: boolean;
  path?: string;
  url?: string;
  error?: string;
}

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  lastUploadedImage: string | null;
}

export const useChatImageUpload = () => {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    lastUploadedImage: null
  });

  const uploadImage = useCallback(async (
    imageData: string, 
    fileName?: string
  ): Promise<UploadResult> => {
    console.log('🚀 Iniciando upload de imagen desde chat');
    
    setState(prev => ({
      ...prev,
      isUploading: true,
      progress: 0,
      error: null
    }));

    try {
      // Simular progreso para UX
      setState(prev => ({ ...prev, progress: 25 }));
      
      // Usar el servicio de persistencia
      const result = await chatImagePersistence.persistChatImage(imageData, fileName);
      
      setState(prev => ({ ...prev, progress: 75 }));

      if (result.success) {
        setState(prev => ({
          ...prev,
          progress: 100,
          lastUploadedImage: result.url || null,
          isUploading: false
        }));

        toast.success('✅ Image saved successfully');
        
        // Guardar timestamp del último upload
        localStorage.setItem('last-image-upload', new Date().toISOString());
        
        return result;
      } else {
        throw new Error(result.error || 'Error desconocido');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      setState(prev => ({
        ...prev,
        isUploading: false,
        progress: 0,
        error: errorMessage
      }));

      toast.error(`❌ Error saving image: ${errorMessage}`);
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }, []);

  const resetState = useCallback(() => {
    setState({
      isUploading: false,
      progress: 0,
      error: null,
      lastUploadedImage: null
    });
  }, []);

  const getUploadStats = useCallback(() => {
    return chatImagePersistence.getStats();
  }, []);

  return {
    ...state,
    uploadImage,
    resetState,
    getUploadStats
  };
};
