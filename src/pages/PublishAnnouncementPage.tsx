
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Megaphone, ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnnouncementForm from '@/components/bulletin/AnnouncementForm';
import { Announcement } from '@/types/announcement';
import { Button } from '@/components/ui/button';
import announcementImage from '@/assets/announcement-image.png';

const PublishAnnouncementPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleAnnouncementAdded = (announcement: Announcement) => {
    navigate('/bulletin');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="outline" 
            onClick={handleGoBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('common.back')}
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleGoToDashboard}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            {t('common.dashboard')}
          </Button>
        </div>

        {/* Header with Image */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <img 
                src={announcementImage}
                alt="Publish Announcement"
                className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-lg"
              />
            </div>
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-2">
                <Megaphone className="h-8 w-8 mr-3 text-primary" />
                <h1 className="text-3xl font-light text-gray-800">
                  {t('bulletin.form.submit')}
                </h1>
              </div>
              <p className="text-lg text-gray-600 font-light">
                {t('bulletin.publishAnnouncement')}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <AnnouncementForm onAnnouncementAdded={handleAnnouncementAdded} />
        </div>
      </div>
    </div>
  );
};

export default PublishAnnouncementPage;
