/**
 * Image Control Center - Admin Page
 * 
 * Unified interface for managing static product images with AI generation.
 * Features:
 * - Dropdown to select specific image
 * - Individual prompt per image (with global style prepended)
 * - Generate, Delete, Accept actions per image
 */

import React, { useState, useMemo, useCallback } from 'react';
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
  Check, 
  Trash2, 
  Image as ImageIcon, 
  Settings,
  Loader2,
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { STATIC_IMAGE_REGISTRY, StaticImageEntry, ImageCategory } from '@/config/staticImageRegistry';

const GLOBAL_STYLE_KEY = 'imageControlCenter_globalStyle';
const IMAGE_PROMPTS_KEY = 'imageControlCenter_imagePrompts';
const DEFAULT_GLOBAL_STYLE = 'Dark, cinematic automotive marketplace style, premium lighting, high contrast, modern UI-friendly compositions, professional product photography aesthetic.';

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

interface GeneratedImageState {
  imageId: string;
  base64Data: string;
  prompt: string;
  generatedAt: string;
}

interface ImagePrompts {
  [imageId: string]: string;
}

const ImageControlCenter: React.FC = () => {
  // Global style prompt
  const [globalStyle, setGlobalStyle] = useState<string>(() => {
    try {
      return localStorage.getItem(GLOBAL_STYLE_KEY) || DEFAULT_GLOBAL_STYLE;
    } catch {
      return DEFAULT_GLOBAL_STYLE;
    }
  });
  const [globalStyleDirty, setGlobalStyleDirty] = useState(false);

  // Individual image prompts
  const [imagePrompts, setImagePrompts] = useState<ImagePrompts>(() => {
    try {
      const stored = localStorage.getItem(IMAGE_PROMPTS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Selected image
  const [selectedImageId, setSelectedImageId] = useState<string>('');
  
  // Generation state
  const [generatedImages, setGeneratedImages] = useState<Map<string, GeneratedImageState>>(new Map());
  const [isGenerating, setIsGenerating] = useState(false);
  const [isReplacing, setIsReplacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get only AI-editable images
  const editableImages = useMemo(() => {
    return Object.values(STATIC_IMAGE_REGISTRY)
      .filter(img => img.aiEditable)
      .sort((a, b) => {
        // Sort by category first, then by id
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        return a.id.localeCompare(b.id);
      });
  }, []);

  // Group images by category for dropdown
  const imagesByCategory = useMemo(() => {
    const grouped: Record<ImageCategory, StaticImageEntry[]> = {
      home: [],
      layout: [],
      dashboard: [],
      auth: [],
      messaging: [],
      legal: [],
      services: [],
      marketing: []
    };
    
    editableImages.forEach(img => {
      grouped[img.category].push(img);
    });
    
    return grouped;
  }, [editableImages]);

  // Get selected image object
  const selectedImage = useMemo(() => {
    return editableImages.find(img => img.id === selectedImageId) || null;
  }, [editableImages, selectedImageId]);

  // Get current prompt for selected image
  const currentPrompt = useMemo(() => {
    if (!selectedImage) return '';
    return imagePrompts[selectedImage.id] || selectedImage.purpose;
  }, [selectedImage, imagePrompts]);

  // Get generated image for selected
  const generatedImage = useMemo(() => {
    if (!selectedImageId) return null;
    return generatedImages.get(selectedImageId) || null;
  }, [selectedImageId, generatedImages]);

  // Save global style
  const handleSaveGlobalStyle = useCallback(() => {
    try {
      localStorage.setItem(GLOBAL_STYLE_KEY, globalStyle);
      setGlobalStyleDirty(false);
      toast.success('Global style prompt saved');
    } catch {
      toast.error('Failed to save global style');
    }
  }, [globalStyle]);

  // Update prompt for specific image
  const handlePromptChange = useCallback((imageId: string, prompt: string) => {
    setImagePrompts(prev => {
      const updated = { ...prev, [imageId]: prompt };
      localStorage.setItem(IMAGE_PROMPTS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Generate image
  const handleGenerate = useCallback(async () => {
    if (!selectedImage || !currentPrompt.trim()) {
      toast.error('Selecciona una imagen y escribe un prompt');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('generate-static-image', {
        body: {
          imageId: selectedImage.id,
          prompt: currentPrompt,
          globalStylePrompt: globalStyle,
          width: 1024,
          height: 768,
        },
      });

      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);

      if (data?.imageData) {
        setGeneratedImages(prev => {
          const next = new Map(prev);
          next.set(selectedImage.id, {
            imageId: selectedImage.id,
            base64Data: data.imageData,
            prompt: currentPrompt,
            generatedAt: new Date().toISOString()
          });
          return next;
        });
        toast.success('¡Imagen generada correctamente!');
      } else {
        throw new Error('No se recibieron datos de imagen');
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'Error al generar imagen');
      toast.error(err.message || 'Error al generar imagen');
    } finally {
      setIsGenerating(false);
    }
  }, [selectedImage, currentPrompt, globalStyle]);

  // Delete generated image (discard)
  const handleDeleteGenerated = useCallback(() => {
    if (!selectedImageId) return;
    
    setGeneratedImages(prev => {
      const next = new Map(prev);
      next.delete(selectedImageId);
      return next;
    });
    toast.info('Imagen generada descartada');
  }, [selectedImageId]);

  // Accept and replace image
  const handleAcceptReplace = useCallback(async () => {
    if (!selectedImage || !generatedImage) {
      toast.error('No hay imagen generada para reemplazar');
      return;
    }

    setIsReplacing(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('replace-static-image', {
        body: {
          imageId: selectedImage.id,
          base64Data: generatedImage.base64Data,
          targetPath: selectedImage.currentPath,
          prompt: generatedImage.prompt,
          globalStylePrompt: globalStyle,
        },
      });

      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);

      // Clear the generated image after successful replacement
      setGeneratedImages(prev => {
        const next = new Map(prev);
        next.delete(selectedImage.id);
        return next;
      });

      toast.success('¡Imagen reemplazada! Se actualizará en toda la plataforma.');
    } catch (err: any) {
      console.error('Replace error:', err);
      setError(err.message || 'Error al reemplazar imagen');
      toast.error(err.message || 'Error al reemplazar imagen');
    } finally {
      setIsReplacing(false);
    }
  }, [selectedImage, generatedImage, globalStyle]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Image Control Center</h1>
        <p className="text-muted-foreground">
          Gestiona y regenera imágenes estáticas del producto usando IA. Los cambios se aplican instantáneamente.
        </p>
      </div>

      {/* Global Style Prompt Section */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Global Style Prompt</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Este prompt se añade automáticamente al inicio de cada generación de imagen.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={globalStyle}
            onChange={(e) => {
              setGlobalStyle(e.target.value);
              setGlobalStyleDirty(true);
            }}
            placeholder="Enter global style prompt..."
            className="min-h-[80px] font-mono text-sm"
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              {globalStyle.length} caracteres
            </span>
            <Button
              onClick={handleSaveGlobalStyle}
              disabled={!globalStyleDirty}
              size="sm"
            >
              Guardar Estilo Global
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Image Selection and Generation */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Generar Imagen</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Image Dropdown Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Seleccionar Imagen
            </label>
            <Select value={selectedImageId} onValueChange={setSelectedImageId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona una imagen del registro..." />
              </SelectTrigger>
              <SelectContent className="max-h-[400px] bg-popover z-50">
                {Object.entries(imagesByCategory).map(([category, images]) => {
                  if (images.length === 0) return null;
                  return (
                    <div key={category}>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 sticky top-0">
                        {CATEGORY_LABELS[category as ImageCategory]} ({images.length})
                      </div>
                      {images.map(img => (
                        <SelectItem 
                          key={img.id} 
                          value={img.id}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <code className="text-xs font-mono text-primary">{img.id}</code>
                            <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                              — {img.purpose}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </div>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Selected Image Details */}
          {selectedImage && (
            <div className="space-y-4">
              {/* Image Info */}
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Badge variant="outline">{CATEGORY_LABELS[selectedImage.category]}</Badge>
                <span className="text-sm text-muted-foreground">Usado en: {selectedImage.usage}</span>
                {selectedImage.critical && (
                  <Badge variant="destructive" className="text-xs">Critical</Badge>
                )}
              </div>

              {/* Side by Side Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Current Image */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Actual</Badge>
                  </div>
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden border border-border">
                    <img
                      src={selectedImage.currentPath}
                      alt="Current"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>

                {/* Generated Image */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-primary">Generada</Badge>
                    {generatedImage && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(generatedImage.generatedAt).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden border border-border flex items-center justify-center relative">
                    {isGenerating ? (
                      <div className="text-center">
                        <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Generando imagen...</p>
                      </div>
                    ) : generatedImage ? (
                      <>
                        <img
                          src={generatedImage.base64Data}
                          alt="Generated"
                          className="w-full h-full object-cover"
                        />
                        {/* Delete overlay button */}
                        <Button
                          size="icon"
                          variant="destructive"
                          className="absolute top-2 right-2 h-8 w-8 opacity-80 hover:opacity-100"
                          onClick={handleDeleteGenerated}
                          title="Descartar imagen generada"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <div className="text-center text-muted-foreground p-4">
                        <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Escribe un prompt y genera</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-destructive">Error</p>
                    <p className="text-xs text-destructive/80">{error}</p>
                  </div>
                </div>
              )}

              {/* Prompt Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Prompt para esta imagen
                </label>
                <Textarea
                  value={currentPrompt}
                  onChange={(e) => handlePromptChange(selectedImage.id, e.target.value)}
                  placeholder="Describe la imagen que quieres generar..."
                  className="min-h-[100px]"
                  disabled={isGenerating || isReplacing}
                />
                <p className="text-xs text-muted-foreground">
                  Sé específico sobre composición, iluminación, colores y mood. El estilo global se añade automáticamente.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-end pt-2 border-t border-border">
                {generatedImage ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleGenerate}
                      disabled={isGenerating || isReplacing}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                      Regenerar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteGenerated}
                      disabled={isReplacing}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Descartar
                    </Button>
                    <Button
                      onClick={handleAcceptReplace}
                      disabled={isReplacing}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {isReplacing ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4 mr-2" />
                      )}
                      Aceptar y Reemplazar
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !currentPrompt.trim()}
                  >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Wand2 className="h-4 w-4 mr-2" />
                    )}
                    Generar Imagen
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!selectedImage && (
            <div className="text-center py-12">
              <ChevronDown className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
              <p className="text-muted-foreground">
                Selecciona una imagen del dropdown para empezar
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="text-sm text-muted-foreground text-center">
        {editableImages.length} imágenes editables en el registro
        {generatedImages.size > 0 && (
          <span className="ml-2 text-primary">
            • {generatedImages.size} pendiente{generatedImages.size > 1 ? 's' : ''} de aceptar
          </span>
        )}
      </div>
    </div>
  );
};

export default ImageControlCenter;
