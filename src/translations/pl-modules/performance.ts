export default {
  'performance.title': 'Monitorowanie Wydajności',
  'performance.subtitle': 'Monitorowanie w czasie rzeczywistym i kontrola optymalizacji dla KONTACT VO',
  'performance.monitoring.active': 'Monitorowanie Aktywne',
  'performance.monitoring.stopped': 'Monitorowanie Zatrzymane',
  'performance.button.start': 'Start',
  'performance.button.stop': 'Stop',
  'performance.button.sync': 'Synchronizuj',
  
  // Metrics
  'performance.metrics.activeUsers': 'Aktywni Użytkownicy',
  'performance.metrics.activeQueries': 'Aktywne Zapytania',
  'performance.metrics.realtimeChannels': 'Kanały Czasu Rzeczywistego',
  'performance.metrics.memoryUsage': 'Użycie Pamięci',
  
  // Status
  'performance.status.normal': 'Normalny',
  'performance.status.high': 'Wysoki',
  'performance.status.veryHigh': 'Bardzo Wysoki',
  'performance.status.critical': 'Krytyczny',
  
  // Descriptions
  'performance.desc.activeUsers': 'Równoczesne aktywne sesje',
  'performance.desc.activeQueries': 'Operacje React Query',
  'performance.desc.realtimeChannels': 'Połączenia WebSocket',
  'performance.desc.memoryUsage': 'Rozmiar stosu JavaScript',
  
  // Charts
  'performance.chart.userActivity': 'Trend Aktywności Użytkowników',
  'performance.chart.userActivityDesc': 'Aktywni użytkownicy w ciągu ostatniej godziny',
  'performance.chart.systemPerformance': 'Wydajność Systemu',
  'performance.chart.systemPerformanceDesc': 'Czas odpowiedzi i użycie pamięci',
  
  // System status
  'performance.system.title': 'Status Systemu',
  'performance.system.desc': 'Aktualna kondycja systemu i zalecenia',
  'performance.system.monitoringActive': 'Monitorowanie Aktywne',
  'performance.system.collectingMetrics': 'Zbieranie metryk co 5 sekund',
  'performance.system.optimizationRecommended': 'Optymalizacja Zalecana',
  'performance.system.optimizationRecommendedDesc': 'Rozważ włączenie optymalizacji React Query',
  'performance.system.highLoad': 'Wykryto Wysokie Obciążenie',
  'performance.system.highLoadDesc': 'Automatyczne optymalizacje powinny zostać aktywowane',
  'performance.system.lastUpdated': 'Ostatnia aktualizacja',
  'performance.system.nextCheck': 'Następna kontrola optymalizacji',
  'performance.system.ready': 'Gotowy',
  'performance.system.moreUsers': 'Przy {count} więcej użytkownikach',

  // Core Web Vitals
  'performance.webVitals.title': 'Core Web Vitals',
  'performance.webVitals.cls': 'Skumulowane Przesunięcie Układu',
  'performance.webVitals.inp': 'Interakcja do Następnego Malowania',
  'performance.webVitals.lcp': 'Największe Malowanie Treści',
  'performance.webVitals.ttfb': 'Czas do Pierwszego Bajtu',
  'performance.webVitals.good': 'Dobry',
  'performance.webVitals.needsImprovement': 'Wymaga Poprawy',
  'performance.webVitals.poor': 'Słaby',
  'performance.webVitals.desc.cls': 'Metryka stabilności wizualnej',
  'performance.webVitals.desc.inp': 'Metryka responsywności',
  'performance.webVitals.desc.lcp': 'Metryka wydajności ładowania',
  'performance.webVitals.desc.ttfb': 'Czas odpowiedzi serwera',

  // Info tooltip
  'performance.info.tooltip': `
**SYSTEM MONITOROWANIA I OPTYMALIZACJI**

**KLUCZOWE METRYKI:**
• **Aktywni Użytkownicy**: Równoczesne sesje w aplikacji
• **Aktywne Zapytania**: Operacje bazy danych w toku
• **Kanały Czasu Rzeczywistego**: Aktywne połączenia WebSocket
• **Użycie Pamięci**: Zużycie pamięci JavaScript

**FAZY OPTYMALIZACJI:**

**🟡 FAZA 1 - ŻÓŁTY ALARM (25+ użytkowników)**
- Status: Umiarkowane obciążenie
- Działanie: Podstawowe optymalizacje zalecane
- Obejmuje: Cache React Query, czyszczenie zapytań

**🔴 FAZA 2 - CZERWONY ALARM (50+ użytkowników)**
- Status: Wysokie obciążenie
- Działanie: Automatyczne optymalizacje aktywowane
- Obejmuje: Redukcja czasu rzeczywistego, agresywny cache

**⚫ FAZA 3 - KRYTYCZNY (100+ użytkowników)**
- Status: "Tryb przetrwania"
- Działanie: Maksymalne automatyczne optymalizacje
- Obejmuje: Wyłączenie funkcji niekrytycznych

**KONTROLE:**
- **Zastosuj**: Aktywuje określoną optymalizację
- **Wyłącz**: Deaktywuje aktywną optymalizację
- **Rollback**: Cofa wszystkie optymalizacje
- **Start/Stop**: Kontrola monitorowania
- **Synchronizuj**: Wysyła metryki do serwera
  `
};