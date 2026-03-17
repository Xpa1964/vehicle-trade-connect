/**
 * Client-side image validation for publishVehicleV2
 * 
 * Pure validation logic — NO UI, NO toasts, NO side effects.
 * Used by UX layer BEFORE calling publishVehicleV2.
 */

// ─── Constants (mirror publishVehicleV2 constraints) ─────────────────────────

export const V2_MAX_IMAGES = 20;
export const V2_MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
export const V2_MAX_TOTAL_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
export const V2_ALLOWED_MIME_TYPES: ReadonlySet<string> = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);
export const V2_ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'] as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export type FileValidationStatus = 'valid' | 'invalid';

export interface FileValidationResult {
  file: File;
  status: FileValidationStatus;
  errors: string[];
  previewUrl: string | null;
  sizeFormatted: string;
}

export interface BatchValidationResult {
  files: FileValidationResult[];
  isValid: boolean;
  globalErrors: string[];
  totalSize: number;
  totalSizeFormatted: string;
  validCount: number;
  invalidCount: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

// ─── Single file validation ─────────────────────────────────────────────────

function validateSingleFile(file: File): FileValidationResult {
  const errors: string[] = [];

  // Type check
  if (!V2_ALLOWED_MIME_TYPES.has(file.type)) {
    errors.push(`unsupported type: ${file.type}`);
  }

  // Size check
  if (file.size > V2_MAX_FILE_SIZE_BYTES) {
    errors.push(`exceeds 10MB (${formatBytes(file.size)})`);
  }

  // Generate preview URL only for valid images
  let previewUrl: string | null = null;
  if (errors.length === 0 && V2_ALLOWED_MIME_TYPES.has(file.type)) {
    try {
      previewUrl = URL.createObjectURL(file);
    } catch {
      // Non-critical — preview just won't show
    }
  }

  return {
    file,
    status: errors.length === 0 ? 'valid' : 'invalid',
    errors,
    previewUrl,
    sizeFormatted: formatBytes(file.size),
  };
}

// ─── Batch validation ───────────────────────────────────────────────────────

export function validateImagesForV2(
  files: File[] | FileList
): BatchValidationResult {
  const fileArray = files instanceof FileList ? Array.from(files) : [...files];
  const globalErrors: string[] = [];

  // Count check
  if (fileArray.length > V2_MAX_IMAGES) {
    globalErrors.push(`max ${V2_MAX_IMAGES} images allowed (got ${fileArray.length})`);
  }

  // Total size check
  const totalSize = fileArray.reduce((acc, f) => acc + f.size, 0);
  if (totalSize > V2_MAX_TOTAL_SIZE_BYTES) {
    globalErrors.push(`total image size exceeds 50MB (${formatBytes(totalSize)})`);
  }

  // Validate each file
  const validatedFiles = fileArray.map(validateSingleFile);
  const validCount = validatedFiles.filter((f) => f.status === 'valid').length;
  const invalidCount = validatedFiles.filter((f) => f.status === 'invalid').length;

  return {
    files: validatedFiles,
    isValid: globalErrors.length === 0 && invalidCount === 0,
    globalErrors,
    totalSize,
    totalSizeFormatted: formatBytes(totalSize),
    validCount,
    invalidCount,
  };
}

// ─── Cleanup ─────────────────────────────────────────────────────────────────

export function revokeValidationPreviews(result: BatchValidationResult): void {
  for (const file of result.files) {
    if (file.previewUrl) {
      URL.revokeObjectURL(file.previewUrl);
    }
  }
}
