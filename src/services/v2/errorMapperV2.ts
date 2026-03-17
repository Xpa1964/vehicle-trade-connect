/**
 * Error mapper for publishVehicleV2
 * 
 * Maps internal/technical error messages to user-friendly strings.
 * Bilingual: returns Spanish by default.
 * NO UI — returns strings only.
 */

interface ErrorMapping {
  pattern: RegExp;
  messageEs: string;
  messageEn: string;
}

const ERROR_MAPPINGS: ErrorMapping[] = [
  {
    pattern: /total image size/i,
    messageEs: 'El tamaño total de las imágenes no puede superar 50MB',
    messageEn: 'Total image size cannot exceed 50MB',
  },
  {
    pattern: /exceeds 10MB/i,
    messageEs: 'Cada imagen debe pesar menos de 10MB',
    messageEn: 'Each image must be less than 10MB',
  },
  {
    pattern: /unsupported type/i,
    messageEs: 'Formato de imagen no permitido. Usa JPG, PNG o WEBP',
    messageEn: 'Unsupported image format. Use JPG, PNG or WEBP',
  },
  {
    pattern: /max \d+ images/i,
    messageEs: 'Se permiten un máximo de 20 imágenes',
    messageEn: 'Maximum 20 images allowed',
  },
  {
    pattern: /brand is required/i,
    messageEs: 'La marca es obligatoria',
    messageEn: 'Brand is required',
  },
  {
    pattern: /model is required/i,
    messageEs: 'El modelo es obligatorio',
    messageEn: 'Model is required',
  },
  {
    pattern: /year must be between/i,
    messageEs: 'El año no es válido',
    messageEn: 'Year is not valid',
  },
  {
    pattern: /price must be non-negative/i,
    messageEs: 'El precio no puede ser negativo',
    messageEn: 'Price cannot be negative',
  },
  {
    pattern: /all .* image uploads failed/i,
    messageEs: 'Todas las imágenes fallaron al subirse. Inténtalo de nuevo',
    messageEn: 'All image uploads failed. Please try again',
  },
  {
    pattern: /upload timeout/i,
    messageEs: 'La subida de imagen tardó demasiado. Inténtalo de nuevo',
    messageEn: 'Image upload timed out. Please try again',
  },
  {
    pattern: /not authenticated/i,
    messageEs: 'Debes iniciar sesión para publicar un vehículo',
    messageEn: 'You must be logged in to publish a vehicle',
  },
  {
    pattern: /vehicle creation failed/i,
    messageEs: 'No se pudo crear el vehículo. Inténtalo de nuevo',
    messageEn: 'Vehicle could not be created. Please try again',
  },
  {
    pattern: /vehicle finalization failed/i,
    messageEs: 'No se pudo finalizar la publicación. Inténtalo de nuevo',
    messageEn: 'Vehicle could not be finalized. Please try again',
  },
];

const FALLBACK_ES = 'Error al subir imágenes. Inténtalo de nuevo';
const FALLBACK_EN = 'Image upload error. Please try again';

export type SupportedLang = 'es' | 'en';

export function mapV2Error(error: unknown, lang: SupportedLang = 'es'): string {
  const message = error instanceof Error ? error.message : String(error);

  for (const mapping of ERROR_MAPPINGS) {
    if (mapping.pattern.test(message)) {
      return lang === 'en' ? mapping.messageEn : mapping.messageEs;
    }
  }

  return lang === 'en' ? FALLBACK_EN : FALLBACK_ES;
}
