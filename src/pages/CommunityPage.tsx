
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, MessageCircle, Award, Globe } from 'lucide-react';

const CommunityPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t('nav.backToHome', { fallback: 'Volver al Inicio' })}
            </Link>
          </Button>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6 sm:p-8">
          <h1 className="text-3xl font-bold mb-8 text-center">
            {t('community.title')}
          </h1>
          
          <div className="text-center mb-12">
            <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
              {t('community.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('community.exclusiveNetwork.title')}</h3>
              <p className="text-gray-600">{t('community.exclusiveNetwork.description')}</p>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <MessageCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('community.directCommunication.title')}</h3>
              <p className="text-gray-600">{t('community.directCommunication.description')}</p>
            </div>
            
            <div className="text-center p-6 bg-amber-50 rounded-lg">
              <Award className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('community.verifiedProfessionals.title')}</h3>
              <p className="text-gray-600">{t('community.verifiedProfessionals.description')}</p>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <Globe className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('community.globalReach.title')}</h3>
              <p className="text-gray-600">{t('community.globalReach.description')}</p>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">{t('community.howItWorks')}</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-3">{t('community.step1.title')}</h3>
                  <p className="text-gray-700 mb-4">
                    {t('community.step1.description')}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-3">{t('community.step2.title')}</h3>
                  <p className="text-gray-700 mb-4">
                    {t('community.step2.description')}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-3">{t('community.step3.title')}</h3>
                  <p className="text-gray-700 mb-4">
                    {t('community.step3.description')}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-3">{t('community.step4.title')}</h3>
                  <p className="text-gray-700 mb-4">
                    {t('community.step4.description')}
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">{t('community.readyToJoin')}</h2>
              <p className="text-gray-700 mb-6">
                {t('community.readyToJoinDescription')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <Link to="/register">
                    {t('community.joinCommunity')}
                  </Link>
                </Button>
                <Button variant="outline" asChild size="lg">
                  <Link to="/users">
                    {t('community.exploreMembers')}
                  </Link>
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
