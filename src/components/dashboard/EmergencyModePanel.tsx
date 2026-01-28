
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const EmergencyModePanel: React.FC = () => {
  const navigate = useNavigate();
  
  const handleDirectAccess = () => {
    console.log('Attempting direct navigation to admin panel...');
    navigate('/admin/dashboard');
  };
  
  const handleClearRoleCache = () => {
    console.log('Clearing all role cache from localStorage...');
    let clearedItems = 0;
    
    // Clear all role-related cache from localStorage
    for (const key in localStorage) {
      if (key.startsWith('user_role_')) {
        localStorage.removeItem(key);
        clearedItems++;
      }
    }
    
    toast.success(`Caché de roles limpiada (${clearedItems} elementos)`);
  };
  
  const handleForceLogout = () => {
    console.log('Force logging out and reloading page...');
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="mt-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
      <h3 className="font-bold text-blue-800 mb-2">Opciones avanzadas</h3>
      
      <div className="space-y-2">
        <p className="text-sm text-blue-700">Si sigues teniendo problemas para ver tu rol correcto, prueba estas opciones:</p>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline"
            size="sm"
            className="border-blue-500 text-blue-700"
            onClick={handleDirectAccess}
          >
            Acceso directo a Admin Panel
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={handleClearRoleCache}
          >
            Limpiar toda la caché de roles
          </Button>
          
          <Button 
            variant="destructive"
            size="sm"
            onClick={handleForceLogout}
          >
            Cerrar sesión forzado
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyModePanel;
