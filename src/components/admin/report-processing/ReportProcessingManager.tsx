import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, CheckCircle, DollarSign, ThumbsUp } from 'lucide-react';
import ReportProcessCard from './ReportProcessCard';
import ReportInfoPanel from './ReportInfoPanel';

const ReportProcessingManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pending');

  const { data: requests, isLoading, refetch } = useQuery({
    queryKey: ['admin-report-processing'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('vehicle_report_requests')
        .select(`
          *,
          profiles (
            full_name,
            company_name,
            email,
            contact_phone
          )
        `)
        .in('status', ['pending', 'budgeted', 'budget_accepted', 'budget_rejected', 'in_process', 'delivered'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const pendingRequests = requests?.filter(r => r.status === 'pending') || [];
  const budgetedRequests = requests?.filter(r => r.status === 'budgeted') || [];
  const acceptedRequests = requests?.filter(r => r.status === 'budget_accepted') || [];
  const inProcessRequests = requests?.filter(r => r.status === 'in_process') || [];
  const deliveredRequests = requests?.filter(r => r.status === 'delivered') || [];

  const stats = [
    {
      title: 'Pendientes',
      value: pendingRequests.length,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Presupuestados',
      value: budgetedRequests.length,
      icon: DollarSign,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Aceptados',
      value: acceptedRequests.length,
      icon: ThumbsUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'En Proceso',
      value: inProcessRequests.length,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Completados',
      value: deliveredRequests.length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Procesamiento de Informes
        </h1>
        <p className="text-muted-foreground">
          Gestiona el proceso de generación y entrega de informes vehiculares
        </p>
      </div>

      <ReportInfoPanel />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="pending">
            Pendientes
            {pendingRequests.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {pendingRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="budgeted">
            Presupuestados
            {budgetedRequests.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {budgetedRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="accepted">
            Aceptados
            {acceptedRequests.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {acceptedRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="in_process">
            En Proceso
            {inProcessRequests.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {inProcessRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="delivered">
            Completados
            {deliveredRequests.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {deliveredRequests.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="py-8 text-center">
                Cargando solicitudes...
              </CardContent>
            </Card>
          ) : pendingRequests.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No hay solicitudes pendientes
              </CardContent>
            </Card>
          ) : (
            pendingRequests.map((request) => (
              <ReportProcessCard key={request.id} request={request} onUpdate={refetch} />
            ))
          )}
        </TabsContent>

        <TabsContent value="budgeted" className="space-y-4">
          {budgetedRequests.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No hay solicitudes presupuestadas
              </CardContent>
            </Card>
          ) : (
            budgetedRequests.map((request) => (
              <ReportProcessCard key={request.id} request={request} onUpdate={refetch} />
            ))
          )}
        </TabsContent>

        <TabsContent value="accepted" className="space-y-4">
          {acceptedRequests.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No hay presupuestos aceptados
              </CardContent>
            </Card>
          ) : (
            acceptedRequests.map((request) => (
              <ReportProcessCard key={request.id} request={request} onUpdate={refetch} />
            ))
          )}
        </TabsContent>

        <TabsContent value="in_process" className="space-y-4">
          {inProcessRequests.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No hay informes en proceso
              </CardContent>
            </Card>
          ) : (
            inProcessRequests.map((request) => (
              <ReportProcessCard key={request.id} request={request} onUpdate={refetch} />
            ))
          )}
        </TabsContent>

        <TabsContent value="delivered" className="space-y-4">
          {deliveredRequests.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No hay informes completados
              </CardContent>
            </Card>
          ) : (
            deliveredRequests.map((request) => (
              <ReportProcessCard key={request.id} request={request} onUpdate={refetch} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportProcessingManager;
