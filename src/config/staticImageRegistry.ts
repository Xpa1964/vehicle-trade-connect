/**
 * STATIC IMAGE REGISTRY
 * 
 * Centralized source of truth for ALL static UI images.
 * This registry powers the AI image control dashboard.
 * 
 * ⚠️ DO NOT manually edit image paths in components.
 * ⚠️ All static image management should reference this registry.
 * ⚠️ User-generated content is STRICTLY FORBIDDEN from this registry.
 * 
 * @created 2026-01-29
 * @version 3.0.0 - Type-locked with StaticImageId
 */

// Forbidden path patterns - user-generated content
const FORBIDDEN_PATH_PATTERNS = [
  '/uploads/',
  '/vehicles/',
  '/auctions/',
  '/user-content/',
  '/user-uploads/',
  '/attachments/',
  '/documents/',
  '/avatars/',
  'storage.googleapis.com',
  'supabase.co/storage'
] as const;

export type ImageSource = 'product';

export type ImageCategory = 'home' | 'layout' | 'dashboard' | 'auth' | 'messaging' | 'legal' | 'services' | 'marketing';

export interface StaticImageEntry {
  id: string;
  currentPath: string;
  usage: string;
  purpose: string;
  critical: boolean;
  aiEditable: boolean;
  fallback?: string;
  category: ImageCategory;
  source: ImageSource;
}

export interface ImageVersion {
  id: string;
  imageId: string;
  path: string;
  prompt?: string;
  globalStylePrompt?: string;
  createdAt: string;
  createdBy: string;
  isActive: boolean;
}

export interface GlobalStyleConfig {
  prompt: string;
  lastUpdated: string;
  updatedBy: string;
}

/**
 * Validates that a path is not user-generated content
 */
export const isProductImagePath = (path: string): boolean => {
  const lowerPath = path.toLowerCase();
  return !FORBIDDEN_PATH_PATTERNS.some(pattern => lowerPath.includes(pattern.toLowerCase()));
};

/**
 * Throws if path contains forbidden patterns
 */
export const validateProductImagePath = (path: string, imageId: string): void => {
  if (!isProductImagePath(path)) {
    console.error(`[StaticImageRegistry] WARNING: Image "${imageId}" has user-content path: ${path}`);
    throw new Error(`Image path "${path}" appears to be user-generated content. Product images only.`);
  }
};

