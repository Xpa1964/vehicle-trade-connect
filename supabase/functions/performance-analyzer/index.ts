import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get metrics from last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    
    const { data: metrics, error: metricsError } = await supabase
      .from('performance_metrics')
      .select('*')
      .gte('created_at', oneHourAgo)
      .order('created_at', { ascending: false })

    if (metricsError) throw metricsError

    if (!metrics || metrics.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true,
          analysis: {
            status: 'insufficient_data',
            message: 'Not enough data for analysis'
          }
        }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Calculate averages and trends
    const avgActiveUsers = metrics.reduce((sum, m) => sum + m.active_users, 0) / metrics.length
    const avgMemory = metrics.reduce((sum, m) => sum + m.memory_usage_mb, 0) / metrics.length
    const avgResponseTime = metrics.reduce((sum, m) => sum + m.response_time_ms, 0) / metrics.length
    const avgQueries = metrics.reduce((sum, m) => sum + m.active_queries, 0) / metrics.length

    // Detect trends
    const recent = metrics.slice(0, Math.floor(metrics.length / 3))
    const older = metrics.slice(-Math.floor(metrics.length / 3))
    
    const recentAvgUsers = recent.reduce((sum, m) => sum + m.active_users, 0) / recent.length
    const olderAvgUsers = older.reduce((sum, m) => sum + m.active_users, 0) / older.length
    const userTrend = recentAvgUsers > olderAvgUsers * 1.2 ? 'increasing' : 
                      recentAvgUsers < olderAvgUsers * 0.8 ? 'decreasing' : 'stable'

    // Generate recommendations
    const recommendations = []
    
    if (avgActiveUsers > 50) {
      recommendations.push({
        type: 'react_query',
        priority: 'high',
        message: 'Enable React Query optimizations for high user load'
      })
    }
    
    if (avgMemory > 300) {
      recommendations.push({
        type: 'realtime',
        priority: 'high',
        message: 'Reduce realtime connections to lower memory usage'
      })
    }
    
    if (avgResponseTime > 1000) {
      recommendations.push({
        type: 'database',
        priority: 'medium',
        message: 'Database query optimization recommended'
      })
    }

    // Check current optimizations
    const { data: activeOpts } = await supabase
      .from('performance_optimizations')
      .select('*')
      .eq('is_enabled', true)

    return new Response(
      JSON.stringify({ 
        success: true,
        analysis: {
          status: avgActiveUsers > 100 ? 'critical' : avgActiveUsers > 50 ? 'warning' : 'healthy',
          metrics: {
            avgActiveUsers: Math.round(avgActiveUsers),
            avgMemory: Math.round(avgMemory),
            avgResponseTime: Math.round(avgResponseTime),
            avgQueries: Math.round(avgQueries)
          },
          trends: {
            users: userTrend
          },
          recommendations,
          activeOptimizations: activeOpts || []
        }
      }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: unknown) {
    console.error('Error in performance-analyzer:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
