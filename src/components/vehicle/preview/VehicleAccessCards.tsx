
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, FileText } from 'lucide-react';

interface VehicleAccessCardsProps {
  damagesCount: number;
  documentsCount: number;
  onDamagesClick?: () => void;
  onDocumentsClick?: () => void;
}

const VehicleAccessCards: React.FC<VehicleAccessCardsProps> = ({
  damagesCount,
  documentsCount,
  onDamagesClick,
  onDocumentsClick
}) => {
  return (
    <div className="space-y-4">
      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={onDamagesClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span className="font-medium">Daños</span>
            </div>
            <Badge variant="secondary" className="px-2 py-1">
              {damagesCount}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={onDocumentsClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-blue-500" />
              <span className="font-medium">Archivos</span>
            </div>
            <Badge variant="secondary" className="px-2 py-1">
              {documentsCount}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleAccessCards;
