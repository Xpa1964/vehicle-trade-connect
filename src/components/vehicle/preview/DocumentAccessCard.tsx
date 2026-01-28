
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DocumentAccessCardProps {
  vehicleId: string;
}

const DocumentAccessCard: React.FC<DocumentAccessCardProps> = ({
  vehicleId
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Query para obtener el número real de documentos
  const { data: documentsCount = 0 } = useQuery({
    queryKey: ['vehicle-documents-count', vehicleId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('vehicle_documents')
        .select('*', { count: 'exact', head: true })
        .eq('vehicle_id', vehicleId);
      
      if (error) {
        console.error('Error fetching documents count:', error);
        return 0;
      }
      
      return count || 0;
    }
  });

  const handleDocumentsClick = () => {
    navigate(`/vehicle/${vehicleId}/files`);
  };

  return (
    <Card 
      className="cursor-pointer bg-card border-border hover:border-primary/30 transition-colors"
      onClick={handleDocumentsClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-[#0EA5E9]" />
            <span className="font-medium text-foreground">Archivos</span>
          </div>
          <Badge variant="secondary" className="px-2 py-1 bg-secondary text-foreground">
            {documentsCount}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Acceso a archivos adicionales
        </p>
      </CardContent>
    </Card>
  );
};

export default DocumentAccessCard;
