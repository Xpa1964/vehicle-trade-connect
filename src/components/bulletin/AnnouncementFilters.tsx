
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { Briefcase, Search, Car, Wrench, Filter, Star, Calendar, TrendingUp } from 'lucide-react';

interface AnnouncementFiltersProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  showFeaturedOnly: boolean;
  setShowFeaturedOnly: (featured: boolean) => void;
}

const AnnouncementFilters: React.FC<AnnouncementFiltersProps> = ({ 
  activeTab, 
  setActiveTab,
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  showFeaturedOnly,
  setShowFeaturedOnly
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder={t('bulletin.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        {/* Sort Options */}
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('bulletin.sortBy')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at_desc">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {t('bulletin.sortByRecent')}
                </div>
              </SelectItem>
              <SelectItem value="created_at_asc">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {t('bulletin.sortByOldest')}
                </div>
              </SelectItem>
              <SelectItem value="view_count_desc">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {t('bulletin.sortByViews')}
                </div>
              </SelectItem>
              <SelectItem value="featured_first">
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-2" />
                  {t('bulletin.sortByFeatured')}
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Status and Featured Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm font-medium text-gray-500">{t('bulletin.statusFilter')}:</span>
          </div>
          <ToggleGroup type="single" value={statusFilter} onValueChange={(value) => setStatusFilter(value || 'all')}>
            <ToggleGroupItem value="all" className="text-xs px-3 py-1">
              {t('bulletin.all')}
            </ToggleGroupItem>
            <ToggleGroupItem value="active" className="text-xs px-3 py-1">
              {t('bulletin.active')}
            </ToggleGroupItem>
            <ToggleGroupItem value="finished" className="text-xs px-3 py-1">
              {t('bulletin.finished')}
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Featured Filter */}
        <div className="flex items-center gap-2">
          <ToggleGroup type="single" value={showFeaturedOnly ? 'featured' : 'all'} onValueChange={(value) => setShowFeaturedOnly(value === 'featured')}>
            <ToggleGroupItem value="all" className="text-xs px-3 py-1">
              {t('bulletin.showAll')}
            </ToggleGroupItem>
            <ToggleGroupItem value="featured" className="text-xs px-3 py-1">
              <Star className="h-3 w-3 mr-1" />
              {t('bulletin.showFeaturedOnly')}
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-2">
        <TabsList className="grid w-full grid-cols-5 md:w-auto">
          <TabsTrigger value="all">{t('bulletin.all')}</TabsTrigger>
          <TabsTrigger value="business_opportunities" className="flex items-center gap-1">
            <Briefcase className="h-3 w-3" />
            <span className="hidden sm:inline">{t('bulletin.business_opportunities')}</span>
          </TabsTrigger>
          <TabsTrigger value="vehicle_search" className="flex items-center gap-1">
            <Search className="h-3 w-3" />
            <span className="hidden sm:inline">{t('bulletin.vehicle_search')}</span>
          </TabsTrigger>
          <TabsTrigger value="available_vehicles" className="flex items-center gap-1">
            <Car className="h-3 w-3" />
            <span className="hidden sm:inline">{t('bulletin.available_vehicles')}</span>
          </TabsTrigger>
          <TabsTrigger value="professional_services" className="flex items-center gap-1">
            <Wrench className="h-3 w-3" />
            <span className="hidden sm:inline">{t('bulletin.professional_services')}</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default AnnouncementFilters;
