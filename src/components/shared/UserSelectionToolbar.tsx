
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MessageSquare, 
  X, 
  CheckSquare, 
  Square
} from 'lucide-react';

interface UserSelectionToolbarProps {
  selectedCount: number;
  totalCount: number;
  isAllSelected: boolean;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onSendMessage: () => void;
  className?: string;
}

const UserSelectionToolbar: React.FC<UserSelectionToolbarProps> = ({
  selectedCount,
  totalCount,
  isAllSelected,
  onSelectAll,
  onClearSelection,
  onSendMessage,
  className = ''
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 ${className}`}>
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 flex items-center gap-3">
        <Badge variant="secondary" className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          {selectedCount} seleccionados
        </Badge>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={isAllSelected ? onClearSelection : onSelectAll}
            className="flex items-center gap-1"
          >
            {isAllSelected ? (
              <>
                <Square className="h-3 w-3" />
                Deseleccionar todo
              </>
            ) : (
              <>
                <CheckSquare className="h-3 w-3" />
                Seleccionar todo ({totalCount})
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onClearSelection}
            className="flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            Limpiar
          </Button>

          <Button
            onClick={onSendMessage}
            size="sm"
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700"
          >
            <MessageSquare className="h-3 w-3" />
            Enviar Mensaje
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserSelectionToolbar;
