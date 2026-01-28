/**
 * Utilidades para formateo y conversión de datos
 */

/**
 * Formatea el tamaño de archivo para mostrar
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Formatea la resolución de imagen
 */
export const formatResolution = (width: number, height: number): string => {
  return `${width} × ${height}`;
};

/**
 * Formatea megapixeles
 */
export const formatMegapixels = (megapixels: number): string => {
  if (megapixels < 1) {
    return `${(megapixels * 1000).toFixed(0)}K pixels`;
  }
  return `${megapixels.toFixed(1)} MP`;
};

/**
 * Formatea aspect ratio
 */
export const formatAspectRatio = (ratio: number): string => {
  // Convertir a ratio común si es posible
  const commonRatios = [
    { ratio: 16/9, display: '16:9' },
    { ratio: 4/3, display: '4:3' },
    { ratio: 3/2, display: '3:2' },
    { ratio: 1/1, display: '1:1' },
    { ratio: 9/16, display: '9:16' },
    { ratio: 3/4, display: '3:4' }
  ];

  const closest = commonRatios.find(r => Math.abs(r.ratio - ratio) < 0.1);
  
  if (closest) {
    return closest.display;
  }
  
  return `${ratio.toFixed(2)}:1`;
};

/**
 * Formatea porcentaje de compresión
 */
export const formatCompressionRatio = (ratio: number): string => {
  return `${ratio.toFixed(1)}%`;
};

/**
 * Formatea tiempo transcurrido
 */
export const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `hace ${days} día${days > 1 ? 's' : ''}`;
  if (hours > 0) return `hace ${hours} hora${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
  return 'hace unos segundos';
};

/**
 * Convierte bytes a la unidad más apropiada
 */
export const getBestSizeUnit = (bytes: number): { value: number; unit: string } => {
  const units = [
    { threshold: 1024 * 1024 * 1024, unit: 'GB', divisor: 1024 * 1024 * 1024 },
    { threshold: 1024 * 1024, unit: 'MB', divisor: 1024 * 1024 },
    { threshold: 1024, unit: 'KB', divisor: 1024 },
    { threshold: 0, unit: 'Bytes', divisor: 1 }
  ];

  const bestUnit = units.find(u => bytes >= u.threshold) || units[units.length - 1];
  
  return {
    value: parseFloat((bytes / bestUnit.divisor).toFixed(2)),
    unit: bestUnit.unit
  };
};

/**
 * Valida y formatea URL de imagen
 */
export const formatImageUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.toString();
  } catch {
    // Si no es una URL válida, asumir que es una ruta relativa
    return url.startsWith('/') ? url : `/${url}`;
  }
};

/**
 * Extrae información de una URL de Supabase Storage
 */
export const parseSupabaseStorageUrl = (url: string): {
  bucket: string;
  path: string;
  fileName: string;
} | null => {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    
    // Formato típico: /storage/v1/object/public/bucket-name/path/to/file
    const bucketIndex = pathParts.findIndex(part => part === 'public') + 1;
    if (bucketIndex <= 0 || bucketIndex >= pathParts.length) {
      return null;
    }

    const bucket = pathParts[bucketIndex];
    const filePath = pathParts.slice(bucketIndex + 1).join('/');
    const fileName = pathParts[pathParts.length - 1];

    return {
      bucket,
      path: filePath,
      fileName
    };
  } catch {
    return null;
  }
};

/**
 * Genera un nombre de display amigable para el usuario
 */
export const generateDisplayName = (fileName: string): string => {
  return fileName
    .replace(/\.[^/.]+$/, '') // Remover extensión
    .replace(/[-_]/g, ' ') // Reemplazar guiones y guiones bajos con espacios
    .replace(/\b\w/g, l => l.toUpperCase()) // Capitalizar primera letra de cada palabra
    .replace(/\s+/g, ' ') // Eliminar espacios múltiples
    .trim();
};

/**
 * Valida si una cadena es un UUID válido
 */
export const isValidUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

/**
 * Trunca texto con elipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};