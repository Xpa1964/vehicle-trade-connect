
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const CookiesPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t('nav.backToHome', { fallback: 'Volver al Inicio' })}
            </Link>
          </Button>
        </div>

        <div className="bg-card shadow-sm rounded-lg p-6 sm:p-8 border border-border">
          <h1 className="text-3xl font-bold mb-8 text-center text-foreground">
            Política de Cookies
          </h1>
          
          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">¿Qué son las cookies?</h2>
              <p className="text-muted-foreground leading-relaxed">
                Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita nuestro sitio web. Nos ayudan a mejorar su experiencia de usuario y el funcionamiento del sitio.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Tipos de cookies que utilizamos</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2 text-foreground">Cookies esenciales</h3>
                  <p className="text-muted-foreground">Necesarias para el funcionamiento básico del sitio web y la autenticación de usuarios.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2 text-foreground">Cookies de rendimiento</h3>
                  <p className="text-muted-foreground">Nos ayudan a entender cómo los usuarios interactúan con nuestro sitio web.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2 text-foreground">Cookies de preferencias</h3>
                  <p className="text-muted-foreground">Recuerdan sus configuraciones y preferencias, como el idioma seleccionado.</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Control de cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                Puede controlar y eliminar las cookies a través de la configuración de su navegador. Sin embargo, tenga en cuenta que deshabilitar ciertas cookies puede afectar la funcionalidad del sitio.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Actualizaciones de esta política</h2>
              <p className="text-muted-foreground leading-relaxed">
                Podemos actualizar esta política de cookies ocasionalmente. Le recomendamos revisar esta página periódicamente para estar al tanto de cualquier cambio.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiesPage;
