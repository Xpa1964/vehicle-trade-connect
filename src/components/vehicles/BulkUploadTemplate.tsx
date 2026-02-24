import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
const loadXLSXTemplate = () => import('@/utils/xlsxTemplateGenerator').then(m => m.generateXLSXTemplate);

export const BulkUploadTemplate: React.FC = () => {
  const { t, currentLanguage } = useLanguage();

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-primary" />
          {t('vehicles.bulkUploadTemplate', { fallback: 'Plantilla de Carga Masiva' })}
        </CardTitle>
        <CardDescription>
          {t('vehicles.downloadTemplateDescription', { 
            fallback: 'Descarga la plantilla Excel con validaciones integradas para facilitar la carga de vehículos' 
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Características destacadas */}
        <div className="space-y-3 p-4 bg-primary/5 rounded-lg border border-primary/10">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">
                {t('vehicles.autoValidation', { fallback: 'Validación Automática en Excel' })}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('vehicles.autoValidationDesc', { 
                  fallback: 'Listas desplegables con opciones válidas para evitar errores de tipeo' 
                })}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">
                {t('vehicles.organizedSheets', { fallback: '3 Pestañas Organizadas' })}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('vehicles.organizedSheetsDesc', { 
                  fallback: 'Instrucciones, Datos Obligatorios y Datos Opcionales claramente separados' 
                })}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">
                {t('vehicles.detailedInstructions', { fallback: 'Instrucciones Detalladas' })}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('vehicles.detailedInstructionsDesc', { 
                  fallback: 'Guía paso a paso con ejemplos incluidos en la primera pestaña' 
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Información sobre campos */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-medium text-green-700 dark:text-green-400 flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              {t('vehicles.requiredFields', { fallback: 'Campos Obligatorios' })}
            </p>
            <ul className="text-xs text-muted-foreground list-disc list-inside space-y-0.5 pl-2">
              <li>{t('vehicles.brandModelYear', { fallback: 'Marca, modelo, año' })}</li>
              <li>{t('vehicles.priceMileage', { fallback: 'Precio y kilometraje' })}</li>
              <li>{t('vehicles.fuelTransmission', { fallback: 'Combustible y transmisión' })}</li>
              <li>{t('vehicles.locationCountry', { fallback: 'Ubicación y país' })}</li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
              {t('vehicles.optionalFields', { fallback: 'Campos Opcionales' })}
            </p>
            <ul className="text-xs text-muted-foreground list-disc list-inside space-y-0.5 pl-2">
              <li>{t('vehicles.vinPlate', { fallback: 'VIN y matrícula' })}</li>
              <li>{t('vehicles.engineSpecs', { fallback: 'Especificaciones del motor' })}</li>
              <li>{t('vehicles.emissions', { fallback: 'Emisiones y normativa Euro' })}</li>
              <li>{t('vehicles.commissionInfo', { fallback: 'Información de comisión' })}</li>
            </ul>
          </div>
        </div>

        {/* Nota importante */}
        <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-yellow-700 dark:text-yellow-400">
            {t('vehicles.templateNote', { 
              fallback: 'Las imágenes de los vehículos se subirán en un paso posterior, después de validar los datos del archivo Excel.' 
            })}
          </p>
        </div>

        {/* Botón de descarga destacado */}
        <Button 
          onClick={async () => { const gen = await loadXLSXTemplate(); gen(currentLanguage); }}
          className="w-full h-12 text-base font-semibold gap-2 shadow-lg hover:shadow-xl transition-all"
          size="lg"
        >
          <Download className="h-5 w-5" />
          {t('vehicles.downloadTemplate', { fallback: 'Descargar Plantilla XLSX' })}
        </Button>
      </CardContent>
    </Card>
  );
};
