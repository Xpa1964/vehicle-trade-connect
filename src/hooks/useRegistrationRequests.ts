
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface RegistrationRequest {
  id: string;
  email: string;
  password?: string; // ADDED: Include password field
  company_name: string;
  city: string;
  country: string;
  postal_code: string;
  contact_person: string;
  phone: string;
  business_type: string;
  trader_type: string;
  description?: string;
  documents_paths?: string[];
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  company_logo?: string;
  manager_name?: string;
  created_at: string;
  updated_at: string;
}

export const useRegistrationRequests = () => {
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No authentication session found');
      }

      // Use the Edge Function to fetch requests
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-users/registration-requests`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch registration requests');
      }

      const data = await response.json();
      setRequests(data || []);
    } catch (error: any) {
      console.error('Error fetching registration requests:', error);
      setError(error);
      toast.error('Error al cargar las solicitudes de registro: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const refetch = () => {
    fetchRequests();
  };

  return {
    requests,
    isLoading,
    error,
    refetch
  };
};
