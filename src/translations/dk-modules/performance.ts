export default {
  'performance.title': 'Ydeevne Overvågning',
  'performance.subtitle': 'Realtidsovervågning og optimeringskontrol for KONTACT VO',
  'performance.monitoring.active': 'Overvågning Aktiv',
  'performance.monitoring.stopped': 'Overvågning Stoppet',
  'performance.button.start': 'Start',
  'performance.button.stop': 'Stop',
  'performance.button.sync': 'Synkroniser',
  
  // Metrics
  'performance.metrics.activeUsers': 'Aktive Brugere',
  'performance.metrics.activeQueries': 'Aktive Forespørgsler',
  'performance.metrics.realtimeChannels': 'Realtidskanaler',
  'performance.metrics.memoryUsage': 'Hukommelsesforbrug',
  
  // Status
  'performance.status.normal': 'Normal',
  'performance.status.high': 'Høj',
  'performance.status.veryHigh': 'Meget Høj',
  'performance.status.critical': 'Kritisk',
  
  // Descriptions
  'performance.desc.activeUsers': 'Samtidige aktive sessioner',
  'performance.desc.activeQueries': 'React Query operationer',
  'performance.desc.realtimeChannels': 'WebSocket forbindelser',
  'performance.desc.memoryUsage': 'JavaScript heap størrelse',
  
  // Charts
  'performance.chart.userActivity': 'Brugeraktivitet Trend',
  'performance.chart.userActivityDesc': 'Aktive brugere i den sidste time',
  'performance.chart.systemPerformance': 'System Ydeevne',
  'performance.chart.systemPerformanceDesc': 'Svartid og hukommelsesforbrug',
  
  // System status
  'performance.system.title': 'System Status',
  'performance.system.desc': 'Nuværende systemsundhed og anbefalinger',
  'performance.system.monitoringActive': 'Overvågning Aktiv',
  'performance.system.collectingMetrics': 'Indsamler målinger hvert 5. sekund',
  'performance.system.optimizationRecommended': 'Optimering Anbefalet',
  'performance.system.optimizationRecommendedDesc': 'Overvej at aktivere React Query optimeringer',
  'performance.system.highLoad': 'Høj Belastning Opdaget',
  'performance.system.highLoadDesc': 'Automatiske optimeringer bør aktiveres',
  'performance.system.lastUpdated': 'Sidst opdateret',
  'performance.system.nextCheck': 'Næste optimeringstjek',
  'performance.system.ready': 'Klar',
  'performance.system.moreUsers': 'Ved {count} flere brugere',

  // Core Web Vitals
  'performance.webVitals.title': 'Core Web Vitals',
  'performance.webVitals.cls': 'Kumulativt Layout Skift',
  'performance.webVitals.inp': 'Interaktion til Næste Maling',
  'performance.webVitals.lcp': 'Største Indholdsrige Maling',
  'performance.webVitals.ttfb': 'Tid til Første Byte',
  'performance.webVitals.good': 'God',
  'performance.webVitals.needsImprovement': 'Kræver Forbedring',
  'performance.webVitals.poor': 'Dårlig',
  'performance.webVitals.desc.cls': 'Visuel stabilitetsmåling',
  'performance.webVitals.desc.inp': 'Responshastighed måling',
  'performance.webVitals.desc.lcp': 'Indlæsningsydeevne måling',
  'performance.webVitals.desc.ttfb': 'Server responstid',

  // Info tooltip
  'performance.info.tooltip': `
**OVERVÅGNINGS- OG OPTIMERINGSSYSTEM**

**NØGLEMÅLINGER:**
• **Aktive Brugere**: Samtidige sessioner i applikationen
• **Aktive Forespørgsler**: Database operationer i udførelse
• **Realtidskanaler**: Aktive WebSocket forbindelser
• **Hukommelsesforbrug**: JavaScript hukommelsesforbruget

**OPTIMERINGSFASER:**

**🟡 FASE 1 - GUL ALARM (25+ brugere)**
- Status: Moderat belastning
- Handling: Grundlæggende optimeringer anbefalet
- Inkluderer: React Query cache, forespørgsel oprydning

**🔴 FASE 2 - RØD ALARM (50+ brugere)**
- Status: Høj belastning
- Handling: Automatiske optimeringer aktiveret
- Inkluderer: Realtidsreduktion, aggressiv cache

**⚫ FASE 3 - KRITISK (100+ brugere)**
- Status: "Overlevelsestilstand"
- Handling: Maksimale automatiske optimeringer
- Inkluderer: Deaktivér ikke-kritiske funktioner

**KONTROLLER:**
- **Anvend**: Aktiverer specifik optimering
- **Deaktivér**: Deaktiverer aktiv optimering
- **Rollback**: Tilbagefører alle optimeringer
- **Start/Stop**: Overvågningskontrol
- **Synkroniser**: Sender målinger til server
  `
};