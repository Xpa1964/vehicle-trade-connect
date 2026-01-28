
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, FileText, Settings, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const VehicleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();

  if (!id) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Vehículo no encontrado</h1>
        <Button asChild>
          <Link to="/vehicles">Volver a Vehículos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link to="/vehicles" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver a Vehículos
            </Link>
          </Button>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <h1 className="text-3xl font-bold mb-4 sm:mb-0">
              Detalles del Vehículo #{id}
            </h1>
            
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/vehicle/${id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to={`/vehicle/${id}/equipment`}>
                  <Settings className="h-4 w-4 mr-2" />
                  Equipamiento
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to={`/vehicle/${id}/files`}>
                  <FileText className="h-4 w-4 mr-2" />
                  Archivos
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to={`/vehicle/${id}/damages`}>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Daños
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <section>
                  <h2 className="text-xl font-semibold mb-4">Información Básica</h2>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">
                      Los detalles del vehículo se mostrarán aquí una vez conectado a la base de datos.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">Galería de Imágenes</h2>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">
                      Las imágenes del vehículo se mostrarán aquí.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">Descripción</h2>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">
                      La descripción detallada del vehículo se mostrará aquí.
                    </p>
                  </div>
                </section>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                <section className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Acciones Rápidas</h3>
                  <div className="space-y-2">
                    <Button size="sm" className="w-full" asChild>
                      <Link to={`/vehicle/${id}/additional-info`}>
                        Información Adicional
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      Crear Subasta
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      Intercambiar
                    </Button>
                  </div>
                </section>

                <section className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Estado del Vehículo</h3>
                  <p className="text-sm text-gray-600">
                    El estado actual y historial se mostrarán aquí.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailPage;
