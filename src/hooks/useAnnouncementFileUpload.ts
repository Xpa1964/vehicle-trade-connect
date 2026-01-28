import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { fileNameGenerator } from '@/utils/fileNameGenerator';

interface UploadResult {
  success: boolean;
  attachment?: {
    id: string;
    file_name: string;
    file_type: string;
    file_size: number;
    storage_path: string;
  };
  error?: string;
}

/**
 * Hook para subida de archivos de anuncios
 * Replica exactamente la lógica del sistema de vehículos
 */
export const useAnnouncementFileUpload = () => {
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File, announcementId: string): Promise<UploadResult> => {
    setUploading(true);
    
    try {
      console.log('📁 Subiendo archivo para anuncio:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        announcementId
      });

      // INTERCEPTOR PRE-OPERACIÓN: Validación agresiva de sesión
      console.log('🔐 [UPLOAD] Activando interceptor de sesión para subida de archivo...');
      const { ensureValidSession, validateUserSession, handleRLSError, logSessionState } = await import('@/utils/sessionValidation');
      
      // Log estado actual
      await logSessionState('Antes de subir archivo');
      
      // Usar interceptor que garantiza sesión válida
      const sessionValid = await ensureValidSession();
      if (!sessionValid) {
        throw new Error('No se pudo validar la sesión para subir archivos. Recarga la página e inicia sesión nuevamente.');
      }
      
      // Validación adicional para obtener userId
      const validation = await validateUserSession();
      if (!validation.isValid) {
        console.error('❌ [UPLOAD] Validación final de sesión falló:', validation.error);
        throw new Error(validation.error || 'Sesión inválida después de interceptor');
      }
      
      console.log('✅ [UPLOAD] Interceptor completado, sesión válida confirmada para subida');

      // Validaciones básicas
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
        'text/csv',
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp'
      ];

      if (!allowedTypes.includes(file.type)) {
        throw new Error('Tipo de archivo no permitido');
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        throw new Error('El archivo es demasiado grande. Máximo 10MB.');
      }

      if (file.size === 0) {
        throw new Error('El archivo está vacío');
      }

      // Generar nombre único y sanitizado usando FileNameGenerator
      const sanitizedFileName = fileNameGenerator.generateUniqueFileName(file.name, announcementId);
      const filePath = fileNameGenerator.generateStoragePath(sanitizedFileName, announcementId);

      // Subida a Supabase Storage (bucket correcto)
      const { data, error } = await supabase.storage
        .from('announcement_attachments')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading file:', error);
        throw new Error(error.message);
      }

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from('announcement_attachments')
        .getPublicUrl(filePath);

      // Crear registro en announcement_attachments con userId validado
      const { data: attachmentData, error: attachmentError } = await supabase
        .from('announcement_attachments')
        .insert({
          announcement_id: announcementId,
          user_id: validation.userId!, // Usar el userId validado
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          storage_path: filePath
        })
        .select()
        .single();

      if (attachmentError) {
        console.error('❌ [UPLOAD] Error creating attachment record:', attachmentError);
        const userFriendlyError = handleRLSError(attachmentError);
        throw new Error(userFriendlyError);
      }

      console.log('✅ Archivo y registro creados exitosamente:', {
        path: data.path,
        publicUrl: urlData.publicUrl,
        attachmentId: attachmentData.id
      });

      return {
        success: true,
        attachment: {
          id: attachmentData.id,
          file_name: attachmentData.file_name,
          file_type: attachmentData.file_type,
          file_size: attachmentData.file_size,
          storage_path: attachmentData.storage_path
        }
      };

    } catch (error) {
      console.error('Error en subida de archivo:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      toast.error(`Error al subir archivo: ${errorMessage}`);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadFile,
    uploading
  };
};