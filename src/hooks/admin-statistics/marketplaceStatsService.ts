
import { supabase } from '@/integrations/supabase/client';

export const getTotalVehiclesListed = async () => {
  const { count, error } = await supabase
    .from('vehicles')
    .select('*', { count: 'exact', head: true });
  
  if (error) {
    console.error('Error fetching total vehicles:', error);
    return 0;
  }
  
  return count || 0;
};

export const getTotalAdsListed = async () => {
  const { count, error } = await supabase
    .from('announcements')
    .select('*', { count: 'exact', head: true });
  
  if (error) {
    console.error('Error fetching total ads:', error);
    return 0;
  }
  
  return count || 0;
};

export const getSuccessfulTransactionsRate = async () => {
  const { count: totalVehicles } = await supabase
    .from('vehicles')
    .select('*', { count: 'exact', head: true });
  
  const { count: soldVehicles } = await supabase
    .from('vehicles')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'sold');
  
  if (!totalVehicles || totalVehicles === 0) return 0;
  
  return Math.round(((soldVehicles || 0) / totalVehicles) * 100);
};

export const getAverageTimeToTransaction = async () => {
  const { data, error } = await supabase
    .from('vehicles')
    .select('created_at, updated_at')
    .eq('status', 'sold');
  
  if (error || !data || data.length === 0) {
    return 0;
  }
  
  const totalDays = data.reduce((acc, vehicle) => {
    const created = new Date(vehicle.created_at);
    const updated = new Date(vehicle.updated_at);
    const diffDays = (updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
    return acc + diffDays;
  }, 0);
  
  return Math.round(totalDays / data.length);
};

export const getTotalTransactionValue = async () => {
  const { data, error } = await supabase
    .from('transactions')
    .select('amount')
    .eq('status', 'completed');
  
  if (error || !data) {
    return 0;
  }
  
  return data.reduce((total, transaction) => total + (Number(transaction.amount) || 0), 0);
};

export const getAverageBidsPerAuction = async () => {
  const { data: auctions, error: auctionsError } = await supabase
    .from('auctions')
    .select('id');
  
  const { count: totalBids, error: bidsError } = await supabase
    .from('bids')
    .select('*', { count: 'exact', head: true });
  
  if (auctionsError || bidsError || !auctions || auctions.length === 0) {
    return 0;
  }
  
  return Math.round((totalBids || 0) / auctions.length);
};

export const getTotalExchangeProposals = async () => {
  const { count, error } = await supabase
    .from('exchanges')
    .select('*', { count: 'exact', head: true });
  
  if (error) {
    console.error('Error fetching exchange proposals:', error);
    return 0;
  }
  
  return count || 0;
};
