
/**
 * Centralized storage for all image paths used in the application
 * Includes primary and fallback paths for critical images
 */

// Hero section images
export const HERO_IMAGES = {
  primary: "/lovable-uploads/d756e9c6-4a89-45dc-a824-7c846cdb6c2b.png",
  fallbacks: [
    "/assets/hero-fallback.jpg", 
    "/assets/hero-backup.jpg",
    "/assets/default-hero.jpg" // New default fallback
  ]
};

// Logo images
export const LOGO_IMAGES = {
  primary: "/lovable-uploads/865135a7-9f1d-44e9-9386-623ae7f90529.png", // Logo real KONTACT VO
  primaryPNG: "/lovable-uploads/a645acd2-f5c2-4f99-be3b-9d089c634c3c.png", // Legacy PNG fallback
  fallbacks: [
    "/lovable-uploads/59ae08bc-72ed-4520-82be-9f9166f533ae.png",
    "/logo.svg", // SVG genérico como fallback
    "/assets/logo-fallback.png",
    "/assets/default-logo.png"
  ]
};

// Messages page images
export const MESSAGES_IMAGES = {
  emptyState: "/lovable-uploads/ca19ca42-addf-4a08-b9ff-8d70a611d23a.png",
  fallbacks: [
    "/assets/default-messages.jpg",
    "/placeholder.svg"
  ]
};

// Default fallback image for any image that fails to load
export const DEFAULT_FALLBACK_IMAGE = "/placeholder.svg";

// Static image preloading configuration
export const CRITICAL_IMAGES = [
  HERO_IMAGES.primary,
  LOGO_IMAGES.primary,
  MESSAGES_IMAGES.emptyState,
  "/lovable-uploads/a645acd2-f5c2-4f99-be3b-9d089c634c3c.png" // Add the new logo as critical image
];

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
