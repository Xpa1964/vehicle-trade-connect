import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuctionsList } from '@/hooks/auctions/useAuctionsList';
import { AuctionCard } from '@/components/auctions/AuctionCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AuctionStatus } from '@/types/auction';
import { Search, Filter, Gavel, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LiveAuctionsPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AuctionStatus | 'all'>('active');
  const [priceMin, setPriceMin] = useState<number | undefined>();
  const [priceMax, setPriceMax] = useState<number | undefined>();

  const status = statusFilter === 'all' ? undefined : [statusFilter];

  const { data: auctions, isLoading, error } = useAuctionsList({
    status,
    searchTerm,
    priceMin,
    priceMax,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl shadow-lg mb-6">
        <div className="absolute inset-0">
      <img 
        src="/images/auctions-hero.png"
        alt={t('auctions.title')}
            className="w-full h-full object-cover object-center"
            style={{ minHeight: '320px' }}
          />
        </div>
        
        <div className="relative z-10 p-8" style={{ minHeight: '320px' }}>
          <div className="flex flex-col justify-between h-full">
            <div className="mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/dashboard')}
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('navigation.backToControlPanel')}
              </Button>
            </div>
            
            <div className="flex-1 flex flex-col justify-end">
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10 w-fit">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {t('auctions.title', { fallback: 'Subastas en Vivo' })}
                </h1>
              </div>
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10 w-fit mt-3">
                <p className="text-lg text-white font-bold">
                  {t('auctions.description', { fallback: 'Participa en subastas exclusivas de vehículos profesionales' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder={t('auctions.searchPlaceholder', { fallback: 'Buscar por marca o modelo...' })}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as AuctionStatus | 'all')}>
                <SelectTrigger>
                  <SelectValue placeholder={t('auctions.filterByStatus', { fallback: 'Filtrar por estado' })} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('auctions.allStatuses', { fallback: 'Todos' })}</SelectItem>
                  <SelectItem value="active">{t('auctions.statusActive', { fallback: 'Activas' })}</SelectItem>
                  <SelectItem value="scheduled">{t('auctions.statusScheduled', { fallback: 'Próximamente' })}</SelectItem>
                  <SelectItem value="ended">{t('auctions.statusEnded', { fallback: 'Finalizadas' })}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div className="flex gap-2 items-center">
              <Filter className="w-5 h-5 text-gray-400" />
              <Input
                type="number"
                placeholder={t('auctions.minPrice', { fallback: 'Precio mín.' })}
                value={priceMin || ''}
                onChange={(e) => setPriceMin(e.target.value ? Number(e.target.value) : undefined)}
                className="flex-1"
              />
              <span className="text-gray-400">-</span>
              <Input
                type="number"
                placeholder={t('auctions.maxPrice', { fallback: 'Precio máx.' })}
                value={priceMax || ''}
                onChange={(e) => setPriceMax(e.target.value ? Number(e.target.value) : undefined)}
                className="flex-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('auctions.loading', { fallback: 'Cargando subastas...' })}</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-600">{t('auctions.loadError', { fallback: 'Error al cargar las subastas' })}</p>
        </div>
      )}

      {/* Auctions Grid */}
      {!isLoading && !error && (
        <>
          {auctions && auctions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {auctions.map((auction) => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Gavel className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">
                {t('auctions.noAuctionsFound', { fallback: 'No se encontraron subastas' })}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LiveAuctionsPage;
