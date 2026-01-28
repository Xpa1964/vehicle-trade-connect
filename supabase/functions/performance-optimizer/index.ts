import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OptimizationRequest {
  optimization_type: 'react_query' | 'realtime' | 'database'
  action: 'enable' | 'disable'
  level?: 'moderate' | 'aggressive'
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

    const { optimization_type, action, level = 'moderate' } = await req.json() as OptimizationRequest
    
    const userId = req.headers.get('x-user-id')
    
    // Store optimization configuration
    const { data: config, error: configError } = await supabase
      .from('performance_optimizations')
      .upsert({
        optimization_type,
        is_enabled: action === 'enable',
        level,
        applied_by: userId,
        applied_at: new Date().toISOString()
      }, {
        onConflict: 'optimization_type'
      })
      .select()
      .single()

    if (configError) {
      console.error('Error updating optimization config:', configError)
      throw configError
    }

    // Log the optimization change
    await supabase
      .from('activity_logs')
      .insert({
        user_id: userId,
        action_type: `optimization_${action}`,
        entity_type: 'performance',
        entity_id: optimization_type,
        details: {
          optimization_type,
          level,
          action
        },
        severity: 'info'
      })

    // Return configuration recommendations
    const recommendations = getOptimizationRecommendations(optimization_type, action, level)

    return new Response(
      JSON.stringify({ 
        success: true,
        config,
        recommendations
      }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in performance-optimizer:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

function getOptimizationRecommendations(type: string, action: string, level: string) {
  const configs: Record<string, any> = {
    react_query: {
      moderate: {
        staleTime: 30000,
        gcTime: 300000,
        refetchOnWindowFocus: false
      },
      aggressive: {
        staleTime: 60000,
        gcTime: 600000,
        refetchOnWindowFocus: false,
        refetchOnMount: false
      }
    },
    realtime: {
      moderate: {
        maxChannels: 10,
        heartbeatInterval: 30000
      },
      aggressive: {
        maxChannels: 5,
        heartbeatInterval: 60000,
        disablePresence: true
      }
    },
    database: {
      moderate: {
        connectionPoolSize: 20,
        statementTimeout: 10000
      },
      aggressive: {
        connectionPoolSize: 10,
        statementTimeout: 5000,
        enableReadReplica: true
      }
    }
  }

  return action === 'enable' ? configs[type]?.[level] : null
}
