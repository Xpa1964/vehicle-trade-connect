export default {
  'performance.title': 'Monitoramento de Desempenho',
  'performance.subtitle': 'Monitoramento em tempo real e controle de otimização para KONTACT VO',
  'performance.monitoring.active': 'Monitoramento Ativo',
  'performance.monitoring.stopped': 'Monitoramento Parado',
  'performance.button.start': 'Iniciar',
  'performance.button.stop': 'Parar',
  'performance.button.sync': 'Sincronizar',
  
  // Metrics
  'performance.metrics.activeUsers': 'Usuários Ativos',
  'performance.metrics.activeQueries': 'Consultas Ativas',
  'performance.metrics.realtimeChannels': 'Canais em Tempo Real',
  'performance.metrics.memoryUsage': 'Uso de Memória',
  
  // Status
  'performance.status.normal': 'Normal',
  'performance.status.high': 'Alto',
  'performance.status.veryHigh': 'Muito Alto',
  'performance.status.critical': 'Crítico',
  
  // Descriptions
  'performance.desc.activeUsers': 'Sessões ativas simultâneas',
  'performance.desc.activeQueries': 'Operações React Query',
  'performance.desc.realtimeChannels': 'Conexões WebSocket',
  'performance.desc.memoryUsage': 'Tamanho do heap JavaScript',
  
  // Charts
  'performance.chart.userActivity': 'Tendência de Atividade do Usuário',
  'performance.chart.userActivityDesc': 'Usuários ativos na última hora',
  'performance.chart.systemPerformance': 'Desempenho do Sistema',
  'performance.chart.systemPerformanceDesc': 'Tempo de resposta e uso de memória',
  
  // System status
  'performance.system.title': 'Status do Sistema',
  'performance.system.desc': 'Saúde atual do sistema e recomendações',
  'performance.system.monitoringActive': 'Monitoramento Ativo',
  'performance.system.collectingMetrics': 'Coletando métricas a cada 5 segundos',
  'performance.system.optimizationRecommended': 'Otimização Recomendada',
  'performance.system.optimizationRecommendedDesc': 'Considere ativar as otimizações do React Query',
  'performance.system.highLoad': 'Carga Alta Detectada',
  'performance.system.highLoadDesc': 'Otimizações automáticas devem ser ativadas',
  'performance.system.lastUpdated': 'Última atualização',
  'performance.system.nextCheck': 'Próxima verificação de otimização',
  'performance.system.ready': 'Pronto',
  'performance.system.moreUsers': 'Com mais {count} usuários',

  // Core Web Vitals
  'performance.webVitals.title': 'Core Web Vitals',
  'performance.webVitals.cls': 'Mudança de Layout Cumulativa',
  'performance.webVitals.inp': 'Interação até a Próxima Pintura',
  'performance.webVitals.lcp': 'Maior Pintura de Conteúdo',
  'performance.webVitals.ttfb': 'Tempo até o Primeiro Byte',
  'performance.webVitals.good': 'Bom',
  'performance.webVitals.needsImprovement': 'Precisa Melhorar',
  'performance.webVitals.poor': 'Ruim',
  'performance.webVitals.desc.cls': 'Métrica de estabilidade visual',
  'performance.webVitals.desc.inp': 'Métrica de responsividade',
  'performance.webVitals.desc.lcp': 'Métrica de desempenho de carregamento',
  'performance.webVitals.desc.ttfb': 'Tempo de resposta do servidor',

  // Info tooltip
  'performance.info.tooltip': `
**SISTEMA DE MONITORAMENTO E OTIMIZAÇÃO**

**MÉTRICAS PRINCIPAIS:**
• **Usuários Ativos**: Sessões simultâneas na aplicação
• **Consultas Ativas**: Operações de banco de dados em execução
• **Canais Tempo Real**: Conexões WebSocket ativas
• **Uso de Memória**: Consumo de memória JavaScript

**FASES DE OTIMIZAÇÃO:**

**🟡 FASE 1 - ALERTA AMARELO (25+ usuários)**
- Status: Carga moderada
- Ação: Otimizações básicas recomendadas
- Inclui: Cache React Query, limpeza de consultas

**🔴 FASE 2 - ALERTA VERMELHO (50+ usuários)**
- Status: Carga alta
- Ação: Otimizações automáticas ativadas
- Inclui: Redução de tempo real, cache agressivo

**⚫ FASE 3 - CRÍTICO (100+ usuários)**
- Status: "Modo sobrevivência"
- Ação: Otimizações automáticas máximas
- Inclui: Desativação de recursos não críticos

**CONTROLES:**
- **Aplicar**: Ativa otimização específica
- **Desativar**: Desativa otimização ativa
- **Rollback**: Reverte todas as otimizações
- **Iniciar/Parar**: Controle de monitoramento
- **Sincronizar**: Envia métricas para o servidor
  `
};
