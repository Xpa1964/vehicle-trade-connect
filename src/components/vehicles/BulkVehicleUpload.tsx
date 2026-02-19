import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { UploadForm } from '../vehicles/upload/UploadForm';
import { ValidationResultsPanel } from '../vehicles/upload/ValidationResultsPanel';
import { ImageUploadZone } from '../vehicles/upload/ImageUploadZone';
import { EnhancedPreviewSection } from '../vehicles/upload/EnhancedPreviewSection';
import { useBulkVehicleUpload } from '@/hooks/useBulkVehicleUpload';
import { useBulkUploadDraft } from '@/hooks/useBulkUploadDraft';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BulkUploadTemplate } from './BulkUploadTemplate';
import { parseXLSXFile, ParseResult } from '@/utils/xlsxParser';
import { associateImagesToVehicles, ImageAssociation } from '@/utils/imageVehicleAssociator';
import { toast } from 'sonner';
import { Save, Trash2, Upload as UploadIcon, Info, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CorrectionEntry } from '../vehicles/upload/EditableErrorTable';

const BulkVehicleUpload: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const { uploadVehicles, isUploading, progress } = useBulkVehicleUpload();
  const { 
    draft, 
    saveDraft, 
    deleteDraft, 
    getDraftInfo, 
    setAutoSaveEnabled 
  } = useBulkUploadDraft();
  
  const [file, setFile] = useState<File | null>(null);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  
  // Estado para asociación de imágenes
  const [imageAssociations, setImageAssociations] = useState<ImageAssociation[]>([]);
  const [associationStrategy, setAssociationStrategy] = useState<{
    type: 'vin' | 'plate' | 'sequential' | 'manual';
    confidence: 'high' | 'medium' | 'low';
  }>({ type: 'sequential', confidence: 'medium' });
  
  // Estado para vehículos seleccionados
  const [selectedVehicleIndices, setSelectedVehicleIndices] = useState<number[]>([]);

  // Cargar borrador al iniciar
  useEffect(() => {
    const draftInfo = getDraftInfo();
    if (draftInfo.exists && draft) {
      const loadDraft = confirm(
        t('vehicles.loadDraftConfirm', {
          fallback: `¿Deseas cargar el borrador guardado?\n${draftInfo.vehicleCount} vehículos • ${new Date(draftInfo.timestamp!).toLocaleString()}`,
        })
      );
      
      if (loadDraft) {
        setPreviewData(draft.vehicles);
        setImageAssociations(draft.imageAssociations);
        setSelectedVehicleIndices(draft.vehicles.map((_, i) => i));
        toast.success(t('vehicles.draftLoaded', { fallback: 'Borrador cargado' }));
      }
    }
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validar que sea un archivo XLSX
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'xlsx' && fileExtension !== 'xls') {
      setErrorMessage(t('vehicles.xlsxOnlyError', { 
        fallback: 'Por favor sube un archivo Excel (.xlsx o .xls)' 
      }));
      toast.error(t('vehicles.xlsxOnlyError', { 
        fallback: 'Por favor sube un archivo Excel (.xlsx o .xls)' 
      }));
      return;
    }

    setFile(selectedFile);
    setErrorMessage(null);
    setParseResult(null);
    setPreviewData([]);
    setImageAssociations([]);
    setIsValidating(true);
    
    try {
      toast.info(t('vehicles.validatingFile', { fallback: 'Validando archivo...' }));
      
      // Parsear y validar el archivo XLSX
      const result = await parseXLSXFile(selectedFile, currentLanguage);
      setParseResult(result);
      
      if (result.valid) {
        setPreviewData(result.validVehicles);
        setSelectedVehicleIndices(result.validVehicles.map((_, i) => i));
        
        // Si hay imágenes cargadas, asociarlas automáticamente
        if (uploadedImages.length > 0) {
          const { associations, strategy } = associateImagesToVehicles(
            result.validVehicles,
            uploadedImages
          );
          setImageAssociations(associations);
          setAssociationStrategy(strategy);
          
          toast.success(t('vehicles.validationAndAssociationSuccess', { 
            fallback: `✅ ${result.summary.validRows} vehículos validados e imágenes asociadas (${strategy.type})` 
          }));
        } else {
          toast.success(t('vehicles.validationSuccess', { 
            fallback: `✅ ${result.summary.validRows} vehículos validados correctamente` 
          }));
        }
        
        // Auto-guardar borrador
        saveDraft(result.validVehicles, imageAssociations, selectedFile.name);
      } else {
        setPreviewData(result.validVehicles);
        toast.error(t('vehicles.validationHasErrors', { 
          fallback: `❌ Se encontraron ${result.summary.errorRows} filas con errores` 
        }));
      }
    } catch (error) {
      console.error('Error parsing XLSX:', error);
      setErrorMessage(t('vehicles.xlsxParseError', { 
        fallback: 'Error al procesar el archivo Excel. Verifica que el formato sea correcto.' 
      }));
      toast.error(t('vehicles.xlsxParseError', { 
        fallback: 'Error al procesar el archivo Excel' 
      }));
    } finally {
      setIsValidating(false);
    }
  };

  const handleImagesSelected = (files: File[]) => {
    setUploadedImages(files);
    
    // Si ya hay vehículos cargados, asociar automáticamente
    if (previewData.length > 0) {
      const { associations, strategy } = associateImagesToVehicles(previewData, files);
      setImageAssociations(associations);
      setAssociationStrategy(strategy);
      
      toast.success(t('vehicles.imagesAssociated', {
        fallback: `Imágenes asociadas usando estrategia: ${strategy.type} (confianza: ${strategy.confidence})`,
      }));
      
      // Auto-guardar borrador
      saveDraft(previewData, associations, file?.name);
    }
  };

  const handleSaveDraft = () => {
    if (previewData.length === 0) {
      toast.error(t('vehicles.noDataToSave', { fallback: 'No hay datos para guardar' }));
      return;
    }
    
    saveDraft(previewData, imageAssociations, file?.name);
    toast.success(t('vehicles.draftSaved', { fallback: 'Borrador guardado correctamente' }));
  };

  const handleDeleteDraft = () => {
    if (confirm(t('vehicles.deleteDraftConfirm', { fallback: '¿Seguro que deseas eliminar el borrador?' }))) {
      deleteDraft();
      setPreviewData([]);
      setImageAssociations([]);
      setFile(null);
      setUploadedImages([]);
      setParseResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error(t('vehicles.selectFileError', { 
        fallback: 'Por favor selecciona un archivo' 
      }));
      return;
    }

    if (selectedVehicleIndices.length === 0) {
      toast.error(t('vehicles.noVehiclesSelected', { 
        fallback: 'No hay vehículos seleccionados para subir' 
      }));
      return;
    }

    // Verificar que no haya errores críticos
    if (parseResult && !parseResult.valid) {
      toast.error(t('vehicles.fixErrorsFirst', { 
        fallback: 'Por favor corrige los errores antes de continuar' 
      }));
      return;
    }

    try {
      toast.info(t('vehicles.uploadingVehicles', { 
        fallback: 'Subiendo vehículos...' 
      }));
      
      // Filtrar solo los vehículos seleccionados
      const vehiclesToUpload = selectedVehicleIndices.map(i => previewData[i]);
      
      // Agregar imágenes a cada vehículo
      const vehiclesWithImages = vehiclesToUpload.map((vehicle, idx) => {
        const originalIndex = selectedVehicleIndices[idx];
        const association = imageAssociations.find(a => a.vehicleIndex === originalIndex);
        
        if (association && association.images.length > 0) {
          // Convertir File[] a FileList-like object
          const dataTransfer = new DataTransfer();
          association.images.forEach(img => dataTransfer.items.add(img));
          
          return {
            ...vehicle,
            images: dataTransfer.files,
          };
        }
        
        return vehicle;
      });
      
      await uploadVehicles(vehiclesWithImages);
      
      // Limpiar estado después de éxito
      setFile(null);
      setPreviewData([]);
      setParseResult(null);
      setErrorMessage(null);
      setUploadedImages([]);
      setImageAssociations([]);
      deleteDraft(); // Eliminar borrador después de subida exitosa
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(t('vehicles.uploadError', { 
        fallback: 'Error al subir los vehículos' 
      }));
    }
  };

  return (
    <div className="space-y-8">
      {/* Barra de información de borrador */}
      {draft && previewData.length > 0 && (
        <Alert className="border-blue-500/50 bg-blue-500/10">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-blue-700 dark:text-blue-400">
              {t('vehicles.draftActive', { 
                fallback: `Borrador activo: ${draft.vehicles.length} vehículos • ${new Date(draft.timestamp).toLocaleString()}` 
              })}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSaveDraft}>
                <Save className="mr-2 h-4 w-4" />
                {t('common.save', { fallback: 'Guardar' })}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDeleteDraft}>
                <Trash2 className="mr-2 h-4 w-4" />
                {t('common.delete', { fallback: 'Eliminar' })}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <div className="space-y-6">
          <UploadForm
            onFileChange={handleFileChange}
            onImageUpload={() => {}}
            errorMessage={errorMessage}
            previewData={previewData}
            isUploading={isUploading || isValidating}
          />
          
          <ImageUploadZone
            onImagesSelected={handleImagesSelected}
            maxImages={1000}
          />
          
          {isValidating && (
            <div className="space-y-2">
              <div className="flex items-center justify-center">
                <span className="text-sm text-muted-foreground">
                  {t('vehicles.validating', { fallback: 'Validando datos' })}...
                </span>
              </div>
              <Progress value={undefined} className="h-2" />
            </div>
          )}
          
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t('common.uploading', { fallback: 'Subiendo' })}...
                </span>
                <span className="text-sm font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
          
          {parseResult && parseResult.valid && selectedVehicleIndices.length > 0 && !isUploading && !isValidating && (
            <Button 
              onClick={handleUpload} 
              className="w-full"
              size="lg"
            >
              <UploadIcon className="mr-2 h-5 w-5" />
              {t('vehicles.uploadVehicles', { 
                fallback: `Subir ${selectedVehicleIndices.length} Vehículo${selectedVehicleIndices.length !== 1 ? 's' : ''}` 
              })}
            </Button>
          )}
        </div>
        
        <div className="space-y-6">
          <BulkUploadTemplate />
          
          {/* API Integration Card */}
          <div className="p-6 rounded-lg bg-card text-card-foreground shadow-sm border border-border transition-shadow duration-200 hover:shadow-md space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Key className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">
                  {t('api.integration.title')}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('api.integration.bulkDescription')}
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/api-management')}
                >
                  <Key className="mr-2 h-4 w-4" />
                  {t('api.management.title')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Validation results panel */}
      {parseResult && (
        <ValidationResultsPanel 
          parseResult={parseResult}
          onCorrectionsApplied={(correctedErrors) => {
            toast.success(t('vehicles.correctionsApplied', { 
              fallback: '✓ Correcciones aplicadas.' 
            }));
          }}
          onApplyCorrections={(corrections: CorrectionEntry[]) => {
            // Patch vehicle data with corrections
            const updatedVehicles = [...previewData];
            const appliedRows = new Set<number>();
            
            corrections.forEach(({ row, field, correctedValue }) => {
              // row is 1-indexed from XLSX (header=1, data starts at 2)
              // previewData is 0-indexed for valid vehicles
              // We need to find the vehicle that came from this row
              // Since validVehicles may skip rows, we search by matching
              const vehicleIdx = previewData.findIndex((v: any, idx: number) => {
                // The row in parseResult corresponds to XLSX row number
                // We try matching by index offset (row - 2 for 0-indexed)
                return idx === row - 2;
              });
              
              if (vehicleIdx >= 0) {
                const numericFields = ['year', 'price', 'mileage', 'doors', 'engineSize', 'enginePower', 'co2Emissions'];
                const boolFields = ['acceptsExchange', 'cocStatus', 'commissionSale'];
                
                if (numericFields.includes(field)) {
                  updatedVehicles[vehicleIdx] = { ...updatedVehicles[vehicleIdx], [field]: parseInt(correctedValue) };
                } else if (boolFields.includes(field)) {
                  updatedVehicles[vehicleIdx] = { ...updatedVehicles[vehicleIdx], [field]: correctedValue === 'true' };
                } else {
                  updatedVehicles[vehicleIdx] = { ...updatedVehicles[vehicleIdx], [field]: correctedValue };
                }
                appliedRows.add(row);
              }
            });
            
            setPreviewData(updatedVehicles);
            
            // Remove corrected errors from parseResult
            const remainingErrors = parseResult.errors.filter(
              e => !corrections.some(c => c.row === e.row && c.field === e.field)
            );
            
            const errorRowSet = new Set(remainingErrors.map(e => e.row));
            const newValid = remainingErrors.length === 0;
            
            setParseResult({
              ...parseResult,
              valid: newValid,
              errors: remainingErrors,
              validVehicles: updatedVehicles,
              summary: {
                ...parseResult.summary,
                errorRows: errorRowSet.size,
                validRows: parseResult.summary.totalRows - errorRowSet.size,
              },
            });
            
            if (newValid) {
              setSelectedVehicleIndices(updatedVehicles.map((_, i) => i));
              toast.success(t('vehicles.allErrorsFixed', { 
                fallback: '🎉 ¡Todos los errores corregidos! Los vehículos están listos para subir.' 
              }));
            } else {
              toast.success(t('vehicles.someErrorsFixed', { 
                fallback: `✓ ${corrections.length} correcciones aplicadas. Quedan ${remainingErrors.length} errores.` 
              }));
            }
            
            // Save draft with updated data
            saveDraft(updatedVehicles, imageAssociations, file?.name);
          }}
        />
      )}
      
      {/* Enhanced preview section */}
      {previewData.length > 0 && parseResult?.valid && (
        <EnhancedPreviewSection
          vehicles={previewData}
          imageAssociations={imageAssociations}
          onVehiclesSelectionChange={setSelectedVehicleIndices}
          strategyType={associationStrategy.type}
          strategyConfidence={associationStrategy.confidence}
        />
      )}
    </div>
  );
};

export default BulkVehicleUpload;
