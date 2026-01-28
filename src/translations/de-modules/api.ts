export default {
  // API Management
  'api.management.title': 'API-Verwaltung',
  'api.management.subtitle': 'Verwalten Sie Ihre API-Schlüssel und greifen Sie auf die vollständige Dokumentation zu',
  'api.management.backToPanel': 'Zurück zum Kontrollpanel',
  
  // Statistics
  'api.stats.totalKeys': 'Gesamte Schlüssel',
  'api.stats.activeKeys': 'Aktive Schlüssel',
  'api.stats.totalUsers': 'Gesamte Benutzer',
  'api.stats.totalRequests': 'Gesamte Anfragen',
  
  // API Keys List
  'api.keysList.title': 'Meine API-Schlüssel',
  'api.keysList.description': 'Verwalten Sie Ihre API-Schlüssel und deren Berechtigungen',
  'api.keysList.name': 'Name',
  'api.keysList.key': 'Schlüssel',
  'api.keysList.created': 'Erstellt am',
  'api.keysList.lastUsed': 'Zuletzt verwendet',
  'api.keysList.status': 'Status',
  'api.keysList.actions': 'Aktionen',
  
  // Status
  'api.status.active': 'Aktiv',
  'api.status.inactive': 'Inaktiv',
  
  // Key Row
  'api.keyRow.never': 'Nie',
  'api.keyRow.copy': 'Kopieren',
  'api.keyRow.copied': 'Kopiert!',
  'api.keyRow.deactivate': 'Deaktivieren',
  
  // Actions
  'api.actions.createNew': 'Neuen Schlüssel erstellen',
  'api.actions.view': 'Ansehen',
  'api.actions.edit': 'Bearbeiten',
  'api.actions.delete': 'Löschen',
  'api.actions.viewDocs': 'Dokumentation ansehen',
  'api.actions.testAPI': 'API testen',
  
  // Details
  'api.details.title': 'API-Schlüssel Details',
  'api.details.keyId': 'Schlüssel-ID',
  'api.details.keyName': 'Schlüsselname',
  'api.details.createdAt': 'Erstellt am',
  'api.details.lastUsed': 'Zuletzt verwendet',
  'api.details.requests': 'Anfragen diesen Monat',
  'api.details.status': 'Status',
  'api.details.permissions': 'Berechtigungen',
  'api.details.readVehicles': 'Fahrzeuge lesen',
  'api.details.writeVehicles': 'Fahrzeuge schreiben',
  
  // API Card
  'api.card.title': 'KONTACT VO API',
  'api.card.description': 'Integrieren Sie Ihre Systeme mit unserer RESTful API',
  'api.card.endpoint': 'Endpunkt',
  'api.card.documentation': 'Vollständige Dokumentation',
  'api.card.authentification': 'Authentifizierung',
  'api.card.authDescription': 'Verwenden Sie Ihren API-Schlüssel im Authorization-Header',
  'api.card.rateLimit': 'Rate Limit',
  'api.card.rateLimitDescription': '1000 Anfragen/Stunde',
  
  // Integration Guide
  'api.integration.title': 'Integrationsanleitung',
  'api.integration.step1': 'Erstellen Sie einen API-Schlüssel im Dashboard',
  'api.integration.step2': 'Fügen Sie den Schlüssel in Ihre Anfrage-Header ein',
  'api.integration.step3': 'Beginnen Sie mit dem Senden von Anfragen an unsere Endpunkte',
  
  // API Key Creation
  'api.create.title': 'Neuen API-Schlüssel erstellen',
  'api.create.name': 'Schlüsselname',
  'api.create.namePlaceholder': 'Meine API-Integration',
  'api.create.description': 'Beschreibung (optional)',
  'api.create.descriptionPlaceholder': 'Beschreibung dieses API-Schlüssels...',
  'api.create.permissions': 'Berechtigungen',
  'api.create.readVehicles': 'Fahrzeuge lesen',
  'api.create.writeVehicles': 'Fahrzeuge schreiben',
  'api.create.readUsers': 'Benutzer lesen',
  'api.create.cancel': 'Abbrechen',
  'api.create.create': 'Schlüssel erstellen',
  'api.create.success': 'API-Schlüssel erfolgreich erstellt',
  
  // Documentation Sections
  'api.docs.title': 'API-Dokumentation',
  'api.docs.process': 'Anfrageprozess',
  'api.docs.format': 'Datenformat',
  'api.docs.integration': 'Technische Integration',
  'api.docs.normalization': 'Mehrsprachige Normalisierung',
  'api.docs.reference': 'Schnellreferenz',
  
  // Request Process
  'api.docs.process.title': 'API-Anfrageprozess',
  'api.docs.process.step1': '1. Authentifizierung',
  'api.docs.process.step1Desc': 'Fügen Sie Ihren API-Schlüssel im Authorization-Header ein',
  'api.docs.process.step2': '2. Datenübermittlung',
  'api.docs.process.step2Desc': 'Senden Sie die Fahrzeuginformationen im JSON-Format',
  'api.docs.process.step3': '3. Normalisierung',
  'api.docs.process.step3Desc': 'Unsere Systeme normalisieren automatisch mehrsprachige Felder',
  'api.docs.process.step4': '4. Antwort',
  'api.docs.process.step4Desc': 'Erhalten Sie die Bestätigung mit der erstellten Fahrzeug-ID',
  
  // Data Format
  'api.docs.format.title': 'Datenformat für Fahrzeugveröffentlichung',
  'api.docs.format.required': 'Pflichtfelder',
  'api.docs.format.requiredDesc': 'Diese Felder sind zum Erstellen eines Fahrzeugs erforderlich',
  'api.docs.format.optional': 'Optionale Felder - Direkte Daten',
  'api.docs.format.optionalDesc': 'Diese Felder werden direkt ohne Transformation gespeichert',
  'api.docs.format.normalized': 'Optionale Felder - Erfordern Normalisierung',
  'api.docs.format.normalizedDesc': 'Diese Felder werden automatisch in allen Sprachen normalisiert',
  'api.docs.format.validation': 'Validierungen',
  'api.docs.format.validationDesc': 'Validierungsregeln für Felder',
  'api.docs.format.example': 'Vollständiges Anfragenbeispiel',
  'api.docs.format.exampleDesc': 'JSON-Beispiel mit allen verfügbaren Feldern',
  
  // Field Descriptions - Required
  'api.docs.format.makeDesc': 'Fahrzeugmarke (z.B.: "BMW", "Mercedes-Benz")',
  'api.docs.format.modelDesc': 'Fahrzeugmodell (z.B.: "3er-Reihe", "C-Klasse")',
  'api.docs.format.yearDesc': 'Baujahr (muss >= 1900 sein)',
  'api.docs.format.priceDesc': 'Fahrzeugpreis in Euro (muss > 0 sein)',
  
  // Field Descriptions - Direct Optional
  'api.docs.format.mileageDesc': 'Kilometerstand in km. Wichtig für die Bewertung',
  'api.docs.format.vinDesc': 'VIN-Nummer. Eindeutige Fahrzeugidentifikation',
  'api.docs.format.licensePlateDesc': 'Kennzeichen',
  'api.docs.format.descriptionDesc': 'Detaillierte Fahrzeugbeschreibung (max. 5000 Zeichen)',
  'api.docs.format.imagesDesc': 'Array von Bild-URLs (max. 20 Bilder)',
  'api.docs.format.videosDesc': 'Array von Video-URLs (optional)',
  
  // Field Descriptions - Normalized
  'api.docs.format.statusDesc': 'Fahrzeugstatus (wird in allen Sprachen normalisiert)',
  'api.docs.format.iva_statusDesc': 'MwSt-Status (wird normalisiert)',
  'api.docs.format.fuel_typeDesc': 'Kraftstoffart (wird normalisiert)',
  'api.docs.format.transmissionDesc': 'Getriebeart (wird normalisiert)',
  'api.docs.format.body_typeDesc': 'Karosserietyp (wird normalisiert)',
  'api.docs.format.colorDesc': 'Außenfarbe (wird normalisiert)',
  'api.docs.format.interior_colorDesc': 'Innenfarbe (wird normalisiert)',
  'api.docs.format.doorsDesc': 'Anzahl der Türen (wird normalisiert)',
  'api.docs.format.seatsDesc': 'Anzahl der Sitze (wird normalisiert)',
  
  // Validation Rules
  'api.docs.format.yearValidation': 'Muss >= 1900 sein',
  'api.docs.format.priceValidation': 'Muss > 0 sein',
  'api.docs.format.mileageValidation': 'Muss >= 0 sein',
  'api.docs.format.vinValidation': '17 alphanumerische Zeichen',
  'api.docs.format.imagesValidation': 'Maximal 20 Bilder',
  'api.docs.format.descriptionValidation': 'Maximal 5000 Zeichen',
  
  // Technical Integration
  'api.docs.integration.title': 'Technische Integration',
  'api.docs.integration.endpoint': 'Endpunkt',
  'api.docs.integration.method': 'Methode',
  'api.docs.integration.headers': 'Erforderliche Header',
  'api.docs.integration.curlExample': 'cURL-Beispiel',
  'api.docs.integration.jsExample': 'JavaScript-Beispiel',
  'api.docs.integration.pythonExample': 'Python-Beispiel',
  'api.docs.integration.response': 'Erwartete Antwort',
  
  // Normalization
  'api.docs.normalization.title': 'Automatische Mehrsprachige Normalisierung',
  'api.docs.normalization.description': 'Unser System normalisiert automatisch bestimmte Felder in allen unterstützten Sprachen (ES, EN, FR, IT, DE, NL, PT, PL, DK)',
  'api.docs.normalization.process': 'Normalisierungsprozess',
  'api.docs.normalization.step1': '1. Sie senden das Feld in Ihrer Sprache (z.B.: "Diesel")',
  'api.docs.normalization.step2': '2. Unser System erkennt und normalisiert es automatisch',
  'api.docs.normalization.step3': '3. Das Fahrzeug wird in allen Sprachen korrekt angezeigt',
  'api.docs.normalization.fields': 'Normalisierbare Felder',
  'api.docs.normalization.status': 'Status',
  'api.docs.normalization.iva': 'MwSt',
  'api.docs.normalization.fuel': 'Kraftstoff',
  'api.docs.normalization.transmission': 'Getriebe',
  'api.docs.normalization.bodyType': 'Karosserie',
  'api.docs.normalization.colors': 'Farben',
  'api.docs.normalization.note': 'Hinweis: Sie können diese Felder in jeder unterstützten Sprache senden',
  
  // Quick Reference
  'api.docs.reference.title': 'Schnellreferenz der Felder',
  'api.docs.reference.field': 'Feld',
  'api.docs.reference.type': 'Typ',
  'api.docs.reference.mandatory': 'Pflicht',
  'api.docs.reference.normalized': 'Normalisiert',
  'api.docs.reference.example': 'Beispiel',
  'api.docs.reference.yes': 'Ja',
  'api.docs.reference.no': 'Nein',
  'api.docs.reference.number': 'Zahl',
  'api.docs.reference.string': 'Text',
  'api.docs.reference.array': 'Array'
};
