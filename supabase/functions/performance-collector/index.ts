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

    // Insert metrics in batch
    const { error: insertError } = await supabase
      .from('performance_metrics')
      .insert(metrics.map(m => ({
        active_users: m.active_users,
        active_queries: m.active_queries,
        realtime_channels: m.realtime_channels,
        average_response_time: m.response_time_ms,
        memory_usage: m.memory_usage,
        timestamp: m.timestamp
      })))

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
  } catch (error) {
    console.error('Error in performance-collector:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
