/**
 * Image upload preview + validation UI for publishVehicleV2
 * 
 * Self-contained component — does NOT import from legacy upload system.
 * Uses imageValidationV2 for client-side validation.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, XCircle, Upload, AlertTriangle, Image as ImageIcon, Loader2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  validateImagesForV2,
  revokeValidationPreviews,
  V2_MAX_IMAGES,
  V2_MAX_FILE_SIZE_BYTES,
  V2_MAX_TOTAL_SIZE_BYTES,
  type BatchValidationResult,
  type FileValidationResult,
} from '@/services/v2/imageValidationV2';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface UploadProgressState {
  isUploading: boolean;
  current: number;
  total: number;
  progress: number; // 0-100
}

interface ImageUploadPreviewV2Props {
  files: File[];
  onFilesChange: (files: File[]) => void;
  uploadState?: UploadProgressState;
  disabled?: boolean;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

const UploadRules: React.FC = () => (
  <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
      <Info className="h-4 w-4 text-primary" />
      Reglas de subida de imágenes
    </div>
    <ul className="text-xs text-muted-foreground space-y-1 ml-6 list-disc">
      <li>Máximo {V2_MAX_IMAGES} imágenes</li>
      <li>Formatos permitidos: JPG, PNG, WEBP</li>
      <li>Máximo {V2_MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB por imagen ({V2_MAX_TOTAL_SIZE_BYTES / (1024 * 1024)}MB en total)</li>
    </ul>
  </div>
);

const FileRow: React.FC<{
  result: FileValidationResult;
  index: number;
  onRemove: (index: number) => void;
  disabled: boolean;
}> = ({ result, index, onRemove, disabled }) => (
  <div className="flex items-center gap-3 p-2 rounded-md border border-border bg-background">
    {/* Thumbnail */}
    <div className="w-12 h-12 rounded overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center">
      {result.previewUrl ? (
        <img
          src={result.previewUrl}
          alt={result.file.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <ImageIcon className="h-5 w-5 text-muted-foreground" />
      )}
    </div>

    {/* Info */}
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-foreground truncate">{result.file.name}</p>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">{result.sizeFormatted}</span>
        {result.status === 'valid' ? (
          <span className="flex items-center gap-1 text-xs text-green-600">
            <CheckCircle2 className="h-3 w-3" /> Válido
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs text-destructive">
            <XCircle className="h-3 w-3" /> {result.errors[0]}
          </span>
        )}
      </div>
    </div>

    {/* Remove button */}
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-8 w-8 flex-shrink-0"
      onClick={() => onRemove(index)}
      disabled={disabled}
    >
      <XCircle className="h-4 w-4" />
    </Button>
  </div>
);

const UploadProgressIndicator: React.FC<{ state: UploadProgressState }> = ({ state }) => (
  <div className="space-y-2 p-3 rounded-lg border border-primary/30 bg-primary/5">
    <div className="flex items-center gap-2 text-sm font-medium text-primary">
      <Loader2 className="h-4 w-4 animate-spin" />
      Subiendo imágenes... ({state.current}/{state.total})
    </div>
    <Progress value={state.progress} className="h-2" />
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────

export const ImageUploadPreviewV2: React.FC<ImageUploadPreviewV2Props> = ({
  files,
  onFilesChange,
  uploadState,
  disabled = false,
}) => {
  const [validation, setValidation] = useState<BatchValidationResult | null>(null);

  // Validate whenever files change
  useEffect(() => {
    if (files.length === 0) {
      setValidation(null);
      return;
    }

    // Clean up previous previews
    if (validation) {
      revokeValidationPreviews(validation);
    }

    const result = validateImagesForV2(files);
    setValidation(result);

    return () => {
      revokeValidationPreviews(result);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) return;
      const newFiles = [...files, ...Array.from(e.target.files)];
      onFilesChange(newFiles);
      // Reset input so same files can be re-selected
      e.target.value = '';
    },
    [files, onFilesChange]
  );

  const handleRemove = useCallback(
    (index: number) => {
      const updated = files.filter((_, i) => i !== index);
      onFilesChange(updated);
    },
    [files, onFilesChange]
  );

  const isUploading = uploadState?.isUploading ?? false;
  const isDisabled = disabled || isUploading;

  const summary = useMemo(() => {
    if (!validation) return null;
    return {
      valid: validation.validCount,
      invalid: validation.invalidCount,
      totalSize: validation.totalSizeFormatted,
    };
  }, [validation]);

  return (
    <div className="space-y-4">
      {/* Rules */}
      <UploadRules />

      {/* File input */}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={isDisabled || files.length >= V2_MAX_IMAGES}
          onClick={() => document.getElementById('v2-image-input')?.click()}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          Seleccionar imágenes
        </Button>
        <input
          id="v2-image-input"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleFileInput}
          disabled={isDisabled}
        />
        {summary && (
          <span className="text-xs text-muted-foreground">
            {summary.valid} válidas · {summary.totalSize} total
          </span>
        )}
      </div>

      {/* Global errors */}
      {validation && validation.globalErrors.length > 0 && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 space-y-1">
          {validation.globalErrors.map((err, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              {err}
            </div>
          ))}
        </div>
      )}

      {/* Upload progress */}
      {uploadState && uploadState.isUploading && (
        <UploadProgressIndicator state={uploadState} />
      )}

      {/* File list */}
      {validation && validation.files.length > 0 && (
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {validation.files.map((result, index) => (
            <FileRow
              key={`${result.file.name}-${index}`}
              result={result}
              index={index}
              onRemove={handleRemove}
              disabled={isDisabled}
            />
          ))}
        </div>
      )}
    </div>
  );
};
