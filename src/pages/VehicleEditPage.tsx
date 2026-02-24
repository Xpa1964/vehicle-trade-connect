
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import VehicleUploadForm from '@/components/vehicles/VehicleUploadForm';
import { Alert, AlertDescription } from '@/components/ui/alert';

const VehicleEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isApiSource, setIsApiSource] = useState(false);
  const [checking, setChecking] = useState(!!id);

  useEffect(() => {
    if (id) {
      supabase
        .from('vehicles')
        .select('source')
        .eq('id', id)
        .single()
        .then(({ data }) => {
          setIsApiSource(data?.source === 'api');
          setChecking(false);
        });
    }
  }, [id]);

  if (!user) {
    return <div>{t('auth.loginRequired', { fallback: 'Login required' })}</div>;
  }

  if (checking) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          {t('common.back')}
        </Button>
      </div>

      {isApiSource ? (
        <Alert>
          <Lock className="h-4 w-4" />
          <AlertDescription>
            {t('vehicles.apiSourceEditBlocked', { fallback: 'This vehicle is managed via API. Edit through your integration.' })}
          </AlertDescription>
        </Alert>
      ) : (
        <VehicleUploadForm vehicleId={id} />
      )}
    </div>
  );
};

export default VehicleEditPage;
