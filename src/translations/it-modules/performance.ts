export default {
  'performance.title': 'Monitoraggio delle Prestazioni',
  'performance.subtitle': 'Monitoraggio in tempo reale e controllo dell\'ottimizzazione per KONTACT VO',
  'performance.monitoring.active': 'Monitoraggio Attivo',
  'performance.monitoring.stopped': 'Monitoraggio Fermato',
  'performance.button.start': 'Avvia',
  'performance.button.stop': 'Ferma',
  'performance.button.sync': 'Sincronizza',
  
  // Metrics
  'performance.metrics.activeUsers': 'Utenti Attivi',
  'performance.metrics.activeQueries': 'Query Attive',
  'performance.metrics.realtimeChannels': 'Canali in Tempo Reale',
  'performance.metrics.memoryUsage': 'Utilizzo Memoria',
  
  // Status
  'performance.status.normal': 'Normale',
  'performance.status.high': 'Alto',
  'performance.status.veryHigh': 'Molto Alto',
  'performance.status.critical': 'Critico',
  
  // Descriptions
  'performance.desc.activeUsers': 'Sessioni attive simultanee',
  'performance.desc.activeQueries': 'Operazioni React Query',
  'performance.desc.realtimeChannels': 'Connessioni WebSocket',
  'performance.desc.memoryUsage': 'Dimensione heap JavaScript',
  
  // Charts
  'performance.chart.userActivity': 'Tendenza Attività Utenti',
  'performance.chart.userActivityDesc': 'Utenti attivi nell\'ultima ora',
  'performance.chart.systemPerformance': 'Prestazioni di Sistema',
  'performance.chart.systemPerformanceDesc': 'Tempo di risposta e utilizzo memoria',
  
  // System status
  'performance.system.title': 'Stato del Sistema',
  'performance.system.desc': 'Salute attuale del sistema e raccomandazioni',
  'performance.system.monitoringActive': 'Monitoraggio Attivo',
  'performance.system.collectingMetrics': 'Raccolta metriche ogni 5 secondi',
  'performance.system.optimizationRecommended': 'Ottimizzazione Consigliata',
  'performance.system.optimizationRecommendedDesc': 'Considera l\'attivazione delle ottimizzazioni React Query',
  'performance.system.highLoad': 'Carico Elevato Rilevato',
  'performance.system.highLoadDesc': 'Le ottimizzazioni automatiche dovrebbero essere attivate',
  'performance.system.lastUpdated': 'Ultimo aggiornamento',
  'performance.system.nextCheck': 'Prossimo controllo ottimizzazione',
  'performance.system.ready': 'Pronto',
  'performance.system.moreUsers': 'A {count} utenti in più',

  // Core Web Vitals
  'performance.webVitals.title': 'Core Web Vitals',
  'performance.webVitals.cls': 'Spostamento Layout Cumulativo',
  'performance.webVitals.inp': 'Interazione al Prossimo Rendering',
  'performance.webVitals.lcp': 'Rendering del Contenuto Più Grande',
  'performance.webVitals.ttfb': 'Tempo al Primo Byte',
  'performance.webVitals.good': 'Buono',
  'performance.webVitals.needsImprovement': 'Da Migliorare',
  'performance.webVitals.poor': 'Scarso',
  'performance.webVitals.desc.cls': 'Metrica di stabilità visiva',
  'performance.webVitals.desc.inp': 'Metrica di reattività',
  'performance.webVitals.desc.lcp': 'Metrica di prestazioni di caricamento',
  'performance.webVitals.desc.ttfb': 'Tempo di risposta del server',

  // Info tooltip
  'performance.info.tooltip': `
**SISTEMA DI MONITORAGGIO E OTTIMIZZAZIONE**

**METRICHE CHIAVE:**
• **Utenti Attivi**: Sessioni simultanee nell'applicazione
• **Query Attive**: Operazioni database in esecuzione
• **Canali Tempo Reale**: Connessioni WebSocket attive
• **Utilizzo Memoria**: Consumo di memoria JavaScript

**FASI DI OTTIMIZZAZIONE:**

**🟡 FASE 1 - ALLERTA GIALLA (25+ utenti)**
- Stato: Carico moderato
- Azione: Ottimizzazioni di base consigliate
- Include: Cache React Query, pulizia query

**🔴 FASE 2 - ALLERTA ROSSA (50+ utenti)**
- Stato: Carico elevato
- Azione: Ottimizzazioni automatiche attivate
- Include: Riduzione tempo reale, cache aggressiva

**⚫ FASE 3 - CRITICO (100+ utenti)**
- Stato: "Modalità sopravvivenza"
- Azione: Ottimizzazioni automatiche massime
- Include: Disattivazione funzionalità non critiche

**CONTROLLI:**
- **Applica**: Attiva ottimizzazione specifica
- **Disattiva**: Disattiva ottimizzazione attiva
- **Rollback**: Annulla tutte le ottimizzazioni
- **Avvia/Ferma**: Controllo monitoraggio
- **Sincronizza**: Invia metriche al server
  `
};
