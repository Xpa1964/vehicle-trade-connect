import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Download, 
  ChevronDown, 
  ChevronUp,
  FileSpreadsheet,
  Lightbulb,
  Edit3
} from 'lucide-react';
import { ParseResult, ValidationError, generateErrorReport } from '@/utils/xlsxParser';
import { EditableErrorTable } from './EditableErrorTable';
import { cn } from '@/lib/utils';

interface ValidationResultsPanelProps {
  parseResult: ParseResult;
  originalMandatoryData?: any[][];
  originalOptionalData?: any[][];
  onCorrectionsApplied?: (correctedErrors: ValidationError[]) => void;
}

export const ValidationResultsPanel: React.FC<ValidationResultsPanelProps> = ({
  parseResult,
  originalMandatoryData = [],
  originalOptionalData = [],
  onCorrectionsApplied
}) => {
  const { t } = useLanguage();
  const [expandedErrors, setExpandedErrors] = useState(true);
  const [expandedWarnings, setExpandedWarnings] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'correct'>('summary');
  
  const { summary, errors, warnings } = parseResult;
  
  const handleDownloadErrorReport = () => {
    const blob = generateErrorReport(parseResult, originalMandatoryData, originalOptionalData);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte_errores_${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCorrectionsApplied = (correctedErrors: ValidationError[]) => {
    if (onCorrectionsApplied) {
      onCorrectionsApplied(correctedErrors);
    }
  };
  
  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              {t('vehicles.validationResults', { fallback: 'Resultados de Validación' })}
            </CardTitle>
            <CardDescription>
              {t('vehicles.validationDescription', { 
                fallback: 'Revisa los errores y advertencias encontrados en tu archivo' 
              })}
            </CardDescription>
          </div>
          {errors.length > 0 && (
            <Button
              onClick={handleDownloadErrorReport}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              {t('vehicles.downloadErrorReport', { fallback: 'Descargar Reporte' })}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'summary' | 'correct')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="summary">
              {t('vehicles.summary', { fallback: 'Resumen' })}
            </TabsTrigger>
            <TabsTrigger value="correct" disabled={parseResult.errors.length === 0}>
              <Edit3 className="mr-2 h-4 w-4" />
              {t('vehicles.correctErrors', { fallback: 'Corregir Errores' })}
            </TabsTrigger>
          </TabsList>

          {/* TAB: Resumen */}
          <TabsContent value="summary" className="space-y-4 mt-4">
            {/* Resumen de validación */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              {t('vehicles.totalRows', { fallback: 'Total Filas' })}
            </p>
            <p className="text-2xl font-bold">{summary.totalRows}</p>
          </div>
          
          <div className="space-y-1 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <p className="text-sm text-green-700 dark:text-green-400 flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" />
              {t('vehicles.validRows', { fallback: 'Válidas' })}
            </p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-400">
              {summary.validRows}
            </p>
          </div>
          
          <div className="space-y-1 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
            <p className="text-sm text-red-700 dark:text-red-400 flex items-center gap-1">
              <XCircle className="h-4 w-4" />
              {t('vehicles.errorRows', { fallback: 'Con Errores' })}
            </p>
            <p className="text-2xl font-bold text-red-700 dark:text-red-400">
              {summary.errorRows}
            </p>
          </div>
          
          <div className="space-y-1 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
            <p className="text-sm text-yellow-700 dark:text-yellow-400 flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              {t('vehicles.warningRows', { fallback: 'Advertencias' })}
            </p>
            <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
              {summary.warningRows}
            </p>
          </div>
        </div>
        
        {/* Mensaje de estado general */}
        {parseResult.valid ? (
          <Alert className="border-green-500/50 bg-green-500/10">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700 dark:text-green-400">
              {t('vehicles.allRowsValid', { 
                fallback: '¡Excelente! Todos los vehículos están listos para subir.' 
              })}
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-red-500/50 bg-red-500/10">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700 dark:text-red-400">
              {t('vehicles.hasErrors', { 
                fallback: 'Se encontraron errores que deben corregirse antes de continuar. Descarga el reporte de errores para más detalles.' 
              })}
            </AlertDescription>
          </Alert>
        )}
        
        {/* Sección de errores */}
        {errors.length > 0 && (
          <div className="border border-red-500/20 rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedErrors(!expandedErrors)}
              className="w-full p-4 bg-red-500/5 hover:bg-red-500/10 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="font-semibold text-red-700 dark:text-red-400">
                  {t('vehicles.errors', { fallback: 'Errores' })} ({errors.length})
                </span>
              </div>
              {expandedErrors ? (
                <ChevronUp className="h-5 w-5 text-red-600" />
              ) : (
                <ChevronDown className="h-5 w-5 text-red-600" />
              )}
            </button>
            
            {expandedErrors && (
              <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
                {errors.map((error, index) => (
                  <div
                    key={index}
                    className="p-3 bg-background border border-red-200 dark:border-red-800 rounded-lg space-y-1"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="destructive" className="text-xs">
                            {t('vehicles.row', { fallback: 'Fila' })} {error.row}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {error.field}
                          </Badge>
                          {error.value && (
                            <span className="text-xs text-muted-foreground font-mono">
                              "{error.value}"
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-red-700 dark:text-red-400">
                          {error.error}
                        </p>
                        {error.suggestion && (
                          <div className="flex items-start gap-2 mt-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded">
                            <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-blue-700 dark:text-blue-400">
                              <strong>{t('vehicles.suggestion', { fallback: 'Sugerencia' })}:</strong>{' '}
                              {error.suggestion}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Sección de advertencias */}
        {warnings.length > 0 && (
          <div className="border border-yellow-500/20 rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedWarnings(!expandedWarnings)}
              className="w-full p-4 bg-yellow-500/5 hover:bg-yellow-500/10 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="font-semibold text-yellow-700 dark:text-yellow-400">
                  {t('vehicles.warnings', { fallback: 'Advertencias' })} ({warnings.length})
                </span>
              </div>
              {expandedWarnings ? (
                <ChevronUp className="h-5 w-5 text-yellow-600" />
              ) : (
                <ChevronDown className="h-5 w-5 text-yellow-600" />
              )}
            </button>
            
            {expandedWarnings && (
              <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
                {warnings.map((warning, index) => (
                  <div
                    key={index}
                    className="p-3 bg-background border border-yellow-200 dark:border-yellow-800 rounded-lg space-y-1"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-700">
                        {t('vehicles.row', { fallback: 'Fila' })} {warning.row}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {warning.field}
                      </Badge>
                      {warning.value && (
                        <span className="text-xs text-muted-foreground font-mono">
                          "{warning.value}"
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400">
                      {warning.error}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
          </TabsContent>

          {/* TAB: Corregir Errores */}
          <TabsContent value="correct" className="mt-4">
            <EditableErrorTable 
              errors={parseResult.errors} 
              onErrorsUpdate={handleCorrectionsApplied}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
