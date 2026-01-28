export default {
  // API Management
  'api.management.title': 'Gestione API',
  'api.management.subtitle': 'Gestisci le tue chiavi API e accedi alla documentazione completa',
  'api.management.backToPanel': 'Torna al Pannello di Controllo',
  
  // Statistics
  'api.stats.totalKeys': 'Totale Chiavi',
  'api.stats.activeKeys': 'Chiavi Attive',
  'api.stats.totalUsers': 'Totale Utenti',
  'api.stats.totalRequests': 'Totale Richieste',
  
  // API Keys List
  'api.keysList.title': 'Le Mie Chiavi API',
  'api.keysList.description': 'Gestisci le tue chiavi API e i loro permessi',
  'api.keysList.name': 'Nome',
  'api.keysList.key': 'Chiave',
  'api.keysList.created': 'Creata il',
  'api.keysList.lastUsed': 'Ultimo utilizzo',
  'api.keysList.status': 'Stato',
  'api.keysList.actions': 'Azioni',
  
  // Status
  'api.status.active': 'Attiva',
  'api.status.inactive': 'Inattiva',
  
  // Key Row
  'api.keyRow.never': 'Mai',
  'api.keyRow.copy': 'Copia',
  'api.keyRow.copied': 'Copiato!',
  'api.keyRow.deactivate': 'Disattiva',
  
  // Actions
  'api.actions.createNew': 'Crea Nuova Chiave',
  'api.actions.view': 'Visualizza',
  'api.actions.edit': 'Modifica',
  'api.actions.delete': 'Elimina',
  'api.actions.viewDocs': 'Vedi Documentazione',
  'api.actions.testAPI': 'Testa API',
  
  // Details
  'api.details.title': 'Dettagli Chiave API',
  'api.details.keyId': 'ID Chiave',
  'api.details.keyName': 'Nome Chiave',
  'api.details.createdAt': 'Creata il',
  'api.details.lastUsed': 'Ultimo utilizzo',
  'api.details.requests': 'Richieste questo mese',
  'api.details.status': 'Stato',
  'api.details.permissions': 'Permessi',
  'api.details.readVehicles': 'Leggi Veicoli',
  'api.details.writeVehicles': 'Scrivi Veicoli',
  
  // API Card
  'api.card.title': 'API KONTACT VO',
  'api.card.description': 'Integra i tuoi sistemi con la nostra API RESTful',
  'api.card.endpoint': 'Endpoint',
  'api.card.documentation': 'Documentazione Completa',
  'api.card.authentification': 'Autenticazione',
  'api.card.authDescription': 'Usa la tua chiave API nell\'header Authorization',
  'api.card.rateLimit': 'Limite di Richieste',
  'api.card.rateLimitDescription': '1000 richieste/ora',
  
  // Integration Guide
  'api.integration.title': 'Guida all\'Integrazione',
  'api.integration.step1': 'Crea una chiave API dal pannello',
  'api.integration.step2': 'Includi la chiave negli header delle richieste',
  'api.integration.step3': 'Inizia a inviare richieste ai nostri endpoint',
  
  // API Key Creation
  'api.create.title': 'Crea una Nuova Chiave API',
  'api.create.name': 'Nome Chiave',
  'api.create.namePlaceholder': 'La Mia Integrazione API',
  'api.create.description': 'Descrizione (opzionale)',
  'api.create.descriptionPlaceholder': 'Descrizione di questa chiave API...',
  'api.create.permissions': 'Permessi',
  'api.create.readVehicles': 'Leggi Veicoli',
  'api.create.writeVehicles': 'Scrivi Veicoli',
  'api.create.readUsers': 'Leggi Utenti',
  'api.create.cancel': 'Annulla',
  'api.create.create': 'Crea Chiave',
  'api.create.success': 'Chiave API creata con successo',
  
  // Documentation Sections
  'api.docs.title': 'Documentazione API',
  'api.docs.process': 'Processo di Richiesta',
  'api.docs.format': 'Formato Dati',
  'api.docs.integration': 'Integrazione Tecnica',
  'api.docs.normalization': 'Normalizzazione Multi-lingua',
  'api.docs.reference': 'Riferimento Rapido',
  
  // Request Process
  'api.docs.process.title': 'Processo di Richiesta API',
  'api.docs.process.step1': '1. Autenticazione',
  'api.docs.process.step1Desc': 'Includi la tua chiave API nell\'header Authorization',
  'api.docs.process.step2': '2. Invio Dati',
  'api.docs.process.step2Desc': 'Invia le informazioni del veicolo in formato JSON',
  'api.docs.process.step3': '3. Normalizzazione',
  'api.docs.process.step3Desc': 'I nostri sistemi normalizzano automaticamente i campi multi-lingua',
  'api.docs.process.step4': '4. Risposta',
  'api.docs.process.step4Desc': 'Ricevi la conferma con l\'ID del veicolo creato',
  
  // Data Format
  'api.docs.format.title': 'Formato Dati per Pubblicazione Veicolo',
  'api.docs.format.required': 'Campi Obbligatori',
  'api.docs.format.requiredDesc': 'Questi campi sono indispensabili per creare un veicolo',
  'api.docs.format.optional': 'Campi Opzionali - Dati Diretti',
  'api.docs.format.optionalDesc': 'Questi campi si registrano direttamente senza trasformazione',
  'api.docs.format.normalized': 'Campi Opzionali - Richiedono Normalizzazione',
  'api.docs.format.normalizedDesc': 'Questi campi verranno normalizzati automaticamente in tutte le lingue',
  'api.docs.format.validation': 'Validazioni',
  'api.docs.format.validationDesc': 'Regole di validazione per i campi',
  'api.docs.format.example': 'Esempio di Richiesta Completa',
  'api.docs.format.exampleDesc': 'Esempio JSON con tutti i campi disponibili',
  
  // Field Descriptions - Required
  'api.docs.format.makeDesc': 'Marca del veicolo (es: "BMW", "Mercedes-Benz")',
  'api.docs.format.modelDesc': 'Modello del veicolo (es: "Serie 3", "Classe C")',
  'api.docs.format.yearDesc': 'Anno di produzione (deve essere >= 1900)',
  'api.docs.format.priceDesc': 'Prezzo del veicolo in euro (deve essere > 0)',
  
  // Field Descriptions - Direct Optional
  'api.docs.format.mileageDesc': 'Chilometraggio in km. Importante per la valutazione',
  'api.docs.format.vinDesc': 'Numero VIN. Identificativo unico del veicolo',
  'api.docs.format.licensePlateDesc': 'Targa di immatricolazione',
  'api.docs.format.descriptionDesc': 'Descrizione dettagliata del veicolo (max 5000 caratteri)',
  'api.docs.format.imagesDesc': 'Array di URL di immagini (max 20 immagini)',
  'api.docs.format.videosDesc': 'Array di URL di video (opzionale)',
  
  // Field Descriptions - Normalized
  'api.docs.format.statusDesc': 'Stato del veicolo (verrà normalizzato in tutte le lingue)',
  'api.docs.format.iva_statusDesc': 'Stato IVA (verrà normalizzato)',
  'api.docs.format.fuel_typeDesc': 'Tipo di carburante (verrà normalizzato)',
  'api.docs.format.transmissionDesc': 'Tipo di trasmissione (verrà normalizzato)',
  'api.docs.format.body_typeDesc': 'Tipo di carrozzeria (verrà normalizzato)',
  'api.docs.format.colorDesc': 'Colore esterno (verrà normalizzato)',
  'api.docs.format.interior_colorDesc': 'Colore interno (verrà normalizzato)',
  'api.docs.format.doorsDesc': 'Numero di porte (verrà normalizzato)',
  'api.docs.format.seatsDesc': 'Numero di posti (verrà normalizzato)',
  
  // Validation Rules
  'api.docs.format.yearValidation': 'Deve essere >= 1900',
  'api.docs.format.priceValidation': 'Deve essere > 0',
  'api.docs.format.mileageValidation': 'Deve essere >= 0',
  'api.docs.format.vinValidation': '17 caratteri alfanumerici',
  'api.docs.format.imagesValidation': 'Massimo 20 immagini',
  'api.docs.format.descriptionValidation': 'Massimo 5000 caratteri',
  
  // Technical Integration
  'api.docs.integration.title': 'Integrazione Tecnica',
  'api.docs.integration.endpoint': 'Endpoint',
  'api.docs.integration.method': 'Metodo',
  'api.docs.integration.headers': 'Header Richiesti',
  'api.docs.integration.curlExample': 'Esempio cURL',
  'api.docs.integration.jsExample': 'Esempio JavaScript',
  'api.docs.integration.pythonExample': 'Esempio Python',
  'api.docs.integration.response': 'Risposta Attesa',
  
  // Normalization
  'api.docs.normalization.title': 'Normalizzazione Multi-lingua Automatica',
  'api.docs.normalization.description': 'Il nostro sistema normalizza automaticamente alcuni campi in tutte le lingue supportate (ES, EN, FR, IT, DE, NL, PT, PL, DK)',
  'api.docs.normalization.process': 'Processo di Normalizzazione',
  'api.docs.normalization.step1': '1. Invii il campo nella tua lingua (es: "Diesel")',
  'api.docs.normalization.step2': '2. Il nostro sistema lo rileva e normalizza automaticamente',
  'api.docs.normalization.step3': '3. Il veicolo viene visualizzato correttamente in tutte le lingue',
  'api.docs.normalization.fields': 'Campi Normalizzabili',
  'api.docs.normalization.status': 'Stato',
  'api.docs.normalization.iva': 'IVA',
  'api.docs.normalization.fuel': 'Carburante',
  'api.docs.normalization.transmission': 'Trasmissione',
  'api.docs.normalization.bodyType': 'Carrozzeria',
  'api.docs.normalization.colors': 'Colori',
  'api.docs.normalization.note': 'Nota: Puoi inviare questi campi in qualsiasi lingua supportata',
  
  // Quick Reference
  'api.docs.reference.title': 'Riferimento Rapido dei Campi',
  'api.docs.reference.field': 'Campo',
  'api.docs.reference.type': 'Tipo',
  'api.docs.reference.mandatory': 'Obbligatorio',
  'api.docs.reference.normalized': 'Normalizzato',
  'api.docs.reference.example': 'Esempio',
  'api.docs.reference.yes': 'Sì',
  'api.docs.reference.no': 'No',
  'api.docs.reference.number': 'Numero',
  'api.docs.reference.string': 'Testo',
  'api.docs.reference.array': 'Array'
};
