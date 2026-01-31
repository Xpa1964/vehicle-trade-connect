/**
 * ImageCard Component
 * 
 * Individual card for displaying and managing a single static image
 * in the Image Control Center grid.
 * 
 * Priority: Supabase Storage > Original Path
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Trash2, 
  Upload, 
  Wand2, 
  Check, 
  ZoomIn,
  Save,
  ImageIcon,
  AlertTriangle,
  Loader2,
  Copy
} from 'lucide-react';
import { StaticImageEntry, ImageCategory } from '@/config/staticImageRegistry';
import { supabase } from '@/integrations/supabase/client';

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
  home: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  layout: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  dashboard: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  auth: 'bg-green-500/20 text-green-400 border-green-500/30',
  messaging: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  legal: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  services: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  marketing: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
};

interface ImageCardProps {
  image: StaticImageEntry;
  /** Changes to force a re-check of storage after replace/upload/delete */
  refreshToken?: number;
  zoomLevel: number;
  onZoomChange: (imageId: string, zoom: number) => void;
  onSaveZoom: (imageId: string) => void;
  onDelete: (imageId: string) => void;
  onUpload: (imageId: string, file: File) => void;
  onGenerateAI: (image: StaticImageEntry, currentUrl?: string) => void;
  onCopyFrom: (image: StaticImageEntry) => void;
  isDeleting?: boolean;
  isUploading?: boolean;
  onStatusChange?: (imageId: string, hasImage: boolean) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({
  image,
  refreshToken = 0,
  zoomLevel,
  onZoomChange,
  onSaveZoom,
  onDelete,
  onUpload,
  onGenerateAI,
  onCopyFrom,
  isDeleting = false,
  isUploading = false,
  onStatusChange
}) => {
  const [imageLoaded, setImageLoaded] = useState<boolean | null>(null);
  const [localZoom, setLocalZoom] = useState(zoomLevel);
  const [displayUrl, setDisplayUrl] = useState<string | null>(null);
  const [isCheckingStorage, setIsCheckingStorage] = useState(true);
  const [imageSource, setImageSource] = useState<'storage' | 'original' | 'none'>('none');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Use ref to avoid infinite loops with onStatusChange
  const onStatusChangeRef = useRef(onStatusChange);
  onStatusChangeRef.current = onStatusChange;
  
  // Stable timestamp for cache busting - only changes on mount
  const cacheBustRef = useRef(Date.now());

  // Check for image in Supabase Storage first, then fall back to original path
  // Only runs once on mount or when image.id changes
  useEffect(() => {
    let isMounted = true;

    // New refresh cycle -> new cache buster
    cacheBustRef.current = Date.now();
    
    const checkStorageForImage = async () => {
      if (!isMounted) return;
      setIsCheckingStorage(true);
      
      try {
        // Storage path pattern: imageId with dots replaced by slashes
        const storagePrefix = image.id.replace(/\./g, '/');
        
        // List files in the storage folder for this image
        const { data: files, error } = await supabase.storage
          .from('static-images')
          .list(storagePrefix, {
            limit: 10,
            sortBy: { column: 'created_at', order: 'desc' }
          });

        if (!isMounted) return;

        if (!error && files && files.length > 0) {
          // Found files in storage - use the most recent one
          const latestFile = files[0];
          const storagePath = `${storagePrefix}/${latestFile.name}`;
          
          const { data: { publicUrl } } = supabase.storage
            .from('static-images')
            .getPublicUrl(storagePath);
          
          // Add stable cache buster
          const urlWithCacheBuster = `${publicUrl}?t=${cacheBustRef.current}`;
          setDisplayUrl(urlWithCacheBuster);
          setImageSource('storage');
          setImageLoaded(true);
          onStatusChangeRef.current?.(image.id, true);
        } else {
          // No files in storage - try original path
          setDisplayUrl(image.currentPath);
          setImageSource('original');
        }
      } catch (err) {
        console.error('Error checking storage:', err);
        if (!isMounted) return;
        // Fall back to original path
        setDisplayUrl(image.currentPath);
        setImageSource('original');
      } finally {
        if (isMounted) {
          setIsCheckingStorage(false);
        }
      }
    };

    checkStorageForImage();
    
    return () => { isMounted = false; };
  }, [image.id, image.currentPath, refreshToken]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    onStatusChange?.(image.id, true);
  };

  const handleImageError = () => {
    if (imageSource === 'storage') {
      // Storage image failed, try original path
      setDisplayUrl(image.currentPath);
      setImageSource('original');
    } else {
      // Both failed
      setImageLoaded(false);
      onStatusChange?.(image.id, false);
    }
  };

  const handleZoomChange = (value: number[]) => {
    setLocalZoom(value[0]);
    onZoomChange(image.id, value[0]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(image.id, file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="group border-border bg-card/80 hover:bg-card transition-all duration-200 hover:border-primary/30">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <code className="text-xs font-mono text-primary block truncate">
              {image.id}
            </code>
          </div>
          <Badge 
            variant="outline" 
            className={`text-[10px] shrink-0 ${CATEGORY_COLORS[image.category]}`}
          >
            {CATEGORY_LABELS[image.category]}
          </Badge>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 flex-wrap">
          {isCheckingStorage ? (
            <Badge variant="outline" className="text-[10px] bg-muted text-muted-foreground">
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Verificando...
            </Badge>
          ) : imageLoaded === true ? (
            <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-400 border-green-500/30">
              <Check className="h-3 w-3 mr-1" />
              {imageSource === 'storage' ? 'Generada (Storage)' : 'Original'}
            </Badge>
          ) : imageLoaded === false ? (
            <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-400 border-amber-500/30">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Sin imagen
            </Badge>
          ) : null}
          {image.critical && (
            <Badge variant="outline" className="text-[10px] bg-red-500/10 text-red-400 border-red-500/30">
              Crítica
            </Badge>
          )}
        </div>

        {/* Image Preview */}
        <div className="aspect-video bg-muted/50 rounded-lg overflow-hidden border border-border relative">
          {isCheckingStorage ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center overflow-hidden"
              style={{ 
                transform: `scale(${localZoom / 100})`,
                transformOrigin: 'center center'
              }}
            >
              {imageLoaded === false ? (
                <div className="text-center text-muted-foreground p-2">
                  <ImageIcon className="h-8 w-8 mx-auto mb-1 opacity-40" />
                  <p className="text-[10px]">Sin archivo</p>
                </div>
              ) : displayUrl ? (
                <img
                  src={displayUrl}
                  alt={image.purpose}
                  className="w-full h-full object-cover"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              ) : null}
            </div>
          )}
        </div>

        {/* Zoom Control */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ZoomIn className="h-3 w-3 text-muted-foreground shrink-0" />
            <Slider
              value={[localZoom]}
              onValueChange={handleZoomChange}
              min={50}
              max={200}
              step={10}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-10 text-right">
              {localZoom}%
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full h-7 text-xs"
            onClick={() => onSaveZoom(image.id)}
          >
            <Save className="h-3 w-3 mr-1" />
            Guardar zoom
          </Button>
        </div>

        {/* Action Buttons - Row 1 */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(image.id)}
            disabled={isDeleting || imageLoaded === false}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Borrar
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs px-2"
            onClick={triggerFileUpload}
            disabled={isUploading}
          >
            <Upload className="h-3 w-3 mr-1" />
            Subir
          </Button>
        </div>

        {/* Action Buttons - Row 2 */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs px-2"
            onClick={() => onCopyFrom(image)}
          >
            <Copy className="h-3 w-3 mr-1" />
            Copiar de...
          </Button>
          
          <Button
            variant="default"
            size="sm"
            className="h-8 text-xs px-2"
            onClick={() => onGenerateAI(image, displayUrl || undefined)}
            disabled={!image.aiEditable}
          >
            <Wand2 className="h-3 w-3 mr-1" />
            IA
          </Button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Purpose/Usage Info */}
        <p className="text-[10px] text-muted-foreground line-clamp-2">
          {image.purpose}
        </p>
      </CardContent>
    </Card>
  );
};

export default ImageCard;
