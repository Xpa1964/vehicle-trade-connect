export default {
  // API Management
  'api.management.title': 'API-beheer',
  'api.management.subtitle': 'Beheer uw API-sleutels en krijg toegang tot de volledige documentatie',
  'api.management.backToPanel': 'Terug naar Controlepaneel',
  
  // Statistics
  'api.stats.totalKeys': 'Totaal Sleutels',
  'api.stats.activeKeys': 'Actieve Sleutels',
  'api.stats.totalUsers': 'Totaal Gebruikers',
  'api.stats.totalRequests': 'Totaal Verzoeken',
  
  // API Keys List
  'api.keysList.title': 'Mijn API-sleutels',
  'api.keysList.description': 'Beheer uw API-sleutels en hun rechten',
  'api.keysList.name': 'Naam',
  'api.keysList.key': 'Sleutel',
  'api.keysList.created': 'Aangemaakt op',
  'api.keysList.lastUsed': 'Laatst gebruikt',
  'api.keysList.status': 'Status',
  'api.keysList.actions': 'Acties',
  
  // Status
  'api.status.active': 'Actief',
  'api.status.inactive': 'Inactief',
  
  // Key Row
  'api.keyRow.never': 'Nooit',
  'api.keyRow.copy': 'Kopiëren',
  'api.keyRow.copied': 'Gekopieerd!',
  'api.keyRow.deactivate': 'Deactiveren',
  
  // Actions
  'api.actions.createNew': 'Nieuwe Sleutel Aanmaken',
  'api.actions.view': 'Bekijken',
  'api.actions.edit': 'Bewerken',
  'api.actions.delete': 'Verwijderen',
  'api.actions.viewDocs': 'Documentatie Bekijken',
  'api.actions.testAPI': 'API Testen',
  
  // Details
  'api.details.title': 'API-sleutel Details',
  'api.details.keyId': 'Sleutel-ID',
  'api.details.keyName': 'Sleutelnaam',
  'api.details.createdAt': 'Aangemaakt op',
  'api.details.lastUsed': 'Laatst gebruikt',
  'api.details.requests': 'Verzoeken deze maand',
  'api.details.status': 'Status',
  'api.details.permissions': 'Rechten',
  'api.details.readVehicles': 'Voertuigen Lezen',
  'api.details.writeVehicles': 'Voertuigen Schrijven',
  
  // API Card
  'api.card.title': 'KONTACT VO API',
  'api.card.description': 'Integreer uw systemen met onze RESTful API',
  'api.card.endpoint': 'Endpoint',
  'api.card.documentation': 'Volledige Documentatie',
  'api.card.authentification': 'Authenticatie',
  'api.card.authDescription': 'Gebruik uw API-sleutel in de Authorization header',
  'api.card.rateLimit': 'Rate Limiet',
  'api.card.rateLimitDescription': '1000 verzoeken/uur',
  
  // Integration Guide
  'api.integration.title': 'Integratiegids',
  'api.integration.step1': 'Maak een API-sleutel aan vanuit het dashboard',
  'api.integration.step2': 'Voeg de sleutel toe aan uw verzoek headers',
  'api.integration.step3': 'Begin met het versturen van verzoeken naar onze endpoints',
  
  // API Key Creation
  'api.create.title': 'Nieuwe API-sleutel Aanmaken',
  'api.create.name': 'Sleutelnaam',
  'api.create.namePlaceholder': 'Mijn API-integratie',
  'api.create.description': 'Beschrijving (optioneel)',
  'api.create.descriptionPlaceholder': 'Beschrijving van deze API-sleutel...',
  'api.create.permissions': 'Rechten',
  'api.create.readVehicles': 'Voertuigen Lezen',
  'api.create.writeVehicles': 'Voertuigen Schrijven',
  'api.create.readUsers': 'Gebruikers Lezen',
  'api.create.cancel': 'Annuleren',
  'api.create.create': 'Sleutel Aanmaken',
  'api.create.success': 'API-sleutel succesvol aangemaakt',
  
  // Documentation Sections
  'api.docs.title': 'API-documentatie',
  'api.docs.process': 'Verzoekproces',
  'api.docs.format': 'Gegevensformaat',
  'api.docs.integration': 'Technische Integratie',
  'api.docs.normalization': 'Meertalige Normalisatie',
  'api.docs.reference': 'Snelreferentie',
  
  // Request Process
  'api.docs.process.title': 'API-verzoekproces',
  'api.docs.process.step1': '1. Authenticatie',
  'api.docs.process.step1Desc': 'Voeg uw API-sleutel toe aan de Authorization header',
  'api.docs.process.step2': '2. Gegevens Verzenden',
  'api.docs.process.step2Desc': 'Verzend de voertuiginformatie in JSON-formaat',
  'api.docs.process.step3': '3. Normalisatie',
  'api.docs.process.step3Desc': 'Onze systemen normaliseren automatisch meertalige velden',
  'api.docs.process.step4': '4. Reactie',
  'api.docs.process.step4Desc': 'Ontvang bevestiging met het aangemaakte voertuig-ID',
  
  // Data Format
  'api.docs.format.title': 'Gegevensformaat voor Voertuigpublicatie',
  'api.docs.format.required': 'Verplichte Velden',
  'api.docs.format.requiredDesc': 'Deze velden zijn noodzakelijk om een voertuig aan te maken',
  'api.docs.format.optional': 'Optionele Velden - Directe Gegevens',
  'api.docs.format.optionalDesc': 'Deze velden worden direct opgeslagen zonder transformatie',
  'api.docs.format.normalized': 'Optionele Velden - Vereisen Normalisatie',
  'api.docs.format.normalizedDesc': 'Deze velden worden automatisch in alle talen genormaliseerd',
  'api.docs.format.validation': 'Validaties',
  'api.docs.format.validationDesc': 'Validatieregels voor velden',
  'api.docs.format.example': 'Compleet Verzoekvoorbeeld',
  'api.docs.format.exampleDesc': 'JSON-voorbeeld met alle beschikbare velden',
  
  // Field Descriptions - Required
  'api.docs.format.makeDesc': 'Voertuigmerk (bijv.: "BMW", "Mercedes-Benz")',
  'api.docs.format.modelDesc': 'Voertuigmodel (bijv.: "3-Serie", "C-Klasse")',
  'api.docs.format.yearDesc': 'Bouwjaar (moet >= 1900 zijn)',
  'api.docs.format.priceDesc': 'Voertuigprijs in euro (moet > 0 zijn)',
  
  // Field Descriptions - Direct Optional
  'api.docs.format.mileageDesc': 'Kilometerstand in km. Belangrijk voor waardering',
  'api.docs.format.vinDesc': 'VIN-nummer. Unieke voertuigidentificatie',
  'api.docs.format.licensePlateDesc': 'Kenteken',
  'api.docs.format.descriptionDesc': 'Gedetailleerde voertuigbeschrijving (max. 5000 karakters)',
  'api.docs.format.imagesDesc': 'Array van afbeelding-URL\'s (max. 20 afbeeldingen)',
  'api.docs.format.videosDesc': 'Array van video-URL\'s (optioneel)',
  
  // Field Descriptions - Normalized
  'api.docs.format.statusDesc': 'Voertuigstatus (wordt in alle talen genormaliseerd)',
  'api.docs.format.iva_statusDesc': 'BTW-status (wordt genormaliseerd)',
  'api.docs.format.fuel_typeDesc': 'Brandstoftype (wordt genormaliseerd)',
  'api.docs.format.transmissionDesc': 'Transmissietype (wordt genormaliseerd)',
  'api.docs.format.body_typeDesc': 'Carrosserietype (wordt genormaliseerd)',
  'api.docs.format.colorDesc': 'Buitenkleur (wordt genormaliseerd)',
  'api.docs.format.interior_colorDesc': 'Binnenkleur (wordt genormaliseerd)',
  'api.docs.format.doorsDesc': 'Aantal deuren (wordt genormaliseerd)',
  'api.docs.format.seatsDesc': 'Aantal zitplaatsen (wordt genormaliseerd)',
  
  // Validation Rules
  'api.docs.format.yearValidation': 'Moet >= 1900 zijn',
  'api.docs.format.priceValidation': 'Moet > 0 zijn',
  'api.docs.format.mileageValidation': 'Moet >= 0 zijn',
  'api.docs.format.vinValidation': '17 alfanumerieke karakters',
  'api.docs.format.imagesValidation': 'Maximaal 20 afbeeldingen',
  'api.docs.format.descriptionValidation': 'Maximaal 5000 karakters',
  
  // Technical Integration
  'api.docs.integration.title': 'Technische Integratie',
  'api.docs.integration.endpoint': 'Endpoint',
  'api.docs.integration.method': 'Methode',
  'api.docs.integration.headers': 'Vereiste Headers',
  'api.docs.integration.curlExample': 'cURL-voorbeeld',
  'api.docs.integration.jsExample': 'JavaScript-voorbeeld',
  'api.docs.integration.pythonExample': 'Python-voorbeeld',
  'api.docs.integration.response': 'Verwachte Reactie',
  
  // Normalization
  'api.docs.normalization.title': 'Automatische Meertalige Normalisatie',
  'api.docs.normalization.description': 'Ons systeem normaliseert automatisch bepaalde velden in alle ondersteunde talen (ES, EN, FR, IT, DE, NL, PT, PL, DK)',
  'api.docs.normalization.process': 'Normalisatieproces',
  'api.docs.normalization.step1': '1. U verstuurt het veld in uw taal (bijv.: "Diesel")',
  'api.docs.normalization.step2': '2. Ons systeem detecteert en normaliseert het automatisch',
  'api.docs.normalization.step3': '3. Het voertuig wordt correct weergegeven in alle talen',
  'api.docs.normalization.fields': 'Normaliseerbare Velden',
  'api.docs.normalization.status': 'Status',
  'api.docs.normalization.iva': 'BTW',
  'api.docs.normalization.fuel': 'Brandstof',
  'api.docs.normalization.transmission': 'Transmissie',
  'api.docs.normalization.bodyType': 'Carrosserie',
  'api.docs.normalization.colors': 'Kleuren',
  'api.docs.normalization.note': 'Opmerking: U kunt deze velden in elke ondersteunde taal versturen',
  
  // Quick Reference
  'api.docs.reference.title': 'Snelreferentie van Velden',
  'api.docs.reference.field': 'Veld',
  'api.docs.reference.type': 'Type',
  'api.docs.reference.mandatory': 'Verplicht',
  'api.docs.reference.normalized': 'Genormaliseerd',
  'api.docs.reference.example': 'Voorbeeld',
  'api.docs.reference.yes': 'Ja',
  'api.docs.reference.no': 'Nee',
  'api.docs.reference.number': 'Nummer',
  'api.docs.reference.string': 'Tekst',
  'api.docs.reference.array': 'Array'
};