export const STATIC_IMAGE_REGISTRY: Record<string, StaticImageEntry> = {
  // ═══════════════════════════════════════════════════════════════
  // HOME PAGE IMAGES
  // ═══════════════════════════════════════════════════════════════
  
  HOME_HERO: {
    id: "home.hero",
    currentPath: "/images/home-hero.png",
    usage: "HeroSection.tsx",
    purpose: "Main hero background - luxury vehicles",
    critical: true,
    aiEditable: true,
    category: "home",
    source: "product"
  },

  HOME_LOGO_HERO: {
    id: "home.logo.hero",
    currentPath: "/lovable-uploads/a645acd2-f5c2-4f99-be3b-9d089c634c3c.png",
    usage: "HeroSection.tsx",
    purpose: "KONTACT VO logo displayed in hero section",
    critical: true,
    aiEditable: false, // Logo branding - no editable por IA
    category: "layout", // Moved to layout as it's a logo, not home content
    source: "product"
  },

  HOME_HEADPHONES: {
    id: "home.headphones",
    currentPath: "src/assets/headphones-listen.png",
    usage: "AudioPresentationSection.tsx",
    purpose: "Headphones illustration for audio presentation",
    critical: true,
    aiEditable: true,
    category: "home", // Part of home page content
    source: "product"
  },

  // ═══════════════════════════════════════════════════════════════
  // LAYOUT / NAVBAR IMAGES
  // ═══════════════════════════════════════════════════════════════

  NAVBAR_LOGO: {
    id: "layout.navbar.logo",
    currentPath: "/lovable-uploads/865135a7-9f1d-44e9-9386-623ae7f90529.png",
    usage: "Brand.tsx",
    purpose: "Primary navbar logo",
    critical: true,
    aiEditable: false,
    fallback: "/lovable-uploads/59ae08bc-72ed-4520-82be-9f9166f533ae.png",
    category: "layout",
    source: "product"
  },

  NAVBAR_LOGO_FALLBACK: {
    id: "layout.navbar.logo.fallback",
    currentPath: "/lovable-uploads/59ae08bc-72ed-4520-82be-9f9166f533ae.png",
    usage: "Brand.tsx (fallback)",
    purpose: "Fallback navbar logo",
    critical: false,
    aiEditable: false,
    category: "layout",
    source: "product"
  },

  // ═══════════════════════════════════════════════════════════════
  // SERVICES SECTION IMAGES (public/images/)
  // ═══════════════════════════════════════════════════════════════

  SERVICE_SHOWROOM: {
    id: "services.showroom",
    currentPath: "/images/showroom-gallery.png",
    usage: "servicesData.ts → ServiceCard",
    purpose: "Vehicle gallery service card background",
    critical: true,
    aiEditable: true,
    category: "services",
    source: "product"
  },

  SERVICE_MESSAGING: {
    id: "services.messaging",
    currentPath: "/images/messaging-chat.png",
    usage: "servicesData.ts → ServiceCard",
    purpose: "Messaging service card background",
    critical: true,
    aiEditable: true,
    category: "services",
    source: "product"
  },

  SERVICE_INSPECTION: {
    id: "services.inspection",
    currentPath: "/images/vehicle-inspection.png",
    usage: "servicesData.ts → ServiceCard",
    purpose: "Vehicle reports service card background",
    critical: true,
    aiEditable: true,
    category: "services",
    source: "product"
  },

  SERVICE_EXCHANGES: {
    id: "services.exchanges",
    currentPath: "/images/vehicle-exchanges.png",
    usage: "servicesData.ts → ServiceCard",
    purpose: "Exchanges service card background",
    critical: true,
    aiEditable: true,
    category: "services",
    source: "product"
  },

  SERVICE_AUCTIONS: {
    id: "services.auctions",
    currentPath: "/images/auctions-hero.png",
    usage: "servicesData.ts → ServiceCard",
    purpose: "Auctions service card background",
    critical: true,
    aiEditable: true,
    category: "services",
    source: "product"
  },

  SERVICE_BULLETIN: {
    id: "services.bulletin",
    currentPath: "/images/bulletin-board.png",
    usage: "servicesData.ts → ServiceCard",
    purpose: "Bulletin board service card background",
    critical: true,
    aiEditable: true,
    category: "services",
    source: "product"
  },

  SERVICE_TRANSPORT: {
    id: "services.transport",
    currentPath: "/images/transport-highway.png",
    usage: "servicesData.ts → ServiceCard",
    purpose: "Transport service card background",
    critical: true,
    aiEditable: true,
    category: "services",
    source: "product"
  },

  SERVICE_CALCULATOR: {
    id: "services.calculator",
    currentPath: "/images/import-calculator.png",
    usage: "servicesData.ts → ServiceCard",
    purpose: "Import calculator service card background",
    critical: true,
    aiEditable: true,
    category: "services",
    source: "product"
  },

  SERVICE_BLOG: {
    id: "services.blog",
    currentPath: "/images/blog.png",
    usage: "servicesData.ts → ServiceCard",
    purpose: "Blog service card background",
    critical: true,
    aiEditable: true,
    category: "services",
    source: "product"
  },

  SERVICE_API: {
    id: "services.api",
    currentPath: "/images/api-keys-image.png",
    usage: "ControlPanel → APIKeyCard",
    purpose: "API Keys service card background",
    critical: false,
    aiEditable: true,
    category: "services",
    source: "product"
  },

  // ═══════════════════════════════════════════════════════════════
  // DASHBOARD CONTROL PANEL IMAGES (src/assets/)
  // ═══════════════════════════════════════════════════════════════

  DASHBOARD_VEHICLES: {
    id: "dashboard.vehicles",
    currentPath: "/assets/vehicle-gallery-image.png",
    usage: "ControlPanel.tsx",
    purpose: "Vehicles section card image",
    critical: true,
    aiEditable: true,
    category: "dashboard",
    source: "product"
  },

  DASHBOARD_PUBLISH_VEHICLE: {
    id: "dashboard.publish.vehicle",
    currentPath: "/assets/publish-vehicle-image.png",
    usage: "ControlPanel.tsx",
    purpose: "Publish vehicle card image",
    critical: true,
    aiEditable: true,
    category: "dashboard",
    source: "product"
  },

  DASHBOARD_BULLETIN: {
    id: "dashboard.bulletin",
    currentPath: "/images/bulletin-board.png",
    usage: "ControlPanel.tsx",
    purpose: "Bulletin board card image",
    critical: true,
    aiEditable: true,
    category: "dashboard",
    source: "product"
  },

  DASHBOARD_PUBLISH_ANNOUNCEMENT: {
    id: "dashboard.publish.announcement",
    currentPath: "/assets/announcement-image.png",
    usage: "ControlPanel.tsx",
    purpose: "Publish announcement card image",
    critical: true,
    aiEditable: true,
    category: "dashboard",
    source: "product"
  },

  DASHBOARD_EXCHANGES: {
    id: "dashboard.exchanges",
    currentPath: "/lovable-uploads/exchange-new.png",
    usage: "ControlPanel.tsx",
    purpose: "Exchanges section card image",
    critical: true,
    aiEditable: true,
    category: "dashboard",
    source: "product"
  },

  DASHBOARD_PUBLISH_EXCHANGE: {
    id: "dashboard.publish.exchange",
    currentPath: "/lovable-uploads/exchange-new.png",
    usage: "ControlPanel.tsx",
    purpose: "Publish exchange card image",
    critical: true,
    aiEditable: true,
    category: "dashboard",
    source: "product"
  },

  DASHBOARD_TRANSPORT: {
    id: "dashboard.transport",
    currentPath: "/assets/transport-quotes-image.png",
    usage: "ControlPanel.tsx",
    purpose: "Transport quotes card image",
    critical: true,
    aiEditable: true,
    category: "dashboard",
    source: "product"
  },

  DASHBOARD_QUOTE_TRANSPORT: {
    id: "dashboard.quote.transport",
    currentPath: "/assets/transport-image.png",
    usage: "ControlPanel.tsx",
    purpose: "Quote transport card image",
    critical: true,
    aiEditable: true,
    category: "dashboard",
    source: "product"
  },

  DASHBOARD_REPORTS: {
    id: "dashboard.reports",
    currentPath: "/assets/report-delivery-image.png",
    usage: "ControlPanel.tsx",
    purpose: "Vehicle reports card image",
    critical: true,
    aiEditable: true,
    category: "dashboard",
    source: "product"
  },

  DASHBOARD_REQUEST_REPORT: {
    id: "dashboard.request.report",
    currentPath: "/assets/request-report-image.png",
    usage: "ControlPanel.tsx",
    purpose: "Request report card image",
    critical: true,
    aiEditable: true,
    category: "dashboard",
    source: "product"
  },

  DASHBOARD_IMPORT_CALCULATOR: {
    id: "dashboard.import.calculator",
    currentPath: "/assets/import-calculator-image.png",
    usage: "ControlPanel.tsx",
    purpose: "Import calculator card image",
    critical: true,
    aiEditable: true,
    category: "dashboard",
    source: "product"
  },

  DASHBOARD_COMMISSION_CALCULATOR: {
    id: "dashboard.commission.calculator",
    currentPath: "/assets/commission-calculator-image.png",
    usage: "ControlPanel.tsx",
    purpose: "Commission calculator card image",
    critical: true,
    aiEditable: true,
    category: "dashboard",
    source: "product"
  },

  DASHBOARD_BLOG: {
    id: "dashboard.blog",
    currentPath: "/assets/blog-image.png",
    usage: "ControlPanel.tsx",
    purpose: "Blog section card image",
    critical: true,
    aiEditable: true,
    category: "dashboard",
    source: "product"
  },

  DASHBOARD_AUCTIONS: {
    id: "dashboard.auctions",
    currentPath: "/assets/auction-room-image.png",
    usage: "ControlPanel.tsx",
    purpose: "Auctions section card image",
    critical: true,
    aiEditable: true,
    category: "dashboard",
    source: "product"
  },

  DASHBOARD_CREATE_AUCTION: {
    id: "dashboard.create.auction",
    currentPath: "src/assets/dashboard/create-auction.png",
    usage: "ControlPanel.tsx",
    purpose: "Create auction card image",
    critical: true,
    aiEditable: true,
    category: "dashboard",
    source: "product"
  },

  DASHBOARD_MESSAGES: {
    id: "dashboard.messages",
    currentPath: "src/assets/dashboard/messages.png",
    usage: "ControlPanel.tsx",
    purpose: "Messages section card image",
    critical: true,
    aiEditable: true,
    category: "dashboard",
    source: "product"
  },

  DASHBOARD_FAVORITES: {
    id: "dashboard.favorites",
    currentPath: "src/assets/dashboard/favorites.png",
    usage: "ControlPanel.tsx",
    purpose: "Favorites section card image",
    critical: true,
    aiEditable: true,
    category: "dashboard",
    source: "product"
  },

  DASHBOARD_PROFILE: {
    id: "dashboard.profile",
    currentPath: "src/assets/dashboard/profile.png",
    usage: "ControlPanel.tsx",
    purpose: "Profile section card image",
    critical: true,
    aiEditable: true,
    category: "dashboard",
    source: "product"
  },

  // ═══════════════════════════════════════════════════════════════
  // MESSAGING IMAGES
  // ═══════════════════════════════════════════════════════════════

  MESSAGING_EMPTY_STATE: {
    id: "messaging.empty",
    currentPath: "/lovable-uploads/ca19ca42-addf-4a08-b9ff-8d70a611d23a.png",
    usage: "MessagesWithDeletion.tsx, ConversationList.tsx",
    purpose: "Empty state placeholder for messaging",
    critical: true,
    aiEditable: true,
    category: "messaging",
    source: "product"
  },

  MESSAGING_PLACEHOLDER_ES: {
    id: "messaging.placeholder.es",
    currentPath: "/lovable-uploads/8d67f46e-d1c0-4b17-89f7-aebb88ccb8d3.png",
    usage: "ChatPlaceholder.tsx",
    purpose: "Spanish chat placeholder illustration",
    critical: false,
    aiEditable: true,
    category: "messaging",
    source: "product"
  },

  MESSAGING_PLACEHOLDER_EN: {
    id: "messaging.placeholder.en",
    currentPath: "/lovable-uploads/8bed91df-a428-49d0-b2cb-d08fc5c92b9e.png",
    usage: "ChatPlaceholder.tsx",
    purpose: "English chat placeholder illustration",
    critical: false,
    aiEditable: true,
    category: "messaging",
    source: "product"
  },

  MESSAGING_PLACEHOLDER_FR: {
    id: "messaging.placeholder.fr",
    currentPath: "/lovable-uploads/4b7d3839-61e3-468e-8acf-9b338ccf71f9.png",
    usage: "ChatPlaceholder.tsx",
    purpose: "French chat placeholder illustration",
    critical: false,
    aiEditable: true,
    category: "messaging",
    source: "product"
  },

  MESSAGING_PLACEHOLDER_IT: {
    id: "messaging.placeholder.it",
    currentPath: "/lovable-uploads/d8af3bcb-af5f-474e-8495-1a20c94c8cf7.png",
    usage: "ChatPlaceholder.tsx",
    purpose: "Italian chat placeholder illustration",
    critical: false,
    aiEditable: true,
    category: "messaging",
    source: "product"
  },

  MESSAGING_PLACEHOLDER_PT: {
    id: "messaging.placeholder.pt",
    currentPath: "/lovable-uploads/eb58cf35-6a10-42bd-b3b5-f6bec3aa7ffd.png",
    usage: "ChatPlaceholder.tsx",
    purpose: "Portuguese chat placeholder illustration",
    critical: false,
    aiEditable: true,
    category: "messaging",
    source: "product"
  },

  MESSAGING_PLACEHOLDER_DE: {
    id: "messaging.placeholder.de",
    currentPath: "/lovable-uploads/3ad30d4e-64f5-418a-a430-c3e8f53d72e5.png",
    usage: "ChatPlaceholder.tsx",
    purpose: "German chat placeholder illustration",
    critical: false,
    aiEditable: true,
    category: "messaging",
    source: "product"
  },

  MESSAGING_PLACEHOLDER_NL: {
    id: "messaging.placeholder.nl",
    currentPath: "/lovable-uploads/62746f99-d2e7-49c3-9809-c90b06a81abe.png",
    usage: "ChatPlaceholder.tsx",
    purpose: "Dutch chat placeholder illustration",
    critical: false,
    aiEditable: true,
    category: "messaging",
    source: "product"
  },

  MESSAGING_PLACEHOLDER_PL: {
    id: "messaging.placeholder.pl",
    currentPath: "/lovable-uploads/e0d5dc47-0f5e-4424-98c5-0f7a2a8df8d7.png",
    usage: "ChatPlaceholder.tsx",
    purpose: "Polish chat placeholder illustration",
    critical: false,
    aiEditable: true,
    category: "messaging",
    source: "product"
  },

  MESSAGING_PLACEHOLDER_DK: {
    id: "messaging.placeholder.dk",
    currentPath: "/lovable-uploads/04e2ebaa-7d2a-46d3-be80-75e19f4a10ae.png",
    usage: "ChatPlaceholder.tsx",
    purpose: "Danish chat placeholder illustration",
    critical: false,
    aiEditable: true,
    category: "messaging",
    source: "product"
  },

  // ═══════════════════════════════════════════════════════════════
  // LEGAL PAGES
  // ═══════════════════════════════════════════════════════════════

  LEGAL_LOGO: {
    id: "legal.logo",
    currentPath: "/lovable-uploads/kontact-logo-legal.png",
    usage: "PrivacyPolicyPage.tsx, TermsAndConditionsPage.tsx, CookiesPage.tsx",
    purpose: "Legal pages header logo",
    critical: true,
    aiEditable: false,
    category: "legal",
    source: "product"
  },

  // ═══════════════════════════════════════════════════════════════
  // CONTACT & FORMS
  // ═══════════════════════════════════════════════════════════════

  CONTACT_LOGO: {
    id: "contact.logo",
    currentPath: "/lovable-uploads/865135a7-9f1d-44e9-9386-623ae7f90529.png",
    usage: "ContactPageLogo.tsx, ContactLogoHeader.tsx",
    purpose: "Contact page logo",
    critical: true,
    aiEditable: false,
    category: "marketing",
    source: "product"
  },

  VEHICLE_FORM_LOGO: {
    id: "form.vehicle.logo",
    currentPath: "/lovable-uploads/865135a7-9f1d-44e9-9386-623ae7f90529.png",
    usage: "VehicleFormHeader.tsx",
    purpose: "Vehicle form header logo",
    critical: true,
    aiEditable: false,
    category: "dashboard",
    source: "product"
  },

  // ═══════════════════════════════════════════════════════════════
  // ADMIN PANEL
  // ═══════════════════════════════════════════════════════════════

  ADMIN_API_KEYS: {
    id: "admin.apikeys",
    currentPath: "/lovable-uploads/2d3d0e7f-60fb-4a05-b0e8-56b76bf4e4b6.png",
    usage: "imageAssets.ts → admin",
    purpose: "API keys admin section illustration",
    critical: false,
    aiEditable: true,
    category: "dashboard",
    source: "product"
  },

  // ═══════════════════════════════════════════════════════════════
  // FALLBACK / DEFAULT IMAGES
  // ═══════════════════════════════════════════════════════════════

  FALLBACK_PLACEHOLDER: {
    id: "fallback.placeholder",
    currentPath: "/placeholder.svg",
    usage: "Multiple components (fallback)",
    purpose: "Global fallback placeholder",
    critical: true,
    aiEditable: false,
    category: "layout",
    source: "product"
  },

  // FALLBACK_HERO removed - using placeholder.svg as universal fallback

  FALLBACK_VEHICLE: {
    id: "fallback.vehicle",
    currentPath: "/assets/default-vehicle.jpg",
    usage: "imageAssets.ts",
    purpose: "Vehicle image fallback",
    critical: false,
    aiEditable: true,
    category: "dashboard",
    source: "product"
  },

  FALLBACK_AVATAR: {
    id: "fallback.avatar",
    currentPath: "/assets/default-avatar.jpg",
    usage: "imageAssets.ts",
    purpose: "User avatar fallback",
    critical: false,
    aiEditable: false,
    category: "auth",
    source: "product"
  },

  // ═══════════════════════════════════════════════════════════════
  // AUTH PAGES
  // ═══════════════════════════════════════════════════════════════

  AUTH_LOGO: {
    id: "auth.logo",
    currentPath: "/lovable-uploads/a645acd2-f5c2-4f99-be3b-9d089c634c3c.png",
    usage: "Login.tsx, Register.tsx",
    purpose: "Logo displayed in authentication pages",
    critical: true,
    aiEditable: false,
    category: "auth",
    source: "product"
  },

  // ═══════════════════════════════════════════════════════════════
  // ERROR PAGES
  // ═══════════════════════════════════════════════════════════════

  ERROR_404: {
    id: "error.404",
    currentPath: "/images/error-404.png",
    usage: "NotFound.tsx",
    purpose: "404 error page illustration",
    critical: false,
    aiEditable: true,
    category: "layout",
    source: "product"
  },

  // ═══════════════════════════════════════════════════════════════
  // INFO / HERO PAGES
  // ═══════════════════════════════════════════════════════════════

  HERO_EXCHANGES: {
    id: "hero.exchanges",
    currentPath: "/images/exchanges-hero.png",
    usage: "Exchanges.tsx",
    purpose: "Hero background for exchanges page",
    critical: true,
    aiEditable: true,
    category: "services",
    source: "product"
  },

  HERO_AUCTIONS: {
    id: "hero.auctions",
    currentPath: "/images/auctions-hero.png",
    usage: "LiveAuctionsPage.tsx, AuctionsInfoPage.tsx",
    purpose: "Hero background for auctions pages",
    critical: true,
    aiEditable: true,
    category: "services",
    source: "product"
  },

  HERO_VEHICLES: {
    id: "hero.vehicles",
    currentPath: "/images/showroom-gallery.png",
    usage: "VehicleGalleryInfoPage.tsx",
    purpose: "Hero background for vehicle gallery page",
    critical: true,
    aiEditable: true,
    category: "services",
    source: "product"
  },

  HERO_REPORTS: {
    id: "hero.reports",
    currentPath: "/images/vehicle-inspection.png",
    usage: "VehicleReportsInfoPage.tsx",
    purpose: "Hero background for vehicle reports page",
    critical: true,
    aiEditable: true,
    category: "services",
    source: "product"
  },

  INFO_GALLERY_VIEW: {
    id: "info.gallery.view",
    currentPath: "/images/showroom-gallery.png",
    usage: "VehicleGalleryInfoPage.tsx",
    purpose: "Gallery view illustration",
    critical: false,
    aiEditable: true,
    category: "services",
    source: "product"
  },

  INFO_GALLERY_DETAIL: {
    id: "info.gallery.detail",
    currentPath: "/images/vehicle-inspection.png",
    usage: "VehicleGalleryInfoPage.tsx",
    purpose: "Vehicle detail illustration",
    critical: false,
    aiEditable: true,
    category: "services",
    source: "product"
  },

  INFO_GALLERY_FORM: {
    id: "info.gallery.form",
    currentPath: "/images/bulletin-board.png",
    usage: "VehicleGalleryInfoPage.tsx",
    purpose: "Vehicle form illustration",
    critical: false,
    aiEditable: true,
    category: "services",
    source: "product"
  },

  // ═══════════════════════════════════════════════════════════════
  // TRANSPORT PAGES
  // ═══════════════════════════════════════════════════════════════

  HERO_TRANSPORT: {
    id: "hero.transport",
    currentPath: "/lovable-uploads/04839c38-9d09-4f2f-9ec2-8af7c35dbceb.png",
    usage: "Transport.tsx",
    purpose: "Hero background for transport request page",
    critical: true,
    aiEditable: true,
    category: "services",
    source: "product"
  },

  HERO_TRANSPORT_EXPRESS: {
    id: "hero.transport.express",
    currentPath: "/assets/transport-image.png",
    usage: "TransportExpressPage.tsx",
    purpose: "Hero background for transport express info page",
    critical: false,
    aiEditable: true,
    category: "services",
    source: "product"
  },

  HERO_TRANSPORT_QUOTES: {
    id: "hero.transport.quotes",
    currentPath: "/assets/transport-quotes-image.png",
    usage: "TransportQuoteManagement.tsx",
    purpose: "Hero background for transport quote management",
    critical: false,
    aiEditable: true,
    category: "services",
    source: "product"
  },

  // ═══════════════════════════════════════════════════════════════
  // BULLETIN / ANNOUNCEMENTS PAGES
  // ═══════════════════════════════════════════════════════════════

  HERO_BULLETIN: {
    id: "hero.bulletin",
    currentPath: "/images/bulletin-board.png",
    usage: "BulletinHero.tsx",
    purpose: "Hero background for bulletin board page",
    critical: true,
    aiEditable: true,
    category: "services",
    source: "product"
  },

  HERO_BULLETIN_PUBLISH: {
    id: "hero.bulletin.publish",
    currentPath: "/assets/announcement-image.png",
    usage: "PublishAnnouncementPage.tsx",
    purpose: "Header image for publish announcement page",
    critical: false,
    aiEditable: true,
    category: "services",
    source: "product"
  },

  // ═══════════════════════════════════════════════════════════════
  // REPORTS PAGES
  // ═══════════════════════════════════════════════════════════════

  HERO_REPORTS_DELIVERY: {
    id: "hero.reports.delivery",
    currentPath: "/assets/report-delivery-image.png",
    usage: "VehicleReports.tsx, RequestReport.tsx",
    purpose: "Hero background for vehicle reports delivery pages",
    critical: false,
    aiEditable: true,
    category: "services",
    source: "product"
  },

  // ═══════════════════════════════════════════════════════════════
  // CALCULATOR PAGES
  // ═══════════════════════════════════════════════════════════════

  HERO_IMPORT_CALCULATOR: {
    id: "hero.import.calculator",
    currentPath: "/lovable-uploads/ba9a7ade-a335-4687-9895-ed163a824df5.png",
    usage: "ImportCalculator.tsx",
    purpose: "Hero background for import calculator page",
    critical: false,
    aiEditable: true,
    category: "services",
    source: "product"
  },

  HERO_COMMISSION_CALCULATOR: {
    id: "hero.commission.calculator",
    currentPath: "/lovable-uploads/379e75ed-00ea-49f5-a545-0365e0d9dc22.png",
    usage: "CommissionCalculatorPage.tsx",
    purpose: "Hero background for commission calculator page",
    critical: false,
    aiEditable: true,
    category: "services",
    source: "product"
  },

  // ═══════════════════════════════════════════════════════════════
  // BLOG PAGE
  // ═══════════════════════════════════════════════════════════════

  HERO_BLOG: {
    id: "hero.blog",
    currentPath: "/lovable-uploads/eec67196-c0f3-47cb-9620-773175533a94.png",
    usage: "BlogMainPage.tsx",
    purpose: "Hero background for blog main page",
    critical: false,
    aiEditable: true,
    category: "marketing",
    source: "product"
  },

  // ═══════════════════════════════════════════════════════════════
  // MESSAGING PAGE
  // ═══════════════════════════════════════════════════════════════

  HERO_MESSAGING: {
    id: "hero.messaging",
    currentPath: "/images/messaging-chat.png",
    usage: "MessagingInfoPage.tsx",
    purpose: "Hero background for messaging info page",
    critical: false,
    aiEditable: true,
    category: "messaging",
    source: "product"
  },

  // ═══════════════════════════════════════════════════════════════
  // EXCHANGE PAGES
  // ═══════════════════════════════════════════════════════════════

  HERO_EXCHANGE_FORM: {
    id: "hero.exchange.form",
    currentPath: "/lovable-uploads/exchange-header.png",
    usage: "ExchangeForm.tsx",
    purpose: "Hero background for exchange request form",
    critical: false,
    aiEditable: true,
    category: "services",
    source: "product"
  },

  // ═══════════════════════════════════════════════════════════════
  // DASHBOARD HEADER
  // ═══════════════════════════════════════════════════════════════

  HERO_DASHBOARD_HEADER: {
    id: "hero.dashboard.header",
    currentPath: "/lovable-uploads/e8bcfe5d-970e-46e2-a7e3-97c470666f95.png",
    usage: "DashboardHeader.tsx",
    purpose: "Hero background for dashboard control panel header",
    critical: true,
    aiEditable: true,
    category: "dashboard",
    source: "product"
  },

  // ═══════════════════════════════════════════════════════════════
  // ADMIN API MANAGEMENT
  // ═══════════════════════════════════════════════════════════════

  HERO_API_MANAGEMENT: {
    id: "hero.api.management",
    currentPath: "/assets/api-keys-image.png",
    usage: "APIManagement.tsx",
    purpose: "Header image for API management admin page",
    critical: false,
    aiEditable: true,
    category: "dashboard",
    source: "product"
  }
};

