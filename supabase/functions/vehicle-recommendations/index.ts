import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VehiclePreference {
  [key: string]: number;
}

interface RecommendationData {
  recommended_vehicles: string[];
  reasoning: string[];
  confidence_score: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get user from JWT
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Generating recommendations for user: ${user.id}`);

    // Check cache first
    const { data: cachedRecommendations } = await supabaseClient
      .from('recommendation_cache')
      .select('*')
      .eq('user_id', user.id)
      .gt('expires_at', new Date().toISOString())
      .order('generated_at', { ascending: false })
      .limit(1)
      .single();

    if (cachedRecommendations) {
      console.log('Returning cached recommendations');
      return new Response(JSON.stringify({
        success: true,
        recommendations: cachedRecommendations.recommended_vehicles,
        reasoning: cachedRecommendations.reasoning,
        cached: true,
        generated_at: cachedRecommendations.generated_at
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user's visit history (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: visitHistory } = await supabaseClient
      .from('user_vehicle_visits')
      .select('vehicle_id, interaction_type, visited_at')
      .eq('user_id', user.id)
      .gte('visited_at', thirtyDaysAgo.toISOString())
      .order('visited_at', { ascending: false });

    // Get user profile for additional preferences
    const { data: userProfile } = await supabaseClient
      .from('profiles')
      .select('country, business_type, trader_type')
      .eq('id', user.id)
      .single();

    // Get vehicles from visits to analyze preferences
    const visitedVehicleIds = visitHistory?.map(v => v.vehicle_id) || [];
    let visitedVehicles: Array<{ id: string; brand?: string; model?: string; year?: number; price?: number; fuel_type?: string; country?: string; status?: string }> = [];
    
    if (visitedVehicleIds.length > 0) {
      const { data: vehicles } = await supabaseClient
        .from('vehicles')
        .select('id, brand, model, year, price, fuel_type, country, status')
        .in('id', visitedVehicleIds);
      visitedVehicles = vehicles || [];
    }

    // Build user preference profile
    const preferences: VehiclePreference = {};
    const reasoning: string[] = [];

    // Analyze visited vehicles for patterns
    visitedVehicles.forEach(vehicle => {
      // Brand preference
      const brand = vehicle.brand?.toLowerCase();
      if (brand) {
        preferences[`brand_${brand}`] = (preferences[`brand_${brand}`] || 0) + 3;
      }

      // Price range preference
      if (vehicle.price) {
        const priceRange = vehicle.price < 15000 ? 'low' : 
                          vehicle.price < 30000 ? 'medium' : 'high';
        preferences[`price_${priceRange}`] = (preferences[`price_${priceRange}`] || 0) + 2;
      }

      // Fuel type preference
      if (vehicle.fuel_type) {
        preferences[`fuel_${vehicle.fuel_type.toLowerCase()}`] = 
          (preferences[`fuel_${vehicle.fuel_type.toLowerCase()}`] || 0) + 2;
      }

      // Year preference
      if (vehicle.year && vehicle.year > 2015) {
        preferences['modern_vehicle'] = (preferences['modern_vehicle'] || 0) + 1;
      }
    });

    // Add user profile preferences
    if (userProfile?.country) {
      preferences[`country_${userProfile.country.toLowerCase()}`] = 
        (preferences[`country_${userProfile.country.toLowerCase()}`] || 0) + 2;
      reasoning.push(`Priorizando vehículos de ${userProfile.country}`);
    }

    // Get all available vehicles for scoring (excluding user's own vehicles)
    const { data: availableVehicles } = await supabaseClient
      .from('vehicles')
      .select('id, user_id, brand, model, year, price, fuel_type, country, status, title')
      .eq('status', 'available')
      .neq('user_id', user.id)
      .limit(100);

    if (!availableVehicles || availableVehicles.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        recommendations: [],
        reasoning: ['No hay vehículos disponibles para recomendar'],
        cached: false
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Score vehicles based on preferences
    const scoredVehicles = availableVehicles.map(vehicle => {
      let score = 0;
      const vehicleReasons: string[] = [];

      // Brand matching
      const brand = vehicle.brand?.toLowerCase();
      if (brand && preferences[`brand_${brand}`]) {
        score += preferences[`brand_${brand}`];
        vehicleReasons.push(`Marca preferida: ${vehicle.brand}`);
      }

      // Price range matching
      if (vehicle.price) {
        const priceRange = vehicle.price < 15000 ? 'low' : 
                          vehicle.price < 30000 ? 'medium' : 'high';
        if (preferences[`price_${priceRange}`]) {
          score += preferences[`price_${priceRange}`];
          vehicleReasons.push(`Rango de precio habitual`);
        }
      }

      // Fuel type matching
      if (vehicle.fuel_type && preferences[`fuel_${vehicle.fuel_type.toLowerCase()}`]) {
        score += preferences[`fuel_${vehicle.fuel_type.toLowerCase()}`];
        vehicleReasons.push(`Tipo de combustible preferido`);
      }

      // Country matching
      if (vehicle.country && preferences[`country_${vehicle.country.toLowerCase()}`]) {
        score += preferences[`country_${vehicle.country.toLowerCase()}`];
        vehicleReasons.push(`Del mismo país`);
      }

      // Modern vehicle preference
      if (vehicle.year && vehicle.year > 2015 && preferences['modern_vehicle']) {
        score += preferences['modern_vehicle'];
        vehicleReasons.push(`Vehículo moderno (${vehicle.year})`);
      }

      // Exclude already visited vehicles (lower score)
      if (visitedVehicleIds.includes(vehicle.id)) {
        score = score * 0.3; // Reduce score significantly
      }

      return {
        ...vehicle,
        score,
        reasons: vehicleReasons
      };
    });

    // Sort by score and get top recommendations
    const topRecommendations = scoredVehicles
      .sort((a, b) => b.score - a.score)
      .slice(0, 8); // Top 8 recommendations

    // Build final response
    const recommendedVehicleIds = topRecommendations.map(v => v.id);
    const confidenceScore = Math.min(100, Math.max(0, 
      (topRecommendations.reduce((sum, v) => sum + v.score, 0) / topRecommendations.length) * 10
    ));

    // Add general reasoning
    if (visitHistory && visitHistory.length > 0) {
      reasoning.push(`Basado en ${visitHistory.length} vehículos visitados`);
    }
    
    const topBrands = Object.keys(preferences)
      .filter(k => k.startsWith('brand_'))
      .sort((a, b) => preferences[b] - preferences[a])
      .slice(0, 3)
      .map(k => k.replace('brand_', ''));
    
    if (topBrands.length > 0) {
      reasoning.push(`Marcas preferidas: ${topBrands.join(', ')}`);
    }

    const recommendationData: RecommendationData = {
      recommended_vehicles: recommendedVehicleIds,
      reasoning,
      confidence_score: confidenceScore
    };

    // Cache the recommendations
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Cache for 1 hour

    await supabaseClient
      .from('recommendation_cache')
      .insert({
        user_id: user.id,
        recommended_vehicles: recommendedVehicleIds,
        algorithm_version: '1.0',
        confidence_score: confidenceScore,
        reasoning: reasoning,
        expires_at: expiresAt.toISOString()
      });

    console.log(`Generated ${recommendedVehicleIds.length} recommendations with confidence ${confidenceScore}`);

    return new Response(JSON.stringify({
      success: true,
      recommendations: recommendedVehicleIds,
      reasoning,
      confidence_score: confidenceScore,
      cached: false,
      generated_at: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Error in vehicle-recommendations function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error),
      recommendations: [],
      reasoning: ['Error al generar recomendaciones']
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});