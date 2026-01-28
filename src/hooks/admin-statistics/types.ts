
export interface AdminStatistic {
  label: string;
  value: number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  changeLabel?: string;
  icon?: React.ReactNode;
}

export interface AdminStats {
  users: {
    total: number;
    growthRate: number;
  };
  vehicles: {
    total: number;
    recentlyAdded: number;
  };
  conversations: {
    active: number;
    newLastWeek: number;
  };
  transactions: {
    potential: number;
    completed: number;
  };
}

export type AdminStatisticsList = AdminStatistic[];

export interface RecentActivity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'user_signup' | 'vehicle_added' | 'conversation' | 'alert';
  severity?: 'warning' | 'alert';
}

export interface PermissionItem {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
}
