
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ActivityLog } from '@/hooks/useActivityLogs';
import { Skeleton } from '@/components/ui/skeleton';

interface ActivityLogTableProps {
  logs: ActivityLog[];
  isLoading: boolean;
}

const ActivityLogTable: React.FC<ActivityLogTableProps> = ({ logs, isLoading }) => {
  const { t } = useLanguage();
  const [selectedLog, setSelectedLog] = React.useState<ActivityLog | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'success':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="border rounded-md">
        <div className="p-4">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="grid grid-cols-12 gap-4">
                <Skeleton className="h-6 col-span-2" />
                <Skeleton className="h-6 col-span-2" />
                <Skeleton className="h-6 col-span-2" />
                <Skeleton className="h-6 col-span-2" />
                <Skeleton className="h-6 col-span-2" />
                <Skeleton className="h-6 col-span-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="text-center p-12 border rounded-md bg-gray-50">
        <p className="text-muted-foreground">{t('admin.activityLog.noResults')}</p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('admin.activityLog.table.timestamp')}</TableHead>
              <TableHead>{t('admin.activityLog.table.user')}</TableHead>
              <TableHead>{t('admin.activityLog.table.action')}</TableHead>
              <TableHead>{t('admin.activityLog.table.entity')}</TableHead>
              <TableHead>{t('admin.activityLog.table.severity')}</TableHead>
              <TableHead className="text-right">{t('admin.activityLog.table.details')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium whitespace-nowrap">
                  {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm:ss')}
                </TableCell>
                <TableCell className="max-w-[150px] truncate">
                  {log.user_id ? log.user_id.substring(0, 8) + '...' : 'System'}
                </TableCell>
                <TableCell>{log.action_type}</TableCell>
                <TableCell>
                  {log.entity_type ? (
                    <span>
                      {log.entity_type}
                      {log.entity_id && <span className="text-xs text-gray-500 ml-1">({log.entity_id.substring(0, 6)}...)</span>}
                    </span>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={getSeverityColor(log.severity)}>
                    {log.severity}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedLog(log)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    {t('admin.activityLog.viewDetails')}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Activity Details</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Timestamp</p>
                  <p>{format(new Date(selectedLog.created_at), 'PPP HH:mm:ss')}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">User</p>
                  <p>{selectedLog.user_id || 'System'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Action</p>
                  <p>{selectedLog.action_type}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Entity Type</p>
                  <p>{selectedLog.entity_type || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Entity ID</p>
                  <p>{selectedLog.entity_id || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Severity</p>
                  <Badge className={getSeverityColor(selectedLog.severity)}>
                    {selectedLog.severity}
                  </Badge>
                </div>
              </div>
              
              {selectedLog.details && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Details</p>
                  <pre className="bg-gray-50 p-4 rounded-md overflow-auto text-xs">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ActivityLogTable;
