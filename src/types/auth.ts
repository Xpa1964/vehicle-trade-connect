
import { User } from '@supabase/supabase-js';
import { Enums } from '@/integrations/supabase/types';

// Extend the AppRole type to include more granular admin roles
export type AppRole = Enums<'app_role'> | 'moderator' | 'support' | 'content_manager' | 'analyst';

// Define permissions for granular access control
export type Permission = 
  | 'users.view' | 'users.create' | 'users.edit' | 'users.delete'
  | 'vehicles.view' | 'vehicles.create' | 'vehicles.edit' | 'vehicles.delete'
  | 'auctions.view' | 'auctions.create' | 'auctions.edit' | 'auctions.manage'
  | 'announcements.view' | 'announcements.create' | 'announcements.edit' | 'announcements.delete'
  | 'content.view' | 'content.create' | 'content.edit' | 'content.delete'
  | 'analytics.view' | 'analytics.export'
  | 'settings.view' | 'settings.edit'
  | 'logs.view' | 'logs.export'
  | 'notifications.manage';

export interface UserProfile {
  full_name?: string;
  company_name?: string;
  business_type?: string;
  contact_phone?: string;
  country?: string;
  address?: string;
  trader_type?: string;
  registration_date?: string;
  total_operations?: number;
  operations_breakdown?: {
    buys?: number;
    sells?: number;
    exchanges?: number;
  };
  show_contact_details?: boolean;
  show_location_details?: boolean;
  show_business_stats?: boolean;
  company_logo?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserWithMeta extends User {
  name: string;
  profile: UserProfile;
  role: AppRole; // Using our extended AppRole type
  permissions?: Permission[]; // Added permissions for granular access control
}

export interface AuthContextType {
  user: UserWithMeta | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, userData?: Partial<UserProfile>) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUserRole: (newRole: AppRole) => Promise<boolean>; // Function to update the user role
  hasPermission?: (permission: Permission) => boolean; // New function to check specific permissions
  refreshUser: () => Promise<void>; // Function to refresh user data from database
}
