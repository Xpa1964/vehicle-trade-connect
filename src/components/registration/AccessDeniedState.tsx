
import { AlertCircle, ShieldAlert, RefreshCw, Code } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export const AccessDeniedState = () => {
  const { handleRoleReload, isReloading, currentRole } = useUserRole();
  const { user } = useAuth();
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  
  // Prepare diagnostic data about the current user and permissions
  const diagnosticData = {
    userId: user?.id || 'No disponible',
    email: user?.email || 'No disponible',
    role: currentRole || 'No asignado',
    metadata: user?.profile || {},
    permissions: user?.permissions || [],
    authStatus: {
      isAuthenticated: !!user,
      hasId: !!user?.id,
      hasEmail: !!user?.email,
      hasRole: !!currentRole
    }
  };
  
  // Handle click to verify role directly with Supabase
  const handleVerifyRoleViaAPI = async () => {
    try {
      // Get the current session for the token
      const { data: sessionData } = await fetch('/auth/v1/token?grant_type=refresh_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlucXFuc3ZsaW10cGp4anh1emFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMDIyNzksImV4cCI6MjA2MDU3ODI3OX0.crFcbhfMi7w9BxpBHbzRMSfuvzmUZY1B_MS8r8gucfw'
        },
      }).then(r => r.json());
      
      console.log('API role verification result:', sessionData);
      
      // Now trigger the role reload
      handleRoleReload();
    } catch (error) {
      console.error('Error verifying role via API:', error);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-destructive" />
            Acceso Denegado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>No tienes permisos para gestionar solicitudes de registro.</p>
          <div className="p-3 bg-muted rounded-md space-y-1">
            <p className="text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Este módulo requiere permisos de administrador.
            </p>
            <p className="text-sm">Tu rol actual: <span className="font-medium">{currentRole || 'Usuario'}</span></p>
            <p className="text-sm">ID de usuario: <span className="font-medium">{user?.id || 'No disponible'}</span></p>
            <p className="text-sm">Email: <span className="font-medium">{user?.email || 'No disponible'}</span></p>
          </div>
          
          <div className="p-3 bg-amber-50 text-amber-900 rounded-md">
            <p className="text-sm font-medium">Posibles soluciones:</p>
            <ul className="text-sm list-disc list-inside mt-1">
              <li>Verifica que tu cuenta tenga el rol de administrador en la tabla user_roles</li>
              <li>Cierra sesión y vuelve a iniciar sesión</li>
              <li>Contacta al administrador del sistema para solicitar acceso</li>
              <li>Comprueba que el valor de role en la tabla user_roles es exactamente 'admin' (tipo texto)</li>
            </ul>
          </div>

          {showDiagnostics && (
            <div className="p-3 border border-slate-300 bg-slate-50 rounded-md mt-4">
              <p className="text-sm font-medium flex items-center gap-2 mb-2">
                <Code className="h-4 w-4" />
                Información de diagnóstico
              </p>
              <pre className="text-xs overflow-auto bg-slate-100 p-2 rounded max-h-40">
                {JSON.stringify(diagnosticData, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button 
            onClick={handleRoleReload} 
            disabled={isReloading}
            variant="default"
            className="w-full flex items-center justify-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isReloading ? 'animate-spin' : ''}`} />
            {isReloading ? 'Recargando...' : 'Recargar permisos'}
          </Button>
          
          <Button
            onClick={() => setShowDiagnostics(!showDiagnostics)}
            variant="outline"
            className="w-full mt-1"
          >
            {showDiagnostics ? 'Ocultar diagnósticos' : 'Mostrar diagnósticos'}
          </Button>
          
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Si el problema persiste, verifica que tu usuario tenga asignado el rol de administrador en la base de datos 
            y que el valor de la columna 'role' sea exactamente 'admin'.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
