import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Cookie } from 'lucide-react';

const STORAGE_KEY = 'cookies_accepted';

export const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === null) {
      // Small delay for dramatic entrance
      const timer = setTimeout(() => {
        setVisible(true);
        requestAnimationFrame(() => setAnimateIn(true));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = (accepted: boolean) => {
    setAnimateIn(false);
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, String(accepted));
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: accepted ? 'granted' : 'denied',
        });
      }
      setVisible(false);
    }, 400);
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
          animateIn ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => dismiss(false)}
      />

      {/* Banner */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[9999] transition-all duration-500 ease-out print:hidden ${
          animateIn
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full opacity-0'
        }`}
      >
        {/* Top glow line */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />

        <div className="bg-card/95 backdrop-blur-xl border-t border-border/50">
          <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-8">
              {/* Icon + Text */}
              <div className="flex items-start gap-4 flex-1">
                <div className="shrink-0 mt-0.5 w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Cookie className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-semibold text-foreground tracking-wide">
                    Tu privacidad importa
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                    Usamos cookies para analizar el tráfico de la web y mejorar tu experiencia. 
                    No compartimos datos personales con terceros.
                  </p>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <Shield className="w-3.5 h-3.5 text-primary/70" />
                    <span className="text-xs text-muted-foreground/70">
                      Cumplimiento RGPD · Solo cookies analíticas
                    </span>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => dismiss(false)}
                  className="flex-1 md:flex-none md:min-w-[120px] border-border/60 hover:bg-muted/50 text-muted-foreground"
                >
                  Rechazar
                </Button>
                <Button
                  size="default"
                  onClick={() => dismiss(true)}
                  className="flex-1 md:flex-none md:min-w-[120px] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20"
                >
                  Aceptar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookieConsent;
