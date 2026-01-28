import { Vehicle } from './vehicle';

export type AuctionStatus = 'scheduled' | 'active' | 'ended' | 'completed' | 'cancelled';

export interface Auction {
  id: string;
  vehicle_id: string;
  created_by: string;
  starting_price: number;
  reserve_price?: number;
  current_price: number;
  increment_minimum: number;
  start_date: string;
  end_date: string;
  status: AuctionStatus;
  winner_id?: string;
  terms_accepted: boolean;
  description?: string;
  seller_accepted_bid_id?: string;
  seller_accepted_at?: string;
  hidden_at?: string;
  created_at: string;
  updated_at: string;
  
  // Relaciones
  vehicle?: Vehicle;
  creator?: {
    id: string;
    company_name?: string;
    full_name?: string;
    email: string;
  };
  winner?: {
    id: string;
    company_name?: string;
    full_name?: string;
  };
  bids?: Bid[];
}

export interface Bid {
  id: string;
  auction_id: string;
  bidder_id: string;
  amount: number;
  status: 'active';
  created_at: string;
  
  // Relaciones
  bidder?: {
    id: string;
    company_name?: string;
    full_name?: string;
  };
}

export interface AuctionNotification {
  id: string;
  user_id: string;
  auction_id: string;
  type: 'outbid' | 'auction_won' | 'auction_sold' | 'auction_extended' | 'reserve_not_met' | 'bid_accepted' | 'auction_ended_early' | 'auction_cancelled' | 'auction_result_accepted' | 'auction_result_rejected';
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface CreateAuctionData {
  vehicle_id: string;
  starting_price: number;
  reserve_price?: number;
  increment_minimum?: number;
  start_date: string;
  end_date: string;
  description?: string;
  terms_accepted: boolean;
}
