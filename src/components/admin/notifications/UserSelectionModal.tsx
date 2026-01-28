import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Users, CheckCircle } from 'lucide-react';
import { massNotificationService } from '@/services/notifications/massNotifications';

interface UserSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedUserIds: string[]) => void;
  initialSelectedIds?: string[];
}

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  company_name?: string;
  country?: string;
}

export const UserSelectionModal: React.FC<UserSelectionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialSelectedIds = []
}) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set(initialSelectedIds));
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadUsers();
      setSelectedUserIds(new Set(initialSelectedIds));
    }
  }, [isOpen, initialSelectedIds]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredUsers(
        users.filter(
          (user) =>
            user.full_name?.toLowerCase().includes(term) ||
            user.email?.toLowerCase().includes(term) ||
            user.company_name?.toLowerCase().includes(term) ||
            user.country?.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, users]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const allUsers = await massNotificationService.getUserProfiles('all');
      setUsers(allUsers);
      setFilteredUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleUser = (userId: string) => {
    const newSelected = new Set(selectedUserIds);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUserIds(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedUserIds.size === filteredUsers.length) {
      setSelectedUserIds(new Set());
    } else {
      setSelectedUserIds(new Set(filteredUsers.map((u) => u.id)));
    }
  };

  const handleConfirm = () => {
    onConfirm(Array.from(selectedUserIds));
    onClose();
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) {
          onConfirm(Array.from(selectedUserIds));
        }
        onClose();
      }}
    >
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Seleccionar Usuarios Manualmente
          </DialogTitle>
          <DialogDescription>
            Selecciona los usuarios específicos que recibirán esta notificación
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email, empresa o país..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={handleSelectAll}
              disabled={filteredUsers.length === 0}
            >
              {selectedUserIds.size === filteredUsers.length ? 'Deseleccionar' : 'Seleccionar'} Todos
            </Button>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{filteredUsers.length} usuarios encontrados</span>
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              {selectedUserIds.size} seleccionados
            </span>
          </div>

          <ScrollArea className="h-[400px] border rounded-lg">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">Cargando usuarios...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">No se encontraron usuarios</p>
              </div>
            ) : (
              <div className="space-y-1 p-4">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => handleToggleUser(user.id)}
                  >
                    <Checkbox
                      checked={selectedUserIds.has(user.id)}
                      onCheckedChange={() => handleToggleUser(user.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{user.full_name || 'Sin nombre'}</p>
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                      <div className="flex gap-2 mt-1">
                        {user.company_name && (
                          <span className="text-xs bg-secondary px-2 py-0.5 rounded">
                            {user.company_name}
                          </span>
                        )}
                        {user.country && (
                          <span className="text-xs bg-secondary px-2 py-0.5 rounded">
                            {user.country}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={selectedUserIds.size === 0}
            >
              Confirmar ({selectedUserIds.size} usuarios)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
