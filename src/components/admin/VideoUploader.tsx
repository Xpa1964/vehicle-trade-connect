import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

export const VideoUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setUploadedUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Por favor selecciona un archivo');
      return;
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('audio-files')
        .upload('DE.mp4', file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('audio-files')
        .getPublicUrl('DE.mp4');

      setProgress(100);
      setUploadedUrl(publicUrl);
      toast.success('Video subido exitosamente');
    } catch (err: any) {
      console.error('Error uploading file:', err);
      setError(err.message || 'Error al subir el archivo');
      toast.error('Error al subir el archivo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-card rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Subir Video DE.mp4</h1>
        
        <div className="space-y-6">
          {/* File Input */}
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
              id="video-upload"
            />
            <label
              htmlFor="video-upload"
              className="cursor-pointer inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
            >
              Seleccionar Video
            </label>
            {file && (
              <p className="mt-4 text-sm text-muted-foreground">
                Archivo seleccionado: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full"
            size="lg"
          >
            {uploading ? 'Subiendo...' : 'Subir a Supabase Storage'}
          </Button>

          {/* Progress Bar */}
          {uploading && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-center text-muted-foreground">
                Subiendo video...
              </p>
            </div>
          )}

          {/* Success Message */}
          {uploadedUrl && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-green-500 mb-2">¡Video subido exitosamente!</p>
                <p className="text-sm text-muted-foreground break-all">
                  URL: {uploadedUrl}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Ahora puedes cerrar esta página. El siguiente paso es actualizar AudioPresentationSection.tsx.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-500 mb-1">Error al subir</p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
