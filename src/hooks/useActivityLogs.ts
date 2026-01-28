
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';
import { formatISO } from 'date-fns';
import { toast } from "sonner";

export interface ActivityLog {
  id: string;
  created_at: string;
  user_id: string | null;
  action_type: string;
  entity_type: string | null;
  entity_id: string | null;
  details: any;
  severity: 'info' | 'success' | 'warning' | 'error';
  user_email?: string; // Joined from users table when available
}

interface ActivityLogFilters {
  actionType?: string;
  entityType?: string;
  userId?: string;
  dateFrom?: Date | null;
  dateTo?: Date | null;
  severity?: string;
}

export const useActivityLogs = () => {
  const { hasPermission } = useUserRole();
  const [filters, setFilters] = useState<ActivityLogFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  
  const canViewLogs = hasPermission('logs.view');
  
  const { data: activityTypes } = useQuery({
    queryKey: ['activity-types'],
    queryFn: async () => {
      if (!canViewLogs) return [];
      
      const { data, error } = await supabase
        .from('activity_logs')
        .select('action_type')
        .order('action_type')
        .not('action_type', 'is', null);
        
      if (error) throw error;
      
      // Get unique action types
      const uniqueTypes = [...new Set(data.map(item => item.action_type))];
      return uniqueTypes;
    },
    enabled: canViewLogs
  });
  
  const { data: entityTypes } = useQuery({
    queryKey: ['entity-types'],
    queryFn: async () => {
      if (!canViewLogs) return [];
      
      const { data, error } = await supabase
        .from('activity_logs')
        .select('entity_type')
        .order('entity_type')
        .not('entity_type', 'is', null);
        
      if (error) throw error;
      
      // Get unique entity types
      const uniqueTypes = [...new Set(data.map(item => item.entity_type))].filter(Boolean);
      return uniqueTypes;
    },
    enabled: canViewLogs
  });
  
  const { data: users } = useQuery({
    queryKey: ['activity-users'],
    queryFn: async () => {
      if (!canViewLogs) return [];
      
      const { data, error } = await supabase
        .from('activity_logs')
        .select('user_id')
        .order('user_id')
        .not('user_id', 'is', null);
        
      if (error) throw error;
      
      // Get unique user IDs
      const uniqueUserIds = [...new Set(data.map(item => item.user_id))].filter(Boolean);
      
      // We can't directly query auth.users, so we use profiles table if available
      // This is a simplified approach - in a real system with proper user management
      // you'd have a more robust way to get user details
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, company_name')
        .in('id', uniqueUserIds);
      
      if (profilesError) {
        console.error('Error fetching user profiles:', profilesError);
        return uniqueUserIds.map(id => ({ id, name: id }));
      }
      
      return profiles.map(profile => ({
        id: profile.id,
        name: profile.full_name || profile.company_name || profile.id
      }));
    },
    enabled: canViewLogs
  });
  
  const { data: logs, isLoading, error, refetch } = useQuery({
    queryKey: ['activity-logs', filters, currentPage, pageSize],
    queryFn: async () => {
      if (!canViewLogs) return { logs: [], count: 0 };
      
      let query = supabase
        .from('activity_logs')
        .select('*', { count: 'exact' });
      
      // Apply filters - using appropriate filter methods for the Supabase SDK
      if (filters.actionType) {
        query = query.eq('action_type', filters.actionType);
      }
      
      if (filters.entityType) {
        query = query.eq('entity_type', filters.entityType);
      }
      
      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }
      
      if (filters.severity) {
        query = query.eq('severity', filters.severity);
      }
      
      if (filters.dateFrom) {
        query = query.gte('created_at', formatISO(filters.dateFrom));
      }
      
      if (filters.dateTo) {
        // Add 1 day to include the end date fully
        const endDate = new Date(filters.dateTo);
        endDate.setDate(endDate.getDate() + 1);
        query = query.lt('created_at', formatISO(endDate));
      }
      
      // Apply pagination
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);
        
      if (error) throw error;
      
      return {
        logs: data as ActivityLog[],
        count: count || 0
      };
    },
    enabled: canViewLogs
  });
  
  const exportLogs = async () => {
    if (!canViewLogs) {
      toast.error("You don't have permission to export logs");
      return;
    }
    
    try {
      // Build query with all current filters but no pagination
      let query = supabase
        .from('activity_logs')
        .select('*');
      
      // Apply same filters as the main query
      if (filters.actionType) {
        query = query.eq('action_type', filters.actionType);
      }
      
      if (filters.entityType) {
        query = query.eq('entity_type', filters.entityType);
      }
      
      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }
      
      if (filters.severity) {
        query = query.eq('severity', filters.severity);
      }
      
      if (filters.dateFrom) {
        query = query.gte('created_at', formatISO(filters.dateFrom));
      }
      
      if (filters.dateTo) {
        // Add 1 day to include the end date fully
        const endDate = new Date(filters.dateTo);
        endDate.setDate(endDate.getDate() + 1);
        query = query.lt('created_at', formatISO(endDate));
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        toast.warning("No data to export");
        return;
      }
      
      // Convert to CSV
      const headers = ['ID', 'Timestamp', 'User ID', 'Action', 'Entity Type', 'Entity ID', 'Severity', 'Details'];
      const rows = [
        headers.join(','),
        ...data.map(log => [
          log.id,
          log.created_at,
          log.user_id || 'N/A',
          log.action_type,
          log.entity_type || 'N/A',
          log.entity_id || 'N/A',
          log.severity,
          log.details ? `"${JSON.stringify(log.details).replace(/"/g, '""')}"` : 'N/A'
        ].join(','))
      ];
      
      const csvContent = rows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `activity-logs-${new Date().toISOString().slice(0, 10)}.csv`);
      link.click();
      
      toast.success("Export complete");
    } catch (error) {
      console.error('Export error:', error);
      toast.error("Failed to export logs");
    }
  };
  
  return {
    logs: logs?.logs || [],
    totalLogs: logs?.count || 0,
    isLoading,
    error,
    refetch,
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    activityTypes,
    entityTypes,
    users,
    exportLogs,
    canViewLogs
  };
};
