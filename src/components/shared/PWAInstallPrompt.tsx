import { useState, useEffect, useMemo } from 'react';
import { X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { canInstall, promptInstall, isInstalled } from '@/utils/pwa';

/**
 * PWA Install Prompt Component
 * Shows a prompt to install the app when available
 */
export const PWAInstallPrompt = () => {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showManualHelp, setShowManualHelp] = useState(false);

  const installHelp = useMemo(() => {
    if (typeof navigator === 'undefined') {
      return {
        title: 'Cómo instalar la app',
        steps: ['Abre el menú del navegador.', 'Pulsa “Instalar app” o “Añadir a pantalla de inicio”.', 'Confirma la instalación.'],
      };
    }

    const userAgent = navigator.userAgent.toLowerCase();

    if (/android/.test(userAgent)) {
      return {
        title: 'Cómo instalar en Android',
        steps: [
          'Abre el menú ⋮ del navegador.',
          'Pulsa “Instalar app” o “Añadir a pantalla de inicio”.',
          'Confirma la instalación.',
        ],
      };
    }

    if (/iphone|ipad|ipod/.test(userAgent)) {
      return {
        title: 'Cómo instalar en iPhone o iPad',
        steps: [
          'Pulsa el botón Compartir en Safari.',
          'Selecciona “Añadir a pantalla de inicio”.',
          'Confirma con “Añadir”.',
        ],
      };
    }

    return {
      title: 'Cómo instalar en ordenador',
      steps: [
        'Abre el menú del navegador o el icono de instalación de la barra.',
        'Pulsa “Instalar app”.',
        'Confirma la instalación.',
      ],
    };
  }, []);

  useEffect(() => {
    const isDismissed = localStorage.getItem('pwa-prompt-dismissed') === 'true';

    if (isInstalled() || isDismissed) {
      return;
    }

    const checkInterval = setInterval(() => {
      if (canInstall() && !dismissed) {
        setShow(true);
        clearInterval(checkInterval);
      }
    }, 1000);

    return () => clearInterval(checkInterval);
  }, [dismissed]);

  const handleInstall = async () => {
    const accepted = await promptInstall();

    if (accepted) {
      setShow(false);
      setShowManualHelp(false);
      return;
    }

    setShowManualHelp(true);
  };

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-in slide-in-from-bottom duration-300">
      <div className="bg-card border border-border rounded-lg shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <Download className="w-6 h-6 text-primary-foreground" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm mb-1">Instalar KONTACT VO</h3>
            <p className="text-xs text-muted-foreground mb-3">
              No se descarga como archivo: se instala desde el navegador para acceso rápido y uso offline.
            </p>

            <div className="flex gap-2">
              <Button size="sm" onClick={handleInstall} className="flex-1">
                Instalar app
              </Button>
              <Button size="sm" variant="ghost" onClick={handleDismiss}>
                Ahora no
              </Button>
            </div>

            <button
              type="button"
              onClick={() => setShowManualHelp((value) => !value)}
              className="mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {showManualHelp ? 'Ocultar ayuda de instalación' : '¿No se abre? Ver instalación manual'}
            </button>

            {showManualHelp && (
              <div className="mt-3 rounded-lg border border-border bg-muted/50 p-3">
                <p className="text-xs font-medium text-foreground mb-2">{installHelp.title}</p>
                <ol className="space-y-1 text-xs text-muted-foreground list-decimal pl-4">
                  {installHelp.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};