/**
 * Cache para metadatos y optimización de consultas
 */

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export interface VehicleImageMetadata {
  vehicleId: string;
  imageCount: number;
  hasImages: boolean;
  primaryImageUrl?: string;
  lastUpdated: number;
}

export class VehicleImageCache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutos

  /**
   * Guarda datos en cache con TTL
   */
  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl
    });
  }

  /**
   * Obtiene datos del cache si no han expirado
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Invalida una entrada específica
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Invalida todas las entradas relacionadas con un vehículo
   */
  invalidateVehicle(vehicleId: string): void {
    const keysToDelete: string[] = [];
    
    for (const [key] of this.cache) {
      if (key.includes(vehicleId)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Limpia entradas expiradas
   */
  cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.cache) {
      if (now > entry.expiresAt) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => this.cache.delete(key));
  }

  /**
   * Obtiene estadísticas del cache
   */
  getStats(): {
    totalEntries: number;
    expiredEntries: number;
    hitRatio: number;
  } {
    const now = Date.now();
    let expiredCount = 0;
    let totalHits = 0;
    let totalRequests = 0;

    for (const [, entry] of this.cache) {
      if (now > entry.expiresAt) {
        expiredCount++;
      }
      // Aquí podrías rastrear hits/misses si lo implementas
    }

    return {
      totalEntries: this.cache.size,
      expiredEntries: expiredCount,
      hitRatio: totalRequests > 0 ? totalHits / totalRequests : 0
    };
  }

  /**
   * Limpia todo el cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Cache específico para metadatos de imágenes de vehículo
   */
  setVehicleImageMetadata(vehicleId: string, metadata: VehicleImageMetadata): void {
    this.set(`vehicle_images_${vehicleId}`, metadata);
  }

  /**
   * Obtiene metadatos de imágenes de vehículo desde cache
   */
  getVehicleImageMetadata(vehicleId: string): VehicleImageMetadata | null {
    return this.get<VehicleImageMetadata>(`vehicle_images_${vehicleId}`);
  }

  /**
   * Cache para conteo de imágenes
   */
  setImageCount(vehicleId: string, count: number): void {
    this.set(`image_count_${vehicleId}`, count);
  }

  /**
   * Obtiene conteo de imágenes desde cache
   */
  getImageCount(vehicleId: string): number | null {
    return this.get<number>(`image_count_${vehicleId}`);
  }
}

// Instancia singleton
export const vehicleImageCache = new VehicleImageCache();

// Limpieza automática cada 10 minutos
if (typeof window !== 'undefined') {
  setInterval(() => {
    vehicleImageCache.cleanup();
  }, 10 * 60 * 1000);
}