
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ProfileCreationStatusProps {
  registrationId: string;
  status: string;
}

interface ValidationDataResponse {
  company_name_match: boolean;
  contact_person_match: boolean;
  phone_match: boolean;
  country_match: boolean;
  business_type_match: boolean;
  trader_type_match: boolean;
}

interface ValidationResponse {
  success: boolean;
  message?: string;
  data_validation?: ValidationDataResponse;
}

const ProfileCreationStatus: React.FC<ProfileCreationStatusProps> = ({
  registrationId,
  status
}) => {
  const [validationResult, setValidationResult] = useState<ValidationResponse | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const validateProfile = async () => {
    if (status !== 'approved') return;
    
    setIsValidating(true);
    try {
      const { data, error } = await supabase
        .rpc('validate_profile_data_transfer', { p_registration_id: registrationId });

      if (error) {
        console.error('Error validating profile:', error);
        setValidationResult({ success: false, message: error.message });
      } else {
        // Proper type conversion: Json -> unknown -> ValidationResponse
        setValidationResult(data as unknown as ValidationResponse);
      }
    } catch (error) {
      console.error('Exception validating profile:', error);
      setValidationResult({ success: false, message: 'Validation failed' });
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    if (status === 'approved') {
      // Auto-validate after a short delay when approved
      const timer = setTimeout(() => {
        validateProfile();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [status, registrationId]);

  if (status !== 'approved') {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Estado del Perfil:</span>
        {validationResult === null ? (
          <Badge variant="outline" className="text-blue-600">
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
            Verificando...
          </Badge>
        ) : validationResult.success ? (
          <Badge variant="outline" className="text-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Creado automáticamente
          </Badge>
        ) : (
          <Badge variant="outline" className="text-red-600">
            <XCircle className="h-3 w-3 mr-1" />
            Error en creación
          </Badge>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={validateProfile}
          disabled={isValidating}
        >
          <RefreshCw className={`h-3 w-3 ${isValidating ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      {validationResult?.data_validation && (
        <div className="text-xs text-gray-600">
          <div className="grid grid-cols-2 gap-1">
            <span className={validationResult.data_validation.company_name_match ? 'text-green-600' : 'text-red-600'}>
              ✓ Nombre empresa: {validationResult.data_validation.company_name_match ? 'OK' : 'Error'}
            </span>
            <span className={validationResult.data_validation.contact_person_match ? 'text-green-600' : 'text-red-600'}>
              ✓ Contacto: {validationResult.data_validation.contact_person_match ? 'OK' : 'Error'}
            </span>
            <span className={validationResult.data_validation.business_type_match ? 'text-green-600' : 'text-red-600'}>
              ✓ Tipo negocio: {validationResult.data_validation.business_type_match ? 'OK' : 'Error'}
            </span>
            <span className={validationResult.data_validation.country_match ? 'text-green-600' : 'text-red-600'}>
              ✓ País: {validationResult.data_validation.country_match ? 'OK' : 'Error'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCreationStatus;
