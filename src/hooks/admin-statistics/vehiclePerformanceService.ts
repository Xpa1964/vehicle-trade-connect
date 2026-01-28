
import { supabase } from '@/integrations/supabase/client';

export const getVehiclePerformanceStats = async () => {
  try {
    const { data: vehicles, error } = await supabase
      .from('vehicles')
      .select('id, created_at, status, type, price')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    if (!vehicles || vehicles.length === 0) {
      return {
        averageDaysOnMarket: 0,
        soldVehicles: 0,
        totalVehicles: 0,
        conversionRate: 0,
        performanceByType: []
      };
    }
    
    const now = new Date();
    const soldVehicles = vehicles.filter(v => v.status === 'sold' || v.status === 'reserved');
    
    // Calculate average days on market for sold vehicles
    const daysOnMarket = soldVehicles.map(vehicle => {
      const createdDate = new Date(vehicle.created_at);
      const daysDiff = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff;
    });
    
    const averageDaysOnMarket = daysOnMarket.length > 0 
      ? Math.round(daysOnMarket.reduce((sum, days) => sum + days, 0) / daysOnMarket.length)
      : 0;
    
    const conversionRate = vehicles.length > 0 
      ? Math.round((soldVehicles.length / vehicles.length) * 100)
      : 0;
    
    // Performance by vehicle type
    const typeStats = vehicles.reduce((acc, vehicle) => {
      const type = vehicle.type || 'unknown';
      if (!acc[type]) {
        acc[type] = { total: 0, sold: 0, totalValue: 0 };
      }
      acc[type].total++;
      if (vehicle.status === 'sold' || vehicle.status === 'reserved') {
        acc[type].sold++;
      }
      acc[type].totalValue += vehicle.price || 0;
      return acc;
    }, {} as Record<string, { total: number; sold: number; totalValue: number }>);
    
    const performanceByType = Object.entries(typeStats).map(([type, stats]) => ({
      type,
      total: stats.total,
      sold: stats.sold,
      conversionRate: Math.round((stats.sold / stats.total) * 100),
      averagePrice: Math.round(stats.totalValue / stats.total)
    }));
    
    return {
      averageDaysOnMarket,
      soldVehicles: soldVehicles.length,
      totalVehicles: vehicles.length,
      conversionRate,
      performanceByType
    };
  } catch (err) {
    console.error("[vehiclePerformanceService] Error fetching vehicle performance:", err);
    return {
      averageDaysOnMarket: 0,
      soldVehicles: 0,
      totalVehicles: 0,
      conversionRate: 0,
      performanceByType: []
    };
  }
};
