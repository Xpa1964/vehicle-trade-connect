
import React from 'react';
import { Users, Car, MessageSquare, DollarSign } from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import { AdminStats } from '@/hooks/useAdminStatistics';

interface AdminStatsSummaryProps {
  stats: AdminStats;
  isLoading: boolean;
}

const AdminStatsSummary: React.FC<AdminStatsSummaryProps> = ({ stats, isLoading }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <StatsCard
        title="Total Usuarios"
        value={stats.users.total}
        description={`${stats.users.growthRate}% crecimiento último mes`}
        icon={Users}
        isLoading={isLoading}
      />
      <StatsCard
        title="Vehículos Activos"
        value={stats.vehicles.total}
        description={`${stats.vehicles.recentlyAdded} añadidos recientemente`}
        icon={Car}
        isLoading={isLoading}
      />
      <StatsCard
        title="Conversaciones"
        value={stats.conversations.active}
        description={`${stats.conversations.newLastWeek} nuevas esta semana`}
        icon={MessageSquare}
        isLoading={isLoading}
      />
      <StatsCard
        title="Transacciones Potenciales"
        value={stats.transactions.potential}
        description={`${stats.transactions.completed} completadas`}
        icon={DollarSign}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AdminStatsSummary;
