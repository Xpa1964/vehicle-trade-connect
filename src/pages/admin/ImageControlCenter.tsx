/**
 * Image Control Center - Admin Page
 * 
 * Grid-based interface for managing ALL static product images.
 * Features:
 * - Grid display of all registered images
 * - Individual controls per image (delete, upload, AI generate)
 * - Global style prompt section
 * - Bulk actions (generate missing, delete all)
 */

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Wand2, 
  RefreshCw, 
  Settings,
  Loader2,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  AlertTriangle,
  Check,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { STATIC_IMAGE_REGISTRY, StaticImageEntry, ImageCategory } from '@/config/staticImageRegistry';
import { invalidateStaticImageCache } from '@/hooks/useStaticImage';
import ImageCard from '@/components/admin/ImageCard';
import ImageGenerationModal from '@/components/admin/ImageGenerationModal';
import ImagePickerModal from '@/components/admin/ImagePickerModal';

const GLOBAL_STYLE_KEY = 'imageControlCenter_globalStyle';
const ZOOM_LEVELS_KEY = 'imageControlCenter_zoomLevels';

const DEFAULT_GLOBAL_STYLE =
  'Dark, cinematic automotive marketplace style, premium lighting, high contrast, modern UI-friendly compositions, professional product photography aesthetic.';

const readStoredGlobalStyle = (): string | null => {
  try {
    const stored = localStorage.getItem(GLOBAL_STYLE_KEY);
    return stored && stored.trim() !== '' ? stored : null;
  } catch (e) {
    console.error('Error loading global style from localStorage:', e);
    return null;
  }
};

const getInitialGlobalStyle = (): string => readStoredGlobalStyle() ?? DEFAULT_GLOBAL_STYLE;

const CATEGORY_LABELS: Record<ImageCategory, string> = {
  home: 'Home Page',
  layout: 'Layout',
  dashboard: 'Dashboard',
  auth: 'Authentication',
  messaging: 'Messaging',
  legal: 'Legal',
  services: 'Services',
  marketing: 'Marketing'
};

