
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdminConversations } from '@/hooks/useAdminConversations';
import { DataTable } from '@/components/shared/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Conversation } from '@/types/conversation';
import { formatDistance } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, ArrowLeft, BarChart3, Download } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const ConversationsAdminPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: conversations = [], isLoading: loading, refetch } = useAdminConversations();
  const [activeTab, setActiveTab] = useState("all");
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);

  // Fetch conversation statistics
  const { data: conversationStats } = useQuery({
    queryKey: ['admin-conversation-stats'],
    queryFn: async () => {
      console.log('Fetching conversation statistics for admin...');
      
      const { count: totalCount } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true });
        
      const { count: activeCount } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const { count: newCount } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', oneWeekAgo.toISOString());
        
      const stats = {
        total: totalCount || 0,
        active: activeCount || 0,
        new: newCount || 0
      };
      
      console.log('Conversation statistics:', stats);
      return stats;
    }
  });

  // Fetch message counts for each conversation
  const { data: messageCounts } = useQuery({
    queryKey: ['admin-message-counts'],
    queryFn: async () => {
      console.log('Fetching message counts for all conversations...');
      
      const { data, error } = await supabase
        .from('messages')
        .select('conversation_id')
        .order('conversation_id');

      if (error) {
        console.error('Error fetching message counts:', error);
        return {};
      }

      // Count messages per conversation
      const counts = data.reduce((acc, message) => {
        acc[message.conversation_id] = (acc[message.conversation_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      console.log(`Message counts calculated for ${Object.keys(counts).length} conversations`);
      return counts;
    }
  });

  // Export function
  const handleExportCSV = async () => {
    try {
      console.log('Exporting conversations to CSV...');
      const headers = ['ID', 'Created At', 'Status', 'Seller ID', 'Buyer ID', 'Vehicle ID', 'Source', 'Messages Count'];
      
      const csvRows = [
        headers.join(','),
        ...filteredConversations.map(conv => [
          conv.id,
          conv.created_at,
          conv.status,
          conv.seller_id,
          conv.buyer_id,
          conv.vehicle_id || 'N/A',
          conv.source_type || 'N/A',
          messageCounts?.[conv.id] || 0
        ].join(','))
      ];
      
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `conversations-export-${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('CSV export completed');
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  useEffect(() => {
    if (conversations.length > 0) {
      console.log(`Filtering ${conversations.length} conversations for tab: ${activeTab}`);
      switch (activeTab) {
        case "active":
          setFilteredConversations(conversations.filter(c => c.status === 'active'));
          break;
        case "closed":
          setFilteredConversations(conversations.filter(c => c.status === 'closed'));
          break;
        case "vehicle":
          setFilteredConversations(conversations.filter(c => c.vehicle_id !== null));
          break;
        case "announcement":
          setFilteredConversations(conversations.filter(c => c.source_type === 'announcement'));
          break;
        case "exchange":
          setFilteredConversations(conversations.filter(c => c.source_type === 'exchange'));
          break;
        case "all":
        default:
          setFilteredConversations(conversations);
          break;
      }
    }
  }, [conversations, activeTab]);

  const columns: ColumnDef<Conversation>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => {
        const id = row.getValue('id');
        return (
          <div className="font-mono text-xs">
            {typeof id === 'string' ? id.substring(0, 8) + '...' : 'N/A'}
          </div>
        );
      }
    },
    {
      accessorKey: 'seller_id',
      header: t('messages.seller'),
      cell: ({ row }) => {
        const sellerId = row.getValue('seller_id') as string;
        return (
          <div className="font-mono text-xs">
            {sellerId ? sellerId.substring(0, 8) + '...' : 'N/A'}
          </div>
        );
      }
    },
    {
      accessorKey: 'buyer_id',
      header: t('messages.buyer'),
      cell: ({ row }) => {
        const buyerId = row.getValue('buyer_id') as string;
        return (
          <div className="font-mono text-xs">
            {buyerId ? buyerId.substring(0, 8) + '...' : 'N/A'}
          </div>
        );
      }
    },
    {
      accessorKey: 'vehicle_info',
      header: t('vehicles.vehicle'),
      cell: ({ row }) => {
        const vehicleInfo = row.getValue('vehicle_info') as { 
          brand?: string; 
          model?: string; 
          year?: string | number;
        } | undefined;
        
        return vehicleInfo && vehicleInfo.brand && vehicleInfo.model && vehicleInfo.year ? (
          `${vehicleInfo.brand} ${vehicleInfo.model} ${vehicleInfo.year}`
        ) : (
          <span className="text-muted-foreground">{t('common.notAvailable')}</span>
        );
      }
    },
    {
      accessorKey: 'status',
      header: t('common.status'),
      cell: ({ row }) => {
        const status = row.getValue('status');
        return (
          <Badge variant={status === 'active' 
            ? 'default' 
            : status === 'archived' 
              ? 'secondary' 
              : 'destructive'}
          >
            {status === 'active' ? t('common.active') : 
             status === 'archived' ? t('common.archived') : t('common.deleted')}
          </Badge>
        );
      }
    },
    {
      accessorKey: 'messages',
      header: t('messages.title'),
      cell: ({ row }) => {
        const conversationId = row.original.id;
        const messageCount = messageCounts?.[conversationId] || 0;
        return (
          <span className="font-medium">
            {messageCount}
          </span>
        );
      }
    },
    {
      accessorKey: 'updated_at',
      header: t('common.lastActivity'),
      cell: ({ row }) => {
        const updatedAt = row.getValue('updated_at');
        return typeof updatedAt === 'string' 
          ? formatDistance(new Date(updatedAt), new Date(), { addSuffix: true })
          : 'N/A';
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => {
            console.log(`Navigating to conversation detail: ${row.original.id}`);
            navigate(`/admin/conversations/${row.original.id}`);
          }}
        >
          <MessageSquare className="h-4 w-4" />
          <span className="sr-only">{t('common.view')}</span>
        </Button>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando conversaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with navigation */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/control-panel">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Panel de Control
              </Link>
            </Button>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Gestión de Conversaciones</h2>
          <p className="text-muted-foreground">
            Monitorea y gestiona todas las conversaciones del sistema
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV} disabled={!filteredConversations.length}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          <Button variant="outline" asChild>
            <Link to="/admin/analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Ver Analytics
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {conversationStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Conversaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conversationStats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Conversaciones Activas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conversationStats.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Nuevas (7 días)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conversationStats.new}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Lista de Conversaciones</CardTitle>
          <CardDescription>
            Total: {conversations.length} conversaciones encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4 grid grid-cols-2 lg:grid-cols-6 w-full">
              <TabsTrigger value="all">
                Todas ({conversations.length})
              </TabsTrigger>
              <TabsTrigger value="active">
                Activas ({conversations.filter(c => c.status === 'active').length})
              </TabsTrigger>
              <TabsTrigger value="closed">
                Cerradas ({conversations.filter(c => c.status === 'closed').length})
              </TabsTrigger>
              <TabsTrigger value="vehicle">
                Vehículos ({conversations.filter(c => c.vehicle_id !== null).length})
              </TabsTrigger>
              <TabsTrigger value="announcement">
                Anuncios ({conversations.filter(c => c.source_type === 'announcement').length})
              </TabsTrigger>
              <TabsTrigger value="exchange">
                Intercambios ({conversations.filter(c => c.source_type === 'exchange').length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="pt-2">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-8">
                  <p>No se encontraron conversaciones para este filtro</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <DataTable columns={columns} data={filteredConversations} />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConversationsAdminPage;
