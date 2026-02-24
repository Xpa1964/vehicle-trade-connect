import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { HelmetProvider } from 'react-helmet-async';
import AppRoutes from '@/routes/AppRoutes';
import { initializePhase0 } from '@/utils/security/phase0Setup';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { initializePWA } from '@/utils/pwa';
import { reportWebVitals } from '@/utils/webVitals';
import { analytics } from '@/utils/analytics';
import { SkipToContent } from '@/components/accessibility/SkipToContent';
import { ScrollToTop } from '@/components/shared/ScrollToTop';
// FASE 1: Usar QueryClient único optimizado de react-query.tsx
import { queryClient } from '@/lib/react-query';

function App() {
  const [languageReady, setLanguageReady] = useState(false);

  useEffect(() => {
    // Initialize Phase 0 security systems
    initializePhase0().then(status => {
      console.log('[App] Fase 0 inicializada:', status);
    }).catch(error => {
      console.error('[App] Error inicializando Fase 0:', error);
    });
    
    // Initialize PWA features
    initializePWA();

    // Initialize Google Analytics (optional GA_ID from env)
    const gaId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
    if (gaId) {
      analytics.init(gaId);
    }

    // Initialize Core Web Vitals monitoring
    reportWebVitals();
  }, []);

  console.log('🚀 [App] Renderizando...');
  
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <LanguageProvider onReady={() => setLanguageReady(true)}>
          {languageReady ? (
            <QueryClientProvider client={queryClient}>
              {/* FASE 6: React Query Devtools para monitoring */}
              {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
              <Router>
                <ScrollToTop />
                <SkipToContent />
                <AuthProvider>
                  <div className="min-h-screen bg-background">
                    <Toaster />
                    <AppRoutes />
                  </div>
                </AuthProvider>
              </Router>
            </QueryClientProvider>
          ) : (
            <div className="min-h-screen flex items-center justify-center bg-background">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          )}
        </LanguageProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
