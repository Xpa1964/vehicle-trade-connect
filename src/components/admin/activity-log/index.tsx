
import React from 'react';
import ActivityLogHeader from './ActivityLogHeader';
import ActivityLogFilters from './ActivityLogFilters';
import ActivityLogTable from './ActivityLogTable';
import ActivityLogPagination from './ActivityLogPagination';
import { useActivityLogs } from '@/hooks/useActivityLogs';

const ActivityLogManager: React.FC = () => {
  const {
    logs,
    totalLogs,
    isLoading,
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    activityTypes,
    entityTypes,
    users,
    exportLogs,
    canViewLogs
  } = useActivityLogs();

  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
    // Reset to first page when filters change
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  if (!canViewLogs) {
    return (
      <div className="text-center p-12">
        <h2 className="text-xl font-medium">No tienes permisos para ver el registro de actividades</h2>
        <p className="text-muted-foreground mt-2">Contacta con un administrador si necesitas acceso.</p>
      </div>
    );
  }

  return (
    <div>
      <ActivityLogHeader 
        totalLogs={totalLogs} 
        onExport={exportLogs} 
        canExport={canViewLogs && logs.length > 0}
      />
      
      <ActivityLogFilters
        filters={filters}
        activityTypes={activityTypes || []}
        entityTypes={entityTypes || []}
        users={users || []}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />
      
      <ActivityLogTable logs={logs} isLoading={isLoading} />
      
      <ActivityLogPagination
        currentPage={currentPage}
        totalItems={totalLogs}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
};

export default ActivityLogManager;
