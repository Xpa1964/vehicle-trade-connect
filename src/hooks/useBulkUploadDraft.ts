import { useState, useEffect, useCallback } from 'react';
import { VehicleFormData } from '@/types/vehicle';
import { ImageAssociation } from '@/utils/imageVehicleAssociator';
import { toast } from 'sonner';

const DRAFT_STORAGE_KEY = 'bulk_upload_draft';
const AUTO_SAVE_INTERVAL = 30000; // 30 segundos

export interface BulkUploadDraft {
  id: string;
  timestamp: number;
  vehicles: VehicleFormData[];
  imageAssociations: ImageAssociation[];
  fileName?: string;
}

/**
 * Hook para guardar y cargar borradores de carga masiva
 */
export const useBulkUploadDraft = () => {
  const [draft, setDraft] = useState<BulkUploadDraft | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  /**
   * Carga el borrador desde localStorage
   */
  const loadDraft = useCallback((): BulkUploadDraft | null => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!savedDraft) return null;

      const parsed = JSON.parse(savedDraft) as BulkUploadDraft;
      
      // Validar que el borrador no sea muy antiguo (más de 7 días)
      const ageInDays = (Date.now() - parsed.timestamp) / (1000 * 60 * 60 * 24);
      if (ageInDays > 7) {
        console.log('Draft is too old, removing it');
        localStorage.removeItem(DRAFT_STORAGE_KEY);
        return null;
      }

      console.log('Draft loaded successfully', {
        id: parsed.id,
        vehicles: parsed.vehicles.length,
        timestamp: new Date(parsed.timestamp).toLocaleString(),
      });

      return parsed;
    } catch (error) {
      console.error('Error loading draft:', error);
      return null;
    }
  }, []);

  /**
   * Guarda un borrador en localStorage
   */
  const saveDraft = useCallback(
    (vehicles: VehicleFormData[], imageAssociations: ImageAssociation[], fileName?: string) => {
      if (vehicles.length === 0) {
        console.log('No vehicles to save in draft');
        return;
      }

      try {
        const newDraft: BulkUploadDraft = {
          id: draft?.id || `draft_${Date.now()}`,
          timestamp: Date.now(),
          vehicles,
          imageAssociations,
          fileName,
        };

        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(newDraft));
        setDraft(newDraft);

        console.log('Draft saved successfully', {
          id: newDraft.id,
          vehicles: vehicles.length,
          images: imageAssociations.reduce((acc, a) => acc + a.images.length, 0),
        });

        return newDraft;
      } catch (error) {
        console.error('Error saving draft:', error);
        toast.error('No se pudo guardar el borrador');
      }
    },
    [draft?.id]
  );

  /**
   * Elimina el borrador actual
   */
  const deleteDraft = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setDraft(null);
      console.log('Draft deleted successfully');
      toast.success('Borrador eliminado');
    } catch (error) {
      console.error('Error deleting draft:', error);
      toast.error('No se pudo eliminar el borrador');
    }
  }, []);

  /**
   * Verifica si existe un borrador guardado
   */
  const hasDraft = useCallback((): boolean => {
    return !!localStorage.getItem(DRAFT_STORAGE_KEY);
  }, []);

  /**
   * Obtiene información del borrador sin cargarlo completamente
   */
  const getDraftInfo = useCallback((): {
    exists: boolean;
    vehicleCount?: number;
    timestamp?: number;
    fileName?: string;
  } => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!savedDraft) return { exists: false };

      const parsed = JSON.parse(savedDraft) as BulkUploadDraft;
      return {
        exists: true,
        vehicleCount: parsed.vehicles.length,
        timestamp: parsed.timestamp,
        fileName: parsed.fileName,
      };
    } catch {
      return { exists: false };
    }
  }, []);

  // Auto-guardado cada 30 segundos
  useEffect(() => {
    if (!autoSaveEnabled || !draft) return;

    const interval = setInterval(() => {
      if (draft.vehicles.length > 0) {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
        console.log('Auto-saved draft');
      }
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [draft, autoSaveEnabled]);

  // Cargar borrador al montar
  useEffect(() => {
    const loaded = loadDraft();
    if (loaded) {
      setDraft(loaded);
    }
  }, [loadDraft]);

  return {
    draft,
    saveDraft,
    loadDraft,
    deleteDraft,
    hasDraft,
    getDraftInfo,
    setAutoSaveEnabled,
    autoSaveEnabled,
  };
};
