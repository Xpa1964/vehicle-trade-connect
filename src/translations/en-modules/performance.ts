export default {
  'performance.title': 'Performance Monitoring',
  'performance.subtitle': 'Real-time monitoring and optimization control for KONTACT VO',
  'performance.monitoring.active': 'Monitoring Active',
  'performance.monitoring.stopped': 'Monitoring Stopped',
  'performance.button.start': 'Start',
  'performance.button.stop': 'Stop',
  'performance.button.sync': 'Sync',
  
  // Metrics
  'performance.metrics.activeUsers': 'Active Users',
  'performance.metrics.activeQueries': 'Active Queries',
  'performance.metrics.realtimeChannels': 'Realtime Channels',
  'performance.metrics.memoryUsage': 'Memory Usage',
  
  // Status
  'performance.status.normal': 'Normal',
  'performance.status.high': 'High',
  'performance.status.veryHigh': 'Very High',
  'performance.status.critical': 'Critical',
  
  // Descriptions
  'performance.desc.activeUsers': 'Concurrent active sessions',
  'performance.desc.activeQueries': 'React Query operations',
  'performance.desc.realtimeChannels': 'WebSocket connections',
  'performance.desc.memoryUsage': 'JavaScript heap size',
  
  // Charts
  'performance.chart.userActivity': 'User Activity Trend',
  'performance.chart.userActivityDesc': 'Active users over the last hour',
  'performance.chart.systemPerformance': 'System Performance',
  'performance.chart.systemPerformanceDesc': 'Response time and memory usage',
  
  // System status
  'performance.system.title': 'System Status',
  'performance.system.desc': 'Current system health and recommendations',
  'performance.system.monitoringActive': 'Monitoring Active',
  'performance.system.collectingMetrics': 'Collecting metrics every 5 seconds',
  'performance.system.optimizationRecommended': 'Optimization Recommended',
  'performance.system.optimizationRecommendedDesc': 'Consider enabling React Query optimizations',
  'performance.system.highLoad': 'High Load Detected',
  'performance.system.highLoadDesc': 'Automatic optimizations should be activated',
  'performance.system.lastUpdated': 'Last updated',
  'performance.system.nextCheck': 'Next optimization check',
  'performance.system.ready': 'Ready',
  'performance.system.moreUsers': 'At {count} more users',

  // Core Web Vitals
  'performance.webVitals.title': 'Core Web Vitals',
  'performance.webVitals.cls': 'Cumulative Layout Shift',
  'performance.webVitals.inp': 'Interaction to Next Paint',
  'performance.webVitals.lcp': 'Largest Contentful Paint',
  'performance.webVitals.ttfb': 'Time to First Byte',
  'performance.webVitals.good': 'Good',
  'performance.webVitals.needsImprovement': 'Needs Improvement',
  'performance.webVitals.poor': 'Poor',
  'performance.webVitals.desc.cls': 'Visual stability metric',
  'performance.webVitals.desc.inp': 'Responsiveness metric',
  'performance.webVitals.desc.lcp': 'Loading performance metric',
  'performance.webVitals.desc.ttfb': 'Server response time',

  // Info tooltip
  'performance.info.tooltip': `
**MONITORING AND OPTIMIZATION SYSTEM**

**KEY METRICS:**
• **Active Users**: Simultaneous sessions in the application
• **Active Queries**: Database operations in execution
• **Realtime Channels**: Active WebSocket connections
• **Memory Usage**: JavaScript memory consumption

**OPTIMIZATION PHASES:**

**🟡 PHASE 1 - YELLOW ALERT (25+ users)**
- Status: Moderate load
- Action: Basic optimizations recommended
- Includes: React Query cache, query cleanup

**🔴 PHASE 2 - RED ALERT (50+ users)**
- Status: High load
- Action: Automatic optimizations activated
- Includes: Realtime reduction, aggressive cache

**⚫ PHASE 3 - CRITICAL (100+ users)**
- Status: "Survival mode"
- Action: Maximum automatic optimizations
- Includes: Disable non-critical features

**CONTROLS:**
- **Apply**: Activates specific optimization
- **Disable**: Deactivates active optimization
- **Rollback**: Reverts all optimizations
- **Start/Stop**: Monitoring control
- **Sync**: Sends metrics to server
  `
};