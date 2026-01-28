import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import PaymentCard from './PaymentCard';

const ReportPaymentsManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pending');

  const { data: payments, isLoading, refetch } = useQuery({
    queryKey: ['admin-report-payments'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('report_payments')
        .select(`
          *,
          report_requests (
            id,
            vehicle_id,
            report_type,
            status
          ),
          profiles (
            full_name,
            company_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const pendingPayments = payments?.filter(p => p.status === 'pending') || [];
  const approvedPayments = payments?.filter(p => p.status === 'approved') || [];
  const rejectedPayments = payments?.filter(p => p.status === 'rejected') || [];

  const stats = [
    {
      title: 'Pendientes',
      value: pendingPayments.length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Aprobados',
      value: approvedPayments.length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Rechazados',
      value: rejectedPayments.length,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Total Procesado',
      value: `€${(approvedPayments.reduce((acc, p) => acc + (p.amount || 0), 0)).toFixed(2)}`,
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Gestión de Pagos de Informes
        </h1>
        <p className="text-muted-foreground">
          Administra y verifica los pagos de informes vehiculares
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pendientes
            {pendingPayments.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {pendingPayments.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Aprobados</TabsTrigger>
          <TabsTrigger value="rejected">Rechazados</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="py-8 text-center">
                Cargando pagos...
              </CardContent>
            </Card>
          ) : pendingPayments.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No hay pagos pendientes de verificación
              </CardContent>
            </Card>
          ) : (
            pendingPayments.map((payment) => (
              <PaymentCard key={payment.id} payment={payment} onUpdate={refetch} />
            ))
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedPayments.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No hay pagos aprobados
              </CardContent>
            </Card>
          ) : (
            approvedPayments.map((payment) => (
              <PaymentCard key={payment.id} payment={payment} onUpdate={refetch} />
            ))
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {rejectedPayments.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No hay pagos rechazados
              </CardContent>
            </Card>
          ) : (
            rejectedPayments.map((payment) => (
              <PaymentCard key={payment.id} payment={payment} onUpdate={refetch} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportPaymentsManager;
