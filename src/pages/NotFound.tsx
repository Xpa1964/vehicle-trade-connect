import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStaticImage } from "@/hooks/useStaticImage";

const NotFound = () => {
  const location = useLocation();
  const { src: errorImage } = useStaticImage("error.404");

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-lg mx-auto px-6">
        {/* Ilustración */}
        <div className="w-64 h-64 mx-auto mb-8 opacity-80">
          <img
            src={errorImage}
            alt="404 Error"
            className="w-full h-full object-contain"
            onError={(e) => {
              // Fallback si la imagen no existe
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        {/* Número 404 */}
        <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
        
        {/* Mensaje */}
        <h2 className="text-2xl font-semibold text-foreground mb-3">
          Página no encontrada
        </h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Lo sentimos, la página que buscas no existe o ha sido movida. 
          Verifica la URL o regresa al inicio.
        </p>
        
        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button size="lg" className="gap-2">
              <Home className="h-5 w-5" />
              Ir al Inicio
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            onClick={() => window.history.back()}
            className="gap-2 border-border text-foreground hover:bg-secondary"
          >
            <ArrowLeft className="h-5 w-5" />
            Volver Atrás
          </Button>
        </div>
        
        {/* Ruta intentada (dev info) */}
        <p className="mt-8 text-xs text-muted-foreground/60">
          Ruta: <code className="bg-muted px-2 py-1 rounded">{location.pathname}</code>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
