/**
 * FASE 2: Esquema Maestro de Traducciones
 * Define todas las claves obligatorias para cada módulo
 */

export const TRANSLATION_SCHEMA = {
  // Navegación
  navigation: [
    'home', 'vehicles', 'bulletin', 'transport', 'exchanges', 'auctions',
    'dashboard', 'reports', 'control', 'profile', 'admin', 'logout',
    'myVehicles', 'myListings', 'myQuotes', 'myBids', 'settings',
    'messages', 'notifications', 'help', 'back', 'menu'
  ],
  
  // Autenticación
  auth: [
    'login', 'logout', 'register', 'email', 'password', 'confirmPassword',
    'forgotPassword', 'resetPassword', 'rememberMe', 'signIn', 'signUp',
    'alreadyHaveAccount', 'dontHaveAccount', 'passwordMismatch',
    'invalidEmail', 'emailRequired', 'passwordRequired', 'loginError',
    'registerError', 'resetPasswordSent', 'name', 'company', 'phone',
    'acceptTerms', 'termsRequired', 'emailExists', 'weakPassword'
  ],
  
  // Común
  common: [
    'save', 'cancel', 'delete', 'edit', 'create', 'update', 'search',
    'filter', 'sort', 'loading', 'error', 'success', 'warning', 'info',
    'yes', 'no', 'ok', 'confirm', 'back', 'next', 'previous', 'close',
    'open', 'download', 'upload', 'submit', 'reset', 'clear', 'apply',
    'selectAll', 'deselectAll', 'showMore', 'showLess', 'noResults',
    'noData', 'required', 'optional', 'select', 'selectOption',
    'actions', 'status', 'date', 'time', 'description', 'details',
    'name', 'email', 'phone', 'address', 'city', 'country', 'price',
    'total', 'subtotal', 'discount', 'tax', 'quantity', 'view',
    'all', 'none', 'active', 'inactive', 'pending', 'approved',
    'rejected', 'completed', 'cancelled', 'draft', 'published'
  ],
  
  // Vehículos
  vehicles: [
    'title', 'addVehicle', 'editVehicle', 'deleteVehicle', 'myVehicles',
    'vehicleDetails', 'brand', 'model', 'year', 'price', 'kilometers',
    'color', 'fuel', 'transmission', 'bodyType', 'doors', 'seats',
    'power', 'description', 'images', 'features', 'condition',
    'status', 'available', 'sold', 'reserved', 'location', 'owner',
    'contact', 'phone', 'email', 'publishDate', 'lastUpdate',
    'views', 'favorites', 'share', 'print', 'export',
    'searchPlaceholder', 'noVehicles', 'loadingVehicles',
    'vehicleAdded', 'vehicleUpdated', 'vehicleDeleted',
    'errorAddingVehicle', 'errorUpdatingVehicle', 'errorDeletingVehicle',
    'confirmDelete', 'deleteSuccess', 'deleteError',
    'selectBrand', 'selectModel', 'selectYear', 'selectFuel',
    'selectTransmission', 'selectBodyType',
    'downloadTemplate', 'downloadTemplateDesc', 'uploadFile',
    'bulkUpload', 'bulkUploadTemplate', 'bulkUploadInstructions',
    'bulkUploadSuccess', 'bulkUploadError', 'processingFile',
    'validatingData', 'importingVehicles', 'vehiclesImported',
    'invalidFile', 'invalidData', 'duplicateVehicles'
  ],
  
  // Intercambios
  exchanges: [
    'title', 'description', 'subtitle', 'search', 'searchDescription',
    'searchPlaceholder', 'createRequest', 'availableVehicles',
    'noVehicles', 'noVehiclesFound', 'ownVehiclesExcluded',
    'offering', 'accepting', 'brand', 'model', 'year', 'kilometers',
    'brands', 'countries', 'publishedBy', 'contact',
    'requestExchange', 'formDescription', 'offeringDescription',
    'acceptingDescription', 'brandsInterest', 'countriesOrigin',
    'brandPlaceholder', 'modelPlaceholder', 'yearPlaceholder',
    'kilometersPlaceholder', 'brandsPlaceholder', 'countriesPlaceholder',
    'publishRequest', 'noExchanges', 'createFirst', 'statusLabel',
    'exchangeAddedTitle', 'exchangeAddedDescription', 'exchangeErrorDescription',
    'exchange', 'deleteSuccess', 'deleteError', 'proposedExchange',
    'proposeExchange', 'proposeExchangeFor', 'selectVehicleToExchange',
    'selectVehicleToOffer', 'selectVehicle', 'selectExistingVehicle',
    'enterNewVehicle', 'vehicleDetails', 'noVehiclesAvailable',
    'compensation', 'compensationDescription', 'additionalConditions',
    'conditionsPlaceholder', 'conditionsDescription', 'sendProposal',
    'proposalSent', 'proposalSentDescription', 'errorSendingProposal',
    'missingInformation', 'rejectProposal', 'acceptProposal',
    'counterOffer', 'proposalAccepted', 'proposalRejected',
    'counterOfferReceived', 'counterOfferTitle', 'counterOfferDescription',
    'acceptedTitle', 'acceptedDescription', 'rejectedTitle',
    'rejectedDescription', 'counterofferedTitle', 'counterofferedDescription',
    'responseError', 'noVehiclesToOffer', 'addVehicleFirst',
    'preview', 'previewProposal', 'proposalPending',
    'negotiationHistory', 'yourOffer', 'theirOffer',
    'createCounterOffer', 'sendCounterOffer',
    'chooseOptionTitle', 'chooseOptionDescription'
  ],
  
  // Subastas
  auctions: [
    'title', 'description', 'activeAuctions', 'myBids', 'createAuction',
    'auctionDetails', 'currentBid', 'minimumBid', 'placeBid',
    'bidAmount', 'bidsCount', 'timeLeft', 'startDate', 'endDate',
    'winner', 'status', 'active', 'ended', 'cancelled', 'winner',
    'bidPlaced', 'bidError', 'auctionCreated', 'auctionError',
    'confirmBid', 'outbid', 'winning', 'lost', 'won'
  ],
  
  // Mensajes
  messaging: [
    'title', 'conversations', 'newMessage', 'sendMessage', 'noMessages',
    'typeMessage', 'messageSent', 'messageError', 'deleteConversation',
    'markAsRead', 'markAsUnread', 'search', 'filter', 'unread',
    'archive', 'unarchive', 'block', 'unblock', 'report'
  ],
  
  // Perfil
  profile: [
    'title', 'editProfile', 'personalInfo', 'companyInfo', 'contactInfo',
    'changePassword', 'currentPassword', 'newPassword', 'confirmNewPassword',
    'updateProfile', 'profileUpdated', 'profileError', 'passwordChanged',
    'passwordError', 'avatar', 'uploadAvatar', 'removeAvatar',
    'bio', 'website', 'social', 'preferences', 'language',
    'notifications', 'privacy', 'security', 'deleteAccount'
  ],
  
  // Dashboard
  dashboard: [
    'title', 'welcome', 'overview', 'statistics', 'recentActivity',
    'quickActions', 'notifications', 'messages', 'tasks', 'calendar',
    'totalVehicles', 'activeListings', 'pendingQuotes', 'completedSales',
    'revenue', 'expenses', 'profit', 'viewAll', 'viewDetails'
  ],
  
  // Reportes
  reports: [
    'title', 'generateReport', 'exportReport', 'reportType', 'dateRange',
    'from', 'to', 'filters', 'sales', 'inventory', 'financial',
    'performance', 'custom', 'export', 'pdf', 'excel', 'csv',
    'print', 'share', 'schedule', 'automated'
  ],
  
  // Transporte
  transport: [
    'title', 'requestQuote', 'myQuotes', 'quoteDetails', 'origin',
    'destination', 'pickupDate', 'deliveryDate', 'vehicleType',
    'distance', 'estimatedPrice', 'quoteRequested', 'quoteError',
    'acceptQuote', 'rejectQuote', 'quoteAccepted', 'quoteRejected'
  ],
  
  // Validación
  validation: [
    'required', 'invalid', 'tooShort', 'tooLong', 'invalidEmail',
    'invalidPhone', 'invalidUrl', 'invalidDate', 'invalidNumber',
    'minValue', 'maxValue', 'minLength', 'maxLength', 'pattern',
    'mustMatch', 'mustBeUnique', 'mustBePositive', 'mustBeNegative',
    'mustBeInteger', 'mustBeDecimal', 'alphanumeric', 'alphabetic',
    'numeric', 'future', 'past', 'invalidFormat'
  ],
  
  // Formularios
  forms: [
    'fillForm', 'requiredFields', 'optionalFields', 'saveAsDraft',
    'submitForm', 'formSaved', 'formSubmitted', 'formError',
    'unsavedChanges', 'discardChanges', 'keepEditing', 'validationError',
    'uploadFiles', 'dragDrop', 'browseFiles', 'maxFileSize',
    'allowedFormats', 'fileUploaded', 'fileError', 'removeFile'
  ],
  
  // Calificaciones
  rating: [
    'title', 'rateExperience', 'yourRating', 'writeReview', 'submitRating',
    'thanksForRating', 'ratingSubmitted', 'ratingError', 'helpful',
    'notHelpful', 'reportReview', 'editReview', 'deleteReview',
    'stars', 'excellent', 'good', 'average', 'poor', 'terrible'
  ],
  
  // Excel/Templates
  xlsxTemplate: [
    'title', 'downloadTemplate', 'uploadTemplate', 'instructions',
    'requiredColumns', 'optionalColumns', 'exampleData', 'tips',
    'columnDescription', 'validValues', 'format', 'notes'
  ],
  
  xlsxValidation: [
    'validating', 'validationComplete', 'errors', 'warnings',
    'missingColumns', 'invalidData', 'duplicates', 'emptyRows',
    'invalidFormat', 'outOfRange', 'required', 'optional',
    'rowNumber', 'columnName', 'errorMessage', 'fixErrors'
  ]
} as const;

