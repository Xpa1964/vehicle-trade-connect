import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle2, Clock } from 'lucide-react';

interface AnnouncementStatusSelectorProps {
  announcementId: string;
  currentStatus: string;
  onStatusUpdate: () => void;
  t: (key: string, params?: Record<string, string | number | undefined>) => string;
}

const AnnouncementStatusSelector: React.FC<AnnouncementStatusSelectorProps> = ({
  announcementId,
  currentStatus,
  onStatusUpdate,
  t
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const { toast } = useToast();

  const handleStatusUpdate = async () => {
    if (selectedStatus === currentStatus) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('announcements')
        .update({
          status: selectedStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', announcementId);

      if (error) throw error;

      toast({
        title: 'Estado actualizado',
        description: `El anuncio se ha marcado como ${selectedStatus === 'active' ? 'activo' : 'finalizado'}.`,
        variant: "default",
      });

      onStatusUpdate();
    } catch (error) {
      console.error('Error updating announcement status:', error);
      toast({
        title: 'Error al actualizar',
        description: 'No se pudo actualizar el estado del anuncio.',
        variant: "destructive",
      });
      setSelectedStatus(currentStatus); // Revert selection
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              {t('bulletin.statusActive')}
            </div>
          </SelectItem>
          <SelectItem value="finished">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-600" />
              {t('bulletin.statusFinished')}
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
      
      {selectedStatus !== currentStatus && (
        <Button 
          size="sm" 
          onClick={handleStatusUpdate}
          disabled={isUpdating}
        >
          {isUpdating ? 'Actualizando...' : 'Actualizar'}
        </Button>
      )}
    </div>
  );
};

export default AnnouncementStatusSelector;