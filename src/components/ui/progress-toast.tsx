import { toast } from 'sonner';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export const showProgressToast = {
  loading: (message: string, id?: string) => {
    return toast.loading(
      <div className="flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
        <div>
          <p className="font-medium">{message}</p>
          <p className="text-xs text-muted-foreground">Esto puede tomar unos segundos...</p>
        </div>
      </div>,
      { id, duration: Infinity }
    );
  },
  
  success: (message: string, id: string | number) => {
    toast.success(
      <div className="flex items-center gap-3">
        <CheckCircle2 className="h-5 w-5 text-green-600" />
        <p className="font-medium">{message}</p>
      </div>,
      { id }
    );
  },
  
  error: (message: string, id: string | number) => {
    toast.error(
      <div className="flex items-center gap-3">
        <XCircle className="h-5 w-5 text-red-600" />
        <p className="font-medium">{message}</p>
      </div>,
      { id }
    );
  }
};
