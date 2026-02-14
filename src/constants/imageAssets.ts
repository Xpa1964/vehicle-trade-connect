
/**
 * LEGACY - Image assets module
 * 
 * ⚠️ DEPRECATED: Use STATIC_IMAGE_REGISTRY instead
 * This file is kept for backward compatibility.
 * 
 * @see src/config/staticImageRegistry.ts
 */

import { getCriticalImagePaths } from '@/config/staticImageRegistry';

// Default fallback image for any image that fails to load
export const DEFAULT_FALLBACK_IMAGE = "/placeholder.svg";

/**
 * Critical images for preloading - now powered by registry
 * @deprecated Use getCriticalImagePaths() from staticImageRegistry.ts
 */
export const CRITICAL_IMAGES = getCriticalImagePaths();

// Legacy exports kept for backward compatibility
// @deprecated - Use registry instead
export const HERO_IMAGES = {
  primary: "/lovable-uploads/d756e9c6-4a89-45dc-a824-7c846cdb6c2b.png",
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

// Vehicle-related fallback images
export const VEHICLE_IMAGES = {
  default: "/assets/default-vehicle.jpg",
  thumbnail: "/assets/vehicle-thumbnail.jpg"
};

// User-related fallback images
export const USER_IMAGES = {
  avatar: "/assets/default-avatar.jpg",
  profile: "/assets/default-profile.jpg" 
};

// Brand/marketing fallback images
export const BRAND_IMAGES = {
  banner: "/assets/default-banner.jpg",
  background: "/assets/default-background.jpg"
};

// Dashboard images for control panel sections
export const DASHBOARD_IMAGES = {
  vehicles: {
    primary: "/dashboard/vehicles.png",
    fallback: "/assets/dashboard/vehicles-fallback.png"
  },
  publishVehicle: {
    primary: "/dashboard/publish-vehicle.png", 
    fallback: "/assets/dashboard/publish-vehicle-fallback.png"
  },
  bulletinBoard: {
    primary: "/dashboard/bulletin-board.png",
    fallback: "/assets/dashboard/bulletin-board-fallback.png"
  },
  publishAnnouncement: {
    primary: "/dashboard/publish-announcement.png",
    fallback: "/assets/dashboard/publish-announcement-fallback.png"
  },
  exchanges: {
    primary: "/dashboard/exchanges.png",
    fallback: "/assets/dashboard/exchanges-fallback.png"
  },
  publishExchange: {
    primary: "/dashboard/publish-exchange.png",
    fallback: "/assets/dashboard/publish-exchange-fallback.png"
  },
  transportQuotes: {
    primary: "/dashboard/transport-quotes.png",
    fallback: "/assets/dashboard/transport-quotes-fallback.png"
  },
  quoteTransport: {
    primary: "/dashboard/quote-transport.png",
    fallback: "/assets/dashboard/quote-transport-fallback.png"
  },
  vehicleReports: {
    primary: "/dashboard/vehicle-reports.png",
    fallback: "/assets/dashboard/vehicle-reports-fallback.png"
  },
  requestReport: {
    primary: "/dashboard/request-report.png",
    fallback: "/assets/dashboard/request-report-fallback.png"
  },
  importCalculator: {
    primary: "/dashboard/import-calculator.png",
    fallback: "/assets/dashboard/import-calculator-fallback.png"
  },
  commissionCalculator: {
    primary: "/dashboard/commission-calculator.png",
    fallback: "/assets/dashboard/commission-calculator-fallback.png"
  },
  blog: {
    primary: "/dashboard/blog.png",
    fallback: "/assets/dashboard/blog-fallback.png"
  }
};

// Admin panel images
export const apiKeysImage = "/lovable-uploads/2d3d0e7f-60fb-4a05-b0e8-56b76bf4e4b6.png";
