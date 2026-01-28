export default {
  'performance.title': 'Prestatie Monitoring',
  'performance.subtitle': 'Real-time monitoring en optimalisatie controle voor KONTACT VO',
  'performance.monitoring.active': 'Monitoring Actief',
  'performance.monitoring.stopped': 'Monitoring Gestopt',
  'performance.button.start': 'Start',
  'performance.button.stop': 'Stop',
  'performance.button.sync': 'Synchroniseren',
  
  // Metrics
  'performance.metrics.activeUsers': 'Actieve Gebruikers',
  'performance.metrics.activeQueries': 'Actieve Queries',
  'performance.metrics.realtimeChannels': 'Realtime Kanalen',
  'performance.metrics.memoryUsage': 'Geheugengebruik',
  
  // Status
  'performance.status.normal': 'Normaal',
  'performance.status.high': 'Hoog',
  'performance.status.veryHigh': 'Zeer Hoog',
  'performance.status.critical': 'Kritiek',
  
  // Descriptions
  'performance.desc.activeUsers': 'Gelijktijdige actieve sessies',
  'performance.desc.activeQueries': 'React Query operaties',
  'performance.desc.realtimeChannels': 'WebSocket verbindingen',
  'performance.desc.memoryUsage': 'JavaScript heap grootte',
  
  // Charts
  'performance.chart.userActivity': 'Gebruikersactiviteit Trend',
  'performance.chart.userActivityDesc': 'Actieve gebruikers van het afgelopen uur',
  'performance.chart.systemPerformance': 'Systeemprestaties',
  'performance.chart.systemPerformanceDesc': 'Responstijd en geheugengebruik',
  
  // System status
  'performance.system.title': 'Systeemstatus',
  'performance.system.desc': 'Huidige systeemgezondheid en aanbevelingen',
  'performance.system.monitoringActive': 'Monitoring Actief',
  'performance.system.collectingMetrics': 'Verzamelt metrics elke 5 seconden',
  'performance.system.optimizationRecommended': 'Optimalisatie Aanbevolen',
  'performance.system.optimizationRecommendedDesc': 'Overweeg React Query optimalisaties in te schakelen',
  'performance.system.highLoad': 'Hoge Belasting Gedetecteerd',
  'performance.system.highLoadDesc': 'Automatische optimalisaties zouden geactiveerd moeten worden',
  'performance.system.lastUpdated': 'Laatst bijgewerkt',
  'performance.system.nextCheck': 'Volgende optimalisatiecontrole',
  'performance.system.ready': 'Klaar',
  'performance.system.moreUsers': 'Bij {count} meer gebruikers',

  // Core Web Vitals
  'performance.webVitals.title': 'Core Web Vitals',
  'performance.webVitals.cls': 'Cumulatieve Lay-out Verschuiving',
  'performance.webVitals.inp': 'Interactie naar Volgende Paint',
  'performance.webVitals.lcp': 'Grootste Inhoudelijke Paint',
  'performance.webVitals.ttfb': 'Tijd tot Eerste Byte',
  'performance.webVitals.good': 'Goed',
  'performance.webVitals.needsImprovement': 'Verbetering Nodig',
  'performance.webVitals.poor': 'Slecht',
  'performance.webVitals.desc.cls': 'Visuele stabiliteitsmetriek',
  'performance.webVitals.desc.inp': 'Responsiviteitsmetriek',
  'performance.webVitals.desc.lcp': 'Laadprestatiemetriek',
  'performance.webVitals.desc.ttfb': 'Server responstijd',

  // Info tooltip
  'performance.info.tooltip': `
**MONITORING EN OPTIMALISATIE SYSTEEM**

**BELANGRIJKSTE METRICS:**
• **Actieve Gebruikers**: Gelijktijdige sessies in de applicatie
• **Actieve Queries**: Database operaties in uitvoering
• **Realtime Kanalen**: Actieve WebSocket verbindingen
• **Geheugengebruik**: JavaScript geheugenconsumptie

**OPTIMALISATIEFASEN:**

**🟡 FASE 1 - GELE WAARSCHUWING (25+ gebruikers)**
- Status: Gematigde belasting
- Actie: Basis optimalisaties aanbevolen
- Omvat: React Query cache, query opruiming

**🔴 FASE 2 - RODE WAARSCHUWING (50+ gebruikers)**
- Status: Hoge belasting
- Actie: Automatische optimalisaties geactiveerd
- Omvat: Realtime reductie, agressieve cache

**⚫ FASE 3 - KRITIEK (100+ gebruikers)**
- Status: "Overlevingsmodus"
- Actie: Maximale automatische optimalisaties
- Omvat: Niet-kritieke functies uitschakelen

**BEDIENINGSELEMENTEN:**
- **Toepassen**: Activeert specifieke optimalisatie
- **Uitschakelen**: Deactiveert actieve optimalisatie
- **Rollback**: Maakt alle optimalisaties ongedaan
- **Start/Stop**: Monitoring controle
- **Synchroniseren**: Stuurt metrics naar server
  `
};