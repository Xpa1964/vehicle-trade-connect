import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import AnnouncementFilters from '@/components/bulletin/AnnouncementFilters';
import AnnouncementList from '@/components/bulletin/AnnouncementList';
import BulletinHero from '@/components/bulletin/BulletinHero';

const BulletinBoard: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured_first');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const { user } = useAuth();

  const queryKey = ['announcements', activeTab, statusFilter, searchQuery, sortBy, showFeaturedOnly];
  
  const { data: announcements = [], isLoading, error, refetch } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      try {
        console.log('Fetching announcements with filters:', { activeTab, statusFilter, searchQuery, sortBy, showFeaturedOnly });
        let query: any = supabase.from('announcements').select('*');
        
        // Apply status filter
        if (statusFilter === 'active') {
          query = query.eq('status' as any, 'active');
        } else if (statusFilter === 'finished') {
          query = query.eq('status' as any, 'finished');
        }
        
        // Apply category filter
        if (['business_opportunities', 'vehicle_search', 'available_vehicles', 'professional_services'].includes(activeTab)) {
          query = query.eq('category' as any, activeTab);
        }
        
        // Apply search filter
        if (searchQuery.trim().length > 0) {
          query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
        }
        
        // Apply featured filter
        if (showFeaturedOnly) {
          query = query.eq('is_featured' as any, true);
          query = query.gte('featured_until' as any, new Date().toISOString());
        }
        
        // Apply sorting
        switch (sortBy) {
          case 'created_at_desc':
            query = query.order('created_at', { ascending: false });
            break;
          case 'created_at_asc':
            query = query.order('created_at', { ascending: true });
            break;
          case 'view_count_desc':
            query = query.order('view_count' as any, { ascending: false, nullsFirst: false });
            break;
          case 'featured_first':
          default:
            query = query.order('is_featured' as any, { ascending: false, nullsFirst: false });
            query = query.order('priority' as any, { ascending: false, nullsFirst: false });
            query = query.order('created_at', { ascending: false });
            break;
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching announcements:', error);
          throw error;
        }
        
        console.log('Fetched announcements:', data);
        return (data || []).map(item => ({
          ...item,
          status: (item as any).status || 'active',
          type: (item as any).type || 'announcement', 
          category: (item as any).category || 'general'
        }));
      } catch (error) {
        console.error("Error in announcements query:", error);
        toast.error(t('common.error'));
        return [];
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [refetch, activeTab, statusFilter, searchQuery, sortBy, showFeaturedOnly]);

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Anuncio eliminado correctamente');
      refetch();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast.error('Error al eliminar el anuncio');
    }
  };

  return (
    <div className="w-full min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-full">
        <BulletinHero />

        <div className="mb-6">
          <AnnouncementFilters 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            showFeaturedOnly={showFeaturedOnly}
            setShowFeaturedOnly={setShowFeaturedOnly}
          />
        </div>

        <AnnouncementList 
          announcements={announcements}
          isLoading={isLoading}
          error={error}
          onDeleteAnnouncement={handleDeleteAnnouncement}
          currentUserId={user?.id}
        />
      </div>
    </div>
  );
};

export default BulletinBoard;
