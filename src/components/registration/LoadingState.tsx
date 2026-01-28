
import { Loader2 } from 'lucide-react';

export const LoadingState = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Cargando solicitudes...</p>
      </div>
    </div>
  );
};
