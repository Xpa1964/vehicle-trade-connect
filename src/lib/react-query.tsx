
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// Crear una única instancia del cliente optimizada para actualizaciones inmediatas
let queryClientInstance: QueryClient | null = null;

// PERFILES DE CONFIGURACIÓN OPTIMIZADOS
export const QUERY_CONFIG = {
  // Para datos que cambian raramente (perfiles, traducciones)
  STATIC: {
    staleTime: 15 * 60 * 1000, // 15 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  },
  // Para datos dinámicos pero no críticos (dashboard, estadísticas)
  DYNAMIC: {
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  },
  // Para datos con realtime (vehículos con subscription)
  REALTIME: {
    staleTime: 3 * 60 * 1000, // 3 minutos
    gcTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  },
} as const;

const createQueryClient = () => {
  if (queryClientInstance) {
    return queryClientInstance;
  }

  queryClientInstance = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 60 * 1000, // 30 minutos - OPTIMIZADO
        gcTime: 60 * 60 * 1000, // 60 minutos - OPTIMIZADO
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        networkMode: 'online',
        retry: 1, // Solo 1 reintento
      },
      mutations: {
        retry: 0,
        networkMode: 'online',
      },
    }
  });

  return queryClientInstance;
};

// Exportar la instancia única
export const queryClient = createQueryClient();

export const ReactQueryProvider = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
