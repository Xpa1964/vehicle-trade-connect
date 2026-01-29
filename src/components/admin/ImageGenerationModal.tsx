/**
 * Image Generation Modal
 * 
 * Modal for generating AI images and replacing static product images.
 * Shows side-by-side comparison and handles upload to storage.
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Wand2, RefreshCw, Check, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { StaticImageEntry } from '@/config/staticImageRegistry';

interface ImageGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: StaticImageEntry | null;
  globalStylePrompt: string;
  onImageReplaced: () => void;
}

const ImageGenerationModal: React.FC<ImageGenerationModalProps> = ({
  isOpen,
  onClose,
  image,
  globalStylePrompt,
  onImageReplaced,
}) => {
  const [localPrompt, setLocalPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isReplacing, setIsReplacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state when modal opens with new image
  React.useEffect(() => {
    if (image) {
      setLocalPrompt(image.purpose);
      setGeneratedImage(null);
      setError(null);
    }
  }, [image]);

  const handleGenerate = async () => {
    if (!image || !localPrompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('generate-static-image', {
        body: {
          imageId: image.id,
          prompt: localPrompt,
          globalStylePrompt: globalStylePrompt,
          width: 1024,
          height: 768,
        },
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.imageData) {
        setGeneratedImage(data.imageData);
        toast.success('Image generated successfully!');
      } else {
        throw new Error('No image data received');
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'Failed to generate image');
      toast.error(err.message || 'Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReplace = async () => {
    if (!image || !generatedImage) {
      toast.error('No generated image to replace');
      return;
    }

    setIsReplacing(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('replace-static-image', {
        body: {
          imageId: image.id,
          base64Data: generatedImage,
          targetPath: image.currentPath,
          prompt: localPrompt,
          globalStylePrompt: globalStylePrompt,
        },
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      toast.success('Image replaced successfully!');
      onImageReplaced();
    } catch (err: any) {
      console.error('Replace error:', err);
      setError(err.message || 'Failed to replace image');
      toast.error(err.message || 'Failed to replace image');
    } finally {
      setIsReplacing(false);
    }
  };

  const handleRegenerate = () => {
    setGeneratedImage(null);
    handleGenerate();
  };

  if (!image) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            <DialogTitle>Generate Image</DialogTitle>
          </div>
          <DialogDescription className="flex items-center gap-2">
            <code className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">
              {image.id}
            </code>
            <span className="text-muted-foreground">•</span>
            <span>{image.usage}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Side by Side Image Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Image */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Current</Badge>
              </div>
              <div className="aspect-video bg-muted rounded-lg overflow-hidden border border-border">
                <img
                  src={image.currentPath}
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
                <Badge variant="default" className="bg-primary">Generated</Badge>
              </div>
              <div className="aspect-video bg-muted rounded-lg overflow-hidden border border-border flex items-center justify-center">
                {isGenerating ? (
                  <div className="text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Generating image...</p>
                    <p className="text-xs text-muted-foreground mt-1">This may take a moment</p>
                  </div>
                ) : generatedImage ? (
                  <img
                    src={generatedImage}
                    alt="Generated"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-muted-foreground p-4">
                    <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Click "Generate" to create a new image</p>
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
                <p className="text-sm font-medium text-destructive">Generation Failed</p>
                <p className="text-xs text-destructive/80">{error}</p>
              </div>
            </div>
          )}

          {/* Global Style Preview */}
          <div className="p-3 bg-muted/50 rounded-lg border border-border">
            <p className="text-xs font-medium text-muted-foreground mb-1">Global Style (prepended automatically):</p>
            <p className="text-xs text-foreground/70 line-clamp-2">{globalStylePrompt}</p>
          </div>

          {/* Custom Prompt */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Image Description
            </label>
            <Textarea
              value={localPrompt}
              onChange={(e) => setLocalPrompt(e.target.value)}
              placeholder="Describe the image you want to generate..."
              className="min-h-[100px]"
              disabled={isGenerating || isReplacing}
            />
            <p className="text-xs text-muted-foreground">
              Be specific about the composition, lighting, colors, and mood.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isGenerating || isReplacing}
          >
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>

          {generatedImage ? (
            <>
              <Button
                variant="outline"
                onClick={handleRegenerate}
                disabled={isGenerating || isReplacing}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${isGenerating ? 'animate-spin' : ''}`} />
                Regenerate
              </Button>
              <Button
                onClick={handleReplace}
                disabled={isReplacing}
                className="bg-primary hover:bg-primary/90"
              >
                {isReplacing ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Check className="h-4 w-4 mr-1" />
                )}
                Replace Image
              </Button>
            </>
          ) : (
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !localPrompt.trim()}
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4 mr-1" />
              )}
              Generate
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageGenerationModal;
