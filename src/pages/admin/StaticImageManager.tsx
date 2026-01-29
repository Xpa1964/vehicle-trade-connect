/**
 * Admin Dashboard - Static Image Manager
 * 
 * AI-controllable interface for managing product/UI static images.
 * STRICTLY for product images - NO user-generated content.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Image as ImageIcon,
  Search,
  Filter,
  Wand2,
  RefreshCw,
  Check,
  X,
  AlertTriangle,
  Shield,
  Palette,
  History,
  Eye,
  Sparkles,
  Settings,
  ChevronDown
} from 'lucide-react';
import { useStaticImageRegistry } from '@/hooks/useStaticImageRegistry';
import { StaticImageEntry } from '@/config/staticImageRegistry';
import { toast } from 'sonner';

const StaticImageManager: React.FC = () => {
  const {
    allImages,
    filteredImages,
    selectedImage,
    stats,
    validation,
    categories,
    globalStyle,
    filters,
    updateFilters,
    resetFilters,
    setSelectedImage,
    setGlobalStyle,
    addImageVersion,
    getVersionsForImage,
    composeFinalPrompt
  } = useStaticImageRegistry();

  const [localPrompt, setLocalPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGlobalStyleDialog, setShowGlobalStyleDialog] = useState(false);
  const [globalStyleInput, setGlobalStyleInput] = useState(globalStyle.prompt);
  const [previewImage, setPreviewImage] = useState<StaticImageEntry | null>(null);

  // Handle generate image (placeholder - would connect to AI)
  const handleGenerateImage = async () => {
    if (!selectedImage || !localPrompt.trim()) {
      toast.error('Selecciona una imagen y proporciona un prompt');
      return;
    }

    setIsGenerating(true);
    const finalPrompt = composeFinalPrompt(localPrompt);
    
    toast.info('Generando imagen...', { 
      description: 'El sistema de generación AI se conectará aquí'
    });
    
    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Add version record (path would come from actual generation)
    addImageVersion(
      selectedImage.id,
      selectedImage.currentPath, // Would be new path from generation
      localPrompt,
      'admin'
    );
    
    toast.success('Versión registrada', {
      description: 'La imagen será generada cuando se conecte el servicio AI'
    });
    
    setIsGenerating(false);
    setLocalPrompt('');
  };

  // Save global style
  const handleSaveGlobalStyle = () => {
    setGlobalStyle(globalStyleInput, 'admin');
    setShowGlobalStyleDialog(false);
    toast.success('Estilo global actualizado');
  };

  // Render image preview
  const renderImagePreview = (image: StaticImageEntry) => {
    const path = image.currentPath.startsWith('src/') 
      ? `/${image.currentPath}` 
      : image.currentPath;
    
    return (
      <div className="relative w-full h-32 bg-secondary rounded-lg overflow-hidden">
        <img 
          src={path}
          alt={image.purpose}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-2 left-2 right-2">
          <p className="text-xs text-white truncate font-medium">{image.id}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ImageIcon className="h-6 w-6 text-primary" />
            Gestor de Imágenes Estáticas
          </h1>
          <p className="text-muted-foreground mt-1">
            Control centralizado de imágenes de producto/UI
          </p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={showGlobalStyleDialog} onOpenChange={setShowGlobalStyleDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Palette className="h-4 w-4" />
                Estilo Global
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Configuración de Estilo Global
                </DialogTitle>
                <DialogDescription>
                  Define la dirección visual para todas las imágenes generadas por AI.
                  Este prompt se combina con prompts individuales.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Prompt de Estilo Global</Label>
                  <Textarea
                    value={globalStyleInput}
                    onChange={(e) => setGlobalStyleInput(e.target.value)}
                    placeholder="Describe el estilo visual general..."
                    className="min-h-[120px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Última actualización: {new Date(globalStyle.lastUpdated).toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-secondary rounded-lg">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Ejemplo de prompt final:
                  </p>
                  <p className="text-sm text-foreground">
                    <span className="text-primary">[GLOBAL]</span> {globalStyleInput.slice(0, 80)}...
                    <br />
                    <span className="text-primary">[LOCAL]</span> "Hero image of luxury car showroom"
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowGlobalStyleDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveGlobalStyle}>
                  Guardar Estilo
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Imágenes</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <ImageIcon className="h-8 w-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Críticas</p>
                <p className="text-2xl font-bold text-destructive">{stats.critical}</p>
              </div>
              <Shield className="h-8 w-8 text-destructive/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AI Editables</p>
                <p className="text-2xl font-bold text-primary">{stats.aiEditable}</p>
              </div>
              <Wand2 className="h-8 w-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Errores</p>
                <p className="text-2xl font-bold">{validation.errors.length}</p>
              </div>
              {validation.valid ? (
                <Check className="h-8 w-8 text-primary/50" />
              ) : (
                <AlertTriangle className="h-8 w-8 text-warning/50" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Validation Warnings */}
      {!validation.valid && (
        <Card className="border-warning/50 bg-warning/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-warning flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5" />
              Advertencias de Validación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              {validation.errors.map((error, i) => (
                <li key={i} className="text-warning-foreground">{error}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Image List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-lg">Registro de Imágenes</CardTitle>
                <div className="flex gap-2 flex-wrap">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar..."
                      value={filters.searchQuery}
                      onChange={(e) => updateFilters({ searchQuery: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                  <Select 
                    value={filters.category} 
                    onValueChange={(v) => updateFilters({ category: v as any })}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={resetFilters}
                    title="Limpiar filtros"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Preview</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Uso</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredImages.map((image) => (
                      <TableRow 
                        key={image.id}
                        className={selectedImage?.id === image.id ? 'bg-primary/10' : ''}
                      >
                        <TableCell>
                          {renderImagePreview(image)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{image.id}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {image.purpose}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {image.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {image.critical && (
                              <Badge variant="destructive" className="text-xs">
                                Crítica
                              </Badge>
                            )}
                            {image.aiEditable && (
                              <Badge variant="default" className="text-xs bg-primary">
                                AI
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setPreviewImage(image)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {image.aiEditable && (
                              <Button
                                size="sm"
                                variant={selectedImage?.id === image.id ? 'default' : 'outline'}
                                onClick={() => setSelectedImage(image)}
                              >
                                <Wand2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
              <div className="mt-4 text-sm text-muted-foreground">
                Mostrando {filteredImages.length} de {allImages.length} imágenes
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Generation Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wand2 className="h-5 w-5 text-primary" />
                Generación AI
              </CardTitle>
              <CardDescription>
                Genera nuevas versiones de imágenes con AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedImage ? (
                <>
                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      Imagen seleccionada:
                    </p>
                    <p className="font-medium text-sm">{selectedImage.id}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedImage.purpose}
                    </p>
                  </div>
                  
                  {renderImagePreview(selectedImage)}
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label>Prompt de Imagen</Label>
                    <Textarea
                      value={localPrompt}
                      onChange={(e) => setLocalPrompt(e.target.value)}
                      placeholder="Describe la imagen que deseas generar..."
                      className="min-h-[100px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      Se combinará con el estilo global
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 gap-2"
                      onClick={handleGenerateImage}
                      disabled={isGenerating || !localPrompt.trim()}
                    >
                      {isGenerating ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                      Generar
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setSelectedImage(null);
                        setLocalPrompt('');
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Wand2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Selecciona una imagen AI-editable</p>
                  <p className="text-xs mt-1">para generar nuevas versiones</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Version History */}
          {selectedImage && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <History className="h-5 w-5" />
                  Historial de Versiones
                </CardTitle>
              </CardHeader>
              <CardContent>
                {getVersionsForImage(selectedImage.id).length > 0 ? (
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-2">
                      {getVersionsForImage(selectedImage.id).map((version) => (
                        <div 
                          key={version.id}
                          className="p-2 bg-secondary rounded-lg text-sm"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">
                              {new Date(version.createdAt).toLocaleDateString()}
                            </span>
                            {version.isActive && (
                              <Badge variant="default" className="text-xs">
                                Activa
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {version.prompt}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Sin versiones anteriores
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-3xl">
          {previewImage && (
            <>
              <DialogHeader>
                <DialogTitle>{previewImage.id}</DialogTitle>
                <DialogDescription>{previewImage.purpose}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative w-full aspect-video bg-secondary rounded-lg overflow-hidden">
                  <img 
                    src={previewImage.currentPath.startsWith('src/') 
                      ? `/${previewImage.currentPath}` 
                      : previewImage.currentPath}
                    alt={previewImage.purpose}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-muted-foreground">Ruta</p>
                    <p className="font-mono text-xs break-all">{previewImage.currentPath}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Uso</p>
                    <p>{previewImage.usage}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Categoría</p>
                    <Badge variant="outline">{previewImage.category}</Badge>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Estado</p>
                    <div className="flex gap-1 mt-1">
                      {previewImage.critical && (
                        <Badge variant="destructive">Crítica</Badge>
                      )}
                      {previewImage.aiEditable && (
                        <Badge variant="default">AI Editable</Badge>
                      )}
                      <Badge variant="secondary">{previewImage.source}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaticImageManager;
