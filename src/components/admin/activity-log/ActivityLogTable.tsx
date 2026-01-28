
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
        return 'bg-primary/10 text-primary hover:bg-primary/20';
      case 'success':
        return 'bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E]/20';
      case 'warning':
        return 'bg-amber-400/10 text-amber-400 hover:bg-amber-400/20';
      case 'error':
        return 'bg-destructive/10 text-destructive hover:bg-destructive/20';
      default:
        return 'bg-secondary text-foreground hover:bg-secondary/80';
    }
  };

  if (isLoading) {
    return (
      <div className="border border-border rounded-md">
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
      <div className="text-center p-12 border border-border rounded-md bg-secondary">
        <p className="text-muted-foreground">{t('admin.activityLog.noResults')}</p>
      </div>
    );
  }

  return (
    <>
      <div className="border border-border rounded-md overflow-hidden">
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
                <TableCell className="font-medium whitespace-nowrap text-foreground">
                  {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm:ss')}
                </TableCell>
                <TableCell className="max-w-[150px] truncate text-foreground">
                  {log.user_id ? log.user_id.substring(0, 8) + '...' : 'System'}
                </TableCell>
                <TableCell className="text-foreground">{log.action_type}</TableCell>
                <TableCell className="text-foreground">
                  {log.entity_type ? (
                    <span>
                      {log.entity_type}
                      {log.entity_id && <span className="text-xs text-muted-foreground ml-1">({log.entity_id.substring(0, 6)}...)</span>}
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
            <DialogTitle className="text-foreground">Activity Details</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Timestamp</p>
                  <p className="text-foreground">{format(new Date(selectedLog.created_at), 'PPP HH:mm:ss')}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">User</p>
                  <p className="text-foreground">{selectedLog.user_id || 'System'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Action</p>
                  <p className="text-foreground">{selectedLog.action_type}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Entity Type</p>
                  <p className="text-foreground">{selectedLog.entity_type || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Entity ID</p>
                  <p className="text-foreground">{selectedLog.entity_id || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Severity</p>
                  <Badge className={getSeverityColor(selectedLog.severity)}>
                    {selectedLog.severity}
                  </Badge>
                </div>
              </div>
              
              {selectedLog.details && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Details</p>
                  <pre className="bg-secondary p-4 rounded-md overflow-auto text-xs text-foreground">
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
