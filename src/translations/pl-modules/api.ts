export default {
  // API Management
  'api.management.title': 'Zarządzanie API',
  'api.management.subtitle': 'Zarządzaj swoimi kluczami API i uzyskaj dostęp do pełnej dokumentacji',
  'api.management.backToPanel': 'Powrót do Panelu Kontrolnego',
  
  // Statistics
  'api.stats.totalKeys': 'Wszystkie Klucze',
  'api.stats.activeKeys': 'Aktywne Klucze',
  'api.stats.totalUsers': 'Wszyscy Użytkownicy',
  'api.stats.totalRequests': 'Wszystkie Żądania',
  
  // API Keys List
  'api.keysList.title': 'Moje Klucze API',
  'api.keysList.description': 'Zarządzaj swoimi kluczami API i ich uprawnieniami',
  'api.keysList.name': 'Nazwa',
  'api.keysList.key': 'Klucz',
  'api.keysList.created': 'Utworzono',
  'api.keysList.lastUsed': 'Ostatnie użycie',
  'api.keysList.status': 'Status',
  'api.keysList.actions': 'Akcje',
  
  // Status
  'api.status.active': 'Aktywny',
  'api.status.inactive': 'Nieaktywny',
  
  // Key Row
  'api.keyRow.never': 'Nigdy',
  'api.keyRow.copy': 'Kopiuj',
  'api.keyRow.copied': 'Skopiowano!',
  'api.keyRow.deactivate': 'Dezaktywuj',
  
  // Actions
  'api.actions.createNew': 'Utwórz Nowy Klucz',
  'api.actions.view': 'Zobacz',
  'api.actions.edit': 'Edytuj',
  'api.actions.delete': 'Usuń',
  'api.actions.viewDocs': 'Zobacz Dokumentację',
  'api.actions.testAPI': 'Testuj API',
  
  // Details
  'api.details.title': 'Szczegóły Klucza API',
  'api.details.keyId': 'ID Klucza',
  'api.details.keyName': 'Nazwa Klucza',
  'api.details.createdAt': 'Utworzono',
  'api.details.lastUsed': 'Ostatnie użycie',
  'api.details.requests': 'Żądania w tym miesiącu',
  'api.details.status': 'Status',
  'api.details.permissions': 'Uprawnienia',
  'api.details.readVehicles': 'Odczyt Pojazdów',
  'api.details.writeVehicles': 'Zapis Pojazdów',
  
  // API Card
  'api.card.title': 'API KONTACT VO',
  'api.card.description': 'Zintegruj swoje systemy z naszym API RESTful',
  'api.card.endpoint': 'Endpoint',
  'api.card.documentation': 'Pełna Dokumentacja',
  'api.card.authentification': 'Uwierzytelnianie',
  'api.card.authDescription': 'Użyj swojego klucza API w nagłówku Authorization',
  'api.card.rateLimit': 'Limit Żądań',
  'api.card.rateLimitDescription': '1000 żądań/godzinę',
  
  // Integration Guide
  'api.integration.title': 'Przewodnik Integracji',
  'api.integration.step1': 'Utwórz klucz API z panelu',
  'api.integration.step2': 'Dołącz klucz do nagłówków żądań',
  'api.integration.step3': 'Zacznij wysyłać żądania do naszych endpointów',
  
  // API Key Creation
  'api.create.title': 'Utwórz Nowy Klucz API',
  'api.create.name': 'Nazwa Klucza',
  'api.create.namePlaceholder': 'Moja Integracja API',
  'api.create.description': 'Opis (opcjonalnie)',
  'api.create.descriptionPlaceholder': 'Opis tego klucza API...',
  'api.create.permissions': 'Uprawnienia',
  'api.create.readVehicles': 'Odczyt Pojazdów',
  'api.create.writeVehicles': 'Zapis Pojazdów',
  'api.create.readUsers': 'Odczyt Użytkowników',
  'api.create.cancel': 'Anuluj',
  'api.create.create': 'Utwórz Klucz',
  'api.create.success': 'Klucz API utworzony pomyślnie',
  
  // Documentation Sections
  'api.docs.title': 'Dokumentacja API',
  'api.docs.process': 'Proces Żądania',
  'api.docs.format': 'Format Danych',
  'api.docs.integration': 'Integracja Techniczna',
  'api.docs.normalization': 'Normalizacja Wielojęzyczna',
  'api.docs.reference': 'Szybka Referencja',
  
  // Request Process
  'api.docs.process.title': 'Proces Żądania API',
  'api.docs.process.step1': '1. Uwierzytelnianie',
  'api.docs.process.step1Desc': 'Dołącz swój klucz API w nagłówku Authorization',
  'api.docs.process.step2': '2. Wysyłanie Danych',
  'api.docs.process.step2Desc': 'Wyślij informacje o pojeździe w formacie JSON',
  'api.docs.process.step3': '3. Normalizacja',
  'api.docs.process.step3Desc': 'Nasze systemy automatycznie normalizują pola wielojęzyczne',
  'api.docs.process.step4': '4. Odpowiedź',
  'api.docs.process.step4Desc': 'Otrzymaj potwierdzenie z ID utworzonego pojazdu',
  
  // Data Format
  'api.docs.format.title': 'Format Danych dla Publikacji Pojazdu',
  'api.docs.format.required': 'Pola Obowiązkowe',
  'api.docs.format.requiredDesc': 'Te pola są niezbędne do utworzenia pojazdu',
  'api.docs.format.optional': 'Pola Opcjonalne - Dane Bezpośrednie',
  'api.docs.format.optionalDesc': 'Te pola są zapisywane bezpośrednio bez transformacji',
  'api.docs.format.normalized': 'Pola Opcjonalne - Wymagają Normalizacji',
  'api.docs.format.normalizedDesc': 'Te pola zostaną automatycznie znormalizowane we wszystkich językach',
  'api.docs.format.validation': 'Walidacje',
  'api.docs.format.validationDesc': 'Reguły walidacji dla pól',
  'api.docs.format.example': 'Przykład Pełnego Żądania',
  'api.docs.format.exampleDesc': 'Przykład JSON ze wszystkimi dostępnymi polami',
  
  // Field Descriptions - Required
  'api.docs.format.makeDesc': 'Marka pojazdu (np.: "BMW", "Mercedes-Benz")',
  'api.docs.format.modelDesc': 'Model pojazdu (np.: "Seria 3", "Klasa C")',
  'api.docs.format.yearDesc': 'Rok produkcji (musi być >= 1900)',
  'api.docs.format.priceDesc': 'Cena pojazdu w euro (musi być > 0)',
  
  // Field Descriptions - Direct Optional
  'api.docs.format.mileageDesc': 'Przebieg w km. Ważne dla oceny',
  'api.docs.format.vinDesc': 'Numer VIN. Unikalna identyfikacja pojazdu',
  'api.docs.format.licensePlateDesc': 'Numer rejestracyjny',
  'api.docs.format.descriptionDesc': 'Szczegółowy opis pojazdu (maks. 5000 znaków)',
  'api.docs.format.imagesDesc': 'Tablica URL-i zdjęć (maks. 25 zdjęć)',
  'api.docs.format.videosDesc': 'Tablica URL-i filmów (opcjonalnie)',
  
  // Field Descriptions - Normalized
  'api.docs.format.statusDesc': 'Status pojazdu (zostanie znormalizowany we wszystkich językach)',
  'api.docs.format.iva_statusDesc': 'Status VAT (zostanie znormalizowany)',
  'api.docs.format.fuel_typeDesc': 'Typ paliwa (zostanie znormalizowany)',
  'api.docs.format.transmissionDesc': 'Typ skrzyni biegów (zostanie znormalizowany)',
  'api.docs.format.body_typeDesc': 'Typ nadwozia (zostanie znormalizowany)',
  'api.docs.format.colorDesc': 'Kolor zewnętrzny (zostanie znormalizowany)',
  'api.docs.format.interior_colorDesc': 'Kolor wnętrza (zostanie znormalizowany)',
  'api.docs.format.doorsDesc': 'Liczba drzwi (zostanie znormalizowana)',
  'api.docs.format.seatsDesc': 'Liczba miejsc (zostanie znormalizowana)',
  
  // Validation Rules
  'api.docs.format.yearValidation': 'Musi być >= 1900',
  'api.docs.format.priceValidation': 'Musi być > 0',
  'api.docs.format.mileageValidation': 'Musi być >= 0',
  'api.docs.format.vinValidation': '17 znaków alfanumerycznych',
  'api.docs.format.imagesValidation': 'Maksymalnie 20 zdjęć',
  'api.docs.format.descriptionValidation': 'Maksymalnie 5000 znaków',
  
  // Technical Integration
  'api.docs.integration.title': 'Integracja Techniczna',
  'api.docs.integration.endpoint': 'Endpoint',
  'api.docs.integration.method': 'Metoda',
  'api.docs.integration.headers': 'Wymagane Nagłówki',
  'api.docs.integration.curlExample': 'Przykład cURL',
  'api.docs.integration.jsExample': 'Przykład JavaScript',
  'api.docs.integration.pythonExample': 'Przykład Python',
  'api.docs.integration.response': 'Oczekiwana Odpowiedź',
  
  // Normalization
  'api.docs.normalization.title': 'Automatyczna Normalizacja Wielojęzyczna',
  'api.docs.normalization.description': 'Nasz system automatycznie normalizuje niektóre pola we wszystkich obsługiwanych językach (ES, EN, FR, IT, DE, NL, PT, PL, DK)',
  'api.docs.normalization.process': 'Proces Normalizacji',
  'api.docs.normalization.step1': '1. Wysyłasz pole w swoim języku (np.: "Diesel")',
  'api.docs.normalization.step2': '2. Nasz system wykrywa i normalizuje automatycznie',
  'api.docs.normalization.step3': '3. Pojazd jest wyświetlany poprawnie we wszystkich językach',
  'api.docs.normalization.fields': 'Pola Możliwe do Normalizacji',
  'api.docs.normalization.status': 'Status',
  'api.docs.normalization.iva': 'VAT',
  'api.docs.normalization.fuel': 'Paliwo',
  'api.docs.normalization.transmission': 'Skrzynia biegów',
  'api.docs.normalization.bodyType': 'Nadwozie',
  'api.docs.normalization.colors': 'Kolory',
  'api.docs.normalization.note': 'Uwaga: Możesz wysyłać te pola w dowolnym obsługiwanym języku',
  
  // Quick Reference
  'api.docs.reference.title': 'Szybka Referencja Pól',
  'api.docs.reference.field': 'Pole',
  'api.docs.reference.type': 'Typ',
  'api.docs.reference.mandatory': 'Obowiązkowe',
  'api.docs.reference.normalized': 'Znormalizowane',
  'api.docs.reference.example': 'Przykład',
  'api.docs.reference.yes': 'Tak',
  'api.docs.reference.no': 'Nie',
  'api.docs.reference.number': 'Liczba',
  'api.docs.reference.string': 'Tekst',
  'api.docs.reference.array': 'Tablica'
};