/**
 * Tipo derivado del esquema para TypeScript
 */
export type TranslationModule = keyof typeof TRANSLATION_SCHEMA;

/**
 * Valida que un objeto de traducciones tenga todas las claves requeridas
 */
export const validateModuleTranslations = (
  module: TranslationModule,
  translations: Record<string, string>
): {
  valid: boolean;
  missing: string[];
  extra: string[];
} => {
  const requiredKeys = TRANSLATION_SCHEMA[module] as readonly string[];
  const providedKeys = Object.keys(translations).filter(k => k.startsWith(`${module}.`));
  
  const missing = Array.from(requiredKeys)
    .map(key => `${module}.${key}`)
    .filter(key => !providedKeys.includes(key));
  
  const extra = providedKeys.filter(key => {
    const keyPart = key.replace(`${module}.`, '');
    return !Array.from(requiredKeys).includes(keyPart);
  });
  
  return {
    valid: missing.length === 0,
    missing,
    extra
  };
};

/**
 * Valida todas las traducciones contra el esquema
 */
export const validateAllTranslations = (
  translations: Record<string, string>
): Record<TranslationModule, ReturnType<typeof validateModuleTranslations>> => {
  const results = {} as Record<TranslationModule, ReturnType<typeof validateModuleTranslations>>;
  
  Object.keys(TRANSLATION_SCHEMA).forEach(module => {
    results[module as TranslationModule] = validateModuleTranslations(
      module as TranslationModule,
      translations
    );
  });
  
  return results;
};

/**
 * Obtiene todas las claves del esquema como array plano
 */
export const getAllSchemaKeys = (): string[] => {
  const keys: string[] = [];
  
  Object.entries(TRANSLATION_SCHEMA).forEach(([module, moduleKeys]) => {
    (moduleKeys as readonly string[]).forEach((key: string) => {
      keys.push(`${module}.${key}`);
    });
  });
  
  return keys;
};
