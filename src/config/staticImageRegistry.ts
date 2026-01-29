/**
 * STATIC IMAGE REGISTRY
 * 
 * Centralized source of truth for ALL static UI images.
 * This registry powers the future AI image control dashboard.
 * 
 * ⚠️ DO NOT manually edit image paths in components.
 * ⚠️ All static image management should reference this registry.
 * 
 * @created 2026-01-29
 * @version 1.0.0
 */

export interface StaticImageEntry {
  id: string;
  currentPath: string;
  usage: string;
  purpose: string;
  critical: boolean;
  aiEditable: boolean;
  fallback?: string;
  category: 'home' | 'layout' | 'dashboard' | 'auth' | 'messaging' | 'legal' | 'services' | 'marketing';
}

export const STATIC_IMAGE_REGISTRY: Record<string, StaticImageEntry> = {
  // ═══════════════════════════════════════════════════════════════
  // HOME PAGE IMAGES
  // ═══════════════════════════════════════════════════════════════
  
  HOME_HERO: {
    id: "home.hero",
    currentPath: "/lovable-uploads/d756e9c6-4a89-45dc-a824-7c846cdb6c2b.png",
    usage: "HeroSection.tsx",
    purpose: "Main hero background - luxury vehicles",
    critical: true,
    aiEditable: true,
    category: "home"
  },

  HOME_LOGO_HERO: {
    id: "home.logo.hero",
    currentPath: "/lovable-uploads/a645acd2-f5c2-4f99-be3b-9d089c634c3c.png",
    usage: "HeroSection.tsx",
    purpose: "KONTACT VO logo displayed in hero section",
    critical: true,
    aiEditable: false,
    category: "home"
  },

  HOME_HEADPHONES: {
    id: "home.headphones",
    currentPath: "src/assets/headphones-listen.png",
    usage: "AudioPresentationSection.tsx",
    purpose: "Headphones illustration for audio presentation",
    critical: true,
    aiEditable: true,
    category: "home"
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
    category: "layout"
  },

  NAVBAR_LOGO_FALLBACK: {
    id: "layout.navbar.logo.fallback",
    currentPath: "/lovable-uploads/59ae08bc-72ed-4520-82be-9f9166f533ae.png",
    usage: "Brand.tsx (fallback)",
    purpose: "Fallback navbar logo",
    critical: false,
    aiEditable: false,
    category: "layout"
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
    category: "services"
  },

  SERVICE_MESSAGING: {
    id: "services.messaging",
    currentPath: "/images/messaging-chat.png",
    usage: "servicesData.ts → ServiceCard",
    purpose: "Messaging service card background",
    critical: true,
    aiEditable: true,
    category: "services"
  },

  SERVICE_INSPECTION: {
    id: "services.inspection",
    currentPath: "/images/vehicle-inspection.png",
    usage: "servicesData.ts → ServiceCard",
    purpose: "Vehicle reports service card background",
    critical: true,
    aiEditable: true,
    category: "services"
  },

  SERVICE_EXCHANGES: {
    id: "services.exchanges",
    currentPath: "/images/vehicle-exchanges.png",
    usage: "servicesData.ts → ServiceCard",
    purpose: "Exchanges service card background",
    critical: true,
    aiEditable: true,
    category: "services"
  },

  SERVICE_AUCTIONS: {
    id: "services.auctions",
    currentPath: "/images/auctions-hero.png",
    usage: "servicesData.ts → ServiceCard",
    purpose: "Auctions service card background",
    critical: true,
    aiEditable: true,
    category: "services"
  },

  SERVICE_BULLETIN: {
    id: "services.bulletin",
    currentPath: "/images/bulletin-board.png",
    usage: "servicesData.ts → ServiceCard",
    purpose: "Bulletin board service card background",
    critical: true,
    aiEditable: true,
    category: "services"
  },

  SERVICE_TRANSPORT: {
    id: "services.transport",
    currentPath: "/images/transport-highway.png",
    usage: "servicesData.ts → ServiceCard",
    purpose: "Transport service card background",
    critical: true,
    aiEditable: true,
    category: "services"
  },

  SERVICE_CALCULATOR: {
    id: "services.calculator",
    currentPath: "/images/import-calculator.png",
    usage: "servicesData.ts → ServiceCard",
    purpose: "Import calculator service card background",
    critical: true,
    aiEditable: true,
    category: "services"
  },

  SERVICE_BLOG: {
    id: "services.blog",
    currentPath: "/images/blog.png",
    usage: "servicesData.ts → ServiceCard",
    purpose: "Blog service card background",
    critical: true,
    aiEditable: true,
    category: "services"
  },

  // ═══════════════════════════════════════════════════════════════
  // DASHBOARD CONTROL PANEL IMAGES (src/assets/)
  // ═══════════════════════════════════════════════════════════════

  DASHBOARD_VEHICLES: {
    id: "dashboard.vehicles",
    currentPath: "src/assets/dashboard/vehicles.png",
    usage: "ControlPanel.tsx",
    purpose: "Vehicles section card image",
    critical: true,
    aiEditable: true,
    category: "dashboard"
  },

  DASHBOARD_PUBLISH_VEHICLE: {
    id: "dashboard.publish.vehicle",
    currentPath: "src/assets/dashboard/publish-vehicle.png",
    usage: "ControlPanel.tsx",
    purpose: "Publish vehicle card image",
    critical: true,
    aiEditable: true,
    category: "dashboard"
  },

  DASHBOARD_BULLETIN: {
    id: "dashboard.bulletin",
    currentPath: "src/assets/dashboard/bulletin-board.png",
    usage: "ControlPanel.tsx",
    purpose: "Bulletin board card image",
    critical: true,
    aiEditable: true,
    category: "dashboard"
  },

  DASHBOARD_PUBLISH_ANNOUNCEMENT: {
    id: "dashboard.publish.announcement",
    currentPath: "src/assets/dashboard/publish-announcement.png",
    usage: "ControlPanel.tsx",
    purpose: "Publish announcement card image",
    critical: true,
    aiEditable: true,
    category: "dashboard"
  },

  DASHBOARD_EXCHANGES: {
    id: "dashboard.exchanges",
    currentPath: "src/assets/dashboard/exchanges.png",
    usage: "ControlPanel.tsx",
    purpose: "Exchanges section card image",
    critical: true,
    aiEditable: true,
    category: "dashboard"
  },

  DASHBOARD_PUBLISH_EXCHANGE: {
    id: "dashboard.publish.exchange",
    currentPath: "src/assets/dashboard/publish-exchange.png",
    usage: "ControlPanel.tsx",
    purpose: "Publish exchange card image",
    critical: true,
    aiEditable: true,
    category: "dashboard"
  },

  DASHBOARD_TRANSPORT: {
    id: "dashboard.transport",
    currentPath: "src/assets/dashboard/transport-quotes.png",
    usage: "ControlPanel.tsx",
    purpose: "Transport quotes card image",
    critical: true,
    aiEditable: true,
    category: "dashboard"
  },

  DASHBOARD_QUOTE_TRANSPORT: {
    id: "dashboard.quote.transport",
    currentPath: "src/assets/dashboard/quote-transport.png",
    usage: "ControlPanel.tsx",
    purpose: "Quote transport card image",
    critical: true,
    aiEditable: true,
    category: "dashboard"
  },

  DASHBOARD_REPORTS: {
    id: "dashboard.reports",
    currentPath: "src/assets/dashboard/vehicle-reports.png",
    usage: "ControlPanel.tsx",
    purpose: "Vehicle reports card image",
    critical: true,
    aiEditable: true,
    category: "dashboard"
  },

  DASHBOARD_REQUEST_REPORT: {
    id: "dashboard.request.report",
    currentPath: "src/assets/dashboard/request-report.png",
    usage: "ControlPanel.tsx",
    purpose: "Request report card image",
    critical: true,
    aiEditable: true,
    category: "dashboard"
  },

  DASHBOARD_IMPORT_CALCULATOR: {
    id: "dashboard.import.calculator",
    currentPath: "src/assets/dashboard/import-calculator.png",
    usage: "ControlPanel.tsx",
    purpose: "Import calculator card image",
    critical: true,
    aiEditable: true,
    category: "dashboard"
  },

  DASHBOARD_COMMISSION_CALCULATOR: {
    id: "dashboard.commission.calculator",
    currentPath: "src/assets/dashboard/commission-calculator.png",
    usage: "ControlPanel.tsx",
    purpose: "Commission calculator card image",
    critical: true,
    aiEditable: true,
    category: "dashboard"
  },

  DASHBOARD_BLOG: {
    id: "dashboard.blog",
    currentPath: "src/assets/dashboard/blog.png",
    usage: "ControlPanel.tsx",
    purpose: "Blog section card image",
    critical: true,
    aiEditable: true,
    category: "dashboard"
  },

  DASHBOARD_AUCTIONS: {
    id: "dashboard.auctions",
    currentPath: "src/assets/dashboard/auctions.png",
    usage: "ControlPanel.tsx",
    purpose: "Auctions section card image",
    critical: true,
    aiEditable: true,
    category: "dashboard"
  },

  DASHBOARD_CREATE_AUCTION: {
    id: "dashboard.create.auction",
    currentPath: "src/assets/dashboard/create-auction.png",
    usage: "ControlPanel.tsx",
    purpose: "Create auction card image",
    critical: true,
    aiEditable: true,
    category: "dashboard"
  },

  DASHBOARD_MESSAGES: {
    id: "dashboard.messages",
    currentPath: "src/assets/dashboard/messages.png",
    usage: "ControlPanel.tsx",
    purpose: "Messages section card image",
    critical: true,
    aiEditable: true,
    category: "dashboard"
  },

  DASHBOARD_FAVORITES: {
    id: "dashboard.favorites",
    currentPath: "src/assets/dashboard/favorites.png",
    usage: "ControlPanel.tsx",
    purpose: "Favorites section card image",
    critical: true,
    aiEditable: true,
    category: "dashboard"
  },

  DASHBOARD_PROFILE: {
    id: "dashboard.profile",
    currentPath: "src/assets/dashboard/profile.png",
    usage: "ControlPanel.tsx",
    purpose: "Profile section card image",
    critical: true,
    aiEditable: true,
    category: "dashboard"
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
    category: "messaging"
  },

  MESSAGING_PLACEHOLDER_ES: {
    id: "messaging.placeholder.es",
    currentPath: "/lovable-uploads/8d67f46e-d1c0-4b17-89f7-aebb88ccb8d3.png",
    usage: "ChatPlaceholder.tsx",
    purpose: "Spanish chat placeholder illustration",
    critical: false,
    aiEditable: true,
    category: "messaging"
  },

  MESSAGING_PLACEHOLDER_EN: {
    id: "messaging.placeholder.en",
    currentPath: "/lovable-uploads/8bed91df-a428-49d0-b2cb-d08fc5c92b9e.png",
    usage: "ChatPlaceholder.tsx",
    purpose: "English chat placeholder illustration",
    critical: false,
    aiEditable: true,
    category: "messaging"
  },

  MESSAGING_PLACEHOLDER_FR: {
    id: "messaging.placeholder.fr",
    currentPath: "/lovable-uploads/4b7d3839-61e3-468e-8acf-9b338ccf71f9.png",
    usage: "ChatPlaceholder.tsx",
    purpose: "French chat placeholder illustration",
    critical: false,
    aiEditable: true,
    category: "messaging"
  },

  MESSAGING_PLACEHOLDER_IT: {
    id: "messaging.placeholder.it",
    currentPath: "/lovable-uploads/d8af3bcb-af5f-474e-8495-1a20c94c8cf7.png",
    usage: "ChatPlaceholder.tsx",
    purpose: "Italian chat placeholder illustration",
    critical: false,
    aiEditable: true,
    category: "messaging"
  },

  MESSAGING_PLACEHOLDER_PT: {
    id: "messaging.placeholder.pt",
    currentPath: "/lovable-uploads/eb58cf35-6a10-42bd-b3b5-f6bec3aa7ffd.png",
    usage: "ChatPlaceholder.tsx",
    purpose: "Portuguese chat placeholder illustration",
    critical: false,
    aiEditable: true,
    category: "messaging"
  },

  MESSAGING_PLACEHOLDER_DE: {
    id: "messaging.placeholder.de",
    currentPath: "/lovable-uploads/3ad30d4e-64f5-418a-a430-c3e8f53d72e5.png",
    usage: "ChatPlaceholder.tsx",
    purpose: "German chat placeholder illustration",
    critical: false,
    aiEditable: true,
    category: "messaging"
  },

  MESSAGING_PLACEHOLDER_NL: {
    id: "messaging.placeholder.nl",
    currentPath: "/lovable-uploads/62746f99-d2e7-49c3-9809-c90b06a81abe.png",
    usage: "ChatPlaceholder.tsx",
    purpose: "Dutch chat placeholder illustration",
    critical: false,
    aiEditable: true,
    category: "messaging"
  },

  MESSAGING_PLACEHOLDER_PL: {
    id: "messaging.placeholder.pl",
    currentPath: "/lovable-uploads/e0d5dc47-0f5e-4424-98c5-0f7a2a8df8d7.png",
    usage: "ChatPlaceholder.tsx",
    purpose: "Polish chat placeholder illustration",
    critical: false,
    aiEditable: true,
    category: "messaging"
  },

  MESSAGING_PLACEHOLDER_DK: {
    id: "messaging.placeholder.dk",
    currentPath: "/lovable-uploads/04e2ebaa-7d2a-46d3-be80-75e19f4a10ae.png",
    usage: "ChatPlaceholder.tsx",
    purpose: "Danish chat placeholder illustration",
    critical: false,
    aiEditable: true,
    category: "messaging"
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
    category: "legal"
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
    category: "marketing"
  },

  VEHICLE_FORM_LOGO: {
    id: "form.vehicle.logo",
    currentPath: "/lovable-uploads/865135a7-9f1d-44e9-9386-623ae7f90529.png",
    usage: "VehicleFormHeader.tsx",
    purpose: "Vehicle form header logo",
    critical: true,
    aiEditable: false,
    category: "dashboard"
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
    category: "dashboard"
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
    category: "layout"
  },

  FALLBACK_HERO: {
    id: "fallback.hero",
    currentPath: "/assets/hero-fallback.jpg",
    usage: "imageAssets.ts",
    purpose: "Hero section fallback",
    critical: false,
    aiEditable: true,
    category: "home"
  },

  FALLBACK_VEHICLE: {
    id: "fallback.vehicle",
    currentPath: "/assets/default-vehicle.jpg",
    usage: "imageAssets.ts",
    purpose: "Vehicle image fallback",
    critical: false,
    aiEditable: true,
    category: "dashboard"
  },

  FALLBACK_AVATAR: {
    id: "fallback.avatar",
    currentPath: "/assets/default-avatar.jpg",
    usage: "imageAssets.ts",
    purpose: "User avatar fallback",
    critical: false,
    aiEditable: false,
    category: "auth"
  }
};

// ═══════════════════════════════════════════════════════════════
// REGISTRY UTILITIES (Read-Only)
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
 * Registry statistics
 */
export const getRegistryStats = () => {
  const all = Object.values(STATIC_IMAGE_REGISTRY);
  return {
    total: all.length,
    critical: all.filter(i => i.critical).length,
    aiEditable: all.filter(i => i.aiEditable).length,
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
