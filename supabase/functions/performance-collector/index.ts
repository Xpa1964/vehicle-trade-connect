import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PerformanceMetric {
  active_users: number
  active_queries: number
  realtime_channels: number
  response_time_ms: number
  memory_usage: number
  timestamp: string
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

    const { metrics } = await req.json() as { metrics: PerformanceMetric[] }
    
    if (!Array.isArray(metrics) || metrics.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid metrics data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Insert metrics in batch using the actual table schema
    const rows = metrics.flatMap(m => [
      { metric_name: 'active_users', metric_value: m.active_users, metric_unit: 'count', metadata: { timestamp: m.timestamp } },
      { metric_name: 'active_queries', metric_value: m.active_queries, metric_unit: 'count', metadata: { timestamp: m.timestamp } },
      { metric_name: 'realtime_channels', metric_value: m.realtime_channels, metric_unit: 'count', metadata: { timestamp: m.timestamp } },
      { metric_name: 'response_time_ms', metric_value: m.response_time_ms, metric_unit: 'ms', metadata: { timestamp: m.timestamp } },
      { metric_name: 'memory_usage', metric_value: m.memory_usage, metric_unit: 'MB', metadata: { timestamp: m.timestamp } },
    ])

    const { error: insertError } = await supabase
      .from('performance_metrics')
      .insert(rows)

    if (insertError) {
      console.error('Error inserting metrics:', insertError)
      throw insertError
    }

    // Check if auto-optimization is needed
    const avgActiveUsers = metrics.reduce((sum, m) => sum + m.active_users, 0) / metrics.length
    const avgMemory = metrics.reduce((sum, m) => sum + m.memory_usage, 0) / metrics.length
    
    let autoOptimization = null
    
    if (avgActiveUsers >= 100 || avgMemory >= 500) {
      // Critical: Apply aggressive optimizations
      autoOptimization = {
        level: 'critical',
        applied: ['react_query', 'realtime', 'database']
      }
    } else if (avgActiveUsers >= 50 || avgMemory >= 300) {
      // High: Apply moderate optimizations
      autoOptimization = {
        level: 'high',
        applied: ['react_query', 'realtime']
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        metrics_count: metrics.length,
        auto_optimization: autoOptimization
      }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: unknown) {
    console.error('Error in performance-collector:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
