export default {
  'performance.title': 'Surveillance des Performances',
  'performance.subtitle': 'Surveillance en temps réel et contrôle d\'optimisation pour KONTACT VO',
  'performance.monitoring.active': 'Surveillance Active',
  'performance.monitoring.stopped': 'Surveillance Arrêtée',
  'performance.button.start': 'Démarrer',
  'performance.button.stop': 'Arrêter',
  'performance.button.sync': 'Synchroniser',
  
  // Metrics
  'performance.metrics.activeUsers': 'Utilisateurs Actifs',
  'performance.metrics.activeQueries': 'Requêtes Actives',
  'performance.metrics.realtimeChannels': 'Canaux Temps Réel',
  'performance.metrics.memoryUsage': 'Utilisation Mémoire',
  
  // Status
  'performance.status.normal': 'Normal',
  'performance.status.high': 'Élevé',
  'performance.status.veryHigh': 'Très Élevé',
  'performance.status.critical': 'Critique',
  
  // Descriptions
  'performance.desc.activeUsers': 'Sessions actives simultanées',
  'performance.desc.activeQueries': 'Opérations React Query',
  'performance.desc.realtimeChannels': 'Connexions WebSocket',
  'performance.desc.memoryUsage': 'Taille du tas JavaScript',
  
  // Charts
  'performance.chart.userActivity': 'Tendance d\'Activité Utilisateur',
  'performance.chart.userActivityDesc': 'Utilisateurs actifs de la dernière heure',
  'performance.chart.systemPerformance': 'Performance Système',
  'performance.chart.systemPerformanceDesc': 'Temps de réponse et utilisation mémoire',
  
  // System status
  'performance.system.title': 'État du Système',
  'performance.system.desc': 'Santé actuelle du système et recommandations',
  'performance.system.monitoringActive': 'Surveillance Active',
  'performance.system.collectingMetrics': 'Collecte des métriques toutes les 5 secondes',
  'performance.system.optimizationRecommended': 'Optimisation Recommandée',
  'performance.system.optimizationRecommendedDesc': 'Envisagez d\'activer les optimisations React Query',
  'performance.system.highLoad': 'Charge Élevée Détectée',
  'performance.system.highLoadDesc': 'Les optimisations automatiques devraient être activées',
  'performance.system.lastUpdated': 'Dernière mise à jour',
  'performance.system.nextCheck': 'Prochaine vérification d\'optimisation',
  'performance.system.ready': 'Prêt',
  'performance.system.moreUsers': 'À {count} utilisateurs de plus',

  // Core Web Vitals
  'performance.webVitals.title': 'Core Web Vitals',
  'performance.webVitals.cls': 'Décalage de Mise en Page Cumulé',
  'performance.webVitals.inp': 'Interaction à la Prochaine Peinture',
  'performance.webVitals.lcp': 'Plus Grande Peinture de Contenu',
  'performance.webVitals.ttfb': 'Temps Jusqu\'au Premier Octet',
  'performance.webVitals.good': 'Bon',
  'performance.webVitals.needsImprovement': 'À Améliorer',
  'performance.webVitals.poor': 'Mauvais',
  'performance.webVitals.desc.cls': 'Métrique de stabilité visuelle',
  'performance.webVitals.desc.inp': 'Métrique de réactivité',
  'performance.webVitals.desc.lcp': 'Métrique de performance de chargement',
  'performance.webVitals.desc.ttfb': 'Temps de réponse du serveur',

  // Info tooltip
  'performance.info.tooltip': `
**SYSTÈME DE SURVEILLANCE ET D'OPTIMISATION**

**MÉTRIQUES CLÉS:**
• **Utilisateurs Actifs**: Sessions simultanées dans l'application
• **Requêtes Actives**: Opérations de base de données en cours
• **Canaux Temps Réel**: Connexions WebSocket actives
• **Utilisation Mémoire**: Consommation de mémoire JavaScript

**PHASES D'OPTIMISATION:**

**🟡 PHASE 1 - ALERTE JAUNE (25+ utilisateurs)**
- Statut: Charge modérée
- Action: Optimisations de base recommandées
- Inclut: Cache React Query, nettoyage des requêtes

**🔴 PHASE 2 - ALERTE ROUGE (50+ utilisateurs)**
- Statut: Charge élevée
- Action: Optimisations automatiques activées
- Inclut: Réduction temps réel, cache agressif

**⚫ PHASE 3 - CRITIQUE (100+ utilisateurs)**
- Statut: "Mode survie"
- Action: Optimisations automatiques maximales
- Inclut: Désactivation des fonctionnalités non critiques

**CONTRÔLES:**
- **Appliquer**: Active une optimisation spécifique
- **Désactiver**: Désactive l'optimisation active
- **Rollback**: Annule toutes les optimisations
- **Démarrer/Arrêter**: Contrôle de la surveillance
- **Synchroniser**: Envoie les métriques au serveur
  `
};
