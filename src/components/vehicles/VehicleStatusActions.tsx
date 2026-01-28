import { Button } from '@/components/ui/button';
import { BookmarkIcon, CheckCircle2Icon, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from 'react';

interface VehicleStatusActionsProps {
  vehicleId: string;
  currentStatus?: string;
  onStatusChange: (status: 'reserved' | 'sold' | 'available') => void;
  isPending?: boolean;
}

export const VehicleStatusActions = ({ 
  vehicleId, 
  currentStatus = 'available',
  onStatusChange,
  isPending = false
}: VehicleStatusActionsProps) => {
  const { t } = useLanguage();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<'reserved' | 'sold' | 'available' | null>(null);

  const handleStatusClick = (status: 'reserved' | 'sold' | 'available') => {
    setSelectedStatus(status);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    if (selectedStatus) {
      onStatusChange(selectedStatus);
    }
    setShowConfirm(false);
    setSelectedStatus(null);
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setSelectedStatus(null);
  };

  const statusText = selectedStatus === 'reserved' 
    ? t('vehicles.statusActions.reserved') 
    : selectedStatus === 'sold'
    ? t('vehicles.statusActions.sold')
    : t('vehicles.statusActions.available');

  return (
    <>
      {currentStatus === 'available' && (
        <>
          <Button
            variant="outline"
            className="flex-1 min-w-[100px] text-xs border-2 border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-950 text-yellow-700 dark:text-yellow-400"
            onClick={() => handleStatusClick('reserved')}
            disabled={isPending}
          >
            <BookmarkIcon className="h-3 w-3 mr-1" />
            {t('vehicles.statusActions.reserved')}
          </Button>
          
          <Button
            variant="outline"
            className="flex-1 min-w-[100px] text-xs border-2 border-green-500 hover:bg-green-50 dark:hover:bg-green-950 text-green-700 dark:text-green-400"
            onClick={() => handleStatusClick('sold')}
            disabled={isPending}
          >
            <CheckCircle2Icon className="h-3 w-3 mr-1" />
            {t('vehicles.statusActions.sold')}
          </Button>
        </>
      )}

      {(currentStatus === 'reserved' || currentStatus === 'sold') && (
        <Button
          variant="outline"
          className="flex-1 min-w-[120px] text-xs border-2 border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 text-blue-700 dark:text-blue-400"
          onClick={() => handleStatusClick('available')}
          disabled={isPending}
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          {currentStatus === 'reserved' ? t('vehicles.statusActions.release') : t('vehicles.statusActions.reactivate')}
        </Button>
      )}

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('vehicles.statusActions.confirmTitle', { status: statusText })}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('vehicles.statusActions.confirmDescription', { status: statusText })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              {t('common.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
