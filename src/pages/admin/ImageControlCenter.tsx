/**
 * Image Control Center - Admin Page
 * 
 * Displays all AI-editable static product images in a grid.
 * Allows generation and replacement of images using AI.
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Wand2, RefreshCw, Image as ImageIcon, Settings, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { STATIC_IMAGE_REGISTRY, StaticImageEntry, ImageCategory } from '@/config/staticImageRegistry';
import ImageGenerationModal from '@/components/admin/ImageGenerationModal';

const GLOBAL_STYLE_KEY = 'imageControlCenter_globalStyle';
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

const ImageControlCenter: React.FC = () => {
  // Global style prompt persisted in localStorage
  const [globalStyle, setGlobalStyle] = useState<string>(() => {
    try {
      return localStorage.getItem(GLOBAL_STYLE_KEY) || DEFAULT_GLOBAL_STYLE;
    } catch {
      return DEFAULT_GLOBAL_STYLE;
    }
  });
  const [globalStyleDirty, setGlobalStyleDirty] = useState(false);

  // Search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ImageCategory | 'all'>('all');

  // Modal state
  const [selectedImage, setSelectedImage] = useState<StaticImageEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get only AI-editable images
  const editableImages = useMemo(() => {
    return Object.values(STATIC_IMAGE_REGISTRY)
      .filter(img => img.aiEditable)
      .filter(img => {
        // Category filter
        if (categoryFilter !== 'all' && img.category !== categoryFilter) return false;
        
        // Search filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          return (
            img.id.toLowerCase().includes(query) ||
            img.purpose.toLowerCase().includes(query) ||
            img.usage.toLowerCase().includes(query)
          );
        }
        return true;
      });
  }, [categoryFilter, searchQuery]);

  // Get unique categories from editable images
  const availableCategories = useMemo(() => {
    const cats = new Set<ImageCategory>();
    Object.values(STATIC_IMAGE_REGISTRY)
      .filter(img => img.aiEditable)
      .forEach(img => cats.add(img.category));
    return Array.from(cats).sort();
  }, []);

  const handleSaveGlobalStyle = () => {
    try {
      localStorage.setItem(GLOBAL_STYLE_KEY, globalStyle);
      setGlobalStyleDirty(false);
      toast.success('Global style prompt saved');
    } catch (error) {
      toast.error('Failed to save global style');
    }
  };

  const handleEditImage = (image: StaticImageEntry) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const handleImageReplaced = () => {
    toast.success('Image replaced successfully! The platform will update automatically.');
    // Force re-render by adding timestamp to prevent caching issues
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Image Control Center</h1>
        <p className="text-muted-foreground">
          Manage and regenerate static product images using AI. Changes apply instantly across the platform.
        </p>
      </div>

      {/* Global Style Prompt Section */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Global Style Prompt</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            This prompt is automatically prepended to every image generation request.
          </p>
          <div className="space-y-3">
            <Textarea
              value={globalStyle}
              onChange={(e) => {
                setGlobalStyle(e.target.value);
                setGlobalStyleDirty(true);
              }}
              placeholder="Enter global style prompt..."
              className="min-h-[100px] font-mono text-sm"
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                {globalStyle.length} characters
              </span>
              <Button
                onClick={handleSaveGlobalStyle}
                disabled={!globalStyleDirty}
                size="sm"
              >
                Save Global Style
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search images by ID, purpose, or usage..."
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={categoryFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategoryFilter('all')}
          >
            <Filter className="h-4 w-4 mr-1" />
            All ({Object.values(STATIC_IMAGE_REGISTRY).filter(i => i.aiEditable).length})
          </Button>
          {availableCategories.map(cat => (
            <Button
              key={cat}
              variant={categoryFilter === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategoryFilter(cat)}
            >
              {CATEGORY_LABELS[cat]}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="text-sm text-muted-foreground">
        Showing {editableImages.length} images
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {editableImages.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            onEdit={handleEditImage}
          />
        ))}
      </div>

      {/* Empty State */}
      {editableImages.length === 0 && (
        <div className="text-center py-16">
          <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No images found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}

      {/* Generation Modal */}
      <ImageGenerationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        image={selectedImage}
        globalStylePrompt={globalStyle}
        onImageReplaced={handleImageReplaced}
      />
    </div>
  );
};

// Individual Image Card Component
interface ImageCardProps {
  image: StaticImageEntry;
  onEdit: (image: StaticImageEntry) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onEdit }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Handle different path formats
  const getImageSrc = () => {
    // Add cache buster for storage images
    if (image.currentPath.includes('supabase.co')) {
      return `${image.currentPath}?t=${Date.now()}`;
    }
    return image.currentPath;
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/40 overflow-hidden">
      {/* Image Preview */}
      <div className="aspect-video bg-muted relative overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse bg-muted-foreground/10 w-full h-full" />
          </div>
        )}
        {!imageError ? (
          <img
            src={getImageSrc()}
            alt={image.purpose}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="text-center text-muted-foreground">
              <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <span className="text-xs">Image not found</span>
            </div>
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Edit button */}
        <Button
          size="sm"
          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
          onClick={() => onEdit(image)}
        >
          <Wand2 className="h-4 w-4 mr-1" />
          Generate
        </Button>
      </div>

      {/* Card Content */}
      <CardContent className="pt-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <code className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded truncate max-w-[70%]">
            {image.id}
          </code>
          <Badge variant="outline" className="text-xs shrink-0">
            {CATEGORY_LABELS[image.category]}
          </Badge>
        </div>
        
        <p className="text-sm text-foreground font-medium line-clamp-2">
          {image.purpose}
        </p>
        
        <p className="text-xs text-muted-foreground truncate" title={image.usage}>
          Used in: {image.usage}
        </p>

        {image.critical && (
          <Badge variant="destructive" className="text-xs">
            Critical
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageControlCenter;
