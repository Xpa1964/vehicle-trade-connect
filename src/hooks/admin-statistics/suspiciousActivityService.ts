
import { supabase } from '@/integrations/supabase/client';

export const detectSuspiciousConversations = async () => {
  // Detectar conversaciones con patrones sospechosos
  const { data: conversations, error } = await supabase
    .from('conversations')
    .select(`
      id,
      messages(count),
      created_at,
      updated_at
    `)
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
  
  if (error || !conversations) {
    console.error('Error detecting suspicious conversations:', error);
    return [];
  }
  
  const suspicious = conversations.filter(conv => {
    const messageCount = conv.messages?.[0]?.count || 0;
    const duration = new Date(conv.updated_at).getTime() - new Date(conv.created_at).getTime();
    const hoursActive = duration / (1000 * 60 * 60);
    
    // Criterios de sospecha: muchos mensajes en poco tiempo
    return messageCount > 50 && hoursActive < 2;
  });
  
  return suspicious;
};

export const detectHighVolumeUsers = async () => {
  const { data: userActivity, error } = await supabase
    .from('activity_logs')
    .select('user_id')
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
  
  if (error || !userActivity) {
    console.error('Error detecting high volume users:', error);
    return [];
  }
  
  const userCounts = userActivity.reduce((acc, log) => {
    if (log.user_id) {
      acc[log.user_id] = (acc[log.user_id] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  // Usuarios con más de 200 acciones en 24h
  return Object.entries(userCounts)
    .filter(([_, count]) => count > 200)
    .map(([userId, count]) => ({ userId, activityCount: count }));
};

export const getSecurityAlerts = async () => {
  const suspiciousConversations = await detectSuspiciousConversations();
  const highVolumeUsers = await detectHighVolumeUsers();
  
  const alerts = [];
  
  if (suspiciousConversations.length > 0) {
    alerts.push({
      type: 'suspicious_conversations',
      severity: 'high',
      count: suspiciousConversations.length,
      message: `${suspiciousConversations.length} conversaciones con actividad sospechosa detectadas`
    });
  }
  
  if (highVolumeUsers.length > 0) {
    alerts.push({
      type: 'high_volume_users',
      severity: 'medium',
      count: highVolumeUsers.length,
      message: `${highVolumeUsers.length} usuarios con actividad excesiva detectados`
    });
  }
  
  return alerts;
};
