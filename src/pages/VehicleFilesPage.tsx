
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, FileText, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useVehicleDocuments } from '@/hooks/useVehicleDocuments';
import { formatFileSize } from '@/utils/fileUtils';

const VehicleFilesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  
  const { data: vehicle, isLoading: isLoadingVehicle } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  const { documents } = useVehicleDocuments(id || '');

  if (isLoadingVehicle) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="animate-pulse text-xl">{t('common.loading')}</div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center text-destructive">
          <h2 className="text-2xl font-bold mb-4">{t('common.error')}</h2>
          <p>{t('vehicles.notFound')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link to={`/vehicle-preview/${id}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> {t('common.back')}
          </Button>
        </Link>
        
        <Link to="/vehicles">
          <Button variant="outline" size="sm">
            {t('common.backToHome')}
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          {vehicle.brand} {vehicle.model} - {t('vehicles.files')}
        </h1>
        <p className="text-lg text-muted-foreground mb-6">{t('vehicles.filesFullDescription')}</p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">{t('vehicles.availableFiles')}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {documents && documents.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between border border-border p-4 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center">
                    <FileText className="w-8 h-8 mr-4 text-primary" />
                    <div>
                      <h4 className="font-medium text-foreground">{doc.file_name}</h4>
                      <p className="text-sm text-muted-foreground">{formatFileSize(doc.file_size || 0)}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="ml-4" asChild>
                    <a href={doc.file_url || doc.document_url || '#'} download target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4 mr-2" /> {t('common.download')}
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {t('vehicles.noFilesAvailable')}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleFilesPage;
