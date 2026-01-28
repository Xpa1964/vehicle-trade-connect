import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReportRequestForm } from '@/components/vehicle-reports/ReportRequestForm';
import { useLanguage } from '@/contexts/LanguageContext';
import reportDeliveryImage from '@/assets/report-delivery-image.png';

const RequestReport = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSuccess = () => {
    navigate('/vehicle-reports');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl shadow-lg mb-6 mx-4 mt-4" style={{ minHeight: '320px' }}>
        <div className="absolute inset-0 z-0">
          <img 
            src={reportDeliveryImage}
            alt="Solicitar Informe"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
        </div>
        
        <div className="relative z-10 p-8 flex flex-col justify-between" style={{ minHeight: '320px' }}>
          <div className="mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/dashboard')}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('navigation.backToControlPanel')}
            </Button>
          </div>
          
          <div className="flex-1 flex flex-col justify-end gap-3">
            <div className="bg-black/30 backdrop-blur-md rounded-lg p-4 border border-white/20">
              <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                {t('reports.form.title')}
              </h1>
            </div>
            <div className="bg-black/30 backdrop-blur-md rounded-lg p-4 border border-white/20">
              <p className="text-lg text-white font-medium drop-shadow-md">
                {t('reports.form.description')}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Formulario */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ReportRequestForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default RequestReport;
