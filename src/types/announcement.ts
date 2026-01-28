
export interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string | null;
  status: string;
  type: string;
  category: 'business_opportunities' | 'vehicle_search' | 'available_vehicles' | 'professional_services' | string;
  original_language?: string;
  is_featured?: boolean;
  featured_until?: string;
  attachment_url?: string;
  attachment_name?: string;
  attachment_size?: number;
  view_count?: number;
  priority?: number;
}
