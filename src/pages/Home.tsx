

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

  const handleVideoStarted = useCallback(() => {
    if (campaign) updateEvent('video_started');
  }, [campaign, updateEvent]);

  const handleVideoCompleted = useCallback(() => {
    if (campaign) updateEvent('video_completed');
  }, [campaign, updateEvent]);

  const handlePopupShown = useCallback(() => {
    if (campaign) updateEvent('popup_shown');
  }, [campaign, updateEvent]);

  const handleRegisterClicked = useCallback((companyName?: string) => {
    if (campaign) {
      updateEvent('register_clicked');
      if (companyName) updateContact(companyName);
    }
  }, [campaign, updateEvent, updateContact]);

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
