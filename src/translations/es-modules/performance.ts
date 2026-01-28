export default {
  'performance.title': 'Monitoreo de Rendimiento',
  'performance.subtitle': 'Monitoreo en tiempo real y control de optimización para KONTACT VO',
  'performance.monitoring.active': 'Monitoreo Activo',
  'performance.monitoring.stopped': 'Monitoreo Detenido',
  'performance.button.start': 'Iniciar',
  'performance.button.stop': 'Detener',
  'performance.button.sync': 'Sincronizar',
  
  // Métricas
  'performance.metrics.activeUsers': 'Usuarios Activos',
  'performance.metrics.activeQueries': 'Consultas Activas',
  'performance.metrics.realtimeChannels': 'Canales en Tiempo Real',
  'performance.metrics.memoryUsage': 'Uso de Memoria',
  
  // Estados
  'performance.status.normal': 'Normal',
  'performance.status.high': 'Alto',
  'performance.status.veryHigh': 'Muy Alto',
  'performance.status.critical': 'Crítico',
  
  // Descripciones
  'performance.desc.activeUsers': 'Sesiones activas concurrentes',
  'performance.desc.activeQueries': 'Operaciones de React Query',
  'performance.desc.realtimeChannels': 'Conexiones WebSocket',
  'performance.desc.memoryUsage': 'Tamaño del heap de JavaScript',
  
  // Gráficos
  'performance.chart.userActivity': 'Tendencia de Actividad de Usuario',
  'performance.chart.userActivityDesc': 'Usuarios activos en la última hora',
  'performance.chart.systemPerformance': 'Rendimiento del Sistema',
  'performance.chart.systemPerformanceDesc': 'Tiempo de respuesta y uso de memoria',
  
  // Estado del sistema
  'performance.system.title': 'Estado del Sistema',
  'performance.system.desc': 'Salud actual del sistema y recomendaciones',
  'performance.system.monitoringActive': 'Monitoreo Activo',
  'performance.system.collectingMetrics': 'Recolectando métricas cada 5 segundos',
  'performance.system.optimizationRecommended': 'Optimización Recomendada',
  'performance.system.optimizationRecommendedDesc': 'Considera habilitar optimizaciones de React Query',
  'performance.system.highLoad': 'Alta Carga Detectada',
  'performance.system.highLoadDesc': 'Las optimizaciones automáticas deberían activarse',
  'performance.system.lastUpdated': 'Última actualización',
  'performance.system.nextCheck': 'Próxima verificación de optimización',
  'performance.system.ready': 'Listo',
  'performance.system.moreUsers': 'Con {count} usuarios más',

  // Core Web Vitals
  'performance.webVitals.title': 'Métricas Web Vitales',
  'performance.webVitals.cls': 'Cambio de Diseño Acumulativo',
  'performance.webVitals.inp': 'Interacción a Siguiente Pintura',
  'performance.webVitals.lcp': 'Pintura del Contenido Más Grande',
  'performance.webVitals.ttfb': 'Tiempo al Primer Byte',
  'performance.webVitals.good': 'Bueno',
  'performance.webVitals.needsImprovement': 'Necesita Mejora',
  'performance.webVitals.poor': 'Pobre',
  'performance.webVitals.desc.cls': 'Métrica de estabilidad visual',
  'performance.webVitals.desc.inp': 'Métrica de capacidad de respuesta',
  'performance.webVitals.desc.lcp': 'Métrica de rendimiento de carga',
  'performance.webVitals.desc.ttfb': 'Tiempo de respuesta del servidor',

  // Panel de información
  'performance.info.showGuide': 'Guía de Uso',
  'performance.info.hideGuide': 'Ocultar Guía',
  'performance.info.title': 'Guía del Sistema de Monitoreo',
  'performance.info.metrics.title': 'Métricas Principales',
  'performance.info.metrics.activeUsers': 'Usuarios Activos: Sesiones simultáneas en la aplicación',
  'performance.info.metrics.activeQueries': 'Consultas Activas: Operaciones de base de datos en ejecución',
  'performance.info.metrics.realtimeChannels': 'Canales Tiempo Real: Conexiones WebSocket activas',
  'performance.info.metrics.memoryUsage': 'Uso de Memoria: Consumo de memoria JavaScript del navegador',
  
  'performance.info.phases.title': 'Fases de Optimización',
  'performance.info.phases.phase1': 'FASE 1 - Alerta Amarilla (25+ usuarios)',
  'performance.info.phases.phase1.desc': 'Carga moderada. Se recomiendan optimizaciones básicas como cache de React Query.',
  'performance.info.phases.phase2': 'FASE 2 - Alerta Roja (50+ usuarios)', 
  'performance.info.phases.phase2.desc': 'Carga alta. Se activan optimizaciones automáticas y cache agresivo.',
  'performance.info.phases.phase3': 'FASE 3 - Crítico (100+ usuarios)',
  'performance.info.phases.phase3.desc': 'Modo supervivencia. Optimizaciones máximas y desactivación de funciones no críticas.',
  
  'performance.info.controls.title': 'Controles Disponibles',
  'performance.info.controls.apply': 'Aplicar: Activa una optimización específica',
  'performance.info.controls.disable': 'Desactivar: Desactiva optimización activa',
  'performance.info.controls.rollback': 'Rollback: Revierte todas las optimizaciones',
  'performance.info.controls.monitoring': 'Iniciar/Detener: Control de monitoreo en tiempo real',
  'performance.info.controls.sync': 'Sincronizar: Envía métricas actuales al servidor'
};