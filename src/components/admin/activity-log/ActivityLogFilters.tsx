
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityLogFiltersProps {
  filters: {
    actionType?: string;
    entityType?: string;
    userId?: string;
    dateFrom?: Date | null;
    dateTo?: Date | null;
    severity?: string;
  };
  activityTypes: string[];
  entityTypes: string[];
  users: Array<{ id: string; name: string }>;
  onFilterChange: (filters: any) => void;
  onResetFilters: () => void;
}

const ActivityLogFilters: React.FC<ActivityLogFiltersProps> = ({
  filters,
  activityTypes,
  entityTypes,
  users,
  onFilterChange,
  onResetFilters
}) => {
  const { t } = useLanguage();
  const severityOptions = ['info', 'success', 'warning', 'error'];

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{t('admin.activityLog.filters.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Action Type Filter */}
          <div className="space-y-2">
            <Label htmlFor="actionType">{t('admin.activityLog.filters.type')}</Label>
            <Select
              value={filters.actionType || ''}
              onValueChange={(value) => onFilterChange({ actionType: value || undefined })}
            >
              <SelectTrigger id="actionType">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {activityTypes?.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Entity Type Filter */}
          <div className="space-y-2">
            <Label htmlFor="entityType">{t('admin.activityLog.filters.entity')}</Label>
            <Select
              value={filters.entityType || ''}
              onValueChange={(value) => onFilterChange({ entityType: value || undefined })}
            >
              <SelectTrigger id="entityType">
                <SelectValue placeholder="All entities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All entities</SelectItem>
                {entityTypes?.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* User Filter */}
          <div className="space-y-2">
            <Label htmlFor="userId">{t('admin.activityLog.filters.user')}</Label>
            <Select
              value={filters.userId || ''}
              onValueChange={(value) => onFilterChange({ userId: value || undefined })}
            >
              <SelectTrigger id="userId">
                <SelectValue placeholder="All users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All users</SelectItem>
                {users?.map((user) => (
                  <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Date From Filter */}
          <div className="space-y-2">
            <Label>{t('admin.activityLog.filters.date')} (From)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.dateFrom && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateFrom ? format(filters.dateFrom, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.dateFrom || undefined}
                  onSelect={(date) => onFilterChange({ dateFrom: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Date To Filter */}
          <div className="space-y-2">
            <Label>{t('admin.activityLog.filters.date')} (To)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.dateTo && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateTo ? format(filters.dateTo, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.dateTo || undefined}
                  onSelect={(date) => onFilterChange({ dateTo: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Severity Filter */}
          <div className="space-y-2">
            <Label htmlFor="severity">{t('admin.activityLog.filters.severity')}</Label>
            <Select
              value={filters.severity || ''}
              onValueChange={(value) => onFilterChange({ severity: value || undefined })}
            >
              <SelectTrigger id="severity">
                <SelectValue placeholder="All severities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All severities</SelectItem>
                {severityOptions.map((severity) => (
                  <SelectItem key={severity} value={severity}>{severity}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={onResetFilters}>
            {t('admin.activityLog.filters.reset')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityLogFilters;
