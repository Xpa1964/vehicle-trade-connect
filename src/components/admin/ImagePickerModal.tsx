/**
 * ImagePickerModal Component
 * 
 * Modal for selecting an existing image from storage and copying it to another slot.
 * Allows reusing AI-generated or uploaded images across different registry entries.
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Loader2, 
  Check, 
  Copy, 
  ImageIcon,
  RefreshCw,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { STATIC_IMAGE_REGISTRY, StaticImageEntry, ImageCategory } from '@/config/staticImageRegistry';

const CATEGORY_LABELS: Record<ImageCategory, string> = {
  home: 'Home',
  layout: 'Layout',
  dashboard: 'Dashboard',
  auth: 'Auth',
  messaging: 'Mensajes',
  legal: 'Legal',
  services: 'Servicios',
  marketing: 'Marketing'
};

const CATEGORY_COLORS: Record<ImageCategory, string> = {
  home: 'bg-blue-500/20 text-blue-400',
  layout: 'bg-purple-500/20 text-purple-400',
  dashboard: 'bg-amber-500/20 text-amber-400',
  auth: 'bg-green-500/20 text-green-400',
  messaging: 'bg-cyan-500/20 text-cyan-400',
  legal: 'bg-gray-500/20 text-gray-400',
  services: 'bg-pink-500/20 text-pink-400',
  marketing: 'bg-orange-500/20 text-orange-400'
};

interface StorageImage {
  id: string;
  entry: StaticImageEntry;
  url: string | null;
  storagePath: string | null;
  hasStorageImage: boolean;
}

const getExtFromContentType = (contentType: string | null | undefined): string => {
  const ct = (contentType || '').toLowerCase();
  if (ct.includes('image/png')) return 'png';
  if (ct.includes('image/jpeg') || ct.includes('image/jpg')) return 'jpg';
  if (ct.includes('image/webp')) return 'webp';
  if (ct.includes('image/gif')) return 'gif';
  return 'png';
};

const getExtFromUrl = (url: string): string => {
  try {
    const u = new URL(url, window.location.origin);
    const last = u.pathname.split('/').pop() || '';
    const ext = last.includes('.') ? last.split('.').pop() : '';
    return (ext || 'png').toLowerCase();
  } catch {
    const cleaned = url.split('?')[0];
    const last = cleaned.split('/').pop() || '';
    const ext = last.includes('.') ? last.split('.').pop() : '';
    return (ext || 'png').toLowerCase();
  }
};

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetImage: StaticImageEntry;
  onImageCopied: () => void;
}

const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
  isOpen,
  onClose,
  targetImage,
  onImageCopied
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isCopying, setIsCopying] = useState(false);
  const [availableImages, setAvailableImages] = useState<StorageImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<StorageImage | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [reloadToken, setReloadToken] = useState(0);

  // Load all images from registry (and check storage for existing)
  useEffect(() => {
    if (!isOpen) return;
    
    const loadAllRegistryImages = async () => {
      setIsLoading(true);
      setSelectedImage(null);
      
      try {
        const images: StorageImage[] = [];
        const registryEntries = Object.values(STATIC_IMAGE_REGISTRY).filter(
          img => img.aiEditable && img.id !== targetImage.id
        );

        // Check each registry entry for existing storage images
        for (const entry of registryEntries) {
          const storagePrefix = entry.id.replace(/\./g, '/');
          
          const { data: files, error } = await supabase.storage
            .from('static-images')
            .list(storagePrefix, {
              limit: 1,
              sortBy: { column: 'created_at', order: 'desc' }
            });

          if (!error && files && files.length > 0 && files[0].metadata) {
            const latestFile = files[0];
            const storagePath = `${storagePrefix}/${latestFile.name}`;
            
            const { data: { publicUrl } } = supabase.storage
              .from('static-images')
              .getPublicUrl(storagePath);
            
            images.push({
              id: entry.id,
              entry,
              url: `${publicUrl}?v=${encodeURIComponent(latestFile.name)}`,
              storagePath,
              hasStorageImage: true
            });
          } else {
            // Add registry entry with fallback image
            images.push({
              id: entry.id,
              entry,
              url: entry.currentPath.startsWith('src/') 
                ? `/${entry.currentPath}` 
                : entry.currentPath,
              storagePath: null,
              hasStorageImage: false
            });
          }
        }

        // Sort: entries WITH storage images first, then by ID
        images.sort((a, b) => {
          if (a.hasStorageImage && !b.hasStorageImage) return -1;
          if (!a.hasStorageImage && b.hasStorageImage) return 1;
          return a.id.localeCompare(b.id);
        });

        setAvailableImages(images);
      } catch (err) {
        console.error('Error loading registry images:', err);
        toast.error('Error al cargar imágenes disponibles');
      } finally {
        setIsLoading(false);
      }
    };

    loadAllRegistryImages();
  }, [isOpen, targetImage.id, reloadToken]);

  // Filter images by search query
  const filteredImages = useMemo(() => {
    if (!searchQuery.trim()) return availableImages;
    
    const query = searchQuery.toLowerCase();
    return availableImages.filter(img => 
      img.id.toLowerCase().includes(query) ||
      img.entry.purpose.toLowerCase().includes(query) ||
      CATEGORY_LABELS[img.entry.category].toLowerCase().includes(query)
    );
  }, [availableImages, searchQuery]);

  // Copy selected image to target slot
  const handleCopyImage = async () => {
    if (!selectedImage) return;
    
    setIsCopying(true);
    try {
      // 1) Obtain source data
      let sourceData: Blob;
      let sourceContentType: string | null = null;

      if (selectedImage.hasStorageImage && selectedImage.storagePath) {
        // Download from storage
        const { data, error: downloadError } = await supabase.storage
          .from('static-images')
          .download(selectedImage.storagePath);

        if (downloadError) throw downloadError;
        if (!data) throw new Error('No se pudo descargar la imagen de origen');

        sourceData = data;
        sourceContentType = (data as any)?.type || null;
      } else {
        // Fetch from original registry URL (e.g. /images/* or /lovable-uploads/*)
        if (!selectedImage.url) {
          throw new Error('La imagen seleccionada no tiene una URL válida');
        }

        const res = await fetch(selectedImage.url, { cache: 'no-store' });
        if (!res.ok) {
          throw new Error(`No se pudo obtener la imagen original (${res.status})`);
        }

        sourceContentType = res.headers.get('content-type');
        sourceData = await res.blob();
      }

      // Upload to target location
      const targetPrefix = targetImage.id.replace(/\./g, '/');
      const ext = selectedImage.hasStorageImage && selectedImage.storagePath
        ? (selectedImage.storagePath.split('.').pop() || 'png')
        : getExtFromContentType(sourceContentType) || getExtFromUrl(selectedImage.url || '');
      const fileName = `${Date.now()}.${ext}`;
      const targetPath = `${targetPrefix}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('static-images')
        .upload(targetPath, sourceData, {
          cacheControl: '0',
          upsert: true,
          contentType: sourceContentType || undefined,
        });

      if (uploadError) throw uploadError;

      toast.success(`Imagen copiada a ${targetImage.id}`);
      onImageCopied();
      onClose();
    } catch (err: any) {
      console.error('Error copying image:', err);
      toast.error(err.message || 'Error al copiar imagen');
    } finally {
      setIsCopying(false);
    }
  };

  const handleRefresh = () => {
    setReloadToken((x) => x + 1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5 text-primary" />
            Copiar imagen existente
          </DialogTitle>
          <DialogDescription>
            Selecciona una imagen ya generada para usarla en <code className="text-primary">{targetImage.id}</code>
          </DialogDescription>
        </DialogHeader>

        {/* Search and actions */}
        <div className="flex items-center gap-3 py-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por ID, categoría o propósito..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Image grid */}
        <ScrollArea className="flex-1 min-h-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-3 text-muted-foreground">Cargando imágenes...</span>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <ImageIcon className="h-12 w-12 mb-3 opacity-40" />
              <p className="text-sm">
                {availableImages.length === 0 
                  ? 'No hay imágenes generadas aún'
                  : 'No se encontraron imágenes con ese criterio'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-1">
              {filteredImages.map((img) => (
                <div
                  key={img.id}
                  className={`
                    relative group cursor-pointer rounded-lg border-2 transition-all overflow-hidden
                    ${selectedImage?.id === img.id 
                      ? 'border-primary ring-2 ring-primary/30' 
                      : 'border-border hover:border-primary/50'
                    }
                    ${!img.hasStorageImage ? 'opacity-80' : ''}
                  `}
                  onClick={() => img.url && setSelectedImage(img)}
                  title={!img.hasStorageImage ? 'Sin imagen en storage - se copiará desde el original' : img.entry.purpose}
                >
                  {/* Image */}
                  <div className="aspect-video bg-muted">
                    {img.url ? (
                      <img
                        src={img.url}
                        alt={img.entry.purpose}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>

                  {/* Selection indicator */}
                  {selectedImage?.id === img.id && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="h-4 w-4" />
                    </div>
                  )}

                  {/* No storage badge */}
                  {!img.hasStorageImage && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="text-[9px] bg-muted/90">
                        Original
                      </Badge>
                    </div>
                  )}

                  {/* Info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <code className="text-[10px] text-white/90 block truncate">
                      {img.id}
                    </code>
                    <Badge 
                      variant="outline" 
                      className={`text-[9px] mt-1 ${CATEGORY_COLORS[img.entry.category]} border-0`}
                    >
                      {CATEGORY_LABELS[img.entry.category]}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {availableImages.filter(i => i.hasStorageImage).length} con imagen / {availableImages.length} total
            {selectedImage && (
              <span className="text-primary ml-2">
                • Seleccionada: {selectedImage.id}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              onClick={handleCopyImage}
              disabled={!selectedImage || isCopying}
            >
              {isCopying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Copiando...
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar a {targetImage.id}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePickerModal;
