
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, FileText, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockGetVehicleById } from '@/data/mockVehicles';
import { useVehicleDocuments } from '@/hooks/useVehicleDocuments';
import { formatFileSize } from '@/utils/fileUtils';

const VehicleFilesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  
  const { data: vehicle, isLoading: isLoadingVehicle } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => mockGetVehicleById(id || '')
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
        <div className="text-center text-red-500">
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
        <img 
          src="/lovable-uploads/865135a7-9f1d-44e9-9386-623ae7f90529.png" 
          alt="Kontact Logo" 
          className="w-32 mb-4"
        />
        <h1 className="text-2xl font-bold">
          {vehicle.brand} {vehicle.model} - {t('vehicles.files')}
        </h1>
        <p className="text-lg text-gray-700 mb-6">{t('vehicles.filesFullDescription')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('vehicles.availableFiles')}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {documents && documents.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between border p-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <FileText className="w-8 h-8 mr-4 text-auto-blue" />
                    <div>
                      <h4 className="font-medium">{doc.file_name}</h4>
                      <p className="text-sm text-gray-500">{formatFileSize(doc.file_size)}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="ml-4" asChild>
                    <a href={doc.file_url} download target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4 mr-2" /> {t('common.download')}
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {t('vehicles.noFilesAvailable')}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleFilesPage;
