
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { RegisterFormData } from '@/schemas/registerSchema';
import { File, X, HelpCircle, Upload, Building2, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DocumentsStepProps {
  form: UseFormReturn<RegisterFormData>;
  isSubmitting: boolean;
}

const DocumentsStep: React.FC<DocumentsStepProps> = ({
  form,
  isSubmitting
}) => {
  const { t } = useLanguage();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const validateFileType = (file: File): boolean => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ];
    
    console.log('Validating file:', file.name, 'Type:', file.type);
    return allowedTypes.includes(file.type);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      
      const invalidFiles = filesArray.filter(file => !validateFileType(file));
      
      if (invalidFiles.length > 0) {
        alert(`Los siguientes archivos no son válidos: ${invalidFiles.map(f => f.name).join(', ')}\n\nTipos permitidos: PDF, Word (.doc, .docx), Imágenes (.jpg, .jpeg, .png)`);
        return;
      }
      
      console.log('Valid files selected:', filesArray.map(f => ({ name: f.name, type: f.type })));
      setSelectedFiles(filesArray);
      form.setValue('documents', e.target.files);
      form.clearErrors('documents');
    }
  };
  
  const removeFile = (index: number) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
    
    const dataTransfer = new DataTransfer();
    updatedFiles.forEach(file => dataTransfer.items.add(file));
    form.setValue('documents', dataTransfer.files);
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">
        {t('auth.register.documents')}
      </h3>
      
      {/* Two document category blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sociedades */}
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-primary">
              <Building2 className="h-4 w-4" />
              {t('auth.register.docCategorySociedades', { fallback: 'Sociedades' })}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1.5">
              <li>{t('auth.register.docMercantil', { fallback: 'Certificado de Registro Mercantil (Company Register Extract)' })}</li>
              <li>{t('auth.register.docVAT', { fallback: 'Número de IVA Intracomunitario (VAT Number)' })}</li>
              <li>{t('auth.register.docDeclaracion', { fallback: 'Declaración oficial del administrador' })}</li>
              <li>{t('auth.register.docIdRepresentante', { fallback: 'Documento de Identidad del Representante Legal' })}</li>
            </ul>
          </CardContent>
        </Card>
        
        {/* Profesionales Autónomos */}
        <Card className="border-accent/30 bg-accent/5">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-accent-foreground">
              <UserCheck className="h-4 w-4" />
              {t('auth.register.docCategoryAutonomos', { fallback: 'Profesionales Autónomos' })}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1.5">
              <li>{t('auth.register.docIdentidad', { fallback: 'Documento de Identidad (ID Card / Passport)' })}</li>
              <li>{t('auth.register.docActividad', { fallback: 'Registro de Actividad Económica y Estatus Fiscal' })}</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <FormField
        control={form.control}
        name="documents"
        render={({ field: { onChange, value, ...rest } }) => (
          <FormItem>
            <div className="flex items-center gap-2">
              <FormLabel>{t('auth.register.documents')}</FormLabel>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('auth.register.documentsHelp')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <FormControl>
              <div className="border-2 border-dashed rounded-md p-6 text-center hover:bg-secondary/50 cursor-pointer transition-colors">
                <input
                  type="file"
                  id="documents"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png"
                  className="sr-only"
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                />
                <label htmlFor="documents" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium">{t('auth.register.dragDocuments')}</p>
                    <p className="text-xs text-muted-foreground">PDF, Word (.doc, .docx), Imágenes (.jpg, .jpeg, .png)</p>
                    <Button type="button" variant="outline" size="sm">
                      {t('auth.register.browseFiles')}
                    </Button>
                  </div>
                </label>
              </div>
            </FormControl>
            <FormDescription>
              {t('auth.register.documentsDescription')}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">{t('auth.register.selectedFiles')} ({selectedFiles.length})</h4>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded border">
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4 text-primary" />
                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({(file.size / 1024).toFixed(0)} KB) - {file.type}
                  </span>
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsStep;
