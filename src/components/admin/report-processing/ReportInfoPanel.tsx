import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

const ReportInfoPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="w-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">
                  Guía del Proceso de Informes
                </CardTitle>
              </div>
              <Button variant="ghost" size="sm" className="p-1">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-6 pt-0">
            {/* Evolución de Estados por Fase */}
            <div className="space-y-3">
              <h3 className="font-semibold text-primary border-b pb-2">
                Evolución de Estados por Fase
              </h3>
              <div className="space-y-4">
                {/* Fase 1: Solicitud Pagada */}
                <div className="border rounded-lg p-4 bg-yellow-50/50">
                  <div className="flex gap-3 mb-3">
                    <div className="w-6 h-6 rounded bg-yellow-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-yellow-700">1</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-yellow-700 mb-2">
                        Fase 1: Solicitud Pagada
                      </p>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-start gap-2">
                          <span className="font-semibold min-w-20">Estado:</span>
                          <span className="text-muted-foreground">"paid" - Aparece en pestaña "Por Procesar"</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold min-w-20">Acción:</span>
                          <span className="text-muted-foreground">Admin hace clic en "Iniciar Procesamiento"</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold min-w-20">Resultado:</span>
                          <span className="text-muted-foreground">Estado cambia a "in_progress"</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold min-w-20">Notificación:</span>
                          <span className="text-muted-foreground">Cliente recibe notificación "Su informe está siendo procesado"</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Fase 2: En Proceso */}
                <div className="border rounded-lg p-4 bg-blue-50/50">
                  <div className="flex gap-3 mb-3">
                    <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-blue-700">2</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-blue-700 mb-2">
                        Fase 2: En Proceso
                      </p>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-start gap-2">
                          <span className="font-semibold min-w-20">Estado:</span>
                          <span className="text-muted-foreground">"in_progress" - Aparece en pestaña "En Proceso"</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold min-w-20">Acciones:</span>
                          <span className="text-muted-foreground">Admin puede agregar notas internas durante el proceso</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold min-w-20">Siguiente:</span>
                          <span className="text-muted-foreground">Admin sube el informe PDF y hace clic en "Entregar Informe"</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold min-w-20">Resultado:</span>
                          <span className="text-muted-foreground">Estado cambia a "completed" y se crea registro de entrega</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold min-w-20">Notificación:</span>
                          <span className="text-muted-foreground">Cliente recibe notificación "Su informe está listo para descargar"</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Fase 3: Completado */}
                <div className="border rounded-lg p-4 bg-green-50/50">
                  <div className="flex gap-3 mb-3">
                    <div className="w-6 h-6 rounded bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-green-700">3</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-green-700 mb-2">
                        Fase 3: Completado
                      </p>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-start gap-2">
                          <span className="font-semibold min-w-20">Estado:</span>
                          <span className="text-muted-foreground">"completed" - Aparece en pestaña "Completados"</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold min-w-20">Archivo:</span>
                          <span className="text-muted-foreground">PDF almacenado en sistema de archivos seguro</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold min-w-20">Acceso:</span>
                          <span className="text-muted-foreground">Cliente puede descargar desde su panel en cualquier momento</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold min-w-20">Registro:</span>
                          <span className="text-muted-foreground">Se guarda fecha de entrega y detalles del informe</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Diagrama de Flujo Simplificado */}
            <div className="space-y-3">
              <h3 className="font-semibold text-primary border-b pb-2">
                Flujo de Estados
              </h3>
              <div className="flex items-center justify-center gap-2 text-xs bg-muted/30 p-4 rounded-lg">
                <div className="text-center">
                  <div className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded font-medium">PAID</div>
                  <div className="text-[10px] text-muted-foreground mt-1">Por Procesar</div>
                </div>
                <span className="text-muted-foreground">→</span>
                <div className="text-center">
                  <div className="px-3 py-2 bg-blue-100 text-blue-700 rounded font-medium">IN_PROGRESS</div>
                  <div className="text-[10px] text-muted-foreground mt-1">En Proceso</div>
                </div>
                <span className="text-muted-foreground">→</span>
                <div className="text-center">
                  <div className="px-3 py-2 bg-green-100 text-green-700 rounded font-medium">COMPLETED</div>
                  <div className="text-[10px] text-muted-foreground mt-1">Completado</div>
                </div>
              </div>
            </div>

            {/* Acciones Disponibles */}
            <div className="space-y-3">
              <h3 className="font-semibold text-primary border-b pb-2">
                Acciones Disponibles
              </h3>
              <div className="grid gap-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="font-medium text-primary">•</span>
                  <span><strong>Iniciar Procesamiento:</strong> Cambia el estado a "En Proceso" y notifica al cliente</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium text-primary">•</span>
                  <span><strong>Agregar Notas:</strong> Registra información interna sobre el proceso del informe</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium text-primary">•</span>
                  <span><strong>Entregar Informe:</strong> Sube el PDF del informe completado y notifica al cliente</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium text-primary">•</span>
                  <span><strong>Ver Detalles:</strong> Consulta información del vehículo, cliente y pago</span>
                </div>
              </div>
            </div>

            {/* Información Importante */}
            <div className="space-y-3">
              <h3 className="font-semibold text-primary border-b pb-2">
                Información Importante
              </h3>
              <div className="grid gap-2 text-sm text-muted-foreground">
                <p>• Las notificaciones se envían automáticamente al cliente en cada cambio de estado</p>
                <p>• Los informes completados se almacenan de forma segura en el sistema de archivos</p>
                <p>• El cliente puede descargar su informe desde su panel de usuario en cualquier momento</p>
                <p>• Las notas internas solo son visibles para el equipo administrativo</p>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default ReportInfoPanel;