// ═══════════════════════════════════════════════════════════════
// REGISTRY UTILITIES
// ═══════════════════════════════════════════════════════════════

/**
 * Get all images by category
 */
export const getImagesByCategory = (category: StaticImageEntry['category']): StaticImageEntry[] => {
  return Object.values(STATIC_IMAGE_REGISTRY).filter(img => img.category === category);
};

/**
 * Get all critical images
 */
export const getCriticalImages = (): StaticImageEntry[] => {
  return Object.values(STATIC_IMAGE_REGISTRY).filter(img => img.critical);
};

/**
 * Get all AI-editable images
 */
export const getAIEditableImages = (): StaticImageEntry[] => {
  return Object.values(STATIC_IMAGE_REGISTRY).filter(img => img.aiEditable);
};

/**
 * Get image by ID
 */
export const getImageById = (id: string): StaticImageEntry | undefined => {
  return Object.values(STATIC_IMAGE_REGISTRY).find(img => img.id === id);
};

/**
 * Get image by registry key
 */
export const getImageByKey = (key: string): StaticImageEntry | undefined => {
  return STATIC_IMAGE_REGISTRY[key];
};

/**
 * Validate all registry entries
 */
export const validateRegistry = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  Object.entries(STATIC_IMAGE_REGISTRY).forEach(([key, entry]) => {
    // Check source field
    if (entry.source !== 'product') {
      errors.push(`[${key}] Invalid source: ${entry.source}. Must be 'product'.`);
    }
    
    // Check for user-content paths
    if (!isProductImagePath(entry.currentPath)) {
      errors.push(`[${key}] Forbidden path detected: ${entry.currentPath}`);
    }
    
    // Check fallback paths
    if (entry.fallback && !isProductImagePath(entry.fallback)) {
      errors.push(`[${key}] Forbidden fallback path: ${entry.fallback}`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Registry statistics
 */
export const getRegistryStats = () => {
  const all = Object.values(STATIC_IMAGE_REGISTRY);
  const validation = validateRegistry();
  
  return {
    total: all.length,
    critical: all.filter(i => i.critical).length,
    aiEditable: all.filter(i => i.aiEditable).length,
    validationErrors: validation.errors.length,
    byCategory: {
      home: all.filter(i => i.category === 'home').length,
      layout: all.filter(i => i.category === 'layout').length,
      dashboard: all.filter(i => i.category === 'dashboard').length,
      auth: all.filter(i => i.category === 'auth').length,
      messaging: all.filter(i => i.category === 'messaging').length,
      legal: all.filter(i => i.category === 'legal').length,
      services: all.filter(i => i.category === 'services').length,
      marketing: all.filter(i => i.category === 'marketing').length
    }
  };
};

/**
 * Get all categories
 */
export const getAllCategories = (): ImageCategory[] => {
  return ['home', 'layout', 'dashboard', 'auth', 'messaging', 'legal', 'services', 'marketing'];
};

// ═══════════════════════════════════════════════════════════════
// TYPE-SAFE IMAGE ID SYSTEM
// ═══════════════════════════════════════════════════════════════

/**
 * Type-safe registry keys - prevents typos at compile time
 */
export type StaticImageKey = keyof typeof STATIC_IMAGE_REGISTRY;

/**
 * Type-safe image IDs - derived from registry entries
 * Use this type when referencing images by their semantic ID
 */
export type StaticImageId = typeof STATIC_IMAGE_REGISTRY[StaticImageKey]['id'];

/**
 * Get typed image by key (compile-time safe)
 */
export const getTypedImageByKey = <K extends StaticImageKey>(key: K): typeof STATIC_IMAGE_REGISTRY[K] => {
  return STATIC_IMAGE_REGISTRY[key];
};

/**
 * All valid image IDs for validation
 */
export const ALL_IMAGE_IDS: readonly string[] = Object.values(STATIC_IMAGE_REGISTRY).map(e => e.id);

/**
 * Runtime type guard for image IDs
 */
export const isValidImageId = (id: string): id is StaticImageId => {
  return ALL_IMAGE_IDS.includes(id);
};

/**
 * Get critical image paths for preloading
 * Returns paths for images marked as critical: true
 */
export const getCriticalImagePaths = (): string[] => {
  return getCriticalImages().map(img => img.currentPath);
};
