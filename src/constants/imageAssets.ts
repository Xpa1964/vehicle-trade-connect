/**
 * Image assets constants
 * Simple static paths - no preloading logic
 */

// Default fallback image for any image that fails to load
export const DEFAULT_FALLBACK_IMAGE = "/placeholder.svg";

// Legacy exports kept for backward compatibility
export const CRITICAL_IMAGES: string[] = [];

export const HERO_IMAGES = {
  primary: "/images/home-hero.png",
  fallbacks: ["/placeholder.svg"]
};

export const LOGO_IMAGES = {
  primary: "/lovable-uploads/kontact-driver-logo.png",
  primaryPNG: "/lovable-uploads/kontact-driver-logo.png",
  fallbacks: ["/lovable-uploads/865135a7-9f1d-44e9-9386-623ae7f90529.png", "/placeholder.svg"]
};

export const MESSAGES_IMAGES = {
  emptyState: "/lovable-uploads/ca19ca42-addf-4a08-b9ff-8d70a611d23a.png",
  fallbacks: ["/placeholder.svg"]
};

export const VEHICLE_IMAGES = {
  default: "/assets/default-vehicle.jpg",
  thumbnail: "/assets/vehicle-thumbnail.jpg"
};

export const USER_IMAGES = {
  avatar: "/assets/default-avatar.jpg",
  profile: "/assets/default-profile.jpg" 
};

export const BRAND_IMAGES = {
  banner: "/assets/default-banner.jpg",
  background: "/assets/default-background.jpg"
};

export const apiKeysImage = "/lovable-uploads/2d3d0e7f-60fb-4a05-b0e8-56b76bf4e4b6.png";
