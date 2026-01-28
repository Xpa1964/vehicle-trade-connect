export default {
  // API Management
  'api.management.title': 'API-styring',
  'api.management.subtitle': 'Administrer dine API-nøgler og få adgang til den komplette dokumentation',
  'api.management.backToPanel': 'Tilbage til Kontrolpanel',
  
  // Statistics
  'api.stats.totalKeys': 'Alle Nøgler',
  'api.stats.activeKeys': 'Aktive Nøgler',
  'api.stats.totalUsers': 'Alle Brugere',
  'api.stats.totalRequests': 'Alle Anmodninger',
  
  // API Keys List
  'api.keysList.title': 'Mine API-nøgler',
  'api.keysList.description': 'Administrer dine API-nøgler og deres tilladelser',
  'api.keysList.name': 'Navn',
  'api.keysList.key': 'Nøgle',
  'api.keysList.created': 'Oprettet',
  'api.keysList.lastUsed': 'Sidst brugt',
  'api.keysList.status': 'Status',
  'api.keysList.actions': 'Handlinger',
  
  // Status
  'api.status.active': 'Aktiv',
  'api.status.inactive': 'Inaktiv',
  
  // Key Row
  'api.keyRow.never': 'Aldrig',
  'api.keyRow.copy': 'Kopiér',
  'api.keyRow.copied': 'Kopieret!',
  'api.keyRow.deactivate': 'Deaktivér',
  
  // Actions
  'api.actions.createNew': 'Opret Ny Nøgle',
  'api.actions.view': 'Se',
  'api.actions.edit': 'Redigér',
  'api.actions.delete': 'Slet',
  'api.actions.viewDocs': 'Se Dokumentation',
  'api.actions.testAPI': 'Test API',
  
  // Details
  'api.details.title': 'API-nøgle Detaljer',
  'api.details.keyId': 'Nøgle-ID',
  'api.details.keyName': 'Nøglenavn',
  'api.details.createdAt': 'Oprettet',
  'api.details.lastUsed': 'Sidst brugt',
  'api.details.requests': 'Anmodninger denne måned',
  'api.details.status': 'Status',
  'api.details.permissions': 'Tilladelser',
  'api.details.readVehicles': 'Læs Køretøjer',
  'api.details.writeVehicles': 'Skriv Køretøjer',
  
  // API Card
  'api.card.title': 'KONTACT VO API',
  'api.card.description': 'Integrér dine systemer med vores RESTful API',
  'api.card.endpoint': 'Endpoint',
  'api.card.documentation': 'Komplet Dokumentation',
  'api.card.authentification': 'Autentificering',
  'api.card.authDescription': 'Brug din API-nøgle i Authorization-headeren',
  'api.card.rateLimit': 'Ratebegrænsning',
  'api.card.rateLimitDescription': '1000 anmodninger/time',
  
  // Integration Guide
  'api.integration.title': 'Integrationsvejledning',
  'api.integration.step1': 'Opret en API-nøgle fra panelet',
  'api.integration.step2': 'Inkludér nøglen i dine anmodningsheadere',
  'api.integration.step3': 'Begynd at sende anmodninger til vores endpoints',
  
  // API Key Creation
  'api.create.title': 'Opret Ny API-nøgle',
  'api.create.name': 'Nøglenavn',
  'api.create.namePlaceholder': 'Min API-integration',
  'api.create.description': 'Beskrivelse (valgfri)',
  'api.create.descriptionPlaceholder': 'Beskrivelse af denne API-nøgle...',
  'api.create.permissions': 'Tilladelser',
  'api.create.readVehicles': 'Læs Køretøjer',
  'api.create.writeVehicles': 'Skriv Køretøjer',
  'api.create.readUsers': 'Læs Brugere',
  'api.create.cancel': 'Annullér',
  'api.create.create': 'Opret Nøgle',
  'api.create.success': 'API-nøgle oprettet succesfuldt',
  
  // Documentation Sections
  'api.docs.title': 'API-dokumentation',
  'api.docs.process': 'Anmodningsproces',
  'api.docs.format': 'Dataformat',
  'api.docs.integration': 'Teknisk Integration',
  'api.docs.normalization': 'Flersproget Normalisering',
  'api.docs.reference': 'Hurtig Reference',
  
  // Request Process
  'api.docs.process.title': 'API-anmodningsproces',
  'api.docs.process.step1': '1. Autentificering',
  'api.docs.process.step1Desc': 'Inkludér din API-nøgle i Authorization-headeren',
  'api.docs.process.step2': '2. Datasendelse',
  'api.docs.process.step2Desc': 'Send køretøjsinformationen i JSON-format',
  'api.docs.process.step3': '3. Normalisering',
  'api.docs.process.step3Desc': 'Vores systemer normaliserer automatisk flersprogede felter',
  'api.docs.process.step4': '4. Svar',
  'api.docs.process.step4Desc': 'Modtag bekræftelse med det oprettede køretøjs-ID',
  
  // Data Format
  'api.docs.format.title': 'Dataformat for Køretøjspublicering',
  'api.docs.format.required': 'Obligatoriske Felter',
  'api.docs.format.requiredDesc': 'Disse felter er nødvendige for at oprette et køretøj',
  'api.docs.format.optional': 'Valgfrie Felter - Direkte Data',
  'api.docs.format.optionalDesc': 'Disse felter gemmes direkte uden transformation',
  'api.docs.format.normalized': 'Valgfrie Felter - Kræver Normalisering',
  'api.docs.format.normalizedDesc': 'Disse felter vil automatisk blive normaliseret på alle sprog',
  'api.docs.format.validation': 'Valideringer',
  'api.docs.format.validationDesc': 'Valideringsregler for felter',
  'api.docs.format.example': 'Komplet Anmodningseksempel',
  'api.docs.format.exampleDesc': 'JSON-eksempel med alle tilgængelige felter',
  
  // Field Descriptions - Required
  'api.docs.format.makeDesc': 'Køretøjsmærke (f.eks.: "BMW", "Mercedes-Benz")',
  'api.docs.format.modelDesc': 'Køretøjsmodel (f.eks.: "3-serie", "C-klasse")',
  'api.docs.format.yearDesc': 'Produktionsår (skal være >= 1900)',
  'api.docs.format.priceDesc': 'Køretøjspris i euro (skal være > 0)',
  
  // Field Descriptions - Direct Optional
  'api.docs.format.mileageDesc': 'Kilometertal i km. Vigtigt for vurdering',
  'api.docs.format.vinDesc': 'VIN-nummer. Unik køretøjsidentifikation',
  'api.docs.format.licensePlateDesc': 'Registreringsnummer',
  'api.docs.format.descriptionDesc': 'Detaljeret køretøjsbeskrivelse (maks. 5000 tegn)',
  'api.docs.format.imagesDesc': 'Array af billede-URL\'er (maks. 20 billeder)',
  'api.docs.format.videosDesc': 'Array af video-URL\'er (valgfri)',
  
  // Field Descriptions - Normalized
  'api.docs.format.statusDesc': 'Køretøjsstatus (vil blive normaliseret på alle sprog)',
  'api.docs.format.iva_statusDesc': 'Momsstatus (vil blive normaliseret)',
  'api.docs.format.fuel_typeDesc': 'Brændstoftype (vil blive normaliseret)',
  'api.docs.format.transmissionDesc': 'Gearkassetype (vil blive normaliseret)',
  'api.docs.format.body_typeDesc': 'Karrosseritype (vil blive normaliseret)',
  'api.docs.format.colorDesc': 'Udvendig farve (vil blive normaliseret)',
  'api.docs.format.interior_colorDesc': 'Indvendig farve (vil blive normaliseret)',
  'api.docs.format.doorsDesc': 'Antal døre (vil blive normaliseret)',
  'api.docs.format.seatsDesc': 'Antal sæder (vil blive normaliseret)',
  
  // Validation Rules
  'api.docs.format.yearValidation': 'Skal være >= 1900',
  'api.docs.format.priceValidation': 'Skal være > 0',
  'api.docs.format.mileageValidation': 'Skal være >= 0',
  'api.docs.format.vinValidation': '17 alfanumeriske tegn',
  'api.docs.format.imagesValidation': 'Maksimalt 20 billeder',
  'api.docs.format.descriptionValidation': 'Maksimalt 5000 tegn',
  
  // Technical Integration
  'api.docs.integration.title': 'Teknisk Integration',
  'api.docs.integration.endpoint': 'Endpoint',
  'api.docs.integration.method': 'Metode',
  'api.docs.integration.headers': 'Krævede Headers',
  'api.docs.integration.curlExample': 'cURL-eksempel',
  'api.docs.integration.jsExample': 'JavaScript-eksempel',
  'api.docs.integration.pythonExample': 'Python-eksempel',
  'api.docs.integration.response': 'Forventet Svar',
  
  // Normalization
  'api.docs.normalization.title': 'Automatisk Flersproget Normalisering',
  'api.docs.normalization.description': 'Vores system normaliserer automatisk visse felter på alle understøttede sprog (ES, EN, FR, IT, DE, NL, PT, PL, DK)',
  'api.docs.normalization.process': 'Normaliseringsproces',
  'api.docs.normalization.step1': '1. Du sender feltet på dit sprog (f.eks.: "Diesel")',
  'api.docs.normalization.step2': '2. Vores system opdager og normaliserer det automatisk',
  'api.docs.normalization.step3': '3. Køretøjet vises korrekt på alle sprog',
  'api.docs.normalization.fields': 'Normaliserbare Felter',
  'api.docs.normalization.status': 'Status',
  'api.docs.normalization.iva': 'Moms',
  'api.docs.normalization.fuel': 'Brændstof',
  'api.docs.normalization.transmission': 'Gearkasse',
  'api.docs.normalization.bodyType': 'Karrosseri',
  'api.docs.normalization.colors': 'Farver',
  'api.docs.normalization.note': 'Bemærk: Du kan sende disse felter på ethvert understøttet sprog',
  
  // Quick Reference
  'api.docs.reference.title': 'Hurtig Reference til Felter',
  'api.docs.reference.field': 'Felt',
  'api.docs.reference.type': 'Type',
  'api.docs.reference.mandatory': 'Obligatorisk',
  'api.docs.reference.normalized': 'Normaliseret',
  'api.docs.reference.example': 'Eksempel',
  'api.docs.reference.yes': 'Ja',
  'api.docs.reference.no': 'Nej',
  'api.docs.reference.number': 'Tal',
  'api.docs.reference.string': 'Tekst',
  'api.docs.reference.array': 'Array'
};