const ImageControlCenter: React.FC = () => {
  // Global style prompt: persistent + locked by default (only editable when explicitly unlocked)
  const [globalStyle, setGlobalStyle] = useState<string>(() => getInitialGlobalStyle());
  const [globalStyleDirty, setGlobalStyleDirty] = useState(false);
  const [isGlobalStyleLocked, setIsGlobalStyleLocked] = useState(true);

  const handleUnlockGlobalStyle = useCallback(() => {
    setIsGlobalStyleLocked(false);
  }, []);

  const handleCancelGlobalStyleEdit = useCallback(() => {
    setGlobalStyle(getInitialGlobalStyle());
    setGlobalStyleDirty(false);
    setIsGlobalStyleLocked(true);
  }, []);

  // Zoom levels per image
  const [zoomLevels, setZoomLevels] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem(ZOOM_LEVELS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Image status tracking (loaded vs error)
  const [imageStatuses, setImageStatuses] = useState<Record<string, boolean>>({});

  // Forces cards to re-check storage after replace/upload/delete
  const [imageRefreshToken, setImageRefreshToken] = useState<Record<string, number>>({});
  const bumpImageRefresh = useCallback((imageId: string) => {
    setImageRefreshToken(prev => ({
      ...prev,
      [imageId]: (prev[imageId] || 0) + 1
    }));
  }, []);

  // Filter state
  const [categoryFilter, setCategoryFilter] = useState<ImageCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'with-image' | 'missing'>('all');

  // Modal state - Generation
  const [selectedImageForGeneration, setSelectedImageForGeneration] = useState<StaticImageEntry | null>(null);
  const [selectedImageCurrentUrl, setSelectedImageCurrentUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Modal state - Copy/Picker
  const [selectedImageForCopy, setSelectedImageForCopy] = useState<StaticImageEntry | null>(null);
  const [isPickerModalOpen, setIsPickerModalOpen] = useState(false);

  // Loading states
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
  const [uploadingImageId, setUploadingImageId] = useState<string | null>(null);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  // Test style state
  const [testCategory, setTestCategory] = useState<ImageCategory>('home');
  const [isTestingStyle, setIsTestingStyle] = useState(false);

  // Get all editable images
  const allImages = useMemo(() => {
    return Object.values(STATIC_IMAGE_REGISTRY)
      .filter(img => img.aiEditable)
      .sort((a, b) => {
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        return a.id.localeCompare(b.id);
      });
  }, []);

  // Filtered images
  const filteredImages = useMemo(() => {
    let result = allImages;
    
    if (categoryFilter !== 'all') {
      result = result.filter(img => img.category === categoryFilter);
    }
    
    if (statusFilter === 'with-image') {
      result = result.filter(img => imageStatuses[img.id] === true);
    } else if (statusFilter === 'missing') {
      result = result.filter(img => imageStatuses[img.id] === false);
    }
    
    return result;
  }, [allImages, categoryFilter, statusFilter, imageStatuses]);

  // Statistics
  const stats = useMemo(() => {
    const withImage = Object.values(imageStatuses).filter(Boolean).length;
    const total = allImages.length;
    return { withImage, total, missing: total - withImage };
  }, [imageStatuses, allImages]);

  // Categories with counts
  const categoriesWithCounts = useMemo(() => {
    const counts: Record<ImageCategory, number> = {
      home: 0, layout: 0, dashboard: 0, auth: 0,
      messaging: 0, legal: 0, services: 0, marketing: 0
    };
    allImages.forEach(img => {
      counts[img.category]++;
    });
    return counts;
  }, [allImages]);

  // Save global style
  const handleSaveGlobalStyle = useCallback(() => {
    try {
      const trimmed = globalStyle.trim();
      if (!trimmed) {
        toast.error('El estilo global no puede estar vacío');
        return;
      }

      localStorage.setItem(GLOBAL_STYLE_KEY, trimmed);
      setGlobalStyle(trimmed);
      setGlobalStyleDirty(false);
      setIsGlobalStyleLocked(true);
      toast.success('Estilo global guardado');
    } catch {
      toast.error('Error al guardar el estilo');
    }
  }, [globalStyle]);

  // Zoom handlers
  const handleZoomChange = useCallback((imageId: string, zoom: number) => {
    setZoomLevels(prev => ({ ...prev, [imageId]: zoom }));
  }, []);

  const handleSaveZoom = useCallback((imageId: string) => {
    const updated = { ...zoomLevels };
    localStorage.setItem(ZOOM_LEVELS_KEY, JSON.stringify(updated));
    toast.success(`Zoom guardado para ${imageId}`);
  }, [zoomLevels]);

  // Delete image from storage
  const handleDeleteImage = useCallback(async (imageId: string) => {
    setDeletingImageId(imageId);
    try {
      // Storage path pattern: imageId with dots replaced by slashes
      const storagePrefix = imageId.replace(/\./g, '/');
      
      // List all files in the storage folder for this image
      const { data: files, error: listError } = await supabase.storage
        .from('static-images')
        .list(storagePrefix, { limit: 100 });

      if (listError) throw listError;

      if (files && files.length > 0) {
        // Delete all files in the folder
        const filesToDelete = files.map(f => `${storagePrefix}/${f.name}`);
        const { error: deleteError } = await supabase.storage
          .from('static-images')
          .remove(filesToDelete);

        if (deleteError) throw deleteError;
      }

      setImageStatuses(prev => ({ ...prev, [imageId]: false }));
      invalidateStaticImageCache(imageId);
      bumpImageRefresh(imageId);
      toast.success('Imagen eliminada del storage');
    } catch (err: any) {
      console.error('Delete error:', err);
      toast.error(err.message || 'Error al eliminar imagen');
    } finally {
      setDeletingImageId(null);
    }
  }, [bumpImageRefresh]);

  // Upload image manually
  const handleUploadImage = useCallback(async (imageId: string, file: File) => {
    setUploadingImageId(imageId);
    try {
      const image = allImages.find(img => img.id === imageId);
      if (!image) throw new Error('Imagen no encontrada');

      const storagePrefix = imageId.replace(/\./g, '/');
      const ext = file.name.split('.').pop() || 'png';
      const fileName = `${Date.now()}.${ext}`;
      const objectPath = `${storagePrefix}/${fileName}`;

      const { error } = await supabase.storage
        .from('static-images')
        .upload(objectPath, file, { 
          cacheControl: '0',
          upsert: true 
        });

      if (error) throw error;

      setImageStatuses(prev => ({ ...prev, [imageId]: true }));
      invalidateStaticImageCache(imageId);
      bumpImageRefresh(imageId);
      toast.success('Imagen subida correctamente');
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error(err.message || 'Error al subir imagen');
    } finally {
      setUploadingImageId(null);
    }
  }, [allImages, bumpImageRefresh]);

  // Open AI generation modal with current image URL
  const handleOpenGenerateModal = useCallback(async (image: StaticImageEntry, currentUrl?: string) => {
    setSelectedImageForGeneration(image);

    // If the card didn't have a URL yet, fetch the latest from storage here
    if (currentUrl) {
      setSelectedImageCurrentUrl(currentUrl);
    } else {
      try {
        const storagePrefix = image.id.replace(/\./g, '/');
        const { data: files, error } = await supabase.storage
          .from('static-images')
          .list(storagePrefix, {
            limit: 1,
            sortBy: { column: 'created_at', order: 'desc' }
          });

        if (!error && files && files.length > 0) {
          const latestFile = files[0];
          const storagePath = `${storagePrefix}/${latestFile.name}`;
          const { data: { publicUrl } } = supabase.storage
            .from('static-images')
            .getPublicUrl(storagePath);
          setSelectedImageCurrentUrl(publicUrl ? `${publicUrl}?t=${Date.now()}` : null);
        } else {
          setSelectedImageCurrentUrl(null);
        }
      } catch {
        setSelectedImageCurrentUrl(null);
      }
    }

    setIsModalOpen(true);
  }, []);

  // Close modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedImageForGeneration(null);
    setSelectedImageCurrentUrl(null);
  }, []);

  // Image replaced callback
  const handleImageReplaced = useCallback(() => {
    if (selectedImageForGeneration) {
      setImageStatuses(prev => ({ ...prev, [selectedImageForGeneration.id]: true }));
      invalidateStaticImageCache(selectedImageForGeneration.id);
      bumpImageRefresh(selectedImageForGeneration.id);
    }
    handleCloseModal();
  }, [selectedImageForGeneration, handleCloseModal, bumpImageRefresh]);

  // Open image picker modal to copy from existing images
  const handleOpenCopyFromModal = useCallback((image: StaticImageEntry) => {
    setSelectedImageForCopy(image);
    setIsPickerModalOpen(true);
  }, []);

  // Close picker modal
  const handleClosePickerModal = useCallback(() => {
    setIsPickerModalOpen(false);
    setSelectedImageForCopy(null);
  }, []);

  // Image copied callback
  const handleImageCopied = useCallback(() => {
    if (selectedImageForCopy) {
      setImageStatuses(prev => ({ ...prev, [selectedImageForCopy.id]: true }));
      invalidateStaticImageCache(selectedImageForCopy.id);
      bumpImageRefresh(selectedImageForCopy.id);
    }
    handleClosePickerModal();
  }, [selectedImageForCopy, handleClosePickerModal, bumpImageRefresh]);

  // Test style on a category
  const handleTestStyle = useCallback(async () => {
    setIsTestingStyle(true);
    try {
      const categoryImages = allImages.filter(img => img.category === testCategory);
      if (categoryImages.length === 0) {
        toast.error('No hay imágenes en esta categoría');
        return;
      }

      // Pick first image from category
      const testImage = categoryImages[0];
      setSelectedImageForGeneration(testImage);
      setIsModalOpen(true);
    } finally {
      setIsTestingStyle(false);
    }
  }, [allImages, testCategory]);

  // Generate all missing images (placeholder - would need batch processing)
  const handleGenerateAllMissing = useCallback(() => {
    const missingImages = allImages.filter(img => imageStatuses[img.id] === false);
    if (missingImages.length === 0) {
      toast.info('No hay imágenes faltantes');
      return;
    }
    toast.info(`${missingImages.length} imágenes faltantes. Usa el botón IA en cada tarjeta.`);
  }, [allImages, imageStatuses]);

  // Delete all images (placeholder - needs confirmation)
  const handleDeleteAllImages = useCallback(() => {
    toast.warning('Esta función eliminaría todas las imágenes. ¿Estás seguro?', {
      action: {
        label: 'Confirmar',
        onClick: () => toast.error('Función deshabilitada por seguridad')
      }
    });
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground tracking-tight flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-primary" />
          Image Control Center
        </h1>
        <p className="text-muted-foreground">
          Gestiona y regenera imágenes estáticas del producto usando IA.
        </p>
      </div>

      {/* Test Style Section */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Probar Nuevo Estilo (Sin guardar)</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Prueba diferentes prompts para ver el resultado antes de aplicar.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Prompt Global:</label>
            <Textarea
              value={globalStyle}
              onChange={(e) => {
                if (isGlobalStyleLocked) return;
                setGlobalStyle(e.target.value);
                setGlobalStyleDirty(true);
              }}
              placeholder="Estilo visual global para todas las imágenes..."
              className="min-h-[80px] font-mono text-sm"
              disabled={isGlobalStyleLocked}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                {globalStyle.length} caracteres
              </span>
              <div className="flex items-center gap-2">
                {isGlobalStyleLocked ? (
                  <Button
                    onClick={handleUnlockGlobalStyle}
                    size="sm"
                    variant="outline"
                  >
                    Modificar
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleCancelGlobalStyleEdit}
                      size="sm"
                      variant="outline"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSaveGlobalStyle}
                      disabled={!globalStyleDirty || !globalStyle.trim()}
                      size="sm"
                      variant="default"
                    >
                      Guardar
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Categoría de Prueba:</label>
              <Select value={testCategory} onValueChange={(v) => setTestCategory(v as ImageCategory)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label} ({categoriesWithCounts[key as ImageCategory]})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleTestStyle}
              disabled={isTestingStyle}
            >
              {isTestingStyle ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4 mr-2" />
              )}
              Probar Estilo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status & Bulk Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-muted/30 rounded-lg border border-border">
        <div className="flex items-center gap-3">
          <ImageIcon className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm">
            Estado de las Imágenes: 
            <span className="font-semibold text-foreground ml-1">
              {stats.withImage} de {stats.total}
            </span>
            {stats.missing > 0 && (
              <span className="text-amber-400 ml-2">
                ({stats.missing} faltantes)
              </span>
            )}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateAllMissing}
            disabled={isGeneratingAll || stats.missing === 0}
          >
            {isGeneratingAll ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4 mr-2" />
            )}
            Generar Faltantes
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={handleDeleteAllImages}
            disabled={isDeletingAll}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar Todas
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filtrar:</span>
        </div>
        <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as ImageCategory | 'all')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            <SelectItem value="all">Todas las categorías</SelectItem>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label} ({categoriesWithCounts[key as ImageCategory]})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as 'all' | 'with-image' | 'missing')}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="with-image">
              <span className="flex items-center gap-1">
                <Check className="h-3 w-3 text-green-400" />
                Con imagen
              </span>
            </SelectItem>
            <SelectItem value="missing">
              <span className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 text-amber-400" />
                Sin imagen
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
        <Badge variant="outline" className="ml-auto">
          {filteredImages.length} imágenes
        </Badge>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredImages.map(image => (
          <ImageCard
            key={image.id}
            image={image}
            refreshToken={imageRefreshToken[image.id] || 0}
            zoomLevel={zoomLevels[image.id] || 100}
            onZoomChange={handleZoomChange}
            onSaveZoom={handleSaveZoom}
            onDelete={handleDeleteImage}
            onUpload={handleUploadImage}
            onGenerateAI={handleOpenGenerateModal}
            onCopyFrom={handleOpenCopyFromModal}
            isDeleting={deletingImageId === image.id}
            isUploading={uploadingImageId === image.id}
            onStatusChange={(imageId, hasImage) => {
              setImageStatuses(prev => ({ ...prev, [imageId]: hasImage }));
            }}
          />
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>No hay imágenes que coincidan con los filtros.</p>
        </div>
      )}

      {/* Generation Modal */}
      <ImageGenerationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        image={selectedImageForGeneration}
        globalStylePrompt={globalStyle}
        onImageReplaced={handleImageReplaced}
        currentImageUrl={selectedImageCurrentUrl}
      />

      {/* Image Picker Modal */}
      {selectedImageForCopy && (
        <ImagePickerModal
          isOpen={isPickerModalOpen}
          onClose={handleClosePickerModal}
          targetImage={selectedImageForCopy}
          onImageCopied={handleImageCopied}
        />
      )}
    </div>
  );
};

export default ImageControlCenter;
