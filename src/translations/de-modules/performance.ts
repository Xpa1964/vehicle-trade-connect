export default {
  'performance.title': 'Leistungsüberwachung',
  'performance.subtitle': 'Echtzeit-Überwachung und Optimierungskontrolle für KONTACT VO',
  'performance.monitoring.active': 'Überwachung Aktiv',
  'performance.monitoring.stopped': 'Überwachung Gestoppt',
  'performance.button.start': 'Start',
  'performance.button.stop': 'Stopp',
  'performance.button.sync': 'Synchronisieren',
  
  // Metrics
  'performance.metrics.activeUsers': 'Aktive Benutzer',
  'performance.metrics.activeQueries': 'Aktive Abfragen',
  'performance.metrics.realtimeChannels': 'Echtzeit-Kanäle',
  'performance.metrics.memoryUsage': 'Speichernutzung',
  
  // Status
  'performance.status.normal': 'Normal',
  'performance.status.high': 'Hoch',
  'performance.status.veryHigh': 'Sehr Hoch',
  'performance.status.critical': 'Kritisch',
  
  // Descriptions
  'performance.desc.activeUsers': 'Gleichzeitige aktive Sitzungen',
  'performance.desc.activeQueries': 'React Query Operationen',
  'performance.desc.realtimeChannels': 'WebSocket-Verbindungen',
  'performance.desc.memoryUsage': 'JavaScript-Heap-Größe',
  
  // Charts
  'performance.chart.userActivity': 'Benutzeraktivitätstrend',
  'performance.chart.userActivityDesc': 'Aktive Benutzer der letzten Stunde',
  'performance.chart.systemPerformance': 'Systemleistung',
  'performance.chart.systemPerformanceDesc': 'Antwortzeit und Speichernutzung',
  
  // System status
  'performance.system.title': 'Systemstatus',
  'performance.system.desc': 'Aktuelle Systemgesundheit und Empfehlungen',
  'performance.system.monitoringActive': 'Überwachung Aktiv',
  'performance.system.collectingMetrics': 'Metriken werden alle 5 Sekunden gesammelt',
  'performance.system.optimizationRecommended': 'Optimierung Empfohlen',
  'performance.system.optimizationRecommendedDesc': 'Erwägen Sie die Aktivierung von React Query-Optimierungen',
  'performance.system.highLoad': 'Hohe Last Erkannt',
  'performance.system.highLoadDesc': 'Automatische Optimierungen sollten aktiviert werden',
  'performance.system.lastUpdated': 'Zuletzt aktualisiert',
  'performance.system.nextCheck': 'Nächste Optimierungsprüfung',
  'performance.system.ready': 'Bereit',
  'performance.system.moreUsers': 'Bei {count} weiteren Benutzern',

  // Core Web Vitals
  'performance.webVitals.title': 'Core Web Vitals',
  'performance.webVitals.cls': 'Kumulative Layout-Verschiebung',
  'performance.webVitals.inp': 'Interaktion bis zur nächsten Darstellung',
  'performance.webVitals.lcp': 'Größte inhaltsreiche Darstellung',
  'performance.webVitals.ttfb': 'Zeit bis zum ersten Byte',
  'performance.webVitals.good': 'Gut',
  'performance.webVitals.needsImprovement': 'Verbesserungswürdig',
  'performance.webVitals.poor': 'Schlecht',
  'performance.webVitals.desc.cls': 'Visuelle Stabilitätsmetrik',
  'performance.webVitals.desc.inp': 'Reaktionsfähigkeitsmetrik',
  'performance.webVitals.desc.lcp': 'Ladeleistungsmetrik',
  'performance.webVitals.desc.ttfb': 'Server-Antwortzeit',

  // Info tooltip
  'performance.info.tooltip': `
**ÜBERWACHUNGS- UND OPTIMIERUNGSSYSTEM**

**HAUPTMETRIKEN:**
• **Aktive Benutzer**: Gleichzeitige Sitzungen in der Anwendung
• **Aktive Abfragen**: Datenbankoperationen in Ausführung
• **Echtzeit-Kanäle**: Aktive WebSocket-Verbindungen
• **Speichernutzung**: JavaScript-Speicherverbrauch

**OPTIMIERUNGSPHASEN:**

**🟡 PHASE 1 - GELBER ALARM (25+ Benutzer)**
- Status: Mäßige Last
- Aktion: Grundlegende Optimierungen empfohlen
- Beinhaltet: React Query Cache, Abfragebereinigung

**🔴 PHASE 2 - ROTER ALARM (50+ Benutzer)**
- Status: Hohe Last
- Aktion: Automatische Optimierungen aktiviert
- Beinhaltet: Echtzeit-Reduktion, aggressiver Cache

**⚫ PHASE 3 - KRITISCH (100+ Benutzer)**
- Status: "Überlebensmodus"
- Aktion: Maximale automatische Optimierungen
- Beinhaltet: Deaktivierung nicht-kritischer Funktionen

**STEUERELEMENTE:**
- **Anwenden**: Aktiviert spezifische Optimierung
- **Deaktivieren**: Deaktiviert aktive Optimierung
- **Rollback**: Macht alle Optimierungen rückgängig
- **Start/Stopp**: Überwachungssteuerung
- **Synchronisieren**: Sendet Metriken an Server
  `
};
