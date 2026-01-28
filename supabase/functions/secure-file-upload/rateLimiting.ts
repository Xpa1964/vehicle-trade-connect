import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

export async function checkRateLimit(supabase: SupabaseClient, userId: string) {
  const now = new Date()
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  // Check recent uploads (last hour)
  const { data: recentUploads } = await supabase
    .from('activity_logs')
    .select('id')
    .eq('user_id', userId)
    .eq('action_type', 'file_upload')
    .gte('created_at', oneHourAgo.toISOString())

  // Check daily uploads
  const { data: dailyUploads } = await supabase
    .from('activity_logs')
    .select('id')
    .eq('user_id', userId)
    .eq('action_type', 'file_upload')
    .gte('created_at', oneDayAgo.toISOString())

  return {
    recentUploadCount: recentUploads?.length || 0,
    dailyUploadCount: dailyUploads?.length || 0,
    now
  }
}

export async function logBlockedRateLimit(
  supabase: SupabaseClient, 
  userId: string, 
  recentCount: number, 
  dailyCount: number, 
  timestamp: Date
) {
  await supabase
    .from('activity_logs')
    .insert({
      user_id: userId,
      action_type: 'rate_limit_blocked',
      entity_type: 'file_upload',
      details: {
        recent_uploads: recentCount,
        daily_uploads: dailyCount,
        blocked_at: timestamp.toISOString()
      },
      severity: 'warning'
    })
}