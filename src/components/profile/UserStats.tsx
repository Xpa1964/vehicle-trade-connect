
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, TrendingUp, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface OperationsBreakdown {
  buys: number;
  sells: number;
  exchanges: number;
  total: number;
}

interface UserStatsProps {
  totalOperations: number;
  operationsBreakdown: OperationsBreakdown;
  registrationDate: string;
  traderType: string;
}

const UserStats: React.FC<UserStatsProps> = ({
  totalOperations,
  operationsBreakdown,
  registrationDate,
  traderType,
}) => {
  const { t } = useLanguage();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t('profile.traderType')}
          </CardTitle>
          <User className="h-4 w-4 text-auto-blue" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{t(`traderType.${traderType}`)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t('profile.totalOperations')}
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-auto-blue" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalOperations}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {t('profile.purchases')}: {operationsBreakdown.buys} | {t('profile.sales')}: {operationsBreakdown.sells}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t('profile.memberSince')}
          </CardTitle>
          <Calendar className="h-4 w-4 text-auto-blue" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatDate(registrationDate)}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserStats;
