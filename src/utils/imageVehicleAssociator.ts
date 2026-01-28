import { VehicleFormData } from '@/types/vehicle';

export interface ImageAssociation {
  vehicleIndex: number;
  vehicleVin?: string;
  vehiclePlate?: string;
  vehicleIdentifier: string; // brand model year para mostrar
  images: File[];
  thumbnailUrl?: string;
}

export interface AssociationStrategy {
  type: 'vin' | 'plate' | 'sequential' | 'manual';
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Normaliza un nombre de archivo para búsqueda
 */
const normalizeFileName = (fileName: string): string => {
  return fileName
    .toLowerCase()
    .replace(/\.(jpg|jpeg|png|gif|webp)$/i, '')
    .replace(/[_-]/g, ' ')
    .trim();
};

/**
 * Extrae posibles identificadores de un nombre de archivo
 */
const extractIdentifiers = (fileName: string): { vin?: string; plate?: string; position?: number } => {
  const normalized = normalizeFileName(fileName);
  
  // Buscar VIN (17 caracteres alfanuméricos)
  const vinMatch = normalized.match(/\b([a-hj-npr-z0-9]{17})\b/i);
  
  // Buscar matrícula (varios formatos comunes)
  const plateMatch = normalized.match(/\b([a-z]{1,3}\d{4}[a-z]{1,2}|\d{4}[a-z]{2,3})\b/i);
  
  // Buscar posición numérica
  const positionMatch = normalized.match(/\b(\d+)\b/);
  
  return {
    vin: vinMatch?.[1]?.toUpperCase(),
    plate: plateMatch?.[1]?.toUpperCase(),
    position: positionMatch ? parseInt(positionMatch[1], 10) : undefined,
  };
};

/**
 * Agrupa imágenes por carpeta si vienen de una estructura de carpetas
 */
const groupImagesByFolder = (files: File[]): Map<string, File[]> => {
  const groups = new Map<string, File[]>();
  
  for (const file of files) {
    // Intentar extraer nombre de carpeta del path (si existe)
    const path = (file as any).webkitRelativePath || file.name;
    const parts = path.split('/');
    
    // Si hay más de una parte, la primera parte es la carpeta
    const folder = parts.length > 1 ? parts[0] : 'root';
    
    if (!groups.has(folder)) {
      groups.set(folder, []);
    }
    groups.get(folder)!.push(file);
  }
  
  return groups;
};

/**
 * Estrategia 1: Asociar por VIN en nombre de archivo
 */
const associateByVIN = (vehicles: VehicleFormData[], images: File[]): ImageAssociation[] => {
  const associations: ImageAssociation[] = [];
  const usedImages = new Set<number>();
  
  for (let i = 0; i < vehicles.length; i++) {
    const vehicle = vehicles[i];
    if (!vehicle.vin) continue;
    
    const vehicleImages: File[] = [];
    
    for (let j = 0; j < images.length; j++) {
      if (usedImages.has(j)) continue;
      
      const identifiers = extractIdentifiers(images[j].name);
      if (identifiers.vin === vehicle.vin.toUpperCase()) {
        vehicleImages.push(images[j]);
        usedImages.add(j);
      }
    }
    
    if (vehicleImages.length > 0) {
      associations.push({
        vehicleIndex: i,
        vehicleVin: vehicle.vin,
        vehicleIdentifier: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
        images: vehicleImages.slice(0, 25), // Max 25 imágenes
      });
    }
  }
  
  return associations;
};

/**
 * Estrategia 2: Asociar por matrícula en nombre de archivo
 */
const associateByPlate = (vehicles: VehicleFormData[], images: File[]): ImageAssociation[] => {
  const associations: ImageAssociation[] = [];
  const usedImages = new Set<number>();
  
  for (let i = 0; i < vehicles.length; i++) {
    const vehicle = vehicles[i];
    if (!vehicle.licensePlate) continue;
    
    const vehicleImages: File[] = [];
    
    for (let j = 0; j < images.length; j++) {
      if (usedImages.has(j)) continue;
      
      const identifiers = extractIdentifiers(images[j].name);
      if (identifiers.plate === vehicle.licensePlate.toUpperCase()) {
        vehicleImages.push(images[j]);
        usedImages.add(j);
      }
    }
    
    if (vehicleImages.length > 0) {
      associations.push({
        vehicleIndex: i,
        vehiclePlate: vehicle.licensePlate,
        vehicleIdentifier: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
        images: vehicleImages.slice(0, 25),
      });
    }
  }
  
  return associations;
};

/**
 * Estrategia 3: Asociar por carpetas (nombre de carpeta = VIN o posición)
 */
const associateByFolder = (vehicles: VehicleFormData[], images: File[]): ImageAssociation[] => {
  const associations: ImageAssociation[] = [];
  const folderGroups = groupImagesByFolder(images);
  
  // Primero intentar asociar carpetas con VIN
  for (let i = 0; i < vehicles.length; i++) {
    const vehicle = vehicles[i];
    if (!vehicle.vin) continue;
    
    // Buscar carpeta que contenga el VIN
    for (const [folderName, folderImages] of folderGroups.entries()) {
      if (normalizeFileName(folderName).includes(vehicle.vin.toLowerCase())) {
        associations.push({
          vehicleIndex: i,
          vehicleVin: vehicle.vin,
          vehicleIdentifier: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
          images: folderImages.slice(0, 25),
        });
        folderGroups.delete(folderName);
        break;
      }
    }
  }
  
  return associations;
};

/**
 * Estrategia 4: Asociar secuencialmente (dividir imágenes equitativamente)
 */
const associateSequentially = (vehicles: VehicleFormData[], images: File[]): ImageAssociation[] => {
  const associations: ImageAssociation[] = [];
  const imagesPerVehicle = Math.floor(images.length / vehicles.length);
  const remainder = images.length % vehicles.length;
  
  let imageIndex = 0;
  
  for (let i = 0; i < vehicles.length; i++) {
    const vehicle = vehicles[i];
    
    // Algunos vehículos obtienen una imagen extra si hay remainder
    const count = imagesPerVehicle + (i < remainder ? 1 : 0);
    const vehicleImages = images.slice(imageIndex, imageIndex + count);
    
    if (vehicleImages.length > 0) {
      associations.push({
        vehicleIndex: i,
        vehicleIdentifier: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
        images: vehicleImages.slice(0, 25),
      });
    }
    
    imageIndex += count;
  }
  
  return associations;
};

/**
 * Sistema inteligente de asociación de imágenes a vehículos
 * Prueba múltiples estrategias y devuelve la mejor
 */
export const associateImagesToVehicles = (
  vehicles: VehicleFormData[],
  images: File[]
): { associations: ImageAssociation[]; strategy: AssociationStrategy } => {
  
  if (images.length === 0 || vehicles.length === 0) {
    return {
      associations: [],
      strategy: { type: 'sequential', confidence: 'low' },
    };
  }
  
  // Estrategia 1: Intentar por VIN
  const vinAssociations = associateByVIN(vehicles, images);
  if (vinAssociations.length >= vehicles.length * 0.8) {
    return {
      associations: vinAssociations,
      strategy: { type: 'vin', confidence: 'high' },
    };
  }
  
  // Estrategia 2: Intentar por matrícula
  const plateAssociations = associateByPlate(vehicles, images);
  if (plateAssociations.length >= vehicles.length * 0.8) {
    return {
      associations: plateAssociations,
      strategy: { type: 'plate', confidence: 'high' },
    };
  }
  
  // Estrategia 3: Intentar por estructura de carpetas
  const folderAssociations = associateByFolder(vehicles, images);
  if (folderAssociations.length >= vehicles.length * 0.6) {
    return {
      associations: folderAssociations,
      strategy: { type: 'vin', confidence: 'medium' },
    };
  }
  
  // Estrategia 4: Fallback a asociación secuencial
  const sequentialAssociations = associateSequentially(vehicles, images);
  return {
    associations: sequentialAssociations,
    strategy: { type: 'sequential', confidence: 'low' },
  };
};

/**
 * Reordena imágenes dentro de una asociación
 */
export const reorderImages = (
  association: ImageAssociation,
  fromIndex: number,
  toIndex: number
): ImageAssociation => {
  const newImages = [...association.images];
  const [movedImage] = newImages.splice(fromIndex, 1);
  newImages.splice(toIndex, 0, movedImage);
  
  return {
    ...association,
    images: newImages,
  };
};

/**
 * Marca una imagen como principal (primera posición)
 */
export const setImageAsPrimary = (
  association: ImageAssociation,
  imageIndex: number
): ImageAssociation => {
  return reorderImages(association, imageIndex, 0);
};

/**
 * Elimina una imagen de una asociación
 */
export const removeImage = (
  association: ImageAssociation,
  imageIndex: number
): ImageAssociation => {
  const newImages = association.images.filter((_, i) => i !== imageIndex);
  
  return {
    ...association,
    images: newImages,
  };
};

/**
 * Mueve imágenes de una asociación a otra
 */
export const moveImages = (
  fromAssociation: ImageAssociation,
  toAssociation: ImageAssociation,
  imageIndices: number[]
): { from: ImageAssociation; to: ImageAssociation } => {
  const imagesToMove = imageIndices
    .sort((a, b) => b - a) // Ordenar en reversa para no romper índices
    .map(i => fromAssociation.images[i])
    .filter(Boolean);
  
  const newFromImages = fromAssociation.images.filter((_, i) => !imageIndices.includes(i));
  const newToImages = [...toAssociation.images, ...imagesToMove].slice(0, 25);
  
  return {
    from: { ...fromAssociation, images: newFromImages },
    to: { ...toAssociation, images: newToImages },
  };
};
