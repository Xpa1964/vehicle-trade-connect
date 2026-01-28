
import { AlertCircle, RefreshCw, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface ErrorStateProps {
  error: Error | null;
  onRetry: () => void;
}

export const ErrorState = ({ error, onRetry }: ErrorStateProps) => {
  // Parse error message for more details
  let errorMessage = error instanceof Error ? error.message : 'Error desconocido';
  let detailedMessage = '';
  let isPermissionError = false;
  let additionalInfo = {};
  
  // Check if this is an enhanced error with additionalInfo
  if (error && (error as any).additionalInfo) {
    additionalInfo = (error as any).additionalInfo;
  }
  
  // Check if this is a permission error
  if ((error as any)?.isPermissionError || 
      errorMessage.toLowerCase().includes('admin privileges required') || 
      errorMessage.toLowerCase().includes('permission denied') ||
      errorMessage.toLowerCase().includes('not authorized') ||
      errorMessage.toLowerCase().includes('forbidden')) {
    detailedMessage = 'No tienes permisos de administrador para ver las solicitudes de registro. Por favor, contacta con el administrador del sistema para verificar tus permisos.';
    isPermissionError = true;
  }
  
  return (
    <div className="container mx-auto p-6">
      <div className="mt-6">
        <Card className="mt-4 border-destructive">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-destructive">
              {isPermissionError ? (
                <>
                  <ShieldAlert className="h-5 w-5" />
                  Error de permisos
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5" />
                  Error al cargar solicitudes
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Hubo un problema al cargar las solicitudes de registro. Por favor, intenta de nuevo.</p>
            <p className="text-sm text-muted-foreground mt-2">{errorMessage}</p>
            
            {detailedMessage && (
              <p className="text-sm mt-3 p-3 bg-muted rounded-md">{detailedMessage}</p>
            )}
            
            {isPermissionError && (
              <div className="mt-3 p-3 bg-amber-50 text-amber-900 rounded-md">
                <p className="text-sm font-medium">Posibles soluciones:</p>
                <ul className="text-sm list-disc list-inside mt-1">
                  <li>Verifica que tu cuenta tenga el rol de administrador</li>
                  <li>Cierra sesión y vuelve a iniciar sesión</li>
                  <li>Contacta al administrador del sistema para solicitar acceso</li>
                </ul>
              </div>
            )}

            {additionalInfo && Object.keys(additionalInfo).length > 0 && (
              <div className="mt-3 p-3 bg-slate-100 text-slate-900 rounded-md">
                <p className="text-sm font-medium">Información de diagnóstico:</p>
                <pre className="text-xs mt-1 overflow-x-auto">
                  {JSON.stringify(additionalInfo, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={onRetry} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Intentar de nuevo
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
