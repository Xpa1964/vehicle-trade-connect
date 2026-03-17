

import React, { useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import HeroSection from '@/components/home/HeroSection';
import AudioPresentationSection from '@/components/home/AudioPresentationSection';
import ServicesSection from '@/components/home/ServicesSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import WelcomeBanner from '@/components/home/WelcomeBanner';
import { useCampaignTracking } from '@/hooks/useCampaignTracking';
import CampaignDebugPanel from '@/components/debug/CampaignDebugPanel';

const Home: React.FC = () => {
  const [searchParams] = useSearchParams();
  const videoLang = searchParams.get('video');
  const autoplay = searchParams.get('autoplay') === '1';
  const campaign = searchParams.get('campaign');
  const dealer = searchParams.get('dealer');
  const contact = searchParams.get('contact');
  const showDebug = searchParams.get('debug') === 'true';

  const { logVisit, updateEvent, updateContact, sessionId } = useCampaignTracking();

  const effectiveCampaign = campaign || 'organic_web';

  useEffect(() => {
    logVisit({
      video_language: videoLang || 'es',
      campaign: effectiveCampaign,
      dealer: dealer || undefined,
      contact: contact || undefined,
    });
  }, [effectiveCampaign, videoLang, dealer, logVisit]);

  const handleVideoStarted = useCallback(() => {
    updateEvent('video_started');
  }, [updateEvent]);

  const handleVideoCompleted = useCallback(() => {
    updateEvent('video_completed');
  }, [updateEvent]);

  const handlePopupShown = useCallback(() => {
    updateEvent('popup_shown');
  }, [updateEvent]);

  const handleRegisterClicked = useCallback((companyName?: string, interests?: string[]) => {
    updateEvent('register_clicked');
    if (companyName || (interests && interests.length > 0)) {
      updateContact(companyName || '', interests);
    }
  }, [updateEvent, updateContact]);

  return (
    <div className="min-h-screen">
      {showDebug && <CampaignDebugPanel />}
      <main id="main-content">
        <div className="relative">
          <HeroSection />
          <WelcomeBanner />
        </div>
        
        <div className="px-4 md:px-0">
          <AudioPresentationSection
            initialVideoLanguage={videoLang || undefined}
            autoplay={autoplay}
            onVideoStarted={handleVideoStarted}
            onVideoCompleted={handleVideoCompleted}
            onPopupShown={handlePopupShown}
            onRegisterClicked={handleRegisterClicked}
          />
        </div>
        <ServicesSection />
        <FeaturesSection />
      </main>
    </div>
  );
};

export default Home;
