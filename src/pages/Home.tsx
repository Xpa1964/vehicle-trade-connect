
import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import AudioPresentationSection from '@/components/home/AudioPresentationSection';
import ServicesSection from '@/components/home/ServicesSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import WelcomeBanner from '@/components/home/WelcomeBanner';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      <main id="main-content">
        {/* Hero Section with WelcomeBanner positioned over it */}
        <div className="relative">
          <HeroSection />
          <WelcomeBanner />
        </div>
        
        {/* Enhanced mobile spacing for audio section */}
        <div className="px-4 md:px-0">
          <AudioPresentationSection />
        </div>
        <ServicesSection />
        <FeaturesSection />
      </main>
    </div>
  );
};

export default Home;
