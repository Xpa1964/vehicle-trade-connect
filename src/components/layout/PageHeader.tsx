
import { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { LOGO_IMAGES } from '@/constants/imageAssets';

interface PageHeaderProps {
  title: ReactNode;
  description?: string;
  subtitle?: string;
  showBackButton?: boolean;
  backTo?: string;  // Can specify a direct path
  backText?: string; // Custom back button text
  backToHome?: boolean;
  icon?: ReactNode;
}

const PageHeader = ({ 
  title, 
  description, 
  subtitle, 
  showBackButton = true, 
  backTo, 
  backText, 
  backToHome = false, 
  icon 
}: PageHeaderProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else if (backToHome) {
      navigate('/');
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex items-center justify-between mb-8 mt-4">
      <div className="w-full">
        {showBackButton && (
          <Button 
            variant="outline" 
            size="sm" 
            className="mb-4" 
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {backText || (backToHome 
              ? t('common.backToHome', { fallback: 'Volver al inicio' }) 
              : backTo === '/dashboard'
                ? t('common.backToDashboard', { fallback: 'Volver al Panel' })
                : t('common.back', { fallback: 'Volver' })
            )}
          </Button>
        )}
        <div className="flex items-center gap-4">
          {icon ? (
            <div className="text-auto-blue">{icon}</div>
          ) : (
            <img 
              src={LOGO_IMAGES.primary}
              alt="KONECT VO Logo" 
              className="h-12 w-auto"
              loading="eager"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-auto-blue">{title}</h1>
            {description && <p className="text-muted-foreground mt-1">{description}</p>}
            {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
