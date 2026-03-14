
import React, { useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import HeroSection from '@/components/home/HeroSection';
import AudioPresentationSection from '@/components/home/AudioPresentationSection';
import ServicesSection from '@/components/home/ServicesSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import WelcomeBanner from '@/components/home/WelcomeBanner';
import { useCampaignTracking } from '@/hooks/useCampaignTracking';

const Home: React.FC = () => {
  const [searchParams] = useSearchParams();
  const videoLang = searchParams.get('video');
  const autoplay = searchParams.get('autoplay') === '1';
  const campaign = searchParams.get('campaign');
  const dealer = searchParams.get('dealer');
  const contact = searchParams.get('contact');

  const { logVisit, updateEvent, updateContact, sessionId } = useCampaignTracking();

  useEffect(() => {
    if (campaign) {
      logVisit({
        video_language: videoLang || 'es',
        campaign,
        dealer: dealer || undefined,
        contact: contact || undefined,
      });
    }
  }, [campaign, videoLang, dealer, logVisit]);

  return (
    <div className="min-h-screen">
      <main id="main-content">
        <div className="relative">
          <HeroSection />
          <WelcomeBanner />
        </div>
        
        <div className="px-4 md:px-0">
          <AudioPresentationSection
            initialVideoLanguage={videoLang || undefined}
            autoplay={autoplay}
            onVideoStarted={campaign ? () => updateEvent('video_started') : undefined}
            onVideoCompleted={campaign ? () => updateEvent('video_completed') : undefined}
            onPopupShown={campaign ? () => updateEvent('popup_shown') : undefined}
            onRegisterClicked={campaign ? (companyName?: string) => {
              updateEvent('register_clicked');
              if (companyName) updateContact(companyName);
            } : undefined}
          />
        </div>
        <ServicesSection />
        <FeaturesSection />
      </main>
    </div>
  );
};

export default Home;
